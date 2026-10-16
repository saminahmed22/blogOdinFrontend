// Hooks
import { useState } from "react";
import { Outlet } from "react-router";

// Components
import Header from "./components/header/Header";
import Aside from "./components/Aside/Aside";

export default function App() {
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
      totalContentCount: 0,
      totalContentFetched: 0,

      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
    },

    content: {},
  });

  const [searchPosts, setSearchPosts] = useState({
    fetchConfig: {
      quantity: 10,
      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
    },

    posts: {},
  });

  const [categoryState, setCategoryState] = useState({
    status: "fetching",

    categories: [],
  });

  return (
    <>
      <Header context={{ searchPosts, setSearchPosts }} />
      <div className="contentBody">
        <Aside userData={userData} setUserData={setUserData} />
        <Outlet
          context={{
            userData,
            setUserData,
            feedPosts,
            setFeedPosts,
            searchPosts,
            categoryState,
            setCategoryState,
          }}
        />
      </div>
    </>
  );
}
