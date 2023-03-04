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

interface Params {
  q: string;
  page: number;
  limit: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getPaginatedData = async ([url, params]: [string, Params]) => {
  const { data } = await openLibAxiosInstance.get<BookData>(url, { params });

  return data;
};

const getKey = (pageIndex: number) => {
  const params: Params = {
    q: "the lord of the rings",
    page: pageIndex + 1,
    limit: 50,
  };
  return [`search.json`, params];
};

export const useFetchPaginatedList = (pageSize: number, query: string) => {
  const result = useSWRInfinite(
    (pageIndex: number) => {
      return [
        `search.json`,
        { q: query, page: pageIndex + 1, limit: pageSize },
      ];
    },
    getPaginatedData,
    {
      onSuccess(data, key, config) {
        console.log(data);
        console.log(key);
      },
      revalidateFirstPage: false,
    }
  );

  return {
    ...result,
    mergedData:
      result.data?.reduce(
        (prevData, nextData) => [...prevData, ...nextData.docs],
        [] as Book[]
      ) || [],
  };
};
