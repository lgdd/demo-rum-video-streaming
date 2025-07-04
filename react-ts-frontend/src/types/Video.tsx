export interface VideoMetadata {
  title: string;
}

export interface VideoPlaybackId {
  id: string;
  policy: string;
}

export interface Video {
  id: string;
  meta: VideoMetadata;
  playback_ids: VideoPlaybackId[];
}
