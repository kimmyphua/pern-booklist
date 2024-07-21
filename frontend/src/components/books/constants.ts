export interface CreateBook {
  title: string
  yearPublished?: number | null
  noOfPages?: number | null
}

export interface UpdateBook {
  id: number
  title: string
  yearPublished?: number | null
  noOfPages?: number | null
}

export const DEFAULT_SELECTED_AUTHOR_VALUE = {
  label: 'Choose an author',
  value: ''
}

export const DEFAULT_BOOK_INPUT = {
  title: '',
  yearPublished: null,
  noOfPages: null
}
