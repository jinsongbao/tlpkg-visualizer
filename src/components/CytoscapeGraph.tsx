import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import { TreeNode } from '../types';

interface CytoscapeGraphProps {
  tree: TreeNode;
}

const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({ tree }) => {
  const cyRef = useRef<cytoscape.Core | null>(null);

  const treeToElements = (node: TreeNode, parentId: string | null = null): cytoscape.ElementDefinition[] => {
    const id = Math.random().toString(36).substr(2, 9);
    const elements: cytoscape.ElementDefinition[] = [
      {
        data: { id, label: node.name, parent: parentId },
      },
    ];

    if (parentId) {
      elements.push({
        data: { source: parentId, target: id },
      });
    }

    if (node.children) {
      node.children.forEach((child) => {
        elements.push(...treeToElements(child, id));
      });
    }

    return elements;
  };

  const elements = treeToElements(tree);

  const layout = {
    name: 'breadthfirst',
    directed: true,
    padding: 10,
    spacingFactor: 1.25,
    animate: true,
  };

  const stylesheet: cytoscape.Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#4a5568',
        'label': 'data(label)',
        'color': '#ffffff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#a0aec0',
        'target-arrow-color': '#a0aec0',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
  ];

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout(layout).run();
    }
  }, [tree]);

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet}
      layout={layout}
      style={{ width: '100%', height: '600px' }}
      cy={(cy) => { cyRef.current = cy; }}
    />
  );
};

export default CytoscapeGraph;