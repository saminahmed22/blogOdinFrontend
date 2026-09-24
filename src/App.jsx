// Hooks
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

// Components
import Header from "./components/header/Header";
import Aside from "./components/Aside/Aside";

export default function App() {
  const storedJWT = localStorage.getItem("jwt");

  let [userData, setUserData] = useState({
    personalData: null,
    auth: storedJWT || null,
  });

  useEffect(() => {
    if (storedJWT) {
      // const payloadEncoded = userData.auth.split(".")[1];
      // const payloadDecoded = JSON.parse(atob(payloadEncoded));
      // // const userID = payloadDecoded.sub;

      (() => {
        setUserData((prev) => ({
          jwt: prev.jwt,
          personalData: { firstname: "samin", secondName: "ahmed" },
        }));
      })();
    }
  }, [storedJWT]);

  return (
    <>
      <Header userData={userData} />
      <div className="contentBody">
        <Aside />
        <Outlet context={[userData, setUserData]} />
      </div>
    </>
  );
}
