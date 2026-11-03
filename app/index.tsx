import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '../src/hooks/useTasks';
import { FilterBar } from '../src/components/FilterBar';
import { TaskItem } from '../src/components/TaskItem';
import { EmptyState } from '../src/components/EmptyState';
import { ThemeToggle } from '../src/components/ThemeToggle';

// Tela principal: filtros, lista de tarefas e botão flutuante (FAB) para adicionar
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Toda a lógica está no hook; a tela só renderiza a UI com os dados dele
  const {
    tasks,
    filter,
    loading,
    allTasksCount,
    pendingCount,
    completedCount,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header definido aqui (e não no _layout) porque o botão precisa do router desta tela.
          Ele substitui o headerRight do layout, então o ThemeToggle é incluído de novo. */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row items-center">
              <ThemeToggle />
              <TouchableOpacity onPress={() => router.push('/profile')} className="px-2 py-1">
                <Text className="text-xl">👤</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <FilterBar
        filter={filter}
        onChange={setFilter}
        counts={{
          all: allTasksCount,
          pending: pendingCount,
          completed: completedCount,
        }}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />
          )}
          ListEmptyComponent={<EmptyState filter={filter} />}
          // Espaço no fim da lista para o último card não ficar atrás do FAB
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 96 + insets.bottom }}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/form')}
        className="absolute right-6 w-16 h-16 rounded-full bg-indigo-600 items-center justify-center shadow-lg"
        style={{ bottom: 24 + insets.bottom }}
      >
        <Text className="text-white text-3xl leading-9">+</Text>
      </TouchableOpacity>
    </View>
  );
}
