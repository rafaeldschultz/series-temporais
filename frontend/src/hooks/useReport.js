import { useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";
import { downloadHtmlBase64File } from "../helpers/downloadFile";

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
    .get("report", params)
    .then((res) => downloadHtmlBase64File("report.html", res["data"]));

  return response;
};

const useReport = (federalState, syndrome, year, evolution, select) => {
  return useQuery({
    enabled: false,
    queryKey: ["report", federalState, syndrome, year, evolution],
    queryFn: () => fetch(federalState, syndrome, year, evolution),
    select,
  });
};

export default useReport;
