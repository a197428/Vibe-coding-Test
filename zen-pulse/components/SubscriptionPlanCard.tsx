import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SubscriptionPlan } from '../types';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubscriptionPlanCard({ plan, isSelected, onSelect }: SubscriptionPlanCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.85}
    >
      {plan.isRecommended && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Лучшая цена</Text>
        </View>
      )}
      <Text style={[styles.label, isSelected && styles.labelSelected]}>{plan.label}</Text>
      <Text style={[styles.price, isSelected && styles.priceSelected]}>{plan.price}</Text>
      {plan.trialDays > 0 && (
        <Text style={styles.trial}>{plan.trialDays} дней бесплатно</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#2D2A5E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#A78BFA',
    backgroundColor: '#3D3A7E',
  },
  badge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {
    color: '#1E1B4B',
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  labelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  price: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '700',
  },
  priceSelected: {
    color: '#fff',
  },
  trial: {
    color: '#6EE7B7',
    fontSize: 11,
    marginTop: 4,
  },
});
