import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'


const initialData =  {
    tasks: {
        'task-1': {id: 'task-1', content: 'Take out the garbage'},
        'task-2': {id: 'task-1', content: 'Watch Gurren Lagan'},
        'task-3': {id: 'task-1', content: 'Shitpost on /pol/'},
        'task-4': {id: 'task-1', content: 'Eat Ramen'},
    },
    columns: {
        'columm-1':{
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },

    columnOrder: ['column-1'],
}
export default function DragAndDropTest() {
    return (
        <>
        <DragDropContext>
        <div>
            Numbers
        </div>
        <Droppable>
        <Draggable>
        <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 6</li>
                <li>Item 7</li>
                <li>Item 8</li>
                <li>Item 9</li>
                <li>Item 10</li>
                <li>Item 11</li>
                <li>Item 12</li>
                <li>Item 13</li>
                <li>Item 14</li>
                <li>Item 15</li>
                <li>Item 16</li>
            </ul>
        </Draggable>
        <div>
            Numbers
        </div>
        <Draggable>
        <ul>
                <li>Item A</li>
                <li>Item B</li>
                <li>Item C</li>
                <li>Item D</li>
                <li>Item E</li>
                <li>Item F</li>
                <li>Item G</li>
                <li>Item H</li>
                <li>Item I</li>
                <li>Item J</li>
                <li>Item K</li>
                <li>Item L</li>
                <li>Item M</li>
                <li>Item N</li>
                <li>Item O</li>
                <li>Item P</li>
            </ul>
        </Draggable>
        </Droppable>
        </DragDropContext>
        
        </>
    )
}
