import {React, useState, useEffect} from 'react'
import * as Tone from 'tone';
import {Scale, Chord, Note} from '@tonaljs/tonal';
import { Icon, Menu, Dropdown, Button, Input } from 'semantic-ui-react';

export default function ChordLab({importedChordData}) {
    const [chords, setChords] = useState([['C3', 'E3', 'G3']])
    const [noteOptions, setNoteOptions] = useState("octave")
    const [generateChordOptions, setGenerateChordOptions] = useState({intervals: 3, number: 3, root: 'C3'})
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

    function generateChordStack(){
        var chordStack = [];
            var interval = generateChordOptions['intervals'];
            var stackHeight = generateChordOptions['number'];
            var root = generateChordOptions['root'];
        var startingIndex = allScaleNotes.indexOf(root)
        for (var i = 0; i < scaleNotes.length; i++){
            var oneChord = [];
            for (var j = 0; j < stackHeight; j++){
                oneChord.push(allScaleNotes[startingIndex + i + (j * (interval - 1))])
            }
            chordStack.push(oneChord)
        }
        setChords(chordStack)
    }

    useEffect(() => {
        if (importedChordData['chord'] !== undefined){
            setChords([importedChordData['chord']])
        }
        
    }, [importedChordData])

    var testSeq1 = ['C3', 'E3' ,'G3' ,'D4']
    var testChords1 = [['C3', 'E3', 'G3', 'A3'], ['F3', 'A3', 'B3'], ['D3', 'F3', 'A3'], ['G3', 'B3', 'E3']]
    //Might need this
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

    

    const synth = new Tone.PolySynth().toDestination();

    function playChords(){
        Tone.Transport.start();
        const convertedChords = chordSequenceToNoteString(chords)
        var count = 0;
        const synthPart = new Tone.Sequence(
            function(time, note) {
              synth.triggerAttackRelease(noteStringHandler(note), "10hz", time)
              var highlightedChord = document.getElementById('chord_' + count)
                highlightedChord.className = 'active chord'
                setTimeout(() => {highlightedChord.className = 'inactive chord'}, 500)
                count++
            },
           convertedChords,
            "4n"
          );
          synthPart.start();
          synthPart.loop = 1;
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
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]

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

    ///TEST

    var handleClickDownChord = (e) =>{
        var clone = [...chords]
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]

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
        var parentID = e.currentTarget.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        clone.splice(x, 1)
        setChords(clone);
    }

    var handlePlayThis = (e) => {
        var parentID = e.currentTarget.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        console.log(parentID)
        synth.triggerAttackRelease(chords[x], '8n');
        var thisChord = document.getElementById(parentID)
        thisChord.className = 'active chord'
        setTimeout(() => {thisChord.className ='inactive chord'}, 250)
        
    }

    //==========
    function changePositionsUsingIDs(startingID, endingID){
    var xfer;
    var clone = [...chords]
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
    setChords(clone)
    
}

    //=================================
    function getAllParentElementsByID(id){
        var a = document.getElementById(id)
        var els = [];
        while (a){
            els.unshift(a);
            a = a.parentNode
        }
        var classIDs = [];
        for (var i = 0; i < els.length; i++){
            if (els[i].id !== undefined && els[i].id.length !== 0 && els[i].id !== 'root'){
                classIDs.push(els[i])
            }
        }
        return classIDs;
    }
    //=======Drag and drop functionality
    const dragStartHandler = e => {
        var idx = Number(e.target.id.split('_')[1])
        var obj = {id: e.target.id, className: 'chordData', message: {
            chordName: Chord.detect(chords[idx])[0],
            chord: chords[idx],
            position: []
        }, type: 'foreign'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
    };

    const dragStartHandlerSpecial = e => {
        var idx = 0
        var obj = {id: 'special', className: 'chordData', message: {
            chordName: Chord.detect(chords[idx])[0],
            chord: chords[idx],
            position: []
        }, type: 'foreign'}
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
        if (data['id'] === 'special'){
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

    const clickHandler = e => {
        var childNodes = e.target.childNodes
        var returnArr = []
        for (var i = 0; i < childNodes.length; i++){
            returnArr.push(childNodes)
        }
        // console.log(returnArr, 'returnArr')
        // console.log(e.target.id, 'e.target')
        // console.log(e.currentTarget.id, 'e.currentTarget')
    }

    //==========================================

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
                <div  id={'chord_' + i} onClick={clickHandler} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '5px'}}>
                <div  style={{display: 'flex', flexDirection: 'row'}}>
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
    //----Options Play on change

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

    const handleGenerateChordDropdownOptions = (e, {value}) => {
        'generateChordIntervalRange'
        'generateChordNoteNumber'
        console.log(e.target.id, value)
        var clone = JSON.parse(JSON.stringify(generateChordOptions))
        var thisID = e.target.id;
        if (thisID === 'generateChordIntervalRange'){
            clone['intervals'] = value;
        } else if (thisID === 'generateChordNoteNumber'){
            clone['number'] = value;
        }

        setGenerateChordOptions(clone)

    }

    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playChords()}> Play </Menu.Item>   
         <Menu.Item onClick={()=> generateChordStack(2,3)}> Generate </Menu.Item>   
         <Dropdown
          simple
          item
          className='button icon'
        >
         <Dropdown.Menu>
             <Dropdown.Item> Character
                <Dropdown.Menu>
                <Dropdown.Item>
                intervals:
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
                # of notes:
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
             </Dropdown.Item>
             <Dropdown.Item> Progression
                <Dropdown.Menu>
                <Dropdown.Item>ALL</Dropdown.Item>
                <Dropdown.Item>I IV VII III VI II V</Dropdown.Item>
                <Dropdown.Item>I V II VI II VII IV</Dropdown.Item>
                <Dropdown.Item>II V I IV VII III VI</Dropdown.Item>
                <Dropdown.Item>I IV VII III VI V II</Dropdown.Item>
                <Dropdown.Item>I VI IV V</Dropdown.Item>
                <Dropdown.Item>II V I </Dropdown.Item>
                <Dropdown.Item>I IV V IV</Dropdown.Item>
                <Dropdown.Item>VI IV I V</Dropdown.Item>
                <Dropdown.Item>I IV II V</Dropdown.Item>
                <Dropdown.Item>I IV I V</Dropdown.Item>
                <Dropdown.Item>I II IV IV</Dropdown.Item>
                <Dropdown.Item>I III IV IV</Dropdown.Item>
                </Dropdown.Menu>
             </Dropdown.Item>
                
              </Dropdown.Menu>
          </Dropdown>
         <Menu.Item> Edit </Menu.Item>   
         <Menu.Item> Options </Menu.Item>   
         <Menu.Item> Display </Menu.Item>   
         <Menu.Item> Map </Menu.Item>   
         <Menu.Item> Export </Menu.Item>   
        </Menu>
        <Button.Group>
            <Button basic active={noteOptions === 'octave'} onClick={() => setNoteOptions('octave')}>Octave</Button>
            <Button basic active={noteOptions === 'scaler'} onClick={() => setNoteOptions('scaler')}>Scale</Button>
            <Button basic active={noteOptions === 'chromatic'} onClick={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button basic active={noteOptions === 'insert'} onClick={() => setNoteOptions('insert')}>Insert</Button>
            <Button basic active={noteOptions === 'delete'} onClick={() => setNoteOptions('delete')}>Delete</Button>
        </Button.Group>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mapChords()}
        </div>
        <div>
            <h3>Export</h3>
            <div draggable onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>{Chord.detect(chords[0])[0]}</div>
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
