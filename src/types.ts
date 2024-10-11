export interface TreeNode {
  name: string;
  children?: TreeNode[];
  type: 'file' | 'folder';
}

export interface Point {
  x: number;
  y: number;
}