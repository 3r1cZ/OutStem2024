import { Bar } from "react-chartjs-2";

interface Props {
  chartTitle: string;
  chartData: any;
  chartText: string;
}

const BarChart = ({ chartTitle, chartData, chartText }: Props) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartText,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
