import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssignorComponent } from './update-assignor.component';

describe('UpdateAssignorComponent', () => {
  let component: UpdateAssignorComponent;
  let fixture: ComponentFixture<UpdateAssignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAssignorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAssignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
