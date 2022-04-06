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
       this.storage.get('date_type').then((date_type) => {
        this.storage.get('date_value').then((date_value) => {
          if (this.connectivityServ.isOnline()) {
            var url = this.connectivityServ.apiUrl + 'lessons/list?program_id=' + this.route.snapshot.paramMap.get('program_id') + '&token=' + this.customerData.token + '&type_id=group';
            if (date_type !== null && date_value !== null) {
              url += '&date_type=' + date_type + '&date_value=' + date_value;
            }
            console.log(url);
            this.httpClient.get(url).subscribe((data: any) => {
             console.log(data);
             this.storage.remove('date_type');
             this.storage.remove('date_value');
             this.listData = [];
             this.program_title = data.result.program_title;
             for (let i = 0; i < data.result.lessons.length; i++) {
               this.listData.push({ id: data.result.lessons[i].id, img:  data.result.lessons[i].program_image != '' ? data.result.lessons[i].program_image : data.result.program_image, title: data.result.lessons[i].score + ' баллов', subTitle: data.result.lessons[i].title, subDesc: data.result.lessons[i].start_date + ' - ' + data.result.lessons[i].end_date, src: '/lesson-published/' + data.result.lessons[i].id, subLink: 'Посмотреть', complete: data.result.lessons[i].complete });
             }
            }, error => {
              console.log(error);
            });
          } else {
            this.alertServ.showToast('Нет соединения с сетью');
          }
        });
      });
    });
  }

}
