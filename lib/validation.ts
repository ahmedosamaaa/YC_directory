import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(3).max(20),
    // link: z
    //     .string()
    //     .url()
    //     .refine(async (url) => {
    //         try {
    //             const res = await fetch(url, { method: "HEAD" });
    //             const contentType = res.headers.get("content-type");
    //             return contentType?.startsWith("image/");
    //         } catch {
    //             return false;
    //         }
    //     }),
    pitch: z.string().min(10),
    image: z
        .instanceof(File, {
            message: "Please select an image file.",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`,
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Please upload a valid image file (JPEG, PNG, or WebP).",
        }),
});
