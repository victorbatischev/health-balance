import { Component } from '@angular/core'
import { Platform, NavController, AlertController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-health-index',
  templateUrl: './health-index.page.html',
  styleUrls: ['./health-index.page.scss']
})
export class HealthIndexPage {
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

  questions: any = []
  progress: any = null
  idx: number = 0
  count: number = 0

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
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      this.loadQuestions()
    })
  }

  loadQuestions() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(this.connectivityServ.apiUrl + 'questionary/listing')
          .subscribe(
            (data: any) => {
              this.questions = data.questions.map((question) => {
                return { ...question, answers: JSON.parse(question.answers) }
              })
              this.progress = data.progress
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

  setAnswer(idx1, idx2) {
    this.questions[idx1].current_answer = idx2
  }

  doAnswer() {
    var answers = ''
    for (let i = 0; i < this.questions.length; i++) {
      answers += this.questions[i].current_answer + ','
    }
    answers = answers.slice(0, -1)
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'interviews/ok?interview_id=' +
            this.route.snapshot.paramMap.get('interview_id') +
            '&answers=' +
            answers +
            '&token=' +
            this.customerData.token
        )
        .subscribe(
          (data: any) => {
            this.alertServ.showToast('Ваши ответы учтены')
            this.navCtrl.pop()
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
