import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

@Component({
  templateUrl: './lesson-published.page.html',
  styleUrls: ['./lesson-published.page.scss']
})
export class LessonPublishedPage {

  lesson: any = [];
  answer: string = '';

  trustedVideoUrl: SafeResourceUrl = '';

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    avatar: '',
    team: '',
    establishment: '',
    platform_id: 0
  };

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    public httpClient: HttpClient,
    public storage: Storage,
    private camera: Camera,
    private transfer: FileTransfer,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker,
    private barcodeScanner: BarcodeScanner,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'lessons/get?lesson_id=' + this.route.snapshot.paramMap.get('lesson_id') + '&token=' + this.customerData.token).subscribe((data: any) => {
          console.log(data);
          this.lesson = data.result.lesson;
          if (this.lesson.video != '') {
            this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.lesson.video);
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

  doAnswer(idx) {
    if (this.lesson.exist) {
      this.alertServ.showToast('Вы уже выполняли данное задание');
      return false;
    }
    if (idx == this.lesson.correct_answer || +this.lesson.correct_answer == -1) {
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'lessons/ok?lesson_id=' + this.route.snapshot.paramMap.get('lesson_id')  + '&answer=' + idx + '&token=' + this.customerData.token).subscribe((data: any) => {
          if (+this.lesson.correct_answer != -1) {
            this.alertServ.showToast('Верно! Задание выполнено!');
          } else {
            this.alertServ.showToast('Ваш ответ учтён');
          }
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    } else {
      this.alertServ.showToast('Вы не правильно ответили на вопрос');
    }
  }

  startTask() {
    console.log(this.lesson.exist);
    if (this.lesson.exist) {
      this.alertServ.showToast('Вы уже выполняли данное задание');
      return false;
    }
    switch (+this.lesson.type_id) {
      case 2:
        this.barcodeScanner.scan().then(barcodeData => {
          if (barcodeData.text == this.lesson.qr_code) {
            if (this.connectivityServ.isOnline()) {
              this.httpClient.get(this.connectivityServ.apiUrl + 'lessons/ok?lesson_id=' + this.route.snapshot.paramMap.get('lesson_id') + '&token=' + this.customerData.token).subscribe((data: any) => {
                 this.alertServ.showToast('Задание выполнено');
                 this.navCtrl.pop();
              }, error => {
                console.log(error);
              });
            } else {
              this.alertServ.showToast('Нет соединения с сетью');
            }
          } else {
            this.alertServ.showToast('Сканированный код не соответствует требуемому');
            this.navCtrl.pop();
          }
        }).catch(err => {
          this.navCtrl.pop();
        });
      break;
      case 3:
        if (this.answer == '') {
          this.alertServ.showToast('Введите ответ на вопрос');
          return false;
        } else {
          if (this.connectivityServ.isOnline()) {
            this.httpClient.get(this.connectivityServ.apiUrl + 'lessons/ok?lesson_id=' + this.route.snapshot.paramMap.get('lesson_id') + '&answer=' + this.answer + '&token=' + this.customerData.token).subscribe((data: any) => {
              this.alertServ.showToast('Ваш ответ учтён');
              this.navCtrl.pop();
            }, error => {
              console.log(error);
            });
          } else {
            this.alertServ.showToast('Нет соединения с сетью');
          }
        }
      break;
      default:
        this.alertServ.showToast('Не удалось определить тип задания');
      break;
    }
  }

  uploadPhoto() {
    console.log(this.lesson.exist);
    if (this.lesson.exist) {
      this.alertServ.showToast('Вы уже выполняли данное задание');
      return false;
    }
    var camera_options = {
      quality: 75,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      //destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.camera.getPicture(camera_options).then((imageData) => {

      if (this.platform.is('android')) {
        imageData = 'file://' + imageData;
      }

      var fname = imageData.split("/").pop();
      var upload_options = {
        fileKey: "file",
        fileName: fname,
        chunkedMode: false,
        mimeType: "image/jpg",
        params : {'token': this.customerData.token, 'lesson_id': this.route.snapshot.paramMap.get('lesson_id'), 'fileName': fname}
      };

      const fileFileTransfer: FileTransferObject = this.transfer.create();
      if (this.connectivityServ.isOnline()) {
        this.alertServ.loadingPresent();
        fileFileTransfer.upload(imageData, this.connectivityServ.apiUrl + 'account/image', upload_options, true).then(data => {
          this.alertServ.loadingDismiss();
          let response = JSON.parse(data.response);
          if (response.result.status == 'done') {
            this.alertServ.showToast('Изображение было успешно загружено');
          } else {
            this.alertServ.showToast('Ошибка загрузки изображения');
          }
        }, err => {
          this.alertServ.loadingDismiss();
          this.alertServ.showToast('Ошибка загрузки изображения');
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    }, function (err) {
      console.log(err);
    });
  }

  uploadDoc() {
    if (this.lesson.exist) {
      this.alertServ.showToast('Вы уже выполняли данное задание');
      return false;
    }
    if (this.platform.is('android')) {
      this.fileChooser.open().then(uri => {
        console.log(uri);
        this.alertServ.showToast('Файл был успешно загружен');
        this.navCtrl.pop();
      }).catch(e => {
        console.log(e);
        this.alertServ.showToast('Ошибка выбора файла');
      });
    } else {
      this.filePicker.pickFile().then(uri => {
        console.log(uri)
        this.alertServ.showToast('Файл был успешно загружен');
        this.navCtrl.pop();
      }).catch(err => {
        console.log('Error', err);
        this.alertServ.showToast('Ошибка выбора файла');
      });
    }
  }


}
