import FileSaver from 'file-saver'
import { Note } from '@tonaljs/tonal'
import { returnPosition } from './positionFunctions.js'

export function downloadTabAsTextFile(data, title){
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"})
    FileSaver.saveAs(blob, title + ".txt");
    }

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
//figure this out tomorrow
//returns arr of arrays for each instrument
export function turnNoteDataIntoPositionData(dataFromPlayerToGuitar, tuningArr, globalPosition){
    var arrOfNotes = [];
    for (let i = 0; i < dataFromPlayerToGuitar.length; i++){
        let arrForThisInstrument = [];
        let tuning = tuningArr[i]
        for (let j = 0; j < dataFromPlayerToGuitar[i]['data'].length; j++){
            let arrForThisModule = [];
            let notesForThisModule= flattenNotes(dataFromPlayerToGuitar[i]['data'][j]['notes'])
            let positionForThisModule = dataFromPlayerToGuitar[i]['data'][j]['position']
            for (let k = 0; k < notesForThisModule.length; k++){
                let position;
                if (positionForThisModule[k] === undefined){
                    position = globalPosition
                } else {
                    position = positionForThisModule[k]
                }
                arrForThisModule.push(returnPosition(notesForThisModule[k], tuning, position))
            }
            arrForThisInstrument.push(arrForThisModule)
        }
        arrOfNotes.push(arrForThisInstrument)
    }
    return arrOfNotes
}

function convertPlayerDataToModules(dataFromPlayerToGuitar, tuningArr, instrumentArr, globalPosition){

    let arrOfPositionArrs = turnNoteDataIntoPositionData(dataFromPlayerToGuitar, tuningArr, globalPosition)

    let arrOfReturnObj = [];
    
    for (let i = 0; i < dataFromPlayerToGuitar.length; i++){
        //per instrument
        let returnObj = {instrument: instrumentArr[i], tuning: tuningArr[i], data: arrOfPositionArrs[i]}
        arrOfReturnObj.push(returnObj)
    }
    return arrOfReturnObj
}

export function generateTabFromModules(dataFromPlayer, tuningArr, instrumentArr,globalPosition, title, author){
    if (title === undefined){
        title = 'Unnamed'
    }
    if (author === undefined || author === null){
        author = 'Anonymous'
    }

    dataFromPlayer = convertPlayerDataToModules(dataFromPlayer, tuningArr, instrumentArr, globalPosition)

    console.log(dataFromPlayer)

    let notesPerLine = 16;
    let breakpoints = []
    //determine breakpoints
        //determine breakpoints
        for (let f = 0; f < dataFromPlayer.length; f++){
            let notesInThisLine = 1
            let thisInstrumentsBreakpoints = [];
            for (let g = 0; g < dataFromPlayer[f]['data'].length; g++){
                for (let h = 0; h < dataFromPlayer[f]['data'][g].length; h++){
                    if (notesPerLine < notesInThisLine){
                        notesInThisLine = 1;
                        thisInstrumentsBreakpoints.push(g - 1 || 0)
                    }
                    notesInThisLine++
                }
            }
            breakpoints.push(thisInstrumentsBreakpoints)
        }
        //use breakpoint data to determine where to draw the line
        let mostBreakPoints = -Infinity
        for (let i = 0; i < breakpoints.length; i++){
            if (breakpoints[i].length > mostBreakPoints){
                breakpoints = [...breakpoints[i]]
            }
        }

    //put notes into text
    let totalArrOfLines = [];
    let arrOfStrings = [];
    

    for (var a = 0; a < dataFromPlayer.length; a++){
        //check if the arr is good to go
        
        let arrOfLinesPerInstrument = [];
        //instrument level
        for (let b = 0; b < dataFromPlayer[a]['data'].length; b++){
            //module level
            if (arrOfStrings.length === 0){
                arrOfStrings = Array(dataFromPlayer[a]['tuning'].length).fill('')
                }
            for (let i = 0; i < dataFromPlayer[a]['tuning'].length; i++){
                if (arrOfStrings[i] === undefined){
                    arrOfStrings[i] =  Note.pitchClass(dataFromPlayer[a]['tuning'][i]) + '|'
                } else if (arrOfStrings[i] === '' ){
                    arrOfStrings[i] +=  Note.pitchClass(dataFromPlayer[a]['tuning'][i]) + '|'
                } else {
                    arrOfStrings[i] += '|'
                }
            }
            for (let c = 0; c < dataFromPlayer[a]['data'][b].length; c++){
                if (dataFromPlayer[a]['data'][b][c] === undefined){
                    continue
                }
                //note/chord level
                let stringsAlreadyUsed = []
                for (let d = 0; d < dataFromPlayer[a]['data'][b][c].length; d++){
                    //inside note/chord level
                    //add notes to strings
                    let stringNumber = Number(dataFromPlayer[a]['data'][b][c][d].split('_')[0])
                    let fretNumberString = dataFromPlayer[a]['data'][b][c][d].split('_')[1]
                    arrOfStrings[stringNumber - 1] += fretNumberString
                    stringsAlreadyUsed.push({stringNumber: stringNumber, fretNumberString: fretNumberString})
                }
                //fill in the rest
                function stringUsedFretNumberLength(num){
                    var length = 0;
                    for(let i = 0; i < stringsAlreadyUsed.length; i++) {
                    if (stringsAlreadyUsed[i].stringNumber === num) {
                     length = stringsAlreadyUsed[i].fretNumberString.length;
                        break;
                        }
                        }
                    return length;
                    }

                for (let j = 0; j < dataFromPlayer[a]['tuning'].length; j++){
                    let len = stringUsedFretNumberLength(j + 1)
                    if (len !== 0){
                        if (len === 1){
                            arrOfStrings[j] += '---'
                        }
                        if (len === 2){
                            arrOfStrings[j] += '--'
                        }
                    } else {
                        arrOfStrings[j] += '----'
                    }
                }
            }
            //break at breaks and at the end
            if ((b) === dataFromPlayer[a]['data'].length -1 || breakpoints.includes(b)){
                for (let i = 0; i < arrOfStrings.length; i++){
                    arrOfStrings[i] += '|'
                }
                let renderString = ''
                for (let k = 0; k < arrOfStrings.length; k++){
                    renderString += arrOfStrings[k] + '\n'
                }
                arrOfLinesPerInstrument.push(renderString)
                arrOfStrings = Array(dataFromPlayer[a]['tuning'].length).fill('')
            }
        }
        totalArrOfLines.push(arrOfLinesPerInstrument)
    }
    //turn into text
    let returnText = ''
    returnText += title + '\n \n'
    returnText += 'by ' + author + '\n \n'
    for (let l = 0; l < breakpoints.length + 1; l++){
        for (let m = 0; m < dataFromPlayer.length; m++){
            if (totalArrOfLines[m][l] !== undefined){
                returnText += instrumentArr[m] + '\n'
                returnText += totalArrOfLines[m][l] + '\n'
            }   
        }
    }
    return returnText
}
