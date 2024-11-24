from datetime import date
from pathlib import Path
from typing import Optional

import pandas as pd
import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.dataset as ds
import pyarrow.parquet as pq
from models.filters_models import FiltersModel


class RawDataController:
    def __init__(self):
        self.base_path = Path(__file__).resolve().parent.parent.joinpath("datasets")
        self.parquet_path = self.base_path.joinpath("data_srag.parquet")
        self.total_rows = pq.read_metadata(self.parquet_path).num_rows

    def __format_df(self, df: pd.DataFrame):
        df["DT_NOTIFIC"] = pd.to_datetime(
            df["DT_NOTIFIC"], format="%d/%m/%Y"
        ).dt.strftime("%Y-%m-%d")
        df = df.rename(columns={"SG_UF_NOT": "SIGLA_UF"})
        df["id"] = df.index
        return df

    def __load_data(
        self, offset: int, amount: int, custom_filter: Optional[tuple] = None
    ):
        dataset = ds.dataset(self.parquet_path, format="parquet")

        if custom_filter:
            field, operator, value = custom_filter

            field_expression = ds.field(field)

            if isinstance(value, str):
                field_expression = pc.utf8_upper(field_expression.cast(pa.utf8()))
                value_expression = value.upper()
            elif isinstance(value, pd.Timestamp):
                field_expression = field_expression.cast(pa.date32())
                value_expression = pd.Timestamp(value).tz_localize(None).date()
            else:
                value_expression = value

            filter_expression = operator(field_expression, value_expression)
            dataset = dataset.filter(filter_expression)

        table = dataset.to_table()
        size = table.num_rows
        df = table.slice(offset, amount).to_pandas()

        # df = pd.read_parquet(
        #     self.parquet_path,
        #     engine="pyarrow",
        #     filters=[
        #         ("__index_level_0__", ">=", start),
        #         ("__index_level_0__", "<", end),
        #     ],
        # )

        return self.__format_df(df), size

    def __get_filters(self, query_params: dict):
        operator_readable = query_params.get("operator")
        field = query_params.get("field")

        if field == "SIGLA_UF":
            field = "SG_UF_NOT"

        value = query_params.get("value")

        if field == "DT_NOTIFIC":
            value = pd.to_datetime(value)

        operator = FiltersModel.operator(operator_readable)

        return (field, operator, value)

    def get_data(self, page: int, page_size: int, query_params: Optional[dict] = None):
        if page_size <= 0 or page < 0:
            raise ValueError("Page size and page number must be greater than 0.")

        start = page * page_size

        if query_params:
            df, size = self.__load_data(
                start, page_size, self.__get_filters(query_params)
            )
        else:
            df, size = self.__load_data(start, page_size)

        response = {
            "page": page,
            "data": df.to_dict(orient="records"),
            "total": size,
        }
        return response
