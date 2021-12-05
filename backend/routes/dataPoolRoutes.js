import express from 'express'
const router = express.Router()
import { addDataToPool } from '../controllers/dataPoolController.js'
  
  router.route('/').post(addDataToPool)
  
export default router