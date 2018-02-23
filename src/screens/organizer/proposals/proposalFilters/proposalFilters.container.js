import { inject } from '@k-ramel/react'

import ProposalFilters from './proposalFilters'

const mapStore = (store, props, { router }) => {
  const eventId = router.getRouteParam('eventId')
  const filters = store.ui.organizer.proposals.get()
  const { formats, categories } = store.data.events.get(eventId) || {}
  return {
    formats,
    categories,
    filters,
    onChange: ({ target }) => {
      store.ui.organizer.proposals.update({ [target.id]: target.value })
    },
  }
}

export default inject(mapStore)(ProposalFilters)
