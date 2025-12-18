// src/components/dashboard/map/MapControls.tsx
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { LocateFixed, Download } from "lucide-react";
import { CSVLink } from "react-csv";

type Props = {
  heatmapOn: boolean;
  onToggleHeatmap: () => void;
  onLocateMe: () => void;
  csvData: any[];
};

export function MapControls({ heatmapOn, onToggleHeatmap, onLocateMe, csvData }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={heatmapOn} onChange={onToggleHeatmap} />
        Heatmap
      </label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onLocateMe}>
              <LocateFixed className="h-4 w-4 mr-2" />
              My Location
            </Button>
          </TooltipTrigger>
          <TooltipContent>Center map on your location</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CSVLink data={csvData} filename="mreport-reports.csv">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CSVLink>
    </div>
  );
}