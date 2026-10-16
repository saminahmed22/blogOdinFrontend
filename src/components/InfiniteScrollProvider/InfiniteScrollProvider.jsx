import styles from "./InfiniteScrollProvider.module.css";

// Hooks
import { useState, useEffect, useRef, useCallback, Fragment } from "react";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import upIcon from "../../assets/icons/up.svg";

// ********************************************************************************************
// _________Required state structure
/*
{
    status: "fetching",

    currentReInitializeFactorValue: null,

    scrollPosition: 0,

    config: {
      initial: true,

      quantity: 10,
      totalContentCount: 0,
      totalContentFetched: 0,

      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
    },

    content: {},
  }
*/

// ********************************************************************************************

export default function InfiniteScrollProvider({
  Card,
  fetchFunction,
  reInitializeFactor,
  queryParams,
  contentState,
  setContentState,
  options = {
    cardsSeparator: true,
    scrollTopBtn: true,
    customLoadingMessage: null,
    customErrorMessage: null,
    customNoContentMessage: null,
  },
}) {
  //#region States
  const [showScrollTop, setShowScrollTop] = useState(false);
  //#endregion

  //#region Refs
  const providerRef = useRef();
  const contentStateRef = useRef(contentState);
  const fetchingOnReqRef = useRef(false);
  const scrollRef = useRef(contentState.scrollPosition);
  //#endregion

  //#region Update state functions
  const updateContentState = useCallback(
    (result) => {
      const buildingObj = {
        status: "fetching",

        currentReInitializeFactorValue: null,

        scrollPosition: 0,

        config: {
          initial: true,

          quantity: 10,
          totalContentCount: 0,
          totalContentFetched: 0,

          hasMore: false,
          cursor: undefined,
        },

        content: { ...contentStateRef.current.content }, // Repopulates the content object with previously fetched content for infinite scroll scenario
      };

      // Set fetch initial status
      if (!result.success) {
        buildingObj.status = "error";

        contentStateRef.current = buildingObj;

        setContentState(buildingObj);

        return;
      }

      buildingObj.status = "success";

      buildingObj.currentReInitializeFactorValue = reInitializeFactor;

      buildingObj.scrollPosition = scrollRef.current;

      // Set initial status to false
      buildingObj.config.initial = false;

      // Set totalContentCount from the count number from result if
      // result is initial, else reuse the totalcount from previous state
      buildingObj.config.totalContentCount = contentStateRef.current.config
        .initial
        ? result.count
        : contentStateRef.current.config.totalContentCount;

      //   sets the total number fetched content
      buildingObj.config.totalContentFetched = contentStateRef.current.config
        .initial
        ? result.content.length
        : contentStateRef.current.config.totalContentFetched +
          result.content.length;

      buildingObj.config.hasMore =
        buildingObj.config.totalContentCount >
        buildingObj.config.totalContentFetched;

      buildingObj.config.cursor = buildingObj.config.hasMore
        ? result.content[result.content.length - 1]?.id
        : undefined;

      // Update content object
      for (const item of result.content) {
        buildingObj.content[item.id] = item;
      }

      contentStateRef.current = buildingObj;

      setContentState(buildingObj);
    },
    [setContentState, reInitializeFactor],
  );

  const resetAllStates = useCallback(() => {
    const buildingObj = {
      status: "fetching",

      currentReInitializeFactorValue: null,

      scrollPosition: 0,

      config: {
        initial: true,

        quantity: 10,
        totalContentCount: 0,
        totalContentFetched: 0,

        hasMore: false,
        count: 0,
        amount: 0,
        cursor: undefined,
      },

      content: {},
    };

    contentStateRef.current = buildingObj;

    setContentState(buildingObj);

    setShowScrollTop(false);
  }, [setContentState]);
  //#endregion

  //#region Function responsible for all the fetching ahaha
  const fetchContent = useCallback(async () => {
    const params = {
      quantity: contentStateRef.current.config.quantity,
      cursor: contentStateRef.current.config.cursor,
      initial: contentStateRef.current.config.initial,

      ...queryParams,
    };

    const result = await fetchFunction(params);

    fetchingOnReqRef.current = false;

    updateContentState(result);
  }, [fetchFunction, queryParams, updateContentState]);
  //#endregion

  //#region Effects

  // Initial Post fetch
  const initialEffectRef = useRef(true);
  useEffect(() => {
    if (!contentStateRef.current.config.initial) return;

    if (initialEffectRef.current) {
      initialEffectRef.current = false;
      return;
    } // Returns on initial run

    const fetchFunc = async () => {
      fetchContent();
    };

    fetchFunc();
  }, [fetchContent]);

  // changes on reInitializeFactor will retrigger the initial fetch, which also resets the states
  useEffect(() => {
    providerRef.current.scrollTo({
      top: scrollRef.current,
      behavior: "instant",
    });

    if (
      contentStateRef.current.config.initial ||
      contentStateRef.current.currentReInitializeFactorValue ===
        reInitializeFactor
    )
      return;

    resetAllStates();

    const fetchFunc = async () => {
      fetchContent();
    };

    fetchFunc();
  }, [fetchContent, resetAllStates, reInitializeFactor]);

  // Refetch on scroll handler
  const showScrollTopRef = useRef(showScrollTop);
  useEffect(() => {
    const providerElemRef = providerRef.current;

    const handleScroll = async () => {
      const scrollTopPos = providerElemRef.scrollTop;
      const scrollHeightPos = providerElemRef.scrollHeight;
      const clientHeightPos = providerElemRef.clientHeight;

      scrollRef.current = scrollTopPos;

      if (scrollTopPos >= 500) {
        if (!showScrollTopRef.current) {
          showScrollTopRef.current = true;

          setShowScrollTop(true);
        }
      } else {
        if (showScrollTopRef.current) {
          showScrollTopRef.current = false;

          setShowScrollTop(false);
        }
      }

      const percentage =
        (scrollTopPos / (scrollHeightPos - clientHeightPos)) * 100;

      if (
        percentage >= 70 &&
        contentStateRef.current.config.hasMore &&
        !fetchingOnReqRef.current
      ) {
        fetchingOnReqRef.current = true;
        fetchContent();
      }
    };

    providerElemRef.addEventListener("scroll", handleScroll);

    return () => {
      providerElemRef.removeEventListener("scroll", handleScroll);

      // Sets the scroll position to the state before component unmounts
      setContentState((prev) => ({
        ...prev,
        scrollPosition: scrollRef.current,
      }));
    };
  }, [fetchContent, setContentState]);
  //#endregion

  //#region Button Click handlers
  const handleScrollTopClick = () => {
    providerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  //#endregion

  //#region Render cards
  const getSeparator = (index, id) => {
    if (!options.cardsSeparator) return;

    const arrLen = Object.keys(contentState.content).length;

    if (index >= 0 && index < arrLen - 1) {
      return <hr key={`${id}_hr`} className={styles.cardSeparator} />;
    }
  };

  const getCard = (id, data, index) => {
    return (
      <Fragment key={`Fragment_${id}`}>
        <Card key={id} data={data} />

        {getSeparator(index, id)}
      </Fragment>
    );
  };

  const getContentElements = () => {
    switch (contentState.status) {
      case "fetching":
        return (
          <div className={styles.messageContainer}>
            <img src={loadingIcon} alt="Loading icon" />
            <p className={styles.message}>
              {options.customLoadingMessage || "Loading"}
            </p>
          </div>
        );

      case "success":
        if (Object.keys(contentState.content).length >= 1) {
          return (
            <>
              {Object.keys(contentState.content).map((id, index) =>
                getCard(id, contentState.content[id], index),
              )}

              {contentState.config.hasMore && (
                <div className={styles.messageContainer}>
                  <img src={loadingIcon} alt="Loading icon" />
                  <p className={styles.message}>Loading more </p>
                </div>
              )}
            </>
          );
        } else {
          return (
            <div className={styles.messageContainer}>
              <p className={styles.message}>
                {options.customNoContentMessage || "No content to see here :("}
              </p>
            </div>
          );
        }

      case "error":
        return (
          <div className={styles.messageContainer}>
            <p className={styles.message}>
              {options.customErrorMessage || "Failed to fetch"}
            </p>
          </div>
        );
    }
  };
  //#endregion

  return (
    <div className={styles.InfiniteScrollProvider} ref={providerRef}>
      {getContentElements()}

      {options.scrollTopBtn && (
        <button
          className={`${styles.scrollTopBtn} ${showScrollTop ? styles.scrollTopBtnShow : styles.scrollTopBtnHide}`}
          aria-label="Scroll top"
          title="Scroll top"
          onClick={handleScrollTopClick}
        >
          <img src={upIcon} alt="Up icon" />
        </button>
      )}
    </div>
  );
}
