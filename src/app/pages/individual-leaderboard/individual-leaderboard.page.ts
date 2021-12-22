import { Component } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

@Component({
  templateUrl: './individual-leaderboard.page.html',
  styleUrls: ['./individual-leaderboard.page.scss']
})
export class IndividualLeaderboardPage {
  selected_tab: string = 'today'
  steps: any = 0

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

  liderboard: any = []

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
              'liderboard/individual?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.liderboard = data.result
              this.setActiveTab('score')
            },
            (error) => {
              console.log(error)
              this.setActiveTab('score')
            }
          )
      } else {
        this.alertServ.showToast('Нет соединения с сетью')
      }
    })
  }

  setActiveTab(idx) {
    if (this.selected_tab === idx) {
      return false
    }
    this.selected_tab = idx
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'customers/steps?token=' +
            this.customerData.token
        )
        .subscribe(
          (data: any) => {
            this.steps = data[idx]
          },
          (error) => {
            console.log(error)
          }
        )
    }
  }
}
