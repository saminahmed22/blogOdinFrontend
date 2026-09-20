import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Navbar from "../../components/navbar/Navbar";

import { userContext } from "../../../context";

const dummyContext = {
  firstname: "Samin",
  secondName: "Ahmed",
  username: "saminahmed",
  bio: "This is a bio",
  profilePictureLink:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYR-onpckKo-PeL5gbRBPJxWxh-g5dQ3iup5HMSB8Dq_QEJCXOfWcsnBE&s=10",

  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",

    getStatus: function () {
      return !!this.token;
    },
  },

  prefs: {
    theme: "dark",
  },
};

describe("Navbar", () => {
  const renderNavbar = () => {};

  it("should contain a profile picture", () => {
    <MemoryRouter>
      <userContext.Provider value={dummyContext}>
        <Navbar />
      </userContext.Provider>
    </MemoryRouter>;

    expect(screen.getByRole("paragraph")).toBeInTheDocument();
  });
});
