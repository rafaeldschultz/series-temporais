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
    .get("overview", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  console.log(response);
  return response;
};

const useOverview = (federalState, syndrome, year, evolution, select) => {
  return useQuery({
    queryKey: ["overview", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
    select,
  });
};

export default useOverview;
