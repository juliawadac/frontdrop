import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresaLoginPage } from './empresa-login.page';

describe('EmpresaLoginPage', () => {
  let component: EmpresaLoginPage;
  let fixture: ComponentFixture<EmpresaLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
