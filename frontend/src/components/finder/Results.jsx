import React from 'react'
import { List, Header} from 'semantic-ui-react'
import './results.css';

export default function Results() {
    const dragStartHandler = e => {
        var obj = {id: 'special', className: 'rhythmData', message: 
            {rhythmName: 'Quint Swing - 8 notes - 4 beats',
            rhythm: [["O", "X", "X", "X", "O"],["O", "X", "X", "X", "O"] ,["O", "X", "X", "X", "O"], ["O", "X", "X", "X", "O"]],
            length: 4,
            }, type: 'foreign'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
    };
    return (
        <>
        <List relaxed divided size='large' className='fixed-width'>
        <Header as='h3' diving>
            Global Rhythms
        </Header>
        <List.Item className='rhythmData' draggable onDragStart={dragStartHandler}>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythms</List.Header>
                <List.Description>
                    Hard Quint Swing - Length: 4, Notes: 8
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='rhythmData' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> Rhythm</List.Header>
                <List.Description>
                    Swung 8th notes - 4 bars
                </List.Description>
            </List.Content>
        </List.Item>
        </List>
        </>
    )
}
