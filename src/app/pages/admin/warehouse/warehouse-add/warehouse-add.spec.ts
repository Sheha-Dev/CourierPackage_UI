import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseAdd } from './warehouse-add';

describe('WarehouseAdd', () => {
  let component: WarehouseAdd;
  let fixture: ComponentFixture<WarehouseAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
