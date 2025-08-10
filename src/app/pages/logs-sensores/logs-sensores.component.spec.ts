import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogsSensoresComponent } from './logs-sensores.component';

describe('LogsSensoresComponent', () => {
  let component: LogsSensoresComponent;
  let fixture: ComponentFixture<LogsSensoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsSensoresComponent, ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogsSensoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

