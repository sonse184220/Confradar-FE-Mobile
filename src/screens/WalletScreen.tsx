import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import {
    Appbar,
    Surface,
    ActivityIndicator,
    IconButton
} from 'react-native-paper';
import { useTransaction } from '@/hooks/useTransaction';
import type { WalletTransaction } from '@/types/transaction.type';

const WalletScreen = () => {
    const {
        wallet,
        fetchOwnWallet,
        lazyWalletLoading,
        walletError
    } = useTransaction();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOwnWallet();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchOwnWallet();
        } finally {
            setRefreshing(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    const renderTransactionItem = (item: WalletTransaction) => {
        const isPositive = item.amount >= 0;

        return (
            <Surface
                key={item.walletTransactionId}
                style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 16
                }}
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-3">
                        <Text className="text-white font-semibold text-base mb-1">
                            {item.description}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            {formatDateTime(item.createdAt)}
                        </Text>
                    </View>
                    <Text
                        className="text-lg font-bold"
                        style={{ color: isPositive ? '#22c55e' : '#ef4444' }}
                    >
                        {isPositive ? '+' : '-'}{formatCurrency(Math.abs(item.amount))}
                    </Text>
                </View>
                <View className="mt-2">
                    <View className="bg-gray-800 px-3 py-1 rounded-full self-start">
                        <Text className="text-gray-300 text-xs">
                            {item.transactionType}
                        </Text>
                    </View>
                </View>
            </Surface>
        );
    };

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-16">
            <View className="bg-gray-800 rounded-full p-6 mb-6">
                <IconButton
                    icon="wallet-outline"
                    size={48}
                    iconColor="#8A2BE2"
                />
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
                Chưa có giao dịch nào
            </Text>
            <Text className="text-gray-400 text-center px-8">
                Lịch sử giao dịch của bạn sẽ xuất hiện ở đây
            </Text>
        </View>
    );

    const ErrorState = () => (
        <View className="flex-1 justify-center items-center py-16">
            <View className="bg-gray-800 rounded-full p-6 mb-6">
                <IconButton
                    icon="alert-circle-outline"
                    size={48}
                    iconColor="#ef4444"
                />
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
                Không thể tải thông tin ví
            </Text>
            <Text className="text-gray-400 text-center px-8 mb-6">
                Đã có lỗi xảy ra. Vui lòng thử lại.
            </Text>
            <TouchableOpacity
                onPress={fetchOwnWallet}
                className="bg-purple-600 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-medium">Thử lại</Text>
            </TouchableOpacity>
        </View>
    );

    const hasTransactions = wallet?.walletTransactions && wallet.walletTransactions.length > 0;

    return (
        <View className="flex-1">
            <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
                <Appbar.BackAction
                    color="#ffffff"
                    onPress={() => { }}
                />
                <Appbar.Content
                    title="Ví của tôi"
                    titleStyle={{
                        color: '#ffffff',
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center'
                    }}
                    style={{ alignItems: 'center' }}
                />
                <Appbar.Action
                    icon="refresh"
                    iconColor="#ffffff"
                    onPress={onRefresh}
                />
            </Appbar.Header>

            {lazyWalletLoading && !wallet ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#8A2BE2" />
                    <Text className="text-gray-400 mt-4">Đang tải thông tin ví...</Text>
                </View>
            ) : walletError ? (
                <ErrorState />
            ) : wallet ? (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#8A2BE2"
                            colors={['#8A2BE2']}
                        />
                    }
                >
                    {/* Balance Card */}
                    <View className="mx-4 mt-4 mb-6">
                        <Surface
                            style={{
                                borderRadius: 16,
                                padding: 24,
                                backgroundColor: '#8A2BE2',
                                elevation: 4
                            }}
                        >
                            <Text className="text-white text-sm opacity-90 mb-2">
                                Số dư khả dụng
                            </Text>
                            <Text className="text-white text-3xl font-bold mb-4">
                                {formatCurrency(wallet.balance)}
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white text-xs opacity-75">
                                    Cập nhật lần cuối
                                </Text>
                                <Text className="text-white text-xs opacity-75">
                                    {formatDateTime(wallet.updatedAt)}
                                </Text>
                            </View>
                        </Surface>
                    </View>

                    {/* Transaction History Section */}
                    <View className="px-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-lg font-semibold">
                                Lịch sử giao dịch
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                ({wallet.walletTransactions?.length || 0})
                            </Text>
                        </View>

                        {hasTransactions ? (
                            <View>
                                {wallet.walletTransactions.map(renderTransactionItem)}
                                <View className="py-8 items-center">
                                    <Text className="text-gray-400 text-sm">
                                        Bạn đã xem hết giao dịch
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <EmptyState />
                        )}
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-400">Không có dữ liệu</Text>
                </View>
            )}
        </View>
    );
};

export default WalletScreen;