import { IList } from 'src/app/shared/interfaces/List';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss']
})
export class StoreItemComponent implements OnInit {
  @Input() localStoreItem: IList;

  constructor() { }

  ngOnInit(): void {
  }

}
