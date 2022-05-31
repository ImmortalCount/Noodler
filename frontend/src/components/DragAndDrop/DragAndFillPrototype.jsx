import React from 'react'

export default function DragAndFillPrototype() {
    
    const dragHandler = e => {
    };

    const dragStartHandler = e => {
        e.dataTransfer.setData('text', e.target.id);
    };

    const dropHandler = e => {
        e.currentTarget.style.background ='wheat';

        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        e.target.appendChild(document.getElementById(data))
    };

    const dragOverHandler = e => {
        e.preventDefault();
        // console.log(e.currentTarget.id)
        // e.currentTarget.style.background = 'red';
    };

    


    return (
        <>
        <div className='main'>
        
        <div className="left">
            
            <div className="starting">
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='red'>Red</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='blue'>Blue</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='green'>Green</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='orange'>Orange</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='violet'>Violet</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='grey'>Grey</div>
            </div>
        </div>
        <div className="right">
        <div className="controls">
            <button>Fill</button>
            <button>Swap</button>
            <button>Replace</button>
            <button>No Combine</button>
            <button>Add Box</button>
            <button>Add Color</button>
        </div>
            <div className="row-1">
            <div className="box" id="box-1" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 1</div>
            <div className="box" id="box-2" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 2</div>
            <div className="box" id="box-3" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 3</div>
            <div className="box" id="box-4" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 4</div>
        </div>
            <div className="row-2">
            <div className="box" id="box-5" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 5</div>
            <div className="box" id="box-6" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 6</div>
            <div className="box" id="box-7" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 7</div>
            <div className="box" id="box-8" onDrop={dropHandler} onDragOver={dragOverHandler}>Box 8</div>
            </div>
        </div>
        </div>
        </>
    )
}
