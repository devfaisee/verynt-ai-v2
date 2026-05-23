import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, HelpCircle, RefreshCw, Cpu, Columns, RotateCw, Plus } from 'lucide-react';

export default function VisionaryTool({ incrementUsage }) {
  const [equationType, setEquationType] = useState('wave'); // 'wave', 'torus', 'sphere'
  const [neonColor, setNeonColor] = useState('#00f2fe'); // '#00f2fe' (teal), '#9b51e0' (purple), '#f43f5e' (rose)
  const canvasRef = useRef(null);

  // 3D rotation angles
  const angleX = useRef(0.5);
  const angleY = useRef(0.5);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      if (canvasRef.current) {
        draw3DGraph();
      }
      // Auto rotate if not dragging
      if (!isDragging.current) {
        angleX.current += 0.005;
        angleY.current += 0.005;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [equationType, neonColor]);

  const draw3DGraph = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 80;

    // Generate 3D Grid Points
    const points = [];
    const resolution = 20;

    if (equationType === 'wave') {
      // Wave ripples: z = sin(r) / r
      for (let i = -10; i <= 10; i++) {
        for (let j = -10; j <= 10; j++) {
          const x = i / 2;
          const y = j / 2;
          const r = Math.sqrt(x * x + y * y) + 0.0001;
          const z = Math.sin(r) / r;
          points.push({ x, y, z });
        }
      }
    } else if (equationType === 'torus') {
      // Torus grid coordinates
      const R = 3; // major radius
      const r = 1.2; // minor radius
      for (let i = 0; i < resolution; i++) {
        const theta = (i / resolution) * Math.PI * 2;
        for (let j = 0; j < resolution; j++) {
          const phi = (j / resolution) * Math.PI * 2;
          const x = (R + r * Math.cos(phi)) * Math.cos(theta);
          const y = (R + r * Math.cos(phi)) * Math.sin(theta);
          const z = r * Math.sin(phi);
          points.push({ x: x / 1.5, y: y / 1.5, z: z / 1.5 });
        }
      }
    } else {
      // Sphere coordinates
      for (let i = 0; i < resolution; i++) {
        const lat = (i / resolution) * Math.PI - Math.PI / 2;
        for (let j = 0; j < resolution; j++) {
          const lon = (j / resolution) * Math.PI * 2;
          const x = 2 * Math.cos(lat) * Math.cos(lon);
          const y = 2 * Math.cos(lat) * Math.sin(lon);
          const z = 2 * Math.sin(lat);
          points.push({ x, y, z });
        }
      }
    }

    // Apply 3D Rotation Matrices
    const cosX = Math.cos(angleX.current);
    const sinX = Math.sin(angleX.current);
    const cosY = Math.cos(angleY.current);
    const sinY = Math.sin(angleY.current);

    const projectedPoints = points.map(p => {
      // Rotate Y axis
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;

      // Rotate X axis
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      // 3D to 2D projection formula with perspective depth
      const distance = 8;
      const fovScale = distance / (distance + z2);
      const screenX = centerX + x1 * scale * fovScale;
      const screenY = centerY - y2 * scale * fovScale;

      return { x: screenX, y: screenY, depth: z2 };
    });

    // Draw Wireframe Mesh Connector Lines
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 0.5;

    const rowSize = equationType === 'wave' ? 21 : resolution;

    for (let i = 0; i < projectedPoints.length; i++) {
      const p = projectedPoints[i];
      
      // Calculate opacity based on depth (fading back coordinates)
      const alpha = Math.max(0.1, Math.min(0.9, (3 - p.depth) / 4));
      ctx.strokeStyle = neonColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');

      // Connect to adjacent horizontal point
      if ((i + 1) % rowSize !== 0 && i + 1 < projectedPoints.length) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(projectedPoints[i + 1].x, projectedPoints[i + 1].y);
        ctx.stroke();
      }

      // Connect to adjacent vertical point
      if (i + rowSize < projectedPoints.length) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(projectedPoints[i + rowSize].x, projectedPoints[i + rowSize].y);
        ctx.stroke();
      }
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    incrementUsage();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    angleY.current += deltaX * 0.01;
    angleX.current += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#00f2fe]" /> Verynt Visionary
        </h2>
        <p className="text-sm text-gray-400">
          Diamond-tier 3D mathematical mesh projector. Click and drag the canvas to rotate structure in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph Parameters Selector (Left Side) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-1">
              <Cpu className="w-4 h-4 text-[#00f2fe]" /> Projection Controls
            </h3>

            {/* Mesh Equation Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Select 3D Mesh Equation</span>
              <div className="grid grid-cols-1 gap-2 font-bold font-display">
                <button
                  onClick={() => setEquationType('wave')}
                  className={`py-3 px-4 rounded-xl border text-left transition-colors ${
                    equationType === 'wave' ? 'border-[#00f2fe] bg-cyan-950/30 text-white' : 'border-slate-800 text-gray-400 hover:bg-slate-900/40'
                  }`}
                >
                  Wave Ripples (z = sin(r)/r)
                </button>
                <button
                  onClick={() => setEquationType('torus')}
                  className={`py-3 px-4 rounded-xl border text-left transition-colors ${
                    equationType === 'torus' ? 'border-[#9b51e0] bg-purple-950/30 text-white' : 'border-slate-800 text-gray-400 hover:bg-slate-900/40'
                  }`}
                >
                  Torus Rotational Donut
                </button>
                <button
                  onClick={() => setEquationType('sphere')}
                  className={`py-3 px-4 rounded-xl border text-left transition-colors ${
                    equationType === 'sphere' ? 'border-[#00f2fe] bg-cyan-950/30 text-white' : 'border-slate-800 text-gray-400 hover:bg-slate-900/40'
                  }`}
                >
                  Spherical Mesh Grid
                </button>
              </div>
            </div>

            {/* Neon Glow Colors */}
            <div className="space-y-2 border-t border-slate-900 pt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Neon Shaders Palette</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setNeonColor('#00f2fe')} 
                  className={`h-8 w-8 rounded-full bg-cyan-400 border-2 transition-all ${neonColor === '#00f2fe' ? 'border-white scale-105' : 'border-transparent'}`} 
                />
                <button 
                  onClick={() => setNeonColor('#9b51e0')} 
                  className={`h-8 w-8 rounded-full bg-purple-600 border-2 transition-all ${neonColor === '#9b51e0' ? 'border-white scale-105' : 'border-transparent'}`} 
                />
                <button 
                  onClick={() => setNeonColor('#f43f5e')} 
                  className={`h-8 w-8 rounded-full bg-rose-500 border-2 transition-all ${neonColor === '#f43f5e' ? 'border-white scale-105' : 'border-transparent'}`} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3D Projection Canvas (Right Side) */}
        <div className="lg:col-span-8 flex items-center justify-center">
          <div className="glass-panel p-4 rounded-3xl bg-black border border-slate-800 shadow-2xl relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width="450"
              height="350"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="rounded-2xl cursor-grab bg-slate-950/80 active:cursor-grabbing"
              title="Click and drag to spin 3D function graph!"
            />
            {/* Quick Helper Overlay */}
            <div className="absolute bottom-6 right-6 text-[10px] font-bold text-gray-400 bg-slate-900/60 backdrop-blur border border-slate-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1 pointer-events-none select-none">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              Drag to Rotate Graph Offline
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
