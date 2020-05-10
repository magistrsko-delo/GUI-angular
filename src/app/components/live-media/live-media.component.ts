import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {MediaModel} from '../../models/MediaModel';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';
import {GraphQLService} from '../../services/graph-ql.service';
import {MediaManagerService} from '../../services/media-manager.service';
import {MatDialog} from '@angular/material/dialog';
import {IMediaStream} from '../../models/IMediaStream';
import {environment} from '../../../environments/environment';
import {ConfirmComponent} from '../modal/confirm/confirm.component';
import {MediaEditComponent} from '../modal/media-edit/media-edit.component';
import {UploadMediaComponent} from '../modal/upload-media/upload-media.component';
import {ToastService} from '../../services/toast.service';
import {MainComponent} from '../main.component';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-live-media',
    templateUrl: './live-media.component.html',
    styleUrls: ['./live-media.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMediaComponent extends MainComponent implements OnInit {
    currentStream: IMediaStream = null;
    currentMediaPlay: MediaModel;
    mediaManagerUrl: string = environment.mediaManagerUrl;
    hlsStreamUrl: string = environment.hlsStreamUrl;
    selectedOption = 3;
    mediaSearchArray: Array<MediaModel>;

    constructor(
        private graphQLService: GraphQLService,
        private mediaManagerService: MediaManagerService,
        private changeDetector: ChangeDetectorRef,
        private toastService: ToastService,
        public dialog: MatDialog,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getMediasStatusBasedOnStatus(3);
    }

    tabEvent($event: any) {
    }

    searchNewMedia($event: MatSelectChange) {
        this.selectedOption = $event.value;
        this.getMediasStatusBasedOnStatus(this.selectedOption);
    }

    editMedia(media: any, i: number, search: string) {
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
                        this.getMediasStatusBasedOnStatus(this.selectedOption);
                    }
                    this.changeDetector.markForCheck();
                }
            }
        );
    }

    playOneMedia($event: MediaModel, i: number, search: string) {
        this.currentMediaPlay = $event;
        this.currentStream = new IMediaStream({
            type: 'hls',
            label: this.currentMediaPlay.name,
            source: this.hlsStreamUrl + 'v1/vod/' + this.currentMediaPlay.mediaId + '/master.m3u8',
            poster: this.currentMediaPlay.thumbnail && this.currentMediaPlay.thumbnail !== ''
                ? this.mediaManagerUrl + this.currentMediaPlay.thumbnail + '?isImage=true' : '',
        });
    }

    private getMediasStatusBasedOnStatus(status: number): void {
        const request: GraphQLRequestModel =  this.graphQLService.SearchMediaStatus(status);
        this.graphQLService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.mediaSearchArray = rsp.searchMedias.map(media => new MediaModel(media));
                    this.changeDetector.markForCheck();
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                }
            );
    }

    deleteMedia(media: MediaModel) {
        this.dialog.open(ConfirmComponent, {
            width: '300px',
            data: 'Želite izbrisati medio ' + media.name + '?'
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
            if (result) {
                this.mediaManagerService.deleteMedia(media.mediaId)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(
                        (rsp: boolean) => {
                            this.getMediasStatusBasedOnStatus(this.selectedOption);
                        },
                        error => {
                            console.error('Error', error);
                            this.toastService.addToast('Napaka', error.message);
                        }
                    );
            }
        });
    }

    addMedia() {
        this.dialog.open(UploadMediaComponent, {
            width: '500px',
            data: null
        }).afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
            if (result) {
                this.getMediasStatusBasedOnStatus(this.selectedOption);
            }
        });
    }
}
