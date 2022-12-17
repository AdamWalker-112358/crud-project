import Database, { UPDATE_STRATEGY } from "./database/database.js";
import { appendFile } from 'fs/promises'

const { FILE_PATH, HTTP_LOG_PATH } = process.env
const { MERGE, OVERWRITE } = UPDATE_STRATEGY;
const database = new Database(FILE_PATH);

export function logHttpToFile() {
    return async function (request, response, next) {
        const { protocol, originalUrl } = request
        const record = `${new Date()} | ${protocol} | ${originalUrl} \n`
        await appendFile(HTTP_LOG_PATH, record)
        next()
    }
}


export default function logHttpToDb() {
    return async function (request, response, next) {
        const { protocol, originalUrl } = request
        const payload = {
            protocol,
            originalUrl,
            timestamp: new Date()
        }
        await database.add('logs', payload)
        next();
    }   
    
}