import { useTheme } from "@emotion/react";
import { useMemo } from "react";
import Plot from "react-plotly.js";

const LinePlot = ({ data, axisLabels, annotations }) => {
  const theme = useTheme();
  const plotData = useMemo(() => {
    return data.map((item) => ({
      x: item.x,
      y: item.y,
      type: "scatter",
      mode: "points",
      line: { width: 1.5, color: theme.palette.primary.main },
      fillcolor: "#0077b6",
      hovertemplate:
        "%{x|%d - %b - %Y}<br>Número de casos: %{y}<extra></extra>",
    }));
  });

  return (
    <Plot
      data={plotData}
      style={{ width: "100%", height: "100%" }}
      layout={{
        xaxis: {
          showgrid: false,
          title: {
            text: axisLabels ? axisLabels.x : "",
            font: { color: "Black", size: 14, family: "Inter" },
          },
        },
        yaxis: {
          showgrid: true,
          gridcolor: "#e5e5e5",
          zerolinecolor: "#e5e5e5",
          gridwidth: 0.5,
          title: {
            text: axisLabels ? axisLabels.y : "",
            font: { color: "Black", size: 14, family: "Inter" },
          },
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "white",
        legend: { font: { color: "black", size: 12, family: "Inter" } },
        font: { color: "black", size: 12, family: "Inter" },
        hoverlabel: {
          bgcolor: "white",
          font: { color: "black" },
          bordercolor: "#e5e5e5",
        },
        autosize: true,
        annotations: annotations ? annotations : [],
        margin: { l: 60, r: 0, t: 20, b: 60 },
      }}
      useResizeHandler={true}
    />
  );
};

export default LinePlot;
