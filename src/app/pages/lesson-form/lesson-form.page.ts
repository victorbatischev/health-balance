import { Component } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult
} from 'ion2-calendar'

@Component({
  templateUrl: './lesson-form.page.html',
  styleUrls: ['./lesson-form.page.scss']
})
export class LessonFormPage {
  programs: any = []
  customers: any = []
  platform_id: string = '0'
  task: {
    program_id: string
    customer_id: string
    title: string
    description: string
    type: string
    video: string
    question: string
    answers: any
    qr_code: string
    start_date: string
    end_date: string
    score: number
  } = {
    program_id: '0',
    customer_id: '0',
    title: '',
    description: '',
    type: '0',
    video: '',
    question: '',
    answers: [{ answer: '' }],
    qr_code: '',
    start_date: '',
    end_date: '',
    score: 0
  }

  correct_answer: number = 0

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

  constructor(
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {
    this.platform_id = this.route.snapshot.paramMap.get('platform_id')
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'programs/list?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.programs = data.result.programs
              this.customers = data.result.customers
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

  async openCalendar(idx) {
    const options: CalendarModalOptions = {
      title: 'Выберите дату',
      doneLabel: 'Выбрать',
      closeLabel: 'Закрыть',
      weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthFormat: 'MMM YYYY',
      weekStart: 1
    }
    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    })

    myCalendar.present()

    const event: any = await myCalendar.onDidDismiss()
    const date: CalendarResult = event.data

    if (date !== null) {
      if (idx == 1) {
        this.task.start_date = date.string
      } else {
        this.task.end_date = date.string
      }
    }
  }

  addAnswer() {
    this.task.answers.push({ answer: '' })
  }

  removeAnswer() {
    if (this.task.answers.length > 1) {
      var tmp_arr: any = []
      for (let i = 0; i < this.task.answers.length - 1; i++) {
        tmp_arr.push({ answer: this.task.answers[i].answer })
      }
      this.task.answers = tmp_arr
      this.correct_answer = 0
    }
  }

  createLesson() {
    if (+this.task.program_id == 0) {
      this.alertServ.showToast('Выберите программу!')
      return false
    }

    if (+this.task.program_id == -1 && +this.task.customer_id == 0) {
      this.alertServ.showToast('Выберите пользователя!')
      return false
    }

    if (this.task.title == '') {
      this.alertServ.showToast('Введите название задания!')
      return false
    }
    if (+this.task.type == 0) {
      this.alertServ.showToast('Выберите тип задания!')
      return false
    }
    /*if (+this.task.type != -1 && this.task.video == '') {
      this.alertServ.showToast('Введите ссылку на видео для задания!');
      return false;
    }*/
    if (
      (+this.task.type == 1 || +this.task.type == 3) &&
      this.task.question == ''
    ) {
      this.alertServ.showToast('Введите вопрос!')
      return false
    }
    /*
    if ((+this.task.type == 1 || +this.task.type == 3) && this.task.answers[0].answer == '') {
      this.alertServ.showToast('Введите хотя бы один ответ на вопрос!');
      return false;
    }*/
    if (+this.task.type == 2 && this.task.qr_code == '') {
      this.alertServ.showToast('Введите информацию для QR-кода!')
      return false
    }
    if (this.task.start_date == '') {
      this.alertServ.showToast('Выберите дату начала выполнения задания!')
      return false
    }
    if (this.task.end_date == '') {
      this.alertServ.showToast('Выберите дату завершения выполнения задания!')
      return false
    }
    if (this.task.score == 0) {
      this.alertServ.showToast(
        'Укажите количество баллов за выполнение задания!'
      )
      return false
    }

    var answers = ''
    for (let i = 0; i < this.task.answers.length; i++) {
      answers += this.task.answers[i].answer + ';'
    }
    answers = answers.slice(0, -1)

    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'lessons/new?program_id=' +
            this.task.program_id +
            '&customer_id=' +
            this.task.customer_id +
            '&title=' +
            this.task.title +
            '&description=' +
            this.task.description +
            '&type=' +
            this.task.type +
            '&video=' +
            this.task.video +
            '&question=' +
            encodeURIComponent(this.task.question) +
            '&answers=' +
            answers +
            '&correct_answer=' +
            this.correct_answer +
            '&qr_code=' +
            this.task.qr_code +
            '&start_date=' +
            this.task.start_date +
            '&end_date=' +
            this.task.end_date +
            '&score=' +
            this.task.score +
            '&platform=' +
            this.platform_id
        )
        .subscribe(
          (data: any) => {
            this.alertServ.showToast('Задание было успешно добавлено')
            this.task = {
              program_id: '0',
              customer_id: '0',
              title: '',
              description: '',
              type: '0',
              video: '',
              question: '',
              answers: [{ answer: '' }],
              qr_code: '',
              start_date: '',
              end_date: '',
              score: 0
            }
            this.correct_answer = 0
            this.navCtrl.pop()
          },
          (error) => {
            console.log(error)
            this.alertServ.showToast('Не удалось добавить задание')
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }
}
