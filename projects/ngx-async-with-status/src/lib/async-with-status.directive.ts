import {
  ChangeDetectorRef,
  Directive, Host,
  Input,
  OnChanges, OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { requestStates } from "./request-state";
import { forEachObject, omit } from "./utils";

class StateView<T, K = { $implicit: T}> {
  private _created = false;

  constructor(
    private _viewContainerRef: ViewContainerRef, private _templateRef: TemplateRef<K>) {}

  create(context?: K): void {
    this._created = true;
    this._viewContainerRef.createEmbeddedView(this._templateRef, context);
  }

  destroy(): void {
    this._created = false;
    this._viewContainerRef.clear();
  }

  enforceState(created: boolean) {
    if (created && !this._created) {
      this.create();
    } else if (!created && this._created) {
      this.destroy();
    }
  }
}

interface Views<T> {
  isLoaded?: StateView<T | undefined>;
  isLoadedWithData?: StateView<T>;
  isLoadedWithoutData?: StateView<boolean>;
  isLoading?: StateView<boolean>;
  error?: StateView<Error | unknown>;
}

@Directive({
  selector: '[asyncWithStatus]'
})
export class AsyncWithStatusDirective<T = unknown> implements OnChanges, OnDestroy {
  private _source$?: Observable<T>;
  private _subscription?: Subscription;
  private _views: Views<T> = {};

  @Input() set asyncWithStatus(source$: Observable<T>) {
    this._source$ = source$;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['asyncWithStatus']) {
      this._subscription = this._source$?.pipe(requestStates())
        .subscribe((states) => {
          if (states.isLoading) {
            this.createView(states.isLoading, 'isLoading', 'isLoading');
          }

          if (states.isLoaded) {
            this.createView(states.value, 'isLoaded', 'isLoaded');
            if (states.noData) {
              this._views?.isLoadedWithoutData?.create({ $implicit: states.noData });
            } else {
              this._views?.isLoadedWithData?.create({ $implicit: states.value! });
            }
          }

          if (states.error) {
            this.createView(states.error, 'error', 'error');
          }
        });
    }
  }

  createView(value: any, viewKey: keyof Views<T>, ...omittedViewKeys: (keyof Views<any>)[]): void {
    forEachObject(omit(this._views, ...omittedViewKeys), ((stateView: StateView<any>) => {
      stateView.destroy();
    }))
    this._views[viewKey]?.create({ $implicit: value });
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe();
    this._source$ = undefined;
    this._views = {};
  }

  addView(view: StateView<any>, key: keyof Views<T>) {
    this._views[key] = view;
  }

}


@Directive({
  selector: '[isLoaded]'
})
export class IsLoadedDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() private asyncWithStatusDirective: AsyncWithStatusDirective
  ) {
    asyncWithStatusDirective.addView(new StateView<unknown>(viewContainer, templateRef), 'isLoaded');
  }
}

@Directive({
  selector: '[isLoadedWithData]'
})
export class IsLoadedWithDataDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() private asyncWithStatusDirective: AsyncWithStatusDirective
  ) {
    asyncWithStatusDirective.addView(new StateView<unknown>(viewContainer, templateRef), 'isLoadedWithData');
  }
}

@Directive({
  selector: '[isLoadedWithoutData]'
})
export class IsLoadedWithoutDataDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() private asyncWithStatusDirective: AsyncWithStatusDirective
  ) {
    asyncWithStatusDirective.addView(new StateView<unknown>(viewContainer, templateRef), 'isLoadedWithoutData');
  }
}

@Directive({
  selector: '[isLoading]'
})
export class IsLoadingDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() private asyncWithStatusDirective: AsyncWithStatusDirective
  ) {
    asyncWithStatusDirective.addView(new StateView<boolean>(viewContainer, templateRef), 'isLoading');
  }
}

@Directive({
  selector: '[error]'
})
export class ErrorDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() private asyncWithStatusDirective: AsyncWithStatusDirective
  ) {
    asyncWithStatusDirective.addView(new StateView<Error | unknown>(viewContainer, templateRef), 'error');
  }
}

