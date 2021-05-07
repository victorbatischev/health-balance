import { Component, OnInit } from '@angular/core';
import { IList } from 'src/app/shared/interfaces/List';

@Component({
  templateUrl: './web-rf-created.page.html',
  styleUrls: ['./web-rf-created.page.scss']
})
export class WebRfCreatedPage implements OnInit {

  listData: IList[] = [
    { img: 'assets/images/qa/apple.png', title: 'Питание', button: 'Редактировать' },
    { img: 'assets/images/qa/run.png', title: 'Физ. aктивность', button: 'Редактировать' },
    { img: 'assets/images/qa/mind.png', title: 'Психология', button: 'Редактировать' },
    { img: 'assets/images/qa/apple.png', title: 'Психология', button: 'Редактировать' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
