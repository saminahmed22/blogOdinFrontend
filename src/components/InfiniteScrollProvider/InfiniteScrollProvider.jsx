import styles from "./InfiniteScrollProvider.module.css";

// Hooks
import { useState, useEffect, useRef, useCallback, Fragment } from "react";

// Components
import LoadingMessage from "../LoadingMessage/LoadingMessage";

// Icons
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

      totalContentFetched: 0,

      hasMore: false,
      cursor: undefined,
    },

    content: {},
  }
*/

// ********************************************************************************************

export default function InfiniteScrollProvider({
  Card,
  CardParams = {},
  fetchFunction,
  reInitializeFactor,
  queryParams,
  contentState,
  setContentState,
  initialDeny = false,
  customParentRef = null,
  options = {
    cardsSeparator: true,
    listStyles: {},
    lastCardStyles: {},
    scrollTopBtn: true,
    customLoadingMessage: null,
    customLoadingMoreMessage: null,
    customErrorMessage: null,
    customNoContentMessage: null,
    customRefetchFailMessage: null,
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
    (response) => {
      let buildingObj = {
        status: "fetching",

        currentReInitializeFactorValue: null,

        scrollPosition: 0,

        config: {
          initial: true,

          quantity: 10,

          totalContentFetched: 0,

          hasMore: false,
          cursor: undefined,
        },

        content: { ...contentStateRef.current.content }, // Repopulates the content object with previously fetched content for infinite scroll scenario
      };

      const result = response.result;

      // Set fetch initial status
      if (!response.success) {
        buildingObj = contentStateRef.current;

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

      //   sets the total number fetched content
      buildingObj.config.totalContentFetched = contentStateRef.current.config
        .initial
        ? result.content.length
        : contentStateRef.current.config.totalContentFetched +
          result.content.length;

      buildingObj.config.hasMore =
        result.content.length >= buildingObj.config.quantity;

      buildingObj.config.cursor = buildingObj.config.hasMore
        ? result.content[result.content.length - 1]?.id
        : undefined;

      // Update content object
      if (result.length >= 1) {
        for (const item of result.content) {
          buildingObj.content[item.id] = item;
        }
      } else {
        buildingObj.content = {};
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

        totalContentFetched: 0,

        hasMore: false,
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

    const response = await fetchFunction(params);

    fetchingOnReqRef.current = false;

    updateContentState(response);
  }, [fetchFunction, queryParams, updateContentState]);
  //#endregion

  //#region Effects

  // Initial Post fetch
  const initialDenyRef = useRef(initialDeny);
  useEffect(() => {
    if (initialDenyRef.current) {
      initialDenyRef.current = false;
      return;
    }

    if (
      !contentStateRef.current.config.initial ||
      contentStateRef.current.currentReInitializeFactorValue ===
        reInitializeFactor ||
      reInitializeFactor === ""
    )
      return;

    const fetchFunc = async () => {
      fetchContent();
    };

    fetchFunc();
  }, [fetchContent, initialDeny, reInitializeFactor]);

  // changes on reInitializeFactor will retrigger the initial fetch, which also resets the states
  useEffect(() => {
    if (customParentRef?.current) {
      customParentRef.current.scrollTo({
        top: scrollRef.current,
        behavior: "instant",
      });
    } else {
      providerRef.current.scrollTo({
        top: scrollRef.current,
        behavior: "instant",
      });
    }

    if (
      contentStateRef.current.config.initial ||
      contentStateRef.current.currentReInitializeFactorValue ===
        reInitializeFactor ||
      reInitializeFactor === ""
    )
      return;

    resetAllStates();

    const fetchFunc = async () => {
      fetchContent();
    };

    fetchFunc();
  }, [fetchContent, resetAllStates, customParentRef, reInitializeFactor]);

  // Refetch on scroll handler
  const showScrollTopRef = useRef(showScrollTop);
  useEffect(() => {
    const providerElemRef = customParentRef?.current || providerRef.current;

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
        !fetchingOnReqRef.current &&
        !contentStateRef.current.config.initial
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
  }, [fetchContent, setContentState, customParentRef]);
  //#endregion

  //#region Button Click handlers
  const handleScrollTopClick = () => {
    if (customParentRef?.current) {
      customParentRef?.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      providerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  //#endregion

  //#region handlers

  const handleCardDelete = (id) => {
    const { [id]: removedContent, ...restOfTheConent } = contentState.content;

    setContentState((prev) => ({
      ...prev,
      config: {
        ...prev.config,

        totalContentFetched: prev.config.totalContentFetched - 1,
      },
      content: restOfTheConent,
    }));
  };

  const handleBookmark = (status, id) => {
    setContentState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          ...prev.content[id],
          _count: { ...prev.content[id]._count, bookmarks: status },
        },
      },
    }));
  };

  const handlePublish = (id) => {
    setContentState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          ...prev.content[id],
          published: true,
        },
      },
    }));
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

  const getCard = ({ id, data, index, responseLen }) => {
    return (
      <Fragment key={`Fragment_${id}`}>
        <Card
          key={id}
          data={data}
          {...CardParams}
          handleDelete={handleCardDelete}
          handleBookmark={handleBookmark}
          handlePublish={handlePublish}
          customStyles={
            index === responseLen - 1 && !contentState?.config?.hasMore
              ? options.lastCardStyles
              : {}
          }
        />

        {getSeparator(index, id)}
      </Fragment>
    );
  };

  const getContentElements = () => {
    switch (contentState.status) {
      case "fetching":
        return <LoadingMessage message={options.customLoadingMessage} />;

      case "success":
        if (
          Object.keys(contentState.content).length >= 1 &&
          Object.keys(contentState.content).length - 1 !==
            contentState?.config?.totalContentFetched
        ) {
          return (
            <>
              {Object.keys(contentState.content).map((id, index) =>
                getCard({
                  id,
                  data: contentState.content[id],
                  index: index,
                  responseLen: Object.keys(contentState.content).length,
                }),
              )}

              {contentState.config.hasMore && (
                <LoadingMessage
                  message={
                    options.customLoadingMoreMessage || "Loading more content"
                  }
                />
              )}
            </>
          );
        } else {
          return (
            <div className={styles.messageContainer}>
              <span className={styles.messageSpan}>
                <p className={styles.message}>
                  {options.customNoContentMessage ||
                    "No content to see here :("}
                </p>
              </span>
            </div>
          );
        }

      case "error":
        return (
          <>
            {contentState.config.hasMore &&
              Object.keys(contentState.content).map((id, index) =>
                getCard(id, contentState.content[id], index),
              )}

            <div className={styles.messageContainer}>
              <span className={styles.messageSpan}>
                <p className={styles.message}>
                  {contentState.config.hasMore
                    ? options.customRefetchFailMessage ||
                      "Failed to fetch more content"
                    : options.customErrorMessage || "Failed to fetch"}
                </p>
              </span>
            </div>
          </>
        );
    }
  };
  //#endregion

  return (
    <div
      className={styles.InfiniteScrollProvider}
      ref={providerRef}
      style={{
        ...options.listStyles,
        ...(customParentRef ? {} : { overflowY: "auto" }),
      }}
    >
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
