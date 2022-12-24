import {Router} from 'express'
import Database, {UPDATE_STRATEGY} from '../database/database.js'

const {FILE_PATH} = process.env
const {MERGE, OVERWRITE} = UPDATE_STRATEGY
const database = new Database(FILE_PATH)

const router = Router()

// GET ALL USERS
router.get('/', async (request, response, next) => {
    try {
        const users = await database.read('users')
        response.status(200).json(users)
    } catch (error) {
        return next(error)
    }
})

// GET USER BY ID
router.get('/:id', async (request, response, next) => {
    try {
        const {id} = request.params
        const user = await database.read('users', id)
        return response.status(200).json(user)
    } catch (error) {
        return next(error)
    }
})

// CREATE USER
router.post('/create', async (request, response, next) => {
    try {
        const user = await database.add('users', request.body)
        response.status(200).json({result: 'Created successfully', ...user})
    } catch (error) {
        return next(error)
    }
})

// PUT USER
router.put('/', async (request, response, next) => {
    try {
        const user = await database.update(
            'users',
            request.body,
            request.body.id,
            OVERWRITE
        )
        response.status(200).json({result: 'Updated successfully', ...user})
    } catch (error) {
        return next(error)
    }
})

// PATCH USER
router.patch('/', async (request, response, next) => {
    try {
        const user = await database.update(
            'users',
            request.body,
            request.body.id,
            MERGE
        )
        response.status(200).json({result: 'Updated successfully', ...user})
    } catch (error) {
        return next(error)
    }
})

// DELETE USER
router.delete('/delete', async (request, response, next) => {
    try {
        const user = await database.delete('users', request.body.id)
        response.status(200).send({result: 'Delete successfully', ...user})
    } catch (error) {
        return next(error)
    }
})

export default router
