import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SacolaPage } from './sacola.component';

describe('SacolaComponent', () => {
  let Page: SacolaPage;
  let fixture: ComponentFixture<SacolaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SacolaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SacolaPage);
    Page = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(Page).toBeTruthy();
  });
});
