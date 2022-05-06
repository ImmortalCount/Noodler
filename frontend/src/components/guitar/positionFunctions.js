import {Note} from '@tonaljs/tonal';
import {noteValues} from './guitarSVGConstants.js'
let globalPosition = 0;

function findIndex(name){
    for (var z = 0; z < noteValues.length; z++){
        if (noteValues[z]['name'] === name){
            return z
        }
    }
}

function noteStringHandler(notes){
    if (notes.length === 0){
        return ['']
    }
    var returnArr = []
    if (notes.indexOf(' ') === -1){
        returnArr.push(notes)
    } else {
        returnArr = notes.split(' ')
    }
    //added to handle flats

    // Note.sortedNames(returnArr)

    return returnArr
}

function positionNamer(notesArr, tuning){
    //make sure notes are sorted
    notesArr = Note.sortedNames(notesArr)
    //make sure everything is in sharps for calculations
    for (let i = 0; i < notesArr.length; i++){
        if (Note.accidentals(notesArr[i]) === 'b'){
            const replacementNote = Note.enharmonic(notesArr[i])
            notesArr[i] = replacementNote
        }
    }
    //assume the tuning is from highest to lowest
    //remember that the notes are sorted before entering from lowest to highest
    var fretNumber = 24;
    var fretboard = [];
    for (let i = 0; i < tuning.length; i++){
        let stringNotes = [];
        let index = findIndex(tuning[i]);
        for (let j = 0; j < fretNumber + 1; j++){
            stringNotes.push(noteValues[index + j]['name'])
        }
        fretboard.push(stringNotes)
    }
    var rootNotes = [];
    var rootPositions = [];
    //find ROOT NOTE
    for (let i = 0; i < fretNumber + 1; i++){
        for (let j = tuning.length - 1; j > -1; j--){
            if (fretboard[j][i] === notesArr[0]){
                let indexID = (j + 1 + '_' + i)
                rootNotes.push({string: j, fret: i})
                rootPositions.push([indexID])
            }
        }
    }

    if (notesArr.length < 2){
        return rootPositions
    }
//trying out the wightin
var allPositions = []
//run twice algorithm
for (let g = 0; g < rootNotes.length;g++ ){
    //starting string
    let j = rootNotes[g]['string'] 
    //starting fret
    let i = rootNotes[g]['fret']

    var tempArr = []
    var previousFretPositions = [];

    tempArr.push(rootPositions[g][0])

    var noteCounter = 1;
    for (j > 0; j--;){
        var condition = false;
        var k = 0;
        while (!condition){
            if (noteCounter > 0){
                // var total = 0;
                // for(let i = 0; i < previousFretPositions.length; i++) {
                //     total += previousFretPositions[i];
                //     }
                // let centerOfGravity = total/previousFretPositions.length

                //if you run into another note
                if (fretboard[j][i + k] === notesArr[noteCounter - 1]){
                    let x = j + 1
                    let y = i + k
                    if (Math.abs(y - i) < Math.abs(previousFretPositions[previousFretPositions.length - 1] - i)){
                        tempArr.pop()
                        tempArr.push(x + '_' + y)
                        break;
                    }
                    
                }
                if (fretboard[j][i - k] === notesArr[noteCounter - 1]){
                    let x = j + 1
                    let y = i - k
                    if (Math.abs(y - i) < Math.abs(previousFretPositions[previousFretPositions.length - 1] - i)){
                        tempArr.pop()
                        tempArr.push(x + '_' + y)
                        break;
                    }
                    
                }
            }
            if (i + k < 25){
                if (fretboard[j][i + k] === notesArr[noteCounter]){
                    
                    let x = j + 1
                    let y = i + k
                    previousFretPositions.push(y) ;
                    tempArr.push(x + '_' + y)
                    noteCounter++
                    condition = true
                }
            }
            if (i - k > -1){
                if (fretboard[j][i - k] === notesArr[noteCounter]){
                    let x = j + 1
                    let y = i - k
                    previousFretPositions.push(y)
                    tempArr.push(x + '_' + y)
                    noteCounter++
                    condition = true
                }
            }
            if (k > 4){
                condition = true
            }

        k++
        }
    }

    if(tempArr.length === notesArr.length){
        allPositions.push(tempArr)
    }
}   
    return allPositions;
}

export function returnPosition(note, tuning, manualPosition){
    let position;
    if (manualPosition === undefined){
        //changed from globalPosition.current
        position = globalPosition
    } else {
        position = manualPosition
    }
    if (positionNamer(noteStringHandler(note), tuning)[position] === undefined){
        return positionNamer(noteStringHandler(note), tuning)[positionNamer(noteStringHandler(note), tuning).length -1]
    } else {
        return positionNamer(noteStringHandler(note), tuning)[position]
    }
}