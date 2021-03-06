import { Component, NgZone, ChangeDetectorRef } from '@angular/core'

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
  steps: any = 0
  calc_steps: number = 0
  tracking: boolean = false
  timeoutId: any

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

  place: number = 0

  constructor(
    private zone: NgZone,
    public refdect: ChangeDetectorRef,
    public httpClient: HttpClient,
    public storage: Storage,
    private health: Health,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val

      // проверка на доступность Google Fit
      this.health
        .isAvailable()
        .then((available: boolean) => {
          this.alertServ.showToast(available)
          // запрос на авторизацию в Google Fit для считывания шагов
          this.health
            .requestAuthorization([
              {
                read: ['steps']
              }
            ])
            .then((res) => {
              this.tracking = true
              this.startTracking(100)
            })
            .catch((error) => {
              this.alertServ.showToast('Error authorization: ' + error)
            })
        })
        .catch((e) => console.log(e))
    })

    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val
    })
  }

  ionViewDidLeave() {
    this.tracking = false
    clearTimeout(this.timeoutId)
  }

  startTracking(delay) {
    if (this.tracking) {
      this.timeoutId = setTimeout(() => {
        var start_date = new Date()
        start_date.setHours(0, 0, 0, 0)

        // Получение данных по шагам
        this.health
          .queryAggregated({
            startDate: start_date,
            endDate: new Date(), // now
            dataType: 'steps'
          })
          .then((res: any) => {
            this.zone.run(() => {
              this.steps = res.value
            })
            this.refdect.detectChanges()
            if (this.connectivityServ.isOnline()) {
              this.httpClient
                .get(
                  this.connectivityServ.apiUrl +
                    'steps/update?token=' +
                    this.customerData.token +
                    '&steps=' +
                    this.steps
                )
                .subscribe(
                  (data: any) => {
                    this.place = data.result.place
                  },
                  (error) => {
                    console.log(error)
                  }
                )
            }
            this.startTracking(5000)
          })
          .catch((e) => console.log(e))
      }, delay)
    }
  }

  setActiveTab(idx) {
    if (this.selected_tab === idx) {
      return false
    }
    this.selected_tab = idx
    if (idx !== 'today') {
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'customers/steps?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.calc_steps = data[idx]
            },
            (error) => {
              console.log(error)
            }
          )
      } else {
        this.alertServ.showToast('Нет соединения с сетью')
      }
    }
  }
}
