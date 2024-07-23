import { SelectQueryBuilder } from 'typeorm'

export const addRangeCondition = (
  query: SelectQueryBuilder<any>,
  field: string,
  range?: { start?: number; end?: number }
) => {
  if (range?.start !== undefined) {
    query.andWhere(`${field} >= :${field}Start`, {
      [`${field}Start`]: range.start
    })
  }
  if (range?.end !== undefined) {
    query.andWhere(`${field} <= :${field}End`, { [`${field}End`]: range.end })
  }
}
