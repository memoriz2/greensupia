-- 중복된 조직도 데이터 정리 스크립트
-- 시드 데이터만 남기고 나머지 삭제

-- 현재 데이터 확인
SELECT id, imageUrl, createdAt, updatedAt FROM OrganizationChart ORDER BY createdAt;

-- 시드 데이터만 남기고 나머지 삭제
DELETE FROM OrganizationChart 
WHERE imageUrl NOT IN (
  '/organizationcharts/ceo.png',
  '/organizationcharts/cto.png', 
  '/organizationcharts/cfo.png'
);

-- 정리 후 결과 확인
SELECT id, imageUrl, createdAt, updatedAt FROM OrganizationChart ORDER BY createdAt;
