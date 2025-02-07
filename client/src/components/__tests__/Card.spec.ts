import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Card from '../Card.vue'

describe('Card', () => {
  it('renders properly', () => {
    const wrapper = mount(Card, {
      props: {
        card: {
          id: '1',
          name: 'Bulbasaur',
          hp: '70',
          card_type: 'Pokémon - Basic',
          evolution_type: 'Basic',
          image: 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket/A1/A1_001_EN.webp',
          attacks: [
            {
              cost: ['Grass', 'Colorless'],
              name: 'Vine Whip',
              damage: '40',
              effect: '',
            },
          ],
          ability: {
            name: 'No ability',
            effect: 'N/A',
          },
          weakness: 'Fire',
          retreat: '1',
          rarity: '◊',
          fullart: 'No',
          ex: 'No',
          set_details: 'Genetic Apex  (A1)',
          pack: 'Mewtwo pack',
          alternate_versions: [
            {
              version: 'Genetic Apex #1',
              rarity: '◊',
            },
            {
              version: 'Genetic Apex #227',
              rarity: '☆',
            },
          ],
          artist: 'Narumi Sato',
          probability: {
            '1-3 card': '100.000%',
            '4 card': '0.000%',
            '5 card': '0.000%',
          },
          crafting_cost: 35,
        },
      },
    })
    expect(wrapper.text()).toContain('001')
  })
})
