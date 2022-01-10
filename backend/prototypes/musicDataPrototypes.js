


//Pool values are global, the user's Id, or other
const chordDataPrototype = {
    name: String,
    chordName: String,
    desc: String,
    chord: Array,
    position: Array,
    type: String,
    author: String,
    authorId: String,
    dataType: String,
    pool: String,
}

//Pool values are global, the user's Id, or other
const rhythmDataPrototype = {
    name: String,
    rhythmName: String,
    desc: String,
    rhythm: Array,
    length: Number,
    notes: Number,
    type: String,
    speed: Number,
    author: String,
    authorId: String,
    dataType: String,
    pool: String,
}

//Pool values are global, the user's Id, or other
const patternDataPrototype = {
    name: String,
    patternName: String,
    desc: String, 
    length: Number,
    pattern: Array,
    position: Array,
    type: String,
    author: String,
    authorId: String,
    dataType: String,
    pool: String,
}

//Pool values are global, the user's Id, or other
const scaleDataPrototype = {
    name: String,
    scaleName: String,
    desc: String, 
    scale: Array,
    binary: Array,
    number: Number,
    dataType: String,
    pool: String,
}

//Pool values are global, the user's Id, or other
const keyDataPrototype = {
    name: String,
    keyName: String,
    root: String,
}

const moduleDataPrototype = {
  name: String,
  moduleName: String,
  desc: String,
  author: String,
  authorId: String,
  dataType: String,
  pool: String,
  data: {
  chordData: {
    type: chordDataPrototype,
    required: true,
  },
  rhythmData: {
    type: rhythmDataPrototype,
    required: true,
  },
  patternData: {
    type: patternDataPrototype,
    required: true,
  },
  scaleData: {
    type: scaleDataPrototype,
    required: true,
  },
  keyData: {
      type: keyDataPrototype,
      required: true
  }
}
}


//Pool values are global, the user's Id, or other

    const songDataPrototype = {
      name: String,
      author: String,
      authorId: String,
      desc: String,
      dataType: String,
      songData: Array,
      pool: String,
      instruments: String,
      songData: Array,
    }

    const collectionDataProtype = {
      collectionName: String,
      //acceptable dataTypes: module, chord, scale, rhythm, pattern, mixed
      dataType: String,
      author: String,
      collectionData: Array,
    }
  
  

    export {moduleDataPrototype, chordDataPrototype, rhythmDataPrototype, patternDataPrototype, scaleDataPrototype, keyDataPrototype, moduleDataPrototype}