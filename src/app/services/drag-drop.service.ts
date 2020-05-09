import {ApplicationRef, ElementRef, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Injectable({
    providedIn: 'root'
})
export class DragDropService {

    public dragScope: string;
    dragList: ElementRef = null;

    currentIndex: any;
    currentField: any;

    private dragEnteredScope: string;
    /**
     * Drag scope communication
     */
    private dragScopeSubject: Subject<string> = new Subject<string>();
    constructor(private changeDetection: ApplicationRef) { }

    sendDragScope(dragScope: string) {
        this.dragScopeSubject.next(dragScope);
    }

    dragScopeSubscriber(): Observable<any> {
        return this.dragScopeSubject.asObservable();
    }

    /**
     * Drag
     */

    onDragStart(dragListRef: ElementRef, index: number, dragScope: string): void {
        this.currentIndex = index;
        if (dragListRef) {
            this.dragList = dragListRef;
            this.currentField = this.dragList.nativeElement.children[this.currentIndex];

            const newChild = this.currentField.cloneNode(true);
            newChild.style.display = 'block';
            newChild.id = 'temp_element'; // needed so that we can find this element later
            newChild.style.border = '2px dotted red';
            this.dragList.nativeElement.insertBefore(newChild, this.currentField);
        }

        this.dragScope = dragScope;
        this.sendDragScope(this.dragScope);
    }

    onDragEnded(): void {
        if (this.dragList) {
            try {
                for (const item of this.dragList.nativeElement.children) {
                    if (item.id === 'temp_element') {
                        this.dragList.nativeElement.removeChild(item);
                    }
                }
                this.dragList.nativeElement.children[this.currentIndex].style.border = '';
            } catch (e) {
                console.error('onDragEnded', e);
            }
        }
        this.dragScope = null;
        this.sendDragScope(this.dragScope);

        this.dragList = null;
    }

    /**
     * Drop
     */
    setEnteredScope(dragEnterScope: string): void {
        this.dragEnteredScope = dragEnterScope;
    }

    getDragEnteredScope(): string {
        return this.dragEnteredScope;
    }

    mediaDragScopePredicate(item: CdkDrag<string>): boolean {
        return item.data === 'media';
    }
}
