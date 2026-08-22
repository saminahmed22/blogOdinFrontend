// Hooks
import { Outlet } from "react-router";

// Components
import Header from "./components/header/Header";

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
