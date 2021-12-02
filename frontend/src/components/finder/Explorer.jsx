import React, {useState} from 'react'
import {Button, Select, Input, Icon, Grid, Segment, Header, Search, Menu} from 'semantic-ui-react'

export default function Explorer() {
    const [dropDownState, setDropdownState] = useState(['global', 'components', 'module'])
    const [source, setSource] = useState([
        {'title': 'rhythm-1',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]}]) 
    //========================================================
    const scopeOptions = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'global', text: 'Global', value: 'global' },
    { key: 'local', text: 'Local', value: 'local' },
    ]

    const dataType = [
    { key: 'components', text: 'Components', value: 'components' },
    { key: 'collections', text: 'Collections', value: 'collections' },
    { key: 'songs', text: 'Songs', value: 'songs' },
    ]

    const dataSubType = [
        {key: 'chords', text: 'Chords', value: 'chords'},
        {key: 'rhythms', text: 'Rhythms', value: 'rhythms'},
        {key: 'patterns', text: 'Patterns', value: 'patterns'},
        {key: 'scales', text: 'Scales', value: 'scales'},
        {key: 'modules', text: 'Modules', value: 'modules'},
    ]

    function handleChangeSource(){
            if (dropDownState[0] === 'global'){
                if (dropDownState[1] === 'components'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }
                } else if (dropDownState[1] === 'collections'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }
                } else if (dropDownState[1] === 'songs'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }
                }
            } else if (dropDownState[0] === 'local'){
                if (dropDownState[1] === 'components'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }

                } else if (dropDownState[1] === 'collections'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }

                } else if (dropDownState[1] === 'songs'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }
                

            } else if (dropDownState[0] === 'all'){
                if (dropDownState[1] === 'components'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }

                } else if (dropDownState[1] === 'collections'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }

                } else if (dropDownState[1] === 'songs'){
                    if (dropDownState[2] === 'chords'){

                    } else if (dropDownState[2] === 'rhythms'){

                    } else if (dropDownState[2] === 'patterns'){
                        
                    } else if (dropDownState[2] === 'scales'){

                    } else if (dropDownState[2] === 'modules'){

                    } else {
                        return
                    }
                
                } else {
                    return
                }
            } else {
                return
            }
        }
    }
    //========================================================

    const globalRhythms = [
        {'title': 'rhythm-1 Globe',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
        {'title': 'rhythm-2 Globe',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
        {'title': 'rhythm-3 Globe',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
    ]

    const localRhythms = [
        {'title': 'rhythm-1 Local',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
        {'title': 'rhythm-2 Local',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
        {'title': 'rhythm-3 Local',
        'description': '4 on the floor',
        'length': 4,
        'notes': [['O'], ['O'],['O'],['O']]},
    ]

    const localRhythmCollections = [
        {'title': 'collection 1',
        'description': 'tropical riddims',
        'info': [
            {'title': 'rhythm-1 Local',
            'description': '4 on the floor',
            'length': 4,
            'notes': [['O'], ['O'],['O'],['O']]},
            {'title': 'rhythm-2 Local',
            'description': '4 on the floor',
            'length': 4,
            'notes': [['O'], ['O'],['O'],['O']]},
            {'title': 'rhythm-3 Local',
            'description': '4 on the floor',
            'length': 4,
            'notes': [['O'], ['O'],['O'],['O']]},   
        ]}
    ]
    //==============================================

    const initialState = {
        loading: false,
        results: [],
        value: '',
      }
    
    
      
    function exampleReducer(state, action) {
        switch (action.type) {
          case 'CLEAN_QUERY':
            return initialState
          case 'START_SEARCH':
            return { ...state, loading: true, value: action.query }
          case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results }
          case 'UPDATE_SELECTION':
            return { ...state, value: action.selection }
      
          default:
            throw new Error()
        }
      }

      function escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    
      const [state, dispatch] = React.useReducer(exampleReducer, initialState)
      const { loading, results, value } = state
    
      const timeoutRef = React.useRef()
      const handleSearchChange = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })
    
        timeoutRef.current = setTimeout(() => {
          if (data.value.length === 0) {
            dispatch({ type: 'CLEAN_QUERY' })
            return
          }
    
          const re = new RegExp(escapeRegex(data.value))
          const isMatch = (result) => re.test(result.title)
    
          dispatch({
            type: 'FINISH_SEARCH',
            results: source.filter(isMatch)
          })
        }, 300)
      }, [])
      React.useEffect(() => {
        return () => {
          clearTimeout(timeoutRef.current)
        }
      }, [])
    

    return (
        <div>
            <Menu>
            <Search
          loading={loading}
          onResultSelect={(e, data) =>
            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
          }
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
        />
            <Select compact options={scopeOptions} defaultValue='global'/>
            <Select compact options={dataType} defaultValue='components'/>
            <Select compact options={dataSubType} defaultValue='modules'/>
            </Menu>
        <Grid>
            <Grid.Column width={10}>
        <Segment>
          <Header>State</Header>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify({ loading, results, value }, null, 2)}
          </pre>
          <Header>Options</Header>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(source, null, 2)}
          </pre>
        </Segment>
      </Grid.Column>
            </Grid>
        </div>
    )
}
