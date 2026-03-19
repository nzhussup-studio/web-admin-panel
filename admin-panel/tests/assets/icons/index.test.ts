import React from "react";
import { render } from "@testing-library/react";
import {
  BackCircleIcon,
  BrightnessHighIcon,
  CodeSlashIcon,
  DownloadIcon,
  FunnelIcon,
  ImagesIcon,
  MoonStarsIcon,
} from "@/assets/icons";

const iconComponents = [
  CodeSlashIcon,
  BackCircleIcon,
  DownloadIcon,
  FunnelIcon,
  ImagesIcon,
  MoonStarsIcon,
  BrightnessHighIcon,
];

describe("assets/icons/index.tsx", () => {
  test.each(iconComponents)("renders %p as an svg with forwarded props", (Icon) => {
    const { container } = render(
      React.createElement(Icon, { width: 20, height: 18, className: "test-icon" })
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "18");
    expect(svg).toHaveClass("test-icon");
  });
});
