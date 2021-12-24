import express from 'express'
import dataPoolsController from '../controllers/dataPoolsController.js'


const router = express.Router()

router.route("/").post(dataPoolsController.addDataPool)

export default router