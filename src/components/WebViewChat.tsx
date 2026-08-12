import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useTheme } from '../theme';

const ZAI_WEB_URL = 'https://z.ai';

interface Props {
  url?: string;
}

export default function WebViewChat({ url }: Props) {
  const { colors, isDark } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(url || ZAI_WEB_URL);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
  }, []);

  const injectedJS = `
    (function() {
      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
      var style = document.createElement('style');
      style.textContent = '::-webkit-scrollbar{display:none}body{-ms-overflow-style:none;scrollbar-width:none}';
      document.head.appendChild(style);
    })();
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={{ flex: 1, backgroundColor: colors.background }}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        allowsBackForwardNavigationGestures={true}
        showsVerticalScrollIndicator={false}
        cacheEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        pullToRefreshEnabled={Platform.OS === 'android'}
      />
      {isLoading && (
        <View style={[styles.loading, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
});
