import './styles/globals.css';
import UploadZone from './components/UploadZone/UploadZone';
import ComicWorkspace from './components/ComicWorkspace/ComicWorkspace';
import { useComicProcessor } from './services/hooks/useComicProcessor';
import styles from './App.module.css';

export default function App() {
  const processor = useComicProcessor();

  // clean destructuring of all state and actions
  const {
    job,
    detection,
    bubbles,
    selectedId,
    isUploading,
    isDetecting,
    uploadError,
    detectError,
    handleUpload,
    handleDetect,
    updateBubbleText,
    removeBubble,
    setSelectedId,
    reset,
    warning
  } = processor

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>ComicLingo</span>
        </div>
        <nav className={styles.nav}>
          {job && (
            <button className={styles.resetBtn} onClick={reset}>
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
                translates it — then redraws it back into the original bubbles.
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
            {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
          </div>
        ) : (
          <ComicWorkspace
            job={job}
            detection={detection}
            bubbles={bubbles}
            selectedId={selectedId}
            isDetecting={isDetecting}
            detectError={detectError}
            warning={warning}
            onDetect={handleDetect}
            onSelect={setSelectedId}
            onUpdateText={updateBubbleText}
            onRemove={removeBubble}
          />
        )}
      </main>
    </div>
  );
}