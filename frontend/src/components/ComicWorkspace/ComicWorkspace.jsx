import styles from './ComicWorkspace.module.css';
import { getImageURL } from '../../services/api';

export default function ComicWorkspace({ job }) {
  // if no job exists render nothing to prevent crashes
  if (!job) return null;

  return (
    <div className={styles.workspace}>
      <div className={styles.header}>
        <div className={styles.fileInfo}>
          <span className={styles.filename}>{job.filename}</span>
          <span className={styles.dims}>{job.width} × {job.height}px</span>
        </div>
        <span className={styles.jobId}>Job: {job.job_id.slice(0, 8)}…</span>
      </div>

      <div className={styles.canvasArea}>
        <div className={styles.imageWrap}>
          <img
            src={getImageUrl(job.image_url)}
            alt="Uploaded comic page"
            className={styles.comicImage}
          />
          {/* BubbleOverlay will be placed here later on not now sha*/}
        </div>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled title="Coming Soon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Detect Bubbles
        </button>
        <button className={styles.toolBtn} disabled title="Coming Soon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="m2 5 3 3"/><path d="m18 16 2 2"/><path d="m14 19 6-6-3-3"/><path d="m20 17 2 1"/></svg>
          Translate
        </button>
        <button className={styles.toolBtn} disabled title="Coming Soon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
      </div>
    </div>
  );
}