import App from "./App";
import ErrorPage from "./ErrorPage";

import Feed from "./components/Feed/Feed";
import PostPage from "./components/PostPage/PostPage";
import ProfilePageKeyd from "./components/ProfilePage/ProfilePageKeyd";
import LandingPage from "./components/LandingPage/LandingPage";
import { AuthPage } from "./components/AuthPage/AuthPage";

export const routes = [
  { path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
  {
    path: "/feed/:category?",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Feed /> }],
  },
  {
    path: "posts/:postId",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <PostPage /> }],
  },

  {
    path: "profile/:contentType?/:profileId",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <ProfilePageKeyd /> }],
  },

  {
    path: "auth/:mode?",
    element: <AuthPage />,
  },
];
