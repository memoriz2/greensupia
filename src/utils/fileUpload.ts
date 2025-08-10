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

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "업로드 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      imageUrl: data.imageUrl,
      fileName: data.fileName,
    };
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    return {
      success: false,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

export const validateImageFile = (file: File): string | null => {
  // 파일 타입 검증
  if (!file.type.startsWith("image/")) {
    return "이미지 파일만 업로드 가능합니다.";
  }

  // 파일 크기 검증 (50MB 제한)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return "파일 크기는 50MB 이하여야 합니다.";
  }

  return null;
};

export const deleteImage = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error("파일 삭제 에러:", error);
    return false;
  }
};
