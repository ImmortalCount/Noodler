/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef} from 'react'
import instrumentSamples from '../Instruments/Instruments'
import * as Tone from 'tone';
import { currentSynths, nameOfNewSynthSource } from './allSynths'
import { useSelector, useDispatch} from 'react-redux';
import { Dropdown, Button, Icon, Segment, Input } from 'semantic-ui-react';
import {moduleMarkerCreator, loopLengthCreator, findBetween} from './timeFunctions'
import { invisAll} from './guitarDisplayFunctions';
import {noteValues} from './guitarSVGConstants';
import { guitarPrototype, bassPrototype } from './instrumentPrototypes';
import { Note } from '@tonaljs/tonal';
import { setSongData } from '../../store/actions/songDataActions';
import { setInstrumentNames } from '../../store/actions/instrumentNameActions';
import './guitar.css'
import { setPlayHighlight } from '../../store/actions/playHighlightActions';
import { tuningOptionsGuitar, tuningOptionsBass } from './tunings';
import { instrumentOptions, guitarInstruments, bassInstruments } from './instruments';
import { setGlobalInstruments } from '../../store/actions/globalInstrumentsActions';
import TabDownloadModal from '../modal/TabDownloadModal'
import AudioDownloadModal from '../modal/AudioDownloadModal';
import BpmModal from '../modal/BpmModal';
import MidiModal from '../modal/MidiModal'
import FretboardDownloadModal from '../modal/FretboardDownloadModal'
import { setGlobalPosition } from '../../store/actions/globalPositionActions';
import { createGuitarSVG } from './guitarSVG';



export default function GuitarSVG({masterInstrumentArray, activelyDisplayedInstruments}) {
    const state = useSelector((state) => state.module)
    const backupData = [
        {
        displayOnly: false,
        highlights: [],
        master: true, 
        data: [{speed:1, notes:[['D4','X','D4 F4 A4', 'E4'],['X','X', 'D4 F4 A4', 'X'],['X', 'G4','D4 F4 A4', 'X'],['B4', 'X','D4 F4 A4', 'F5']]}, {speed:1, notes:[['G5','X', 'F5', 'X'],['E5','X', 'D5', 'X'],['B4','X', 'E4', 'X'],['B4', 'X','E4', 'X']]}, {speed: 1, notes:[['C4','X', 'D4', 'X'],['E4','X', 'F4', 'X'],['G4', 'X','C4', 'X'],['D4','X', 'C4', 'X']]}, {speed:1 , notes:[['A4','X', 'C4', 'X'],['D4','X', 'E4', 'X'],['A5','X', 'C5', 'X'],['D5','X', 'E5', 'X']]}]
    }
    ]
    const [instruments, setInstruments] = useState([{name: 'Instr 1', instrument:'acoustic_guitar_nylon', synthSource: 'acoustic_guitar_nylon', type: 'guitar', noteColors: '', scale:[], tuning:['E4','B3','G3','D3','A2','E2'],stringNumber:6,fretNumber: 24}])
    const [inputFocus, setInputFocus] = useState(null)
    const [loading, setLoading] = useState(false)
    const globalPosition = useRef(0); 
    const [data, setData] = useState(backupData)
    const [loop, setLoop] = useState(false)
    const [activeEdits, setActiveEdits] = useState([])
    const [moduleMarkers, setModuleMarkers] = useState(moduleMarkerCreator(data))
    const dispatch = useDispatch()
    const songImportData = useSelector(state => state.songImport)
    const {songImport} = songImportData
    const noteDisplayData = useSelector(state => state.noteDisplay)
    const {noteDisplay} = noteDisplayData
    const playImportData = useSelector(state => state.playImport)
    const {playImport} = playImportData
    const mixerData = useSelector(state => state.mixer)
    const {mixer} = mixerData
    const tabData = useSelector(state => state.tab)
    const {tab} = tabData
    const displayFocusData = useSelector(state => state.displayFocus)
    const {displayFocus} = displayFocusData
    const initialLoad = useRef(true)
    const loadedSynths = useRef(currentSynths)
    const lastPosition = useRef(0)
    const refData = useRef('')
    const refInstruments = useRef('')
   
    //CASE: DISPLAY NOTES WHEN LAB IS SENDING INFORMATION
    useEffect(() => {
        if (displayFocus === 'lab'){
            displayNotes(noteDisplay)
        } else {
            displayNotes()
        }
    }, [displayFocus])

    //CASE: ADD AN INSTRUMENT WHEN THE MASTER INSTRUMENT ARRAY (FROM MAIN PAGE) IS UPDATED
    useEffect(() => {
        handleInstrumentUpdate();
    }, [masterInstrumentArray])

    //CASE: DISPLAY NOTES WHEN DATA CHANGES 
    useEffect(() => {
        refData.current = data
        refInstruments.current = instruments
        displayNotes()
        // synthCleanup()
    }, [data, instruments])

    //CASE: SONG IS IMPORTED
    useEffect(() => {
        if (songImport){
            setLoading(true)
            importSynths(songImport['instruments'])
            let checkIfLoaded = setInterval(() => {
                if (allBuffersAreLoaded()){
                    clearInterval(checkIfLoaded)
                    setLoading(false)
                }
            }, 50)
            refInstruments.current = songImport['instruments']
            setInstruments(songImport['instruments'])
            dispatch(setGlobalInstruments(songImport['instruments']))
        } else {
            return
        }
    }, [songImport])

    //CASE: STATE IS CHANGED 
    useEffect(() => {
        if (state !== "Initial Module Data"){
            const dataPackage = JSON.parse(state)
            refData.current = dataPackage['data']
            setData(dataPackage['data'])
            loadNoteSequenceAndVisualDataOntoTimeline(dataPackage['data'])
            setModuleMarkers(moduleMarkerCreator(dataPackage['data']))
            Tone.Transport.loopStart = 0;
            Tone.Transport.loopEnd = loopLengthCreator(dataPackage['data']);
        } else {
            return
        }
        
    }, [state])

    //CASE INSTRUMENTS ARE UPDATED
    useEffect (()=>{
        createGuitarSVGS();
        dispatch(setGlobalInstruments(instruments))
        dispatch(setSongData(instruments))
        const instrumentNames = []
        for (var i = 0; i < instruments.length; i++){
            instrumentNames.push(instruments[i]['name'])
        }
        dispatch(setInstrumentNames(instrumentNames))
    }, [instruments]);

    //CASE: POSITION IS CHANGED WHEN STOPPED
    useEffect(() => {
        if (noteDisplay && (Tone.Time(Tone.Transport.position).toSeconds() === 0 && Tone.Transport.state === 'stopped')){
            displayNotes(noteDisplay)
            // setLabDisplay(true)
        } else {
            return
        }
    }, [noteDisplay])

    //CASE: PLAY INFORMATION IS COMING FROM THE LAB
    useEffect(() => {
        if (initialLoad.current === false){
            loadNoteSequenceAndVisualDataOntoTimeline(playImport)
        }
    }, [playImport])

    //CASE: UPDATES THE TIMELINE WHEN DATA IS CHANGED
    useEffect(() => {
        if (initialLoad.current === false){
            loadNoteSequenceAndVisualDataOntoTimeline(data)
        }
    }, [data])

    //CASE: TURNS INITIAL SIGNAL OFF
    useEffect(() => {
        initialLoad.current = false;
    }, [])

    //CASE: KEEPS TIME TO ACCURATELY DISPLAY NOTES WHEN POSITION IS MOVED WHILE PAUSED
    useEffect(() => {
        const thisInterval = setInterval(function () {
            let state = Tone.Transport.state
            if (state === 'started'){
                return
            } else {
                if (lastPosition.current !== Tone.Time(Tone.Transport.position).toSeconds()){
                    displayNotes() 
                    lastPosition.current = Tone.Time(Tone.Transport.position).toSeconds()
                }
            }
    }, 50)
        return () => {
            clearInterval(thisInterval);
        };
    }, [])

//SYNTH FUNCTIONS -----
function importSynths(importedInstrumentArray){
    for (let i = 0; i < importedInstrumentArray.length; i++){
        let instrumentType = importedInstrumentArray[i]['instrument']
        let synthName = importedInstrumentArray[i]['synthSource']
        loadASynth(synthName, instrumentType) 
    }
}

function synthCleanup(){
    let synthSourcesInUse = [];
    let unsedSynths = [];
    for (let i = 0; i < instruments.length; i++){
        synthSourcesInUse.push(instruments[i].synthSource)
    }
    let loadedSynthsArr = Object.keys(loadedSynths.current)
    for (let j = 0; j < loadedSynthsArr.length; j++){
        if (!synthSourcesInUse.includes(loadedSynthsArr[j])){
            unsedSynths.push(loadedSynthsArr[j])
        }
    }
    for (let k = 0; k < unsedSynths.length; k++){
        disposeOfASynth(unsedSynths[k])
    }
}

function allBuffersAreLoaded(){
    let state = true;
    
    for (const key in loadedSynths.current){
        if (!loadedSynths.current[key].loaded){
            state = false;
        }
    }
    return state
}

//----------------------

//GUITAR SVG AND NOTES FUNCTIONS
function findIndex(name){
        for (var z = 0; z < noteValues.length; z++){
            if (noteValues[z]['name'] === name){
                return z
            }
        }
}

//MAP GUITAR STUFF!!
function createGuitarSVGS(){
    for (var NUM = 0; NUM < instruments.length; NUM++){
        let svg = createGuitarSVG(NUM, instruments)
        const guitarDiv = document.getElementById(`divGuitar${NUM}`);

        if (guitarDiv.firstChild){
            while (guitarDiv.firstChild){
                guitarDiv.removeChild(guitarDiv.firstChild)
            }
        }
        guitarDiv.appendChild(svg)
    }
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

var allPositions = []
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
    return returnArr
}

function returnPosition(note, tuning, manualPosition){
    let position;
    if (manualPosition === undefined || manualPosition.length === 0){
        position = globalPosition.current
    } else {
        position = manualPosition
    }
    if (positionNamer(noteStringHandler(note), tuning)[position] === undefined){
        return positionNamer(noteStringHandler(note), tuning)[positionNamer(noteStringHandler(note), tuning).length -1]
    } else {
        return positionNamer(noteStringHandler(note), tuning)[position]
    }
}

var playPosition = 0;

function loadNoteSequenceAndVisualDataOntoTimeline(data){
    if (data === undefined){
        data = backupData
    }
    Tone.Transport.cancel();
    var playPositions = [];
    for (var j = 0; j < data.length; j++){
        playPositions.push(0)
    }

    function setUpSequence(data, instrument, instrumentNumber, displayOnly){
        for (let i = 0; i < data.length; i++){
            var tuning = instruments[instrumentNumber]['tuning']
            new Tone.Sequence(
                 // eslint-disable-next-line no-loop-func
                 function(time, note) {
                  if (note !== 'X' && displayOnly === false){
                      instrument.triggerAttackRelease(noteStringHandler(note), 0.5, time);
                      
                  }
                  //hide all
                  if (note !== 'X'){
                    let x = document.getElementsByClassName('note_' + instrumentNumber);
                    let y = document.getElementsByClassName('notename_' + instrumentNumber);
                    let z = document.getElementsByClassName('notespecial_' + instrumentNumber);
                for (let i = 0; i < x.length; i++){
                    x[i].setAttribute('visibility', 'hidden');
                    y[i].setAttribute('visibility', 'hidden');
                    z[i].setAttribute('visibility', 'hidden');
                    //make sure everything is in sharps by default
                    if (Note.accidentals(y[i].textContent) === 'b'){
                        y[i].textContent = Note.enharmonic(y[i].textContent)
                    }
                }
                  }
                
                //============== Display Notes
              if (note !== 'X'){
                var currentArray = noteStringHandler(note);
                var highlights = [1];
                //If the instrument is set to display only
                if (displayOnly){
                    for (let i = 0; i < currentArray.length; i++){
                        let findNote = currentArray[i]
                        let flat = false
                        if (Note.accidentals(currentArray[i]) === 'b'){
                            findNote = Note.enharmonic(currentArray[i])
                            flat = true
                        }
                        let x;
                        let y;
                        if (highlights.includes(i + 1)){
                            x = document.getElementsByClassName('notespecial_pitchClass_' + findNote + '_' + instrumentNumber);
                        } else {
                            x = document.getElementsByClassName('note_pitchClass_' + findNote + '_' + instrumentNumber);
                        }
                        y = document.getElementsByClassName('notename_pitchClass_' + findNote + '_' + instrumentNumber);
                    for (var j = 0; j < x.length; j++){
                        x[j].setAttribute('visibility', '');
                        y[j].setAttribute('visibility', '');
                        if (flat){
                            const previousTextContent = y[j].textContent 
                            y[j].textContent = Note.enharmonic(previousTextContent)
                        }
                    }
                    }
                    //if the globalPosition is set to -1 'show all notes'
                } else if (globalPosition.current < 0){
                    for (let w = 0; w < currentArray.length; w++){
                        let findNote = currentArray[w]
                        let flat = false
                        if (Note.accidentals(currentArray[w]) === 'b'){
                            findNote = Note.enharmonic(currentArray[w])
                            flat = true
                        }
                        let x = document.getElementsByClassName(findNote + '_' + instrumentNumber);
                        let y = document.getElementsByClassName(findNote + '_' + instrumentNumber + '_name');
                        if (x !== null && y !== null && x !== undefined && y !== undefined){
                            for (let j = 0; j < x.length; j++){
                                x[j].setAttribute('visibility', '');
                                y[j].setAttribute('visibility', '');
                                if (flat){
                                    const previousTextContent = y[j].textContent 
                                    y[j].textContent = Note.enharmonic(previousTextContent)
                                }
                                // note.setAttribute('class', noteValues[index]["name"] + '_' + NUM + ' note_' + NUM + ' note');
                                // noteDiamond.setAttribute('class', noteValues[index]["name"] + '_' + NUM + '_special notespecial_' + NUM + ' notespecial');
                                // noteName.setAttribute('class', noteValues[index]["name"] + '_' + NUM + '_name notename_' + NUM + ' notename' )
                            }
                        } else {
                            // console.log('off Model!')
                        }
                    }
                } else {
                    //Information uses #sharp notes only, nameArray contains info on sharp/flat 
                    let nameArray = noteStringHandler(note)
                    let pos;
                    if (data[i]['position'].length === 0){
                        pos = returnPosition(note, tuning)
                    } else {
                        let manualPosition = data[i]['position'][playPosition]
                        pos = returnPosition(note, tuning, manualPosition)
                    }
                    if (pos !== undefined){
                        for (var w = 0; w < pos.length; w++){
                            let findNote = pos[w]
                            if (Note.accidentals(pos[w]) === 'b'){
                                findNote = Note.enharmonic(pos[w])
                            }
                            var x = document.getElementById(findNote + '_' + instrumentNumber);
                            var y = document.getElementById(findNote + '_' + instrumentNumber + '_name');
                            if (x !== null && y !== null){
                                x.setAttribute('visibility', '');
                                y.setAttribute('visibility', '');
                                y.textContent = nameArray[w]
                            }
                        }
                    } else {
                        // console.log('off Model!')
                    }
                }
              }

        if (playPosition < flattenNotes(data[i]['notes']).length - 1){
            playPosition++;
        } else {
            playPosition = 0;
        }
                },
               data[i]['notes'],
                ((1/data[i]['speed']) * Tone.Time('4n').toSeconds()) 
              )
              
                .start(moduleMarkers[i])
                .loop = 1;
            }  
    }

    for (let j = 0; j < refInstruments.current.length; j++){
        if (data[j] === undefined || refInstruments.current[j] === undefined){
            continue
        }
        setUpSequence(data[j]['data'], loadedSynths.current[refInstruments.current[j]['synthSource']], j, data[j]['displayOnly'])
    }
}

// Functionality for if the player is paused and you change the timeline!!
function displayNotes(input){
    let data;
    if (!input){
        data = refData.current
    } else {
        data = input
    }

    let instruments = refInstruments.current
    let time = Tone.Time(Tone.Transport.position).toSeconds()
    let currentModuleIndex = findBetween(time + 0.01, moduleMarkers)['playingIndex']
    

        for (let i = 0; i < data.length; i++){
            //first hide all
                    let x = document.getElementsByClassName('note_' + i);
                    let y = document.getElementsByClassName('notename_' + i);
                    let z = document.getElementsByClassName('notespecial_' + i);
                for (let i = 0; i < x.length; i++){
                    x[i].setAttribute('visibility', 'hidden');
                    y[i].setAttribute('visibility', 'hidden');
                    z[i].setAttribute('visibility', 'hidden');
                    //turn everything back into flats
                    if (Note.accidentals(y[i].textContent) === 'b'){
                        y[i].textContent = Note.enharmonic(y[i].textContent)
                    }
                }
            //global position
            if (data[i]['data'][currentModuleIndex] === undefined || instruments[i] === undefined){
                break
            }
            let displayOnly = data[i]['displayOnly'];
            let currentArray;
            if (displayOnly === 'special'){
                currentArray = data[i]['data'][0]['notes'][0]
            } else {
                currentArray = noteStringHandler(data[i]['data'][currentModuleIndex]['notes'][0][0])
            }
            // let highlights = data[i]['highlight']
            let highlights = [1];
            if (displayOnly === 'special'){
                let manualPosition = data[i]['data'][0]['position']
                let highlight = data[i]['specialHighlight'][0]
                if (globalPosition.current !== -1){
                for (let j = 0; j < currentArray.length; j++){
                let nameArray = noteStringHandler(currentArray[j])
                let pos = returnPosition(currentArray[j], instruments[i]['tuning'], manualPosition[j])
                
                if (pos !== undefined){
                    for (let w = 0; w < pos.length; w++){
                        let findNote = pos[w]
                        if (Note.accidentals(pos[w]) === 'b'){
                            findNote = Note.enharmonic(pos[w])
                        }
                        let x = document.getElementById(findNote + '_' + i);
                        let y = document.getElementById(findNote + '_' + i + '_name');
                        if (highlight === j){
                            x = document.getElementById(findNote + '_' + i + 'special')
                        }
                        if (x !== null && y !== null){
                            x.setAttribute('visibility', '');
                            y.setAttribute('visibility', '');
                            y.textContent = nameArray[w]
                            
                        }
                    }
                } else {
                    // console.log('off Model!')
                }
                }
                } else {
                for (let j = 0; j < currentArray.length; j++){
                    let nameArray = noteStringHandler(currentArray[j])
                    for (let w = 0; w < nameArray.length; w++){
                        let findNote = nameArray[w]
                        let flat = false
                        if (Note.accidentals(findNote) === 'b'){
                            findNote = Note.enharmonic(findNote)
                            flat = true
                        }
                        let x = document.getElementsByClassName(findNote + '_' + i);
                        let y = document.getElementsByClassName(findNote + '_' + i + '_name');
                        if (highlight === j){
                            x = document.getElementsByClassName(findNote + '_' + i + '_special')
                        }
                        if (x !== null && y !== null && x !== undefined && y !== undefined){
                            for (let j = 0; j < x.length; j++){
                                x[j].setAttribute('visibility', '');
                                y[j].setAttribute('visibility', '');
                                if (flat){
                                    const previousTextContent = y[j].textContent 
                                    y[j].textContent = Note.enharmonic(previousTextContent)
                                }
                            }
                        } else {
                            // console.log('off Model!')
                        }
                    }
                }
                
                }
                
                
            } else if (displayOnly){
                for (let q = 0; q < currentArray.length; q++){
                    let findNote = currentArray[q]
                    let flat = false
                    if (Note.accidentals(currentArray[q]) === 'b'){
                        findNote = Note.enharmonic(currentArray[q])
                        flat = true
                    }
                    let x;
                    let y;
                    if (highlights.includes(q + 1)){
                        x = document.getElementsByClassName('notespecial_pitchClass_' + findNote + '_' + i);
                    } else {
                        x = document.getElementsByClassName('note_pitchClass_' + findNote + '_' + i);
                    }
                    y = document.getElementsByClassName('notename_pitchClass_' + findNote + '_' + i);
                    
                for (let r = 0; r < x.length; r++){
                    x[r].setAttribute('visibility', '');
                    y[r].setAttribute('visibility', '');
                    if (flat){
                        const previousTextContent = y[r].textContent 
                        y[r].textContent = Note.enharmonic(previousTextContent)
                    }
                }
                }
                //if the globalPosition is set to -1 'show all notes'
            } else if (globalPosition.current < 0){
                for (let w = 0; w < currentArray.length; w++){
                    let findNote = currentArray[w]
                    let flat = false
                    if (Note.accidentals(currentArray[w]) === 'b'){
                        findNote = Note.enharmonic(currentArray[w])
                        flat = true
                    }
                    let x = document.getElementsByClassName(findNote + '_' + i);
                    let y = document.getElementsByClassName(findNote + '_' + i + '_name');
                    if (x !== null && y !== null && x !== undefined && y !== undefined){
                        for (let j = 0; j < x.length; j++){
                            x[j].setAttribute('visibility', '');
                            y[j].setAttribute('visibility', '');
                            if (flat){
                                const previousTextContent = y[j].textContent 
                                y[j].textContent = Note.enharmonic(previousTextContent)
                            }
                        }
                    } else {
                        // console.log('off Model!')
                    }
                }
            } else {
                let manualPosition = data[i]['data'][0]['position']
                let nameArray = noteStringHandler(data[i]['data'][currentModuleIndex]['notes'][0][0])
                let pos = returnPosition(data[i]['data'][currentModuleIndex]['notes'][0][0], instruments[i]['tuning'], manualPosition);
                if (pos !== undefined){
                    for (var w = 0; w < pos.length; w++){
                        let findNote = pos[w]
                        if (Note.accidentals(pos[w]) === 'b'){
                            findNote = Note.enharmonic(pos[w])
                        }
                        let x = document.getElementById(findNote + '_' + i);
                        let y = document.getElementById(findNote + '_' + i + '_name');
                        if (x !== null && y !== null){
                            x.setAttribute('visibility', '');
                            y.setAttribute('visibility', '');
                            y.textContent = nameArray[w]
                            
                        }
                    }
                } else {
                    // console.log('off Model!')
                }
            }
        }
    
    return
}

function playHandler(){
    if (allBuffersAreLoaded()){
        dispatch(setPlayHighlight(true))
        Tone.start();
        Tone.Transport.cancel();
        loadNoteSequenceAndVisualDataOntoTimeline(refData.current)
        Tone.Transport.start();
    }  
}

function loopOn(){
    // Tone.Transport.loopStart = 0;
    // Tone.Transport.loopEnd = loopLengthCreator(data);
    if (Tone.Transport.loop !== true){
        Tone.Transport.loop = true;
        setLoop(true)
    } else {
        Tone.Transport.loop = false;
        setLoop(false)
    }
}

//Temp storage for direction NEXT on module play
function handlePreviousNextModulePlay(direction){
    var currentTime = Tone.Time(Tone.Transport.position).toSeconds();
    if (direction === 'next'){
        Tone.Transport.position = findBetween(currentTime + 0.01, moduleMarkers)['next']
    }
    if (direction === 'previous'){
        Tone.Transport.position = findBetween(currentTime, moduleMarkers)['previous']
    }
    if (direction === 'current'){
        Tone.Transport.position = findBetween(currentTime, moduleMarkers)['current']
    }
    displayNotes()
}

//FUNCTIONS TO HANDLE UPDATE ON INSTRUMENT *******

function handleStringChange(direction, instrumentNumber){
    var clone = [...instruments]
    var tuning = clone[instrumentNumber]["tuning"]
    var stringNumber = clone[instrumentNumber]["tuning"].length
    if (direction === 'down'){
        if (stringNumber !== 1){
            tuning.pop()
            stringNumber = tuning.length;
            setInstruments(clone)
        }
    } 
    if (direction === 'up'){
        var newNote = noteValues[findIndex(tuning[tuning.length - 1]) - 5];
        if (newNote === undefined){
            return
        } else {
        tuning.push(newNote['name'])
        stringNumber = stringNumber + 1
        setInstruments(clone)
        }
    }
}

function handleFretChange(direction, instrumentNumber){
    var clone = [...instruments]
    if (direction === 'down'){
        clone[instrumentNumber]["fretNumber"] = clone[instrumentNumber]["fretNumber"] - 1
        setInstruments(clone)
    }
    if (direction === 'up'){
        clone[instrumentNumber]["fretNumber"] = clone[instrumentNumber]["fretNumber"] + 1
        setInstruments(clone)
    }  
    
}

const onChangeTuning = (e, {id, value}) => {
    var clone = [...instruments]
    var idx = Number(id.split("_")[1])
    clone[idx]['tuning'] = value
    setInstruments(clone)
  }

const onChangeInstrument = (e, {id, value}) => {
   Tone.Transport.stop();
    var clone = [...instruments]
    var idx = Number(id.split("_")[1])
    const name = instruments[idx]['name']

    if (guitarInstruments.includes(value)){
        clone[idx] = JSON.parse(JSON.stringify(guitarPrototype))
        clone[idx]['type'] = 'guitar'
    }

    if (bassInstruments.includes(value)){
        clone[idx] = JSON.parse(JSON.stringify(bassPrototype))
        clone[idx]['type'] = 'bass'
    }
    let newSynth = nameOfNewSynthSource(value, instruments)
    clone[idx]['instrument'] = value;
    clone[idx]['name'] = name;
    clone[idx]['synthSource'] = newSynth

    loadASynth(newSynth, value)
    setInstruments(clone)
  }

function handleInstrumentUpdate(){
var clone = [...instruments]
var cloneData =[...data]
var clonePrototype = JSON.parse(JSON.stringify(guitarPrototype))
if (masterInstrumentArray.length === instruments.length){
    return
} else if (masterInstrumentArray.length > instruments.length){
    let newSynth = nameOfNewSynthSource('acoustic_guitar_nylon', instruments)
    clonePrototype['name'] = 'Instr ' + masterInstrumentArray.length
    clonePrototype['synthSource'] = newSynth
    clone.push(clonePrototype)
    loadASynth(newSynth, 'acoustic_guitar_nylon')
    setInstruments(clone)
} else if (masterInstrumentArray.length < instruments.length){
    clone.pop()
    cloneData.pop()
    setInstruments(clone)
    setData(cloneData)
}
}

let tempName = useRef('')

const handleInstrumentNameInput = (e) => {
    tempName.current = e.target.value
}

const handleInstrumentNameChange = e => {
    if (tempName.current.length === 0){
        setInputFocus(null)
        return
    }
    var clone = [...instruments]
    const idx = Number(e.target.id.split('_')[1])
    clone[idx]['name'] = tempName.current
    tempName.current = ('')
    setInputFocus(null)
    setInstruments(clone)
}

//FUNCTIONS TO HANDLE UPDATE ON INSTRUMENT *******


  //MIXER FUNCTIONS
function changeVolumeFromMixerInput(){
    if (mixer){
        let thisInstrumentSynth = loadedSynths.current[mixer['synthSource']]
        if (thisInstrumentSynth?.volume === undefined){
            return
        }
        if (mixer['value'] === '-20'){
                thisInstrumentSynth.volume.value = -Infinity;
        } else {
            thisInstrumentSynth.volume.value = mixer['value']
        }
    }
  }

  changeVolumeFromMixerInput()

//======

function handleActiveEdits(idx){
    var clone = [...activeEdits]
    if (clone.includes(idx)){
        clone = clone.filter(x => x !== idx)
    } else {
        clone.push(idx)
    }
    setActiveEdits(clone)
}

function mapGuitarSVGContainers(instruments){
    var clone = [...instruments]
    return(
       instruments.map((instruments, idx) =>
        <div id={'SVGContainer' + idx} key={'SVGContainer' + idx} style={{display: activelyDisplayedInstruments.includes(idx) ? '' : 'none'}}>
            <Input type='text' id={'input_' + idx} value={instruments[idx]} ref={input => input && input.focus()} placeholder={'Instr ' + (idx + 1)} onInput={handleInstrumentNameInput} onBlur={handleInstrumentNameChange} style={{display: inputFocus === idx ? '': 'none' }}/>
            
        <Button.Group>
            <Button compact basic onClick={() => handleActiveEdits(idx)}><Icon name='cog'/></Button>
            <Button compact basic onClick={() => setInputFocus(idx)} style={{display: inputFocus !== idx ? '': 'none' }}>{clone[idx]['name']} </Button>
        {activeEdits.includes(idx) && 
            <>
            <Button compact basic onClick={()=> handleStringChange('down', idx)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Strings: {clone[idx]['tuning'].length}
            </Segment>
            <Button compact basic onClick={()=> handleStringChange('up', idx)}> <Icon name ='right arrow'/></Button> 
            </>}
        </Button.Group>
        {activeEdits.includes(idx) &&
        <>
         <Dropdown
        search
        selection
        id={`instrument_${idx}`}
        options={instrumentOptions}
        onChange={onChangeInstrument}
        value={clone[idx]['instrument']}
        />
        {clone[idx]['type'] === 'guitar' && <Dropdown
        placeholder={instruments['tuning']}
        search
        selection
        id={`tuning_${idx}`}
        onChange={onChangeTuning}
        options={tuningOptionsGuitar}
        value={instruments['tuning']}
        />}
        {clone[idx]['type'] === 'bass' && <Dropdown
        placeholder={instruments['tuning']}
        search
        selection
        id={`tuning_${idx}`}
        onChange={onChangeTuning}
        options={tuningOptionsBass}
        value={instruments['tuning']}
        />}
        <Button.Group>
            <Button compact basic onClick={()=> handleFretChange('down', idx)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Frets: {clone[idx]['fretNumber']}
            </Segment>
            <Button compact basic onClick={()=> handleFretChange('up', idx)} > <Icon name ='right arrow'/></Button>
        </Button.Group>
        <FretboardDownloadModal
        instruments={instruments}
        idx = {idx}
        downloadAsPng = {downloadAsPng}
        />
        </>}
        <div className='guitarDiv' id={`divGuitar${idx}`}></div>
        </div>
        )
    )
}



function handleSeeAllPositions(){
    if (globalPosition.current !== -1){
        globalPosition.current = -1
    } else if (globalPosition.current === -1) {
        globalPosition.current = 0
    }
    if (displayFocus === 'lab'){
        displayNotes(noteDisplay)
    } else {
        displayNotes()
    }

}

function globalPositionChange(direction){
    if (direction === 'up'){
        globalPosition.current++
    } else if (direction === 'down'){
        if (globalPosition.current === 0){
            return
        } else {
            globalPosition.current--
        }
    }
    if (displayFocus === 'lab'){
        displayNotes(noteDisplay)
    } else {
        displayNotes()
    }
    dispatch(setGlobalPosition(globalPosition.current))
    
}

const handleStop = () => {
    Tone.Transport.stop()
    lastPosition.current = 0
    dispatch(setPlayHighlight(true))
    dispatch(setPlayHighlight(false))
    invisAll()
}

const handlePause = () => {
    Tone.Transport.pause()
    lastPosition.current = Tone.Time(Tone.Transport.position).toSeconds()
}

function downloadAsPng(ID, name){
    let width = 2000;
    let height = 400;
    var svgString = new XMLSerializer().serializeToString(document.getElementById(`divGuitar${ID}`).childNodes[0]);
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    var ctx = canvas.getContext("2d");
    // eslint-disable-next-line no-restricted-globals
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg);
    img.onload = function() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    var png = canvas.toDataURL("image/png");
        var a = document.createElement("a");
        a.download = name + ".png";
        a.href = png;
        a.click();
        window.URL.revokeObjectURL(png);
};
img.src = url;
}

function loadASynth(synthName, synthType){
    if (loadedSynths.current[synthName] === undefined){
        loadedSynths.current[synthName] = new Tone.Sampler(instrumentSamples[synthType]).toDestination()
    }
}

function disposeOfASynth(synthName){
    loadedSynths.current[synthName].dispose();
    delete loadedSynths.current[synthName]
}

function handleRecord(name){
if (name === undefined){
    name = '1'
}
setLoop(false)
Tone.Transport.stop()
Tone.Transport.loop = false;
let endOfAudio = loopLengthCreator(data) * 1000
const recorder = new Tone.Recorder();
recorder.start();
Tone.getDestination().connect(recorder)
playHandler()
setTimeout(async () => {
	const recording = await recorder.stop();
	const url = URL.createObjectURL(recording);
	const anchor = document.createElement("a");
	anchor.download = name + ".webm";
	anchor.href = url;
	anchor.click();
}, endOfAudio);
}

    return (
        <>
        {mapGuitarSVGContainers(instruments)}
        <Button compact basic onClick={handleStop}><Icon name='stop'/></Button>
        <Button compact basic onClick={handlePause}><Icon name='pause'/></Button>
        <Button compact basic loading={loading} onClick={() => playHandler()}><Icon name='play'/> </Button>
        <Button compact basic active={loop === true} onClick={()=>loopOn()}><Icon name='retweet'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('previous')} ><Icon name='fast backward'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('current')} ><Icon name='eject'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('next')}><Icon name='fast forward'/></Button>
        <Button compact basic onClick={() => globalPositionChange('down')}><Icon name='arrow down'/></Button>
        <Button compact basic onClick={() => globalPositionChange('up')}><Icon name='arrow up'/></Button>
        <Button compact basic onClick={() => handleSeeAllPositions()}><Icon name='arrows alternate vertical'/></Button>
        <AudioDownloadModal tab={tab} handleRecord={handleRecord} length={loopLengthCreator(data) * 1000}/>
        <BpmModal/>
        <TabDownloadModal tab={tab}/>
        <MidiModal masterInstrumentArray={masterInstrumentArray} tab={tab}/>
        </>
    )
}
