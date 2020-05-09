import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private snackBar: MatSnackBar) {
    }

    public addToast(title: string, msg: string, timeout: number = 5000) {
        this.snackBar.open(msg, title);
    }
}
