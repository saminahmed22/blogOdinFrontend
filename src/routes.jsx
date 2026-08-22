import App from "./App";
import ErrorPage from "./ErrorPage";

import Feed from "./components/feed/Feed";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Feed /> }],
  },
];
