import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph.module.css";

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const color = () => { return "#9D79A0"; };

  const icon = (d) => {
    //return d.gender === "male" ? "\uf222" : "\uf221";
    return "\uf222";
  }

  const getClass = (d) => {
    //return d.gender === "male" ? styles.male : styles.female;
    return styles.male;
  };

  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => {/*console.log(d);*/return d.id}))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("x", (d)=>{/*console.log(d3.forceX());*/return d3.forceX()})
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    /*.call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    }));*/

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 3)
    .attr("fill", color)
    .call(drag(simulation));
/*
  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr("class", d => `fa ${getClass(d)}`)
    .text(d => {return icon(d);})
    .call(drag(simulation));
*/
  node.on("mouseover", (d, i) => {
    //addTooltip(nodeHoverTooltip, i, d3.event.pageX, d3.event.pageY);
    addTooltip(nodeHoverTooltip, i, d.clientX, d.clientY);
    //console.log(d3.event)
    console.log(d);
    console.log(i);
  })
    .on("mouseout", (d, i) => {
      removeTooltip();
    });
    
  simulation.on("tick", () => {
    //update link positions
    
    link
      .attr("x1", d => {return d.source.x_pos})
      .attr("y1", d => calculateYPost(d.source))
      .attr("x2", d => d.target.x_pos)
      .attr("y2", d => calculateYPost(d.target));

    // update node positions
    node
      .attr("cx", d => {
        //from old source code, container width is 1050, so the x_pos is relative to that..
        return d.x_pos;
     })
      .attr("cy", d => {
        return calculateYPost(d);
      });

    // update label positions
    /*
    label
      .attr("x", d => { return d.x_pos; })
      .attr("y", d => { return d.y; })*/
  });

    svg.append("circle").attr("cx", width/2).attr("cy", height/2).attr("r", 20).attr("fill", "red");
    const calculateYPost = (d) => {
        const k = height/8; //there are 7 layers/generations
        let newY;
        if(d.layer){                  
            newY = ((d.layer) * k) - k;
            if(d.layer === 1)newY+=7.5;			   
            if(d.layer === 3){
            if(d["sub-layer"] === "a"){newY-=35;}
            if(d["sub-layer"] === "b"){newY+=5;}
            if(d["sub-layer"] === "c"){newY-=21.25;}
            if(d["sub-layer"] === "d"){newY+=32.5;}
            }
        
            if(d.layer === 4){
            if(d["sub-layer"] === "c"){newY+=37.5;}
            //else{d.y=30;}
            }
        
            if(d.layer === 5){
            if(d["sub-layer"] === "b"){newY+=32.5;}
            }
        
            if(d.layer === 7){
            if(d["sub-layer"] === "a"){newY-=25;}
            }
        
            if(d.type==="marriage")newY+=10;
            if(d.type==="house")newY+=20;
            if(d.type==="house" && d.name==="House of Bourbon")newY-=1.25;
            if(d.type==="house" && d.id==="Bernadotte")newY-=6;
        }

        return newY;
    }

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    }
  };
}