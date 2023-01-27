import { createCustomElement } from "./assets/libs/helper"

class Carousel {
    all_images_src: string[]
    current_img_index: number
    root_element: HTMLDivElement
    image_element: HTMLImageElement
    button_next: HTMLButtonElement
    button_prev: HTMLButtonElement
    
    constructor(carousel_element:HTMLDivElement|string, images: string[]) {
        if (typeof carousel_element === 'string') {
            carousel_element = this.createCarouselElement(carousel_element)
            document.body.appendChild(carousel_element)
        }
        this.all_images_src = images
        this.current_img_index = 0
        this.root_element = carousel_element

        this.addButtons()
        this.addImage(this.all_images_src[this.current_img_index])
    }

    addImage(image_src:string) {
        this.image_element = this.createImageElement(image_src)
        this.root_element.insertBefore(this.image_element, this.button_next)
    }

    createImageElement(image_src:string, className?:string) {
        let image_element = document.createElement('img')
        image_element.src = image_src
        image_element.className = 'carousel__image js-image'
        className ? image_element.className += ' '+className : 0
        return image_element
    }

    moveImg(offset:number) {
        if (this.current_img_index + offset < 0) {
            this.current_img_index = this.all_images_src.length-1
        } else if (this.current_img_index + offset >= this.all_images_src.length) {
            this.current_img_index = 0
        } else {
            this.current_img_index += offset
        }


        //let new_img = this.createImageElement(this.all_images_src[this.current_img_index-1])

        //this.root_element.appendChild(new_img)

        //this.image_element.style.transform = `translateX(${offset*100}%)`
        this.image_element.src = this.all_images_src[this.current_img_index]
    }

    createCarouselElement(className:string) {
        let carousel_el = document.createElement('div')
        carousel_el.className = 'carousel ' + className
        return carousel_el
    }

    addButtons() {
        this.button_next = createCustomElement('button', 'carousel__btn next', '>', 'click', () => {
            this.moveImg(1)
        })
        this.button_prev = createCustomElement('button', 'carousel__btn prev', '<', 'click', () => {
            this.moveImg(-1)
        })
        this.root_element.appendChild(this.button_prev)
        this.root_element.appendChild(this.button_next)
    }

}



class CarouselWithDots extends Carousel {

    dots_container: HTMLDivElement

    constructor(carousel_element:HTMLDivElement|string, images: string[]) {
        super(carousel_element, images)
        
        
    }

}



let images = ['https://picsum.photos/id/420/1200/800', 'https://picsum.photos/id/26/1200/800', 'https://picsum.photos/id/54/1200/800',
              'https://picsum.photos/id/13/1200/800', 'https://picsum.photos/id/37/1200/800', 'https://picsum.photos/id/69/1200/800']
// let images_s = ['https://picsum.photos/id/420/800/450', 'https://picsum.photos/id/26/800/450', 'https://picsum.photos/id/54/800/450',
//                 'https://picsum.photos/id/13/800/450', 'https://picsum.photos/id/37/800/450', 'https://picsum.photos/id/69/800/450']

let carousel = new Carousel('js-carousel', images)

