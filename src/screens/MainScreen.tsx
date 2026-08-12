import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleNav = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  const goHome = useCallback(() => {
    webViewRef.current && webViewRef.current.injectJavaScript('window.location.href="https://z.ai"');
  }, []);

  const goBack = useCallback(() => {
    if (canGoBack && webViewRef.current) webViewRef.current.goBack();
  }, [canGoBack]);

  const doRefresh = useCallback(() => {
    if (webViewRef.current) webViewRef.current.reload();
  }, []);

  const injectedJS = 'var m=document.querySelector("meta[name=viewport]");if(!m){m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);}m.content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover";var s=document.createElement("style");s.textContent="::-webkit-scrollbar{display:none}body{-ms-overflow-style:none;scrollbar-width:none}";document.head.appendChild(s);';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top || 12 }]}>
        <TouchableOpacity onPress={goBack} disabled={!canGoBack} style={styles.topBtn}>
          <Ionicons name="arrow-back" size={22} color={canGoBack ? '#E0E0FF' : '#444'} />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <View style={styles.logoDot} />
          <Text style={styles.topTitle}>Z AI</Text>
        </View>
        <TouchableOpacity onPress={doRefresh} style={styles.topBtn}>
          <Ionicons name="refresh" size={20} color="#E0E0FF" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://z.ai' }}
          style={{ flex: 1, backgroundColor: '#0A0A1A' }}
          onNavigationStateChange={handleNav}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          allowsBackForwardNavigationGestures={true}
          showsVerticalScrollIndicator={false}
          cacheEnabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          sharedCookiesEnabled={true}
          pullToRefreshEnabled={true}
          startInLoadingState={true}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#818CF8" />
          </View>
        )}
      </View>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: (insets.bottom || 8) + 4 }]}>
        <TouchableOpacity style={styles.bottomBtn} onPress={goHome}>
          <Ionicons name="home" size={22} color="#C0C0E0" />
          <Text style={styles.bottomLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={doRefresh}>
          <Ionicons name="refresh" size={22} color="#C0C0E0" />
          <Text style={styles.bottomLabel}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 8, backgroundColor: '#0A0A1A',
    borderBottomWidth: 1, borderBottomColor: '#1A1A3E',
  },
  topBtn: { padding: 8, minWidth: 40, alignItems: 'center' },
  topCenter: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  topTitle: { color: '#E0E0FF', fontSize: 17, fontWeight: '700' },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#818CF8', marginRight: 8 },
  webviewContainer: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(10,10,26,0.8)',
  },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 6, backgroundColor: '#0A0A1A', borderTopWidth: 1, borderTopColor: '#1A1A3E',
  },
  bottomBtn: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 12 },
  bottomLabel: { color: '#8888AA', fontSize: 10, marginTop: 2 },
});
