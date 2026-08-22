import App from "./App";
import ErrorPage from "./ErrorPage";

import Feed from "./components/feed/Feed";
import Post from "./components/post/post";
import Profile from "./components/profile/profile";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Feed /> },
      { path: "posts/:postId", element: <Post /> },
      { path: "profile", element: <Profile /> },
    ],
  },
];
