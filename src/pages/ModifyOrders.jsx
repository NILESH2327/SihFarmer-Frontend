import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { deleteJSON, getJSON } from '../api';
import { toast } from 'react-toastify';

// CommodityCard component without Call/Chat Buyer button
const CommodityCard = ({ commodity, onFavorite }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-48 flex items-center justify-center">
                <img
                    src={commodity.images?.[0] ?? 'https://via.placeholder.com/150'}
                    alt={commodity.title}
                    className="object-fill h-full w-full"
                />
            </div>
            {commodity.featured && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                    Featured
                </span>
            )}
            <button
                onClick={() => onFavorite(commodity._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
            >
                <Heart className="w-5 h-5 text-gray-600" />
            </button>
        </div>

        <div className="p-4">
            <p className="text-xs text-gray-500 mb-2">{commodity.postingDate}</p>
            <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 h-12">{commodity.title}</h3>

            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-bold text-gray-900">₹ {commodity.price.amount}</span>
                <span className="text-sm text-gray-600">/ {commodity.price.unit}</span>
            </div>

            <p className="text-sm text-gray-700 mb-1">{commodity.contractorInfo.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{commodity.contractorInfo.state}</span>
            </div>
        </div>
    </div>
);

// Editable card wrapper with always-visible Edit/Delete
const EditableOrderCard = ({
    order,
    isEditing,
    editedOrder,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}) => {
    const [localOrder, setLocalOrder] = useState(order);

    useEffect(() => {
        if (editedOrder) {
            setLocalOrder(editedOrder);
        } else {
            setLocalOrder(order);
        }
    }, [editedOrder, order]);

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-green-500 p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
                <input
                    type="text"
                    value={localOrder.title}
                    onChange={(e) =>
                        setLocalOrder((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Title"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={localOrder.price.amount}
                        onChange={(e) =>
                            setLocalOrder((prev) => ({
                                ...prev,
                                price: { ...prev.price, amount: Number(e.target.value) },
                            }))
                        }
                        placeholder="Amount"
                        className="border border-gray-300 rounded px-3 py-2 w-1/2"
                    />
                    <input
                        type="text"
                        value={localOrder.price.unit}
                        onChange={(e) =>
                            setLocalOrder((prev) => ({
                                ...prev,
                                price: { ...prev.price, unit: e.target.value },
                            }))
                        }
                        placeholder="Unit"
                        className="border border-gray-300 rounded px-3 py-2 w-1/2"
                    />
                </div>
                <input
                    type="text"
                    value={localOrder.contractorInfo.name}
                    onChange={(e) =>
                        setLocalOrder((prev) => ({
                            ...prev,
                            contractorInfo: { ...prev.contractorInfo, name: e.target.value },
                        }))
                    }
                    placeholder="Contractor Name"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <input
                    type="text"
                    value={localOrder.contractorInfo.state}
                    onChange={(e) =>
                        setLocalOrder((prev) => ({
                            ...prev,
                            contractorInfo: { ...prev.contractorInfo, state: e.target.value },
                        }))
                    }
                    placeholder="State"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <div className="flex justify-between">
                    <button
                        onClick={() => onCancel(order._id)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(order._id, localOrder)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <CommodityCard commodity={order} onFavorite={() => { }} />
            <div className="absolute inset-0 flex items-start justify-end p-2 opacity-100 transition-opacity gap-2">
                <button
                    onClick={() => onEdit(order._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(order._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export const ModifyOrdersPage = () => {
    const [orders, setOrders] = useState([
        {
            _id: '1',
            title: 'Organic Wheat 100 kg',
            price: { amount: 1800, unit: 'kg' },
            contractorInfo: { name: 'Rajesh Kumar', state: 'Punjab' },
            postingDate: '2025-11-28',
            images: ['https://example.com/wheat.jpg'],
            featured: true,
        },
        {
            _id: '2',
            title: 'Basmati Rice 50 kg',
            price: { amount: 2200, unit: 'kg' },
            contractorInfo: { name: 'Suresh Agarwal', state: 'Haryana' },
            postingDate: '2025-11-27',
            images: ['https://example.com/rice.jpg'],
            featured: false,
        },
    ]);
    const [editingIds, setEditingIds] = useState([]);
    const [editedOrders, setEditedOrders] = useState({});
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        //   setLoading(true);
        try {
            const queryParams = {
                isProfile: true,
            };

            const response = await getJSON('/requirements', queryParams);
            console.log('Fetched requirements:', response);

            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch requirements:', error);
        } finally {
            // setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [])




    const onEdit = (id) => {
        navigate(`/requirements/edit/${id}`)

        setEditingIds((prev) => [...prev, id]);
        setEditedOrders((prev) => ({ ...prev, [id]: orders.find((o) => o._id === id) }));
    };

    const onCancel = (id) => {
        setEditingIds((prev) => prev.filter((eid) => eid !== id));
        setEditedOrders((prev) => {
            const newEdits = { ...prev };
            delete newEdits[id];
            return newEdits;
        });
    };

    const onSave = (id, updatedOrder) => {
        setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
        onCancel(id);
    };

    const onDelete = async(id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contract?"
        );

        if (!confirmDelete) return;

        try {
            const res = await deleteJSON(`/requirements/${id}`);
            console.log(res);
            if (res.success) {
                toast("Contect deleted successfully!");
                fetchData(); // refresh list
            } else {
                toast("Failed to delete Contract.");
            }
        } catch (err) {
            console.error(err);
            toast("Error deleting Contract");
        }


       
      
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Modify Your Orders</h1>
                    <Link
                        to="/requirements"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                        Back to Requirements
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No orders found.</p>
                    ) : (
                        orders.map((order) => (
                            <EditableOrderCard
                                key={order._id}
                                order={order}
                                isEditing={editingIds.includes(order._id)}
                                editedOrder={editedOrders[order._id]}
                                onEdit={onEdit}
                                onSave={onSave}
                                onCancel={onCancel}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
