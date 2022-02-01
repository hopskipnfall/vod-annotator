import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoPickerComponent } from './video-picker/video-picker.component';
import { FormsModule } from '@angular/forms';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { MemoListComponent } from './memo-list/memo-list.component';
import { PlayerComponent } from './player/player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { TimestampPipe } from './timestamp.pipe';
import {MatIconModule} from '@angular/material/icon';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    VideoPickerComponent,
    EditorViewComponent,
    MemoListComponent,
    PlayerComponent,
    TimestampPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    YouTubePlayerModule,
    MatIconModule,
    TooltipModule,
  ],
  providers: [
    TimestampPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
