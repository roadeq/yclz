import React, { useState } from "react";
import API from "../api/api";

function ProductForm({ onSaved }) {
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        quantityInStock: "0",
        unitPrice: "0",
        supplierName: "",
        dateReceived: ""
    });
    const [saving, setSaving] = useState(false);

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
            await API.post("/products", {
                ...formData,
                quantityInStock: Number(formData.quantityInStock),
                unitPrice: Number(formData.unitPrice)
            });

            setFormData({
                productName: "",
                category: "",
                quantityInStock: "0",
                unitPrice: "0",
                supplierName: "",
                dateReceived: ""
            });

            onSaved();
        } catch (error) {
            alert("Unable to save product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700">Product Name</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="text" name="productName" value={formData.productName} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Category</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="text" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-gray-700">Quantity</label>
                        <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="number" min="0" name="quantityInStock" value={formData.quantityInStock} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Unit Price</label>
                        <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="number" min="0" step="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Supplier</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Date Received</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="date" name="dateReceived" value={formData.dateReceived} onChange={handleChange} required />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md" type="submit" disabled={saving}>{saving ? "Saving..." : "Add Product"}</button>
            </form>
        </div>
    );
}

export default ProductForm;
