import { useTheme } from "@emotion/react";
import { alpha } from "@mui/material";
import React, { useMemo } from "react";
import Plot from "react-plotly.js";

const CorrelogramPlot = ({ data, sx }) => {
  const theme = useTheme();

  if (!data) {
    return null;
  }

  const { autocorrelations, lowerY, upperY } = data;

  const plotData = useMemo(
    () => [
      // Vertical lines for each lag
      ...autocorrelations.map((autocorrelation, x) => ({
        x: [x, x],
        y: [0, autocorrelation],
        mode: "lines",
        line: { color: theme.palette.primary.main },
        hoverinfo: "skip",
      })),

      // Markers for each autocorrelation point
      {
        x: Array.from(Array(autocorrelations.length).keys()),
        y: autocorrelations,
        mode: "markers",
        marker: { color: theme.palette.primary.main, size: 8 },
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
        fillcolor: alpha(theme.palette.secondary.main, 0.4),
        hoverinfo: "skip",
      },
    ],
    [data, theme]
  );

  const layout = useMemo(
    () => ({
      xaxis: {
        title: {
          text: "Lag",
          font: {
            color: theme.palette.text.primary,
            size: 14,
            family: "Inter",
          },
        },
        gridcolor: theme.palette.text.disabled,
        zerolinecolor: theme.palette.text.disabled,
        tickfont: {
          color: theme.palette.text.secondary,
          family: "Inter",
        },
      },
      yaxis: {
        title: {
          text: "Autocorrelação",
          font: {
            color: theme.palette.text.primary,
            size: 14,
            family: "Inter",
          },
        },
        gridcolor: theme.palette.text.disabled,
        zerolinecolor: theme.palette.text.disabled,
        tickfont: {
          color: theme.palette.text.secondary,
          family: "Inter",
        },
      },
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      showlegend: false,
      template: "plotly_white",
      margin: { l: 60, r: 0, t: 20, b: 60 },
      autosize: true,
    }),
    [theme]
  );

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
