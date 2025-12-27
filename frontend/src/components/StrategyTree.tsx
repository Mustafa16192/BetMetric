import { useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  type NodeMouseHandler
} from 'reactflow'
import type { BetHealth, BetTreeNode } from '../types/api'
import BetNode from './BetNode'

const statusEdgeColor: Record<BetHealth, string> = {
  profit: '#22c55e',
  burn: '#ef4444',
  warning: '#f97316',
  zombie: '#64748b'
}

const toNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

type Props = {
  tree: BetTreeNode[]
  onSelectBet: (bet: BetTreeNode) => void
}

export default function StrategyTree({ tree, onSelectBet }: Props) {
  const [menu, setMenu] = useState<{ x: number; y: number; bet: BetTreeNode } | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { nodes, edges } = useMemo(() => {
    const builtNodes: Node[] = []
    const builtEdges: Edge[] = []
    const levelCounts: Record<number, number> = {}
    const horizontal = 240
    const vertical = 150

    const walk = (node: BetTreeNode, depth: number, parent?: BetTreeNode) => {
      const order = levelCounts[depth] ?? 0
      levelCounts[depth] = order + 1

      builtNodes.push({
        id: node.id,
        type: 'bet',
        position: { x: depth * horizontal, y: order * vertical },
        data: {
          title: node.name,
          budget: toNumber(node.budget),
          spend: toNumber(node.total_expenses),
          revenue: toNumber(node.total_revenue),
          status: node.health,
          flagged: node.flagged,
          inactiveDays: node.inactive_days ?? undefined
        }
      })

      if (parent) {
        builtEdges.push({
          id: `${parent.id}-${node.id}`,
          source: parent.id,
          target: node.id,
          type: 'smoothstep',
          style: {
            stroke: statusEdgeColor[node.health],
            strokeWidth: 2.5
          }
        })
      }

      node.children.forEach((child) => walk(child, depth + 1, node))
    }

    tree.forEach((root) => walk(root, 0))

    return { nodes: builtNodes, edges: builtEdges }
  }, [tree])

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const match = findNode(tree, node.id)
    if (match) {
      onSelectBet(match)
    }
  }

  const handleContextMenu: NodeMouseHandler = (event, node) => {
    event.preventDefault()
    const match = findNode(tree, node.id)
    if (!match || !containerRef.current) return

    const bounds = containerRef.current.getBoundingClientRect()
    setMenu({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      bet: match
    })
  }

  useEffect(() => {
    const closeMenu = () => setMenu(null)
    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  return (
    <div ref={containerRef} className="relative h-[420px] overflow-hidden rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ bet: BetNode }}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleContextMenu}
        zoomOnScroll={false}
        panOnScroll
      >
        <Background gap={32} color="#1E1E1E" />
        <MiniMap
          nodeColor={(node) => {
            const match = findNode(tree, node.id)
            return match ? statusEdgeColor[match.health] : '#27272a'
          }}
          maskColor="rgba(5, 5, 5, 0.7)"
        />
        <Controls showInteractive={false} />
      </ReactFlow>

      {menu && (
        <div
          className="surface-card absolute z-20 w-44 overflow-hidden text-xs"
          style={{ left: menu.x, top: menu.y }}
        >
          <button type="button" className="block w-full px-3 py-2 text-left hover:bg-surface-200">
            Add Child Bet
          </button>
          <button type="button" className="block w-full px-3 py-2 text-left hover:bg-surface-200">
            Edit Budget
          </button>
          <button type="button" className="block w-full px-3 py-2 text-left hover:bg-surface-200">
            View Ledger
          </button>
        </div>
      )}
    </div>
  )
}

const findNode = (nodes: BetTreeNode[], id: string): BetTreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findNode(node.children, id)
    if (child) return child
  }
  return null
}
