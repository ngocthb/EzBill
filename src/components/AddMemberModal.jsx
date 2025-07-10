import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Platform,
    Image,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AddMemberModal = ({
    visible,
    onClose,
    onSelectMember,
    availableMembers = [],
    selectedMembers = [],
    isSelectingLeader = false
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Lọc danh sách thành viên theo từ khóa tìm kiếm
    const filteredMembers = availableMembers.filter(member => {
        const isAlreadySelected = selectedMembers.some(selected => selected.id === member.id);
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
        return !isAlreadySelected && matchesSearch;
    });

    // Nhóm thành viên theo chữ cái đầu
    const groupedMembers = filteredMembers.reduce((acc, member) => {
        const firstLetter = member.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(member);
        return acc;
    }, {});

    const sortedGroups = Object.keys(groupedMembers).sort();

    const handleSelectMember = (member) => {
        onSelectMember(member);
        setSearchQuery('');
        onClose();
    };

    const handleClose = () => {
        setSearchQuery('');
        onClose();
    };

    if (!visible) return null;

    return (
        <View className='absolute inset-0 bg-black/40 bg-opacity-50 flex-1 justify-end' style={{ zIndex: 1000 }}>
            <View
                className='bg-white rounded-t-3xl'
                style={{
                    height: height * 0.67,
                    paddingTop: Platform.OS === 'ios' ? 20 : 15
                }}
            >
                {/* Header */}
                <View className='flex-row items-center justify-between px-6 pb-4'>
                    <View className='w-8' />
                    <Text className='text-lg font-bold text-gray-900'>
                        {isSelectingLeader ? 'Chọn trưởng nhóm' : 'Thêm thành viên mới'}
                    </Text>
                    <TouchableOpacity onPress={handleClose} className='p-2'>
                        <Ionicons name='close' size={24} color='#6B7280' />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className='px-6 mb-4'>
                    <View className='flex-row items-center bg-gray-100 rounded-2xl px-4 py-3'>
                        <Ionicons name='search' size={20} color='#9CA3AF' />
                        <TextInput
                            className='flex-1 ml-3 text-gray-900'
                            placeholder='Tìm kiếm thành viên...'
                            placeholderTextColor='#9CA3AF'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Members List */}
                <FlatList
                    data={sortedGroups}
                    keyExtractor={(item) => item}
                    className='flex-1 px-6'
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: letter }) => (
                        <View key={letter} className='mb-4'>
                            <Text className='text-sm font-semibold text-gray-500 mb-2 uppercase'>
                                {letter}
                            </Text>
                            {groupedMembers[letter].map((member) => (
                                <TouchableOpacity
                                    key={member.id}
                                    onPress={() => handleSelectMember(member)}
                                    className='flex-row items-center py-3 px-2 rounded-xl mb-1'
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                    }}
                                >
                                    <View className='w-12 h-12 rounded-full mr-3 overflow-hidden'>
                                        <Image
                                            source={{ uri: member.avatar }}
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                            resizeMode='cover'
                                        />
                                    </View>
                                    <View className='flex-1'>
                                        <Text className='text-gray-900 font-medium text-base'>
                                            {member.name}
                                        </Text>
                                        <Text className='text-gray-500 text-sm'>
                                            {member.subtitle}
                                        </Text>
                                    </View>
                                    <Ionicons name='chevron-forward' size={16} color='#D1D5DB' />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default AddMemberModal;
