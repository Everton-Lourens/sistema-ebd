import { FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { Loading } from '../Loading';

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
  onSubmit?: (item: any) => void | undefined;
  textButton?: string;
  collapseItems: CollapseItem[];
  emptyText?: string;
  loading?: boolean;
};

export function Switch({
  items,
  itemFields,
  onSubmit,
  textButton = 'Enviar',
  collapseItems,
  emptyText = 'Nenhum item encontrado',
  loading = false,
}: Props) {
  const [itemOpened, setItemOpened] = useState<{ [id: string]: boolean }>({});
  const [isChecked, setChecked] = useState(false);
  function handleOpenItem(id: string) {
    setItemOpened((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (loading) {
    return (
      <Loading size={100} color="gray" />
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
    <View style={{ padding: 20 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isOpen = itemOpened[item.id] || false;
          return (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  const newOpenedItems = { ...itemOpened };
                  Object.keys(newOpenedItems).forEach((key) => {
                    if (key !== item.id) {
                      newOpenedItems[key] = false;
                    }
                  });
                  newOpenedItems[item.id] = !isOpen;
                  setItemOpened(newOpenedItems);
                }}
                style={styles.listItem}
              >

                <ToggleSwitch
                  isOn={false}
                  onColor="green"
                  offColor="red"
                  label=""
                  size="small"
                  onToggle={isOn => console.log(isOn)}
                />
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

              <>
                <View style={[styles.collapse, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? 'green' : undefined}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.collapseTitle}>Bíblia</Text>
                </View>

                <View style={[styles.collapse, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? 'green' : undefined}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.collapseTitle}>Revista</Text>
                </View>
              </>

              {isOpen && (
                <View style={styles.collapse}>
                  {collapseItems.map((collapseItem) => (
                    <View key={collapseItem.field} style={styles.collapseItem}>
                      <Text style={styles.collapseTitle}>
                        {collapseItem.headerName}
                      </Text>
                      <Text>
                        {collapseItem.valueFormatter
                          ? collapseItem.valueFormatter({ value: item[collapseItem.field], data: item })
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 18,
    borderRadius: 8,
    elevation: 5,
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
    padding: '30%',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 15,
  },
});
