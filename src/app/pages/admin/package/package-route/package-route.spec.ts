import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageRoute } from './package-route';

describe('PackageRoute', () => {
  let component: PackageRoute;
  let fixture: ComponentFixture<PackageRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageRoute],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageRoute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
