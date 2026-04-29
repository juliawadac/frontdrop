import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresaCadastroPage } from './empresa-cadastro.page';

describe('EmpresaCadastroPage', () => {
  let component: EmpresaCadastroPage;
  let fixture: ComponentFixture<EmpresaCadastroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaCadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
