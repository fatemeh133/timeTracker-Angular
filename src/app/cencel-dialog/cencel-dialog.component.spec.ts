import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CencelDialogComponent } from './cencel-dialog.component';

describe('CencelDialogComponent', () => {
  let component: CencelDialogComponent;
  let fixture: ComponentFixture<CencelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CencelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CencelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
