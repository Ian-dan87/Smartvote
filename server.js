const express = require("express");
const app = express();

app.use(express.json());

const votes = {};
const voters = new Set();

const endTime = Date.now() + (5 * 24 * 60 * 60 * 1000);

app.get("/status", (req, res) => {
  const remaining = Math.max(0, endTime - Date.now());
  res.json({
    active: remaining > 0,
    remaining
  });
});

app.post("/vote", (req, res) => {
  if (Date.now() >= endTime) {
    return res.status(403).json({message: "Election has ended."});
  }

  const {voterId, candidate} = req.body;

  if (!voterId || !candidate) {
    return res.status(400).json({message: "Missing information."});
  }

  if (voters.has(voterId)) {
    return res.status(409).json({message: "This voter has already voted."});
  }

  voters.add(voterId);
  votes[candidate] = (votes[candidate] || 0) + 1;

  res.json({
    message: "Vote submitted successfully!",
    votes
  });
});

app.get("/results", (req, res) => {
  res.json(votes);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("SmartVote server running on port 3000");
  console.log("Election active for 5 days.");
});
