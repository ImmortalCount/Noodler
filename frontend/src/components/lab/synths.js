import * as Tone from 'tone';
import instrumentSamples from '../Instruments/Instruments';
export const keySynth = new Tone.Synth().toDestination()
export const polySynth = new Tone.PolySynth().toDestination()
export const drumKit = new Tone.Sampler(instrumentSamples.drumkit_jazz).toDestination()
