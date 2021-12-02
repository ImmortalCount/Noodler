import mongoose from 'mongoose'

const moduleDataSchema = mongoose.Schema({
    moduleName: String,
    author: String
})

const chordDataSchema = mongoose.Schema({
    chordName: String,
    chord: Array,
    position: Array,
    author: String
})

//remember to change speed to a constant
const rhythmDataSchema = mongoose.Schema({
    rhythmName: String,
    rhythm: Array,
    length: Number,
    notes: Number,
    speed: Number
})

const patternDataSchema = mongoose.Schema({
    patternName: String,
    type: String,
    length: Number,
    pattern: Array,
    position: Array,
    author: String
})

const scaleDataSchema = mongoose.Schema({
    scaleName: String,
    scale: Array,
    binary: Array,
    number: Number,
})

const keyDataSchema = mongoose.Schema({
    keyName: String,
    root: String,
})


const moduleSchema = mongoose.Schema(
    {
        moduleData: {
          type: moduleSchema,
          required: true,
        },
        chordData: {
          type: chordDataSchema,
          required: true,
        },
        rhythmData: {
          type: rhythmDataSchema,
          required: true,
        },
        patternData: {
          type: patternDataSchema,
          required: true,
        },
        scaleData: {
          type: scaleDataSchema,
          required: true,
        },
        keyData: {
            type: keyDataSchema,
            required: true
        }
      },
      {
        timestamps: true, 
      }
)








const Module = mongoose.model('Module', moduleSchema)
  
export default Module