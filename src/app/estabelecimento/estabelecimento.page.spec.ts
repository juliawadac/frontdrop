import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstabelecimentoPage } from './estabelecimento.page';

describe('EstabelecimentoPage', () => {
  let component: EstabelecimentoPage;
  let fixture: ComponentFixture<EstabelecimentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstabelecimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
