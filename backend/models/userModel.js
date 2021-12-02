import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const componentsSchema = mongoose.Schema(
    {
        chords: { type: Array, required: true },
        rhythms: { type: Array, required: true },
        patterns: { type: Array, required: true },
        scales: { type: Array, required: true },
        modules: { type: Array, required: true },
      },
      {
        timestamps: true,
      }
)

const collectionsSchema = mongoose.Schema(
    {
        chords: { type: Array, required: true },
        rhythms: { type: Array, required: true },
        patterns: { type: Array, required: true },
        scales: { type: Array, required: true },
        modules: { type: Array, required: true },
      },
      {
        timestamps: true,
      }
)


const userSchema = mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
        components: componentsSchema,
        collections: collectionsSchema,
        songs: {
            type: Array,
            required: false,
        }
      },
      {
        timestamps: true,
      }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }
  
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  
  const User = mongoose.model('User', userSchema)
  
  export default User