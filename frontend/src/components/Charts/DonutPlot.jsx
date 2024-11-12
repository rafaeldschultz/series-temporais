import React from "react";
import Plot from "react-plotly.js";

const DonutPlot = ({ data, sx }) => {
  return (
    <Plot
      data={[
        {
          type: "pie",
          values: data.values,
          labels: data.labels,
          hole: 0.45, // Creates the "donut" hole effect
          textinfo: "label+percent", // Show labels and percentages
          marker: {
            colors: ["#1f77b4", "#ff7f0e", "#2ca02c"], // Custom colors for each category
          },
        },
      ]}
      layout={{
        showlegend: false,
        margin: { t: 0, l: 0, r: 0, b: 0 },
        autosize: true,
      }}
      style={{ width: "100%", height: "100%", ...sx }}
      useResizeHandler={true}
    />
  );
};

export default DonutPlot;
