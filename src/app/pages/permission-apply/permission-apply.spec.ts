import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionApply } from './permission-apply';

describe('PermissionApply', () => {
  let component: PermissionApply;
  let fixture: ComponentFixture<PermissionApply>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionApply]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionApply);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
