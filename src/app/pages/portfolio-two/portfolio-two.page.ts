import { Component } from '@angular/core'
import { Platform, NavController, AlertController } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { Camera } from '@ionic-native/camera/ngx'
import { Crop } from '@ionic-native/crop/ngx'
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'
import { CustomerService } from '../../../providers/customer-service'

@Component({
  templateUrl: './portfolio-two.page.html',
  styleUrls: ['./portfolio-two.page.scss']
})
export class PortfolioTwoPage {
  password: string = ''
  retry_password: string = ''

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    role: 0,
    is_captain: false,
    phone: '',
    email: '',
    city: '',
    password: '',
    avatar: '',
    team: '',
    establishment: ''
  }

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private camera: Camera,
    private crop: Crop,
    private transfer: FileTransfer,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.customerData.name == this.customerData.email) {
        this.customerData.name = ''
      }
    })
  }

  doProfile() {
    if (!this.customerData.name || this.customerData.name.length < 2) {
      this.alertServ.showToast('Введите ваше имя')
      return false
    }
    if (this.password.length > 0 && this.password.length < 6) {
      this.alertServ.showToast('Пароль не может быть короче 6 символов')
      return false
    }
    if (this.password.length > 0 && this.password != this.retry_password) {
      this.alertServ.showToast('Введенные пароли должны совпадать')
      return false
    }

    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'account/profile?token=' +
            this.customerData.token +
            '&name=' +
            this.customerData.name +
            '&city=' +
            this.customerData.city +
            '&phone=' +
            this.customerData.phone +
            '&password=' +
            this.password
        )
        .subscribe(
          (data: any) => {
            this.customerServ.setCustomerData(this.customerData)
            this.alertServ.showToast('Ваш профиль был успешно обновлен')
          },
          (error) => {
            console.log(error)
            this.alertServ.showToast('Не удалось обновить профиль')
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }

  goBack() {
    this.navCtrl.pop()
  }

  async getPhoto() {
    let prompt = await this.alertCtrl.create({
      subHeader: 'Выберите действие',
      buttons: [
        {
          text: 'Сделать снимок',
          handler: () => {
            this.getCameraPhoto()
          }
        },
        {
          text: 'Выбрать из галереи',
          handler: () => {
            this.getGalleryPhoto()
          }
        },
        {
          text: 'Отмена',
          role: 'cancel'
        }
      ]
    })
    return prompt.present()
  }

  getCameraPhoto() {
    var camera_options = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(camera_options).then(
      (imageData) => {
        if (this.platform.is('android')) {
          imageData = 'file://' + imageData
        }

        this.crop.crop(imageData, { quality: 75 }).then(
          (newImage) => {
            var fname = imageData.split('/').pop()
            var upload_options = {
              fileKey: 'file',
              fileName: fname,
              chunkedMode: false,
              mimeType: 'image/jpg',
              params: { token: this.customerData.token, fileName: fname }
            }
            const fileFileTransfer: FileTransferObject = this.transfer.create()
            if (this.connectivityServ.isOnline()) {
              this.alertServ.loadingPresent()
              fileFileTransfer
                .upload(
                  newImage,
                  this.connectivityServ.apiUrl + 'account/photo',
                  upload_options,
                  true
                )
                .then(
                  (data) => {
                    this.alertServ.loadingDismiss()
                    let response = JSON.parse(data.response)
                    if (response.result.status == 'done') {
                      this.customerData.avatar = response.result.avatar
                      this.customerServ.setCustomerData(this.customerData)
                      this.alertServ.showToast(
                        'Фотография была успешно загружена'
                      )
                    } else {
                      this.alertServ.showToast('Ошибка загрузки фотографии')
                    }
                  },
                  (err) => {
                    this.alertServ.loadingDismiss()
                    this.alertServ.showToast('Ошибка загрузки фотографии')
                  }
                )
            } else {
              this.alertServ.showToast('Нет соединения с сетью')
            }
          },
          (error) => console.error('Ошибка обрезки изображения', error)
        )
      },
      function (err) {
        console.log(err)
      }
    )
  }

  getGalleryPhoto() {
    var camera_options = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(camera_options).then(
      (imageData) => {
        if (this.platform.is('android')) {
          imageData = 'file://' + imageData
        }

        this.crop.crop(imageData, { quality: 75 }).then(
          (newImage) => {
            var fname = imageData.split('/').pop()
            var upload_options = {
              fileKey: 'file',
              fileName: fname,
              chunkedMode: false,
              mimeType: 'image/jpg',
              params: { token: this.customerData.token, fileName: fname }
            }
            const fileFileTransfer: FileTransferObject = this.transfer.create()
            if (this.connectivityServ.isOnline()) {
              this.alertServ.loadingPresent()
              fileFileTransfer
                .upload(
                  newImage,
                  this.connectivityServ.apiUrl + 'account/photo',
                  upload_options,
                  true
                )
                .then(
                  (data) => {
                    this.alertServ.loadingDismiss()
                    let response = JSON.parse(data.response)
                    if (response.result.status == 'done') {
                      this.customerData.avatar = response.result.avatar
                      this.customerServ.setCustomerData(this.customerData)
                      this.alertServ.showToast(
                        'Фотография была успешно загружена'
                      )
                    } else {
                      this.alertServ.showToast('Ошибка загрузки фотографии')
                    }
                  },
                  (err) => {
                    this.alertServ.loadingDismiss()
                    this.alertServ.showToast('Ошибка загрузки фотографии')
                  }
                )
            } else {
              this.alertServ.showToast('Нет соединения с сетью')
            }
          },
          (error) => console.error('Ошибка обрезки изображения', error)
        )
      },
      function (err) {
        console.log(err)
      }
    )
  }
}
