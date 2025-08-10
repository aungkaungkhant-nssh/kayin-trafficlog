import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <View style={styles.paginationContainer}>
            {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const isActive = pageNumber === currentPage;
                return (
                    <TouchableOpacity
                        key={pageNumber}
                        onPress={() => onPageChange(pageNumber)}
                        style={[styles.pageNumberButton, isActive && styles.activePage]}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.pageNumberText, isActive && styles.activePageText]}>
                            {pageNumber}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default Pagination;

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
    },
    pageNumberButton: {
        marginHorizontal: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
    activePage: {
        backgroundColor: '#000080',
    },
    pageNumberText: {
        color: '#000',
        fontWeight: '600',
    },
    activePageText: {
        color: '#fff',
    },
});
