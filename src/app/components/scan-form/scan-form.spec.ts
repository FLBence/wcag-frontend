import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanForm } from './scan-form';

describe('ScanForm', () => {
  let component: ScanForm;
  let fixture: ComponentFixture<ScanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
