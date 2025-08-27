-- 시드 데이터 리셋 스크립트
-- 기존 시드 데이터를 모두 삭제

DELETE FROM OrganizationChart;
DELETE FROM History;
DELETE FROM BannerNews;

-- 삭제 결과 확인
SELECT 'OrganizationChart' as table_name, COUNT(*) as remaining_count FROM OrganizationChart
UNION ALL
SELECT 'History' as table_name, COUNT(*) as remaining_count FROM History
UNION ALL
SELECT 'BannerNews' as table_name, COUNT(*) as remaining_count FROM BannerNews;
