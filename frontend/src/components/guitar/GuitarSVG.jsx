import React, { useState, useEffect, useRef} from 'react'
import instrumentSamples from '../Instruments/Instruments'
import { jsPDF } from "jspdf";
import { svgAsPngUri } from "save-svg-as-png";
import FileSaver from 'file-saver'
import * as Tone from 'tone';
import { currentSynths, nameOfNewSynthSource } from './allSynths'
import { useSelector, useDispatch} from 'react-redux';
import { Dropdown, Button, Icon, Segment, Input } from 'semantic-ui-react';
import {moduleMarkerCreator, moduleMarkerCreatorAll, moduleMarkerCreatorCompact, loopLengthCreator, findBetween} from './timeFunctions'
import { invisAll, shadeHexColor} from './guitarDisplayFunctions';
import {noteValues, romanNumerals} from './guitarSVGConstants';
import { guitarPrototype, bassPrototype } from './instrumentPrototypes';
import { Note } from '@tonaljs/tonal';
import { setSongData } from '../../store/actions/songDataActions';
import { setInstrumentNames } from '../../store/actions/instrumentNameActions';
import './guitar.css'
import { setPlayHighlight } from '../../store/actions/playHighlightActions';
import { tuningOptionsGuitar, tuningOptionsBass } from './tunings';
import { instrumentOptions } from './instruments';
import { setGlobalInstruments } from '../../store/actions/globalInstrumentsActions';
import { downloadTabAsTextFile } from './tabfunctions';
import TabDownloadModal from '../modal/TabDownloadModal'
import AudioDownloadModal from '../modal/AudioDownloadModal';


export default function GuitarSVG({masterInstrumentArray, activelyDisplayedInstruments}) {
    const state = useSelector((state) => state.module)
    //Change it so that noteColors is global?
    const [instruments, setInstruments] = useState([{name: 'Instr 1', instrument:'acoustic_guitar_nylon', synthSource: 'acoustic_guitar_nylon', type: 'guitar', noteColors: '', scale:[], tuning:['E4','B3','G3','D3','A2','E2'],stringNumber:6,fretNumber: 24}])
    const [module, setModule] = useState(0);
    const [inputFocus, setInputFocus] = useState(null)
    const [noteColors, setNoteColors] = useState('')
    const globalPosition = useRef(0); 
    const [data, setData] = useState([
        {
        displayOnly: false,
        highlights: [],
        master: true, 
        data: [{speed:1, notes:[['D4','X','D4 F4 A4', 'E4'],['X','X', 'D4 F4 A4', 'X'],['X', 'G4','D4 F4 A4', 'X'],['B4', 'X','D4 F4 A4', 'F5']]}, {speed:1, notes:[['G5','X', 'F5', 'X'],['E5','X', 'D5', 'X'],['B4','X', 'E4', 'X'],['B4', 'X','E4', 'X']]}, {speed: 1, notes:[['C4','X', 'D4', 'X'],['E4','X', 'F4', 'X'],['G4', 'X','C4', 'X'],['D4','X', 'C4', 'X']]}, {speed:1 , notes:[['A4','X', 'C4', 'X'],['D4','X', 'E4', 'X'],['A5','X', 'C5', 'X'],['D5','X', 'E5', 'X']]}]
    }
    ])
    const [loop, setLoop] = useState(false)
    const [activeEdits, setActiveEdits] = useState([])
    const [moduleMarkers, setModuleMarkers] = useState(moduleMarkerCreator(data))
    const [allModuleMarkers, setAllModuleMarkers] = useState(moduleMarkerCreatorAll(data))
    const [labDisplay, setLabDisplay] = useState(false)
    
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

    var initialLoad = useRef(true)

    var loadedSynths = useRef(currentSynths)

    //=====Consts
    const guitarInstruments = [
        "acoustic_guitar_nylon",
        "acoustic_guitar_steel",
        "electric_distortion_guitar",
        "electric_guitar_clean" ,
        "electric_guitar_jazz"
    ]
    const bassInstruments = [
        "acoustic_bass",
        "electric_bass_finger"
    ]


    useEffect(() => {
        handleInstrumentUpdate();
    }, [masterInstrumentArray])

    var lastPosition = useRef(0)
    const refData = useRef('')
    const refInstruments = useRef('')


    useEffect(() => {
        refData.current = data
        refInstruments.current = instruments
    }, [data, instruments])

    useEffect(() => {
        loadNoteSequenceAndVisualDataOntoTimeline(data)
        displayNotes()
    }, [data, instruments])

    useEffect(() => {
        dispatch(setGlobalInstruments(instruments))
    }, [instruments])

    //display functionality
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

    useEffect(() => {
        if (state !== "Initial Module Data"){
            const dataPackage = JSON.parse(state)
            setData(dataPackage['data'])
            setModuleMarkers(moduleMarkerCreator(dataPackage['data']))
            setAllModuleMarkers(moduleMarkerCreatorAll(dataPackage['data']))
        } else {
            return
        }
        
    }, [state])

    useEffect (()=>{
        createGuitarSVG();
        dispatch(setSongData(instruments))
        const instrumentNames = []
        for (var i = 0; i < instruments.length; i++){
            instrumentNames.push(instruments[i]['name'])
        }
        dispatch(setInstrumentNames(instrumentNames))
    }, [instruments]);
    //====================================
    //=====Update instruments

    useEffect(() => {
        if (songImport){
            setInstruments(songImport['instruments'])
        } else {
            return
        }
    }, [songImport])

    useEffect(() => {
        if (noteDisplay && (Tone.Time(Tone.Transport.position).toSeconds() === 0 && Tone.Transport.state === 'stopped')){
            displayNotes(noteDisplay)
            setLabDisplay(true)
        } else {
            return
        }
    }, [noteDisplay])

    useEffect(() => {
        if (initialLoad.current === false){
            loadNoteSequenceAndVisualDataOntoTimeline(playImport)
            // console.log(playImport, 'playImport')
            // console.log(data, 'data')
        }
    }, [playImport])

    useEffect(() => {
        initialLoad.current = false;
    }, [])



    //----Check if the position has moved while paused

function findIndex(name){
        for (var z = 0; z < noteValues.length; z++){
            if (noteValues[z]['name'] === name){
                return z
            }
        }
    }

    //--------------------

function createGuitarSVG(){
    for (var NUM = 0; NUM < instruments.length; NUM++){
        
    var stringWidth = 0.5;
    var y = 10;
    var x = 80;
    //length of imaginary guitar if shown in full
    var scaleLength = 2400;
    //=============================================
    var fretNumber = instruments[NUM]['fretNumber'];
    var tuning = instruments[NUM]['tuning']
    var instrumentScale =  instruments[NUM]['scale']
    var scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    var instrumentType = instruments[NUM]['instrument']
    var noteColor = instruments[NUM]['noteColors'];
    var leftHanded = false;
    var fretPositions = []
    var boardLength = 42 + (scaleLength - (scaleLength/(Math.pow(2, fretNumber/12)))) 
    if (leftHanded === true){
        for (var k = 1; k < fretNumber + 1; k++){
            var result = (boardLength - 40) - (scaleLength - (scaleLength/(Math.pow(2, k/12))))
            fretPositions.push(result)
        } 
    } else {
        for (var k = 1; k < fretNumber + 1; k++){
            var result = 40 + (scaleLength - (scaleLength/(Math.pow(2, k/12))))
            fretPositions.push(result)
        } 
    }

    var boardHeight = 20 + ((instruments[NUM]['tuning'].length - 1) * 50);
    var topBuffer = 15;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", boardHeight + 45 + topBuffer);
    svg.setAttribute("width", boardLength);
    svg.setAttribute("id", "svg" + NUM)
    svg.setAttribute("class", "GuitarSVG")
    
    //neck
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("y", topBuffer)
    rect.setAttribute("width", boardLength);
    rect.setAttribute("height", boardHeight);
    rect.setAttribute("fill", "#BA8C63");
    svg.appendChild(rect)

    //nut
    var nutPosition;
    if (leftHanded === true){
        nutPosition = (boardLength - 40)
    } else {
        nutPosition = 40
    }
    var nut = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    nut.setAttribute("x1", nutPosition);
    nut.setAttribute("x2", nutPosition);
    nut.setAttribute("y1", topBuffer);
    nut.setAttribute("y2", boardHeight + topBuffer);
    nut.setAttribute("stroke-width", "5");
    nut.setAttribute("stroke", "black");
    svg.appendChild(nut);

    //frets
    //Thanks Vincenzo Galilei
    
    for (var j = 0; j < fretNumber + 1; j++){
    var fret = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    fret.setAttribute('x1', fretPositions[j]);
    fret.setAttribute('x2', fretPositions[j]);
    fret.setAttribute('y1', topBuffer);
    fret.setAttribute('y2', boardHeight + topBuffer);
    fret.setAttribute("stroke-width", "4");
    fret.setAttribute("stroke", "#C0C0C0");
    svg.appendChild(fret);
    }
    //fret markers

    if (fretNumber >= 12){
    var fretMarker121 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker121.setAttribute('cx', ((fretPositions[10] + fretPositions[11])/2));
    fretMarker121.setAttribute('cy', ((boardHeight - 10) * 1/3) + topBuffer);
    fretMarker121.setAttribute('r', 10);
    fretMarker121.setAttribute('fill', 'black');
    fretMarker121.setAttribute('class', 'fretmarker');
    fretMarker121.setAttribute('id', 'fretmarker121' + NUM);
    svg.appendChild(fretMarker121);

    var fretMarker122 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker122.setAttribute('cx', ((fretPositions[10] + fretPositions[11])/2));
    fretMarker122.setAttribute('cy', ((boardHeight + 10) * 2/3) + topBuffer);
    fretMarker122.setAttribute('r', 10);
    fretMarker122.setAttribute('fill', 'black');
    fretMarker122.setAttribute('class', 'fretmarker');
    fretMarker122.setAttribute('id', 'fretmarker122' + NUM);
    svg.appendChild(fretMarker122);

    if (fretNumber >= 24){
        //24th fret marker
    var fretMarker241 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker241.setAttribute('cx', ((fretPositions[22] + fretPositions[23])/2));
    fretMarker241.setAttribute('cy', ((boardHeight - 10) * 1/3) + topBuffer);
    fretMarker241.setAttribute('r', 10);
    fretMarker241.setAttribute('fill', 'black');
    fretMarker241.setAttribute('class', 'fretmarker');
    fretMarker241.setAttribute('id', 'fretmarker241' + NUM);
    svg.appendChild(fretMarker241);

    var fretMarker242 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker242.setAttribute('cx', ((fretPositions[22] + fretPositions[23])/2));
    fretMarker242.setAttribute('cy', ((boardHeight + 10) * 2/3) + topBuffer);
    fretMarker242.setAttribute('r', 10);
    fretMarker242.setAttribute('fill', 'black');
    fretMarker242.setAttribute('class', 'fretmarker');
    fretMarker242.setAttribute('id', 'fretmarker242' + NUM);
    svg.appendChild(fretMarker242);

    if (fretNumber >= 36){
        var fretMarker361 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker241.setAttribute('cx', ((fretPositions[34] + fretPositions[35])/2));
    fretMarker241.setAttribute('cy', ((boardHeight - 10) * 2/3));
    fretMarker241.setAttribute('r', 10);
    fretMarker241.setAttribute('fill', 'black');
    fretMarker241.setAttribute('class', 'fretmarker');
    fretMarker241.setAttribute('id', 'fretmarker361' + NUM);
    svg.appendChild(fretMarker361);

    var fretMarker362 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker242.setAttribute('cx', ((fretPositions[34] + fretPositions[35])/2));
    fretMarker242.setAttribute('cy', ((boardHeight + 10) * 1/3));
    fretMarker242.setAttribute('r', 10);
    fretMarker242.setAttribute('fill', 'black');
    fretMarker242.setAttribute('class', 'fretmarker');
    fretMarker242.setAttribute('id', 'fretmarker362' + NUM);
    svg.appendChild(fretMarker362);
    }
    }
    }
    

    //Rest of the fretmarkers
    var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 21]
    var filteredFretMarkerPositions = [];
    for (var i = 0; i < fretMarkerPositions.length; i++){
        if (fretMarkerPositions[i] <= fretNumber){
            filteredFretMarkerPositions.push(fretMarkerPositions[i])
        }
    }
    fretMarkerPositions = filteredFretMarkerPositions;
    // var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 19, 21, 27, 29, 31, 33]
    for (var i = 0; i < fretMarkerPositions.length; i++){
    var fretMarker = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker.setAttribute('cx', ((fretPositions[fretMarkerPositions[i] - 2] + fretPositions[fretMarkerPositions[i] -1])/2));
    fretMarker.setAttribute('cy', boardHeight/2 + topBuffer);
    fretMarker.setAttribute('r', 10);
    fretMarker.setAttribute('fill', 'black');
    fretMarker.setAttribute('class', 'fretmarker');
    svg.appendChild(fretMarker);
    }
    //strings
    if (bassInstruments.includes(instrumentType)){
        stringWidth += 2;
    }
    for (var i = 0; i < tuning.length; i++) {
        var string = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        string.setAttribute("x1", 0);
        string.setAttribute("x2", boardLength);
        string.setAttribute("y1", y + topBuffer);
        string.setAttribute("y2", y + topBuffer);
        string.setAttribute("stroke-width", stringWidth);
        string.setAttribute("stroke", "#71797E");
        svg.appendChild(string);
        y += 50;
        stringWidth += 0.5;
     };
    //note
    var noteX = 20;
    var noteY = 10;
    //generate notes
    for (var k = 0; k < tuning.length; k++){
        var index = findIndex(tuning[k]);
        for (var l = 0; l < fretNumber + 1; l++){

            var note = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            if (leftHanded === true){
                if (l === 0){
                    note.setAttribute('cx', boardLength - 20);
                } else if (l === 1){
                    note.setAttribute('cx', (boardLength - 40 + fretPositions[0])/2)
                } else {
                    note.setAttribute('cx', (fretPositions[l -2] + fretPositions[l -1])/2)
                }
            } else {
                if (l === 0){
                    note.setAttribute('cx', 20);
                } else if (l === 1){
                    note.setAttribute('cx', (40 + fretPositions[0])/2)
                } else {
                    note.setAttribute('cx', (fretPositions[l -2] + fretPositions[l -1])/2)
                }
            }
            
            note.setAttribute('cy', noteY + topBuffer);
            note.setAttribute('r', 15);
            if (noteColor === 'black'){
                note.setAttribute('fill', "black");
            } else {
                note.setAttribute('fill', shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06) ));
            }
            note.setAttribute('stroke', "azure");
            note.setAttribute('stroke-width', "2");
            note.setAttribute('class', noteValues[index]["name"] + '_' + NUM + ' note_' + NUM + ' note note_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM);
            note.setAttribute('id', (k + 1) + "_" + l + "_" + NUM);
            //specialNotes
            var noteDiamond = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
            var thisX;
            var thisY;
            if (leftHanded === true){
                if (l === 0){
                    thisX = boardLength - 20
                } else if (l === 1){
                    thisX = (boardLength - 40 + fretPositions[0])/2
                } else {
                    thisX = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            } else {
                if (l === 0){
                    thisX = 20
                } else if (l === 1){
                    thisX = (40 + fretPositions[0])/2
                } else {
                    thisX = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            }
            thisY = noteY + topBuffer - 21
            noteDiamond.setAttribute('x', thisX)
            noteDiamond.setAttribute('y', thisY);
            noteDiamond.setAttribute('height', 30);
            noteDiamond.setAttribute('width', 30);
            if (noteColor === 'black'){
            noteDiamond.setAttribute('fill', "black");
            } else {
            noteDiamond.setAttribute('fill', shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06) ));
            }
            noteDiamond.setAttribute('stroke', "azure");
            noteDiamond.setAttribute('stroke-width', "2");
            noteDiamond.setAttribute('class', noteValues[index]["name"] + '_' + NUM + '_special notespecial_' + NUM + ' notespecial notespecial_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM);
            noteDiamond.setAttribute('id', (k + 1) + "_" + l + "_" + NUM + 'special');

            noteDiamond.setAttribute('stroke', "azure");
            noteDiamond.setAttribute('stroke-width', "2");
            noteDiamond.setAttribute('transform', `translate(${thisX}, ${thisY}) rotate(45) translate(-${thisX}, -${thisY})`);
            noteDiamond.setAttribute('visibility', 'hidden');
            var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            if (leftHanded === true){
                if (l === 0){
                    noteName.setAttribute('x', boardLength - 20);
                } else if (l === 1){
                    noteName.setAttribute('x', (boardLength - 40 + fretPositions[0])/2)
                } else {
                    noteName.setAttribute('x', (fretPositions[l -2] + fretPositions[l -1])/2)
                }
            } else {
                if (l === 0){
                    noteName.setAttribute('x', 20);
                } else if (l === 1){
                    noteName.setAttribute('x', (40 + fretPositions[0])/2)
                } else {
                    noteName.setAttribute('x', (fretPositions[l -2] + fretPositions[l -1])/2)
                }
            }
            noteName.setAttribute('y', noteY + topBuffer);
            noteName.setAttribute('text-anchor', 'middle');
            if (noteColor === 'black'){
                noteName.setAttribute('fill', "white");
            } else {
                noteName.setAttribute('fill', 'black');
            }
            noteName.setAttribute('dominant-baseline', 'middle');
            noteName.setAttribute('font-size', '15px');
            noteName.setAttribute('class', noteValues[index]["name"] + '_' + NUM + '_name notename_' + NUM + ' notename notename_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM)
            noteName.setAttribute('id', (k + 1) + "_" + l + "_" + NUM + "_name");
            noteName.textContent = noteValues[index]["name"];
            if (instrumentScale.indexOf(noteValues[index]["note"]) === -1){
                note.setAttribute('visibility', 'hidden');
                noteName.setAttribute('visibility', 'hidden');
            }
            svg.appendChild(note);
            svg.appendChild(noteDiamond);
            svg.appendChild(noteName);

            noteX += 40;
            index += 1;
        }
        noteY += 50;
        noteX = 20;
    }
    //generate fretIndicators
    
    for (let l = 1; l < fretNumber + 1; l++){
        var fretIndicator = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        if (leftHanded === true){
            if (l === 1){
                fretIndicator.setAttribute('x', (boardLength - 40 + fretPositions[0])/2)
            } else {
                fretIndicator.setAttribute('x', (fretPositions[l -2] + fretPositions[l -1])/2)
            }
        } else {
            if (l === 1){
                fretIndicator.setAttribute('x', (40 + fretPositions[0])/2)
            } else {
                fretIndicator.setAttribute('x', (fretPositions[l -2] + fretPositions[l -1])/2)
            }
        }
           
        fretIndicator.setAttribute('font-size', '15px');
        fretIndicator.textContent = romanNumerals[l];
        fretIndicator.setAttribute('text-anchor', 'middle')
        fretIndicator.setAttribute('y', boardHeight + 30 + topBuffer)
        svg.appendChild(fretIndicator);
    }

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

var playPosition = 0;

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

//This function converts everything to flats
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
//======

function playHandler(){
    dispatch(setPlayHighlight(true))
    Tone.start();
    Tone.Transport.cancel();
    loadNoteSequenceAndVisualDataOntoTimeline(data)
    Tone.Transport.start();
}

function returnPosition(note, tuning, manualPosition){
    let position;
    if (manualPosition === undefined){
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

function loadNoteSequenceAndVisualDataOntoTimeline(data){
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
                  var currentTime = Tone.Time(Tone.Transport.position).toSeconds()
                  setModule(findBetween(currentTime, moduleMarkerCreatorCompact(data))['playingIndex'])
                  //
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
                            console.log('off Model!')
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
                            // tabArray.push(x.getAttribute('id')); 
                        }
                        // generateTab(tabArray);
                    } else {
                        console.log('off Model!')
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
    for (let j = 0; j < data.length; j++){
        setUpSequence(data[j]['data'], loadedSynths.current[instruments[j]['synthSource']], j, data[j]['displayOnly'])
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
            if (data[i]['data'][currentModuleIndex] === undefined){
                return
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
                    console.log('off Model!')
                }
                }
                } else {
                console.log('here 1076')
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
                            console.log('off Model!')
                        }
                    }
                }
                
                }
                
                
            } else if (displayOnly){
                console.log('here 1110')
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
                console.log('here 1138')
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
                        console.log('off Model!')
                    }
                }
            } else {
                console.log('here 1162')
                let manualPosition = data[i]['data'][0]['position']
                let nameArray = noteStringHandler(data[i]['data'][currentModuleIndex]['notes'][0][0])
                let pos = returnPosition(data[i]['data'][currentModuleIndex]['notes'][0][0], instruments[i]['tuning'], manualPosition);
                // var tabArray = []
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
                    console.log('off Model!')
                }
            }
        }
    
    return
}

//
//=====functions to handle clicks

function loopOn(){
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = loopLengthCreator(data);
    console.log(loopLengthCreator(data))
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


  function changeVolumeFromMixerInput(){
    if (mixer){
        let thisInstrumentSynth = loadedSynths.current[mixer['synthSource']]
        thisInstrumentSynth.volume.value = mixer['value']
    }
  }

  changeVolumeFromMixerInput()

  const onChangeVolume1 = (e) => {
    let thisInstrumentSynth = loadedSynths.current[instruments[0]['synthSource']]
    thisInstrumentSynth.volume.value = e.target.value
  }
  const onChangeVolume2 = (e) => {
    let thisInstrumentSynth = loadedSynths.current[instruments[1]['synthSource']]
    thisInstrumentSynth.volume.value = e.target.value
  }

  const onChangeVolumeMaster = (e) => {
      Tone.getDestination().volume.value = e.target.value
  }

//   let panner = useRef(new Tone.Reverb(5.0).toDestination())
//   let thisInstrumentSynth = loadedSynths.current[instruments[0]['synthSource']]
//   thisInstrumentSynth.connect(panner.current, Tone.Destination)


//   const onChangePanning1 = (e) => {
//       panner.current.wet.value = e.target.value;
// //    panner.current.pan.value = e.target.value;
// // panner.current.dispose()
//   }

  const onChangePanning2 = (e) => {
    let thisInstrumentSynth = loadedSynths.current[instruments[1]['synthSource']]
    thisInstrumentSynth.panning.value = e.target.value
  }

function addRemoveGuitars(action){
    var clone = [...instruments]
    if (action === 'add'){
        clone.push(guitarPrototype)
        setInstruments(clone)
    } else if (action === 'remove'){
        clone.pop()
        setInstruments(clone)
    }
}

let tempName = useRef('')

const handleInstrumentNameInput = (e) => {
    tempName.current = e.target.value
}

const handleInstrumentNameChange = e => {
    var clone = [...instruments]
    const idx = Number(e.target.id.split('_')[1])
    clone[idx]['name'] = tempName.current
    tempName.current = ('')
    setInputFocus(null)
    setInstruments(clone)
}



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
        <Button compact basic onClick={() => downloadAsPng(idx)}><Icon name='download'/></Button>
        </>}
        <div className='guitarDiv' id={`divGuitar${idx}`}></div>
        </div>
        )
    )
}

function displayByPitchClass(notes, highlights, board){
    for (var i = 0; i < notes.length; i++){
        var x;
        var y;
        if (highlights.includes(i + 1)){
            x = document.getElementsByClassName('notespecial_pitchClass_' + notes[i] + '_' + board);
        } else {
            x = document.getElementsByClassName('note_pitchClass_' + notes[i] + '_' + board);
        }
        y = document.getElementsByClassName('notename_pitchClass_' + notes[i] + '_' + board);
    for (var j = 0; j < x.length; j++){
        x[j].setAttribute('visibility', '');
        y[j].setAttribute('visibility', '');
    }
    }
    

    
}

function handleSeeAllPositions(){
    if (globalPosition.current !== -1){
        globalPosition.current = -1
    } else if (globalPosition.current === -1) {
        globalPosition.current = 0
    }
    if (labDisplay){
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
    if (labDisplay){
        displayNotes(noteDisplay)
    } else {
        displayNotes()
    }
    
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

async function downloadSVGasPDFusingID(ID) {
    let svg = document.getElementById(`divGuitar${ID}`).childNodes[0]
    const pdf = new jsPDF("l", "pt", [1900, 500]);
    const pdfCanvas = document.createElement("canvas");
    pdfCanvas.setAttribute("width", 2000);
    pdfCanvas.setAttribute("height", 600);
    const dataURI = await svgAsPngUri(svg)
    pdf.addImage(dataURI, "PNG", 0, 0);
    pdf.save("whole board!.pdf");
  }

async function downloadSVGAsPNGUsingID(ID){
    let svgString = new XMLSerializer().serializeToString(document.getElementById(`divGuitar${ID}`).childNodes[0]) 
    var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    let canvas = document.createElement('canvas')
    let width = 2000;
    let height = 600;
    let image = new Image();
    image.src = svgString;
    canvas.height = (2000)
    canvas.width = (600)
    let ctx = canvas.getContext("2d")
    ctx.fillStyle='white'
    ctx.drawImage(image, 0, 0, width, height)
    var jpg = canvas.toDataURL("image/jpg")
    FileSaver.saveAs(jpg, ID + ".jpg");

}


function downloadAsPng(ID){
    let width = 2000;
    let height = 400;
    let name = 'TestDownload2'
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
    loadedSynths.current[synthName] = new Tone.Sampler(instrumentSamples[synthType]).toDestination()
}

function disposeOfASynth(synthName){
    synthName.dispose();
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

function downloadTab(){
    downloadTabAsTextFile(tab['tab'], tab['name'])
}

function previewTab(){
    let stringArr = tab['tab'].split('\n')
    return (
        stringArr.map(stringArr =>
            <div>{stringArr}</div>)
    )
}

    return (
        <>
        {mapGuitarSVGContainers(instruments)}
        <Button compact basic onClick={handleStop}><Icon name='stop'/></Button>
        <Button compact basic onClick={handlePause}><Icon name='pause'/></Button>
        <Button compact basic onClick={() => playHandler()}><Icon name='play'/> </Button>
        <Button compact basic active={loop === true} onClick={()=>loopOn()}><Icon name='retweet'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('previous')} ><Icon name='fast backward'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('current')} ><Icon name='eject'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('next')}><Icon name='fast forward'/></Button>
        <Button compact basic onClick={() => globalPositionChange('down')}><Icon name='arrow down'/></Button>
        <Button compact basic onClick={() => globalPositionChange('up')}><Icon name='arrow up'/></Button>
        <Button compact basic onClick={() => handleSeeAllPositions()}><Icon name='arrows alternate vertical'/></Button>
        <AudioDownloadModal tab={tab} handleRecord={handleRecord} length={loopLengthCreator(data) * 1000}/>
        <TabDownloadModal tab={tab}/>
        <Button compact basic onClick={() => handleSeeAllPositions()}>bpm</Button>
        </>
    )
}
