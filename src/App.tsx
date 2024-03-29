import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import useFetch from "./hooks/useFetch";

function App() {
  // fetch data
  const { data: reviewData, isFetching: isFetchingReviews } = useFetch(
    "/OutStem2024/data/review_data.json"
  );
  const { data: orderData, isFetching: isFetchingOrders } = useFetch(
    "/OutStem2024/data/order_data.json"
  );
  const { data: pricingData, isFetching: isFetchingPrices } = useFetch(
    "/OutStem2024/data/pricing_data.json"
  );

  let reviewDataParsed;
  if (!isFetchingReviews) {
    reviewDataParsed = JSON.parse(JSON.stringify(reviewData));
  }
  let orderDataParsed;
  if (!isFetchingOrders) {
    orderDataParsed = JSON.parse(JSON.stringify(orderData));
  }
  let pricingDataParsed;
  if (!isFetchingPrices) {
    pricingDataParsed = JSON.parse(JSON.stringify(pricingData));
  }

  return (
    <BrowserRouter>
      {!isFetchingReviews && !isFetchingOrders && !isFetchingPrices && (
        <Routes>
          <Route path="/OutStem2024/" element={<Layout />}>
            <Route
              index
              element={
                <Home
                  reviewData={reviewDataParsed}
                  orderData={orderDataParsed}
                  pricingData={pricingDataParsed}
                />
              }
            />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
