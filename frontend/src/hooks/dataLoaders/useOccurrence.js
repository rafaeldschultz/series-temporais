import { useQuery } from "@tanstack/react-query";
import api from "../../helpers/axios";

const fetch = async (type, federalState, syndrome, year, evolution) => {
  const params = {
    params: {
      uf: federalState,
      syndrome: syndrome,
      year: year,
      evolution: evolution,
    },
  };

  const response = await api
    .get(type, params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  return response;
};

export const useOccurrenceBySex = (
  federalState,
  syndrome,
  year,
  evolution,
  select
) => {
  return useQuery({
    queryKey: ["occurrenceBySex", federalState, syndrome, year, evolution],
    queryFn: () =>
      fetch("occurrence_by_sex", federalState, syndrome, year, evolution),
    select,
  });
};

export const useOccurrenceByRace = (
  federalState,
  syndrome,
  year,
  evolution,
  select
) => {
  return useQuery({
    queryKey: ["occurrenceByRace", federalState, syndrome, year, evolution],
    queryFn: () =>
      fetch("occurrence_by_race", federalState, syndrome, year, evolution),
    select,
  });
};
