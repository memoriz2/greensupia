-- 조직도 이미지 URL 업데이트 스크립트
-- organization-charts -> organizationcharts 폴더명 변경에 따른 URL 업데이트

-- 기존 URL 확인
SELECT id, imageUrl FROM OrganizationChart;

-- URL 업데이트 실행
UPDATE OrganizationChart 
SET imageUrl = REPLACE(imageUrl, '/organization-charts/', '/organizationcharts/')
WHERE imageUrl LIKE '%/organization-charts/%';

-- 업데이트 후 결과 확인
SELECT id, imageUrl FROM OrganizationChart;
