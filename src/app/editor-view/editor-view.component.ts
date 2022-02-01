import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { Annotations } from 'src/model';
import { ObjectSerializerService } from '../object-serializer.service';
import { VideoService } from '../video.service';
import { saveAs } from 'file-saver';
import { TimestampPipe } from '../timestamp.pipe';

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

  playerWidth = 400

  constructor(private video: VideoService, route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, private router: Router, private urlSerializer: UrlSerializer, private objectSerializer: ObjectSerializerService, private clipboard: Clipboard, private timestamp: TimestampPipe) {
    if (route.snapshot.queryParamMap.has('ytid')) {
      this.annotations = {
        youtubeId: route.snapshot.queryParamMap.get('ytid') || '',
        memos: [],
      }
    }
    else if (route.snapshot.paramMap.keys.includes('encodedMessage')) {
      this.annotations = this.objectSerializer.deserializeAnnotations(route.snapshot.paramMap.get('encodedMessage')!);
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
    this.onResize();
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
      this.video.seekTo(this.video.getTime() + 1);
    } else if (key === COMMA) {
      this.video.seekTo(this.video.getTime() - 1 / 60);
      this.video.pause();
    } else if (key === PERIOD) {
      this.video.seekTo(this.video.getTime() + 1 / 60);
      this.video.pause();
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    const width = window.innerWidth;

    if (width < 768) {
      this.playerWidth = 514
    } else if (width < 992) {
      this.playerWidth = 454
    } else if (width < 1200) {
      this.playerWidth = 613
    } else if (width < 1400) {
      this.playerWidth = 734
    } else {
      this.playerWidth = 854
    }
  }

  createShareLink() {
    const thingy = this.router.createUrlTree(['editor', this.objectSerializer.serializeAnnotations(this.annotations)]);
    const path = location.origin + this.urlSerializer.serialize(thingy);
    console.log('serialized path', path)
    if (this.clipboard.copy(path)) {

    }
  }

  saveAsCsv() {
    // This is extremely stupid but to escape a double quote you.. do a second double quote.
    // https://stackoverflow.com/a/17808731/2875073
    const sanitize = (s: string) => s.replace(/"/g, '""');

    let output = 'Timestamp,Comment,YouTube Link\n';
    for (let i = 0; i < this.annotations.memos.length; i++) {
      const memo = this.annotations.memos[i];
      const timestampString = this.timestamp.transform(memo.timestampSeconds);
      const url = `https://www.youtube.com/watch?v=${this.annotations.youtubeId}&t=${Math.floor(memo.timestampSeconds)}s`;
      output += `"${timestampString}","${sanitize(memo.message)}","${url}"\n`;
    }

    saveAs(new Blob([output], { type: 'text/csv;charset=utf-8' }), 'vod_annotations.csv')
  }
}
