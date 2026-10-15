import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MemoListComponent } from './memo-list.component';
import { TimestampPipe } from '../timestamp.pipe';
import { VideoService } from '../video.service';

describe('MemoListComponent', () => {
  let component: MemoListComponent;
  let fixture: ComponentFixture<MemoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MemoListComponent, TimestampPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoListComponent);
    component = fixture.componentInstance;
    component.annotations = {
      youtubeId: 'abc',
      memos: [
        { timestampSeconds: 1, message: 'w', kind: 'win' },
        { timestampSeconds: 2, message: 'l', kind: 'loss' },
        { timestampSeconds: 3, message: 'm' },
      ],
    };
    fixture.detectChanges();
  });

  const cards = () =>
    Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.card')
    );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows every memo with win/loss styling by default', () => {
    expect(cards().length).toBe(3);
    expect(cards()[0].classList).toContain('memo-win');
    expect(cards()[1].classList).toContain('memo-loss');
  });

  it('hides memos of a kind when its filter is off, without touching the data', () => {
    component.showLosses = false;
    fixture.detectChanges();
    expect(cards().length).toBe(2);
    expect(component.annotations.memos.length).toBe(3);
  });

  describe('seekTo', () => {
    let video: VideoService;

    beforeEach(() => {
      video = TestBed.inject(VideoService);
      spyOn(video, 'seekTo');
      spyOn(video, 'play');
    });

    it('starts 1 second early by default', () => {
      component.seekTo(12.3);
      expect(video.seekTo).toHaveBeenCalledWith(11.3);
      expect(video.play).toHaveBeenCalled();
    });

    it('never seeks before 0:00', () => {
      component.seekTo(0.4);
      expect(video.seekTo).toHaveBeenCalledWith(0);
    });

    it('seeks to the exact timestamp when unchecked', () => {
      component.startEarly = false;
      component.seekTo(12.3);
      expect(video.seekTo).toHaveBeenCalledWith(12.3);
    });

    it('is checked by default in the UI', async () => {
      await fixture.whenStable();
      const checkbox = (fixture.nativeElement as HTMLElement).querySelector(
        '#start-early'
      ) as HTMLInputElement;
      expect(checkbox.checked).toBeTrue();
    });
  });

  it('hides the filters when no memo has a kind', () => {
    component.annotations.memos = [{ timestampSeconds: 3, message: 'm' }];
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.filters')
    ).toBeNull();
  });
});
