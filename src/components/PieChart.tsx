import { Pie } from "react-chartjs-2";

interface Props {
  chartTitle: string;
  chartData: any;
  chartText: string;
}

const PieChart = ({ chartTitle, chartData, chartText }: Props) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartText,
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
