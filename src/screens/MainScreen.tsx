import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, StatusBar, Alert, Share } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ZAI_URL = 'https://z.ai';

export default function MainScreen() {
  const insets = useSafeAreaInsets();
   const webViewRef = useRef<WebView>(null);
   const [currentUrl, setCurrentUrl] = useState(ZAI_URL);
   const [canGoBack, setCanGoBack] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [showSettings, setShowSettings] = useState(false);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCurrentUrl(navState.url);
  }, []);

  const goHome = useCallback(() => {
    webViewRef.current?.injectJavaScript('window.location.href = "' + ZAI_URL + '"');
  }, []);

  const goBack = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  }, [canGoBack]);

  const handleRefresh = useCallback(() => {
    webViewRef.current?.reload();
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ url: currentUrl, title: 'Z AI' });
    } catch {}
  }, [currentUrl]);

  const handleNewChat = useCallback(() => {
    // Z AI uses SPA routing - navigate to new chat
    webViewRef.current?.injectJavaScript('
      (function() {
        const link = document.querySelector("a[href=\'/chat\']") || document.querySelector("[data-testid=\'new-chat\']");
        if (link) link.click();
        else window.location.href = "' + ZAI_URL + '";
      })();
    ');
  }, []);

  // JavaScript to improve mobile experience inside z.ai
  const injectedJS = `
    (function() {
      // Set proper viewport
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

      // Hide scrollbars
      var style = document.createElement('style');
      style.textContent = '::-webkit-scrollbar{display:none}body{-ms-overflow-style:none;scrollbar-width:none}';
      document.head.appendChild(style);

      // Make _blank links open in same webview
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && link.target === '_blank') {
          e.preventDefault();
          window.location.href = link.href;
        }
      }, true);

      // Notify React Native when page is ready
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'pageReady', url: window.location.href}));
      }
    })();
  `;

  const onMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'pageReady') {
        setIsLoading(false);
      }
    } catch {}
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top || 12 }]}>
        <TouchableOpacity onPress={goBack} disabled={!canGoBack} style={styles.topBtn}>
          <Ionicons name="arrow-back" size={22} color={canGoBack ? '#E0E0FF' : '#555'} />
        </TouchableOpacity>
        <View style={styles.topTitleContainer}>
          <View style={styles.logoDot} />
          <Text style={styles.topTitle}>Z AI</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.topBtn}>
          <Ionicons name="refresh" size={20} color="#E0E0FF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.topBtn}>
          <Ionicons name="share-outline" size={20} color="#E0E0FF" />
        </TouchableOpacity>
      </View>

      {/* WebView - The Real Z AI */
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={{ flex: 1, backgroundColor: '#0A0A1A' }}
          onNavigationStateChange={handleNavigationStateChange}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          onMessage={onMessage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          allowsBackForwardNavigationGestures={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          cacheEnabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          pullToRefreshEnabled={true}
          startInLoadingState={true}
          renderLoading={() => null}
          onError={(e) => console.error('WebView error:', e.nativeEvent)}
          onHttpError={(e) => console.warn('HTTP error:', e.nativeEvent.statusCode)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#818CF8" />
              <Text style={styles.loadingText}>Loading Z AI...</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: (insets.bottom || 8) + 4 }]}>
        <TouchableOpacity style={styles.bottomBtn} onPress={handleNewChat}>
          <Ionicons name="add-circle" size={24} color="#818CF8" />
          <Text style={styles.bottomLabel}>New Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={goHome}>
          <Ionicons name="home" size={22} color="#C0C0E0" />
          <Text style={styles.bottomLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => {
          webViewRef.current?.injectJavaScript('window.location.href = "https://z.ai"');
        }}>
          <Ionicons name="search" size={22} color="#C0C0E0" />
          <Text style={styles.bottomLabel}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={handleRefresh}>
          <Ionicons name="refresh" size={22} color="#C0C0E0" />
          <Text style={styles.bottomLabel}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <TouchableOpacity style={styles.settingsBackdrop} onPress={() => setShowSettings(false)} />
          <View style={styles.settingsSheet}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity style={styles.settingsItem} onPress={goHome}>
              <Ionicons name="home-outline" size={20} color="#E0E0FF" />
              <Text style={styles.settingsItemText}>Go to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={handleNewChat}>
              <Ionicons name="add-circle-outline" size={20} color="#E0E0FF" />
              <Text style={styles.settingsItemText}>New Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={() => {
              Alert.alert('Z AI App', 'Version 2.0.0\nBuilt with React Native + WebView\nPowered by Z AI (z.ai)', [{ text: 'OK' }]);
            }}>
              <Ionicons name="information-circle-outline" size={20} color="#E0E0FF" />
              <Text style={styles.settingsItemText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsCloseBtn} onPress={() => setShowSettings(false)}>
              <Text style={styles.settingsCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 8,
    backgroundColor: '#0A0A1A',
    borderBottomWidth: 1, borderBottomColor: '#1A1A3E',
  },
  topBtn: { padding: 8, minWidth: 40, alignItems: 'center' },
  topTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topTitle: { color: '#E0E0FF', fontSize: 17, fontWeight: '700' },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#818CF8' },
  webviewContainer: { flex: 1, position: 'relative' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A1A',
  },
  loadingCard: { alignItems: 'center', gap: 12 },
  loadingText: { color: '#8888AA', fontSize: 14, marginTop: 4 },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 6,
    backgroundColor: '#0A0A1A', borderTopWidth: 1, borderTopColor: '#1A1A3E',
  },
  bottomBtn: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 12 },
  bottomLabel: { color: '#8888AA', fontSize: 10, marginTop: 2 },
  settingsOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  settingsBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  settingsSheet: {
    backgroundColor: '#14142B', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40,
  },
  settingsTitle: { color: '#E0E0FF', fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A3E',
  },
  settingsItemText: { color: '#E0E0FF', fontSize: 16 },
  settingsCloseBtn: { marginTop: 20, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#818CF8' },
  settingsCloseText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
