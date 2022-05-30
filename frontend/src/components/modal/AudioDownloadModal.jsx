import {React, useEffect, useState} from 'react'
import { Button, Icon, Input, Progress} from "semantic-ui-react";

export default function AudioDownloadModal({tab, length, handleRecord}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputFocus, setInputFocus] = useState(false)
    const [fileName, setFileName] = useState('')
    const [recording, setRecording] = useState(false)
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (tab){
            setFileName(tab['name'])
        }
    }, [tab])

    function handleClose(){
        setIsOpen(false)
        setFileName(tab['name'])
        setProgress(0)
        setSuccess(false)
        setRecording(false)
    }

    function exportAudio(){
        handleRecord(fileName)
        handleProgress()
        setRecording(true)

    }

    function handleProgress(){
        let count = 0;
        let interval = setInterval(
            function(){
            if (count > length){
                clearInterval(interval)
                setProgress(100)
                setSuccess(true)
                setTimeout(function(){
                    handleClose()
                }, 1000)
            }
            count+=500;
            let percent = (count/length).toFixed(2) * 100
            setProgress(percent)
            }, 500
        )
    }

    function convertMillsecondsToMinutesAndSeconds(){
        let minutes = 0;
        let seconds = 0;
        seconds = (length/1000).toFixed(0)
        while (seconds > 60){
            minutes++
            seconds -= 60;
        }
        return `${minutes} m: ${seconds} s`
    }



  return (
    <>
    {isOpen && (
      <>
        <div className="overlay"></div>
        <div id='tabDownloadModal' className="modal">
          <header className="modal__header" style={{backgroundColor: 'teal'}}>
            <h3>
                Download Audio
              </h3>
            <button onClick={() => handleClose()} className="close-button">&times;</button>
          </header>
          <main className="modal__main">
          <div>
        <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
            {!recording && <h3>Download as: {fileName}.webm</h3>}
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
            {recording && <h3>Downloading {fileName}.webm</h3>}
            {!success && recording && <Progress percent={progress} progress/>}
            {success && <Progress percent={100} success>{fileName}.webm was successfully downloaded!</Progress>}
            {!recording && <h3>File Length: {convertMillsecondsToMinutesAndSeconds()}</h3>}
          </main>
          {!recording && <Button disabled={localStorage.getItem('userInfo') === null} onClick={() => exportAudio()}>{localStorage.getItem('userInfo') === null ? 'Log-in to download audio' : 'Download'}</Button>}
          {recording && <Button disabled onClick={() => exportAudio()}>Downloading...</Button>}
        </div>
      </>
    )}
    <Button basic compact onClick={() => setIsOpen(true)}><Icon name='circle'/></Button>
  </>
    
  )
}
