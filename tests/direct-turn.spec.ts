import { describe, expect, it } from 'vitest'
import { directTurnLeavesWorkOpen, isBareContinuation } from '../src/host/coordinator.js'

describe('enforced-v3 direct turns and bare continuations', () => {
  it.each(['Continue', 'Continue.', 'continue!', 'go on', 'keep going', '继续', '继续。', '请继续', '接着做'])(
    'treats %j as a bare continuation', text => {
      expect(isBareContinuation(text)).toBe(true)
    })

  it.each(['Continue the existing task.', 'Correct addition in calc.py.', 'Hello.', 'Continue. Also change the name.'])(
    'does not treat %j as a bare continuation', text => {
      expect(isBareContinuation(text)).toBe(false)
    })

  it('keeps an implementation request open when the Lead only plans', () => {
    expect(directTurnLeavesWorkOpen(
      ['Fix addition in calc.py and run test_calc.py. Do not stop after planning.'],
      'I will inspect calc.py and delegate the fix to Sidekick.',
    )).toBe(true)
    expect(directTurnLeavesWorkOpen(
      ['Correct addition in calc.py.'],
      'I will delegate the correction to Sidekick.',
    )).toBe(true)
    expect(directTurnLeavesWorkOpen(['Correct addition in calc.py.'], 'Done.')).toBe(true)
  })

  it('still allows a conversational answer', () => {
    expect(directTurnLeavesWorkOpen(['Hello.'], 'Hello.')).toBe(false)
    expect(directTurnLeavesWorkOpen(['What is 2 + 2?'], '4.')).toBe(false)
  })
})
