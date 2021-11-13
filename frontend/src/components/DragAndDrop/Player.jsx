import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Button, Dropdown, Menu} from 'semantic-ui-react';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import { initialData, initialData4 } from './dummyData';
import { cardDataPrototype } from './cardDataPrototype';
// import * as Tone from 'tone';


export default function Player({masterInstrumentArray}) {
    var [cardData, setCardData] = useState(initialData);
    const [sequence, setSequence] = useState(convertModuleDataIntoPlayableSequence(initialData))
    const [instrumentFocus, setInstrumentFocus] = useState(0);
    const [playerData, setPlayerData] = useState({mode: 'melody', data: initialData})
    var controls = useRef('swap')
    const dispatch = useDispatch();
    const {sendModuleData, receiveModuleData} = bindActionCreators(actionCreators, dispatch);

    useEffect (()=>{
        sendModuleData(JSON.stringify(sequence)) 
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
        var clone = JSON.parse(JSON.stringify(cardDataPrototype))
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


    const modeOptions = [
        {key: 'off', text: 'Mode: Off', value: 'off'},
        {key: 'melody', text: 'Mode: Melody', value: 'melody'},
        {key: 'chord', text: 'Mode: Chord', value: 'chord'},
        {key: 'scale', text: 'Mode: Display Scale', value: 'scale'},
        {key: 'chordTones', text: 'Mode: Display Chord Tones', value: 'chordTones'},
    ]

    const handleChangeMode = (e, {value}) => {
        // setMode(value)

        // if (value === 'melody'){
        //     setCardData(melodyModeData)
        //     setSequence(convertModuleDataIntoPlayableSequence(melodyModeData))
        //     setMappedCards((mapCards(melodyModeData)))
        // }
        // if (value === 'chord'){
        //     setCardData(chordModeData)
        //     setSequence(convertModuleDataIntoPlayableSequence(chordModeData))
        //     setMappedCards((mapCards(chordModeData)))
        // }
        console.log(value)

    }

    function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Button key={'instrumentSelect' + idx} active={instrumentFocus === idx} compact basic onClick ={() => setInstrumentFocus(idx)}>{instrument}</Button>
            )
        )
}
function handlePlayerUpdate(){
    // var clone = [...instruments]
    // var clonePrototype = JSON.parse(JSON.stringify(guitarPrototype))
    // if (masterInstrumentArray.length === instruments.length){
    //     return
    // } else if (masterInstrumentArray.length > instruments.length){
    //     clone.push(clonePrototype)
    //     console.log(clonePrototype, '!?!?!?!?!?')
    //     setInstruments(clone)
    // } else if (masterInstrumentArray.length < instruments.length){
    //     clone.pop()
    //     setInstruments(clone)
    // }
}
    
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
        <Menu>
        <Button.Group>
        {mapMenuItems()}
        </Button.Group>
        <Dropdown
        selection
        onChange={handleChangeMode}
        options={modeOptions}
        defaultValue='melody'
        />
        </Menu>
        
        <Button.Group>
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}>Reverse Fill</Button>
            <Button active ={activeButton === 'reOrder'} compact basic onClick ={() => handleControls('swap')}>Reorder</Button>
        </Button.Group>
        
        {/* <Button compact basic >Link: On</Button>
        <Button compact basic >Global Key: C Major</Button>
        <Button compact basic >BPM: 150</Button>
        <Button compact basic >Scale: Adapt</Button>
        <Button compact basic >MASTER</Button> */}
        {/* <Button compact basic onClick={() => console.log(cardData)} >CardData?</Button> */}
        <div id='instrumentDisplay' style={{display:'flex', flexDirection:'row'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
        </div>
        </div>
        </>
    )
}
