import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { VideoService } from '../video.service';

let apiLoaded = false;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {
  @Input() youtubeId!: string;

  @ViewChild("player") player!: YouTubePlayer;

  constructor(private video: VideoService) { }

  ngOnInit(): void {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }

  }


  async ngAfterViewInit() {
    this.player?.ready.subscribe(a => {
      this.video.setPlayer(this.player);
    });

    this.player.stateChange.subscribe(state => {console.log('aaaa', state)});
  }
}
