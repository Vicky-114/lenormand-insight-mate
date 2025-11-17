import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Constellation {
  stars: number[];
}

export const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const constellationsRef = useRef<Constellation[]>([]);
  const animationFrameRef = useRef<number>();

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
      const numStars = 200;
      starsRef.current = [];
      
      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
      }

      generateConstellations();
    };

    // Generate random constellations
    const generateConstellations = () => {
      constellationsRef.current = [];
      const numConstellations = Math.floor(Math.random() * 3) + 2; // 2-4 constellations
      
      for (let i = 0; i < numConstellations; i++) {
        const numStarsInConstellation = Math.floor(Math.random() * 4) + 3; // 3-6 stars
        const availableStars = starsRef.current.length;
        const constellation: Constellation = { stars: [] };
        
        // Pick random stars that are relatively close to each other
        const startIdx = Math.floor(Math.random() * (availableStars - numStarsInConstellation));
        for (let j = 0; j < numStarsInConstellation; j++) {
          constellation.stars.push(startIdx + j);
        }
        
        constellationsRef.current.push(constellation);
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        star.opacity = Math.max(0.3, Math.min(1, star.opacity));

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });


      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    // Change constellations every 10 seconds
    const constellationInterval = setInterval(() => {
      generateConstellations();
    }, 10000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(constellationInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
