import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
}

export const LightBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let meteors: Meteor[] = [];
    let time = 0;
    let hue = 200;

    const colors = [
      'rgba(99, 102, 241, 0.8)',   // 紫蓝
      'rgba(59, 130, 246, 0.8)',   // 蓝色
      'rgba(14, 165, 233, 0.8)',   // 天蓝
      'rgba(6, 182, 212, 0.8)',    // 青色
      'rgba(168, 85, 247, 0.8)',   // 紫色
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // 初始化粒子 - 优化数量
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 60);
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1.5 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.5 + Math.random() * 0.3,
        });
      }
    };

    // 初始化流星 - 减少数量
    const initMeteors = () => {
      meteors = [];
      for (let i = 0; i < 3; i++) {
        meteors.push(createMeteor());
      }
    };

    const createMeteor = (): Meteor => ({
      x: Math.random() * canvas.width * 1.5,
      y: -100,
      length: 80 + Math.random() * 120,
      speed: 4 + Math.random() * 6,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      alpha: 0.3 + Math.random() * 0.4,
    });

    // 绘制渐变背景
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const h1 = (hue + Math.sin(time * 0.5) * 10) % 360;
      const h2 = (hue + 40 + Math.cos(time * 0.3) * 15) % 360;
      
      gradient.addColorStop(0, `hsl(${h1}, 30%, 97%)`);
      gradient.addColorStop(0.5, `hsl(${h2}, 35%, 95%)`);
      gradient.addColorStop(1, `hsl(${(h1 + 60) % 360}, 25%, 96%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // 绘制波浪背景
    const drawWaves = () => {
      const waveColors = [
        'rgba(99, 102, 241, 0.03)',
        'rgba(59, 130, 246, 0.04)',
        'rgba(14, 165, 233, 0.03)',
      ];
      
      waveColors.forEach((color, i) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height * 0.7 + 
            Math.sin(x * 0.003 + time * (0.5 + i * 0.2)) * 50 +
            Math.sin(x * 0.006 + time * (0.3 + i * 0.1)) * 30 +
            i * 80;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });
    };

    // 绘制粒子和连接线 - 优化性能
    const drawParticles = () => {
      const mouse = mouseRef.current;
      const connectionDistance = 120;
      const mouseRadius = 150;

      // 更新粒子位置
      particles.forEach((p) => {
        // 鼠标交互
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            p.vx -= (dx / dist) * force * 0.3;
            p.vy -= (dy / dist) * force * 0.3;
          }
        }

        // 回弹到原始位置
        p.vx += (p.originX - p.x) * 0.003;
        p.vy += (p.originY - p.y) * 0.003;
        
        // 摩擦力
        p.vx *= 0.97;
        p.vy *= 0.97;
        
        p.x += p.vx;
        p.y += p.vy;
      });

      // 绘制连接线 - 使用简化算法
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < connectionDistance * connectionDistance) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 绘制粒子 - 简化光晕
      particles.forEach((p) => {
        // 外光晕
        ctx.fillStyle = p.color.replace('0.8', String(p.alpha * 0.3));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 核心
        ctx.fillStyle = p.color.replace('0.8', String(p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 鼠标位置光晕
      if (mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouseRadius
        );
        mouseGlow.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // 绘制流星
    const drawMeteors = () => {
      meteors.forEach((meteor, index) => {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        
        // 重置流星
        if (meteor.y > canvas.height + 100 || meteor.x > canvas.width + 100) {
          meteors[index] = createMeteor();
          return;
        }
        
        // 绘制流星尾巴
        const gradient = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        gradient.addColorStop(0, `rgba(99, 102, 241, ${meteor.alpha})`);
        gradient.addColorStop(0.3, `rgba(59, 130, 246, ${meteor.alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        ctx.stroke();
        
        // 流星头部光点
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.alpha})`;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // 绘制漂浮光圈 - 简化
    const drawFloatingCircles = () => {
      const circles = [
        { x: 0.15, y: 0.25, size: 180, hue: 240 },
        { x: 0.85, y: 0.35, size: 150, hue: 200 },
        { x: 0.7, y: 0.75, size: 160, hue: 280 },
      ];
      
      circles.forEach((c, i) => {
        const x = canvas.width * c.x + Math.sin(time * 0.4 + i) * 30;
        const y = canvas.height * c.y + Math.cos(time * 0.3 + i * 1.5) * 25;
        const size = c.size + Math.sin(time * 0.5 + i) * 15;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `hsla(${c.hue}, 70%, 70%, 0.1)`);
        gradient.addColorStop(0.6, `hsla(${c.hue}, 60%, 75%, 0.05)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // 绘制装饰线条
    const drawDecoLines = () => {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      
      // 动态曲线
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const startY = canvas.height * (0.3 + i * 0.2);
        ctx.moveTo(0, startY);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = startY + 
            Math.sin(x * 0.01 + time * 0.8 + i) * 30 +
            Math.sin(x * 0.02 + time * 0.5) * 15;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const animate = () => {
      time += 0.01;
      
      drawBackground();
      drawWaves();
      drawFloatingCircles();
      drawDecoLines();
      drawMeteors();
      drawParticles();
      
      animationId = requestAnimationFrame(animate);
    };

    // 鼠标事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resizeCanvas();
    initMeteors();
    
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f5f3ff 100%)' }}
    />
  );
};
