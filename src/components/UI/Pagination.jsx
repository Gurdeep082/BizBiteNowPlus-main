import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PaginatedList = ({ data, renderItem }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {currentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`h-10 w-10 rounded-lg transition ${
                  currentPage === index + 1
                    ? "bg-[#1A4D2E] text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <p className="text-sm text-black">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </>
  );
};

export default PaginatedList;
