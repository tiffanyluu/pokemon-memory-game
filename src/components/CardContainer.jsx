import "../styles/CardContainer.css";
import Card from "./Card.jsx";
import { useRef, useState } from "react";

export default function CardContainer({
  score,
  setScore,
  highScore,
  setHighScore,
}) {
  const _set = useRef(new Set());
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleClick = (url) => {
    if (_set.current.has(url)) {
      if (score > highScore) {
        setHighScore(score);
      }
      _set.current.clear();
      setScore(0);
    } else {
      _set.current.add(url);
      setScore(score + 1);
    }
    setCards(shuffle([...cards]));
  };
  const getRandomUniqueIds = (count, max) => {
    const ids = new Set();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * max) + 1);
    }
    return [...ids];
  };

  const selectedIds = getRandomUniqueIds(12, 1025);
  const selectedUrls = selectedIds.map(
    (id) => `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  const [cards, setCards] = useState(() => shuffle(selectedUrls));

  return (
    <div className="container">
      {cards.map((url, i) => (
        <Card key={i} url={url} onClick={() => handleClick(url)} />
      ))}
    </div>
  );
}
