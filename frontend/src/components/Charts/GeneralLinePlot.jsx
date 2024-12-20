import { useTheme } from "@emotion/react";
import { useMemo } from "react";
import Plot from "react-plotly.js";

const GeneralLinePlot = ({ plotData, axisLabels, annotations }) => {
  const theme = useTheme();

  const layout = useMemo(
    () => ({
      xaxis: {
        showgrid: false,
        title: {
          text: axisLabels ? axisLabels.x : "",
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
      },
      yaxis: {
        showgrid: true,
        gridcolor: theme.palette.text.disabled,
        zerolinecolor: theme.palette.text.disabled,
        gridwidth: 0.5,
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
      },
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      legend: {
        font: {
          color: theme.palette.text.secondary,
          size: 12,
          family: "Inter",
        },
      },
      font: { color: theme.palette.text.secondary, size: 12, family: "Inter" },
      hoverlabel: {
        bgcolor: theme.palette.background.paper,
        font: { color: theme.palette.text.contrast },
        bordercolor: "#e5e5e5",
      },
      autosize: true,
      annotations: annotations ? annotations : [],
      margin: { l: 60, r: 0, t: 20, b: 60 },
    }),
    [axisLabels, annotations, theme]
  );
  return (
    <Plot
      key={theme.palette.mode} // Ensure re-render on theme change
      data={plotData}
      layout={layout}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );
};

export default GeneralLinePlot;
