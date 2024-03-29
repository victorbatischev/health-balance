import { Component } from '@angular/core'

import { ActivatedRoute } from '@angular/router'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { IList } from 'src/app/shared/interfaces/List'

@Component({
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss']
})
export class NutritionPage {
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

  program: any = []
  listData: IList[] = []
  platform_id: string = '0'

  constructor(
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService
  ) {}

  ionViewWillEnter() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'programs/teams?program_id=' +
              this.route.snapshot.paramMap.get('program_id') +
              '&token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.program = data.result.program
              this.listData = []
              this.platform_id = this.route.snapshot.paramMap.get('platform_id')
              for (let i = 0; i < data.result.programs_teams.length; i++) {
                if (this.platform_id != '0') {
                  this.listData.push({
                    id: data.result.programs_teams[i].id,
                    id2: this.route.snapshot.paramMap.get('program_id'),
                    img:
                      i <= 2
                        ? `assets/images/nutrition/Star ${i + 1}.svg`
                        : `assets/images/nutrition/offset.png`,
                    title: data.result.programs_teams[i].title,
                    button: data.result.programs_teams[i].exist
                      ? 'Ваша команда'
                      : 'Вступить',
                    subDesc:
                      (data.result.programs_teams[i].steps || 0) + ' баллов'
                  })
                } else {
                  this.listData.push({
                    id: data.result.programs_teams[i].id,
                    id2: this.route.snapshot.paramMap.get('program_id'),
                    img: 'assets/images/nutrition/medal.png',
                    title: data.result.programs_teams[i].title,
                    subDesc:
                      (data.result.programs_teams[i].steps || 0) + ' баллов'
                  })
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
}
