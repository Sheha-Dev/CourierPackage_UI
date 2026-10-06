import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPackageList } from './admin-package-list';

describe('AdminPackageList', () => {
  let component: AdminPackageList;
  let fixture: ComponentFixture<AdminPackageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPackageList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPackageList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
