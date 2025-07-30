import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRfidCardsComponent } from './create-rfid-cards.component';

describe('CreateRfidCardsComponent', () => {
  let component: CreateRfidCardsComponent;
  let fixture: ComponentFixture<CreateRfidCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRfidCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRfidCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
