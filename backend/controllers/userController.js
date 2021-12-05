import asyncHandler from 'express-async-handler'
import generateWebToken from '../utils/generateWebToken.js'
import User from '../models/userModel.js'

const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateWebToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    
    const userExists = await User.findOne({email})

    if (userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name, 
        email,
        password
    })

    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateWebToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
  })

export { authUser, registerUser, getUsers}