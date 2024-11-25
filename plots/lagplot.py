import plotly.graph_objects as go

def lag_plot(
    y_actual: list, 
    y_lagged: list,
    max_val: float, 
    min_val: float,
    lag: int
):

    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=y_actual,
            y=y_lagged,
            mode='markers',
            marker=dict(size=6, opacity=0.7),
            name=f"Lag {lag}"
        ),
    )

    fig.add_trace(
        go.Scatter(
            x=[min_val, max_val],
            y=[min_val, max_val],
            mode='lines',
            line=dict(color='red', dash='dash'),
            name="Linha Identidade"
        ),
    )

    fig.update_layout(
        title=f'Lag = {lag}',
        xaxis_title="Xt",
        yaxis_title="Xt-k",
        height=500,
        width=1000,
        showlegend=False,
        template="plotly"
    )

    fig.show()