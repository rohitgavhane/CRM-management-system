import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

const CrudTable = ({ columns, data, onEdit, onDelete, can }) => {
  const canUpdate = can.update;
  const canDelete = can.delete;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {(canUpdate || canDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-muted-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-muted/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Handle nested objects (e.g., role.name) */}
                      {col.key.split('.').reduce((o, i) => (o ? o[i] : 'N/A'), item)}
                    </td>
                  ))}
                  {(canUpdate || canDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item._id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CrudTable;
