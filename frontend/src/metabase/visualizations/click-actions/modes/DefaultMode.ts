import { AutomaticInsightsDrill } from "metabase/visualizations/click-actions/drills/AutomaticInsightsDrill";
import type { QueryClickActionsMode } from "../types";
// import SortDrill from "../drills/SortDrill";
// import { ObjectDetailDrill } from "../drills/ObjectDetailDrill";
// import { QuickFilterDrill } from "../drills/QuickFilterDrill";
// import ForeignKeyDrill from "../drills/ForeignKeyDrill";
// import { ColumnFilterDrill } from "../drills/ColumnFilterDrill";
// import UnderlyingRecordsDrill from "../drills/UnderlyingRecordsDrill";
// import { AutomaticInsightsDrill } from "../drills/AutomaticInsightsDrill";
// import ZoomDrill from "../drills/ZoomDrill";
import { ColumnFormattingAction } from "../actions/ColumnFormattingAction";
import { DashboardClickAction } from "../actions/DashboardClickAction";

export const DefaultMode: QueryClickActionsMode = {
  name: "default",
  // drills: [
  //   UnderlyingRecordsDrill,
  //   ZoomDrill,
  //   SortDrill,
  //   ObjectDetailDrill,
  //   QuickFilterDrill,
  //   ForeignKeyDrill,
  //   ColumnFilterDrill,
  //   AutomaticInsightsDrill,
  // ],
  clickActions: [
    ColumnFormattingAction,
    DashboardClickAction,
    AutomaticInsightsDrill,
  ],
};
