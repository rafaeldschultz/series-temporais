import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../../helpers/axios";

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

const useTemporalSeries = (federalState, syndrome, year, evolution) => {
  return useQuery({
    queryKey: ["temporalSeries", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
  });
};

export default useTemporalSeries;
