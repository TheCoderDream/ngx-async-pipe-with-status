# ngx-async-with-status

The `AsyncWithStatusPipe` is an Angular pipe that provides additional functionality over the built-in `async` pipe. It allows you to handle and display the status of asynchronous data loading, such as loading state, error state, and loaded state, all within the template.

## Features
* Provides explicit status handling for asynchronous data.
* Allows displaying loading, error, and loaded states in the template.
* Supports better control over change detection.
* Full tested.
* Handles multiple subscriptions to different observables.
* Properly unsubscribes from the observable to avoid memory leaks.
* Works seamlessly within Angular applications.
* Improves the user experience by providing visual feedback during data loading and error states.
* Simplifies error handling by displaying relevant error messages to the user.
* Ensures up-to-date rendering of the template with the latest data changes.

## Dependencies
supports Angular version 12.x and above.

| ngx-async-with-status | Angular |
|-----------------------|---------|
| 1.0.0                 | => 12.x |

## Setup

1. Install the `AsyncWithStatusPipe` library:
   ```bash
   npm install ngx-async-with-status --save


## Usage

**Step 1:** Import the module

```ts
import { NgxAsyncWithStatusModule } from 'ngx-async-with-status';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxAsyncWithStatusModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**Step 2:** Use the asyncWithStatus pipe in your template to handle and display the status of asynchronous data:
````ts
@Component({
  selector: 'some-component',
  templateUrl: './some-component.component.html',
})
class SomeComponent {
  public data$ = of({ title: 'test' }).pipe(delay(1000));
}
````
````html
<div *ngIf="data$ | asyncWithStatus as data">
  <div *ngIf="data.isLoading" class="loading">Loading...</div>
  <div *ngIf="data.error" class="error">Error: {{ data.error?.message }}</div>
  <div *ngIf="!data.isLoading && !data.error" class="loaded">
    {{ data.value?.title }}
  </div>
</div>
````
The asyncWithStatus pipe takes an observable as input and returns a RequestState object, which contains the current state of the asynchronous data.
You can then use the properties of the RequestState object (isLoading, error, value) to handle and display the appropriate content in your template.

## Advantages over built-in Angular async pipe
### The AsyncWithStatusPipe provides the following advantages over the Angular async pipe:

* **Explicit status handling**: With the AsyncWithStatusPipe, you have explicit access to the loading, error, and loaded states of the asynchronous data. This allows you to handle each state individually and provide appropriate UI feedback to the user.

* **Easier error handling**: The AsyncWithStatusPipe automatically catches errors thrown by the observable and includes the error details in the RequestState object. This simplifies error handling and allows you to display relevant error messages to the user.

* **Better control over change** detection: By setting the pure option to false for the AsyncWithStatusPipe, change detection is automatically triggered whenever the asynchronous data state changes. This ensures that your template is always up to date with the latest data.
