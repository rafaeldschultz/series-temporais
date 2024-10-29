import os
from pathlib import Path

import pandas as pd


class TemporalController:
    def __init__(self):
        self.df = self.__load_data()

    def __load_data(self):
        base_path = Path(__file__).resolve().parent.parent.joinpath("utils")
        variaveis = [
            "DT_NOTIFIC",
            "SG_UF_NOT",
            "ID_MUNICIP",
            "CS_SEXO",
            "CS_RACA",
            "EVOLUCAO",
            "CLASSI_FIN",
        ]
        csvs = [
            "INFLUD21-01-05-2023.csv",
            "INFLUD22-03-04-2023.csv",
            "INFLUD23-23-09-2024.csv",
            "INFLUD24-23-09-2024.csv",
        ]

        path_file = base_path.joinpath(csvs[0])
        df = pd.read_csv(path_file, delimiter=";", usecols=variaveis)

        for csv in csvs[1:]:
            path_file = base_path.joinpath(csv)
            aux_frame = pd.read_csv(path_file, delimiter=";", usecols=variaveis)
            df = pd.concat([df, aux_frame], ignore_index=True)

        class_map = {
            1: "Influenza",
            2: "Vírus respiratório",
            3: "Outro agente etiológico",
            4: "Não especificado",
        }

        df["CLASSI_FIN"] = df["CLASSI_FIN"].map(class_map)
        df["DT_NOTIFIC"] = pd.to_datetime(df["DT_NOTIFIC"], format="%d/%m/%Y")
        return df

    def get_temporal_data(self):
        serie_temporal = self.df["DT_NOTIFIC"].value_counts().sort_index().reset_index()
        serie_temporal["DT_NOTIFIC"] = serie_temporal["DT_NOTIFIC"].dt.strftime(
            "%Y-%m-%d"
        )

        self.df.rename(columns={"SG_UF_NOT": "SIGLA_UF"}, inplace=True)

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
