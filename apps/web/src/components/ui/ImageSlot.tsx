import { useState } from 'react';

/**
 * Renders an image, or a labelled placeholder when the file is missing.
 *
 * The placeholder is the base layer, so it shows immediately — including for
 * lazy images still below the fold, and until a real file loads. Drop a file at
 * the path in `src` (under `apps/web/public`) and it appears automatically, no
 * code change needed.
 */
export function ImageSlot({
  src,
  alt,
  hint,
  className = '',
}: {
  src?: string | null;
  alt: string;
  /** Optional label overriding the alt text in the placeholder. */
  hint?: string;
  className?: string;
}): React.ReactNode {
  const [status, setStatus] = useState<'pending' | 'loaded' | 'failed'>(
    'pending',
  );
  const showImage = Boolean(src) && status === 'loaded';

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-surface-2 p-4 text-center ${
        showImage ? '' : 'border border-dashed border-line-strong'
      } ${className}`}
    >
      <div
        aria-hidden={showImage || undefined}
        className="flex flex-col items-center justify-center gap-1"
      >
        <span aria-hidden className="text-2xl opacity-70">
          🖼️
        </span>
        <span className="text-xs font-medium text-subtle">{hint ?? alt}</span>
        {src ? (
          <code className="max-w-full truncate text-[10px] text-subtle/80">
            {src}
          </code>
        ) : null}
      </div>

      {src && status !== 'failed' ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
            showImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}
    </div>
  );
}
