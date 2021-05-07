import { Component, ViewEncapsulation } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Clipboard } from '@ionic-native/clipboard/ngx';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';

import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-team-news-published',
  templateUrl: './team-news-published.page.html',
  styleUrls: ['./team-news-published.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeamNewsPublishedPage {

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
  };

  news: any = [];
  comment: string = '';
  html: any = '';

  constructor(
    private platform: Platform,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private clipboard: Clipboard,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    private sanitizer: DomSanitizer,
  ) {
    this.storage.get('customerData').then((val) => {
      this.customerData = val;
      this.loadNews();
      console.log(this.customerData);
    });
  }

  loadNews() {
     this.storage.get('customerData').then((val) => {
      this.customerData = val;
      if (this.connectivityServ.isOnline()) {
        console.log(this.connectivityServ.apiUrl + 'news/get?news_id=' + this.route.snapshot.paramMap.get('news_id'));
        this.httpClient.get(this.connectivityServ.apiUrl + 'news/get?news_id=' + this.route.snapshot.paramMap.get('news_id')).subscribe((data: any) => {
          this.news = data.result.news;
          if (this.news.content != '') {
            this.html = this.sanitizer.bypassSecurityTrustHtml(this.news.content);
          }
          console.log(this.news);
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    });
  }

  copyToClipboard() {
    if (this.news.content != '') {
      this.clipboard.copy(this.news.content);
    } else {
      this.clipboard.copy(this.news.annotation);
    }
    this.alertServ.showToast('Новость скопирована в буфер обмена');
  }

  addComment() {
    if (this.comment.length == 0) {
      this.alertServ.showToast('Введите ответ на новость');
      return false;
    }

    if (this.connectivityServ.isOnline()) {
       this.httpClient.get(this.connectivityServ.apiUrl + 'news/comment?news_id=' + this.route.snapshot.paramMap.get('news_id') + '&token=' + this.customerData.token + '&comment=' + this.comment).subscribe((data: any) => {
         this.alertServ.showToast('Ответ на новость был успешно добавлен');
         this.comment = '';
         this.loadNews();
        }, error => {
          console.log(error);
        });
     } else {
        this.alertServ.showToast('Нет соединения с сетью');
     }
  }

}
