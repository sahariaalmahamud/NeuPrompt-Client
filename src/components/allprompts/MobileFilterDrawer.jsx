"use client";

import { Modal } from "@heroui/react";
import { Xmark } from "@gravity-ui/icons";
import FiltersSidebar from "./FiltersSidebar";

export default function MobileFilterDrawer({ isOpen, setIsOpen, filters, onFilterChange }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Backdrop className="bg-[#030303]/80 backdrop-blur-sm z-[100] fixed inset-0 lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
        <Modal.Container className="bg-[#0a0a0c] border border-white/10 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 max-h-[85vh]">
          <Modal.Dialog className="flex flex-col h-full">
            
            <Modal.Header className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <Modal.Heading className="text-lg font-bold text-white">Filters</Modal.Heading>
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full">
                <Xmark size={18} />
              </button>
            </Modal.Header>
            
            <Modal.Body className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {/* Reuse Desktop Sidebar internally without its background card styling */}
              <div className="w-full">
                <FiltersSidebar 
                  filters={filters} 
                  onFilterChange={(t, v) => {
                    onFilterChange(t, v);
                    // Optional: Close drawer on select, or keep open. Keeping open is usually better for multi-select.
                  }} 
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="p-5 border-t border-white/5 shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-colors"
              >
                Apply Filters
              </button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}