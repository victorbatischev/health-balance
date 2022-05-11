import { Component } from '@angular/core'

import { ActivatedRoute } from '@angular/router'
import { AlertController } from '@ionic/angular'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss']
})
export class TeamPage {
  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    role: 0,
    is_captain: false,
    phone: '',
    email: '',
    city: '',
    password: '',
    team: '',
    establishment: ''
  }

  liderboard: any = []

  constructor(
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'liderboard/team?team_id=' +
              this.route.snapshot.paramMap.get('team_id')
          )
          .subscribe(
            (data: any) => {
              this.liderboard = data.result.liderboard
              for (let j = 1; j < this.liderboard.customers.length; j++) {
                for (let i = 0; i < j; i++) {
                  if (
                    +this.liderboard.customers[i].total <
                    +this.liderboard.customers[i + 1].total
                  ) {
                    let temp = this.liderboard.customers[i]
                    this.liderboard.customers[i] =
                      this.liderboard.customers[i + 1]
                    this.liderboard.customers[i + 1] = temp
                  }
                }
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

  async showInfo(customer) {
    var info = ''
    if (customer.phone == '' && customer.email == '') {
      info = 'Участник еще не добавил данные'
    } else {
      if (customer.phone != '') {
        info =
          '<br /><a href="tel:' +
          customer.phone +
          '">' +
          customer.phone +
          '</a>'
      }
      if (customer.email != '') {
        if (info != '') {
          info += '<br /><br />'
        }
        info +=
          '<a href="mailto:' + customer.email + '">' + customer.email + '</a>'
      }
    }
    let prompt = await this.alertCtrl.create({
      subHeader: customer.name,
      message: info,
      buttons: [
        {
          text: 'Закрыть',
          role: 'cancel'
        }
      ]
    })
    return await prompt.present()
  }
}
