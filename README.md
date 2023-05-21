# ngx-async-with-status

The `ngx-async-with-status` library provides two powerful tools for handling and displaying the status of asynchronous data in Angular applications:
the `asyncWithStatus` directive and the `AsyncWithStatusPipe`.
These tools enable you to provide visual feedback to users during data loading and error states, and simplify error handling and state management in your templates.

## Features
* Works seamlessly within Angular applications.
* Improves the user experience by providing visual feedback during data loading and error states.
* Provides explicit status handling for asynchronous data.
* Allows displaying loading, error, no data, and loaded states in the template.
* Supports better control over change detection.
* Fully tested.
* Handles multiple subscriptions to different observables.
* Properly unsubscribes from the observable to avoid memory leaks.
* Simplifies error handling by displaying relevant error messages to the user.
* Ensures up-to-date rendering of the template with the latest data changes.

## Dependencies
supports Angular version 12.x and above.

| ngx-async-with-status | Angular |
|-----------------------|---------|
| 1.0.3                 | => 12.x |

## Installation

```bash
npm install ngx-async-with-status --save
````

````ts
import { NgxAsyncWithStatusModule } from 'ngx-async-with-status';

@NgModule({
  declarations: [
    // Your components and directives
  ],
  imports: [
    // Other module imports
    NgxAsyncWithStatusModule
  ],
  // Other module configurations
})
export class YourModule { }
````

## asyncWithStatus Directive
The `asyncWithStatus` directive is an Angular directive that tracks the state of an observable value and renders different structural directives based on its state.
It provides a convenient way to handle asynchronous operations and display loading indicators, success messages, error messages, and other relevant UI components.

## Usage
To use the asyncWithStatus directive, add it as an attribute directive on an HTML element and bind an observable value to it.
Then, use the structural directives provided by the asyncWithStatus directive to conditionally render content based on the state of the observable.

````ts
@Component({
  selector: 'some-component',
  templateUrl: './some-component.component.html',
})
class SomeComponent {
  public data$ = of({ title: 'test' }).pipe(delay(1000));
  public emptyData$ = of([]).pipe(delay(1000));
}
````

````html
<div [asyncWithStatus]="data$">
    <div *isLoading>
        loading.........
    </div>
    <div *isLoaded="let value">
        {{value?.title}}
    </div>
    <div *error="let error">
        {{error.message}}
    </div>
</div>

<div [asyncWithStatus]="emptyData$">
    <div *isLoading>
        loading.........
    </div>
    <div *isLoadedWithData="let value">
        Loaded
    </div>
    <div *isLoadedWithoutData>
        No Data Available
    </div>
    <div *error="let error">
        {{error.message}}
    </div>
</div>
````

## API

### Inputs
* asyncWithStatus: Binds an observable value to the directive for tracking its state.

## Structural Directives
The following structural directives are used within the asyncWithStatus directive to conditionally render content based on the state of the observable.

* **isLoading**: Renders the content when the observable is loading. Use this directive to display loading indicators or messages.

* **isLoaded**: Renders the content when the observable is successfully loaded. Use this directive to display the main content that should be shown when the data is available.

* **error**: Renders the content when an error occurs while loading the observable. Use this directive to display error messages or error handling UI.

* **isLoadedWithData**: Renders the content when the observable is loaded with data. Use this directive to display content that requires access to the loaded data. You can access the data using the let-data directive syntax.

* **isLoadedWithoutData**: Renders the content when the observable is loaded without data. Use this

## AsyncWithStatusPipe
The `AsyncWithStatusPipe` is an Angular pipe that provides additional functionality over the built-in async pipe.
It allows you to handle and display the status of asynchronous data loading, such as loading state, error state, and loaded state, all within the template.

## Usage

Use the asyncWithStatus pipe in your template to handle and display the status of asynchronous data:
The `AsyncWithStatusPipe` is an Angular pipe that provides additional functionality over the built-in `async` pipe.
It allows you to handle and display the status of asynchronous data loading, such as loading state, error state, and loaded state, all within the template.
````ts
@Component({
  selector: 'some-component',
  templateUrl: './some-component.component.html',
})
class SomeComponent {
  public data$ = of({ title: 'test' }).pipe(delay(1000));
  public emptyData$ = of([]).pipe(delay(1000));
}
````
````html
<div *ngIf="data$ | asyncWithStatus as data">
  <div *ngIf="data.isLoading" class="loading">Loading...</div>
  <div *ngIf="data.error" class="error">Error: {{ data.error?.message }}</div>
  <div *ngIf="data.loaded" class="loaded">
    {{ data.value?.title }}
  </div>
</div>
````

```html
<div *ngIf="emptyData$ | asyncWithStatus as data">
    <div *ngIf="data.isLoading" class="loading">Loading...</div>
    <div *ngIf="data.error" class="error">Error: {{ data.error?.message }}</div>
    <div *ngIf="data.isLoadedWithData" class="loaded">
        <ul>
            <li *ngFor="let val of data.value">
                {{val}}
            </li>
        </ul>
    </div>
    <div *ngIf="data.isLoadedWithoutData" class="loaded">
        No Data
    </div>
</div>
```
The asyncWithStatus pipe takes an observable as input and returns a RequestState object, which contains the current state of the asynchronous data.
You can then use the properties of the RequestState object (isLoading, error, noData, isLoaded, value) to handle and display the appropriate content in your template.

## State Definitions
* **error**: when observable throws error. It could be due to various reasons such as network issues, server errors, or invalid data. In this state, the application typically displays an error message or a fallback UI to notify the user about the problem.
* **isLoading**: This state indicates that the application is currently fetching or loading data from a server or performing some asynchronous operation.
* **isLoaded**: Data has been successfully loaded and ready for display.
* **isLoadedWithData**: Indicates that the data has been successfully loaded with non-empty data.
* **isLoadedWithoutData**: Indicates that the data has been successfully loaded with empty data.
* **noData**:  null, undefined, empty array, object and string represent the absence of data.

## Advantages over built-in Angular async pipe
### The AsyncWithStatusPipe provides the following advantages over the Angular async pipe:

* **Explicit status handling**: With the AsyncWithStatusPipe, you have explicit access to the loading, error, and loaded states of the asynchronous data. This allows you to handle each state individually and provide appropriate UI feedback to the user.

* **Easier error handling**: The AsyncWithStatusPipe automatically catches errors thrown by the observable and includes the error details in the RequestState object. This simplifies error handling and allows you to display relevant error messages to the user.

* **Better control over change** detection: Change detection is only triggered whenever the asynchronous data state changes. This ensures that your template is always up to date with the latest data.

## See more examples in stackblitz

https://stackblitz.com/edit/ngx-async-with-status?file=src%2Fmain.ts
