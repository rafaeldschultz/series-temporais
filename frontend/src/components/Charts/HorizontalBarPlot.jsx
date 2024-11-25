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
  }, [data, theme.palette.primary.main, theme.palette.info.contrast]);

  const layout = useMemo(
    () => ({
      xaxis: {
        title: {
          text: axisLabels ? axisLabels.x : "",
          font: {
            color: theme.palette.text.primary,
            size: 14,
            family: "Inter",
          },
        },
        showline: true,
        linewidth: 1,
        linecolor: "black",
        tickfont: {
          color: theme.palette.text.secondary,
          family: "Inter",
        },
      },
      yaxis: {
        title: {
          text: axisLabels ? axisLabels.y : "",
          font: {
            color: theme.palette.text.primary,
            size: 14,
            family: "Inter",
          },
        },
        tickfont: {
          color: theme.palette.text.secondary,
          family: "Inter",
        },
        showgrid: true,
        gridcolor: theme.palette.text.disabled,
        zerolinecolor: theme.palette.text.disabled,
        gridwidth: 0.5,
      },
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      autosize: true,
      template: "plotly_white",
      margin: { l: 60, r: 0, t: 20, b: 60 },
    }),
    [axisLabels, theme]
  );

  return (
    <Plot
      data={plotData}
      style={{ width: "100%", height: "100%" }}
      layout={layout}
      useResizeHandler={true}
    />
  );
};

export default HorizontalBarPlot;
