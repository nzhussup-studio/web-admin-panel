import type { ComponentType } from "react";

export interface AppRoute {
  path: string;
  component: ComponentType;
  isProtected: boolean;
}
