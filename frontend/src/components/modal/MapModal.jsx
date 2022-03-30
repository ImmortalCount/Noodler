import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from 'react-redux';
import "./modal.css";
import { insertData } from '../../store/actions/dataPoolActions';

function MapModal({dataType, exportObj}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState(false)
  const [poolDisplay, setPoolDisplay] = useState('global')
  const [overWriteOptionDisplay, setOverWriteOptionDisplay] = useState()
  const user = JSON.parse(localStorage.getItem('userInfo'))
  const exportDropdownOptions = [
    { key: 'global', text: 'global', value: 'global'},
    { key: 'local', text: 'local', value: 'local'},
  ]
  const handleExportDropdown = (e, {value}) => {
    if (value === 'local'){
        exportObj['pool'] = (user['_id'])
        setPoolDisplay('local')
    } else {
        exportObj['pool'] = value;
        setPoolDisplay(value)
    }
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setMessageDisplay(false)
  }

  const dataInsertStatus  = useSelector(state => state.dataInsert)
  const {loading, error, dataInsert} = dataInsertStatus

  const dispatch = useDispatch()

  const handleExport = () => {
    setMessageDisplay(true)
    dispatch(insertData(exportObj))
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
    'data'
  ]


  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header">
              <h2>Export {dataType} '{exportObj.name}' To: {poolDisplay}</h2>
              <Dropdown
              simple
              item
              className='button icon'
              options={exportDropdownOptions}
              onChange={handleExportDropdown}
              trigger={<></>}
            />
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
             {messageDisplay && <h3>{dataInsert?.data?.message}</h3>}
              <h3>Name: {exportObj.name}</h3>
              <h3>Description: {exportObj.desc}</h3>
              <h3>
              {Object.entries(exportObj).map(([key, value], i) => {
                     if (key === 'data' && dataType !== 'Song'){
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
                  } else {
                    return <div key={i}>{key}: {value}</div>
                  }
              }
              )}
              </h3>

            </main>
            <Button loading={loading} onClick={handleExport}>Export</Button>
          </div>
        </>
      )}
      <Button disabled={localStorage.getItem('userInfo') === null} basic onClick={openModal}>Export</Button>
    </>
  );
}

export default MapModal