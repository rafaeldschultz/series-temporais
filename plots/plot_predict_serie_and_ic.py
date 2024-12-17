import plotly.graph_objects as go

def plot_predict_serie_and_ic(
    date: list,
    values: list,
    pred_date: list,
    pred_mean_values: list,
    pred_conf_date: list,
    upper_values: list,
    lower_values: list
):
    fig.add_trace(go.Scatter(
        x=date,
        y=values,
        mode='lines',
        name='Histórico'
    ))

    fig.add_trace(go.Scatter(
        x=pred_date,
        y=pred_mean_values,
        mode='lines',
        name='Previsão',
        line=dict(color='red')
    ))

    fig.add_trace(go.Scatter(
        x=pred_conf_date,
        y=lower_values,
        mode='lines',
        line=dict(color='pink'),
        name='IC Inferior',
        showlegend=False
    ))
    fig.add_trace(go.Scatter(
        x=pred_conf_date,
        y=upper_values,
        mode='lines',
        line=dict(color='pink'),
        fill='tonexty',
        name='IC Superior'
    ))

    fig.update_layout(
        title=title,
        xaxis_title='Tempo',
        yaxis_title='Valor',
        legend=dict(x=6, y=1, bgcolor='rgba(0,0,0,0)'),
        template='plotly_white'
    )
