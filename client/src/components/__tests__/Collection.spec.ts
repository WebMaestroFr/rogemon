import { describe, it, expect, vi, type Mock } from 'vitest'

import { mount } from '@vue/test-utils'
import Collection from '../Collection.vue'

// Mock fetch for static files
global.fetch = vi.fn((staticPath: string) => {
  const staticContent = require(`../../../public/${staticPath}`)
  return Promise.resolve({
    json: () => Promise.resolve(staticContent),
  })
}) as Mock

describe('Collection', () => {
  it('renders properly', () => {
    const wrapper = mount(Collection, {
      props: {
        expansionId: 'A1',
        name: 'Genetic Apex',
      },
    })
    expect(wrapper.text()).toContain('Genetic Apex')
  })
})
