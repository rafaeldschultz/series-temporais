import { useTheme } from "@emotion/react";
import { alpha } from "@mui/material";
import React from "react";
import Plot from "react-plotly.js";

const CorrelogramPlot = ({ data, sx }) => {
  const theme = useTheme();
  const { autocorrelations, lowerY, upperY } = data;

  const plotData = [
    // Vertical lines for each lag
    ...autocorrelations.map((autocorrelation, x) => ({
      x: [x, x],
      y: [0, autocorrelation],
      mode: "lines",
      line: { color: "#3f3f3f" },
      hoverinfo: "skip",
    })),

    // Markers for each autocorrelation point
    {
      x: Array.from(Array(autocorrelations.length).keys()),
      y: autocorrelations,
      mode: "markers",
      marker: { color: "#264653", size: 12 },
      hovertemplate: "Lag: %{x}<br>Autocorrelação: %{y:.2f}<extra></extra>",
    },

    // Upper confidence interval line
    {
      x: Array.from(Array(autocorrelations.length).keys()),
      y: upperY,
      mode: "lines",
      line: { color: "rgba(255,255,255,0)" },
      hoverinfo: "skip",
    },

    // Lower confidence interval line with fill to create shaded area
    {
      x: Array.from(Array(autocorrelations.length).keys()),
      y: lowerY,
      mode: "lines",
      line: { color: "rgba(255,255,255,0)" },
      fill: "tonexty",
      fillcolor: alpha(theme.palette.primary.main, 0.3),
      hoverinfo: "skip",
    },
  ];

  const layout = {
    xaxis: {
      title: "Lag",
      showline: true,
      linewidth: 0.5,
      linecolor: "grey",
    },
    yaxis: {
      title: "Autocorrelação",
      zerolinecolor: "#000000",
      showline: true,
      linewidth: 0.5,
      linecolor: "grey",
    },
    showlegend: false,
    template: "plotly_white",
    margin: { l: 60, r: 0, t: 20, b: 60 },
    autosize: true,
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: "100%", height: "100%", ...sx }}
      useResizeHandler={true}
    />
  );
};

export default CorrelogramPlot;
