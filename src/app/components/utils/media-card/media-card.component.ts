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

    @Output() mediaForPlayEvent = new EventEmitter<MediaModel>();

    mediaManagerUrl: string = environment.mediaManagerUrl;
    constructor(
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
    }

    playMedia() {
        this.mediaForPlayEvent.emit(this.media);
    }
}
