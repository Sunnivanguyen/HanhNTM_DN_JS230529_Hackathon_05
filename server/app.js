require("dotenv").config();

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 7001;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const readRoundsFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      `${__dirname}/dev-data/data/score-keeper.json`,
      "utf-8"
    );

    // const dataJSON = JSON.parse(data);

    // const { game } = dataJSON[0];
    req.rounds = JSON.parse(data);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while reading the file",
    });
  }
};

app.get("/api/v1/rounds", readRoundsFile, (req, res) => {
  const rounds = req.rounds;
  res.status(200).json({
    status: "success",
    results: rounds.length,
    data: rounds,
  });
});

app.post("/api/v1/rounds", readRoundsFile, async (req, res, next) => {
  const rounds = req.rounds;
  const newRound = {
    id: rounds[rounds.length - 1].id + 1,
    players: req.body?.players,
  };
  rounds.push(newRound);

  try {
    await fs.promises.writeFile(
      `${__dirname}/dev-data/data/score-keeper.json`,
      JSON.stringify(rounds)
    );
    res.status(201).json({
      status: "success",
      result: rounds.length,
      data: rounds,
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/v1/rounds", readRoundsFile, async (req, res, next) => {
  const rounds = req.rounds;
  const { players } = rounds;
  if (players[0].rounds.length === 0) {
    const updatedRound = {
      idRound: 1,
      score: 0,
    };
  } else {
    const updatedRound = {
      idRound: players[0].rounds[1] + 1,
      score: players[0].rounds[1] + 1,
    };
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
