import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './components/page404/page404.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import {ProjectMediaEditingComponent} from './components/project-media-editing/project-media-editing.component';


const routes: Routes = [
    {path: '', pathMatch: 'full', component: ProjectListComponent},
    {path: 'project/:projectId/editor', pathMatch: 'full', component: ProjectMediaEditingComponent},
    {path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
