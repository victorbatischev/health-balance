import { Component} from '@angular/core';

import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';
import { CustomerService } from '../../../providers/customer-service';

@Component({
  templateUrl: './create-program.page.html',
  styleUrls: ['./create-program.page.scss']
})
export class CreateProgramPage {

	programInfo: { title: string, image: string, team_amount: number, max_peoples: number } = { title: '', image: '', team_amount: 1, max_peoples: 1 };

  date: { from: string, to: string } = { from: '', to: '' };
  date_from: string = '';

  type: 'string';
  options: any = {
    monthPickerFormat: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
    weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthFormat: 'MMM YYYY',
    weekStart: 1,
    showToggleButtons: false,
    pickMode: 'range'
  }

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
    establishment: ''
  };

  constructor(
    private platform: Platform,
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public storage: Storage,
    private camera: Camera,
    private transfer: FileTransfer,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
    });
  }

  onChange($event) {
    console.log(this.date);
  }

  uploadPhoto() {
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
        params : {'token': this.customerData.token, 'fileName': fname}
      };

      const fileFileTransfer: FileTransferObject = this.transfer.create();
      if (this.connectivityServ.isOnline()) {
        this.alertServ.loadingPresent();
        fileFileTransfer.upload(imageData, this.connectivityServ.apiUrl + 'account/image', upload_options, true).then(data => {
          this.alertServ.loadingDismiss();
          let response = JSON.parse(data.response);
          if (response.result.status == 'done') {
            this.programInfo.image = response.result.image;
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

  createProgram() {
    if (!this.programInfo.title || this.programInfo.title.length == 0) {
      this.alertServ.showToast('Введите название программы');
      return false;
    }
    if (!this.programInfo.image || this.programInfo.image.length == 0) {
    	this.alertServ.showToast('Загрузите лого программы');
    	return false;
    }
    if (this.date.from == '' && this.date.from == '') {
      this.alertServ.showToast('Выберите дату начала и окончания действия программы');
      return false;
    }
    if (this.connectivityServ.isOnline()) {
       this.httpClient.get(this.connectivityServ.apiUrl + 'programs/add?platform_id=' + this.route.snapshot.paramMap.get('platform_id') + '&title=' + this.programInfo.title + '&image=' + this.programInfo.image + '&start_time=' + this.date.from + '&end_time=' + this.date.to + '&team_amount=' + this.programInfo.team_amount + '&max_peoples=' + this.programInfo.max_peoples).subscribe((data: any) => {
         this.alertServ.showToast('Программа была успешно добавлена');
         this.programInfo = { title: '', image: '', team_amount: 1, max_peoples: 1 };
         this.date = { from: '', to: '' };
         this.date_from = '';
        }, error => {
          console.log(error);
        });
     } else {
        this.alertServ.showToast('Нет соединения с сетью');
     }
  }

}
