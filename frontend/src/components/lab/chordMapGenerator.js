
import { Midi, Scale, Note} from '@tonaljs/tonal';

// let Midi;

var modulePrototype = {   
    name: 'module A',
    moduleName: 'module A',
    desc: '',
    author: '',
    authorId: '',
    dataType: 'module',
    pool: '',
    data: {
        chordData: {
            chordName: 'Dm',
            name: 'Dm',
            chord: ['D3', 'F3', 'A3'],
            position: []
        },
        rhythmData: {
            rhythmName: 'Str8 8s',
            rhythm: [['O', 'O'], ['O', 'O'], ['O', 'O'], ['O', 'O']],
            speed: 1,
            length: 4,
            notes: 8
        },
        patternData: {
            name: 'Arp up-Scale Down',
            patternName: 'Arp up-Scale Down',
            pattern: [[0], [2], [4], [7], [6], [5], [4], [3]],
            type: 'fluid',
            length: 8,
            position: [0, 0, 0, 0, 0, 0, 0, 0],
            positionType: 'unlocked'
        },
        scaleData: {
            scaleName: 'D Dorian',
            name: 'D Dorian',
            scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
            binary: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
            number: 2902
        },
        keyData: {
            keyName: 'Key: C',
            root: 'C'
        },
    }
}
function convertChordsForMapping(chords){

    let moduleArr = [];
    for (let i = 0; i < chords.length; i++){
        moduleArr.push(chords[i])
        
    }
}

var scaleDataPrototype = {
    scaleName: 'D Dorian',
    name: 'D Dorian',
    scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
    binary: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    number: 2902
}

//converts scale to how close each note is to each other on a midi line
export function convertChordToMidiRelations(chord){
    var midiArr = [];
    var lowestValue = Number.POSITIVE_INFINITY
    for (let i = 0; i < chord.length; i++){
        const midiVal = Midi.toMidi(chord[i])
        if (midiVal < lowestValue){
            lowestValue = midiVal
        }
        midiArr.push(midiVal)
    }

    //normalize the array so all values are within octave
    for (let j = 0; j < midiArr.length; j++){
        let x = midiArr[j] - lowestValue
        while (x > 12){
            x -= 12;
        }
        midiArr[j] = x
    }
    return midiArr
}   

export const determineChordType = (chord) => {
    //order the array
    const midiArr = convertChordToMidiRelations(chord)

    if (midiArr.includes(4) && midiArr.includes(10) && midiArr.includes(1)){
        return '7b9'
    }
    if (midiArr.includes(4) && midiArr.includes(10) && midiArr.includes(3)){
        return '7#9'
    }
    if (midiArr.includes(4) && midiArr.includes(10) && midiArr.includes(8)){
        return '7#5'
    }
    if (midiArr.includes(4) && midiArr.includes(10) && midiArr.includes(6)){
        return '7#11'
    }

    if (midiArr.includes(3) && midiArr.includes(6)){
        return 'dim'
    }
    if (midiArr.includes(4) && midiArr.includes(8)){
        return 'aug'
    }
    if (midiArr.includes(4) && midiArr.includes(10)){
        return 'dom'
    }
    if (midiArr.includes(3) && midiArr.includes(11)){
        return 'minMaj'
    }
    if (midiArr.includes(3)){
        return 'min'
    }
    if (midiArr.includes(4)){
        return 'maj'
    }
    return 'unk'
}

//In triad, 11 is major, 10 is minor (except mixo)
const fourthTriadShapes = {
    'ion': [0, 5, 11],
    'dor': [0, 5, 10],
    'phy': [0, 5, 10],
    'lyd': [0, 6, 11],
    'mix': [0, 5, 10],
    'aoe': [0, 5, 10],
    'loc': [0, 5, 10]
}
const fourthTetradShapes = {
    'ion': [0, 5, 11, 4],
    'dor': [0, 5, 10, 3],
    'phy': [0, 5, 10, 3],
    'lyd': [0, 6, 11, 4],
    'mix': [0, 5, 10, 4],
    'aoe': [0, 5, 10, 3],
    'loc': [0, 5, 10, 3],
}
const fifthTriadShapes = {
    'ion':[0, 7, 2],
    'dor': [0, 7, 2],
    'phr': [0, 7, 1],
    'lyd': [0, 7, 2],
    'mix': [0, 7, 2],
    'aoe': [0, 7, 2],
    'loc': [0, 6, 1],
}
const fifthTetradShapes = {
    'ion':[0, 7, 2, 9],
    'dor': [0, 7, 2, 9],
    'phr': [0, 7, 1, 8],
    'lyd': [0, 7, 2, 9],
    'mix': [0, 7, 2, 9],
    'aoe': [0, 7, 2, 8],
    'loc': [0, 6, 1, 8],
}

const sixthTriadShapes = {
    'ion': [0, 9, 5],
    'dor': [0, 9, 5],
    'phy': [0, 8, 5],
    'lyd': [0, 9, 6],
    'mix': [0, 9, 5],
    'aoe': [0, 8, 5],
    'loc': [0, 8, 5],
}

const scales = {
    major: {
        'major': [0, 2, 4, 5, 7, 9, 11],
        'dorian': [0, 2, 3, 5, 7, 9, 10],
        'phrygian': [0, 1, 3, 5, 7, 8, 10],
        'lydian': [0, 2, 4, 6, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'aeoliean': [0, 2, 3, 5, 7, 8, 10],
        'locrian': [0, 1, 3, 5, 6, 8, 10],
    },
    harmonic_minor: {
        'harmonic minor': [0, 2, 3, 5, 7, 8, 11, 12],
        'locrian 6': [ 0, 1, 3, 5, 6, 9, 10, 12],
        'major augmented': [0, 2, 4, 5, 8, 9, 11, 12],
        'dorian #4': [0, 2, 3, 6, 7, 9, 10, 12],
        'phrygian dominant': [0, 1, 4, 5, 7, 8, 10, 12],
        'lydian #9': [0, 3,  4, 6,7, 9, 11, 12],
        'ultralocrian':[0, 1, 3, 4, 6, 8, 9, 12],
    },
    melodic_minor:{
        'melodic minor': [0, 2, 3, 5, 7, 9, 11, 12],
        'dorian b2': [0, 1, 3, 5, 7, 9, 10, 12],
        'lydian aug': [0, 2, 4, 6, 8, 9, 11, 12],
        'lydian dom': [0, 2, 4, 6, 7, 9, 10, 12],
        'mixolydian b6': [0, 2, 4, 5, 7, 8, 10, 12],
        'locrian #2': [0, 2, 3, 5, 6, 8, 10, 12],
        'altered': [0, 1, 3, 4, 6, 8, 10, 12],
    },
    //if 
    majCharacter: {
        'lydian': [0, 2, 4, 6, 7, 9, 11],
        'major': [0, 2, 4, 5, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    },
    minCharacter: {
    },
    dimCharacter: {

    },
    
}

console.log()

const allScalesTest = {
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'major': [0, 2, 4, 5, 7, 9, 11],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'aeoliean': [0, 2, 3, 5, 7, 8, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10],
    'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
    'locrian 6': [ 0, 1, 3, 5, 6, 9, 10],
    'major augmented': [0, 2, 4, 5, 8, 9, 11],
    'dorian #4': [0, 2, 3, 6, 7, 9, 10],
    'phrygian dominant': [0, 1, 4, 5, 7, 8, 10],
    'lydian #9': [0, 3, 4, 6, 7, 9, 11],
    'ultralocrian':[0, 1, 3, 4, 6, 8, 9],
    'melodic minor': [0, 2, 3, 5, 7, 9, 11],
    'dorian b2': [0, 1, 3, 5, 7, 9, 10],
    'lydian aug': [0, 2, 4, 6, 8, 9, 11],
    'lydian dom': [0, 2, 4, 6, 7, 9, 10],
    'mixolydian b6': [0, 2, 4, 5, 7, 8, 10],
    'locrian #2': [0, 2, 3, 5, 6, 8, 10],
    'altered': [0, 1, 3, 4, 6, 8, 10],
}



export function determineAppropriateScaleForChord(chord){
    const midiArr = convertChordToMidiRelations(chord)
    let bestMatch = ''
    let numberOfMatchedNumbers = 0;
    for (const [key, value] of Object.entries(allScalesTest)){
        let currentMatchedNumbersResult = 0;
        for (let i = 0; i < value.length; i++){
            if (midiArr.includes(value[i])){
                currentMatchedNumbersResult++
            }
        }
        if (currentMatchedNumbersResult > numberOfMatchedNumbers){
            bestMatch = key
            numberOfMatchedNumbers = currentMatchedNumbersResult
        }
    }
    return bestMatch
}




const fullMajor = ['C3', 'D3', 'D#3', 'F3', 'G3', 'G#3', 'B3', 'C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'B4']

//F major
//F G A Bb C D E 
// 'minor_key': {
    //     'natural': ['aoelian', 'dorian', 'locrian', 'major', 'dorian', 'dorian', 'dorian', 'phrygian', 'lydian', 'lydian', 'mixolydian', 'lydian'], 
    //     'major_chord': ['major', 'lydian', 'lydian', 'major', 'lydian', 'lydian', 'lydian', 'double harmonic major', 'lydian', 'lydian', 'mixolydian', 'lydian'],
    //     'minor_chord': ['aeolian', 'dorian', 'dorian', 'dorian', 'dorian', 'dorian', 'dorian', 'phrygian', 'dorian', 'dorian', 'dorian', 'dorian'],
    //     'dominant_chord': ['mixolydian', 'lydian dominant', 'mixolydian', 'lydian dominant', 'phyrgian dominant', 'mixolyian', 'lydian dominant', 'phyrgian dominant', 'lydian dominant', 'lydian dominant', 'mixolydian', 'lydian dominant'],
    //     'quayle_diminished_options': ['lydian diminished', '2477', '2918', 'lydian diminished', '2477', '2918', 'lydian diminished', '2477', '2918', 'lydian diminished', '2918', 'ultralocrian'],
    // },

export function determineChordPositionInKey(chord, key){
let chordPosition;
const root = Note.pitchClass(chord[0])
let chromaticScale = Scale.get(key + ' chromatic').notes
if (chromaticScale.indexOf(root) === -1){
    chordPosition =  chromaticScale.indexOf(Note.enharmonic(root))
} else {
    chordPosition = chromaticScale.indexOf(root)
}

return chordPosition
}

export function setRecommendedScale(chord, key){
    const root = Note.pitchClass(chord[0])
    const chordType = determineChordType(chord)   
    const chordPosition = determineChordPositionInKey(chord, key)
    const always = {
        '7b9': 'phrygian dominant',
        '7#5': 'altered',
        '7b5': 'altered',
        '7#9': 'altered',
        '7#11': 'lydian dominant',
        '7b6': 'mixolydian b6',
        'maj7#11': 'lydian',
        'min7b5': 'locrian',
        'aug': 'major augmented',
        'min7b9': 'phrygian'
    }

    const positions = {
            'nat': ['major', 'dorian', 'dorian', 'dorian', 'phrygian', 'lydian', 'lydian', 'mixolydian', 'lydian', 'aeolian', 'dorian', 'locrian'], 
            'maj': ['major', 'lydian', 'mixolydian', 'major','phrygian dominant', 'lydian', 'lydian', 'mixolydian', 'lydian', 'lydian', 'lydian', 'lydian'],
            'min': ['aeolian', 'dorian', 'dorian', 'dorian', 'phrygian', 'dorian', 'melodic minor', 'phrygian', 'dorian', 'aeolian', 'dorian', 'locrian'],
            'dom': ['mixolydian', 'lydian dominant', 'mixolydian', 'lydian dominant', 'phyrgian dominant', 'mixolydian', 'lydian dominant', 'mixolydian', 'lydian dominant', 'mixolydian b6', 'lydian dominant', 'lydian dominant'],
            'dim': ['locrian 6', 'ultralocrian', 'locrian', 'locrian 6', 'ultralocrian', 'phrygian dominant', 'locrian 6', 'ultralocrian', 'phrygian dominant', 'locrian 6', 'ultralocrian', 'locrian'],
    }
    if (chordType === 'unk'){
        return root + " " + positions['nat'][chordPosition]
    } else if (Object.keys(always).includes(chordType)){
        return root + " " + always[chordType]
    } else {
        return  root + " " + positions[chordType][chordPosition]
    }
}

export function turnScaleNameIntoScaleData(scaleName){
    let binArr = Scale.get(scaleName).chroma.split("")
    for (let i = 0; i < binArr.length; i++){
        binArr[i] = Number(binArr[i])
    }
    let scaleDataPrototype = {
        scaleName: scaleName,
        name: scaleName,
        desc: '',
        scale: Scale.get(scaleName).notes,
        length: Scale.get(scaleName).notes.length,
        binary: binArr,
        number: Scale.get(scaleName).setNum,
    }
    return scaleDataPrototype
}

export function turnChordIntoModule(chord, key, chordName, moduleName, position){

    let scaleName = setRecommendedScale(chord, key)
    if (position === undefined){
        position = [];
    }
    if (moduleName === undefined){
        moduleName = 'module 00'
    }

    //convert binary str to binary arr
    let binArr = Scale.get(scaleName).chroma.split("")
    for (let i = 0; i < binArr.length; i++){
        binArr[i] = Number(binArr[i])
    }

    let scaleDataPrototype = {
        scaleName: scaleName,
        name: scaleName,
        desc: '',
        scale: Scale.get(scaleName).notes,
        length: Scale.get(scaleName).notes.length,
        binary: binArr,
        number: Scale.get(scaleName).setNum,
    }
    console.log(scaleName, Scale.get(scaleName).notes)

    let chordDataPrototype = {
        chordName: chordName,
        name: chordName,
        chord: chord,
        position: position
    }

    let keyDataPrototype = {
        keyName: 'Key: ' + key,
        root: key
    }

    let moduleClone = JSON.parse(JSON.stringify(modulePrototype)) 
    moduleClone['data']['scaleData'] = scaleDataPrototype
    moduleClone['data']['chordData'] = chordDataPrototype
    moduleClone['data']['keyData'] = keyDataPrototype
    moduleClone['name'] = moduleName
    moduleClone['moduleName'] = moduleName

    return moduleClone
}

console.log(turnChordIntoModule(['C3', 'E3', 'G3'], 'C', 'C major', 'Module x'))
