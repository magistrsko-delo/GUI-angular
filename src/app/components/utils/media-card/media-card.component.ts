import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-media-card',
    templateUrl: './media-card.component.html',
    styleUrls: ['./media-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaCardComponent implements OnInit {
    @Input() isSequenceMedia = false;

    constructor(
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
    }

}
