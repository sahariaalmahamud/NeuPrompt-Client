"use client";

import { Modal, Button, Avatar } from "@heroui/react";
import Link from "next/link";
import { CircleLink, ShieldExclamation, Ban, TrashBin } from "@gravity-ui/icons";
import StatusBadge from "./StatusBadge";

export default function ReportDetailsModal({ isOpen, onOpenChange, report, onAction }) {
    if (!report) return null;

    const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const isResolved = report.status !== "pending";

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop className="bg-[#030303]/80 backdrop-blur-sm z-[100] fixed inset-0 flex items-center justify-center p-4">
                <Modal.Container className="bg-[#0a0a0c] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <Modal.Dialog>
                        <div className="flex flex-col max-h-[85vh]">

                            <Modal.Header className="p-6 pb-4 border-b border-white/5 flex items-start justify-between shrink-0">
                                <div className="flex flex-col gap-1">
                                    <Modal.Heading className="text-xl font-bold text-white flex items-center gap-3">
                                        Report Details <StatusBadge status={report.status} />
                                    </Modal.Heading>
                                    <span className="text-sm font-normal text-zinc-500">Reported on {formattedDate}</span>
                                </div>
                                <Modal.CloseTrigger className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full" />
                            </Modal.Header>

                            <Modal.Body className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">

                                {/* Prompt Info Card */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">Reported Prompt</h3>
                                    <div className="flex items-center gap-4 p-4 bg-[#030303] border border-white/5 rounded-2xl shadow-inner">
                                        <img src={report.promptThumbnail} alt="Thumbnail" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <span className="text-white font-bold truncate">{report.promptTitle}</span>
                                            <span className="text-xs text-zinc-500">By {report.creatorName}</span>
                                        </div>
                                        <Button as={Link} href={`/prompts/${report.promptId}`} target="_blank" className="bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl px-4 h-10 flex items-center gap-2">
                                            View <CircleLink size={14} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Reporter & Reason Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">Reporter</h3>
                                        <div className="flex items-center gap-3">
                                            <Avatar src={report.reporterImage || `https://ui-avatars.com/api/?name=${report.reporterName}&background=2A2A35&color=fff`} size="md" className="ring-1 ring-white/10" />
                                            <span className="text-white font-medium">{report.reporterName}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">Reason Category</h3>
                                        <span className="text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg w-max">
                                            {report.reason}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">Detailed Description</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-zinc-300 leading-relaxed shadow-inner">
                                        {report.description || "No additional description provided."}
                                    </div>
                                </div>

                            </Modal.Body>

                            {/* Action Footer */}
                            {!isResolved && (
                                <Modal.Footer className="p-4 border-t border-white/5 flex items-center justify-end gap-3 bg-[#030303] shrink-0">
                                    <Button
                                        onPress={() => onAction("dismiss", report)}
                                        className="px-4 py-2 text-sm font-medium bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-300 rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <Ban size={16} /> Dismiss
                                    </Button>
                                    <Button
                                        onPress={() => onAction("warn", report)}
                                        className="px-4 py-2 text-sm font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <ShieldExclamation size={16} /> Warn Creator
                                    </Button>
                                    <Button
                                        onPress={() => onAction("delete", report)}
                                        className="px-4 py-2 text-sm font-semibold bg-red-600/90 hover:bg-red-500 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2"
                                    >
                                        <TrashBin size={16} /> Delete Prompt
                                    </Button>
                                </Modal.Footer>
                            )}

                        </div>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}