import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, PenTool, Mic, CheckSquare, FolderPlus, X } from 'lucide-react';
import { ThemeColors } from '../../theme/colors';
import { HapticsService } from '../../services/HapticsService';

interface FABProps {
  themeColors: ThemeColors;
  accentColor: string;
  onCreateNote: () => void;
  onCreateChecklistNote: () => void;
  onCreateDrawingNote: () => void;
  onCreateFolder: () => void;
}

export const FAB: React.FC<FABProps> = ({
  themeColors,
  accentColor,
  onCreateNote,
  onCreateChecklistNote,
  onCreateDrawingNote,
  onCreateFolder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    HapticsService.trigger('medium');
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <View style={styles.fabWrapper}>
      {isOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
            onPress={() => handleAction(onCreateFolder)}
            activeOpacity={0.8}
          >
            <FolderPlus size={16} color={accentColor} />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>New Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
            onPress={() => handleAction(onCreateDrawingNote)}
            activeOpacity={0.8}
          >
            <PenTool size={16} color="#8b5cf6" />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>Drawing Canvas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
            onPress={() => handleAction(onCreateChecklistNote)}
            activeOpacity={0.8}
          >
            <CheckSquare size={16} color="#10b981" />
            <Text style={[styles.menuText, { color: themeColors.textPrimary }]}>Checklist</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.mainFab,
          {
            backgroundColor: accentColor,
            transform: [{ scale: isOpen ? 1.05 : 1 }],
          },
        ]}
        onPress={toggleMenu}
        activeOpacity={0.85}
      >
        {isOpen ? <X size={26} color="#ffffff" /> : <Plus size={26} color="#ffffff" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 999,
  },
  menuContainer: {
    marginBottom: 12,
    gap: 8,
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mainFab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
