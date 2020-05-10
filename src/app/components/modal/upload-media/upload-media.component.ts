import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MediaManagerService} from '../../../services/media-manager.service';
import {ToastService} from '../../../services/toast.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './upload-media.component.html',
    styleUrls: ['./upload-media.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadMediaComponent extends ModalComponent implements OnInit {
    siteName: string;
    mediaName: string;
    media: File;
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mediaManagerService: MediaManagerService,
        private toastService: ToastService
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
    }

    upload() {
        if (!this.media || this.siteName || this.mediaName) {
            console.error('nepravilni podatki za nalaganje');
            return;
        }
        this.mediaManagerService.uploadFile(this.media, this.mediaName, this.siteName)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.toastService.addToast('Uspeh', 'media naložena in poslana v obdelavo');
                    this.dialogRef.close(true);
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                }
            );
    }

    onNoClick() {
        this.dialogRef.close();
    }

    mp4InputChange(fileInputEvent: any) {
        this.media = fileInputEvent.target.files[0];
    }
}
