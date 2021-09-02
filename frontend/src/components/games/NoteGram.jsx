import React from 'react'
import { Chord } from '@tonaljs/tonal';

export default function NoteGram() {
    console.log(Chord.get("CM"))
    return (
        <>
        <div>
            NoteGram
        </div>
        <div>
            Play?
        </div>
        </>
    )
}
