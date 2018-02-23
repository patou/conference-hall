import { reaction } from 'k-ramel'
import { initializeCurrentLocation } from 'redux-little-router'

import { isRoute } from 'store/drivers/redux-little-router'

export const init = reaction((action, store) => {
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
  }
})

export const onRouteChanged = reaction((action, store, { router }) => {
  const state = store.getState()
  if (isRoute('HOME_EVENT')(state)) {
    // set route eventId as app event context
    const eventId = router.getRouteParam('eventId')
    if (eventId !== store.ui.app.get().currentEventId) {
      localStorage.setItem('currentEventId', eventId)
      store.ui.app.update({ currentEventId: eventId })
    }
  }
  if (isRoute('INVITE_SPEAKER')(state)) {
    const talkId = router.getRouteParam('talkId')
    const uid = router.getRouteParam('uid')
    store.dispatch({ type: '@@ui/ON_LOAD_TALK', payload: talkId })
    store.dispatch({ type: '@@ui/FETCH_USER', payload: uid })
  }
})
