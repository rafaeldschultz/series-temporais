import Plot from "react-plotly.js";
import { useMemo } from "react";
import { useTheme } from "@mui/material";

const HorizontalBarPlot = ({ data, axisLabels }) => {
  const theme = useTheme();

  const plotData = useMemo(() => {
    return data.map((item) => ({
      x: item.x,
      y: item.y,
      type: "bar",
      marker: {
        color: theme.palette.primary.main,
      },
      text: data.y,
      textposition: "outside",
    }));
  });

  return (
    <Plot
      data={plotData}
      style={{ width: "100%", height: "100%" }}
      layout={{
        xaxis: {
          title: axisLabels ? axisLabels.x : "",
          showline: true,
          linewidth: 1,
          linecolor: "black",
        },
        yaxis: {
          title: axisLabels ? axisLabels.y : "",
          showline: true,
          linewidth: 1,
          linecolor: "black",
        },
        autosize: true,
        template: "plotly_white",
        margin: { l: 60, r: 0, t: 20, b: 60 },
      }}
      useResizeHandler={true}
    />
  );
};

export default HorizontalBarPlot;
