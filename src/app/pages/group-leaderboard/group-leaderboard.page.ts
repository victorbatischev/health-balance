import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

@Component({
  templateUrl: './group-leaderboard.page.html',
  styleUrls: ['./group-leaderboard.page.scss']
})
export class GroupeLeaderboardPage {

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

  liderboard: any = [];

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        console.log(this.connectivityServ.apiUrl + 'liderboard/group?token=' + this.customerData.token);
        this.httpClient.get(this.connectivityServ.apiUrl + 'liderboard/group?token=' + this.customerData.token ).subscribe((data: any) => {
         this.liderboard = data.result;
         console.log(this.liderboard);
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }


}
