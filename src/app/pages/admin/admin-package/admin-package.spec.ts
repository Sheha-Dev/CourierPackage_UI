import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPackage } from './admin-package';

describe('AdminPackage', () => {
  let component: AdminPackage;
  let fixture: ComponentFixture<AdminPackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPackage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPackage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
