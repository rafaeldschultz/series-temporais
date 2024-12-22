import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";

const fetch = async (federalState, syndrome, year, evolution) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
    },
  };
  const response = await api
    .get("temporal", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });

  return response;
};

const fetchCorrelogram = async (
  federalState,
  syndrome,
  year,
  evolution,
  granularity,
  order,
  numLags,
  alpha
) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
      granularity: granularity,
      diff_order: order,
      num_lags: numLags,
      alpha: alpha,
    },
  };
  const response = await api
    .get("correlogram", params)
    .then((res) => res["data"]);
  return response;
};

export const useCorrelogram = (
  federalState,
  syndrome,
  year,
  evolution,
  granularity,
  order,
  numLags,
  alpha,
  select
) => {
  return useQuery({
    queryKey: [
      "correlogram",
      federalState,
      syndrome,
      year,
      evolution,
      granularity,
      order,
      numLags,
      alpha,
    ],
    queryFn: () =>
      fetchCorrelogram(
        federalState,
        syndrome,
        year,
        evolution,
        granularity,
        order,
        numLags,
        alpha
      ),
    select,
  });
};

const useTemporal = (federalState, syndrome, year, evolution, select) => {
  return useQuery({
    queryKey: ["temporal", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
    select,
  });
};

export default useTemporal;
