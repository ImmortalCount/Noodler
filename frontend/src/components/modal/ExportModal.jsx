import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, TextArea } from "semantic-ui-react";
import { useDispatch, useSelector } from 'react-redux';
import "./modal.css";
import { insertData, updateData } from '../../store/actions/dataPoolActions';

function ExportModal({dataType, exportObj, opened, setOpened, changeParentName, changeParentDesc}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [inputFocus, setInputFocus] = useState(false)
  const [textAreaFocus, setTextAreaFocus] = useState(false)
  const [messageDisplay, setMessageDisplay] = useState(false)
  const [updateDisplay, setUpdateDisplay] = useState(false)
  const [poolDisplay, setPoolDisplay] = useState('global')
  const user = JSON.parse(localStorage.getItem('userInfo'))

  useEffect(() => {
    if (opened){
      setIsOpen(true)
    }
  }, [opened])

  useEffect(() => {
    if (exportObj){
      if (dataType === 'scale'){
        setName(exportObj.scaleType)
      } else {
        setName(exportObj.name)
      }
      setDesc(exportObj.desc)
    }
  }, [exportObj])


  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setMessageDisplay(false)
    setUpdateDisplay(false)
    setOpened(false)
  }

  const dataInsertStatus  = useSelector(state => state.dataInsert)
  const {loading, error, dataInsert} = dataInsertStatus

  const dataUpdateStatus = useSelector(state => state.dataUpdate)
  const {dataUpdate} = dataUpdateStatus

  const dispatch = useDispatch()

  const handleExport = () => {
    setMessageDisplay(true)
    dispatch(insertData(exportObj))
  }

  const handleUpdate = () => {
    setUpdateDisplay(true)
    setMessageDisplay(false)
    dispatch(updateData(exportObj))
  }

  const handleDeclineUpdate = () => {
    setMessageDisplay(false)
    setUpdateDisplay(false)
  }

  const dontRender = [
    'authorId',
    'scaleName',
    'chordName',
    'rhythmName',
    'moduleName',
    'patternName',
    'desc',
    'instruments',
    'data', 
    'pool',
    'scaleType',
    'dataType'
  ]

function handleSetName(name){
  setName(name)
  changeParentName(name)
}

function handleSetDesc(desc){
  setDesc(desc)
  changeParentDesc(desc)
}

 function handleClickPool(value){
  if (value === 'local'){
    exportObj['pool'] = (user['_id'])
    setPoolDisplay('local')
} else {
    exportObj['pool'] = value;
    setPoolDisplay(value)
}
  }

function handleBackgroundColor(){
  let colors = {
    'chord': 'lightsalmon',
    'scale': 'lightcoral',
    'pattern': 'lightblue',
    'rhythm': 'lightseagreen',
    'module': 'wheat',
    'song': 'lightgreen'
  }
  return colors[dataType]
}


  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header style={{backgroundColor: handleBackgroundColor()}} className="modal__header">
              <h2>Export {dataType} '{dataType === 'scale' ? exportObj.name :  name}' to {poolDisplay}</h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
             {messageDisplay && <h3>{dataInsert?.data?.message}</h3>}
             {updateDisplay && <h3>{dataUpdate?.data?.message}</h3>}
             {messageDisplay && dataInsert?.data?.success === false && <div>
               <h3>Update {dataType === 'scale' ? exportObj.name :  name}?</h3>
               <div>
               <Button onClick={handleUpdate}> Yes</Button> <Button onClick={handleDeclineUpdate}>No</Button>
               </div>
               </div>}
             <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
            <h3>Name: {dataType === 'scale' ? exportObj.name :  name}</h3>
        </div>
            <Input type='text'
            value={name}
            id={'input_moduleLab'}
            ref={input => input && input.focus()}
            onInput={e => handleSetName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
              <div onClick={() => setTextAreaFocus(!textAreaFocus)} style={{display: !textAreaFocus ? '': 'none' }}>
              <h3>Description: {desc.length === 0 ? 'N/A' : desc}</h3>
              </div>
              <TextArea
                value={desc}
                id={'input_moduleLab'}
                ref={input => input && input.focus()}
                onInput={e => handleSetDesc(e.target.value)}
                onBlur={() => setTextAreaFocus(false)}
                style={{display: textAreaFocus ? '': 'none' }}
              />
              <h3>
              <div>Details:</div>
              {Object.entries(exportObj).map(([key, value], i) => {
                     if (key === 'data' && dataType !== 'song'){
                    return (
                      <>
                    <div>scale name:{value.scaleData.name}</div>
                    <div>scale: {value.scaleData.scale}</div>
                    <div>chord name:{value.chordData.name}</div>
                    <div>chord: {value.chordData.chord}</div>
                    <div>pattern name:{value.patternData.name}</div>
                    <div>pattern:{value.patternData.pattern}</div>
                    <div>rhythm name:{value.rhythmData.name}</div>
                    <div>{value.keyData.keyName}</div>
                      </>
                    )
                  } else if (dontRender.includes(key) ||typeof value === 'object'){
                      return <div key={i}></div>
                  } else if (value === user['_id'])  {
                    return <div key={i}>{key}: local</div>
                  } else if (typeof value === 'boolean') {
                    return <div key={i}>{key}: {value === true ? 'true' : 'false'}</div>
                  } else {
                    return <div key={i}>{key}: {value}</div>
                  }
              }
              )}
              </h3>
              <h3>Export to </h3>
             <div className="export_select" style={{display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px'}}>
              <Checkbox 
              label='local'
              checked={poolDisplay === 'local'}
              onClick={() => handleClickPool('local')}
              />
              <Checkbox 
              label='global'
              checked={poolDisplay === 'global'}
              onClick={() => handleClickPool('global')}
              />
             </div>
            </main>
            <Button loading={loading} onClick={handleExport}>Export</Button>
            <Button loading={loading} onClick={() => console.log(exportObj)}>Test</Button>
            <Button loading={loading} onClick={() => exportObj['pool'] = 'local'}>Change</Button>
          </div>
        </>
      )}
    </>
  );
}

export default ExportModal