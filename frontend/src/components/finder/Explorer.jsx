import React, {useState, useEffect, useRef} from 'react'
import {List, Select, Input, Icon, Grid, Button, Menu, ButtonGroup} from 'semantic-ui-react'
import { useDispatch, useSelector} from 'react-redux';
import { getMusicData } from '../../store/actions/dataPoolActions';


export default function Explorer({display}) {
  const [scope, setScope] = useState('global')
  const [subData, setSubData] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [userID, setUserID] = useState(null)
  const [pageNumber, setPageNumber] = useState(0)

  const dispatch = useDispatch();

  const dataList  = useSelector(state => state.dataList)
  const {loading, error, displayData} = dataList

  const lastPageTotalFromQuery = useRef(1)
  const pageTotalFromQuery = displayData?.data.numberOfPages

useEffect(() => {
    if (localStorage.getItem('userInfo') !== null){
        const user = JSON.parse(localStorage.getItem('userInfo'))
        setUserID(user['_id'])
    }
}, [])

useEffect(() => {
    setPageNumber(0)
}, [keyword, scope, userID, subData])

useEffect(() => {
    let queryObject = {}
    queryObject["pool"] = scope
    queryObject["dataType"] = subData
    queryObject["keyword"] = keyword
    queryObject["userID"] = userID
    queryObject["pageNumber"] = pageNumber
    dispatch(getMusicData(queryObject))
    // ===Check display page
    if (pageTotalFromQuery !== lastPageTotalFromQuery.current){
        lastPageTotalFromQuery.current = pageTotalFromQuery
    }
}, [scope, subData, keyword, dispatch, userID, pageNumber])

    //========================================================

const onDrag = (e) => {
}

const onDragStart = (e) => {

    const itemNumber = e.currentTarget.id.split('_')[0]
    var obj = {
        id: 'special', 
        className: displayData.data.dataResults[itemNumber].dataType + 'Data', 
        message: displayData.data.dataResults[itemNumber], 
        type: displayData.data.dataResults[itemNumber].dataType + 'ExplorerExport'
    }
        e.dataTransfer.setData('text', JSON.stringify(obj));
}
    const scopeOptions = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'global', text: 'Global', value: 'global' },
    { key: 'local', text: 'Local', value: userID },
    ]

    const restrictedScopeOptions = [
        { key: 'global', text: 'Global', value: 'global' }
    ]

    const dataTypeOptions = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'component', text: 'Component', value: 'component' },
    { key: 'collection', text: 'Collection', value: 'collection' },
    ]

    const dataSubTypeOptions = [
        {key: 'all', text: 'All', value: 'all' },
        {key: 'chord', text: 'Chord', value: 'chord'},
        {key: 'rhythm', text: 'Rhythm', value: 'rhythm'},
        {key: 'pattern', text: 'Pattern', value: 'pattern'},
        {key: 'scale', text: 'Scale', value: 'scale'},
        {key: 'module', text: 'Module', value: 'module'},
        {key: 'song', text: 'Song', value: 'song' },
    ]

    function returnColor(type){
        let color;
        if (type === 'pattern'){
            color = 'lightblue'
        } else if (type === 'chord'){
            color = 'lightsalmon'
        } else if (type === 'scale'){
            color = 'lightcoral'
        } else if (type === 'rhythm'){
            color = 'lightseagreen'
        } else if (type === 'module'){
            color = 'wheat'
        } else if (type === 'song') {
            color = 'lightgreen'
        } else {
            color = 'wheat'
        }
        return color;
    }

    const handleScopeOptions = (e, {value}) => {
        if (value === 'local'){
            setScope(userID)
        } else {
            setScope(value)
        }
    }

    const handleNavigatePreviousPage = () =>{
        if (pageNumber <= 0){
            return
        } else {
            setPageNumber(pageNumber - 1)
        }
        }
    const handleNavigateNextPage = () => {
        if (pageNumber + 1 > pageTotalFromQuery){
            return
        } else {
            setPageNumber(pageNumber + 1)
        }
    }
    

    return (
        <div style={{display: display ? '' : 'none'}}>
            <Menu>
            <Input type='text' placeholder='Search...' icon='search' onChange={(e, {value}) => setKeyword(value)} />
            {userID !== null  && <Select compact options={scopeOptions} onChange={handleScopeOptions} defaultValue='global'/>}
            {userID === null && <Select compact options={restrictedScopeOptions} onChange={(e, {value}) => setSubData(value)} defaultValue='global'/>}
            <Select compact options={dataSubTypeOptions} onChange={(e, {value}) => setSubData(value)} defaultValue='all'/>
            </Menu>
        <Grid>
            <Grid.Column width={15}>
            <pre style={{ overflowX: 'auto' , margin:0}}>
            <div>{pageNumber + 1} / {pageTotalFromQuery ? pageTotalFromQuery : lastPageTotalFromQuery.current}</div>
            <ButtonGroup style={{margin:0}}>
                <Button disabled={pageNumber === 0} onClick={() => setPageNumber(0)}> First </Button>
                <Button disabled={pageNumber === 0} onClick={handleNavigatePreviousPage}> Prev </Button>
                <Button disabled={pageNumber + 1 >= pageTotalFromQuery} onClick={handleNavigateNextPage}> Next</Button>
                <Button disabled={pageNumber + 1 >= pageTotalFromQuery} onClick={() => setPageNumber(4)}> Last </Button>
            </ButtonGroup>
            {loading && <h3>Loading...</h3>}
            {error && <h3>Error</h3>}
            <List>
                {displayData?.data.dataResults.map((displayData, idx) => (
                <List.Item id={idx + '_explorer'} key={idx + '_explorer'} className={'explorer'} style={{ marginTop: '5px', marginBottom: '5px', maxWidth: '300px',backgroundColor: returnColor(displayData.dataType)}}draggable onDrag={onDrag} onDragStart ={onDragStart}>
                <List.Content>
                <List.Header > <Icon name='play' size='small'/>{displayData.name}</List.Header>
                <List.Description >type: {displayData.dataType}</List.Description>
                <List.Description >desc: {displayData.desc.length === 0 ? 'N/A' : displayData.desc}</List.Description>
                <List.Description >pool: {displayData.pool === userID ? 'local' : displayData.pool}</List.Description>
                <List.Description >author: {displayData.author}</List.Description>
                </List.Content>
                </List.Item>
                ))}
            </List>
          </pre>
      </Grid.Column>
            </Grid>
        </div>
    )
}
