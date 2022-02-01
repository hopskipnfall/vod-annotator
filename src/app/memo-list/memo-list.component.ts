import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Annotations } from 'src/model';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-memo-list',
  templateUrl: './memo-list.component.html',
  styleUrls: ['./memo-list.component.scss']
})
export class MemoListComponent implements OnInit {
  @Input() annotations!: Annotations;

  playerReady: Observable<Boolean>;

  constructor(private video: VideoService) {
    this.playerReady = video.getReady();
  }

  ngOnInit() {
  }

  createMemo() {
    this.annotations.memos.push({
      timestampMs: Math.round(this.video.getTime()*10)/10,
      message: '',
    });

    // Should probably be using observables and pipes lol.
    this.annotations.memos = this.annotations.memos.sort((a, b) => a.timestampMs - b.timestampMs);
    this.video.pause();
  }

  seekTo(seconds: number) {
    this.video.seekTo(seconds);
    this.video.play();
  }

  removeMemoAtIndex(index: number) {
    this.annotations.memos.splice(index, 1);
  }
}
