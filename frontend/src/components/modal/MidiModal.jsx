import {React, useEffect, useState} from 'react'
import { Button, Input, Checkbox} from "semantic-ui-react";
import FileSaver from 'file-saver'
import "./modal.css";

export default function MidiModal({tab, masterInstrumentArray}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputFocus, setInputFocus] = useState(false)
    const [timeSignatureFocus, setTimeSignatureFocus] = useState(false)
    const [keyFocus, setKeyFocus] = useState(false)
    const [fileName, setFileName] = useState('')
    const [timeSignature, SetTimeSignature] = useState(4)
    const [options, setOptions] = useState(false)
    const [key, setKey] = useState('C')
    const [major, setMajor] = useState(true)
    const allKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
    useEffect(() => {
        if (tab){
            setFileName(tab['name'])
        }
    }, [tab])


    function downloadMidi(){
        let blob = new Blob([tab['midi'].toArray()], {type: "audio/midi"});
        FileSaver.saveAs(blob, fileName + ".mid")
        handleClose()
    }

    function handleClose(){
        setIsOpen(false)
        setFileName(tab['name'])
    }

    const mapAllKeyCheckboxes = () => {
        return allKeys.map((thisKey, idx) => <Checkbox 
        label={thisKey}
        key={idx}
        checked={key === thisKey}
        onClick={() => setKey(thisKey)}
        />)
      }

  return (
    <>
    {isOpen && (
      <>
        <div className="overlay"></div>
        <div id='tabDownloadModal' className="modal">
          <header className="modal__header" style={{backgroundColor: 'teal'}}>
            <h3>
                Download Midi
              </h3>
            <button onClick={() => handleClose()} className="close-button">&times;</button>
          </header>
          <main className="modal__main">
          <div>
        <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
            <h3>{fileName}.mid</h3>
        </div>
            <Input type='text'
            value={fileName}
            ref={input => input && input.focus()}
            onInput={e => setFileName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
        <div>
            <h3>Instruments: {JSON.stringify(masterInstrumentArray)}</h3>
        </div>
        <div onClick={() => setTimeSignatureFocus(!timeSignatureFocus)} style={{display: !timeSignatureFocus ? '': 'none' }}>
            <h3>Time Signature: {timeSignature}/4</h3>
        </div>
            <Input type='number'
            value={timeSignature}
            ref={input => input && input.focus()}
            onInput={e => SetTimeSignature(e.target.value)}
            onBlur={() => setTimeSignatureFocus(false)}
            style={{display: timeSignatureFocus ? '': 'none' }}
            />
        <div onClick={() => setKeyFocus(!keyFocus)} style={{display: !keyFocus ? '': 'none' }}>
            <h3>Key: {key} {major ? 'Major' : 'Minor'}</h3>
        </div>
        <div onBlur={() => setKeyFocus(false)} style={{display: keyFocus ? '': 'none' }}>
        <div className="key_select" style={{display: 'flex', flexWrap:'wrap', gap: '10px', marginBottom: '20px', marginRight: '10px'}}>
        {mapAllKeyCheckboxes()}
        </div>
        <div className='major_minor'>
        <Checkbox 
        label={'major'}
        checked={major}
        onClick={() => setMajor(true)}
        />
        <Checkbox 
        label={'minor'}
        checked={!major}
        onClick={() => setMajor(false)}
        />
        </div>
        </div>
          </main>
          <Button disabled={localStorage.getItem('userInfo') === null} onClick={() => downloadMidi()}>{localStorage.getItem('userInfo') === null ? 'Log-in to download midi' : 'Download'}</Button>
        </div>
      </>
    )}
    <Button basic compact onClick={() => setIsOpen(true)}>MIDI</Button>
  </>
    
  )
}
