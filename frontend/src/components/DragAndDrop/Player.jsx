import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Icon, Button, Segment, Form, Dropdown} from 'semantic-ui-react';
import { Note, Scale, Chord, ChordType} from '@tonaljs/tonal';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import * as Tone from 'tone';
// import * as Tone from 'tone';

export default function Player() {
    //Options to reimplement
    //Add box
    //Remove box
    //Looping options
    //Global key
    //Global BPM
    //Multiple players
    const initialData = [
        {
            chordData: {
                chordName: 'Cmaj',
                chord: ['C3', 'E3', 'G3'],
            },
            rhythmData: {
                rhythmName: 'Default: Str 8s',
                rhythm: [['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: Arp Run',
                pattern: [0, [2, 4, 6], -10, [8, 10, 12], 10, 12, 14, 16],
            },
            scaleData: {
                scaleName: 'C Ionian',
                scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Dmin',
                chord: ['D3', 'F3', 'A3'],
            },
            rhythmData: {
                rhythmName: 'Hard Swing',
                rhythm: [['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: normal variation',
                pattern: [1, 4, 1, 8, 2, 12, 8, 7],
            },
            scaleData: {
                scaleName: 'D Dorian',
                scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C']
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Emin',
                chord: ['E3', 'G3', 'B3'],
            },
            rhythmData: {
                rhythmName: 'Whole, Half-Half, Triplet, Quarter-Stop-Quarter-Stop',
                rhythm: [['C3'], ['C3', 'C3'], ['C3', 'C3', 'C3'], ['C3', 'X', 'C3', 'X']],
            },
            patternData: {
                patternName: 'Pattern: scale run and return',
                pattern: [5, 4, 12, 3, 1, 4, -1, 10],
            },
            scaleData: {
                scaleName: 'E Phrygian',
                scale: ['E', 'F', 'G', 'A', 'B', 'C', 'D']
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '5',
                count: 5,
            },
            output: [],
            position: []
        },
    ];

    const initialData2 = [
        {
            chordData: {
                chordName: 'Cmaj',
                chord: ['C3', 'E3', 'G3'],
            },
            rhythmData: {
                rhythmName: 'Default: Str 8s',
                rhythm: [['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: Arp Run',
                pattern: [0, [2, 4, 6], 4, [8, 10, 12], 10, 12, 14, 16],
            },
            scaleData: {
                scaleName: 'C Ionian',
                scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: [0,0,0,0,0,0,0,0]
        },
        {
            chordData: {
                chordName: 'Dmin',
                chord: ['D3', 'F3', 'A3'],
            },
            rhythmData: {
                rhythmName: 'Hard Swing',
                rhythm: [['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: normal variation',
                pattern: [1, 4, 1, 8, 2, 12, 8, 7],
            },
            scaleData: {
                scaleName: 'D Dorian',
                scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C']
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: [0,0,0,0,0,0,0,0],
        },
        {
            chordData: {
                chordName: 'Emin',
                chord: ['E3', 'G3', 'B3'],
            },
            rhythmData: {
                rhythmName: 'Whole, Half-Half, Triplet, Quarter-Stop-Quarter-Stop',
                rhythm: [['C3'], ['C3', 'C3'], ['C3', 'C3', 'C3'], ['C3', 'X', 'C3', 'X']],
            },
            patternData: {
                patternName: 'Pattern: scale run and return',
                pattern: [5, 4, 12, 3, 1, 4, -1, 10],
            },
            scaleData: {
                scaleName: 'E Phrygian',
                scale: ['E', 'F', 'G', 'A', 'B', 'C', 'D']
            },
            keyData: {
                keyName: 'Key: C Major',
                root: 'C',
                type: 'Major',
            },
            countData: {
                countName: '5',
                count: 5,
            },
            output: [],
            position: [0,0,0,0,0,0,0,0],
        },
    ];



    const initialData3 = [
        {name:'Guitar 1',
        mode: 'melody',
        displayOnly: true,
        data: [{
            chordData: {
                chordName: 'Cmaj',
                chord: ['C3', 'E3', 'G3'],
            },
            rhythmData: {
                rhythmName: 'Default: Str 8s',
                rhythm: [['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: Arp Run',
                pattern: [0, [2, 4, 6], 4, [8, 10, 12], 10, 12, 14, 16],
            },
            scaleData: {
                scaleName: 'C Ionian',
                scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Dmin',
                chord: ['D3', 'F3', 'A3'],
            },
            rhythmData: {
                rhythmName: 'Hard Swing',
                rhythm: [['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3'], ['C3', 'X', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: normal variation',
                pattern: [1, 4, 1, 8, 2, 12, 8, 7],
            },
            scaleData: {
                scaleName: 'D Dorian',
                scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C']
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Emin',
                chord: ['E3', 'G3', 'B3'],
            },
            rhythmData: {
                rhythmName: 'Whole, Half-Half, Triplet, Quarter-Stop-Quarter-Stop',
                rhythm: [['C3'], ['C3', 'C3'], ['C3', 'C3', 'C3'], ['C3', 'X', 'C3', 'X']],
            },
            patternData: {
                patternName: 'Pattern: scale run and return',
                pattern: [5, 4, 12, 3, 1, 4, -1, 10],
            },
            scaleData: {
                scaleName: 'E Phrygian',
                scale: ['E', 'F', 'G', 'A', 'B', 'C', 'D']
            },
            output: [],
            position: []
        },]},
        {name:'Guitar 2',
        mode: 'melody',
        dispalyOnly: true,
        data: [{
            chordData: {
                chordName: 'Cmaj',
                chord: ['C3', 'E3', 'G3'],
            },
            rhythmData: {
                rhythmName: 'Str 4s',
                rhythm: [['C3'], ['C3'], ['C3'], ['C3']],
            },
            patternData: {
                patternName: 'Full Chord:0,2,4',
                pattern: [[0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4]],
            },
            scaleData: {
                scaleName: 'C Ionian',
                scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Dmin',
                chord: ['D3', 'F3', 'A3'],
            },
            rhythmData: {
                rhythmName: 'Str 4s',
                rhythm: [['C3'], ['C3'], ['C3'], ['C3']],
            },
            patternData: {
                patternName: 'Full Chord:0,2,4',
                pattern: [[0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4]],
            },
            scaleData: {
                scaleName: 'D Dorian',
                scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C']
            },
            countData: {
                countName: '4',
                count: 4,
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Emin',
                chord: ['E3', 'G3', 'B3'],
            },
            rhythmData: {
                rhythmName: 'Str 4s',
                rhythm: [['C3'], ['C3'], ['C3'], ['C3']],
            },
            patternData: {
                patternName: 'Full Chord:0,2,4',
                pattern: [[0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4]],
            },
            scaleData: {
                scaleName: 'E Phrygian',
                scale: ['E', 'F', 'G', 'A', 'B', 'C', 'D']
            },
            countData: {
                countName: '5',
                count: 5,
            },
            output: [],
            position: []
        },]},
            
        ];

    const synth = new Tone.Synth().toDestination(); 
    const [sequence, setSequence] = useState(convertModuleDataIntoPlayableSequence(initialData))
    const [melodyModeData, setMelodyModeData] = useState([]);
    const [chordModeData, setChordModeData] = useState([]);
    const [instrumentDisplay, setInstrumentDisplay] = useState(0);
    const [instumentPlayer, setInstrumentPlayer] = useState()
    const [mode, setMode] = useState("melody")
    

    const state = useSelector((state) => state.module);

    const dispatch = useDispatch();

    const {sendModuleData, receiveModuleData} = bindActionCreators(actionCreators, dispatch);


    useEffect (()=>{
        setMelodyModeData(cardData)
        setSequence(cardData)
        setChordModeData(convertMelodyModeDataIntoChordModeData(cardData))
        sendModuleData(JSON.stringify(convertModuleDataIntoPlayableSequence(cardData))) 
    }, [cardData, sequence]);

    
function convertMelodyModeDataIntoChordModeData(dataObj){
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

function convertMelodyModeDataIntoDisplayScaleModeData(dataObj){
    var returnArr = []
    var clone = JSON.parse(JSON.stringify(dataObj))
    for (var i = 0; i < clone.length; i++){
        returnArr.push(clone[i]['scaleData']['scale'])
    }
    return returnArr;
}

function convertMelodyModeDataIntoDisplayChordNotesModeData(dataObj){
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

function qualityOfChordNameParser(chordName){
    if (chordName === undefined || chordName === null || chordName.length === 0){
        return
    }
    var chordNameArr = chordName.split("");
    var returnArr = [];
   for (var i = 1; i < chordNameArr.length;i++){
       if (chordNameArr[i] !== 'b' && chordNameArr[i] !== '#'){
            returnArr.push(chordNameArr[i])
       }
   }
   return returnArr.join("");
}

//takes arrays for both chord and key
function setRomanNumeralsByKey(chord, root){
    var valuesToKey;
        valuesToKey = {
            0: 'I',
            1: 'bII',
            2: 'II',
            3: 'bIII',
            4: 'III',
            5: 'IV',
            6: '#IV',
            7: 'V',
            8: 'bVI',
            9: 'VI',
            10: 'bVII',
            11: 'VII'
        }   
    var rootChromatic = Scale.get(root + ' chromatic').notes
    var chordRoot = Note.pitchClass(chord[0])
    var simpleChromatic = [];
    for (var i = 0; i < rootChromatic.length; i++){
        simpleChromatic.push(Note.simplify(rootChromatic[i]))
    }
    var index = simpleChromatic.indexOf(chordRoot)
    if (index === -1){
        index = simpleChromatic.indexOf(Note.enharmonic(chordRoot))
    }
    var returnChord = qualityOfChordNameParser(Chord.detect(chord)[0])
    if (returnChord === undefined){
        returnChord = ''
    }
    var returnValue = valuesToKey[index];

    return returnValue + returnChord;
}

var controls = useRef('swap')
var [cardData, setCardData] = useState(initialData);

    var cardDataPrototype = {
        chordData: {
            chordName: 'None',
            chord: []
        },
        rhythmData: {
            rhythmName: 'None',
            rhythm: []
        },
        patternData: {
            patternName: 'None',
            pattern: []
        },
        scaleData: {
            scaleName: 'None',
            scale: [],
        },
        output: [],
        position: []
    }

    function notesAndScaleToPattern(notes, scale, root){
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

    //generate notes from patternData using scaleData
    function patternAndScaleToNotes(pattern, scale, root){
        var allNotes = [];
        var allChromaticNotes = [];
        var chromaticScale = Scale.get('c chromatic').notes
        var notesExport = [];
        if (root === undefined){
            root = scale[0] + 3;
        }
        var simplifiedScale = [];
        for (var h = 0; h < scale.length; h++){
            simplifiedScale.push(Note.simplify(scale[h]))
        }
        for (var i = 0; i < 10; i++){
            for (var j = 0; j < simplifiedScale.length; j++){
                allNotes.push(simplifiedScale[j] + i)
            }
        }
        allNotes = Note.sortedNames(allNotes);
        for (var m = 0; m < 10; m++){
            for (var n = 0; n < chromaticScale.length; n++){
                allChromaticNotes.push(chromaticScale[n] + m)
            }
        }
        //------------
        var startingIndex;
        if (allNotes.indexOf(root) === -1){
            startingIndex = allNotes.indexOf(Note.enharmonic(root))
        } else {
            startingIndex = allNotes.indexOf(root)
        }
        var startingChromaticIndex;
        if (allChromaticNotes.indexOf(root) === -1){
            startingChromaticIndex = allChromaticNotes.indexOf(Note.enharmonic(root))
        } else {
            startingChromaticIndex = allChromaticNotes.indexOf(root);
        }
        for (var k = 0; k < pattern.length; k++){
                if (Array.isArray(pattern[k]) === true){
                    var localReturn = [];
                    for (var l = 0; l < pattern[k].length; l++){
                        if (typeof pattern[k][l] === 'string'){
                            localReturn.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k][l].split("").slice(1).join(""))])
                        } else {
                            localReturn.push(allNotes[startingIndex + pattern[k][l]])
                        }
                    }
                    notesExport.push(localReturn.join(' '))
                } else {
                    if (typeof pattern[k] === 'string'){
                        notesExport.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k].split("").slice(1).join(""))])
                    } else {
                        notesExport.push(allNotes[startingIndex + pattern[k]])
                    }
                }
        }
        return notesExport;
    }

    function notesIntoRhythm(notes, rhythm){
        var cloneRhythm = JSON.parse(JSON.stringify(rhythm))
        var cloneNotes = notes.slice();
        var count = 0;
        function recursiveNoteToRhythmMapper(cloneRhythm){
                for (var i = 0; i < cloneRhythm.length; i++){
                    if (Array.isArray(cloneRhythm[i]) === false){
                        if (cloneRhythm[i] === 'C3'){
                            if (cloneNotes[count] === undefined){
                                cloneRhythm[i] = 'X'
                            } else {
                                cloneRhythm[i] = cloneNotes[count]
                                count++;
                            }
                            
                        }
                    } else {
                        recursiveNoteToRhythmMapper(cloneRhythm[i]);
                    }
                }
        }
        recursiveNoteToRhythmMapper(cloneRhythm);
        return cloneRhythm;
    }

    function countExpansionOrContraction(rhythmicNotes, count){
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

     //---Convert cardData into playable sequencer part
    
    //playable sequencer part
    function convertModuleDataIntoPlayableSequence(data){
        
        var returnSequence = [];
        for (var i = 0; i < data.length; i++){
        var rhythm = data[i]['rhythmData']['rhythm'];
        var pattern = data[i]['patternData']['pattern']
        var scale = data[i]['scaleData']['scale']
        
        var notes = patternAndScaleToNotes(pattern, scale)
        
        var sequence = notesIntoRhythm(notes, rhythm)
        returnSequence.push(sequence)
        }
        
        return returnSequence;
    }


    //---Synthpart function 
        const synthPart = new Tone.Sequence(
            function(time, note) {
              if (note !== 'X'){
                  synth.triggerAttackRelease(note, "10hz", time);
              }
            },
           sequence,
            "1n"
          );
        //   synthPart.start();
        //   synthPart.loop = 1;
    
            

    //----------
    

    //handling dragging
    //----------------------------------
    const dragStartHandler = e => {
        var obj = {id: e.currentTarget.id, className: e.target.className, message: 'dragside', type: 'dragside'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log('draggin')
        
    };

    const dragHandler = e => {
    };

    const dragOverHandler = e => {
        e.preventDefault();
    };

    //---------------------
    const dropHandler = e => {
        e.preventDefault();
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var startIndex = Number(data['id'])
        var endIndex = Number(e.currentTarget.id)
        var message = data['message']
        var type = data['type']
        if (type === 'foreign'){
            console.log(message, 'message');
            return
        }
        
        var className = data['className']

        if (controls.current === 'replace'){
            if (className === 'box'){
                cardData[endIndex] = cardData[startIndex]
            } else {
                cardData[endIndex][className] = cardData[startIndex][className]
            }
            synthPart.cancel();
            setCardData(cardData)
            setSequence(convertModuleDataIntoPlayableSequence(cardData))
            setMappedCards((mapCards(cardData)))
            e.dataTransfer.clearData();
        }
        if (controls.current === 'swap'){
            var placeholder;
            if (className === 'box'){
                placeholder = cardData[endIndex]
                cardData[endIndex] = cardData[startIndex];
                cardData[startIndex] = placeholder;
            } else {
                placeholder = cardData[endIndex][className]
                cardData[endIndex][className] = cardData[startIndex][className];
                cardData[startIndex][className]= placeholder;
            }
            synthPart.cancel();
            setCardData(cardData)
            setSequence(convertModuleDataIntoPlayableSequence(cardData))
            setMappedCards((mapCards(cardData)))
            e.dataTransfer.clearData();
        }
        if (controls.current === 'fill'){
            if (className === 'box'){
                for (var i = endIndex; i < cardData.length;i++){
                    cardData[i] = cardData[startIndex]
                }
            } else {
                for (var j = endIndex; j < cardData.length;j++){
                    cardData[j][className] = cardData[startIndex][className]
                }
            }
            synthPart.cancel();
            setCardData(cardData)
            setSequence(convertModuleDataIntoPlayableSequence(cardData))
            setMappedCards((mapCards(cardData)))
            e.dataTransfer.clearData();
        }
        if (controls.current === 'reverseFill'){
            if (className === 'box'){
                for (var k = endIndex; k > -1; k--){
                    cardData[k] = cardData[startIndex]
                }
            } else {
                for (var l = endIndex; l > -1; l--){
                    cardData[l][className] = cardData[startIndex][className]
                }
            }
            synthPart.cancel();
            setCardData(cardData)
            setSequence(convertModuleDataIntoPlayableSequence(cardData))
            setMappedCards((mapCards(cardData)))
            e.dataTransfer.clearData();
        }
        
    }

    //-----------------------------------
    

    //currentTarget returns parent div
    //Target just returns currently clicked div
    const hasId = e => {
        console.log(e.target.parentNode.id)
        console.log(e.target.className)
    }

    const addBox = e => {
        var clone = {...cardDataPrototype}
        var spliceIndex = Number((e.currentTarget.id).split('_')[0]);
        cardData.splice(spliceIndex + 1, 0, clone);
        setMappedCards((mapCards(cardData)));
    }

    const removeBox =() =>{
        cardData.pop();
        setMappedCards((mapCards(cardData)));
    }

    function mapCards(cardData){
        return (
            cardData.map((cardData, idx) => 
            <DragAndFillCard
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            dragOverHandler = {dragOverHandler}
            dropHandler = {dropHandler}
            id={idx}
            key={idx}
            romanNumeralName={setRomanNumeralsByKey(cardData.chordData.chord, cardData.keyData.root)}
            chordName={cardData.chordData.chordName}
            rhythmName={cardData.rhythmData.rhythmName}
            patternName={cardData.patternData.patternName}
            scaleName={cardData.scaleData.scaleName}
            countName={cardData.countData.countName}
            keyName={cardData.keyData.keyName}
            hasId={hasId}
            addBox={addBox}
            />
            )
        )
    }

    var [mappedCards, setMappedCards] = useState(mapCards(cardData))
    
    var [activeButton, setActiveButton] = useState('swap')

    function handleControls(type){
        controls.current = type;
        setActiveButton(type);
    }

    function handleChangeInstrumentDisplay(type){
        setInstrumentDisplay(type)
    }

    const modeOptions = [
        {key: 'melody', text: 'Mode: Melody', value: 'melody'},
        {key: 'chord', text: 'Mode: Chord', value: 'chord'},
        {key: 'scale', text: 'Mode: Display Scale', value: 'scale'},
        {key: 'chordTones', text: 'Mode: Display Chord Tones', value: 'chordTones'},
    ]

    const handleChangeMode = (e, {value}) => {
        setMode(value)
        if (value === 'melody'){
            setCardData(melodyModeData)
            setSequence(convertModuleDataIntoPlayableSequence(melodyModeData))
            setMappedCards((mapCards(melodyModeData)))
        }
        if (value === 'chord'){
            setCardData(chordModeData)
            setSequence(convertModuleDataIntoPlayableSequence(chordModeData))
            setMappedCards((mapCards(chordModeData)))
        }

    }

    console.log(Tone.Transport.bpm.value)
    
    //Features
    //Recommended Scale: On Off (implement it first)
    //Build in Initialize
    //Mute
    //Show loop Options
    //Advance Edit in Navbar
    //Add Box Remove Box
    //Classic Drag and Drop

    return (
        <>
        <Button.Group>
        <Button active ={instrumentDisplay === 0}compact basic onClick ={() => handleChangeInstrumentDisplay(0)}>Guitar 1</Button>
            <Button active ={instrumentDisplay === 1} compact basic onClick ={() => handleChangeInstrumentDisplay(1)}>Guitar 2</Button>
        </Button.Group>
        <Button.Group>
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}>Reverse Fill</Button>
            <Button active ={activeButton === 'reOrder'} compact basic onClick ={() => handleControls('swap')}>Reorder</Button>
        </Button.Group>
        <Button.Group>
            <Button compact basic> <Icon name ='left arrow'/></Button>
            <Segment>
            Focus
            </Segment>
            <Button compact basic> <Icon name ='right arrow'/></Button>
        </Button.Group>
        <Button compact basic >Link: On</Button>
        <Button compact basic >Global Key: C Major</Button>
        <Button compact basic >BPM: 150</Button>
        <Button compact basic >Scale: Adapt</Button>
        <Button compact basic >MASTER</Button>
        <Button compact basic onClick={() => console.log(cardData)} >CardData?</Button>
        <div id='instrumentDisplay' style={{display:'flex', flexDirection:'row'}}>
        {instrumentDisplay === 0 &&    
        <div id='cards1'>
        <Dropdown
        selection
        onChange={handleChangeMode}
        options={modeOptions}
        defaultValue='melody'
        />
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
        </div>
        </div>}
        {instrumentDisplay === 1 &&
        <div id='cards2'>
        <Dropdown
        selection
        onChange={handleChangeMode}
        options={modeOptions}
        defaultValue='melody'
        />
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
        </div>
        </div> }
        </div>
        </>
    )
}
