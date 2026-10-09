import { useEffect, useState } from "react";
import { api } from "../api.js";
import OrderCard from "./OrderCard.jsx";
import { statusLabel } from "./StatusPill.jsx";

const NEXT = {
  PLACED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const FILTERS = ["ALL", "PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setOrders(await api.getOrders(filter === "ALL" ? {} : { status: filter }));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(t);
  }, [filter]);

  const advance = async (o) => {
    try {
      await api.updateStatus(o.id, NEXT[o.status]);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Kitchen orders</h2>
      <div className="chips">
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "chip on" : "chip"} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : statusLabel(f)}
          </button>
        ))}
      </div>

      {error && <p className="note error" role="alert">{error}</p>}
      {orders.length === 0 ? (
        <p className="note">No orders here yet. New orders appear automatically.</p>
      ) : (
        <ul className="orders">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o}>
              {NEXT[o.status] && (
                <button className="btn" onClick={() => advance(o)}>
                  Mark as {statusLabel(NEXT[o.status]).toLowerCase()}
                </button>
              )}
            </OrderCard>
          ))}
        </ul>
      )}
    </section>
  );
}
