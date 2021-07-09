import { Component } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { IList } from '../../shared/interfaces/List'

@Component({
  templateUrl: './health-index.page.html',
  styleUrls: ['./health-index.page.scss']
})
export class HealthIndexPage {
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
              'questionary/blocks?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              for (let i = 0; i < data.length; i++) {
                this.qaList.push({
                  id: data[i].id,
                  img: data[i].image,
                  title: data[i].short_description,
                  subTitle: data[i].title,
                  src: '/interview/' + data[i].id,
                  subLink: 'Пройти',
                  complete: data[i].complete
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
