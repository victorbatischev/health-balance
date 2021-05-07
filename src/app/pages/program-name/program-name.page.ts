import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

import { IList } from './../../shared/interfaces/List';

@Component({
  templateUrl: './program-name.page.html',
  styleUrls: ['./program-name.page.scss']
})
export class ProgramNamePage {

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
  };

  listData: IList[] = [];
  programs: any = [];
  search: string = '';

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        console.log(this.connectivityServ.apiUrl + 'programs/list');
        this.httpClient.get(this.connectivityServ.apiUrl + 'programs/list').subscribe((data: any) => {
         console.log(data);
         this.programs = data.result.programs;
         for (let i = 0; i < this.programs.length; i++) {
           this.listData.push({ id: this.programs[i].id, img: this.programs[i].image, main_img: this.programs[i].main_image, title: this.programs[i].title, subTitle: this.programs[i].title, src: 'nutrition/' + this.programs[i].id, subLink: 'Посмотреть' });
         }
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

  doSearch() {
    this.listData = [];
    for (let i = 0; i < this.programs.length; i++) {
      console.log(this.programs[i].title.toLowerCase());
      if (this.search.length == 0 || this.strpos(this.programs[i].title.toLowerCase(), this.search.toLowerCase(), 0) !== false) {
        this.listData.push({ id: this.programs[i].id, img: this.programs[i].image, main_img: this.programs[i].main_image, title: this.programs[i].title, subTitle: this.programs[i].title, src: 'nutrition/' + this.programs[i].id, subLink: 'Посмотреть' });
      }
    }
  }

  strpos(haystack, needle, offset){
    var i = haystack.indexOf(needle, offset);
    return i >= 0 ? i : false;
  }


}

