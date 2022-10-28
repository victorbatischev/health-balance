import { Component, ChangeDetectorRef } from '@angular/core'
import { Platform } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { Health } from '@awesome-cordova-plugins/health/ngx'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'
import { CustomerService } from '../../../providers/customer-service'

import { Plugins } from '@capacitor/core'
const { PedometerPlugin } = Plugins

@Component({
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss']
})
export class PortfolioPage {
  calc_steps: number = 0
  intervalId: any
  selected_tab: string = 'today'
  steps = 0 // шаги из шагомера

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
    public ref: ChangeDetectorRef,
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
        // проверка на доступность Apple Health
        this.health
          .isAvailable()
          .then((available: boolean) => {
            if (available && this.platform.is('ios')) {
              // запрос на авторизацию в Apple Health для отправки шагов
              this.health
                .requestAuthorization([{ read: ['steps'] }])
                .then(() => {
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

  ngOnInit() {
    this.getSavedData()

    // прослушиваем изменения шагов
    window.addEventListener('stepEvent', this.updateSteps)

    // каждые 5 секунд запрашиваем изменения шагов
    this.intervalId = setInterval(() => {
      this.setActiveTab(this.selected_tab)
    }, 5000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
    window.removeEventListener('stepEvent', this.updateSteps)
  }

  async getSavedData() {
    // запускаем сервис шагомера
    await PedometerPlugin.start()

    // получаем последние данные из шагомера
    let savedData = await PedometerPlugin.getSavedData()
    this.steps = savedData['numberOfSteps'] || 0
    this.ref.detectChanges()
  }

  updateSteps = (event: any) => {
    if (this.connectivityServ.isOnline() && this.customerData.token) {
      let startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      let endDate = new Date().toISOString()
      this.steps = event.numberOfSteps
      this.ref.detectChanges()
      this.httpClient
        .post(
          this.connectivityServ.apiUrl +
            'steps/update?token=' +
            this.customerData.token,
          JSON.stringify({
            steps_arr: [{ startDate, endDate, value: event.numberOfSteps }]
          })
        )
        .subscribe(
          (data: any) => console.log(data),
          (error) =>
            this.alertServ.showToast('Error received: ' + JSON.stringify(error))
        )
    }
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
        this.ref.detectChanges()
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
          (data: any) => {
            // передаём в сервис большее количество шагов
            if (data.today > this.steps) {
              PedometerPlugin.setData({ numberOfSteps: data.today })
            } else if (data.today < this.steps) {
              this.updateSteps({ numberOfSteps: this.steps })
            }
            this.calc_steps = data[idx]
          },
          (error) => console.log(error)
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }
}
