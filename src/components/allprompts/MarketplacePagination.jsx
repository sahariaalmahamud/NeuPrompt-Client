"use client";

import { Pagination } from "@heroui/react";

export default function MarketplacePagination({ currentPage, totalPages, onPageChange }) {
  
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Pagination className="justify-center">
        <Pagination.Content className="flex items-center gap-1">
          
          <Pagination.Item>
            <Pagination.Previous 
              isDisabled={currentPage === 1} 
              onPress={() => onPageChange(currentPage - 1)}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              <span className="text-sm font-medium mr-2">Prev</span>
            </Pagination.Previous>
          </Pagination.Item>

          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <Pagination.Ellipsis className="text-zinc-500" />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link 
                  isActive={p === currentPage} 
                  onPress={() => onPageChange(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage 
                      ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                      : "text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            )
          )}

          <Pagination.Item>
            <Pagination.Next 
              isDisabled={currentPage === totalPages} 
              onPress={() => onPageChange(currentPage + 1)}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              <span className="text-sm font-medium ml-2">Next</span>
            </Pagination.Next>
          </Pagination.Item>

        </Pagination.Content>
      </Pagination>
    </div>
  );
}