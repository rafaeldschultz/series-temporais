import os
from pathlib import Path
from typing import Optional

import pandas as pd


class TemporalController:
    def __init__(self):
        self.df = self.__load_data()

    def __load_data(self):
        base_path = Path(__file__).resolve().parent.parent.joinpath("datasets")
        df = pd.read_parquet(base_path.joinpath("data_srag.parquet"))
        df["DT_NOTIFIC"] = pd.to_datetime(df["DT_NOTIFIC"], format="%d/%m/%Y")
        df = df.rename(columns={"SG_UF_NOT": "SIGLA_UF"})
        df["CS_RACA"] = df["CS_RACA"].map(
            {
                1: "Branca",
                2: "Preta",
                3: "Amarela",
                4: "Parda",
                5: "Indígena",
                9: "Ignorado",
            }
        )
        return df

    def get_temporal_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie_temporal = self.df["DT_NOTIFIC"].value_counts().sort_index().reset_index()
        serie_temporal["DT_NOTIFIC"] = serie_temporal["DT_NOTIFIC"].dt.strftime(
            "%Y-%m-%d"
        )

        intervalo_semestral = (
            pd.date_range(
                start="2021-07-01", end=serie_temporal["DT_NOTIFIC"].max(), freq="6MS"
            )
            .strftime("%Y-%m-%d")
            .to_list()
        )

        return {
            "serieTemporal": serie_temporal.to_dict(orient="records"),
            "intervaloSemestral": intervalo_semestral,
        }

    def occurrence_by_sex(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        group = self.df.groupby("CS_SEXO").size().reset_index()

        return {
            "sex": group["CS_SEXO"]
            .apply(lambda x: "Feminino" if x == "F" else "Masculino")
            .to_list(),
            "count": group[0].to_list(),
        }

    def occurrence_by_race(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        group = self.df.groupby("CS_RACA").size().reset_index()

        return {
            "race": group["CS_RACA"].to_list(),
            "count": group[0].to_list(),
        }


# fig = go.Figure()

# fig.add_trace(
#     go.Bar(
#         y=group[0],
#         x=group["CS_SEXO"].apply(lambda x: "Feminino" if x == "F" else "Masculino"),
#         marker=dict(color="royalblue", line=dict(color="black", width=1)),
#         text=group[0],
#         textposition="outside",
#     )
# )

# fig.update_xaxes(showline=True, linewidth=1, linecolor="black")
# fig.update_yaxes(showline=True, linewidth=1, linecolor="black")

# fig.update_layout(
#     title="Número de Ocorrências por Sexo",
#     title_x=0.5,
#     title_y=0.9,
#     width=900,
#     height=600,
#     template="plotly_white",
#     xaxis_title="Sexo",
#     yaxis_title="Número de Ocorrências",
# )

# fig.show()
