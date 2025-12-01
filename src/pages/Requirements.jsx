// RequirementDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJSON } from "../api";
import { MapPin, Phone } from "lucide-react";
import Modal from "../components/Market/Modal";

const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1610986621188-d4ca7f62cb94?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1597946170844-e420c04e2aca?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop"
];

const RequirementDetails = () => {
  const { id  } = useParams();
  const [req, setReq] = useState(null);
  const [latest, setLatest] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchDetails = async () => {
    const res = await getJSON(`/requirements/${id}`);
    console.log('Fetched requirement details:', res);
    setReq(res.data);
  };

  const fetchLatest = async () => {
    const res = await getJSON(`/requirements?type=sell&limit=4`);
    setLatest(res.data || []);
  };

  useEffect(() => {
    fetchDetails();
    fetchLatest();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);

  if (!req) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Loading requirement...</p>
      </div>
    </div>
  );

  // Get first available image or dummy
  const mainImage = req.images?.[0] || DUMMY_IMAGES[0];
  const sellerImage = req.contractorInfo?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&crop=face";

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Contact Seller">
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm text-gray-700">Contact the seller:</p>
            <p className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-emerald-500" />
              <a href={`tel:${req.contractorInfo?.phone}`} className="text-emerald-600 font-medium underline hover:no-underline">
                {req.contractorInfo?.phone}
              </a>
            </p>
          </div>
        </Modal>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* PRODUCT INFO */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="relative mb-4">
              <img
                src={mainImage}
                alt={req.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              {req.featured && (
                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2">{req.title}</h1>

            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-emerald-600">
                ₹{req.price.amount} / {req.price.unit}
              </p>
              <button className="border border-emerald-300 text-emerald-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                Ask Price
              </button>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div><span className="font-medium text-gray-800">Product:</span> {req.product.name}</div>
              <div><span className="font-medium text-gray-800">Variety:</span> {req.product.variety}</div>
              <div><span className="font-medium text-gray-800">Location:</span> {req.product.location}</div>
              <div><span className="font-medium text-gray-800">Frequency:</span> {req.product.buyingFrequency}</div>
            </div>

            {/* Note */}
            {req.note && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Note</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{req.note}</p>
              </div>
            )}
          </div>

          {/* SELLER CARD */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 h-fit">
            <h2 className="text-base font-medium text-gray-900 mb-4">Seller</h2>
            
            <div className="text-center mb-4">
              <img
                src={sellerImage}
                alt={req.contractorInfo?.name}
                className="w-16 h-16 rounded-full mx-auto border-2 border-gray-200 object-cover"
              />
              <h3 className="text-sm font-semibold mt-2">{req.contractorInfo?.name}</h3>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <MapPin size={14} />
                {req.contractorInfo?.state}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-emerald-500 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Call Seller
            </button>
          </div>
        </div>

        {/* LATEST LEADS */}
        {latest.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Latest Similar Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map((item) => {
                const itemImage = item.images?.[0] || DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)];
                return (
                  <div key={item._id} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-shadow">
                    <img
                      src={itemImage}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-500 mb-1">
                      {item.postingDate ? new Date(item.postingDate).toLocaleDateString() : "Recent"}
                    </p>
                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                      {item.title.length > 35 ? item.title.slice(0, 35) + "..." : item.title}
                    </h3>
                    <p className="text-emerald-600 font-semibold text-sm">
                      ₹{item.price.amount}/{item.price.unit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementDetails;
