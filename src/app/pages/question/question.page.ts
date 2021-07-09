import { Component } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { IList } from './../../shared/interfaces/List'

@Component({
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss']
})
export class QuestionPage {
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

  qaList: IList[] = []

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'interviews/list?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              console.log(data)
              for (let i = 0; i < data.result.interviews.length; i++) {
                this.qaList.push({
                  id: data.result.interviews[i].id,
                  img: data.result.interviews[i].image,
                  title: data.result.interviews[i].short_description,
                  subTitle: data.result.interviews[i].title,
                  src: '/interview/' + data.result.interviews[i].id,
                  subLink: 'Пройти',
                  complete: data.result.interviews[i].complete
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
