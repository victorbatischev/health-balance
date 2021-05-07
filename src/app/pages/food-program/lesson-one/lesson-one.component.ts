import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-one',
  templateUrl: './lesson-one.component.html',
  styleUrls: ['./lesson-one.component.scss']
})
export class LessonOneComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  toLessonTwo() {
    this.router.navigate(['/food-program/lesson-3']);
  }

}
