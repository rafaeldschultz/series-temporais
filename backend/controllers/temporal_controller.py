from pathlib import Path
from typing import Optional

import pandas as pd
from pmdarima import auto_arima
from scipy.stats import jarque_bera
from statsmodels.api import tsa
from statsmodels.stats.diagnostic import acorr_ljungbox
from statsmodels.tsa.seasonal import STL, seasonal_decompose
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller


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
        alpha: Optional[float] = None,
        serie: Optional[pd.Series] = None,
    ):
        if serie is None:
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

    def partial_correlogram(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        granularity: Optional[int] = None,
        diff_order: Optional[int] = None,
        num_lags: Optional[int] = None,
        alpha: Optional[float] = None,
        serie: Optional[pd.Series] = None,
    ):
        if serie is None:
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

            serie = serie.diff().dropna()

            if diff_order:
                serie = serie.diff(diff_order).dropna()
            else:
                serie = serie.diff(7).dropna()

        aux_num_lags = num_lags if num_lags else 25
        aux_alpha = alpha if alpha else 0.01

        corr_array = tsa.pacf(serie, nlags=aux_num_lags, alpha=aux_alpha)

        lower_y = corr_array[1][:, 0] - corr_array[0]
        upper_y = corr_array[1][:, 1] - corr_array[0]

        return {
            "autocorrelations": corr_array[0].tolist(),
            "confidenceIntervals": corr_array[1].tolist(),
            "lowerY": lower_y.tolist(),
            "upperY": upper_y.tolist(),
        }

    def stationarity_test(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        significance_level: Optional[float] = 0.05,
        serie: Optional[pd.Series] = None,
    ):
        if serie is None:
            if uf:
                self.df = self.df[self.df["SIGLA_UF"] == uf]

            if syndrome:
                self.df = self.df[self.df["CLASSI_FIN"] == syndrome]

            if year:
                self.df = self.df[self.df["DT_NOTIFIC"].dt.year == year]

            if evolution:
                self.df = self.df[self.df["EVOLUCAO"] == evolution]

            serie = self.df.groupby("DT_NOTIFIC").size()

        adf_result = adfuller(serie)

        return {
            "testStatistic": adf_result[0],
            "pValue": adf_result[1],
            "criticalValues": adf_result[4],
            "stationary": "True" if adf_result[1] < significance_level else "False",
        }

    def get_stl_decomposition_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        seasonal: Optional[int] = None,
        num_lags: Optional[int] = None,  # Auto Correlogram and P.A.C plot
        alpha: Optional[float] = None,
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

        try:
            stl = STL(serie, seasonal=seasonal if seasonal else 13)
            results = stl.fit()
        except ValueError:
            raise ValueError(
                "Há poucos dados para realizar a decomposição. Tente flexibilizar os filtros."
            )

        serie = serie.reset_index().rename(columns={0: "Count"})
        serie["Trend_values"] = results.trend.values
        serie["Seasonal_values"] = results.seasonal.values
        serie["Resid_values"] = results.resid.values
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        stationarity_test_result = self.stationarity_test(serie=serie["Resid_values"])
        correlogram_data = self.correlogram(
            serie=serie["Resid_values"], num_lags=num_lags, alpha=alpha
        )
        partial_correlogram_data = self.partial_correlogram(
            serie=serie["Resid_values"], num_lags=num_lags, alpha=alpha
        )

        return {
            "stlData": serie.to_dict(orient="list"),
            "stationarityTest": stationarity_test_result,
            "correlogram": correlogram_data,
            "partialCorrelogram": partial_correlogram_data,
        }

    def get_seasonal_decomposition_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        period: Optional[int] = 5,  # Default to daily data if no frequency is specified
        model: Optional[
            str
        ] = "additive",  # The type of decomposition ('additive' or 'multiplicative')
        num_lags: Optional[int] = None,  # Auto Correlogram and P.A.C plot
        alpha: Optional[float] = None,
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

        decomposition = seasonal_decompose(serie, model=model, period=period)

        serie = serie.reset_index().rename(columns={0: "Count"})
        serie["Trend_values"] = decomposition.trend.values
        serie["Seasonal_values"] = decomposition.seasonal.values
        serie["Resid_values"] = decomposition.resid.values
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        serie = serie.dropna()

        stationarity_test_result = self.stationarity_test(serie=serie["Resid_values"])
        correlogram_data = self.correlogram(
            serie=serie["Resid_values"], num_lags=num_lags, alpha=alpha
        )
        partial_correlogram_data = self.partial_correlogram(
            serie=serie["Resid_values"], num_lags=num_lags, alpha=alpha
        )

        return {
            "seasonalData": serie.to_dict(orient="list"),
            "stationarityTest": stationarity_test_result,
            "correlogram": correlogram_data,
            "partialCorrelogram": partial_correlogram_data,
        }

    @staticmethod
    def norm_test(residuos: pd.Series):
        teste = jarque_bera(residuos)
        return {
            "Jarque-Bera": teste.pvalue,
            "normResid": bool(teste.pvalue > 0.05),
        }

    @staticmethod
    def independence_test(residuos: pd.Series, lags: int = 5):
        df = acorr_ljungbox(residuos, lags=[lags], return_df=False)
        return {
            "Ljung-Box": df.iloc[0]["lb_pvalue"],
            "independenceResid": bool(df.iloc[0]["lb_pvalue"] > 0.05),
        }

    def get_predict_data(
        self,
        uf: Optional[str] = None,
        syndrome: Optional[str] = None,
        year: Optional[int] = None,
        evolution: Optional[str] = None,
        forecast_steps: Optional[int] = 30,
        independence_lags: Optional[int] = 4,
        num_lags_correlogram: Optional[int] = 25,  # Auto Correlogram and P.A.C plot
        alpha_correlogram: Optional[int] = 0.01,
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

        """
            Search Best Model
        """
        model_search = auto_arima(
            serie,
            seasonal=True,
            trace=True,
            error_action="ignore",
            suppress_warnings=True,
        )

        aic = model_search.aic()
        order = model_search.order
        seasonal_order = model_search.seasonal_order

        """
            Adjusted Serie
        """
        adjusted_serie = model_search.predict_in_sample()

        fitted_model_resid = serie - adjusted_serie
        norm_result = self.norm_test(fitted_model_resid)
        independence_result = self.independence_test(
            fitted_model_resid, independence_lags
        )

        adjusted_serie = adjusted_serie.reset_index().rename(
            columns={"index": "DT_NOTIFIC", "predicted_mean": "Predict"}
        )
        # adjusted_serie["DT_NOTIFIC"] = adjusted_serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        """
            Model Paramns
        """
        p, d, q = model_search.order
        P, D, Q, m = model_search.seasonal_order

        """
            Adjusted Model and Get Infos
        """
        model = SARIMAX(serie, order=(p, d, q), seasonal_order=(P, D, Q, m))
        results = model.fit(disp=False, maxiter=500)
        forecast = results.get_forecast(steps=forecast_steps)

        pred_mean = forecast.predicted_mean
        pred_mean = pred_mean.reset_index().rename(columns={"index": "DT_NOTIFIC"})
        pred_mean["DT_NOTIFIC"] = pred_mean["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        pred_conf = forecast.conf_int(alpha=0.05)
        pred_conf = pred_conf.reset_index().rename(columns={"index": "DT_NOTIFIC"})
        pred_conf["DT_NOTIFIC"] = pred_conf["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        pred_resid = results.resid.reset_index().rename(
            columns={"index": "DT_NOTIFIC", 0: "Resid"}
        )
        pred_resid["DT_NOTIFIC"] = pred_resid["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")

        pred_resid_correlogram = self.correlogram(
            serie=pred_resid["Resid"],
            num_lags=num_lags_correlogram,
            alpha=alpha_correlogram,
        )
        pred_resid_partial_correlogram = self.partial_correlogram(
            serie=pred_resid["Resid"],
            num_lags=num_lags_correlogram,
            alpha=alpha_correlogram,
        )

        serie = serie.reset_index()
        serie = serie.rename(columns={0: "Count"})
        serie["DT_NOTIFIC"] = serie["DT_NOTIFIC"].dt.strftime("%Y-%m-%d")
        serie["Predict"] = adjusted_serie["Predict"]

        return {
            "aic": aic,  # Card
            "order": order,  # Card
            "seasonalOrder": seasonal_order,  # Card
            "summary": model_search.summary().as_text(),  # Text base64
            "originalSerie": serie.to_dict(orient="list"),  # Serie
            # "adjustedSerie":adjusted_serie.to_dict(orient="list"),   # Serie
            "normTest": norm_result,  # Card
            "independenceTest": independence_result,  # Card
            "predictResid": pred_resid.to_dict(orient="list"),  # Serie
            "predictMean": pred_mean.to_dict(orient="list"),  # Serie
            "predictConf": pred_conf.to_dict(orient="list"),  # Serie
            "predictCorrelogram": pred_resid_correlogram,  # Corr
            "predictPartialCorrelogram": pred_resid_partial_correlogram,  # Corr
        }

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
