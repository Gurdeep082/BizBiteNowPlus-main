import React from "react";

const Table = ({
  columns = [],
  data = [],
  keyField = "id",
  emptyMessage = "No data available.",
  loading = false,
  className = "",
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}
    >
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead className="bg-[#1A4D2E] text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[keyField]}
                  className="border-t transition hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 md:hidden">
        {data.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row) => (
            <div
              key={row[keyField]}
              className="rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              {columns.map((column) => (
                <div
                  key={column.accessor}
                  className="mb-3 flex justify-between gap-4"
                >
                  <span className="text-sm font-medium text-gray-500">
                    {column.header}
                  </span>

                  <span className="text-sm text-right text-gray-800">
                    {column.render
                      ? column.render(row)
                      : row[column.accessor]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Table;