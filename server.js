import express from "express";
import morgan from "morgan";
import logHttpToDb, {logHttpToFile} from "./logger.js";
import logErrorToDb, {logErrorToFile , sendError} from './error-logger.js'
import userRouter from './routes/users.js';
import taskRouter from './routes/tasks.js'
import {content as rickMorty404} from './static/404.js'

const { HOST = "localhost", PORT = 3123 } = process.env;
const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(logHttpToDb())
server.use(logHttpToFile())

server.use('/users', userRouter)
server.use('/tasks', taskRouter)

server.use(logErrorToFile())
server.use(logErrorToDb())
server.use(sendError())

server.use((request, response) => {
  response.set('Content-Type','text/html; charset=utf-8')
  response.status(404).send(rickMorty404)
})

server.listen(PORT, () =>
  console.log(`🌍 Listening on HTTP://${HOST}:${PORT}`)
);
