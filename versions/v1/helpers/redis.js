const redis = require('redis')

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    auth_pass: process.env.REDIS_PASSWORD
})

client.on('connect', () => {
    console.log('Client connected to redis.')
})

client.on('error', error => {
    console.log('Redis error: ', error.message)
})

client.on('ready', () => {
    console.log('Client connected to redis and is ready to use.')
})

client.on('end', () => {
    console.log('Client disconnected from redis.')
})

process.on('SIGINT', () => {
    client.quit()
    console.log('Client disconnected from redis due to app termination.')
})

module.exports = client