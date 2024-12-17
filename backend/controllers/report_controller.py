from typing import Optional
from .temporal_controller import TemporalController

import os
import warnings
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


def plot_decomposition(data: dict, width: int = 800):
    SDD = pd.DataFrame(data)

    trend = alt.Chart(SDD).mark_line().encode(
        x=alt.X("DT_NOTIFIC:T", title="Data"),
        y=alt.Y("Trend_values:Q", title="Tendência")
    ).properties(
        width=width
    )

    seasonal = alt.Chart(SDD).mark_line().encode(
        x=alt.X("DT_NOTIFIC:T", title="Data"),
        y=alt.Y("Seasonal_values:Q", title="Sasonalidade")
    ).properties(
        width=width
    )

    resid = alt.Chart(SDD).mark_line().encode(
        x=alt.X("DT_NOTIFIC:T", title="Data"),
        y=alt.Y("Resid_values:Q", title="Resíduos")
    ).properties(
        width=width
    )

    chart = (trend & seasonal & resid)

    return chart


def plot_correlogram(CORR: dict,
                     title="Titulo do Correlograma"):

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
        title=title,
        width=800
    )

    return chart


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

        correlation = plot_correlogram(
            CORR=self.temporal_controller.correlogram(uf, syndrome, year, evolution)
        )

        lag_plots = self.render_lag_plots(uf, syndrome, year, evolution)
        differentiation = self.render_diff(uf, syndrome, year, evolution)

        stl_decomposition_data = self.temporal_controller.get_stl_decomposition_data(uf, syndrome, year, evolution)
        stl_decomposition = plot_decomposition(data=stl_decomposition_data['stlData'])
        stl_correlogram = plot_correlogram(CORR=stl_decomposition_data['correlogram'])

        seasonal_decomposition_data = self.temporal_controller.get_seasonal_decomposition_data(uf, syndrome, year, evolution)
        seasonal_decomposition = plot_decomposition(data=seasonal_decomposition_data['seasonalData'])
        seasonal_correlogram = plot_correlogram(CORR=seasonal_decomposition_data['correlogram'])

        moving_mean = self.render_moving_mean(uf, syndrome, year, evolution)
        ema = self.render_EMA(uf, syndrome, year, evolution)

        with warnings.catch_warnings():
            # Ignorar todos os avisos do segmento de código
            warnings.simplefilter("ignore")

            # Ajustar um modelo ARIMA com os dados
            predict_data = self.temporal_controller.get_predict_data(uf, syndrome, year, evolution)

        arima_chart = self.render_arima(predict_data)
        arima_corr = plot_correlogram(CORR=predict_data['predictCorrelogram'],
                                      title="Correlograma dos Resíduos do Modelo")

        arima_partial_corr = plot_correlogram(CORR=predict_data['predictCorrelogram'],
                                              title="Correlograma Parcial dos Resíduos do Modelo")

        report = self.compile_report(
            metadata={
                "totalCases": f"{data['general']['totalCases']:,}",
                "totalDeaths": f"{data['general']['totalDeaths']:,}",
                "totalRecovered": f"{data['general']['totalRecovered']:,}",

                "uf": uf, "syndrome": syndrome, "year": year, "evolution": evolution,
            },
            messages=[
                ("Teste de Estacionariedade na Série Temporal",
                 self.stationarity_test_msg(stl_decomposition_data)),

                ("Teste de Normalidade dos Resíduos",
                 self.normality_test_msg(predict_data)),

                ("Teste de Indepêndencia dos Resíduos",
                 self.independence_test_msg(predict_data)),

                ("Ajuste do Modelo ARIMA à Série Temporal",
                 self.arima_fit_msg(predict_data))
            ],
            charts=[
                ("time_series", time_series,
                 self.time_series_text()),

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

                ("stl_correlogram", stl_correlogram,
                 "Texto do Plot de Correlograma do STL"),

                ("season_decomposition", seasonal_decomposition,
                 "Texto do Plot de Decomposição Sasonal"),

                ("season_correlogram", seasonal_correlogram,
                 "Texto do Plot de Correlograma da Decomposição Sasonal"),

                ("differentiation", differentiation,
                 "Texto do Plot de Diferenciação"),

                ("moving_mean", moving_mean,
                 "Texto do Plot de Médias Móveis"),

                ("EMA", ema,
                 "Texto do Plot de Médias Móveis Exponênciais"),

                ("arima_chart", arima_chart,
                 "Texto do Plot do Modelo ARIMA"),

                ("arima_corr", arima_corr,
                 "Texto do Plot de Autocorrelações do Modelo ARIMA"),

                ("arima_partial_corr", arima_partial_corr,
                 "Texto do Plot de Autocorrelações Parciais do Modelo ARIMA")
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
                       messages: list = None,
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

        if messages is not None:

            for title, msg in messages:
                chart_divs.append(f"<h2>{title}</h2>")
                chart_divs.append(f"<h3 class='message'>{msg}</h3>")

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

        SSD = pd.DataFrame()
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

    @staticmethod
    def render_arima(predict_data: dict):
        predict = pd.DataFrame(predict_data['serie'])
        predictMean = pd.DataFrame(predict_data['predictMean'])
        predictConf = pd.DataFrame(predict_data['predictConf'])

        arima = alt.Chart(predict).encode(
            x=alt.X("DT_NOTIFIC:T", title="Data"),
            y=alt.Y("Predict:Q", title="Número de Casos"),
            color=alt.datum("ARIMA Ajustado")
        ).mark_line(opacity=0.6)

        count = alt.Chart(predict).encode(
            x=alt.X("DT_NOTIFIC:T"),
            y=alt.Y("Count:Q"),
            color=alt.datum("Valores Reais")
        ).mark_line()

        trend = alt.Chart(predictMean).encode(
            x=alt.X("DT_NOTIFIC:T"),
            y=alt.Y("predicted_mean:Q"),
            color=alt.datum("ARIMA Previsão")
        ).mark_line()

        lower_conf = alt.Chart(predictConf).encode(
            x=alt.X("DT_NOTIFIC:T"),
            y=alt.Y("lower y:Q"),
            color=alt.datum("Intervalo de Confiança")
        ).mark_area()

        upper_conf = alt.Chart(predictConf).encode(
            x=alt.X("DT_NOTIFIC:T"),
            y=alt.Y("upper y:Q"),
            color=alt.datum("Intervalo de Confiança")
        ).mark_area()

        chart = count + arima + (lower_conf + upper_conf + trend)

        chart = chart.properties(
            title="Ajuste do Modelo ARIMA e Previsões",
            width=800
        )

        return chart


    @staticmethod
    def stationarity_test_msg(stl_decomposition_data: dict):
        # Teste estatístico pra saber se a serie é Estacionaria
        stationarityTest = stl_decomposition_data['stationarityTest']

        test_result = "POSITIVO" if stationarityTest['stationary'] else "NEGATIVO"
        meaning = "não variam" if stationarityTest['stationary'] else "variam"
        meaning2 = "não possui" if stationarityTest['stationary'] else "possui"
        meaning3 = "persistentes" if stationarityTest['stationary'] else "inconsistentes"
        meaning4 = "facilitando" if stationarityTest['stationary'] else "dificultando"

        stationarityTestMsg = f"O teste de estacionariedade resultou em {test_result}, com p-valor de {stationarityTest['pValue']} e estatística {stationarityTest['testStatistic']}. Isso indica que as propriedades estatísticas da série temporal, como média, variância e autocovariância, {meaning} ao longo do tempo. Isso significa que a série {meaning2} tendências ou padrões sazonais {meaning3}, {meaning4} o uso de modelos estatísticos como ARIMA ou SARIMA."

        return stationarityTestMsg

    @staticmethod
    def normality_test_msg(predict_data: dict):
        normTest = predict_data['normTest']

        test_result = "POSITIVO" if normTest['normResid'] else "NEGATIVO"
        meaning = "são" if normTest['normResid'] else "não são"
        meaning2 = "está" if normTest['normResid'] else "não está"

        norm_msg = f"O teste Jarque-Bera de normalidade obteve resultado {test_result}, indicando que os resíduos da série temporal {meaning} normalmente distribuidos. Isso indica que o modelo ajustado {meaning2} capturando adequadamente a estrutura dos dados, e os erros (ou resíduos) {meaning} puramente aleatórios."

        return norm_msg

    @staticmethod
    def independence_test_msg(predict_data: dict):
        # Test est. pra saber se os resíduos são independentes
        independenceTest = predict_data['independenceTest']
        independenceTest['independenceResid'] = bool(independenceTest['independenceResid'])

        # Formatação para o teste de independência
        test_result = "POSITIVO" if independenceTest['independenceResid'] else "NEGATIVO"
        meaning = "são" if independenceTest['independenceResid'] else "não são"
        meaning2 = "está" if independenceTest['independenceResid'] else "não está"

        indep_msg = f"O teste Ljung-Box de independência obteve resultado {test_result}, indicando que os resíduos da série temporal {meaning} independentes. Isso indica que o modelo ajustado {meaning2} capturando toda a estrutura dos dados, e os erros (ou resíduos) {meaning} livres de autocorrelação, uma das principais suposições de modelos de séries temporais."

        return indep_msg

    @staticmethod
    def arima_fit_msg(predict_data: dict):
        # Ajuste de parâmetros para modelo arima (AIC, Order)
        aic = predict_data['aic']
        order = predict_data['order']
        seasonalOrder = predict_data['seasonalOrder']

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
    def time_series_text(year: Optional[int] = None):
        year = f"{year}" if year is not None else f"2021 a 2024"
        text = f"""O gráfico de linha apresenta a evolução temporal do número de ocorrências de Síndrome Respiratória Aguda no período de {year}, com o eixo X representando as datas de ocorrência e o eixo Y o número de casos registrados. O gráfico facilita a análise de padrões temporais, possibilitando a identificação de períodos críticos, surtos epidêmicos ou mudanças sazonais.

      - Tendências Gerais: O gráfico permite identificar o comportamento dos casos ao longo do tempo, como aumentos graduais ou quedas acentuadas.
      - Períodos de Queda: As quedas podem refletir estabilização dos casos, impactos de medidas preventivas (como campanhas de vacinação ou distanciamento social) ou alterações nas condições ambientais.
      - Ciclos Anuais: Caso haja repetições de padrões em intervalos regulares, pode-se inferir uma sazonalidade dos casos, como o aumento em determinados meses ou estações do ano.
      """

        return text