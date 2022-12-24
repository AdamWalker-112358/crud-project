import express from 'express'
import {content} from './404-template.js'

export default function response404() {
    return (request, response) => {
        response.set('Content-Type', 'text/html; charset=utf-8')
        response.status(404).send(content)
    }
}
