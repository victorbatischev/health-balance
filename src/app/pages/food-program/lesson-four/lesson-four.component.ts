import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-four',
  templateUrl: './lesson-four.component.html',
  styleUrls: ['./lesson-four.component.scss']
})
export class LessonFourComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  toLessonFive() {
    this.router.navigate(['/food-program/lesson-5']);
  }

}
