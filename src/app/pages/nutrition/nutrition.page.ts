import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

import { IList } from 'src/app/shared/interfaces/List';

@Component({
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss']
})
export class NutritionPage {
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

  program: any = [];
  listData: IList[] = [];

  constructor(
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) { }

  ionViewWillEnter() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'programs/teams?program_id=' + this.route.snapshot.paramMap.get('program_id')).subscribe((data: any) => {
         console.log(data);
         this.program = data.result.program;
         this.listData = [];
         for (let i = 0; i < data.result.programs_teams.length; i++) {
           this.listData.push({ id: data.result.programs_teams[i].id, img: 'assets/images/nutrition/medal.png', title: data.result.programs_teams[i].title, button: 'Вступить', subDesc: data.result.programs_teams[i].steps + ' баллов' });
         }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

}
