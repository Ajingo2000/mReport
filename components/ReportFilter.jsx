import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { RefreshCcw } from "lucide-react";

const ReportFilter = ({ onFilterChange }) => {
  const [selectedReportType, setSelectedReportType] = useState("all-types"); // Default to "all-types"
  const [selectedStatus, setSelectedStatus] = useState("all-statuses"); // Default to "all-statuses"

  // Handle report type change
  const handleReportTypeChange = (value) => {
    setSelectedReportType(value);
    onFilterChange({
      reportType: value === "all-types" ? "" : value, // Map "all-types" to empty string for no filter
      status: selectedStatus === "all-statuses" ? "" : selectedStatus,
    });
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    onFilterChange({
      reportType: selectedReportType === "all-types" ? "" : selectedReportType,
      status: value === "all-statuses" ? "" : value, // Map "all-statuses" to empty string for no filter
    });
  };

  // Reset filters when component mounts or parent triggers reset
  useEffect(() => {
    setSelectedReportType("all-types");
    setSelectedStatus("all-statuses");
    onFilterChange({ reportType: "", status: "" });
  }, [onFilterChange]);

  return (
    <div className="p-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-2 items-center justify-between">
      {/* Filter Header with Icon */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span>Filter Reports</span>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {/* Report Type Select */}
        <Select value={selectedReportType} onValueChange={handleReportTypeChange} aria-label="Select report type">
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-gray-700 rounded-md">
            <SelectItem value="all-types" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              All Types
            </SelectItem>
            <SelectItem value="damage" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Damage
            </SelectItem>
            <SelectItem value="assistance" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Assistance
            </SelectItem>
            <SelectItem value="srhr" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              SRHR Need
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select value={selectedStatus} onValueChange={handleStatusChange} aria-label="Select report status">
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-gray-700 rounded-md">
            <SelectItem value="all-statuses" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              All Statuses
            </SelectItem>
            <SelectItem value="Pending" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Pending
            </SelectItem>
            <SelectItem value="Resolved" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Resolved
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          onClick={() => {
            setSelectedReportType("all-types");
            setSelectedStatus("all-statuses");
            onFilterChange({ reportType: "", status: "" });
          }}
          aria-label="Reset filters"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ReportFilter;