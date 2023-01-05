import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import userRouter from './routes/users.js'
import taskRouter from './routes/tasks.js'

import logHttpToDb, {logHttpToFile} from './logger.js'
import logErrorToDb, {logErrorToFile, response500} from './error-logger.js'
import response404 from './404/404.js'

const {HOST = 'localhost', PORT = 1234} = process.env
const server = express()

server.use(cors())
server.use(morgan('dev'))
server.use(express.json())
server.use(logHttpToDb())
server.use(logHttpToFile())

server.use('/users', userRouter)
server.use('/tasks', taskRouter)

server.use(logErrorToFile())
server.use(logErrorToDb())

server.use(response500())
server.use(response404())

server.listen(PORT, () => console.log(`🌍 Listening on HTTP://${HOST}:${PORT}`))
