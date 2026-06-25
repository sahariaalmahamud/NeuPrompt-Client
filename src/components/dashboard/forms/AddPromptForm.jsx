"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Button,
    Spinner,
} from "@heroui/react";
import {
    Picture,
    Xmark,
    Tag as TagIcon,
    Check,
    ChevronDown,
} from "@gravity-ui/icons";
import { createPrompt } from "@/lib/actions/prompts";

// ─── 1. Validation Schema ────────────────────────────────────────────────────
const promptSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    content: z.string().min(20, "Prompt content must be at least 20 characters."),
    category: z.string().min(1, "Please select a category."),
    aiTool: z.string().min(1, "Please select an AI tool."),
    difficulty: z.string().min(1, "Please select a difficulty level."),
    tags: z.array(z.string()).min(1, "At least one tag is required."),
    thumbnail: z.string().url("Please upload a valid thumbnail image."),
    visibility: z.enum(["Public", "Private"]),
});

// ─── 2. Static data ──────────────────────────────────────────────────────────
const CATEGORIES = [
    "Writing", "Marketing", "Coding", "Business", "Education",
    "Productivity", "Design", "Social Media", "Research", "Other",
];
const AI_TOOLS = ["ChatGPT", "Claude", "Gemini", "Grok", "Perplexity", "Copilot", "Midjourney"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// ─── 3. Reusable Field wrapper ────────────────────────────────────────────────
function FieldGroup({ id, label, required, error, hint, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-sm font-medium text-zinc-300 select-none"
            >
                {label}
                {required && <span className="text-blue-500 ml-0.5" aria-hidden="true">*</span>}
            </label>
            {hint && <p className="text-xs text-zinc-500 -mt-0.5">{hint}</p>}
            {children}
            {error && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1">
                    <span className="inline-block size-1 rounded-full bg-red-400 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── 4. Input / Textarea primitives ──────────────────────────────────────────
function StyledInput({ id, error, className = "", ...props }) {
    return (
        <input
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full bg-[#030303] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200
        focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/60
        ${error ? "border-red-500/50" : "border-white/10 hover:border-white/20"}
        ${className}`}
            {...props}
        />
    );
}

function StyledTextarea({ id, error, className = "", ...props }) {
    return (
        <textarea
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full bg-[#030303] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 resize-y
        focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/60
        ${error ? "border-red-500/50" : "border-white/10 hover:border-white/20"}
        ${className}`}
            {...props}
        />
    );
}

// ─── 5. Native <select> dropdown (zero HeroUI Dropdown API issues) ────────────
function StyledSelect({ id, error, value, onChange, placeholder, options }) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full appearance-none bg-[#030303] border rounded-xl h-11 px-4 pr-10 text-sm outline-none transition-all duration-200 cursor-pointer
          focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/60
          ${error ? "border-red-500/50 text-red-400" : "border-white/10 hover:border-white/20"}
          ${value ? "text-zinc-200" : "text-zinc-500"}`}
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0d0d10] text-zinc-200">
                        {opt}
                    </option>
                ))}
            </select>
            <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                aria-hidden="true"
            />
        </div>
    );
}

// ─── 6. Section header ───────────────────────────────────────────────────────
function SectionHeader({ number, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 pb-4 border-b border-white/5">
            <span className="flex-shrink-0 size-7 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-[11px] font-bold text-blue-400 font-mono mt-0.5">
                {number}
            </span>
            <div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddPromptForm({ user }) {
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
        formState: { errors },
    } = useForm({
        resolver: zodResolver(promptSchema),
        defaultValues: {
            title: "",
            description: "",
            content: "",
            category: "",
            aiTool: "",
            difficulty: "",
            tags: [],
            thumbnail: "",
            visibility: "Public",
        },
    });

    const thumbnailPreview = watch("thumbnail");
    const currentTags = watch("tags");

    // ── Image upload ────────────────────────────────────────────────────────────
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("Image must be smaller than 5 MB.");
            return;
        }
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

    const removeTag = (tagToRemove) => {
        setValue("tags", currentTags.filter((t) => t !== tagToRemove), { shouldValidate: true });
    };

    // ── Submit ──────────────────────────────────────────────────────────────────
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSuccessMessage("");
        try {
            const promptData = {
                ...data,
                creatorId: user?.id,
                creatorName: user?.name,
                creatorEmail: user?.email,
                role: user?.role,
                status: "pending",
                copyCount: 0,
                bookmarkCount: 0,
                rating: 0,
                totalRatings: 0,
                featured: false,
                createdAt: new Date(),
            };

            const res = await createPrompt(promptData);

            if (res.insertId) {
                await new Promise((r) => setTimeout(r, 1500));
                setSuccessMessage("Prompt submitted! It will be reviewed before going live.");
                e.currentTarget.reset();
            }


        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-[#0a0a0c]/90 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] overflow-hidden">

            {/* Top accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    aria-label="Create new prompt form"
                    className="flex flex-col gap-8 sm:gap-10"
                >

                    {/* ── Section 1: Basic Info ─────────────────────────────────────── */}
                    <section aria-labelledby="section-basic">
                        <SectionHeader
                            number="01"
                            title="Basic Info"
                            subtitle="Give your prompt a clear title and description."
                        />
                        <div className="mt-5 flex flex-col gap-5">
                            <FieldGroup
                                id="title"
                                label="Prompt Title"
                                required
                                error={errors.title?.message}
                            >
                                <StyledInput
                                    id="title"
                                    placeholder="e.g., Ultimate SEO Blog Post Generator"
                                    error={errors.title}
                                    {...register("title")}
                                />
                            </FieldGroup>

                            <FieldGroup
                                id="description"
                                label="Short Description"
                                required
                                error={errors.description?.message}
                            >
                                <StyledTextarea
                                    id="description"
                                    placeholder="Briefly describe what this prompt does and who it's for…"
                                    error={errors.description}
                                    rows={3}
                                    {...register("description")}
                                />
                            </FieldGroup>
                        </div>
                    </section>

                    {/* ── Section 2: Prompt Content ─────────────────────────────────── */}
                    <section aria-labelledby="section-content">
                        <SectionHeader
                            number="02"
                            title="Prompt Content"
                            subtitle="The exact prompt structure. Use [brackets] for variables."
                        />
                        <div className="mt-5">
                            <FieldGroup
                                id="content"
                                label="Prompt Body"
                                required
                                error={errors.content?.message}
                            >
                                <StyledTextarea
                                    id="content"
                                    placeholder="Enter the full prompt here. Use [topic], [tone], [audience] for customizable variables…"
                                    error={errors.content}
                                    rows={10}
                                    className="font-mono text-[13px] leading-relaxed min-h-[220px] sm:min-h-[280px]"
                                    {...register("content")}
                                />
                            </FieldGroup>
                        </div>
                    </section>

                    {/* ── Section 3: Attributes ─────────────────────────────────────── */}
                    <section aria-labelledby="section-attributes">
                        <SectionHeader
                            number="03"
                            title="Attributes"
                            subtitle="Categorize your prompt so the right people find it."
                        />
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Category */}
                            <FieldGroup id="category" label="Category" required error={errors.category?.message}>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <StyledSelect
                                            id="category"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select category"
                                            options={CATEGORIES}
                                            error={errors.category}
                                        />
                                    )}
                                />
                            </FieldGroup>

                            {/* AI Tool */}
                            <FieldGroup id="aiTool" label="AI Tool" required error={errors.aiTool?.message}>
                                <Controller
                                    name="aiTool"
                                    control={control}
                                    render={({ field }) => (
                                        <StyledSelect
                                            id="aiTool"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select AI tool"
                                            options={AI_TOOLS}
                                            error={errors.aiTool}
                                        />
                                    )}
                                />
                            </FieldGroup>

                            {/* Difficulty */}
                            <FieldGroup id="difficulty" label="Difficulty" required error={errors.difficulty?.message}>
                                <Controller
                                    name="difficulty"
                                    control={control}
                                    render={({ field }) => (
                                        <StyledSelect
                                            id="difficulty"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select difficulty"
                                            options={DIFFICULTIES}
                                            error={errors.difficulty}
                                        />
                                    )}
                                />
                            </FieldGroup>

                            {/* Visibility */}
                            <FieldGroup id="visibility-group" label="Visibility" required>
                                <Controller
                                    name="visibility"
                                    control={control}
                                    render={({ field }) => (
                                        <div
                                            role="radiogroup"
                                            aria-labelledby="visibility-group-label"
                                            className="flex h-11 items-center gap-1 bg-[#030303] border border-white/10 rounded-xl p-1"
                                        >
                                            {["Public", "Private"].map((opt) => (
                                                <label
                                                    key={opt}
                                                    className={`flex-1 flex items-center justify-center gap-2 h-full rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 select-none
                            ${field.value === opt
                                                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner"
                                                            : "text-zinc-500 hover:text-zinc-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="visibility"
                                                        value={opt}
                                                        checked={field.value === opt}
                                                        onChange={() => field.onChange(opt)}
                                                        className="sr-only"
                                                        aria-label={`Visibility: ${opt}`}
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
                    </section>

                    {/* ── Section 4: Tags ───────────────────────────────────────────── */}
                    <section aria-labelledby="section-tags">
                        <SectionHeader
                            number="04"
                            title="Tags"
                            subtitle="Press Enter or comma after each tag. Maximum 10 tags."
                        />
                        <div className="mt-5">
                            <FieldGroup
                                id="tag-input"
                                label="Tags"
                                required
                                error={errors.tags?.message}
                            >
                                <div
                                    className={`min-h-[48px] p-2.5 bg-[#030303] border rounded-xl transition-all duration-200 flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-blue-500/60 focus-within:border-blue-500/60
                    ${errors.tags ? "border-red-500/50" : "border-white/10"}`}
                                    onClick={() => document.getElementById("tag-input")?.focus()}
                                >
                                    {currentTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium"
                                        >
                                            <TagIcon className="size-3 shrink-0" aria-hidden="true" />
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                aria-label={`Remove tag: ${tag}`}
                                                className="size-4 rounded flex items-center justify-center hover:bg-blue-400/20 hover:text-white transition-colors outline-none focus:ring-1 focus:ring-blue-400"
                                            >
                                                <Xmark className="size-3" aria-hidden="true" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="tag-input"
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder={currentTags.length === 0 ? "e.g. productivity, seo, python…" : "Add another…"}
                                        aria-label="Add a tag"
                                        className="flex-1 bg-transparent text-white text-sm outline-none min-w-[140px] py-1 placeholder:text-zinc-600"
                                        disabled={currentTags.length >= 10}
                                    />
                                </div>
                            </FieldGroup>
                        </div>
                    </section>

                    {/* ── Section 5: Thumbnail ──────────────────────────────────────── */}
                    <section aria-labelledby="section-thumbnail">
                        <SectionHeader
                            number="05"
                            title="Thumbnail"
                            subtitle="An eye-catching cover image helps your prompt stand out. Max 5 MB."
                        />
                        <div className="mt-5">
                            <FieldGroup
                                id="thumbnail-upload"
                                label="Cover Image"
                                required
                                error={uploadError || errors.thumbnail?.message}
                            >
                                <label
                                    htmlFor="thumbnail-upload"
                                    className={`relative w-full h-44 sm:h-56 lg:h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-[#030303] cursor-pointer group transition-all duration-300
                    ${(errors.thumbnail || uploadError) ? "border-red-500/40" : "border-white/10 hover:border-blue-500/40 hover:bg-[#0d0d10]"}`}
                                >
                                    {thumbnailPreview ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover opacity-75 group-hover:opacity-40 transition-opacity duration-300"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
                                                    <Picture className="size-4" aria-hidden="true" />
                                                    Change image
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-blue-400 transition-colors duration-200 select-none">
                                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                                <Picture className="size-6" aria-hidden="true" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Click to upload image</p>
                                                <p className="text-xs text-zinc-600 mt-0.5">PNG, JPG, WEBP · max 5 MB</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload overlay */}
                                    {isUploadingImage && (
                                        <div className="absolute inset-0 bg-[#030303]/85 backdrop-blur-sm flex flex-col items-center justify-center z-10 gap-3">
                                            <Spinner size="md" color="primary" />
                                            <span className="text-white text-sm font-medium">Uploading…</span>
                                        </div>
                                    )}

                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        aria-label="Upload thumbnail image"
                                        onChange={handleFileUpload}
                                        disabled={isUploadingImage || isSubmitting}
                                    />
                                </label>
                            </FieldGroup>
                        </div>
                    </section>

                    {/* ── Submit ────────────────────────────────────────────────────── */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row-reverse items-stretch sm:items-center gap-3">

                        {successMessage && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="w-full sm:flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                <Check className="size-4 shrink-0" aria-hidden="true" />
                                {successMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            isDisabled={isSubmitting || isUploadingImage}
                            aria-label={isSubmitting ? "Publishing prompt, please wait" : "Publish prompt"}
                            className="w-full sm:w-auto min-w-[180px] h-11 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all border border-blue-500/40 shrink-0"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Spinner size="sm" color="white" />
                                    Publishing…
                                </span>
                            ) : (
                                "Publish Prompt"
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}