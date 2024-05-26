export const allowedMimeTypes = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export const monitorSqlQuery = `
WITH Statuses AS (
  SELECT 'approved' AS status
  UNION ALL
  SELECT 'pending'
  UNION ALL
  SELECT 'rejected'
)
SELECT 
  t.status,
  CASE 
      WHEN COUNT(t.status) < 1 THEN 0
      ELSE COUNT(t.status)
  END AS count
FROM transactions t
GROUP BY t.status
`;
