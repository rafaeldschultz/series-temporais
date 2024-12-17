import { useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";

const fetch = async (federalState, syndrome, year, evolution, seasonal) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
      seasonal: seasonal,
    },
  };
  const response = await api
    .get("stl_decomposition_data", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  return response;
};

const useDecomposition = (
  federalState,
  syndrome,
  year,
  evolution,
  seasonal,
  select
) => {
  return useQuery({
    queryKey: [
      "decomposition",
      federalState,
      syndrome,
      year,
      evolution,
      seasonal,
    ],
    queryFn: () => fetch(federalState, syndrome, year, evolution, seasonal),
    select,
  });
};

export default useDecomposition;
