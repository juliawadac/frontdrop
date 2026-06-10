import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnderecosPage } from './enderecos.page';

describe('EnderecosPage', () => {
  let component: EnderecosPage;
  let fixture: ComponentFixture<EnderecosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnderecosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
