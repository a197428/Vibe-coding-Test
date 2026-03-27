import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSubscriptionStore } from '../store/subscriptionStore';
import SessionCard from '../components/SessionCard';
import AffirmationWidget from '../components/AffirmationWidget';
import { SESSIONS } from '../data/sessions';
import { Session } from '../types';
import { RootStackParamList } from './_layout';

type NavProp = StackNavigationProp<RootStackParamList, 'Meditation'>;

export default function MeditationScreen() {
  const navigation = useNavigation<NavProp>();
  const { isSubscribed } = useSubscriptionStore();
  const insets = useSafeAreaInsets();

  const handleSessionPress = (session: Session) => {
    if (session.isPremium && !isSubscribed) {
      navigation.navigate('Paywall');
    } else {
      navigation.navigate('SessionDetail', { id: session.id });
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Шапка */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌿 ZenPulse</Text>
          <Text style={styles.greeting}>Добро пожаловать</Text>
          <Text style={styles.subtitle}>Найдите свой покой сегодня</Text>
        </View>

        {/* Баннер апгрейда */}
        {!isSubscribed && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => navigation.navigate('Paywall')}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeText}>
              ✨ Разблокируйте все медитации — Улучшить →
            </Text>
          </TouchableOpacity>
        )}

        {/* Аффирмация дня */}
        <AffirmationWidget />

        {/* Список сессий */}
        <Text style={styles.sectionTitle}>Медитации</Text>
        {SESSIONS.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isSubscribed={isSubscribed}
            onPress={handleSessionPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0C29',
    ...(Platform.OS === 'web' ? { height: '100vh' as any } : {}),
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    marginBottom: 4,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  upgradeBanner: {
    backgroundColor: '#4C1D95',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  upgradeText: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
});
