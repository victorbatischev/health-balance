import { Component, ViewChild } from '@angular/core'
import { NavController, AlertController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { DomSanitizer } from '@angular/platform-browser'

import { Chart } from 'chart.js'

@Component({
  selector: 'app-health-index-results',
  templateUrl: './health-index-results.page.html',
  styleUrls: ['./health-index-results.page.scss']
})
export class HealthIndexResultsPage {
  @ViewChild('barCanvas') barCanvas
  barChart: any

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

  slides: any = [
    'Биологический возраст',
    'Индекс массы тела',
    'Давление',
    'Общий холестерин (ммоль/л)',
    'ЛПНП (липопротеины низкой плотности, так называемый «‎плохой»‎ холестерин, ммоль/л)',
    'ЛПВП (липопротеины высокой плотности, так называемый хороший холестерин, ммоль/л)',
    'Показатель уровня глюкозы в крови',
    'Физическая активность',
    'Потребление алкоголя',
    'Правильное питание',
    'Потребление фруктов',
    'Потребление овощей',
    'Уровень стресса',
    'Уровень депрессии',
    'Удовлетворённость личной жизнью',
    'Удовлетворённость профессиональной жизнью'
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
              console.log(data.results)
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

  getStatistic() {
    var labels: any = ['12', '34'],
      values: any = [56, 78]

    // for (let i = 0; i < this.results.length; i++) {
    //   labels.push(this.results[i].label)
    //   values.push(this.results[i].value)
    // }

    var lbl = 'Временной промежуток'

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: '#168de2',
            borderColor: '#168de2',
            fill: false
          }
        ]
      },
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
                labelString: lbl
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Кол-во баллов'
              }
            }
          ]
        }
      }
    })
  }
}
