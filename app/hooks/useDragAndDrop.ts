import { useState, useRef, useCallback, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface UseDragAndDropProps {
  onPositionChange: (x: number, y: number) => void;
  initialX?: number;
  initialY?: number;
}

// Throttle function per limitare le chiamate
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

export const useDragAndDrop = ({ onPositionChange, initialX = 50, initialY = 50 }: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: initialX,
    currentY: initialY
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const listenersAdded = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY
    }));
  }, []);

  // Throttled mouse move handler
  const throttledMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (!dragState.isDragging || !elementRef.current) return;

      const container = elementRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      // Converti pixel in percentuale
      const newX = Math.max(0, Math.min(100, dragState.currentX + (deltaX / containerRect.width) * 100));
      const newY = Math.max(0, Math.min(100, dragState.currentY + (deltaY / containerRect.height) * 100));

      setDragState(prev => ({
        ...prev,
        currentX: newX,
        currentY: newY
      }));
    }, 16), // ~60fps
    [dragState.isDragging, dragState.startX, dragState.startY, dragState.currentX, dragState.currentY]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      onPositionChange(dragState.currentX, dragState.currentY);
      setDragState(prev => ({
        ...prev,
        isDragging: false
      }));
    }
  }, [dragState.isDragging, dragState.currentX, dragState.currentY, onPositionChange]);

  // Gestisci event listeners con useEffect
  useEffect(() => {
    if (dragState.isDragging && !listenersAdded.current) {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      listenersAdded.current = true;
    } else if (!dragState.isDragging && listenersAdded.current) {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      listenersAdded.current = false;
    }

    return () => {
      if (listenersAdded.current) {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        listenersAdded.current = false;
      }
    };
  }, [dragState.isDragging, throttledMouseMove, handleMouseUp]);

  return {
    elementRef,
    handleMouseDown,
    isDragging: dragState.isDragging,
    position: { x: dragState.currentX, y: dragState.currentY }
  };
}; 