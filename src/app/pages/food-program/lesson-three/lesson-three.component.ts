import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-three',
  templateUrl: './lesson-three.component.html',
  styleUrls: ['./lesson-three.component.scss']
})
export class LessonThreeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  toLessonFour() {
    this.router.navigate(['/food-program/lesson-4']);
  }

}
