export const cardDataPrototype = {
    moduleData: {
        moduleName: 'Module 1',
        author: '??'
    },
    chordData: {
        chordName: 'None',
        chord: [],
        position: [],
        author: ''
    },
    rhythmData: {
        rhythmName: 'None',
        rhythm: [],
        length: 0,
        notes: 0,
        //Remember to change speed to a constant
        speed: '4n',
        author: ''
    },
    patternData: {
        patternName: 'None',
        type: 'normal',
        length: 0,
        pattern: [],
        position: [],
        author: ''
    },
    scaleData: {
        scaleName: 'None',
        scale: [],
        binary: [],
        number: 0,
    },
    keyData: {
        keyName: 'Key: C',
        root: '',
    },
}

export const playerDataPrototype = {
    mode: 'off',
    data: cardDataPrototype
}