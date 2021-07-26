import { Component } from '@angular/core'
import { Platform, NavController, AlertController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-health-index-results',
  templateUrl: './health-index-results.page.html',
  styleUrls: ['./health-index-results.page.scss']
})
export class HealthIndexResultsPage {
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

  results: any = []

  constructor(
    private platform: Platform,
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
              'questionary/result_dynamics?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              console.log(data.results)
              this.results = data.results
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
