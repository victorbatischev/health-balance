import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core'
import { NavController } from '@ionic/angular'

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'

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

  constructor(
    public navCtrl: NavController,
    private androidPermissions: AndroidPermissions
  ) {}

  ngOnInit(): void {}

  onChangeNextSlide() {
    this.toNextSlide.emit()
  }

  onChangePrevSlide() {
    this.toPrevSlide.emit()
  }

  toRegisterPage() {
    this.androidPermissions
      .requestPermission(
        this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION
      )
      .then(
        async (result) => {
          await PedometerPlugin.requestPermission()
          if (result.hasPermission) {
            console.log('have permission')
          }
        },
        (error) => console.log('Error permission: ' + error)
      )
    this.navCtrl.navigateRoot('sign-in')
  }
}
