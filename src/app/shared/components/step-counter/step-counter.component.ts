import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-step-counter',
  templateUrl: './step-counter.component.html',
  styleUrls: ['./step-counter.component.scss']
})
export class StepCounterComponent implements OnInit {
  @Input() period: number
  @Input() steps: string

  constructor() {}

  ngOnInit(): void {}
}
