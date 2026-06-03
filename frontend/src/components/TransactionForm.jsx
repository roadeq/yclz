import React, { useState, useEffect } from "react";
import API from "../api/api";

function TransactionForm({ onSaved }) {
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        transactionDate: new Date().toISOString().slice(0, 10),
        quantityMoved: "0",
        transactionType: "Stock In",
        productCode: "",
        warehouseCode: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productRes, warehouseRes] = await Promise.all([
                    API.get("/products"),
                    API.get("/warehouses")
                ]);
                setProducts(productRes.data || []);
                setWarehouses(warehouseRes.data || []);
                if (productRes.data.length) {
                    setFormData((state) => ({ ...state, productCode: String(productRes.data[0].productCode) }));
                }
                if (warehouseRes.data.length) {
                    setFormData((state) => ({ ...state, warehouseCode: String(warehouseRes.data[0].warehouseCode) }));
                }
            } catch (error) {
                alert("Unable to load transaction data.");
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await API.post("/transactions", {
                ...formData,
                quantityMoved: Number(formData.quantityMoved),
                productCode: Number(formData.productCode),
                warehouseCode: Number(formData.warehouseCode)
            });

            setFormData((state) => ({
                ...state,
                quantityMoved: "0"
            }));

            onSaved();
        } catch (error) {
            alert("Unable to save transaction. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700">Date</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Type</label>
                    <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" name="transactionType" value={formData.transactionType} onChange={handleChange}>
                        <option>Stock In</option>
                        <option>Stock Out</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Product</label>
                    <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" name="productCode" value={formData.productCode} onChange={handleChange} required>
                        {products.map((product) => (
                            <option key={product.productCode} value={product.productCode}>
                                {product.productName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Warehouse</label>
                    <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" name="warehouseCode" value={formData.warehouseCode} onChange={handleChange} required>
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.warehouseCode} value={warehouse.warehouseCode}>
                                {warehouse.warehouseName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Quantity</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="number" min="1" name="quantityMoved" value={formData.quantityMoved} onChange={handleChange} required />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md" type="submit" disabled={saving || !products.length || !warehouses.length}>{saving ? "Saving..." : "Add Transaction"}</button>
            </form>
        </div>
    );
}

export default TransactionForm;
