import { redirect } from "react-router";

import App from "./App";
import ErrorPage from "./ErrorPage";
import Feed from "./components/Feed/Feed";
import PostPage from "./components/PostPage/PostPage";
import ProfilePageKeyd from "./components/ProfilePage/ProfilePageKeyd";
import LandingPage from "./components/LandingPage/LandingPage";
import DraftsPage from "./components/DraftsPage/DraftsPage";
import BookmarkPage from "./components/BookmarkPage/BookmarkPage";
import SearchPage from "./components/SearchPage/SearchPage";
import { AuthPage } from "./components/AuthPage/AuthPage";

function isLoggedIn() {
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  return Boolean(jwt?.token);
}

const landingPageLoader = () => {
  if (isLoggedIn()) {
    return redirect("/feed");
  }

  null;
};

const anyRouteLoader = () => {
  if (isLoggedIn()) {
    return redirect("/feed");
  } else {
    return redirect("/");
  }
};

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
    loader: landingPageLoader,
  },
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "feed/:category?", element: <Feed /> },
      { path: "posts/:postId", element: <PostPage /> },
      {
        path: "profile/:contentType?/:profileId",
        element: <ProfilePageKeyd />,
      },

      { path: "drafts", element: <DraftsPage /> },

      { path: "bookmarks", element: <BookmarkPage /> },

      { path: "search", element: <SearchPage /> },
    ],
  },

  {
    path: "auth/:mode?",
    element: <AuthPage />,
  },
  {
    path: "*",
    loader: anyRouteLoader,
  },
];
