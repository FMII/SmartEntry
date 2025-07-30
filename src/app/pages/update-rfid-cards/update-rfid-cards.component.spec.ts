import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRfidCardsComponent } from './update-rfid-cards.component';

describe('UpdateRfidCardsComponent', () => {
  let component: UpdateRfidCardsComponent;
  let fixture: ComponentFixture<UpdateRfidCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRfidCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateRfidCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
