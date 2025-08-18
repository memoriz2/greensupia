"use client";

import { useState, useEffect } from "react";

interface AutoLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  countdown: number;
}

export default function AutoLogoutModal({
  isOpen,
  onClose,
  onLogout,
  countdown,
}: AutoLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="auto-logout-modal">
      <div className="auto-logout-modal__overlay">
        <div className="auto-logout-modal__content">
          <div className="auto-logout-modal__header">
            <h3 className="auto-logout-modal__title">세션 만료 예정</h3>
            <p className="auto-logout-modal__description">
              활동이 없어 {countdown}초 후 자동으로 로그아웃됩니다.
            </p>
          </div>

          <div className="auto-logout-modal__progress">
            <div className="auto-logout-modal__progress-bar">
              <div
                className="auto-logout-modal__progress-fill"
                style={{ width: `${(countdown / 10) * 100}%` }}
              ></div>
            </div>
            <p className="auto-logout-modal__countdown">{countdown}초 남음</p>
          </div>

          <div className="auto-logout-modal__actions">
            <button
              onClick={onClose}
              className="auto-logout-modal__btn auto-logout-modal__btn--primary"
            >
              활동 계속
            </button>
            <button
              onClick={onLogout}
              className="auto-logout-modal__btn auto-logout-modal__btn--secondary"
            >
              지금 로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
