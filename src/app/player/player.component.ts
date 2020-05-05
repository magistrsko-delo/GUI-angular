import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter,
    Input, OnChanges,
    OnInit, Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {BitrateOption, VgAPI, VgHLS} from '@hitrecord/videogular2';
import {IMediaStream} from '../models/IMediaStream';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnChanges {

    @ViewChild(VgHLS) vgHls: VgHLS;
    @Input() currentStream: IMediaStream;
    @Input() currentMediaTime: number;
    @Output() currentMediaTimeChange = new EventEmitter<number>();

    api: VgAPI;
    bitrates: BitrateOption[];

    constructor(
        private elementRef: ElementRef,
        private changeDetector: ChangeDetectorRef,
    ) { }
    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.api && changes.currentStream) {
            this.api.pause();
            this.bitrates = null;
            this.currentStream = changes.currentStream.currentValue;
            this.api.getDefaultMedia().currentTime = 0;
            this.changeDetector.markForCheck();
        }
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
    }

    setBitrate(option: BitrateOption) {
        this.vgHls.setBitrate(option);
    }

    initBitRates($event: BitrateOption[]) {
        this.bitrates = $event;
        this.changeDetector.markForCheck();
    }

    onTimeUpdate($event: any) {
        if ($event.target.currentTime) {
            this.currentMediaTimeChange.emit($event.target.currentTime);
        }
    }

}
