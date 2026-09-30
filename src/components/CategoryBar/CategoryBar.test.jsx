import { render, screen } from "@testing-library/react";
import userevent from "@testing-library/user-event";

import CategoryBar from "./CategoryBar";

describe("CategoryBar", () => {
  const renderComponent = () => {
    return render(<CategoryBar />);
  };

  it("should scroll left when left scroll button is clicked", () => {
    renderComponent();

    const buttons = screen.getAllByRole("button");

    const leftScrollBtn = buttons[0];

    userevent.click(leftScrollBtn);

    const categoryList = screen.getby;
  });
});
