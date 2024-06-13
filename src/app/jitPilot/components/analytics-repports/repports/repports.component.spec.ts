import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepportsComponent } from './repports.component';

describe('RepportsComponent', () => {
  let component: RepportsComponent;
  let fixture: ComponentFixture<RepportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
