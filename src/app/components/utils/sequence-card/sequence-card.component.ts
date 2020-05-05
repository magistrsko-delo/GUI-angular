import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SequenceModel} from '../../../models/SequenceModels';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-sequence-card',
    templateUrl: './sequence-card.component.html',
    styleUrls: ['./sequence-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SequenceCardComponent implements OnInit {
    @Input() sequence: SequenceModel;
    @Output() editSequenceEvent: EventEmitter<number> = new EventEmitter<number>();
    mediaManagerUrl: string = environment.mediaManagerUrl;
    constructor(
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
    }

    editSequenceClick(sequenceId: number) {
        this.editSequenceEvent.emit(sequenceId);
    }

}
