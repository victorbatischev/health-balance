import { Component, OnInit } from '@angular/core';
import { IList } from 'src/app/shared/interfaces/List';

@Component({
  templateUrl: './prev.page.html',
  styleUrls: ['./prev.page.scss']
})
export class PrevPage implements OnInit {

  listData: IList[] = [
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
    { img: 'assets/images/prev/web-rf.png', title: 'Название платформы'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
