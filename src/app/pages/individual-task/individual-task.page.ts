import { Component } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { IList } from 'src/app/shared/interfaces/List'

@Component({
  templateUrl: './individual-task.page.html',
  styleUrls: ['./individual-task.page.scss']
})
export class IndividualTaskPage {
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
  }

  listData: IList[] = []

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {}

  ionViewWillEnter() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'lessons/list?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.listData = []
              for (let i = 0; i < data.result.lessons.length; i++) {
                this.listData.push({
                  id: data.result.lessons[i].id,
                  img: 'assets/images/individual/man.png',
                  title: data.result.lessons[i].score + ' баллов',
                  subDesc: data.result.lessons[i].start_date + ' - ' + data.result.lessons[i].end_date,
                  subTitle: data.result.lessons[i].title,
                  src: '/lesson-published/' + data.result.lessons[i].id,
                  subLink: 'Посмотреть'
                })
              }
            },
            (error) => {
              console.log(error)
            }
          )
      } else {
        this.alertServ.showToast('Нет соединения с сетью')
      }
    })
  }
}
