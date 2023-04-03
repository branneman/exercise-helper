export const fizzbuzz = (n: number) => {
  if (!Number.isInteger(n)) throw new Error(
    'Only accepts integers')
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('fizzbuzz()', () => {
    it('throws without integers', () => {
      expect(() => fizzbuzz(3.14)).toThrow()
    })

    it('number in, string out', () => {
      const r = fizzbuzz(2)
      expect(r).toEqual('2')
    })

    it('multiples of 3: return Fizz', () => {
      const r = fizzbuzz(9)
      expect(r).toEqual('Fizz')
    })

    it('multiples of 5: return Buzz', () => {
      const r = fizzbuzz(10)
      expect(r).toEqual('Buzz')
    })

    it('multiples of 3 and 5: return FizzBuzz', () => {
      const r = fizzbuzz(15)
      expect(r).toEqual('FizzBuzz')
    })
  })
}
