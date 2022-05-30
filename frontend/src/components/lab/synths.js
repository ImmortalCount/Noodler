import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments';
export const keySynth = new Tone.Synth().toDestination()
export const polySynth = new Tone.Sampler(instrumentSamples.acoustic_guitar_nylon).toDestination()
export const drumKit = new Tone.Sampler(instrumentSamples.drumkit_jazz).toDestination()
