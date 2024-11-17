import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegisterFormComponent } from './customer-register-form.component';

describe('CustomerRegisterFormComponent', () => {
  let component: CustomerRegisterFormComponent;
  let fixture: ComponentFixture<CustomerRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRegisterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
