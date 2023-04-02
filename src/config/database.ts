export default {
    mongo_uri: process.env.MONGO_URI || 'mongodb:127.0.0.1:27017',
    redis_url: process.env.REDIS_URL || 'redis://localhost:6379'
}
