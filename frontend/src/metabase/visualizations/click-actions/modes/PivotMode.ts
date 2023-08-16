import type { QueryClickActionsMode } from "../types";
// import { PivotDrill } from "../drills/PivotDrill";
import { DefaultMode } from "./DefaultMode";

export const PivotMode: QueryClickActionsMode = {
  name: "pivot",
  // drills: [...DefaultMode.drills, PivotDrill],
  clickActions: DefaultMode.clickActions,
};
