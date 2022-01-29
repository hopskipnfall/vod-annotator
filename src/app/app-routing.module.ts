import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { VideoPickerComponent } from './video-picker/video-picker.component';

const routes: Routes = [
  {
    path: '',
    component: VideoPickerComponent,
  },
  {
    path: 'editor/:encodedMessage',
    component: EditorViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
