import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
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
    isMediaUploading: boolean;
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mediaManagerService: MediaManagerService,
        private toastService: ToastService,
        private changeDetector: ChangeDetectorRef,
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
        this.isMediaUploading = false;
    }

    upload() {
        if (!this.media || !this.siteName || !this.mediaName) {
            this.toastService.addToast('Napaka', 'Nepopolni podatki za nalaganje medije');
            this.changeDetector.markForCheck();
            return;
        }
        this.isMediaUploading = true;
        this.mediaManagerService.uploadFile(this.media, this.mediaName, this.siteName)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.toastService.addToast('Uspeh', 'media naložena in poslana v obdelavo');
                    this.isMediaUploading = false;
                    this.dialogRef.close(true);
                    this.changeDetector.markForCheck();
                },
                error => {
                    this.isMediaUploading = false;
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.changeDetector.markForCheck();
                }
            );
        this.changeDetector.markForCheck();
    }

    onNoClick() {
        this.dialogRef.close();
    }

    mp4InputChange(fileInputEvent: any) {
        this.media = fileInputEvent.target.files[0];
        this.changeDetector.markForCheck();
    }
}
