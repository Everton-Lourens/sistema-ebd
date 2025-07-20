import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Field = {
  field: string;
  valueFormatter?: ({ value, data }: { value: any; data: any }) => string;
};

type CollapseItem = {
  field: string;
  headerName: string;
  type?: 'actions' | 'text';
  valueFormatter?: ({ value, data }: { value: any; data: any }) => string;
};

type Props = {
  items: any[];
  itemFields: Field[];
  collapseItems: CollapseItem[];
  emptyText?: string;
  loading?: boolean;
};

export function ListMobile({
  items,
  itemFields,
  collapseItems,
  emptyText = 'Nenhum item encontrado',
  loading = false,
}: Props) {
  const [itemOpened, setItemOpened] = useState<{ [id: string]: boolean }>({});

  function handleOpenItem(id: string) {
    setItemOpened((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#555" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.center}>
        <Text>{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => {
        const isOpen = itemOpened[item._id] || false;
        return (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => handleOpenItem(item._id)}
              style={styles.listItem}
            >
              {itemFields.map((field, index) => (
                <Text key={field.field} style={[styles.cell, index === 0 && { flex: 1 }]}>
                  {field.valueFormatter
                    ? field.valueFormatter({ value: item[field.field], data: item })
                    : String(item[field.field])}
                </Text>
              ))}
              {collapseItems?.length > 0 && (
                <FontAwesome
                  name={isOpen ? 'angle-up' : 'angle-down'}
                  size={20}
                  color="#555"
                />
              )}
            </TouchableOpacity>

            {isOpen && collapseItems.length > 0 && (
              <View style={styles.collapse}>
                {collapseItems.map((collapseItem) => (
                  <View key={collapseItem.field} style={styles.collapseItem}>
                    <Text style={styles.collapseTitle}>{collapseItem.headerName}</Text>
                    <Text>
                      {collapseItem.valueFormatter
                        ? collapseItem.valueFormatter({
                            value: item[collapseItem.field],
                            data: item,
                          })
                        : String(item[collapseItem.field])}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cell: {
    marginRight: 8,
    fontWeight: '500',
  },
  collapse: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  collapseItem: {
    marginBottom: 8,
  },
  collapseTitle: {
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
