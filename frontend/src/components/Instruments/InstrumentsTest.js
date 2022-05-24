import instrumentSamples from "./Instruments.js";
import * as Tone from 'tone';

let keyArr = []
for (const keys in instrumentSamples.acoustic_guitar_nylon.urls){
    keyArr.push(keys)
}


