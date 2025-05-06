import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPayableComponent } from './upload-payable.component';

describe('UploadPayableComponent', () => {
  let component: UploadPayableComponent;
  let fixture: ComponentFixture<UploadPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPayableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
