import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flat-tabs',
  templateUrl: './flat-tabs.component.html',
  styleUrls: ['./flat-tabs.component.scss']
})
export class FlatTabsComponent implements OnInit {

  @Input() platform_id: number;

  constructor() { }

  ngOnInit(): void {
  }

}
