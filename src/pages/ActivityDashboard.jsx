import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { FaSeedling, FaTractor, FaWater, FaCheckCircle } from 'react-icons/fa'; // Example icons
import { getJSON } from '../api';
import { FaTint, FaLeaf, FaBug, FaTractor, FaEllipsisH } from 'react-icons/fa';

const iconsMap = {
  irrigation: <FaTint />,              // Water drop icon
  fertilization: <FaLeaf />,           // Leaf icon
  pesticide_application: <FaBug />,    // Bug icon
  harvesting: <FaTractor />,           // Tractor icon
  other: <FaEllipsisH />,              // Ellipsis (three dots) icon
};


const ActivityDashboard = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getJSON('/activity/list')
      .then(res => setActivities(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Activity Dashboard</h2>
      <ul>

        {activities? activities.map(act => (
          <li key={act._id} className="flex items-center space-x-4 p-3 border-b">
            <div className="text-green-600 text-2xl">
              {iconsMap[act.type] || <FaCheckCircle />}
            </div>
            <div>
              <div className="font-semibold capitalize">{act.type}</div>
              {act.note && <div className="text-gray-600">{act.note}</div>}
              <div className="text-sm text-gray-400">{new Date(act.timestamp).toLocaleString()}</div>
            </div>
          </li>
        )): <p>No activities recorded.</p>}
      </ul>
    </div>
  );
};

export default ActivityDashboard;
