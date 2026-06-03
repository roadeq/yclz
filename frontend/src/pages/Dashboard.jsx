import React, { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {
    const [stats, setStats] = useState({ products: 0, warehouses: 0, transactions: 0, inventoryValue: 0 });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productRes, warehouseRes, transactionRes, reportRes] = await Promise.all([
                    API.get("/products"),
                    API.get("/warehouses"),
                    API.get("/transactions"),
                    API.get("reports/inventory")
                ]);

                const inventoryValue = (reportRes.data || []).reduce((sum, item) => sum + Number(item.totalValue || 0), 0);

                setStats({
                    products: productRes.data.length,
                    warehouses: warehouseRes.data.length,
                    transactions: transactionRes.data.length,
                    inventoryValue
                });
            } catch (error) {
                setStats({ products: 0, warehouses: 0, transactions: 0, inventoryValue: 0 });
            }
        };

        loadStats();
    }, []);

    return (
        <div className="w-full max-w-[1126px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">Welcome back to StockHub</p>
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.products}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Warehouses</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.warehouses}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Transactions</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.transactions}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Inventory Value</p>
                        <p className="text-2xl font-semibold text-gray-800">${stats.inventoryValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
    );
}

export default Dashboard;
