"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, X, UploadCloud } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (base64Data: string | null, mimeType: string | null) => void;
  label?: string;
}

export default function ImageUpload({ onImageSelected, label = "Reference Image" }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      
      // Extract clean base64 data (without data:image/png;base64, prefix)
      const base64Clean = base64String.split(",")[1];
      onImageSelected(base64Clean, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageSelected(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label} (Optional)</label>
      
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-28 flex items-center justify-center group">
          <img src={previewUrl} alt="Preview" className="h-full object-contain max-w-full" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 h-28
            ${dragActive ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="w-6 h-6 text-gray-500 mb-1" />
          <span className="text-[11px] text-gray-300 font-medium">Add screenshots / visual references</span>
          <span className="text-[9px] text-gray-500 mt-0.5">Drag & drop or click to upload</span>
        </div>
      )}
    </div>
  );
}
