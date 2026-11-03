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

  it('completes a definitional question that only mentions implementation words', () => {
    expect(directTurnLeavesWorkOpen(
      ['What does "implement" mean? Answer in one sentence.'],
      'It means to put a plan into practice.',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['What is a software patch? Answer in one sentence.'],
      'A patch is a set of changes applied to software.',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['What does implement mean in TypeScript?'],
      'It means to write the body of a declared function or interface.',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['Please explain what implement means.'],
      'It means to put a design into code.',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['软件补丁是什么？'],
      '软件补丁是一组应用到程序上的改动。',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['实现是什么意思？'],
      '实现就是把设计写成可以运行的代码。',
    )).toBe(false)
    expect(directTurnLeavesWorkOpen(
      ['What does a patch in calc.py mean?'],
      'It is a file of changes applied to that program.',
    )).toBe(false)
  })

  it('keeps a mixed definition and workspace command open', () => {
    expect(directTurnLeavesWorkOpen(
      ['What is a software patch? Then fix it in calc.py.'],
      'A patch is a diff. Done.',
    )).toBe(true)
    expect(directTurnLeavesWorkOpen(
      ['补丁是什么？请修复 calc.py。'],
      'Done.',
    )).toBe(true)
  })

  it('keeps a planning or deferral reply open even for a definitional question', () => {
    expect(directTurnLeavesWorkOpen(['Hello.'], "First I'll check the files.")).toBe(true)
    expect(directTurnLeavesWorkOpen(['What is a software patch?'], 'Let me read the repo and explore the definition.')).toBe(true)
    expect(directTurnLeavesWorkOpen(['What does implement mean?'], "I'll check the files and delegate the write.")).toBe(true)
    expect(directTurnLeavesWorkOpen(['软件补丁是什么？'], '我先去查看相关代码。')).toBe(true)
    expect(directTurnLeavesWorkOpen(['Hello.'], '接下来我会检查实现。')).toBe(true)
  })
})
