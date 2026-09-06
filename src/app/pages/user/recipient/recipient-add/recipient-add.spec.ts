import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipientAdd } from './recipient-add';

describe('RecipientAdd', () => {
  let component: RecipientAdd;
  let fixture: ComponentFixture<RecipientAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipientAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipientAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
