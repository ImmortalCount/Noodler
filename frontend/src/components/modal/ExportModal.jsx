import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from 'react-redux';
import "./modal.css";
import { insertData } from '../../store/actions/dataPoolActions';

function ExportModal({dataType, exportObj}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState(false)
  const [poolDisplay, setPoolDisplay] = useState('global')
  const [overWriteOptionDisplay, setOverWriteOptionDisplay] = useState()

  const exportDropdownOptions = [
    { key: 'global', text: 'global', value: 'global'},
    { key: 'local', text: 'local', value: 'local'},
  ]

  const handleExportDropdown = (e, {value}) => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (value === 'local'){
        const user = JSON.parse(localStorage.getItem('userInfo'))
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

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header">
              <h2>Export {dataType} To: {poolDisplay}</h2>
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
              <h3>Desc: {exportObj.desc}</h3>
              <h3>
              {Object.entries(exportObj).map(([key, value], i) => (
                <div key={i}>{key}: {value}</div>
))}
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

export default ExportModal