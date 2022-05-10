import React from 'react'
import { Volume } from 'tone'

export default function Mixer() {
    const handleChangeVolume = () => {

    }
  return (
      <>
      <div>Mixer</div>
      <input type="range" min='1' max='100' step='1' defaultValue={'50'} onChange={Volume}/>
      </>
    
  )
}
