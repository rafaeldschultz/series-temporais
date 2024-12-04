from typing import Optional
from .temporal_controller import TemporalController

import os
import time
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

    def overview_report(self,
                        uf: Optional[str] = None,
                        syndrome: Optional[str] = None,
                        year: Optional[int] = None,
                        evolution: Optional[str] = None
    ):

        data = self.temporal_controller.get_overview_data(uf, syndrome, year, evolution)

        time_series = self.render_time_series(data)
        occurrences = self.render_occurrences(data)

        report = self.compile_report(
            charts=[
                ("time_series", time_series, "Texto do Plot de Séries Temporais"),
                ("occurrences", occurrences, "Texto dos Plots de Ocorrências")
            ],
            metadata={
                    "totalCases": f"{data['general']['totalCases']:,}",
                    "totalDeaths": f"{data['general']['totalDeaths']:,}",
                    "totalRecovered": f"{data['general']['totalRecovered']:,}"
            }
        )

        return report

    def compile_report(self,
                       charts: list,
                       metadata: dict) -> str:

        """
        Função para compilar os dados do relatório para um arquivo HTML

        Parâmetros
        ----------
        charts: list
            Lista com os gráficos para adicionar ao relatório no formato:
                ("Identificador da Figura", Plot do VEGA, "Texto da Figura")

        metadata: dict
            Dicionário com os metadados para adicionar ao banner do relatório.
                Formato: {"totalCases": 123, "totalDeaths": 123, "totalRecovered": 123}

        Retorno
        -------
        str
            String com o conteúdo HTML do relatório compilado.
        """

        chart_divs = []
        chart_scripts = []

        for idx, (chart_id, chart, chart_text) in enumerate(charts):
            chart_div = chart_template.format(chart_id=chart_id, fig_num=idx + 1, text=chart_text)
            chart_script = script_template.replace("CHART_ID", chart_id).replace("JSON_CODE", str(chart.to_dict()))

            chart_divs.append(chart_div)
            chart_scripts.append(chart_script)

        chart_divs = "".join(chart_divs)
        chart_scripts = "<script>{code}</script>".format(code="".join(chart_scripts))

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

