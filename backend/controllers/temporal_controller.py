import os
from pathlib import Path
from typing import Optional

import pandas as pd
import numpy as np


class TemporalController:
    def __init__(self):
        self.df = self.__load_data()

    def __load_data(self):
        base_path = Path(__file__).resolve().parent.parent.joinpath("datasets")
        df = pd.read_parquet(base_path.joinpath("data_srag.parquet"))
        df["DT_NOTIFIC"] = pd.to_datetime(df["DT_NOTIFIC"], format="%d/%m/%Y")
        df = df.rename(columns={"SG_UF_NOT": "SIGLA_UF"})
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
    

    def occurrence_by_day(
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
        

        group = self.df.groupby("DT_DIA_NOME").size().reset_index()

        day_in_order = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
        group['DT_DIA_NOME'] = pd.Categorical(group['DT_DIA_NOME'], categories=day_in_order, ordered=True)
        group = group.sort_values('DT_DIA_NOME')

        return {
            "day": group["DT_DIA_NOME"].to_list(),
            "count": group[0].to_list(),
        }
    

    def occurrence_by_age(
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
        
        group = self.df.groupby("NU_IDADE_N").astype(int).to_list()
        group = group.sort_values('NU_IDADE_N')

        return {
            "age": group["NU_IDADE_N"].to_list(),
            "count": group[0].to_list(),
        }

    def serie_rooling_average(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        granularity: Optional[str] = None
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]
        
        serie = self.df["DT_NOTIFIC"].value_counts().reset_index().sort_values("DT_NOTIFIC")

        if granularity:
            serie = serie.resample(granularity, on="DT_NOTIFIC").mean()
        else:
            serie = serie.resample('3D', on="DT_NOTIFIC").mean()
        
        serie = serie.reset_index()
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime('%Y-%m-%d')

        return serie.to_dict(orient="records")


    def serie_differentiation(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        order: Optional[int] = None
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]
        
        serie = self.df['DT_NOTIFIC'].value_counts().reset_index().sort_values('DT_NOTIFIC')
        serie = serie.set_index('DT_NOTIFIC')
        serie = serie.resample('1D').sum()

        if order:
            # Max order is Two
            if order == 2:
                serie = serie.diff(1)
                serie = serie.diff(1)
                serie = serie.iloc[2:]

            else:
                serie = serie.diff(1)
                serie = serie.iloc[1:]

        # Default diffirentiation - 1º order
        else:
            serie = serie.diff(1)
            serie = serie.iloc[1:]
        
        serie = serie.reset_index()
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime('%Y-%m-%d')

        return serie.to_dict(orient="records")


    def serie_exponential_rooling_average(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        granularity: Optional[int] = None
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]
        
        serie = self.df['DT_NOTIFIC'].value_counts().reset_index().sort_values('DT_NOTIFIC')
        serie = serie.set_index('DT_NOTIFIC')

        if granularity:
            serie = serie.ewm(span=granularity, adjust=True).mean()
        else:
            serie = serie.ewm(span=3, adjust=True).mean()

        serie = serie.reset_index()
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime('%Y-%m-%d')

        return serie.to_dict(orient="records")

