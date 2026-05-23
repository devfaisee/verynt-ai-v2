import React, { useState, useRef } from 'react';
import { Network, Plus, Trash2, Cpu, HelpCircle, RefreshCw } from 'lucide-react';

export default function FlowTool({ incrementUsage }) {
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Verynt Launch Strategy', x: 200, y: 150, isRoot: true },
    { id: 2, text: 'Programmatic SEO', x: 80, y: 80 },
    { id: 3, text: 'Stripe Quota Gate', x: 320, y: 80 },
    { id: 4, text: 'Product Hunt Launch', x: 200, y: 240 }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const canvasRef = useRef(null);

  const handleCanvasDoubleClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode = {
      id: Date.now(),
      text: `Double-click to edit`,
      x,
      y
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    incrementUsage();
  };

  const handleNodeMouseDown = (id, e) => {
    e.stopPropagation();
    setDraggedNodeId(id);
    setSelectedNodeId(id);
  };

  const handleCanvasMouseMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(node => 
      node.id === draggedNodeId ? { ...node, x, y } : node
    ));
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleNodeTextChange = (id, newText) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, text: newText } : node
    ));
  };

  const deleteSelectedNode = () => {
    if (selectedNodeId === 1) {
      alert("Cannot delete the central core strategy node!");
      return;
    }
    setNodes(prev => prev.filter(node => node.id !== selectedNodeId));
    setSelectedNodeId(1);
    incrementUsage();
  };

  const expandAINode = () => {
    incrementUsage();
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    if (!selectedNode) return;

    // Simulate spawning offline children nodes around the selected node
    const offset = 90;
    const angles = [Math.PI / 4, (Math.PI * 3) / 4, (Math.PI * 5) / 4];
    
    const ideas = [
      "Target long-tail keywords",
      "Upload 15s viral clips",
      "Setup offline PWAs"
    ];

    const newChildren = ideas.map((idea, index) => {
      const angle = angles[index];
      return {
        id: Date.now() + index,
        text: idea,
        x: selectedNode.x + offset * Math.cos(angle),
        y: selectedNode.y + offset * Math.sin(angle)
      };
    });

    setNodes(prev => [...prev, ...newChildren]);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Network className="w-6 h-6 text-[#00f2fe]" /> Verynt Flow
        </h2>
        <p className="text-sm text-gray-400">
          Diamond-tier infinite interactive brainstorming mindmap. Double-click the canvas to spawn new nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Parameters & AI Node controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-[#00f2fe]" /> AI Mindmap Controller
            </h3>

            {/* Selection Info */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900 leading-relaxed text-gray-400">
              <span className="text-[10px] font-bold text-[#00f2fe] uppercase block tracking-wider">Active Workspace Tip</span>
              <p>1. Double-click the canvas grid to spawn nodes.</p>
              <p>2. Drag nodes around to organize connecting lines.</p>
              <p>3. Select a node to edit text or run the AI expander.</p>
            </div>

            {/* Node Edit Tool */}
            {selectedNodeId && (
              <div className="space-y-3 pt-3 border-t border-slate-900">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Edit Node Label</span>
                <input 
                  type="text" 
                  value={nodes.find(n => n.id === selectedNodeId)?.text || ''} 
                  onChange={(e) => handleNodeTextChange(selectedNodeId, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none"
                />

                <div className="flex gap-2">
                  <button 
                    onClick={expandAINode}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display font-bold rounded-lg flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform"
                  >
                    <Cpu className="w-4 h-4 animate-pulse" /> AI Expand Node
                  </button>

                  <button 
                    onClick={deleteSelectedNode}
                    className="p-2.5 bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-lg hover:bg-rose-900 hover:text-white transition-colors"
                    title="Delete Node"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Interactive Flow Grid Canvas */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-2 rounded-3xl bg-slate-950/20 border border-slate-800/80 relative overflow-hidden select-none">
            
            {/* Connection Lines (SVG Overlay) */}
            <div 
              ref={canvasRef}
              onDoubleClick={handleCanvasDoubleClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="w-full h-[380px] bg-slate-950/60 rounded-2xl relative overflow-hidden active:cursor-grabbing cursor-grab"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '16px 16px'
              }}
            >
              {/* Draw Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {nodes.map(node => {
                  if (node.isRoot) return null;
                  
                  // Connect every child node back to the closest node or core root
                  const root = nodes.find(n => n.isRoot);
                  return (
                    <line
                      key={node.id}
                      x1={node.x}
                      y1={node.y}
                      x2={root.x}
                      y2={root.y}
                      stroke="rgba(0, 242, 254, 0.25)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>

              {/* Draw Nodes */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                  className={`absolute p-3 rounded-xl backdrop-blur-md cursor-pointer border select-none transition-all duration-150 z-10 ${
                    node.isRoot 
                      ? 'bg-gradient-to-r from-[#9b51e0]/80 to-[#00f2fe]/80 border-cyan-400 text-white font-extrabold shadow-lg shadow-purple-950/30' 
                      : selectedNodeId === node.id
                        ? 'bg-slate-900 border-[#00f2fe] text-white shadow-lg shadow-cyan-950/20'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 text-gray-300'
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Outfit, Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: node.isRoot ? '700' : '500'
                  }}
                >
                  {node.text}
                </div>
              ))}
            </div>

            {/* Quick helper badge */}
            <div className="absolute bottom-6 right-6 text-[10px] text-gray-500 font-bold bg-slate-950 border border-slate-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-none">
              <Network className="w-3.5 h-3.5 text-[#00f2fe]" />
              Double-click grid to spawn notes
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
