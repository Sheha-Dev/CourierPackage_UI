import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverAdd } from './driver-add';

describe('DriverAdd', () => {
  let component: DriverAdd;
  let fixture: ComponentFixture<DriverAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
