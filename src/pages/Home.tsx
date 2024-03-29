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
  const [startDateFilter, setStartDate] = useState("2023-01-01");
  const [endDateFilter, setEndDate] = useState("2023-12-31");
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
    startDate: string,
    endDate: string,
    filterParent = "None",
    filter = "Default",
    filterItem = "None"
  ) => {
    let count = 0;
    data.forEach((element: any) => {
      if (
        element[category] === type &&
        element["date"] >= startDate &&
        element["date"] <= endDate
      ) {
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

  // getting data to display in a chart given:
  // tags: labels of the graph
  // dataName: the label of each individual section of data
  // dataset: the dataset to query
  // colors: colors of each bar
  // filter: the filter for the data (optional)
  // startDate: the start date for the data (optional)
  // endDate: the end date for the data (optional)
  const data = (
    tags: string[],
    dataName: string,
    dataset: any,
    category: string,
    colors: string[],
    filter = "Default",
    startDate = "2023-01-01",
    endDate = "2023-12-31"
  ) => {
    if (filter === "Default") {
      return {
        labels: tags,
        datasets: [
          {
            label: dataName,
            data: tags.map((tag) =>
              getCount(dataset, category, tag, startDate, endDate)
            ),
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      };
    } else {
      // get count of each individual filter item
      // first, get tags/labels of the filter by looping through pricing data
      let filterTags = new Set<string>();
      let dataToReturn: any = [];
      if (filter === "type") {
        for (let item in pricingData) {
          filterTags.add(item);
        }
      } else if (filter === "size") {
        // loop through first item
        for (let item in pricingData) {
          for (let size in pricingData[item]) {
            filterTags.add(size);
          }
          break;
        }
      }

      let filterTagArr = Array.from(filterTags);

      // return data for each tag as a separate column in the graph
      filterTagArr.forEach((filterTag, index) => {
        dataToReturn.push({
          label: filterTag,
          data: tags.map((tag) =>
            getCount(
              dataset,
              category,
              tag,
              startDate,
              endDate,
              "items",
              filter,
              filterTag
            )
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
  const getEarningsForMonth = (
    month: string,
    startDate = "2023-01-01",
    endDate = "2023-12-31"
  ) => {
    let price = 0;
    orderData.forEach((order: any) => {
      if (
        order["date"].substring(5, 7) === month &&
        order["date"] >= startDate &&
        order["date"] <= endDate
      ) {
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
  const earningData = (
    dataName: string,
    colors: string[],
    startDate = "2023-01-01",
    endDate = "2023-12-31"
  ) => {
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
          data: monthsInNum.map((month) =>
            getEarningsForMonth(month, startDate, endDate)
          ),
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
            <label htmlFor="start-date" className="label-text">
              Start Date:
            </label>
            <input
              type="date"
              className="date-filter-text"
              id="start-date"
              value={startDateFilter}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
            <label htmlFor="end-date" className="label-text">
              End Date:
            </label>
            <input
              type="date"
              className="date-filter-text"
              id="end-date"
              value={endDateFilter}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="display-data">
            <div className="graph-container">
              <LineChart
                chartTitle="Monthly Earnings"
                chartData={earningData(
                  "Earnings",
                  ["white"],
                  startDateFilter,
                  endDateFilter
                )}
                chartText="Earnings per Month ($)"
                className="earnings-graph"
              ></LineChart>
            </div>
            <div className="counter-container">
              <div>
                <h3>Total Money Earned in 2023:</h3>
              </div>
              <div className="dollar-text">
                <p className="dollar-sign">$</p>
                <AnimationCounter
                  from={0}
                  to={getEarningsForYear()}
                  className="dollar-sign"
                ></AnimationCounter>
              </div>
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
                    "Default",
                    startDateFilter,
                    endDateFilter
                  )}
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
                    "type",
                    startDateFilter,
                    endDateFilter
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
                    "size",
                    startDateFilter,
                    endDateFilter
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
                  ],
                  "Default",
                  startDateFilter,
                  endDateFilter
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
