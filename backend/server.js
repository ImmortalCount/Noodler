
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import musicDataActions from './actions/musicDataActions.js'
import dataPoolsActions from './actions/dataPoolsActions.js'
import musicData from './routes/musicDataRoute.js'
import dataPools from './routes/dataPoolsRoute.js'
import users from './routes/userRoute.js'
import userActions from './actions/userActions.js'
//x
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/data", musicData)
app.use("/api/pool", dataPools)
app.use("/api/users", users)

dotenv.config()

const PORT = process.env.PORT || 5000

MongoClient.connect(
  process.env.NOODLER_DB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}
  )
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await musicDataActions.injectDB(client)
    await dataPoolsActions.injectDB(client)
    await userActions.injectDB(client)
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`)
    })
  })






