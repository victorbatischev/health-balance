import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { HealthIndexResultsPage } from './health-index-results.page'

describe('HealthIndexResultsPage', () => {
  let component: HealthIndexResultsPage
  let fixture: ComponentFixture<HealthIndexResultsPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthIndexResultsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(HealthIndexResultsPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
