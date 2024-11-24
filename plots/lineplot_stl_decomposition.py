import plotly.graph_objects as go

def stl_decomposition(
    date_column,
    serie_values,
    trend_values,
    seasonal_values,
    resid_values
):

    fig = go.Figure()

    fig.add_trace(go.Scatter(x=date_column, y=serie_values, mode='lines', name='Série Original'))

    fig.add_trace(go.Scatter(x=date_column, y=trend_values, mode='lines', name='Tendência'))

    fig.add_trace(go.Scatter(x=date_column, y=seasonal_values, mode='lines', name='Sazonalidade'))

    fig.add_trace(go.Scatter(x=date_column, y=resid_values, mode='lines', name='Resíduos'))

    fig.update_layout(title='Decomposição STL',
                      xaxis_title='Data',
                      yaxis_title='Número de casos',
                      template='plotly')

    fig.show()