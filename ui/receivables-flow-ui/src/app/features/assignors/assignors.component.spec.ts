import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignorsComponent } from './assignors.component';

describe('AssignorsComponent', () => {
  let component: AssignorsComponent;
  let fixture: ComponentFixture<AssignorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
