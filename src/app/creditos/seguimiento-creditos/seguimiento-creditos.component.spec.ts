import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoCreditosComponent } from './seguimiento-creditos.component';

describe('SeguimientoCreditosComponent', () => {
  let component: SeguimientoCreditosComponent;
  let fixture: ComponentFixture<SeguimientoCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoCreditosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
