
import { Midi } from '@tonejs/midi'

//Takes an array of arrays of notes
//default PPQ = 480

const PPQ =  480
const BPM = 120
const millisecondsPerTick = 60000 / (BPM * PPQ);
const ticksPerSecond = 960
export function turnNotesIntoMidi(notes){
    let midi = new Midi()
    let time = 0;
    const track = midi.addTrack();
    for (let i = 0; i < notes.length; i++){
        for (let j = 0; j < notes[i].length; j++){
            track.addNote({
                name : notes[i][j],
                time : time,
                duration: 1
            })
        }
        time += 1
    }
    return midi
}


function noteStringHandler(notes){

    var returnArr = []
    if (notes.indexOf(' ') === -1){
        returnArr.push(notes)
    } else {
        returnArr = notes.split(' ')
    }
    return returnArr
}

//each beat is worth 0.5
//this function takes an array of nested 
function flattenNotes(notes, returnArr){
    if (returnArr === undefined){
        returnArr = [];
    }
        for (var i = 0; i < notes.length; i++){
            if (Array.isArray(notes[i]) === false){
                returnArr.push(notes[i])
            } else {
                flattenNotes(notes[i], returnArr);
            }
        }
    return returnArr;
    }

    const testArr = 
    [
        [
            [
                [
                    "C3 E3 G3"
                ],
                "X",
                [
                    "X"
                ]
            ]
        ],
        [
            [
                "D3 F3 A3",
                "X",
                "X"
            ],
            [
                [
                    "X",
                    "E3 G3 B3",
                    "X",
                    "F3 A3 C4"
                ],
                "X"
            ]
        ],
        [
            "G3 B3 D4",
            [
                "A3 C4 E4",
                "X",
                "B3 D4 F4"
            ],
            "X"
        ],
        [
            [
                "C4 E4 G4",
                "X"
            ],
            "X"
        ]
    ]

let test1 = [
    [
        "C3 E3 G3"
    ],
    [
        "X"
    ],
    [
        "D3 F3 A3",
        "X",
        "E3 G3 B3"
    ],
    [
        "F3 A3 C4",
        "G3 B3 D4",
        "A3 C4 E4",
        "B3 D4 F4",
        "C4 E4 G4"
    ]
]

function turnNotesWithRhythmDataIntoMidiObj(notes, time, timeSpace, returnArr){
    if (returnArr === undefined){
        returnArr = [];
    }
    if (timeSpace ===  undefined){
        timeSpace = notes.length * 0.5;
    }
    if (time === undefined){
        time = 0;
    }
    let duration = (timeSpace/notes.length)

    for (let i = 0; i < notes.length; i++){
        if (Array.isArray(notes[i]) === false){
            let noteArr = noteStringHandler(notes[i])
            for (let j = 0; j < noteArr.length; j++){
                if (noteArr[j] !== 'X'){
                    returnArr.push(
                        {name: noteArr[j],
                        time: time + (duration * i),
                        duration: duration,
                        }   
                    )
                }
            }
        } else {
            turnNotesWithRhythmDataIntoMidiObj(notes[i], time + (duration * i), duration, returnArr)
        }
    }
    return returnArr
}

export function turnNotesWithRhythmIntoMidi(notes){
    let midiObj = turnNotesWithRhythmDataIntoMidiObj(notes)
    let midi = new Midi()
    const track = midi.addTrack();
    for (let i = 0; i < midiObj.length; i++){
        track.addNote({
            name : midiObj[i]['name'],
            time : midiObj[i]['time'],
            duration: midiObj[i]['duration']
        })
    }
    return midi
}

let playerObj = [
    {
        "displayOnly": false,
        "highlight": [],
        "data": [
            {
                "speed": 1,
                "notes": [
                    [
                        "D3",
                        "F3"
                    ],
                    [
                        "A3",
                        "D4"
                    ],
                    [
                        "C4",
                        "B3"
                    ],
                    [
                        "A3",
                        "G3"
                    ]
                ],
                "position": []
            },
            {
                "speed": 1,
                "notes": [
                    [
                        "G3",
                        "B3"
                    ],
                    [
                        "D4",
                        "G4"
                    ],
                    [
                        "F4",
                        "E4"
                    ],
                    [
                        "D4",
                        "C4"
                    ]
                ],
                "position": []
            },
            {
                "speed": 1,
                "notes": [
                    [
                        "C3",
                        "E3"
                    ],
                    [
                        "G3",
                        "C4"
                    ],
                    [
                        "B3",
                        "A3"
                    ],
                    [
                        "G3",
                        "F3"
                    ]
                ],
                "position": []
            },
            {
                "speed": 1,
                "notes": [
                    [
                        "C3",
                        "E3"
                    ],
                    [
                        "G3",
                        "C4"
                    ],
                    [
                        "B3",
                        "A3"
                    ],
                    [
                        "G3",
                        "F3"
                    ]
                ],
                "position": []
            }
        ]
    }
]
function round(number, decimals = 0) {
    let strNum = '' + number;
    let negCoef = number < 0 ? -1 : 1;
    let dotIndex = strNum.indexOf('.');
    let start = dotIndex + decimals + 1;
    let dec = Number.parseInt(strNum.substring(start, start + 1));
    let remainder = dec >= 5 ? 1 / Math.pow(10, decimals) : 0;
    let result = Number.parseFloat(strNum.substring(0, start)) + remainder * negCoef;
    return result.toFixed(decimals);
}

export function turnPlayerDataIntoFullMidiSong(playerObj){
    let midi = new Midi();
    // midi.header.timeSignatures = [
    // {
    //     ticks: 2160,
	//     timeSignature: [5,4],
	//     measures: 1,

    // }]
    for (let i = 0; i < playerObj.length; i++){
        let returnArr = []
        let time = 0;
        for (let j = 0; j < playerObj[i]['data'].length; j++){
            let timeSpace = playerObj[i]['data'][j]['notes'].length * playerObj[i]['data'][j]['speed'] * 0.5
            let moduleNotes = turnNotesWithRhythmDataIntoMidiObj(playerObj[i]['data'][j]['notes'], time, timeSpace)
            returnArr = returnArr.concat(moduleNotes)
            time += timeSpace
        }
        const track = midi.addTrack();
        for (let k = 0; k < returnArr.length; k++){
            track.addNote({
                name : returnArr[k]['name'],
                time : returnArr[k]['time'],
                duration: returnArr[k]['duration']
            })
        }
    }
    return midi
}
