type ProgressListener = (progress: number) => void;
type ScrollListener = (scrolling: boolean) => void;

let bound = false;
let progress = 0;
let scrolling = false;
let settleTimer = 0;

const progressListeners = new Set<ProgressListener>();
const scrollListeners = new Set<ScrollListener>();

function publishProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const next = height <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / height));
  if (Math.abs(next - progress) < 0.001) return;
  progress = next;
  progressListeners.forEach((listener) => listener(progress));
}

function setScrolling(next: boolean) {
  if (scrolling === next) return;
  scrolling = next;
  scrollListeners.forEach((listener) => listener(scrolling));
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;

  const onScroll = () => {
    publishProgress();
    setScrolling(true);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => setScrolling(false), 140);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", publishProgress);
  publishProgress();
}

export function readScrollProgress() {
  return progress;
}

export function readIsScrolling() {
  return scrolling;
}

export function subscribeScrollProgress(listener: ProgressListener) {
  bind();
  progressListeners.add(listener);
  listener(progress);
  return () => {
    progressListeners.delete(listener);
  };
}

export function subscribeScrolling(listener: ScrollListener) {
  bind();
  scrollListeners.add(listener);
  listener(scrolling);
  return () => {
    scrollListeners.delete(listener);
  };
}
