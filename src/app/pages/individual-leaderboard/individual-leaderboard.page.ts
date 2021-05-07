import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

@Component({
  templateUrl: './individual-leaderboard.page.html',
  styleUrls: ['./individual-leaderboard.page.scss']
})
export class IndividualLeaderboardPage {

  selected_tabs: number;
  steps: any = 0;

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
        this.httpClient.get(this.connectivityServ.apiUrl + 'liderboard/individual?token=' + this.customerData.token ).subscribe((data: any) => {
         this.liderboard = data.result;
         console.log(this.liderboard);
         this.setTabs(0);
        }, error => {
          console.log(error);
          this.setTabs(0);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

   setTabs(idx) {
    if (this.selected_tabs == idx) {
      return false;
    }
    this.selected_tabs = idx;
    if (this.connectivityServ.isOnline()) {
      this.httpClient.get(this.connectivityServ.apiUrl + 'steps/main_history?token=' + this.customerData.token + '&period=' + idx).subscribe((data: any) => {
        this.steps = data.result.steps;
      }, error => {
        console.log(error);
      });
    } else {
      this.alertServ.showToast('Нет соединения с сетью');
    }
  }
}
