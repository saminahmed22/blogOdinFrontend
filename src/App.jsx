// Hooks
import { useState, useRef } from "react";
import { Outlet, useSearchParams } from "react-router";

// Components
import Header from "./components/Header/Header";
import Aside from "./components/Aside/Aside";

export default function App() {
  const [searchParams] = useSearchParams();

  const [userData, setUserData] = useState({
    personalData: JSON.parse(localStorage.getItem("userData")),
    jwt: JSON.parse(localStorage.getItem("jwt")),
  });

  const [feedPosts, setFeedPosts] = useState({
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
  });

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || "",
  );
  const [searchPosts, setSearchPosts] = useState({
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
  });

  const [categoryState, setCategoryState] = useState({
    status: "fetching",

    categories: [],
  });

  // Refs
  const categoryStateRef = useRef(categoryState.status);

  return (
    <>
      <Header
        context={{ searchQuery, setSearchQuery, searchPosts, setSearchPosts }}
      />
      <div className="contentBody">
        <Aside userData={userData} setUserData={setUserData} />
        <Outlet
          context={{
            userData,
            setUserData,
            feedPosts,
            setFeedPosts,
            searchQuery,
            setSearchQuery,
            searchPosts,
            setSearchPosts,
            categoryState,
            setCategoryState,
            categoryStateRef,
          }}
        />
      </div>
    </>
  );
}
