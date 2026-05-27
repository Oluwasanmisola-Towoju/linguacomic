import { useState, useRef, useCallback } from "react";
import styles from './UploadZone.module.css';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function UploadZone({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const validate = (file) => {
        if (!ACCEPTED.includes(file.type)) {
            return 'ONLY JPEG, PNG AND WEBP FILES ARE SUPPORTED';
        }

        if (file.size > 20 * 1024 * 1024) {
            return 'File must be under 20mb';
        }

        return null;
    };

    const handleFile = useCallback((file) => {
        // first clear pevious error on new attempt
        setError('');
        const validationError = validate(file);
        if (validationError) {
            setError(validationError);
            return;
        }
        // pass the file to parent component
        onUpload(file);
    }, [onUpload]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file)
        }
    }, [handleFile]);

    const onDragOver = (e) => {
        // added to prevent browser from opening the file
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onInputChange = (e) => {
        if (e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
    <div
      className={`${styles.zone} ${isDragging ? styles.dragging : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload comic page"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />

      <div className={styles.iconRing}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>

      <p className={styles.heading}>Drop your comic page here</p>
      <p className={styles.sub}>or <span className={styles.link}>browse files</span></p>
      <p className={styles.formats}>PNG · JPEG · WebP · up to 20MB</p>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}