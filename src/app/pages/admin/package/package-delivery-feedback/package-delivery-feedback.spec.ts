import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageDeliveryFeedback } from './package-delivery-feedback';

describe('PackageDeliveryFeedback', () => {
  let component: PackageDeliveryFeedback;
  let fixture: ComponentFixture<PackageDeliveryFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageDeliveryFeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageDeliveryFeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
