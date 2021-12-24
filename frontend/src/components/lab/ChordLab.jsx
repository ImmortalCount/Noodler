import {React, useState, useEffect} from 'react'
import * as Tone from 'tone';
import {Scale, Chord, Note} from '@tonaljs/tonal';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { setLabData } from '../../store/actions/labDataActions';
import { Icon, Menu, Dropdown, Button, Input } from 'semantic-ui-react';
import { polySynth } from './synths';
import { scaleHandler } from './utils';

export default function ChordLab({importedChordData, masterInstrumentArray}) {
    const [chords, setChords] = useState([['C3', 'E3', 'G3']])
    const [noteOptions, setNoteOptions] = useState("octave")
    const [generateChordOptions, setGenerateChordOptions] = useState({intervals: 3, number: 3})
    const [octave, setOctave] = useState(3)
    var [options, setOptions] = useState('sharps')
    const [edit, setEdit] = useState(false)
    const isMuted = false;

    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

    useEffect(() => {
        if(importedChordData['chord']){
            let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: importedChordData['chordName'],
            chordName: importedChordData['chordName'],
            desc: '',
            chord: importedChordData['chord'],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
        var returnArr = []
        returnArr.push(importedChordData['chord'])
        setChords(returnArr)
        }
        
    }, [importedChordData])

    useEffect(() => {
        let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: Chord.detect(chords[0])[0],
            chordName: Chord.detect(chords[0])[0],
            desc: '',
            chord: chords[0],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
        
    }, [chords])
    

    const allScaleNotes = [];
    const scaleNotes = labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scale'] ? scaleHandler(labInfo['scaleLab']['scale'], options): Scale.get('c major').notes
    const allChromaticNotes = [];
    const chromaticNotes = scaleHandler(Scale.get('c chromatic').notes, options);

    
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

    

    function generateChordStack(){
        var chordStack = [];
            var interval = generateChordOptions['intervals'];
            var stackHeight = generateChordOptions['number'];
            var root = scaleNotes[0] + '3';
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

    function playChords(){
        if (isMuted){
            return
        }
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
        polySynth.triggerAttackRelease(chords[x], '8n');
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
        }, type: 'chordLab'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
    };

    const dragStartHandlerSpecial = e => {
        var idx = 0
        var obj = {id: 'special', className: 'chordData', message: {
            chordName: Chord.detect(chords[idx])[0],
            chord: chords[idx],
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
                        {(edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Icon onClick={handleClickUp} name="caret square up"/><Icon onClick={handleClickDown}name="caret square down"/>
                        </div>}
                        {(edit && noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                    </div>
                )
            }
            returnArr.push(
                <div  id={'chord_' + i} onClick={clickHandler} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '5px'}}>
                <div  style={{display: 'flex', flexDirection: 'row'}}>
                <Icon onClick={handlePlayThis} name="play"/>
                { (edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
                <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "caret square left" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "caret square right" : "caret square down" }/>
                </div>}
                {(edit && noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
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
        var clone = JSON.parse(JSON.stringify(generateChordOptions))
        var thisID = e.target.id;
        if (thisID === 'generateChordIntervalRange'){
            clone['intervals'] = value;
        } else if (thisID === 'generateChordNoteNumber'){
            clone['number'] = value;
        }

        setGenerateChordOptions(clone)
    }

    function handleExport(){

        const chordDataPrototype = {
            name: Chord.detect(chords[0])[0],
            chordName: Chord.detect(chords[0])[0],
            desc: '',
            chord: chords[0],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        dispatch(insertData(chordDataPrototype))
    }

    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playChords()}> Play </Menu.Item>   
         <Menu.Item onClick={()=> generateChordStack()}> Generate </Menu.Item>   
         <Dropdown
          simple
          item
          className='button icon'
        >
         <Dropdown.Menu>
             <Dropdown.Item> Character
                <Dropdown.Menu>
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
             </Dropdown.Item>
             <Dropdown.Item> Progression
                <Dropdown.Menu>
                <Dropdown.Item selected>Diatonic</Dropdown.Item>
                <Dropdown.Item>4ths</Dropdown.Item>
                <Dropdown.Item>5ths</Dropdown.Item>
                </Dropdown.Menu>
             </Dropdown.Item>
                
              </Dropdown.Menu>
          </Dropdown>
         <Menu.Item onClick={() => setEdit(!edit)}> Edit </Menu.Item>    
         <Menu.Item> Display </Menu.Item>   
         {/* <Menu.Item> Map </Menu.Item>    */}
         <Menu.Item onClick={() => handleExport()}> Export </Menu.Item>   
        </Menu>
        {edit && <Button.Group>
            <Button basic active={noteOptions === 'octave'} onClick={() => setNoteOptions('octave')}>Octave</Button>
            <Button basic active={noteOptions === 'scaler'} onClick={() => setNoteOptions('scaler')}>Scale</Button>
            <Button basic active={noteOptions === 'chromatic'} onClick={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button basic active={noteOptions === 'insert'} onClick={() => setNoteOptions('insert')}>Insert</Button>
            <Button basic active={noteOptions === 'delete'} onClick={() => setNoteOptions('delete')}>Delete</Button>
        </Button.Group>}
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mapChords()}
        </div>
        <div>
            <h3>Export</h3>
            <div draggable onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'lightsalmon'}}>{Chord.detect(chords[0])[0]}</div>
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
