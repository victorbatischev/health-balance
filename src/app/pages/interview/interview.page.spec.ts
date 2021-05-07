import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterviewPage } from './interview.page';

describe('InterviewPage', () => {
  let component: InterviewPage;
  let fixture: ComponentFixture<InterviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
