import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MainComponent} from '../main.component';
import {GraphQLService} from '../../services/graph-ql.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';
import {ProjectModel} from '../../models/ProjectModel';
import {MediaModel} from '../../models/MediaModel';
import {MatSelectChange} from '@angular/material/select';
import {SequenceModel} from '../../models/SequenceModels';

@Component({
    selector: 'app-project-media-editing',
    templateUrl: './project-media-editing.component.html',
    styleUrls: ['./project-media-editing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMediaEditingComponent implements OnInit {
    currentProjectId = -1;
    currentProject: ProjectModel;

    mediaSearchArray: Array<MediaModel>;
    projectMedias: Array<MediaModel>;
    projectSequences: Array<SequenceModel>;
    constructor(
        private graphQLService: GraphQLService,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
    ) {
        // super();
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(
            params => {
                this.currentProjectId = Number(params.get('projectId'));
                console.log(this.currentProjectId);
                this.getCurrentProjectData();
            }
        );
        this.getMediasStatusBasedOnStatus(3);
    }

    tabEvent(tabIndex: number): void {
        console.log(tabIndex);
        if (tabIndex === 1) {
            console.log('get project medias and sequences..');
            this.getProjectMedias();
            this.getProjectSequencesRequest();
        }
    }

    searchNewMedia($event: MatSelectChange): void {
        this.getMediasStatusBasedOnStatus($event.value);
    }

    private getMediasStatusBasedOnStatus(status: number): void {
        const request: GraphQLRequestModel =  this.graphQLService.SearchMediaStatus(status);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.mediaSearchArray = rsp.searchMedias.map(media => new MediaModel(media));
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }

    private getCurrentProjectData(): void {
        const request: GraphQLRequestModel = this.graphQLService.GetOneProjectDataRequest(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.currentProject = new ProjectModel(rsp.oneProjectMetadata);
                    console.log('current project: ', this.currentProject);
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }

    private getProjectMedias(): void {
        const request: GraphQLRequestModel =  this.graphQLService.GetProjectMedias(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.projectMedias = rsp.searchMedias.map(media => new MediaModel(media));
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }

    private getProjectSequencesRequest(): void {
        const request: GraphQLRequestModel = this.graphQLService.GetProjectSequences(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.projectSequences = rsp.getProjectSequences.map(sequenceData => new SequenceModel(sequenceData));
                    console.log(this.projectSequences);
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }
}
