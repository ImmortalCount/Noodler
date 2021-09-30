import React, { useState, useEffect, useRef} from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Icon, Button, Segment, Form} from 'semantic-ui-react';
import { Note, Scale} from '@tonaljs/tonal';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/index.js';
import * as Tone from 'tone';
// import * as Tone from 'tone';

export default function DragAndFillProper() {
    const synth = new Tone.Synth().toDestination(); 
    const [sequence, setSequence] = useState([])

    const state = useSelector((state) => state.module);

    const dispatch = useDispatch();

    const {sendModuleData, receiveModuleData} = bindActionCreators(actionCreators, dispatch);


    useEffect (()=>{
        setSequence(convertModuleDataIntoPlayableSequence(initialData));
    }, []);

    const initialData = [
        {
            chordData: {
                chordName: 'Cmaj',
                chord: ['C4', 'E4', 'G4'],
            },
            rhythmData: {
                rhythmName: 'Default: Str 8s',
                rhythm: [['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3']],
            },
            patternData: {
                patternName: 'Pattern: Arp-Scale Run',
                pattern: [0, 1, 2, 11, 7, 6, 4, 5],
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
                chord: ['D4', 'F4', 'A4'],
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
                chord: ['E4', 'G4', 'B4'],
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
        },
    ];
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

    //generate notes from patternData using scaleData
    function patternAndScaleToNotes(pattern, scale, root){
        var allNotes = [];
        var allChromaticNotes = [];
        var chromaticScale = Scale.get('c chromatic').notes
        var notesExport = [];
        if (root === undefined){
            root = scale[0] + 4;
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
            
            if (typeof pattern[k] === 'string'){
                notesExport.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k].split("").slice(1).join(""))])
            } else {
                notesExport.push(allNotes[startingIndex + pattern[k]])
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
          synthPart.start();
          synthPart.loop = 1;
    
            

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
            chordName={cardData.chordData.chordName}
            rhythmName={cardData.rhythmData.rhythmName}
            patternName={cardData.patternData.patternName}
            scaleName={cardData.scaleData.scaleName}
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
            <Button active ={activeButton === 'swap'}compact basic onClick ={() => handleControls('swap')}>Swap</Button>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() => handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'fill'} compact basic onClick ={() =>handleControls('fill')}>Fill</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('reverseFill')}>Reverse Fill</Button>
            <Button active ={activeButton === 'reverseFill'} compact basic onClick ={() => handleControls('swap')}>Reorder</Button>
        </Button.Group>
        <Button.Group>
            <Button compact basic> <Icon name ='left arrow'/></Button>
            <Segment>
            Focus
            </Segment>
            <Button compact basic> <Icon name ='right arrow'/></Button>
        </Button.Group>
        <Button compact basic onClick={() => (synthPart.dispose(), Tone.Transport.pause())}><Icon name='stop'/></Button>
        <Button compact basic onClick={() => (Tone.Transport.start())}><Icon name='play'/></Button>
        <Button compact basic > Edit</Button>
        <Button compact basic > Save</Button>
        <Button compact basic onClick={() => sendModuleData(JSON.stringify(convertModuleDataIntoPlayableSequence(cardData)))}>sendData</Button>
        <div>Key: C</div>
        <div>Bpm: 120</div>
        {/* <Form.Input
        min={20}
        max={500}
        name='bpm'
        onChange=''
        step={1}
        type='range'
        value={''}
        /> */}
        <div style={{textAlign: 'center'}}>
            <h3>Verse 1</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
            {/* <button onClick = {() => console.log(cardData)}>print cardData</button> */}
            <div className='box' style={{textAlign: 'center', paddingTop:'35px'}}> X2 </div>
        </div>
        <div style={{textAlign: 'center'}} className='ui divider'>
            <Icon name='plus circle'></Icon>
        </div>
        <div style={{textAlign: 'center'}}>
            <h3>Chorus</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
        </div>
        <div className='ui divider'/>
        {/* <div className='controls'>  Controls   </div>
        <div>
            <button>Recommended Scale On/Off</button>
            <button onClick={() => Tone.start()}>Initialize</button>
            <button onClick={() => (Tone.Transport.start())}>start </button>
            <button onClick={() => (synthPart.dispose(), Tone.Transport.pause())}>pause </button>
            <button onClick={() => Tone.Transport.stop()}>reset </button>
        </div>
        <div>
            <button>Focus</button>
            <button>Edit On Click</button>
            <button>Advance Edit</button>
            <button>Play on Click</button>
            <button>Mute </button>
            <button>Loop options = x0 - x99, xInfinity, skip</button>
            <button>Show Loop Options</button>
            <button onClick={() => console.log(convertModuleDataIntoPlayableSequence(cardData))}> test</button>
            <button onClick={() => console.log(sequence)}> test sequence</button>
            <button onClick={() => console.log(cardData)}> data</button>
            <button onClick={() => console.log(controls.current)}> refControls?</button>
        </div>
        <div>
            <button onClick={addBox}>Add Box</button>
            <button onClick={removeBox}>Remove Box</button>
        </div> */}
        </>
    )
}
