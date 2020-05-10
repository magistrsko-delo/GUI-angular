import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { PlayerModule } from './player/player.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { Page404Component } from './components/page404/page404.component';
import { ProjectMediaEditingComponent } from './components/project-media-editing/project-media-editing.component';
import { MediaCardComponent } from './components/utils/media-card/media-card.component';
import { SequenceCardComponent } from './components/utils/sequence-card/sequence-card.component';
import { ProjectEditComponent } from './components/modal/project-edit/project-edit.component';
import { ConfirmComponent } from './components/modal/confirm/confirm.component';
import { MediaEditComponent } from './components/modal/media-edit/media-edit.component';
import { SequenceComponent } from './components/modal/sequence/sequence.component';
import { PublishSequenceComponent } from './components/modal/publish-sequence/publish-sequence.component';
import { LiveMediaComponent } from './components/live-media/live-media.component';
import { UploadMediaComponent } from './components/modal/upload-media/upload-media.component';
import { AddProjectComponent } from './components/modal/add-project/add-project.component';
import { AppLoaderComponent } from './components/utils/app-loader/app-loader.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectListComponent,
        Page404Component,
        ProjectMediaEditingComponent,
        MediaCardComponent,
        SequenceCardComponent,
        ProjectEditComponent,
        ConfirmComponent,
        MediaEditComponent,
        SequenceComponent,
        PublishSequenceComponent,
        LiveMediaComponent,
        UploadMediaComponent,
        AddProjectComponent,
        AppLoaderComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        PlayerModule,
        DragDropModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
