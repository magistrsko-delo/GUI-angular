import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {GraphQLService} from '../../services/graph-ql.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';
import {ProjectModel} from '../../models/ProjectModel';
import {MediaModel} from '../../models/MediaModel';
import {MatSelectChange} from '@angular/material/select';
import {SequenceModel} from '../../models/SequenceModels';
import {IMediaStream} from '../../models/IMediaStream';
import {SequenceMediaModel} from '../../models/SequenceMediaModel';

@Component({
    selector: 'app-project-media-editing',
    templateUrl: './project-media-editing.component.html',
    styleUrls: ['./project-media-editing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMediaEditingComponent implements OnInit {
    currentProjectId = -1;
    currentProject: ProjectModel;
    mediaManagerUrl: string = environment.mediaManagerUrl;
    hlsStreamUrl: string = environment.hlsStreamUrl;
    currentStream: IMediaStream;
    currentStreamTime: number; // in seconds
    currentStreamInTime: number; // in seconds
    currentStreamOutTime: number; // in seconds

    mediaSearchArray: Array<MediaModel>;
    projectMedias: Array<MediaModel>;
    projectSequences: Array<SequenceModel>;

    currentMediaPlay: MediaModel;

    // currnet sequence
    currentSequence: SequenceMediaModel;
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

    playOneMedia($event: MediaModel) {
        this.currentMediaPlay = $event;
        this.currentStream = new IMediaStream({
            type: 'hls',
            label: this.currentMediaPlay.name,
            source: this.hlsStreamUrl + 'v1/vod/' + this.currentMediaPlay.mediaId + '/master.m3u8',
            poster: this.currentMediaPlay.thumbnail && this.currentMediaPlay.thumbnail !== ''
                ? this.mediaManagerUrl + this.currentMediaPlay.thumbnail + '?isImage=true' : '',
        });
    }

    playSeqeunce(sequence: SequenceModel) {
        this.currentMediaPlay = null;
        this.currentStream = new IMediaStream({
            type: 'hls',
            label: sequence.name,
            source: this.hlsStreamUrl + 'v1/vod/sequence/' + sequence.sequenceId + '/1080p.m3u8',
            poster: sequence.thumbnail && sequence.thumbnail !== ''
                ? this.mediaManagerUrl + sequence.thumbnail + '?isImage=true' : '',
        });
    }

    addInCutPoint() {
        this.currentStreamInTime = this.currentStreamTime;
        this.changeDetector.markForCheck();
    }

    addOUtCutPoint() {
        this.currentStreamOutTime = this.currentStreamTime;
        this.changeDetector.markForCheck();
    }

    getCurrentSequenceMedias(sequenceId: number) {
        console.log('id: ', sequenceId);
        const request: GraphQLRequestModel = this.graphQLService.GetSequenceMedias(sequenceId);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.currentSequence = new SequenceMediaModel(rsp.getSequenceMedias);
                    console.log(this.currentSequence);
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }
}
