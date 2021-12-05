import path from 'path'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

import userRoutes from './routes/userRoutes.js'
import dataPoolRoutes from './routes/dataPoolRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/users', userRoutes)
app.use('/api/data', dataPoolRoutes)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}`
  )
)