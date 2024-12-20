import { useQuery } from "@tanstack/react-query";
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
    .get("predict_data", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  return response;
};

const usePredict = (federalState, syndrome, year, evolution, select) => {
  return useQuery({
    queryKey: ["predict", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
    select,
  });
};

export default usePredict;
