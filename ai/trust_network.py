"""
Tourism Trust Network Engine:
Uses NetworkX to build and analyze service relationship graphs (Hotel -> Taxi -> Guide -> Activity).
Identifies repeated ecosystem pathways and calculates network centrality & trust flows.
"""
import networkx as nx

def build_tourism_trust_network(services: list, connections: list) -> dict:
    G = nx.DiGraph()

    # Add Nodes
    for s in services:
        G.add_node(
            s['id'],
            name=s['name'],
            category=s['category'],
            destination=s['destination'],
            trust_score=s.get('trust_score', 85),
            rating=s.get('rating', 4.5),
            price=s.get('price_per_unit', 1000),
            verified=bool(s.get('verified', 1))
        )

    # Add Edges
    for conn in connections:
        src = conn['source_service_id']
        tgt = conn['target_service_id']
        if G.has_node(src) and G.has_node(tgt):
            G.add_edge(
                src,
                tgt,
                id=conn.get('id'),
                type=conn.get('connection_type', 'RECOMMENDED'),
                repeat_count=conn.get('repeat_count', 1),
                weight=conn.get('trust_weight', 0.9)
            )

    # NetworkX Centrality & Graph Metrics
    degree_centrality = nx.degree_centrality(G) if len(G) > 0 else {}
    in_degree = nx.in_degree_centrality(G) if len(G) > 0 else {}
    out_degree = nx.out_degree_centrality(G) if len(G) > 0 else {}

    # Build response nodes & links array for frontend visualization
    nodes_data = []
    for node_id, data in G.nodes(data=True):
        nodes_data.append({
            "id": str(node_id),
            "service_id": node_id,
            "label": data.get('name', f"Service #{node_id}"),
            "category": data.get('category', 'Service'),
            "destination": data.get('destination', ''),
            "trust_score": data.get('trust_score', 80),
            "rating": data.get('rating', 4.5),
            "price": data.get('price', 0),
            "centrality": round(degree_centrality.get(node_id, 0), 3),
            "in_centrality": round(in_degree.get(node_id, 0), 3)
        })

    edges_data = []
    for src, tgt, data in G.edges(data=True):
        edges_data.append({
            "id": f"e_{src}_{tgt}",
            "source": str(src),
            "target": str(tgt),
            "type": data.get('type', 'RECOMMENDED'),
            "repeat_count": data.get('repeat_count', 1),
            "weight": data.get('weight', 0.9)
        })

    # Find Frequent Ecosystem Pathways (e.g. Hotel -> Taxi -> Guide -> Activity)
    frequent_pathways = []
    for src in G.nodes():
        if G.nodes[src].get('category') == 'Hotel':
            for tgt in G.successors(src):
                if G.nodes[tgt].get('category') == 'Taxi':
                    for sub_tgt in G.successors(tgt):
                        if G.nodes[sub_tgt].get('category') in ['Guide', 'Activity']:
                            frequent_pathways.append({
                                "path": f"{G.nodes[src]['name']} → {G.nodes[tgt]['name']} → {G.nodes[sub_tgt]['name']}",
                                "repeat_frequency": G[src][tgt].get('repeat_count', 1) + G[tgt][sub_tgt].get('repeat_count', 1),
                                "average_trust": round((G.nodes[src]['trust_score'] + G.nodes[tgt]['trust_score'] + G.nodes[sub_tgt]['trust_score']) / 3, 1)
                            })

    return {
        "total_nodes": len(nodes_data),
        "total_edges": len(edges_data),
        "nodes": nodes_data,
        "edges": edges_data,
        "frequent_pathways": sorted(frequent_pathways, key=lambda x: x['repeat_frequency'], reverse=True)[:5],
        "explanation": "These connections represent repeated ecosystem relationships found in tourist feedback data."
    }
