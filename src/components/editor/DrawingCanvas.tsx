import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PenTool, Eraser, RotateCcw, Check, X } from 'lucide-react';
import { ThemeColors } from '../../theme/colors';

interface DrawingCanvasProps {
  themeColors: ThemeColors;
  accentColor: string;
  onSave: (svgPath: string) => void;
  onClose: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  themeColors,
  accentColor,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState(accentColor);
  const [strokeWidth, _setStrokeWidth] = useState(3);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = themeColors.card;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [themeColors.card]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = mode === 'eraser' ? themeColors.card : strokeColor;
    ctx.lineWidth = mode === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = themeColors.card;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      onSave(dataUrl);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
      <View style={[styles.header, { borderBottomColor: themeColors.divider }]}>
        <View style={styles.titleRow}>
          <PenTool size={18} color={accentColor} />
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Drawing Canvas</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={20} color={themeColors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: '100%', height: 300, cursor: 'crosshair', borderRadius: 8 }}
        />
      </View>

      {/* Drawing Toolbar */}
      <View style={[styles.toolbar, { borderTopColor: themeColors.divider }]}>
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[styles.toolBtn, mode === 'pen' && { backgroundColor: accentColor + '25', borderColor: accentColor }]}
            onPress={() => setMode('pen')}
          >
            <PenTool size={16} color={mode === 'pen' ? accentColor : themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, mode === 'eraser' && { backgroundColor: accentColor + '25', borderColor: accentColor }]}
            onPress={() => setMode('eraser')}
          >
            <Eraser size={16} color={mode === 'eraser' ? accentColor : themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={clearCanvas}>
            <RotateCcw size={16} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Color Palette */}
        {mode === 'pen' && (
          <View style={styles.colorGroup}>
            {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ffffff'].map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  strokeColor === c && { borderWidth: 2, borderColor: '#ffffff' },
                ]}
                onPress={() => setStrokeColor(c)}
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: accentColor }]} onPress={handleSave}>
          <Check size={16} color="#ffffff" />
          <Text style={styles.saveText}>Save Drawing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginVertical: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
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
  closeBtn: {
    padding: 4,
  },
  canvasWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
  },
  toolGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
