import { useState, useEffect } from 'react';

type autoCompleteList = {
  data: string[];
};

function App() {
  const [input, setInput] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [cardSelected, setCardSelected] = useState<string>("");
  // Send POST request only when a card is selected
  useEffect(() => {
    if (cardSelected) {
      fetch(`http://localhost:8080/add-card?card=${encodeURIComponent(cardSelected)}`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Card added:', data);
        })
        .catch((error) => {
          console.error("Error adding card:", error);
        });
    }
  }, [cardSelected]);

  // Handle input change and autocomplete fetch with debounce
  useEffect(() => {
    if (input.trim() === "") {
      setCards([]); // Clear cards if input is empty
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://localhost:8080/autocomplete?card=${encodeURIComponent(input)}`, {
        method: "GET",
      })
        .then((response) => response.json() as Promise<autoCompleteList>)
        .then((cardList) => {
          if (cardList.data.length === 0) {
            setCards(["no cards found..."]);
          } else {
            setCards(cardList.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 1000); // Wait 1s after last keystroke

    return () => {
      clearTimeout(timeout); // Cancel timeout if input changes
    };
  }, [input]);

  const cardList = cards.map((card, index) => (
    <li key={index}>
      <button onClick={() => setCardSelected(card)}>{card}</button>
    </li>
  ));

  return (
    <>
      <div>
        hello kdsjlfdjls 1212:
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <div>
          {cards.length === 0 ? <p>No cards found or loading...</p> : null}
        </div>
        <div>
          <ul>{cardList}</ul>
        </div>
      </div>
    </>
  );
}

export default App;
