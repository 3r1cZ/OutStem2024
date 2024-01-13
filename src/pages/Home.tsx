import { useEffect, useState } from "react";
import AnimationFadeIn from "../components/AnimationFadeIn";
import PieChart from "../components/PieChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

interface Props {
  reviewData: any;
}

const Home = ({ reviewData }: Props) => {
  const [tags, setTags] = useState<string[]>();
  Chart.register(CategoryScale);

  // getting sentiment labels
  useEffect(() => {
    let sentimentTags = new Set<string>();
    reviewData.forEach((review: { sentiment: string }) => {
      sentimentTags.add(review.sentiment);
    });
    setTags(Array.from(sentimentTags));
  }, []);

  // getting number of each sentiment
  const getCount = (type: string) => {
    let count = 0;
    reviewData.forEach((review: { sentiment: string }) => {
      if (review.sentiment === type) {
        count++;
      }
    });
    console.log(count);
    return count;
  };

  return (
    <AnimationFadeIn>
      {tags !== undefined && (
        <div>
          <h1>
            <u>A Slice of Pi</u>
          </h1>
          <div>
            <PieChart
              chartTitle="Customer Reviews"
              chartData={{
                labels: tags,
                datasets: [
                  {
                    label: "Users",
                    data: tags.map((tag) => getCount(tag)),
                    backgroundColor: [
                      "#ff0000",
                      "#0066ff",
                      "#00cc00",
                      "#ffff00",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              }}
              chartText="Sentiments of Customer Reviews"
            />
          </div>
        </div>
      )}
    </AnimationFadeIn>
  );
};

export default Home;
