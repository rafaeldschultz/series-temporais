import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";

const fetch = async (federalState, syndrome, year, evolution, initial_lag) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
      lag: initial_lag,
    },
  };
  const response = await api
    .get("serie_lag_plot", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });

  return response;
};

const useTemporalLags = (
  federalState,
  syndrome,
  year,
  evolution,
  initial_lag,
  select
) => {
  return useQuery({
    queryKey: [
      "temporalLags",
      federalState,
      syndrome,
      year,
      evolution,
      initial_lag,
    ],
    queryFn: () => fetch(federalState, syndrome, year, evolution, initial_lag),
    select,
  });
};

export default useTemporalLags;
