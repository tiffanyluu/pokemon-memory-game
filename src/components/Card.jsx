import "../styles/Card.css";
import { useEffect, useState } from "react";

export default function Card({ url, onClick }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getAPIResource = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch {
        alert("error");
      }
    };
    getAPIResource();
  }, [url]);

  if (!data) return <div className="card">Loading...</div>;

  const name = data.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="card" onClick={onClick}>
      <img src={data.sprites.front_default} alt={name} />
      <div className="card-name">{name}</div>
    </div>
  );
}
