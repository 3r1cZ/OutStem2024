import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import useFetch from "./hooks/useFetch";

function App() {
  const { data: reviewData, isFetching } = useFetch("/data/review_data.json");
  let reviewDataString, reviewDataParsed;
  if (!isFetching) {
    reviewDataString = JSON.stringify(reviewData);
    reviewDataParsed = JSON.parse(reviewDataString);
  }
  return (
    <BrowserRouter>
      {!isFetching && (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home reviewData={reviewDataParsed} />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
