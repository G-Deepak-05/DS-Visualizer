# DS Visualizer.

An interactive web-based educational platform that helps developers, students, and job seekers visualize, trace, and understand data structures and algorithms in real time.

---

## 🎨 Visual Design & Aesthetic

DS Visualizer is built using a **premium minimalist editorial design system** inspired by high-end architectural layouts:
* **Background**: Soft sage-green textured plaster/grain overlay (`#9eb3a6`).
* **Typography**: Rich geometric charcoal (`#2c3330`) for primary elements and copy.
* **Accents**: Deep magenta/pink (`#d91b5c`) highlights indicating active modes and primary navigation dots.
* **Layout**: A clean sticky top header bar with horizontal page navigation and a toggleable slide-out right drawer panel for topic selection, maximizing visualization workspace.
* **Cards & Nodes**: Flat elements with crisp borders and offset shadows rather than heavy tech-glowing neon panels.

---

## ⚡ Key Visualizers & Sandboxes

The platform provides complete playgrounds to inspect operations step-by-step:
* **Arrays & Vectors**: Contiguous memory cells showing active index maps, linear searches, insertions, and index-shifting animations.
* **Linked Lists**: Visual SVG nodes tracing node references and pointer linkages (Singly, Doubly, and Circular lists).
* **Stacks**: LIFO limits beaker container featuring animated gravity pushes and popped rises.
* **Queues**: FIFO pipelines with Simple, Deque (double-ended), Priority queues, and Circular queue rotating rings.
* **Trees**: Hierarchical nodes simulating BST structures, traversals, and AVL self-balancing rotations.
* **Heaps**: Complete tree mappings synchronized in real time with array indices, heapify steps, and bubble-up/down swaps.
* **Hash Tables**: Collision resolution using Chaining buckets, Linear probing, and Quadratic probing equations.
* **Graphs**: Draggable node canvas for pathfinding traversals (BFS, DFS, Dijkstra, Prim, Kruskal) on custom graph topologies.
* **Sorting & Searching**: Vertical column heights animating Selection, Insertion, Bubble, Merge, and Quick Sort algorithms, alongside Binary Search.

---

## 🎒 Beginner-Friendly & Accessibility Features

To make DSA concepts accessible to absolute beginners, non-technical users, and auditory learners, five core modules are integrated:

1. **Analogy Mode**: Toggles complex terminology (e.g. pointers, balance factors, collision probing) into real-world analogies (e.g. treasure hunts, plates stack, highway maps, post office boxes).
2. **Web Speech Synthesis Narrator**: Speaks granular step explanations out loud using native browser text-to-speech.
3. **No-Code Blocks Editor**: Appends syntactically correct code blocks with parameter inputs via clicks, preventing syntax errors in the editor.
4. **Visual Speedometers & Invariant Gauges**: Displays active hops, comparison counts, and capacity load factor meters on visualizer canvas panels.
5. **Quest Progression Map**: Locks advanced topics under a gamified path until users earn XP and level up from simpler structures (toggled via Quest Mode).

---

## 🛠️ Project Stack

* **Framework**: React 18 / Vite 8
* **Language**: TypeScript
* **Styling**: Vanilla CSS custom variables (`src/index.css`)
* **Icons**: Lucide React

---

## 🚀 Running Locally

1. Clone the repository and navigate to the project directory:
   ```bash
   cd DS-Visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

4. Build production chunks:
   ```bash
   npm run build
   ```
