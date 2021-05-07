import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss']
})
export class PreviewPage implements OnInit {

  constructor(
    private router: Router,
    public navCtrl: NavController,
  ) { }

  ngOnInit(): void {
  }

  toSliderPage() {
    this.navCtrl.navigateRoot('slider');
  }

}
