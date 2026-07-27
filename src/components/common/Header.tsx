import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search as SearchIcon, Sparkles as SparklesIcon, Folder as FolderIcon, ShieldCheck as ShieldIcon, Sun as SunIcon, Moon as MoonIcon, Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { ThemeColors } from '../../theme/colors';
import { ActiveScreen, SmartFilterType } from '../../types';

interface HeaderProps {
  themeColors: ThemeColors;
  accentColor: string;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  pinLockEnabled: boolean;
  totalNotesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  themeColors,
  accentColor,
  activeScreen,
  setActiveScreen,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  pinLockEnabled,
  totalNotesCount,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: themeColors.header, borderBottomColor: themeColors.divider }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => setActiveScreen('home')}
          activeOpacity={0.8}
        >
          <View style={[styles.logoBadge, { backgroundColor: accentColor }]}>
            <SparklesIcon size={18} color="#ffffff" />
          </View>
          <View>
            <Text style={[styles.appTitle, { color: themeColors.textPrimary }]}>Notion Notes</Text>
            <Text style={[styles.appSubtitle, { color: themeColors.textMuted }]}>
              {totalNotesCount} {totalNotesCount === 1 ? 'note' : 'notes'} • Offline
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {pinLockEnabled && (
            <View style={[styles.iconButton, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <ShieldIcon size={18} color="#10b981" />
            </View>
          )}

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: themeColors.badgeBg }]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <ListIcon size={18} color={themeColors.textSecondary} />
            ) : (
              <GridIcon size={18} color={themeColors.textSecondary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              activeScreen === 'settings' && { backgroundColor: accentColor + '25', borderColor: accentColor },
              { borderColor: themeColors.cardBorder },
            ]}
            onPress={() => setActiveScreen(activeScreen === 'settings' ? 'home' : 'settings')}
          >
            <SunIcon size={16} color={activeScreen === 'settings' ? accentColor : themeColors.textSecondary} />
            <Text
              style={[
                styles.navButtonText,
                { color: activeScreen === 'settings' ? accentColor : themeColors.textSecondary },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              activeScreen === 'folders' && { backgroundColor: accentColor + '25', borderColor: accentColor },
              { borderColor: themeColors.cardBorder },
            ]}
            onPress={() => setActiveScreen(activeScreen === 'folders' ? 'home' : 'folders')}
          >
            <FolderIcon size={16} color={activeScreen === 'folders' ? accentColor : themeColors.textSecondary} />
            <Text
              style={[
                styles.navButtonText,
                { color: activeScreen === 'folders' ? accentColor : themeColors.textSecondary },
              ]}
            >
              Folders
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instant Search Bar */}
      <View style={[styles.searchBarContainer, { backgroundColor: themeColors.inputBg, borderColor: themeColors.cardBorder }]}>
        <SearchIcon size={18} color={themeColors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes, tags, or content..."
          placeholderTextColor={themeColors.textMuted}
          style={[styles.searchInput, { color: themeColors.textPrimary }]}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Text style={{ color: themeColors.textMuted, fontSize: 13, fontWeight: '600' }}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    outlineStyle: 'none',
  } as any,
  clearSearchBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
