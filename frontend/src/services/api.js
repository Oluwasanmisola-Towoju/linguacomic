const BASE_URL = 'http://localhost:8000';

export async function uploadComic(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        // parse any backend JSON error
        const err = await res.json().catch(() => ({
            detail: 'Upload failed'
        }));

        // throw it so that the react component can catch and display it
        throw new Error(err.detail || 'Upload failed');
    }

    return res.json(); // should return the job_id, filename, image_url, width and height
}

// utility function to resolve relative image paths to absolute backend URL
export function getImageURL(path) {
    return `${BASE_URL}${path}`;
}