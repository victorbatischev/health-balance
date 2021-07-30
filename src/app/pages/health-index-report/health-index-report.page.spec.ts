import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { HealthIndexReportPage } from './health-index-report.page'

describe('HealthIndexResultsPage', () => {
  let component: HealthIndexReportPage
  let fixture: ComponentFixture<HealthIndexReportPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthIndexReportPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(HealthIndexReportPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
