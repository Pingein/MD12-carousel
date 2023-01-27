
const createCustomElement = <T>(tagName:string, className?:string,
                                innerHTML?:string, eventTrigger?:string,
                                eventFn?:Function):T => {
    let element = document.createElement(tagName)
    className ? element.className = className : 0
    innerHTML ? element.innerHTML = innerHTML : 0
    if (eventTrigger && eventFn) {
        element.addEventListener(eventTrigger, (e)=>{
            e.preventDefault()
            eventFn()
        }) 
    }

    return element as T
}


export { createCustomElement }