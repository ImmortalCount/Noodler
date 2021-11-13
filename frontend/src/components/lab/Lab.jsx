import React, {useState} from 'react'
import { Accordion, Icon} from 'semantic-ui-react'
import ChordLab from './ChordLab'
import PatternLab from './PatternLab'
import RhythmLab from './RhythmLab'
import ScaleLab from './ScaleLab'

export default function Lab() {
    const [activeIndices, setActiveIndices] = useState([0])

    const handleClick = (e, titleProps) => {
        var temp = [...activeIndices]
       if (activeIndices.includes(titleProps.index) === false){
           temp.push(titleProps.index)
       } else {
           temp = temp.filter(x => x !== titleProps.index);
       }
       setActiveIndices(temp)
    }

    return (
        <>
        <div style={{minWidth: '250px', margin: "2px"}}>
        <Accordion fluid styled>
        <Accordion.Title
          active={activeIndices.includes(0)}
          index={0}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Scale Lab
        </Accordion.Title>
        <Accordion.Content active={activeIndices.includes(0)}>
            <ScaleLab/>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndices.includes(1) === 1}
          index={1}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Chord Lab
        </Accordion.Title>
        <Accordion.Content active={activeIndices.includes(1)}>
            <ChordLab/>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndices.includes(2) }
          index={2}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Pattern Lab
        </Accordion.Title>
        <Accordion.Content active={activeIndices.includes(2)}>
          <PatternLab/>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndices.includes(3)}
          index={3}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Rhythm Lab
        </Accordion.Title>
        <Accordion.Content active={activeIndices.includes(3)}>
          <RhythmLab/>
        </Accordion.Content>
      </Accordion>
      </div>
        </>
    )
}
