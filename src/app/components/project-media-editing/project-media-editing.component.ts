import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {CdkDragDrop, CdkDragStart} from '@angular/cdk/drag-drop';
import {DragDropService} from '../../services/drag-drop.service';
import {MatDialog} from '@angular/material/dialog';
import {MediaEditComponent} from '../modal/media-edit/media-edit.component';
import {SequenceComponent} from '../modal/sequence/sequence.component';

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
    selectedOption = 3;
    projectMedias: Array<MediaModel>;
    projectSequences: Array<SequenceModel>;

    currentMediaPlay: MediaModel;

    // current sequence
    currentSequence: SequenceMediaModel;

    /**
     * data for dragged items
     */
    @ViewChild('mediaSearchList', {read: ElementRef}) mediaSearchListVar: ElementRef;
    @ViewChild('mediaProjectList', {read: ElementRef}) mediaProjectListVar: ElementRef;
    mediaDrag: MediaModel;
    constructor(
        private graphQLService: GraphQLService,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        public dragDropService: DragDropService,
        public dialog: MatDialog,
    ) {
        // super();
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(
            params => {
                this.currentProjectId = Number(params.get('projectId'));
                // console.log(this.currentProjectId);
                this.getCurrentProjectData();
            }
        );
        this.getMediasStatusBasedOnStatus(3);
    }

    tabEvent(tabIndex: number): void {
        // console.log(tabIndex);
        if (tabIndex === 1) {
            // console.log('get project medias and sequences..');
            this.getProjectMedias();
            this.getProjectSequencesRequest();
        }
    }

    searchNewMedia($event: MatSelectChange): void {
        this.selectedOption = $event.value;
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
                   // console.log('current project: ', this.currentProject);
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
                    // console.log(this.projectSequences);
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
            source: this.hlsStreamUrl + 'v1/vod/sequence/' + sequence.sequenceId + '/1080p.m3u8?q=' + Math.random(),
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
       // console.log('id: ', sequenceId);
        const request: GraphQLRequestModel = this.graphQLService.GetSequenceMedias(sequenceId);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.currentSequence = new SequenceMediaModel(rsp.getSequenceMedias);
                    // console.log(this.currentSequence);
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }

    dropMedia($event: CdkDragDrop<any, any>): void {
        // console.log('media drag: ', this.mediaDrag);
        this.dragDropService.setEnteredScope('');
        this.manageMediaInSequence(this.currentSequence.sequence.sequenceId,  this.mediaDrag.mediaId, false, true);
        this.changeDetector.markForCheck();
    }

    onSearchMediaDrag($event: CdkDragStart, media: MediaModel, i: number): void {
        this.dragDropService.onDragStart(this.mediaSearchListVar, i, 'media');
        this.mediaDrag = media;
        this.changeDetector.markForCheck();
    }

    onProjectMediaDrag($event: any, media: MediaModel, i: number): void {
        this.dragDropService.onDragStart(this.mediaProjectListVar, i, 'media');
        this.mediaDrag = media;
        this.changeDetector.markForCheck();
    }

    private manageMediaInSequence(sequenceId: number, mediaId: number, isDelete: boolean = false, isAdd: boolean = false): void {
        const request: GraphQLRequestModel = this.graphQLService.ManageMediaInSequence(sequenceId, mediaId, isDelete, isAdd);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.currentSequence = new SequenceMediaModel(rsp.manageMediaInSequence);
                    this.getProjectSequencesRequest();
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.log(error);
                }
            );
    }

    deleteLastMediaFromSequence() {
        const mediaId: number = this.currentSequence.Medias[this.currentSequence.Medias.length - 1].mediaId;
        this.manageMediaInSequence(this.currentSequence.sequence.sequenceId, mediaId, true, false);
    }

    checkIfDraggable(media: MediaModel): boolean {
        if (!this.currentSequence) {
            return false;
        }

        return !this.currentSequence.Medias.find(x => x.mediaId === media.mediaId);
    }

    editMedia(media: MediaModel, i: number, search: string) {
        this.dialog.open(MediaEditComponent, {
            width: '500px',
            data: media
        }).afterClosed().subscribe(
            result => {
                if (result) {
                    if (search === 'search') {
                        this.mediaSearchArray[i] = media;
                        this.getMediasStatusBasedOnStatus(this.selectedOption);
                    } else {
                        this.projectMedias[i] = media;
                        this.getProjectMedias();
                    }
                    this.changeDetector.markForCheck();
                }
            }
        );
    }

    createSequence() {
        this.dialog.open(SequenceComponent, {
            width: '500px',
            data: this.currentProjectId
        }).afterClosed().subscribe(result => {
            this.getProjectSequencesRequest();
        });
    }

    updateSequence(sequence: SequenceModel) {
        this.dialog.open(SequenceComponent, {
            width: '500px',
            data: sequence
        }).afterClosed().subscribe(result => {
            this.getProjectSequencesRequest();
            if (sequence.sequenceId === this.currentSequence.sequence.sequenceId) {
                this.getCurrentSequenceMedias(sequence.sequenceId);
            }
        });
    }
}
