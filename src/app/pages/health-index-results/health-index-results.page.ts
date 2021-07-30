import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core'
import { NavController, AlertController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { DomSanitizer } from '@angular/platform-browser'

import { Chart } from 'chart.js'

const baseConfig: Chart.ChartConfiguration = {
  type: 'line',
  options: {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Дата прохождения опроса'
          }
        }
      ],
      yAxes: [
        {
          stacked: true,
          scaleLabel: {
            display: false,
            labelString: 'Кол-во баллов'
          }
        }
      ]
    }
  }
}

@Component({
  selector: 'app-health-index-results',
  templateUrl: './health-index-results.page.html',
  styleUrls: ['./health-index-results.page.scss']
})
export class HealthIndexResultsPage {
  @ViewChildren('pr_chart', { read: ElementRef })
  chartElementRefs: QueryList<ElementRef>

  customerData: Customer = {
    token: '',
    name: '',
    role: 0,
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  }

  results: any = []
  labels: any = [] // даты прохождения опроса
  values: any = [] // значения параметров
  charts: Chart[] = [] // графики
  chartData: Chart.ChartData[] = [] // данные для графиков

  slides: any = [
    { label: 'Биологический возраст', id: 'biological_age' },
    { label: 'Индекс массы тела', id: 'body_mass_index' },
    { label: 'Давление', id: 'pressure' },
    { label: 'Общий холестерин (ммоль/л)', id: 'cholesterol' },
    {
      label:
        'ЛПНП (липопротеины низкой плотности, так называемый «‎плохой»‎ холестерин, ммоль/л)',
      id: 'bad_cholesterol'
    },
    {
      label:
        'ЛПВП (липопротеины высокой плотности, так называемый хороший холестерин, ммоль/л)',
      id: 'good_cholesterol'
    },
    { label: 'Показатель уровня глюкозы в крови', id: 'glucose' },
    { label: 'Физическая активность', id: 'physical_activity' },
    { label: 'Потребление алкоголя', id: 'alcohol' },
    { label: 'Правильное питание', id: 'food' },
    { label: 'Потребление фруктов', id: 'fruits' },
    { label: 'Потребление овощей', id: 'vegetables' },
    { label: 'Уровень стресса', id: 'stress' },
    { label: 'Уровень депрессии', id: 'depression' },
    { label: 'Удовлетворённость личной жизнью', id: 'personal_life' },
    { label: 'Удовлетворённость профессиональной жизнью', id: 'work_life' }
  ]

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    protected sanitizer: DomSanitizer
  ) {
    this.loadResults()
  }

  loadResults() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'questionary/result_dynamics?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.results = data.results
              this.getStatistic()
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

  repeatTest() {
    this.navCtrl.navigateForward('health-index')
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000)
    var months = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек'
    ]
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getDate()
    var time = date + ' ' + month + ' ' + year
    return time
  }

  getStatistic() {
    for (let i = 0; i < this.results.length; i++) {
      this.labels.push(this.timeConverter(this.results[i].created_at)) // даты прохождения опросов
    }

    this.values = this.slides.map(
      (item) => this.results.map((res) => parseFloat(res[item.id])) // значения для каждого теста
    )

    this.chartData = this.values.map((item, index) => {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.values[index],
            backgroundColor: '#168de2',
            borderColor: '#168de2',
            fill: false
          }
        ]
      }
    })

    // вывод графиков
    this.charts = this.chartElementRefs.map((chartElementRef, index) => {
      const config = Object.assign({}, baseConfig, {
        data: this.chartData[index]
      })

      return new Chart(chartElementRef.nativeElement, config)
    })
  }
}
