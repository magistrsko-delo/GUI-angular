import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { Page404Component } from './components/page404/page404.component';
import {MaterialModule} from './material/material.module';
import { ProjectMediaEditingComponent } from './components/project-media-editing/project-media-editing.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectListComponent,
        Page404Component,
        ProjectMediaEditingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
