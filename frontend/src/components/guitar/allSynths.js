import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments'


const possibleSynths = {
    'acoustic_bass': new Tone.Sampler(instrumentSamples.acoustic_bass).toDestination(),
    'electric_bass_finger': new Tone.Sampler(instrumentSamples.electric_bass_finger).toDestination(),
    'acoustic_guitar_nylon': new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination(),
    'acoustic_guitar_steel': new Tone.Sampler(instrumentSamples.acoustic_guitar_steel).toDestination(),
    'electric_distortion_guitar': new Tone.Sampler(instrumentSamples.electric_distortion_guitar).toDestination(),
    'electric_guitar_clean': new Tone.Sampler(instrumentSamples.electric_guitar_clean).toDestination(),
    'electric_guitar_jazz': new Tone.Sampler(instrumentSamples.electric_guitar_jazz).toDestination(),
}

//synths in use
export const currentSynths = {
    // 'acoustic_bass': new Tone.Sampler(instrumentSamples.acoustic_bass).toDestination(),
    // 'acoustic_bass_2': new Tone.Sampler(instrumentSamples.acoustic_bass).toDestination(),
    // 'electric_bass_finger': new Tone.Sampler(instrumentSamples.electric_bass_finger).toDestination(),
    // 'electric_bass_finger_2': new Tone.Sampler(instrumentSamples.electric_bass_finger).toDestination(),
    'acoustic_guitar_nylon': new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination(),
    // 'acoustic_guitar_nylon_2': new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination(),
    // 'acoustic_guitar_steel': new Tone.Sampler(instrumentSamples.acoustic_guitar_steel).toDestination(),
    // 'acoustic_guitar_steel_2': new Tone.Sampler(instrumentSamples.acoustic_guitar_steel).toDestination(),
    // 'electric_guitar_clean': new Tone.Sampler(instrumentSamples.electric_guitar_clean).toDestination(),
    // 'electric_guitar_clean_2': new Tone.Sampler(instrumentSamples.electric_guitar_clean).toDestination(),
    // 'electric_guitar_jazz': new Tone.Sampler(instrumentSamples.electric_guitar_jazz).toDestination(),
    // 'electric_guitar_jazz_2': new Tone.Sampler(instrumentSamples.electric_guitar_jazz).toDestination(),
}

export function nameOfNewSynthSource(newSynthRequest, instruments){
    let numberOfSimilarSynthsInUse = 0;
for (let i = 0; i < instruments.length; i++){
    if (newSynthRequest === instruments[i]['instrument']){
        numberOfSimilarSynthsInUse++
    }
}
    let newSynthName;
    if (numberOfSimilarSynthsInUse === 0){
        newSynthName = newSynthRequest
    } else {
        newSynthName = newSynthRequest + '_' + (numberOfSimilarSynthsInUse + 1)
    }

    return newSynthName
}