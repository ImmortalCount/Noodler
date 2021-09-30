import {React, useState} from 'react'
import * as Tone from 'tone';
import { Menu } from 'semantic-ui-react';
import './rhythmlab.css'

export default function RhythmLab() {
    const synth = new Tone.Synth().toDestination(); 

    var [notes, setNotes] = useState([['C3', 'C3'], ['C3', 'C3'], ['C3', 'C3'], ['C3','C3']])
//------Returns an array of objects in order of when they are going to be played, as well as their className by Level and their ID (idx)
function nestedIndexer(notes){
    var counter = 0;
    var newNotes = [];
    for (var i = 0; i < notes.length; i++){
        if (Array.isArray(notes[i]) === false){
            newNotes.push([notes[i]])
        } else {
            newNotes.push(notes[i]);
        }
    }
    
        function recursiveNestedIndexer(notes, level, returnArr, length){
            //returns an array of objects detailing which notes are at what level in the nested array
            if (level === undefined){
                level = -1;
            }
            if (returnArr === undefined){
                returnArr = [];
            }

            if (length === undefined){

            }
            var firstPushed = false;
            for (var i = 0; i < notes.length; i++){
                if (Array.isArray(notes[i]) === false){
                    if (firstPushed === false){
                    returnArr.push({index: counter, length: length, starting: notes[i], level: 'level_' + level })
                    counter += 1;
                    firstPushed = true;
                    } else {
                        counter += 1;
                    }
                } else {
                    recursiveNestedIndexer(notes[i], level + 1, returnArr, flattenNotes(notes[i]).length);
                }
            }
            return returnArr;
            }
        
    return recursiveNestedIndexer(newNotes);
}


function levelInNestedArray(notes){
    var newNotes = [];
    for (var i = 0; i < notes.length; i++){
        if (Array.isArray(notes[i]) === false){
            newNotes.push([notes[i]])
        } else {
            newNotes.push(notes[i]);
        }
    }
    var returnArr = [];
    function recursiveNestedArray(notes, level){
        if (level === undefined){
            level = -1;
        }

        for (var i = 0; i < notes.length; i++){
            if (Array.isArray(notes[i]) === false){
                returnArr.push({note: notes[i], level: level})
            } else {
                recursiveNestedArray(notes[i], level + 1);
            }
        }
        
        return returnArr;
    }
    return recursiveNestedArray(newNotes)
}

//----------useful note flattening
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

function cueCardGenerator(notes){

var allNotes = flattenNotes(notes);
 var newNotes = [];
    for (var i = 0; i < notes.length; i++){
        if (Array.isArray(notes[i]) === false){
            newNotes.push([notes[i]])
        } else {
            newNotes.push(notes[i]);
        }
    }
var actionLengths = nestedIndexer(notes);

var cueCards = [];
//cue card initiator
for (var k = 0; k < flattenNotes(notes).length; k++){
    cueCards.push({note: '', on: [], off: []})
}
//add the notes to the return just in case
for (var i = 0; i < allNotes.length; i++){
    cueCards[i]['note'] = allNotes[i]
}
//name the divider Ids properly
var levels = {}

for (var i = 0; i < actionLengths.length; i++){
    if (levels[actionLengths[i]['level']] === undefined){
        levels[actionLengths[i]['level']] = 0;
    } 
    var onIndex = actionLengths[i]['index']
    //what goes on
    cueCards[onIndex]['on'].push(actionLengths[i]['level'] + '_' + levels[actionLengths[i]['level']]);
    //what goes off
    var offIndex = (actionLengths[i]['index'] + actionLengths[i]['length']);
    if (offIndex >= cueCards.length){
        offIndex = offIndex - (cueCards.length)
    }
    cueCards[offIndex]['off'].push(actionLengths[i]['level'] + '_' + levels[actionLengths[i]['level']]);
    levels[actionLengths[i]['level']] += 1;
}   
    return cueCards;
}

function mapNotes(notes){
    var returnArr = [];
    var level0Counter = 0;
    var level1Counter = 0;
    var level2Counter = 0;
    var level3Counter = 0;
    var level4Counter = 0;
    var counter = 0;

    function innerMapNotes(notes){
        for (var i = 0; i < notes.length; i++){
            var level0Return = [];
            for (var j = 0; j < notes[i].length; j++){
                if (Array.isArray(notes[i][j]) === false){
                    level0Return.push(<div id={counter} key={counter} className='inactive'style={{height: '50px', width: '50px', margin: '1px' }}>{notes[i][j]}</div>)
                    counter++;
                }
                else {
                    var level1Return = [];
                    for (var k = 0; k < notes[i][j].length; k++){
                        if (Array.isArray(notes[i][j][k]) === false){
                            level1Return.push(<div id={counter} key={counter} className='inactive'style={{height: '50px', width: '40px', margin: '1px' }}>{notes[i][j][k]}</div>)
                            counter++;
                        } else {
                            var level2Return = [];
                            for (var l = 0; l < notes[i][j][k].length; l++){
                                if (Array.isArray(notes[i][j][k][l]) === false){
                                    level2Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '30px', margin: '1px' }}>{notes[i][j][k][l]}</div>)
                                    counter++;
                                } else {
                                    var level3Return = [];
                                    for (var m = 0; m < notes[i][j][k][l].length; m++){
                                        if (Array.isArray(notes[i][j][k][l][m]) === false){
                                            level3Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '20px', margin: '1px' }}>{notes[i][j][k][l][m]}</div>)
                                            counter++;
                                        } else {
                                        var level4Return = [];
                                        for (var n = 0; n < notes[i][j][k][l][m].length; n++){
                                            if (Array.isArray(notes[i][j][k][l][m][n]) === false){
                                                level3Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '15px', margin: '1px' }}>{notes[i][j][k][l][m][n]}</div>)
                                                counter++;
                                            } else {
                                                counter++;
                                                continue;
                                            }
                                        }
                                        level3Return.push(
                                            <div id={'level_4_' + level4Counter} key={'level_4_' + level0Counter} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>{level4Return}</div>
                                        )
                                        level4Counter++
                                        }
                                    }
                                    level2Return.push(
                                        <div id={'level_3_' + level3Counter} key={'level_3_' + level0Counter} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>{level3Return}</div>
                                    )
                                    level3Counter++
                                }
                                
                            }
                            level1Return.push(
                                <div id={'level_2_' + level2Counter} key={'level_2_' + level2Counter} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>{level2Return}</div>
                            )
                            level2Counter++
                        } 
                    }
                    level0Return.push(
                        <div id={'level_1_' + level1Counter} key={'level_1_' + level1Counter} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>{level1Return}</div>
                        )
                    level1Counter++;
                }
            }
            returnArr.push(
                <div id={'level_0_' + level0Counter} key={'level_0_' + level0Counter} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>{level0Return}</div>
                )
            level0Counter++;
        }
        return returnArr    
    }
    return innerMapNotes(notes);
}

//---------------------------------------------
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//---random rhythm generator
function randomRhythmGenerator(depth, length){

    if (depth === undefined){
        depth = 1;
    }
    if (length === undefined){
        length = 4;
    }

    var returnArr = [];
    for (var i = 0; i < length; i++){
        var level0Array = [];
        for (var j = 0; j < randomInteger(1, 9); j++){
            var rand = randomInteger(0,2)
            if (rand === 0){
                level0Array.push('X')
            }
            if (rand === 1){
                level0Array.push('C3')
            }
            else {
            var level1Array = [];
                for (var k = 0; k < randomInteger(1, 9); k++){
                    var rand2 = randomInteger(0,2)
                    if (rand2 === 0){
                        level1Array.push('X')
                    }
                    if (rand2 === 1){
                        level1Array.push('C3')
                    } else {
                        level1Array.push('C3')
                    }
                }
                level0Array.push(level1Array)
            }
        }
        returnArr.push(level0Array)
    }
return returnArr
}

//---timing

const timing = [];
    function initializeTimingArray(){
        const totalNotes = notes.reduce((count, current) => count + current.length, 0)
        for (var i = 0; i < totalNotes.length;i++){
            timing.push('');
        }
    }
    initializeTimingArray()

    var position = 0;
//---Synthpart function 
function playSynth(){
        const synthPart = new Tone.Sequence(
          function(time, note) {
            var cueCards = cueCardGenerator(notes);
            if (note !== 'X'){
                synth.triggerAttackRelease(note, "10hz", time);
            }
            const noteElement = document.getElementById(position.toString())
            var previousNoteElement;
            if (position === 0){
                previousNoteElement = document.getElementById((flattenNotes(notes).length -1).toString())
            } else {
                previousNoteElement = document.getElementById(position - 1)
            }
            //div elements
            const onNoteElements = [];
            const offNoteElements = [];
            if (cueCards[position]['on'].length !== 0){
                for (var i = 0; i < cueCards[position]['on'].length; i++){
                    onNoteElements.push(document.getElementById(cueCards[position]['on'][i]));
                }
            }
            if (cueCards[position]['off'].length !== 0){
                for (var i = 0; i < cueCards[position]['off'].length; i++){
                    offNoteElements.push(document.getElementById(cueCards[position]['off'][i]));
                }
            }

            Tone.Draw.schedule(() => {
                //notes
                noteElement.className = 'active';
                previousNoteElement.className = 'inactive';
                //divs
                if (onNoteElements.length !== 0){
                    for (var i = 0; i < onNoteElements.length; i++){
                        onNoteElements[i].className = 'active'
                    }
                }
                if (offNoteElements.length !== 0){
                    for (var j = 0; j < offNoteElements.length; j++){
                        offNoteElements[j].className = 'inactive'
                    }
                }
            }, time)
            //position
            if (position < flattenNotes(notes).length -1){
                position += 1;
            } else {
                position = 0;
            }
            //memory
            timing.push({'note': note, 'time': Tone.Transport.position}) 
          },
         notes,
          "4n"
        );
        synthPart.start();
        synthPart.loop = 1;


        function playBend(){
            var startTime = synth.now();
            //trigger the envelope start on "C3"
            synth.triggerAttack("C3");
            //set a ramping anchor point at the beginning ramp
            synth.frequency.setValueAtTime("C3", startTime + 0.1)
            //ramp to E3
            synth.frequency.exponentialRampToValueAtTime("E3", startTime + 0.2)
            synth.frequency.setValueAtTime("E3", startTime + 0.3)
            synth.frequency.exponentialRampToValueAtTime("G3", startTime + 0.4)
            //trigger the release of the envelope at the end
            synth.triggerRelease(startTime + 0.5);
        }
    function handleRandom(){
        synthPart.dispose();
        setNotes(randomRhythmGenerator())
    }
}


    function mapNotesToRhythm(patternNotes){
        for (var i = 0; i < patternNotes.length; i++){
            console.log('work on this later')
        }
    }
    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playSynth()}> Play </Menu.Item>   
         <Menu.Item onClick={()=> console.log('ello?')}> Generate </Menu.Item>   
         <Menu.Item> Edit </Menu.Item>   
         <Menu.Item> Options </Menu.Item>   
         <Menu.Item> Scale Lock </Menu.Item>   
         <Menu.Item> Map </Menu.Item>   
         <Menu.Item> Export </Menu.Item>   
        </Menu>
        <div>
            Notes:
        </div>
        {/* <div>
            {JSON.stringify(notes).replace(/\"/g, " ")}
        </div> */}
       <div style={{display: 'flex', flexDirection: 'row', width: '500px'}} >
           {mapNotes(notes)}
       </div>
       <div>
            <h3>Export</h3>
            <div draggable='true' style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>Rhythm 1</div>
        </div>
       {/* <div>
           <h3>Change notes manually</h3>
       <input type="text" value ={JSON.stringify(notes).replace(/\"/g, " ")} style={{width:"500px"}}/>
       </div> */}
        {/* <button onClick={() => mapNotesToRhythm()}>map notes</button>
        <button onClick={() => Tone.start()}>Initialize</button>
        <button onClick={() => Tone.Transport.start()}>start </button>
        <button onClick={() => Tone.Transport.pause()}>pause </button>
        <button onClick={() => Tone.Transport.stop()}>reset </button>
        <button onClick={() => playBend()}>play bend</button>
        <button onClick={() => console.log(cueCardGenerator(notes))}> test</button>
        <button> subdivide</button>
        <button> add ++</button>
        <button> subtract --</button>
        <button> back </button>
        <button> forward</button>
        <button> insert</button>
        <button> replace</button>
        <button> swap</button>
        <button onClick={()=> handleRandom()}> Random</button> */}
        </>
    )
}
