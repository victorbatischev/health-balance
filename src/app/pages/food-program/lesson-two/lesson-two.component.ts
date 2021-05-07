import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-two',
  templateUrl: './lesson-two.component.html',
  styleUrls: ['./lesson-two.component.scss']
})
export class LessonTwoComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toLessonThree() {
    this.router.navigate(['/food-program/lesson-2']);
  }

}
