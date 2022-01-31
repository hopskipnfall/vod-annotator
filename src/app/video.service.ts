import { Injectable } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  player?: YouTubePlayer;

  private readonly ready: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor() { }

  setPlayer(player: YouTubePlayer) {
    this.player = player;
    this.ready.next(true);
  }

  getTime(): number {
    if (!this.player) {
      throw Error("player isn't loaded yet!");
    }
    return this.player.getCurrentTime();
  }

  pause() {
    if (!this.player) {
      throw Error("player isn't loaded yet!");
    }

    this.player.pauseVideo();
  }

  play() {
    if (!this.player) {
      throw Error("player isn't loaded yet!");
    }

    this.player.playVideo();
  }

  seekTo(seconds: number) {
    if (!this.player) {
      throw Error("player isn't loaded yet!");
    }

    this.player.seekTo(seconds, true);
  }

  getReady(): Observable<Boolean> {
    return this.ready.asObservable();
  }

  getPlayerState(): (YT.PlayerState | undefined) {
    return this.player?.getPlayerState();
  }
}
