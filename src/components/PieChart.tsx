import { Pie } from "react-chartjs-2";

interface Props {
  chartTitle: string;
  chartData: any;
  chartText: string;
  className: string;
}

const PieChart = ({ chartTitle, chartData, chartText, className }: Props) => {
  return (
    <div className={className}>
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartText,
            },
            legend: {
              position: "right",
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
