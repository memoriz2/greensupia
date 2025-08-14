-- 초기 관리자 계정 생성
-- 비밀번호: adminsupia (해시된 값)
INSERT INTO admin (username, password, createdAt, updatedAt) 
VALUES ('admin', '20eb18eb6949a51196cb4644a286f4b7:62cd0d8f19590770ab63c6bc0641b7620888f4045527420b5afad61ddde5337a5adddee4e39184878afb5c0a31d0c47afbcf2a48dbde090d47679bdde2253a59', NOW(), NOW());
