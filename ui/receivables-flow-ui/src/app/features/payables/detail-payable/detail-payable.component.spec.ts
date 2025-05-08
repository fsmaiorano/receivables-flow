import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPayableComponent } from './detail-payable.component';

describe('DetailPayableComponent', () => {
  let component: DetailPayableComponent;
  let fixture: ComponentFixture<DetailPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPayableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
