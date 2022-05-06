import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueUpdateComponent } from './boutique-update.component';

describe('BoutiqueUpdateComponent', () => {
  let component: BoutiqueUpdateComponent;
  let fixture: ComponentFixture<BoutiqueUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoutiqueUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoutiqueUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
