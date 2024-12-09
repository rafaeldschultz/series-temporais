from typing import Optional
from .temporal_controller import TemporalController

import os
import pandas as pd
import altair as alt


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


class ReportController:
    def __init__(self):
        self.temporal_controller = TemporalController()
        self.template_path = os.path.join(".", "report_template.html")

    def general_report(self,
                       uf: Optional[str] = None,
                       syndrome: Optional[str] = None,
                       year: Optional[int] = None,
                       evolution: Optional[str] = None):

        data = self.temporal_controller.get_overview_data(uf, syndrome, year, evolution)

        time_series = self.render_time_series(data)
        occurrences = self.render_occurrences(data)

        correlation = self.render_correlation(uf, syndrome, year, evolution)
        lag_plots = self.render_lag_plots(uf, syndrome, year, evolution)
        stl_decomposition = self.render_stl_decomposition(uf, syndrome, year, evolution)
        differentiation = self.render_diff(uf, syndrome, year, evolution)

        moving_mean = self.render_moving_mean(uf, syndrome, year, evolution)
        ema = self.render_EMA(uf, syndrome, year, evolution)

        report = self.compile_report(
            metadata={
                "totalCases": f"{data['general']['totalCases']:,}",
                "totalDeaths": f"{data['general']['totalDeaths']:,}",
                "totalRecovered": f"{data['general']['totalRecovered']:,}",

                "uf": uf, "syndrome": syndrome, "year": year, "evolution": evolution,
            },
            charts=[
                ("time_series", time_series,
                 "Esta figura apresenta uma visualização de séries temporais, "
                 "destacando a evolução do número de casos ao longo do tempo "
                 "com base na data de notificação. A análise permite identificar "
                 "tendências gerais e variações nos dados de forma clara e organizada."),

                ("occurrences", occurrences,
                 "A figura ilustra a distribuição de ocorrências categorizadas por "
                 "características específicas, como sexo, faixa etária ou outros "
                 "atributos relevantes. A disposição visual facilita a comparação "
                 "direta entre diferentes grupos e categorias, promovendo insights "
                 "sobre padrões demográficos e comportamentais."),

                ("correlation", correlation,
                 "Texto do Plot de Autocorrelação"),

                ("lag_plots", lag_plots,
                 "Texto dos Plots de Lag"),

                ("stl_decomposition", stl_decomposition,
                 "Texto do Plot de Decomposição STL"),

                ("differentiation", differentiation,
                 "Texto do Plot de Diferenciação"),

                ("moving_mean", moving_mean,
                 "Texto do Plot de Médias Móveis"),

                ("EMA", ema,
                 "Texto do Plot de Médias Móveis Exponênciais"),

            ],
            json_charts=[
                ("geoplot", open(os.path.join("datasets", "geoplot.json")).read(),
                 "Apresenta dados organizados geograficamente, com totais absolutos "
                 "e gráficos normalizados por região e estado. A seleção de uma região "
                 "ajusta automaticamente os dados exibidos nos gráficos estaduais, "
                 "destacando proporções e evoluções entre localidades."),

                ("mensal", open(os.path.join("datasets", "mensal.json")).read(),
                 "Exibe a série temporal com granularidade mensal, permitindo "
                 "identificar tendências sazonais e comparar variações entre "
                 "diferentes meses. A análise destaca padrões de longo prazo para "
                 "diagnósticos como COVID-19 e Influenza."),

                ("semanal", open(os.path.join("datasets", "semanal.json")).read(),
                 "Mostra a série temporal com granularidade semanal, evidenciando "
                 "padrões como subnotificações aos finais de semana e aumentos nas "
                 "segundas-feiras. Essa visualização é ideal para capturar particularidades "
                 "em ciclos semanais, auxiliando na análise de notificações periódicas."),
            ],
        )

        return report

    def compile_report(self,
                       metadata: dict,
                       charts: list = None,
                       json_charts: list = None) -> str:

        """
        Função para compilar os dados do relatório para um arquivo HTML

        Parâmetros
        ----------
        metadata: dict
            Dicionário com os metadados para adicionar ao banner do relatório.
                Formato: {"totalCases": 123, "totalDeaths": 123, "totalRecovered": 123}

        charts: list
            Lista com os gráficos para adicionar ao relatório no formato:
                ("Identificador da Figura", Plot do VEGA, "Texto da Figura")

        json_charts: list
            Lista com os gráficos estáticos para adicionar ao relatório no formato:
                ("Identificador da Figura", "Código JSON", "Texto da Figura")

        Retorno
        -------
        str
            String com o conteúdo HTML do relatório compilado.
        """

        chart_divs = []
        chart_scripts = []

        if charts is not None:

            if metadata['uf'] is not None:
                chart_divs.append(f"<h1>Análises para o Estado {metadata['uf']}</h1>")
            else:
                chart_divs.append("<h1>Análises do Dataset para os Dados Filtrados</h1>")

            for idx, (chart_id, chart, chart_text) in enumerate(charts):
                chart_div = chart_template.format(chart_id=chart_id, fig_num=idx + 1, text=chart_text)
                chart_script = script_template.replace("CHART_ID", chart_id).replace("JSON_CODE", str(chart.to_dict()))

                chart_divs.append(chart_div)
                chart_scripts.append(chart_script)

        if json_charts is not None:

            chart_divs.append("<h1>Análises do Dataset Geral</h1>")

            for idx, (chart_id, chart_json, chart_text) in enumerate(json_charts):
                chart_div = chart_template.format(chart_id=chart_id, fig_num=idx + 1, text=chart_text)
                chart_script = script_template.replace("CHART_ID", chart_id).replace("JSON_CODE", chart_json)

                chart_divs.append(chart_div)
                chart_scripts.append(chart_script)

        chart_divs = "".join(chart_divs)
        chart_scripts = "<script>{code}</script>".format(code="".join(chart_scripts))
        chart_scripts = chart_scripts.replace("True", "true")

        template = open(self.template_path).read()

        report = template.replace("{CHARTS}", chart_divs)
        report = report.replace("{SCRIPT}", chart_scripts)

        report = report.replace("{TOTAL_CASOS}", metadata['totalCases'])
        report = report.replace("{TOTAL_OBITOS}", metadata['totalDeaths'])
        report = report.replace("{TOTAL_RECUPERADOS}", metadata['totalRecovered'])

        return report

    @staticmethod
    def render_time_series(data: dict) -> alt.Chart:
        ts = pd.DataFrame(data['temporalSeries']['serieTemporal'])

        ts_chart = alt.Chart(ts).mark_line().encode(
            x=alt.X('DT_NOTIFIC:T', title='Data de Notificação'),
            y=alt.Y('count:Q', title='Número de Casos')
        ).properties(
            title='Série Temporal',
            width=1000,
            height=400
        )

        return ts_chart

    @staticmethod
    def render_occurrences(data: dict) -> alt.Chart:

        occurrences = data['occurences']

        occ_sex = pd.DataFrame(occurrences['sex'])
        occ_sex_chart = alt.Chart(occ_sex).mark_bar().encode(
            x=alt.X('sex:N', title='Gênero', axis=alt.Axis(labelAngle=0)),
            y=alt.Y('count:Q', title='Ocorrências'),
            color=alt.Color('sex:N', title='Gênero')
        ).properties(
            title='Ocorrências por Sexo',
            width=200,
            height=300
        )

        occ_race = pd.DataFrame(occurrences['race'])
        occ_race_chart = alt.Chart(occ_race).mark_bar().encode(
            x=alt.X('race:N', title='Raça', axis=alt.Axis(labelAngle=0)),
            y=alt.Y('count:Q', title='Ocorrências'),
            color=alt.Color('race:N', title='Raça')
        ).properties(
            title='Ocorrências por Raça',
            width=200,
            height=300
        )

        occ_day = pd.DataFrame(occurrences['day'])
        occ_day_chart = alt.Chart(occ_day).mark_bar().encode(
            x=alt.X('day:N', title='Dia da Semana', axis=alt.Axis(labelAngle=0), sort=[
                'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
            ]),
            y=alt.Y('count:Q', title='Ocorrências'),
            color=alt.Color('day:N', title='Dia da Semana', sort='x')
        ).properties(
            title='Ocorrências por Dia da Semana',
            width=200,
            height=300
        )

        occs_chart = (occ_sex_chart | occ_race_chart | occ_day_chart).resolve_scale(
            color='independent'  # Escalas de cor independentes
        )

        return occs_chart


    def render_correlation(self, *args):

        CORR = self.temporal_controller.correlogram(*args)

        CORR = pd.DataFrame(CORR).reset_index(names='lag')

        del CORR['confidenceIntervals']

        autocorr = alt.Chart(CORR).mark_point(filled=True).encode(
            x=alt.X("lag:Q", title="Lag"),
            y=alt.Y("autocorrelations:Q", title="Autocorrelação", scale=alt.Scale(domain=[-1, 1])),
            color=alt.datum("Autocorrelações")
        )

        lines = alt.Chart(CORR).mark_rule().encode(
            x=alt.X("lag:Q"),
            y=alt.Y("autocorrelations:Q")
        )

        lowerRange = alt.Chart(CORR).mark_area(opacity=0.3).encode(
            x=alt.X("lag:Q"),
            y=alt.Y("lowerY"),
            color=alt.datum("Intervalo de Confiança")
        )

        upperRange = alt.Chart(CORR).mark_area(opacity=0.3).encode(
            x=alt.X("lag:Q"),
            y=alt.Y("upperY"),
            color=alt.datum("Intervalo de Confiança")
        )

        chart = (autocorr + lines + lowerRange + upperRange).properties(
            title="Autocorrelações com 25 Lags",
            width=800
        )

        return chart


    def render_lag_plots(self, *args):

        lags = self.temporal_controller.get_serie_lag_plot(*args)

        xlabel = "Número de Casos"
        ylabel = "Número de Casos com Lag"

        d3 = pd.DataFrame(lags['3'])
        d6 = pd.DataFrame(lags['6'])
        d9 = pd.DataFrame(lags['9'])
        d12 = pd.DataFrame(lags['12'])

        d3 = alt.Chart(d3).mark_point().encode(
            x=alt.X("yActual:Q", title=xlabel),
            y=alt.Y('yLagged:Q', title=ylabel)
        ).properties(
            title="Lags Temporais 3D"
        )

        d6 = alt.Chart(d6).mark_point().encode(
            x=alt.X("yActual:Q", title=xlabel),
            y=alt.Y('yLagged:Q', title=ylabel)
        ).properties(
            title="Lags Temporais 6D"
        )

        d9 = alt.Chart(d9).mark_point().encode(
            x=alt.X("yActual:Q", title=xlabel),
            y=alt.Y('yLagged:Q', title=ylabel)
        ).properties(
            title="Lags Temporais 9D"
        )

        d12 = alt.Chart(d12).mark_point().encode(
            x=alt.X("yActual:Q", title=xlabel),
            y=alt.Y('yLagged:Q', title=ylabel)
        ).properties(
            title="Lags Temporais 12D"
        )

        chart = (d3 | d6) & (d9 | d12)

        return chart

    def render_stl_decomposition(self, *args):

        SSD = pd.DataFrame(self.temporal_controller.serie_stl_decomposition(*args))
        width = 800

        trend = alt.Chart(SSD).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Trend_values:Q", title="Tendência")
        ).properties(
            width=width
        )

        seasonal = alt.Chart(SSD).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Seasonal_values:Q", title="Sasonalidade")
        ).properties(
            width=width
        )

        resid = alt.Chart(SSD).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Resid_values:Q", title="Resíduos")
        ).properties(
            width=width
        )

        chart = (trend & seasonal & resid)

        return chart


    def render_EMA(self, *args):
        granularity = 30
        SERA = pd.DataFrame(
            data=self.temporal_controller.serie_exponential_rooling_average(
                granularity=granularity
            )
        )

        chart = alt.Chart(SERA).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("count:Q", title="Número de Casos")
        ).properties(
            title=f"Médias Móveis Exponenciais ({granularity} dias)",
            width=800
        )

        return chart

    def render_diff(self, *args):

        SD1 = pd.DataFrame(self.temporal_controller.serie_differentiation(*args, order=1))
        SD2 = pd.DataFrame(self.temporal_controller.serie_differentiation(*args, order=2))

        first = alt.Chart(SD1).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("count:Q", title="Número de Casos")
        ).properties(
            title="Diferenciação de Primeira Ordem"
        )

        second = alt.Chart(SD2).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("count:Q", title="")
        ).properties(
            title="Diferenciação de Segunda Ordem"
        )

        chart = (first | second).resolve_scale(y='shared')

        return chart

    def render_moving_mean(self, *args):
        granularity = 30
        SERA = pd.DataFrame(
            data=self.temporal_controller.serie_rooling_average(
                granularity=f"{granularity}D"
            )
        )

        chart = alt.Chart(SERA).mark_line().encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("count:Q", title="Número de Casos")
        ).properties(
            title=f"Médias Móveis ({granularity} dias)",
            width=800
        )

        return chart
