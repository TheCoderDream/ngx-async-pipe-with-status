import {
  ChangeDetectorRef,
  inject,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  errorState,
  loadedState,
  loadingState,
  RequestState,
} from './request-state';
import { HttpResponse } from '@angular/common/http';

@Pipe({
  name: 'asyncWithStatus',
  pure: false, // required to automatically trigger change detection on updates
})
export class AsyncWithStatusPipe<T> implements PipeTransform, OnDestroy {
  private _latestState?: RequestState<T> = loadingState<T>();
  private _subscription?: Subscription;
  private _source?: Observable<HttpResponse<T> | T>;

  constructor(private _cdr?: ChangeDetectorRef) {
  }

  public ngOnDestroy() {
    this.unsubscribe();
    // Clear the `ChangeDetectorRef` and its association with the view data to avoid potential memory leaks
    this._cdr = undefined;
  }

  public transform(source: Observable<HttpResponse<T> | T>): RequestState<T> {
    if (source !== this._source) {
      // Unsubscribe from old observable if the reference has changed
      this.unsubscribe();

      // Subscribe to new observable and store a reference to it
      this._source = source;
      this._subscription = this._source
        .pipe(
          distinctUntilChanged(), // compare state objects by value to avoid unnecessary change detection
          map((result) =>
            loadedState<T>(
              result instanceof HttpResponse ? result.body ?? undefined : result
            )
          ),
          catchError((err) => of(errorState<T>(err)))
        )
        .subscribe((state: RequestState<T>) => {
          this._latestState = state;
          this._cdr?.markForCheck(); // mark the component to be checked for changes
        });
    }

    return this._latestState ?? loadingState<T>();
  }

  private unsubscribe() {
    // Unsubscribe from current observable (if any) to avoid potential memory leaks
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
      this._source = undefined;
      this._latestState = undefined;
    }
  }
}
