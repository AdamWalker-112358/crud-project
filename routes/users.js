import { Router } from 'express'
import Database, {UPDATE_STRATEGY} from "../database/database.js";

const { FILE_PATH } = process.env
const { MERGE, OVERWRITE } = UPDATE_STRATEGY;
const database = new Database(FILE_PATH);

const router = Router();

// GET ALL USERS
router.get('/', async (request, response) => {
    const users = await database.read('users')
    response.status(200).json(users)
})

// GET USER BY ID
router.get('/:id', async (request, response) => {
    const {id} = request.params
    const user = await database.read('users', id)
    if (user)
        response.status(200).json(user);
    else
        response.status(404).send('No user found')
})

// CREATE USER 
router.post('/create', async (request, response) => {
    const user = await database.add('users', request.body)
    response.status(200).json(user)
})

// PUT USER
router.put('/', async (request, response) => {
    const user = await database.update('users', request.body, request.body.id, OVERWRITE)
    if (user)
        response.status(200).json(user);
    else
        response.status(404).send('No user found')
})

// PATCH USER
router.patch('/', async (request, response) => {
    const user = await database.update('users', request.body, request.body.id, MERGE)
    if (user)
        response.status(200).json(user);
    else
        response.status(404).send('No user found')
})


// DELETE USER
router.delete('/delete', async (request, response) => {
    const user = await database.delete('users', request.body.userId)
    if (user)
        response.status(200).send('User deleted successfully')
    else 
        response.status(200).send('User not found')
})

export default router;