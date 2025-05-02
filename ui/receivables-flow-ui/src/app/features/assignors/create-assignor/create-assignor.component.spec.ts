import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssignorComponent } from './create-assignor.component';

describe('CreateAssignorComponent', () => {
  let component: CreateAssignorComponent;
  let fixture: ComponentFixture<CreateAssignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAssignorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
