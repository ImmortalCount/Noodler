import express from 'express'
import musicDataController from '../controllers/musicDataController.js'

const router = express.Router()

router.route('/').get(musicDataController.getMusicModules)
router.route('/').post(musicDataController.addMusicModule)
router.route('/').put(musicDataController.updateMusicModule)


export default router