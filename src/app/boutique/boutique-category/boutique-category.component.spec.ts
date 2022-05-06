import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueCategoryComponent } from './boutique-category.component';

describe('BoutiqueCategoryComponent', () => {
  let component: BoutiqueCategoryComponent;
  let fixture: ComponentFixture<BoutiqueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoutiqueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoutiqueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
