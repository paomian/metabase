import * as Lib from "metabase-lib";
import {
  ORDERS,
  ORDERS_ID,
  SAMPLE_DB_ID,
} from "metabase-types/api/mocks/presets";
import type { DatasetColumn } from "metabase-types/api";
import type {
  ColumnFilterDrillThruInfo,
  DistributionDrillThruInfo,
  FKDetailsDrillThruInfo,
  FKFilterDrillThruInfo,
  QuickFilterDrillThruInfo,
  SortDrillThruInfo,
  SummarizeColumnByTimeDrillThruInfo,
  SummarizeColumnDrillThruInfo,
  DrillThruDisplayInfo,
  ZoomDrillThruInfo,
  DrillThru,
  DrillThruType,
  Query,
} from "metabase-lib/types";
import StructuredQuery from "metabase-lib/queries/StructuredQuery";
import Question from "metabase-lib/Question";
import { columnFinder, createQuery, SAMPLE_METADATA } from "./test-helpers";
import { availableDrillThrus, drillThru } from "./drills";

type OrdersColumnName = keyof typeof ORDERS;

const ORDER_ROW_VALUES = {
  ID: "3",
  USER_ID: "1",
  PRODUCT_ID: "105",
  SUBTOTAL: 52.723521442619514,
  TAX: 2.9,
  TOTAL: 49.206842233769756,
  DISCOUNT: 6.416679208849759,
  CREATED_AT: "2025-12-06T22:22:48.544+02:00",
  QUANTITY: 2,

  count: 77,
};

const setup = ({
  question = Question.create({
    databaseId: SAMPLE_DB_ID,
    tableId: ORDERS_ID,
    metadata: SAMPLE_METADATA,
  }),
  columnName,
}: {
  question?: Question;
  columnName: OrdersColumnName;
}) => {
  const metadata = SAMPLE_METADATA;
  const query = question._getMLv2Query();
  const legacyQuery = question.query() as StructuredQuery;

  const stageIndex = -1;

  const legacyColumns = legacyQuery.columns();

  const clickedColumn = legacyColumns.find(({ name }) => name === columnName);

  if (!clickedColumn) {
    throw new Error(`Failed to find column "${columnName}"`);
  }

  return {
    query,
    stageIndex,
    column: {
      ...clickedColumn,
      effective_type: metadata.field(clickedColumn.id)?.effective_type,
    } as DatasetColumn,
    cellValue: ORDER_ROW_VALUES[columnName],
    row: legacyColumns.map(column => {
      return {
        col: {
          ...column,
          effective_type: metadata.field(column.id)?.effective_type,
        } as DatasetColumn,
        value: ORDER_ROW_VALUES[column.name as OrdersColumnName],
      };
    }),
  };
};

type TestCaseConfig = [OrdersColumnName, DrillThruDisplayInfo[]];

describe("availableDrillThrus", () => {
  describe("should return list of available drills", () => {
    it.each([
      [
        "ID",
        [
          {
            type: "drill-thru/zoom",
            objectId: ORDER_ROW_VALUES.ID,
            manyPks: false,
          } as ZoomDrillThruInfo,
        ],
      ],

      [
        "USER_ID",
        [
          {
            type: "drill-thru/fk-filter",
          } as FKFilterDrillThruInfo,
          {
            type: "drill-thru/fk-details",
            objectId: ORDER_ROW_VALUES.USER_ID,
            manyPks: false,
          } as FKDetailsDrillThruInfo,
        ],
      ],

      [
        "SUBTOTAL",
        [
          {
            type: "drill-thru/zoom",
            objectId: ORDER_ROW_VALUES.ID,
            manyPks: false,
          } as ZoomDrillThruInfo,
          {
            type: "drill-thru/quick-filter",
            operators: ["<", ">", "=", "≠"],
          } as QuickFilterDrillThruInfo,
        ],
      ],

      [
        "CREATED_AT",
        [
          {
            type: "drill-thru/zoom",
            objectId: ORDER_ROW_VALUES.ID,
            manyPks: false,
          } as ZoomDrillThruInfo,
          {
            type: "drill-thru/quick-filter",
            operators: ["<", ">", "=", "≠"],
          } as QuickFilterDrillThruInfo,
        ],
      ],
    ] as TestCaseConfig[])(
      "unaggregated query, ORDERS -> %s cell click",
      (columnName, expectedDrills) => {
        const { query, stageIndex, column, cellValue, row } = setup({
          columnName,
        });

        expect(
          availableDrillThrus(
            query,
            stageIndex,
            column,
            cellValue,
            row,
            undefined,
          ).map(drill => Lib.displayInfo(query, stageIndex, drill)),
        ).toEqual(expectedDrills);
      },
    );

    it.each([
      [
        "ID",
        [
          {
            initialOp: expect.objectContaining({ short: "=" }),
            type: "drill-thru/column-filter",
          } as ColumnFilterDrillThruInfo,
          {
            directions: ["asc", "desc"],
            type: "drill-thru/sort",
          } as SortDrillThruInfo,
          {
            aggregations: ["distinct"],
            type: "drill-thru/summarize-column",
          } as SummarizeColumnDrillThruInfo,
        ],
      ],
      [
        "PRODUCT_ID",
        [
          {
            type: "drill-thru/distribution",
          } as DistributionDrillThruInfo,
          {
            initialOp: expect.objectContaining({ short: "=" }),
            type: "drill-thru/column-filter",
          } as ColumnFilterDrillThruInfo,
          {
            directions: ["asc", "desc"],
            type: "drill-thru/sort",
          } as SortDrillThruInfo,
          {
            aggregations: ["distinct"],
            type: "drill-thru/summarize-column",
          } as SummarizeColumnDrillThruInfo,
        ],
      ],
      [
        "SUBTOTAL",
        [
          { type: "drill-thru/distribution" } as DistributionDrillThruInfo,
          {
            type: "drill-thru/column-filter",
            initialOp: expect.objectContaining({ short: "=" }),
          } as ColumnFilterDrillThruInfo,
          {
            type: "drill-thru/sort",
            directions: ["asc", "desc"],
          } as SortDrillThruInfo,
          {
            type: "drill-thru/summarize-column",
            aggregations: ["distinct", "sum", "avg"],
          } as SummarizeColumnDrillThruInfo,
          {
            type: "drill-thru/summarize-column-by-time",
          } as SummarizeColumnByTimeDrillThruInfo,
        ],
      ],
      [
        "CREATED_AT",
        [
          { type: "drill-thru/distribution" } as DistributionDrillThruInfo,
          {
            type: "drill-thru/column-filter",
            initialOp: null,
          } as ColumnFilterDrillThruInfo,
          {
            type: "drill-thru/sort",
            directions: ["asc", "desc"],
          } as SortDrillThruInfo,
          {
            type: "drill-thru/summarize-column",
            aggregations: ["distinct"],
          } as SummarizeColumnDrillThruInfo,
        ],
      ],
    ] as TestCaseConfig[])(
      "unaggregated query, ORDERS -> %s header click",
      (columnName, expectedDrills) => {
        const { query, stageIndex, column } = setup({ columnName });

        expect(
          availableDrillThrus(
            query,
            stageIndex,
            column,
            undefined,
            undefined,
            undefined,
          ).map(drill => Lib.displayInfo(query, stageIndex, drill)),
        ).toEqual(expectedDrills);
      },
    );
  });
});

describe("drillThru", () => {
  it("should apply sort drill", () => {
    const query = createQuery();
    const stageIndex = -1;
    const columns = Lib.orderableColumns(query, stageIndex);
    const column = columnFinder(query, columns)("ORDERS", "SUBTOTAL");

    const drills = availableDrillThrus(
      query,
      stageIndex,
      column,
      undefined,
      undefined,
      undefined,
    );

    const sortDrill = findDrillByType(
      drills,
      "drill-thru/sort",
      query,
      stageIndex,
    );

    const updatedQuery = drillThru(query, stageIndex, sortDrill, "asc");

    expect(Lib.toLegacyQuery(updatedQuery)).toEqual({});
  });
});

function findDrillByType(
  drills: DrillThru[],
  drillType: DrillThruType,
  query: Query,
  stageIndex: number,
): DrillThru {
  const drill = drills.find(
    drill => Lib.displayInfo(query, stageIndex, drill)?.type === drillType,
  );

  if (!drill) {
    throw new TypeError();
  }

  return drill;
}
