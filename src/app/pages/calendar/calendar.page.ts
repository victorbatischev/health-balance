import { Component } from '@angular/core';

import { NavController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Health } from '@ionic-native/health/ngx';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';
import { CustomerService } from '../../../providers/customer-service';

@Component({
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss']
})
export class CalendarPage {

	date: string = '';
	type: 'string';
	options: any = {
		monthPickerFormat: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
		weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		monthFormat: 'MMM YYYY',
		weekStart: 1,
		showToggleButtons: true
	};

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
  };

  statistics_data: { tasks_amount: number, end_date: number, new_program: number } = { tasks_amount: 0, end_date: 0, new_program: 0 };


  constructor(
    public navCtrl: NavController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
    });
    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val;
    });
  }

  onChange(e) {
    console.log(e);
    this.showStat();
  }

  showStat() {
  	console.log(this.date);
    if (this.date == '') {
      this.alertServ.showToast('Выберите дату');
      return false;
    }
    if (this.connectivityServ.isOnline()) {
       this.httpClient.get(this.connectivityServ.apiUrl + 'main/stat2?token=' + this.customerData.token + '&date=' + this.date).subscribe((data: any) => {
         this.statistics_data = data.result;
       }, error => {
         console.log(error);
       });
     } else {
       this.alertServ.showToast('Нет соединения с сетью');
     }
  }

  toTasks(date_type) {
    if (date_type == 'new' && this.statistics_data.tasks_amount == 0) {
      return false;
    }
    if (date_type == 'end' && this.statistics_data.end_date == 0) {
      return false;
    }
    this.storage.set('date_type', date_type);
    this.storage.set('date_value', this.date);
    this.navCtrl.navigateForward('tasks/0');
  }

  toProgram() {
    if (this.statistics_data.new_program == 0) {
      return false;
    }
    this.storage.set('date_value', this.date);
    this.navCtrl.navigateForward('program-name/0');
  }


}
