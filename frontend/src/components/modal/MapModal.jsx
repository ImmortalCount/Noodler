import React, { useState } from "react";
import { Button, Dropdown, Checkbox } from "semantic-ui-react";
import { setRecommendedDiatonicScale, setRecommendedScale } from "../lab/chordMapGenerator";
import "./modal.css";

function MapModal({mapObj, handleMapChords, masterScale}) {
  const [isOpen, setIsOpen] = useState(false);
  const [overwriteOptions, setOverwriteOptions] = useState('overwrite')
  const [scaleSelectOptions, setScaleSelectOptions] = useState('diatonic')
  const [selectInstruments, setSelectInstruments] = useState([])
  const [key, setKey] = useState('C')

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  } 

  function handleSetScale(chord, key, masterScale){
    if (scaleSelectOptions === 'diatonic'){
      return setRecommendedDiatonicScale(chord, key, masterScale)
    }
    if (scaleSelectOptions === 'modal'){
      return setRecommendedScale(chord, key)
    }
  }

  function handleSelectInstruments(instrument){
    let clone = [...selectInstruments]
    if (clone.includes(instrument)){
      clone = clone.filter(item => item !== instrument)
    } else {
      clone.push(instrument)
    }
    setSelectInstruments(clone)
  }
  const mapMapObj = () => {
    return mapObj.map((chords, idx) => <div key={idx}>
      {chords.name} - {handleSetScale(chords.chord, key, masterScale)}
    </div>)
  }
  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header" style={{backgroundColor: 'teal'}}>
              <h2>
                Map Chords to Player
                </h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
            <h3>Overwrite or Append</h3>
            <div className="overwrite_select" style={{display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px'}}>
              <Checkbox 
              label='overwrite'
              checked={overwriteOptions === 'overwrite'}
              onClick={() => setOverwriteOptions('overwrite')}
              />
              <Checkbox 
              label='append'
              checked={overwriteOptions === 'append'}
              onClick={() => setOverwriteOptions('append')}
              />
             </div>
             <h3> Instruments </h3>
            <div className="instrument_select" style={{display: 'flex', flexWrap:'wrap', gap: '20px', marginBottom: '20px'}}>
              <Checkbox 
              label='1'
              checked={selectInstruments.includes('1')}
              onClick={() => handleSelectInstruments('1')}
              />
              <Checkbox 
              label='2'
              checked={selectInstruments.includes('2')}
              onClick={() => handleSelectInstruments('2')}
              />
            </div>
            <h3>Scale Select Type</h3>
            <div className="scale_select" style={{display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px'}}>
              <Checkbox 
              label='diatonic'
              checked={scaleSelectOptions === 'diatonic'}
              onClick={() => setScaleSelectOptions('diatonic')}
              />
              <Checkbox 
              label='modal'
              checked={scaleSelectOptions === 'modal'}
              onClick={() => setScaleSelectOptions('modal')}
              />
             </div>
             <h3>Key</h3>
            <div className="key_select" style={{display: 'flex', flexWrap:'wrap', gap: '20px', marginBottom: '20px'}}>
              <Checkbox 
              label='C'
              checked={key === 'C'}
              onClick={() => setKey('C')}
              />
              <Checkbox 
              label='C#'
              checked={key === 'C#'}
              onClick={() => setKey('C#')}
              />
              <Checkbox 
              label='Db'
              checked={key === 'Db'}
              onClick={() => setKey('Db')}
              />
              <Checkbox 
              label='D'
              checked={key === 'D'}
              onClick={() => setKey('D')}
              />
              <Checkbox 
              label='D#'
              checked={key === 'D#'}
              onClick={() => setKey('D#')}
              />
              <Checkbox 
              label='Eb'
              checked={key === 'Eb'}
              onClick={() => setKey('Eb')}
              />
              <Checkbox 
              label='E'
              checked={key === 'E'}
              onClick={() => setKey('E')}
              />
              <Checkbox 
              label='F#'
              checked={key === 'F#'}
              onClick={() => setKey('F#')}
              />
              <Checkbox 
              label='Gb'
              checked={key === 'Gb'}
              onClick={() => setKey('Gb')}
              />
              <Checkbox 
              label='G'
              checked={key === 'G'}
              onClick={() => setKey('G')}
              />
              <Checkbox 
              label='G#'
              checked={key === 'G#'}
              onClick={() => setKey('G#')}
              />
              <Checkbox 
              label='Ab'
              checked={key === 'Ab'}
              onClick={() => setKey('Ab')}
              />
              <Checkbox 
              label='A'
              checked={key === 'A'}
              onClick={() => setKey('A')}
              />
              <Checkbox 
              label='A#'
              checked={key === 'A#'}
              onClick={() => setKey('A#')}
              />
              <Checkbox 
              label='Bb'
              checked={key === 'Bb'}
              onClick={() => setKey('Bb')}
              />
              <Checkbox 
              label='B'
              checked={key === 'B'}
              onClick={() => setKey('B')}
              />
             </div>
              <h3>Scale Preview</h3>
              <div className="scale_preview" style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: '15px', marginBottom: '20px', height: '200px'}}>
              {mapMapObj()}
              </div>
            </main>
            <Button onClick={() => handleMapChords(key, scaleSelectOptions)}>Map</Button>
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}>Map</Button>
    </>
  );
}

export default MapModal