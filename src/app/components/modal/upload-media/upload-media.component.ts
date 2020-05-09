import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MediaManagerService} from '../../../services/media-manager.service';

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
            .subscribe(
                (rsp: any) => {
                    this.dialogRef.close(true);
                },
                error => {
                    console.log(error);
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
