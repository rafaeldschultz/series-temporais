import plotly.graph_objects as go

def barplot_occurrence_by_age(ages_list: list):
    fig = go.Figure()

    fig.add_trace(
        go.Histogram(
            x=ages_list
        )
    )

    fig.update_xaxes(showline=True, linewidth=1, linecolor='black')
    fig.update_yaxes(showline=True, linewidth=1, linecolor='black')

    fig.update_layout(
        title="Número de Ocorrências por Idade",
        title_x=0.5,
        title_y=0.9,
        width=900,
        height=600,
        template="plotly_white",
        xaxis_title="Idade",
        yaxis_title="Número de Ocorrências"
    )

    fig.show()