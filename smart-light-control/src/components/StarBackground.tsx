import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  color: string;
  isGold: boolean;
}

export const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // 初始化粒子
    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000); // 适中密度
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const isGold = Math.random() < 0.12; // 12%的金色星星
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // 缓慢漂移
          vy: (Math.random() - 0.5) * 0.2,
          radius: isGold ? Math.random() * 2 + 1.2 : Math.random() * 1.2 + 0.5,
          opacity: Math.random() * 0.6 + 0.3, // 更高透明度
          targetOpacity: Math.random() * 0.6 + 0.3,
          color: isGold ? '#D4A574' : '#FFFFFF', // 纯白色星星
          isGold,
        });
      }
    };

    // 鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // 绘制粒子
    const drawParticle = (p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      // 白色星星添加微光
      if (!p.isGold && p.opacity > 0.5 && p.radius > 0.8) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.fill();
      }

      // 金色星星添加光晕
      if (p.isGold && p.opacity > 0.4) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 3
        );
        gradient.addColorStop(0, `rgba(212, 165, 116, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.fill();
      }
    };

    // 绘制连线
    const drawLines = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 130; // 连接距离
      const mouseConnectionDistance = 160;

      ctx.globalAlpha = 1;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // 粒子之间的连线（白色）
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // 金色星星之间用金色线，其他用白色
            const lineColor = (p1.isGold || p2.isGold) 
              ? `rgba(212, 165, 116, ${opacity})` 
              : `rgba(255, 255, 255, ${opacity * 0.6})`;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        // 鼠标连线（金色）
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDistance < mouseConnectionDistance) {
          const opacity = (1 - mDistance / mouseConnectionDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    };

    // 更新粒子
    const updateParticles = () => {
      const particles = particlesRef.current;

      particles.forEach((p) => {
        // 移动
        p.x += p.vx;
        p.y += p.vy;

        // 边界检测
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // 闪烁效果
        if (Math.random() < 0.008) {
          p.targetOpacity = Math.random() * 0.6 + 0.3;
        }
        p.opacity += (p.targetOpacity - p.opacity) * 0.02;
      });
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawLines();

      particlesRef.current.forEach((p) => {
        drawParticle(p);
      });

      updateParticles();

      animationRef.current = requestAnimationFrame(animate);
    };

    // 初始化
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 0,
        background: 'transparent',
      }}
    />
  );
};
