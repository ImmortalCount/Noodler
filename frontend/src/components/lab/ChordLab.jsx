import {React, useState} from 'react'
import * as Tone from 'tone';
import {Scale, Chord, Note} from '@tonaljs/tonal';
import { Icon, Menu, Dropdown, Button } from 'semantic-ui-react';

export default function ChordLab() {
    const [chords, setChords] = useState([['C3', 'E3', 'G3']])
    const [noteOptions, setNoteOptions] = useState("octave")
    var allScaleNotes = [];
    var scaleNotes = Scale.get('c major').notes;
    var allChromaticNotes = [];
    var chromaticNotes = Scale.get('c chromatic').notes;

    for (var m = 0; m < 10; m++){
        for (var n = 0; n < scaleNotes.length; n++){
            allScaleNotes.push(scaleNotes[n] + m)
        }
    }

    for (var o = 0; o < 10; o++){
        for (var p = 0; p < chromaticNotes.length; p++){
            allChromaticNotes.push(chromaticNotes[p] + o)
        }
    }

    function generateChordStack(interval, stackHeight, root){
        var chordStack = [];

        if (interval === undefined){
            interval = 2;
        }
        if (stackHeight === undefined){
            stackHeight = 3;
        }

        if (root === undefined){
            root = 'C3';
        }

        var startingIndex = allScaleNotes.indexOf(root)
        for (var i = 0; i < scaleNotes.length; i++){
            var oneChord = [];
            for (var j = 0; j < stackHeight; j++){
                oneChord.push(allScaleNotes[startingIndex + i + (j * interval)])
            }
            chordStack.push(oneChord)
        }
        setChords(chordStack)
    }

    const synth = new Tone.PolySynth().toDestination();

    function playChords(notes){
        const now = Tone.now();
        for (var i = 0; i < notes.length; i++){
         synth.triggerAttackRelease(notes[i], '8n', now + (i * 0.5))
    }
}
//fix this thing in the morning, should make fifths
    function organizeChords(interval){
        var cloneChords = [...chords];
        if (interval === undefined){
            interval = 3;
        }
        var returnArr = [];
        var running = true;;
        var counter = 0;
        while (running === true){
            if (counter >= chords.length){
                counter -= chords.length;
            }
            if (cloneChords[counter] === undefined){
                running = false;
                break;
            }
                returnArr.push(cloneChords[counter])
                cloneChords[counter] = undefined;
                counter += interval;
            
        }
        setChords(returnArr);
    }

    var handleClickUp = (e) =>{
        var clone = [...chords]
        var positionObj = JSON.parse(e.currentTarget.parentNode.parentNode.id);
        var x = positionObj['chord'];
        var y = positionObj['position'];

        if (noteOptions === 'scaler'){
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
        setChords(clone)
        }
        if (noteOptions === 'octave'){
        var note = Note.pitchClass(chords[x][y])
        var octave = Note.octave(chords[x][y])
        clone[x][y] = note + (octave + 1)
        setChords(clone)
        }
        if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
        if (allChromaticNotes.indexOf(chords[x][y]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            clone[x].splice(y + 1, 0, chords[x][y]);
            setChords(clone)
            }
    }

    var handleClickDown = (e) =>{
        var clone = [...chords]
        var positionObj = JSON.parse(e.currentTarget.parentNode.parentNode.id);
        var x = positionObj['chord'];
        var y = positionObj['position'];

        if (noteOptions === 'scaler'){
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
        setChords(clone)
        }
        if (noteOptions === 'octave'){
        var note = Note.pitchClass(chords[x][y])
        var octave = Note.octave(chords[x][y])
        clone[x][y] = note + (octave - 1)
        setChords(clone)
        }
        if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
        if (allChromaticNotes.indexOf(chords[x][y]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
        setChords(clone)
        }
        if (noteOptions === 'insert'){
        clone[x].splice(y, 0, chords[x][y]);
        setChords(clone)
        }
    }

    var handleClickUpChord = (e) =>{
        var clone = [...chords]
        var x = e.currentTarget.parentNode.parentNode.id;

        if (noteOptions === 'scaler'){
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
        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave + 1)
            }
            setChords(clone)
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
            setChords(clone)
        }
    }

    var handleClickDownChord = (e) =>{
        var clone = [...chords]
        var x = e.currentTarget.parentNode.parentNode.id;

        if (noteOptions === 'scaler'){
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
        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave - 1)
            }
            setChords(clone)
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
            setChords(clone)
        }
    }

    const handleDeleteNote = (e) =>{
        var clone = [...chords]
        var positionObj = JSON.parse(e.currentTarget.parentNode.id);
        var x = positionObj['chord'];
        var y = positionObj['position'];
        clone[x].splice(y, 1)
        setChords(clone)
    }

    const handleDeleteChord =(e) => {
        var clone = [...chords]
        var x = e.currentTarget.parentNode.id;
        clone.splice(x, 1)
        setChords(clone);
    }

    var handlePlayThis = (e) => {
        var x = Number(e.currentTarget.parentNode.id);
        synth.triggerAttackRelease(chords[x], '8n');
    }

    function mapChords(){
        var returnArr = [];
        for (var i = 0; i < chords.length; i++){
            var returnChord = [];
            var pitchClasses = [];
            for (var j = 0; j < chords[i].length; j++){
                pitchClasses.push(Note.pitchClass(chords[i][j]))
                returnChord.push(
                    <div id={JSON.stringify({chord: i, position: j})} style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                        {chords[i][j]}
                        { (noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Icon onClick={handleClickUp} name="caret square up"/><Icon onClick={handleClickDown}name="caret square down"/>
                        </div>}
                        {(noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                    </div>
                )
            }
            returnArr.push(
                <div  draggable='true' style={{display: 'flex', flexDirection: 'column-reverse', margin: '5px'}}>
                <div id={i} style={{display: 'flex', flexDirection: 'row'}}>
                <Icon onClick={handlePlayThis} name="play"/>
                { (noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
                <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "caret square left" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "caret square right" : "caret square down" }/>
                </div>}
                {(noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
                </div>
                
                {returnChord} 
                {Chord.detect(pitchClasses)[0]}</div>
            )
        }
        return returnArr;
    }

    
    //---Generate Options:
    //---*Stack Selection
    //---*Generate From Scale (Modal Popup)
    //---*Generate From Pattern (Modal Popup)

    //---Export Options:
    //---*Map Chords to Player
    //------All
    //------Choose
    //---*Export Chords to Palette
    //---*Export Chords as Chord Groups
    //---*Choose chords to Export
    //---*Export Locally or Globally
    //----Options
    //----*Show Controls
    //----*Show Controls
    //----*Show Controls
    //----Map
    //----MAKE DRAG AND DROPPING MOVING DEFAULT!!!

    return (
        <>
        <Menu>
         <Menu.Item> Play </Menu.Item>   
         <Menu.Item onClick={()=> generateChordStack(2,3)}> Generate </Menu.Item>   
         <Menu.Item> Edit </Menu.Item>   
         <Menu.Item> Options </Menu.Item>   
         <Menu.Item> Map </Menu.Item>   
         <Menu.Item> Export </Menu.Item>   
        </Menu>
        <Button.Group>
            <Button basic onClick={() => setNoteOptions('octave')}>Octave</Button>
            <Button basic onClick={() => setNoteOptions('scaler')}>Scale</Button>
            <Button basic onClick={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button basic onClick={() => setNoteOptions('insert')}>Insert</Button>
            <Button basic onClick={() => setNoteOptions('delete')}>Delete</Button>
        </Button.Group>
        <div>
            <h3>Current Chord</h3>
        </div> 
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mapChords()}
        </div>
        <div>
            <h3>Export</h3>
            <div draggable='true' style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>C Maj</div>
        </div>
        {/* <button onClick={()=> organizeChords()}>Organize Chords</button>
        <button onClick={()=> playChords(chords)}>Play</button>
        <button onClick={()=> console.log(Chord.detect(['D', 'F', 'A']))}>Detect 'em</button>
        <button onClick={()=> generateChordStack(2,3)}>Generate Chord Stack</button>
        <button> Edit on </button>
        <button> Edit off</button>
        <button>map chords to song</button>
        <button> mutate chords to fit scale</button>
        <div>
            <h3>Note Editing Controls</h3>
            <button onClick={() => setNoteOptions('octave')}>Change by Octave</button>
            <button onClick={() => setNoteOptions('scaler')}>Change by Scale Tone</button>
            <button onClick={() => setNoteOptions('chromatic')}>Change by Chromatic Tone</button>
            <button onClick={() => setNoteOptions('insert')}>Insert</button>
            <button onClick={() => setNoteOptions('delete')}>Delete</button>
        </div>
        <div>
            <h3>Chord Editing Controls</h3>
            <button>Insert Chord</button>
            <button>Arrange Chords</button>
        </div>
        <div>
            <h3>Export</h3>
            <button>Map Chords to Progression</button>
            <button>Save Chords as Chord Bundle</button>
            <button>Save Chord as Chord Module</button>
        </div> */}
        </>
    ) 
}
