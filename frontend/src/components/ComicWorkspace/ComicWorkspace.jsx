import styles from './ComicWorkspace.module.css';
import BubbleOverlay from './BubbleOverlay';
import TranslationPanel from '../TranslationPanel/TranslationPanel';
import { getImageURL } from '../../services/api';

export default function ComicWorkspace({
  job,
  detection,
  bubbles,
  selectedId,
  isDetecting,
  detectError,
  warning,
  onDetect,
  onSelect,
  onUpdateText,
  onRemove,
}) {
  // derived state to check if we should render post-detection UI
  const hasDetection = bubbles.length > 0;

  return (
    <div className={styles.shell}>
      {/* Canvas area to the left side */}
      <div className={styles.canvasCol}>
        <div className={styles.canvasHeader}>
          <div className={styles.fileInfo}>
            <span className={styles.filename}>{job.filename}</span>
            <span className={styles.dims}>{job.width} × {job.height}px</span>
            {hasDetection && (
              <span className={styles.bubbleCount}>{bubbles.length} bubbles</span>
            )}
          </div>
          <span className={styles.jobId}>Job: {job.job_id.slice(0, 8)}…</span>
        </div>

        <div className={styles.canvasArea}>
          <div className={styles.imageWrap}>
            <img
              src={getImageURL(job.image_url)}
              alt="Uploaded comic page"
              className={styles.comicImage}
            />
            {hasDetection && (
              <BubbleOverlay
                bubbles={bubbles}
                imageNaturalWidth={detection.image_width}
                imageNaturalHeight={detection.image_height}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            )}
          </div>
        </div>
          
        {/* toolbar pinned to bottom */}
        <div className={styles.toolbar}>
          <button
            className={`${styles.toolBtn} ${hasDetection ? styles.toolBtnDone : styles.toolBtnActive}`}
            onClick={onDetect}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <div className={styles.btnSpinner} />
                Detecting…
              </>
            ) : hasDetection ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {bubbles.length} Bubbles Found — Re-detect
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Detect Bubbles
              </>
            )}
          </button>

          <button className={styles.toolBtn} disabled title="Coming in Phase 4">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="m2 5 3 3"/><path d="m18 16 2 2"/><path d="m14 19 6-6-3-3"/></svg>
            Translate
          </button>

          <button className={styles.toolBtn} disabled title="Coming in Phase 5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
        </div>

        {detectError && (
          <div className={styles.errorBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {detectError}
          </div>
        )}
      </div>

      {/* Side panel is only visible after detection at the right side */}
      {hasDetection && (
        <TranslationPanel
          bubbles={bubbles}
          selectedId={selectedId}
          onSelect={onSelect}
          onUpdateText={onUpdateText}
          onRemove={onRemove}
          warning={warning}
        />
      )}
    </div>
  );
}