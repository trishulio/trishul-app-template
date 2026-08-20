import { Tag, Layers, FileCode, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BeanInfo } from "../beanTypes";
import { BeanDetailRow } from "./BeanDetailRow";

interface DetailRowDef {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
  breakAll?: boolean;
}

export function BeanIdentity({ bean }: { bean: BeanInfo }) {
  const rows: DetailRowDef[] = [
    { icon: Tag, label: "Lifecycle Scope", value: bean.scope },
    {
      icon: Layers,
      label: "Application Context",
      value: bean.context,
      mono: true,
    },
    ...(bean.resource
      ? [
          {
            icon: FileCode,
            label: "Resource Location",
            value: bean.resource,
            mono: true,
            breakAll: true,
          },
        ]
      : []),
    {
      icon: BookOpen,
      label: "Full Class Signature",
      value: bean.type,
      mono: true,
      breakAll: true,
    },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <BeanDetailRow
          key={r.label}
          icon={r.icon}
          label={r.label}
          value={r.value}
          mono={r.mono}
          breakAll={r.breakAll}
        />
      ))}
    </div>
  );
}
