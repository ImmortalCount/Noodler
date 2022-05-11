/* eslint-disable react-hooks/exhaustive-deps */
import {React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import {Scale, Chord, Note} from '@tonaljs/tonal';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { setLabData } from '../../store/actions/labDataActions';
import { Icon, Menu, Dropdown, Button, Input, Form, TextArea, DropdownDivider } from 'semantic-ui-react';
import { polySynth } from './synths';
import { scaleHandler } from './utils';
import { setNoteDisplay } from '../../store/actions/noteDisplayActions';
import { setPlayImport } from '../../store/actions/playImportActions';
import { turnChordIntoModule} from './chordMapGenerator'
import { mapChordsToPlayer } from '../../store/actions/mapChordsToPlayerActions';
import { setDisplayFocus as setDisplayFocusAction } from '../../store/actions/displayFocusActions';
import ExportModal from '../modal/ExportModal'
import MapModal from '../modal/MapModal';

export default function ChordLab({importedChordData, masterInstrumentArray}) {
    const [playing, setPlaying] = useState(false)
    const [data, setData] = useState([{chord: ['C3', 'E3', 'G3'], position: 0}])
    const chords = []
    const position = []
    const [exportNames, setExportNames] = useState([null])
    const [noteOptions, setNoteOptions] = useState("octave")
    const [generateChordOptions, setGenerateChordOptions] = useState({intervals: 3, number: 3})
    const [inputFocus, setInputFocus] = useState(-2)
    const [displayFocus, setDisplayFocus] = useState(0)
    const [displayAll, setDisplayAll] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [options, setOptions] = useState('sharps')
    const [positionType, setPositionType] = useState('unlocked')
    const [exportPool, setExportPool] = useState('global')
    const [voicing, setVoicing] = useState([0])
    const [progression, setProgression] = useState(1)
    const [progressionType, setProgressionType] = useState('number')
    const [instrumentDisplay, setInstrumentDisplay] = useState(-1)
    const [chromaticNotes, setChromaticNotes] = useState(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
    const [edit, setEdit] = useState(false)
    const isMuted = false;
    const user = JSON.parse(localStorage.getItem('userInfo'))

    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

    //turn data into chords
    for (let i = 0; i < data.length; i++){
        chords.push(data[i]['chord'])
    }

    //turn data into position
    for (let i = 0; i < data.length; i++){
        position.push(data[i]['position'])
    }

    //Convert notes and position data into DATA
    function handleSetData(chords, position){
        var clone = JSON.parse(JSON.stringify(chords))
        clone = sortAllChordsByPitch(clone)
        if (position === undefined){
            let newPos = [];
            for (let i = 0; i < clone.length; i++){
                newPos.push(0)
            }
            position = newPos
        }
        let returnArr = [];
        for (let i = 0; i < clone.length; i++){
            let returnObj = {}
            returnObj['chord'] = clone[i]
            if (position[i] !== undefined){
                returnObj['position'] = position[i]
            } else {
                returnObj['position'] = 0;
            }
            returnArr.push(returnObj)
        }
        setData(returnArr)
    }

    useEffect(() => {
        generateChordStack()
    }, [progression, progressionType, voicing, generateChordOptions])

    //upon import
    useEffect(() => {
        console.log(importedChordData)
        if(importedChordData['chord']){
            let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: importedChordData['chordName'],
            chordName: importedChordData['chordName'],
            desc: '',
            chord: importedChordData['chord'],
            position: importedChordData['position'],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
        var returnArr = []
        returnArr.push(importedChordData['chord'])
        setExportNames([importedChordData['chordName']])
        handleSetData(returnArr, importedChordData['position'])
        }
        
    }, [importedChordData])

    useEffect(() => {
        let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: exportNames[0] !== null ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0] : Note.pitchClass(chords[0][0])  + ' ???',
            chordName: exportNames[0] !== null ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0] : Note.pitchClass(chords[0][0])  + ' ???',
            desc: description,
            chord: chords.length !==0 ? chords[0] : [],
            chords: chords,
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
    }, [data])


    useEffect(() => {
        dispatch(setNoteDisplay(convertChordsForDispatch()))
      }, [instrumentDisplay, data, displayFocus, displayAll])

      useEffect(() => {
        dispatch(setDisplayFocusAction('lab'))
      }, [playChords, instrumentDisplay ])
      
    function convertChordsForDispatch(){
        let clone = sortAllChordsByPitch(chords)
        let focus;
        let displayStyle;
        let pos;
        if (clone[displayFocus] === undefined){
            focus = 0;
        } else {
            focus = displayFocus
        }
        if (displayAll){
            displayStyle = 'special'
        } else {
            displayStyle = false;
        }
        if (positionType === 'locked'){
            if (!displayAll){
                pos = position[focus]
            } else {
                pos = position
            }
        } else{
            pos = [];
        }
        var arrOfObj = []
        var dispatchObj = {data: [{speed: 1, notes: [['C E G']], position: pos}], displayOnly: displayStyle, highlight: [], specialHighlight: [displayFocus]}
        var scaleString = ''

        if (!displayAll){
            for (let i= 0; i < clone[focus].length; i++){
                if (i === clone[focus].length - 1){
                    scaleString += clone[focus][i] 
                } else {
                    scaleString += clone[focus][i] + ' '
                }
            }
            scaleString = [scaleString]
        } else {
            let tempArr = []
            
            for (let i = 0; i < clone.length; i++){
                let tempString = ''
                for (let j = 0; j < clone[i].length; j++){
                    tempString += clone[i][j] + ' '
                }
                tempArr.push(tempString)
            }
            scaleString = tempArr;
        }

        for (let h = 0; h < masterInstrumentArray.length; h++){
          arrOfObj.push(JSON.parse(JSON.stringify(dispatchObj)))
        }
      
        if (instrumentDisplay === -2){
          return arrOfObj
        } else if (instrumentDisplay === -1){
          for (let j = 0; j < arrOfObj.length; j++){
            arrOfObj[j]['data'][0]['notes'][0] = scaleString
          }
          return arrOfObj
        } else {
          arrOfObj[instrumentDisplay - 1]['data'][0]['notes'][0] = scaleString
          return arrOfObj
        }
    }

    function convertChordsForMapping(){
        let modulePrototype = {   
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
        let moduleArr = [];
        for (let i = 0; i < chords.length; i++){
            moduleArr.push(chords[i])
            
        }
    }
    

    let allScaleNotes = [];
    let scaleNotes = labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scale'] ? scaleHandler(labInfo['scaleLab']['scale'], options): Scale.get('c major').notes
    let allChromaticNotes = [];


    //generate chromatic notes
    for (var o = 0; o < 10; o++){
        for (var p = 0; p < chromaticNotes.length; p++){
            allChromaticNotes.push(chromaticNotes[p] + o)
        }
    }

    //generate all scale specific notes
        for (var n = 0; n < allChromaticNotes.length; n++){
            if (scaleNotes.includes(Note.pitchClass(allChromaticNotes[n]))){
                allScaleNotes.push(allChromaticNotes[n])
            }
        }
        
    function handleProgressionChange(progression, progressionType){
        setProgression(progression)
        setProgressionType(progressionType)
    }

    function setDisplay(){
        dispatch(setNoteDisplay(convertChordsForDispatch()))
    }

    
    //trigger generateChordStack every time someone changes progression or voicing
    function generateChordStack(limit){
        var chordStack = [];
        var nullStack = [];
        let numberOfChords;

        if (limit !== undefined){
            numberOfChords = limit
        } else {
            numberOfChords = scaleNotes.length
        }
            var interval = generateChordOptions['intervals'];
            var stackHeight = generateChordOptions['number'];
            var root = scaleNotes[0] + '3';
            var startingIndex = allScaleNotes.indexOf(root)
        for (var i = 0; i < numberOfChords; i++){
            var oneChord = [];
            for (var j = 0; j < stackHeight; j++){
                oneChord.push(allScaleNotes[startingIndex + i + (j * (interval - 1))])
            }
            chordStack.push(oneChord)
        }

        for (var k = 0; k < chordStack.length; k++){
            nullStack.push(null)
        }

        //Voicing
        for (let l = 0; l < chordStack.length; l++){
            for (let m = 0; m < chordStack[l].length; m++){
                if (voicing[m] !== undefined){
                    if (voicing[m] === 1){
                        let note =  Note.pitchClass(chordStack[l][m])
                        let octave = Note.octave(chordStack[l][m])
                        chordStack[l][m] = note + (octave + 1)
                        console.log('altered a chord')
                    }
                }
            }
        }
        
        //Progression
            if (progressionType === 'number'){
                const sortedChords = sortChordsByNumber(progression, chordStack)
                setExportNames(nullStack)
                handleSetData(sortedChords)
            }
            if (progressionType === 'manual'){
                const sortedChords = sortChordsManual(progression, chordStack)
                setExportNames(nullStack)
                handleSetData(sortedChords)
            }

    }

    function sortChordsByNumber(num, chords){
        let count = 0;
        let tempArr = [];
        let l = 0;
        while (count < chords.length){
            tempArr.push(chords[l])
            l += num;
            count++
            if (l >= chords.length){
                l = l - chords.length
            }
        }
        return tempArr;
    }

    function sortChordsManual(arr, chords){
        let tempArr = [];
        for (let i = 0; i < arr.length; i++){
            tempArr.push(chords[arr[i]])
        }
        return tempArr;
    }

    function chordSequenceToNoteString(chords){
        var returnArr = [];
        for (var i = 0; i < chords.length; i++){
            var thisChordString = ''
            for (var j = 0; j < chords[i].length; j++){
                if (j === chords[i].length - 1){
                    thisChordString += chords[i][j]
                } else {
                    thisChordString += chords[i][j] + ' '
                }
            }
            returnArr.push([thisChordString])
        }
        return returnArr;
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
    //============

    //voicing drop 2 - second note goes up an octave
    var intervals = useRef([])

    function playChords(){
        if (isMuted){
            return
        }

        let previousInstrumentDisplay = instrumentDisplay
        let gap = Tone.Time('4n').toMilliseconds()
        let totalTime = gap * chords.length;

        if (playing){
            intervals.current.forEach(clearInterval)
            let chords = document.getElementsByClassName('chord')
            for (let i = 0; i < chords.length; i++){
                chords[i].className = 'inactive chord'
            }
            Tone.Transport.cancel()
            Tone.Transport.stop()
            setInstrumentDisplay(-2)
            setTimeout(() => setPlaying(false), 0)
            setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), 50)
        } else if (instrumentDisplay === -2){
            // setDisplayAll(false)
            Tone.start()
            Tone.Transport.cancel()
            Tone.Transport.stop()
            Tone.Transport.start();
            const convertedChords = chordSequenceToNoteString(chords)
            var count = 0;
            const synthPart = new Tone.Sequence(
                function(time, note) {
                  polySynth.triggerAttackRelease(noteStringHandler(note), "10hz", time)
                  var highlightedChord = document.getElementById('chord_' + count)
                    highlightedChord.className = 'active chord'
                    setTimeout(() => {highlightedChord.className = 'inactive chord'}, gap)
                    setDisplayFocus(count)
                    count++
                },
               convertedChords,
                "4n"
              );
              synthPart.start();
              synthPart.loop = 1;
              
            intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
            intervals.current.push(setTimeout(() => setPlaying(false), totalTime));

        } else {
            let noteArr = [];
            let tempArr = [];

            for (let i = 0; i < chords.length; i++){
                let strChord = ''
                for (let j = 0; j < chords[i].length; j++){
                    if (j === chords[i].length - 1){
                        strChord += chords[i][j]
                    } else {
                        strChord += chords[i][j] + ' '
                    }
                }
                tempArr.push(strChord)

                if (((i + 1) % 2 === 0) || (i === chords.length - 1)){
                    noteArr.push(tempArr)
                    tempArr = []
                }
            }
            let pos;
            if (positionType === 'unlocked'){
                pos = [];
            } else {
                pos = position;
            }
            let returnObj = {
                displayOnly: false,
                highlight: 1,
                data: [{speed: 0.5, notes: noteArr, position: pos}]
            }
            
            Tone.start()
            Tone.Transport.cancel()
            dispatch(setPlayImport([returnObj]))
            //Manual animation for chord lab
            for (let i = 0; i < chords.length; i++){
                let highlightedChord = document.getElementById('chord_' + i)
                intervals.current.push(setTimeout(() => {highlightedChord.className = 'active chord'}, (i) * gap))
                intervals.current.push(setTimeout(() => {highlightedChord.className = 'inactive chord'}, (i + 1) * gap))
            }

            Tone.Transport.start()
            intervals.current.push(setTimeout(() => setInstrumentDisplay(-2), totalTime - 100))
            intervals.current.push(setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), totalTime))
            intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
            intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
        }

      }

    function sortAllChordsByPitch(chords){
        let tempArr = []
        for (let i = 0; i < chords.length; i++){
            tempArr.push(Note.sortedNames(chords[i]))
        }
        return tempArr
    }

    var handleClickUp = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.parentNode.id;
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setDisplayFocus(x)
        setExportNames(cloneNames)
        if (noteOptions === 'scale'){
            if (allScaleNotes.indexOf(chords[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                }
                var matched = false;
                var count = 0;
                while (matched === false){
                    if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                        matched = true;
                    } else {
                        count++;
                    }
                }
            } else {
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
            }
        }
        if (noteOptions === 'octave'){
            var note = Note.pitchClass(chords[x][y])
            var octave = Note.octave(chords[x][y])
            clone[x][y] = note + (octave + 1)
        }
        if (noteOptions === 'chromatic'){
            var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
            if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
            clone[x][y] = allChromaticNotes[chromaIndex + 1];
        }
        if (noteOptions === 'insert'){
            clone[x].splice(y + 1, 0, chords[x][y]);
        }
        handleSetData(clone, position)
    }

    var handleClickDown = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.parentNode.id;
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setDisplayFocus(x)
        setExportNames(cloneNames)

        if (noteOptions === 'scale'){
            if (allScaleNotes.indexOf(chords[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                }
                var matched = false;
                var count = 0;
                while (matched === false){
                    if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                        matched = true;
                    } else {
                        count--;
                    }
                }
            } else {
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
            }

        }
        if (noteOptions === 'octave'){
        var note = Note.pitchClass(chords[x][y])
        var octave = Note.octave(chords[x][y])
        clone[x][y] = note + (octave - 1)
        }
        if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
        if (allChromaticNotes.indexOf(chords[x][y]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
        }
        if (noteOptions === 'insert'){
        clone[x].splice(y, 0, chords[x][y]);
        }
        handleSetData(clone, position)
    }

    var handleClickUpChord = (e) =>{
        var clone = [...chords]
        var clonePosition = [...position]
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        var cloneNames = [...exportNames]
        setDisplayFocus(x)
        if (noteOptions !== 'octave'){
            cloneNames[x] = null
            setExportNames(cloneNames)
        }
        if (noteOptions === 'scale'){
            for (var y = 0; y < chords[x].length; y++){
                if (allScaleNotes.indexOf(chords[x][y]) === -1){
                    var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                    }
                    var matched = false;
                    var count = 0;
                    while (matched === false){
                        if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                            matched = true;
                        } else {
                            count++;
                        }
                    }
                } else {
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
                }
            }
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave + 1)
            }
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
            }
        }
        if (noteOptions === 'position'){
            clonePosition[x] += 1
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
        }
        handleSetData(clone, clonePosition)
    }

    var handleClickDownChord = (e) =>{
        var clone = [...chords]
        var clonePosition = [...position]
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        setDisplayFocus(x)
        var cloneNames = [...exportNames]
        if (noteOptions !== 'octave'){
            cloneNames[x] = null
            setExportNames(cloneNames)
        }

        if (noteOptions === 'scale'){
            for (var y = 0; y < chords[x].length; y++){
                if (allScaleNotes.indexOf(chords[x][y]) === -1){
                    var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                    }
                    var matched = false;
                    var count = 0;
                    while (matched === false){
                        if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                            matched = true;
                        } else {
                            count--;
                        }
                    }
                } else {
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
                }
            }
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave - 1)
            }
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
            }
        }
        if (noteOptions === 'position'){
            if (clonePosition[x] > 0){
                clonePosition[x] -= 1
            }
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
        }
        handleSetData(clone, clonePosition)
    }

    var handleClickUpAll = () =>{
        var clone = [...chords]
        var clonePosition = [...position]
        var cloneNames = [...exportNames]
        setExportNames(cloneNames)
        if (noteOptions === 'scale'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    if (allScaleNotes.indexOf(chords[x][y]) === -1){
                        let chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                        if (chromaIndex === -1){
                            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                        }
                        var matched = false;
                        var count = 0;
                        while (matched === false){
                            if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                                matched = true;
                            } else {
                                count++;
                            }
                        }
                    } else {
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
                    }
                }
            }
        }
        if (noteOptions === 'octave'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    var note = Note.pitchClass(chords[x][y])
                    var octave = Note.octave(chords[x][y])
                    clone[x][y] = note + (octave + 1)
                }
                }
            }
        if (noteOptions === 'chromatic'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    let chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                    if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                    }
            clone[x][y] = allChromaticNotes[chromaIndex + 1];
                }
            }
        }
        if (noteOptions === 'position'){
            for (let x = 0; x < clonePosition.length; x++){
                clonePosition[x] += 1;
            }
        }
        if (noteOptions === 'insert'){
            return
        }
        handleSetData(clone, clonePosition)
    }

    var handleClickDownAll = () =>{
        var clone = [...chords]
        var clonePosition = [...position]
        var cloneNames = [...exportNames]
        setExportNames(cloneNames)
        if (noteOptions === 'scale'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    if (allScaleNotes.indexOf(chords[x][y]) === -1){
                        var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                        if (chromaIndex === -1){
                            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
                        }
                        var matched = false;
                        var count = 0;
                        while (matched === false){
                            if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                                matched = true;
                            } else {
                                count--;
                            }
                        }
                    } else {
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
                    }
                }
            }
        }
        if (noteOptions === 'octave'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    const note = Note.pitchClass(chords[x][y])
                    const octave = Note.octave(chords[x][y])
                    clone[x][y] = note + (octave - 1)
                }
                }
            }
        if (noteOptions === 'chromatic'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    let chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                    if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                    }
            clone[x][y] = allChromaticNotes[chromaIndex - 1];
                }
            }
            }
        if (noteOptions === 'position'){
            for (let x = 0; x < clonePosition.length; x++){
                if (clonePosition[x] > 0){
                    clonePosition[x] -= 1
                }
                }
            }
        if (noteOptions === 'insert'){
            return
        }
        handleSetData(clone, clonePosition)
    }

    const handleDeleteAll = () => {
        handleSetData([], [])
        setExportNames([])
    }

    const handleDeleteNote = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.id;
        var nOfSiblings = e.target.parentNode.parentNode.childNodes.length - 2
        var cloneNames = [...exportNames]
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]
        setDisplayFocus(x)

        if (nOfSiblings === 1){
            clone.splice(x, 1)
        } else {
            clone[x].splice(y, 1)
        }
        
        cloneNames[x] = null
        setExportNames(cloneNames)
        handleSetData(clone, position)
    }

    const handleDeleteChord =(e) => {
        var clone = [...chords]
        var clonePosition = [...position]
        var parentID = e.currentTarget.parentNode.parentNode.id;
        var x = parentID.split('_')[1]

        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        clone.splice(x, 1)
        clonePosition.splice(x, 1)
        handleSetData(clone, clonePosition)
    }

    const handleAddChord = () => {
        const clone = JSON.parse(JSON.stringify(chords))
        const clonePosition = [...position]
        if (chords.length === 0){
            generateChordStack(1)
            return 
        } else {
        const lastChord = clone[clone.length - 1]
        clone.push(JSON.parse(JSON.stringify(lastChord)))
        let y = exportNames[clone.length - 1]
        let z = [...exportNames]
        z.push(y)
        setExportNames(z)
        clonePosition.push(0)
        }
        handleSetData(clone, clonePosition)
    }

    const handleRemoveChord = () => {
        const clone = [...chords]
        const clonePosition = [...position]
        if (chords.length === 0){
            return
        } else {
        clone.pop()
        }
        handleSetData(clone, clonePosition)
    }

    const handlePlayThis = (e, x) => {
        let parentID;
        if (x){
            parentID = e.target.parentNode.id
        } else {
            parentID = e.target.id;
        }

        if (parentID.split('_').length === 2){
            const x = parentID.split('_')[1]
            setDisplayFocus(x)
            polySynth.triggerAttackRelease(chords[x], '8n');
        } else if (parentID.split('_').length === 3) {
            const x = parentID.split('_')[1]
            const y = parentID.split('_')[2]
            setDisplayFocus(x)
            polySynth.triggerAttackRelease(chords[x][y], '8n')
        } else {
            return
        }
        var thisChord = document.getElementById(parentID)
        thisChord.className = 'active chord'
        setTimeout(() => {thisChord.className ='inactive chord'}, 250)
    }

    const handleNameClick = (e) => {
        let parentID = e.target.parentNode.parentNode.id
        let x = Number(parentID.split('_')[1])
        if (noteOptions === 'change name'){
            setInputFocus(x)
        } 
        setDisplayFocus(x)
    }

    const handleEdit = () => {
        if (noteOptions === 'change name'){
            setNoteOptions('octave')
        }
        setEdit(!edit)
    }

    //==========
    function changePositionsUsingIDs(startingID, endingID){
    var xfer;
    var xfer2;
    var clone = JSON.parse(JSON.stringify(data))
    var cloneNames = [...exportNames]
    var ex1 = startingID.split('_')
    var ex2 = endingID.split('_')
    if(ex1 === undefined || ex2 === undefined){
        return
    } 
    var startingPosition = ex1[1]
    var endingPosition = ex2[1]

    xfer = clone[startingPosition]
    clone.splice(startingPosition, 1)
    clone.splice(endingPosition, 0, xfer)

    xfer2 = cloneNames[startingPosition]
    cloneNames.splice(startingPosition, 1)
    cloneNames.splice(endingPosition, 0, xfer2)
    
    setData(clone)
    setExportNames(cloneNames)
}

    //=================================

    //=======Drag and drop functionality
    const dragStartHandler = e => {
        var idx = Number(e.target.id.split('_')[1])
        let exportName;
        if (exportNames[idx]){
            exportName = exportNames[idx]
        } else {
            exportName = handleChordName(chords[idx])
        }
        var exportChord = chords[idx]
        var obj = {id: e.target.id, className: 'chordData', message: {
            chordName: exportName,
            chord: exportChord,
            position: []
        }, type: 'chordLab'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
    };

    const dragStartHandlerSpecial = e => {
        let exportName;
        if (exportNames[0]){
            exportName = exportNames[0]
        } else {
            exportName = handleChordName(chords[0])
        }
        var exportChord = chords[0]
        var obj = {id: 'special', className: 'chordData', message: {
            chordName: exportName,
            chord: exportChord,
            position: []
        }, type: 'chordLabExport'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
    }
    
    const dragHandler = e => {
    };
    
    const dragOverHandler = e => {
        e.currentTarget.className = 'active chord'
        e.preventDefault();
    };
    
    const dragLeaveHandler = e => {
        e.currentTarget.className = 'inactive chord'
        e.preventDefault();
    }
    
    //---------------------
    const dropHandler = e => {
        var data = JSON.parse(e.dataTransfer.getData("text"));
        if (data['type'] !== 'chordLab'){
            e.currentTarget.className = 'inactive chord'
            return
        } else {
        e.currentTarget.className = 'inactive chord'
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        
        changePositionsUsingIDs(data.id, e.currentTarget.id)
        e.dataTransfer.clearData();
        }
        
        
    }

    //==========================================
    function handleChordName(pitchClasses){
        if (chords.length === 0){
            return 
        }
        if (Chord.detect(pitchClasses)[0] === undefined){
            return Note.pitchClass(pitchClasses[0]) + ' ???'
        } else {
            return Chord.detect(pitchClasses)[0]
        }
    }

    function mapChords(){
        var returnArr = [];
        if (chords.length === 0){
            return <div></div>
        }
        for (let i = 0; i < chords.length; i++){
            var returnChord = [];
            var pitchClasses = [];
            for (let j = 0; j < chords[i].length; j++){
                pitchClasses.push(Note.pitchClass(chords[i][j]))
                returnChord.push(
                    <div id={'chord_' + i + '_' + j} style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                        {chords[i][j]}
                        {(edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Icon onClick={handleClickUp} name={(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDown} name={(noteOptions === 'insert') ? "" : "caret square up" }/>
                        </div>}
                        {(edit && noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                    </div>
                )
            }

            returnArr.push(
                <div id={'chord_' + i} onClick={handlePlayThis} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '5px', marginBottom: '15px'}}>
                <div onClick={(e) => (handlePlayThis(e, true))} style={{display: 'flex', flexDirection: 'row', marginBottom: '18px'}}>
                { (edit && noteOptions !== 'delete') && <div  style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
                <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "" : "caret square down" }/>
                {(edit && noteOptions === 'position') && <div>{position[i]}</div>}
                </div>}
                {(edit && noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
                </div>
                {returnChord}
                <div>
                <div onClick={handleNameClick}>
                {exportNames[i] ? exportNames[i] : handleChordName(pitchClasses)}
                </div>
                <Input type='text'
                id={'input_patternLab_' + i}
                ref={input => input && input.focus()}
                onBlur={() => setInputFocus(-2)}
                onInput={(e) => handleChangeName(e, i)}
                style={{display: inputFocus === i ? '': 'none' , width: '100px'}}
            />
                </div> 
                </div>
            )
        }
        return returnArr;
    }

    function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Dropdown.Item
            text={instrument}
            key={'mappedInstr' + idx}
            selected={instrumentDisplay === idx + 1}
            onClick={() => setInstrumentDisplay(idx + 1)}
            />
            )
        )
}   

    const handleGenerateChordDropdownOptions = (e, {value}) => {
        var clone = JSON.parse(JSON.stringify(generateChordOptions))
        var thisID = e.target.id;
        if (thisID === 'generateChordIntervalRange'){
            clone['intervals'] = value;
        } else if (thisID === 'generateChordNoteNumber'){
            clone['number'] = value;
        }

        setGenerateChordOptions(clone)
    }

    const exportObj = {
        name: exportNames ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0]: '',
        chordName: exportNames ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0]: '',
        desc: '',
        chord: chords[0],
        position: [],
        author: user?.['name'],
        authorId: user?.['_id'],
        dataType: 'chord',
        pool: exportPool,
  }

      function handleChangeName(e, x){
        const cloneNames = [...exportNames]
        cloneNames[x] = e.target.value
        setExportNames(cloneNames)
      }

      const handleDescriptionChange = e => {
        setDescription(e.target.value)
      }

      function handleSharpsOrFlats(){
          if (options === 'sharps'){
            setChromaticNotes(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'])
            setOptions('flats')
            let chordsClone = JSON.parse(JSON.stringify(chords))
            for (let i = 0; i < chordsClone.length; i++){
                for (let j = 0; j < chordsClone[i].length; j++){
                    if (Note.accidentals(chordsClone[i][j]) === '#'){
                        let x = Note.enharmonic(chordsClone[i][j])
                        chordsClone[i][j] = x
                    }
                }
            }
            handleSetData(chordsClone, position)
          }
          if (options === 'flats'){
            setChromaticNotes(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
            setOptions('sharps')
            let chordsClone = JSON.parse(JSON.stringify(chords))
            for (let i = 0; i < chordsClone.length; i++){
                for (let j = 0; j < chordsClone[i].length; j++){
                    if (Note.accidentals(chordsClone[i][j]) === 'b'){
                        let x = Note.enharmonic(chordsClone[i][j])
                        chordsClone[i][j] = x
                    }
                }
            }
            handleSetData(chordsClone, position)
          }
      }

      const handleMapChords = () => {
        let returnArr = []
        for (let i = 0; i < chords.length; i++){
            let name = exportNames[i] !== null ? exportNames[i] : Chord.detect(chords[i])[0] ? Chord.detect(chords[i])[0] : Note.pitchClass(chords[i][0])  + ' ???'
            let dispatchObj = turnChordIntoModule(chords[i], 'C', name, 'module ' + (i + 4))
            returnArr.push(dispatchObj)
        }
        dispatch(mapChordsToPlayer(returnArr))
      }

      const modalMapObjArr = [
          {chord: ['C3', 'E3', 'G3'], name: 'CM'},
          {chord: ['D3', 'F3', 'A3'], name: 'Dm'},
          {chord: ['E3', 'G3', 'B3'], name: 'Em'},
          {chord: ['F3', 'A3', 'C4'], name: 'FM'},
          {chord: ['G3', 'B3', 'D4'], name: 'GM'},
          {chord: ['A3', 'C4', 'E4'], name: 'Am'},
          {chord: ['B3', 'D4', 'F4'], name: 'Bm'},
      ]
      //====
    return (
        <>
        <Menu>
        <Menu.Item onClick={() => handleSharpsOrFlats()}>{options === 'sharps' ? '#' : 'b'}</Menu.Item>
         <Menu.Item onClick={() => {playChords(); setPlaying(true)}}> <Icon name={playing ? 'stop' : 'play'}/> </Menu.Item> 
         <Button.Group> 
         <Button basic onClick={()=> generateChordStack()}> Generate </Button>   
         <Dropdown
          simple
          item
          className='button icon'
        >
         <Dropdown.Menu>
             <Dropdown.Header>generate options</Dropdown.Header>
                <Dropdown.Item>
                interval size:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={handleGenerateChordDropdownOptions}
                id='generateChordIntervalRange'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={generateChordOptions['intervals']}
                />
                </Dropdown.Item>
                <Dropdown.Item>
                # of notes  :
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={handleGenerateChordDropdownOptions}
                id='generateChordNoteNumber'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={generateChordOptions['number']}
                />
                </Dropdown.Item>
              </Dropdown.Menu>
            
          </Dropdown>
          </Button.Group> 
          <Dropdown
            simple 
            item
            text = 'Voicing   ' 
       >    
            <Dropdown.Menu>
            <Dropdown.Item active={JSON.stringify(voicing) === JSON.stringify([0])} onClick={() => setVoicing([0])}> Closed </Dropdown.Item>
            <Dropdown.Item active={JSON.stringify(voicing) === JSON.stringify([0, 1])} onClick={() => setVoicing([0, 1])}>Drop 2</Dropdown.Item>
            <Dropdown.Item active={JSON.stringify(voicing) === JSON.stringify([0, 1, 1])} onClick={() => setVoicing([0, 1, 1])}>Drop 3</Dropdown.Item>
            <Dropdown.Item active={JSON.stringify(voicing) === JSON.stringify([0, 0, 1])} onClick={() => setVoicing([0, 0, 1])}>{`Drop 2 & 3`}</Dropdown.Item>
            <Dropdown.Item active={JSON.stringify(voicing) === JSON.stringify([0, 1, 0, 1])} onClick={() => setVoicing([0, 1, 0, 1])}>{`Drop 2 & 4`}</Dropdown.Item>
            </Dropdown.Menu>
           </Dropdown>
           <Dropdown
            simple 
            item
            text = 'Progression   ' 
       >    
            <Dropdown.Menu>
            <Dropdown.Item>Logical
                <Dropdown.Menu>
                <Dropdown.Item active={progression === 1} onClick={() => handleProgressionChange(1, 'number')}>Default (2nds)</Dropdown.Item>
            <Dropdown.Item active={progression === 2} onClick={() => handleProgressionChange(2, 'number')}>3rds</Dropdown.Item>
            <Dropdown.Item active={progression === 3} onClick={() => handleProgressionChange(3, 'number')}>4ths</Dropdown.Item>
            <Dropdown.Item active={progression === 4}  onClick={() => handleProgressionChange(4, 'number')}>5ths</Dropdown.Item>
            <Dropdown.Item active={progression === 5}  onClick={() => handleProgressionChange(5, 'number')}>6ths</Dropdown.Item>
            <Dropdown.Item active={progression === 6}  onClick={() => handleProgressionChange(6, 'number')}>7ths</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown.Item>

            <Dropdown.Item>Popular
            <Dropdown.Menu>
            <Dropdown.Item active={JSON.stringify(progression) === JSON.stringify([0, 4, 5, 3]) } onClick={() => handleProgressionChange([0, 4, 5, 3], 'manual')}>I V vi IV </Dropdown.Item>
            <Dropdown.Item onClick={() => handleProgressionChange([0, 5, 3, 4], 'manual')}>I vi IV V</Dropdown.Item>
            <Dropdown.Item onClick={() => handleProgressionChange([0, 3, 4], 'manual')}>I IV V</Dropdown.Item>
            <Dropdown.Item onClick={() => handleProgressionChange([1, 4, 0], 'manual')}>ii V I</Dropdown.Item>
            <Dropdown.Item onClick={() => handleProgressionChange([0,0,0,0,3,3,0,0,4,3,0,4], 'manual')}>Blues</Dropdown.Item>
            <Dropdown.Item onClick={() => handleProgressionChange([0,4,5,2,3,0,3,4], 'manual')}>Canon</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown.Item>

            </Dropdown.Menu>
           </Dropdown>
           <Dropdown
            simple
            item
            text='Position'
            >
        <Dropdown.Menu>
        <Dropdown.Item active={positionType === 'unlocked'} onClick={() => setPositionType('unlocked')}> Unlocked<Icon name='lock open'/></Dropdown.Item> 
         <Dropdown.Item active={positionType === 'locked'} onClick={() => setPositionType('locked')}> Locked <Icon name='lock'/></Dropdown.Item>       
        </Dropdown.Menu>
        </Dropdown>
         <Menu.Item onClick={handleEdit}> Edit </Menu.Item>     
         <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
         <Button.Group>
         <Button basic compact onClick={() => setDisplay()}>Display</Button>
         <Dropdown
            simple 
            item
            className= 'button icon' 
            >
          <Dropdown.Menu>
          <Dropdown.Header>Display Options</Dropdown.Header>
              <Dropdown.Divider/>
                <Dropdown.Item selected={!displayAll} onClick={() => setDisplayAll(false)}> Single Chord </Dropdown.Item>
                <Dropdown.Item selected={displayAll} onClick={() => setDisplayAll(true)}> All Chords </Dropdown.Item>
              <Dropdown.Header>Instruments</Dropdown.Header>
              <Dropdown.Divider/>
            <Dropdown.Item selected={instrumentDisplay === -2} onClick={() => setInstrumentDisplay(-2)}> None </Dropdown.Item>
            <Dropdown.Item selected={instrumentDisplay === -1} onClick={() => setInstrumentDisplay(-1)}> All </Dropdown.Item>
             {mapMenuItems()}
          </Dropdown.Menu>
        </Dropdown>
         </Button.Group>
         <MapModal
         mapObj={modalMapObjArr}
         handleMapChords={handleMapChords}
         />  
         <Button.Group>
         <ExportModal
        dataType={'Chord'}
        exportObj={exportObj}/>
        </Button.Group>  
        </Menu>
        {edit && <Button.Group>
            <Button basic compact active={noteOptions === 'octave'} onClick={() => setNoteOptions('octave')}>Octave</Button>
            <Button basic compact active={noteOptions === 'scale'} onClick={() => setNoteOptions('scale')}>Scale</Button>
            <Button basic compact active={noteOptions === 'chromatic'} onClick={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button basic compact active={noteOptions === 'insert'} onClick={() => setNoteOptions('insert')}>Insert</Button>
            <Button basic compact active={noteOptions === 'position'} onClick={() => setNoteOptions('position')}>Position</Button>
            <Button basic compact active={noteOptions === 'delete'} onClick={() => setNoteOptions('delete')}>Delete</Button>
            <Button basic compact onClick={handleRemoveChord}>Chord--</Button>
            <Button basic compact onClick={handleAddChord}>Chord++</Button>

            {noteOptions === 'delete' && <Button basic compact onClick={handleDeleteAll}>Delete All</Button>}
            <Button basic compact onClick={handleClickUpAll}>All Up</Button>
            <Button basic compact onClick={handleClickDownAll}>All Down</Button>
            {noteOptions !== 'delete' && <Button basic compact active={noteOptions === 'change name'} onClick={() => setNoteOptions('change name')}>Change Name</Button>}
        </Button.Group>}
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        <div style={{display: 'flex', flexDirection: 'row', width: '900px', flexWrap: 'wrap'}}>
            {mapChords()}
        </div>
        <div>
            <div draggable onClick={() => setInputFocus(-1)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'lightsalmon', display: !(inputFocus === -1) ? '': 'none' }}>{chords.length !== 0 ? exportNames?.[0] ? exportNames[0] : handleChordName(chords[0]) : 'N/A'}</div>
            <Input type='text'
            id={'input_patternLab'}
            ref={input => input && input.focus()}
            onBlur={() => setInputFocus(-2)}
            onInput={(e) => handleChangeName(e, 0)}
            style={{display: inputFocus === -1 ? '': 'none' }}
            />
        </div>
        </>
    ) 
}
