import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { interval, mapTo, of } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import {
  errorState,
  loadedState,
  loadingState,
} from './request-state';
import { AsyncWithStatusPipe } from './async-with-status.pipe';

@Component({
  selector: 'saas-test-async-with-status',
  templateUrl: './async-with-status.pipe.spec.html',
})
class TestAsyncWithStatusComponent {
  public data$ = of({ title: 'test' }).pipe(delay(1000));
  public dataWithError$ = of(undefined).pipe(
    delay(1000),
    map(() => {
      throw new Error('test error');
    })
  );
  public stream$ = interval(1000).pipe(take(3));
}

describe('AsyncWithStatusPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
        AsyncWithStatusPipe,
      ],
    });
  });

  it('should initially return loading, then loaded state when observable completes with a value', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<string>) => {
        const expectedValue = 'test';
        pipe.transform(of(expectedValue).pipe(delay(1000)));
        expect(pipe['_latestState']).toEqual(loadingState());
        tick(1000);
        expect(pipe['_latestState']).toEqual(loadedState(expectedValue));
      }
    )
  ));

  it('should return error state when observable throws an error', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<unknown>) => {
        const expectedError = new Error('test error');
        const source = of(undefined).pipe(
          delay(1000),
          map(() => {
            throw expectedError;
          })
        );
        pipe.transform(source);

        expect(pipe['_latestState']).toEqual(loadingState());
        tick(1000);
        expect(pipe['_latestState']).toEqual(errorState(expectedError));
      }
    )
  ));

  it('should mark for check when state changes', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<number>, cdr: ChangeDetectorRef) => {
        const source = interval(1000).pipe(take(2));
        spyOn(cdr, 'markForCheck');
        pipe.transform(source);

        expect(cdr.markForCheck).toHaveBeenCalledTimes(0);
        tick(1000);
        expect(cdr.markForCheck).toHaveBeenCalledTimes(1);
        tick(1000);
        expect(cdr.markForCheck).toHaveBeenCalledTimes(2);
      }
    )
  ));

  it('should not mark for check when value stays the same', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<unknown>, cdr: ChangeDetectorRef) => {
        const expectedValue = { test: 'test' };
        const source = interval(1000).pipe(mapTo(expectedValue), take(3));
        spyOn(cdr, 'markForCheck');
        pipe.transform(source);

        tick(3000);
        expect(cdr.markForCheck).toHaveBeenCalledTimes(1);
      }
    )
  ));

  it('should dispose of the existing subscription when subscribing to a new observable', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<unknown>, cdr: ChangeDetectorRef) => {
        const expectedValue = { test: 'test' };
        const source = of(expectedValue).pipe(delay(1000));
        pipe.transform(source);
        expect(pipe['_source']).toEqual(source);
        spyOn<any>(pipe, 'unsubscribe');
        expect(pipe['_latestState']).toEqual(loadingState());
        tick(1000);
        expect(pipe['_latestState']).toEqual(loadedState(expectedValue));
        const newSource = of({ test: 'test2' });
        pipe.transform(newSource);
        expect(pipe['unsubscribe']).toHaveBeenCalled();
        expect(pipe['_source']).toEqual(newSource);
      }
    )
  ));

  it('should dispose of the existing subscription after getting destroyed', fakeAsync(
    inject(
      [AsyncWithStatusPipe, ChangeDetectorRef],
      (pipe: AsyncWithStatusPipe<unknown>, cdr: ChangeDetectorRef) => {
        const expectedValue = { test: 'test' };
        const source = of(expectedValue).pipe(delay(1000));
        pipe.transform(source);
        tick(1000);
        spyOn<any>(pipe, 'unsubscribe');
        pipe.ngOnDestroy();
        expect(pipe['unsubscribe']).toHaveBeenCalled();
        expect(pipe['_cdr']).toBeUndefined();
      }
    )
  ));
});

describe('AsyncWithStatusPipe in component', () => {
  let fixture: ComponentFixture<TestAsyncWithStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsyncWithStatusPipe, TestAsyncWithStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAsyncWithStatusComponent);
  });

  it('should initially render loading, then loaded state or error based on observable status', fakeAsync(() => {
    fixture.detectChanges();
    const withoutError = fixture.debugElement.query(By.css('.without-error'));
    const withError = fixture.debugElement.query(By.css('.with-error'));
    const stream = fixture.debugElement.query(By.css('.stream'));
    expect(withoutError).toBeDefined();
    expect(withError).toBeDefined();
    expect(stream).toBeDefined();

    expect(withoutError.nativeElement.textContent).toContain('Loading...');
    expect(withError.nativeElement.textContent).toContain('Loading...');
    expect(stream.nativeElement.textContent).toContain('Loading...');
    tick(1000);
    fixture.detectChanges();
    expect(withoutError.nativeElement.textContent).toContain('test');
    expect(stream.nativeElement.textContent).toContain('0');
    expect(withError.nativeElement.textContent).toContain('Error: test error');
    tick(1000);
    fixture.detectChanges();
    expect(stream.nativeElement.textContent).toContain('1');
    tick(1000);
    fixture.detectChanges();
    expect(stream.nativeElement.textContent).toContain('2');
  }));
});
