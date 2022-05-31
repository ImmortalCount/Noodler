
import React, { Component } from "react";
import Snap from 'snapsvg-cjs';

export default class GuitarSVGJS extends Component {
state = {}
s = Snap("#svg");

componentDidMount(){
    var s = Snap("#svg");

    let circle = s.circle(15,15,15);

    circle.attr({
        fill: "blue",
        stroke: "black",
        strokeWidth: 2,
        cx: "150",
        cy: "50",
        id: "circle"
    });
    
    
}
handleCLick(){
    var circle = document.getElementById("circle")
    circle.animate({
        cx: 180
    // eslint-disable-next-line no-undef
    }, 2000, mina.easein)
    }

render(){
    return (
        <div>
            <svg 
            id="svg"
            height="300px"
            width="400px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            />
            <button onClick={() => this.handleCLick()}>Click me</button>
        </div>
    );
}
    
}
