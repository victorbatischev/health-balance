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
    { id: 2, title: '02', advice: 'Разрешите Health Balance доступ к данным из приложения Google Fit. Если на вашем смартфоне не установлено приложение Google Fit, скачать его можно по этой <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.fitness" target="_blank">ссылке</a>.'},
    { id: 3, title: '03', advice: 'Разрешите Health Balance присылать push-уведомления в настройках вашего смартфона.'},
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