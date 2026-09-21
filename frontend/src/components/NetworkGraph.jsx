import React, { useState } from 'react';
import { Share2, ShieldCheck, ArrowRight, Zap, Info, Layers } from 'lucide-react';

export const NetworkGraph = ({ networkData, onSelectService }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!networkData || !networkData.nodes || networkData.nodes.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', borderRadius: '12px' }}>
        <p>Loading Tourism Trust Network graph data...</p>
      </div>
    );
  }

  const { nodes, edges, frequent_pathways } = networkData;

  // Calculate layout positions for SVG visualization
  // Group nodes by category to create a clear Left-to-Right flow:
  // Hotel (Column 1) -> Taxi (Column 2) -> Guide (Column 3) -> Activity/Business (Column 4)
  const categoryColumns = {
    'Hotel': 120,
    'Taxi': 340,
    'Guide': 560,
    'Activity': 780,
    'Local Business': 780
  };

  const categoryCounts = {};
  const processedNodes = nodes.map(node => {
    const cat = node.category || 'Hotel';
    const colX = categoryColumns[cat] || 400;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    const rowY = 80 + categoryCounts[cat] * 90;

    return {
      ...node,
      x: colX,
      y: rowY
    };
  });

  const nodeMap = {};
  processedNodes.forEach(n => { nodeMap[n.id] = n; });

  const categoryColors = {
    'Hotel': '#0ea5e9',
    'Taxi': '#f59e0b',
    'Guide': '#10b981',
    'Activity': '#ec4899',
    'Local Business': '#8b5cf6'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontWeight: 800, fontSize: '1.2rem' }}>
            <Share2 size={24} />
            <span>Tourism Trust Network Engine</span>
            <span className="badge badge-trust" style={{ marginLeft: '0.5rem' }}>NetworkX Powered</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Identifies repeated ecosystem pathways across Hotels → Taxis → Guides → Activities based on verified tourist telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Network Nodes:</span> <strong style={{ color: '#0ea5e9' }}>{nodes.length} Services</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Verified Links:</span> <strong style={{ color: '#10b981' }}>{edges.length} Connections</strong>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph & Inspector Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* SVG Network Visualizer Canvas */}
        <div className="network-visualizer-container" style={{ background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
          {/* Legend Overlay */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', backdropFilter: 'blur(4px)', zIndex: 10 }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Ecosystem Layer Flow</span>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'white' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></span> Hotel</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Taxi</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Guide</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899' }}></span> Activity</span>
            </div>
          </div>

          <svg width="100%" height="100%" viewBox="0 0 920 520">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
              </marker>
            </defs>

            {/* Render Connection Edges */}
            {edges.map((edge) => {
              const srcNode = nodeMap[edge.source];
              const tgtNode = nodeMap[edge.target];
              if (!srcNode || !tgtNode) return null;

              const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isSelected ? '#0ea5e9' : '#334155'}
                    strokeWidth={isSelected ? 3 : Math.min(4, 1 + edge.repeat_count / 10)}
                    strokeDasharray={edge.type === 'USER_VERIFIED_LINK' ? '5,5' : 'none'}
                    markerEnd={isSelected ? 'url(#arrow-active)' : 'url(#arrow)'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  <text
                    x={(srcNode.x + tgtNode.x) / 2}
                    y={(srcNode.y + tgtNode.y) / 2 - 6}
                    fill={isSelected ? '#0ea5e9' : '#64748b'}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {edge.repeat_count}x repeat
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {processedNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const color = categoryColors[node.category] || '#0ea5e9';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Trust Pulsing Ring */}
                  <circle
                    r={isSelected ? 26 : 22}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  {/* Inner Node Circle */}
                  <circle
                    r={14}
                    fill={color}
                  />
                  {/* Node Label & Score */}
                  <text
                    y="-28"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                  </text>
                  <text
                    y="4"
                    fill="white"
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {node.trust_score}
                  </text>
                  <text
                    y="32"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {node.category}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="card" style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155' }}>
          {selectedNode ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-trust">{selectedNode.category}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID #{selectedNode.service_id}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.5rem' }}>{selectedNode.label}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Location: {selectedNode.destination}</p>

              <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: '#94a3b8' }}>Trust Score:</span>
                  <strong style={{ color: '#10b981' }}>{selectedNode.trust_score}/100</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: '#94a3b8' }}>Network Centrality:</span>
                  <strong style={{ color: '#0ea5e9' }}>{selectedNode.centrality}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#94a3b8' }}>Listed Price:</span>
                  <strong style={{ color: '#f59e0b' }}>₹{selectedNode.price}</strong>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.85rem' }}
                onClick={() => onSelectService && onSelectService(selectedNode.service_id)}
              >
                Inspect Full Service Intelligence <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#94a3b8' }}>
              <Info size={32} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Click any Node in Graph</h4>
              <p style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                Select a service node to view its ecosystem connections, trust centrality index, and verified partner chain.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Repeated Ecosystem Pathways */}
      {frequent_pathways && frequent_pathways.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#f59e0b" />
            Top AI-Discovered Tourism Connection Chains
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {frequent_pathways.map((path, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{path.path}</span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Repeated {path.repeat_frequency} times across tourist trip telemetry
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-normal" style={{ fontSize: '0.75rem' }}>
                    Avg Chain Trust: {path.average_trust}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
