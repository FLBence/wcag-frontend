import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyScans } from './my-scans';

describe('MyScans', () => {
  let component: MyScans;
  let fixture: ComponentFixture<MyScans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyScans],
    }).compileComponents();

    fixture = TestBed.createComponent(MyScans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
