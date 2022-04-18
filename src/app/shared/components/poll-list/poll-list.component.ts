import { Component, Input } from '@angular/core'

import { IList } from '../../interfaces/List'

import { Customer } from '../../../../models/customer-model'

@Component({
  selector: 'app-pollList',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.scss']
})
export class PollListComponent {
  @Input() list: IList[] = []

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
  }

  constructor() {}
}
