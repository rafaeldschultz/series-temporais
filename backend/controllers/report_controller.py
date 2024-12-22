import base64
import warnings
from pathlib import Path
from typing import Optional

import altair as alt
import pandas as pd

from .temporal_controller import TemporalController

chart_template = """
<section class="chart">
    <div id="{chart_id}"></div>
    <p>Figura {fig_num}: {text}</p>
</section>
"""

script_template = """
const chartSpec_CHART_ID = JSON_CODE;

vegaEmbed('#CHART_ID', chartSpec_CHART_ID).then(result => {
    console.log('Gráfico renderizado com sucesso!');
}).catch(console.error);
"""


def plot_decomposition(data: dict, width: int = 800):
    SDD = pd.DataFrame(data)

    trend = (
        alt.Chart(SDD)
        .mark_line()
        .encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Trend_values:Q", title="Tendência"),
        )
        .properties(width=width)
    )

    seasonal = (
        alt.Chart(SDD)
        .mark_line()
        .encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Seasonal_values:Q", title="Sasonalidade"),
        )
        .properties(width=width)
    )

    resid = (
        alt.Chart(SDD)
        .mark_line()
        .encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Resid_values:Q", title="Resíduos"),
        )
        .properties(width=width)
    )

    chart = trend & seasonal & resid

    return chart


def plot_correlogram(CORR: dict, title="Titulo do Correlograma"):
    CORR = pd.DataFrame(CORR).reset_index(names="lag")

    del CORR["confidenceIntervals"]

    autocorr = (
        alt.Chart(CORR)
        .mark_point(filled=True)
        .encode(
            x=alt.X("lag:Q", title="Lag"),
            y=alt.Y(
                "autocorrelations:Q",
                title="Autocorrelação",
                scale=alt.Scale(domain=[-1, 1]),
            ),
            color=alt.datum("Autocorrelações"),
        )
    )

    lines = (
        alt.Chart(CORR)
        .mark_rule()
        .encode(x=alt.X("lag:Q"), y=alt.Y("autocorrelations:Q"))
    )

    lowerRange = (
        alt.Chart(CORR)
        .mark_area(opacity=0.3)
        .encode(
            x=alt.X("lag:Q"),
            y=alt.Y("lowerY"),
            color=alt.datum("Intervalo de Confiança"),
        )
    )

    upperRange = (
        alt.Chart(CORR)
        .mark_area(opacity=0.3)
        .encode(
            x=alt.X("lag:Q"),
            y=alt.Y("upperY"),
            color=alt.datum("Intervalo de Confiança"),
        )
    )

    chart = (autocorr + lines + lowerRange + upperRange).properties(
        title=title, width=800
    )

    return chart


class ReportController:
    def __init__(self):
        self.temporal_controller = TemporalController()

        self.base_path = Path(__file__).parent.parent.resolve()
        self.template_path = self.base_path.joinpath("report_template.html")

    def general_report(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        data = self.temporal_controller.get_overview_data(uf, syndrome, year, evolution)

        time_series = self.render_time_series(data)
        occurrences = self.render_occurrences(data)

        correlation = plot_correlogram(
            CORR=self.temporal_controller.correlogram(uf, syndrome, year, evolution),
            title="Gráfico de Autocorrelações da Série Temporal",
        )
        partial_correlation = plot_correlogram(
            CORR=self.temporal_controller.partial_correlogram(
                uf, syndrome, year, evolution
            ),
            title="Gráfico de Autocorrelações Parciais da Série Temporal",
        )

        lag_plots = self.render_lag_plots(uf, syndrome, year, evolution)
        differentiation = self.render_diff(uf, syndrome, year, evolution)

        stl_decomposition_data = self.temporal_controller.get_stl_decomposition_data(
            uf, syndrome, year, evolution
        )
        stl_decomposition = plot_decomposition(data=stl_decomposition_data["stlData"])
        stl_correlogram = plot_correlogram(
            CORR=stl_decomposition_data["correlogram"],
            title="Gráfico de Autocorrelações dos Resíduos da Decomposição STL",
        )

        seasonal_decomposition_data = (
            self.temporal_controller.get_seasonal_decomposition_data(
                uf, syndrome, year, evolution
            )
        )
        seasonal_decomposition = plot_decomposition(
            data=seasonal_decomposition_data["seasonalData"]
        )
        seasonal_correlogram = plot_correlogram(
            CORR=seasonal_decomposition_data["correlogram"],
            title="Gráfico de Autocorrelações dos Resíduos da Decomposição Sasonal",
        )

        moving_mean = self.render_moving_mean(uf, syndrome, year, evolution)
        ema = self.render_EMA(uf, syndrome, year, evolution)
        mean_chart = (moving_mean + ema).properties(title="Gráfico das Médias Móveis")

        with warnings.catch_warnings():
            # Ignorar todos os avisos do segmento de código
            warnings.simplefilter("ignore")

            # Ajustar um modelo ARIMA com os dados
            predict_data = self.temporal_controller.get_predict_data(
                uf, syndrome, year, evolution
            )

        arima_chart = self.render_arima(predict_data)
        arima_corr = plot_correlogram(
            CORR=predict_data["predictCorrelogram"],
            title="Correlograma dos Resíduos do Modelo",
        )

        arima_partial_corr = plot_correlogram(
            CORR=predict_data["predictCorrelogram"],
            title="Correlograma Parcial dos Resíduos do Modelo",
        )

        arima_resid = self.render_arima_resid(predict_data)

        objects = [
            {"type": "section", "title": "1. Análises Gerais do Dataset"},
            {
                "type": "chart",
                "id": "geoplot",
                "fig_num": "1.1",
                "text": "Apresenta dados organizados geograficamente, com totais absolutos "
                "e gráficos normalizados por região e estado. A seleção de uma região "
                "ajusta automaticamente os dados exibidos nos gráficos estaduais, "
                "destacando proporções e evoluções entre localidades.",
                "json": self.base_path.joinpath("datasets", "geoplot.json").read_text(),
                # "json": open(os.path.join("/backend/datasets", "geoplot.json")).read(),
            },
            {
                "type": "chart",
                "id": "mensal",
                "fig_num": "1.2",
                "text": "Exibe a série temporal com granularidade mensal, permitindo "
                "identificar tendências sazonais e comparar variações entre "
                "diferentes meses. A análise destaca padrões de longo prazo para "
                "diagnósticos como COVID-19 e Influenza.",
                "json": self.base_path.joinpath("datasets", "mensal.json").read_text(),
                # "json": open(os.path.join("datasets", "mensal.json")).read(),
            },
            {
                "type": "chart",
                "id": "semanal",
                "fig_num": "1.3",
                "text": "Mostra a série temporal com granularidade semanal, evidenciando "
                "padrões como subnotificações aos finais de semana e aumentos nas "
                "segundas-feiras. Essa visualização é ideal para capturar particularidades "
                "em ciclos semanais, auxiliando na análise de notificações periódicas.",
                "json": self.base_path.joinpath("datasets", "semanal.json").read_text(),
                # "json": open(os.path.join("datasets", "semanal.json")).read(),
            },
            {
                "type": "chart",
                "id": "occurrences",
                "fig_num": "1.4",
                "text": "A figura ilustra a distribuição de ocorrências categorizadas por "
                "características específicas, como sexo, faixa etária ou outros "
                "atributos relevantes. A disposição visual facilita a comparação "
                "direta entre diferentes grupos e categorias, promovendo insights "
                "sobre padrões demográficos e comportamentais.",
                "json": occurrences.to_dict(),
            },
            {"type": "message", "title": "", "text": self.occurrences_msg()},
            {"type": "section", "title": "2. Análise Temporal"},
            {"type": "subsection", "title": "2.1 Série Temporal"},
            {"type": "message", "title": "", "text": self.time_series_msg(year)},
            {
                "type": "chart",
                "id": "time_series",
                "fig_num": "2.1",
                "text": "Apresenta a série temporal em sua forma bruta, permitindo a análise "
                "inicial de tendências gerais e possíveis padrões. Essa visualização "
                "é fundamental para o entendimento da estrutura básica dos dados.",
                "json": time_series.to_dict(),
            },
            {
                "type": "subsection",
                "title": "2.2 Diferenciação de Primeira e Segunda Ordem da Série",
            },
            {
                "type": "chart",
                "id": "differentiation",
                "fig_num": "2.2",
                "text": "Exibe a diferenciação de primeira e segunda ordem da série, "
                "destacando transformações aplicadas para torná-la estacionária. "
                "É útil para validar a preparação dos dados para modelos estatísticos.",
                "json": differentiation.to_dict(),
            },
            {
                "type": "subsection",
                "title": "2.3 Autocorrelações e Autocorrelações Parciais da Série",
            },
            {"type": "message", "title": "", "text": self.correlogram_msg()},
            {
                "type": "chart",
                "id": "correlation",
                "fig_num": "2.3",
                "text": "Mostra a função de autocorrelação (ACF) e autocorrelação parcial (PACF) da "
                "série temporal, úteis para identificar dependências entre os dados e determinar "
                "parâmetros adequados para modelos ARIMA.",
                "json": correlation.to_dict(),
            },
            {"type": "message", "title": "", "text": self.partial_correlogram_msg()},
            {
                "type": "chart",
                "id": "partial_correlation",
                "fig_num": "2.4",
                "text": "Demonstra as autocorrelações sazonais, permitindo a identificação de ciclos "
                "específicos no comportamento dos dados ao longo do tempo.",
                "json": partial_correlation.to_dict(),
            },
            {"type": "subsection", "title": "2.4 Lag Plots"},
            {"type": "message", "title": "", "text": self.lag_plots_msg()},
            {
                "type": "chart",
                "id": "lag_plots",
                "fig_num": "2.5",
                "text": "Exibe os lag plots, ajudando a visualizar padrões de dependência linear entre "
                "os valores da série em diferentes atrasos, fundamental para validar a "
                "estacionariedade e a estrutura do modelo.",
                "json": lag_plots.to_dict(),
            },
            {
                "type": "subsection",
                "title": "2.5 Médias Móveis e Médias Móveis Exponênciais",
            },
            {"type": "message", "title": "", "text": self.moving_mean_and_ema_msg()},
            {
                "type": "chart",
                "id": "mean_chart",
                "fig_num": "2.6",
                "text": "Mostra as médias móveis simples e exponenciais, úteis para suavizar a série "
                "temporal e destacar tendências subjacentes ao longo do tempo.",
                "json": mean_chart.to_dict(),
            },
            {"type": "subsection", "title": "2.6 Decomposição STL"},
            {"type": "message", "title": "", "text": self.stl_decomposition_msg()},
            {
                "type": "chart",
                "id": "stl_decomposition",
                "fig_num": "2.7",
                "text": "Ilustra a decomposição STL da série temporal, separando os componentes de "
                "tendência, sazonalidade e ruído. É essencial para entender a composição dos "
                "dados.",
                "json": stl_decomposition.to_dict(),
            },
            {
                "type": "message",
                "title": "Teste de Estacionariedade na Série Temporal por Decomposição STL",
                "text": self.stationarity_test_msg(
                    stl_decomposition_data, decomposition_type="STL"
                ),
            },
            {
                "type": "chart",
                "id": "stl_correlogram",
                "fig_num": "2.8",
                "text": "Demonstra uma decomposição sazonal mais detalhada, ajudando a identificar "
                "padrões repetitivos em ciclos específicos e como eles afetam a série temporal.",
                "json": stl_correlogram.to_dict(),
            },
            {"type": "subsection", "title": "2.7 Decomposição Sasonal"},
            {"type": "message", "title": "", "text": self.seasonal_decomposition_msg()},
            {
                "type": "chart",
                "id": "seasonal_decomposition",
                "fig_num": "2.9",
                "text": "Apresenta os resíduos da decomposição sazonal, úteis para verificar a presença "
                "de tendências ou padrões não modelados pela sazonalidade.",
                "json": seasonal_decomposition.to_dict(),
            },
            {
                "type": "message",
                "title": "Teste de Estacionariedade na Série Temporal por Decomposição Sasonal",
                "text": self.stationarity_test_msg(
                    seasonal_decomposition_data, decomposition_type="Sasonal"
                ),
            },
            {
                "type": "chart",
                "id": "seasonal_correlogram",
                "fig_num": "2.10",
                "text": "Este gráfico apresenta as autocorrelações dos resíduos da decomposição sazonal "
                "ao longo de diferentes atrasos (lags). Os pontos azuis representam os valores "
                "das autocorrelações, enquanto a faixa laranja indica o intervalo de confiança. "
                "Valores fora desse intervalo sugerem a presença de padrões ou estrutura nos "
                "resíduos, indicando que o modelo pode não ter capturado completamente as "
                "dependências nos dados. Esse gráfico é útil para validar a qualidade do ajuste "
                "sazonal e identificar possíveis ajustes adicionais necessários no modelo.",
                "json": seasonal_correlogram.to_dict(),
            },
            {"type": "section", "title": "3. Predição"},
            {"type": "subsection", "title": "3.1 Modelo Ajustado"},
            {
                "type": "message",
                "title": "Parâmetros Ajustados do Modelo ARIMA à Série Temporal",
                "text": self.arima_fit_msg(predict_data),
            },
            {
                "type": "chart",
                "id": "arima_chart",
                "fig_num": "3.1",
                "text": "Ilustra os resultados de predições com base no modelo ajustado, "
                "destacando a precisão e confiabilidade das previsões geradas.",
                "json": arima_chart.to_dict(),
            },
            {"type": "subsection", "title": "3.2 Resíduos - Testes Estatísticos"},
            {
                "type": "chart",
                "id": "arima_resid",
                "fig_num": "3.2",
                "text": "Ilustra os resultados de predições com base no modelo ajustado, "
                "destacando a precisão e confiabilidade das previsões geradas.",
                "json": arima_resid.to_dict(),
            },
            {
                "type": "message",
                "title": "Teste de Normalidade dos Resíduos do Modelo",
                "text": self.normality_test_msg(predict_data),
            },
            {
                "type": "message",
                "title": "Teste de Independência dos Resíduos do Modelo",
                "text": self.independence_test_msg(predict_data),
            },
            {"type": "subsection", "title": "3.3 Resíduos - Correlogramas"},
            {"type": "message", "title": "", "text": self.resid_correlogram_msg()},
            {
                "type": "chart",
                "id": "arima_corr",
                "fig_num": "3.3",
                "text": "Apresenta os resíduos do modelo ajustado, permitindo analisar sua "
                "normalidade e independência, fundamentais para validar o modelo.",
                "json": arima_corr.to_dict(),
            },
            {
                "type": "chart",
                "id": "arima_partial_corr",
                "fig_num": "3.4",
                "text": "Demonstra os intervalos de confiança das previsões, úteis para avaliar "
                "o grau de incerteza associado às estimativas geradas pelo modelo.",
                "json": arima_partial_corr.to_dict(),
            },
        ]

        report = self.compile_report(
            metadata={
                "totalCases": f"{data['general']['totalCases']:,}",
                "totalDeaths": f"{data['general']['totalDeaths']:,}",
                "totalRecovered": f"{data['general']['totalRecovered']:,}",
                "uf": uf,
                "syndrome": syndrome,
                "year": year,
                "evolution": evolution,
            },
            objects=objects,
        )

        return base64.b64encode(report.encode("utf-8")).decode("utf-8")

    def compile_report(self, metadata: dict, objects: list) -> str:
        """
        Função para compilar os dados do relatório para um arquivo HTML

        Parâmetros
        ----------
        metadata: dict
            Dicionário com os metadados para adicionar ao banner do relatório.
                Formato: {"totalCases": 123, "totalDeaths": 123, "totalRecovered": 123}

        objects: list
            Lista com os objetos para adicionar ao relatório.

        Retorno
        -------
        str
            String com o conteúdo HTML do relatório compilado.
        """

        chart_divs = []
        chart_scripts = []

        for obj in objects:
            if obj["type"] == "section":
                style = "text-align: left;padding: 0px 0px 0px 50px"
                chart_divs.append(f"<h1 style='{style}'>{obj['title']}</h1>")

            if obj["type"] == "subsection":
                style = "text-align: left;padding: 0px 0px 0px 50px"
                chart_divs.append(f"<h2 style='{style}'>{obj['title']}</h2>")

            if obj["type"] == "message":
                chart_divs.append(f"<h2>{obj['title']}</h2>")
                chart_divs.append(f"<h3 class='message'>{obj['text']}</h3>")

            elif obj["type"] == "chart":
                chart_div = chart_template.format(
                    chart_id=obj["id"], fig_num=obj["fig_num"], text=obj["text"]
                )

                chart_script = script_template.replace("CHART_ID", obj["id"])
                chart_script = chart_script.replace("JSON_CODE", str(obj["json"]))

                chart_divs.append(chart_div)
                chart_scripts.append(chart_script)

        chart_divs = "".join(chart_divs)
        chart_scripts = "<script>{code}</script>".format(code="".join(chart_scripts))
        chart_scripts = chart_scripts.replace("True", "true")

        template = open(self.template_path).read()

        report = template.replace("{CHARTS}", chart_divs)
        report = report.replace("{SCRIPT}", chart_scripts)

        report = report.replace("{TOTAL_CASOS}", metadata["totalCases"])
        report = report.replace("{TOTAL_OBITOS}", metadata["totalDeaths"])
        report = report.replace("{TOTAL_RECUPERADOS}", metadata["totalRecovered"])

        report = report.replace(
            "{ESTADO}", metadata["uf"] if metadata["uf"] else "Todos"
        )
        report = report.replace(
            "{SINDROME}", metadata["syndrome"] if metadata["syndrome"] else "Todas"
        )
        report = report.replace(
            "{ANO}", metadata["year"] if metadata["year"] else "2021 até 2024"
        )
        report = report.replace(
            "{EVOLUCAO}", metadata["evolution"] if metadata["evolution"] else "Todas"
        )

        return report

    @staticmethod
    def render_time_series(data: dict) -> alt.Chart:
        ts = pd.DataFrame(data["temporalSeries"]["serieTemporal"])

        ts_chart = (
            alt.Chart(ts)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data de Notificação"),
                y=alt.Y("count:Q", title="Número de Casos"),
            )
            .properties(title="Série Temporal", width=1000, height=400)
        )

        return ts_chart

    @staticmethod
    def render_occurrences(data: dict) -> alt.Chart:
        occurrences = data["occurences"]

        occ_sex = pd.DataFrame(occurrences["sex"])
        occ_sex_chart = (
            alt.Chart(occ_sex)
            .mark_bar()
            .encode(
                x=alt.X("sex:N", title="Gênero", axis=alt.Axis(labelAngle=0)),
                y=alt.Y("count:Q", title="Ocorrências"),
                color=alt.Color("sex:N", title="Gênero"),
            )
            .properties(title="Ocorrências por Sexo", width=200, height=300)
        )

        occ_race = pd.DataFrame(occurrences["race"])
        occ_race_chart = (
            alt.Chart(occ_race)
            .mark_bar()
            .encode(
                x=alt.X("race:N", title="Raça", axis=alt.Axis(labelAngle=0)),
                y=alt.Y("count:Q", title="Ocorrências"),
                color=alt.Color("race:N", title="Raça"),
            )
            .properties(title="Ocorrências por Raça", width=200, height=300)
        )

        occ_day = pd.DataFrame(occurrences["day"])
        occ_day_chart = (
            alt.Chart(occ_day)
            .mark_bar()
            .encode(
                x=alt.X(
                    "day:N",
                    title="Dia da Semana",
                    axis=alt.Axis(labelAngle=0),
                    sort=[
                        "Segunda",
                        "Terça",
                        "Quarta",
                        "Quinta",
                        "Sexta",
                        "Sábado",
                        "Domingo",
                    ],
                ),
                y=alt.Y("count:Q", title="Ocorrências"),
                color=alt.Color("day:N", title="Dia da Semana", sort="x"),
            )
            .properties(title="Ocorrências por Dia da Semana", width=200, height=300)
        )

        occs_chart = (occ_sex_chart | occ_race_chart | occ_day_chart).resolve_scale(
            color="independent"  # Escalas de cor independentes
        )

        return occs_chart

    def render_correlation(self, *args):
        CORR = self.temporal_controller.correlogram(*args)

        CORR = pd.DataFrame(CORR).reset_index(names="lag")

        del CORR["confidenceIntervals"]

        autocorr = (
            alt.Chart(CORR)
            .mark_point(filled=True)
            .encode(
                x=alt.X("lag:Q", title="Lag"),
                y=alt.Y(
                    "autocorrelations:Q",
                    title="Autocorrelação",
                    scale=alt.Scale(domain=[-1, 1]),
                ),
                color=alt.datum("Autocorrelações"),
            )
        )

        lines = (
            alt.Chart(CORR)
            .mark_rule()
            .encode(x=alt.X("lag:Q"), y=alt.Y("autocorrelations:Q"))
        )

        lowerRange = (
            alt.Chart(CORR)
            .mark_area(opacity=0.3)
            .encode(
                x=alt.X("lag:Q"),
                y=alt.Y("lowerY"),
                color=alt.datum("Intervalo de Confiança"),
            )
        )

        upperRange = (
            alt.Chart(CORR)
            .mark_area(opacity=0.3)
            .encode(
                x=alt.X("lag:Q"),
                y=alt.Y("upperY"),
                color=alt.datum("Intervalo de Confiança"),
            )
        )

        chart = (autocorr + lines + lowerRange + upperRange).properties(
            title="Autocorrelações com 25 Lags", width=800
        )

        return chart

    def render_lag_plots(self, *args):
        lags = self.temporal_controller.get_serie_lag_plot(*args)

        xlabel = "Número de Casos"
        ylabel = "Número de Casos com Lag"

        d3 = pd.DataFrame(lags["3"])
        d6 = pd.DataFrame(lags["6"])
        d9 = pd.DataFrame(lags["9"])
        d12 = pd.DataFrame(lags["12"])

        d3 = (
            alt.Chart(d3)
            .mark_point()
            .encode(
                x=alt.X("yActual:Q", title=xlabel), y=alt.Y("yLagged:Q", title=ylabel)
            )
            .properties(title="Lags Temporais 3D")
        )

        d6 = (
            alt.Chart(d6)
            .mark_point()
            .encode(
                x=alt.X("yActual:Q", title=xlabel), y=alt.Y("yLagged:Q", title=ylabel)
            )
            .properties(title="Lags Temporais 6D")
        )

        d9 = (
            alt.Chart(d9)
            .mark_point()
            .encode(
                x=alt.X("yActual:Q", title=xlabel), y=alt.Y("yLagged:Q", title=ylabel)
            )
            .properties(title="Lags Temporais 9D")
        )

        d12 = (
            alt.Chart(d12)
            .mark_point()
            .encode(
                x=alt.X("yActual:Q", title=xlabel), y=alt.Y("yLagged:Q", title=ylabel)
            )
            .properties(title="Lags Temporais 12D")
        )

        chart = (d3 | d6) & (d9 | d12)

        return chart

    def render_stl_decomposition(self, *args):
        SSD = pd.DataFrame()
        width = 800

        trend = (
            alt.Chart(SSD)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("Trend_values:Q", title="Tendência"),
            )
            .properties(width=width)
        )

        seasonal = (
            alt.Chart(SSD)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("Seasonal_values:Q", title="Sasonalidade"),
            )
            .properties(width=width)
        )

        resid = (
            alt.Chart(SSD)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("Resid_values:Q", title="Resíduos"),
            )
            .properties(width=width)
        )

        chart = trend & seasonal & resid

        return chart

    def render_EMA(self, *args):
        granularity = 30
        SERA = pd.DataFrame(
            data=self.temporal_controller.serie_exponential_rooling_average(
                granularity=granularity
            )
        )

        chart = (
            alt.Chart(SERA)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("count:Q", title="Número de Casos"),
                color=alt.datum(f"Médias Móveis Exponenciais ({granularity} dias)"),
            )
            .properties(
                # title=f"Médias Móveis Exponenciais ({granularity} dias)",
                width=800
            )
        )

        return chart

    def render_diff(self, *args):
        SD1 = pd.DataFrame(
            self.temporal_controller.serie_differentiation(*args, order=1)
        )
        SD2 = pd.DataFrame(
            self.temporal_controller.serie_differentiation(*args, order=2)
        )

        first = (
            alt.Chart(SD1)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("count:Q", title="Número de Casos"),
            )
            .properties(title="Diferenciação de Primeira Ordem")
        )

        second = (
            alt.Chart(SD2)
            .mark_line()
            .encode(x=alt.X("DT_NOTIFIC:T", title="Data"), y=alt.Y("count:Q", title=""))
            .properties(title="Diferenciação de Segunda Ordem")
        )

        chart = (first | second).resolve_scale(y="shared")

        return chart

    def render_moving_mean(self, *args):
        granularity = 30
        SERA = pd.DataFrame(
            data=self.temporal_controller.serie_rooling_average(
                granularity=f"{granularity}D"
            )
        )

        chart = (
            alt.Chart(SERA)
            .mark_line()
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("count:Q", title="Número de Casos"),
                color=alt.datum(f"Médias Móveis ({granularity} dias)"),
            )
            .properties(
                # title=f"Médias Móveis ({granularity} dias)",
                width=800
            )
        )

        return chart

    @staticmethod
    def render_arima(predict_data: dict):
        predict = pd.DataFrame(predict_data["originalSerie"])
        predictMean = pd.DataFrame(predict_data["predictMean"])
        predictConf = pd.DataFrame(predict_data["predictConf"])

        arima = (
            alt.Chart(predict)
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("Predict:Q", title="Número de Casos"),
                color=alt.datum("ARIMA Ajustado"),
            )
            .mark_line(opacity=0.6)
        )

        count = (
            alt.Chart(predict)
            .encode(
                x=alt.X("DT_NOTIFIC:T"),
                y=alt.Y("Count:Q"),
                color=alt.datum("Valores Reais"),
            )
            .mark_line()
        )

        trend = (
            alt.Chart(predictMean)
            .encode(
                x=alt.X("DT_NOTIFIC:T"),
                y=alt.Y("predicted_mean:Q"),
                color=alt.datum("ARIMA Previsão"),
            )
            .mark_line()
        )

        lower_conf = (
            alt.Chart(predictConf)
            .encode(
                x=alt.X("DT_NOTIFIC:T"),
                y=alt.Y("lower y:Q"),
                color=alt.datum("Intervalo de Confiança"),
            )
            .mark_area()
        )

        upper_conf = (
            alt.Chart(predictConf)
            .encode(
                x=alt.X("DT_NOTIFIC:T"),
                y=alt.Y("upper y:Q"),
                color=alt.datum("Intervalo de Confiança"),
            )
            .mark_area()
        )

        chart = count + arima + (lower_conf + upper_conf + trend)

        chart = chart.properties(
            title="Ajuste do Modelo ARIMA e Previsões", width=800
        ).interactive()

        return chart

    @staticmethod
    def render_arima_resid(predict_data: dict):
        resid = pd.DataFrame(predict_data["predictResid"])

        chart = (
            alt.Chart(resid)
            .encode(
                x=alt.X("DT_NOTIFIC:T", title="Data"),
                y=alt.Y("Resid:Q", title="Resíduo"),
                color=alt.datum("Resíduos do Modelo Ajsutado"),
            )
            .mark_line(opacity=0.6)
            .properties(title="Resíduos do Modelo Ajsutado", width=800)
        )

        return chart

    @staticmethod
    def stationarity_test_msg(
        decomposition_data: dict, decomposition_type: str = "STL"
    ):
        # Teste estatístico pra saber se a serie é Estacionaria
        stationarityTest = decomposition_data["stationarityTest"]

        test_result = "POSITIVO" if stationarityTest["stationary"] else "NEGATIVO"
        meaning = "não variam" if stationarityTest["stationary"] else "variam"
        meaning2 = "não possui" if stationarityTest["stationary"] else "possui"
        meaning3 = (
            "persistentes" if stationarityTest["stationary"] else "inconsistentes"
        )
        meaning4 = "facilitando" if stationarityTest["stationary"] else "dificultando"

        stationarityTestMsg = f"Utilizamos os resíduos da decomposição {decomposition_type} para realizar um Teste de Estacionariedade. O teste resultou em {test_result}, com p-valor de {stationarityTest['pValue']} e estatística {stationarityTest['testStatistic']}. Isso indica que as propriedades estatísticas da série temporal, como média, variância e autocovariância, {meaning} ao longo do tempo. Isso significa que a série {meaning2} tendências ou padrões sazonais {meaning3}, {meaning4} o uso de modelos estatísticos como ARIMA ou SARIMA."

        return stationarityTestMsg

    @staticmethod
    def normality_test_msg(predict_data: dict):
        normTest = predict_data["normTest"]

        result = bool(normTest["normResid"])
        p_value = normTest["Jarque-Bera"]

        test_result = "POSITIVO" if result else "NEGATIVO"
        meaning = "são" if result else "não são"
        meaning2 = "está" if result else "não está"

        norm_msg = f"O teste Jarque-Bera de normalidade obteve resultado {test_result}, com p-valor igual a {p_value}, indicando que os resíduos da série temporal {meaning} normalmente distribuidos. Isso indica que o modelo ajustado {meaning2} capturando adequadamente a estrutura dos dados, e os erros (ou resíduos) {meaning} puramente aleatórios."

        return norm_msg

    @staticmethod
    def independence_test_msg(predict_data: dict):
        # Test est. pra saber se os resíduos são independentes
        independenceTest = predict_data["independenceTest"]

        p_valor = independenceTest["Ljung-Box"]
        result = bool(independenceTest["independenceResid"])

        # Formatação para o teste de independência
        test_result = "POSITIVO" if result else "NEGATIVO"
        meaning = "são" if result else "não são"
        meaning2 = "está" if result else "não está"

        indep_msg = f"O teste Ljung-Box de independência obteve resultado {test_result}, com p-valor igual a {p_valor}, indicando que os resíduos da série temporal {meaning} independentes. Isso indica que o modelo ajustado {meaning2} capturando toda a estrutura dos dados, e os erros (ou resíduos) {meaning} livres de autocorrelação, uma das principais suposições de modelos de séries temporais."

        return indep_msg

    @staticmethod
    def arima_fit_msg(predict_data: dict):
        # Ajuste de parâmetros para modelo arima (AIC, Order)
        aic = predict_data["aic"]
        order = predict_data["order"]
        seasonalOrder = predict_data["seasonalOrder"]

        # Formatação da mensagem
        arima_msg = (
            f"O ajuste do modelo ARIMA foi realizado com sucesso. O valor do critério de informação AIC é {aic:.2f}, "
            f"indicando a qualidade do ajuste. Os parâmetros do modelo são ordem (p, d, q) = {order}, onde p representa "
            f"a ordem do componente autorregressivo (AR), d é o número de diferenciações necessárias para tornar a série "
            f"estacionária e q corresponde à ordem do componente de média móvel (MA). A ordem sazonal (P, D, Q, s) = {seasonalOrder} "
            f"foi ajustada, onde P é a ordem sazonal do componente AR, D o número de diferenciações sazonais, Q a ordem sazonal do "
            f"componente MA e s representa o período sazonal (por exemplo, 12 para dados mensais). Esses parâmetros indicam como o "
            f"modelo ARIMA capturou tanto os padrões não sazonais quanto os sazonais da série temporal."
        )

        return arima_msg

    @staticmethod
    def time_series_msg(year: Optional[int] = None) -> str:
        year = f"{year}" if year is not None else "2021 a 2024"
        text = f"""
        <p>O gráfico de linha apresenta a evolução temporal do número de ocorrências de Síndrome Respiratória Aguda no período de {year}, com o eixo X representando as datas de ocorrência e o eixo Y o número de casos registrados. O gráfico facilita a análise de padrões temporais, possibilitando a identificação de períodos críticos, surtos epidêmicos ou mudanças sazonais.</p>
        <ul>
            <li><strong>Tendências Gerais:</strong> O gráfico permite identificar o comportamento dos casos ao longo do tempo, como aumentos graduais ou quedas acentuadas.</li>
            <li><strong>Períodos de Queda:</strong> As quedas podem refletir estabilização dos casos, impactos de medidas preventivas (como campanhas de vacinação ou distanciamento social) ou alterações nas condições ambientais.</li>
            <li><strong>Ciclos Anuais:</strong> Caso haja repetições de padrões em intervalos regulares, pode-se inferir uma sazonalidade dos casos, como o aumento em determinados meses ou estações do ano.</li>
        </ul>
        """
        return text

    @staticmethod
    def lag_plots_msg() -> str:
        text = """
        <p>Um gráfico de defasagem ou lag plot é uma ferramenta visual usada para identificar padrões de autocorrelação em dados ao longo do tempo. O gráfico é criado plotando os valores da série temporal no eixo X contra os mesmos valores deslocados por um determinado número de períodos (defasagem ou lag) no eixo Y, de modo que o gráfico possa:</p>
        <ul>
            <li>Revelar se há uma dependência temporal nos dados, ou seja, se o número de casos em um período influencia ou está correlacionado com o número de casos em períodos distintos.</li>
            <li><strong>Correlação Forte:</strong> se os pontos formam uma distribuição linear ou concentrada, isso indica que períodos com alta incidência tendem a ser seguidos por novos períodos de alta, sugerindo uma persistência ou continuidade dos casos ao longo do tempo.</li>
            <li><strong>Dispersão Aleatória:</strong> caso os pontos estejam espalhados de forma irregular, pode-se concluir que não há um padrão temporal consistente entre os períodos analisados.</li>
        </ul>
        <p>Portanto, o gráfico permite avaliar a dinâmica temporal dos casos, ajudando a prever tendências futuras com base no comportamento passado.</p>
        """
        return text

    @staticmethod
    def occurrences_msg() -> str:
        text = """
        <p>Os gráficos de barras apresentam a distribuição do número de casos de Síndrome Respiratória Aguda conforme o sexo dos indivíduos (masculino e feminino), bem como faixa etária e dias de semana. As barras ilustram se há predominância de casos em determinadas categorias, como dias de semana, no qual, uma barra mais alta pode indicar maior vulnerabilidade ou maior exposição desse grupo a fatores de risco. Permitindo compreender fatores como:</p>
        <ul>
            <li><strong>Comportamentais:</strong> maior exposição ocupacional em grupos específicos.</li>
            <li><strong>Condições Socioeconômicas:</strong> acesso desigual aos serviços de saúde, moradia inadequada ou ocupações de risco.</li>
        </ul>
        <p>Este gráfico permite identificar possíveis desigualdades de saúde entre grupos étnicos, bem como ajuda a identificar disparidades entre os sexos e a direcionar ações de prevenção e cuidado para os grupos mais afetados.</p>
        """
        return text

    @staticmethod
    def moving_mean_and_ema_msg() -> str:
        text = """
        <p>O gráfico de médias móveis apresenta a suavização da série temporal original de número de ocorrências de Síndrome Respiratória Aguda (do primeiro gráfico), com o objetivo de eliminar variações aleatórias de curto prazo e destacar tendências gerais ao longo do período.</p>
        <ul>
            <li><strong>Suavização da Série:</strong> A linha das médias móveis reduz as oscilações diárias ou semanais, facilitando a identificação de tendências de longo prazo, como aumentos ou quedas contínuas no número de casos.</li>
            <li><strong>Tendências Ascendentes:</strong> Sugerem surtos ou aumentos graduais nos casos, possivelmente relacionados a fatores como sazonalidade, novas variantes ou falhas nas intervenções.</li>
            <li><strong>Tendências Descendentes:</strong> Indicam controle da situação, possivelmente devido a intervenções bem-sucedidas (como vacinação, distanciamento social, etc.).</li>
        </ul>
        <p>As médias móveis permitem uma visão mais clara e suave da série temporal, facilitando a análise de padrões e tendências de longo prazo. O gráfico de médias móveis exponenciais (EMA) apresenta uma variação da média móvel simples, dando mais peso aos dados mais recentes da série temporal de número de ocorrências.</p>
        """
        return text

    @staticmethod
    def stl_decomposition_msg() -> str:
        text = """
        <p>A decomposição STL é uma técnica que separa a série temporal original (número de ocorrências de Síndrome Respiratória Aguda) em três componentes principais: tendência (trend), sazonalidade (seasonal) e resíduos (remainder). Isso permite uma análise mais clara dos padrões subjacentes na série temporal.</p>
        <ul>
            <li><strong>Tendência:</strong> Refere-se ao comportamento de longo prazo da série, mostrando a direção geral dos casos, como crescimento, queda ou estabilização ao longo do período.</li>
            <li><strong>Sazonalidade:</strong> Captura os padrões sazonais recorrentes nos dados, como aumentos ou quedas em determinados meses do ano. A presença de picos sazonais em meses específicos pode sugerir uma relação com fatores climáticos (ex.: aumento de casos em estações mais frias) ou comportamentos populacionais.</li>
            <li><strong>Resíduos:</strong> Representa as flutuações aleatórias da série, ou seja, variações que não são explicadas pela tendência ou sazonalidade.</li>
        </ul>
        <p>Portanto, a decomposição STL oferece uma visão mais detalhada da série temporal, facilitando a identificação de padrões estruturais (tendência e sazonalidade) e de flutuações inesperadas (resíduos).</p>
        """
        return text

    @staticmethod
    def seasonal_decomposition_msg() -> str:
        text = """
        <p>A decomposição sazonal clássica é um método que separa uma série temporal (como o número de ocorrências de Síndrome Respiratória Aguda) em três componentes principais: tendência (trend), sazonalidade (seasonal) e resíduos (remainder). Essa abordagem ajuda a entender os padrões regulares e as variações da série temporal.</p>
        <ul>
            <li><strong>Tendência:</strong> Indica a direção geral dos dados ao longo do tempo, como crescimento, declínio ou estabilidade, representando o comportamento de longo prazo da série.</li>
            <li><strong>Sazonalidade:</strong> Capta os ciclos recorrentes em intervalos regulares, como variações mensais ou anuais. Esse componente é fixo ao longo do tempo, assumindo que os padrões sazonais não mudam em intensidade ou forma.</li>
            <li><strong>Resíduos:</strong> Refere-se às flutuações aleatórias ou inexplicadas nos dados, após a remoção dos efeitos da tendência e da sazonalidade.</li>
        </ul>
        <p>A decomposição sazonal clássica é mais adequada para séries temporais com sazonalidade regular e constante ao longo do tempo, sendo uma solução simples e eficiente para identificar padrões de longo prazo e ciclos recorrentes.</p>
        """
        return text

    @staticmethod
    def correlogram_msg() -> str:
        text = """
        <p>O correlograma é uma ferramenta visual usada para analisar a autocorrelação de uma série temporal. Ele mostra a correlação entre o valor atual e os valores passados da série temporal para diferentes defasagens (lags). Cada ponto no gráfico representa a correlação entre o valor atual e os valores deslocados para uma determinada defasagem no tempo.</p>
        <ul>
            <li><strong>Corrente e Anterior:</strong> Se os pontos formam uma linha quase reta ou um agrupamento ao redor de um valor específico, isso indica uma forte autocorrelação, sugerindo que os valores atuais são influenciados pelos valores passados.</li>
            <li><strong>Padrões de Correlação:</strong> A forma do gráfico pode indicar padrões sazonais, como picos e vales periódicos que se repetem a cada certo número de defasagens, ajudando a entender a dinâmica temporal dos dados.</li>
            <li><strong>Aplicação:</strong> O correlograma é útil para entender a relação entre os dados ao longo do tempo, auxiliando na modelagem estatística e na previsão de séries temporais.</li>
        </ul>
        <p>Portanto, o correlograma oferece uma visão clara da autocorrelação, ajudando a identificar dependências e padrões nos dados ao longo do tempo.</p>
        """
        return text

    @staticmethod
    def partial_correlogram_msg() -> str:
        text = """
        <p>O correlograma parcial é uma extensão do correlograma que controla para outras defasagens e foca apenas nas correlações entre os valores atuais e os valores passados. Ele permite isolar o efeito de cada defasagem individualmente, ajustando para outras influências externas.</p>
        <ul>
            <li><strong>Corrente e Resíduos:</strong> Ao diferenciar entre correlações diretas e efeitos indiretos de defasagens anteriores, o correlograma parcial oferece uma visão mais detalhada da relação entre os valores atuais e passados da série temporal.</li>
            <li><strong>Padrões Ajustados:</strong> Esse método ajuda a identificar padrões autocorrelacionados mais claros, isolando influências específicas e evitando confusões com outras correlações não desejadas.</li>
            <li><strong>Aplicação:</strong> O correlograma parcial é útil para detectar correlações diretas e controlar para variáveis externas, sendo especialmente útil na análise de séries temporais complexas onde múltiplas defasagens podem estar interligadas.</li>
        </ul>
        <p>Portanto, o correlograma parcial permite uma análise mais refinada da autocorrelação, isolando os efeitos de diferentes defasagens e facilitando a interpretação dos padrões temporais nos dados.</p>
        """
        return text

    @staticmethod
    def resid_correlogram_msg() -> str:
        text = """
        <p>O correlograma e o correlograma parcial são ferramentas fundamentais na análise dos resíduos de um modelo ajustado. Eles ajudam a verificar se os resíduos seguem um comportamento aleatório, condição essencial para validar a adequação do modelo.</p>
        <ul>
            <li><strong>Correlograma:</strong> Exibe a autocorrelação dos resíduos em diferentes defasagens (lags). Valores significativos de autocorrelação indicam padrões ou dependências temporais nos resíduos, o que sugere que o modelo ajustado pode não estar capturando todos os padrões subjacentes.</li>
            <li><strong>Correlograma Parcial:</strong> Mostra a autocorrelação parcial, ou seja, a correlação dos resíduos com uma defasagem específica, eliminando os efeitos das defasagens intermediárias. Ele é útil para identificar as defasagens diretamente associadas aos resíduos, destacando relações que não são mediadas por outras defasagens.</li>
        </ul>
        <p>A análise conjunta do correlograma e do correlograma parcial permite identificar sinais de falta de ajuste no modelo, como dependências temporais residuais, auxiliando na melhoria do modelo ao sugerir a inclusão de termos adicionais ou ajustes nos parâmetros.</p>
        """
        return text
