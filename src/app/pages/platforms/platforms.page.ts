import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

import { IList } from './../../shared/interfaces/List';

@Component({
   selector: 'app-platforms',
  templateUrl: './platforms.page.html',
  styleUrls: ['./platforms.page.scss'],
})
export class PlatformsPage {

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    role: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  };

  listData: IList[] = [];

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'platforms/list').subscribe((data: any) => {
         console.log(data);
         for (let i = 0; i < data.result.platforms.length; i++) {
          if (this.customerData.role == 1) {
           this.listData.push({ id: data.result.platforms[i].id, img: data.result.platforms[i].image, title: data.result.platforms[i].title, src: 'create-program/' + data.result.platforms[i].id, subLink: 'Добавить программу', subTitle: '' });
          } else {
            this.listData.push({ id: data.result.platforms[i].id, img: data.result.platforms[i].image, title: data.result.platforms[i].title, subTitle: '' });
          }
         }
         console.log(this.listData);
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }


}

