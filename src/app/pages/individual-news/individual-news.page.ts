import { Component } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'
import { IList } from 'src/app/shared/interfaces/List'

@Component({
  templateUrl: './individual-news.page.html',
  styleUrls: ['./individual-news.page.scss']
})
export class IndividualNewsPage {
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
  }

  listData: IList[] = []
  news: any = []

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
              'news/list?token=' +
              this.customerData.token +
              '&type=individual'
          )
          .subscribe(
            (data: any) => {
              this.news = data.result.news
              this.httpClient
                .get(this.connectivityServ.apiUrl + 'routes/list')
                .subscribe(
                  (data: any) => {
                    for (let i = 0; i < data.result.routes.length; i++) {
                      this.listData.push({
                        id: data.result.routes[i].id,
                        img: data.result.routes[i].image,
                        title: data.result.routes[i].short_description,
                        subTitle: data.result.routes[i].title
                      })
                    }
                  },
                  (error) => {
                    console.log(error)
                  }
                )
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
