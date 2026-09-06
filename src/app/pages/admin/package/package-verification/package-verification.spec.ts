import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageVerification } from './package-verification';

describe('PackageVerification', () => {
  let component: PackageVerification;
  let fixture: ComponentFixture<PackageVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
