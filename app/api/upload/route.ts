import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Allowed image MIME types
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

// Maximum file size (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Check for either 'file' (single) or 'files' (multiple)
    const filesToProcess: File[] = [];
    
    const fileEntries = formData.getAll("files");
    if (fileEntries.length > 0) {
      for (const entry of fileEntries) {
        if (entry instanceof File) {
          filesToProcess.push(entry);
        }
      }
    }

    const singleFile = formData.get("file");
    if (singleFile instanceof File && !filesToProcess.includes(singleFile)) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { error: "No image file provided in request." },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of filesToProcess) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported. Please upload JPEG, PNG, WebP, GIF, or SVG images.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds the 10MB size limit.` },
          { status: 400 }
        );
      }

      // Generate clean unique filename
      const originalExt = path.extname(file.name) || ".jpg";
      const sanitizedName = file.name
        .replace(originalExt, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 30);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `${sanitizedName}-${uniqueSuffix}${originalExt}`;

      const filePath = path.join(uploadsDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image file." },
      { status: 500 }
    );
  }
}
