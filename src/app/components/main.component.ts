import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class MainComponent implements OnDestroy {

    protected ngUnsubscribe: Subject<any> = new Subject<void>();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
