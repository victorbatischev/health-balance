import { Injectable } from '@angular/core'
import { AlertController, LoadingController } from '@ionic/angular'
import { Plugins } from '@capacitor/core'

const { Toast } = Plugins

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  isLoading = false

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {}

  // Алерты
  async showAlert(message) {
    let alert = await this.alertCtrl.create({
      message: message,
      cssClass: 'main-alert',
      buttons: [
        {
          text: 'OK'
        }
      ]
    })
    return await alert.present()
  }

  // Загрузка
  async loadingPresent() {
    this.isLoading = true
    return await this.loadingController
      .create({
        message: 'Пожалуйста подождите...',
        duration: 10000
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss()
          }
        })
      })
  }

  async loadingDismiss() {
    this.isLoading = false
    return await this.loadingController.dismiss()
  }

  // Тосты
  async showToast(text) {
    await Toast.show({
      text: text,
      duration: 'short'
    })
  }
}
