import { useState, useCallback } from 'react';
import { uploadComic, detectBubbles } from '../api'

export function useComicProcessor() {
    const [job, setJob] = useState(null);
    const [detection, setDetection] = useState(null);
    const [bubbles, setBubbles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [detectError, setDetectError] = useState('');
    const [warning, setWarning] = useState('');

    const handleUpload = useCallback(async (file) => {
        setIsUploading(true);
        setUploadError('');  // reset previous detection state on new upload
        setDetection(null);
        setBubbles([]);
        setSelectedId(null);

        try {
            const result = await uploadComic(file);
            setJob(result);
        }
        catch (err) {
            setUploadError(err.message);
        }
        finally {
            setIsUploading(false);
        }
    }, []);

    const handleDetect = useCallback(async () => {
        if (!job) {    // guard clause to prevent calls without a job
            return;
        }

        setIsDetecting(true);
        setDetectError('');
        setWarning('');
        setSelectedId(null);

        try {
            const result = await detectBubbles(job.job_id, job.filename);
            setDetection(result);
            setBubbles(result.bubbles);

            // capture and display warnings 
            if (result.warning) {
                setWarning(result.warning);
            }
        }
        catch (err) {
             setDetectError(err.message);   
        }
        finally {
            setIsDetecting(false);
        }
    }, [job]);

    // function for user to tweak the detected boxes
    const updateBubbleText = useCallback((id, newText) => {
        setBubbles(prev => prev.map(b => b.id === id ? { ...b, text: newText } : b));
    }, []);

    const removeBubble = useCallback((id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setSelectedId(null);
    }, []);

    const reset = useCallback(() => {
        // clears all states to a fresh session
        setJob(null);
        setDetection(null);
        setBubbles([]);
        setSelectedId(null);
        setUploadError('');
        setDetectError('');
        setWarning('');
    }, []);

    return {
        // States
        job,
        detection,
        bubbles,
        selectedId,
        isUploading,
        isDetecting,
        uploadError,
        detectError,
        warning,

        // Actions
        handleUpload,
        handleDetect,
        updateBubbleText,
        removeBubble,
        setSelectedId,
        reset
    };
}