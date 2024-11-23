from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq


class RawDataController:
    def __init__(self):
        self.base_path = Path(__file__).resolve().parent.parent.joinpath("datasets")
        self.parquet_path = self.base_path.joinpath("data_srag.parquet")
        self.total_rows = pq.read_metadata(self.parquet_path).num_rows

    def __load_data(self, start: int, end: int):
        if start >= self.total_rows:
            raise ValueError("Invalid start and end values.")
        end = min(end, self.total_rows)

        df = pd.read_parquet(
            self.parquet_path,
            engine="pyarrow",
            filters=[
                ("__index_level_0__", ">=", start),
                ("__index_level_0__", "<", end),
            ],
        )
        df["DT_NOTIFIC"] = pd.to_datetime(
            df["DT_NOTIFIC"], format="%d/%m/%Y"
        ).dt.strftime("%Y-%m-%d")
        df = df.rename(columns={"SG_UF_NOT": "SIGLA_UF"})
        df["id"] = df.index

        return df

    def get_data(self, page: int, page_size: int):
        if page_size <= 0 or page < 0:
            raise ValueError("Page size and page number must be greater than 0.")

        start = page * page_size
        end = start + page_size

        df = self.__load_data(start, end)

        response = {
            "page": page,
            "data": df.to_dict(orient="records"),
            "total": self.total_rows,
        }
        return response
