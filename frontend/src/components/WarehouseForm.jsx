import React, { useState } from "react";
import API from "../api/api";

function WarehouseForm({ onSaved }) {
    const [formData, setFormData] = useState({
        warehouseName: "",
        warehouseLocation: ""
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
            await API.post("/warehouses", formData);

            setFormData({
                warehouseName: "",
                warehouseLocation: ""
            });

            onSaved();
        } catch (error) {
            alert("Unable to save warehouse. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Add Warehouse</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700">Name</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="text" name="warehouseName" value={formData.warehouseName} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm text-gray-700">Location</label>
                    <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" type="text" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} required />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md" type="submit" disabled={saving}>{saving ? "Saving..." : "Add Warehouse"}</button>
            </form>
        </div>
    );
}

export default WarehouseForm;
