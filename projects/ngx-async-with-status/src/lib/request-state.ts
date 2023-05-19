import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, startWith, map, catchError, of } from 'rxjs';

export interface RequestState<T> {
  readonly isLoading: boolean;
  readonly value?: T;
  readonly error?: HttpErrorResponse | Error | unknown;
}

export interface LoadingState<T> extends RequestState<T> {
  readonly isLoading: true;
  readonly error: undefined;
}

export interface LoadedState<T> extends RequestState<T> {
  readonly isLoading: false;
  readonly error: undefined;
}

export interface ErrorState<T> extends RequestState<T> {
  readonly isLoading: false;
}

export const loadingState = <T>(value?: T): LoadingState<T> => ({
  isLoading: true,
  value,
  error: undefined,
});

export const loadedState = <T>(value?: T): LoadedState<T> => ({
  isLoading: false,
  error: undefined,
  value,
});

export const errorState = <T>(
  error: HttpErrorResponse | Error | unknown,
  value?: T
): ErrorState<T> => ({
  isLoading: false,
  error,
  value,
});
export function requestStates<T>(): (
  source: Observable<HttpResponse<T> | T>
) => Observable<RequestState<T>> {
  return (source: Observable<HttpResponse<T> | T>) =>
    source.pipe(
      map((result) =>
        loadedState<T>(
          result instanceof HttpResponse ? result.body ?? undefined : result
        )
      ),
      startWith(loadingState<T>()),
      catchError((err) => of(errorState<T>(err)))
    );
}
