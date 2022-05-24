//attrs is an object
//el is an svg object
export function setAttributes(el, attrs){
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
}

export function createSVGElement(type){
    return document.createElementNS("http://www.w3.org/2000/svg", type);
}