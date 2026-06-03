import React from "react";

function ReportTable({ rows }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Inventory Report</h2>
            <div className="overflow-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Code</th>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Name</th>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Category</th>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Qty</th>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Unit Price</th>
                            <th className="text-left px-4 py-2 text-sm text-gray-600">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length ? (
                            rows.map((row) => (
                                <tr key={row.productCode} className="border-b">
                                    <td className="px-4 py-3">{row.productCode}</td>
                                    <td className="px-4 py-3">{row.productName}</td>
                                    <td className="px-4 py-3">{row.category}</td>
                                    <td className="px-4 py-3">{row.quantityInStock}</td>
                                    <td className="px-4 py-3">${Number(row.unitPrice).toFixed(2)}</td>
                                    <td className="px-4 py-3">${Number(row.totalValue).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No report data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportTable;
