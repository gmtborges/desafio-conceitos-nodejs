const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const newRepository = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    response.status(400).json({ message: "Repository not found" });
  }

  const repository = {
    ...repositories[repositoryIndex],
    url,
    title,
    techs,
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    response.status(400).json({ message: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    response.status(400).json({ message: "Repository not found" });
  }

  repositories[repositoryIndex].likes++;

  return response.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
