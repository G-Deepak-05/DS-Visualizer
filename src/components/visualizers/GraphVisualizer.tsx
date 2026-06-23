import React, { useState, useEffect, useRef } from 'react';
import { PlaybackControls } from '../PlaybackControls';
import { ComplexityTable } from '../ComplexityTable';
import { CodeExecutor } from '../CodeExecutor';
import type { VisualizerStep } from '../../types';
import { getAnalogy } from '../../utils/analogies';

interface GraphVisualizerProps {
  languageMode: 'technical' | 'analogy';
  onAddXP: (amount: number, name: string, type: 'visualization' | 'challenge' | 'quiz') => void;
}

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ languageMode, onAddXP }) => {
  const [graphType, setGraphType] = useState<'undirected' | 'directed'>('undirected');
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', x: 100, y: 80 },
    { id: 'B', x: 280, y: 60 },
    { id: 'C', x: 150, y: 220 },
    { id: 'D', x: 300, y: 200 }
  ]);
  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'B', to: 'D', weight: 3 }
  ]);

  // Editor Inputs
  const [newNodeId, setNewNodeId] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('A');
  const [edgeTo, setEdgeTo] = useState('B');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [algoStartNode, setAlgoStartNode] = useState('A');

  // Dragging logic
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Simulation steps
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  useEffect(() => {
    // Initial display step
    setSteps([{
      stepNumber: 1,
      explanation: "Initial graph editor layout. Drag nodes to reposition them.",
      state: { nodes, edges, activeNode: null, traversedEdges: [], completedNodes: [] }
    }]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Node Drag Handlers
  const handleNodeMouseDown = (id: string) => {
    setDraggingNodeId(id);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x, y } : n));
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Add Node
  const handleAddNode = () => {
    const id = newNodeId.trim().toUpperCase();
    if (!id) return alert("Enter Node label.");
    if (nodes.some(n => n.id === id)) return alert("Node label already exists.");

    const newN = { id, x: 200, y: 150 };
    const updatedNodes = [...nodes, newN];
    setNodes(updatedNodes);
    setNewNodeId('');
    
    setSteps([{
      stepNumber: 1,
      explanation: `Added node ${id}.`,
      state: { nodes: updatedNodes, edges, activeNode: null, traversedEdges: [], completedNodes: [] }
    }]);
    setCurrentStepIndex(0);
    onAddXP(10, `Add Graph Node ${id}`, 'visualization');
  };



  // Add Edge
  const handleAddEdge = () => {
    if (edgeFrom === edgeTo) return alert("Edges must link distinct nodes.");
    const weight = Number(edgeWeight) || 1;
    
    // Check if edge already exists
    const exists = edges.some(e => 
      (e.from === edgeFrom && e.to === edgeTo) ||
      (graphType === 'undirected' && e.from === edgeTo && e.to === edgeFrom)
    );
    if (exists) return alert("Edge already exists between these nodes.");

    const newEdge = { from: edgeFrom, to: edgeTo, weight };
    const updatedEdges = [...edges, newEdge];
    setEdges(updatedEdges);
    
    setSteps([{
      stepNumber: 1,
      explanation: `Connected edge ${edgeFrom} to ${edgeTo} (Weight: ${weight}).`,
      state: { nodes, edges: updatedEdges, activeNode: null, traversedEdges: [], completedNodes: [] }
    }]);
    setCurrentStepIndex(0);
    onAddXP(10, `Add Graph Edge ${edgeFrom}-${edgeTo}`, 'visualization');
  };



  // Run Traversal BFS
  const runBFS = () => {
    const newSteps: VisualizerStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [algoStartNode];
    const traversedEdges: GraphEdge[] = [];
    const completedNodes: string[] = [];

    visited.add(algoStartNode);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      completedNodes.push(curr);

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Deconstructed BFS front: visit node ${curr}. Mark visited nodes: [${completedNodes.join(', ')}].`,
        state: { 
          nodes, edges, 
          activeNode: curr, 
          traversedEdges: [...traversedEdges], 
          completedNodes: [...completedNodes] 
        }
      });

      // Find neighbors
      const neighbors = edges.filter(e => e.from === curr || (graphType === 'undirected' && e.to === curr));
      
      neighbors.forEach(e => {
        const neighbor = e.from === curr ? e.to : e.from;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          traversedEdges.push(e);

          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Explore neighbor ${neighbor} from node ${curr}. Add connection to BFS tree.`,
            state: { 
              nodes, edges, 
              activeNode: curr, 
              compareNode: neighbor,
              traversedEdges: [...traversedEdges], 
              completedNodes: [...completedNodes] 
            }
          });
        }
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(25, `Graph BFS starting from ${algoStartNode}`, 'visualization');
  };

  // Run DFS Traversal
  const runDFS = () => {
    const newSteps: VisualizerStep[] = [];
    const visited = new Set<string>();
    const traversedEdges: GraphEdge[] = [];
    const completedNodes: string[] = [];

    const dfs = (curr: string, parentEdge: GraphEdge | null) => {
      visited.add(curr);
      completedNodes.push(curr);
      if (parentEdge) traversedEdges.push(parentEdge);

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `DFS visit node ${curr}. Current active call tree nodes: [${completedNodes.join(', ')}].`,
        state: {
          nodes, edges,
          activeNode: curr,
          traversedEdges: [...traversedEdges],
          completedNodes: [...completedNodes]
        }
      });

      const neighbors = edges.filter(e => e.from === curr || (graphType === 'undirected' && e.to === curr));
      neighbors.forEach(e => {
        const neighbor = e.from === curr ? e.to : e.from;
        if (!visited.has(neighbor)) {
          dfs(neighbor, e);
          
          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Backtrack from child tree nodes back to node ${curr}.`,
            state: {
              nodes, edges,
              activeNode: curr,
              traversedEdges: [...traversedEdges],
              completedNodes: [...completedNodes]
            }
          });
        }
      });
    };

    dfs(algoStartNode, null);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(25, `Graph DFS starting from ${algoStartNode}`, 'visualization');
  };

  // Dijkstra Shortest Path Visualizer
  const runDijkstra = () => {
    const newSteps: VisualizerStep[] = [];
    const dists: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    nodes.forEach(n => {
      dists[n.id] = Infinity;
      prev[n.id] = null;
      unvisited.add(n.id);
    });
    dists[algoStartNode] = 0;

    newSteps.push({
      stepNumber: 1,
      explanation: `Initialize Dijkstra distances. Set dist[${algoStartNode}] = 0, all others = ∞.`,
      state: { nodes, edges, activeNode: algoStartNode, completedNodes: [], dists: { ...dists } }
    });

    const completed: string[] = [];
    const traversedEdges: GraphEdge[] = [];

    while (unvisited.size > 0) {
      // Find node in unvisited with min dist
      let curr: string | null = null;
      let minDist = Infinity;
      unvisited.forEach(nodeId => {
        if (dists[nodeId] < minDist) {
          minDist = dists[nodeId];
          curr = nodeId;
        }
      });

      if (curr === null || minDist === Infinity) break;

      unvisited.delete(curr);
      completed.push(curr);

      newSteps.push({
        stepNumber: newSteps.length + 1,
        explanation: `Extract minimum node ${curr} (Distance: ${minDist}) from unvisited set.`,
        state: { 
          nodes, edges, 
          activeNode: curr, 
          completedNodes: [...completed], 
          traversedEdges: [...traversedEdges],
          dists: { ...dists } 
        }
      });

      // Update neighbors
      const neighbors = edges.filter(e => e.from === curr || (graphType === 'undirected' && e.to === curr));
      
      neighbors.forEach(e => {
        const neighbor = e.from === curr ? e.to : e.from;
        if (unvisited.has(neighbor)) {
          const newD = dists[curr!] + e.weight;
          
          newSteps.push({
            stepNumber: newSteps.length + 1,
            explanation: `Relaxing neighbor ${neighbor} from node ${curr}: check if dist[${curr}] (${dists[curr!]}) + edge weight (${e.weight}) < current dist[${neighbor}] (${dists[neighbor]}).`,
            state: { 
              nodes, edges, 
              activeNode: curr, 
              compareNode: neighbor,
              completedNodes: [...completed], 
              traversedEdges: [...traversedEdges],
              dists: { ...dists } 
            }
          });

          if (newD < dists[neighbor]) {
            dists[neighbor] = newD;
            prev[neighbor] = curr;
            traversedEdges.push(e);

            newSteps.push({
              stepNumber: newSteps.length + 1,
              explanation: `Distance updated! Set dist[${neighbor}] = ${newD}.`,
              state: { 
                nodes, edges, 
                activeNode: curr, 
                completedNodes: [...completed], 
                traversedEdges: [...traversedEdges],
                dists: { ...dists } 
              }
            });
          }
        }
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    onAddXP(30, `Dijkstra Algorithm from ${algoStartNode}`, 'visualization');
  };

  const currentStep = steps[currentStepIndex] || {
    state: { nodes, edges, activeNode: null, traversedEdges: [], completedNodes: [] },
    explanation: ""
  };

  const currentExplanation = languageMode === 'analogy' 
    ? getAnalogy('graph', currentStep.explanation) 
    : currentStep.explanation;

  const completedCount = currentStep.state.completedNodes ? currentStep.state.completedNodes.length : 0;
  const totalNodesCount = nodes.length;

  const handleExecuteCommands = (commands: { action: string; params: any[] }[]) => {
    if (commands.length > 0) {
      const cmd = commands[0];
      if (cmd.action === 'bfs') runBFS();
      else if (cmd.action === 'dfs') runDFS();
    }
  };

  return (
    <div className="visualizer-layout" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div>
        <div className="glass-panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Graph Pathfinder Simulator</h2>
              <div className="tab-group" style={{ width: '220px' }}>
                <button className={`tab-btn ${graphType === 'undirected' ? 'active' : ''}`} onClick={() => setGraphType('undirected')}>Undirected</button>
                <button className={`tab-btn ${graphType === 'directed' ? 'active' : ''}`} onClick={() => setGraphType('directed')}>Directed</button>
              </div>
            </div>

            {/* Interactive Drag SVG Canvas container with stats */}
            <div className="visualizer-canvas-container" style={{ display: 'flex', flexDirection: 'column', padding: 0, alignItems: 'stretch', minHeight: '300px' }}>
              
              {/* Canvas Header / Speedometer & Invariant Counters */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Active: <strong style={{ color: 'var(--accent-amber)' }}>{currentStep.state.activeNode || 'None'}</strong></span>
                  <span>Visited Nodes: <strong style={{ color: 'var(--accent-cyan)' }}>{completedCount} / {totalNodesCount}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Visited Ratio:</span>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${totalNodesCount > 0 ? (completedCount / totalNodesCount) * 100 : 0}%`,
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Main SVG Area */}
              <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '260px' }}>
                <svg 
                  ref={canvasRef}
                  style={{ width: '100%', height: '260px', cursor: draggingNodeId ? 'grabbing' : 'default', position: 'absolute', top: 0, left: 0 }}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                >
                  {/* Marker definition for Directed Edges Arrow heads */}
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="20"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
                    </marker>
                    <marker
                      id="arrow-active"
                      viewBox="0 0 10 10"
                      refX="20"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-indigo)" />
                    </marker>
                  </defs>

                  {/* Draw Edges */}
                  {currentStep.state.edges.map((edge: GraphEdge, idx: number) => {
                    const fromNode = currentStep.state.nodes.find((n: GraphNode) => n.id === edge.from);
                    const toNode = currentStep.state.nodes.find((n: GraphNode) => n.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    const isTraversed = currentStep.state.traversedEdges.some((e: any) => 
                      (e.from === edge.from && e.to === edge.to) ||
                      (graphType === 'undirected' && e.from === edge.to && e.to === edge.from)
                    );

                    // Compute midpoint for weights placement
                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;

                    return (
                      <g key={idx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          className={`graph-edge ${isTraversed ? 'active' : ''}`}
                          markerEnd={graphType === 'directed' ? `url(#${isTraversed ? 'arrow-active' : 'arrow'})` : undefined}
                        />
                        <rect 
                          x={midX - 10} 
                          y={midY - 8} 
                          width="20" 
                          height="16" 
                          rx="4"
                          fill="var(--bg-primary)" 
                          stroke="rgba(255,255,255,0.08)"
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          fill="var(--text-secondary)"
                          style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                        >
                          {edge.weight}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Draw Nodes */}
                {currentStep.state.nodes.map((node: GraphNode) => {
                  const isActive = currentStep.state.activeNode === node.id;
                  const isCompare = currentStep.state.compareNode === node.id;
                  const isCompleted = currentStep.state.completedNodes.includes(node.id);

                  let nodeClass = "ds-node";
                  if (isActive) nodeClass += " active";
                  if (isCompare) nodeClass += " compare";
                  if (isCompleted) nodeClass += " success";

                  return (
                    <div
                      key={node.id}
                      className={nodeClass}
                      onMouseDown={() => handleNodeMouseDown(node.id)}
                      style={{
                        position: 'absolute',
                        left: `${node.x - 22}px`,
                        top: `${node.y - 22}px`,
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        cursor: 'grab',
                        userSelect: 'none',
                        zIndex: 10
                      }}
                    >
                      {node.id}
                      {currentStep.state.dists && (
                        <span style={{
                          position: 'absolute',
                          bottom: '-18px',
                          background: 'rgba(0,0,0,0.7)',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          color: 'var(--accent-cyan)',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          d:{currentStep.state.dists[node.id] === Infinity ? '∞' : currentStep.state.dists[node.id]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <PlaybackControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={() => setCurrentStepIndex(p => Math.min(steps.length - 1, p + 1))}
            onPrev={() => setCurrentStepIndex(p => Math.max(0, p - 1))}
            onReset={() => setCurrentStepIndex(0)}
            speed={speed}
            setSpeed={setSpeed}
            explanation={currentExplanation}
          />
        </div>

        <CodeExecutor structureType="graph" onExecuteCommands={handleExecuteCommands} />
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600 }}>Operations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Add Node form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ADD NODE</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  placeholder="ID (e.g. E)" 
                  className="custom-input"
                  value={newNodeId}
                  onChange={e => setNewNodeId(e.target.value)}
                  style={{ flex: 1, fontSize: '12px' }}
                />
                <button className="control-btn" onClick={handleAddNode} style={{ fontSize: '12px' }}>Add</button>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '2px 0' }} />

            {/* Add Edge form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CONNECT EDGE</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                <select className="custom-select" value={edgeFrom} onChange={e => setEdgeFrom(e.target.value)} style={{ fontSize: '11px' }}>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
                <select className="custom-select" value={edgeTo} onChange={e => setEdgeTo(e.target.value)} style={{ fontSize: '11px' }}>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
                <input 
                  type="number" 
                  placeholder="Wt" 
                  className="custom-input"
                  value={edgeWeight}
                  onChange={e => setEdgeWeight(e.target.value)}
                  style={{ fontSize: '11px' }}
                />
              </div>
              <button className="control-btn" onClick={handleAddEdge} style={{ marginTop: '4px', fontSize: '12px', justifyContent: 'center' }}>Connect</button>
            </div>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.05)', margin: '2px 0' }} />

            {/* Run Algorithm form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>RUN ALGORITHM</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Start Node:</span>
                <select className="custom-select" value={algoStartNode} onChange={e => setAlgoStartNode(e.target.value)} style={{ fontSize: '11px', flex: 1 }}>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                <button className="control-btn" onClick={runBFS} style={{ fontSize: '11px', justifyContent: 'center' }}>BFS</button>
                <button className="control-btn" onClick={runDFS} style={{ fontSize: '11px', justifyContent: 'center' }}>DFS</button>
              </div>
              <button className="control-btn active" onClick={runDijkstra} style={{ fontSize: '11px', justifyContent: 'center', marginTop: '4px' }}>Dijkstra (Shortest Path)</button>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <ComplexityTable type="graph" />
        </div>
      </div>
    </div>
  );
};
