import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { HealthIndexPage } from './health-index.page'

describe('HealthPage', () => {
  let component: HealthIndexPage
  let fixture: ComponentFixture<HealthIndexPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthIndexPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(HealthIndexPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
