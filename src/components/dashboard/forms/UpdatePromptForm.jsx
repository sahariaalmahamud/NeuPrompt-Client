"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spinner } from "@heroui/react";
import {
  Picture,
  Xmark,
  Tag as TagIcon,
  Check,
  ChevronDown,
} from "@gravity-ui/icons";

// ─── Schema ───────────────────────────────────────────────────────────────────
const updateSchema = z.object({
  title:       z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  content:     z.string().min(20, "Prompt content must be at least 20 characters."),
  category:    z.string().min(1, "Please select a category."),
  aiTool:      z.string().min(1, "Please select an AI tool."),
  difficulty:  z.string().min(1, "Please select a difficulty level."),
  tags:        z.array(z.string()).min(1, "At least one tag is required."),
  thumbnail:   z.string().url("Please upload a valid thumbnail image."),
  visibility:  z.enum(["Public", "Private"]),
});

const CATEGORIES  = ["Writing","Marketing","Coding","Business","Education","Productivity","Design","Social Media","Research","Other"];
const AI_TOOLS    = ["ChatGPT","Claude","Gemini","Grok","Perplexity","Copilot","Midjourney"];
const DIFFICULTIES = ["Beginner","Intermediate","Advanced"];

// ─── Reusable primitives ──────────────────────────────────────────────────────

function FieldGroup({ id, label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-zinc-400 select-none">
        {label}
        {required && <span className="text-blue-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[11px] text-red-400 flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function StyledInput({ id, error, ...props }) {
  return (
    <input
      id={id}
      aria-invalid={!!error}
      className={`w-full h-10 px-3.5 bg-[#060608] border rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none transition-all
        focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-white/15
        ${error ? "border-red-500/40" : "border-white/[0.08]"}`}
      {...props}
    />
  );
}

function StyledTextarea({ id, error, ...props }) {
  return (
    <textarea
      id={id}
      aria-invalid={!!error}
      className={`w-full px-3.5 py-2.5 bg-[#060608] border rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none resize-y transition-all
        focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-white/15
        ${error ? "border-red-500/40" : "border-white/[0.08]"}`}
      {...props}
    />
  );
}

function StyledSelect({ id, error, value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`w-full appearance-none h-10 px-3.5 pr-9 bg-[#060608] border rounded-xl text-sm outline-none cursor-pointer transition-all
          focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-white/15
          ${error ? "border-red-500/40 text-red-400" : "border-white/[0.08]"}
          ${value ? "text-zinc-200" : "text-zinc-500"}`}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0d0d10] text-zinc-200">{opt}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" aria-hidden="true" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function UpdatePromptForm({ prompt, onSuccess }) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: "", description: "", content: "", category: "", aiTool: "",
      difficulty: "", tags: [], thumbnail: "", visibility: "Public",
    },
  });

  // Prefill when prompt changes
  useEffect(() => {
    if (prompt) {
      reset({
        title:       prompt.title       ?? "",
        description: prompt.description ?? "",
        content:     prompt.content     ?? "",
        category:    prompt.category    ?? "",
        aiTool:      prompt.aiTool      ?? "",
        difficulty:  prompt.difficulty  ?? "",
        tags:        prompt.tags        ?? [],
        thumbnail:   prompt.thumbnail   ?? "",
        visibility:  prompt.visibility  ?? "Public",
      });
    }
  }, [prompt, reset]);

  const thumbnailPreview = watch("thumbnail");
  const currentTags = watch("tags") ?? [];

  // ── Image upload ────────────────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be smaller than 5 MB."); return; }
    setUploadError("");
    setIsUploadingImage(true);
    const body = new FormData();
    body.append("image", file);
    try {
      const key = process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
      const data = await res.json();
      if (data.success) {
        setValue("thumbnail", data.data.url, { shouldValidate: true });
      } else {
        setUploadError("Upload failed: " + data.error?.message);
      }
    } catch {
      setUploadError("An error occurred while uploading.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // ── Tags ────────────────────────────────────────────────────────────────────
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/,/g, "");
      if (newTag && !currentTags.includes(newTag) && currentTags.length < 10) {
        setValue("tags", [...currentTags, newTag], { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setValue("tags", currentTags.filter((t) => t !== tag), { shouldValidate: true });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const updateData = { ...data, updatedAt: new Date() };
      console.log("Updating Prompt:", prompt._id, updateData);
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessMessage("Changes saved!");
      if (onSuccess) setTimeout(onSuccess, 900);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Edit prompt form"
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <FieldGroup id="upd-title" label="Prompt Title" required error={errors.title?.message}>
        <StyledInput
          id="upd-title"
          placeholder="Prompt title"
          error={errors.title}
          {...register("title")}
        />
      </FieldGroup>

      {/* Description */}
      <FieldGroup id="upd-desc" label="Short Description" required error={errors.description?.message}>
        <StyledTextarea
          id="upd-desc"
          placeholder="What does this prompt do?"
          error={errors.description}
          rows={2}
          {...register("description")}
        />
      </FieldGroup>

      {/* Content */}
      <FieldGroup id="upd-content" label="Prompt Content" required error={errors.content?.message}>
        <StyledTextarea
          id="upd-content"
          placeholder="Full prompt body…"
          error={errors.content}
          rows={7}
          className="font-mono text-[12px] leading-relaxed"
          {...register("content")}
        />
      </FieldGroup>

      {/* Attributes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup id="upd-category" label="Category" required error={errors.category?.message}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <StyledSelect
                id="upd-category"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select category"
                options={CATEGORIES}
                error={errors.category}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="upd-aitool" label="AI Tool" required error={errors.aiTool?.message}>
          <Controller
            name="aiTool"
            control={control}
            render={({ field }) => (
              <StyledSelect
                id="upd-aitool"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select AI tool"
                options={AI_TOOLS}
                error={errors.aiTool}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="upd-difficulty" label="Difficulty" required error={errors.difficulty?.message}>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <StyledSelect
                id="upd-difficulty"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select difficulty"
                options={DIFFICULTIES}
                error={errors.difficulty}
              />
            )}
          />
        </FieldGroup>

        {/* Visibility pill toggle */}
        <FieldGroup id="upd-visibility" label="Visibility" required>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="Prompt visibility"
                className="flex h-10 items-center gap-1 bg-[#060608] border border-white/[0.08] rounded-xl p-1"
              >
                {["Public", "Private"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-lg text-xs font-medium cursor-pointer transition-all select-none
                      ${field.value === opt
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <input
                      type="radio"
                      name="upd-visibility"
                      value={opt}
                      checked={field.value === opt}
                      onChange={() => field.onChange(opt)}
                      aria-label={`Visibility: ${opt}`}
                      className="sr-only"
                    />
                    <span
                      className={`size-1.5 rounded-full transition-colors ${field.value === opt ? "bg-blue-400" : "bg-zinc-600"}`}
                      aria-hidden="true"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          />
        </FieldGroup>
      </div>

      {/* Tags */}
      <FieldGroup id="upd-tags" label="Tags" required error={errors.tags?.message}>
        <div
          className={`min-h-[42px] p-2 bg-[#060608] border rounded-xl flex flex-wrap gap-1.5 transition-all focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:border-blue-500/50
            ${errors.tags ? "border-red-500/40" : "border-white/[0.08]"}`}
          onClick={() => document.getElementById("upd-tags")?.focus()}
        >
          {currentTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 pl-2 pr-1 py-0.5 rounded-lg text-[11px] font-medium"
            >
              <TagIcon className="size-2.5 shrink-0" aria-hidden="true" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag: ${tag}`}
                className="size-3.5 flex items-center justify-center rounded hover:bg-blue-400/20 hover:text-white transition-colors outline-none"
              >
                <Xmark className="size-2.5" aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            id="upd-tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={currentTags.length === 0 ? "Add tags…" : ""}
            aria-label="Add a tag"
            disabled={currentTags.length >= 10}
            className="flex-1 min-w-[80px] bg-transparent text-white text-xs outline-none py-0.5 placeholder:text-zinc-600"
          />
        </div>
      </FieldGroup>

      {/* Thumbnail */}
      <FieldGroup id="upd-thumbnail" label="Thumbnail Image" required error={uploadError || errors.thumbnail?.message}>
        <label
          htmlFor="upd-thumbnail"
          className={`relative flex items-center gap-3 h-14 px-4 bg-[#060608] border rounded-xl cursor-pointer group transition-all
            ${(errors.thumbnail || uploadError) ? "border-red-500/40" : "border-white/[0.08] hover:border-blue-500/30"}`}
        >
          {thumbnailPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnailPreview} alt="Current thumbnail" className="size-8 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 font-medium truncate">Thumbnail uploaded</p>
                <p className="text-[10px] text-zinc-500">Click to replace</p>
              </div>
            </>
          ) : (
            <>
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 transition-colors">
                <Picture className="size-4 text-zinc-500 group-hover:text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Upload thumbnail</p>
                <p className="text-[10px] text-zinc-600">PNG, JPG · max 5 MB</p>
              </div>
            </>
          )}

          {isUploadingImage && (
            <div className="absolute inset-0 rounded-xl bg-[#060608]/80 flex items-center justify-center gap-2">
              <Spinner size="sm" color="primary" />
              <span className="text-xs text-zinc-300">Uploading…</span>
            </div>
          )}

          <input
            id="upd-thumbnail"
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload thumbnail image"
            onChange={handleFileUpload}
            disabled={isUploadingImage || isSubmitting}
          />
        </label>
      </FieldGroup>

      {/* Submit */}
      <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-sm"
          >
            <Check className="size-4 shrink-0" aria-hidden="true" />
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          aria-label={isSubmitting ? "Saving changes, please wait" : "Save changes"}
          className="w-full h-10 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" color="white" />
              Saving…
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}