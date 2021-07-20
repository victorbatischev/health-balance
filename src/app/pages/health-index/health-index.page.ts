import { Component } from '@angular/core'
import { NavController, AlertController } from '@ionic/angular'

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
  progress: any = { step: '', title: 'Загрузка...' }
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
                return {
                  ...question,
                  answers: question.answers
                    ? JSON.parse(question.answers).map((answer) => {
                        return question.answer_type === '4'
                          ? { value: answer, isChecked: false }
                          : { value: answer }
                      })
                    : null,
                  currentAnswer: null
                }
              })
              this.progress = data.progress
              // в анкете 1 добавим согласие на передачу данных
              if (this.progress.step === 1) {
                this.questions.push({
                  id: '0',
                  question:
                    'Я выражаю своё согласие на передачу данных опроса медицинскому работнику для ознакомления',
                  tag: 'agreement',
                  answer_type: '4',
                  answers: [
                    {
                      value: 'Согласие на передачу данных опроса',
                      isChecked: false
                    }
                  ]
                })
              }
              console.log(this.questions)
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

  // выбор ответа в типе вопроса 1
  setAnswer(idx1, idx2) {
    this.questions.find((question) => question.id === idx1).currentAnswer = idx2
    console.log(this.questions)
  }

  // отправка ответов на сервер
  doAnswer() {
    var answers = ''
    for (let i = 0; i < this.questions.length; i++) {
      answers += this.questions[i].currentAnswer + ','
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
