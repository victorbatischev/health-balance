import { Component, ViewChild } from '@angular/core'
import { NavController, AlertController, IonContent } from '@ionic/angular'

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
  @ViewChild(IonContent) content: IonContent

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
  tempQuestions: any = []
  progress: any = { step: '', title: 'Загрузка...' }
  blocks: any = []
  firstBlocks: any = []
  lastBlocks: any = []
  idx: number = 0
  lastStep: boolean = false

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
    this.loadQuestions(false)
  }

  continuePoll() {
    this.questions = [...this.tempQuestions]
  }

  interruptPoll() {
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'questionary/interrupt?token=' +
            this.customerData.token
        )
        .subscribe(
          () => {
            this.loadQuestions(true)
          },
          (error) => {
            console.log(error)
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }

  loadQuestions(saveAnswers: boolean) {
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
              let tempQuestions = this.formatQuestions(data.questions)
              this.progress = data.progress
              this.blocks = data.blocks || []
              if (this.blocks.length > 0) {
                this.firstBlocks = this.blocks.map((item) => item.questions[0])
                this.lastBlocks = this.blocks.map(
                  (item) => item.questions[item.questions.length - 1]
                )
              }

              // проверка на последний шаг
              if (data.last_step) {
                this.lastStep = true
              }

              // в анкете 1 добавим согласие на передачу данных
              if (this.progress.step === 1) {
                tempQuestions.push({
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
                this.questions = [...tempQuestions]
              } else if (saveAnswers) {
                this.questions = [...tempQuestions]
              } else {
                this.tempQuestions = [...tempQuestions]
              }
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

  formatQuestions(questions) {
    return questions.map((question) => {
      return {
        ...question,
        answers: question.answers
          ? JSON.parse(question.answers).map((answer) => {
              return question.answer_type === '4' ||
                question.answer_type === '7'
                ? { value: answer, isChecked: false }
                : { value: answer }
            })
          : null,
        currentAnswer: null
      }
    })
  }

  isFirstBlockQuestion(question) {
    if (this.firstBlocks.find((item) => item === question.tag)) {
      return this.blocks[
        this.firstBlocks.findIndex((item) => item === question.tag)
      ].title
    }
  }

  isLastBlockQuestion(question) {
    if (this.lastBlocks.find((item) => item === question.tag)) {
      return this.blocks[
        this.lastBlocks.findIndex((item) => item === question.tag)
      ].title
    }
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
        return { [item.id]: new Date(item.currentAnswer).getTime() / 1000 }
      } else if (item.answer_type === '6') {
        return { [item.id]: [item.currentAnswer, { custom: item.custom }] }
      } else if (item.answer_type === '7') {
        let answers = item.answers
          .map((answer, index) => (answer.isChecked ? index : null))
          .filter((item) => item !== null)
        answers.push({ custom: item.currentAnswer })
        return { [item.id]: answers }
      }
    })

    return Object.assign({}, ...mapped)
  }

  // отправка ответов на сервер
  doAnswer() {
    // проверка на согласие на передачу данных
    if (this.progress.step === 1) {
      if (!this.questions.find((item) => item.id === '0').answers[0].isChecked)
        return this.alertServ.showToast(
          'Для начала дайте своё согласие на передачу данных опроса медицинскому работнику для ознакомления'
        )
      else {
        this.questions.pop()
      }
    }
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .post(
          this.connectivityServ.apiUrl +
            'questionary/save_answers?token=' +
            this.customerData.token +
            '&answers=' +
            JSON.stringify(this.convertAnswers()),
          this.convertAnswers()
        )
        .subscribe(
          (data: any) => {
            if (data.questions && data.questions.length) {
              this.questions = this.formatQuestions(data.questions)
              this.progress = data.progress
              this.blocks = data.blocks || []
              if (this.blocks.length > 0) {
                this.firstBlocks = this.blocks.map((item) => item.questions[0])
                this.lastBlocks = this.blocks.map(
                  (item) => item.questions[item.questions.length - 1]
                )
              }
              this.content.scrollToTop(400)
            }
            if (this.lastStep) {
              if (this.connectivityServ.isOnline()) {
                this.httpClient
                  .get(
                    this.connectivityServ.apiUrl +
                      'questionary/finished?token=' +
                      this.customerData.token
                  )
                  .subscribe(
                    () => {
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
            // проверка на последний шаг
            if (data.last_step) {
              this.lastStep = true
            }
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
