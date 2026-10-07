// Hooks
import { useState } from "react";
import { Outlet } from "react-router";

// Components
import Header from "./components/header/Header";
import Aside from "./components/Aside/Aside";

export default function App() {
  const [userData, setUserData] = useState({
    personalData: JSON.parse(localStorage.getItem("userdata")),
    jwt: JSON.parse(localStorage.getItem("jwt")),
  });

  const [searchPosts, setSearchPosts] = useState({
    status: "fetching",
    posts: [],
  });

  const [feedPosts, setFeedPosts] = useState({
    status: "fetching",
    posts: [],
  });

  return (
    <>
      <Header context={[searchPosts, setSearchPosts]} />
      <div className="contentBody">
        <Aside userData={userData} setUserData={setUserData} />
        <Outlet context={{ userData, setUserData, feedPosts, setFeedPosts }} />
      </div>
    </>
  );
}
