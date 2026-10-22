import { redirect } from "react-router";

import App from "./App";
import ErrorPage from "./ErrorPage";
import LandingPage from "./components/LandingPage/LandingPage";
import Feed from "./components/Feed/Feed";
import SearchPage from "./components/SearchPage/SearchPage";
import PostPage from "./components/PostPage/PostPage";
import DraftsPage from "./components/DraftsPage/DraftsPage";
import BookmarkPage from "./components/BookmarkPage/BookmarkPage";
import ProfilePageKeyd from "./components/ProfilePage/ProfilePageKeyd";
import AuthPage from "./components/AuthPage/AuthPage";
import PostCreatePage from "./components/PostCreatePage/PostCreatePage";

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

      { path: "create", element: <PostCreatePage /> },
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
