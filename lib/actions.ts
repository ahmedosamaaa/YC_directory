"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "./utils";
import { client } from "@/sanity/lib/client";

export const createPitch = async (
    state: any,
    form: FormData,
    pitch: string,
    selectedFile: File
) => {
    const session = await auth();

    // Check if user is authenticated
    if (!session) {
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR",
        });
    }

    // Extract form data excluding pitch
    const { title, description, category } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    );

    // Ensure a file is selected
    if (!selectedFile) {
        return parseServerActionResponse({
            error: "No image file provided",
            status: "ERROR",
        });
    }

    try {
        // Upload the image to Sanity
        const imageUploadResponse = await client.assets.upload(
            "image",
            selectedFile,
            {
                contentType: selectedFile.type,
                filename: selectedFile.name,
            }
        );

        // Create slug from title
        const slug = slugify(title as string, { lower: true, strict: true });

        // Prepare the startup document with image reference
        const startup = {
            title,
            description,
            category,
            slug: {
                _type: "slug",
                current: slug, // Correct slug structure
            },
            author: {
                _type: "reference",
                _ref: session?.id,
            },
            pitch,

            image: {
                asset: {
                    _ref: imageUploadResponse._id, // Use the asset _id from the upload response
                    _type: "reference", // Reference to the uploaded image asset
                },
            },
        };

        // Create the startup document in Sanity
        const result = await writeClient.create({
            _type: "startup",
            ...startup,
        });

        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log("Error during image upload or document creation:", error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};
