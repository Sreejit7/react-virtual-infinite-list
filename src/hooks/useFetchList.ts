import useSWRInfinite from "swr/infinite";
import axios from "axios";

const openLibAxiosInstance = axios.create({
  baseURL: "https://openlibrary.org",
});

interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  key: string;
}

interface BookData {
  start: number;
  num_found: number;
  docs: Book[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getPaginatedData = async (url: string) => {
  const { data } = await openLibAxiosInstance.get<BookData>(url);

  return data;
};

const getKey = (pageIndex: number) => {
  return `search.json?q=the+lord+of+the+rings&page=${pageIndex + 1}&limit=50`;
};

export const useFetchPaginatedList = () => {
  const result = useSWRInfinite(getKey, getPaginatedData, {
    onSuccess(data, key, config) {
      console.log(data);
    },
    revalidateFirstPage: false,
  });

  return {
    ...result,
    mergedData:
      result.data?.reduce(
        (prevData, nextData) => [...prevData, ...nextData.docs],
        [] as Book[]
      ) || [],
  };
};
