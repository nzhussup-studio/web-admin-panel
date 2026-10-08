import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNavigation } from "./MobileNavigation";

describe("MobileNavigation", () => {
  it("exposes navigation, home, and profile actions", async () => {
    const onOpen = vi.fn();
    const onHome = vi.fn();
    const onProfile = vi.fn();
    render(
      createElement(
        MobileNavigation,
        {
          isOpen: false,
          initials: "NZ",
          profileName: "Nurzhanat",
          onOpen,
          onClose: vi.fn(),
          onHome,
          onProfile,
          onAccountAction: vi.fn(),
        } as unknown as Parameters<typeof MobileNavigation>[0],
        createElement("span", null, "Navigation"),
      ),
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Open navigation" }),
    );
    await userEvent.click(screen.getByRole("button", { name: /admin panel/i }));
    await userEvent.click(
      screen.getByRole("button", { name: "Open account menu" }),
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Profile" }),
    );

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
    expect(onProfile).toHaveBeenCalledOnce();
  });
});
