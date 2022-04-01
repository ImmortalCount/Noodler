const textArr =      ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A', 'A#', 'B']
const textArrFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

const fillArr = [
    '#FF0000', 
    '#FF4500', 
    '#FFA500', 
    '#FCC404', 
    '#FFFF00', 
    '#9ACD32', 
    '#00FF00', 
    '#0D98BA', 
    '#0000FF', 
    '#4d1A7F',
    '#8F00FF',
    '#C71585' 
  ];
export const noteValues = [];
//generate note values
for (var m = 0; m < 10; m++){
    for (var o = 0; o < textArr.length; o++){
        var obj = {};
        obj["name"] = textArr[o] + m;
        obj["color"] = fillArr[o];
        obj["note"] = textArr[o];
        obj["octave"] = m;
        noteValues.push(obj);
    }
}

export const romanNumerals = [
    'O',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
    'XVI',
    'XVII',
    'XVIII',
    'XIX',
    'XX',
    'XXI',
    'XXII',
    'XXIII',
    'XXIV',
    'XXV',
    'XXVI',
    'XXVII',
    'XXVIII',
    'XXIX',
    'XXX',
    'XXXI',
    'XXXII',
    'XXXIII',
    'XXXIV',
    'XXXV',
    'XXXVI'
]