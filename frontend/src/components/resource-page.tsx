"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { RowData } from "@tanstack/react-table";
import type { DefaultValues, FieldValues } from "react-hook-form";
import type { ZodType } from "zod";

import { DataTable, type ErpColumns } from "@/components/data-table";
import { EntityForm, type FormField } from "@/components/entity-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ErrorState, Loading } from "@/components/ui/states";
import {
  createRecord,
  deleteRecord,
  listRecords,
  queryKeys,
  type Collection,
} from "@/lib/api";

/* Stable fallback: a fresh [] every render would invalidate the table's
   row models (see the react-table v9 data guidance). */
const EMPTY: never[] = [];

type ResourcePageProps<TRecord extends RowData, TValues extends FieldValues> = {
  collection: Collection;
  title: string;
  subtitle: string;
  addLabel: string;
  emptyLabel: string;
  searchPlaceholder: string;
  /** Defined at module scope by each page so its identity stays stable. */
  buildColumns: (onDelete: (id: string) => void) => ErpColumns<TRecord>;
  schema: ZodType<TValues, FieldValues>;
  fields: FormField<TValues>[];
  defaultValues: DefaultValues<TValues>;
  renderStats?: (data: TRecord[]) => React.ReactNode;
  extraActions?: (data: TRecord[]) => React.ReactNode;
};

export function ResourcePage<
  TRecord extends RowData & { id: string },
  TValues extends FieldValues,
>({
  collection,
  title,
  subtitle,
  addLabel,
  emptyLabel,
  searchPlaceholder,
  buildColumns,
  schema,
  fields,
  defaultValues,
  renderStats,
  extraActions,
}: ResourcePageProps<TRecord, TValues>) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const query = useQuery({
    queryKey: queryKeys.list(collection),
    queryFn: () => listRecords(collection),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list(collection) });
    queryClient.invalidateQueries({ queryKey: queryKeys.stats });
  }, [collection, queryClient]);

  const create = useMutation({
    mutationFn: (values: TValues) => createRecord(collection, values),
    onSuccess: () => {
      invalidate();
      setFormOpen(false);
    },
  });

  const destroy = useMutation({
    mutationFn: (id: string) => deleteRecord(collection, id),
    onSuccess: invalidate,
  });

  const onDelete = useCallback(
    (id: string) => {
      if (window.confirm("هل تريد حذف هذا السجل؟")) destroy.mutate(id);
    },
    [destroy],
  );

  const columns = useMemo(() => buildColumns(onDelete), [buildColumns, onDelete]);
  const data = (query.data ?? EMPTY) as unknown as TRecord[];

  return (
    <div className="flex flex-col gap-5">
      {renderStats && !query.isPending && !query.isError ? renderStats(data) : null}

      <Card>
        <CardHeader
          title={title}
          subtitle={subtitle}
          action={
            <div className="flex items-center gap-2">
              {extraActions ? extraActions(data) : null}
              <Button onClick={() => setFormOpen(true)}>
                <Plus size={15} aria-hidden />
                {addLabel}
              </Button>
            </div>
          }
        />

        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <ErrorState message={query.error.message} />
        ) : (
          <DataTable
            data={data}
            columns={columns}
            emptyLabel={emptyLabel}
            searchPlaceholder={searchPlaceholder}
          />
        )}
      </Card>

      <Modal title={addLabel} open={formOpen} onClose={() => setFormOpen(false)}>
        <EntityForm<TValues>
          schema={schema}
          fields={fields}
          defaultValues={defaultValues}
          submitLabel="حفظ"
          pending={create.isPending}
          error={create.isError ? create.error.message : undefined}
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
