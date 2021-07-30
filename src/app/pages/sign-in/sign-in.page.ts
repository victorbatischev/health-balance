import { Component } from '@angular/core'
import { NavController, AlertController } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { CustomerService } from '../../../providers/customer-service'

@Component({
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage {
  loginInfo: { email: string; password: string } = { email: '', password: '' }

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService
  ) {}

  doLogin() {
    console.log(this.loginInfo)

    if (this.loginInfo.email.length < 6) {
      this.alertServ.showToast('Введите корректный e-mail')
      return false
    }

    if (this.loginInfo.password.length < 6) {
      this.alertServ.showToast('Пароль не может быть короче 6 символов')
      return false
    }

    if (this.connectivityServ.isOnline()) {
      this.storage.get('deviceToken').then((deviceToken) => {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'account/login?email=' +
              this.loginInfo.email +
              '&password=' +
              this.loginInfo.password +
              '&device_token=' +
              deviceToken
          )
          .subscribe(
            (data: any) => {
              this.customerServ.setCustomerData(data.result)
              this.navCtrl.navigateRoot('portfolio')
            },
            (error) => {
              this.alertServ.showToast('Неверное сочетание e-mail и пароля')
            }
          )
      })
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }

  async restorePassword(email: string) {
    const alert = await this.alertController.create({
      header: 'Восстановление пароля',
      message: 'Введите e-mail, указанный при регистрации:',
      cssClass: 'main-alert',
      inputs: [
        {
          name: 'email',
          type: 'email',
          value: email,
          placeholder: 'Е-mail'
        }
      ],
      buttons: [
        {
          text: 'Oтмена',
          role: 'cancel'
        },
        {
          text: 'Восстановить',
          handler: (data) => {
            if (data.email.length < 6) {
              this.showError('Введите корректный e-mail!', data.email)
            } else {
              if (this.connectivityServ.isOnline()) {
                console.log(
                  this.connectivityServ.apiUrl +
                    'account/restore_password?email=' +
                    data.email
                )
                var email = data.email
                this.httpClient
                  .get(
                    this.connectivityServ.apiUrl +
                      'account/restore_password?email=' +
                      email
                  )
                  .subscribe(
                    (data: any) => {
                      this.showDone()
                      this.loginInfo.email = email
                    },
                    (error) => {
                      this.showError(
                        'Пользователь с таким e-mail не существует!',
                        data.email
                      )
                    }
                  )
              } else {
                this.alertServ.showToast('Нет соединения с сетью')
              }
            }
          }
        }
      ]
    })
    await alert.present()
  }

  async showError(message: string, data: string) {
    const alert = await this.alertController.create({
      message: message,
      cssClass: 'main-alert',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Повторить',
          handler: () => {
            this.restorePassword(data)
          }
        }
      ]
    })
    await alert.present()
  }

  async showDone() {
    const alert = await this.alertController.create({
      message:
        'На e-mail, указанны при регистрации, было отправлено письмо с инструкцией по восстановлению пароля. В случае отсутствия письма, рекомендуем проверить папку «Спам».',
      cssClass: 'main-alert',
      buttons: [
        {
          text: 'Понятно',
          role: 'cancel'
        }
      ]
    })
    await alert.present()
  }
}
