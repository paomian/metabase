import type { QueryClickActionsMode } from "../types";
import { NativeQueryClickFallback } from "../actions/NativeQueryClickFallback";
import { DefaultMode } from "./DefaultMode";

export const NativeMode: QueryClickActionsMode = {
  name: "native",
  // drills: DefaultMode.drills,
  clickActions: DefaultMode.clickActions,
  fallback: NativeQueryClickFallback,
};
