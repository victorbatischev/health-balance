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

  case = (number, txt, cases = [2, 0, 1, 1, 1, 2]) =>
    txt[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ]
}
