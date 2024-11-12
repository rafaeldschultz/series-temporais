import plotly.graph_objects as go

def correlogram_plot(
    autocorrelations: list, 
    lowerY: list, 
    upperY: list
):
  
    fig = go.Figure()
    for x in range(len(autocorrelations)):
        fig.add_scatter(x=(x, x), y=(0, autocorrelations[x]),
                        mode='lines', line_color='#3f3f3f', hoverinfo='skip')

    fig.add_scatter(x=np.arange(len(autocorrelations)), y=autocorrelations,
                    mode='markers', marker_color='#264653', marker_size=12,
                    hovertemplate='Lag: %{x}<br>Autocorrelação: %{y:.2f}<extra></extra>')

    fig.add_scatter(x=np.arange(len(autocorrelations)), y=upperY,
                    mode='lines', line_color='rgba(255,255,255,0)', hoverinfo='skip')

    fig.add_scatter(x=np.arange(len(autocorrelations)), y=lowerY,
                    mode='lines', line_color='rgba(255,255,255,0)',
                    fillcolor='rgba(42, 157, 143, 0.3)', fill='tonexty', hoverinfo='skip')

    fig.update_traces(showlegend=False)
    fig.update_yaxes(zerolinecolor='#000000')

    fig.update_layout(
        title="Função de Autocorrelação da Diferenciação de 1º Ordem da Série Temporal",
        xaxis_title="Lag",
        yaxis_title="Autocorrelação",
        template="plotly_white",
        margin=dict(t=60, b=20, l=20, r=20),  
        width=900,
        height=400,
    )

    fig.update_xaxes(showline=True, linewidth=.5, linecolor='grey')
    fig.update_yaxes(showline=True, linewidth=.5, linecolor='grey')

    fig.show()