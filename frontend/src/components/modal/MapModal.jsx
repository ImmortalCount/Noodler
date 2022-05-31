import React, { useEffect, useState } from "react";
import { Button, Dropdown, Checkbox } from "semantic-ui-react";
import { setRecommendedDiatonicScale, setRecommendedScale } from "../lab/chordMapGenerator";
import "./modal.css";

function MapModal({mapObj, handleMapChords, masterScale, masterInstrumentArray}) {
  const [isOpen, setIsOpen] = useState(false);
  const [overwriteOptions, setOverwriteOptions] = useState('append')
  const [scaleSelectOptions, setScaleSelectOptions] = useState('diatonic')
  const [selectInstruments, setSelectInstruments] = useState([])
  const [key, setKey] = useState('C')
  const allKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  } 

  useEffect(() => {
    if (masterScale){
      let root = masterScale[0];
      setKey(root)
    }
  }, [masterScale])

  useEffect(() => {
    if (masterInstrumentArray){
      let tempArr = [];
      for (let i = 0; i < masterInstrumentArray.length; i++){
        tempArr.push(1)
      }
      setSelectInstruments(tempArr)
    }
  }, [masterInstrumentArray])

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
    if (clone[instrument] === 0){
      clone[instrument] = 1
    } else if (clone[instrument] === 1){
      clone[instrument] = 0
    } else {
      return
    }
    setSelectInstruments(clone)
  }

  const mapInstrumentCheckboxes = () => {
    return masterInstrumentArray.map((instrument, idx) =>  <Checkbox 
    label={instrument}
    key={idx}
    checked={selectInstruments[idx] === 1}
    onClick={() => handleSelectInstruments(idx)}
    />)
  }
  const mapAllKeyCheckboxes = () => {
    return allKeys.map((thisKey, idx) => <Checkbox 
    label={thisKey}
    key={idx}
    checked={key === thisKey}
    onClick={() => setKey(thisKey)}
    />)
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
            <h3>Append or Overwrite</h3>
            <div className="overwrite_select" style={{display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px'}}>
            <Checkbox 
              label='append'
              checked={overwriteOptions === 'append'}
              onClick={() => setOverwriteOptions('append')}
              />
              <Checkbox 
              label='overwrite'
              checked={overwriteOptions === 'overwrite'}
              onClick={() => setOverwriteOptions('overwrite')}
              />
             </div>
             <h3> Instruments </h3>
            <div className="instrument_select" style={{display: 'flex', flexWrap:'wrap', gap: '20px', marginBottom: '20px'}}>
              {mapInstrumentCheckboxes()}
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
            <div className="key_select" style={{display: 'flex', flexWrap:'wrap', gap: '10px', marginBottom: '20px', marginRight: '10px'}}>
             {mapAllKeyCheckboxes()}
             </div>
              <h3>Scale Preview</h3>
              <div className="scale_preview" style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: '15px', marginBottom: '20px', height: '200px'}}>
              {mapMapObj()}
              </div>
            </main>
            <Button onClick={() => handleMapChords(key, scaleSelectOptions, selectInstruments, overwriteOptions)}>Map</Button>
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}>Map</Button>
    </>
  );
}

export default MapModal