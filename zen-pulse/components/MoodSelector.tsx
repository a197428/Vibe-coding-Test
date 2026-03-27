import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MOODS } from '../constants/moods';
import { MoodKey } from '../types';

interface MoodSelectorProps {
  selectedMood: MoodKey | null;
  onSelect: (mood: MoodKey) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <View style={styles.row}>
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.key;
        return (
          <TouchableOpacity
            key={mood.key}
            style={[styles.btn, isSelected && styles.btnSelected]}
            onPress={() => onSelect(mood.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#2D2A5E',
  },
  btnSelected: {
    borderColor: '#A78BFA',
    backgroundColor: '#3D3A7E',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  labelSelected: {
    color: '#A78BFA',
    fontWeight: '600',
  },
});
