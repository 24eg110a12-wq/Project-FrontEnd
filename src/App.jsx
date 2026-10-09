import { useMemo, useState } from "react";
import Menu from "./components/Menu.jsx";
import Cart from "./components/Cart.jsx";
import Orders from "./components/Orders.jsx";
import Kitchen from "./components/Kitchen.jsx";
import { money } from "./api.js";

const TABS = [
  { id: "menu", label: "Menu" },
  { id: "orders", label: "My orders" },
  { id: "kitchen", label: "Kitchen" },
];

export default function App() {
  const [tab, setTab] = useState("menu");
  const [cart, setCart] = useState({}); // { foodId: { food, quantity } }
  const [cartOpen, setCartOpen] = useState(false);
  const [lastPhone, setLastPhone] = useState("");

  const lines = Object.values(cart);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const total = useMemo(
    () => lines.reduce((s, l) => s + l.quantity * Number(l.food.price), 0),
    [cart]
  );

  const add = (food) =>
    setCart((c) => ({
      ...c,
      [food.id]: { food, quantity: (c[food.id]?.quantity || 0) + 1 },
    }));

  const setQty = (id, quantity) =>
    setCart((c) => {
      const next = { ...c };
      if (quantity <= 0) delete next[id];
      else next[id] = { ...next[id], quantity };
      return next;
    });

  const onOrdered = (order) => {
    setCart({});
    setCartOpen(false);
    setLastPhone(order.customerPhone);
    setTab("orders");
  };

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <h1 className="brand">Basil &amp; Co.</h1>
          <nav className="tabs" aria-label="Main">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "tab on" : "tab"}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            Cart
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </header>

      <main className="page">
        {tab === "menu" && <Menu cart={cart} onAdd={add} onQty={setQty} />}
        {tab === "orders" && <Orders initialPhone={lastPhone} />}
        {tab === "kitchen" && <Kitchen />}
      </main>

      {count > 0 && !cartOpen && tab === "menu" && (
        <button className="cart-bar" onClick={() => setCartOpen(true)}>
          <span>{count} {count === 1 ? "item" : "items"}</span>
          <span>View cart · {money(total)}</span>
        </button>
      )}

      <Cart
        open={cartOpen}
        lines={lines}
        total={total}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onOrdered={onOrdered}
      />
    </>
  );
}
