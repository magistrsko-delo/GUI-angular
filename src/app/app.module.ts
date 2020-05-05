import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VgBufferingModule, VgControlsModule, VgCoreModule, VgOverlayPlayModule, VgStreamingModule } from '@hitrecord/videogular2';

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
import { MainComponent } from './components/main.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectListComponent,
        Page404Component,
        ProjectMediaEditingComponent,
        MediaCardComponent,
        SequenceCardComponent,
        MainComponent
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
        /*VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule*/
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
