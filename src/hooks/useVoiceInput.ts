import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

interface VoiceInputState {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isRecording: false,
    isProcessing: false,
    transcript: '',
    error: null,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setState((s) => ({ ...s, error: 'Microphone permission denied' }));
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setState({ isRecording: true, isProcessing: false, transcript: '', error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Failed to start recording',
      }));
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) return null;

    try {
      setState((s) => ({ ...s, isRecording: false, isProcessing: true }));
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Note: For production, send audio to a Speech-to-Text API
      // This is a placeholder that uses expo-speech for demo purposes
      // In production, replace with actual STT (e.g., Whisper API, Google STT)
      setState((s) => ({
        ...s,
        isProcessing: false,
        transcript: uri ? '[Audio recorded - connect STT API for transcription]' : '',
      }));

      return uri;
    } catch (err) {
      setState((s) => ({
        ...s,
        isProcessing: false,
        error: err instanceof Error ? err.message : 'Failed to stop recording',
      }));
      return null;
    }
  }, []);

  const speak = useCallback((text: string, language?: string) => {
    Speech.speak(text, {
      language: language || 'en-US',
      pitch: 1.0,
      rate: 1.0,
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
  }, []);

  const reset = useCallback(() => {
    setState({ isRecording: false, isProcessing: false, transcript: '', error: null });
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    reset,
  };
}
