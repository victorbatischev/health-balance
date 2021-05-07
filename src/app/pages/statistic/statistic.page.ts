import { Component, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Health } from '@ionic-native/health/ngx';

import { ConnectivityService } from '../../../providers/connectivity-service';
import { AlertService } from '../../../providers/alert-service';

import { Customer } from '../../../models/customer-model';
import { CustomerService } from '../../../providers/customer-service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.page.html',
  styleUrls: ['./statistic.page.scss'],
})
export class StatisticPage {

	@ViewChild('barCanvas') barCanvas;
	barChart: any;

  selected_tabs: number = 0;

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

  statistics_data: any = [];
  exist: boolean = false;z

  constructor(
  	public httpClient: HttpClient,
    public storage: Storage,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    public customerServ: CustomerService,
  ) {
  	this.storage.get('customerData').then((val) => {
      this.customerData = val;
      this.setTabs(1);
    });
    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val;
    });
  }

  getStatistic() {
    var labels: any = [],
        values: any = [];

    for(let i = 0; i < this.statistics_data.length; i++) {
      labels.push(this.statistics_data[i].label);
      values.push(this.statistics_data[i].value);
    }
    
    if (this.exist) {
      this.barChart.destroy();
    }				
		
    this.barChart = new Chart(this.barCanvas.nativeElement, {
			type: 'bar',
			data: {
				labels: labels,
			  datasets: [{
					data: values,
					backgroundColor: '#168de2',
				}]
			},
			options: {
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});

    this.exist = true;
	}

	setTabs(idx) {
    if (this.selected_tabs == idx) {
      return false;
    }
    this.selected_tabs = idx;
    if (idx > 0) {
      if (this.connectivityServ.isOnline()) {
        this.httpClient.get(this.connectivityServ.apiUrl + 'main/stat?token=' + this.customerData.token + '&period=' + idx).subscribe((data: any) => {
          this.statistics_data = data.result.data;
          this.getStatistic();
        }, error => {
          console.log(error);
        });
      } else {
        this.alertServ.showToast('Нет соединения с сетью');
      }
    }
  }

}
