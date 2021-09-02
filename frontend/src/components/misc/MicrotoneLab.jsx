import React from 'react'
import * as Tone from 'tone';

export default function MicrotoneLab() {
    const synth = new Tone.Synth().toDestination();
    function harmonicSeries(start, n){
        const now = Tone.now();
        var i = 1;
        while (i < n + 1){
            console.log(start);
            synth.triggerAttackRelease( start , '8n', now + ((i - 1) * 0.15))
            start += (start * (1/i))
            i++;
        }
        
    }

    function harmonicSequence(){
        var harmonicNotes = [];
        var sequenceLength = 16;
        var start = 55;
        var n = 24;
        var i = 1;
        while (i < n + 1){
            if (start > 880){
                harmonicNotes.push(start/4)
                start += (start * (1/i))
                i++;
            }
            if (start > 440){
                harmonicNotes.push(start/2)
                start += (start * (1/i))
                i++;
            } else {
                harmonicNotes.push(start)
                start += (start * (1/i))
                i++;
            }
            
        }
        const now = Tone.now();
        for (var j = 0; j < sequenceLength; j++){
            var randomIndex = Math.floor(Math.random() * harmonicNotes.length)
        synth.triggerAttackRelease( harmonicNotes[randomIndex] , '8n', now + ((j) * 0.15))
        console.log(harmonicNotes[randomIndex])
        }
    }
    return (
        <>
        <div>
            Generate the harmonic series!
        </div>
        <button onClick={()=> harmonicSeries(55, 16)}>harmonic</button>
        <button onClick={()=> harmonicSequence()}>sequence</button>
        </>
    )
}
