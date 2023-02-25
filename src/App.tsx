import { MutableRefObject, useCallback, useRef } from "react";
import {
  ListChildComponentProps,
  VariableSizeList as List,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import "./App.css";
import { useFetchPaginatedList } from "./hooks/useFetchList";

function App() {
  const {
    data,
    isLoading,
    error,
    setSize,
    size,
    isValidating,
    mergedData: allBooks,
  } = useFetchPaginatedList();

  const isReachingEnd = data ? data[data.length - 1].docs.length < 50 : null;

  const offSetToTriggerFetchingNextPageData = 30;

  // Setting up the observer
  const observer = useRef() as MutableRefObject<IntersectionObserver>;

  const targetResultRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading || isValidating || isReachingEnd) {
        return;
      }
      // Disconnect current observer, as we want to set-up a new one
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        // Increase page number if the last result is visible & more data is available
        if (entries[0].isIntersecting) {
          setSize(size + 1);
        }
      });

      if (node) {
        observer.current?.observe(node);
      }
    },
    [isLoading, isValidating]
  );

  const Book = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const listOfBooks = allBooks || [];
      const doc = listOfBooks[index];
      return index ===
        listOfBooks.length - offSetToTriggerFetchingNextPageData ? (
        <li
          key={doc.key}
          ref={targetResultRef}
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
