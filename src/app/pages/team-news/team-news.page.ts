import { Component } from '@angular/core'
import { Platform, AlertController } from '@ionic/angular'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { IOSFilePicker } from '@ionic-native/file-picker/ngx'

import { Camera } from '@ionic-native/camera/ngx'
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

@Component({
  templateUrl: './team-news.page.html',
  styleUrls: ['./team-news.page.scss']
})
export class TeamNewsPage {
  customerData: Customer = {
    token: '',
    name: '',
    role: 0,
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  }

  platforms: any = []
  news: any = []

  platform_id: string = '0'
  news_title: string = ''
  news_annotation: string = ''

  video_file: string = ''
  isVideo: boolean = false

  any_file: string = ''
  isFile: boolean = false

  push: string = ''
  send_push: boolean = false

  constructor(
    private platform: Platform,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private filePicker: IOSFilePicker,
    private camera: Camera,
    private transfer: FileTransfer,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {
    this.loadNews()
  }

  loadNews() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'platforms/for_curator?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.platforms = data.result.platforms
            },
            (error) => {
              console.log(error)
            }
          )
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'news/list?token=' +
              this.customerData.token +
              '&type=group'
          )
          .subscribe(
            (data: any) => {
              this.news = data.result.news
            },
            (error) => {
              console.log(error)
            }
          )
      } else {
        this.alertServ.showToast('Нет соединения с сетью')
      }
    })
  }

  selectVideo() {
    this.isVideo = true
    this.isFile = false
  }

  selectFile() {
    this.isVideo = false
    this.filePicker
      .pickFile()
      .then((uri) => {
        this.any_file = uri
        this.isFile = true
      })
      .catch((err) => console.log('Error', err))
  }

  async getPhoto() {
    this.isVideo = false
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
              imageData,
              this.connectivityServ.apiUrl + 'account/image',
              upload_options,
              true
            )
            .then(
              (data) => {
                this.alertServ.loadingDismiss()
                let response = JSON.parse(data.response)
                if (response.result.status == 'done') {
                  this.any_file = response.result.image
                  this.isFile = true
                  this.alertServ.showToast('Фотография была успешно загружена')
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
              imageData,
              this.connectivityServ.apiUrl + 'account/image',
              upload_options,
              true
            )
            .then(
              (data) => {
                this.alertServ.loadingDismiss()
                let response = JSON.parse(data.response)
                if (response.result.status == 'done') {
                  this.any_file = response.result.image
                  this.isFile = true
                  this.alertServ.showToast('Фотография была успешно загружена')
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
      function (err) {
        console.log(err)
      }
    )
  }

  sendNews() {
    if (+this.platform_id == 0) {
      this.alertServ.showToast('Выберите программу / место публикации')
      return false
    }

    if (this.news_title.length == 0) {
      this.alertServ.showToast('Введите заголовок новости')
      return false
    }

    if (this.news_annotation.length < 10) {
      this.alertServ.showToast('Введенная новость слишком короткая')
      return false
    }

    if (this.isVideo && this.video_file.length == 0) {
      this.alertServ.showToast('Укажите урл для видео')
      return false
    }
    var file = ''
    if (this.isVideo) {
      file = this.video_file
    } else {
      file = this.any_file
    }

    if (!this.send_push) {
      this.push = ''
    }

    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'news/add?token=' +
            this.customerData.token +
            '&platform_id=' +
            this.platform_id +
            '&image=' +
            file +
            '&title=' +
            this.news_title +
            '&annotation=' +
            this.news_annotation +
            '&push=' +
            this.push
        )
        .subscribe(
          (data: any) => {
            this.alertServ.showToast('Новость была успешно добавлена')
            this.news_title = ''
            this.news_annotation = ''
            this.video_file = ''
            this.push = ''
            this.loadNews()
          },
          (error) => {
            console.log(error)
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }
}
