import { Component, ViewChild } from '@angular/core'
import { IonContent } from '@ionic/angular'
import { Message } from '../../../models/message'
import { FormControl, FormBuilder } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss']
})
export class SupportPage {
  @ViewChild(IonContent, { static: false, read: IonContent })
  content: IonContent

  messages: Message[] = []
  messageForm: any
  chatBox: any
  isLoading: boolean

  constructor(
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {
    this.chatBox = ''

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    })

    this.sendMessage('Привет', false)
  }

  sendMessage(req: string, add: boolean) {
    if (!req || req === '') {
      return
    }

    if (add) {
      this.messages.push({ from: 'user', text: req })
    }

    this.isLoading = true

    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(this.connectivityServ.apiUrl + 'chatbot/response?phrase=' + req)
        .subscribe(
          (data: any) => {
            this.messages.push({ from: 'bot', text: data.result.response })
            this.scrollToBottom()
            this.isLoading = false
          },
          (error) => {
            this.isLoading = false
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
    this.chatBox = ''
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom()
    }, 100)
  }
}
