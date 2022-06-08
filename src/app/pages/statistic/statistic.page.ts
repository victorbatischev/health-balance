import { Component, ViewChild } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'
import { CustomerService } from '../../../providers/customer-service'

import { Chart } from 'chart.js'

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.page.html',
  styleUrls: ['./statistic.page.scss']
})
export class StatisticPage {
  @ViewChild('barCanvas') barCanvas
  barChart: any

  selected_tabs: number = 0

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    avatar: '',
    team: '',
    establishment: ''
  }

  stat_type: number = 0

  statistics_data: any = []
  exist: boolean = false

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      this.setTabs(1)
    })
    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val
    })
  }

  getStatistic(idx) {
    var labels: any = [],
      values: any = []

    for (let i = 0; i < this.statistics_data.length; i++) {
      labels.push(this.statistics_data[i].label)
      values.push(this.statistics_data[i].value)
    }

    if (this.exist) {
      this.barChart.destroy()
    }

    var lbl = 'Временной промежуток'

    switch (idx) {
      case 1:
        lbl = 'Дни'
        break
      case 2:
        lbl = 'Недели'
        break
      case 3:
        lbl = 'Месяцы'
        break
    }
    Chart.defaults.global.defaultFontColor = '#A3A3A3'
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: '#F39F18',
            borderColor: '#F39F18',
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
              gridLines: {
                color: '#2D2D2D'
              },
              scaleLabel: {
                display: true,
                labelString: lbl,
                fontColor: '#5C5C5C'
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                color: '#2D2D2D'
              },
              scaleLabel: {
                display: true,
                labelString:
                  this.stat_type == 0 ? 'Кол-во заданий' : 'Кол-во баллов',
                fontColor: '#5C5C5C'
              }
            }
          ]
        }
      }
    })

    this.exist = true
  }

  setTabs(idx) {
    this.selected_tabs = idx
    if (idx > 0) {
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'main/stat?token=' +
              this.customerData.token +
              '&stat_type=' +
              this.stat_type +
              '&period=' +
              idx
          )
          .subscribe(
            (data: any) => {
              this.statistics_data = data.result.data
              this.getStatistic(idx)
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
