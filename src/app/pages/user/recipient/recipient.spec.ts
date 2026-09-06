import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Recipient } from './recipient';

describe('Recipient', () => {
  let component: Recipient;
  let fixture: ComponentFixture<Recipient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recipient],
    }).compileComponents();

    fixture = TestBed.createComponent(Recipient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
