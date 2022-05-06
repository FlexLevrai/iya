import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncePostuleComponent } from './annonce-postule.component';

describe('AnnoncePostuleComponent', () => {
  let component: AnnoncePostuleComponent;
  let fixture: ComponentFixture<AnnoncePostuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncePostuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncePostuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
