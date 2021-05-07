import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss']
})
export class SliderPage implements OnInit {
  @ViewChild('slider') slideElm: IonSlides;

  slideOpts = {
    effect: 'flip',
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    centeredSlides: 1
  };

  slides = [
    { id: 1, title: '01', advice: 'Дайте разрешение на геопозицию и передвижение'},
    { id: 2, title: '02', advice: 'Дайте разрешение на дополнительную установку Google Fit или на считывание уже установленного по умолчанию приложения (данных)'},
    { id: 3, title: '03', advice: 'Дайте разрешение на считывание данных из Apple Health'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

  slideToNextAdvice(e) {
    this.slideElm.slideNext();
  }

  slideToPrevAdvice(e) {
    this.slideElm.slidePrev();
  }

}
