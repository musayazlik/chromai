"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const hexInt = parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

/**
 * Magic UI Particles — animated, mouse-reactive canvas particle field.
 * Self-contained inside a single effect (no render-body state/functions) so it
 * plays nicely with the React Compiler lint rules. Respects reduced motion.
 */
export function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rgb = hexToRgb(color);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let circles: Circle[] = [];
    const mouse = { x: 0, y: 0 };
    const canvasSize = { w: 0, h: 0 };
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const remap = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number,
    ): number => {
      const remapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    };

    const circleParams = (): Circle => ({
      x: Math.floor(Math.random() * canvasSize.w),
      y: Math.floor(Math.random() * canvasSize.h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    });

    const drawCircle = (circle: Circle, update = false) => {
      const { x, y, translateX, translateY, size: s, alpha } = circle;
      ctx.translate(translateX, translateY);
      ctx.beginPath();
      ctx.arc(x, y, s, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) circles.push(circle);
    };

    const clearContext = () => ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    const resizeCanvas = () => {
      canvasSize.w = container.offsetWidth;
      canvasSize.h = container.offsetHeight;
      canvas.width = canvasSize.w * dpr;
      canvas.height = canvasSize.h * dpr;
      canvas.style.width = `${canvasSize.w}px`;
      canvas.style.height = `${canvasSize.h}px`;
      ctx.scale(dpr, dpr);
      circles = [];
      for (let i = 0; i < quantity; i++) drawCircle(circleParams());
    };

    const animate = () => {
      clearContext();
      circles.forEach((circle, i) => {
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSize.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSize.h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(
          remap(closestEdge, 0, 20, 0, 1).toFixed(2),
        );
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY +=
          (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        drawCircle(circle, true);

        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.h + circle.size
        ) {
          circles.splice(i, 1);
          drawCircle(circleParams());
        }
      });
      rafId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSize;
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
        mouse.x = x;
        mouse.y = y;
      }
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    };

    resizeCanvas();
    if (!reducedMotion) animate();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, quantity, staticity, ease, size, refresh, vx, vy]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
