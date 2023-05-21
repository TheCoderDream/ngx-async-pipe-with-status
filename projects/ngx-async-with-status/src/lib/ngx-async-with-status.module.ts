import { NgModule } from '@angular/core';
import { AsyncWithStatusPipe } from "./async-with-status.pipe";
import {
  AsyncWithStatusDirective,
  ErrorDirective,
  IsLoadedDirective,
  IsLoadedWithDataDirective,
  IsLoadedWithoutDataDirective,
  IsLoadingDirective,
} from './async-with-status.directive';



@NgModule({
  declarations: [
    AsyncWithStatusPipe,
    AsyncWithStatusDirective,
    IsLoadingDirective,
    IsLoadedDirective,
    ErrorDirective,
    IsLoadedWithDataDirective,
    IsLoadedWithoutDataDirective,
  ],
  imports: [
  ],
  exports: [
    AsyncWithStatusPipe,
    AsyncWithStatusDirective,
    IsLoadingDirective,
    IsLoadedDirective,
    ErrorDirective,
    IsLoadedWithDataDirective,
    IsLoadedWithoutDataDirective,
  ]
})
export class NgxAsyncWithStatusModule { }
