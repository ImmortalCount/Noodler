export function animateClassicVibrato(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cx'));
    var counter = 60;
    var x = 0.1;
    var bound = 2
    var up = true;
    var interval = setInterval(function(){
    if (x >= bound){
        up = false;
    }
    if (x <= -bound){
        up = true;
    }

    if (up === true){
        x++
    } else {
        x--
    }
    note.setAttribute('cx', currentPosition + x);
    noteName.setAttribute('x', currentPosition + x);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cx', currentPosition);
        noteName.setAttribute('x', currentPosition);
    }
    counter--;
}, 15)
    
}

export function animateBluesVibrato(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cy'));
    var counter = 60;
    var y = 0.1;
    var bound = 4
    var up = true;
var interval = setInterval(function(){
    if (y >= bound){
        up = false;
    }
    if (y <= -bound){
        up = true;
    }

    if (up === true){
        y++
    } else {
        y--
    }
    note.setAttribute('cy', currentPosition + y);
    noteName.setAttribute('y', currentPosition + y);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cy', currentPosition);
        noteName.setAttribute('y', currentPosition);
    }
    counter--;
}, 10)
    
}


export function animateSlideUp(){
    var note = document.getElementById('2_11');
    var noteName = document.getElementById('2_11_name')
    var destinationNote = document.getElementById('2_14')
    var currentPosition = Number(note.getAttribute('cx'));
    var destinationPosition = Number(destinationNote.getAttribute('cx'))
    var currentColor = note.getAttribute('fill');
    var destinationColor = destinationNote.getAttribute('fill')
    var x = 0;
    var counter = 60;
    var interval = setInterval(function(){
        note.setAttribute('cx', currentPosition + x);
        note.setAttribute('fill', destinationColor)
        noteName.setAttribute('x', currentPosition + x);
        if (counter < 0){
            clearInterval(interval)
            note.setAttribute('cx', currentPosition);
            noteName.setAttribute('x', currentPosition);
            note.setAttribute('fill', currentColor);
        }
        if (!(currentPosition + x >= destinationPosition)){
            x += 5;
        }
        counter--;
    }, 10)

}

export function animateSlideDown(){
    var note = document.getElementById('2_11');
    var noteName = document.getElementById('2_11_name')
    var destinationNote = document.getElementById('2_14')
    var currentPosition = Number(note.getAttribute('cx'));
    var destinationPosition = Number(destinationNote.getAttribute('cx'))

}

export function animateBend(){
    var note = document.getElementById('2_11')
    var noteName = document.getElementById('2_11_name')
    var currentPosition = Number(note.getAttribute('cy'));
    var counter = 100;
    var y = 0.1;
    var bound = 50;
    var up = true;
    var sustain = false;
    var interval = setInterval(function(){
    if (y >= bound){
        up = false;
        sustain = true;
    }
    if (y <= 0){
        up = true;
    }
    if (sustain === false){
        if (up === true){
            y++
        } else {
            y--
        }
    }
    note.setAttribute('cy', currentPosition + y);
    noteName.setAttribute('y', currentPosition + y);
    if (counter < 0){
        clearInterval(interval)
        note.setAttribute('cy', currentPosition);
        noteName.setAttribute('y', currentPosition);
    }
    if (counter < 50){
        sustain = false;
    }
    counter--;
}, 10)
}

export function Bluesy(){
    animateClassicVibrato();
    animateBend();
}