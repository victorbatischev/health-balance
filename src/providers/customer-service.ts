import { Injectable } from '@angular/core';
import { Customer } from '../models/customer-model';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomerService {

	private customerData: BehaviorSubject<Customer>;

	constructor(public storage: Storage) {
		this.customerData = new BehaviorSubject({
			token: '',
      name: '',
      team_id: 0,
      role: 0,
      is_captain: false,
      phone: '',
      email: '',
      city: '',
      password: '',
      avatar: '',
      team: '',
      establishment: '',
      platform_id: 0
		});
	}

	setCustomerData(val) {
		this.customerData.next(val);
		this.storage.set('customerData', val);
	}

	getCustomerData() {
		this.storage.get('customerData').then(val => {
			if (val !== null) {
				this.customerData.next(val);
			}
		});
		return this.customerData.asObservable();
	}

	clearData() {
		this.customerData.next({
			token: '',
      name: '',
      team_id: 0,
      role: 0,
      is_captain: false,
      phone: '',
      email: '',
      city: '',
      password: '',
      avatar: '',
      team: '',
      establishment: '',
      platform_id: 0
		});
		this.storage.remove('customerData');
	}
}