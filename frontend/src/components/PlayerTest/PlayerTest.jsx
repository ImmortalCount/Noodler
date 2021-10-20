import React, {useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments'

export default function PlayerTest() {
    const [module, setModule] = useState(0);
    const [data, setData] = useState([
        {
        instrument: 'acoustic_guitar_nylon', 
        soundOn: true, 
        master: true, 
        data: [{speed:'4n', notes:[['D4','X', 'E4'],['F4','X', 'G4'],['A4', 'X','B4'],['D5', 'X','F5']]}, {speed:'4n', notes:[['G5','X', 'F5'],['E5','X', 'D5'],['B4','X', 'E4'],['B4', 'X','E4']]}, {speed:'4n', notes:[['C4','X', 'D4'],['E4','X', 'F4'],['G4', 'X','C4'],['D4','X', 'C4']]}, {speed:'4n' , notes:[['A4','X', 'C4'],['D4','X', 'E4'],['A5','X', 'C5'],['D5','X', 'E5']]}]
    },
    {
        instrument: 'acoustic_guitar_nylon', 
        soundOn: true, 
        master: false, 
        data: [{speed:'4n', notes:[['D2'],['D2'],['D2'],['D2']]}, {speed:'4n', notes:[['G1'],['G1'],['G1'],['G1']]}, {speed:'4n', notes:[['C1'],['C1'],['C1'],['C1']]}, {speed:'4n' , notes:[['A1'],['A1'],['A1'],['A1']]}]
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
    const [moduleMarkers, setModuleMarkers] = useState(moduleMarkerCreator(data))

    //primative load
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
}, [])


useEffect(() => {
    loadNoteSequenceOntoTimeline(data)
    console.log('loaded')
}, [data])
    
    
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

function loadNoteSequenceOntoTimeline(data){
    Tone.Transport.cancel();
    function setUpSequence(data, instrument){
        for (var i = 0; i < data.length; i++){
            new Tone.Sequence(
                 // eslint-disable-next-line no-loop-func
                 function(time, note) {
                  if (note !== 'X'){
                      instrument.triggerAttackRelease(noteStringHandler(note), 0.5, time);
                  }
                  var currentTime = Tone.Time(Tone.Transport.position).toSeconds()
                  setModule(findBetween(currentTime, moduleMarkerCreatorCompact(data))['playingIndex'])
                },
               data[i]['notes'],
                data[i]['speed']
              )
              
                .start(moduleMarkers[i])
                .loop = 1;
            }  
    }
   
    for (var j = 0; j < data.length; j++){
        setUpSequence(data[j]['data'], allSynths[data[j]['instrument']])
    }
}

    
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
        } else {
            Tone.Transport.loop = false;
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



    //BPM
    const handleBPMChange = e => {
        setBpm(e.target.value)
        Tone.Transport.bpm.value = Math.round(e.target.value);
        setModuleMarkers(moduleMarkerCreator(data))
    }

    const onChangeBPM = e => {
        setBpm(e.target.value)
    }
    //VOLUME
   function handleVolumeChange(value, channel){
    var clone = [...audioSettings]
    clone[channel]['volume'] = value;
    setAudioSettings(clone)
   }

   const onChangeVolume = e => {
    console.log(e.target.value)
}
    
function setUpMute(){
    // var vol = new Tone.Volume(-12);
    allSynths['acoustic_guitar_nylon'].volume.value = -12;
    console.log('what?')
}
    
    return (
        <>
        <div>
            Module {module}
        </div>
        <button onClick ={() => setData(data2)}>Set Data A</button>
        <button onClick ={() => setData(data3)}>Set Data B</button>
        <button onClick ={() => setData(data4)}>Set Data C</button>
        <button onClick={() => (Tone.Transport.stop())}>Stop</button>
        <button onClick={() => (Tone.Transport.start())}>Start</button>
        <button onClick={() => (Tone.Transport.pause())}>Pause</button>
        <button onClick={() => setUpMute()}>Mute</button>
        <button onClick={() => loopOn()}>Loop on</button>
        <button onClick={() => handlePreviousNextModulePlay('previous')}>Previous</button>
        <button onClick={() => handlePreviousNextModulePlay('current')}>Start Of</button>
        <button onClick={() => handlePreviousNextModulePlay('next')}>Next</button>
        <button onClick={() =>  console.log(moduleMarkerCreator(data), loopLengthCreator(data))}>test</button>
        <div>Bpm: {bpm}</div>
        <input type="range" min='0' max='999' step='1' defaultValue={bpm} onMouseUp={handleBPMChange} onChange={onChangeBPM}/>
        <div>Mixer</div>
        <div>Channel 1 {audioSettings[0]['name']} Vol: {audioSettings[0]['volume']}</div>
        <input type="range" min='-20' max='15' step='1' defaultValue={0} onMouseUp={e => handleVolumeChange(e.target.value, 0)} onChange={onChangeVolume}/>
        <div>Channel 2 {audioSettings[1]['name']} Vol: {audioSettings[1]['volume']}</div>
        <input type="range" min='-20' max='15' step='1' defaultValue={0} onMouseUp={e => handleVolumeChange(e.target.value, 1)} onChange={onChangeVolume}/>
        <div>Master Vol: 0 db</div>
        <input type="range" min='-20' max='15' step='1' defaultValue={0}/>

        </>
    )
}
