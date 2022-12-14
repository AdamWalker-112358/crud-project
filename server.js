import express from "express";
import morgan from "morgan";
import userRouter from './routes/users.js';

const { HOST = "localhost", PORT = 3123 } = process.env;

const server = express();
;

server.use(morgan("dev"));
server.use(express.json());

server.use('/users', userRouter)

server.use((request, response) => {
  response.status(404).send(`404 Path Doesn't exist`);
});

server.listen(PORT, () =>
  console.log(`🌍 Listening on HTTP://${HOST}:${PORT}`)
);
