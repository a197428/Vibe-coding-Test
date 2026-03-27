import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import MoodSelector from './MoodSelector';
import { generateAffirmation } from '../services/affirmationService';
import { MoodKey } from '../types';

export default function AffirmationWidget() {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [affirmationText, setAffirmationText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleGenerate = async () => {
    if (!selectedMood) {
      setShowHint(true);
      return;
    }
    setShowHint(false);
    setIsLoading(true);
    setAffirmationText(null);
    try {
      const result = await generateAffirmation(selectedMood);
      setAffirmationText(result.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Аффирмация дня (ИИ)</Text>
      <Text style={styles.subtitle}>Выберите своё настроение:</Text>

      <MoodSelector selectedMood={selectedMood} onSelect={(mood) => {
        setSelectedMood(mood);
        setShowHint(false);
      }} />

      {showHint && (
        <Text style={styles.hint}>Пожалуйста, выберите настроение</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGenerate} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Получить аффирмацию</Text>
      </TouchableOpacity>

      {isLoading && (
        <ActivityIndicator color="#A78BFA" size="small" style={{ marginTop: 16 }} />
      )}

      {affirmationText && !isLoading && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{affirmationText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D2A5E',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 12,
  },
  hint: {
    color: '#F87171',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#1E1B4B',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resultText: {
    color: '#E9D5FF',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
