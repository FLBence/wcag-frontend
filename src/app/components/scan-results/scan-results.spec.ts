import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanResults } from './scan-results';

describe('ScanResults', () => {
  let component: ScanResults;
  let fixture: ComponentFixture<ScanResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanResults],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
