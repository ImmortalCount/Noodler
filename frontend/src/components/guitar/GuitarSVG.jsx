import React, { useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments'
// import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import { Dropdown, Button, Icon, Segment } from 'semantic-ui-react';

export default function GuitarSVG() {
    //To do:
    //Download Tab
    //Figure out why notes are displayed on new board
    // useEffect(() =>{
    //     setTab(tab)
    // }, []);
     /* <p>Tab</p> */
    /* <div id="tab" dangerouslySetInnerHTML={{__html: " \n \n \n \n \n \n "}} style ={{whiteSpace: "pre-line", fontFamily: "monospace, monospace", backgroundColor: 'lightblue', width: '1000px', overflowX: 'scroll', visibility: ""}}> 
    </div> */
    /* <button onClick={() => downloadTab()}>Download tab</button> */
    //
    const state = useSelector((state) => state.module)
    const scaleData = useSelector((state) => state.scale)
    const [textArr, setTextArr] = useState(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A', 'A#', 'B'])
    const [tuning, setTuning] = useState(['E4','B3','G3','D3','A2','E2'])
    // const [stringNumber, setStringNumber] = useState(6)
    const [fretNumber, setFretNumber] = useState(24)
    const [instruments, setInstruments] = useState([{instrument:'acoustic_guitar_nylon', noteColors: 'black', scale:[], tuning:['E4','B4','G3','D3','A2','E2'],stringNumber:6,fretNumber: 24}, {instrument:'acoustic_bass' , noteColors: 'black', scale:[], tuning:['G2','D2','A1','E1'],stringNumber:4,fretNumber: 24}])
    const [module, setModule] = useState(0);
    const globalPosition = useRef(0); 
    const [data, setData] = useState([
        {
        instrument: 'acoustic_guitar_nylon', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D4','X','D4 F4 A4', 'E4'],['X','X', 'D4 F4 A4', 'X'],['X', 'G4','D4 F4 A4', 'X'],['B4', 'X','D4 F4 A4', 'F5']]}, {speed:'4n', notes:[['G5','X', 'F5', 'X'],['E5','X', 'D5', 'X'],['B4','X', 'E4', 'X'],['B4', 'X','E4', 'X']]}, {speed:'4n', notes:[['C4','X', 'D4', 'X'],['E4','X', 'F4', 'X'],['G4', 'X','C4', 'X'],['D4','X', 'C4', 'X']]}, {speed:'4n' , notes:[['A4','X', 'C4', 'X'],['D4','X', 'E4', 'X'],['A5','X', 'C5', 'X'],['D5','X', 'E5', 'X']]}]
    },
    {
        instrument: 'acoustic_bass', 
        soundOn: true, 
        master: false, 
        data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G2'],['G2'],['G2'],['G2']]}, {speed:'4n', notes:[['C2'], ['C2'],['C2'], ['C2']]}, {speed:'4n' , notes:[['A2'],['A2'],['A2'],['A2']]}]
    },
    ])
    const [audioSettings, setAudioSettings] = useState([
        {   
            name: 'acoustic guitar 1',
            instrument: 'acoustic_guitar_nylon',
            volume: 0,
            effects:[],
    },
    {   
        name: 'bass 1',
        instrument: 'acoustic bass 1',
        volume: 0,
        effects:[],
    },
    ])
    const [bpm, setBpm] = useState(120)
    const [allSynths, setAllSynths] = useState({})
    //guitar focus
    const [focus, setFocus] = useState(0)
    const [loop, setLoop] = useState(false)
    const [moduleMarkers, setModuleMarkers] = useState(moduleMarkerCreator(data))

    const guitarPrototype = {instrument:'acoustic_guitar_nylon','scale':[], 'tuning':['E4','B4','G3','D3','A2','E2'],'stringNumber':6,'fretNumber': 24}
    const bassPrototype = {instrument:'acoustic_bass','scale':[], 'tuning':['G2','D2','A1','E1'],'stringNumber':6,'fretNumber': 24}
    //=====Consts
    const guitarInstruments = [
        "acoustic_guitar_nylon",
        "acoustic_guitar_steel",
        "electric_distortion_guitar",
        "electric_guitar_clean" ,
        "electric_guitar_jazz"
    ]
    const bassInstruments = [
        "acoustic_bass",
        "electric_bass_finger"
    ]

    const data1 = [
            {
            instrument: 'acoustic_guitar_nylon', 
            soundOn: true, 
            master: true, 
            data: [{speed:'4n', notes:[['D4','X','D4 F4 A4', 'E4'],['X','X', 'D4 F4 A4', 'X'],['X', 'G4','D4 F4 A4', 'X'],['B4', 'X','D4 F4 A4', 'F5']]}, {speed:'4n', notes:[['G5','X', 'F5', 'X'],['E5','X', 'D5', 'X'],['B4','X', 'E4', 'X'],['B4', 'X','E4', 'X']]}, {speed:'4n', notes:[['C4','X', 'D4', 'X'],['E4','X', 'F4', 'X'],['G4', 'X','C4', 'X'],['D4','X', 'C4', 'X']]}, {speed:'4n' , notes:[['A4','X', 'C4', 'X'],['D4','X', 'E4', 'X'],['A5','X', 'C5', 'X'],['D5','X', 'E5', 'X']]}]
        },
        {
            instrument: 'acoustic_bass', 
            soundOn: true, 
            master: false, 
            data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G2'],['G2'],['G2'],['G2']]}, {speed:'4n', notes:[['C2'], ['C2'],['C2'], ['C2']]}, {speed:'4n' , notes:[['A2'],['A2'],['A2'],['A2']]}]
        },
    ]

    const data2 = [
        {
        instrument: 'acoustic_guitar_nylon', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D4','X', 'E4'],['F4','X', 'G4'],['A4', 'X','B4'],['D5', 'X','F5']]}, {speed:'4n', notes:[['G5','X', 'F5'],['E5','X', 'D5'],['B4','X', 'E4'],['B4', 'X','E4']]}, {speed:'4n', notes:[['C4','X', 'D4'],['E4','X', 'F4'],['G4', 'X','C4'],['D4','X', 'C4']]}, {speed:'4n' , notes:[['A4','X', 'C4'],['D4','X', 'E4'],['A5','X', 'C5'],['D5','X', 'E5']]}]
    },
    {
        instrument: 'acoustic_bass', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G1'],['G1'],['G1'],['G1']]}, {speed:'4n', notes:[['C1'],['C1'],['C1'],['C1']]}, {speed:'4n' , notes:[['A1'],['A1'],['A1'],['A1']]}]
    },
    ];
    const data3 = [
        {
        instrument: 'electric_guitar_jazz', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D4','X', 'E4'],['F4','X', 'G4'],['A4', 'X','B4'],['D5', 'X','F5']]}, {speed:'4n', notes:[['G5','X', 'F5'],['E5','X', 'D5'],['B4','X', 'E4'],['B4', 'X','E4']]}, {speed:'4n', notes:[['C4','X', 'D4'],['E4','X', 'F4'],['G4', 'X','C4'],['D4','X', 'C4']]}, {speed:'4n' , notes:[['A4','X', 'C4'],['D4','X', 'E4'],['A5','X', 'C5'],['D5','X', 'E5']]}]
    },
    {
        instrument: 'electric_bass_finger', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G1'],['G1'],['G1'],['G1']]}, {speed:'4n', notes:[['C1'],['C1'],['C1'],['C1']]}, {speed:'4n' , notes:[['A1'],['A1'],['A1'],['A1']]}]
    },
    ];
    const data4 = [
        {
            instrument: 'electric_guitar_jazz', 
            soundOn: true, 
            master: true, 
            data: [{speed:'4n', notes:[['E4','X', 'F4'],['G4','X', 'A4'],['B4', 'X','C4'],['D5', 'X','B5']]}, {speed:'4n', notes:[['G5','X', 'F5'],['E5','X', 'D5'],['B4','X', 'E4'],['B4', 'X','E4']]}, {speed:'4n', notes:[['C4','X', 'D4'],['E4','X', 'F4'],['G4', 'X','C4'],['D4','X', 'C4']]}, {speed:'4n' , notes:[['A4','X', 'C4'],['D4','X', 'E4'],['A5','X', 'C5'],['D5','X', 'E5']]}]
        },
        {
            instrument: 'electric_bass_finger', 
            soundOn: true, 
            master: true, 
            data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G1'],['G1'],['G1'],['G1']]}, {speed:'4n', notes:[['C1'],['C1'],['C1'],['C1']]}, {speed:'4n' , notes:[['A1'],['A1'],['A1'],['A1']]}]
        },
    ]

    useEffect(() => {
        setAllSynths({
            'acoustic_bass': new Tone.Sampler(instrumentSamples.acoustic_bass).toDestination(),
            'electric_bass_finger': new Tone.Sampler(instrumentSamples.electric_bass_finger).toDestination(),
            'acoustic_guitar_nylon': new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination(),
            'acoustic_guitar_steel': new Tone.Sampler(instrumentSamples.acoustic_guitar_steel).toDestination(),
            'electric_distortion_guitar': new Tone.Sampler(instrumentSamples.electric_distortion_guitar).toDestination(),
            'electric_guitar_clean': new Tone.Sampler(instrumentSamples.electric_guitar_clean).toDestination(),
            'electric_guitar_jazz': new Tone.Sampler(instrumentSamples.electric_guitar_jazz).toDestination(),
        })
       console.log('loading synths')
    }, [])

    useEffect(() => {
        loadNoteSequenceAndVisualDataOntoTimeline(data)
        console.log('data changed')
    }, [data, instruments])

    //===New Shit
    
    function moduleMarkerCreator(data){
        var moduleMarkers = [0]
        for (var i = 0; i < data[0]['data'].length -1; i++){
            var time = (Tone.Time(data[0]['data'][i].speed).toSeconds() * data[0]['data'][i].notes.length + moduleMarkers[i])
            time = +time.toFixed(2);
            moduleMarkers.push(time)

        }
        return moduleMarkers;
    }

    function moduleMarkerCreatorCompact(data){
        var moduleMarkers = [0]
        for (var i = 0; i < data.length -1; i++){
            var time = (Tone.Time(data[i].speed).toSeconds() * data[i].notes.length + moduleMarkers[i])
            time = +time.toFixed(2);
            moduleMarkers.push(time)

        }
        return moduleMarkers;
    }

    function loopLengthCreator(data){
        var loopLength = 0;
        for (var i = 0; i < data[0]['data'].length; i++){
            loopLength = loopLength + (Tone.Time(data[0]['data'][i].speed).toSeconds() * data[0]['data'][i].notes.length)
        }
        loopLength = +loopLength.toFixed(2)
        return loopLength;
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


    function loopOn(){
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = loopLengthCreator(data);
        if (Tone.Transport.loop !== true){
            Tone.Transport.loop = true;
            setLoop(true)
        } else {
            Tone.Transport.loop = false;
            setLoop(false)
        }
    }


    function findBetween(number, list){
        var returnObj = {previous: undefined, next: undefined, playingIndex: undefined, current: undefined}
            for (var i = 1; i < list.length; i++){
                if (number <= list[0]){
                    returnObj['previous'] = list[0]
                    returnObj['current'] = list[0]
                    returnObj['next'] = list[0] 
                    returnObj['playingIndex'] = 0
                }

                if (number <= list[1]){
                    returnObj['previous'] = list[0]
                    returnObj['current'] = list[0]
                    returnObj['next'] = list[1] 
                    returnObj['playingIndex'] = 0
                }
                if (number >= list[list.length -1]){
                    returnObj['previous'] = list[list.length -2];
                    returnObj['current'] = list[list.length -1];
                    returnObj['next'] = undefined;
                    returnObj['playingIndex'] = list.length - 1;
                    
                }
                if (number >= list[i - 1] && number <=list[i]){
                    returnObj['previous'] = list[i - 2];
                    returnObj['current'] = list[i - 1]
                    returnObj['next'] = list[i] 
                    returnObj['playingIndex'] = i - 1;
                }
            }
            return returnObj;
    }


    function handlePreviousNextModulePlay(direction){
        var currentTime = Tone.Time(Tone.Transport.position).toSeconds();
        
        if (direction === 'next'){
            Tone.Transport.position = findBetween(currentTime, moduleMarkers)['next']
        }
        if (direction === 'previous'){
            Tone.Transport.position = findBetween(currentTime, moduleMarkers)['previous']
        }
        if (direction === 'current'){
            Tone.Transport.position = findBetween(currentTime, moduleMarkers)['current']
        }
    }

    //===

    

    var synths = []
    for (var i = 0; i < 3; i++){
        synths[i] = new Tone.PolySynth(Tone.Synth).toDestination();
    }

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
    for (var NUM = 0; NUM < instruments.length; NUM++){
        
    var stringWidth = 0.5;
    var y = 10;
    var x = 80;
    //length of imaginary guitar if shown in full
    var scaleLength = 2400;
    var fretNumber = instruments[NUM]['fretNumber'];
    var tuning = instruments[NUM]['tuning']
    var scale = instruments[NUM]['scale']
    var instrumentType = instruments[NUM]['instrument']
    var noteColor = instruments[NUM]['noteColors'];
    var fretPositions = []
    for (var k = 1; k < fretNumber + 1; k++){
        var result = 40 + (scaleLength - (scaleLength/(Math.pow(2, k/12))))
        fretPositions.push(result)
    }
    var svgLength = 2 + fretPositions[fretPositions.length -1]
    var svgHeight = 20 + ((instruments[NUM]['tuning'].length - 1) * 50);

    // eslint-disable-next-line no-loop-func
    function distanceFromFret(n){
        var realLength = scaleLength; 
        var result = realLength - (realLength/(Math.pow(2, n/12)))
        return result;
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("width", svgLength);
    svg.setAttribute("id", "svg" + NUM)
    svg.setAttribute("class", "GuitarSVG")
    
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
    
    for (var j = 0; j < fretNumber + 1; j++){
    var fret = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    fret.setAttribute('x1', fretPositions[j]);
    fret.setAttribute('x2', fretPositions[j]);
    fret.setAttribute('y1', 0);
    fret.setAttribute('y2', svgHeight);
    fret.setAttribute("stroke-width", "4");
    fret.setAttribute("stroke", "#C0C0C0");
    svg.appendChild(fret);
    }
    //fret markers
    //1 3 5 7 12 15 17 19 21 24
    //12th fret marker
    var fretMarker121 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker121.setAttribute('cx', ((fretPositions[10] + fretPositions[11])/2));
    fretMarker121.setAttribute('cy', ((svgHeight - 10) * 1/3));
    fretMarker121.setAttribute('r', 10);
    fretMarker121.setAttribute('fill', 'black');
    fretMarker121.setAttribute('class', 'fretmarker');
    fretMarker121.setAttribute('id', 'fretmarker121' + NUM);
    svg.appendChild(fretMarker121);

    var fretMarker122 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker122.setAttribute('cx', ((fretPositions[10] + fretPositions[11])/2));
    fretMarker122.setAttribute('cy', ((svgHeight + 10) * 2/3));
    fretMarker122.setAttribute('r', 10);
    fretMarker122.setAttribute('fill', 'black');
    fretMarker122.setAttribute('class', 'fretmarker');
    fretMarker122.setAttribute('id', 'fretmarker122' + NUM);
    svg.appendChild(fretMarker122);

    //24th fret marker
    var fretMarker241 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker241.setAttribute('cx', ((fretPositions[22] + fretPositions[23])/2));
    fretMarker241.setAttribute('cy', ((svgHeight - 10) * 1/3));
    fretMarker241.setAttribute('r', 10);
    fretMarker241.setAttribute('fill', 'black');
    fretMarker241.setAttribute('class', 'fretmarker');
    fretMarker241.setAttribute('id', 'fretmarker241' + NUM);
    svg.appendChild(fretMarker241);

    var fretMarker242 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker242.setAttribute('cx', ((fretPositions[22] + fretPositions[23])/2));
    fretMarker242.setAttribute('cy', ((svgHeight + 10) * 2/3));
    fretMarker242.setAttribute('r', 10);
    fretMarker242.setAttribute('fill', 'black');
    fretMarker242.setAttribute('class', 'fretmarker');
    fretMarker242.setAttribute('id', 'fretmarker242' + NUM);
    svg.appendChild(fretMarker242);

    //36th fret marker
    // var fretMarker361 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    // fretMarker241.setAttribute('cx', ((fretPositions[34] + fretPositions[35])/2));
    // fretMarker241.setAttribute('cy', ((svgHeight - 10) * 2/3));
    // fretMarker241.setAttribute('r', 10);
    // fretMarker241.setAttribute('fill', 'black');
    // fretMarker241.setAttribute('class', 'fretmarker');
    // fretMarker241.setAttribute('id', 'fretmarker361' + NUM);
    // svg.appendChild(fretMarker361);

    // var fretMarker362 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    // fretMarker242.setAttribute('cx', ((fretPositions[34] + fretPositions[35])/2));
    // fretMarker242.setAttribute('cy', ((svgHeight + 10) * 1/3));
    // fretMarker242.setAttribute('r', 10);
    // fretMarker242.setAttribute('fill', 'black');
    // fretMarker242.setAttribute('class', 'fretmarker');
    // fretMarker242.setAttribute('id', 'fretmarker362' + NUM);
    // svg.appendChild(fretMarker362);

    //Rest of the fretmarkers
    var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 21]
    // var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 19, 21, 27, 29, 31, 33]
    for (var i = 0; i < fretMarkerPositions.length; i++){
    var fretMarker = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    fretMarker.setAttribute('cx', ((fretPositions[fretMarkerPositions[i] - 2] + fretPositions[fretMarkerPositions[i] -1])/2));
    fretMarker.setAttribute('cy', svgHeight/2);
    fretMarker.setAttribute('r', 10);
    fretMarker.setAttribute('fill', 'black');
    fretMarker.setAttribute('class', 'fretmarker');
    svg.appendChild(fretMarker);
    }
    //strings
    if (bassInstruments.includes(instrumentType)){
        stringWidth += 2;
    }
    for (var i = 0; i < tuning.length; i++) {
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
            if (l === 0){
                note.setAttribute('cx', 20);
            } else if (l === 1){
                note.setAttribute('cx', (40 + fretPositions[0])/2)
            } else {
                note.setAttribute('cx', (fretPositions[l -2] + fretPositions[l -1])/2)
            }
            note.setAttribute('cy', noteY);
            note.setAttribute('r', 15);
            if (noteColor === 'black'){
                note.setAttribute('fill', "black");
            } else {
                note.setAttribute('fill', shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06) ));
            }
            note.setAttribute('stroke', "azure");
            note.setAttribute('stroke-width', "2");
            note.setAttribute('class', noteValues[index]["name"] + '_' + NUM + ' note_' + NUM + ' note');
            note.setAttribute('id', (k + 1) + "_" + l + "_" + NUM);
            var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            if (l === 0){
                noteName.setAttribute('x', 20);
            } else if (l === 1){
                noteName.setAttribute('x', (40 + fretPositions[0])/2)
            } else {
                noteName.setAttribute('x', (fretPositions[l -2] + fretPositions[l -1])/2)
            }
            noteName.setAttribute('y', noteY);
            noteName.setAttribute('text-anchor', 'middle');
            if (noteColor === 'black'){
                noteName.setAttribute('fill', "white");
            } else {
                noteName.setAttribute('fill', 'black');
            }
            noteName.setAttribute('dominant-baseline', 'middle');
            noteName.setAttribute('font-size', '15px');
            noteName.setAttribute('class', noteValues[index]["name"] + '_' + NUM + '_name notename_' + NUM + ' notename' )
            noteName.setAttribute('id', (k + 1) + "_" + l + "_" + NUM + "_name");
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

        const guitarDiv = document.getElementById(`divGuitar${NUM}`);

        if (guitarDiv.firstChild){
            while (guitarDiv.firstChild){
                guitarDiv.removeChild(guitarDiv.firstChild)
            }
        }
        guitarDiv.appendChild(svg)
    }
    
}
//invis all notes by board
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

function displayNotes(notesArr, tuning){
    var displayArr = [];
    for (var i = 0; i < notesArr.length; i++){
        for (var j = 0; j < noteValues.length; j++){
            if (noteValues[j]['note'] === notesArr[i]){
                var currentPositions = positionNamer(noteValues[j]['name'], tuning)
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
    var x = document.getElementById('5_7_1');
    var y = document.getElementById('5_7_1_name')
    if (x !== null && y !==null){
        x.setAttribute('visibility', 'hidden')
        y.setAttribute('visibility', 'hidden')
    }
}

function invisByClassName(){
    var x = document.getElementById('5_7_1');
    var y = document.getElementById('5_7_1_name')
    if (x !== null && y !==null){
        x.setAttribute('visibility', 'hidden')
        y.setAttribute('visibility', 'hidden')
    }
}

function setUpMute(){
    // var vol = new Tone.Volume(-12);
    allSynths['acoustic_guitar_nylon'].volume.value = -16;
    allSynths['acoustic_bass'].volume.value = -16;
    console.log('what?')
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


// var bestFingeringTest = [["2_9", "3_7", "4_5", "5_3"], ["2_9", "3_7", "5_10", "6_8"], ["2_9", "4_12", "5_10", "6_8"]];

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

function positionNamer(notesArr, tuning){
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

//bpm ish
var globalInt = 500;
const synth = new Tone.PolySynth(Tone.Synth).toDestination();


async function soundNotes(){
    synth.triggerAttackRelease(midiData[playPosition], globalInt/1000);
}
//data can be array or array of arrays
function playNotes(){

var currentArray = [];
var previousArray = [];
var positions = positionNamer(midiData[playPosition], ['E4','B3','G3','D3','A2','E2']);
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
    
    if (globalPosition.current < 0){
        for (var w = 0; w < currentArray.length; w++){
            var x = document.getElementsByClassName(currentArray[w]);
            var y = document.getElementsByClassName(currentArray[w] + 'name');
    
            for (var j = 0; j < x.length; j++){
                x[j].setAttribute('visibility', '');
                y[j].setAttribute('visibility', '');
            }
        }
    } else {
        var pos = (positions[globalPosition.current] || positions[positions.length - 1]);
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

function sequenceIntoNotesAndPositions(sequence, tuning){
    if (tuning === undefined){
        tuning = ['E4','B3','G3','D3','A2','E2']
    }
    var flatData = flattenNotes(sequence);
    var flatReturn = [];
    var positionReturn = [];
    for (var i = 0; i < flatData.length; i++){
        flatReturn.push(noteStringHandler(flatData[i]))
    }
    for (var j = 0; j < flatReturn.length; j++){
        positionReturn.push(positionNamer(flatReturn[j], tuning))
    }
    var returnObj = {};
    returnObj['notes'] = flatReturn;
    returnObj['positions'] = positionReturn;
    return returnObj;
}

function playNoteSequence(sequence, instrumentNumber){
var cleanData = sequenceIntoNotesAndPositions(sequence)
var flatData = cleanData.notes;
var currentArray = [];
var playPosition = 0;
var positions = cleanData.positions
Tone.Transport.cancel();
const synthPart = new Tone.Sequence(
        function(time, note) {
          if (note !== 'X'){
              synths[0].triggerAttackRelease(noteStringHandler(note), 0.1, time);
              
          }
          //hide all
            var x = document.getElementsByClassName('note_' + instrumentNumber);
            var y = document.getElementsByClassName('notename_' + instrumentNumber);
            for (var i = 0; i < x.length; i++){
                x[i].setAttribute('visibility', 'hidden');
                y[i].setAttribute('visibility', 'hidden');
                }
              //============== Play notes
              if (note !== 'X'){
                currentArray = flatData[playPosition];
                if (globalPosition.current < 0){
                    for (var w = 0; w < currentArray.length; w++){
                        var x = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber);
                        var y = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber + '_name');
                        if (x !== undefined && y !== undefined){
                            for (var j = 0; j < x.length; j++){
                                x[j].setAttribute('visibility', '');
                                y[j].setAttribute('visibility', '');
                            }
                        } else {
                            console.log('off Model!')
                        }
                    }
                } else {
                    var pos = (positions[playPosition][globalPosition.current] || positions[playPosition][positions[playPosition].length -1]);
                    var tabArray = []
                    if (pos !== undefined){
                        for (var w = 0; w < pos.length; w++){
                            var x = document.getElementById(pos[w] + '_' + instrumentNumber);
                            var y = document.getElementById(pos[w] + '_' + instrumentNumber + '_name');
                            x.setAttribute('visibility', '');
                            y.setAttribute('visibility', '');
                            tabArray.push(x.getAttribute('id')); 
                        }
                        generateTab(tabArray);
                    } else {
                        console.log('off Model!')
                    }
                }
              }

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

//======

function loadNoteSequenceAndVisualDataOntoTimeline(data){
    Tone.Transport.cancel();
    var playPositions = [];
    for (var j = 0; j < data.length; j++){
        playPositions.push(0)
    }
    function returnPosition(note, tuning){
        if (positionNamer(noteStringHandler(note), tuning)[globalPosition.current] === undefined){
            return positionNamer(noteStringHandler(note), tuning)[positionNamer(noteStringHandler(note), tuning).length -1]
        } else {
            return positionNamer(noteStringHandler(note), tuning)[globalPosition.current]
        }
    }
    function setUpSequence(data, instrument, instrumentNumber){
        for (var i = 0; i < data.length; i++){
            var tuning = instruments[instrumentNumber]['tuning']
            new Tone.Sequence(
                 // eslint-disable-next-line no-loop-func
                 function(time, note) {
                  if (note !== 'X'){
                      instrument.triggerAttackRelease(noteStringHandler(note), 0.5, time);
                      
                  }
                  var currentTime = Tone.Time(Tone.Transport.position).toSeconds()
                  setModule(findBetween(currentTime, moduleMarkerCreatorCompact(data))['playingIndex'])
                  //
                  //hide all
                var x = document.getElementsByClassName('note_' + instrumentNumber);
                var y = document.getElementsByClassName('notename_' + instrumentNumber);
            for (var i = 0; i < x.length; i++){
                x[i].setAttribute('visibility', 'hidden');
                y[i].setAttribute('visibility', 'hidden');
                }
                //============== Display Notes
              if (note !== 'X'){
                var currentArray = noteStringHandler(note);
                if (globalPosition.current < 0){
                    for (var w = 0; w < currentArray.length; w++){
                        var x = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber);
                        var y = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber + '_name');
                        if (x !== null && y !== null){
                            for (var j = 0; j < x.length; j++){
                                x[j].setAttribute('visibility', '');
                                y[j].setAttribute('visibility', '');
                            }
                        } else {
                            console.log('off Model!')
                        }
                    }
                } else {
                    var pos = returnPosition(note, tuning);
                    // var tabArray = []
                    if (pos !== undefined){
                        for (var w = 0; w < pos.length; w++){
                            var x = document.getElementById(pos[w] + '_' + instrumentNumber);
                            var y = document.getElementById(pos[w] + '_' + instrumentNumber + '_name');
                            if (x !== null && y !== null){
                                x.setAttribute('visibility', '');
                                y.setAttribute('visibility', '');
                            }
                            // tabArray.push(x.getAttribute('id')); 
                        }
                        // generateTab(tabArray);
                    } else {
                        console.log('off Model!')
                    }
                }
              }

        if (playPosition < flattenNotes(data).length - 1){
            playPosition++;
        } else {
            playPosition = 0;
        }
                },
               data[i]['notes'],
                data[i]['speed']
              )
              
                .start(moduleMarkers[i])
                .loop = 1;
            }  
    }
   
    for (var j = 0; j < data.length; j++){
        setUpSequence(data[j]['data'], allSynths[instruments[j]['instrument']], j)
    }
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
    createGuitarSVG();
    // invisAll()
    showAll()
}, [instruments]);


useEffect (()=>{
    if (scaleData.length !== 0){
        var clone = [...instruments]
        clone[0]['scale'] = scaleData
        setInstruments(clone)
    }
}, [scaleData]);

const tuningOptions = [
    {key: 'Standard', text: 'EADGBE', value: ['E4', 'B4', 'G3', 'D3', 'A2', 'E2']},
    {key: 'Bass', text: 'Bass: EADG', value: ['E4', 'B4', 'G2', 'D2', 'A1', 'E1']},
    {key: 'DADGAD', text: 'DADGAD', value: ['D4', 'A3', 'G3', 'D3', 'A2', 'D2']},
    {key: 'P4', text: 'P4', value: ['F4', 'C4', 'G3', 'D3', 'A2', 'E2']},
    {key: 'DropD', text: 'DropD', value: ['E4', 'B4', 'G3', 'D3', 'A2', 'D2']},
]

const instrumentOptions = [
    {key: 'acoustic_bass', text: 'Acoustic Bass', value: 'acoustic_bass'},
    {key: 'electic_bass_finger', text: 'Electric Bass ', value: 'electric_bass_finger'},
    {key: 'acoustic_guitar_nylon', text: 'Acoustic Guitar Nylon', value: 'acoustic_guitar_nylon'},
    {key: 'acoustic_guitar_steel', text: 'Acoustic Guitar Steel', value: 'acoustic_guitar_steel'},
    {key: 'electric_guitar_clean', text: 'Electric Guitar Clean', value: 'electric_guitar_clean'},
    {key: 'electric_guitar_jazz', text: 'Electric Guitar Jazz', value: 'electric_guitar_jazz'},
    {key: 'electri_distortion_guitar', text: 'Electric Guitar Distorted', value: 'electric_distortion_guitar'},

]

function handleStringChange(direction, instrumentNumber){
    Tone.Transport.pause();
    var clone = [...instruments]
    var tuning = clone[instrumentNumber]["tuning"]
    var stringNumber = clone[instrumentNumber]["stringNumber"]
    if (direction === 'down'){
        if (stringNumber !== 1){
            tuning.pop()
            stringNumber = tuning.length;
            setInstruments(clone)
        }
    } 
    if (direction === 'up'){
        var newNote = noteValues[findIndex(tuning[tuning.length - 1]) - 5];
        if (newNote === undefined){
            return
        } else {
        tuning.push(newNote['name'])
        stringNumber = stringNumber + 1
        setInstruments(clone)
        }
    }
}

function handleFretChange(direction, instrumentNumber){
    Tone.Transport.pause();
    var clone = [...instruments]
    if (direction === 'down'){
        clone[instrumentNumber]["fretNumber"] = clone[instrumentNumber]["fretNumber"] - 1
        setInstruments(clone)
    }
    if (direction === 'up'){
        clone[instrumentNumber]["fretNumber"] = clone[instrumentNumber]["fretNumber"] + 1
        setInstruments(clone)
    }  
    
}

const onChangeTuning = (e, {id, value}) => {
    var clone = [...instruments]
    var idx = Number(id.split("_")[1])
    clone[idx]['tuning'] = value
    setInstruments(clone)
  }

const onChangeInstrument = (e, {id, value}) => {
   
    var clone = [...instruments]
    var idx = Number(id.split("_")[1])

   if (guitarInstruments.includes(value)){
       clone[idx] = guitarPrototype
       
   }
   if (bassInstruments.includes(value)){
    clone[idx] = bassPrototype
    }
    clone[idx]['instrument'] = value;
    setInstruments(clone)
  }

function mapGuitarSVGContainers(instruments){
    var clone = [...instruments]
    return(
       instruments.map((instruments, idx) =>
            <div id={'SVGContainer' + idx} key={'SVGContainer' + idx}>
        <Button.Group>
            <Button compact basic onClick={()=> handleStringChange('down', idx)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Strings: {clone[idx]['tuning'].length}
            </Segment>
            <Button compact basic onClick={()=> handleStringChange('up', idx)}> <Icon name ='right arrow'/></Button>
        </Button.Group>
        <Dropdown
        search
        selection
        id={`instrument_${idx}`}
        options={instrumentOptions}
        onChange={onChangeInstrument}
        defaultValue={clone[idx]['instrument']}
        />
        <Dropdown
        placeholder={'custom:' + clone[idx]['tuning']}
        search
        selection
        id={`tuning_${idx}`}
        onChange={onChangeTuning}
        options={tuningOptions}
        defaultValue={clone[idx]['tuning']}
        />
        <Button.Group>
            <Button compact basic onClick={()=> handleFretChange('down', idx)}> <Icon name ='left arrow'/></Button>
            <Segment>
            Frets: {clone[idx]['fretNumber']}
            </Segment>
            <Button compact basic onClick={()=> handleFretChange('up', idx)} > <Icon name ='right arrow'/></Button>
        </Button.Group>
        <div id={`divGuitar${idx}`}></div>
        </div>
        )
    )
}
//Make invisible on load
function addRemoveGuitars(action){
    var clone = [...instruments]
    if (action === 'add'){
        clone.push(guitarPrototype)
        setInstruments(clone)
    }
    if (action === 'remove'){
        clone.pop()
        setInstruments(clone)
    }
}



//Notes for Arrow forward, etc, Make seperate functions for 'nudge'. If in General Mode, nudge moves you 1 quarter note, if in Focus, nudge moves you to the next note!
    return (
        <>
        {mapGuitarSVGContainers(instruments)}
        <Button compact basic onClick={() => setData(data2)}>Load</Button>
        <Button compact basic onClick={() => setData(data3)}>Load 3</Button>
        <Button compact basic onClick={() => setData(data1)}>Load 1</Button>
        <Button compact basic onClick={() => Tone.Transport.stop()}><Icon name='stop'/></Button>
        <Button compact basic onClick={() => Tone.Transport.pause()}><Icon name='pause'/></Button>
        <Button compact basic onClick={() => Tone.Transport.start()}><Icon name='play'/> </Button>
        <Button compact basic onClick={() => globalPosition.current = -1}><Icon name='arrows alternate vertical'/></Button>
        <Button compact basic onClick={()=>playNotes()}><Icon name='step backward'/></Button>
        <Button compact basic onClick={() => globalPosition.current--}><Icon name='arrow down'/></Button>
        <Button compact basic onClick={() => globalPosition.current++}><Icon name='arrow up'/></Button>
        <Button compact basic onClick={()=>playNotes()}><Icon name='step forward'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('previous')} ><Icon name='fast backward'/></Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('current')} >current</Button>
        <Button compact basic onClick={() => handlePreviousNextModulePlay('next')}><Icon name='fast forward'/></Button>
        <Button compact basic active={loop === true} onClick={()=>loopOn()}><Icon name='retweet'/></Button>
        <Button compact basic onClick={()=>invisAll()} ><Icon name='eye'/></Button>
        <Button compact basic onClick={() => addRemoveGuitars('add')} >Add Guitar</Button>
        <Button compact basic onClick={() => addRemoveGuitars('remove')} >Remove Guitar</Button>
        <Button compact basic onClick={() => console.log(allSynths['acoustic_guitar_nylon'])} >Data?</Button>
        <Button compact basic onClick={() => setUpMute()} >Mute</Button>
        <Button compact basic onClick={() => showAll()} >Show All</Button>
       
        </>
    )
}
