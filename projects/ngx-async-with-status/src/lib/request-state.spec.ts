import { delay, of, throwError } from 'rxjs';
import { RequestState, requestStates } from './request-state';
import { HttpErrorResponse } from '@angular/common/http';

describe('requestStates', () => {
  it('should emit LoadingState and LoadedState', (done) => {
    const source$ = of('test').pipe(delay(0));
    const result$ = source$.pipe(requestStates());

    const expectedStates: RequestState<string>[] = [
      { isLoading: true, value: undefined, error: undefined },
      { isLoading: false, value: 'test', error: undefined },
    ];
    const emittedStates: RequestState<string>[] = [];
    result$.subscribe({
      next: (state) => emittedStates.push(state),
      complete: () => {
        expect(emittedStates).toEqual(expectedStates);
        done();
      },
    });
  });

  it('should emit LoadingState and ErrorState', (done) => {
    const error = new HttpErrorResponse({ status: 400, error: 'test' });
    const source$ = throwError(() => {
      return error;
    }).pipe(delay(0));
    const result$ = source$.pipe(requestStates());

    const expectedStates: RequestState<string>[] = [
      { isLoading: true, value: undefined, error: undefined },
      { isLoading: false, value: undefined, error: error },
    ];
    const emittedStates: RequestState<string>[] = [];
    result$.subscribe({
      next: (state) => emittedStates.push(state),
      complete: () => {
        expect(emittedStates).toEqual(expectedStates);
        done();
      },
    });
  });
});
