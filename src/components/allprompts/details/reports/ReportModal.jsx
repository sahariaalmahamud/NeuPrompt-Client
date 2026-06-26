"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, Button, Select, Label, ListBox, TextArea, Description } from "@heroui/react";

// ZOD SCHEMA
const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  description: z.string()
    .min(20, "Please provide more details (min 20 characters)")
    .max(500, "Description cannot exceed 500 characters"),
});

const REPORT_REASONS = [
  "Spam",
  "Copyright Violation",
  "Harmful Content",
  "NSFW Content",
  "Misleading Information",
  "Low Quality",
  "Other"
];

export default function ReportModal({ isOpen, onOpenChange, promptId, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: "", description: "" }
  });

  const descriptionLength = watch("description")?.length || 0;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // BACKEND INTEGRATION
      // await reportPrompt({ promptId, reporterId: user.id, reason: data.reason, description: data.description });
      
      await new Promise(res => setTimeout(res, 800)); // Simulate API call
      
      alert("Report submitted successfully."); // Replace with standard toast
      onOpenChange(false);
    } catch (error) {
      alert(error.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="bg-[#030303]/80 backdrop-blur-sm z-[100] fixed inset-0 flex items-center justify-center p-4">
        <Modal.Container className="bg-[#0a0a0c] border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)] rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          <Modal.Dialog>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
              
              <Modal.Header className="p-6 pb-4 border-b border-white/5 flex items-start justify-between shrink-0">
                <div className="flex flex-col gap-1">
                  <Modal.Heading className="text-xl font-bold text-white">
                    Report Prompt
                  </Modal.Heading>
                  <span className="text-sm font-normal text-zinc-500">
                    Help us keep the marketplace safe.
                  </span>
                </div>
                <Modal.CloseTrigger className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full" />
              </Modal.Header>

              <Modal.Body className="p-6 flex flex-col gap-6">
                
                {/* HeroUI Strict Select Anatomy using RHF Controller */}
                <div className="flex flex-col gap-1">
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                      >
                        <Label className="text-sm font-medium text-zinc-300 mb-1 block">Reason for Report</Label>
                        <Select.Trigger className="bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 data-[focus=true]:border-red-500 shadow-inner h-12 px-4 rounded-xl w-full flex justify-between items-center">
                          <Select.Value placeholder="Select a reason" />
                          <Select.Indicator />
                        </Select.Trigger>
                        
                        <Select.Popover className="bg-[#0a0a0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-xl">
                          <ListBox className="p-1">
                            {REPORT_REASONS.map((reason) => (
                              <ListBox.Item key={reason} textValue={reason} className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                                <Label className="text-sm cursor-pointer w-full block text-zinc-300">{reason}</Label>
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    )}
                  />
                  {errors.reason && <span className="text-xs text-red-500 mt-1">{errors.reason.message}</span>}
                </div>

                {/* HeroUI TextArea */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-300">Description</label>
                  <TextArea
                    {...register("description")}
                    aria-describedby="report-description-count"
                    placeholder="Please provide specific details about why you are reporting this prompt..."
                    className="w-full"
                    classNames={{
                      inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-red-500 shadow-inner rounded-xl min-h-[100px]",
                      input: "text-zinc-300 placeholder:text-zinc-600"
                    }}
                  />
                  <div className="flex justify-between items-center mt-1 px-1">
                    {errors.description ? (
                      <span className="text-xs text-red-500">{errors.description.message}</span>
                    ) : <span />}
                    <Description id="report-description-count" className={`text-xs ${descriptionLength > 500 ? "text-red-500" : "text-zinc-500"}`}>
                      {descriptionLength} / 500
                    </Description>
                  </div>
                </div>

              </Modal.Body>

              <Modal.Footer className="p-4 border-t border-white/5 flex items-center justify-end gap-3 bg-[#030303] shrink-0">
                <Button 
                  variant="light" 
                  onPress={() => onOpenChange(false)} 
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  className="px-6 py-2 text-sm font-semibold bg-red-600/90 hover:bg-red-500 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                >
                  Submit Report
                </Button>
              </Modal.Footer>

            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}