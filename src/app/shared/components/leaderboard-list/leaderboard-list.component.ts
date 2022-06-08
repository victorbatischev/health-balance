import { Component, Input } from '@angular/core'
import { NavController } from '@ionic/angular'
import { IList } from '../../interfaces/List'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../../providers/connectivity-service'
import { AlertService } from '../../../../providers/alert-service'

import { Customer } from '../../../../models/customer-model'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-leaderboardList',
  templateUrl: './leaderboard-list.component.html',
  styleUrls: ['./leaderboard-list.component.scss']
})
export class LeaderboardListComponent {
  @Input() data
  // @Input() customLabelStyles?;
  // @Input() showLastBorder = true;

  customerData: Customer = {
    token: '',
    name: '',
    team_id: 0,
    role: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  }

  constructor(
    public navCtrl: NavController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {}

  clickEvent(id, id2) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'programs/to_team?token=' +
              this.customerData.token +
              '&team_id=' +
              id +
              '&program_id=' +
              id2
          )
          .subscribe(
            (data: any) => {
              if (data.result.status == 1) {
                this.alertServ.showToast('Вы были успешно добавлены в команду')
              } else if (data.result.status == 2) {
                this.alertServ.showToast('Вы уже состоите в данной программе')
              } else {
                this.alertServ.showToast('Превышен лимит участников команды')
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
}
