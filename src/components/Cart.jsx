import { useState } from "react";
import { api, money } from "../api.js";

export default function Cart({ open, lines, total, onClose, onQty, onOrdered }) {
  const [form, setForm] = useState({ customerName: "", customerPhone: "", deliveryAddress: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api.placeOrder({
        ...form,
        items: lines.map((l) => ({ foodId: l.food.id, quantity: l.quantity })),
      });
      onOrdered(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Your cart">
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button className="link" onClick={onClose}>Close</button>
        </div>

        {lines.length === 0 ? (
          <p className="note">Your cart is empty. Add a dish from the menu to get started.</p>
        ) : (
          <form onSubmit={submit}>
            <ul className="lines">
              {lines.map(({ food, quantity }) => (
                <li key={food.id}>
                  <div>
                    <strong>{food.name}</strong>
                    <span className="muted">{money(food.price)} each</span>
                  </div>
                  <div className="stepper">
                    <button type="button" aria-label={`Remove one ${food.name}`} onClick={() => onQty(food.id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button type="button" aria-label={`Add one more ${food.name}`} onClick={() => onQty(food.id, quantity + 1)}>+</button>
                  </div>
                  <span className="line-total">{money(quantity * food.price)}</span>
                </li>
              ))}
            </ul>

            <div className="total"><span>Total</span><strong>{money(total)}</strong></div>

            <label>Name
              <input required value={form.customerName} onChange={set("customerName")} autoComplete="name" />
            </label>
            <label>Phone number
              <input required type="tel" value={form.customerPhone} onChange={set("customerPhone")} autoComplete="tel" />
            </label>
            <label>Delivery address
              <textarea required rows={3} value={form.deliveryAddress} onChange={set("deliveryAddress")} autoComplete="street-address" />
            </label>

            {error && <p className="note error" role="alert">{error}</p>}

            <button className="btn big" disabled={busy}>
              {busy ? "Placing order…" : `Place order · ${money(total)}`}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
