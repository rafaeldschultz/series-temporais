import Plot from "react-plotly.js";

export default function LinePlot({ width, height }) {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3, 4],
          y: [10, 11, 12, 13],
          type: "scatter",
          mode: "lines+points",
          marker: { color: "red" },
        },
        {
          x: [1, 2, 3, 4],
          y: [12, 13, 10, 15],
          type: "scatter",
          mode: "lines+points",
          marker: { color: "blue" },
        },
      ]}
      style={{ width: "100%", height: "100%" }}
      layout={{ title: "A Fancy Plot", autosize: true }}
      useResizeHandler={true}
    />
  );
}
