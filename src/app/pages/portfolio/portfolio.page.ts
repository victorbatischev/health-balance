import { Component, ChangeDetectorRef } from '@angular/core'
import { Platform } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { Health } from '@awesome-cordova-plugins/health/ngx'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'
import { CustomerService } from '../../../providers/customer-service'

@Component({
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss']
})
export class PortfolioPage {
  calc_steps: number = 0

  selected_tab: string = 'today'

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

  constructor(
    public refdect: ChangeDetectorRef,
    public httpClient: HttpClient,
    public storage: Storage,
    private health: Health,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService,
    private platform: Platform
  ) {
    this.storage.get('customerData').then(
      (val) => {
        this.customerData = val
        this.setActiveTab('today')
        // проверка на доступность Apple Health
        this.health
          .isAvailable()
          .then((available: boolean) => {
            if (available && this.platform.is('ios')) {
              // запрос на авторизацию в Apple Health для отправки шагов
              this.health
                .requestAuthorization([{ read: ['steps'] }])
                .then((res) => {
                  this.getStepsHistory()
                })
                .catch((error) => {
                  this.alertServ.showToast('Error authorization: ' + error)
                })
            }
          })
          .catch((e) => console.log(e))
      },
      (error) => this.alertServ.showToast('Error permission: ' + error)
    )

    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val
    })
  }

  subtractMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths)
    return date
  }

  getStepsHistory() {
    // получение данных по шагам за последний месяц
    this.health
      .query({
        startDate: this.subtractMonths(1),
        endDate: new Date(),
        dataType: 'steps'
      })
      .then((res: any) => {
        this.refdect.detectChanges()

        if (this.connectivityServ.isOnline()) {
          this.httpClient
            .post(
              this.connectivityServ.apiUrl +
                'steps/update?token=' +
                this.customerData.token,
              JSON.stringify({ steps_arr: res })
            )
            .subscribe(
              (data: any) => console.log(data),
              (error) =>
                this.alertServ.showToast(
                  'Error received: ' + JSON.stringify(error)
                )
            )
        }
      })
      .catch((e) => this.alertServ.showToast('Error: ' + e))
  }

  setActiveTab(idx) {
    this.selected_tab = idx
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'customers/steps?token=' +
            this.customerData.token
        )
        .subscribe(
          (data: any) => (this.calc_steps = data[idx]),
          (error) => console.log(error)
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }
}
