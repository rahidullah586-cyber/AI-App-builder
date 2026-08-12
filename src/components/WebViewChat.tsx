import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import * as Haptics from 'expo-haptics';

const ZAI_WEB_URL = 'https://z.ai';

interface Props {
  url?: string;
}

export default function WebViewChat({ url }: Props) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || ZAI_WEB_URL);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  }, []);

  // Inject JavaScript to improve mobile experience
  const injectedJS = `
    (function() {
      // Improve viewport for mobile
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);

      // Hide scrollbars for cleaner look
      const style = document.createElement('style');
      style.textContent = '
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
      ';
      document.head.appendChild(style);

      // Make links open in the same webview
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.target === '_blank') {
          e.preventDefault();
          window.location.href = link.href;
        }
      }, true);
    })();
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={{ flex: 1, backgroundColor: colors.background }}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScript={injectedJS}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
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
        pullToRefreshEnabled={Platform.OS === 'android'}
        // Handle file downloads if any
        onFileDownload={({ url }) => {
          // Could integrate with expo-file-system for downloads
          console.log('Download requested:', url);
        }}
        onError={(e) => console.error('WebView error:', e)}
        onHttpError={(e) => console.error('HTTP error:', e)}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
