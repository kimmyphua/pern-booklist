import { addRangeCondition } from './helpers'

interface QueryBuilderMock {
  andWhere: jest.Mock
}

describe('addRangeCondition', () => {
  let queryMock: QueryBuilderMock

  beforeEach(() => {
    queryMock = {
      andWhere: jest.fn()
    }
  })

  it('should add start condition when range.start is defined', () => {
    addRangeCondition(queryMock as any, 'book.yearPublished', { start: 2000 })
    expect(queryMock.andWhere).toHaveBeenCalledWith(
      'book.yearPublished >= :book.yearPublishedStart',
      { 'book.yearPublishedStart': 2000 }
    )
  })

  it('should add end condition when range.end is defined', () => {
    addRangeCondition(queryMock as any, 'book.yearPublished', { end: 2020 })
    expect(queryMock.andWhere).toHaveBeenCalledWith(
      'book.yearPublished <= :book.yearPublishedEnd',
      { 'book.yearPublishedEnd': 2020 }
    )
  })

  it('should add both start and end conditions when both are defined', () => {
    addRangeCondition(queryMock as any, 'book.yearPublished', {
      start: 2000,
      end: 2020
    })
    expect(queryMock.andWhere).toHaveBeenCalledWith(
      'book.yearPublished >= :book.yearPublishedStart',
      { 'book.yearPublishedStart': 2000 }
    )
    expect(queryMock.andWhere).toHaveBeenCalledWith(
      'book.yearPublished <= :book.yearPublishedEnd',
      { 'book.yearPublishedEnd': 2020 }
    )
  })

  it('should not add any condition when range is undefined', () => {
    addRangeCondition(queryMock as any, 'book.yearPublished', undefined)
    expect(queryMock.andWhere).not.toHaveBeenCalled()
  })

  it('should not add any condition when range has no start or end', () => {
    addRangeCondition(queryMock as any, 'book.yearPublished', {
      start: undefined,
      end: undefined
    })
    expect(queryMock.andWhere).not.toHaveBeenCalled()
  })
})
