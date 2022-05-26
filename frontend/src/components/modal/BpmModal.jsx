import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import * as Tone from 'tone';
import "./modal.css";

function BpmModal() {
  const [isOpen, setIsOpen] = useState(false);


  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  } 

  const handleBpmChange = (e) => {
    Tone.Transport.bpm.value = e.target.value;
  }

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header" style={{backgroundColor: 'teal'}}>
              <h2>
                  Bpm
                </h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
              <h3>Bpm: {Tone.Transport.bpm.value}</h3>
              <input type="range" min='1' max='500' step='1' defaultValue={120} onChange={handleBpmChange}/>
            </main>
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}>BPM</Button>
    </>
  );
}

export default BpmModal