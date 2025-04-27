import "../styles/CardContainer.css";
import Card from "./Card.jsx";
import { useRef, useState, useEffect } from "react";

export default function CardContainer({
  score,
  setScore,
  highScore,
  setHighScore,
}) {
  const _set = useRef(new Set());
  const [unclickedPokemonIds, setUnclickedPokemonIds] = useState([]);
  const [cards, setCards] = useState([]);

  const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const getRandomUniqueIds = (count, max) => {
    const ids = new Set();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * max) + 1);
    }
    return [...ids];
  };

  useEffect(() => {
    const selectedIds = getRandomUniqueIds(12, 1025);
    const selectedUrls = selectedIds.map(
      (id) => `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    setCards(shuffle(selectedUrls));
  }, []);

  const handleClick = (url) => {
    if (_set.current.has(url)) {
      const unclicked = cards.filter((cardUrl) => !_set.current.has(cardUrl));
      const unclickedIds = unclicked.map((pokeUrl) =>
        pokeUrl.split("/").filter(Boolean).pop()
      );

      console.log("Unclicked Pokémon IDs:", unclickedIds);
      setUnclickedPokemonIds(unclickedIds);

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

  return (
    <div className="container">
      {cards.map((url, i) => {
        const id = url.split("/").filter(Boolean).pop();
        return (
          <Card
            key={i}
            url={url}
            onClick={() => handleClick(url)}
            glow={unclickedPokemonIds.includes(id)}
          />
        );
      })}
    </div>
  );
}
