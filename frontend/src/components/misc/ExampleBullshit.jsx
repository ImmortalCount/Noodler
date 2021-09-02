import React, {useState, useEffect} from 'react'

export default function ExampleBullshit() {
    const [count, setCount] = useState([1,2,3,4,5]);
      
    // useEffect(() => {
    //       document.title = `You clicked ${count} times`;
    //     });
    var handleOnClick = () => {
        const newCount = count.slice()
        newCount.push(newCount.length)
        setCount(newCount);
    }

    return (
        <div>
        <p>You clicked {count} times</p>
        <button onClick={handleOnClick}>
        Click me
        </button>
        </div>
    )
}
