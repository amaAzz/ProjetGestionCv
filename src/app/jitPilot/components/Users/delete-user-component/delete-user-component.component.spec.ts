import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserComponentComponent } from './delete-user-component.component';

describe('DeleteUserComponentComponent', () => {
  let component: DeleteUserComponentComponent;
  let fixture: ComponentFixture<DeleteUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUserComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
