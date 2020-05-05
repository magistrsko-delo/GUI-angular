import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GraphQLService} from '../../services/graph-ql.service';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';
import {ProjectModel} from '../../models/ProjectModel';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {MainComponent} from '../main.component';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

    projectArray: Array<ProjectModel> = [];
    mediaManagerUrl: string = environment.mediaManagerUrl;

    constructor(
        private graphQLService: GraphQLService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
    ) {
        // super();
    }

    ngOnInit(): void {
        this.getProjects();
    }

    private getProjects(): void {
        const request: GraphQLRequestModel =  this.graphQLService.GetProjectDataRequest();
        console.log(request);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.projectArray = rsp.projectsMetadata.map(project => new ProjectModel(project));
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log('in eror: ', error);
                }
            );
    }

    public openProject(project: ProjectModel){
        console.log('opening: ', project);
        this.router.navigate(['/project/' + project.projectId + '/editor']);
    }

    public removeProject(project: ProjectModel) {
        console.log('removing: ', project);
    }

    public addProject(){
        console.log('adding project');
    }
}
