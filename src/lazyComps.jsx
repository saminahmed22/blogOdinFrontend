import { lazy } from "react";

export const Feed = lazy(() => import("./components/Feed/Feed"));
export const DraftsPage = lazy(
  () => import("./components/DraftsPage/DraftsPage"),
);
export const BookmarkPage = lazy(
  () => import("./components/BookmarkPage/BookmarkPage"),
);
export const SearchPage = lazy(
  () => import("./components/SearchPage/SearchPage"),
);
export const PostPage = lazy(() => import("./components/PostPage/PostPage"));
export const ProfilePageKeyd = lazy(
  () => import("./components/ProfilePage/ProfilePageKeyd"),
);
export const LandingPage = lazy(
  () => import("./components/LandingPage/LandingPage"),
);
export const AuthPage = lazy(() => import("./components/AuthPage/AuthPage"));
