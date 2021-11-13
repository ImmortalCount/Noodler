import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments'

export const allSynths = {
    'acoustic_bass': new Tone.Sampler(instrumentSamples.acoustic_bass).toDestination(),
    'electric_bass_finger': new Tone.Sampler(instrumentSamples.electric_bass_finger).toDestination(),
    'acoustic_guitar_nylon': new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination(),
    'acoustic_guitar_steel': new Tone.Sampler(instrumentSamples.acoustic_guitar_steel).toDestination(),
    'electric_distortion_guitar': new Tone.Sampler(instrumentSamples.electric_distortion_guitar).toDestination(),
    'electric_guitar_clean': new Tone.Sampler(instrumentSamples.electric_guitar_clean).toDestination(),
    'electric_guitar_jazz': new Tone.Sampler(instrumentSamples.electric_guitar_jazz).toDestination(),
}