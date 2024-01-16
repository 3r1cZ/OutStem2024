import { Line } from "react-chartjs-2";

interface Props {
  chartTitle: string;
  chartData: any;
  chartText: string;
  className: string;
}

const LineChart = ({ chartTitle, chartData, chartText, className }: Props) => {
  return (
    <div className={className}>
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Line
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

export default LineChart;
