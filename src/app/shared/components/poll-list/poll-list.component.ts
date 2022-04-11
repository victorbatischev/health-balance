import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IList } from '../../interfaces/List';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../../../providers/connectivity-service';
import { AlertService } from '../../../../providers/alert-service';

import { Customer } from '../../../../models/customer-model';



@Component({
    selector: 'app-pollList',
    templateUrl: './poll-list.component.html',
    styleUrls: ['./poll-list.component.scss']
})
export class PollListComponent {
    @Input() list: IList[] = [];

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

    ) {

    }


}
