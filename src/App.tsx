import React from 'react';
import TreeCanvas from './components/TreeCanvas';
import Sidebar from './components/Sidebar';
import { TreeNode } from './types';

const sampleTree: TreeNode = {
  name: "rotor",
  type: "folder",
  children: [
    {
      name: "card",
      type: "folder",
      children: [
        {
          name: "xxxx.23.01.21",
          type: "folder",
          children: [
            { name: "75421-xxx-1.pdf", type: "file" },
            { name: "75421-xxx-2.pdf", type: "file" }
          ]
        },
        { name: "bpro-XXXX.23.01.21-08.prt", type: "file" },
        { name: "bpro-XXXX.23.01.21-09.prt", type: "file" }
      ]
    },
    {
      name: "data",
      type: "folder",
      children: [
        {
          name: "la11",
          type: "folder",
          children: [
            { name: "file", type: "file" },
            { name: "and", type: "file" },
            { name: "folder", type: "file" },
            { name: "nesting", type: "file" }
          ]
        },
        {
          name: "You can even",
          type: "folder",
          children: [
            {
              name: "use",
              type: "folder",
              children: [
                { name: "markdown", type: "file" },
                { name: "bullets!", type: "file" }
              ]
            }
          ]
        }
      ]
    },
    // ... Add the rest of the tree structure here
  ]
};

function App() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16">
        <TreeCanvas tree={sampleTree} />
      </main>
    </div>
  );
}

export default App;