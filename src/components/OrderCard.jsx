import { money } from "../api.js";
import StatusPill from "./StatusPill.jsx";

export default function OrderCard({ order, children }) {
  const when = order.createdAt
    ? new Date(order.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "";
  return (
    <li className="order">
      <div className="order-head">
        <div>
          <h3>Order #{order.id}</h3>
          <span className="muted">{when}</span>
        </div>
        <StatusPill status={order.status} />
      </div>
      <ul className="order-items">
        {order.items.map((i) => (
          <li key={i.id}>
            <span>{i.quantity} × {i.food.name}</span>
            <span>{money(i.quantity * i.unitPrice)}</span>
          </li>
        ))}
      </ul>
      <div className="order-foot">
        <div className="muted">
          {order.customerName} · {order.customerPhone}
          <br />
          {order.deliveryAddress}
        </div>
        <strong>{money(order.totalAmount)}</strong>
      </div>
      {children}
    </li>
  );
}
