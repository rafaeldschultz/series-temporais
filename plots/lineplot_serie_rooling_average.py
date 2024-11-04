import plotly.graph_objects as go

def lineplot_serie_rooling_average(dates_list: list, values_list: list, granularity: str):
    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=dates_list,
            y=values_list
        )
    )

    fig.update_xaxes(showline=True, linewidth=1, linecolor='black')
    fig.update_yaxes(showline=True, linewidth=1, linecolor='black')

    fig.update_layout(
        title=f"Media Movel {granularity} - Número de Ocorrências",
        title_x=0.5,
        title_y=0.9,
        width=900,
        height=600,
        template="plotly_white",
        xaxis_title="Data",
        yaxis_title="Número de Ocorrências"
    )

    fig.show()