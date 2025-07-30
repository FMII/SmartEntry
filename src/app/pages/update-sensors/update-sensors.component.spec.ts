import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSensorsComponent } from './update-sensors.component';

describe('UpdateSensorsComponent', () => {
  let component: UpdateSensorsComponent;
  let fixture: ComponentFixture<UpdateSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSensorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
