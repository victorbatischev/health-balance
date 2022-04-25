import { Component, ViewChild } from '@angular/core'
import { IonContent } from '@ionic/angular'
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Message } from '../../../models/message'
import { FormControl, FormBuilder } from '@angular/forms'

import { AlertService } from '../../../providers/alert-service'

@Component({
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage {
  @ViewChild(IonContent, { static: false, read: IonContent })
  content: IonContent
  accessToken: string = 'df388824e1ed4ca2bbc0d407d0ae1358'
  client
  messages: Message[] = []
  messageForm: any
  chatBox: any
  isLoading: boolean

  constructor(
    public formBuilder: FormBuilder,
    private alertServ: AlertService
  ) {
    this.chatBox = ''

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    })

    this.client = new ApiAiClient({
      accessToken: this.accessToken,
      lang: 'ru'
    })
  }

  sendMessage(req: string) {
    if (!req || req === '') {
      return
    }
    this.messages.push({ from: 'user', text: req })
    this.isLoading = true

    this.client
      .textRequest(req)
      .then((response) => {
        this.messages.push({
          from: 'bot',
          text: response.result.fulfillment.speech
        })
        this.scrollToBottom()
        this.isLoading = false
      })
      .catch((error) => {
        console.log(error)
      })

    this.chatBox = ''
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom()
    }, 100)
  }
}
