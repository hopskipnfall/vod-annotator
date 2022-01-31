import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Annotations } from 'src/model';
import { VideoService } from '../video.service';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const COMMA = ',';
const PERIOD = '.';
const SPACE = ' ';
const K = 'k';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {
  annotations!: Annotations;

  constructor(private video: VideoService, route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) {
    if (route.snapshot.paramMap.keys.includes('encodedMessage')) {
      this.annotations = JSON.parse(atob(route.snapshot.paramMap.get('encodedMessage')!)) as Annotations;
    }

    // Periodically if the iframe has focus and take it back so we can control what the arrow keys do.
    setInterval(() => {
      if (document.activeElement?.tagName === "IFRAME") {
        console.info('YouTube iframe is in focus, blurring');
        (document.activeElement as HTMLElement).blur();
      }
    }, 500);
  }

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (document.activeElement?.tagName === 'TEXTAREA') {
      // Ignore inputs when typing into something.
      return;
    }

    const key = event.key;
    if (key === ARROW_LEFT) {
      this.video.seekTo(Math.max(this.video.getTime() - 1, 0));
    } else if (key === ARROW_RIGHT) {
      // TODO: This probably shouldn't let you scroll past the end of the video. Who knows what lies beyond...
      this.video.seekTo(this.video.getTime() + 1);
    } else if (key === SPACE || key === K) {
      this.togglePlayback();

      // Prevent spacebar from scrolling the page.
      event.preventDefault();
    }
  }

  goForwardSeconds(seconds: number) {
    this.video.seekTo(this.video.getTime() + seconds);
  }

  togglePlayback() {
    const state = this.video.getPlayerState();
    if (state === YT.PlayerState.BUFFERING || state === YT.PlayerState.PLAYING) {
      this.video.pause();
    } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.UNSTARTED || state === YT.PlayerState.CUED) {
      this.video.play();
    }
  }
}
