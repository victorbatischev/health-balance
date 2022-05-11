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
  thirdSection: any = [] // результаты прохождения блока 3
  isLoading: boolean = true

  axes: any = [
    null,
    null,
    {
      labels: ['< 120', '120-129', '130-139', '140-159', '> 160'],
      images: ['+', '+', '=', '=', '-']
    },
    {
      labels: [
        ['< 4', 'ммоль/л'],
        ['4-5.2', 'ммоль/л'],
        ['5.2-6.2', 'ммоль/л'],
        ['6.2-7.2', 'ммоль/л'],
        ['> 7.2', 'ммоль/л']
      ],
      images: ['+', '+', '=', '=', '-']
    },
    {
      labels: [
        ['нормальный', '(< 3.3)'],
        ['пограничный', '(3.3 - 4.1)'],
        ['высокий', '(> 4.1)']
      ],
      images: ['+', '=', '-']
    },
    {
      labels: [
        ['высокий', '(> 1.5)'],
        ['средний', '(1 - 1.25)'],
        ['средний', '(1.25 - 1.5)'],
        ['низкий', '(< 1)']
      ],
      images: ['+', '=', '=', '-']
    },
    {
      labels: [
        ['желательный', '(< 5.5)'],
        ['пограничный', '(5.5 - 6.6)'],
        ['высокий', '(> 6.7)'],
        'я не знаю'
      ],
      images: ['+', '=', '-', '-']
    },
    {
      labels: ['', 'высокая', 'средняя', 'низкая'],
      images: ['?', '+', '=', '-']
    },
    {
      labels: ['', 'низкое', 'нормальное', 'чрезмерное'],
      images: ['?', '+', '=', '-']
    },
    {
      labels: [
        '',
        ['рацио-', 'нальное'],
        ['нерацио-', 'нальное'],
        ['опасное', 'для', 'здоровья']
      ],
      images: ['?', '+', '=', '-']
    },
    {
      labels: [['5 или ', 'более'], '3-4 порции', ['2 или ', 'меньше']],
      images: ['+', '=', '-']
    },
    {
      labels: [['5 или ', 'более'], '3-4 порции', ['2 или ', 'меньше']],
      images: ['+', '=', '-']
    },
    {
      labels: ['', 'низкий', 'средний', 'высокий'],
      images: ['?', '+', '=', '-']
    },
    {
      labels: ['', 'низкий', 'средний', 'высокий'],
      images: ['?', '+', '=', '-']
    },
    {
      labels: [
        ['удовле-', 'творен'],
        ['больше', 'удовле-', 'творен'],
        ['частично', 'удовле-', 'творен'],
        ['не', 'удовле-', 'творен']
      ],
      images: ['+', '=', '=', '-']
    },
    {
      labels: [
        ['очень', 'доволен'],
        ['доволен'],
        ['не', 'доволен'],
        ['очень', 'не', 'доволен']
      ],
      images: ['+', '+', '-', '-']
    }
  ]

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

  baseConfig: Chart.ChartConfiguration = (index) => {
    var imageSuc = document.getElementById('image_success')
    var imageWrn = document.getElementById('image_warning')
    var imageErr = document.getElementById('image_error')

    let config = {
      type: 'line',
      plugins: [
        {
          afterDraw: (chart) => {
            if (index > 1) {
              var ctx = chart.chart.ctx
              var xAxis = chart.scales['x-axis-0']
              var yAxis = chart.scales['y-axis-1']
              var ticks = yAxis.ticks.slice(0, -1)

              ticks.forEach((value, idx) => {
                var y = yAxis.getPixelForTick(ticks.length - idx)

                switch (this.axes[index].images[idx]) {
                  case '+':
                    ctx.drawImage(imageSuc, xAxis.bottom - 10, y - 10, 20, 20)
                    break
                  case '=':
                    ctx.drawImage(imageWrn, xAxis.bottom - 10, y - 10, 20, 20)
                    break
                  case '-':
                    ctx.drawImage(imageErr, xAxis.bottom - 10, y - 10, 20, 20)
                    break
                }
              })
            }
          }
        }
      ],
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
              scaleLabel: {
                display: false
              },
              ...(index > 1 && {
                ticks: {
                  min: 0,
                  max: this.axes[index].labels.length,
                  stepSize: 1,
                  beginAtZero: true,
                  fontColor: '#8f9092',
                  callback: (value) => this.axes[index].labels[value]
                }
              })
            }
          ]
        }
      }
    }

    if (index > 1) {
      let imageAxis = {
        scaleLabel: {
          display: false
        },
        position: 'right',
        ticks: {
          min: 0,
          max: this.axes[index].labels.length,
          stepSize: 1,
          beginAtZero: true,
          fontColor: '#8f9092',
          callback: () => '        '
        }
      }

      config.options.scales.yAxes.push(imageAxis)
    }

    return config
  }

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
              this.isLoading = false
              this.getStatistic()
            },
            (error) => {
              console.log(error)
            }
          )

        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'questionary/third_section?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.thirdSection = this.formatQuestions(data.answers)
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

  formatQuestions(questions) {
    return questions.map((question) => {
      return {
        ...question,
        value: question.value ? JSON.parse(question.value) : question.value,
        answers: question.answers
          ? JSON.parse(question.answers).map((answer, index) => {
              return question.answer_type === '4' ||
                question.answer_type === '7'
                ? {
                    value: answer,
                    isChecked: JSON.parse(question.value).some(
                      (value) => value === index
                    )
                  }
                : { value: answer }
            })
          : null,
        currentAnswer: null
      }
    })
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

    this.chartData = this.values.map((item) => {
      return {
        labels: this.labels,
        datasets: [
          {
            data: item,
            backgroundColor: '#168de2',
            borderColor: '#168de2',
            fill: false
          }
        ]
      }
    })

    // вывод графиков
    this.charts = this.chartElementRefs.map((chartElementRef, index) => {
      const config = Object.assign({}, this.baseConfig(index), {
        data: this.chartData[index]
      })

      return new Chart(chartElementRef.nativeElement, config)
    })
  }
}
