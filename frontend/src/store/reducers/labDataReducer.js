import {
    LAB_DATA_SET_SUCCESS,
    LAB_DATA_SET_FAIL,
    LAB_DATA_INITIALIZE
} from '../constants/labDataConstants.js'

const initialState = {
    scaleLab: { 
        name: 'C major',
        scaleName: 'C major',
        scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        binary: [1,0,1,0,1,1,0,1,0,1,0,1],
        number: 2773,
        dataType: 'scale',
        pool: '',
},
    chordLab: {
        name: 'CM',
        chordName: 'CM',
        desc: '',
        chord: ['C3', 'E3', 'G3'],
        position: [],
        author: '',
        authorId: '',
        dataType: 'chord',
        pool: ''
    },
    patternLab: {
        name: 'Pattern 1',
        patternName: 'Pattern 1',
        desc: '',
        type: 'fluid',
        length: 0,
        pattern: [0,1,2,3,4,5,6,7],
        positionType: 'unlocked',
        position: [],
        author: '',
        authorId: '',
        dataType: 'pattern',
        pool: ''
    },
    rhythmLab: {
        name: 'Rhythm 1',
        rhythmName: 'Rhythm 1',
        desc: '',
        rhythm: [['O'], ['O'], ['O'], ['O']],
        length: 4,
        notes: 0,
        speed: 1,
        author: '',
        authorId: '',
        dataType: 'rhythm',
        pool: ''
    },
    moduleLab: {
        name: 'Module 1',
        desc: '',
        author: '',
        pool: '',
    }
}

export const labDataReducer = (state = initialState, action) => {
    switch (action.type){
        case LAB_DATA_SET_SUCCESS:
            return {labInfo: action.payload}
        case LAB_DATA_SET_FAIL:
            return {error: action.payload}
        case LAB_DATA_INITIALIZE: 
            return {}
        default:
            return state
    }
}