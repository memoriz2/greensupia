export interface UploadedFile {
  fileName: string;
  filePath: string;
  fileSize: number;
}

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  error?: string;
}

// URL 생성 헬퍼 함수 (환경 변수만 사용)
function getUploadUrl(): string {
  // 서버 사이드에서 실행 중인지 확인
  if (typeof window === "undefined") {
    // 서버 사이드: 환경 변수만 사용
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.DOMAIN_URL;

    if (!baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL 또는 DOMAIN_URL 환경 변수가 설정되지 않았습니다."
      );
    }

    return `${baseUrl}/api/upload`;
  } else {
    // 클라이언트 사이드: 상대 경로 사용
    return "/api/upload";
  }
}

export const uploadImage = async (
  file: File,
  folder?: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const uploadUrl = getUploadUrl();
    console.log("Upload URL:", uploadUrl); // 디버깅용

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.details || "업로드 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      imageUrl: data.imageUrl,
      fileName: data.fileName,
    };
  } catch (error) {
    console.error("이미지 업로드 오류:", error);

    // 더 구체적인 에러 메시지
    let errorMessage = "네트워크 오류가 발생했습니다.";

    if (error instanceof Error) {
      if (
        error.message.includes("Invalid URL") ||
        error.message.includes("Failed to parse URL")
      ) {
        errorMessage = "잘못된 URL 형식입니다. 서버 설정을 확인해주세요.";
      } else if (error.message.includes("fetch")) {
        errorMessage =
          "서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.";
      } else if (error.message.includes("ENOENT")) {
        errorMessage =
          "파일 경로를 찾을 수 없습니다. 폴더 권한을 확인해주세요.";
      } else if (error.message.includes("EACCES")) {
        errorMessage = "파일 접근 권한이 없습니다. 폴더 권한을 확인해주세요.";
      } else if (error.message.includes("환경 변수가 설정되지 않았습니다")) {
        errorMessage = "서버 설정 오류. 환경 변수를 확인해주세요.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const validateImageFile = (file: File): string | null => {
  // 파일 존재 여부 확인
  if (!file) {
    return "파일이 선택되지 않았습니다.";
  }

  // 파일 타입 검증
  if (!file.type.startsWith("image/")) {
    return "이미지 파일만 업로드 가능합니다.";
  }

  // 지원하는 이미지 형식 확인
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    return "지원하지 않는 이미지 형식입니다. JPEG, PNG, GIF, WebP 형식을 사용해주세요.";
  }

  // 파일 크기 검증 (50MB 제한)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return "파일 크기는 50MB 이하여야 합니다.";
  }

  // 파일명 검증
  if (file.name.length > 255) {
    return "파일명이 너무 깁니다. 255자 이하로 설정해주세요.";
  }

  // 특수문자 제한
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(file.name)) {
    return "파일명에 사용할 수 없는 문자가 포함되어 있습니다.";
  }

  return null;
};

export const deleteImage = async (filePath: string): Promise<boolean> => {
  try {
    // 파일 경로 검증
    if (!filePath || filePath.trim() === "") {
      console.error("파일 경로가 유효하지 않습니다:", filePath);
      return false;
    }

    const response = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("파일 삭제 API 오류:", data.error || data.details);
      return false;
    }

    return data.success || false;
  } catch (error) {
    console.error("파일 삭제 에러:", error);

    // 구체적인 에러 메시지
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        console.error("서버 연결 실패");
      } else if (error.message.includes("JSON")) {
        console.error("응답 파싱 실패");
      } else {
        console.error("알 수 없는 오류:", error.message);
      }
    }

    return false;
  }
};
