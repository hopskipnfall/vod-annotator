import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPickerComponent } from './video-picker.component';

describe('VideoPickerComponent', () => {
  let component: VideoPickerComponent;
  let fixture: ComponentFixture<VideoPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoPickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
