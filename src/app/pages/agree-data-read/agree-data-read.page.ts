import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './agree-data-read.page.html',
  styleUrls: ['./agree-data-read.page.scss']
})
export class AgreeDataReadPage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit(): void {
  }

  toRegisterPage() {
    this.navCtrl.navigateRoot('sign-in');
  }
}
