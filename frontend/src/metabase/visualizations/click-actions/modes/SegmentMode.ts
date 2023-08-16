import type { QueryClickActionsMode } from "../types";
// import SummarizeColumnDrill from "../drills/SummarizeColumnDrill";
// import SummarizeColumnByTimeDrill from "../drills/SummarizeColumnByTimeDrill";
// import { DistributionDrill } from "../drills/mlv2/DistributionDrill";
import { DefaultMode } from "./DefaultMode";

export const SegmentMode: QueryClickActionsMode = {
  name: "segment",
  // drills: [
  //   ...DefaultMode.drills,
  //   SummarizeColumnDrill,
  //   SummarizeColumnByTimeDrill,
  //   DistributionDrill,
  // ],
  clickActions: DefaultMode.clickActions,
};
