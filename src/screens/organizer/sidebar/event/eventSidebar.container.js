import { inject } from '@k-ramel/react'

import EventSidebar from './eventSidebar'

const mapStore = (store, props, { router }) => {
  const eventId = router.getRouteParam('eventId')
  const event = store.data.events.get(eventId)
  return { ...event }
}

export default inject(mapStore)(EventSidebar)
