import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Plugins } from '@capacitor/core';

const { Network } = Plugins;

@Injectable()
export class ConnectivityService {

	apiUrl: string = 'http://health-balance.ru/api/';
	networkStatus: boolean;

	constructor(
		public httpClient: HttpClient,
	) {
		Network.getStatus().then((status) => {
			this.networkStatus = status.connected;
		});
		Network.addListener('networkStatusChange', (status) => {
			this.networkStatus = status.connected;
		});
	}

	isOnline(): boolean {
		return this.networkStatus
	}
}
