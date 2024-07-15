import React, { useState } from 'react'

interface Column {
  header: string
  accessor: string
  render?: (item: Record<string, any>) => React.ReactNode
}
interface TableProps {
  data: Record<string, any>[]
  columns: Column[]
  paginate?: boolean
  pageSize?: number
  sortable?: boolean
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  paginate = false,
  pageSize = 10,
  sortable = false
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedData = paginate
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data

  const renderCell = (
    item: Record<string, any>,
    accessor: string | ((dataItem: Record<string, any>) => any),
    render?: (item: any) => React.ReactNode
  ) => {
    if (typeof accessor === 'function') {
      return accessor(item)
    }
    // Access nested properties
    const result =
      accessor === ''
        ? item
        : accessor.split('.').reduce((acc, curr) => acc[curr], item)
    console.log({ result })

    if (render) return render(result)
    return result ?? '-'
  }
  console.log({ paginatedData })

  const handleSort = (header: string) => {
    // Implement sorting logic here
    // Example: Sort data based on the selected header
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(({ header, accessor }) => (
              <th
                key={accessor}
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {sortable ? (
                  <button
                    className="focus:outline-none"
                    onClick={() => handleSort(accessor)}>
                    {header}
                  </button>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {columns.map(({ render, header, accessor }) => (
                <td
                  key={`${header}-${index}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderCell(item, accessor, render)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginate && (
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded focus:outline-none"
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            disabled={currentPage === 1}>
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded focus:outline-none"
            onClick={() =>
              setCurrentPage((prevPage) =>
                Math.min(prevPage + 1, Math.ceil(data.length / pageSize))
              )
            }
            disabled={currentPage === Math.ceil(data.length / pageSize)}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Table
