import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MainComponent} from '../main.component';

@Component({
    selector: 'app-project-media-editing',
    templateUrl: './project-media-editing.component.html',
    styleUrls: ['./project-media-editing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMediaEditingComponent extends MainComponent implements OnInit {

    constructor(
        private changeDetector: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit(): void {
    }

    tabEvent(tabIndex: number) {
        console.log(tabIndex);
    }
}
