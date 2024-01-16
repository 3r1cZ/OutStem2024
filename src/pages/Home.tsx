import { useEffect, useState } from "react";
import AnimationFadeIn from "../components/AnimationFadeIn";
import PieChart from "../components/PieChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import Dropdown from "../components/Dropdown";
import "../css/Home.css";
import AnimationCounter from "../components/AnimationCounter";

interface Props {
  reviewData: any;
  orderData: any;
  pricingData: any;
}

const Home = ({ reviewData, orderData, pricingData }: Props) => {
  const [sentimentTags, setSentimentTags] = useState<string[]>();
  const [stores, setStores] = useState<string[]>();
  const [barChartFilter, setBarChartFilter] = useState("Default");
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
  // additionally, there is a filter to search a level deeper
  const getCount = (
    data: any,
    category: string,
    type: string,
    filterParent = "None",
    filter = "Default",
    filterItem = "None"
  ) => {
    let count = 0;
    data.forEach((element: any) => {
      if (element[category] === type) {
        if (filter === "Default") {
          count++;
        } else {
          // ex. category = store, type = Kanata, filterParent = items, filter = type, filterItem = Cheese
          element[filterParent].forEach((item: any) => {
            if (item[filter] === filterItem) {
              count++;
            }
          });
        }
      }
    });
    return count;
  };

  // getting data to display in a chart given labels (tags), the name of the data on hover, dataset, type of data to look for, and colors
  // https://stackoverflow.com/questions/28180871/grouped-bar-charts-in-chart-js
  const data = (
    tags: string[],
    dataName: string,
    dataset: any,
    category: string,
    colors: string[],
    filter = "Default"
  ) => {
    if (filter === "Default") {
      return {
        labels: tags,
        datasets: [
          {
            label: dataName,
            data: tags.map((tag) => getCount(dataset, category, tag)),
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      };
    } else {
      // get count of each individual filter item
      // first, get tags of the filter
      let filterTags = new Set<string>();
      let dataToReturn: any;
      dataToReturn = [];
      orderData.forEach((order: any) => {
        let items = order["items"];
        items.forEach((item: any) => {
          filterTags.add(item[filter]);
        });
      });

      let filterTagArr = Array.from(filterTags);

      // return data for each tag as a separate column in the graph
      filterTagArr.forEach((filterTag, index) => {
        dataToReturn.push({
          label: filterTag,
          data: tags.map((tag) =>
            getCount(dataset, category, tag, "items", filter, filterTag)
          ),
          backgroundColor: colors[index],
          borderColor: "white",
          borderWidth: 2,
        });
      });
      return {
        labels: tags,
        datasets: dataToReturn,
        backgroundColor: colors,
        borderColor: "white",
        borderWidth: 2,
      };
    }
  };

  // function to get the earnings for a given year (currently only for 2023)
  const getEarningsForYear = () => {
    let earnings = 0;
    for (let i = 1; i < 13; i++) {
      if (i < 10) {
        earnings = earnings += getEarningsForMonth("0" + i);
      } else {
        earnings = earnings += getEarningsForMonth(i.toString());
      }
    }
    return earnings;
  };

  // function to get the earnings for a given month
  const getEarningsForMonth = (month: string) => {
    let price = 0;
    orderData.forEach((order: any) => {
      if (order["date"].substring(5, 7) === month) {
        order.items.forEach((item: any) => {
          price += calcPrice(item);
        });
      }
    });
    return price;
  };

  // function to calculate the price of a given item
  const calcPrice = (item: any) => {
    let type = item.type;
    let size = item.size;
    return pricingData[type][size];
  };

  const monthsInNum = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  // function that returns earning data for a year
  const earningData = (dataName: string, colors: string[]) => {
    return {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: dataName,
          data: monthsInNum.map((month) => getEarningsForMonth(month)),
          backgroundColor: colors,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };
  };

  return (
    <AnimationFadeIn>
      {sentimentTags !== undefined && stores !== undefined && (
        <div className="page">
          <div className="heading">
            <h1 className="title-text">A Slice of Pi</h1>
          </div>
          <div className="display-data">
            <div className="graph-container">
              <h3>Total Money Earned in 2023:</h3>
              <p className="earnings-text">$</p>
              <AnimationCounter
                from={0}
                to={getEarningsForYear()}
                className="earnings-text"
              ></AnimationCounter>
            </div>
            <div className="graph-container">
              <LineChart
                chartTitle="Monthly Earnings"
                chartData={earningData("Earnings", ["white"])}
                chartText="Earnings per Month ($)"
                className="earnings-graph"
              ></LineChart>
            </div>
            <div className="graph-container">
              <Dropdown
                dropdownTitles={["Default", "Pizza Type", "Pizza Size"]}
                onClick={(filter) => {
                  if (filter === "Default") {
                    setBarChartFilter("Default");
                  } else if (filter === "Pizza Type") {
                    setBarChartFilter("Pizza Type");
                  } else if (filter === "Pizza Size") {
                    setBarChartFilter("Pizza Size");
                  }
                }}
              />
              {barChartFilter === "Default" ? (
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
                  className="order-graph"
                ></BarChart>
              ) : barChartFilter === "Pizza Type" ? (
                <BarChart
                  chartTitle="Items Ordered by Pizza Type"
                  chartData={data(
                    stores,
                    "Orders",
                    orderData,
                    "store",
                    [
                      "rgb(255, 99, 132)",
                      "rgb(54, 162, 235)",
                      "rgb(255, 205, 86)",
                      "rgb(244,242,107)",
                      "rgb(107,244,140)",
                    ],
                    "type"
                  )}
                  chartText="Note: numbers are due to multiple items per order"
                  className="order-graph"
                ></BarChart>
              ) : (
                <BarChart
                  chartTitle="Items Ordered by Pizza Size"
                  chartData={data(
                    stores,
                    "Orders",
                    orderData,
                    "store",
                    [
                      "rgb(255, 99, 132)",
                      "rgb(54, 162, 235)",
                      "rgb(255, 205, 86)",
                      "rgb(244,242,107)",
                      "rgb(107,244,140)",
                    ],
                    "size"
                  )}
                  chartText="Note: numbers are due to multiple items per order"
                  className="order-graph"
                ></BarChart>
              )}
            </div>
            <div className="graph-container">
              <PieChart
                chartTitle="Customer Reviews"
                chartData={data(
                  sentimentTags,
                  "Users",
                  reviewData,
                  "sentiment",
                  [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(244,242,107)",
                  ]
                )}
                chartText="Sentiments of Customer Reviews"
                className="review-graph"
              />
            </div>
          </div>
        </div>
      )}
    </AnimationFadeIn>
  );
};

export default Home;
