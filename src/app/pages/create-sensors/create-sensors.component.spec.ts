import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSensorsComponent } from './create-sensors.component';

describe('CreateSensorsComponent', () => {
  let component: CreateSensorsComponent;
  let fixture: ComponentFixture<CreateSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSensorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
