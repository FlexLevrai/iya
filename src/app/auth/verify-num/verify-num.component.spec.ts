import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyNumComponent } from './verify-num.component';

describe('VerifyNumComponent', () => {
  let component: VerifyNumComponent;
  let fixture: ComponentFixture<VerifyNumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
