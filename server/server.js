const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DB_FILE = path.join(__dirname, "db.json");

let db = {
  cards: [],
  users: [],
  batches: []
};

if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

app.get("/cards", (req, res) => {
  const userId = req.query.userId;
  let cards = db.cards;
  if (userId) {
    cards = cards.filter(card => card.userId === userId);
  }
  res.json(cards);
});

app.get("/cards/:id", (req, res) => {
  const card = db.cards.find(c => c.id === req.params.id);
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ error: "Card not found" });
  }
});

app.post("/cards", (req, res) => {
  const newCard = {
    id: `card-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.cards.push(newCard);
  saveDB();
  res.status(201).json(newCard);
});

app.put("/cards/:id", (req, res) => {
  const index = db.cards.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.cards[index] = { ...db.cards[index], ...req.body };
    saveDB();
    res.json(db.cards[index]);
  } else {
    res.status(404).json({ error: "Card not found" });
  }
});

app.delete("/cards/:id", (req, res) => {
  const index = db.cards.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.cards.splice(index, 1);
    saveDB();
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Card not found" });
  }
});

app.post("/cards/batch", (req, res) => {
  const { cards } = req.body;
  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: "Expected array of cards" });
  }

  const results = {
    created: 0,
    failed: 0,
    cards: []
  };

  cards.forEach(card => {
    try {
      const newCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...card,
        createdAt: new Date().toISOString(),
      };
      db.cards.push(newCard);
      results.cards.push(newCard);
      results.created++;
    } catch (error) {
      results.failed++;
    }
  });

  saveDB();
  res.json(results);
});

app.post("/auth/register", (req, res) => {
  const { email, name } = req.body;
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    name,
    stats: {
      totalCards: 0,
      learnedCards: 0,
      reviewDue: 0,
      streak: 0,
      lastActive: new Date().toISOString()
    }
  };
  db.users.push(newUser);
  saveDB();
  res.json({
    token: "mock-jwt-token",
    user: newUser
  });
});

app.post("/auth/login", (req, res) => {
  const { email } = req.body;
  let user = db.users.find(u => u.email === email);

  if (!user) {
    user = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      stats: {
        totalCards: 0,
        learnedCards: 0,
        reviewDue: 0,
        streak: 0,
        lastActive: new Date().toISOString()
      }
    };
    db.users.push(user);
    saveDB();
  }

  res.json({
    token: "mock-jwt-token",
    user
  });
});

app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  GET    /cards");
  console.log("  POST   /cards");
  console.log("  POST   /cards/batch");
  console.log("  POST   /auth/login");
  console.log("  POST   /auth/register");
});