import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

/**
 * Generic data table.
 * columns: [{ key, header, render?(row), align?, width? }]
 */
export default function Table({ columns, rows, loading = false, emptyTitle = 'No records found', emptyMessage, onRowClick, rowKey = 'id', compact = false }) {
  if (loading) return <LoadingState />;
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <div className="table-wrap">
      <table className={`table ${compact ? 'table--compact' : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.align ? `align-${column.align}` : ''} style={column.width ? { width: column.width } : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} onClick={onRowClick ? () => onRowClick(row) : undefined} className={onRowClick ? 'is-clickable' : ''}>
              {columns.map((column) => (
                <td key={column.key} className={column.align ? `align-${column.align}` : ''}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
