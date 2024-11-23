import { useQuery } from "@tanstack/react-query";
import api from "../helpers/axios";
import dayjs from "dayjs";
import { Chip } from "@mui/material";
import chroma from "chroma-js";

const fetch = async (page, pageSize) => {
  const params = {
    params: {
      page: page,
      page_size: pageSize,
    },
  };
  const response = await api
    .get("raw_data", params)
    .then((res) => res["data"])
    .catch((err) => {
      console.error(err);
      return null;
    });
  console.log(response);
  return response;
};

const colorMappingSex = {};
const colorMappingRace = {};

const chipColors = chroma.scale(["#5CAAF5", "#B93054"]).mode("lch").colors(6);
const darkFontColor = "#000000";
const lightFontColor = "#FFFFFF";

const getColorForValue = (value, colorMapping) => {
  if (!colorMapping[value]) {
    colorMapping[value] =
      chipColors[Object.keys(colorMapping).length % chipColors.length];
  }
  const backgroundColor = colorMapping[value];
  const fontColor =
    chroma.contrast(backgroundColor, darkFontColor) >
    chroma.contrast(backgroundColor, lightFontColor)
      ? darkFontColor
      : lightFontColor;
  return {
    backgroundColor,
    color: fontColor,
  };
};

const getColumns = () => {
  return [
    {
      field: "DT_NOTIFIC",
      headerName: "Data",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      type: "date",
      valueGetter: (params) => {
        return new dayjs(params.value).toDate();
      },
    },
    {
      field: "DT_DIA_NOME",
      minWidth: 150,
      headerName: "Dia da Semana",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "SIGLA_UF",
      headerName: "Estado",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "ID_MUNICIP",
      headerName: "Munícipio",
      align: "left",
      headerAlign: "left",
      minWidth: 200,
    },
    {
      field: "CS_SEXO",
      headerName: "Sexo",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      renderCell: (params) => {
        const color = getColorForValue(params.value, colorMappingSex);
        return <Chip label={params.value} sx={{ ...color }} />;
      },
    },
    {
      field: "NU_IDADE_N",
      headerName: "Idade",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "CS_RACA",
      headerName: "Etnia",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      renderCell: (params) => {
        const color = getColorForValue(params.value, colorMappingRace);
        return <Chip label={params.value} sx={{ ...color }} />;
      },
    },
    {
      field: "CLASSI_FIN",
      headerName: "Classificação",
      align: "left",
      headerAlign: "left",
      minWidth: 300,
    },
    {
      field: "EVOLUCAO",
      headerName: "Evolução",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
  ];
};

const useRawData = (page, pageSize, select) => {
  const { data, isPending } = useQuery({
    queryKey: ["rawData", page, pageSize],
    queryFn: () => fetch(page, pageSize),
    select,
  });

  const columns = getColumns();

  if (!data) {
    return {
      data: {
        rows: [],
        columns: columns,
      },
      isPending,
    };
  }

  return {
    data: {
      rows: data.data,
      columns: columns,
      rowCount: data.total,
    },
    isPending,
  };
};

export default useRawData;
