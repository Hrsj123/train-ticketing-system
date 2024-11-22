import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainUpdateComponent } from './train-update.component';

describe('TrainUpdateComponent', () => {
  let component: TrainUpdateComponent;
  let fixture: ComponentFixture<TrainUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
