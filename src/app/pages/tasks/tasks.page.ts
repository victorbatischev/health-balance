import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

import { IList } from 'src/app/shared/interfaces/List';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
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
  program_title: string = '';

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
        this.httpClient.get(this.connectivityServ.apiUrl + 'lessons/list?program_id=' + this.route.snapshot.paramMap.get('program_id')).subscribe((data: any) => {
         console.log(data);
         this.listData = [];
         this.program_title = data.result.program_title;
         for (let i = 0; i < data.result.lessons.length; i++) {
           this.listData.push({ id: data.result.lessons[i].id, img:  data.result.program_image, title: data.result.lessons[i].score + ' баллов', subTitle: data.result.lessons[i].title, subDesc: 'с ' + data.result.lessons[i].start_date + ' по ' + data.result.lessons[i].end_date, src: '/lesson-published/' + data.result.lessons[i].id, subLink: 'Посмотреть' });
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
