import React, { useEffect, useState } from "react";
import API from "../api/api";
import ReportTable from "../components/ReportTable";

function Reports() {
    const [rows, setRows] = useState([]);

    const loadReport = async () => {
        try {
            const res = await API.get("reports/inventory");
            setRows(res.data || []);
        } catch (error) {
            alert("Unable to load report.");
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    return (
        <div className="w-full max-w-[1126px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">Inventory valuation</p>
                    <h1 className="text-3xl font-semibold text-gray-800">Reports</h1>
                </div>
            </div>

            <ReportTable rows={rows} />
        </div>
    );
}

export default Reports;
