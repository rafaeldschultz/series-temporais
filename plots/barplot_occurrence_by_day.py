import plotly.graph_objects as go

def barplot_occurrence_by_day(days_name_list: list, count_list: list):
    fig = go.Figure()

    fig.add_trace(
        go.Bar(
            y=count_list,
            x=days_name_list,
            marker=dict(
                color='royalblue',
                line=dict(color='black', width=1)
            ),
            text=count_list,
            textposition='outside'
        )
    )

    fig.update_xaxes(showline=True, linewidth=1, linecolor='black')
    fig.update_yaxes(showline=True, linewidth=1, linecolor='black')

    fig.update_layout(
        title="Número de Ocorrências por Dia da Semana",
        title_x=0.5,
        title_y=0.9,
        width=900,
        height=600,
        template="plotly_white",
        xaxis_title="Dia da Semana",
        yaxis_title="Número de Ocorrências"
    )

    fig.show()