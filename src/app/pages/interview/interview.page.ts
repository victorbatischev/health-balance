import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.page.html',
  styleUrls: ['./interview.page.scss'],
})
export class InterviewPage {

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
  };

  questions: any = [];
  //question: any = [];
  idx: number = 0;
  count: number = 0;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      this.loadQuestions();
    });
  }

  loadQuestions() {
     this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'interviews/get?interview_id=' + this.route.snapshot.paramMap.get('interview_id')).subscribe((data: any) => {
          this.questions = data.result.questions;
          console.log(this.questions);
          if (this.questions.length > 0) {
            //this.question = this.questions[this.idx];
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

  doAnswer() {
    this.alertServ.showToast('Вы набрали ' + this.count + ' очков');
    this.navCtrl.pop();
    /*
    if (right) {
      this.count++;
    }
    if (this.questions.length - 1 > this.idx) {
      this.idx++;
      //this.question = this.questions[this.idx];
    } else {
      this.idx = 0;
      //this.question = this.questions[this.idx];
      this.alertServ.showToast('Вы набрали ' + this.count + ' очков');
      this.navCtrl.pop();
    }*/
  }


}
