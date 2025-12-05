/**
 * Represents a local image file with optional folder path.
 */
export interface LocalImage {
    /**
     * Optional folder path where the image is located.
     */
    folder?: string;

    /**
     * The file name of the image.
     */
    file: string;

    /**
     * The alt text for the image.
     */
    alt?: string;
}
