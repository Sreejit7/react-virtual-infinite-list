import { MutableRefObject, useCallback, useRef } from "react";

export const useInfiniteScroll = (
  fetchNextPage: () => void,
  skipSettingRef: boolean,
  isValidating: boolean,
  isLoading: boolean
) => {
  // Setting up the observer
  const observer = useRef() as MutableRefObject<IntersectionObserver>;

  const targetResultRef = useCallback(
    (node: HTMLLIElement) => {
      if (skipSettingRef) {
        return;
      }
      // Disconnect current observer, as we want to set-up a new one
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        // Increase page number if the last result is visible & more data is available
        if (entries[0].isIntersecting && typeof fetchNextPage === "function") {
          fetchNextPage();
        }
      });

      if (node) {
        observer.current?.observe(node);
      }
    },
    [isLoading, isValidating]
  );

  return { offsetTargetElementRef: targetResultRef };
};
