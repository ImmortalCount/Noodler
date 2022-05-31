import React, { useRef, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import * as Tone from 'tone';
import { setBpm } from "../../store/actions/setBpmActions";
import { useDispatch} from 'react-redux';
import "./modal.css";

function BpmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [bpmDisplay, setBpmDisplay] = useState(Tone.Transport.bpm.value)

  const dispatch = useDispatch()

  const bpmApplied = useRef(false)

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  } 

  const handleBpmChange = (e) => {
    setBpmDisplay(e.target.value)
    dispatch(setBpm(e.target.value))
    Tone.Transport.bpm.value = e.target.value;
  }

  //module markers are loading wrong when bpm is changed on stop for some reason
  useEffect(() => {
    setInterval(() => {
      if (Tone.Transport.state === 'started' && bpmApplied.current === false){

        dispatch(setBpm(bpmDisplay))
        bpmApplied.current = true
      } 
      if ((Tone.Transport.state === 'stopped' || Tone.Transport.state === 'paused') && bpmApplied.current === true){
        bpmApplied.current = false
      }
    }, 50)
  }, [])

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
              <h3>Bpm: {bpmDisplay}</h3>
              <input type="range" min='1' max='500' step='1' value={bpmDisplay} onChange={handleBpmChange}/>
            </main>
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}>BPM</Button>
      
    </>
  );
}

export default BpmModal