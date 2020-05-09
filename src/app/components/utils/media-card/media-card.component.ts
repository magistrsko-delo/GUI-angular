import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MediaModel} from '../../../models/MediaModel';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-media-card',
    templateUrl: './media-card.component.html',
    styleUrls: ['./media-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaCardComponent implements OnInit {
    @Input() isSequenceMedia = false;
    @Input() media: MediaModel;
    @Input() canDelete = false;
    @Input() canDownload = false;

    @Output() mediaForPlayEvent = new EventEmitter<MediaModel>();
    @Output() deleteMediaEvent = new EventEmitter<boolean>();
    mediaManagerUrl: string = environment.mediaManagerUrl;

    constructor(
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
    }

    playMedia() {
        this.mediaForPlayEvent.emit(this.media);
    }

    deleteMedia() {
        this.deleteMediaEvent.emit(true);
    }

    download() {
        window.location.href = this.mediaManagerUrl + 'v1/mediaManager/'
            + this.media.awsBucketWholeMedia + '/' + this.media.awsStorageNameWholeMedia;
    }
}
