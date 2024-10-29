import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../../helpers/axios";

const fetch = async () => {
  const response = await api
    .get("temporal")
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  return response;
};

const useTemporalSeries = () => {
  return useQuery({
    queryKey: ["temporalSeries"],
    queryFn: fetch,
  });
};

export default useTemporalSeries;
