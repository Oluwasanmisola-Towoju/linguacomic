import { useState } from 'react';
import './styles/globals.css';
import UploadZone from './components/UploadZone/UploadZone';
import ComicWorkspace from './components/ComicWorkspace/ComicWorkspace';
import { uploadComic } from './services/api';
import styles from './App.module.css';

export default function App() {
  const [job, setJob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const result = await uploadComic(file);
      setJob(result);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setJob(null);
    setUploadError('');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>ComicLingo</span>
        </div>
        <nav className={styles.nav}>
          {job && (
            <button className={styles.resetBtn} onClick={handleReset}>
              ← New Upload
            </button>
          )}
          <span className={styles.badge}>Prototype</span>
        </nav>
      </header>

      <main className={styles.main}>
        {!job ? (
          <div className={styles.uploadView}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>Translate comics<br />into any language.</h1>
              <p className={styles.subtitle}>
                Upload a comic page. AI detects the speech bubbles, extracts the text,
                translates it and then redraws it back into the original bubbles.
              </p>
            </div>

            {isUploading ? (
              <div className={styles.uploading}>
                <div className={styles.spinner} />
                <p>Uploading…</p>
              </div>
            ) : (
              <UploadZone onUpload={handleUpload} />
            )}

            {uploadError && (
              <p className={styles.uploadError}>{uploadError}</p>
            )}
          </div>
        ) : (
          <div className={styles.workspaceView}>
            <ComicWorkspace job={job} />
          </div>
        )}
      </main>
    </div>
  );
}