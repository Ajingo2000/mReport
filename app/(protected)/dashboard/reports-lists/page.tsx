"use client";

import React, {useState, useEffect} from 'react';
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ReportLists = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading for 2 seconds
        return () => clearTimeout(timer);
    }, []);

  
    const reports = [
        { id: 1, name: 'Incident Report 1', date: '2023-10-01', status: 'Open' },
        { id: 2, name: 'Incident Report 2', date: '2023-10-02', status: 'Closed' },
        { id: 3, name: 'Incident Report 3', date: '2023-10-03', status: 'In Progress' },
    ];

  if (loading) {
        return (
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background">
                    <DashboardSidebar />
                    <div className="flex-1 flex flex-col">
                        <DashboardNavbar onToggleActivityFeed={() => { }} showActivityFeed={false} />
                        <div className="p-4">
                            <h1 className="text-2xl font-bold mb-4">Incident Reports</h1>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="animate-pulse flex space-x-4">
                                        <div className="h-4 bg-gray-300 rounded w-1/12"></div>
                                        <div className="h-4 bg-gray-300 rounded w-4/12"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/12"></div>
                                        <div className="h-4 bg-gray-300 rounded w-2/12"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        );
    }

    return (

        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <DashboardSidebar />
                <div className="flex-1 flex flex-col">
                    <DashboardNavbar onToggleActivityFeed={() => { }} showActivityFeed={false} />
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-4">Incident Reports</h1>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td className="border border-gray-300 px-4 py-2">{report.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{report.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ReportLists;