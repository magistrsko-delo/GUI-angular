import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GraphQLService} from '../../services/graph-ql.service';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';
import {ProjectModel} from '../../models/ProjectModel';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProjectEditComponent} from '../modal/project-edit/project-edit.component';
import {ConfirmComponent} from '../modal/confirm/confirm.component';
import {AddProjectComponent} from '../modal/add-project/add-project.component';
import {ToastService} from '../../services/toast.service';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

    projectArray: Array<ProjectModel> = [];
    mediaManagerUrl: string = environment.mediaManagerUrl;

    constructor(
        public dialog: MatDialog,
        private graphQLService: GraphQLService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private toastService: ToastService
    ) {
        // super();
    }

    ngOnInit(): void {
        this.getProjects();
    }

    private getProjects(): void {
        const request: GraphQLRequestModel =  this.graphQLService.GetProjectDataRequest();
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.projectArray = rsp.projectsMetadata.map(project => new ProjectModel(project));
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                }
            );
    }

    public openProject(project: ProjectModel){
        this.router.navigate(['/project/' + project.projectId + '/editor']);
    }

    public removeProject(project: ProjectModel) {
        this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: 'Želite izbrisati projekt?'
        }).afterClosed().subscribe(result => {
            if (result) {
                const request: GraphQLRequestModel = this.graphQLService.DeleteProjectMutation(project.projectId);
                this.graphQLService.graphQLRequest(request)
                    .subscribe(
                        (rsp: any) => {
                            this.projectArray = rsp.deleteProject.map(project1 => new ProjectModel(project1));
                            console.error('DELETE FOR PROJECT CURRENTLY UNAVAILABLE');
                            this.changeDetector.markForCheck();
                        },
                        error => {
                            console.error('Error', error);
                            this.toastService.addToast('Napaka', error.message);
                        }
                    );
            }
        });
    }

    public addProject(){
        this.dialog.open(AddProjectComponent, {
            width: '500px',
            data: null
        }).afterClosed().subscribe(
            result => {
                if (result) {
                    this.getProjects();
                }
            }
        );
    }

    editProject(project: ProjectModel, index: number) {
        this.dialog.open(ProjectEditComponent, {
            width: '500px',
            data: project
        }).afterClosed().subscribe(result => {
            if (result) {
                this.projectArray[index] = result;
                this.changeDetector.markForCheck();
            }
        });
    }
}
