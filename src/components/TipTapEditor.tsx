"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import { HexColorPicker } from "react-colorful";

interface TipTapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

// 커스텀 FontFamily 확장
const FontFamily = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {};
          }
          return {
            style: `font-family: ${attributes.fontFamily}`,
          };
        },
      },
    };
  },
});

// FontSize 커스텀 확장
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        // parseHTML에서 실제 CSS 값을 그대로 가져옵니다.
        parseHTML: (element: HTMLElement) => element.style.fontSize,
        renderHTML: (attributes: { fontSize?: string }) => {
          if (!attributes.fontSize) return {};
          // renderHTML에서는 저장된 CSS 값을 그대로 사용합니다.
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

export default function TipTapEditor({
  value,
  onChange,
  disabled = false,
}: TipTapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");

  // onChange 함수를 안정화
  const stableOnChange = useCallback(
    (html: string) => {
      onChange(html);
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit에서 중복되는 확장들 비활성화
        underline: false,
      }),
      Underline,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: true,
      }),
    ],
    content: value || "<p>여기에 텍스트를 입력하세요...</p>",
    editable: !disabled,
    autofocus: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // 에디터 내용이 업데이트될 때마다 호출
      const html = editor.getHTML();
      stableOnChange(html);
    },
    onSelectionUpdate: ({ editor }) => {
      // 선택 영역이 변경될 때마다 호출 (커서 이동 포함)
      updateToolbarState(editor);
    },
  });

  // 툴바 상태를 업데이트하는 함수
  const updateToolbarState = useCallback((editor: Editor) => {
    if (!editor) return;

    // 텍스트 색상 업데이트
    const activeColor = editor.getAttributes("textStyle").color || "#000000";
    setColor(activeColor);

    // 하이라이트 색상 업데이트
    const activeHighlight =
      editor.getAttributes("highlight").color || "#ffff00";
    setHighlightColor(activeHighlight);

    // 폰트 패밀리 업데이트
    const activeFontFamily =
      editor.getAttributes("textStyle").fontFamily || "Arial";
    setSelectedFont(activeFontFamily);

    // 폰트 사이즈 업데이트
    const activeFontSize = editor.getAttributes("textStyle").fontSize || "16px";
    setSelectedFontSize(activeFontSize);
  }, []);

  // 에디터가 준비되면 초기 툴바 상태 설정
  useEffect(() => {
    if (editor) {
      updateToolbarState(editor);

      // 기존 HTML에서 잘못된 링크 수정
      const currentContent = editor.getHTML();
      if (
        currentContent.includes('href="www.') ||
        currentContent.includes("href='www.")
      ) {
        const fixedContent = currentContent
          .replace(/href="www\./g, 'href="https://www.')
          .replace(/href='www\./g, "href='https://www.");

        if (fixedContent !== currentContent) {
          editor.commands.setContent(fixedContent);
          stableOnChange(fixedContent);
        }
      }

      // 더 포괄적인 링크 수정 (프로토콜이 없는 모든 링크)
      const linkRegex = /href=["']([^"']*?)["']/g;
      let match;
      let hasInvalidLinks = false;
      let fixedContent = currentContent;

      while ((match = linkRegex.exec(currentContent)) !== null) {
        const url = match[1];
        if (
          url &&
          !url.startsWith("http://") &&
          !url.startsWith("https://") &&
          !url.startsWith("#") &&
          !url.startsWith("/")
        ) {
          hasInvalidLinks = true;
          const fixedUrl = `https://${url}`;
          fixedContent = fixedContent.replace(
            `href="${url}"`,
            `href="${fixedUrl}"`
          );
          fixedContent = fixedContent.replace(
            `href='${url}'`,
            `href='${fixedUrl}'`
          );
        }
      }

      if (hasInvalidLinks) {
        editor.commands.setContent(fixedContent);
        stableOnChange(fixedContent);
      }
    }
  }, [editor, updateToolbarState, stableOnChange]);

  const setTextColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const applyHighlightColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  // 이미지 붙여넣기 처리
  useEffect(() => {
    const handlePaste = (event: Event) => {
      const clipboardEvent = event as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageHtml = `<img class="editor-image" src="${e.target?.result}" draggable="true">`;
              editor?.chain().focus().insertContent(imageHtml).run();
            };
            reader.readAsDataURL(blob);
            event.preventDefault();
            break;
          }
        }
      }
    };

    // 에디터 요소에 직접 이벤트 리스너 추가
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("paste", handlePaste);

      return () => {
        editorElement.removeEventListener("paste", handlePaste);
      };
    }
  }, [editor]);

  // 컬러 피커 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isColorPickerOpen = showColorPicker || showHighlightPicker;
      if (!isColorPickerOpen) return;

      const colorPickerPopovers = document.querySelectorAll(
        ".color-picker-popover"
      );
      let isInsidePopover = false;
      colorPickerPopovers.forEach((popover) => {
        if (popover.contains(target)) {
          isInsidePopover = true;
        }
      });
      if (!isInsidePopover) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, showHighlightPicker]);

  if (!editor) {
    return (
      <div className="tiptap-loading">
        <p>에디터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="tiptap-editor-container">
      {/* 툴바 */}
      <div className="editor-toolbar">
        {/* 폰트 패밀리 선택 */}
        <select
          value={selectedFont}
          onChange={(e) => {
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontFamily: e.target.value })
              .run();
          }}
          title="폰트"
        >
          <option value="Arial">Arial</option>
          <option value="맑은 고딕">맑은 고딕</option>
          <option value="궁서체">궁서체</option>
          <option value="굴림체">굴림체</option>
          <option value="바탕체">바탕체</option>
          <option value="돋움체">돋움체</option>
        </select>

        {/* 폰트 크기 선택 */}
        <select
          value={selectedFontSize}
          onChange={(e) => {
            // e.target.value가 이미 "16px"와 같은 형태여야 합니다.
            // 만약 "16"만 넘어온다면 여기서 "px"를 붙여줘야 합니다.
            const newFontSize = e.target.value.endsWith("px")
              ? e.target.value
              : `${e.target.value}px`;
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: newFontSize }) // "16px" 형태로 전달
              .run();
          }}
          title="폰트 크기"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
        </select>

        {/* 텍스트 색상 피커 */}
        <div className="color-picker-container">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              editor?.chain().focus().run();
              setShowColorPicker(!showColorPicker);
            }}
            className="toolbar-button"
            style={{ backgroundColor: color, color: "#fff" }}
            title="텍스트 색상"
          >
            A
          </button>
          {showColorPicker && (
            <div
              className="color-picker-popover"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <HexColorPicker color={color} onChange={setColor} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTextColor(color);
                  setShowColorPicker(false);
                }}
              >
                적용
              </button>
            </div>
          )}
        </div>

        {/* 하이라이트 색상 피커 */}
        <div className="color-picker-container">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              editor?.chain().focus().run();
              setShowHighlightPicker(!showHighlightPicker);
            }}
            className="toolbar-button"
            title="하이라이트"
            style={{ background: highlightColor }}
          >
            <span style={{ background: highlightColor }}>H</span>
          </button>
          {showHighlightPicker && (
            <div
              className="color-picker-popover"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <HexColorPicker
                color={highlightColor}
                onChange={setHighlightColor}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyHighlightColor(highlightColor);
                  setShowHighlightPicker(false);
                }}
              >
                적용
              </button>
            </div>
          )}
        </div>

        {/* 기본 서식 버튼들 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          type="button"
          title="굵게"
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          type="button"
          title="기울임"
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          type="button"
          title="밑줄"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          type="button"
          title="취소선"
        >
          <s>S</s>
        </button>

        {/* 제목 버튼들 */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
          type="button"
          title="본문"
        >
          본문
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          type="button"
          title="제목 1"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          type="button"
          title="제목 2"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
          type="button"
          title="제목 3"
        >
          H3
        </button>

        {/* 정렬 버튼들 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
          type="button"
          title="왼쪽 정렬"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3zm0 8h12v2H3v-2zm0 8h18v2H3v-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
          type="button"
          title="가운데 정렬"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3zm2 8h14v2H5v-2zm-2 8h18v2H3v-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
          type="button"
          title="오른쪽 정렬"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3zm6 8h12v2H9v-2zm-6 8h18v2H3v-2z"
            />
          </svg>
        </button>

        {/* 목록 버튼들 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          type="button"
          title="글머리 기호 목록"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          type="button"
          title="번호 매기기 목록"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M2 17h2v.5H1v1h3v-1.5H2V17zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
            />
          </svg>
        </button>

        {/* 테이블 버튼들 */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          type="button"
          title="테이블 삽입"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
          type="button"
          title="테이블 삭제"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </button>

        {/* 링크 버튼들 */}
        <button
          onClick={() => {
            const url = window.prompt(
              "링크 URL을 입력하세요 (예: https://www.example.com):"
            );
            if (url) {
              // 프로토콜이 없는 경우 https://를 기본으로 추가
              const fullUrl =
                url.startsWith("http://") || url.startsWith("https://")
                  ? url
                  : `https://${url}`; // 또는 http://www.naver.com 처럼 프로토콜을 명시하게 합니다.

              editor
                .chain()
                .focus()
                .setLink({
                  href: fullUrl,
                  target: "_blank",
                  rel: "noopener noreferrer nofollow",
                })
                .run();
              // target, rel 속성을 추가하여 새 탭에서 열리도록 하고 보안을 강화합니다.
            }
          }}
          className={editor.isActive("link") ? "is-active" : ""}
          type="button"
          title="링크 추가"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          type="button"
          title="링크 해제"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l1.56 1.56h.63c.55 0 1-.45 1-1s-.45-1-1-1zM2 4.27l3.11 3.11C2.79 8.12 2 9.98 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.43.98-2.63 2.31-2.98L5.27 5.73 2 4.27z"
            />
          </svg>
        </button>

        {/* 이미지 업로드 버튼 */}
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageHtml = `<img class="editor-image" src="${e.target?.result}" draggable="true">`;
                  editor.chain().focus().insertContent(imageHtml).run();
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
          type="button"
          title="이미지 삽입"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
        </button>
      </div>

      {/* 에디터 */}
      <div className="editor-container">
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
}
