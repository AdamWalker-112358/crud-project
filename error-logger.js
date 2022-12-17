import Database from "./database/database.js";
import { appendFile } from 'fs/promises'

const { FILE_PATH, ERROR_LOG_PATH } = process.env
const database = new Database(FILE_PATH)

export function logErrorToFile() {
    return async function (error, request, response, next) {
        const { protocol, originalUrl } = request
        const { name, message } = error
        const record = `${new Date()} | ${protocol} | ${originalUrl} | ${name}:${message} \n`
        await appendFile(ERROR_LOG_PATH, record)
        next(error)
    }
}

export default function logErrorToDb () {
    return async function (error, request, response, next) {

        const { protocol, originalUrl } = request
        const { stack, name, message } = error
        const payload = {
            protocol,
            originalUrl,
            stack, name, message,
            timestamp: new Date()
        }
        await database.add('errors', payload)
        next(payload)
    }
}

export function sendError() {
    return function (error, request, response, next) {
        response.status(500).json(error)
    }
}
