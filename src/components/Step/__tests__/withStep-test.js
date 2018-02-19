import React from 'react'
import { mount } from 'enzyme'
import withStepState from '../withStepState'

const Base = () => null

const wrap = (enhance, props = {}) => {
  const Comp = enhance(Base)
  return mount(<Comp {...props} />)
}

const getState = (wrapper, prop = 'step') =>
  wrapper
    .update()
    .find(Base)
    .prop(prop)

const initialState = {
  loop: false,
  ids: [],
  current: -1,
  ordered: {},
}

const ensureState = (wrapper, prop) => {
  const state = getState(wrapper, prop)
  expect(state).toHaveProperty('loop', expect.any(Boolean))
  expect(state).toHaveProperty('ids', expect.any(Array))
  expect(state).toHaveProperty('current', expect.any(Number))
  expect(state).toHaveProperty('getCurrentId', expect.any(Function))
  expect(state).toHaveProperty('hasPrevious', expect.any(Function))
  expect(state).toHaveProperty('hasNext', expect.any(Function))
  expect(state).toHaveProperty('indexOf', expect.any(Function))
  expect(state).toHaveProperty('isCurrent', expect.any(Function))
  expect(state).toHaveProperty('show', expect.any(Function))
  expect(state).toHaveProperty('hide', expect.any(Function))
  expect(state).toHaveProperty('toggle', expect.any(Function))
  expect(state).toHaveProperty('previous', expect.any(Function))
  expect(state).toHaveProperty('next', expect.any(Function))
  expect(state).toHaveProperty('reorder', expect.any(Function))
  expect(state).toHaveProperty('register', expect.any(Function))
  expect(state).toHaveProperty('unregister', expect.any(Function))
  expect(state).toHaveProperty('update', expect.any(Function))
}

const createTests = enhance => {
  test('state', () => {
    ensureState(wrap(enhance))
  })

  test('state with name argument', () => {
    ensureState(wrap(enhance('a')), 'a')
  })

  test('state with name option', () => {
    ensureState(wrap(enhance({ name: 'a' })), 'a')
  })

  test('loop', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).loop).toBe(initialState.loop)
  })

  test('loop option true', () => {
    const wrapper = wrap(enhance({ loop: true }))
    expect(getState(wrapper).loop).toBe(true)
  })

  test('loop option false', () => {
    const wrapper = wrap(enhance({ loop: false }))
    expect(getState(wrapper).loop).toBe(false)
  })

  test('ids', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).ids).toEqual(initialState.ids)
  })

  test('ids option', () => {
    const wrapper = wrap(enhance({ ids: ['a'] }))
    expect(getState(wrapper).ids).toEqual(['a'])
  })

  test('current', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).current).toBe(initialState.current)
  })

  test('current option', () => {
    const wrapper = wrap(enhance({ current: 1 }))
    expect(getState(wrapper).current).toBe(1)
  })

  test('getCurrentId', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).getCurrentId()).toBeUndefined()
  })

  test('getCurrentId different state', () => {
    const state = { ids: ['a', 'b'], current: 1 }
    const wrapper = wrap(enhance(state))
    expect(getState(wrapper).getCurrentId()).toBe('b')
  })

  test('hasPrevious', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).hasPrevious()).toBe(false)
  })

  test('hasPrevious with ids without current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    expect(getState(wrapper).hasPrevious()).toBe(false)
  })

  test('hasPrevious with ids with current 0', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 0 }))
    expect(getState(wrapper).hasPrevious()).toBe(false)
  })

  test('hasPrevious with ids with current 1', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 1 }))
    expect(getState(wrapper).hasPrevious()).toBe(true)
  })

  test('hasNext', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).hasNext()).toBe(false)
  })

  test('hasNext with ids without current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    expect(getState(wrapper).hasNext()).toBe(true)
  })

  test('hasNext with ids with current 0', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 0 }))
    expect(getState(wrapper).hasNext()).toBe(true)
  })

  test('hasNext with ids with current 1', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 1 }))
    expect(getState(wrapper).hasNext()).toBe(false)
  })

  test('indexOf', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).indexOf(0)).toBe(0)
    expect(getState(wrapper).indexOf('a')).toBe(-1)
  })

  test('indexOf with ids', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    expect(getState(wrapper).indexOf('b')).toBe(1)
    expect(getState(wrapper).indexOf('c')).toBe(-1)
  })

  test('isCurrent', () => {
    const wrapper = wrap(enhance)
    expect(getState(wrapper).isCurrent(-1)).toBe(false)
    expect(getState(wrapper).isCurrent(0)).toBe(false)
    expect(getState(wrapper).isCurrent('a')).toBe(false)
  })

  test('isCurrent with ids and current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 1 }))
    expect(getState(wrapper).isCurrent(-1)).toBe(false)
    expect(getState(wrapper).isCurrent(0)).toBe(false)
    expect(getState(wrapper).isCurrent(1)).toBe(true)
    expect(getState(wrapper).isCurrent('a')).toBe(false)
    expect(getState(wrapper).isCurrent('b')).toBe(true)
  })

  test('show', () => {
    const wrapper = wrap(enhance)
    getState(wrapper).show(0)
    expect(getState(wrapper).current).toBe(0)
    getState(wrapper).show(1)
    expect(getState(wrapper).current).toBe(1)
  })

  test('show id', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    getState(wrapper).show('b')
    expect(getState(wrapper).current).toBe(1)
    getState(wrapper).show('a')
    expect(getState(wrapper).current).toBe(0)
  })

  test('hide', () => {
    const wrapper = wrap(enhance({ current: 1 }))
    getState(wrapper).hide()
    expect(getState(wrapper).current).toBe(-1)
  })

  test('toggle', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    getState(wrapper).toggle(0)
    expect(getState(wrapper).current).toBe(0)
    getState(wrapper).toggle(0)
    expect(getState(wrapper).current).toBe(-1)
    getState(wrapper).toggle('b')
    expect(getState(wrapper).current).toBe(1)
    getState(wrapper).toggle('b')
    expect(getState(wrapper).current).toBe(-1)
  })

  test('previous', () => {
    const wrapper = wrap(enhance)
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(-1)
  })

  test('previous with ids without current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(-1)
  })

  test('previous with ids with current 0', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 0 }))
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(0)
  })

  test('previous with ids with current 1', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 1 }))
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(0)
  })

  test('previous loop', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], loop: true }))
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(1)
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(0)
    getState(wrapper).previous()
    expect(getState(wrapper).current).toBe(1)
  })

  test('next', () => {
    const wrapper = wrap(enhance)
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(-1)
  })

  test('next with ids without current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(0)
  })

  test('next with ids with current 0', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 0 }))
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(1)
  })

  test('next with ids with current 1', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], current: 1 }))
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(1)
  })

  test('next loop', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'], loop: true }))
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(0)
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(1)
    getState(wrapper).next()
    expect(getState(wrapper).current).toBe(0)
  })

  test('reorder', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'] }))
    getState(wrapper).reorder('a', 1)
    expect(getState(wrapper).ids).toEqual(['b', 'c', 'a'])
    getState(wrapper).reorder('c', -1)
    expect(getState(wrapper).ids).toEqual(['c', 'b', 'a'])
    getState(wrapper).reorder('a', 0)
    expect(getState(wrapper).ids).toEqual(['c', 'b', 'a'])
  })

  test('reorder current', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'], current: 0 }))
    getState(wrapper).reorder('a', 1)
    expect(getState(wrapper).ids).toEqual(['b', 'c', 'a'])
    expect(getState(wrapper).current).toBe(2)
  })

  test('register', () => {
    const wrapper = wrap(enhance)
    getState(wrapper).register('a')
    expect(getState(wrapper).ids).toEqual(['a'])
    getState(wrapper).register('b')
    expect(getState(wrapper).ids).toEqual(['a', 'b'])
    getState(wrapper).register('b')
    expect(getState(wrapper).ids).toEqual(['a', 'b'])
    getState(wrapper).register('b', -1)
    expect(getState(wrapper).ids).toEqual(['b', 'a'])
    getState(wrapper).register('c', -2)
    expect(getState(wrapper).ids).toEqual(['c', 'b', 'a'])
  })

  test('unregister', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b'] }))
    getState(wrapper).unregister('a')
    expect(getState(wrapper).ids).toEqual(['b'])
  })

  test('unregister inexistent', () => {
    const wrapper = wrap(enhance)
    getState(wrapper).unregister('a')
    expect(getState(wrapper).ids).toEqual([])
  })

  test('unregister current and go to next one', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'], current: 0 }))
    getState(wrapper).unregister('a')
    expect(getState(wrapper).ids).toEqual(['b', 'c'])
    expect(getState(wrapper).current).toBe(0)
  })

  test('unregister current and go to previous one', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'], current: 2 }))
    getState(wrapper).unregister('c')
    expect(getState(wrapper).ids).toEqual(['a', 'b'])
    expect(getState(wrapper).current).toBe(1)
  })

  test('unregister current with only one id', () => {
    const wrapper = wrap(enhance({ ids: ['a'], current: 0 }))
    getState(wrapper).unregister('a')
    expect(getState(wrapper).ids).toEqual([])
    expect(getState(wrapper).current).toBe(-1)
  })

  test('update', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'] }))
    getState(wrapper).update('a', 'a')
    expect(getState(wrapper).ids).toEqual(['a', 'b', 'c'])
    getState(wrapper).update('a', 'd')
    expect(getState(wrapper).ids).toEqual(['d', 'b', 'c'])
  })

  test('update and reorder', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'] }))
    getState(wrapper).update('a', 'd', 99)
    expect(getState(wrapper).ids).toEqual(['b', 'c', 'd'])
    getState(wrapper).update('d', 'd', -1)
    expect(getState(wrapper).ids).toEqual(['d', 'b', 'c'])
  })

  test('update to an existing id', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'] }))
    getState(wrapper).update('a', 'b')
    expect(getState(wrapper).ids).toEqual(['b', 'c'])
  })

  test('update to an existing id and reorder', () => {
    const wrapper = wrap(enhance({ ids: ['a', 'b', 'c'] }))
    getState(wrapper).update('a', 'b', 99)
    expect(getState(wrapper).ids).toEqual(['c', 'b'])
  })
}

describe('withStepState', () => createTests(withStepState))
