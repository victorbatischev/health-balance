import {Component, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Customer } from '../../../../models/customer-model';
import {CustomerService} from "../../../../providers/customer-service";
import {IList} from "../../interfaces/List";



@Component({
    selector: 'app-listTasks',
    templateUrl: './list-tasks.component.html',
    styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent {

    @Input() list: IList[] = [];
    @Input() customBtnStyles?;

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

    ) {
        console.log(this.list)
    }


}
