import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import FileSaver from 'file-saver'
import {Button, Dropdown, Menu, Icon, Input, Form, TextArea, ButtonOr, Divider} from 'semantic-ui-react';
import { Note, Scale, Chord, Midi, ChordType} from '@tonaljs/tonal';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import { downloadTabAsTextFile , generateTabFromModules} from '../guitar/tabfunctions.js';
import { initialData, initialDataType2} from './dummyData';
import { DataPrototype } from './dataPrototypes';
import * as Tone from 'tone';
import { setSongImportData } from '../../store/actions/songImportDataActions';
import ExportModal from '../modal/ExportModal';
import { setTab } from '../../store/actions/tabActions';
import { setDisplayFocus } from '../../store/actions/displayFocusActions';
import { setPlayHighlight } from '../../store/actions/playHighlightActions';
import { setRecommendedScale, turnScaleNameIntoScaleData } from '../lab/chordMapGenerator';
import { turnPlayerDataIntoFullMidiSong } from '../midi/midifunctions';

export default function Player ({masterInstrumentArray, display, childChangeInstr}) {
    const [instrumentFocus, setInstrumentFocus] = useState(0);
    const [displayLock, setDisplayLock] = useState(true)
    const [opened, setOpened] = useState(false)
    const [mainModule, setMainModule] = useState(0)
    const [data, setData] = useState([{mode: 'melody', highlight: [], data: initialDataType2}])
    const [markers, setMarkers] = useState([])
    var markerValue = useRef([])
    const [currentlyPlaying, setCurrentlyPlaying] = useState([])
    var [activeButton, setActiveButton] = useState('swap')
    const [name, setName] = useState('Noodler Theme')
    const [exportPool, setExportPool] = useState('global')
    const [edit, setEdit] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [mode, setMode] = useState(false)
    const [inputFocus, setInputFocus] = useState(false)
    const [hideModuleName, setHideModuleName] = useState(false)
    const [titleLock, setTitleLock] = useState(false)
    const user = JSON.parse(localStorage.getItem('userInfo'))
    var controls = useRef('swap')
    const dispatch = useDispatch();

    const songData = useSelector(state => state.songData)
    const {songInfo} = songData

    const songImportData = useSelector(state => state.songImport)
    const {songImport} = songImportData

    const playHighlightData = useSelector(state => state.playHighlight)
    const {playHighlight} = playHighlightData

    const mapChordsToPlayerData = useSelector(state => state.mapChordsToPlayer)
    const {mapChordsToPlayer} = mapChordsToPlayerData

    const globalInstrumentData = useSelector(state => state.globalInstruments)
    const {globalInstruments} = globalInstrumentData

    const displayFocusData = useSelector(state => state.displayFocus)
    const {displayFocus} = displayFocusData

    const globalPositionData = useSelector(state => state.globalPosition)
    const {globalPosition} = globalPositionData

    const setBpmData = useSelector(state => state.setBpm)
    const setBpm = setBpmData['bpm']

    var highlight = useRef(false)

    const {sendModuleData} = bindActionCreators(actionCreators, dispatch);

    //instruments is binary array
    function overWriteModulesToData(data, modules, instruments){
        let cloneData = JSON.parse(JSON.stringify(data))
        for (let i = 0; i < cloneData.length; i++){
            if (instruments[i] === 1){
                cloneData[i]['data'] = [];
                for (let j = 0; j < modules.length; j++){
                    cloneData[i]['data'].push(modules[j])
                }
            } 
        }
        setData(cloneData)
    }

    //instruments is a binary array
    function appendModulesToData(data, modules, instruments){
        let cloneData = JSON.parse(JSON.stringify(data))
        for (let i = 0; i < cloneData.length; i++){
            if (instruments[i] === 1){
                for (let j = 0; j < modules.length; j++){
                    cloneData[i]['data'].push(modules[j])
                }
            }
        }
        setData(cloneData)
    }

    function handleMapChordsToPlayer(mapChordsToPlayer){
        let modules = mapChordsToPlayer['modules']
        let mappingType = mapChordsToPlayer['mappingType']
        let instruments = mapChordsToPlayer['instruments']
        if (mappingType === 'overwrite'){
            overWriteModulesToData(data, modules, instruments)
        }
        if (mappingType === 'append'){
            appendModulesToData(data, modules, instruments)
        }
    }

    useEffect(() => {
        if (songImport){
            setData(songImport['data'])
            setName(songImport['name'])
            setDescription(songImport['desc'])
            console.log(songImport['bpm'])
            Tone.Transport.bpm.value = songImport['bpm']
        } else {
            return
        }
    }, [songImport])

    useEffect(() => {
        if (mapChordsToPlayer){
            handleMapChordsToPlayer(mapChordsToPlayer)
        } else {
            return
        }
    }, [mapChordsToPlayer])

    useEffect(() => {
        if (playHighlight !== highlight.current){
            highlight.current = playHighlight
        } 
    }, [playHighlight])



    useEffect(() => {
        handleUpdate()
    }, [masterInstrumentArray])

    useEffect (()=>{
        setModuleMarkers()
        const sentData = convertModuleDataIntoPlayableSequence(data)
        sendModuleData(JSON.stringify({markers: markers, data: sentData})) 
        let tab = convertToTab()
        const playableSequence = convertModuleDataIntoPlayableSequence(data)
        const midi = turnPlayerDataIntoFullMidiSong(playableSequence)
        //Midi is included in tab dispatch!
        dispatch(setTab({tab: tab, name: name, midi: midi}))
    }, [data, setBpm, globalInstruments, globalPosition]);

function handleSetInstrumentFocus(value){
    if (displayLock){
        childChangeInstr(value)
    }
    setInstrumentFocus(value)
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

    //generate notes from patternData using scaleData
function patternAndScaleToNotes(pattern, patternType, scale, root){
        var allNotes = [];
        var allChromaticNotes = [];
        var chromaticScale = Scale.get('c chromatic').notes
        var notesExport = [];
        if (root === undefined){
            root = scale[0] + 3;
        }
        if (patternType === 'fixed'){
            return pattern
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
                        if (cloneRhythm[i] === 'O'){
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

function chordIntoRhythm(chord, rhythm, numberOfNotes){
    var chordPattern = [];
    var chordString = chord.join(' ');
    for (var i = 0; i < numberOfNotes; i++){
        chordPattern.push(chordString)
    }
    return notesIntoRhythm(chordPattern, rhythm)
}

function scaleIntoScaleDisplayNotes(scale, duration){
        if (duration === undefined){
            duration = 4;
        }
        var returnArr = []
        var cleanScale = [];
        for (var h = 0; h < scale.length; h++){
            cleanScale.push(Note.pitchClass(scale[h]))
        }
        var noteStr = cleanScale.join(' ')
        for (var i = 0; i < duration; i++){
            returnArr.push([noteStr])
        }
        return returnArr;
    }

function handleOffMode(duration){
        if (duration === undefined){
            duration = 4;
        }
        var returnArr = [];
        for (var i = 0; i < duration; i++){
            returnArr.push(['X'])
        }
        return returnArr;
    }

function convertModuleDataIntoPlayableSequence(musicData){
        var returnArr = [];
        for (var h = 0; h < musicData.length; h++){
            var returnObject = 
            {displayOnly: true,
            highlight: [],
            data: []};
            if (musicData[h]['mode'] === 'melody'){
                returnObject['displayOnly'] = false;
                for (let i = 0; i < musicData[h]['data'].length; i++){
                    let innerObject = {speed:1, notes:[]}
                    let positionType = musicData[h]['data'][i]['data']['patternData']['positionType'];
                    let speed = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    let position;
                    if ( positionType === 'unlocked'){
                        position = [];
                    } else {
                        position = musicData[h]['data'][i]['data']['patternData']['position']
                    }
                    let rhythm = musicData[h]['data'][i]['data']['rhythmData']['rhythm'];
                    let pattern = musicData[h]['data'][i]['data']['patternData']['pattern']
                    let patternType = musicData[h]['data'][i]['data']['patternData']['type']
                    let scale = musicData[h]['data'][i]['data']['scaleData']['scale']
                    let notes = patternAndScaleToNotes(pattern, patternType, scale)
                    let sequence = notesIntoRhythm(notes, rhythm)
                    innerObject['speed'] = speed
                    innerObject['position'] = position
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'chord'){
                returnObject['displayOnly'] = false;
                for (let i = 0; i < musicData[h]['data'].length; i++){
                    
                    let innerObject = {speed:1, notes:[]}
                    let rhythm = musicData[h]['data'][i]['data']['rhythmData']['rhythm'];
                    let numberOfNotes = musicData[h]['data'][i]['data']['rhythmData']['notes']
                    let scale = musicData[h]['data'][i]['data']['scaleData']['scale']
                    let thisChord = musicData[h]['data'][i]['data']['chordData']['chord']
                    let sequence = chordIntoRhythm(thisChord, rhythm, numberOfNotes )
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['position'] = musicData[h]['data'][i]['data']['chordData']['position']
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'off'){
                returnObject['displayOnly'] = true;
                for (let i = 0; i < musicData[h]['data'].length; i++){
                    let innerObject = {speed:'', notes:[]}
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = handleOffMode();
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'scale'){
                returnObject['displayOnly'] = true;
                for (let i = 0; i < musicData[h]['data'].length; i++){
                    let innerObject = {speed:'', notes:[]}
                    let scale = musicData[h]['data'][i]['data']['scaleData']['scale']
                    let sequence = scaleIntoScaleDisplayNotes(scale)
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'chordTones'){
                returnObject['displayOnly'] = true;
                for (let i = 0; i < musicData[h]['data'].length; i++){
                    let innerObject = {speed:'', notes:[]}
                    let chord = musicData[h]['data'][i]['data']['chordData']['chord']
                    let sequence = scaleIntoScaleDisplayNotes(chord)
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            }
            
        }
        return returnArr;
    }



function handleControls(type){
        controls.current = type;
        setActiveButton(type);
    }
//---------------------------------- DRAG AND DROP CONTROLS
const dragStartHandler = e => {
        const thisID = e.currentTarget.id.split('_')
        const instrumentID = thisID[2]
        const cardID = thisID[1]
        if (e.target.className === 'moduleData'){
            let obj = {id: e.currentTarget.id, className: e.target.className, message: 
                data[instrumentID]['data'][cardID], 
                type: 'player'}
            e.dataTransfer.setData('text', JSON.stringify(obj));
        } else {
            let obj = {id: e.currentTarget.id, className: e.target.className, message: 
                data[instrumentID]['data'][cardID]['data'][e.target.className], 
                type: 'player'}
            e.dataTransfer.setData('text', JSON.stringify(obj));
        }
        
    };

const dragHandler = e => {
    };

const dragOverHandler = e => {
        e.preventDefault();
    };

    //---------------------
const dropHandler = e => {
        e.preventDefault();

        var clone = JSON.parse(JSON.stringify(data))
        var xferData = JSON.parse(e.dataTransfer.getData("text"));
        var ex2 = e.currentTarget.id.split('_')
        var endIndex = Number(ex2[1])
        var endInstrument = Number(ex2[2])
        var message = xferData['message']
        var type = xferData['type']
        var className = xferData['className']
        //imported data
        if (type === 'moduleLab' || type === 'moduleExplorerExport' || type === 'modulePaletteExport'){
           clone[endInstrument]['data'][endIndex] = message
        } else if (type === 'player') {
        var ex1 = xferData['id'].split('_')
        var startIndex = Number(ex1[1])
        var startInstrument = Number(ex1[2])
        if (controls.current === 'replace'){
            if (className === 'moduleData'){
                if (titleLock){
                    clone[endInstrument]['data'][endIndex]['data'] = clone[startInstrument]['data'][startIndex]['data']
                }else {
                    clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                clone[endInstrument]['data'][endIndex]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className] 
            }
        } else if (controls.current === 'swap'){
            var placeholder;
            if (className === 'moduleData'){
                if (titleLock){
                    let endInstrumentName = clone[endInstrument]['data'][endIndex]['name']
                    let startInstrumentName = clone[startInstrument]['data'][startIndex]['name']
                    placeholder = clone[endInstrument]['data'][endIndex]
                    clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex];
                    clone[endInstrument]['data'][endIndex]['name'] = endInstrumentName
                    clone[startInstrument]['data'][startIndex] = placeholder
                    clone[startInstrument]['data'][startIndex]['name'] = startInstrumentName
                } else {
                    placeholder = clone[endInstrument]['data'][endIndex]
                    clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex];
                    clone[startInstrument]['data'][startIndex] = placeholder
                }
            } else {
                placeholder = clone[endInstrument]['data'][endIndex]['data'][className]
                clone[endInstrument]['data'][endIndex]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className];
                clone[startInstrument]['data'][startIndex]['data'][className] = placeholder;
            }
        } else if (controls.current === 'fill'){
            if (className === 'moduleData'){
                if (titleLock){
                    for (let i = endIndex; i < clone[endInstrument]['data'].length;i++){
                        clone[endInstrument]['data'][i]['data'] = clone[startInstrument]['data'][startIndex]['data']
                    }
                } else {
                    for (let i = endIndex; i < clone[endInstrument]['data'].length;i++){
                        clone[endInstrument]['data'][i] = clone[startInstrument]['data'][startIndex] 
                    }
                }
            } else {
                for (let j = endIndex; j < clone[endInstrument]['data'].length;j++){
                    clone[endInstrument]['data'][j]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className]
                }
            }
        } else if (controls.current === 'reverseFill'){
            if (className === 'moduleData'){
                if (titleLock){
                for (let k = endIndex; k > -1; k--){
                    clone[endInstrument]['data'][k]['data'] = clone[startInstrument]['data'][startIndex]['data']
                }
                }
                for (let k = endIndex; k > -1; k--){
                    clone[endInstrument]['data'][k] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                for (var l = endIndex; l > -1; l--){
                    clone[endInstrument]['data'][l]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className]
                }
            }
        } else if (controls.current === 'reOrder'){
            if (className === 'moduleData'){
            if (titleLock){
                let startingNames = [];
                for (let i = 0; i < clone[endInstrument]['data'].length; i++){
                    startingNames.push(clone[endInstrument]['data'][i]['name'])
                }
                let xfer;
                xfer = clone[startInstrument]['data'][startIndex]
                clone[startInstrument]['data'].splice(startIndex, 1)
                clone[endInstrument]['data'].splice(endIndex, 0, xfer)
                for (let j = 0; j < clone[endInstrument]['data'].length; j++){
                    clone[endInstrument]['data'][j]['name'] = startingNames[j]
                }
            } else {
                let xfer;
                xfer = clone[startInstrument]['data'][startIndex]
                clone[startInstrument]['data'].splice(startIndex, 1)
                clone[endInstrument]['data'].splice(endIndex, 0, xfer)
            }
            
            } else {
                return
            }
        }
        } else {
            clone[endInstrument]['data'][endIndex]['data'][className] = message;
        }
        
        setData(clone)
        e.dataTransfer.clearData()
    }

const dropHandlerBackground = e => {
    e.preventDefault();
    var xferData = JSON.parse(e.dataTransfer.getData("text"));
    var message = xferData['message']
    var type = xferData['type']

    if (type === 'songExplorerExport'){
        Tone.Transport.cancel();
        Tone.Transport.stop();
        dispatch(setSongImportData(message))
    } else {
        return
    }
}

function setRecommendedScaleAll(){
    
    var clone = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < clone[instrumentFocus]['data'].length; i++){
        const chord = clone[instrumentFocus]['data'][i]['data']['chordData']['chord']
        const key = clone[instrumentFocus]['data'][i]['data']['keyData']['root']
        let recScale = setRecommendedScale(chord, key)
        clone[instrumentFocus]['data'][i]['data']['scaleData'] = turnScaleNameIntoScaleData(recScale)
    }
    setData(clone)
}

const cardClickHandler = e => {
    var ex2 = e.currentTarget.id.split('_')
    var endIndex = Number(ex2[1])
    var endInstrument = Number(ex2[2])
    var clone = JSON.parse(JSON.stringify(data))

    Tone.Transport.position = markers[endInstrument][endIndex]

    if (controls.current === 'delete'){
        if (clone[endInstrument]['data'].length === 1){
            return
        } else {
            clone[endInstrument]['data'].splice(endIndex, 1)
        }
    } 
    if (controls.current === 'setScale'){
        const chord = clone[endInstrument]['data'][endIndex]['data']['chordData']['chord']
        const key = clone[endInstrument]['data'][endIndex]['data']['keyData']['root']
        let recScale = setRecommendedScale(chord, key)
        clone[endInstrument]['data'][endIndex]['data']['scaleData'] = turnScaleNameIntoScaleData(recScale)
    }
    highlight.current = true
    setData(clone)
    dispatch(setDisplayFocus('player'))
}

function moduleAdd(){
    var clone = JSON.parse(JSON.stringify(data))
    var lastModule = JSON.parse(JSON.stringify(clone[instrumentFocus]['data'][clone[instrumentFocus]['data'].length - 1]))
    lastModule['name'] = '' + (clone[instrumentFocus]['data'].length + 1)
    clone[instrumentFocus]['data'].push(lastModule)
    setData(clone)
}

function moduleSubtract(){
    var clone = JSON.parse(JSON.stringify(data))
    if (clone[instrumentFocus]['data'].length !== 1){
        clone[instrumentFocus]['data'].pop()
        setData(clone)
    } else {
        return
    }
}
    //MAP COMPONENTS

    function mapCards(cardData, instrument){
        return (
            cardData.map((cardData, idx) => 
            <DragAndFillCard
            onClick = {cardClickHandler}
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            dragOverHandler = {dragOverHandler}
            dropHandler = {dropHandler}
            id={'Cards_' + idx + '_' + instrument}
            key={'Cards_' + idx + '_' + instrument}
            idx={idx}
            instrument={instrument}
            hideModuleName = {hideModuleName}
            handleChangeModuleName = {handleChangeModuleName}
            currentlyPlaying = {currentlyPlaying.includes(idx + '_' + instrument)}
            moduleName={cardData.name}
            romanNumeralName={setRomanNumeralsByKey(cardData.data.chordData.chord, cardData.data.keyData.root)}
            chordName={cardData.data.chordData.chordName}
            chordPositionType={cardData.data.chordData.positionType}
            patternType={cardData.data.patternData.type}
            positionType={cardData.data.patternData.positionType}
            rhythmName={cardData.data.rhythmData.rhythmName}
            patternName={cardData.data.patternData.patternName}
            scaleName={cardData.data.scaleData.scaleName}
            countName={cardData.data.rhythmData.length}
            keyName={cardData.data.keyData.keyName}
            />
            )
        )
    }

    function superMapCards(){
        var returnArr = [];
        for (var i = 0; i < data.length; i++){
            returnArr.push(
                (instrumentFocus === i) && <div style={{display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap'}}>
                    {mapCards(data[i]['data'], i)}
                </div>
                )
        }
        return returnArr;
    }

    function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Button key={'instrumentSelect' + idx} active={instrumentFocus === idx} compact basic onClick ={() => handleSetInstrumentFocus(idx)}>{instrument}</Button>
            )
        )
}
    //--------SET INTERVAL WHICH CHECKS TO SEE WHAT MODULE IS PLAYING

    function setModuleMarkers(){
        var markers = [];
        const timeConstant = Tone.Time('4n').toSeconds()
        for (var i = 0; i < data.length; i++){
            var thisInstrumentMarkers = [0]
            var count = 0;
            for (var j = 0; j < data[i]['data'].length; j++){
                const moduleDuration = timeConstant * data[i]['data'][j]['data']['rhythmData']['length']
                thisInstrumentMarkers.push(moduleDuration + count)
                count += moduleDuration
            }
            markers.push(thisInstrumentMarkers)
        }
        markerValue.current = markers
        setMarkers(markers)
    }

    var currentlyPlayingValue = useRef([])
    let thisInterval = useRef([])

    useEffect(() => {
        thisInterval.current = setInterval(function checkCurrentTimeAndSetCurrentlyPlaying() {
         if (highlight.current) {
            let currentTime = Tone.Time(Tone.Transport.position).toSeconds()
            var playingArr = [];
            for (var i = 0; i < markerValue.current.length; i++){
                for (var j = 0; j < markerValue.current[i].length -1; j++){
                    if (currentTime < markerValue.current[i][j + 1] && currentTime >= markerValue.current[i][j]){
                        playingArr.push(j + '_' + i)
                        continue
                    }
                }
            }
            
            if (JSON.stringify(currentlyPlayingValue.current) === JSON.stringify(playingArr)){
                return
            } else {
                currentlyPlayingValue.current = playingArr
                setCurrentlyPlaying(playingArr)
            }
        } else {
            if (currentlyPlayingValue.current.length === 0){
                return
            }
            setCurrentlyPlaying([])
            currentlyPlayingValue.current = []
            return
        }
    }, 50)
      }, [])

function handleChangeMode(value){
        var clone = [...data]
        clone[instrumentFocus]['mode'] = value;
        setData(clone)
    }


function handleChangeModuleName(newName, instrument, index){
    var clone = JSON.parse(JSON.stringify(data))
    clone[instrument]['data'][index]['name'] = newName
    setData(clone) 
}

function handleUpdate(){
    var clone = [...data]
    var clonePrototype = {mode: 'off', data: data[mainModule]['data']}
    if (masterInstrumentArray.length === clone.length){
        return
    } else if (masterInstrumentArray.length > clone.length){
        clone.push(clonePrototype)
        setData(clone)
    } else if (masterInstrumentArray.length < clone.length){
        clone.pop()
        setData(clone)
        if (instrumentFocus > 0){
            setInstrumentFocus(instrumentFocus -1)
        }
        
    }
}

let exportObj = useRef({
    name: name,
    desc: description,
    bpm: Tone.Transport.bpm.value,
    author: user?.['name'],
    authorId: user?.['_id'],
    dataType: 'song',
    pool: exportPool,
    instruments: songInfo,
    data: data,
})

useEffect(() => {
    exportObj.current = {
    name: name,
    desc: description,
    bpm: Tone.Transport.bpm.value,
    author: user?.['name'],
    authorId: user?.['_id'],
    dataType: 'song',
    pool: exportPool,
    instruments: songInfo,
    data: data,
    }
}, [data, songInfo, exportPool, description, name, Tone.Transport.bpm.value])

const handleDescriptionChange = e => {
    setDescription(e.target.value)
}

function getNamesFromGlobalInstruments(globalInstruments){
    //only instruments labelled  chord or melody can pass through
    let returnArr = []
    for (let i = 0; i < masterInstrumentArray.length; i++){
        if (data[i]){
            if (data[i]['mode'] === 'chord' || data[i]['mode'] === 'melody'){
                returnArr.push(globalInstruments[i]['name'])
            }
        }
    }
    return returnArr
}


function getTuningsFromGlobalInstruments(globalInstruments){
    let returnArr = []
    for (let i = 0; i < masterInstrumentArray.length; i++){
        if (data[i]){
            if (data[i]['mode'] === 'chord' || data[i]['mode'] === 'melody'){
                returnArr.push(globalInstruments[i]['tuning'])
            }
        }
    }
    return returnArr
}

function removeSilentDataForTabProcessing(data){
    let returnArr = [];
    for (let i = 0; i < data.length; i++){
        if (data[i]['mode'] === 'melody' || data[i]['mode'] === 'chord'){
            returnArr.push(JSON.parse(JSON.stringify(data[i])))
        }
    }
    return returnArr
}

function convertToTab(){ 
    let tunings = getTuningsFromGlobalInstruments(globalInstruments)
    let instrumentNames = getNamesFromGlobalInstruments(globalInstruments)
    let cleanData = removeSilentDataForTabProcessing(data)
    let dataFromPlayer = convertModuleDataIntoPlayableSequence(cleanData, tunings, instrumentNames)
    let tab = generateTabFromModules(dataFromPlayer, tunings, instrumentNames, globalPosition, name, user?.['name'])
    return tab
}

function downloadAsMidi(){
    const playableSequence = convertModuleDataIntoPlayableSequence(data)
    const midi = turnPlayerDataIntoFullMidiSong(playableSequence)
    let blob = new Blob([midi.toArray()], {type: "audio/midi"});
    FileSaver.saveAs(blob, name + ".mid")
    console.log(midi)
}

    return (
        <>
        <div style={{display: display ? '' : 'none'}} onDrop={dropHandlerBackground} >
        <Menu>
        <Button.Group>
        {mapMenuItems()}
        </Button.Group>
        <Menu.Item basic active={mode} onClick={()=> setMode(!mode)}>Mode</Menu.Item>
        <Menu.Item basic active={edit} onClick={()=> setEdit(!edit)}>Edit</Menu.Item>
        <Dropdown
            simple
            item
            text='Options'
            >
        <Dropdown.Menu>
        <Dropdown.Item onClick={()=> setHideModuleName(!hideModuleName)}>{hideModuleName ? 'Show ' : 'Hide '} Module Names</Dropdown.Item> 
        <Dropdown.Item onClick={()=> setTitleLock(!titleLock)} > Name Position-Lock {titleLock ? 'On': 'Off'} </Dropdown.Item>    
         <Dropdown.Item onClick={()=> setDisplayLock(!displayLock)} > Link Display {displayLock ? 'On': 'Off'} </Dropdown.Item>        
        </Dropdown.Menu>
        </Dropdown>
        <Menu.Item basic active={showDescription} onClick={() => setShowDescription(!showDescription)}> Desc</Menu.Item>
        <Button.Group>
        <Button basic onClick={() => setOpened(true)}>Export</Button>
        </Button.Group>
        </Menu>
        <div>
        <h3 onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }} >{name}</h3>
        <Input type='text'
            value={name}
            id={'input_moduleLab'}
            ref={input => input && input.focus()}
            onInput={e => setName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_scaleLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        </div>
        {mode && <Button.Group>
            <Button active={data[instrumentFocus]['mode'] === 'off'} compact basic onClick={() => handleChangeMode('off')} >Off</Button>
            <Button active={data[instrumentFocus]['mode'] === 'melody'}  compact basic onClick={() => handleChangeMode('melody')}  >Melody</Button>
            <Button active={data[instrumentFocus]['mode'] === 'chord'}  compact basic  onClick={() => handleChangeMode('chord')} >Chord</Button>
            <Button active={data[instrumentFocus]['mode'] === 'scale'}  compact basic onClick={() => handleChangeMode('scale')}  >Display Scale</Button>
            <Button active={data[instrumentFocus]['mode'] === 'chordTones'}  compact basic onClick={() => handleChangeMode('chordTones')}  >Display Chord Tones</Button>
            </Button.Group>}
        {edit && <Button.Group>
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'reOrder'} compact basic onClick ={() => handleControls('reOrder')}>Reorder</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}><Icon name='angle left'/>Fill</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill<Icon name='angle right'/></Button>
            <Button active ={activeButton === 'delete'}compact basic onClick ={() => handleControls('delete')}>Delete</Button> 
            <Button compact basic onClick ={() => moduleSubtract()}>Module--</Button>
            <Button compact basic onClick ={() => moduleAdd()}>Module++</Button>
            <Button active={activeButton === 'setScale'} compact basic onClick={() => handleControls('setScale')}>Set Rec Scale</Button>
           {activeButton === 'setScale' && <Button compact basic onClick={() => setRecommendedScaleAll()}>All</Button>}
        </Button.Group>}
        <div id='instrumentDisplay'>
            {superMapCards()}
        </div>
        </div>
        <ExportModal
         dataType={'song'}
         exportObj={exportObj.current}
         opened={opened}
         setOpened={setOpened}
         changeParentName={setName}
         changeParentDesc={setDescription}
         />
        </>
    )
}
