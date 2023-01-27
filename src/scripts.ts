import { createCustomElement } from "./assets/libs/helper"
import { in_fullscreen, out_fullscreen } from "./assets/libs/svg_text"

class Carousel {
    all_images_src: string[]
    current_img_index: number
    root_element: HTMLDivElement
    image_element: HTMLImageElement
    button_next: HTMLButtonElement
    button_prev: HTMLButtonElement
    image_container: HTMLDivElement
    
    constructor(carousel_element:HTMLDivElement, images: string[]) {
        this.all_images_src = images
        this.current_img_index = 0
        this.root_element = carousel_element

        this.image_container = createCustomElement('div', 'carousel__image-container')

        this.addButtons()
        this.addImage(this.all_images_src[this.current_img_index])
    }

    addImage(image_src:string) {
        this.image_element = this.createImageElement(image_src)
        this.image_container.insertBefore(this.image_element, this.button_next)
        this.root_element.appendChild(this.image_container)
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

        this.image_element.src = this.all_images_src[this.current_img_index]
    }

    setImage(index: number) {
        if (index >= 0 && index < this.all_images_src.length) {
            this.image_element.src = this.all_images_src[index]
        }
    }

    addButtons() {
        this.button_next = createCustomElement('button', 'carousel__btn next', '>', 'click', () => {
            this.moveImg(1)
        })
        this.button_prev = createCustomElement('button', 'carousel__btn prev', '<', 'click', () => {
            this.moveImg(-1)
        })
        this.image_container.appendChild(this.button_prev)
        this.image_container.appendChild(this.button_next)
    }
}


class CarouselWithDots extends Carousel {
    dots_container: HTMLDivElement
    dots: NodeListOf<HTMLDivElement>

    constructor(carousel_element:HTMLDivElement, images: string[]) {
        super(carousel_element, images)

        this.dots_container = createCustomElement('div', 'carousel__dots-container')

        for (let i = 0; i<this.all_images_src.length; i++) {
            let dot = createCustomElement<HTMLDivElement>('div', `dot`, undefined, 'click', () => {
                this.current_img_index = i
                this.setImage(this.current_img_index)
                this.setDotColors()
            })
            this.dots_container.appendChild(dot)
        }
        this.dots = this.dots_container.querySelectorAll('.dot')
        this.dots[0].style.backgroundColor = '#b8b8b8'

        this.root_element.appendChild(this.dots_container)
    }

    moveImg(offset: number): void {
        super.moveImg(offset)
        this.setDotColors()
    }

    setDotColors() {
        for (let i = 0; i<this.dots.length; i++) {
            if (i == this.current_img_index) {
                this.dots[i].style.backgroundColor = '#b8b8b8'
            } else {
                this.dots[i].style.backgroundColor = '#e8e8e8'
            }
        }
    }
}


class CarouselWithDotsAndPreview extends CarouselWithDots {
    previews_container: HTMLDivElement
    previews: NodeListOf<HTMLImageElement>
    
    constructor(carousel_element:HTMLDivElement, images: string[]) {
        super(carousel_element, images)

        this.previews_container = createCustomElement('div', 'carousel__previews-container')
        for (let i = 0; i<this.all_images_src.length; i++) {
            let preview = createCustomElement<HTMLImageElement>('img', `preview`, undefined, 'click', () => {
                this.current_img_index = i
                this.setImage(this.current_img_index)
                this.setDotColors()
                this.setSelectedPreview()
            })
            preview.style.opacity = '0.4'
            preview.style.width = '90px'
            preview.style.height = '60px'
            preview.src = this.all_images_src[i]
            this.previews_container.appendChild(preview)
            
            this.dots[i].addEventListener('click', () => {
                this.setSelectedPreview()
            })
        }
        this.previews = this.previews_container.querySelectorAll('.preview')
        this.previews[0].style.opacity = '1'
        this.root_element.insertBefore(this.previews_container, this.dots_container)
    }

    setSelectedPreview() {
        for (let i = 0; i<this.previews.length; i++) {
            if (i == this.current_img_index) {
                this.previews[i].style.opacity = '1'
            } else {
                this.previews[i].style.opacity = '0.4'
            }
        }
    }

    moveImg(offset: number): void {
        super.moveImg(offset)
        this.setDotColors()
        this.setSelectedPreview()
    }
}


class CarouselFinal extends CarouselWithDotsAndPreview {
    fullscreen_button: HTMLDivElement
    is_fullscreen: boolean

    constructor(carousel_element:HTMLDivElement, images: string[]) {
        super(carousel_element, images)
        this.is_fullscreen = false

        this.fullscreen_button = createCustomElement('div', 'carousel__fullscreen', in_fullscreen, 'click', () => {
            if (this.is_fullscreen) {
                document.exitFullscreen()
                this.is_fullscreen = false
                this.fullscreen_button.innerHTML = in_fullscreen
            } else {
                this.image_container.requestFullscreen()
                this.is_fullscreen = true
                this.fullscreen_button.innerHTML = out_fullscreen
            }
        })

        this.image_container.appendChild(this.fullscreen_button)

        setInterval(() => {
            this.moveImg(1)
        },10000)
    }
}


let images = ['https://picsum.photos/id/420/1200/800', 'https://picsum.photos/id/26/1200/800', 'https://picsum.photos/id/54/1200/800',
              'https://picsum.photos/id/13/1200/800', 'https://picsum.photos/id/37/1200/800', 'https://picsum.photos/id/69/1200/800',
              'https://picsum.photos/id/240/1200/800', 'https://picsum.photos/id/96/1200/800', 'https://picsum.photos/id/32/1200/800']

let carousel_element = createCustomElement<HTMLDivElement>('div', 'carousel js-carousel')
document.body.appendChild(carousel_element)

new CarouselFinal(carousel_element, images)

