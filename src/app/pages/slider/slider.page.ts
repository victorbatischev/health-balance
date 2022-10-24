import { Component, OnInit, ViewChild } from '@angular/core'
import { IonSlides } from '@ionic/angular'

@Component({
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss']
})
export class SliderPage implements OnInit {
  @ViewChild('slider') slideElm: IonSlides

  constructor() {}

  ngOnInit(): void {}

  slideOpts = {
    effect: 'flip',
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    centeredSlides: 1,
    pager: false
  }

  slides = [
    {
      id: 1,
      title: '1/2',
      advice:
        'Разрешите Health Balance присылать push-уведомления в настройках вашего смартфона.'
    },
    {
      id: 2,
      title: `2/2`,
      advice:
        'Предоставьте разрешение на отслеживание вашей физической активности'
    }
  ]

  slideToNextAdvice(e) {
    this.slideElm.slideNext()
  }

  slideToPrevAdvice(e) {
    this.slideElm.slidePrev()
  }
}
