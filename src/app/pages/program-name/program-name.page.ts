import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

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

  platform_id: string = '0';
  platform_title: string = '';
  platform_image: string = '';

  constructor(
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
  ) {

    this.platform_id = this.route.snapshot.paramMap.get('platform_id');

    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      this.storage.get('date_value').then((date_value) => {
        if (this.connectivityServ.isOnline()) {
          var url = this.connectivityServ.apiUrl + 'programs/list?platform_id=' + this.platform_id + '&token=' + this.customerData.token;
          if (date_value !== null) {
            url += '&date_value=' + date_value;
          }
          this.httpClient.get(url).subscribe((data: any) => {
           console.log(data);
           this.storage.remove('date_value');
           this.platform_title = data.result.platform_title;
           this.platform_image = data.result.platform_image;
           this.programs = data.result.programs;
           for (let i = 0; i < this.programs.length; i++) {
             this.listData.push({ id: this.programs[i].id, img: this.programs[i].image, main_img: this.platform_id == '0' ? this.programs[i].main_image : '', title: this.programs[i].title, subTitle: this.programs[i].title, src: 'nutrition/' + this.platform_id + '/' + this.programs[i].id, subLink: 'Посмотреть', complete: this.programs[i].complete });
           }
          }, error => {
            console.log(error);
          });
        } else {
          this.alertServ.showToast('Нет соединения с сетью');
        }
      });
    });
  }

  doSearch() {
    this.listData = [];
    for (let i = 0; i < this.programs.length; i++) {
      console.log(this.programs[i].title.toLowerCase());
      if (this.search.length == 0 || this.strpos(this.programs[i].title.toLowerCase(), this.search.toLowerCase(), 0) !== false) {
        this.listData.push({ id: this.programs[i].id, img: this.programs[i].image, main_img: this.programs[i].main_image, title: this.programs[i].title, subTitle: this.programs[i].title, src: 'nutrition/' + this.platform_id + '/' + this.programs[i].id, subLink: 'Посмотреть' });
      }
    }
  }

  strpos(haystack, needle, offset){
    var i = haystack.indexOf(needle, offset);
    return i >= 0 ? i : false;
  }


}

