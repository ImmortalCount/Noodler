import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Button, Dropdown, Menu, Icon} from 'semantic-ui-react';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import { initialData} from './dummyData';
import { playerDataPrototype } from './dataPrototypes';

export default function Player({masterInstrumentArray}) {
    const [sequence, setSequence] = useState(convertModuleDataIntoPlayableSequence(initialData))
    const [instrumentFocus, setInstrumentFocus] = useState(0);
    const [mainModule, setMainModule] = useState(0)
    const [playerData, setPlayerData] = useState([{mode: 'off', highlight: [], data: initialData, reserveData: []}])
    var [activeButton, setActiveButton] = useState('swap')
    var controls = useRef('swap')
    const dispatch = useDispatch();
    const {sendModuleData, receiveModuleData} = bindActionCreators(actionCreators, dispatch);

    useEffect (()=>{
        sendModuleData(JSON.stringify(convertModuleDataIntoPlayableSequence2(playerData))) 
    }, [playerData]);


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

    function convertModuleDataIntoPlayableSequence2(playerData){
        var returnArr = [];
        for (var h = 0; h < playerData.length; h++){
            var returnObject = 
            {displayOnly: true,
            highlight: [],
            data: []};
            if (playerData[h]['mode'] === 'melody' || playerData[h]['mode'] === 'chord'){
                returnObject['displayOnly'] = false;
                for (var i = 0; i < playerData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var rhythm = playerData[h]['data'][i]['rhythmData']['rhythm'];
                    var pattern = playerData[h]['data'][i]['patternData']['pattern']
                    var scale = playerData[h]['data'][i]['scaleData']['scale']
                    var notes = patternAndScaleToNotes(pattern, scale)
                    var sequence = notesIntoRhythm(notes, rhythm)
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (playerData[h]['mode'] === 'off'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < playerData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = handleOffMode();
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (playerData[h]['mode'] === 'scale'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < playerData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var scale = playerData[h]['data'][i]['scaleData']['scale']
                    var sequence = scaleIntoScaleDisplayNotes(scale)
                    innerObject['speed'] = '4n'
                    innerObject['notes'] = sequence
                    returnObject['data'].push(innerObject)
                    }
                returnArr.push(returnObject)
            } else if (playerData[h]['mode'] === 'chordTones'){
                returnObject['displayOnly'] = true;
                for (var i = 0; i < playerData[h]['data'].length; i++){
                    var innerObject = {speed:'', notes:[]}
                    var chord = playerData[h]['data'][i]['chordData']['chord']
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



function handleControls(type){
        controls.current = type;
        setActiveButton(type);
    }
    //----------------------------------
const dragStartHandler = e => {
        var obj = {id: e.currentTarget.id, className: e.target.className, message: 'local', type: 'local'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
    };

const dragHandler = e => {
    };

const dragOverHandler = e => {
        e.preventDefault();
    };

    //---------------------
const dropHandler = e => {
        e.preventDefault();
        var clone = JSON.parse(JSON.stringify(playerData))
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var ex2 = e.currentTarget.id.split('_')
        var endIndex = Number(ex2[1])
        var endInstrument = Number(ex2[2])
        var message = data['message']
        var type = data['type']
        var className = data['className']
        if (type === 'foreign'){
            clone[endInstrument]['data'][endIndex][className] = message;
        } else {
            var ex1 = data['id'].split('_')
        var startIndex = Number(ex1[1])
        var startInstrument = Number(ex1[2])

        if (controls.current === 'replace'){
            if (className === 'box'){
                clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex] 
            } else {
                clone[endInstrument]['data'][endIndex][className] = clone[startInstrument]['data'][startIndex][className] 
            }
        } else if (controls.current === 'swap'){
            var placeholder;
            if (className === 'box'){
                placeholder = clone[endInstrument]['data'][endIndex]
                clone[endInstrument]['data'][endIndex] = clone[startInstrument]['data'][startIndex];
                clone[startInstrument]['data'][startIndex] = placeholder
            } else {
                placeholder = clone[endInstrument]['data'][endIndex][className]
                clone[endInstrument]['data'][endIndex][className] = clone[startInstrument]['data'][startIndex][className];
                clone[startInstrument]['data'][startIndex][className] = placeholder;
            }
        } else if (controls.current === 'fill'){
            if (className === 'box'){
                for (var i = endIndex; i < clone[endInstrument]['data'].length;i++){
                    clone[endInstrument]['data'][i] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                for (var j = endIndex; j < clone[endInstrument]['data'].length;j++){
                    clone[endInstrument]['data'][j][className] = clone[startInstrument]['data'][startIndex][className]
                }
            }
        } else if (controls.current === 'reverseFill'){
            if (className === 'box'){
                for (var k = endIndex; k > -1; k--){
                    clone[endInstrument]['data'][k] = clone[startInstrument]['data'][startIndex] 
                }
            } else {
                for (var l = endIndex; l > -1; l--){
                    clone[endInstrument]['data'][l][className] = clone[startInstrument]['data'][startIndex][className]
                }
            }
        } else if (controls.current === 'reOrder'){
            if (className === 'box'){
            var xfer;
            xfer = clone[startInstrument]['data'][startIndex]
            clone[startInstrument]['data'].splice(startIndex, 1)
            clone[endInstrument]['data'].splice(endIndex, 0, xfer)
            } else {
                return
            }
        }
        }
        
        setPlayerData(clone)
        e.dataTransfer.clearData()
    }

    function mapCards(cardData, instrument){
        return (
            cardData.map((cardData, idx) => 
            <DragAndFillCard
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            dragOverHandler = {dragOverHandler}
            dropHandler = {dropHandler}
            id={'playerCards_' + idx + '_' + instrument}
            key={'playerCards_' + idx + '_' + instrument}
            romanNumeralName={setRomanNumeralsByKey(cardData.chordData.chord, cardData.keyData.root)}
            chordName={cardData.chordData.chordName}
            rhythmName={cardData.rhythmData.rhythmName}
            patternName={cardData.patternData.patternName}
            scaleName={cardData.scaleData.scaleName}
            countName={cardData.countData.countName}
            keyName={cardData.keyData.keyName}
            />
            )
        )
    }

    function superMapCards(){
        var returnArr = [];
        for (var i = 0; i < playerData.length; i++){
            returnArr.push(
                (instrumentFocus === i) && <div style={{display: 'flex', flexDirection: 'row'}}>
                    {mapCards(playerData[i]['data'], i)}
                </div>
                )
        }
        return returnArr;
    }

    const modeOptions = [
        {key: 'off', text: 'Mode: Off', value: 'off'},
        {key: 'melody', text: 'Mode: Melody', value: 'melody'},
        {key: 'chord', text: 'Mode: Chord', value: 'chord'},
        {key: 'scale', text: 'Mode: Display Scale', value: 'scale'},
        {key: 'chordTones', text: 'Mode: Display Chord Tones', value: 'chordTones'},
    ]

    const handleChangeMode = (e, {id, value}) => {
        var clone = [...playerData]
        var idx = Number(id.split("_")[1])
        clone[idx]['mode'] = value;
        if (value === 'melody'){
            console.log('changed to melody!')
        } else if (value === 'chord'){
            console.log('changed to chord!')
        }
        console.log(playerData[idx]['mode'])
        setPlayerData(clone)
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
                value = {playerData[idx]['mode']}
                key={idx}
                id = {'dropdown_' + idx}
                />
            )
            
        )
        )
    }

useEffect(() => {
    handlePlayerUpdate()
}, [masterInstrumentArray])

function handlePlayerUpdate(){
    var clone = [...playerData]
    var clonePrototype = {mode: 'off', data: playerData[mainModule]['data']}
    if (masterInstrumentArray.length === clone.length){
        return
    } else if (masterInstrumentArray.length > clone.length){
        clone.push(clonePrototype)
        setPlayerData(clone)
    } else if (masterInstrumentArray.length < clone.length){
        clone.pop()
        setPlayerData(clone)
        if (instrumentFocus > 0){
            setInstrumentFocus(instrumentFocus -1)
        }
        
    }
}
    return (
        <>
        <Menu>
        <Button.Group>
        {mapMenuItems()}
        </Button.Group>
        {mapDropdowns()}
        </Menu>
        <Button.Group>
            {/* <Button active ={activeButton === 'swap'}compact basic onClick ={() => console.log(convertModuleDataIntoPlayableSequence2(playerData))}>Test</Button> */}
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'reOrder'} compact basic onClick ={() => handleControls('reOrder')}>Reorder</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}><Icon name='angle left'/>Fill</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill<Icon name='angle right'/></Button>
            <Button active ={activeButton === 'clone'}compact basic onClick ={() => handleControls('clone')}>Clone</Button>
            <Button active ={activeButton === 'delete'}compact basic onClick ={() => handleControls('delete')}>Delete</Button>
        </Button.Group>
        <div id='instrumentDisplay' style={{display:'flex', flexDirection:'row'}}>
        <div>
            {superMapCards()}
        </div>
        </div>
        </>
    )
}
