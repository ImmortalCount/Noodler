import React from 'react'
import Board from './Board'
import Card from './Card'
import './boards.css'

export default function Boards() {
    return (
        <>
        <div className="controls">
            <button>Add Cards</button>
            <button>Add Boards</button>
            <button>Swap</button>
            <button>Replace</button>
            <button>Fill On/Off</button>
        </div>
        
        <div className="boards">
        <div className="left">
        <main className="flexbox">
                <Board id='board-1' className="board">
                    <h1> Patterns </h1>
                    <Card id="card-1" className = "card" draggable='true'>
                        <p> Card one</p>
                    </Card>
                    <Card id="card-2" className = "card" draggable='true'>
                        <p> Card two</p>
                    </Card>
                    <Card id="card-3" className = "card" draggable='true'>
                        <p> Card three</p>
                    </Card>
                    <Card id="card-4" className = "card" draggable='true'>
                        <p> Card four</p>
                    </Card>
                </Board>
                <Board id='board-2' className="board">
                    <h1> Rhythms</h1>
                    
                </Board>
                <Board id='board-3' className="board">
                    <h1>Chord Progressions</h1>
                    
                </Board>
                <Board id='board-4' className="board">
                    <h1>Scales</h1>
                    
                </Board>
            </main>
        </div>
            <div className="right"></div>
            
        </div>
        </>
    )
}
