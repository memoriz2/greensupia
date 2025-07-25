"use client";

import { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  height = 400,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] =
    useState(false);
  const [textColorPickerPosition, setTextColorPickerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [highlightColorPickerPosition, setHighlightColorPickerPosition] =
    useState({ x: 0, y: 0 });
  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [selectedHighlightColor, setSelectedHighlightColor] =
    useState("#FFFF00");

  // 글자체와 글자 크기 상태 추가
  const [selectedFontFamily, setSelectedFontFamily] = useState("기본");
  const [selectedFontSize, setSelectedFontSize] = useState("14px");

  // 글자체 옵션
  const fontFamilyOptions = [
    { value: "기본", label: "기본", font: "inherit" },
    { value: "고딕체", label: "고딕체", font: "Arial, sans-serif" },
    { value: "명조체", label: "명조체", font: "Times New Roman, serif" },
    { value: "궁서체", label: "궁서체", font: "Batang, serif" },
    { value: "돋움체", label: "돋움체", font: "Dotum, sans-serif" },
    { value: "바탕체", label: "바탕체", font: "Batang, serif" },
    { value: "맑은고딕", label: "맑은고딕", font: "Malgun Gothic, sans-serif" },
    { value: "나눔고딕", label: "나눔고딕", font: "Nanum Gothic, sans-serif" },
    { value: "나눔명조", label: "나눔명조", font: "Nanum Myeongjo, serif" },
  ];

  // 글자 크기 옵션
  const fontSizeOptions = [
    { value: "8px", label: "8pt" },
    { value: "10px", label: "10pt" },
    { value: "12px", label: "12pt" },
    { value: "14px", label: "14pt" },
    { value: "16px", label: "16pt" },
    { value: "18px", label: "18pt" },
    { value: "20px", label: "20pt" },
    { value: "24px", label: "24pt" },
    { value: "28px", label: "28pt" },
    { value: "32px", label: "32pt" },
    { value: "36px", label: "36pt" },
    { value: "48px", label: "48pt" },
    { value: "72px", label: "72pt" },
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // IME 설정 및 디버깅을 위한 useEffect
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute("spellcheck", "false");
      editorRef.current.setAttribute("autocorrect", "off");
      editorRef.current.setAttribute("autocomplete", "off");
    }
  }, []);

  // 입력 이벤트 처리 (로그 제거)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = (e: Event) => {
      e.stopPropagation();
    };

    editor.addEventListener("input", handleInput);
    return () => {
      editor.removeEventListener("input", handleInput);
    };
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // 강화된 커서 위치 저장 및 복원 함수
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    return range.cloneRange();
  };

  const restoreCursorPosition = (range: Range | null) => {
    if (!range || !editorRef.current) {
      console.warn("커서 복원 실패: range 또는 editorRef 없음");
      return;
    }
    try {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        console.log("커서 복원 성공:", range);
      }
    } catch (e) {
      console.warn("커서 복원 오류:", e);
      moveCursorToEnd();
    }
    editorRef.current.focus();
  };

  // 커서를 끝으로 이동하는 함수
  const moveCursorToEnd = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false); // 끝으로 이동
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
  };

  // 동적 색상 적용을 위한 CSS 변수 생성 함수
  const generateColorStyle = (color: string, type: "text" | "highlight") => {
    const styleId = `dynamic-color-${type}-${color.replace("#", "")}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
      console.log(`새로운 스타일 요소 생성: ${styleId}`);
    }

    const className = `dynamic-${type}-${color.replace("#", "")}`;
    const cssRule =
      type === "text"
        ? `.rich-text-editor [contenteditable] span.${className} { color: ${color} !important; }`
        : `.rich-text-editor [contenteditable] span.${className} { background-color: ${color} !important; }`;

    styleElement.textContent = cssRule;
    console.log(`CSS 규칙 생성: ${cssRule}`);
    console.log(`생성된 클래스명: ${className}`);

    // 스타일이 실제로 적용되었는지 확인
    setTimeout(() => {
      const testElement = document.createElement("span");
      testElement.className = className;
      testElement.style.position = "absolute";
      testElement.style.left = "-9999px";
      testElement.textContent = "test";

      // rich-text-editor 컨테이너에 추가하여 실제 환경과 동일하게 테스트
      const editorContainer = document.querySelector(
        ".rich-text-editor [contenteditable]"
      );
      if (editorContainer) {
        editorContainer.appendChild(testElement);

        const computedStyle = window.getComputedStyle(testElement);
        const appliedColor =
          type === "text" ? computedStyle.color : computedStyle.backgroundColor;
        console.log(
          `실제 적용된 ${type === "text" ? "색상" : "배경색"}: ${appliedColor}`
        );
        console.log(`요청한 ${type === "text" ? "색상" : "배경색"}: ${color}`);

        editorContainer.removeChild(testElement);
      }
    }, 100);

    return className;
  };

  // 색상 적용을 위한 강화된 함수 (동적 클래스 기반)
  const applyTextColor = (color: string) => {
    console.log(`=== applyTextColor 시작 === ${color}`);
    if (!editorRef.current) {
      console.log("에디터 참조 없음");
      return;
    }

    editorRef.current.focus();
    const savedRange = saveCursorPosition();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log("선택 또는 범위 없음");
      return;
    }
    if (!editorRef.current.contains(selection.anchorNode)) {
      console.log("선택이 에디터 외부");
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    console.log(
      `선택된 텍스트: "${selectedText}", 길이: ${selectedText.length}`
    );
    console.log("현재 범위:", range);

    // 선택된 텍스트가 없으면 다음 입력에 색상 적용
    if (selectedText.length === 0) {
      console.log("선택된 텍스트가 없음 - 다음 입력에 색상 적용");

      // 기존 span들을 찾아서 스타일 병합
      const existingSpans = editorRef.current.querySelectorAll(
        'span[class*="dynamic-text-"], span[class*="dynamic-highlight-"]'
      );
      let existingTextClass = "";
      let existingHighlightClass = "";

      console.log(`기존 span 개수: ${existingSpans.length}`);
      existingSpans.forEach((span, index) => {
        console.log(`기존 span ${index}:`, span.outerHTML);
        console.log(`기존 span ${index} 클래스:`, span.className);

        if (span.textContent === "\u200B" || span.textContent === "") {
          // 기존 스타일 클래스 저장
          const textClass =
            span.className.match(/dynamic-text-[A-F0-9]+/)?.[0] || "";
          const highlightClass =
            span.className.match(/dynamic-highlight-[A-F0-9]+/)?.[0] || "";

          if (textClass) {
            existingTextClass = textClass;
            console.log(`기존 텍스트 색상 클래스 발견: ${textClass}`);
          }
          if (highlightClass) {
            existingHighlightClass = highlightClass;
            console.log(`기존 하이라이트 클래스 발견: ${highlightClass}`);
          }

          console.log("빈 span 제거:", span.outerHTML);
          span.remove();
        } else {
          // 빈 span이 아닌 경우에도 클래스 정보 저장
          const textClass =
            span.className.match(/dynamic-text-[A-F0-9]+/)?.[0] || "";
          const highlightClass =
            span.className.match(/dynamic-highlight-[A-F0-9]+/)?.[0] || "";

          if (textClass && !existingTextClass) {
            existingTextClass = textClass;
            console.log(
              `기존 텍스트 색상 클래스 발견 (빈 span 아님): ${textClass}`
            );
          }
          if (highlightClass && !existingHighlightClass) {
            existingHighlightClass = highlightClass;
            console.log(
              `기존 하이라이트 클래스 발견 (빈 span 아님): ${highlightClass}`
            );
          }
        }
      });

      // 동적 색상 클래스 생성
      const textClassName = generateColorStyle(color, "text");
      console.log(`적용할 색상 클래스: ${textClassName}`);
      console.log(`요청한 색상: ${color}`);

      // 선택된 텍스트가 없으면 커서 위치에 새로운 span 삽입
      const span = document.createElement("span");

      // 텍스트 색상만 적용 (하이라이트 클래스는 병합하지 않음)
      span.className = textClassName;
      span.textContent = "\u200B"; // zero-width space
      console.log("생성된 span (텍스트 색상만):", span.outerHTML);
      console.log(`텍스트 색상 클래스: ${span.className}`);

      range.insertNode(span);
      console.log("span 삽입 후 에디터 내용:", editorRef.current.innerHTML);

      // 커서를 span 안으로 이동 (실제 입력 가능한 위치)
      const newRange = document.createRange();
      if (span.firstChild && span.firstChild.nodeType === Node.TEXT_NODE) {
        newRange.setStart(span.firstChild, 1); // zero-width space 다음 위치
        newRange.setEnd(span.firstChild, 1);
      } else {
        // span에 텍스트 노드가 없으면 생성
        const textNode = document.createTextNode("\u200B");
        span.appendChild(textNode);
        newRange.setStart(textNode, 1);
        newRange.setEnd(textNode, 1);
      }
      selection.removeAllRanges();
      selection.addRange(newRange);
      console.log("커서를 span 안으로 이동:", newRange);
    } else {
      console.log("선택된 텍스트에 색상 적용");

      // 동적 색상 클래스 생성
      const className = generateColorStyle(color, "text");
      console.log(`적용할 색상 클래스: ${className}`);
      console.log(`요청한 색상: ${color}`);

      const span = document.createElement("span");
      span.className = className;
      span.textContent = selectedText;
      console.log("생성된 span:", span.outerHTML);

      range.deleteContents();
      range.insertNode(span);
      console.log("span 삽입 후 에디터 내용:", editorRef.current.innerHTML);

      // 커서를 span 다음으로 이동
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      console.log("커서를 span 다음으로 이동:", newRange);
    }

    // 삽입된 span의 실제 스타일 확인
    setTimeout(() => {
      const spans = editorRef.current?.querySelectorAll(
        'span[class*="dynamic-text-"]'
      );
      if (spans && spans.length > 0) {
        const lastSpan = spans[spans.length - 1];
        const computedStyle = window.getComputedStyle(lastSpan);
        const actualColor = computedStyle.color;
        console.log(`마지막 span의 실제 색상: ${actualColor}`);
        console.log(`요청한 색상: ${color}`);
        console.log(
          `색상 일치 여부: ${
            actualColor === color ||
            actualColor ===
              `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
                color.slice(3, 5),
                16
              )}, ${parseInt(color.slice(5, 7), 16)})`
          }`
        );
      }
    }, 200);

    editorRef.current.focus();
    console.log("=== applyTextColor 완료 ===");
  };

  // 하이라이트 적용을 위한 강화된 함수 (동적 클래스 기반)
  const applyHighlightColor = (color: string) => {
    console.log(`=== applyHighlightColor 시작 === ${color}`);
    if (!editorRef.current) {
      console.log("에디터 참조 없음");
      return;
    }

    editorRef.current.focus();
    const savedRange = saveCursorPosition();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log("선택 또는 범위 없음");
      return;
    }
    if (!editorRef.current.contains(selection.anchorNode)) {
      console.log("선택이 에디터 외부");
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    console.log(
      `선택된 텍스트: "${selectedText}", 길이: ${selectedText.length}`
    );
    console.log("현재 범위:", range);

    // 선택된 텍스트가 없으면 다음 입력에 하이라이트 적용
    if (selectedText.length === 0) {
      console.log("선택된 텍스트가 없음 - 다음 입력에 하이라이트 적용");

      // 기존 빈 span들을 정리하고 스타일 병합
      const existingSpans = editorRef.current.querySelectorAll(
        'span[class*="dynamic-text-"], span[class*="dynamic-highlight-"]'
      );
      let existingTextClass = "";
      let existingHighlightClass = "";

      console.log(`기존 span 개수: ${existingSpans.length}`);
      existingSpans.forEach((span, index) => {
        console.log(`기존 span ${index}:`, span.outerHTML);
        console.log(`기존 span ${index} 클래스:`, span.className);

        if (span.textContent === "\u200B" || span.textContent === "") {
          // 기존 스타일 클래스 저장
          const textClass =
            span.className.match(/dynamic-text-[A-F0-9]+/)?.[0] || "";
          const highlightClass =
            span.className.match(/dynamic-highlight-[A-F0-9]+/)?.[0] || "";

          if (textClass) {
            existingTextClass = textClass;
            console.log(`기존 텍스트 색상 클래스 발견: ${textClass}`);
          }
          if (highlightClass) {
            existingHighlightClass = highlightClass;
            console.log(`기존 하이라이트 클래스 발견: ${highlightClass}`);
          }

          console.log("빈 span 제거:", span.outerHTML);
          span.remove();
        } else {
          // 빈 span이 아닌 경우에도 클래스 정보 저장
          const textClass =
            span.className.match(/dynamic-text-[A-F0-9]+/)?.[0] || "";
          const highlightClass =
            span.className.match(/dynamic-highlight-[A-F0-9]+/)?.[0] || "";

          if (textClass && !existingTextClass) {
            existingTextClass = textClass;
            console.log(
              `기존 텍스트 색상 클래스 발견 (빈 span 아님): ${textClass}`
            );
          }
          if (highlightClass && !existingHighlightClass) {
            existingHighlightClass = highlightClass;
            console.log(
              `기존 하이라이트 클래스 발견 (빈 span 아님): ${highlightClass}`
            );
          }
        }
      });

      // 동적 하이라이트 클래스 생성
      const highlightClassName = generateColorStyle(color, "highlight");
      console.log(`적용할 하이라이트 클래스: ${highlightClassName}`);
      console.log(`요청한 하이라이트 색상: ${color}`);

      // 선택된 텍스트가 없으면 커서 위치에 새로운 span 삽입
      const span = document.createElement("span");

      // 기존 텍스트 클래스가 있으면 병합
      const combinedClasses = [highlightClassName];
      if (existingTextClass) {
        combinedClasses.push(existingTextClass);
        console.log(`기존 텍스트 클래스 병합: ${existingTextClass}`);
      }
      span.className = combinedClasses.join(" ");
      span.textContent = "\u200B"; // zero-width space
      console.log("생성된 하이라이트 span (병합된 클래스):", span.outerHTML);
      console.log(`최종 병합된 클래스: ${span.className}`);

      range.insertNode(span);
      console.log(
        "하이라이트 span 삽입 후 에디터 내용:",
        editorRef.current.innerHTML
      );

      // 커서를 span 안으로 이동 (실제 입력 가능한 위치)
      const newRange = document.createRange();
      if (span.firstChild && span.firstChild.nodeType === Node.TEXT_NODE) {
        newRange.setStart(span.firstChild, 1); // zero-width space 다음 위치
        newRange.setEnd(span.firstChild, 1);
      } else {
        // span에 텍스트 노드가 없으면 생성
        const textNode = document.createTextNode("\u200B");
        span.appendChild(textNode);
        newRange.setStart(textNode, 1);
        newRange.setEnd(textNode, 1);
      }
      selection.removeAllRanges();
      selection.addRange(newRange);
      console.log("커서를 하이라이트 span 안으로 이동:", newRange);

      editorRef.current.focus();
      console.log("=== applyHighlightColor 완료 ===");
      return;
    }

    console.log("선택된 텍스트에 하이라이트 적용");

    // 동적 하이라이트 클래스 생성
    const className = generateColorStyle(color, "highlight");
    console.log(`적용할 하이라이트 클래스: ${className}`);
    console.log(`요청한 하이라이트 색상: ${color}`);

    const span = document.createElement("span");
    span.className = className;
    span.textContent = selectedText;
    console.log("생성된 span:", span.outerHTML);

    range.deleteContents();
    range.insertNode(span);
    console.log("span 삽입 후 에디터 내용:", editorRef.current.innerHTML);

    // 커서를 span 다음으로 이동
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    console.log("커서를 span 다음으로 이동:", newRange);

    // 삽입된 span의 실제 스타일 확인
    setTimeout(() => {
      const spans = editorRef.current?.querySelectorAll(
        'span[class*="dynamic-highlight-"]'
      );
      if (spans && spans.length > 0) {
        const lastSpan = spans[spans.length - 1];
        const computedStyle = window.getComputedStyle(lastSpan);
        const actualBackgroundColor = computedStyle.backgroundColor;
        const actualTextColor = computedStyle.color;
        console.log(
          `마지막 하이라이트 span의 실제 배경색: ${actualBackgroundColor}`
        );
        console.log(`마지막 하이라이트 span의 실제 글자색: ${actualTextColor}`);
        console.log(`요청한 배경색: ${color}`);
        console.log(
          `배경색 일치 여부: ${
            actualBackgroundColor === color ||
            actualBackgroundColor ===
              `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
                color.slice(3, 5),
                16
              )}, ${parseInt(color.slice(5, 7), 16)})`
          }`
        );
      }
    }, 200);

    editorRef.current.focus();
    console.log("=== applyHighlightColor 완료 ===");
  };

  const insertImage = () => {
    // 숨겨진 파일 input 생성
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (response.ok && data.imageUrl) {
            execCommand("insertImage", data.imageUrl);
          } else {
            alert(
              "이미지 업로드에 실패했습니다: " +
                (data.error || "알 수 없는 오류")
            );
          }
        } catch (error) {
          alert("이미지 업로드 중 오류가 발생했습니다.");
          console.error("Image upload error:", error);
        }
      }

      // 파일 input 제거
      document.body.removeChild(fileInput);
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const insertLink = () => {
    const url = prompt("링크 URL을 입력하세요:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  // currentColorMode 상태는 더 이상 필요하지 않음

  const setTextColor = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setTextColorPickerPosition({
      x: rect.left,
      y: rect.top - 60,
    });
    setShowTextColorPicker(true);

    // 팝업이 열린 후 자동으로 네이티브 컬러피커 표시
    setTimeout(() => {
      const colorInput = document.querySelector(
        ".text-color-input"
      ) as HTMLInputElement;
      if (colorInput) {
        colorInput.click();
      }
    }, 100);
  };

  const setHighlightColor = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setHighlightColorPickerPosition({
      x: rect.left,
      y: rect.top - 60,
    });
    setShowHighlightColorPicker(true);

    // 팝업이 열린 후 자동으로 네이티브 컬러피커 표시
    setTimeout(() => {
      const colorInput = document.querySelector(
        ".highlight-color-input"
      ) as HTMLInputElement;
      if (colorInput) {
        colorInput.click();
      }
    }, 100);
  };

  const handleTextColorChange = (color: string) => {
    setSelectedTextColor(color);
    applyTextColor(color);
    setShowTextColorPicker(false);
  };

  const handleHighlightColorChange = (color: string) => {
    setSelectedHighlightColor(color);
    applyHighlightColor(color);
    setShowHighlightColorPicker(false);
  };

  const handleTextColorInputChange = (color: string) => {
    setSelectedTextColor(color);
    applyTextColor(color);
  };

  const handleHighlightColorInputChange = (color: string) => {
    setSelectedHighlightColor(color);
    applyHighlightColor(color);
  };

  // 컬러피커 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".color-picker-popup")) {
        setShowTextColorPicker(false);
        setShowHighlightColorPicker(false);
      }
    };

    if (showTextColorPicker || showHighlightColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTextColorPicker, showHighlightColorPicker]);

  // 디버깅을 위한 선택 상태 모니터링

  // handleColorChange는 더 이상 사용하지 않음 (동적 생성 방식으로 변경)

  const setAlignment = (align: string) => {
    execCommand("justify" + align.charAt(0).toUpperCase() + align.slice(1));
  };

  // 글자체 적용 함수
  const applyFontFamily = (fontFamily: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // 선택된 텍스트가 없으면 다음 입력에 적용
      const fontOption = fontFamilyOptions.find(
        (option) => option.value === fontFamily
      );
      if (fontOption) {
        execCommand("fontName", fontOption.font);
      }
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText.length === 0) {
      // 선택된 텍스트가 없으면 다음 입력에 적용
      const fontOption = fontFamilyOptions.find(
        (option) => option.value === fontFamily
      );
      if (fontOption) {
        execCommand("fontName", fontOption.font);
      }
      return;
    }

    // 선택된 텍스트에 글자체 적용
    const fontOption = fontFamilyOptions.find(
      (option) => option.value === fontFamily
    );
    if (fontOption) {
      execCommand("fontName", fontOption.font);
    }
  };

  // 글자 크기 적용 함수
  const applyFontSize = (fontSize: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // 선택된 텍스트가 없으면 다음 입력에 적용
      execCommand("fontSize", fontSize);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText.length === 0) {
      // 선택된 텍스트가 없으면 다음 입력에 적용
      execCommand("fontSize", fontSize);
      return;
    }

    // 선택된 텍스트에 글자 크기 적용
    execCommand("fontSize", fontSize);
  };

  // 글자체 변경 핸들러
  const handleFontFamilyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const fontFamily = event.target.value;
    setSelectedFontFamily(fontFamily);
    applyFontFamily(fontFamily);
  };

  // 글자 크기 변경 핸들러
  const handleFontSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const fontSize = event.target.value;
    setSelectedFontSize(fontSize);
    applyFontSize(fontSize);
  };

  return (
    <div className="rich-text-editor">
      {/* 툴바 */}
      <div className="editor-toolbar">
        {/* 글자체 선택 */}
        <select
          value={selectedFontFamily}
          onChange={handleFontFamilyChange}
          className="toolbar-select"
          title="글자체"
          style={{
            padding: "4px 8px",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            backgroundColor: "var(--background-light)",
            color: "var(--text-primary)",
            fontSize: "12px",
            minWidth: "80px",
          }}
        >
          {fontFamilyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 글자 크기 선택 */}
        <select
          value={selectedFontSize}
          onChange={handleFontSizeChange}
          className="toolbar-select"
          title="글자 크기"
          style={{
            padding: "4px 8px",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            backgroundColor: "var(--background-light)",
            color: "var(--text-primary)",
            fontSize: "12px",
            minWidth: "60px",
          }}
        >
          {fontSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="toolbar-separator"></div>

        <button
          type="button"
          onClick={() => execCommand("bold")}
          title="굵게"
          className="toolbar-btn"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          title="기울임"
          className="toolbar-btn"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          title="밑줄"
          className="toolbar-btn"
        >
          <u>U</u>
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          onClick={(e) => setTextColor(e)}
          title="글자색"
          className="toolbar-btn"
        >
          🎨 색상
        </button>
        <button
          type="button"
          onClick={(e) => setHighlightColor(e)}
          title="하이라이트색"
          className="toolbar-btn"
        >
          🖍️ 하이라이트
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          title="글머리 기호"
          className="toolbar-btn"
        >
          • 목록
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          title="번호 매기기"
          className="toolbar-btn"
        >
          1. 목록
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          onClick={() => setAlignment("left")}
          title="왼쪽 정렬"
          className="toolbar-btn"
        >
          ⬅️ 왼쪽
        </button>
        <button
          type="button"
          onClick={() => setAlignment("center")}
          title="가운데 정렬"
          className="toolbar-btn"
        >
          ↔️ 가운데
        </button>
        <button
          type="button"
          onClick={() => setAlignment("right")}
          title="오른쪽 정렬"
          className="toolbar-btn"
        >
          ➡️ 오른쪽
        </button>
        <button
          type="button"
          onClick={() => setAlignment("full")}
          title="양쪽 정렬"
          className="toolbar-btn"
        >
          ↔️ 양쪽
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          onClick={insertLink}
          title="링크 삽입"
          className="toolbar-btn"
        >
          🔗 링크
        </button>
        <button
          type="button"
          onClick={insertImage}
          title="이미지 파일 업로드"
          className="toolbar-btn"
        >
          📁 이미지 업로드
        </button>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onBlur={handleInput}
        style={{
          width: "100%",
          height: `${height - 50}px`,
          padding: "12px",
          border: "1px solid var(--border-color)",
          borderTop: "none",
          borderRadius: "0 0 var(--border-radius) var(--border-radius)",
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: "1.5",
          backgroundColor: "var(--background-light)",
          color: "var(--text-primary)",
          overflowY: "auto",
          outline: "none",
        }}
        data-placeholder={placeholder}
      />

      {/* 텍스트 색상 컬러피커 팝업 */}
      {showTextColorPicker && (
        <div
          className="color-picker-popup"
          style={{
            position: "fixed",
            left: `${textColorPickerPosition.x}px`,
            top: `${textColorPickerPosition.y}px`,
            zIndex: 10000,
            backgroundColor: "white",
            border: "2px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            텍스트 색상
          </div>
          <input
            type="color"
            className="text-color-input"
            value={selectedTextColor}
            onChange={(e) => handleTextColorInputChange(e.target.value)}
            style={{
              width: "100px",
              height: "40px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {[
              "#000000",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#FF00FF",
              "#00FFFF",
              "#FFA500",
              "#800080",
              "#008000",
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleTextColorChange(color)}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* 하이라이트 색상 컬러피커 팝업 */}
      {showHighlightColorPicker && (
        <div
          className="color-picker-popup"
          style={{
            position: "fixed",
            left: `${highlightColorPickerPosition.x}px`,
            top: `${highlightColorPickerPosition.y}px`,
            zIndex: 10000,
            backgroundColor: "white",
            border: "2px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            하이라이트 색상
          </div>
          <input
            type="color"
            className="highlight-color-input"
            value={selectedHighlightColor}
            onChange={(e) => handleHighlightColorInputChange(e.target.value)}
            style={{
              width: "100px",
              height: "40px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {[
              "#FFFF00",
              "#FFE4B5",
              "#98FB98",
              "#87CEEB",
              "#DDA0DD",
              "#F0E68C",
              "#FFB6C1",
              "#E6E6FA",
              "#FFA07A",
              "#B0E0E6",
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleHighlightColorChange(color)}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
