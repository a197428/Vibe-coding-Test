import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout';
import { SESSIONS } from '../../data/sessions';

type NavProp = StackNavigationProp<RootStackParamList, 'SessionDetail'>;
type RoutePropType = RouteProp<RootStackParamList, 'SessionDetail'>;

export default function SessionDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { id } = route.params;

  const session = SESSIONS.find((s) => s.id === id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {session && (
          <Image
            source={{ uri: session.coverImage }}
            style={styles.cover}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{session?.title ?? 'Сессия'}</Text>
          {session && (
            <Text style={styles.duration}>{session.durationMinutes} минут</Text>
          )}
          <Text style={styles.placeholder}>
            🎧 Воспроизведение медитации{'\n'}(функция в разработке)
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
  container: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 240,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  duration: {
    color: '#A78BFA',
    fontSize: 15,
    marginBottom: 24,
  },
  placeholder: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backBtn: {
    backgroundColor: '#2D2A5E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  backText: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '600',
  },
});
