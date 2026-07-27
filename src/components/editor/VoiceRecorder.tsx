import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mic, Square, Play, Pause, Trash2, Check } from 'lucide-react';
import { ThemeColors } from '../../theme/colors';
import { HapticsService } from '../../services/HapticsService';

interface VoiceRecorderProps {
  themeColors: ThemeColors;
  accentColor: string;
  onSaveVoiceNote: (durationSeconds: number, transcript?: string) => void;
  onClose: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  themeColors,
  accentColor,
  onSaveVoiceNote,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedDuration, setRecordedDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    HapticsService.trigger('medium');
    setSeconds(0);
    setIsRecording(true);
    setRecordedDuration(null);
  };

  const stopRecording = () => {
    HapticsService.trigger('success');
    setIsRecording(false);
    setRecordedDuration(seconds);
  };

  const handleSave = () => {
    if (recordedDuration && recordedDuration > 0) {
      onSaveVoiceNote(recordedDuration, 'Voice Note Recorded');
      onClose();
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Mic size={18} color="#ef4444" />
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Voice Recorder</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: themeColors.textMuted, fontSize: 13 }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recorderBody}>
        {/* Animated Waveform Simulation */}
        <View style={styles.waveformContainer}>
          {[12, 24, 40, 18, 32, 48, 20, 36, 14, 28, 44, 16].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: isRecording ? Math.min(50, h * (1 + Math.sin(seconds + i))) : 8,
                  backgroundColor: isRecording ? '#ef4444' : themeColors.badgeBg,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.timerText, { color: themeColors.textPrimary }]}>
          {formatTimer(isRecording ? seconds : recordedDuration || 0)}
        </Text>

        {/* Record Control Buttons */}
        {!recordedDuration ? (
          <TouchableOpacity
            style={[
              styles.recordBtn,
              { backgroundColor: isRecording ? '#ef4444' : accentColor },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <Square size={24} color="#ffffff" /> : <Mic size={24} color="#ffffff" />}
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: themeColors.badgeBg }]}
              onPress={() => setRecordedDuration(null)}
            >
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: accentColor }]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} color="#ffffff" /> : <Play size={16} color="#ffffff" />}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#10b981' }]} onPress={handleSave}>
              <Check size={16} color="#ffffff" />
              <Text style={styles.saveText}>Attach Note</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  recorderBody: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 50,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    transitionDuration: '150ms',
  } as any,
  timerText: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  recordBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 21,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
