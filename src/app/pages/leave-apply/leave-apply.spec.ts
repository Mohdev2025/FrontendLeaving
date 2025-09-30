import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplyComponent } from './leave-apply';

describe('LeaveApply', () => {
  let component: LeaveApplyComponent;
  let fixture: ComponentFixture<LeaveApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
