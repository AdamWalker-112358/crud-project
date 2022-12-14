import { readFile, writeFile } from 'fs/promises'
import { uuid } from 'uuidv4';

export const UPDATE_STRATEGY = {
    MERGE: "merge",
    OVERWRITE: "overwrite",
}

export default class Database { 

    constructor(filePath) {
        this.filePath = filePath
    }

    get fileData() {
        return (async () => {
            const content = await readFile(this.filePath, 'utf8')
            const data = JSON.parse(content || '{}')
            return data
        })()    
    }

    set fileData(data) {
        return (async () => {
            await writeFile(this.filePath, JSON.stringify(data, null, 2))
        })()
    }

    // Save a new item
    async add(entityType, entityPayload) {
        const data = await this.fileData
        const entity = { id: uuid(), ...entityPayload }
        data[entityType] = [...(data[entityType] ?? []), entity] 
        await (this.fileData = data)
        return entity
    }  

    // Delete an item
    async delete(entityType, entityId) {
        const data = await this.fileData
        let entities = data[entityType]
        let deletedEntity = null;
        if (entities) {
            deletedEntity = entities.find(entity => entity.id == entityId)
            entities = entities.filter(entity => entity.id != entityId)  
            data[entityType] = entities
        }
        await (this.fileData = data)
        return deletedEntity
    }

    // Read an item
    async read(entityType, entityId) {
        const data = await this.fileData
        const entities = data[entityType]
        if (entityId)
            return entities?.find(entity => entity.id == entityId)
        else 
            return entities
    }

    // Update an item
    async update(entityType, entityPayload = {}, entityId, updateStrategy) {
        const data = await this.fileData;
        let entities = data[entityType]
        let entity = entities?.find(entity => entity.id == entityId)
        if (updateStrategy == UPDATE_STRATEGY.MERGE)
            entity =  {...entity,...entityPayload}
        if (updateStrategy == UPDATE_STRATEGY.OVERWRITE) 
            entity = { ...entityPayload }
        entities = entities?.filter(entity => entity.id != entityId)
        entities.push(entity)
        data[entityType] = entities
        await (this.fileData = data)
        return entity
    }
}






