import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseSize: number;
  baseOpacity: number;
  amplitude: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
}

export const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationFrameRef = useRef<number>();
  const lastShootingStarRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize stars
    const initStars = () => {
      const numStars = 260;
      starsRef.current = [];
      
      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseSize: 0.6 + Math.random() * 1.8,
          baseOpacity: 0.5 + Math.random() * 0.4,
          amplitude: 0.2 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
        });
      }
    };

    // Create shooting star
    const createShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? 0 : canvas.width;
      const startY = Math.random() * canvas.height * 0.5; // Top half
      const angle = fromLeft ? Math.PI / 6 : (5 * Math.PI / 6); // Diagonal down
      const speed = 8 + Math.random() * 4;
      
      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 60 + Math.random() * 40,
        opacity: 1,
        life: 1,
      });
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      const t = performance.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw twinkling stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(t * star.speed + star.phase);
        const opacity = Math.min(1, Math.max(0.2, star.baseOpacity + star.amplitude * twinkle));
        const size = Math.max(0.5, star.baseSize * (0.9 + 0.1 * (1 + Math.cos(t * star.speed + star.phase))));

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.012;
        star.opacity = Math.max(0, star.life);

        if (star.opacity > 0 && star.x >= 0 && star.x <= canvas.width && star.y >= 0 && star.y <= canvas.height) {
          // Draw shooting star trail
          const gradient = ctx.createLinearGradient(
            star.x,
            star.y,
            star.x - star.vx * star.length / 10,
            star.y - star.vy * star.length / 10
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - star.vx * star.length / 10,
            star.y - star.vy * star.length / 10
          );
          ctx.stroke();

          return true;
        }
        return false;
      });

      // Create shooting star every 20 seconds
      if (t - lastShootingStarRef.current > 20000) {
        createShootingStar();
        lastShootingStarRef.current = t;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
