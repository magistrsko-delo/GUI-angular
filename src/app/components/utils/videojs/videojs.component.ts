import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
// import videojs from 'video.js';
// import '@videojs/http-streaming';

import Hls from 'hls.js';

@Component({
    selector: 'app-videojs',
    templateUrl: './videojs.component.html',
    styleUrls: ['./videojs.component.scss']
})
export class VideojsComponent implements OnInit, OnDestroy {
    /*@ViewChild('target', {static: true}) target: ElementRef;
    hls: any;
    // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
    @Input() options: {
        fluid: boolean,
        autoplay: boolean,
        aspectRatio: string,
        sources: {
            src: string,
            type: string,
        }[],
    };
    player: videojs.Player;*/

    constructor(
        private elementRef: ElementRef,
        public renderer: Renderer2
    ) { }

    ngOnInit() {
       /* const video: any = document.getElementById('video');
        if ( Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.loadSource('http://192.168.1.5:8006/v1/vod/28/1080p.m3u8');
            this.hls.attachMedia(this.target);
            console.log('video: ', this.target.nativeElement);

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('parsed');
                if (this.target.nativeElement.mozSrcObject !== undefined) { // FF18a
                    console.log('inside');
                    this.target.nativeElement.mozSrcObject = this.hls;
                } else if (this.target.nativeElement.srcObject !== undefined) {
                    console.log('inside2: ', this.hls);
                    console.log('waw: ',  this.target.nativeElement.srcObject);
                    this.renderer.setAttribute(this.target.nativeElement, 'srcObject', this.hls);
                    // this.target.nativeElement.srcObject = this.hls;
                    console.log(this.target.nativeElement);
                } else { // FF16a, 17a
                    console.log('inside3');
                    this.target.nativeElement.src = this.hls;
                }
                console.log('inside2: ', this.hls);
                console.log('waw: ',  video);
                video.srcObject = this.hls;
                // this.renderer.setAttribute(this.target.nativeElement, 'src', this.hls.url);
                console.log('video123');
            });
        }*/

        // instantiate Video.js
        /*this.options = {
            fluid: true,
            autoplay: true,
            aspectRatio: '16:9',
            sources: [
                {
                    src: 'http://localhost:8006/v1/vod/28/master.m3u8',
                    type: 'application/x-mpegURL'
                }
            ]
        };
        this.player = videojs(this.target.nativeElement, {}, function onPlayerReady() {
            console.log('onPlayerReady', this);
        });*/
        // this.player.play();
        // console.log(this.player.tech().hls);
    }

    ngOnDestroy() {
        // destroy player
        /*if (this.player) {
            this.player.dispose();
        }*/
    }

}
