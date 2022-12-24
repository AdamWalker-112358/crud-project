import {Router} from 'express'
import Database, {UPDATE_STRATEGY} from '../database/database.js'

const {FILE_PATH} = process.env
const {MERGE, OVERWRITE} = UPDATE_STRATEGY
const database = new Database(FILE_PATH)

const router = Router()

// GET ALL TASKS
router.get('/', async (request, response, next) => {
    try {
        const tasks = await database.read('tasks')
        response.status(200).json(tasks)
    } catch (error) {
        next(error)
    }
})

// GET TASK BY ID
router.get('/:id', async (request, response, next) => {
    try {
        const {id} = request.params
        const task = await database.read('tasks', id)
        return response.status(200).json(task)
    } catch (error) {
        return next(error)
    }
})

// CREATE TASK
router.post('/create', async (request, response, next) => {
    try {
        const task = await database.add('tasks', request.body)
        response.status(200).json({result: 'Created successfully', ...task})
    } catch (error) {
        next(error)
    }
})

// PUT TASK
router.put('/', async (request, response, next) => {
    try {
        const task = await database.update(
            'tasks',
            request.body,
            request.body.id,
            OVERWRITE
        )
        response.status(200).json({result: 'Updated successfully', ...task})
    } catch (error) {
        next(error)
    }
})

// PATCH TASK
router.patch('/', async (request, response, next) => {
    try {
        const task = await database.update(
            'tasks',
            request.body,
            request.body.id,
            MERGE
        )
        response.status(200).json({result: 'Updated successfully', ...task})
    } catch (error) {
        next(error)
    }
})

// DELETE TASK
router.delete('/delete', async (request, response, next) => {
    try {
        const task = await database.delete('tasks', request.body.id)
        response.status(200).send({result: 'Deleted successfully', ...task})
    } catch (error) {
        return next(error)
    }
})

export default router
