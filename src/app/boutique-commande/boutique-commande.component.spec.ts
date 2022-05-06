import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueCommandeComponent } from './boutique-commande.component';

describe('BoutiqueCommandeComponent', () => {
  let component: BoutiqueCommandeComponent;
  let fixture: ComponentFixture<BoutiqueCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoutiqueCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoutiqueCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
