# Considera-se que a base já está processada
import pandas as pd
import plotly.graph_objects as go

def plot_serie_temporalSRAG(df, doenca=None, estado=None, regiao_imediata=None, municipio=None):
    """Função de Visualização da Série Temporal dos Dados SRAG

    Args:
        df (_type_): Dataframe Pandas
        doenca (_type_, optional): {'Outro agente etiológico', 'Não especificado', 'Influenza',
       'Vírus respiratório'}
       
        estado (_type_, optional): {'BA', 'PR', 'RS', 'RJ', 'CE', 'SP', 'DF', 'MG', 'SC', 'PB', 'MS',
       'AM', 'SE', 'PA', 'MT', 'TO', 'GO', 'AL', 'PE', 'PI', 'ES', 'RR',
       'AP', 'AC', 'RN', 'RO', 'MA'}
       
        regiao_imediata (_type_, optional): 
        
        municipio (_type_, optional): 

    Returns:
        _type_: _description_
    """
    # Copia o DataFrame original
    df_filtered = df.copy()
    
    # Aplica os filtros se eles não forem None
    if doenca:
        df_filtered = df_filtered[df_filtered['CLASSI_FIN'] == doenca]
    if estado:
        df_filtered = df_filtered[df_filtered['SIGLA_UF'] == estado]
    if regiao_imediata:
        df_filtered = df_filtered[df_filtered['regiao_imediata'] == regiao_imediata]
    if municipio:
        df_filtered = df_filtered[df_filtered['ID_MUNICIP'] == municipio]
    
    # Verifica se há dados após os filtros
    if df_filtered.empty:
        print("Nenhum dado disponível com os filtros selecionados.")
        return
    
    # Cria a série temporal
    df_filtered['DT_NOTIFIC'] = pd.to_datetime(df_filtered['DT_NOTIFIC'], format='%d/%m/%Y')
    serie_temporal = df_filtered['DT_NOTIFIC'].value_counts().sort_index()
    intervalo_semestral = pd.date_range(start='2021-07-01', end=serie_temporal.index.max(), freq='6MS')

    #Cálculo dos novos casos em um intervalo semestral
    novos_casos_semestrais = []
    for i, semestre in enumerate(intervalo_semestral):
      if i == 0:
          novos_casos = serie_temporal.loc[:semestre].sum()
      else:
          novos_casos = serie_temporal.loc[intervalo_semestral[i-1]:semestre].sum()
      novos_casos_semestrais.append((semestre, novos_casos))


    # Cria o gráfico
    fig = go.Figure()
    
    # Lineplot da série
    fig.add_trace(go.Scatter(
        x=serie_temporal.index,
        y=serie_temporal.values,
        mode='lines',
        line=dict(width=1.5, color='rgba(0, 119, 182, 0.7)'),
        name=f'Série Temporal - {doenca if doenca else "Doenças SRAG"}',
        hovertemplate='%{x|%d - %b - %Y}<br>'
                      f'{doenca if doenca else "Doenças SRAG"}<br>'
                      'Número de casos: %{y}<extra></extra>',
        fill='tozeroy',
        fillcolor='#0077b6'))
    
    
    # Adiciona as anotações internas do gráfico
    for semestre, novos_casos in novos_casos_semestrais:
            if novos_casos > 0:
                fig.add_annotation(
                    x=semestre,
                    y=serie_temporal.loc[semestre] if semestre in serie_temporal.index else 0,
                    text=f"{novos_casos:,}",
                    showarrow=False,
                    ax=0,
                    ay=-30,
                    font=dict(color='black', size=11, family='Inter'),
                )
    
    fig.update_layout(
        xaxis=dict(showgrid=False, title='Data de Notificação',
                   title_font=dict(color='Black', size=14, family='Inter')),
        yaxis=dict(showgrid=True,
                   gridcolor="#e5e5e5",
                   zerolinecolor='#e5e5e5', gridwidth=0.5),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='white',
        legend=dict(font=dict(color='black', size=12, family='Inter')),
        font=dict(color='black', size=12, family='Inter'),
        height=400,
        width=800,
        hoverlabel=dict(
            bgcolor='white',  # Cor de fundo do hover branca
            font=dict(color='black'),
            bordercolor='#e5e5e5'  # Cor do texto preto
        ),
        showlegend=True
    )
    
    return fig
