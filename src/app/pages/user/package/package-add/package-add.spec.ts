import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageAdd } from './package-add';

describe('PackageAdd', () => {
  let component: PackageAdd;
  let fixture: ComponentFixture<PackageAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
