import type { QueryClickActionsMode } from "../types";
// import { PivotDrill } from "../drills/PivotDrill";
import { DefaultMode } from "./DefaultMode";

export const MetricMode: QueryClickActionsMode = {
  name: "metric",
  // drills: [...DefaultMode.drills, PivotDrill],
  clickActions: DefaultMode.clickActions,
};
