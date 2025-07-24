import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClassroomsComponent } from './update-classrooms.component';

describe('UpdateClassroomsComponent', () => {
  let component: UpdateClassroomsComponent;
  let fixture: ComponentFixture<UpdateClassroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClassroomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
