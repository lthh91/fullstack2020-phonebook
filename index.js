const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("content", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["content"](req, res),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234567",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(`<p> Phone book has info for ${persons.length} people </p>
                <p>${new Date()}</p>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
});

app.post("/api/persons/", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    res.status(400);
    res.json({ error: "Either name or number missing" });
    return;
  }
  if (persons.some((element) => element.name === person.name)) {
    res.status(409);
    res.json({ error: "Name must be unique" });
    return;
  }
  person.id = Math.floor(Math.random() * persons.length * 10);
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
