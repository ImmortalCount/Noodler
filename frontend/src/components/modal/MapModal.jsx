import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from 'react-redux';
import "./modal.css";
import { insertData } from '../../store/actions/dataPoolActions';

function MapModal({mapObj, handleMapChords}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState(false)
  const [overwriteOptions, setOverwriteOptions] = useState('overwrite')
  const [scaleSelectOptions, setScaleSelectOptions] = useState('diatonic')

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setMessageDisplay(false)
  } 

  const overwriteOptionsDropdown = [
    { key: 'overwrite', text: 'overwrite', value: 'overwrite'},
    { key: 'append', text: 'append', value: 'append'},
  ]

  const scaleSelectOptionsDropdown = [
    { key: 'diatonic', text: 'diatonic', value: 'diatonic'},
    { key: 'modal', text: 'modal', value: 'modal'},
  ]

  const dispatch = useDispatch()

  const mapMapObj = () => {
    return mapObj.map((chords, idx) => <div key={idx}>
      {chords.name}
    </div>)
  }
  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header">
              <h2>
                {overwriteOptions === 'append' 
                ? 'Append chords to selected instruments on the player' 
                : 'Overwrite chords to selected instruments on the player'}
                {scaleSelectOptions === 'diatonic' 
                ? ' using diatonic scale select' 
                : ' using modal scale select'}
                </h2>
              <Dropdown
              simple
              item
              className='button icon'
              options={overwriteOptionsDropdown}
              onChange={((e, {value}) => setOverwriteOptions(value))}
              trigger={<></>}
            />
            <Dropdown
              simple
              item
              className='button icon'
              options={scaleSelectOptionsDropdown}
              onChange={((e, {value}) => setScaleSelectOptions(value))}
              trigger={<></>}
            />
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
              <h3>chords</h3>
              {mapMapObj()}

            </main>
            <Button onClick={() => handleMapChords()}>Map</Button>
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}>Map</Button>
    </>
  );
}

export default MapModal