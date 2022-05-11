import {React, useEffect, useState} from 'react'
import { Button, Icon, Input} from "semantic-ui-react";
import { downloadTabAsTextFile } from '../guitar/tabfunctions.js';
import "./modal.css";

export default function TabDownloadModal({tab}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputFocus, setInputFocus] = useState(false)
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        if (tab){
            setFileName(tab['name'])
        }
    }, [tab])


    function previewTab(){
        let stringArr = tab['tab'].split('\n')
        return (
            stringArr.map((stringArr, idx) =>
                <div key={idx} style={{fontFamily: 'monospace'}}>{stringArr}</div>)
        )
    }

    function downloadTab(){
        downloadTabAsTextFile(tab['tab'], fileName)
        handleClose()
    }

    function handleClose(){
        setIsOpen(false)
        setFileName(tab['name'])
    }

  return (
    <>
    {isOpen && (
      <>
        <div className="overlay"></div>
        <div id='tabDownloadModal' className="modal">
          <header className="modal__header">
            <h3>
                Download Tab
              </h3>
            <button onClick={() => handleClose()} className="close-button">&times;</button>
          </header>
          <main className="modal__main">
          <div>
        <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
            <div>Download as: {fileName}.txt</div>
        </div>
            <Input type='text'
            value={fileName}
            id={'input_moduleLab'}
            ref={input => input && input.focus()}
            onInput={e => setFileName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
            
            <h3>Tab Preview</h3>
            <div style={{maxHeight: '500px', overflowY: 'scroll'}}>
            {previewTab()}
            </div>
            
          </main>
          <Button onClick={() => downloadTab()}>Download</Button>
        </div>
      </>
    )}
    <Button basic compact onClick={() => setIsOpen(true)}><Icon name='sort amount down'/></Button>
  </>
    
  )
}
