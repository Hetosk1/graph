const USER_ID = "yourname_ddmmyyyy"; // TODO: Replace with your actual name_ddmmyyyy
const EMAIL_ID = "your.email@university.edu"; // TODO: Replace with your actual email
const ENROLLMENT_NUMBER = "21XXXXX"; // TODO: Replace with your actual enrollment number

function processGraph(edges) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const validEdgeSet = new Set();
  const validEdges = [];

  // Step 1: Parse and validate edges
  for (let raw of edges) {
    const entry = typeof raw === "string" ? raw.trim() : String(raw).trim();

    // Validate format: single uppercase letter -> single uppercase letter
    const match = entry.match(/^([A-Z])->([A-Z])$/);
    if (!match) {
      invalidEntries.push(raw); // push original (trimmed internally)
      continue;
    }

    const [, parent, child] = match;

    // Self-loop check
    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    const edgeKey = `${parent}->${child}`;
    if (validEdgeSet.has(edgeKey)) {
      // Only push to duplicates once (first duplicate occurrence)
      if (!duplicateEdges.includes(edgeKey)) {
        duplicateEdges.push(edgeKey);
      }
    } else {
      validEdgeSet.add(edgeKey);
      validEdges.push({ parent, child });
    }
  }

  // Step 2: Build adjacency & parent count structures
  const children = {}; // parent -> [children]
  const parentOf = {};  // child -> first parent (first-encountered wins)

  for (const { parent, child } of validEdges) {
    if (!children[parent]) children[parent] = [];
    if (!children[child]) children[child] = []; // ensure node exists

    // Diamond case: first-encountered parent wins
    if (parentOf[child] !== undefined) {
      // silently discard subsequent parent edges
      continue;
    }

    parentOf[child] = parent;
    children[parent].push(child);
  }

  // Collect all nodes
  const allNodes = new Set([
    ...Object.keys(children),
    ...Object.keys(parentOf),
  ]);

  if (allNodes.size === 0) {
    return {
      user_id: USER_ID,
      email_id: EMAIL_ID,
      enrollment_number: ENROLLMENT_NUMBER,
      hierarchies: [],
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: 0,
        total_cycles: 0,
        largest_tree_root: "",
      },
    };
  }

  // Step 3: Find connected components using Union-Find
  const parent = {};
  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a, b) {
    parent[find(a)] = find(b);
  }

  for (const { parent: p, child: c } of validEdges) {
    union(p, c);
  }

  const components = {};
  for (const node of allNodes) {
    const root = find(node);
    if (!components[root]) components[root] = new Set();
    components[root].add(node);
  }

  // Step 4: Process each component
  const hierarchies = [];

  for (const componentNodes of Object.values(components)) {
    const nodeList = [...componentNodes].sort();

    // Find roots: nodes that never appear as a child
    const roots = nodeList.filter((n) => parentOf[n] === undefined);

    // Cycle detection using DFS
    function hasCycle(startNodes) {
      const visited = new Set();
      const stack = new Set();

      function dfs(node) {
        if (stack.has(node)) return true;
        if (visited.has(node)) return false;
        visited.add(node);
        stack.add(node);
        for (const child of (children[node] || [])) {
          if (dfs(child)) return true;
        }
        stack.delete(node);
        return false;
      }

      for (const n of startNodes) {
        if (!visited.has(n)) {
          if (dfs(n)) return true;
        }
      }
      return false;
    }

    const cycleDetected = hasCycle(roots.length > 0 ? roots : nodeList);

    // Determine the root to use
    let rootNode;
    if (roots.length > 0) {
      // Use lexicographically smallest root if multiple
      rootNode = roots.sort()[0];
    } else {
      // Pure cycle: use lexicographically smallest node
      rootNode = nodeList[0];
    }

    if (cycleDetected) {
      hierarchies.push({
        root: rootNode,
        tree: {},
        has_cycle: true,
      });
    } else {
      // Build nested tree
      function buildTree(node) {
        const result = {};
        const nodeChildren = children[node] || [];
        for (const child of nodeChildren) {
          result[child] = buildTree(child);
        }
        return result;
      }

      // Calculate depth
      function calcDepth(node) {
        const nodeChildren = children[node] || [];
        if (nodeChildren.length === 0) return 1;
        return 1 + Math.max(...nodeChildren.map(calcDepth));
      }

      const tree = {};
      tree[rootNode] = buildTree(rootNode);
      const depth = calcDepth(rootNode);

      hierarchies.push({
        root: rootNode,
        tree,
        depth,
      });
    }
  }

  // Sort hierarchies for consistent output (optional but clean)
  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  // Step 5: Build summary
  const nonCyclic = hierarchies.filter((h) => !h.has_cycle);
  const cyclic = hierarchies.filter((h) => h.has_cycle);

  let largestRoot = "";
  if (nonCyclic.length > 0) {
    nonCyclic.sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root.localeCompare(b.root);
    });
    largestRoot = nonCyclic[0].root;
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    enrollment_number: ENROLLMENT_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: nonCyclic.length,
      total_cycles: cyclic.length,
      largest_tree_root: largestRoot,
    },
  };
}

module.exports = { processGraph };
