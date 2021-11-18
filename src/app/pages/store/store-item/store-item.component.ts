import { IList } from 'src/app/shared/interfaces/List'
import { Component, Input } from '@angular/core'
import { AlertController } from '@ionic/angular'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../../providers/connectivity-service'
import { AlertService } from '../../../../providers/alert-service'

import { Customer } from '../../../../models/customer-model'

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss']
})
export class StoreItemComponent {
  @Input() localStoreItem: IList

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  }

  constructor(
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {}

  async changeProduct(item) {
    let prompt = await this.alertCtrl.create({
      subHeader:
        'Вы уверены, что хотите обменять ' +
        item.subTitle +
        ' на ' +
        item.title +
        '?',
      buttons: [
        {
          text: 'Обменять',
          handler: () => {
            this.storage.get('customerData').then((val) => {
              this.customerData = val
              if (this.connectivityServ.isOnline()) {
                this.httpClient
                  .get(
                    this.connectivityServ.apiUrl +
                      'products/order?token=' +
                      this.customerData.token +
                      '&product_id=' +
                      item.id
                  )
                  .subscribe(
                    (data: any) => {
                      switch (data.result.status) {
                        case 'done':
                          this.orderMessage(
                            'Заказ №' +
                              data.result.order_id +
                              ' успешно оформлен. Для получения подробной инструкции свяжитесь по телефону +7(499)348-26-22.'
                          )
                          break
                        case 'no_balance':
                          this.orderMessage(
                            'К сожалению данный товар уже закончился :-( , попробуйте выбрать другой.'
                          )
                          break
                        case 'no_steps':
                          this.orderMessage(
                            'К сожалению у вас недостаточное количество шагов для обмена на данный товар :-( , попробуйте выбрать другой'
                          )
                          break
                      }
                    },
                    (error) => {
                      this.alertServ.showToast('Не удалось произвести обмен')
                    }
                  )
              } else {
                this.alertServ.showToast('Нет соединения с сетью')
              }
            })
          }
        },
        {
          text: 'Отмена',
          role: 'cancel'
        }
      ]
    })
    return await prompt.present()
  }

  async orderMessage(message) {
    let alert = await this.alertCtrl.create({
      subHeader: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    })
    return await alert.present()
  }
}
