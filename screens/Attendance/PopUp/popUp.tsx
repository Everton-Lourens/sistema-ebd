// App.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export function PopUp({ visible, classId }: any) {
    const [isModalVisible, setModalVisible] = React.useState(true);

    if (!visible || !classId || !isModalVisible) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => visible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Este é o pop-up!</Text>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const LIGHT_BLUE = '#ADD8E6'; // azul claro

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    openButton: {
        backgroundColor: LIGHT_BLUE,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    openButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        color: LIGHT_BLUE,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: LIGHT_BLUE,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
