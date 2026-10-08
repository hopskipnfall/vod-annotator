import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { VideoPickerComponent } from './video-picker.component';

describe('VideoPickerComponent', () => {
  let component: VideoPickerComponent;
  let fixture: ComponentFixture<VideoPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
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

  it('accepts YouTube URLs and rejects others', () => {
    component.url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(component.isValidUrl()).toBeTrue();
    component.url = 'https://example.com/watch?v=dQw4w9WgXcQ';
    expect(component.isValidUrl()).toBeFalse();
  });
});
