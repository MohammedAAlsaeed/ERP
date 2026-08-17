"use client";

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { EmptyState } from "@/components/ui/states";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Features are registered once, at module scope: v9 has no global feature set,
   and a fresh object every render would invalidate the row models. Only the
   features this table actually uses are included. */
export const erpTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: { includesString: filterFn_includesString },
});

export type ErpFeatures = typeof erpTableFeatures;

/* `any` for the cell-value slot mirrors what `columnHelper.columns()` returns —
   the slot is invariant, so a mixed-value column list cannot be narrowed. */
export type ErpColumns<TData extends RowData> = ColumnDef<
  ErpFeatures,
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>[];

/** Column helper bound to this table's feature set. */
export const columnHelperFor = <TData extends RowData>() =>
  createColumnHelper<ErpFeatures, TData>();

type DataTableProps<TData extends RowData> = {
  data: TData[];
  columns: ErpColumns<TData>;
  searchPlaceholder?: string;
  emptyLabel?: string;
  pageSize?: number;
};

export function DataTable<TData extends RowData>({
  data,
  columns,
  searchPlaceholder = "ابحث…",
  emptyLabel = "لا توجد سجلات",
  pageSize = 10,
}: DataTableProps<TData>) {
  const table = useTable({
    features: erpTableFeatures,
    data,
    columns,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.state.pagination;
  const pageCount = table.getPageCount();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="relative">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-3"
          />
          <input
            type="search"
            value={(table.state.globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-64 rounded-lg border border-line bg-card py-2 pr-9 pl-3 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
          />
        </div>
        <span className="text-xs text-ink-3">
          {formatNumber(filteredCount)} سجل
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-line">
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={
                          sorted === "asc"
                            ? "ascending"
                            : sorted === "desc"
                              ? "descending"
                              : undefined
                        }
                        className="px-5 py-3 text-xs font-medium whitespace-nowrap text-ink-3"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1.5 hover:text-ink"
                          >
                            <table.FlexRender header={header} />
                            {sorted === "asc" ? (
                              <ArrowUp size={13} aria-hidden />
                            ) : sorted === "desc" ? (
                              <ArrowDown size={13} aria-hidden />
                            ) : (
                              <ArrowUpDown size={13} className="opacity-40" aria-hidden />
                            )}
                          </button>
                        ) : (
                          <table.FlexRender header={header} />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-line last:border-0 hover:bg-page"
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3 text-ink-2">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 ? (
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
          <span className="text-xs text-ink-3">
            صفحة {formatNumber(pageIndex + 1)} من {formatNumber(pageCount)}
          </span>
          <div className="flex gap-1">
            <PageButton
              label="الصفحة السابقة"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronRight size={16} />
            </PageButton>
            <PageButton
              label="الصفحة التالية"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronLeft size={16} />
            </PageButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "rounded-lg border border-line p-1.5 text-ink-2",
        disabled ? "cursor-not-allowed opacity-40" : "hover:bg-page hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
