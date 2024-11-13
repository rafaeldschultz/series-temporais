<div align="center">

# Análise de Síndrome Respiratória Aguda com dados do OpenDataSUS

_Made with:_

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Plotly](https://img.shields.io/badge/Plotly-%233F4F75.svg?style=for-the-badge&logo=plotly&logoColor=white)](https://plotly.com/python/)
[![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)

</div>

<br>

## ⚡️ Início Rápido

O repositório é subdivido em duas partes: backend e frontend. Ambas precisam ser executadas em conjunto para o correto funcionamento do sistema.

### Frontend:

```bash
# acessando a pasta de frontend
cd frontend

# instalando as dependencias do projeto
npm install

# iniciando o servidor
npm start
```

Basta então acessar a URL que será mostrada no terminal no seu navegador para a visualização do website.

### Backend:

```bash
# acessando a pasta de backend
cd backend

# criando um ambiente de desenvolvimento
python -m venv venv

# ativando o venv criado (no Windows)
venv/Scripts/activate

# ativando o venv criado (no linux)
source venv/bin/activate

# instalando as dependencias do projeto
pip install -r requirements.txt

# iniciando o servidor backend
python main.py
```

Árvore de arquivos :
```
├── BackEnd
│   ├── Controllers
│   ├── Datasets
│   ├── Routes
│   └── main.py
│
├── Frontend
│   ├── assets
│   ├── components
│   ├── contexts
│   │   ├── AppContext.jsx
│   │   └── FilterContext.jsx
│   ├── helpers
│   │   └── axios.jsx
│   ├── hooks
│   │   └── dataLoaders
│   ├── pages
│   │   ├── AnalysisPage
│   │   │   ├── Sections
│   │   │   └── FilterPanel.jsx
│   │   │   └── index.jsx
│   │   └── HomePage
│   └── App.jsx
│
└── Plots

```
