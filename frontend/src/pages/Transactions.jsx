import React, { useEffect, useState } from "react";
import API from "../api/api";
import TransactionForm from "../components/TransactionForm";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const response = await API.get("/transactions");
            setTransactions(response.data || []);
        } catch (error) {
            alert("Unable to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <div className="w-full max-w-[1126px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">Track stock movement</p>
                    <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>
                </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <TransactionForm onSaved={loadTransactions} />
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-medium mb-4">Transaction History</h2>
                        <div className="overflow-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Date</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Type</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Product</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Warehouse</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length ? (
                                        transactions.map((transaction) => (
                                            <tr key={transaction.transactionID} className="border-b">
                                                <td className="px-4 py-3">{transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : "-"}</td>
                                                <td className="px-4 py-3">{transaction.transactionType}</td>
                                                <td className="px-4 py-3">{transaction.productName}</td>
                                                <td className="px-4 py-3">{transaction.warehouseName}</td>
                                                <td className="px-4 py-3">{transaction.quantityMoved}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">{loading ? "Loading transactions..." : "No transactions found."}</td>
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

export default Transactions;
