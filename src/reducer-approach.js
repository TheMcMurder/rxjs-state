import { ReplaySubject, BehaviorSubject, Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'

export function createRxjsStateWithReducer(config) {
  const { replay = true, initialValue, reducerFn } = config
  const base$ = new Subject()
  const std$ = base$
    .asObservable()
    .pipe(
      startWith(initialValue),
      scan(reducerFn),
      replay ? shareReplay(1) : undefined,
    )

  const fireEvent = (evt) => base$.next(evt)

  return [std$, fireEvent]
}
