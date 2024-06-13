import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadUserComponentComponent } from './read-user-component.component';

describe('ReadUserComponentComponent', () => {
  let component: ReadUserComponentComponent;
  let fixture: ComponentFixture<ReadUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadUserComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
