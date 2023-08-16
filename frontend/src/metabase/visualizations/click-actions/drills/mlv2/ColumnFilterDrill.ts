import { t } from "ttag";
import type { DrillMLv2 } from "metabase/visualizations/click-actions/types";
import { getColumnFilterDrillPopover } from "metabase/visualizations/click-actions/components/ColumnFilterDrillPopover";
import * as Lib from "metabase-lib";
import StructuredQuery from "metabase-lib/queries/StructuredQuery";
import Filter from "metabase-lib/queries/structured/Filter";

export const ColumnFilterDrill: DrillMLv2<Lib.ColumnFilterDrillThruInfo> = ({
  drill,
  drillDisplayInfo,
  question,
  clicked,
}) => {
  if (!drill || !drillDisplayInfo.initialOp) {
    return [];
  }

  const { initialOp } = drillDisplayInfo;

  const query = question.query() as StructuredQuery;

  // TODO: refactor this after Filters will be added to MLv2
  const initialFilter = new Filter(
    [initialOp.short, clicked?.column?.field_ref],
    null,
    query,
  );

  const popoverProps = {
    initialFilter,
    query: question.query() as StructuredQuery,
  };

  return [
    {
      name: "filter-column",
      section: "summarize",
      title: t`Filter by this column`,
      buttonType: "horizontal",
      icon: "filter",
      popover: getColumnFilterDrillPopover(popoverProps),
    },
  ];
};
