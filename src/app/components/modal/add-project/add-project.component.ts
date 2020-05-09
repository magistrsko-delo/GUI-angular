import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';

@Component({
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProjectComponent extends ModalComponent implements OnInit {
    media: File;
    projectName: string;
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private projectService: ProjectService,
        private toastService: ToastService,
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
    }

    imageInputChnage($event: any) {
        this.media = $event.target.files[0];
    }

    onNoClick() {
        this.dialogRef.close();
    }

    add() {
        if (!this.media || !this.projectName) {
            console.error('pred dodajanjem projekta izberi sliko in ime');
            return;
        }
        this.projectService.createProject(this.media, this.projectName)
            .subscribe(
                (rsp: any) => {
                    this.dialogRef.close(true);
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                    this.dialogRef.close();
                }
            );
    }
}
