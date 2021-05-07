import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IList } from '../../interfaces/List';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../../providers/connectivity-service';
import { AlertService } from '../../../../providers/alert-service';

import { Customer } from '../../../../models/customer-model';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() list: IList[] = [];
  @Input() customImgStyles?;
  @Input() customLabelStyles?;
  @Input() showLastBorder = true;

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
  };

  constructor(
    public navCtrl: NavController,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) { }


  clickEvent(id, id2) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        console.log(this.connectivityServ.apiUrl + 'programs/to_team?token=' + this.customerData.token + '&team_id=' + id + '&program_id=' + id2);
        this.httpClient.get(this.connectivityServ.apiUrl + 'programs/to_team?token=' + this.customerData.token + '&team_id=' + id + '&program_id=' + id2).subscribe((data: any) => {
         console.log(data.result);
         if (data.result.status == 1) {
          this.alertServ.showToast('Вы были успешно добавлены в команду');
         } else if (data.result.status == 2) {
          this.alertServ.showToast('Вы уже состоите в данной программе');
         } else {
          this.alertServ.showToast('Превышен лимит участников команды');
         }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

  openLesson(route_id) {
    this.storage.set('route_id', route_id);
    this.navCtrl.navigateForward('lesson-published');
  }

}
