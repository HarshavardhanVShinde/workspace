'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'

// Types for tokens and evaluation
type Token = { type: 'number' | 'operator' | 'lparen' | 'rparen' | 'func' | 'const'; value: string }

const OPERATORS: Record<string, { precedence: number; assoc: 'left' | 'right' }> = {
  '+': { precedence: 1, assoc: 'left' },
  '-': { precedence: 1, assoc: 'left' },
  '*': { precedence: 2, assoc: 'left' },
  '/': { precedence: 2, assoc: 'left' },
  '^': { precedence: 3, assoc: 'right' },
}

const FUNCTIONS = ['sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'exp', 'neg']
const CONSTANTS: Record<string, number> = { 'π': Math.PI, 'pi': Math.PI, 'e': Math.E }

function tokenize(input: string): Token[] {
  const s = input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
  const tokens: Token[] = []
  let i = 0
  const isDigit = (c: string) => /[0-9]/.test(c)
  while (i < s.length) {
    const c = s[i]
    if (isDigit(c) || (c === '.' && isDigit(s[i + 1] || ''))) {
      let num = c
      i++
      while (i < s.length && (isDigit(s[i]) || s[i] === '.')) {
        num += s[i]
        i++
      }
      tokens.push({ type: 'number', value: num })
      continue
    }
    if (c === '(') { tokens.push({ type: 'lparen', value: c }); i++; continue }
    if (c === ')') { tokens.push({ type: 'rparen', value: c }); i++; continue }
    if (c in OPERATORS) { tokens.push({ type: 'operator', value: c }); i++; continue }

    // Functions (sin, cos, tan, ln, log, sqrt, exp)
    const fnMatch = s.slice(i).match(/^(sin|cos|tan|ln|log|sqrt|exp)/)
    if (fnMatch) { tokens.push({ type: 'func', value: fnMatch[0] }); i += fnMatch[0].length; continue }

    // Constants π, e
    if (s.slice(i).startsWith('π') || s.slice(i).startsWith('pi')) { tokens.push({ type: 'const', value: 'π' }); i += s.slice(i).startsWith('π') ? 1 : 2; continue }
    if (s.slice(i).startsWith('e')) { tokens.push({ type: 'const', value: 'e' }); i += 1; continue }

    // Unknown char
    throw new Error(`Invalid character: '${c}'`)
  }
  return tokens
}

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = []
  const stack: Token[] = []
  let prev: Token | null = null

  for (const t of tokens) {
    if (t.type === 'number' || t.type === 'const') {
      output.push(t)
    } else if (t.type === 'func') {
      stack.push(t)
    } else if (t.type === 'operator') {
      // unary minus detection
      const isUnaryMinus = t.value === '-' && (!prev || prev.type === 'operator' || prev.type === 'lparen')
      const opToken = isUnaryMinus ? { type: 'func', value: 'neg' } as Token : t
      if (opToken.type === 'func') {
        stack.push(opToken)
      } else {
        while (
          stack.length > 0 &&
          stack[stack.length - 1].type !== 'lparen' &&
          ((stack[stack.length - 1].type === 'func') ||
            (stack[stack.length - 1].type === 'operator' && (
              OPERATORS[stack[stack.length - 1].value].precedence > OPERATORS[opToken.value].precedence ||
              (OPERATORS[stack[stack.length - 1].value].precedence === OPERATORS[opToken.value].precedence && OPERATORS[stack[stack.length - 1].value].assoc === 'left')
            )))
        ) {
          output.push(stack.pop()!)
        }
        stack.push(opToken)
      }
    } else if (t.type === 'lparen') {
      stack.push(t)
    } else if (t.type === 'rparen') {
      while (stack.length && stack[stack.length - 1].type !== 'lparen') {
        output.push(stack.pop()!)
      }
      if (!stack.length) throw new Error('Mismatched parentheses')
      stack.pop() // remove '('
      // If function on top, pop it too
      if (stack.length && stack[stack.length - 1].type === 'func') {
        output.push(stack.pop()!)
      }
    }
    prev = t
  }

  while (stack.length) {
    if (stack[stack.length - 1].type === 'lparen') throw new Error('Mismatched parentheses')
    output.push(stack.pop()!)
  }
  return output
}

function evalRPN(rpn: Token[], degMode: boolean): number {
  const stack: number[] = []
  const toRad = (x: number) => (degMode ? (x * Math.PI) / 180 : x)

  for (const t of rpn) {
    if (t.type === 'number') {
      stack.push(parseFloat(t.value))
    } else if (t.type === 'const') {
      stack.push(CONSTANTS[t.value])
    } else if (t.type === 'operator') {
      const b = stack.pop(); const a = stack.pop()
      if (a === undefined || b === undefined) throw new Error('Invalid expression')
      switch (t.value) {
        case '+': stack.push(a + b); break
        case '-': stack.push(a - b); break
        case '*': stack.push(a * b); break
        case '/': if (b === 0) throw new Error('Division by zero'); stack.push(a / b); break
        case '^': stack.push(a ** b); break
      }
    } else if (t.type === 'func') {
      const x = stack.pop()
      if (x === undefined) throw new Error('Invalid function usage')
      switch (t.value) {
        case 'sin': stack.push(Math.sin(toRad(x))); break
        case 'cos': stack.push(Math.cos(toRad(x))); break
        case 'tan': stack.push(Math.tan(toRad(x))); break
        case 'ln': if (x <= 0) throw new Error('ln domain error'); stack.push(Math.log(x)); break
        case 'log': if (x <= 0) throw new Error('log domain error'); stack.push(Math.log10(x)); break
        case 'sqrt': if (x < 0) throw new Error('sqrt domain error'); stack.push(Math.sqrt(x)); break
        case 'exp': stack.push(Math.exp(x)); break
        case 'neg': stack.push(-x); break
      }
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression')
  return stack[0]
}

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [memory, setMemory] = useState<number>(0)
  const [degMode, setDegMode] = useState<boolean>(true)
  const [inverse, setInverse] = useState<boolean>(false)
  const [lastAns, setLastAns] = useState<number | null>(null)

  const displayRef = useRef<HTMLDivElement>(null)

  const safeEvaluate = (expr: string) => {
    try {
      const tokens = tokenize(expr)
      const rpn = toRPN(tokens)
      const value = evalRPN(rpn, degMode)
      setError('')
      setResult(String(value))
      return value
    } catch (e: any) {
      setError(e.message || 'Syntax error')
      setResult('')
      return null
    }
  }

  useEffect(() => {
    if (expression.trim() === '') { setResult(''); setError(''); return }
    safeEvaluate(expression)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, degMode])

  const push = (val: string) => {
    setExpression(prev => prev + val)
  }

  const handleEquals = () => {
    const v = safeEvaluate(expression)
    if (v !== null) {
      setLastAns(v)
    }
  }

  const handleClear = () => {
    setExpression('')
    setResult('')
    setError('')
  }

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1))
  }

  const handleClearEntry = () => {
    setExpression('')
  }

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1))
  }

  const toggleInverse = () => {
    setInverse(prev => !prev)
  }

  const toggleDegMode = () => {
    setDegMode(prev => !prev)
  }

  const handleMemory = (type: 'M+' | 'M-' | 'MR' | 'MC') => {
    if (type === 'MC') { setMemory(0); return }
    if (type === 'MR') { setExpression(prev => prev + (memory.toString())); return }
    const v = safeEvaluate(expression)
    if (v === null) return
    if (type === 'M+') setMemory(m => m + v)
    if (type === 'M-') setMemory(m => m - v)
  }

  const handleKeydown = (e: KeyboardEvent) => {
    const key = e.key
    if (/^[0-9]$/.test(key)) push(key)
    else if (key === '.') push('.')
    else if (key === '+') push('+')
    else if (key === '-') push('-')
    else if (key === '*') push('*')
    else if (key === '/') push('/')
    else if (key === '^') push('^')
    else if (key === '(') push('(')
    else if (key === ')') push(')')
    else if (key.toLowerCase() === 'p') push('π')
    else if (key.toLowerCase() === 'e') push('e')
    else if (key === 'Enter') handleEquals()
    else if (key === 'Backspace') handleDelete()
    else if (key === 'Escape') handleClear()
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeydown(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, memory, degMode])

  const infoItems = useMemo(() => ([
    { label: 'sin, cos, tan', desc: 'Trigonometric functions (DEG/RAD toggle)' },
    { label: 'ln, log', desc: 'Natural log and base-10 log' },
    { label: 'sqrt, exp', desc: 'Square root and e^x' },
    { label: 'π, e', desc: 'Mathematical constants' },
    { label: 'M+, M-, MR, MC', desc: 'Memory add, subtract, recall, clear' },
    { label: 'Parentheses', desc: 'Build complex expressions with ()' },
  ]), [])

  return (
    <div className="pt-8 pb-24 max-w-4xl mx-auto px-4 sm:px-8">
      <StructuredData data={getWebPageJsonLd({
        name: 'Scientific Calculator',
        description: 'Perform arithmetic and scientific calculations with sin, cos, tan, logs, exponents, and more. Memory functions and DEG/RAD supported.',
        url: `${siteUrl}/scientific-calculator`,
        breadcrumb: ['Home', 'Scientific Calculator']
      })} />
      <StructuredData data={getWebAppJsonLd({
        name: 'Scientific Calculator',
        description: 'Responsive scientific calculator with professional UI, memory functions, and error handling.',
        url: `${siteUrl}/scientific-calculator`,
        applicationCategory: 'Utility'
      })} />

      <div className="mb-10 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-4">Scientific Calculator</h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Clean, responsive, and accessible—engineered for precision and speed. Use DEG/RAD, memory, parentheses, and advanced functions.
        </p>
      </div>

      <div className="max-w-sm sm:max-w-md mx-auto px-2 sm:px-0">
        <GlassCard className="p-2 sm:p-3 md:p-6 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border-slate-700 dark:border-slate-700 light:border-slate-300">
          {/* Display Area */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-lg p-2 sm:p-3 md:p-4 text-right">
              <div className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 min-h-[14px] sm:min-h-[16px] md:min-h-[20px] overflow-hidden" aria-live="polite">
                {expression || '0'}
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-light text-white dark:text-white light:text-slate-900 overflow-hidden" aria-live="polite">
                {result || (error ? 'Error' : '0')}
              </div>
            </div>
            {/* Status indicators */}
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 light:text-slate-600">
              <div className="flex items-center gap-2">
                <span>{degMode ? 'DEG' : 'RAD'}</span>
                {memory !== 0 && <span>M</span>}
              </div>
              {error && <span className="text-red-400 truncate">{error}</span>}
            </div>
          </div>

          {/* Calculator Grid - Responsive 6x6 layout */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {/* Row 0: CE, C, ⌫, ÷, Inv, Rad, Sin */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleClearEntry}
              className="h-10 sm:h-12 md:h-14 rounded bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 text-white text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              CE
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleClear}
              className="h-10 sm:h-12 md:h-14 rounded bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 text-white text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              C
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleBackspace}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              ⌫
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('/')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              ÷
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={toggleInverse}
              className={`h-10 sm:h-12 md:h-14 rounded text-white text-xs sm:text-sm md:text-base font-medium touch-manipulation ${inverse ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 light:text-slate-900'}`}>
              Inv
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={toggleDegMode}
              className={`h-10 sm:h-12 md:h-14 rounded text-white text-xs sm:text-sm md:text-base font-medium touch-manipulation ${degMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 light:text-slate-900'}`}>
              {degMode ? 'Deg' : 'Rad'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push(inverse ? 'asin(' : 'sin(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              {inverse ? 'asin' : 'sin'}
            </motion.button>

            {/* Row 1: 7, 8, 9, ×, Cos, Tan, % */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('7')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              7
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('8')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              8
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('9')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              9
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('*')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              ×
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push(inverse ? 'acos(' : 'cos(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              {inverse ? 'acos' : 'cos'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push(inverse ? 'atan(' : 'tan(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              {inverse ? 'atan' : 'tan'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('%')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              %
            </motion.button>

            {/* Row 2: 4, 5, 6, -, ln, log, ! */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('4')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              4
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('5')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              5
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('6')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              6
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('-')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              -
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('ln(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              ln
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('log(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-xs sm:text-sm md:text-base font-medium touch-manipulation">
              log
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('!')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              !
            </motion.button>

            {/* Row 3: 1, 2, 3, +, ^, π, e */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('1')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              1
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('2')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              2
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('3')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              3
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('+')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              +
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('^')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              ^
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('π')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              π
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('e')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              e
            </motion.button>

            {/* Row 4: ., 0, =, (, ), √ */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('.')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              .
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('0')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              0
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleEquals}
              className="h-10 sm:h-12 md:h-14 rounded bg-pink-600 hover:bg-pink-500 dark:bg-pink-600 dark:hover:bg-pink-500 text-white text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              =
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              (
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push(')')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              )
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => push('sqrt(')}
              className="h-10 sm:h-12 md:h-14 rounded bg-slate-600 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-slate-300 light:hover:bg-slate-400 text-white light:text-slate-900 text-sm sm:text-lg md:text-xl font-medium touch-manipulation">
              √
            </motion.button>
          </div>
        </GlassCard>
      </div>

      {/* Info bar */}
      <GlassCard className="mt-10 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Function Reference</h3>
        <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          {infoItems.map(it => (
            <li key={it.label}>
              <span className="font-semibold">{it.label}:</span> {it.desc}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">Tip: Use parentheses to control precedence. Trig functions respect the DEG/RAD mode. Keyboard input supported (digits, operators, parentheses, Enter, Backspace, Escape).</p>
      </GlassCard>
    </div>
  )
}