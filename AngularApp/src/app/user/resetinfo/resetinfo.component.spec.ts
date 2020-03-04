import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetinfoComponent } from './resetinfo.component';

describe('ResetinfoComponent', () => {
  let component: ResetinfoComponent;
  let fixture: ComponentFixture<ResetinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
