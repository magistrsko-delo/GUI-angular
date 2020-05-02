import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MainComponent} from '../main.component';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page404Component extends MainComponent implements OnInit {

    constructor(
        private changeDetector: ChangeDetectorRef,
    ) {
        super();
    }
    ngOnInit(): void {
    }

}
