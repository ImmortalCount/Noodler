import * as Tone from 'tone';
import { useState, useEffect} from 'react';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import { Dropdown, Button, Icon, Segment } from 'semantic-ui-react';

export default function GuitarSVG() {

    const state = useSelector((state) => state.module)
    const scaleData = useSelector((state) => state.scale)
    const [textArr, setTextArr] = useState(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A', 'A#', 'B'])
    const [scale, setScale] = useState(['C', 'D', 'E','F', 'G', 'A', 'B'])
    const [tuning, setTuning] = useState(['E4','B4','G3','D3','A2','E2'])
    const [stringNumber, setStringNumber] = useState(6)
    const [fretNumber, setFretNumber] = useState(24)
    const [instruments, setInstruments] = useState([{'scale':['C', 'D', 'E','F', 'G', 'A', 'B'], 'tuning':['E4','B4','G3','D3','A2','E2'],'stringNumber':6,'fretNumber': 24}, {'scale':['C', 'D', 'E','F', 'G', 'A', 'B'], 'tuning':['E4','B4','G3','D3','A2','E2'],'stringNumber':7,'fretNumber': 24}])

    var fillArr = [
        '#FF0000', 
        '#FF4500', 
        '#FFA500', 
        '#FCC404', 
        '#FFFF00', 
        '#9ACD32', 
        '#00FF00', 
        '#0D98BA', 
        '#0000FF', 
        '#4d1A7F',
        '#8F00FF',
        '#C71585' 
      ];
    var noteValues = [];
    //generate note values
    for (var m = 0; m < 10; m++){
        for (var o = 0; o < textArr.length; o++){
            var obj = {};
            obj["name"] = textArr[o] + m;
            obj["color"] = fillArr[o];
            obj["note"] = textArr[o];
            obj["octave"] = m;
            noteValues.push(obj);
        }
    }

    function findIndex(name){
        for (var z = 0; z < noteValues.length; z++){
            if (noteValues[z]['name'] === name){
                return z
            }
        }
    }

    // useEffect(() =>{
    //     setTab(tab)
    // }, []);
    const testSequence = [
        [["C4 E4 G4","D4"],["E4","G5"],["C5 E4 G4","B4"],["X","X"]],[["E4 G4 B4","A4"],["E4","E5"],["F4","B5"],["E5 G4 B4","D5"]],[["C5 E4 G4","B4"],["C6","A4"],["F4 B4 D4","B4"],["D4","A5"]]
    ]
    const testSequence2 = [
        [["C3 E3 G3"],["C3 E3 G3"],["C3 E3 G3"],["C3 E3 G3"]],[["D3 F3 A3"],["D3 F3 A3"],["D3 F3 A3"],["D3 F3 A3"]],[['E3 G3 B3'],['E3 G3 B3'],['E3 G3 B3'],['E3 G3 B3']]
    ]
    
    

    //Thanks PimpTrizkit
    function shadeHexColor(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    function blendHexColors(c0, c1, p) {
        var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
        return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
    }

    
    //--------------------

function createGuitarSVG(){
    var stringWidth = 0.5;
    var y = 10;
    var x = 80;
    var svgLength = 40 + (fretNumber * 40)
    var svgHeight = 20 + ((stringNumber - 1) * 50);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("width", svgLength);
    svg.setAttribute("id", "svg1")
    

    //neck
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "#BA8C63");
    svg.appendChild(rect)

    
    //nut
    var nut = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    nut.setAttribute("x1", 40);
    nut.setAttribute("x2", 40);
    nut.setAttribute("y1", 0);
    nut.setAttribute("y2", svgHeight);
    nut.setAttribute("stroke-width", "5");
    nut.setAttribute("stroke", "black");
    svg.appendChild(nut);

    //frets
    //Thanks Vincenzo Galilei
    //Dn = [(L – Dn-1) / 17.817] + Dn-1
    for (var j = 0; j < fretNumber; j++){
    var fret = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    fret.setAttribute('x1', x);
    fret.setAttribute('x2', x);
    fret.setAttribute('y1', 0);
    fret.setAttribute('y2', svgHeight);
    fret.setAttribute("stroke-width", "4");
    fret.setAttribute("stroke", "#C0C0C0");
    
    svg.appendChild(fret);
    x += 40;
    //if set to normal, x += 40 each time;
    }
    //fret markers
    //1 3 5 7 12 15 17 19 21 24
    //12th fret marker
    var fretMarker121 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker121.setAttribute('cx', 500);
    fretMarker121.setAttribute('cy', 85);
    fretMarker121.setAttribute('r', 10);
    fretMarker121.setAttribute('fill', 'black');
    fretMarker121.setAttribute('class', 'fretmarker');
    fretMarker121.setAttribute('id', 'fretmarker121');
    svg.appendChild(fretMarker121);

    var fretMarker122 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker122.setAttribute('cx', 500);
    fretMarker122.setAttribute('cy', 185);
    fretMarker122.setAttribute('r', 10);
    fretMarker122.setAttribute('fill', 'black');
    fretMarker122.setAttribute('class', 'fretmarker');
    fretMarker122.setAttribute('id', 'fretmarker122');
    svg.appendChild(fretMarker122);

    //24th fret marker
    var fretMarker241 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker241.setAttribute('cx', 980);
    fretMarker241.setAttribute('cy', 85);
    fretMarker241.setAttribute('r', 10);
    fretMarker241.setAttribute('fill', 'black');
    fretMarker241.setAttribute('class', 'fretmarker');
    fretMarker241.setAttribute('id', 'fretmarker241');
    svg.appendChild(fretMarker241);

    var fretMarker242 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker242.setAttribute('cx', 980);
    fretMarker242.setAttribute('cy', 185);
    fretMarker242.setAttribute('r', 10);
    fretMarker242.setAttribute('fill', 'black');
    fretMarker242.setAttribute('class', 'fretmarker');
    fretMarker242.setAttribute('id', 'fretmarker242');
    svg.appendChild(fretMarker242);

    //Rest of the fretmarkers
    var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 19, 21]
    for (var i = 0; i < fretMarkerPositions.length; i++){
    var fretMarker = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker.setAttribute('cx', 20 + (fretMarkerPositions[i] * 40));
    fretMarker.setAttribute('cy', 135);
    fretMarker.setAttribute('r', 10);
    fretMarker.setAttribute('fill', 'black');
    fretMarker.setAttribute('class', 'fretmarker');
    svg.appendChild(fretMarker);
    }
    //strings
    for (var i = 0; i < stringNumber; i++) {
        var string = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        string.setAttribute("x1", 0);
        string.setAttribute("x2", svgLength);
        string.setAttribute("y1", y);
        string.setAttribute("y2", y);
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
            note.setAttribute('cx', noteX);
            note.setAttribute('cy', noteY);
            note.setAttribute('r', 15);
            note.setAttribute('fill', shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06) ));
            note.setAttribute('stroke', "azure");
            note.setAttribute('stroke-width', "2");
            note.setAttribute('class', noteValues[index]["name"] + ' note');
            note.setAttribute('id', (k + 1) + "_" + l);
            var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            noteName.setAttribute('x', noteX);
            noteName.setAttribute('y', noteY);
            noteName.setAttribute('text-anchor', 'middle');
            noteName.setAttribute('fill', 'black');
            noteName.setAttribute('dominant-baseline', 'middle');
            noteName.setAttribute('font-size', '15px');
            noteName.setAttribute('class', noteValues[index]["name"] + 'name notename')
            noteName.setAttribute('id', (k + 1) + "_" + l + "_name");
            noteName.textContent = noteValues[index]["name"];
            if (scale.indexOf(noteValues[index]["note"]) === -1){
                note.setAttribute('visibility', 'hidden');
                noteName.setAttribute('visibility', 'hidden');
            }
            svg.appendChild(note);
            svg.appendChild(noteName);

            noteX += 40;
            index += 1;
        }
        noteY += 50;
        noteX = 20;
    }
    //check for previous guitars
    const guitarDiv = document.getElementById('divGuitar');
    const guitarDiv2 = document.getElementById('divGuitar2');
    if (guitarDiv.firstChild){
        while (guitarDiv.firstChild){
            guitarDiv.removeChild(guitarDiv.firstChild)
        }
    }
    let clone = svg.cloneNode(true)
    //Add to div
    guitarDiv.appendChild(svg);
    guitarDiv2.appendChild(clone)
    

}

function invisAll(){
    var x = document.getElementsByClassName('note');
    var y = document.getElementsByClassName('notename');
    for (var i = 0; i < x.length; i++){
        x[i].setAttribute('visibility', 'hidden');
        y[i].setAttribute('visibility', 'hidden');
        }
}

function showAll(){
    var x = document.getElementsByClassName('note');
    var y = document.getElementsByClassName('notename');
    for (var i = 0; i < x.length; i++){
        x[i].setAttribute('visibility', '');
        y[i].setAttribute('visibility', '')
        }
}

function displayNotes(notesArr){
    var displayArr = [];
    for (var i = 0; i < notesArr.length; i++){
        for (var j = 0; j < noteValues.length; j++){
            if (noteValues[j]['note'] === notesArr[i]){
                var currentPositions = positionNamer(noteValues[j]['name'])
                for (var k = 0; k < currentPositions.length; k++){
                    if (currentPositions[k] !== undefined){
                        displayArr.push(currentPositions[k][0])
                    }
                }
            }
        }
    }
    for (var l = 0; l < displayArr.length; l++){
        var x = document.getElementById(displayArr[l]);
        var y = document.getElementById(displayArr[l] + '_name')
        x.setAttribute('visibility', '')
        y.setAttribute('visibility', '')
    }
    return displayArr;
}



function invisById(){
    var x = document.getElementById('5_7');
    var y = document.getElementById('5_7_name')
    x.setAttribute('visibility', 'hidden')
    y.setAttribute('visibility', 'hidden')
}

var arrForTab = [];
function generateArraysForTab(){
    for (var i = 0; i < tuning.length; i++){
        arrForTab[i] = '|';
    }
}
generateArraysForTab();
var barCount = 4;
var tabCount = 0;

function generateTab(ids){
    //tabs = v for heavy vibrato, b for bend, ~ for classic vibrato 
    // slide up = / slide down = \
    if (Array.isArray(ids) === false){
        ids = [ids];
    } 
    var renderString = '';
    var usedStrings = [];
    //render divider bar
    if (barCount === tabCount){
        for (var k = 0; k < tuning.length; k++){
            arrForTab[k] += "|"
        }
        tabCount = 0;
    }
    //add to tab strings
    for (var i = 0; i < ids.length; i++){
        var stringNumber = Number(ids[i].split('_')[0])
        var fretNumberString = ids[i].split('_')[1]
        for (var l =  4 - fretNumberString.length; l > 0 ; l--){
            fretNumberString += '-';
        }
        arrForTab[stringNumber - 1] += fretNumberString;
        usedStrings.push(stringNumber);
    }
    for (var j = 0; j < tuning.length; j++){
        if (usedStrings.indexOf(j + 1) === -1){
            arrForTab[j] += "----"
        }
    }
    //unused strings
    
    //renderTab
    // for (var k = 0; k < arrForTab.length; k++){
    //     renderString = renderString + arrForTab[k] + '\n'
    // }
    // tabCount++;
    // document.getElementById("tab").innerHTML = renderString
    // console.log(renderString);
}

var midiData = [
    'D3',
    'G3',
    'A3',
    'B3',
    'D4',
    'G4',
    'A4',
    'B4',
    'D5',
    'G5',
    'A5',
    'B5',
]

var midi1 = [
    'C3',
    'E3',
    'G3',
    'A3',
    'C4',
    'E4',
    'G4',
    'A4',
]

var chordData = [
    ['C3', 'E3', 'G4'],
    ['C3', 'G3', 'D4', 'A4'],
    ['G3', 'D4', 'B4'],
    ['A3', 'C4', 'E4'],
    ['E3', 'G3', 'B3'],
    ['F3', 'A3', 'C4'],
    ['C3', 'E3', 'G3'],
    ['F3', 'A3', 'C4'],
    ['G3', 'B3', 'D4'],
];

var mixedData = [
    ['C3', 'E3', 'G3', 'A4'],
    ['G3', 'D4', 'E4', 'B4'],
    ['A3', 'C4', 'E4', 'B4'],
    ['E3', 'G3', 'A3', 'B3'],
    ['F3', 'A3', 'C4', 'E4'],
    ['C3', 'E3', 'G3', 'B3'],
    ['F3', 'A3', 'C4', 'E4'],
    ['G3', 'B4', 'D4', 'A5'],
    ['C3', 'G3', 'C4', 'E4', 'G4', 'C5']

];


//position naming function for chords
//only launch this if length is greater than 1
//MAKE SURE THE DATA IS SORTED LOWEST TO HIGHEST BEFORE USING
//Distance between two notes
//x is fret, y is string


var bestFingeringTest = [["2_9", "3_7", "4_5", "5_3"], ["2_9", "3_7", "5_10", "6_8"], ["2_9", "4_12", "5_10", "6_8"]];

// //takes an array of arrays of id names
// function bestFingering(arr){
//     var smallest = Infinity
//     var smallestIndex = 0;
//     for (var h = 0; h < arr.length; h++){
//         var total = 0;
//         for (var i = 0; i < arr[h].length -1; i++){
//             var anchorFret = Number(arr[h][0].split('_')[1]);
//             var movingFret = Number(arr[h][i + 1].split('_')[1]);
//             total += Math.abs(anchorFret - movingFret);
//         }
//         if (total < smallest){
//             smallest = total;
//             smallestIndex = h;
//         }
//         total = 0;
//     }
    
//     return arr[smallestIndex];
// }

function positionNamer(notesArr){
    //generate fretboard
    var fretboard = [];
    for (var i = 0; i < tuning.length; i++){
        var stringNotes = [];
        var index = findIndex(tuning[i]);
        for (var j = 0; j < fretNumber + 1; j++){
            stringNotes.push(noteValues[index + j]['name'])
        }
        fretboard.push(stringNotes)
    }

    var allPositions = [];
    //scan etc


    //single note function

    if (Array.isArray(notesArr) === false){
        for (var k = 0; k < tuning.length;k++){
            var foundFretIndex = fretboard[k].indexOf(notesArr);
        //if the note we're looking for is on the string 
            if (foundFretIndex !== -1){
            var indexID = (k + 1 + "_" + foundFretIndex);
            allPositions.push([indexID]);
        }
    }
    return allPositions;
}
    //if the array is only one note long
    if (notesArr.length === 1){
        for (var k = 0; k < tuning.length;k++){
            var foundFretIndex = fretboard[k].indexOf(notesArr[0]);
        //if the note we're looking for is on the string 
            if (foundFretIndex !== -1){
            var indexID = (k + 1 + "_" + foundFretIndex);
            allPositions.push([indexID]);
        }
    }
    return allPositions;
}



    //Multiple notes --> continue

    function alreadyCalled(val){
        var state = false;
        for (var m = 0; m < allPositions.length; m++){
            if (allPositions[m].indexOf(val) !== -1){
                state = true;
            }
    }
    return state;
}   

    function notSharingString(val){
        
        var stringsInUse = [];
        for (var i = 0; i< singlePosition.length; i++){
            var calledNote = (singlePosition[i][0])
            stringsInUse.push(calledNote);
        }
        if (stringsInUse.indexOf((val[0])) === -1){
            return true;
        } else {
            return false;
            
        }
    }

const anchorNoteIndex = notesArr.length - 1;
//update fingering Or something so that it can't put two things on same line
    function fingeringSort(arr, anchorNoteID){

        var smallest = Infinity
        var smallestIndex = 0;
        for (var i = 0; i < arr.length; i++){
            var anchorNote = Number(anchorNoteID.split('_')[1]);
            var movingNote = Number(arr[i].split('_')[1]);
            if ((Math.abs(anchorNote - movingNote)) < smallest){
                smallest = Math.abs(anchorNote - movingNote);
                smallestIndex = i;
            }
        }
    return arr[smallestIndex] + "";
    }
    //is it complete?
    var complete = false;
    //make sure that it hasn't been called before
    
    var notesArrIndex = notesArr.length - 1;
    var toBeSorted = [];
    var singlePosition = [];
    var anchorNoteID = '';
    var safetyCount = 0;

    while (complete === false){
        
        //scan strings
        
        
        for (var k = 0;  k < tuning.length;){
            var foundFretIndex = fretboard[k].indexOf(notesArr[notesArrIndex]);
            //if the note we're looking for is on the string 
            if (foundFretIndex !== -1){
                var indexID = (k + 1 + "_" + foundFretIndex);
                //and its the anchor note
                if (notesArrIndex === anchorNoteIndex){
                    //and it hasnt been called before
                    if (alreadyCalled(indexID) === false){
                        //push it
                        notesArrIndex--;
                        singlePosition.push(indexID);
                        anchorNoteID = indexID;
                        continue;
                    }
                }
                //if it isnt the anchor note and it hasn't been called
                if ((alreadyCalled(indexID) === false) && (notSharingString(indexID))){
                    //and it isn't on the same string as a previous thing
                    toBeSorted.push(indexID);
                }
            }
            //if its the last string scan
            if (k === tuning.length -1){
                notesArrIndex--;
                var bestNote = (fingeringSort(toBeSorted, anchorNoteID));
                singlePosition.push(bestNote);
                toBeSorted = [];
                //if it is the last string and last note
                if (notesArrIndex === -1){
                    if (singlePosition.indexOf("undefined") !== -1){
                        complete = true;
                    } else {
                        allPositions.push(singlePosition);
                        singlePosition = [];
                        notesArrIndex = notesArr.length - 1
                        safetyCount++
                        if (safetyCount > 6){
                            complete = true;
                        }
                    }
                }  
            }
            k++;
        }
    }

    return allPositions;
}

//play something
var myInterval;
var running = false;
var playPosition = 0;
var globalPosition = 0;
//bpm ish
var globalInt = 500;
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

// const synth = new Tone.Sampler({
//     urls: {
//         A0: "A0.mp3",
//         C1: "C1.mp3",
        
//         A1: "A1.mp3",
//         C2: "C2.mp3",
       
//         A2: "A2.mp3",
//         C3: "C3.mp3",
        
//         A3: "A3.mp3",
//         C4: "C4.mp3",
        
//         A4: "A4.mp3",
//         C5: "C5.mp3",
      
//         A5: "A5.mp3",
//         C6: "C6.mp3",
   
//         A6: "A6.mp3",
//         C7: "C7.mp3",
//         A7: "A7.mp3",
//         C8: "C8.mp3"
//     },
//     baseUrl: "https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages/MusyngKite/electric_guitar_jazz-mp3/"
// }).toDestination();



async function soundNotes(){
    synth.triggerAttackRelease(midiData[playPosition], globalInt/1000);
}
//data can be array or array of arrays
function playNotes(){

var currentArray = [];
var previousArray = [];
var positions = positionNamer(midiData[playPosition]);
//notes for tomorrow
//check if previous note is an array and current note is an array
//make sure all data entering is an array
//implement going in reverse
//implement various rhythms as well;

//remove previous notes
    if (playPosition === 0){
        if (!Array.isArray(midiData[midiData.length - 1])){
            previousArray = [midiData[midiData.length - 1]];
        } else {
            previousArray = midiData[midiData.length - 1];
        }
        for (var m = 0; m < previousArray.length; m++){
            var q = document.getElementsByClassName(previousArray[m]);
            var z = document.getElementsByClassName(previousArray[m] + 'name');
            for (var i = 0; i < q.length; i++){
                q[i].setAttribute('visibility', 'hidden');
                z[i].setAttribute('visibility', 'hidden');
            }
        }
        
    } else {
        if (!Array.isArray(midiData[playPosition - 1])){
            previousArray = [midiData[playPosition - 1]];
        } else {
            previousArray = midiData[playPosition - 1];
        }
        for (var n = 0; n < previousArray.length; n++){
            q = document.getElementsByClassName(previousArray[n]);
            z = document.getElementsByClassName(previousArray[n] + 'name');
            for (var k = 0; k < q.length; k++){
                q[k].setAttribute('visibility', 'hidden');
                z[k].setAttribute('visibility', 'hidden')
            }
        }
        
    }
    
    //reveal current notes
    if (!Array.isArray(midiData[playPosition])){
        currentArray = [midiData[playPosition]];
    } else {
        currentArray = midiData[playPosition];
    }
    
    if (globalPosition < 0){
        for (var w = 0; w < currentArray.length; w++){
            var x = document.getElementsByClassName(currentArray[w]);
            var y = document.getElementsByClassName(currentArray[w] + 'name');
    
            for (var j = 0; j < x.length; j++){
                x[j].setAttribute('visibility', '');
                y[j].setAttribute('visibility', '');
            }
        }
    } else {
        var pos = (positions[globalPosition] || positions[positions.length - 1]);
        var tabArray = []
        for (var w = 0; w < pos.length; w++){
            var x = document.getElementById(pos[w]);
            var y = document.getElementById(pos[w] + '_name');

            x.setAttribute('visibility', '');
            y.setAttribute('visibility', '');
            tabArray.push(x.getAttribute('id'));
        }
        generateTab(tabArray);
    }
    //Sound notes
    soundNotes();
    //------------
    if (playPosition < midiData.length - 1){
        playPosition++;
    } else {
        playPosition = 0;
    }
}

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

function noteStringHandler(notes){
    var returnArr = []
    if (notes.indexOf(' ') === -1){
        returnArr.push(notes)
    } else {
        returnArr = notes.split(' ')
    }
    return returnArr
}

function sequenceIntoNotesAndPositions(sequence){
    var flatData = flattenNotes(sequence);
    var flatReturn = [];
    var positionReturn = [];
    for (var i = 0; i < flatData.length; i++){
        flatReturn.push(noteStringHandler(flatData[i]))
    }
    for (var j = 0; j < flatReturn.length; j++){
        positionReturn.push(positionNamer(flatReturn[j]))
    }
    var returnObj = {};
    returnObj['notes'] = flatReturn;
    returnObj['positions'] = positionReturn;
    return returnObj;
}

function playNoteSequence(sequence){
var cleanData = sequenceIntoNotesAndPositions(sequence)
var flatData = cleanData.notes;
var currentArray = [];
var previousArray = [];
var positions = cleanData.positions

const synthPart = new Tone.Sequence(
        function(time, note) {
          if (note !== 'X'){

              synth.triggerAttackRelease(noteStringHandler(note), 0.1, time);
          }
            //   =============
              if (playPosition === 0){
                previousArray = flatData[flatData.length - 1];
                for (var m = 0; m < previousArray.length; m++){
                    var q = document.getElementsByClassName(previousArray[m]);
                    var z = document.getElementsByClassName(previousArray[m] + 'name');
                    for (var i = 0; i < q.length; i++){
                        q[i].setAttribute('visibility', 'hidden');
                        z[i].setAttribute('visibility', 'hidden');
                    }
                }
            } else {
                previousArray = flatData[playPosition - 1];
                for (var n = 0; n < previousArray.length; n++){
                    q = document.getElementsByClassName(previousArray[n]);
                    z = document.getElementsByClassName(previousArray[n] + 'name');
                    for (var k = 0; k < q.length; k++){
                        q[k].setAttribute('visibility', 'hidden');
                        z[k].setAttribute('visibility', 'hidden');
                    }
                }
            }
              //==============
              if (note !== 'X'){
                currentArray = flatData[playPosition];
                if (globalPosition < 0){
                    for (var w = 0; w < currentArray.length; w++){
                        var x = document.getElementsByClassName(currentArray[w]);
                        var y = document.getElementsByClassName(currentArray[w] + 'name');
                
                        for (var j = 0; j < x.length; j++){
                            x[j].setAttribute('visibility', '');
                            y[j].setAttribute('visibility', '');
                        }
                    }
                } else {
                    var pos = (positions[playPosition][globalPosition] || positions[playPosition][positions[playPosition].length -1]);
                    var tabArray = []
                    for (var w = 0; w < pos.length; w++){
                        var x = document.getElementById(pos[w]);
                        var y = document.getElementById(pos[w] + '_name');
                        x.setAttribute('visibility', '');
                        y.setAttribute('visibility', '');
                        tabArray.push(x.getAttribute('id'));
                    }
                    generateTab(tabArray);
                }
              }
            // reveal current notes

        if (playPosition < flattenNotes(sequence).length - 1){
            playPosition++;
        } else {
            playPosition = 0;
        }
        },
       sequence,
        "1n"
      );
      synthPart.start();
      synthPart.loop = 1;
}
//animate vibrato
function animateClassicVibrato(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cx'));
    var counter = 60;
    var x = 0.1;
    var bound = 2
    var up = true;
    var interval = setInterval(function(){
    if (x >= bound){
        up = false;
    }
    if (x <= -bound){
        up = true;
    }

    if (up === true){
        x++
    } else {
        x--
    }
    note.setAttribute('cx', currentPosition + x);
    noteName.setAttribute('x', currentPosition + x);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cx', currentPosition);
        noteName.setAttribute('x', currentPosition);
    }
    counter--;
}, 15)
    
}

function animateBluesVibrato(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cy'));
    var counter = 60;
    var y = 0.1;
    var bound = 4
    var up = true;
var interval = setInterval(function(){
    if (y >= bound){
        up = false;
    }
    if (y <= -bound){
        up = true;
    }

    if (up === true){
        y++
    } else {
        y--
    }
    note.setAttribute('cy', currentPosition + y);
    noteName.setAttribute('y', currentPosition + y);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cy', currentPosition);
        noteName.setAttribute('y', currentPosition);
    }
    counter--;
}, 10)
    
}

function animateSlideUp(){
    var note = document.getElementById('2_11');
    var noteName = document.getElementById('2_11_name')
    var destinationNote = document.getElementById('2_14')
    var currentPosition = Number(note.getAttribute('cx'));
    var destinationPosition = Number(destinationNote.getAttribute('cx'))
    var currentColor = note.getAttribute('fill');
    var destinationColor = destinationNote.getAttribute('fill')
    var x = 0;
    var counter = 60;
    var interval = setInterval(function(){
        note.setAttribute('cx', currentPosition + x);
        note.setAttribute('fill', blendHexColors(destinationColor, currentColor, (destinationPosition - currentPosition + x)) )
        noteName.setAttribute('x', currentPosition + x);
        if (counter < 0){
            clearInterval(interval)
            note.setAttribute('cx', currentPosition);
            noteName.setAttribute('x', currentPosition);
            note.setAttribute('fill', currentColor);
        }
        if (!(currentPosition + x >= destinationPosition)){
            x += 5;
        }
        counter--;
    }, 10)

}

function animateSlideDown(){
    var note = document.getElementById('2_11');
    var noteName = document.getElementById('2_11_name')
    var destinationNote = document.getElementById('2_14')
    var currentPosition = Number(note.getAttribute('cx'));
    var destinationPosition = Number(destinationNote.getAttribute('cx'))

}

function animateBend(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cy'));
    console.log(currentPosition)
    var counter = 100;
    var y = 0.1;
    var bound = 50;
    var up = true;
    var sustain = false;
    var interval = setInterval(function(){
    if (y >= bound){
        up = false;
        sustain = true;
    }
    if (y <= 0){
        up = true;
    }
    if (sustain === false){
        if (up === true){
            y++
        } else {
            y--
        }
    }
    note.setAttribute('cy', currentPosition + y);
    noteName.setAttribute('y', currentPosition + y);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cy', currentPosition);
        noteName.setAttribute('y', currentPosition);
    }
    if (counter < 50){
        sustain = false;
    }
    counter--;
}, 10)
}

function Bluesy(){
    animateClassicVibrato();
    animateBend();
}

function animateReverseBend(){

}
//----------------------------------

function setMidiData(x){
    midiData = x;
}
setMidiData(chordData);

function downloadTab(){
var FileSaver = require('file-saver');
var blob = new Blob([document.getElementById("tab").innerHTML], {type: "text/plain;charset=utf-8"})
FileSaver.saveAs(blob, "tab.txt");
}



useEffect (()=>{
    if (scaleData.length !== 0){
        setScale(scaleData)
    }
    createGuitarSVG();
}, [tuning, fretNumber, scale, scaleData]);

const tuningOptions = [
    {key: 'Standard', text: 'EADGBE', value: ['E4', 'B4', 'G3', 'D3', 'A2', 'E2']},
    {key: 'DADGAD', text: 'DADGAD', value: ['D4', 'A3', 'G3', 'D3', 'A2', 'D2']},
    {key: 'P4', text: 'P4', value: ['F4', 'C4', 'G3', 'D3', 'A2', 'E2']},
    {key: 'DropD', text: 'DropD', value: ['E4', 'B4', 'G3', 'D3', 'A2', 'D2']},
]

const instrumentOptions = [
    {key: 'Guitar', text: 'Guitar', value: 'Guitar'},
    {key: 'Bass', text: 'Bass', value: 'Bass'},
    {key: 'Mandolin', text: 'Mandolin', value: 'Mandolin'},
    {key: 'Banjo', text: 'DropD', value: 'DropD'},
]

function handleStringChange(direction){
    if (direction === 'down'){
        if (stringNumber !== 1){
            var clone = [...tuning]
            clone.pop()
            setTuning(clone)
            setStringNumber(stringNumber - 1)
        }
    } 
    if (direction === 'up'){
        var clone = [...tuning]
        var newNote = noteValues[findIndex(clone[clone.length - 1]) - 5];
        if (newNote === undefined){
            return
        } else {
        clone.push(newNote['name'])
        setTuning(clone)
        setStringNumber(stringNumber + 1)
        }
    }
}

const onChangeTuning = (e, {value}) => {
    setTuning(value);
  }
//Make invisible on load

//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */

//FEATURES TO REMEMBER 
//TAB IS BEING MUTED EARLIER IN FILE
//REMEMBER TO TOGGLE BETWEEN VIEWS ON BOARD (REALISTIC vs COMPACT)
//INVIS ALL?
//MODERN AND CLASSIC VIBRATO BEND REVERSE BEND SLIDE UP
//SEE POSITIONS
//START AUDIO
//ON OFF SOUND

    return (
        <>
        <div>
        <Button.Group>
            <Button compact basic onClick={()=> handleStringChange('down')}> <Icon name ='left arrow'/></Button>
            <Segment>
            Strings: {stringNumber}
            </Segment>
            <Button compact basic onClick={()=> handleStringChange('up')}> <Icon name ='right arrow'/></Button>
        </Button.Group>
        <Dropdown
        search
        selection
        options={instrumentOptions}
        defaultValue='Guitar'
        />
        <Dropdown
        placeholder='EADGBE'
        search
        selection
        onChange={onChangeTuning}
        options={tuningOptions}
        defaultValue='EADGBE'
        />
        <Button.Group>
            <Button compact basic onClick={()=> setFretNumber(fretNumber - 1)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Frets: {fretNumber}
            </Segment>
            <Button compact basic onClick={()=> setFretNumber(fretNumber + 1)} > <Icon name ='right arrow'/></Button>
        </Button.Group>
        <div id='divGuitar'></div>
        </div>
        <div>
        <Button.Group>
            <Button compact basic onClick={()=> handleStringChange('down')}> <Icon name ='left arrow'/></Button>
            <Segment>
            Strings: {stringNumber}
            </Segment>
            <Button compact basic onClick={()=> handleStringChange('up')}> <Icon name ='right arrow'/></Button>
        </Button.Group>
        <Dropdown
        search
        selection
        options={instrumentOptions}
        defaultValue='Guitar'
        />
        <Dropdown
        placeholder='EADGBE'
        search
        selection
        onChange={onChangeTuning}
        options={tuningOptions}
        defaultValue='EADGBE'
        />
        <Button.Group>
            <Button compact basic onClick={()=> setFretNumber(fretNumber - 1)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Frets: {fretNumber}
            </Segment>
            <Button compact basic onClick={()=> setFretNumber(fretNumber + 1)} > <Icon name ='right arrow'/></Button>
        </Button.Group>
        <div id='divGuitar2'></div>
        </div>
        
        
        
        <Button compact basic onClick={function(){clearInterval(myInterval); running = false}}><Icon name='stop'/></Button>
        {/* <Button compact basic onClick={function(){if (running !== true){myInterval = setInterval(playNotes, globalInt); running = true}}}><Icon name='play'/></Button> */}
        {/* <button onClick={() => Tone.start()}>Initialize</button>
        <button onClick={() => (Tone.Transport.start())}>start </button> */}
        <Button compact basic onClick={() => playNoteSequence(JSON.parse(state))}><Icon name='play'/></Button>
        {/* <Button compact basic onClick={() => playNoteSequence(testSequence)}><Icon name='play'/></Button> */}
        {/* <button onClick={() => console.log(positionNamer(chordData[playPosition -1]), chordData[playPosition -1])}>See positions</button> */}
        {/* <button onClick={()=>invisAll()}>invis All</button> */}
        <Button compact basic onClick={() => globalPosition = -1}><Icon name='arrows alternate vertical'/></Button>
        <Button compact basic onClick={()=>playNotes()}><Icon name='step backward'/></Button>
        <Button compact basic onClick={() => globalPosition--}><Icon name='arrow down'/></Button>
        <Button compact basic onClick={() => globalPosition++}><Icon name='arrow up'/></Button>
        <Button compact basic onClick={()=>playNotes()}><Icon name='step forward'/></Button>
        <Button compact basic ><Icon name='fast backward'/></Button>
        <Button compact basic ><Icon name='fast forward'/></Button>
        <Button compact basic ><Icon name='retweet'/></Button>
        <Button compact basic onClick={()=>invisAll()} ><Icon name='eye'/></Button>
        <Button compact basic onClick={() => console.log(scaleData, 'scaleData',state, 'stateData')} >Test</Button>
        {/* <button onClick={() => console.log(sequenceIntoNotesAndPositions(testSequence))}>Test!</button>
        <button onClick={() => playNoteSequence(testSequence)}>Test Sequence</button>
        <button onClick={() => playNoteSequence(testSequence2)}>Test Sequence 2: Chords</button> */}
        {/* <button>Add Strings</button>
        <button>Change Tuning</button>
        <button onClick={()=> invisById()}>On/Off Sound</button>
        <button onClick={async()=> await Tone.start()}>Start Audio</button>
        <button>Increase # of Frets</button>
        <button>Decrease # of Frets</button>
        <button>Realistic Fret Spacing</button>
        <button>Compact Fret Spacing</button>
        <button onClick={() => animateClassicVibrato()}>Classic Vibrato</button>
        <button onClick={() => animateBluesVibrato()}>Modern Vibrato</button>
        <button onClick={() => animateBend()}>Bend</button>
        <button onClick={() => animateReverseBend()}>Reverse Bend</button>
        <button onClick={() => Bluesy()}>Bluesy</button>
        <button onClick={() => animateSlideUp()}>SlideUp</button> */}
        {/* <p>Tab</p> */}
        {/* <div id="tab" dangerouslySetInnerHTML={{__html: " \n \n \n \n \n \n "}} style ={{whiteSpace: "pre-line", fontFamily: "monospace, monospace", backgroundColor: 'lightblue', width: '1000px', overflowX: 'scroll', visibility: ""}}> 
        </div> */}
        {/* <button onClick={() => downloadTab()}>Download tab</button> */}
        {/* <button onClick={()=>playChord()}>chord</button> */}
        </>
    )
}
