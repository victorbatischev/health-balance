import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-popup-three',
    templateUrl: './popup-three.component.html',
    styleUrls: ['./popup-three.component.scss']
})

export class PopupThreeComponent implements OnInit {
    constructor() { }
    @Input() activePopup = false;
    @Input() setActivePopup :any

    stopPropagation(e){
      e.stopPropagation()
    }

    ngOnInit(): void {
    }

}
