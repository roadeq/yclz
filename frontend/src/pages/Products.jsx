import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "../components/ProductForm";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get("/products");
            setProducts(response.data || []);
        } catch (error) {
            alert("Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (productCode) => {
        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {
            await API.delete(`/products/${productCode}`);
            loadProducts();
        } catch (error) {
            alert("Unable to delete product.");
        }
    };

    return (
        <div className="w-full max-w-[1126px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">Manage stock and inventory</p>
                    <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
                </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ProductForm onSaved={loadProducts} />
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-medium mb-4">Product List</h2>
                        <div className="overflow-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Name</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Category</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Stock</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Unit Price</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Supplier</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Date</th>
                                        <th className="text-left px-4 py-2 text-sm text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length ? (
                                        products.map((product) => (
                                            <tr key={product.productCode} className="border-b">
                                                <td className="px-4 py-3">{product.productName}</td>
                                                <td className="px-4 py-3">{product.category}</td>
                                                <td className="px-4 py-3">{product.quantityInStock}</td>
                                                <td className="px-4 py-3">${Number(product.unitPrice).toFixed(2)}</td>
                                                <td className="px-4 py-3">{product.supplierName}</td>
                                                <td className="px-4 py-3">{product.dateReceived ? new Date(product.dateReceived).toLocaleDateString() : "-"}</td>
                                                <td className="px-4 py-3"><button className="text-red-600 hover:underline" onClick={() => handleDelete(product.productCode)}>Delete</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-gray-500">{loading ? "Loading products..." : "No products found."}</td>
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

export default Products;
