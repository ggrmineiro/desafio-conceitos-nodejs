const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length === 0) {
    return response.status(200).json({ msg: "No projects found." });
  }

  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  
  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ msg: "Repository doesn't exists." });
  }

  const originalLike = repositories[index].likes;
  const repository = {
    id,
    title,
    url,
    techs,
    likes: originalLike,
  };
  repositories[index] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ msg: "Repository not found." });
  }
  repositories.splice(index, 1);
  console.log(repositories[index]);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ msg: "Repository not found." });
  }

  repository = repositories[index];
  repository.likes = repository.likes + 1;

  return response.status(200).json(repository);
});

module.exports = app;
