import { useEffect, useState } from "react";

/**
 * This function fetches data from a JSON file
 * @param url the url of the JSON file
 * @returns the fetched data
 */
const useFetch = (url: string) => {
  const [data, setData] = useState();
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setData(data);
        setIsFetching(false);
      });
  }, []);

  return { data, isFetching };
};

export default useFetch;
