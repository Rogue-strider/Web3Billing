import React, { useEffect, useState } from "react";
import axios from "axios";

const Webhooks = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWebhooks = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/api/merchant/webhooks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Failed to load webhooks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Webhook Events</h1>

        <div className="bg-gray-900 rounded-xl overflow-hidden border border-white border-opacity-10">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr className="text-left">
                <th className="p-4">Event</th>
                <th className="p-4">Status</th>
                <th className="p-4">Response</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td className="p-4">Loading...</td>
                </tr>
              )}

              {!loading && events.length === 0 && (
                <tr>
                  <td className="p-4">No webhook events yet</td>
                </tr>
              )}

              {events.map((e) => (
                <tr
                  key={e._id}
                  className="border-t border-white border-opacity-5"
                >
                  <td className="p-4">{e.event}</td>

                  <td className="p-4">
                    {e.status === "success" ? (
                      <span className="text-green-400">Success</span>
                    ) : (
                      <span className="text-red-400">Failed</span>
                    )}
                  </td>

                  <td className="p-4">{e.responseStatus || e.error || "-"}</td>

                  <td className="p-4 text-gray-400">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;
