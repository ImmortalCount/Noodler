import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Button, Dropdown, Menu, Icon} from 'semantic-ui-react';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import { initialData, initialDataType2} from './dummyData';
import { DataPrototype } from './dataPrototypes';
import * as Tone from 'tone';
import { insertData } from '../../store/actions/dataPoolActions';
import { setSongImportData } from '../../store/actions/songImportDataActions';

export default function Player ({masterInstrumentArray}) {
    const [instrumentFocus, setInstrumentFocus] = useState(0);
    const [mainModule, setMainModule] = useState(0)
    const [data, setData] = useState([{mode: 'melody', highlight: [], data: initialDataType2}])
    const [markers, setMarkers] = useState([])
    var markerValue = useRef([])
    const [currentlyPlaying, setCurrentlyPlaying] = useState([])
    var [activeButton, setActiveButton] = useState('swap')
    const [name, setName] = useState('Song Name: Demo 1')
    var controls = useRef('swap')
    const dispatch = useDispatch();

    const songData = useSelector(state => state.songData)
    const {songInfo} = songData

    const songImportData = useSelector(state => state.songImport)
    const {songImport} = songImportData

    const {sendModuleData, receiveModuleData} = bindActionCreators(actionCreators, dispatch);

    useEffect (()=>{
        sendModuleData(JSON.stringify(convertModuleDataIntoPlayableSequence3(data))) 
        setModuleMarkers()
    }, [data]);

    useEffect(() => {
        if (songImport){
            setData(songImport['data'])
        } else {
            return
        }
    }, [songImport])



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

function convertModuleDataIntoPlayableSequence(data){
        var returnObject = 
        {displayOnly: false,
        highlight: [],
        data: []};

        for (var i = 0; i < data.length; i++){
        var innerObject = {speed:'', notes:[]}
        var rhythm = data[i]['rhythmData']['rhythm'];
        var pattern = data[i]['patternData']['pattern']
        var scale = data[i]['scaleData']['scale']
        var notes = patternAndScaleToNotes(pattern, scale)
        var sequence = notesIntoRhythm(notes, rhythm)
        
        innerObject['speed'] = '4n'
        innerObject['notes'] = sequence
        returnObject['data'].push(innerObject)
        }
        
        return [returnObject];
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

function convertModuleDataIntoPlayableSequence2(musicData){
        var returnArr = [];
        for (var h = 0; h < musicData.length; h++){
            var returnObject = 
            {displayOnly: true,
            highlight: [],
            data: []};
            if (musicData[h]['mode'] === 'melody' || musicData[h]['mode'] === 'chord'){
                returnObject['displayOnly'] = false;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var rhythm = musicData[h]['data'][i]['rhythmData']['rhythm'];
                    var pattern = musicData[h]['data'][i]['patternData']['pattern']
                    var scale = musicData[h]['data'][i]['scaleData']['scale']
                    var notes = patternAndScaleToNotes(pattern, scale)
                    var sequence = notesIntoRhythm(notes, rhythm)
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'off'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = handleOffMode();
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'scale'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var scale = musicData[h]['data'][i]['scaleData']['scale']
                    var sequence = scaleIntoScaleDisplayNotes(scale)
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'chordTones'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var chord = musicData[h]['data'][i]['chordData']['chord']
                    var sequence = scaleIntoScaleDisplayNotes(chord)
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            }
            
        }
        return returnArr;
    }

function convertModuleDataIntoPlayableSequence3(musicData){
        var returnArr = [];
        for (var h = 0; h < musicData.length; h++){
            var returnObject = 
            {displayOnly: true,
            highlight: [],
            data: []};
            if (musicData[h]['mode'] === 'melody' || musicData[h]['mode'] === 'chord'){
                returnObject['displayOnly'] = false;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:1, notes:[]}
                    var rhythm = musicData[h]['data'][i]['data']['rhythmData']['rhythm'];
                    var pattern = musicData[h]['data'][i]['data']['patternData']['pattern']
                    var scale = musicData[h]['data'][i]['data']['scaleData']['scale']
                    var notes = patternAndScaleToNotes(pattern, scale)
                    var sequence = notesIntoRhythm(notes, rhythm)
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'off'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = handleOffMode();
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'scale'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var scale = musicData[h]['data'][i]['data']['scaleData']['scale']
                    var sequence = scaleIntoScaleDisplayNotes(scale)
                    innerObject['speed'] = musicData[h]['data'][i]['data']['rhythmData']['speed']
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (musicData[h]['mode'] === 'chordTones'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < musicData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var chord = musicData[h]['data'][i]['data']['chordData']['chord']
                    var sequence = scaleIntoScaleDisplayNotes(chord)
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
            var obj = {id: e.currentTarget.id, className: e.target.className, message: 
                data[instrumentID]['data'][cardID], 
                type: 'player'}
            console.log(obj)
            e.dataTransfer.setData('text', JSON.stringify(obj));
        } else {
            var obj = {id: e.currentTarget.id, className: e.target.className, message: 
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
        //moduleExplorerExport or moduleLab
        if (type === 'moduleLab' || type === 'moduleExplorerExport'){
           clone[endInstrument]['data'][endIndex] = message
        } else if (type === 'player') {
        var ex1 = xferData['id'].split('_')
        var startIndex = Number(ex1[1])
        var startInstrument = Number(ex1[2])
        if (controls.current === 'replace'){
            if (className === 'moduleData'){
                clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex] 
            } else {
                clone[endInstrument]['data'][endIndex]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className] 
            }
        } else if (controls.current === 'swap'){
            var placeholder;
            if (className === 'moduleData'){
                placeholder = clone[endInstrument]['data'][endIndex]
                clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex];
                clone[startInstrument]['data'][startIndex] = placeholder
            } else {
                placeholder = clone[endInstrument]['data'][endIndex]['data'][className]
                clone[endInstrument]['data'][endIndex]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className];
                clone[startInstrument]['data'][startIndex]['data'][className] = placeholder;
            }
        } else if (controls.current === 'fill'){
            if (className === 'moduleData'){
                for (var i = endIndex; i < clone[endInstrument]['data'].length;i++){
                    clone[endInstrument]['data'][i] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                for (var j = endIndex; j < clone[endInstrument]['data'].length;j++){
                    clone[endInstrument]['data'][j]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className]
                }
            }
        } else if (controls.current === 'reverseFill'){
            if (className === 'moduleData'){
                for (var k = endIndex; k > -1; k--){
                    clone[endInstrument]['data'][k] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                for (var l = endIndex; l > -1; l--){
                    clone[endInstrument]['data'][l]['data'][className] = clone[startInstrument]['data'][startIndex]['data'][className]
                }
            }
        } else if (controls.current === 'reOrder'){
            if (className === 'moduleData'){
            var xfer;
            xfer = clone[startInstrument]['data'][startIndex]
            clone[startInstrument]['data'].splice(startIndex, 1)
            clone[endInstrument]['data'].splice(endIndex, 0, xfer)
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
    var clone = JSON.parse(JSON.stringify(data))
    var xferData = JSON.parse(e.dataTransfer.getData("text"));
    var ex2 = e.currentTarget.id.split('_')
    var endIndex = Number(ex2[1])
    var endInstrument = Number(ex2[2])
    var message = xferData['message']
    var type = xferData['type']
    var className = xferData['className']

    if (type === 'songExplorerExport'){
        dispatch(setSongImportData(message))
    } else {
        return
    }
}

const cardClickHandler = e => {
    if (controls.current === 'delete'){
        var clone = JSON.parse(JSON.stringify(data))
        var ex2 = e.currentTarget.id.split('_')
        var endIndex = Number(ex2[1])
        var endInstrument = Number(ex2[2])
        if (clone[endInstrument]['data'].length === 1){
            return
        } else {
            clone[endInstrument]['data'].splice(endIndex, 1)
        setData(clone)
        }
    }
}

function moduleAdd(){
    var clone = JSON.parse(JSON.stringify(data))
    var lastModule = clone[instrumentFocus]['data'][clone[instrumentFocus]['data'].length - 1]
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

    //----------------------------------MAP COMPONENTS

    function mapCards(cardData, instrument){
        console.log('rerendered!!!')
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
            currentlyPlaying = {currentlyPlaying.includes(idx + '_' + instrument)}
            moduleName={cardData.name}
            romanNumeralName={setRomanNumeralsByKey(cardData.data.chordData.chord, cardData.data.keyData.root)}
            chordName={cardData.data.chordData.chordName}
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
                (instrumentFocus === i) && <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                    {mapCards(data[i]['data'], i)}
                </div>
                )
        }
        return returnArr;
    }

    function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Button key={'instrumentSelect' + idx} active={instrumentFocus === idx} compact basic onClick ={() => setInstrumentFocus(idx)}>{instrument}</Button>
            )
        )
}
    function mapDropdowns(){
        return (
        masterInstrumentArray.map((instrument, idx) =>
        (instrumentFocus === idx && <Dropdown
                selection
                onChange={handleChangeMode}
                options={modeOptions}
                value = {data[idx]['mode']}
                key={idx}
                id = {'dropdown_' + idx}
                />
            )
            
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
                const moduleDuration = timeConstant * data[i]['data'][j]['data']['rhythmData']['speed'] * data[i]['data'][j]['data']['rhythmData']['length']
                thisInstrumentMarkers.push(moduleDuration + count)
                count += moduleDuration
            }
            markers.push(thisInstrumentMarkers)
        }
        markerValue.current = markers
        setMarkers(markers)
    }

    function checkCurrentTimeAndSetCurrentlyPlaying() {
        let currentTime = Tone.Time(Tone.Transport.position).toSeconds()
        let state = Tone.Transport.state
        if (state === 'stopped' && currentlyPlaying.length !== 0){
            setCurrentlyPlaying([])
            return
        } else if (state !== 'stopped'){
            var playingArr = [];
            for (var i = 0; i < markers.length; i++){
                for (var j = 0; j < markers[i].length -1; j++){
                    if (currentTime < markers[i][j + 1] && currentTime >= markers[i][j]){
                        playingArr.push(j + '_' + i)
                        continue
                    }
                }
            }
            if (JSON.stringify(currentlyPlaying) === JSON.stringify(playingArr)){
                return
            } else {
                setCurrentlyPlaying(playingArr)
            }
        } else {
            return
        }
    }
    var currentlyPlayingValue = useRef([])

    useEffect(() => {
        const thisInterval = setInterval(function checkCurrentTimeAndSetCurrentlyPlaying() {
            let state = Tone.Transport.state
        if (state === 'stopped' && currentlyPlayingValue.current.length !== 0){
            setCurrentlyPlaying([])
            currentlyPlayingValue.current = []
            return
        } else if (state !== 'stopped'){
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
            return
        }
    }, 100)
        return () => {
          clearInterval(thisInterval);
        };
      }, [])

    


    //-----------------------------------
    const modeOptions = [
        {key: 'off', text: 'Mode: Off', value: 'off'},
        {key: 'melody', text: 'Mode: Melody', value: 'melody'},
        {key: 'chord', text: 'Mode: Chord', value: 'chord'},
        {key: 'scale', text: 'Mode: Display Scale', value: 'scale'},
        {key: 'chordTones', text: 'Mode: Display Chord Tones', value: 'chordTones'},
    ]

    const handleChangeMode = (e, {id, value}) => {
        var clone = [...data]
        var idx = Number(id.split("_")[1])
        clone[idx]['mode'] = value;
        if (value === 'melody'){
            console.log('changed to melody!')
        } else if (value === 'chord'){
            console.log('changed to chord!')
        }
        console.log(data[idx]['mode'])
        setData(clone)
    }



useEffect(() => {
    handleUpdate()
}, [masterInstrumentArray])

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

function handleExport(){
    const songDataPrototype = {
        name: 'songExport: Test all Dm',
        desc: 'All Dm chords',
        author: 'Noodleman0',
        authorId: 'Noodleman0_Id',
        dataType: 'song',
        pool: 'global',
        instruments: songInfo,
        data: data,
    }
    dispatch(insertData(songDataPrototype))
}

    return (
        <>
        <div onDrop={dropHandlerBackground}>
        <Menu>
        <Button.Group>
        {mapMenuItems()}
        </Button.Group>
        {mapDropdowns()}
        <Button basic onClick={() => handleExport()}>Export</Button>
        <Button basic onClick={() => console.log(songInfo, 'checked')}>Check Songdata</Button>
        </Menu>
        <h3>Song Name: Demo 1</h3>
        <Button.Group>
            {/* <Button active ={activeButton === 'swap'}compact basic onClick ={() => console.log(convertModuleDataIntoPlayableSequence2(Data))}>Test</Button> */}
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'reOrder'} compact basic onClick ={() => handleControls('reOrder')}>Reorder</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}><Icon name='angle left'/>Fill</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill<Icon name='angle right'/></Button>
            <Button active ={activeButton === 'delete'}compact basic onClick ={() => handleControls('delete')}>Delete</Button> 
            <Button compact basic onClick ={() => moduleSubtract()}>Module--</Button>
            <Button compact basic onClick ={() => moduleAdd()}>Module++</Button>
        </Button.Group>
        <div id='instrumentDisplay'>
            {superMapCards()}
        </div>
        </div>
        
        </>
    )
}
