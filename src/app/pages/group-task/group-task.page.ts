import { Component } from '@angular/core'

import { ActivatedRoute } from '@angular/router'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { IList } from 'src/app/shared/interfaces/List'

@Component({
  templateUrl: './group-task.page.html',
  styleUrls: ['./group-task.page.scss']
})
export class GroupTaskPage {
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

  programs: any = []
  listData: IList[] = []

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
              'programs/list?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.listData = []
              this.programs = data.result.programs
              for (let i = 0; i < this.programs.length; i++) {
                this.listData.push({
                  id: this.programs[i].id,
                  img: this.programs[i].image,
                  main_img: this.programs[i].main_image,
                  title: this.programs[i].title,
                  src: 'tasks/' + this.programs[i].id,
                  subLink: 'Смотреть задания',
                  complete: this.programs[i].complete
                })
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
