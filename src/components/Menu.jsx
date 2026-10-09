import { useEffect, useMemo, useState } from "react";
import { api, money } from "../api.js";

export default function Menu({ cart, onAdd, onQty }) {
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getFoods()
      .then(setFoods)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(foods.map((f) => f.category))],
    [foods]
  );

  const visible = foods.filter(
    (f) =>
      (category === "All" || f.category === category) &&
      f.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) return <p className="note">Loading the menu…</p>;
  if (error)
    return (
      <p className="note error">
        Can't reach the server ({error}). Check that the backend is running on port 8080.
      </p>
    );

  return (
    <section>
      <div className="intro">
        <h2>What are you hungry for?</h2>
        <input
          className="search"
          type="search"
          placeholder="Search dishes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search dishes"
        />
      </div>

      <div className="chips" role="tablist" aria-label="Categories">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? "chip on" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="note">No dishes match. Try a different search or category.</p>
      ) : (
        <ul className="grid">
          {visible.map((f) => {
            const qty = cart[f.id]?.quantity || 0;
            return (
              <li key={f.id} className="dish">
                <div className="dish-body">
                  <h3>{f.name}</h3>
                  <p className="desc">{f.description}</p>
                </div>
                <div className="dish-foot">
                  <span className="price">{money(f.price)}</span>
                  {qty === 0 ? (
                    <button className="btn" onClick={() => onAdd(f)}>
                      Add
                    </button>
                  ) : (
                    <div className="stepper">
                      <button aria-label={`Remove one ${f.name}`} onClick={() => onQty(f.id, qty - 1)}>−</button>
                      <span>{qty}</span>
                      <button aria-label={`Add one more ${f.name}`} onClick={() => onQty(f.id, qty + 1)}>+</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
