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
import {ConfirmComponent} from '../modal/confirm/confirm.component';
import {PublishSequenceComponent} from '../modal/publish-sequence/publish-sequence.component';
import {MediaManagerService} from '../../services/media-manager.service';
import {ToastService} from '../../services/toast.service';
import {MainComponent} from '../main.component';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-project-media-editing',
    templateUrl: './project-media-editing.component.html',
    styleUrls: ['./project-media-editing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMediaEditingComponent extends MainComponent implements OnInit {
    currentProjectId = -1;
    currentProject: ProjectModel;
    mediaManagerUrl: string = environment.mediaManagerUrl;
    hlsStreamUrl: string = environment.hlsStreamUrl;
    currentStream: IMediaStream = null;
    currentStreamTime: number; // in seconds
    currentStreamInTime: number; // in seconds
    currentStreamOutTime: number; // in seconds

    mediaSearchArray: Array<MediaModel>;
    selectedOption = 3;
    projectMedias: Array<MediaModel>;
    projectSequences: Array<SequenceModel>;

    currentMediaPlay: MediaModel;
    selectedIndex: number;
    type: string;

    // current sequence
    currentSequence: SequenceMediaModel;

    /**
     * data for dragged items
     */
    @ViewChild('mediaSearchList', {read: ElementRef}) mediaSearchListVar: ElementRef;
    @ViewChild('mediaProjectList', {read: ElementRef}) mediaProjectListVar: ElementRef;
    mediaDrag: MediaModel;

    /*
    * loading
    * */
    isMediaLoading: boolean;
    isProjectMediaLoading: boolean;
    isSequencesLoading: boolean;
    isSequenceMediaLoading: boolean;
    constructor(
        private graphQLService: GraphQLService,
        private mediaManagerService: MediaManagerService,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private toastService: ToastService,
        public dragDropService: DragDropService,
        public dialog: MatDialog,
    ) {
        super();
    }

    ngOnInit(): void {
        this.isMediaLoading = true;
        this.isProjectMediaLoading = true;
        this.isSequencesLoading = true;
        this.isSequenceMediaLoading = true;
        this.route.paramMap.subscribe(
            params => {
                this.currentProjectId = Number(params.get('projectId'));
                this.getCurrentProjectData();
            }
        );
        this.getMediasStatusBasedOnStatus(3);
    }

    tabEvent(tabIndex: number): void {
        if (tabIndex === 1) {
            // this.isProjectMediaLoading = true;
            // this.isSequencesLoading = true;
            this.getProjectMedias();
            this.getProjectSequencesRequest();
        } else {
            // this.isMediaLoading = true;
            this.getMediasStatusBasedOnStatus(this.selectedOption);
        }
        this.changeDetector.markForCheck();
    }

    searchNewMedia($event: MatSelectChange): void {
        this.selectedOption = $event.value;
        this.isMediaLoading = true;
        this.getMediasStatusBasedOnStatus($event.value);
        this.changeDetector.markForCheck();
    }

    private getMediasStatusBasedOnStatus(status: number): void {
        const request: GraphQLRequestModel =  this.graphQLService.SearchMediaStatus(status);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.mediaSearchArray = rsp.searchMedias.map(media => new MediaModel(media));
                    if (this.currentMediaPlay && this.type === 'search') {
                        this.currentMediaPlay = this.mediaSearchArray[this.selectedIndex];
                    }
                    this.isMediaLoading = false;
                    this.changeDetector.markForCheck();
                },
                error => {
                    this.isMediaLoading = false;
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
    }

    private getCurrentProjectData(): void {
        const request: GraphQLRequestModel = this.graphQLService.GetOneProjectDataRequest(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.currentProject = new ProjectModel(rsp.oneProjectMetadata);
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
    }

    private getProjectMedias(): void {
        const request: GraphQLRequestModel =  this.graphQLService.GetProjectMedias(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.projectMedias = rsp.searchMedias.map(media => new MediaModel(media));
                    if (this.currentMediaPlay && this.type === 'project') {
                        this.currentMediaPlay = this.projectMedias[this.selectedIndex];
                    }
                    this.isProjectMediaLoading = false;
                    this.changeDetector.markForCheck();
                },
                error => {
                    this.isProjectMediaLoading = false;
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
    }

    private getProjectSequencesRequest(): void {
        const request: GraphQLRequestModel = this.graphQLService.GetProjectSequences(this.currentProjectId);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.projectSequences = rsp.getProjectSequences.map(sequenceData => new SequenceModel(sequenceData));
                    this.isSequencesLoading = false;
                    this.changeDetector.markForCheck();
                },
                error => {
                    this.isSequencesLoading = false;
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
    }

    playOneMedia($event: MediaModel, i: number, type: string) {
        this.currentMediaPlay = $event;
        this.selectedIndex = i;
        this.type = type;
        this.currentStream = new IMediaStream({
            type: 'hls',
            label: this.currentMediaPlay.name,
            source: this.hlsStreamUrl + 'v1/vod/' + this.currentMediaPlay.mediaId + '/master.m3u8',
            poster: this.currentMediaPlay.thumbnail && this.currentMediaPlay.thumbnail !== ''
                ? this.mediaManagerUrl + this.currentMediaPlay.thumbnail + '?isImage=true' : '',
        });
        this.changeDetector.markForCheck();
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
        this.changeDetector.markForCheck();
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
        const request: GraphQLRequestModel = this.graphQLService.GetSequenceMedias(sequenceId);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.currentSequence = new SequenceMediaModel(rsp.getSequenceMedias);
                    this.isSequenceMediaLoading = false;
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.isSequenceMediaLoading = false;
                    this.changeDetector.markForCheck();
                }
            );
    }

    dropMedia($event: CdkDragDrop<any, any>): void {
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
        this.changeDetector.markForCheck();
        const request: GraphQLRequestModel = this.graphQLService.ManageMediaInSequence(sequenceId, mediaId, isDelete, isAdd);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.currentSequence = new SequenceMediaModel(rsp.manageMediaInSequence);
                    this.isSequenceMediaLoading = false;
                    this.isSequencesLoading = true;
                    this.getProjectSequencesRequest();
                    this.changeDetector.markForCheck();
                },
                error => {
                    this.isSequenceMediaLoading = false;
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
    }

    deleteLastMediaFromSequence() {
        const mediaId: number = this.currentSequence.Medias[this.currentSequence.Medias.length - 1].mediaId;
        this.manageMediaInSequence(this.currentSequence.sequence.sequenceId, mediaId, true, false);
        this.changeDetector.markForCheck();
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
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
            result => {
                if (result) {
                    if (search === 'search') {
                        this.mediaSearchArray[i] = media;
                        this.isMediaLoading = true;
                        this.getMediasStatusBasedOnStatus(this.selectedOption);
                    } else {
                        this.projectMedias[i] = media;
                        this.isProjectMediaLoading = true;
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
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
                this.isSequencesLoading = true;
                this.getProjectSequencesRequest();
                this.changeDetector.markForCheck();
        });
    }

    updateSequence(sequence: SequenceModel) {
        this.dialog.open(SequenceComponent, {
            width: '500px',
            data: sequence
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
                this.isSequencesLoading = true;
                this.getProjectSequencesRequest();
                if (sequence.sequenceId === this.currentSequence.sequence.sequenceId) {
                    this.isSequenceMediaLoading = true;
                    this.getCurrentSequenceMedias(sequence.sequenceId);
                }
                this.changeDetector.markForCheck();
        });
    }

    deleteSequence() {
        this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: 'Želite izbrisati sekvenco?'
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
            if (result) {
                const request: GraphQLRequestModel = this.graphQLService.DeleteSequenceMutation(
                    this.currentProjectId,
                    this.currentSequence.sequence.sequenceId);
                this.graphQLService.graphQLRequest(request)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(
                        (rsp: any) => {
                            this.projectSequences = rsp.deleteSequence.map(seq => new SequenceModel(seq));
                            this.currentSequence = null;
                            this.currentStream = null;
                            this.changeDetector.markForCheck();
                        },
                        error => {
                            console.error('Error', error);
                            this.toastService.addToast('Napaka', error.message);
                            this.changeDetector.markForCheck();
                        }
                    );
            }
        });
    }

    cutVideo(): void {
        if (!this.currentStreamInTime || this.currentStreamInTime <= 0 ||
            !this.currentStreamOutTime || this.currentStreamOutTime <= 0 ||
            this.currentStreamOutTime === this.currentStreamInTime ||
            this.currentStreamOutTime < this.currentStreamInTime
        ) {
            this.toastService.addToast('Napaka', 'nepravilni vnosni podatki za rezanje videa');
            this.changeDetector.markForCheck();
            return;
        }

        this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: 'Želite razrezati video'
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
            result => {
                if (result) {
                    const request: GraphQLRequestModel = this.graphQLService.CutMedia(
                        Number(this.currentStreamInTime),
                        Number(this.currentStreamOutTime),
                        this.currentProjectId,
                        this.currentMediaPlay.mediaId);
                    this.graphQLService.graphQLRequest(request)
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe(
                            (rsp: any) => {
                                this.isProjectMediaLoading = true;
                                this.getProjectMedias();
                                this.currentStreamInTime = null;
                                this.currentStreamOutTime = null;
                                this.changeDetector.markForCheck();
                            },
                            error =>  {
                                console.error('Error', error);
                                this.toastService.addToast('Napaka', error.message);
                                this.changeDetector.markForCheck();
                            }
                        );
                }
            }
        );
    }

    publishSequence() {
        this.dialog.open(PublishSequenceComponent, {
            width: '500px',
            data: this.currentSequence.sequence
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
            result => {
                if (result) {
                    this.currentSequence = null;
                    this.isSequencesLoading = true;
                    this.getProjectSequencesRequest();
                    this.currentSequence = null;
                    this.changeDetector.markForCheck();
                }
            }
        );
    }

    takeMediaImage() {
        const time = this.currentStreamTime;
        this.dialog.open(ConfirmComponent, {
            width: '500px',
            data: 'Želite vzeti zaslonski posnetek medie: ' + this.currentMediaPlay.name + '  ob času: ' + time
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
            if (result) {
                this.mediaManagerService.createMediaImage(this.currentMediaPlay.mediaId, time)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(
                        (rsp: boolean) => {
                            this.toastService.addToast('Uspeh', 'Slika medije poslana v obdelavo');
                            const intervalListener = setInterval(() => {
                                this.isMediaLoading = true;
                                this.getMediasStatusBasedOnStatus(this.selectedOption);
                                this.isProjectMediaLoading = true;
                                this.getProjectMedias();
                                this.changeDetector.markForCheck();
                                window.clearInterval(intervalListener);
                            }, 5000);
                        },
                        error => {
                            console.error('Error', error);
                            this.toastService.addToast('Napaka', error.message);
                            this.changeDetector.markForCheck();
                        }
                    );
            }
        });
    }

    deleteMedia(media: MediaModel) {
        this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: 'Želite izbrisati medio ' + media.name + '?'
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
            if (result) {
                this.isProjectMediaLoading = true;
                this.changeDetector.markForCheck();
                this.mediaManagerService.deleteMedia(media.mediaId)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(
                        (rsp: boolean) => {
                            this.getProjectMedias();
                        },
                        error => {
                            console.error('Error', error);
                            this.toastService.addToast('Napaka', error.message);
                            this.changeDetector.markForCheck();
                        }
                    );
            }
        });
    }
}
