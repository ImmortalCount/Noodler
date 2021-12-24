import React, {useState, useEffect} from 'react'
import {List, Select, Input, Icon, Grid, Button, Menu} from 'semantic-ui-react'
import { useDispatch, useSelector} from 'react-redux';
import { getMusicData } from '../../store/actions/dataPoolActions';


export default function Explorer() {
  const [scope, setScope] = useState('global')
  const [data, setData] = useState('component')
  const [subData, setSubData] = useState('pattern')
  const [keyword, setKeyword] = useState('')

  const dispatch = useDispatch();

  const dataList  = useSelector(state => state.dataList)
  const {loading, error, displayData} = dataList

useEffect(() => {
    let queryObject = {}
    queryObject["pool"] = scope
    queryObject["dataType"] = subData
    queryObject["keyword"] = keyword
    dispatch(getMusicData(queryObject))
}, [scope, subData, keyword, dispatch])

    //========================================================

const onDrag = (e) => {
}

const onDragStart = (e) => {
    var obj = {
        id: 'special', 
        className: displayData.data[e.currentTarget.id.split('_')[0]].dataType + 'Data', 
        message: displayData.data[e.currentTarget.id.split('_')[0]], 
        type: 'foreign'
    }
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
}
    const scopeOptions = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'global', text: 'Global', value: 'global' },
    { key: 'local', text: 'Local', value: 'local' },
    ]

    const dataTypeOptions = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'component', text: 'Component', value: 'component' },
    { key: 'collection', text: 'Collection', value: 'collection' },
    { key: 'song', text: 'Songs', value: 'song' },
    ]

    const dataSubTypeOptions = [
        { key: 'all', text: 'All', value: 'all' },
        {key: 'chord', text: 'Chord', value: 'chord'},
        {key: 'rhythm', text: 'Rhythm', value: 'rhythm'},
        {key: 'pattern', text: 'Pattern', value: 'pattern'},
        {key: 'scale', text: 'Scale', value: 'scale'},
        {key: 'module', text: 'Module', value: 'module'},
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
        } else {
            color = 'wheat'
        }
        return color;
    }

    return (
        <div>
            <Menu>
            <Input type='text' placeholder='Search...' icon='search' onChange={(e, {value}) => setKeyword(value)} />
            <Select compact options={scopeOptions} onChange={(e, {value}) => setScope(value)} defaultValue='global'/>
            <Select compact options={dataTypeOptions} onChange={(e, {value}) => setData(value)} defaultValue='component'/>
            <Select compact options={dataSubTypeOptions} onChange={(e, {value}) => setSubData(value)}defaultValue='pattern'/>
            </Menu>
        <Grid>
            <Grid.Column width={10}>
            <pre style={{ overflowX: 'auto' }}>
            {loading && <h3>Loading</h3>}
            {error && <h3>Error</h3>}
            <List>
                {displayData && displayData.data.map((displayData, idx) => (
                <List.Item id={idx + '_explorer'} key={idx + '_explorer'} className={'explorer'} style={{backgroundColor: returnColor(displayData.dataType)}}draggable onDrag={onDrag} onDragStart ={onDragStart}>
                <List.Content>
                <List.Header > <Icon name='play' size='small'/>{displayData.name}</List.Header>
                <List.Description >type: {displayData.dataType}</List.Description>
                <List.Description >pool: {displayData.pool}</List.Description>
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
