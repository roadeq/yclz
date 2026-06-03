import React, { useEffect, useState } from "react";
import API from "../api/api";
import WarehouseForm from "../components/WarehouseForm";

function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadWarehouses = async () => {
        setLoading(true);
        try {
            const response = await API.get("/warehouses");
            setWarehouses(response.data || []);
        } catch (error) {
            alert("Unable to load warehouses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWarehouses();
    }, []);

    return (
        <div className="w-full max-w-[1126px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">Warehouse network</p>
                    <h1 className="text-3xl font-semibold text-gray-800">Warehouses</h1>
                </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <WarehouseForm onSaved={loadWarehouses} />
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-medium mb-4">Locations</h2>
                        <div className="overflow-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Name</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouses.length ? (
                                        warehouses.map((warehouse) => (
                                            <tr key={warehouse.warehouseCode} className="border-b">
                                                <td className="px-4 py-3">{warehouse.warehouseName}</td>
                                                <td className="px-4 py-3">{warehouse.warehouseLocation}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-6 text-center text-gray-500">{loading ? "Loading warehouses..." : "No warehouses found."}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Warehouses;
