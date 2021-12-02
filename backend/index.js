import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import modulesDAO from './DAO/modulesDAO.js'

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.NOODLER_DB_URI, {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await modulesDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })

//Do I need this shit?
// i bcryptjs body-parser concurrently express is-empty jsonwebtoken
//mongoose
//passport
//passport-jwt validator
//