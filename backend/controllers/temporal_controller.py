import os
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from statsmodels.api import tsa
from statsmodels.graphics.tsaplots import plot_pacf
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import pacf


class TemporalController:
    def __init__(self):
        self.df = self.__load_data()

    def __load_data(self):
        base_path = Path(__file__).resolve().parent.parent.joinpath("datasets")
        df = pd.read_parquet(base_path.joinpath("data_srag.parquet"))
        df["DT_NOTIFIC"] = pd.to_datetime(df["DT_NOTIFIC"], format="%d/%m/%Y")
        df = df.rename(columns={"SG_UF_NOT": "SIGLA_UF"})
        return df

    def apply_filters(
        self, uf: str, syndrome: str, year: int, evolution: str
    ) -> pd.DataFrame:
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        return self.df

    def get_temporal_occurences(self):
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

    def occurrence_by_sex(self):
        group = self.df.groupby("CS_SEXO").size().reset_index()

        return {
            "sex": group["CS_SEXO"]
            .apply(lambda x: "Feminino" if x == "F" else "Masculino")
            .to_list(),
            "count": group[0].to_list(),
        }

    def occurrence_by_race(self):
        group = self.df.groupby("CS_RACA").size().reset_index()

        return {
            "race": group["CS_RACA"].to_list(),
            "count": group[0].to_list(),
        }

    def occurrence_by_day(self):
        group = self.df.groupby("DT_DIA_NOME").size().reset_index()

        day_in_order = [
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
            "Domingo",
        ]
        group["DT_DIA_NOME"] = pd.Categorical(
            group["DT_DIA_NOME"], categories=day_in_order, ordered=True
        )
        group = group.sort_values("DT_DIA_NOME")

        return {
            "day": group["DT_DIA_NOME"].to_list(),
            "count": group[0].to_list(),
        }

    def occurrence_by_age(self):
        group = (
            self.df.groupby("NU_IDADE_N").size().reset_index().sort_values("NU_IDADE_N")
        )

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
        granularity: Optional[str] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie = (
            self.df["DT_NOTIFIC"].value_counts().reset_index().sort_values("DT_NOTIFIC")
        )

        if granularity:
            serie = serie.resample(granularity, on="DT_NOTIFIC").mean()
        else:
            serie = serie.resample("3D", on="DT_NOTIFIC").mean()

        serie = serie.reset_index()
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        return serie.to_dict(orient="records")

    def serie_differentiation(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        order: Optional[int] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie = (
            self.df["DT_NOTIFIC"].value_counts().reset_index().sort_values("DT_NOTIFIC")
        )
        serie = serie.set_index("DT_NOTIFIC")
        serie = serie.resample("1D").sum()

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
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        return serie.to_dict(orient="records")

    def serie_exponential_rooling_average(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        granularity: Optional[int] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie = (
            self.df["DT_NOTIFIC"].value_counts().reset_index().sort_values("DT_NOTIFIC")
        )
        serie = serie.set_index("DT_NOTIFIC")

        if granularity:
            serie = serie.ewm(span=granularity, adjust=True).mean()
        else:
            serie = serie.ewm(span=3, adjust=True).mean()

        serie = serie.reset_index()
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        return serie.to_dict(orient="records")

    def correlogram(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        granularity: Optional[int] = None,
        diff_order: Optional[int] = None,
        num_lags: Optional[int] = None,
        alpha: Optional[int] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        if granularity:
            serie = self.df.groupby(
                self.df["DT_NOTIFIC"].dt.to_period(f"{granularity}D")
            ).size()
        else:
            serie = self.df.groupby(self.df["DT_NOTIFIC"].dt.to_period("W")).size()

        serie.index = serie.index.to_timestamp()

        # Remove Trend of the time series
        serie = serie.diff().dropna()

        # Remove Seasonality of the time series
        if diff_order:
            serie = serie.diff(diff_order).dropna()
        else:
            serie = serie.diff(7).dropna()

        aux_num_lags = num_lags if num_lags else 25
        aux_alpha = alpha if alpha else 0.01

        corr_array = tsa.acf(serie, nlags=aux_num_lags, alpha=aux_alpha)

        lower_y = corr_array[1][:, 0] - corr_array[0]
        upper_y = corr_array[1][:, 1] - corr_array[0]

        return {
            "autocorrelations": corr_array[0].tolist(),
            "confidenceIntervals": corr_array[1].tolist(),
            "lowerY": lower_y.tolist(),
            "upperY": upper_y.tolist(),
        }

    def serie_stl_decomposition(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        seasonal: Optional[int] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie = self.df.groupby("DT_NOTIFIC").size()

        stl = STL(serie, seasonal=seasonal if seasonal else 13)
        results = stl.fit()

        serie = serie.reset_index().rename(columns={0: "Count"})
        serie["Trend_values"] = results.trend.values
        serie["Seasonal_values"] = results.seasonal.values
        serie["Resid_values"] = results.resid.values
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        return serie.to_dict(orient="list")

    def serie_lag_plot(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        lag: Optional[int] = None,
    ):
        if uf:
            self.df = self.df[self.df["SIGLA_UF"] == uf]

        if syndrome:
            self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

        if year:
            self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

        if evolution:
            self.df = self.df[self.df["EVOLUCAO"] == evolution]

        serie = self.df.groupby("DT_NOTIFIC").size()

        lag = lag if lag else 4
        y_actual = serie[:-lag].values
        y_lagged = serie.shift(-lag)[:-lag].values

        max_val = float(max(y_actual.max(), y_lagged.max()))
        min_val = float(min(y_actual.min(), y_lagged.min()))

        return {
            "yActual": y_actual.tolist(),
            "yLagged": y_lagged.tolist(),
            "maxVal": max_val,
            "minVal": min_val,
            "lag": lag,
        }

    def get_overview_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        self.df = self.apply_filters(uf, syndrome, year, evolution)

        total_cases = self.df.shape[0]
        total_deaths = self.df[self.df["EVOLUCAO"] == "Óbito"].shape[0]
        total_recovered = self.df[self.df["EVOLUCAO"] == "Cura"].shape[0]

        return {
            "temporalSeries": self.get_temporal_occurences(),
            "general": {
                "totalCases": total_cases,
                "totalDeaths": total_deaths,
                "totalRecovered": total_recovered,
            },
            "occurences": {
                "sex": self.occurrence_by_sex(),
                "race": self.occurrence_by_race(),
                "day": self.occurrence_by_day(),
                "age": self.occurrence_by_age(),
            },
        }

    def get_temporal_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
    ):
        self.df = self.apply_filters(uf, syndrome, year, evolution)
        return {
            "serieDifferentiation": {
                "first": self.serie_differentiation(
                    uf, syndrome, year, evolution, order=1
                ),
                "second": self.serie_differentiation(
                    uf, syndrome, year, evolution, order=2
                ),
            },
            "serieExponentialRoolingAverage": {
                f"{i}D": self.serie_exponential_rooling_average(
                    uf, syndrome, year, evolution, granularity=i
                )
                for i in [3, 5, 7, 14, 28]
            },
            "serieRoolingAverage": {
                f"{i}D": self.serie_rooling_average(
                    uf,
                    syndrome,
                    year,
                    evolution,
                    granularity=f"{i}D",
                )
                for i in [3, 5, 7, 14, 28]
            },
            "serieLagPlot": self.serie_lag_plot(uf, syndrome, year, evolution),
        }

    def get_serie_lag_plot(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        initial_lag: int = 3,
    ):
        return {
            f"{(i + 1) * initial_lag}": self.serie_lag_plot(
                uf, syndrome, year, evolution, (i + 1) * initial_lag
            )
            for i in range(4)
        }
