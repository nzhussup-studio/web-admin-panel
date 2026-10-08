import { render, screen } from "@testing-library/react";
import Header from "@/components/layout/Header";

describe("Header", () => {
  it("renders page hierarchy and actions", () => {
    render(
      <Header
        eyebrow="Portfolio / Projects"
        text="Projects"
        description="Manage portfolio projects."
        actions={<button type="button">Add project</button>}
      />,
    );
    expect(screen.getByText("Portfolio / Projects")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("Manage portfolio projects.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add project" })).toBeInTheDocument();
  });
});
