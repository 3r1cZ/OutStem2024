import { useEffect, useState } from "react";
import AnimationFadeIn from "../components/AnimationFadeIn";
import PieChart from "../components/PieChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BarChart from "../components/BarChart";

interface Props {
  reviewData: any;
  orderData: any;
  pricingData: any;
}

const Home = ({ reviewData, orderData, pricingData }: Props) => {
  const [sentimentTags, setSentimentTags] = useState<string[]>();
  const [stores, setStores] = useState<string[]>();
  Chart.register(CategoryScale);

  // getting sentiment labels
  useEffect(() => {
    let tags = new Set<string>();
    reviewData.forEach((review: { sentiment: string }) => {
      tags.add(review.sentiment);
    });
    setSentimentTags(Array.from(tags));
  }, []);

  // getting store labels
  useEffect(() => {
    let stores = new Set<string>();
    orderData.forEach((order: { store: string }) => {
      stores.add(order.store);
    });
    setStores(Array.from(stores));
  }, []);

  // function to get number of occurrences of data given a dataset, category (ex. sentiment), and type (ex. happy)
  const getCount = (data: any, category: string, type: string) => {
    let count = 0;
    data.forEach((element: any) => {
      if (element[category] === type) {
        count++;
      }
    });
    return count;
  };

  const data = (
    tags: string[],
    dataName: string,
    dataset: any,
    type: string,
    colors: string[]
  ) => {
    return {
      labels: tags,
      datasets: [
        {
          label: dataName,
          data: tags.map((tag) => getCount(dataset, type, tag)),
          backgroundColor: colors,
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <AnimationFadeIn>
      {sentimentTags !== undefined && stores !== undefined && (
        <div>
          <h1>
            <u>A Slice of Pi</u>
          </h1>
          <div>
            <PieChart
              chartTitle="Customer Reviews"
              chartData={data(sentimentTags, "Users", reviewData, "sentiment", [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(244,242,107)",
              ])}
              chartText="Sentiments of Customer Reviews"
            />
          </div>
          <div>
            <BarChart
              chartTitle="Orders Placed"
              chartData={data(stores, "Orders", orderData, "store", [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(244,242,107)",
                "rgb(107,244,140)",
              ])}
              chartText="Orders Placed at Each Location"
            ></BarChart>
          </div>
        </div>
      )}
    </AnimationFadeIn>
  );
};

export default Home;
