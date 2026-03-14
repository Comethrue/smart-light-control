import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Play, Square, RotateCcw, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDeviceStore } from '../stores/deviceStore';
import { useUIStore } from '../stores/uiStore';
import { useSettingsStore } from '../stores/settingsStore';
import { networkManager } from '../services/networkManager';
import { clamp, generateId, getBrightnessColor } from '../utils/helpers';
import { useTranslation } from '../i18n';
import type { Particle, TrailPoint } from '../types';

export const Simulation: React.FC = () => {
  const { deviceInfo, deviceState, updateDeviceState } = useDeviceStore();
  const { classSimulating, setClassSimulating, addLog } = useUIStore();
  const { darkMode } = useSettingsStore();
  const { t } = useTranslation();
  
  // 场景预设
  const scenes = [
    { id: 'class', name: t('simulation_class_mode'), icon: <BookOpen className="w-5 h-5" />, brightness: 80 },
    { id: 'break', name: t('simulation_break_mode'), icon: <Clock className="w-5 h-5" />, brightness: 40 },
  ];
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragBrightness, setDragBrightness] = useState(deviceState.brightness);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const [glowRings, setGlowRings] = useState<{id: string; y: number; scale: number; opacity: number}[]>([]);
  const [sparkles, setSparkles] = useState<{id: string; x: number; y: number; delay: number}[]>([]);
  
  // Refs
  const trackRef = useRef<HTMLDivElement>(null);
  const classSimulationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastY = useRef<number>(0);

  const isConnected = deviceInfo?.connected ?? false;

  // 同步亮度状态
  useEffect(() => {
    if (!isDragging) {
      setDragBrightness(deviceState.brightness);
    }
  }, [deviceState.brightness, isDragging]);

  // 计算亮度（根据Y坐标）
  const calculateBrightness = useCallback((clientY: number) => {
    if (!trackRef.current) return dragBrightness;
    
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = 1 - (relativeY / rect.height);
    return clamp(Math.round(percentage * 100), 0, 100);
  }, [dragBrightness]);

  // 生成粒子 - 增强版
  const spawnParticles = useCallback((x: number, y: number, velocity: number) => {
    const count = Math.min(Math.abs(velocity) * 2, 8);
    const newParticles: Particle[] = [];
    
    // 主粒子 - 金色系
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      const colors = ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7', '#ffffff'];
      newParticles.push({
        id: generateId(),
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed - Math.abs(velocity) * 0.4,
        life: 1,
        size: 2 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    // 光晕粒子 - 更大更亮
    if (Math.abs(velocity) > 6) {
      for (let i = 0; i < 2; i++) {
        newParticles.push({
          id: generateId(),
          x: x + (Math.random() - 0.5) * 16,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.abs(velocity) * 0.25,
          life: 1,
          size: 6 + Math.random() * 6,
          color: '#FEF3C7',
        });
      }
    }
    
    setParticles((prev) => [...prev, ...newParticles].slice(-40));
    
    // 生成光环效果
    if (Math.abs(velocity) > 10) {
      setGlowRings(prev => [...prev, {
        id: generateId(),
        y,
        scale: 0,
        opacity: 1
      }].slice(-3));
    }
  }, []);

  // 添加轨迹点
  const addTrailPoint = useCallback((x: number, y: number) => {
    setTrails((prev) => [
      ...prev,
      {
        id: generateId(),
        x,
        y,
        opacity: 1,
        timestamp: Date.now(),
      },
    ].slice(-20));
  }, []);

  // 更新粒子 - 优化性能
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12,
            life: p.life - 0.04,
          }))
          .filter((p) => p.life > 0)
      );
    }, 20);
    
    return () => clearInterval(interval);
  }, [particles.length]);

  // 更新轨迹透明度 - 优化性能
  useEffect(() => {
    if (trails.length === 0) return;
    
    const interval = setInterval(() => {
      setTrails((prev) =>
        prev
          .map((t) => ({
            ...t,
            opacity: t.opacity - 0.08,
          }))
          .filter((t) => t.opacity > 0)
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [trails.length]);

  // 更新光环效果 - 优化性能
  useEffect(() => {
    if (glowRings.length === 0) return;
    
    const interval = setInterval(() => {
      setGlowRings((prev) =>
        prev
          .map((r) => ({
            ...r,
            scale: r.scale + 0.12,
            opacity: r.opacity - 0.1,
          }))
          .filter((r) => r.opacity > 0)
      );
    }, 40);
    
    return () => clearInterval(interval);
  }, [glowRings.length]);

  // 生成闪烁效果 - 优化性能
  useEffect(() => {
    if (!isDragging) {
      setSparkles([]);
      return;
    }
    
    const interval = setInterval(() => {
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const fillHeight = (dragBrightness / 100) * rect.height;
        setSparkles(prev => [...prev, {
          id: generateId(),
          x: Math.random() * rect.width,
          y: rect.height - fillHeight + Math.random() * fillHeight,
          delay: Math.random() * 0.3
        }].slice(-5));
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [isDragging, dragBrightness]);

  // 触摸/鼠标事件处理
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    lastY.current = clientY;
    const brightness = calculateBrightness(clientY);
    setDragBrightness(brightness);
  }, [calculateBrightness]);

  const handleDragMove = useCallback((clientY: number, clientX: number) => {
    if (!isDragging || !trackRef.current) return;
    
    const brightness = calculateBrightness(clientY);
    setDragBrightness(brightness);
    
    const velocity = lastY.current - clientY;
    lastY.current = clientY;
    
    const rect = trackRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    
    if (Math.abs(velocity) > 2) {
      spawnParticles(localX, localY, velocity);
    }
    addTrailPoint(localX, localY);
  }, [isDragging, calculateBrightness, spawnParticles, addTrailPoint]);

  const handleDragEnd = useCallback(async () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (isConnected) {
      try {
        await networkManager.setBrightness(dragBrightness);
        if (dragBrightness > 0) {
          await networkManager.setPower(true);
        }
        updateDeviceState({ brightness: dragBrightness, power: dragBrightness > 0 });
        addLog(`亮度调整为 ${dragBrightness}%`, 'success');
      } catch {
        addLog('亮度调节失败', 'error');
      }
    } else {
      updateDeviceState({ brightness: dragBrightness, power: dragBrightness > 0 });
    }
  }, [isDragging, dragBrightness, isConnected, updateDeviceState, addLog]);

  // 触摸事件
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientY, touch.clientX);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  }, [handleDragEnd]);

  // 鼠标事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  }, [handleDragStart]);

  // 全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientY, e.clientX);
      };
      const handleGlobalMouseUp = () => {
        handleDragEnd();
      };
      
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 场景切换
  const handleSceneChange = useCallback(async (brightness: number, sceneName: string) => {
    if (isConnected) {
      try {
        await networkManager.setBrightness(brightness);
        await networkManager.setPower(true);
        updateDeviceState({ brightness, power: true });
        setDragBrightness(brightness);
        addLog(`${t('msg_scene_switched')} ${sceneName}`, 'success');
      } catch {
        addLog(t('msg_set_failed'), 'error');
      }
    } else {
      updateDeviceState({ brightness, power: true });
      setDragBrightness(brightness);
    }
  }, [isConnected, updateDeviceState, addLog, t]);

  // 上课模拟
  const handleClassSimulation = useCallback(() => {
    if (classSimulating) {
      if (classSimulationRef.current) {
        clearInterval(classSimulationRef.current);
        classSimulationRef.current = null;
      }
      setClassSimulating(false);
      addLog(t('msg_simulation_stopped'), 'info');
    } else {
      setClassSimulating(true);
      addLog(t('msg_simulation_started'), 'success');
      
      let step = 0;
      const scenarios = [
        { brightness: 100, message: t('simulation_work_mode') },
        { brightness: 80, message: t('simulation_read_mode') },
        { brightness: 40, message: t('simulation_movie_mode') },
        { brightness: 100, message: t('simulation_meeting_mode') },
        { brightness: 20, message: t('simulation_rest_mode') },
      ];
      
      classSimulationRef.current = setInterval(async () => {
        const scenario = scenarios[step % scenarios.length];
        
        if (isConnected) {
          try {
            await networkManager.setBrightness(scenario.brightness);
            await networkManager.setPower(true);
          } catch {
            // 忽略错误
          }
        }
        
        updateDeviceState({ brightness: scenario.brightness, power: true });
        setDragBrightness(scenario.brightness);
        addLog(scenario.message, 'info');
        step++;
      }, 4000);
    }
  }, [classSimulating, setClassSimulating, isConnected, updateDeviceState, addLog, t]);

  // 重置
  const handleReset = useCallback(async () => {
    if (classSimulationRef.current) {
      clearInterval(classSimulationRef.current);
      classSimulationRef.current = null;
    }
    setClassSimulating(false);
    
    if (isConnected) {
      try {
        await networkManager.setBrightness(50);
        await networkManager.setPower(false);
      } catch {
        // 忽略错误
      }
    }
    
    updateDeviceState({ brightness: 50, power: false });
    setDragBrightness(50);
    setParticles([]);
    setTrails([]);
    addLog(t('msg_reset_done'), 'info');
  }, [setClassSimulating, isConnected, updateDeviceState, addLog, t]);

  // 清理
  useEffect(() => {
    return () => {
      if (classSimulationRef.current) {
        clearInterval(classSimulationRef.current);
      }
    };
  }, []);

  const currentBrightness = isDragging ? dragBrightness : deviceState.brightness;

  return (
    <div className="space-y-4">
      {/* 场景预设 */}
      <Card title={t('simulation_quick_scene')} icon={<Sparkles className="w-5 h-5" />} delay={0}>
        <div className="grid grid-cols-2 gap-4">
          {scenes.map((scene) => (
            <motion.button
              key={scene.id}
              onClick={() => handleSceneChange(scene.brightness, scene.name)}
              className={`
                flex flex-col items-center gap-3 py-5 rounded-xl border transition-all
                ${currentBrightness === scene.brightness && deviceState.power
                  ? darkMode 
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                  : darkMode
                    ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {scene.icon}
              <span className="text-sm font-medium">{scene.name}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* 拖拽亮度控制 */}
      <Card delay={1}>
        <div className="flex items-center gap-8">
          {/* 垂直拖动条 */}
          <div className="relative flex-shrink-0 ml-2">
            <div
              ref={trackRef}
              className="relative w-16 h-72 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-visible cursor-pointer select-none border border-white/10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              style={{ touchAction: 'none' }}
            >
              {/* 背景纹理 */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.08)_0%,_transparent_70%)]" />
              </div>
              
              {/* 填充条 - 多层渐变 */}
              <div 
                className="absolute bottom-0 left-0 right-0 overflow-hidden" 
                style={{ 
                  height: `${currentBrightness}%`,
                  borderRadius: currentBrightness >= 95 ? '1rem' : '0 0 1rem 1rem',
                }}
              >
                {/* 基础填充 - 金色渐变 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400"
                  animate={{
                    opacity: isDragging ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.15 }}
                />
                {/* 发光叠加层 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/30"
                  animate={{
                    opacity: isDragging ? [0.2, 0.5, 0.2] : 0.15,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* 能量波纹 */}
                {isDragging && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.08) 10px, rgba(255,255,255,0.08) 12px)',
                    }}
                    animate={{ y: [0, -24] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </div>
              
              {/* 外发光效果 */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 rounded-full pointer-events-none"
                style={{ height: `${currentBrightness}%` }}
                animate={{
                  boxShadow: isDragging
                    ? `0 0 35px 8px rgba(251, 191, 36, ${0.35 + currentBrightness * 0.004}), 0 0 60px 15px rgba(251, 191, 36, ${0.15 + currentBrightness * 0.002})`
                    : `0 0 15px 4px rgba(251, 191, 36, ${0.15 + currentBrightness * 0.002})`,
                }}
                transition={{ duration: 0.2 }}
              />
              
              {/* 光环效果 */}
              <AnimatePresence>
                {glowRings.map((ring) => (
                  <motion.div
                    key={ring.id}
                    className="absolute left-1/2 -translate-x-1/2 w-16 h-3 rounded-full border border-amber-400 pointer-events-none"
                    style={{
                      top: ring.y - 6,
                      transform: `translateX(-50%) scaleX(${1 + ring.scale * 0.8}) scaleY(${0.4 + ring.scale * 0.3})`,
                      opacity: ring.opacity * 0.7,
                      boxShadow: '0 0 12px rgba(251, 191, 36, 0.5)',
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </AnimatePresence>
              
              {/* 轨迹效果 */}
              <AnimatePresence>
                {trails.map((trail) => (
                  <motion.div
                    key={trail.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: trail.x - 4,
                      top: trail.y - 4,
                      width: 8,
                      height: 8,
                      background: 'radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)',
                      opacity: trail.opacity,
                      boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)',
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                  />
                ))}
              </AnimatePresence>
              
              {/* 粒子效果 */}
              <AnimatePresence>
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: particle.x - particle.size / 2,
                      top: particle.y - particle.size / 2,
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                      opacity: particle.life,
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </AnimatePresence>
              
              {/* 闪烁效果 */}
              <AnimatePresence>
                {sparkles.map((sparkle) => (
                  <motion.div
                    key={sparkle.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: sparkle.x - 3,
                      top: sparkle.y - 3,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1.2, 0],
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: sparkle.delay,
                      ease: "easeOut" 
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* 拖动旋钮 */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-grab overflow-hidden"
                style={{ 
                  bottom: `calc(${currentBrightness * 0.86}% + 6px)`,
                  width: currentBrightness >= 95 ? '52px' : '56px',
                  height: currentBrightness >= 95 ? '32px' : '36px',
                  borderRadius: currentBrightness >= 95 ? '0.75rem' : '0.75rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
                }}
                animate={{
                  scale: isDragging ? 1.08 : 1,
                  boxShadow: isDragging
                    ? `0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25)`
                    : `0 4px 12px rgba(0, 0, 0, 0.25), 0 0 8px rgba(251, 191, 36, 0.25)`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* 旋钮内部光泽 */}
                {isDragging && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: [-16, 16, -16] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <span className="relative text-sm font-bold text-amber-600 tabular-nums">
                  {currentBrightness}%
                </span>
              </motion.div>
              
              {/* 刻度标签 */}
              <div className="absolute -right-9 top-0 text-[10px] text-white/60 font-medium">100</div>
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 text-[10px] text-white/60 font-medium">50</div>
              <div className="absolute -right-9 bottom-0 text-[10px] text-white/60 font-medium">0</div>
            </div>
          </div>

          {/* 灯光预览 */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <motion.div
              className="relative"
              animate={{
                scale: deviceState.power ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: deviceState.power ? Infinity : 0,
              }}
            >
              {/* 亮色模式下的背景光晕 */}
              {!darkMode && deviceState.power && (
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${getBrightnessColor(currentBrightness)} 0%, transparent 70%)`,
                    transform: 'scale(1.6)',
                  }}
                />
              )}
              <Lightbulb
                className="w-28 h-28 transition-all duration-300 relative z-10"
                style={{
                  color: deviceState.power
                    ? darkMode
                      ? getBrightnessColor(currentBrightness)
                      : `hsl(45, ${60 + currentBrightness * 0.4}%, ${40 + currentBrightness * 0.25}%)`  // 低亮度更暗淡
                    : darkMode ? '#525252' : '#9ca3af',
                  filter: deviceState.power
                    ? darkMode
                      ? `drop-shadow(0 0 ${16 + currentBrightness * 0.4}px ${getBrightnessColor(currentBrightness)})`
                      : `drop-shadow(0 0 ${24 + currentBrightness * 0.5}px hsl(45, 100%, 50%)) drop-shadow(0 0 ${12 + currentBrightness * 0.3}px hsl(35, 100%, 55%))`
                    : 'none',
                }}
              />
            </motion.div>
            <p className={`mt-4 text-3xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {currentBrightness}%
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              {deviceState.power ? t('control_power_on') : t('control_power_off')}
            </p>
            {!isConnected && (
              <p className="text-xs text-warning mt-2">{t('control_offline_mode')}</p>
            )}
          </div>
        </div>
      </Card>

      {/* 控制按钮 */}
      <Card delay={2}>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={classSimulating ? 'danger' : 'blue'}
            onClick={handleClassSimulation}
            icon={classSimulating ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            fullWidth
          >
            {classSimulating ? t('simulation_stop') : t('simulation_scene_cycle')}
          </Button>
          <Button
            variant="blue"
            onClick={handleReset}
            icon={<RotateCcw className="w-4 h-4" />}
            fullWidth
          >
            {t('simulation_reset')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
