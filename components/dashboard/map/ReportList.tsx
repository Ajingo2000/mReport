// src/components/dashboard/map/ReportList.tsx
import { Badge } from "@/components/ui/badge";

type Report = any;

type Props = {
  reports: Report[];
  title: string;
  onReportClick: (r: Report) => void;
  selectedId?: string;
  hoveredId?: string;
};

const getStatusVariant = (status: string): any => {
  switch (status) {
    case "Critical": return "destructive";
    case "Resolved": return "secondary";
    default: return "default";
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "damage": return "border-red-500";
    case "assistance": return "border-green-500";
    case "srhr": return "border-pink-600";
    default: return "border-yellow-500";
  }
};

export function ReportList({ reports, title, onReportClick, selectedId, hoveredId }: Props) {
  if (reports.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-4">No {title.toLowerCase()} reports</p>;
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-500 pb-1">{title}</h3>
      <ul className="space-y-3">
        {reports.map((r) => (
          <li
            key={r.report_id}
            className={`
              p-3 rounded-lg border cursor-pointer transition
              ${getBorderColor(r.report_type)}
              ${selectedId === r.report_id ? "ring-2 ring-indigo-400" : ""}
              ${hoveredId === r.report_id ? "bg-muted" : ""}
            `}
            onClick={() => onReportClick(r)}
            onMouseEnter={() => {/* handled in parent */}}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">{r.location || "Unknown location"}</h4>
              <Badge variant={getStatusVariant(r.status)} className="text-xs">
                {r.status}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>Type: {r.report_type}</p>
              <p>Subtype: {r.damage_type || r.assistance_type || r.srhr_type || "other"}</p>
              <p>Updated: {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

