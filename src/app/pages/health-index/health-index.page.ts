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
          .get(
            this.connectivityServ.apiUrl +
              'questionary/listing?token=' +
              this.customerData.token
          )
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
              if (this.progress.step === '1') {
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
  }

  convertAnswers() {
    var mapped = this.questions.map((item) => {
      if (
        item.answer_type === '1' ||
        item.answer_type === '2' ||
        item.answer_type === '3'
      ) {
        return { [item.id]: item.currentAnswer }
      } else if (item.answer_type === '4') {
        return {
          [item.id]: item.answers
            .map((answer, index) => (answer.isChecked ? index : null))
            .filter((item) => item !== null)
        }
      } else if (item.answer_type === '5') {
        return { [item.id]: new Date(item.currentAnswer).getTime() }
      }
    })

    return Object.assign({}, ...mapped)
  }

  // отправка ответов на сервер
  doAnswer() {
    // проверка на согласие на передачу данных
    if (
      this.progress.step === 1 &&
      !this.questions.find((item) => item.id === '0').answers[0].isChecked
    ) {
      return this.alertServ.showToast(
        'Для начала дайте своё согласие на передачу данных опроса медицинскому работнику для ознакомления'
      )
    }
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .post(
          this.connectivityServ.apiUrl +
            'questionary/save_answers' +
            '?token=' +
            this.customerData.token +
            '&answers=' +
            JSON.stringify(this.convertAnswers()),
          this.convertAnswers()
        )
        .subscribe(
          (data: any) => {
            console.log(data)
            this.alertServ.showToast('Ваши ответы учтены')
            // this.navCtrl.pop()
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
