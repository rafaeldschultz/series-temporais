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
    .get("serie_stl_decomposition", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });

  return response;
};

const useDecomposition = (federalState, syndrome, year, evolution, select) => {
  return useQuery({
    queryKey: ["decomposition", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
    select,
  });
};

export default useDecomposition;