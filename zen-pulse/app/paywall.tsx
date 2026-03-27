import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSubscriptionStore } from '../store/subscriptionStore';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import { SUBSCRIPTION_PLANS } from '../data/sessions';
import { RootStackParamList } from './_layout';

type NavProp = StackNavigationProp<RootStackParamList, 'Paywall'>;

const BENEFITS = [
  '🧘 Более 50 медитаций без ограничений',
  '🌙 Программы для глубокого сна',
  '🎯 Персональные планы медитаций',
  '🔇 Режим офлайн — медитируй везде',
  '📊 Статистика и прогресс',
];

export default function PaywallScreen() {
  const navigation = useNavigation<NavProp>();
  const { isSubscribed, activateSubscription } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    if (isSubscribed) {
      navigation.replace('Meditation');
    }
  }, [isSubscribed]);

  const handleTryFree = () => {
    activateSubscription();
    navigation.replace('Meditation');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌿 ZenPulse</Text>
          <Text style={styles.headline}>Откройте полный доступ</Text>
          <Text style={styles.subheadline}>
            Медитируйте без ограничений и находите покой каждый день
          </Text>
        </View>

        {/* Преимущества */}
        <View style={styles.benefitsBox}>
          {BENEFITS.map((b, i) => (
            <Text key={i} style={styles.benefit}>{b}</Text>
          ))}
        </View>

        {/* Тарифы */}
        <View style={styles.plansRow}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        {/* Кнопка */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleTryFree} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Попробовать бесплатно</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Отмена в любое время. Без скрытых платежей.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    fontSize: 28,
    marginBottom: 12,
  },
  headline: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsBox: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 10,
  },
  benefit: {
    color: '#E9D5FF',
    fontSize: 15,
    lineHeight: 22,
  },
  plansRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  disclaimer: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
