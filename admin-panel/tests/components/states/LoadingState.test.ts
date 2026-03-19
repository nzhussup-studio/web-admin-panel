import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingState from "@/components/states/LoadingState";

const h = React.createElement;

describe("components/states/LoadingState.tsx", () => {
  test("renders default loading copy", () => {
    render(h(LoadingState));

    expect(screen.getByRole("heading", { name: "Loading" })).toBeInTheDocument();
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders custom loading copy", () => {
    render(h(LoadingState, { title: "Fetching data", message: "Almost there" }));

    expect(screen.getByText("Fetching data")).toBeInTheDocument();
    expect(screen.getByText("Almost there")).toBeInTheDocument();
  });
});
