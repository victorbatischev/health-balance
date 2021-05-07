import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNewsPage } from './add-news.page';

describe('AddNewsPage', () => {
  let component: AddNewsPage;
  let fixture: ComponentFixture<AddNewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
