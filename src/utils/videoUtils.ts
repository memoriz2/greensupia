// YouTube URL에서 썸네일 추출 유틸리티
export const extractYouTubeThumbnail = (url: string): string | null => {
  try {
    // YouTube URL 패턴들
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        // 고화질 썸네일 URL 반환 (maxresdefault.jpg)
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    return null;
  } catch (error) {
    console.error("YouTube 썸네일 추출 실패:", error);
    return null;
  }
};

// Vimeo URL에서 썸네일 추출 (Vimeo는 API가 필요하므로 기본 이미지 반환)
export const extractVimeoThumbnail = (url: string): string | null => {
  try {
    const pattern = /vimeo\.com\/(\d+)/;
    const match = url.match(pattern);
    if (match && match[1]) {
      // Vimeo는 API가 필요하므로 기본 이미지 반환
      return `https://vumbnail.com/${match[1]}.jpg`;
    }
    return null;
  } catch (error) {
    console.error("Vimeo 썸네일 추출 실패:", error);
    return null;
  }
};

// iframe 코드에서 YouTube video ID 추출 (썸네일용)
export const extractYouTubeVideoIdFromIframe = (
  iframeCode: string
): string | null => {
  try {
    // iframe src에서 YouTube URL 추출
    const srcMatch = iframeCode.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      const src = srcMatch[1];

      // YouTube embed URL에서 video ID 추출
      const embedMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch && embedMatch[1]) {
        return embedMatch[1];
      }
    }
    return null;
  } catch (error) {
    console.error("iframe에서 YouTube video ID 추출 실패:", error);
    return null;
  }
};

// 입력된 텍스트를 정리 (iframe 코드는 그대로 유지)
export const normalizeVideoUrl = (input: string): string => {
  const trimmed = input.trim();

  // iframe 코드인 경우 그대로 반환
  if (trimmed.includes("<iframe") && trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }

  // 이미 올바른 URL인 경우 그대로 반환
  return trimmed;
};

// 비디오 URL 유효성 검증
export const validateVideoUrl = (
  url: string
): { isValid: boolean; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: "URL을 입력해주세요." };
  }

  // iframe 코드인지 확인
  if (url.includes("<iframe") && url.includes("youtube.com/embed/")) {
    return { isValid: true };
  }

  // YouTube, Vimeo 등 일반적인 비디오 플랫폼 URL 패턴 검증
  const videoUrlPatterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^https?:\/\/(www\.)?vimeo\.com\/.+/,
    /^https?:\/\/(www\.)?dailymotion\.com\/.+/,
    /^https?:\/\/.+\.(mp4|webm|ogg|mov|avi)$/i,
  ];

  const isValidUrl = videoUrlPatterns.some((pattern) => pattern.test(url));

  if (!isValidUrl) {
    return {
      isValid: false,
      error:
        "올바른 비디오 URL을 입력해주세요. (YouTube, Vimeo, 또는 직접 비디오 파일 URL)",
    };
  }

  return { isValid: true };
};

// URL에서 자동으로 썸네일 추출
export const extractThumbnailFromUrl = (url: string): string | null => {
  // iframe 코드인 경우 video ID 추출 후 썸네일 생성
  if (url.includes("<iframe") && url.includes("youtube.com/embed/")) {
    const videoId = extractYouTubeVideoIdFromIframe(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  // 일반 URL인 경우 기존 로직 사용
  const normalizedUrl = normalizeVideoUrl(url);

  // YouTube 썸네일 추출
  const youtubeThumbnail = extractYouTubeThumbnail(normalizedUrl);
  if (youtubeThumbnail) return youtubeThumbnail;

  // Vimeo 썸네일 추출
  const vimeoThumbnail = extractVimeoThumbnail(normalizedUrl);
  if (vimeoThumbnail) return vimeoThumbnail;

  return null;
};
