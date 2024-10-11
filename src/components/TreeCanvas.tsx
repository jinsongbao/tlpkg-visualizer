import React, { useRef, useEffect, useState } from 'react';
import { TreeNode, Point } from '../types';

interface TreeCanvasProps {
  tree: TreeNode;
}

interface ForceNode extends Point {
  vx: number;
  vy: number;
  node: TreeNode;
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({ tree }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [nodes, setNodes] = useState<ForceNode[]>([]);

  const nodeRadius = 15;
  const smallNodeRadius = 3;

  const flattenTree = (node: TreeNode, depth: number = 0): ForceNode[] => {
    const result: ForceNode[] = [{
      x: Math.random() * canvasSize.width,
      y: Math.random() * canvasSize.height,
      vx: 0,
      vy: 0,
      node: node
    }];
    if (node.children) {
      node.children.forEach(child => {
        result.push(...flattenTree(child, depth + 1));
      });
    }
    return result;
  };

  const applyForces = () => {
    const repulsion = 500;
    const attraction = 0.1;
    const centerForce = 0.000001;

    nodes.forEach(node => {
      nodes.forEach(otherNode => {
        if (node !== otherNode) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            const force = repulsion / (distance * distance);
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          }
        }
      });

      // Attraction to parent
      if (node.node.children) {
        node.node.children.forEach(child => {
          const childNode = nodes.find(n => n.node === child);
          if (childNode) {
            const dx = node.x - childNode.x;
            const dy = node.y - childNode.y;
            node.vx -= dx * attraction;
            node.vy -= dy * attraction;
            childNode.vx += dx * attraction;
            childNode.vy += dy * attraction;
          }
        });
      }

      // Center force
      node.vx += (canvasSize.width / 2 - node.x) * centerForce;
      node.vy += (canvasSize.height / 2 - node.y) * centerForce;

      // Apply velocity
      node.x += node.vx;
      node.y += node.vy;

      // Damping
      node.vx *= 0.9;
      node.vy *= 0.9;

      // Boundary check
      node.x = Math.max(nodeRadius, Math.min(canvasSize.width - nodeRadius, node.x));
      node.y = Math.max(nodeRadius, Math.min(canvasSize.height - nodeRadius, node.y));
    });
  };

  const drawTree = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw edges
    ctx.strokeStyle = '#a0aec0';
    ctx.lineWidth = 1;
    nodes.forEach(node => {
      if (node.node.children) {
        node.node.children.forEach(child => {
          const childNode = nodes.find(n => n.node === child);
          if (childNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(childNode.x, childNode.y);
            ctx.stroke();
          }
        });
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = node.node.type === 'folder' ? '#3182ce' : '#9f7aea';
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.node.name, node.x, node.y);

      // Draw small black nodes for file nodes
      if (node.node.type === 'file') {
        const smallNodesCount = Math.floor(Math.random() * 6) + 5; // 5 to 10 nodes
        const angleStep = (2 * Math.PI) / smallNodesCount;
        
        for (let i = 0; i < smallNodesCount; i++) {
          const angle = i * angleStep;
          const smallNodeX = node.x + Math.cos(angle) * (nodeRadius + 10);
          const smallNodeY = node.y + Math.sin(angle) * (nodeRadius + 10);
          
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(smallNodeX, smallNodeY, smallNodeRadius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });
  };

  const resizeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        setCanvasSize({
          width: parent.clientWidth,
          height: parent.clientHeight
        });
      }
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    setNodes(flattenTree(tree));
  }, [tree, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let animationFrameId: number;

        const render = () => {
          applyForces();
          drawTree(ctx);
          animationFrameId = requestAnimationFrame(render);
        };

        render();

        canvas.onmousemove = (event) => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          let hoveredNode: TreeNode | null = null;
          nodes.forEach(node => {
            const distance = Math.sqrt(
              Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
            );
            if (distance <= nodeRadius) {
              hoveredNode = node.node;
            }
          });

          setHoveredNode(hoveredNode);
        };

        return () => {
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, [nodes, canvasSize]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 rounded-lg"
      />
      {hoveredNode && (
        <div
          className="absolute bg-white border border-gray-300 rounded p-2 shadow-md"
          style={{
            left: canvasRef.current?.getBoundingClientRect().left,
            top: canvasRef.current?.getBoundingClientRect().top,
          }}
        >
          <p><strong>Name:</strong> {hoveredNode.name}</p>
          <p><strong>Type:</strong> {hoveredNode.type}</p>
        </div>
      )}
    </div>
  );
};

export default TreeCanvas;