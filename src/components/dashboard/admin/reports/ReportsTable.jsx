"use client";

import { Table, Avatar } from "@heroui/react";
import Link from "next/link";
import { Eye, Receipt, ShieldExclamation, Ban, TrashBin } from "@gravity-ui/icons";
import StatusBadge from "./StatusBadge";

export default function ReportsTable({ reports, onAction }) {
  return (
    <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
      <Table>
        <Table.ScrollContainer className="w-full overflow-x-auto custom-scrollbar">
          <Table.Content aria-label="Admin Reports Table" className="w-full min-w-[1000px] text-left border-collapse">
            
            <Table.Header className="bg-white/5 border-b border-white/10">
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest w-[250px]">Prompt</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Reporter</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Creator</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Reason</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center">Status</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right">Date</Table.Column>
              <Table.Column className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right">Actions</Table.Column>
            </Table.Header>
            
            <Table.Body className="divide-y divide-white/5">
              {reports.map((report) => {
                const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const isResolved = report.status !== "pending";

                return (
                  <Table.Row key={report._id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Prompt Info */}
                    <Table.Cell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={report.promptThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <Link href={`/prompts/${report.promptId}`} target="_blank" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2">
                          {report.promptTitle}
                        </Link>
                      </div>
                    </Table.Cell>

                    {/* Reporter */}
                    <Table.Cell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={report.reporterImage || `https://ui-avatars.com/api/?name=${report.reporterName}&background=2A2A35&color=fff`} size="sm" className="w-6 h-6 text-[10px]" />
                        <span className="text-sm text-zinc-300">{report.reporterName}</span>
                      </div>
                    </Table.Cell>

                    {/* Creator */}
                    <Table.Cell className="px-6 py-4">
                      <span className="text-sm text-zinc-300">{report.creatorName}</span>
                    </Table.Cell>

                    {/* Reason */}
                    <Table.Cell className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-300">{report.reason}</span>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell className="px-6 py-4 text-center">
                      <StatusBadge status={report.status} />
                    </Table.Cell>

                    {/* Date */}
                    <Table.Cell className="px-6 py-4 text-right">
                      <span className="text-xs text-zinc-400">{formattedDate}</span>
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        
                        <Link href={`/prompts/${report.promptId}`} target="_blank" className="p-2 bg-white/5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="View Prompt">
                          <Eye size={16} />
                        </Link>
                        
                        <button onClick={() => onAction("view", report)} className="p-2 bg-blue-500/10 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors" title="View Report Details">
                          <Receipt size={16} />
                        </button>
                        
                        {!isResolved && (
                          <>
                            <button onClick={() => onAction("dismiss", report)} className="p-2 bg-zinc-500/10 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-500/20 transition-colors ml-2" title="Dismiss Report">
                              <Ban size={16} />
                            </button>
                            <button onClick={() => onAction("warn", report)} className="p-2 bg-orange-500/10 rounded-lg text-orange-500 hover:text-orange-400 hover:bg-orange-500/20 transition-colors" title="Warn Creator">
                              <ShieldExclamation size={16} />
                            </button>
                            <button onClick={() => onAction("delete", report)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Prompt">
                              <TrashBin size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </Table.Cell>

                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}