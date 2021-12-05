import asyncHandler from 'express-async-handler'


const addDataToPool = asyncHandler(async (req, res) => {
    const {musicData} = req.body
    res.status(201).json(musicData)
})



export {addDataToPool}