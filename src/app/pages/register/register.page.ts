import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';
import { CustomerService } from '../../../providers/customer-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registrationInfo: { email: string, password: string, team_id: number; agree: boolean } = { email: '', password: '', team_id: 0, agree: false };
  programs: any = [];

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService,
  ) {
  	setTimeout( () => {
	  	if (this.connectivityServ.isOnline()) {
        console.log(this.connectivityServ.apiUrl + 'account/get_platforms');
	      this.httpClient.get(this.connectivityServ.apiUrl + 'account/get_platforms').subscribe((data: any) => {
	        this.programs = data.result.programs;
	        console.log(this.programs);
	      }, error => {
	        this.alertServ.showToast('Ошибка полуения данных');
	      });
	    } else {
	      this.alertServ.showToast('Нет соединения с сетью');
	    }
	 }, 300);
  }

  doRegister() {
    console.log(this.registrationInfo);

    if (!this.registrationInfo.email || this.registrationInfo.email.length < 6 || this.strpos(this.registrationInfo.email, '@', 0) === false || this.strpos(this.registrationInfo.email, '.', 0) === false) {
      this.alertServ.showToast('Некорректный формат e-mail');
      return false;
    }
    if (!this.registrationInfo.password || this.registrationInfo.password.length < 6) {
      this.alertServ.showToast('Пароль не может быть короче 6 символов');
      return false;
    }
    /*if (this.registrationInfo.team_id == 0) {
      this.alertServ.showToast('Выберите платформу');
      return false;
    }*/
    if (!this.registrationInfo.agree) {
      this.alertServ.showToast('Вы должны согласиться с условиями обработки персональных данных');
      return false;
    }

    if (this.connectivityServ.isOnline()) {
      this.storage.get('deviceToken').then((deviceToken) => {
        this.httpClient.get(this.connectivityServ.apiUrl + 'account/registration?email=' + this.registrationInfo.email + '&password=' + this.registrationInfo.password + '&platform_id=' + this.registrationInfo.team_id + '&device_token=' + deviceToken).subscribe((data: any) => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
          this.alertServ.showToast('Другой пользователь с таким e-mail уже существует');
        });
      });
    } else {
      this.alertServ.showToast('Нет соединения с сетью');
    }
  }

  goBack() {
  	this.navCtrl.pop();
  }

  strpos(haystack, needle, offset){
    var i = haystack.indexOf(needle, offset);
    return i >= 0 ? i : false;
  }

}
