import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core'
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular'

import { Plugins } from '@capacitor/core'
const { PedometerPlugin } = Plugins

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {
  @Input() id: number
  @Input() titleCount: string
  @Input() description: string

  @Output() toNextSlide = new EventEmitter<any>()
  @Output() toPrevSlide = new EventEmitter<any>()

  constructor(private router: Router, public navCtrl: NavController) {}

  ngOnInit(): void {}

  onChangeNextSlide() {
    this.toNextSlide.emit()
  }

  onChangePrevSlide() {
    this.toPrevSlide.emit()
  }

  toRegisterPage() {
    // запрашиваем разрешения для шагомера
    PedometerPlugin.requestPermission().then(() => {
      PedometerPlugin.start()
    })

    this.navCtrl.navigateRoot('sign-in')
  }
}
