import { useCallback } from "react";
import {
  ListChildComponentProps,
  VariableSizeList as List,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import "./App.css";
import { useFetchPaginatedList } from "./hooks/useFetchList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

const PAGE_SIZE = 50;
const OFFSET_FOR_NEXT_FETCH = 30;

function App() {
  const {
    data,
    isLoading,
    error,
    setSize,
    size,
    isValidating,
    mergedData: allBooks,
  } = useFetchPaginatedList(PAGE_SIZE, "the lord of the rings");

  const isReachingEnd = data
    ? data[data.length - 1].docs.length < PAGE_SIZE
    : null;

  const { offsetTargetElementRef } = useInfiniteScroll(
    () => setSize(size + 1),
    isLoading || isValidating || (isReachingEnd !== null && isReachingEnd),
    isValidating,
    isLoading
  );

  const Book = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const listOfBooks = allBooks || [];
      const doc = listOfBooks[index];
      return index === listOfBooks.length - OFFSET_FOR_NEXT_FETCH ? (
        <li
          key={doc.key}
          ref={offsetTargetElementRef}
          style={style}
          className="book-item"
        >
          <b>{doc?.title}</b>
        </li>
      ) : (
        <li key={doc.key} style={style} className="book-item">
          <span>{doc?.title}</span>
        </li>
      );
    },
    [isLoading, isValidating]
  );

  return (
    <main className="page">
      <h2>The lord of the rings books</h2>
      {data && (
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={allBooks?.length || 1000}
              itemSize={() => 70}
            >
              {Book}
            </List>
          )}
        </AutoSizer>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error!</p>}
    </main>
  );
}

export default App;

{
  /* {data.map((books) => {
              const listOfBooks = books.docs;
              return listOfBooks.map((doc: any, index: number) => {
                if (
                  index ===
                  listOfBooks.length - offSetToTriggerFetchingNextPageData
                ) {
                  return (
                    <li
                      key={doc.key}
                      ref={targetResultRef}
                      className="book-item"
                    >
                      <b>{doc.title}</b>
                    </li>
                  );
                } else {
                  return (
                    <li key={doc.key} className="book-item">
                      <span>{doc.title}</span>
                    </li>
                  );
                }
              });
            })} */
}
