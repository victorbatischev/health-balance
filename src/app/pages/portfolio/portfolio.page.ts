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
  calc_steps = '-'
  intervalId: any
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
        if (this.platform.is('ios')) {
          this.health // запрос на авторизацию в Apple Health для отправки шагов
            .isAvailable()
            .then(() => {
              this.health
                .requestAuthorization([{ read: ['steps'] }])
                .then(() => this.getStepsHistory())
                .catch((error) => console.log(error))
            })
            .catch((e) => console.log(e))
        }
      },
      (error) => console.log(error)
    )

    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val
    })
  }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.getSavedData()

      // прослушиваем изменения шагов
      window.addEventListener('stepEvent', this.updateSteps)
    }

    // каждые 5 секунд запрашиваем изменения шагов
    this.intervalId = setInterval(() => {
      this.setActiveTab(this.selected_tab)

      if (this.platform.is('ios')) {
        this.getStepsHistory()
      }
    }, 5000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
    window.removeEventListener('stepEvent', this.updateSteps)
  }

  async getSavedData() {
    // запускаем сервис шагомера
    PedometerPlugin.start()

    // получаем последние данные из шагомера
    let savedData = await PedometerPlugin.getSavedData()
    let steps = savedData['numberOfSteps'] || '0'
    if (steps) this.updateSteps({ numberOfSteps: steps })
    this.ref.detectChanges()
  }

  updateSteps = (event: any) => {
    if (this.connectivityServ.isOnline() && this.customerData.token) {
      let startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      let endDate = new Date().toISOString()
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
          (error) => console.log(JSON.stringify(error))
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
      .queryAggregated({
        startDate: this.subtractMonths(3),
        endDate: new Date(),
        dataType: 'steps',
        bucket: 'day'
      })
      .then((res: any) => {
        if (this.connectivityServ.isOnline()) {
          this.ref.detectChanges()
          let steps = res.map((item) => {
            return { ...item, value: item.value.toFixed() }
          })
          this.httpClient
            .post(
              this.connectivityServ.apiUrl +
                'steps/update?token=' +
                this.customerData.token,
              JSON.stringify({ steps_arr: steps })
            )
            .subscribe(
              (data: any) => console.log(data),
              (error) => console.log(JSON.stringify(error))
            )
        }
      })
      .catch((e) => console.log(e))
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
