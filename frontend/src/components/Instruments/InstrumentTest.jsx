import React from 'react'
import * as Tone from 'tone';
import instrumentSamples from './Instruments'

export default function InstrumentTest() {
    let keyArr = []
for (const keys in instrumentSamples.acoustic_guitar_nylon.urls){
    keyArr.push(keys)
}

let urls = {
    A0: 'MusyngKite_electric_bass_finger-mp3_A0.mp3',
    A1: 'MusyngKite_electric_bass_finger-mp3_A1.mp3',
    A2: 'MusyngKite_electric_bass_finger-mp3_A2.mp3',
    A3: 'MusyngKite_electric_bass_finger-mp3_A3.mp3',
    A4: 'MusyngKite_electric_bass_finger-mp3_A4.mp3',
    A5: 'MusyngKite_electric_bass_finger-mp3_A5.mp3',
    A6: 'MusyngKite_electric_bass_finger-mp3_A6.mp3',
    A7: 'MusyngKite_electric_bass_finger-mp3_A7.mp3',
    Ab0: 'MusyngKite_electric_bass_finger-mp3_Ab0.mp3',
    Ab1: 'MusyngKite_electric_bass_finger-mp3_Ab1.mp3',
    Ab2: 'MusyngKite_electric_bass_finger-mp3_Ab2.mp3',
    Ab3: 'MusyngKite_electric_bass_finger-mp3_Ab3.mp3',
    Ab4: 'MusyngKite_electric_bass_finger-mp3_Ab4.mp3',
    Ab5: 'MusyngKite_electric_bass_finger-mp3_Ab5.mp3',
    Ab6: 'MusyngKite_electric_bass_finger-mp3_Ab6.mp3',
    Ab7: 'MusyngKite_electric_bass_finger-mp3_Ab7.mp3',
    B0: 'MusyngKite_electric_bass_finger-mp3_B0.mp3',
    B1: 'MusyngKite_electric_bass_finger-mp3_B1.mp3',
    B2: 'MusyngKite_electric_bass_finger-mp3_B2.mp3',
    B3: 'MusyngKite_electric_bass_finger-mp3_B3.mp3',
    B4: 'MusyngKite_electric_bass_finger-mp3_B4.mp3',
    B5: 'MusyngKite_electric_bass_finger-mp3_B5.mp3',
    B6: 'MusyngKite_electric_bass_finger-mp3_B6.mp3',
    B7: 'MusyngKite_electric_bass_finger-mp3_B7.mp3',
    Bb0: 'MusyngKite_electric_bass_finger-mp3_Bb0.mp3',
    Bb1: 'MusyngKite_electric_bass_finger-mp3_Bb1.mp3',
    Bb2: 'MusyngKite_electric_bass_finger-mp3_Bb2.mp3',
    Bb3: 'MusyngKite_electric_bass_finger-mp3_Bb3.mp3',
    Bb4: 'MusyngKite_electric_bass_finger-mp3_Bb4.mp3',
    Bb5: 'MusyngKite_electric_bass_finger-mp3_Bb5.mp3',
    Bb6: 'MusyngKite_electric_bass_finger-mp3_Bb6.mp3',
    Bb7: 'MusyngKite_electric_bass_finger-mp3_Bb7.mp3',
    C1: 'MusyngKite_electric_bass_finger-mp3_C1.mp3',
    C2: 'MusyngKite_electric_bass_finger-mp3_C2.mp3',
    C3: 'MusyngKite_electric_bass_finger-mp3_C3.mp3',
    C4: 'MusyngKite_electric_bass_finger-mp3_C4.mp3',
    C5: 'MusyngKite_electric_bass_finger-mp3_C5.mp3',
    C6: 'MusyngKite_electric_bass_finger-mp3_C6.mp3',
    C7: 'MusyngKite_electric_bass_finger-mp3_C7.mp3',
    D1: 'MusyngKite_electric_bass_finger-mp3_D1.mp3',
    D2: 'MusyngKite_electric_bass_finger-mp3_D2.mp3',
    D3: 'MusyngKite_electric_bass_finger-mp3_D3.mp3',
    D4: 'MusyngKite_electric_bass_finger-mp3_D4.mp3',
    D5: 'MusyngKite_electric_bass_finger-mp3_D5.mp3',
    D6: 'MusyngKite_electric_bass_finger-mp3_D6.mp3',
    D7: 'MusyngKite_electric_bass_finger-mp3_D7.mp3',
    Db1: 'MusyngKite_electric_bass_finger-mp3_Db1.mp3',
    Db2: 'MusyngKite_electric_bass_finger-mp3_Db2.mp3',
    Db3: 'MusyngKite_electric_bass_finger-mp3_Db3.mp3',
    Db4: 'MusyngKite_electric_bass_finger-mp3_Db4.mp3',
    Db5: 'MusyngKite_electric_bass_finger-mp3_Db5.mp3',
    Db6: 'MusyngKite_electric_bass_finger-mp3_Db6.mp3',
    Db7: 'MusyngKite_electric_bass_finger-mp3_Db7.mp3',
    E1: 'MusyngKite_electric_bass_finger-mp3_E1.mp3',
    E2: 'MusyngKite_electric_bass_finger-mp3_E2.mp3',
    E3: 'MusyngKite_electric_bass_finger-mp3_E3.mp3',
    E4: 'MusyngKite_electric_bass_finger-mp3_E4.mp3',
    E5: 'MusyngKite_electric_bass_finger-mp3_E5.mp3',
    E6: 'MusyngKite_electric_bass_finger-mp3_E6.mp3',
    E7: 'MusyngKite_electric_bass_finger-mp3_E7.mp3',
    Eb1: 'MusyngKite_electric_bass_finger-mp3_Eb1.mp3',
    Eb2: 'MusyngKite_electric_bass_finger-mp3_Eb2.mp3',
    Eb3: 'MusyngKite_electric_bass_finger-mp3_Eb3.mp3',
    Eb4: 'MusyngKite_electric_bass_finger-mp3_Eb4.mp3',
    Eb5: 'MusyngKite_electric_bass_finger-mp3_Eb5.mp3',
    Eb6: 'MusyngKite_electric_bass_finger-mp3_Eb6.mp3',
    Eb7: 'MusyngKite_electric_bass_finger-mp3_Eb7.mp3',
    F1: 'MusyngKite_electric_bass_finger-mp3_F1.mp3',
    F2: 'MusyngKite_electric_bass_finger-mp3_F2.mp3',
    F3: 'MusyngKite_electric_bass_finger-mp3_F3.mp3',
    F4: 'MusyngKite_electric_bass_finger-mp3_F4.mp3',
    F5: 'MusyngKite_electric_bass_finger-mp3_F5.mp3',
    F6: 'MusyngKite_electric_bass_finger-mp3_F6.mp3',
    F7: 'MusyngKite_electric_bass_finger-mp3_F7.mp3',
    G1: 'MusyngKite_electric_bass_finger-mp3_G1.mp3',
    G2: 'MusyngKite_electric_bass_finger-mp3_G2.mp3',
    G3: 'MusyngKite_electric_bass_finger-mp3_G3.mp3',
    G4: 'MusyngKite_electric_bass_finger-mp3_G4.mp3',
    G5: 'MusyngKite_electric_bass_finger-mp3_G5.mp3',
    G6: 'MusyngKite_electric_bass_finger-mp3_G6.mp3',
    G7: 'MusyngKite_electric_bass_finger-mp3_G7.mp3',
    Gb1: 'MusyngKite_electric_bass_finger-mp3_Gb1.mp3',
    Gb2: 'MusyngKite_electric_bass_finger-mp3_Gb2.mp3',
    Gb3: 'MusyngKite_electric_bass_finger-mp3_Gb3.mp3',
    Gb4: 'MusyngKite_electric_bass_finger-mp3_Gb4.mp3',
    Gb5: 'MusyngKite_electric_bass_finger-mp3_Gb5.mp3',
    Gb6: 'MusyngKite_electric_bass_finger-mp3_Gb6.mp3',
    Gb7: 'MusyngKite_electric_bass_finger-mp3_Gb7.mp3',
}

const urlArr = Object.keys(urls)

let objArr = [];
for (let i = 0; i < urlArr.length; i++){
    let returnObj = {}
    returnObj[urlArr[i]] = urls[urlArr[i]]
    objArr.push(returnObj)
}
let loadedArr = []
    for (let i = 0; i < objArr.length; i++){
        var sampler = new Tone.Sampler({ 
            urls: objArr[i],
            baseUrl: '/soundfiles/electric_bass_finger/',
            onload: () => {
                loadedArr.push(i)
                console.log(i + 'loaded');
                sampler.dispose();
            },
    })
    }



    

    
  return (
      <>
      <div>instrumenTest</div>
      <button onClick={() => Tone.Transport.start()}>Start me</button>
      <button onClick={() => Tone.Transport.stop()}>Stop me</button>
      <button onClick={() => {
    loadedArr.sort(function(a,b){return a - b}); console.log(loadedArr)}}>loaded?</button>
      </>
    

  )
}
