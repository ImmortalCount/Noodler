import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "semantic-ui-react";
import * as Tone from 'tone';
import "./modal.css";

function FretboardDownloadModal({instruments, idx, downloadAsPng}) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('test')
  const [inputFocus, setInputFocus] = useState(false)


  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  } 

  useEffect(() => {
    if (instruments){
        setFileName(instruments['name'])
    }
}, [instruments])

function handleDownload(){
  downloadAsPng(idx, fileName)
  setIsOpen(false)
}

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header" style={{backgroundColor: 'teal'}}>
              <h3>
                  Download Fretboard
                </h3>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
            <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
             <h3>Download as: {fileName}.png</h3>
        </div>
            <Input type='text'
            value={fileName}
            id={'input_moduleLab'}
            ref={input => input && input.focus()}
            onInput={e => setFileName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
                    <Button disabled={localStorage.getItem('userInfo') === null} onClick={() => handleDownload()}>{localStorage.getItem('userInfo') === null ? 'Log-in to download fretboard diagram' : 'Download'}</Button>
            </main>
 
          </div>
        </>
      )}
      <Button basic compact onClick={openModal}><Icon name='download'/></Button>
    </>
  );
}

export default FretboardDownloadModal