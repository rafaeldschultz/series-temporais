import { useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";

const fetch = async (
  federalState,
  syndrome,
  year,
  evolution,
  period,
  model
) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
      period: period,
      model: model,
    },
  };
  const response = await api
    .get("seasonal_decomposition_data", params)
    .then((res) => res["data"]);
  return response;
};

const useSeasonalDecomposition = (
  federalState,
  syndrome,
  year,
  evolution,
  period,
  model,
  select
) => {
  return useQuery({
    queryKey: [
      "SeasonalDecomposition",
      federalState,
      syndrome,
      year,
      evolution,
      period,
      model,
    ],
    queryFn: () =>
      fetch(federalState, syndrome, year, evolution, period, model),
    select,
  });
};

export default useSeasonalDecomposition;
