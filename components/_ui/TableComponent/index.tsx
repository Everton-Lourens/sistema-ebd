import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Column {
  field: string;
  headerName?: string;
  cellClass?: (params: { value: any; data: any }) => any;
  valueFormatter?: (params: { value: any; data: any }) => React.ReactNode;
  cellRenderer?: (params: { value: any; data: any }) => React.ReactNode;
}

interface Props {
  columns: Column[];
  rows: any[];
  loading: boolean;
  emptyText?: string;
  heightSkeleton?: number;
}

export function TableComponent({
  columns,
  rows,
  loading,
  emptyText = 'Nenhum item encontrado',
  heightSkeleton = 30,
}: Props) {
  const [skeletonRows, setSkeletonRows] = useState<number[]>([]);

  useEffect(() => {
    if (loading) {
      setSkeletonRows([1, 2, 3, 4, 5]);
    } else {
      setSkeletonRows([]);
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          {/* Cabeçalho */}
          <View style={styles.headerRow}>
            {columns.map((column) => (
              <View key={column.field} style={styles.headerCell}>
                <Text style={styles.headerText}>{column.headerName || ''}</Text>
              </View>
            ))}
          </View>

          {/* Linhas */}
          {!loading && rows.length > 0 && rows.map((row) => (
            <View key={row._id} style={styles.dataRow}>
              {columns.map((column) => (
                <View key={column.field} style={styles.cell}>
                  {column.cellRenderer
                    ? column.cellRenderer({ value: row[column.field], data: row })
                    : column.valueFormatter
                    ? column.valueFormatter({ value: row[column.field], data: row })
                    : <Text>{String(row[column.field])}</Text>}
                </View>
              ))}
            </View>
          ))}

          {/* Vazio */}
          {!loading && rows.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          )}

          {/* Skeleton */}
          {loading && skeletonRows.map((item) => (
            <View key={item} style={styles.dataRow}>
              {columns.map((column) => (
                <View key={column.field} style={styles.skeletonCell}>
                  <View
                    style={[
                      styles.skeletonBox,
                      { height: heightSkeleton }
                    ]}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
  },
  headerCell: {
    padding: 10,
    minWidth: 100,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
  },
  dataRow: {
    flexDirection: 'row',
  },
  cell: {
    padding: 10,
    minWidth: 100,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  emptyRow: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
  },
  skeletonCell: {
    padding: 10,
    minWidth: 100,
  },
  skeletonBox: {
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
});
