import type { QueryClickActionsMode } from "../types";
// import { getPivotDrill } from "../drills/PivotDrill";
import { TimeseriesModeFooter } from "../components/TimeseriesModeFooter";
import { DefaultMode } from "./DefaultMode";

export const TimeseriesMode: QueryClickActionsMode = {
  name: "timeseries",
  // drills: [getPivotDrill({ withTime: false }), ...DefaultMode.drills],
  clickActions: DefaultMode.clickActions,
  ModeFooter: TimeseriesModeFooter,
};
