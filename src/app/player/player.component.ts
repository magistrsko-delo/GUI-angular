import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BitrateOption, VgAPI, VgHLS} from '@hitrecord/videogular2';

export interface IMediaStream {
    type: 'hls';
    source: string;
    label: string;
    poster: string;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

    @ViewChild(VgHLS) vgHls: VgHLS;

    api: VgAPI;
    bitrates: BitrateOption[];
    currentStream: IMediaStream;
    constructor(
        private elementRef: ElementRef,
        public renderer: Renderer2
    ) { }

    // 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    ngOnInit() {
        this.currentStream = {
            type: 'hls',
            label: 'HLS streaming',
            source: 'http://localhost:8006/v1/vod/27/master.m3u8',
            poster: 'https://i.imgur.com/fHyEMsl.jpg',
        };
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
        console.log(this.api);
    }

    setBitrate(option: BitrateOption) {
        console.log(option);
        this.vgHls.setBitrate(option);
    }

    onClickStream(/*stream: IMediaStream*/) {
        console.log(this.api);
        this.api.pause();
        this.bitrates = null;
        this.currentStream = {
            type: 'hls',
            label: 'HLS streaming',
            source: 'http://localhost:8006/v1/vod/26/master.m3u8',
            poster: 'https://i.imgur.com/3tU4Vig.jpg'
        };
    }

    initBitRates($event: BitrateOption[]) {
        console.log($event);
        this.bitrates = $event;
    }

    onTimeUpdate($event: any) {
        console.log($event.target.currentTime);
    }

}
