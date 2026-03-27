import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Session } from '../types';
import LockOverlay from './LockOverlay';

interface SessionCardProps {
  session: Session;
  isSubscribed: boolean;
  onPress: (session: Session) => void;
}

export default function SessionCard({ session, isSubscribed, onPress }: SessionCardProps) {
  const isLocked = session.isPremium && !isSubscribed;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(session)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: session.coverImage }}
        style={[styles.image, isLocked && styles.imageDimmed]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.title, isLocked && styles.textDimmed]} numberOfLines={1}>
          {session.title}
        </Text>
        <Text style={[styles.duration, isLocked && styles.textDimmed]}>
          {session.durationMinutes} мин
        </Text>
      </View>
      {isLocked && <LockOverlay />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageDimmed: {
    opacity: 0.4,
  },
  info: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  duration: {
    color: '#A78BFA',
    fontSize: 13,
  },
  textDimmed: {
    opacity: 0.5,
  },
});
