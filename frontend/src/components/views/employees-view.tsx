"use client";

import { Banknote, Download, UserCheck, Users, Wallet } from "lucide-react";
import { useCallback } from "react";

import { columnHelperFor, type ErpColumns } from "@/components/data-table";
import type { FormField } from "@/components/entity-form";
import { ResourcePage } from "@/components/resource-page";
import { StatTile } from "@/components/stat-tile";
import { EmployeeStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { exportToCsv } from "@/lib/export";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  employeeSchema,
  employeeStatusLabels,
  type Employee,
  type EmployeeInput,
} from "@/lib/types";

const helper = columnHelperFor<Employee>();

const buildColumns = (onDelete: (id: string) => void): ErpColumns<Employee> =>
  helper.columns([
    helper.accessor("name", {
      header: "الاسم",
      cell: (info) => <span className="font-medium text-ink">{info.getValue()}</span>,
    }),
    helper.accessor("position", {
      header: "المسمى الوظيفي",
      cell: (info) => <span className="text-ink-2">{info.getValue()}</span>,
    }),
    helper.accessor("department", {
      header: "الإدارة",
      cell: (info) => (
        <span className="inline-flex items-center rounded-md border border-line bg-page px-2 py-0.5 text-xs font-medium text-ink-2">
          {info.getValue()}
        </span>
      ),
    }),
    helper.accessor("salary", {
      header: "الراتب",
      cell: (info) => (
        <span className="tabular font-medium text-ink">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    helper.accessor("hireDate", {
      header: "تاريخ التعيين",
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor("status", {
      header: "الحالة",
      cell: (info) => <EmployeeStatusBadge status={info.getValue()} />,
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DeleteButton
          label={`حذف ${info.row.original.name}`}
          onClick={() => onDelete(info.row.original.id)}
        />
      ),
    }),
  ]);

const fields: FormField<EmployeeInput>[] = [
  { name: "name", label: "اسم الموظف", wide: true },
  { name: "position", label: "المسمى الوظيفي" },
  { name: "department", label: "الإدارة" },
  { name: "salary", label: "الراتب الشهري", type: "number" },
  { name: "hireDate", label: "تاريخ التعيين", type: "date" },
  {
    name: "status",
    label: "الحالة",
    options: Object.entries(employeeStatusLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
];

export function EmployeesView() {
  const handleExport = useCallback((data: Employee[]) => {
    if (data.length === 0) return;
    const headers = [
      "الاسم",
      "المسمى الوظيفي",
      "الإدارة",
      "الراتب الشهري",
      "تاريخ التعيين",
      "الحالة",
    ];
    const rows = data.map((emp) => [
      emp.name,
      emp.position,
      emp.department,
      emp.salary,
      emp.hireDate,
      employeeStatusLabels[emp.status] ?? emp.status,
    ]);
    exportToCsv("قائمة_الموظفين", headers, rows);
  }, []);

  const renderStats = useCallback((data: Employee[]) => {
    const total = data.length;
    const active = data.filter((e) => e.status === "active").length;
    const onLeave = data.filter((e) => e.status === "onLeave").length;
    const activeEmployees = data.filter((e) => e.status === "active");
    const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
    const avgSalary =
      activeEmployees.length > 0
        ? Math.round(totalPayroll / activeEmployees.length)
        : 0;
    const departmentsCount = new Set(
      data.map((e) => e.department).filter(Boolean),
    ).size;

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="إجمالي الكادر"
          value={`${formatNumber(total)} موظف`}
          note={`موزعون على ${formatNumber(departmentsCount)} إدارات`}
          icon={Users}
        />
        <StatTile
          label="على رأس العمل"
          value={`${formatNumber(active)} موظف`}
          note={
            onLeave > 0
              ? `${formatNumber(onLeave)} موظف في إجازة حالياً`
              : "جميع الموظفين على رأس العمل"
          }
          icon={UserCheck}
        />
        <StatTile
          label="مسير الرواتب الشهري"
          value={formatCurrency(totalPayroll)}
          note="إجمالي رواتب الكادر النشط"
          icon={Wallet}
        />
        <StatTile
          label="متوسط الراتب"
          value={formatCurrency(avgSalary)}
          note="متوسط الأجر الشهري للموظف"
          icon={Banknote}
        />
      </div>
    );
  }, []);

  return (
    <ResourcePage<Employee, EmployeeInput>
      collection="employees"
      title="الموظفون"
      subtitle="بيانات الكادر الوظيفي والرواتب"
      addLabel="إضافة موظف"
      emptyLabel="لا يوجد موظفون مطابقون للبحث"
      searchPlaceholder="ابحث بالاسم أو الإدارة…"
      buildColumns={buildColumns}
      schema={employeeSchema}
      fields={fields}
      renderStats={renderStats}
      extraActions={(data) => (
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleExport(data)}
          disabled={data.length === 0}
        >
          <Download size={15} aria-hidden />
          تصدير CSV
        </Button>
      )}
      defaultValues={{
        name: "",
        position: "",
        department: "",
        salary: 0,
        hireDate: "",
        status: "active",
      }}
    />
  );
}
