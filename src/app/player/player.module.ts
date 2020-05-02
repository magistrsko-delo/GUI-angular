import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import {VgBufferingModule, VgControlsModule, VgCoreModule, VgOverlayPlayModule, VgStreamingModule} from '@hitrecord/videogular2';


@NgModule({
    declarations: [PlayerComponent],
    imports: [
        CommonModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule
    ],
    exports: [
        PlayerComponent
    ]
})
export class PlayerModule { }
