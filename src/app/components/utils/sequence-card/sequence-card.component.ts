import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-sequence-card',
    templateUrl: './sequence-card.component.html',
    styleUrls: ['./sequence-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SequenceCardComponent implements OnInit {

    constructor(
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
    }

}
