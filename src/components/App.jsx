import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetchToys();
  }, []);

  async function fetchToys() {
    try {
      const response = await fetch("http://localhost:3000/toys");
      if (response.ok) {
        const data = await response.json();
        setToys(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching toys:", error);
    }
  }

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleAddToy(formData) {
    try {
      const response = await fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, likes: 0 }),
      });
      if (response.ok) {
        const newToy = await response.json();
        setToys((prev) => [...prev, newToy]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding toy:", error);
    }
  }

  async function handleLikeToy(toy) {
    try {
      const response = await fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: toy.likes + 1 }),
      });
      if (response.ok) {
        const updatedToy = await response.json();
        setToys((prev) =>
          prev.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        );
      }
    } catch (error) {
      console.error("Error liking toy:", error);
    }
  }

  async function handleDonateToy(toy) {
    try {
      const response = await fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setToys((prev) => prev.filter((t) => t.id !== toy.id));
      }
    } catch (error) {
      console.error("Error donating toy:", error);
    }
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onSubmit={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onLike={handleLikeToy}
        onDonate={handleDonateToy}
      />
    </>
  );
}

export default App;
