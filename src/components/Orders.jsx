import { useEffect, useState } from "react";
import { api } from "../api.js";
import OrderCard from "./OrderCard.jsx";

export default function Orders({ initialPhone }) {
  const [phone, setPhone] = useState(initialPhone || "");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = async (p = phone) => {
    if (!p.trim()) return;
    setError("");
    try {
      setOrders(await api.getOrders({ phone: p }));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (initialPhone) load(initialPhone);
  }, [initialPhone]);

  const cancel = async (id) => {
    try {
      await api.cancelOrder(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Track your orders</h2>
      <form
        className="lookup"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          type="tel"
          placeholder="Phone number used when ordering"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone number"
        />
        <button className="btn">Find orders</button>
      </form>

      {error && <p className="note error" role="alert">{error}</p>}
      {orders && orders.length === 0 && (
        <p className="note">No orders found for that number.</p>
      )}
      {orders && orders.length > 0 && (
        <ul className="orders">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o}>
              {o.status === "PLACED" && (
                <button className="link danger" onClick={() => cancel(o.id)}>
                  Cancel order
                </button>
              )}
            </OrderCard>
          ))}
        </ul>
      )}
    </section>
  );
}
