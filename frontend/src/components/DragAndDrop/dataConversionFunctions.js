import { Note, Scale} from '@tonaljs/tonal';

export function notesAndScaleToPattern(notes, scale, root){
    if (root === undefined){
        root = scale[0] + 3
    }
    var chromaticScale = Scale.get('c chromatic').notes
    var allNotes = [];
    var allChromaticNotes = [];
    var patternExport = [];
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < scale.length; j++){
            allNotes.push(scale[j] + i)
        }
    }

    for (var m = 0; m < 10; m++){
        for (var n = 0; n < chromaticScale.length; n++){
            allChromaticNotes.push(chromaticScale[n] + m)
        }
    }

    var rootIndex = allNotes.indexOf(root);
    var rootChromaticIndex = allChromaticNotes.indexOf(root);
    for (var k = 0; k < notes.length; k++){
        if (notes[k].includes(" ")){
            var tempExport = [];
            var tempArr = notes[k].split(" ");
            for (var l = 0; l < tempArr.length; l++){
                if (allNotes.indexOf(tempArr[l]) === -1){
                    if (allChromaticNotes.indexOf(tempArr[l]) === -1){
                    tempExport.push( "*" + (allChromaticNotes.indexOf(Note.enharmonic(tempArr[l])) - rootChromaticIndex))
                    } else {
                    tempExport.push("*" + (allChromaticNotes.indexOf(tempArr[l]) - rootChromaticIndex));
                    }
                } else {
                    tempExport.push(allNotes.indexOf(tempArr[l]) - rootIndex)
                }
            }
            patternExport.push(tempExport)
        } else {
            if (allNotes.indexOf(notes[k]) === -1){
                if (allChromaticNotes.indexOf(notes[k]) === -1){
                patternExport.push( "*" + (allChromaticNotes.indexOf(Note.enharmonic(notes[k])) - rootChromaticIndex))
                } else {
                patternExport.push("*" + (allChromaticNotes.indexOf(notes[k]) - rootChromaticIndex));
                }
            } else {
                patternExport.push(allNotes.indexOf(notes[k]) - rootIndex)
            }
        }
    }
    return patternExport
}

export function convertMelodyModeDataIntoChordModeData(dataObj){
    var clone = JSON.parse(JSON.stringify(dataObj))
    for (var i = 0; i < clone.length; i++){
        var scale = clone[i]['scaleData']['scale']
        var notes = clone[i]['chordData']['chord']
        var newPattern = notesAndScaleToPattern(notes, scale)
        clone[i]['rhythmData']['rhythmName'] = 'Str 4s'
        clone[i]['rhythmData']['rhythm'] = [['C3'], ['C3'], ['C3'], ['C3']]
        clone[i]['patternData']['patternName'] = 'Full Chord:' + newPattern
        clone[i]['patternData']['pattern'] = [newPattern, newPattern, newPattern, newPattern]
    }
    return clone;
}

export function convertMelodyModeDataIntoDisplayScaleModeData(dataObj){
    var returnArr = []
    var clone = JSON.parse(JSON.stringify(dataObj))
    for (var i = 0; i < clone.length; i++){
        returnArr.push(clone[i]['scaleData']['scale'])
    }
    return returnArr;
}

export function convertMelodyModeDataIntoDisplayChordNotesModeData(dataObj){
    var returnArr = []
    var clone = JSON.parse(JSON.stringify(dataObj))
    for (var i = 0; i < clone.length; i++){
        var tempArr = [];
        for (var j = 0; j < clone[i]['chordData']['chord'].length; j++){
            tempArr.push(Note.pitchClass(clone[i]['chordData']['chord'][j]))
        }
        tempArr.push(returnArr)
    }
    return returnArr;
}

export function countExpansionOrContraction(rhythmicNotes, count){
    if (count < 0){
        count = 0;
    }
    var cloneRhythmicNotes = [...rhythmicNotes];
    if (count <= rhythmicNotes.length){
        return cloneRhythmicNotes.slice(0, count)
    }
    else {
        for (var i = rhythmicNotes.length; i < count; i++){
            cloneRhythmicNotes.push(['X'])
        }
        return cloneRhythmicNotes;
    }
}
