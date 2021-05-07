import { Component, ViewChild } from '@angular/core';

import { IonContent } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';
import { IList } from 'src/app/shared/interfaces/List';

@Component({
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage {

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  };

  localItem: IList;
  listData: IList[] = [];
  @ViewChild(IonContent, { static: false, read: IonContent }) content: IonContent;

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'products/list').subscribe((data: any) => {
          for (let i = 0; i < data.result.products.length; i++) {
            this.listData.push({ id: data.result.products[i].id, img: data.result.products[i].image, title: data.result.products[i].title, subTitle: data.result.products[i].price + ' шагов', subDesc: data.result.products[i].description, button: 'Обменять' });
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }


  setLocalItem(item) {
    this.localItem = item;
    this.content.scrollToBottom(500);
  }

}
