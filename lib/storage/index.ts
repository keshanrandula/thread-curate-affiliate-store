/**
 * Swappable Image Upload Service
 * Supports Local filesystem (/api/upload), Direct URL entry, Cloudinary, or Base64.
 */

export interface UploadResult {
  url: string;
  provider: "local" | "cloudinary" | "uploadthing" | "direct-url" | "base64";
  publicId?: string;
}

export interface StorageProvider {
  name: string;
  upload(file: File | string): Promise<UploadResult>;
}

// 1. Local Filesystem Provider (Saves to /public/uploads/ via API route)
export class LocalStorageProvider implements StorageProvider {
  name = "local";

  async upload(file: File | string): Promise<UploadResult> {
    if (typeof file === "string") {
      return { url: file, provider: "local" };
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      url: data.url,
      provider: "local",
    };
  }
}

// 2. Direct Image URL Provider (for pasting external image links directly)
export class DirectUrlStorageProvider implements StorageProvider {
  name = "direct-url";

  async upload(input: File | string): Promise<UploadResult> {
    if (typeof input !== "string") {
      // Fallback to local storage if a File is provided
      return new LocalStorageProvider().upload(input);
    }

    if (!input.startsWith("http://") && !input.startsWith("https://") && !input.startsWith("/")) {
      throw new Error("Invalid image URL. Must begin with http://, https:// or /");
    }
    return {
      url: input,
      provider: "direct-url",
    };
  }
}

// 3. Cloudinary Storage Provider
export class CloudinaryStorageProvider implements StorageProvider {
  name = "cloudinary";

  async upload(file: File | string): Promise<UploadResult> {
    if (typeof file === "string" && (file.startsWith("http") || file.startsWith("/"))) {
      return { url: file, provider: "cloudinary" };
    }

    if (typeof file === "string") {
      return { url: file, provider: "cloudinary" };
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      url: data.url,
      provider: "cloudinary",
      publicId: data.publicId,
    };
  }
}

// 4. Base64 Storage Provider (fallback)
export class Base64StorageProvider implements StorageProvider {
  name = "base64";

  async upload(file: File | string): Promise<UploadResult> {
    if (typeof file === "string") {
      return { url: file, provider: "base64" };
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          provider: "base64",
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

// Factory function to get active provider
export function getStorageProvider(
  preferredProvider?: "local" | "cloudinary" | "direct-url" | "base64"
): StorageProvider {
  const provider =
    preferredProvider ||
    (process.env.STORAGE_PROVIDER as any) ||
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "cloudinary" : "local");

  switch (provider) {
    case "cloudinary":
      return new CloudinaryStorageProvider();
    case "base64":
      return new Base64StorageProvider();
    case "direct-url":
      return new DirectUrlStorageProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}
