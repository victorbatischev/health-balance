import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Customer } from '../../../../models/customer-model';
import {CustomerService} from "../../../../providers/customer-service";



@Component({
    selector: 'app-headerMain',
    templateUrl: './header-main.component.html',
    styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent {


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
    };

    constructor(
        public httpClient: HttpClient,
        public storage: Storage,
        public customerServ: CustomerService
    ) {
        console.log("render")
        this.storage.get('customerData').then((val) => {
            this.customerData = val
        })
        this.customerServ.getCustomerData().subscribe((val) => {
            this.customerData = val
        })
    }


}
