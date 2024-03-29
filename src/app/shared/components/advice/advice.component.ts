import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core'
import { NavController, Platform } from '@ionic/angular'

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

  constructor(public navCtrl: NavController, private platform: Platform) {}

  ngOnInit(): void {}

  onChangeNextSlide() {
    this.toNextSlide.emit()
  }

  onChangePrevSlide() {
    this.toPrevSlide.emit()
  }

  async toRegisterPage() {
    this.navCtrl.navigateRoot('sign-in')
    if (this.platform.is('android')) {
      await PedometerPlugin.requestPermission()
    }
  }
}
