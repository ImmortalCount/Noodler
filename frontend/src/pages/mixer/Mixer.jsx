import React from 'react'
import * as Tone from 'tone';
import { useSelector, useDispatch} from 'react-redux';
import { setMixer } from '../../store/actions/mixerActions';
import {Container} from 'semantic-ui-react'

export default function Mixer({display}) {
  const globalInstrumentsData = useSelector(state => state.globalInstruments)
  const {globalInstruments} = globalInstrumentsData

  const dispatch = useDispatch()

    const onChangeVolumeMaster = (e) => {
      Tone.getDestination().volume.value = e.target.value
  }

  const onChangeVolume =  (e) => {
    let thisID = Number(e.target.id)
    let returnObj = {
    }
      returnObj['synthSource'] = globalInstruments[thisID]['synthSource']
      returnObj['value'] = e.target.value
      dispatch(setMixer(returnObj))
  }

  function mapGlobalInstruments(){
    if (globalInstruments){
      return (
        globalInstruments.map((globalInstruments, idx) => 
        <div>
          <h3>
          {globalInstruments.name}
          </h3>
          <div>
            Volume 
          </div>
          <input id={idx} type="range" min='-20' max='20' step='1' defaultValue={'0'} onChange={onChangeVolume}/>
        </div>
        )
      )
    }
  }

  return (
      <div style={{display: display ? '' : 'none', width: '200px', paddingLeft: '15px'}}>
      <h3>Master</h3>
      <div>
        Volume
      </div>
      <input type="range" min='-20' max='20' step='1' defaultValue={'0'} onChange={onChangeVolumeMaster}/>
      {mapGlobalInstruments()}
      </div>
  )
}
