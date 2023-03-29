import React, {useState, useEffect, useRef} from 'react';
import * as d3 from "d3";
import { useD3 } from "../../../utils/hooks/useD3";
import { useWindowDimensions } from "../../../utils/hooks/useWindowDimensions";
import { useContainerDimensions } from '../../../utils/hooks/useContainerDimensions';
import { windsorData } from '../../../utils/const';

export const ForceLayout = (props) => {

    const {width} = useWindowDimensions();
    const famTreeRef = useRef(null);
    
    
    const { width:famTreeWidth, height:famTreeHeight } = useContainerDimensions(famTreeRef);

    const graphWidth = 1050, graphHeight = 600;
    
    const [ nameFocus, setNameFocus ] = useState("------");

    useEffect(()=>{
        listenToResize();
            window.addEventListener("resize", listenToResize);
    
        return ()=>window.removeEventListener("resize", listenToResize);
    }, []);

    const listenToResize = () => {
        setNameFocus("------");
    }

    const { nodes, links } = windsorData;
    
    const linksData = links.map((d) => Object.assign({}, d));
    const nodesData = nodes.map((d) => Object.assign({}, d));
    
    const names = ["------"].concat(nodesData.filter(function(d){return d.name && d.type!="marriage";})
        .map(function(d){    
            if(d.type==="person"){
            var liveString;
            if(d.died && d.died!="alive")liveString = "(" + d.birth + "-" + d.died + ")";
            else if(!d.died || d.died==="alive")liveString = "(Born : " + d.birth + ")";
            
            return d.name + " " + liveString + ((d.title && d.title!="-")?(" " + d.title):"");	  
            }
            return d.name;
        })
            .sort());

    const ref = useD3(

        (svg) => {
            const focus = svg.select(".plot-area");
            const screenMode = width > 690?"largeScreen":"midLowScreen";            

            let bottomText = true, bottomHouseText = true;
            /*
                Process variable to flag position of node labels.
                Labels will be placed up and down - alternatively. 
            */
           
            nodesData.forEach((dNode)=>{
                let topLabelY = 0, bottomLabelY = 0;
                if(dNode.type === "person"){
                    
                    if(dNode.name === "Queen Victoria" || dNode.name === "Prince Albert"){
                        //if(d.name === "Queen Victoria")xPos = -60
                        //if(d.name === "Albert")xPos = -20;
                        dNode.labelPos = "bottom";
                        topLabelY = 10;
                        bottomLabelY = 12.5;
                    }
                    else{		   		   		   		   		   
                        dNode.labelPos = bottomText?"bottom":"top";
                        bottomText = !bottomText;		
                        if(bottomText){
                            topLabelY = -7.5;
                            bottomLabelY = -7.5;			 
                        }
                        else if(!bottomText){
                            topLabelY = 8.75;
                            bottomLabelY = 8.75
                            //if(d.name.indexOf(" of") > 0)yPos+=15;
                            //tidy it up, so when cursor higlight is in complex state, it doesn't really overlaping onto each other...
                            //if(d.id === "FredIII1831")yPos = 6.5;
                        }
                        if(dNode.name.indexOf(" ") > 1)topLabelY-=2.5;
                        else if((dNode.name.indexOf(" ")<=-1) && (dNode.title && dNode.title!="-"))topLabelY-=2.5   
                    }		 
                }
                else if(dNode.type === "house"){  
                    topLabelY = 5;                  
                    if(dNode.layer === 3){//many houses at layer 3...
                        dNode.labelPos = bottomHouseText?"bottom":"top";
                        if(bottomHouseText){
                            topLabelY = -5;
                        }
                        if(dNode.name === "Lascelles Family")topLabelY = 2.5;//a little bit tidy...
                        bottomHouseText =  !bottomHouseText;
                    }else{
                        dNode.labelPos = "bottom";
                    }
                    bottomLabelY = -1;     
                    
                }else{
                    dNode.labelPos = "none";//marriage node;
                    topLabelY = -1;
                    bottomLabelY = -1;
                }
                dNode.labelY = {topLabelY, bottomLabelY};                
                dNode.labelX = {topLabelX:0, bottomLabelX:0};
            });

            const tooltip = d3.select("#tooltip")
                .style("pointer-events", "none")
                .style("position", "fixed")
                .style("left", "0px").style("top", "0px")
                .style("padding", "8px 5px")
                .style("max-width", "200px")
                .style("opacity", 0);

            const nodeColor = d3.scaleOrdinal()	
                .domain(["monarch", "close", "other"])
                .range(["red", "#ff9933", "grey"]);//	

            const simulation = d3
                .forceSimulation(nodesData)
                .force("link", d3.forceLink(linksData).id(d => {/*console.log(d);*/return d.id}))
                .force("charge", d3.forceManyBody().strength(-150))
                .force("x", (d)=>{/*console.log(d3.forceX());*/return d3.forceX()})
                .force("y", d3.forceY());           
            
            const link = focus.selectAll(".link")
                    .data(linksData, function(d){return d.source.id + d.target.id;})
                .join(
                    enter =>enter.append("path")                
                        .attr("class", "link")
                        .style("stroke-width", 1)
                        .style("stroke", "#1e3a8a")
                        .style("fill", "none"),
                    update => update.transition().duration(250)
                        .style("stroke-width", 1)
                        .style("stroke", "#1e3a8a")
                        .style("fill", "none"),
                    exit => exit.transition().duration(250)
                        .style("stroke-width", 0)
                        .remove()
                );
            
            const masks = focus.selectAll("clipPath")
                    .data(nodesData.filter(function(d){return d.name;}).filter(function(d){return d.type === "person";}),
                        function(d){return d.id;}
                    )
                    .join(
                        enter=>enter.append("clipPath")
                            .attr("id", d=>d.id)
                            .append("rect")
                            .attr("width", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                                    return 200;
                            })
                            .attr("height", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                                return 250;
                            })
                            .attr("rx", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 50;
                                    return 100;
                            })
                            .attr("ry", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 62.5;
                                    return 125;
                            }),
                        update=>update.selectAll("rect")
                            .transition().duration(250)
                            .attr("width", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                                    return 200;
                            })
                            .attr("height", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                                return 250;
                            })
                            .attr("rx", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 50;
                                    return 100;
                            })
                            .attr("ry", function(d){
                                if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 62.5;
                                    return 125;
                            }),
                        exit=>exit.transition().duration(250)
                            .remove()
                    )
            
            const node = focus.selectAll(".nodes")
                    .data(nodesData.filter(function(d){return d.name;}), function(d){return d.id;})
                .join(
                    enter=>{
                        let g = enter.append("g")
                        .attr("class", "nodes")
                        .style("cursor", "pointer")
                        .on("mouseenter", nodeMouseover)
                        .on("mousemove", function(e){nodeMousemove(e);})
                        .on("mouseleave", nodeMouseout);

                        g.append("rect")
                            .transition().duration(250)
                        .attr("width", function(d){return (d.type==="person"?10:(d.type==="house"?0:1.75));})
                        .attr("height", function(d){return (d.type==="person"?12.5:(d.type==="house"?0:1.75));})
                        .attr("x", function(d){return (d.type==="person"?-5:(d.type==="house"?-3.75:-0.875));})
                        .attr("y", function(d){return (d.type==="person"?-6.25:(d.type==="house"?-5:-0.875));})
                        .attr("fill", function(d){return (d.type==="person"?((d.died==="alive" || !d.died)?"#22c55e":"#d1d5db"):(d.type==="house"?"#94a3b8":"#1e3a8a"));})
                        .attr("rx", function(d){return (d.type==="person"?5:(d.type==="house"?1.25:0.875));})
                        .attr("ry", function(d){return (d.type==="person"?6.25:(d.type==="house"?1.25:0.875));})
                        .style("stroke", function(d){return (d.type==="marriage"?"#1e3a8a":(d.status==="monarch"?"#facc15":(d.status==="close"?"#1e3a8a":"#737373")));})
                        .style("stroke-width", function(d){return (d.type==="person"?0.6:0);});

                        g.append("image")	
                            .attr("xlink:href", function(d){
                                if(d.image){
                                    if(d.type === "person"){
                                    return "/images/british-monarch/" + d.image + ".jpg";
                                    }else if(d.type === "house"){
                                    return "/images/british-monarch/houses/" + d.image + ".png";
                                    }
                                }
                                else if(!d.image){return '#';}
                                //return "#";
                            })    
                                .transition().duration(250)                        
                            .attr("width", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                                    return 200;
                                }else if(d.type === "house")return d.w/8;
                                else return 0;
                            })
                            .attr("height", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                                    return 250;
                                }else if(d.type === "house")return d.h/8;
                                else return 0;
                            })
                            .attr("transform", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                                    return "translate(-3.75, -5) scale(0.075)";
                                    else  
                                    return "translate(-3.75, -5) scale(0.0375)";
                                }else return "translate(-3.75, -5) scale(0.25)";
                            })
                            .attr("clip-path", function(d){return "url(#" + d.id + ")"});

                        g.append("text")
                            .attr("class", "firstLabel")
                            .text(function(d){	   
                                var nameToDisplay;
                                if(d.type === "person"){
                                    var nameLength = d.name.length;
                                    var spaceIdx = d.name.indexOf(" ");
                                    if(spaceIdx === -1)nameToDisplay = d.name;
                                    else nameToDisplay = d.name.substring(0, spaceIdx);		 
                                
                                }else if(d.type === "house"){
                                    nameToDisplay = d.caption;		 
                                    
                                }else if(d.type === "marriage"){
                                    if(!d.divorce)return d.date;
                                    else return d.date + " - " + d.divorce;
                                }
                                else nameToDisplay = "";
                            
                                return nameToDisplay;
                            })	
                            .attr("font-size", function(d){	                          
                                return d.type==="person" || d.type==="house"?"3px":"0px";
                            })
                            .attr("transform", function(d){	 
                                let xPos,yPos;
                                if(d.type === "person"){
                                    xPos = -(this.getBBox().width/2);
                                    if(d.name === "Queen Victoria" || d.name === "Prince Albert"){
                                        //if(d.name === "Queen Victoria")xPos = -60
                                        //if(d.name === "Albert")xPos = -20;
                                        yPos = 10;
                                    }
                                    else{		   		   		   		   		   
                                        if(d.labelPos === "top"){
                                            yPos = -7.5;			 
                                        }
                                        else if(d.labelPos === "bottom"){
                                            yPos = 8.75;
                                            //if(d.name.indexOf(" of") > 0)yPos+=15;
                                            //tidy it up, so when cursor higlight is in complex state, it doesn't really overlaping onto each other...
                                            //if(d.id === "FredIII1831")yPos = 6.5;
                                        }
                                        if(d.name.indexOf(" ") > 1)yPos-=2.5;
                                        else if((d.name.indexOf(" ")<=-1) && (d.title && d.title!="-"))yPos-=2.5
                                        //upperPosition = !upperPosition;		   
                                    }		 
                                }
                                else if(d.type === "house"){
                                    xPos  = -(this.getBBox().width/2);
                                    yPos = 5;
                                    if(d.layer === 3){//many houses at layer 3...
                                        if(d.labelPos === "top")yPos = -5;
                                        //upperHousePosition=!upperHousePosition;
                                    }
                                    if(d.name === "Lascelles Family")yPos = 2.5;//a little bit tidy...
                                }
                                else{
                                    xPos = (!d.divorce?-12.5:-27);
                                    yPos = 6;
                                }
                                d.labelX.topLabelX = xPos;
                                return "translate(" + xPos + "," + d.labelY.topLabelY + ")";
                            })
                            .style("fill", function(d){
                            if(d.type === "marriage")return "red";
                            else return "black";
                            })
                            .style("text-shadow", "0 1px 0 #f8fafc, 1px 0 0 #f8fafc, -1px 0 0 #f8fafc, 0 -1px 0 #f8fafc");

                        g.append("text")
                            .attr("class", "secondLabel")
                            .text(function(d){
                                var titleToDisplay = ""
                                if(d.type === "person"){	     
                                    if(d.name.indexOf(" ") > 1)
                                        titleToDisplay = d.name.substring(d.name.indexOf(" "), d.name.length);
                                    else if((d.name.indexOf(" ")<=-1) && (d.title && d.title!="-"))titleToDisplay = d.title;
                                }
                                return titleToDisplay;	   
                            })
                            .attr("font-size", "3px")
                            .attr("transform", function(d){
                                let xPos = 0, yPos = 0;
                                if(d.type === "person"){	     		 		 
                                    xPos = -(this.getBBox().width/2);
                                    if(d.name === "Queen Victoria" || d.name === "Prince Albert"){
                                        //if(d.name === "Queen Victoria")xPos = -60
                                        //if(d.name === "Albert")xPos = -20;
                                        yPos = 12.5;
                                    }
                                    else{		   		   		 
                                        if(d.labelPos==="top"){
                                            yPos = -7.5;			 
                                        }
                                        else if(d.labelPos === "bottom"){
                                            yPos = 8.75;
                                            //if(d.name.indexOf(" of") > 0)yPos+=15;
                                        }
                                        //if(d.name.indexOf(" of") > 0)yPos-=10;
                                        //upperPosition1 = !upperPosition1;
                                    }		 
                                }
                                d.labelX.bottomLabelX = xPos;
                                return "translate(" + xPos + "," + d.labelY.bottomLabelY + ")";
                            })
                            .style("text-shadow", "0 1px 0 #f8fafc, 1px 0 0 #f8fafc, -1px 0 0 #f8fafc, 0 -1px 0 #f8fafc");

                        return g;
                    }
                    ,
                    update=>{
                        update.selectAll("rect")
                                .transition().duration(250)
                            .attr("width", function(d){return (d.type==="person"?10:(d.type==="house"?0:1.75));})
                            .attr("height", function(d){return (d.type==="person"?12.5:(d.type==="house"?0:1.75));})
                            .attr("x", function(d){return (d.type==="person"?-5:(d.type==="house"?-3.75:-0.875));})
                            .attr("y", function(d){return (d.type==="person"?-6.25:(d.type==="house"?-5:-0.875));})
                            .attr("fill", function(d){return (d.type==="person"?((d.died==="alive" || !d.died)?"#22c55e":"#d1d5db"):(d.type==="house"?"#94a3b8":"#1e3a8a"));})
                            .attr("rx", function(d){return (d.type==="person"?5:(d.type==="house"?1.25:0.875));})
                            .attr("ry", function(d){return (d.type==="person"?6.25:(d.type==="house"?1.25:0.875));})
                            .style("stroke", function(d){return (d.type==="marriage"?"#1e3a8a":(d.status==="monarch"?"#facc15":(d.status==="close"?"#1e3a8a":"#737373")));})
                            .style("stroke-width", function(d){return (d.type==="person"?0.6:0);});

                        update.selectAll("image")
                                .transition().duration(250)                        
                            .attr("width", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                                    return 200;
                                }else if(d.type === "house")return d.w/8;
                                else return 0;
                            })
                            .attr("height", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                                    return 250;
                                }else if(d.type === "house")return d.h/8;
                                else return 0;
                            })
                            .attr("transform", function(d){
                                if(d.type === "person"){
                                    if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                                    return "translate(-3.75, -5) scale(0.075)";
                                    else  
                                    return "translate(-3.75, -5) scale(0.0375)";
                                }else return "translate(-3.75, -5) scale(0.25)";
                            });

                        update.selectAll("text.firstLabel")
                                .transition().duration(250)
                            .attr("font-size", function(d){	                          
                                return d.type==="person" || d.type==="house"?"3px":"0px";
                            })
                            .attr("transform", function(d){	 
                                let xPos,yPos;
                                if(d.type === "person"){
                                    xPos = -(this.getBBox().width/2);
                                    if(d.name === "Queen Victoria" || d.name === "Prince Albert"){
                                        //if(d.name === "Queen Victoria")xPos = -60
                                        //if(d.name === "Albert")xPos = -20;
                                        yPos = 10;
                                    }
                                    else{		   		   		   		   		   
                                        if(d.labelPos === "top"){
                                            yPos = -7.5;			 
                                        }
                                        else if(d.labelPos === "bottom"){
                                            yPos = 8.75;
                                            //if(d.name.indexOf(" of") > 0)yPos+=15;
                                            //tidy it up, so when cursor higlight is in complex state, it doesn't really overlaping onto each other...
                                            //if(d.id === "FredIII1831")yPos = 6.5;
                                        }
                                        if(d.name.indexOf(" ") > 1)yPos-=2.5;
                                        else if((d.name.indexOf(" ")<=-1) && (d.title && d.title!="-"))yPos-=2.5
                                        //upperPosition = !upperPosition;		   
                                    }		 
                                }
                                else if(d.type === "house"){
                                    xPos  = -(this.getBBox().width/2);
                                    yPos = 5;
                                    if(d.layer === 3){//many houses at layer 3...
                                        if(d.labelPos === "top")yPos = -5;
                                        //upperHousePosition=!upperHousePosition;
                                    }
                                    if(d.name === "Lascelles Family")yPos = 2.5;//a little bit tidy...
                                }
                                else{
                                    xPos = (!d.divorce?-12.5:-27);
                                    yPos = 6;
                                }
                                d.labelX.topLabelX = xPos;
                                return "translate(" + xPos + "," + d.labelY.topLabelY + ")";
                            })
                            .style("fill", function(d){
                            if(d.type === "marriage")return "red";
                            else return "black";
                            })
                            .style("text-shadow", "0 1px 0 #f8fafc, 1px 0 0 #f8fafc, -1px 0 0 #f8fafc, 0 -1px 0 #f8fafc");

                        update.select("text.secondLabel")
                                .transition().duration(250)
                            .attr("font-size", "3px")
                            .attr("transform", function(d){
                                let xPos = 0, yPos = 0;
                                if(d.type === "person"){	     		 		 
                                    xPos = -(this.getBBox().width/2);
                                    if(d.name === "Queen Victoria" || d.name === "Prince Albert"){
                                        //if(d.name === "Queen Victoria")xPos = -60
                                        //if(d.name === "Albert")xPos = -20;
                                        yPos = 12.5;
                                    }
                                    else{		   		   		 
                                        if(d.labelPos==="top"){
                                            yPos = -7.5;			 
                                        }
                                        else if(d.labelPos === "bottom"){
                                            yPos = 8.75;
                                            //if(d.name.indexOf(" of") > 0)yPos+=15;
                                        }
                                        //if(d.name.indexOf(" of") > 0)yPos-=10;
                                        //upperPosition1 = !upperPosition1;
                                    }		 
                                }
                                d.labelX.bottomLabelX = xPos;
                                return "translate(" + xPos + "," + d.labelY.bottomLabelY + ")";
                            })
                            .style("text-shadow", "0 1px 0 #f8fafc, 1px 0 0 #f8fafc, -1px 0 0 #f8fafc, 0 -1px 0 #f8fafc");

                        return update;
                    },
                    exit=>exit.remove()
                );
            
            node
                .filter(function(d){return (d.type === "marriage");})
                    .style("pointer-events", "none")
                .filter(function(d){return d.divorce === true;})
                    .style("stroke-dasharray", "1 1");
            
            nodes
                .filter(function(d){return (d.type === "marriage" && d.divorce);}).forEach(function(dNode){                   
                    link
                        .filter(function(dLink){return dLink.target.name === dNode.name;})
                        .style("stroke-dasharray", "2 2");
                });            

            const responsiveXPos = famTreeWidth/graphWidth;
            const responsiveYPos = famTreeHeight/graphHeight;

            simulation.on("tick", () => {

                positionLinks();
                
                node
                    .attr("transform", function(d){
                        return `translate(${d.x_pos * responsiveXPos}, ${calculateYPos(d)})`;
                    });                
            });

            function positionLinks(){
                link
                    .filter(function(d){return d.id === "bride-left"})
                    .attr("d", function(d){
                        return "M " +  (d.source.x_pos  * responsiveXPos) + " " + calculateYPos(d.source) + 
                            " L " + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.target) ) + " " 
                                + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });	 
                
                link
                    .filter(function(d){return d.id === "bride-right"})
                    .attr("d", function(d){
                        return "M " +  (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " L " + 
                            (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.target)) + " " 
                                + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });
                    
                link
                    .filter(function(d){return d.id === "Alice_Child"})
                    .attr("d", function(d){
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) 
                                    + " L " + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (16.25 * responsiveYPos)) + " "
                                    + ((d.source.x_pos - 80) * responsiveXPos) + " " + (calculateYPos(d.source) + (16.25 * responsiveYPos)) + " " 
                                    + ((d.source.x_pos - 80) *  responsiveXPos) + " " + (calculateYPos(d.source) + (67.5 * responsiveYPos)) + " "
                                    + ((d.target.x_pos - 20) * responsiveXPos) + " " + (calculateYPos(d.source) + (67.5 * responsiveYPos)) + " " 
                                    + ((d.target.x_pos - 20) * responsiveXPos) + " " + (calculateYPos(d.source) + (21.75 * responsiveYPos)) + " " 
                                    + (d.target.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (21.75 * responsiveYPos)) + " " 
                                    + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });
                        
                link	
                    .filter(function(d){return d.source.name === "Margaret and Gustaf"})
                    .attr("d", function(d){
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " L " 
                                + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (77.5 * responsiveYPos)) + " " 
                                + ((d.target.x_pos - 10) * responsiveXPos) + " " + (calculateYPos(d.source) + (77.5 * responsiveYPos)) + " " 
                                + ((d.target.x_pos - 10) * responsiveXPos) + " " + (calculateYPos(d.target) - (10 * responsiveYPos)) + " "
                                + (d.target.x_pos * responsiveXPos) + " " + (calculateYPos(d.target) - (10 * responsiveYPos)) + " " 
                                + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });
                        
                link
                    .filter(function(d){return d.source.id === "Arthur1883" && d.target.id === "Alexandra_Arthur"})
                    .attr("d", function(d){
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " " + " L " 
                                + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (30 * responsiveYPos)) + " "
                                + ((d.target.x_pos + 170) * responsiveXPos) + " " + (calculateYPos(d.source) + (30 * responsiveYPos)) + " " 
                                + ((d.target.x_pos + 170) * responsiveXPos) + " " + (calculateYPos(d.target) + (8 * responsiveYPos)) + " "
                                + (d.target.x_pos * responsiveXPos) + " " + (calculateYPos(d.target) + (8 * responsiveYPos)) + " " 
                                + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });	
                
                link
                    .filter(function(d){return d.id === "houseLink";})
                    .attr("d", function(d){
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " L " 
                            + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });
                    
                link
                    .filter(function(d){return d.id === "houseLink_Alice";})
                    .attr("d", function(d){
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) 
                            + " L " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.target) + " "
                            + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });	 
                    
                draw_Link("Victoria Albert", 0.6);
                    
                draw_Link("Alfred and Maria", 0.65);
                
                draw_Link("Leopold, Duke of Albany and Helena", 0.6);
                        
                draw_Link("Arthur and Louise Margaret", 0.85);
                    
                position_EdwardVII_children();
                        
                draw_Link("Charles Edward and Victoria", 0.65);
                        
                draw_Link("Louise and Alexander", 0.65);
                        
                draw_Link("George V and Mary", 0.8);
                        
                draw_Link("George VI and Elizabeth", 0.6);
                        
                draw_Link("Prince Henry and Alice Montagu", 0.6);
                        
                draw_Link("Prince George and Princess Marina", 0.85);
                        
                draw_Link("Elizabeth II and Philip", 0.85);
                        
                draw_Link("Charles and Diana", 0.85);
                draw_Link("William and Catherine", 0.85);
                draw_Link("Harry and Meghan", 0.85);
                        
                draw_Link("Anne and Mark Phillips", 0.85);
                draw_Link("Peter Phillips and Autumn Kelly", 0.85);
                draw_Link("Zara Phillips and Michael Tindall", 0.85);
                        
                draw_Link("Andrew and Sarah", 0.7);
                draw_Link("Edward and Sophie", 0.7);

                draw_Link("Edoardo Mapelli Mozzi and Beatrice of York", 0.7);
                draw_Link("Eugenie of York and Jack Brooksbank", 0.7);
            }
                  
            function draw_Link(selector, k){
                link
                    .filter(function(d){return d.source.name === selector;})
                    .attr("d", function(d){
                        var yDistance = calculateYPos(d.target) - calculateYPos(d.source);
                        
                        return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " L " 
                            + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (yDistance * k)) + " "
                                    + (d.target.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (yDistance * k)) 
                                        + " " + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                    });
            }
                      
            function position_EdwardVII_children(){
                var k = 0.8;
                link
                    .filter(function(d){ return d.source.name === "Edward VII and Alexandra";})
                    .attr("d", function(d){
                        var yDistance = calculateYPos(d.target) - calculateYPos(d.source);
                                
                    return "M " + (d.source.x_pos * responsiveXPos) + " " + calculateYPos(d.source) + " L " 
                        + (d.source.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + 7) + " "
                            + (300 * responsiveXPos) + " " + (calculateYPos(d.source) + 7) + " " + (300 * responsiveXPos) + " " 
                                + (calculateYPos(d.source) + (yDistance * k)) + " "
                                    + (d.target.x_pos * responsiveXPos) + " " + (calculateYPos(d.source) + (yDistance * k)) 
                                        + " " + (d.target.x_pos * responsiveXPos) + " " + calculateYPos(d.target);
                                                       
                    });
            }

            /*
                Below are the constants needed to calculate the Y position of nodes and links.
                Just calculate them here to avoid repetitive calculations.
            */
            const layerPadding = famTreeHeight/8; //there are 7 layers/generations
            const lastLayer = d3.max(nodesData.map(d=> parseInt(d.layer)));
            const lowestLayerY = ((lastLayer) * layerPadding) - layerPadding;
            const yPadding = famTreeHeight > lowestLayerY?(famTreeHeight - lowestLayerY)/2:0;       

            const calculateYPos = (d) => {                
                let newY;
                if(d.layer){                  
                    newY = ((d.layer) * layerPadding) - layerPadding;
                    if(d.layer === 1)newY+=7.5;			   
                    if(d.layer === 3){
                        if(d["sub-layer"] === "a"){newY-=(35 * responsiveYPos);}
                        if(d["sub-layer"] === "b"){newY+=(5 * responsiveYPos);}
                        if(d["sub-layer"] === "c"){newY-=(21.25 * responsiveYPos);}
                        if(d["sub-layer"] === "d"){newY+=(32.5 * responsiveYPos);}
                    }
                
                    if(d.layer === 4){
                        if(d["sub-layer"] === "c"){newY+=(37.5 * responsiveYPos);}
                    }
                
                    if(d.layer === 5){
                        if(d["sub-layer"] === "b"){newY+=(32.5 * responsiveYPos);}
                    }
                
                    if(d.layer === 7){
                        if(d["sub-layer"] === "a"){newY-=(25 * responsiveYPos);}
                    }
                
                    if(d.type==="marriage")newY+=(10 * responsiveYPos);
                    if(d.type==="house")newY+=(20 * responsiveYPos);
                    if(d.type==="house" && d.name==="House of Bourbon")newY-=(1.25 * responsiveYPos);
                    if(d.type==="house" && d.id==="Bernadotte")newY-=(6 * responsiveYPos);
                }
        
                return newY + yPadding;
            }                   

            const zoom = d3.zoom()
                .extent([[0, 0], [famTreeWidth, famTreeHeight]])
                .scaleExtent([1, 8])                
                .on("zoom", zoomed);

            svg.call(zoom);         

            function zoomed({transform}) {
                focus.attr("transform", transform);
            }

            let myName = "", namesToSearch = [], currentSearchIndex = 0;
            let nodeToSearch = null, nodeHovered = null;
            
            function nodeToHilit(theNode, idx){                                                                                
                var transformString1 = theNode.select("text.firstLabel").attr("transform");
                var transformString2 = theNode.select("text.secondLabel").attr("transform");
                //console.log(transformString.substring(transformString.indexOf("(")+1, transformString.indexOf(")")).split(","));
                var transformMatrix1 = transformString1.substring(transformString1.indexOf("(")+1, transformString1.indexOf(")")).split(",");
                transformMatrix1[0]=+transformMatrix1[0];
                transformMatrix1[1]=+transformMatrix1[1];
                var transformMatrix2 = transformString2.substring(transformString2.indexOf("(")+1, transformString2.indexOf(")")).split(",");
                transformMatrix2[0]=+transformMatrix2[0];
                transformMatrix2[1]=+transformMatrix2[1];
                this.name = theNode.datum().name;
                this.id = theNode.datum().id;
                this.transformMatrix1 = transformMatrix1;
                this.transformMatrix2 = transformMatrix2;
                this.idx = idx;
            }

            const nodeSelection = d3.selectAll("g.nodes");

            const resetPos = () => {                             
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
                svg.call(zoom);
            }
            
            if(nameFocus === "------"){
                resetPos();
            }else{
                centerNZoom();
            }

            d3.select("#resetButton").on("click", resetPos);

            function nodeMouseover(e, d, i){
                
                const theNode = d3.select(this);
                const theNodeIdx = nodeSelection.data().findIndex(function(dNode){return dNode.id === d.id;});
                
                if(nodeHovered===null){
                    nodeHovered = new nodeToHilit(theNode, theNodeIdx);  
                    if(nodeToSearch!=null && nodeToSearch.id === nodeHovered.id)return;
                    hilit(theNode, theNodeIdx);
                }	

                //hide other node labels
                node.filter(dNode=>dNode.id!==d.id).selectAll("text")
                    .style("opacity", 0)
                    .style("pointer-events", "none");
            }  

            function nodeMousemove(e){
                const { offsetWidth, offsetHeight } = tooltip.node();
                    
                const clientWidth = document.documentElement.clientWidth
                const baseXPos =  e.x - (offsetWidth/2); 

                let xPos = 0;
                if(baseXPos < 0){//too much to the left....
                    xPos = 0;
                }
                else if(baseXPos + offsetWidth > clientWidth){//too much to the right....
                    const difference =  (baseXPos + offsetWidth) - clientWidth;
                    xPos = baseXPos - difference;
                }
                else{
                    xPos = baseXPos;
                }
                tooltip.style("left", xPos + "px")
                    .style("top", (e.y - (offsetHeight+ 10))  + "px");//put a little 10px top margin...                    
            }

            function nodeMouseout(e, d){
                const theNode = d3.select(this);
                const theNodeIdx = nodeSelection.data().findIndex(function(dNode){return dNode.id === d.id;});

                unhilit(theNode, theNodeIdx);

                if(nodeToSearch!=null && nodeToSearch.id === nodeHovered.id)nodeToSearch=null;
                if(nodeHovered!==null){
                    //Show other node labels
                    node.filter(dNode=>dNode.id!==d.id).selectAll("text")
                        .style("opacity", 1)
                        .style("pointer-events", "auto");

                    nodeHovered = null;                
                }
                
            }              
            
            function centerNZoom(){
                let name = nameFocus;
                if(screenMode==="midLowScreen" && name.length > 3){
                    if(myName!=name){
                       myName = name;
                       namesToSearch.length = 0;
                       names.forEach(function(currentName){
                           if(currentName.includes(name))namesToSearch.push(currentName);
                       });
                       currentSearchIndex = 0;
                    }else{
                        currentSearchIndex+=1;
                        if(currentSearchIndex > namesToSearch.length-1)currentSearchIndex = 0;
                    }
                    name = namesToSearch[currentSearchIndex];
                }
                if(name.length > 0 && names.indexOf(name) > -1){//if name is listed in the tree...
                    //first, hilit the node..
                    let birthDate = "", nodeName = name;
                    if(name.indexOf("(") > -1){//persons listed with their living periods inside brackets...
                        nodeName = name.substring(0, name.indexOf("(") - 1);
                        if(name.indexOf("Born") > -1)//living person..
                            birthDate = name.substring(name.indexOf(":") + 2, name.indexOf(")"));
                        else{ 
                            //peculiarity about the Queen's Mother name, she has 2 "-"s : in her name and living period....
                            /*if(nodeName==="Elizabeth Bowes-Lyon")birthDate = name.substring(name.indexOf("(") + 1, name.lastIndexOf("-"));
                            else birthDate = name.substring(name.indexOf("(") + 1, name.indexOf("-"));*/
                            
                            //easy solution : birth year is always 4 chars string after first occurence of "("....
                            birthDate = name.substring(name.indexOf("(") + 1, name.indexOf("(") + 5);
                        }
                    }   
                  
                    let alreadyHilit = false;                                                            

                    if(nodeToSearch === null){
                        let idxToSearch = nodeSelection.data().findIndex(dNode=>{
                            if(dNode.type === "house" && dNode.name === nodeName){
                                return true;
                            }
                            if(dNode.type === "person" && dNode.name === nodeName && dNode.birth === birthDate){
                                return true
                            }
                            return false;
                        });
                        
                        if(birthDate === ""){//if searched node is a house...
                            const theNode = nodeSelection.filter(function(d){return d.name === nodeName;});

                            nodeToSearch = new nodeToHilit(
                                    theNode, 
                                        idxToSearch
                                );
                        }
                        else{ //if searched node is a person, it will have a birth date...
                            const theNode = nodeSelection.filter(function(d){return d.name === nodeName && d.birth === birthDate;});
                            
                            nodeToSearch = new nodeToHilit(
                                    theNode,
                                        idxToSearch 
                                );
                        }                        
                    }

                    if(nodeHovered!=null && nodeHovered.id === nodeToSearch.id)alreadyHilit = true;

                    var theNode = nodeSelection.filter(function(d){return d.id === nodeToSearch.id;});                    
                    const theNodeIdx = nodeSelection.data().findIndex(function(d){return d.id === nodeToSearch.id;});
                                        
                    if(!alreadyHilit)hilit(theNode, theNodeIdx);
                    //then zoom to it...
                    
                    var zoomedScale = screenMode==="largeScreen"?4:6;
                    var zoomScale = +d3.zoomTransform(svg.node()).k;
                    if(zoomScale < zoomedScale)zoomScale = zoomedScale;	

                    var transformString = theNode.attr("transform");
                    
                    var transformMatrix = transformString.substring(transformString.indexOf("(")+1, transformString.indexOf(")")).split(",");
                    var x_translate = famTreeWidth/2 - ((+transformMatrix[0]) * zoomScale);
                    var y_translate = famTreeHeight/2 - ((+transformMatrix[1]) * zoomScale);
                     
                    let t = d3.zoomIdentity.translate(x_translate, y_translate).scale(zoomScale);
                    svg.transition().duration(750).call(zoom.transform, t);
                    svg.call(zoom);
                     
                }
            }

            function hilit(theNode, idx){                                
                
                const {id, name, type, labelPos, labelY:{topLabelY, bottomLabelY}} = theNode.datum();                
                if(nodeToSearch!=null && id === nodeToSearch.id){                    
                    if(name === "Queen Victoria" || name === "Prince Albert"){
                        theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(){
                                //if(type === "house"){return;}
                                const xPos = -(this.getBBox().width/2);
                                return "translate(" + xPos + "," + (topLabelY + 8) + ")";
                            });	
                          
                        theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(){
                                //if(type === "house"){return;}
                                const xPos = -(this.getBBox().width/2);
                                return "translate(" + xPos + "," + (bottomLabelY + 10) + ")";
                            });
                    }//These topmost 2 will have special treatment..
                    else{	                          
                        if(labelPos === "top"){//label positioned above picture
                            theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(){
                                const xPos = -(this.getBBox().width/2);
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (topLabelY - 7) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(){
                                const xPos = -(this.getBBox().width/2);
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (bottomLabelY - 5) + ")";
                            });	                        
                        }else if(labelPos === "bottom"){//label positioned below picture
                            theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(){
                                const xPos = -(this.getBBox().width/2);
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (topLabelY + 8) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(){
                                const xPos = -(this.getBBox().width/2);
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (bottomLabelY + 10) + ")";
                            });	
                        }
                    }
                }
                  
                if(nodeHovered!=null && id === nodeHovered.id){
                    if(name === "Queen Victoria" || name === "Prince Albert"){
                        theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(e, d){
                                
                                const xPos = -(this.getBBox().width/2);
                                
                                return "translate(" + xPos + "," + (topLabelY + 8) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(e, d){
                                const xPos = -(this.getBBox().width/2);                                
                                return "translate(" + xPos + "," + (bottomLabelY + 10) + ")";
                            });
                    }//These topmost 2 will have special treatment..
                    else{	                      
                        if(labelPos === "top"){
                            theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(e, d){
                                
                                const xPos = -(this.getBBox().width/2);
                                var transY = -7;
                                var transX = 0;
                                //some text overlapp-ed to node, can't be helped, some additional adjustment must be made...
                                if(id === "Romanov"){transX+=5;transY+=22;}
                                if(id === "Hohenzollern-Sigmaringen")transY+=25;
                                if(id === "Bourbon")transY+=18;
                                
                                if(id === "Ferdinand1865")transX+=11;
                                if(id === "Alexandra1878")transX-=25;
                                if(id === "Alexander1881"){transX+=5;transY+=4;}
                                
                                return "translate(" + (xPos + transX) + "," + (topLabelY +transY) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(e, d){
                                const xPos = -(this.getBBox().width/2);

                                var transY = -5;
                                var transX = 0;
                                //some text overlapp-ed to node, can't be helped, some additional adjustment must be made...
                                if(id === "Ferdinand1865")transX+=11;
                                if(id === "Alexandra1878")transX-=45;
                                if(id === "Alexander1881"){transX+=5;transY+=4;}
                                return "translate(" + (xPos+ transX) + "," + (bottomLabelY + transY) + ")";
                            });	
                        //}else if(nodeToSearch.transformMatrix1[1] > 0){
                        }else if(labelPos === "bottom"){//name label positioned below picture
                            theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(e, d){
                                const xPos = -(this.getBBox().width/2);	 
                                var transY = 8;
                                var transX = 0;
                                //some text overlapp-ed to node, can't be helped, some additional adjustment must be made...			 
                                
                                if(id === "Christian1831")transY-=2;
                                if(id === "Henry1858"){transX+=4;transY-=2;}
                                if(id === "Ernest1868")transX-=4;
                                if(id === "Cyril1876")transY-=3;
                                if(id === "Maria1875"){transX-=8;transY-=6.5;}			 			 		
                                if(id === "Alfonso1886")transX+=6;
                                if(id === "Alice1883")transX-=12;			 
                                if(id === "Sibylla1908")transX+=15;
                                if(id === "Margaret1930")transX-=12;
                    
                                if(id === "Hesse-DarmstadtA"){transY-=7;}
                                if(id === "Hohenlohe-Langenburg"){transX-=15;transY-=10;}
                                if(id === "Oldenburg"){transY-=7;}			 
                                if(id === "Bernadotte"){transY-=5;}	
                                if(id === "Lascelles"){transY-=5;}
                                            
                                return "translate(" + (xPos + transX) + "," + (topLabelY + transY) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(d){
                                const xPos = -(this.getBBox().width/2);
                                var transY = 10;
                                var transX = 0;
                                //some text overlapp-ed to node, can't be helped, some additional adjustment must be made...
                                if(id === "Christian1831")transY-=2;
                                if(id === "Henry1858"){transX+=4;transY-=2;}
                                if(id === "Ernest1868")transX-=4;
                                if(id === "Cyril1876")transY-=3;
                                if(id === "Maria1875"){transX-=11;transY-=6.5;}
                                if(id === "Alfonso1886")transX+=6;
                                if(id === "Alice1883")transX-=12;	
                                if(id === "Sibylla1908")transX+=15;			 
                                if(id === "Henry1882")transX+=3;
                                if(id === "Margaret1930")transX-=12;
                                if(id === "Marie-Christine1945")transX+=3;
                                
                                return "translate(" + (xPos + transX) + "," + (bottomLabelY + transY) + ")";
                            });	
                        }
                    }                    

                    handleTooltip(theNode.datum());
                }

                const myMask = focus.selectAll("clipPath").filter(function(dMask){
                    return dMask.id === id;
                }).selectAll("rect");
                
                myMask
                    .transition().duration(100)
                    .attr("width", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 200;
                        return 400;
                    })
                    .attr("height", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 250;
                        return 500;
                    })
                    .attr("rx", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 15;
                        return 30;
                    })
                    .attr("ry", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 15;
                        return 30;
                    });

                theNode.select("rect")
                        .transition().duration(100)
                    .attr("width", function(d){return (d.type==="person"?20:(d.type==="house"?0:1.75));})
                    .attr("height", function(d){return (d.type==="person"?25:(d.type==="house"?0:1.75));})
                    .attr("x", function(d){return (d.type==="person"?-10:(d.type==="house"?-3.75:-0.875));})
                    .attr("y", function(d){return (d.type==="person"?-12.5:(d.type==="house"?-5:-0.875));})
                    .attr("rx", 1.25)
                    .attr("ry", 1.25)
                    .style("stroke-width", function(d){return (d.type==="person"?1.75:0);});

                theNode.select("image")
                        .transition().duration(100)
                    .attr("width", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 200;
                        return 400;
                        }else if(d.type === "house")return d.w/4;
                        else return 0;
                    })
                    .attr("height", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 250;
                        return 500;
                        }else if(d.type === "house")return d.h/4;
                        else return 0;
                    })                        
                    .attr("transform", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                            return "translate(-7.5, -10) scale(0.075)";
                        else  
                            return "translate(-7.5, -10) scale(0.0375)";
                        }else return "translate(-7.5, -10) scale(0.25)";
                    });

                
            }

            function handleTooltip(d){
                tooltip.style("opacity", 1);

                const livePeriod = d.birth;
                let liveString;
                if(d.died && d.died!="alive")liveString = livePeriod + " - " + d.died;
                else liveString = "Born at " + livePeriod;

                tooltip.select("#name").text(d.name);
                tooltip.select("img#myPic")
                    .attr("src", function(){
                        if(d.image){
                            if(d.type === "person"){
                                return "/images/british-monarch/" + d.image + ".jpg";
                            }else if(d.type === "house"){
                                return "/images/british-monarch/houses/" + d.image + ".png";
                            }
                        }
                        else if(!d.image){return '#';}
                        //return "#";
                    })
                    .style("width", "150px");

                if(d.title){
                    tooltip.select("#title").style("display", "block").text(title!=="-"?d.title:"");
                }else{
                    tooltip.select("#title").style("display", "none")
                }
                tooltip.select("#live").style("display", d.type==="person"?"block":"none").text("(" + liveString + ")");

                if(d.status === "monarch"){
                    let rulingString;
                    if(d["rule end"])
                    {
                        rulingString = "Rule from " + d.crowned + " to " + d["rule end"] + ".";
                    }
                    else{ 
                        rulingString = "Will be crowned at " + d.crowned + ".";
                    }

                    tooltip.select("#ruled").style("display", "inline").text(rulingString);
                }else{
                    tooltip.select("#ruled").style("display", "none");
                }	
            }

            function unhilit(theNode, idx){
                const {labelY:{topLabelY, bottomLabelY}} = theNode.datum();
                theNode.selectAll("text.firstLabel")
                        .transition().duration(100)
                    .style("font-weight", "normal")
                    .attr("font-size", "3px")
                    .attr("transform", function(d){
                        const xPos = -(this.getBBox().width/2)/2;	
                        /*
                        Somehow d.labelX.topLabelX will reset to 0 after search hilit, so cannot rely
                        on it to unhilit. Instead use getBBox to calculate top label X position.
                        Top label is doubled on hilit both font-size and font-weight
                        */
                        return "translate(" + xPos + "," + topLabelY + ")";
                    });

                theNode.selectAll("text.secondLabel")
                    .transition().duration(100)
                .style("font-weight", "normal")
                .attr("font-size", "3px")
                .attr("transform", function(d){
                    return "translate(" + d.labelX.bottomLabelX + "," + bottomLabelY + ")";
                });
                               
                const myMask = masks.filter(function(dMask){
                    return dMask.id === theNode.datum().id;
                });

                myMask
                        .transition().duration(100)
                    .attr("width", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                        return 200;
                    })
                    .attr("height", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                        return 250;
                    })
                    .attr("rx", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 50;
                        return 100;
                    })
                    .attr("ry", function(d){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 62.5;
                        return 125;
                    });

                theNode.select("rect")
                        .transition().duration(100)
                    .attr("width", function(d){return (d.type==="person"?10:(d.type==="house"?0:1.75));})
                    .attr("height", function(d){return (d.type==="person"?12.5:(d.type==="house"?0:1.75));})
                    .attr("x", function(d){return (d.type==="person"?-5:(d.type==="house"?-3.75:-0.875));})
                    .attr("y", function(d){return (d.type==="person"?-6.25:(d.type==="house"?-5:-0.875));})
                    .attr("rx", 5)
                    .attr("ry", 6.25)
                    .style("stroke-width", function(d){return (d.type==="person"?0.6:0);}); 

                theNode.select("image")
                        .transition().duration(100)
                    .attr("width", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 100;
                        return 200;
                        }else if(d.type === "house"){return d.w/8;}
                        else return 0;
                    })
                    .attr("height", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name ==="Friedrich Josias")return 125;
                        return 250;
                        }else if(d.type === "house"){return d.h/8;}
                        else return 0;
                    })
                    .attr("transform", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                            return "translate(-3.75, -5) scale(0.075)";
                        else  
                            return "translate(-3.75, -5) scale(0.0375)";
                        }else return "translate(-3.75, -5) scale(0.25)";
                    });  

                    tooltip.style("opacity", 0)
            }
        },
        [  famTreeWidth, famTreeHeight, nameFocus ]
    );

    const canDraw = famTreeHeight > 0;
    return (  
        <div className="w-full h-full bg-green-400 flex-grow flex flex-col" >
            <div className='h-[50px] grow-0 bg-slate-50 flex justify-start items-center'>
                <form id="searchContainer" className='basis-full md:basis-1/2 flex justify-start items-center'>
                    <fieldset className='flex flex-row'>
                        <legend className='text-xs'>Search for:</legend>
                        <select 
                            className='w-40 xs:w-50 md:w-60'
                            id="nameList"
                            value={nameFocus}
                            onChange={(e)=>{setNameFocus(e.target.value);}}
                        >
                            {
                                names.map((d, i)=>{
                                    return (
                                        <option key={i} value={d}>{d}</option> 
                                    )
                                })
                            }
                        </select>
                        <button 
                            id="resetButton"
                            className={`bg-blue-500 
                                hover:bg-blue-700 text-sm text-white font-bold 
                                    py-1 px-2 rounded`}
                            onClick={(e)=>{
                                e.stopPropagation();
                                e.preventDefault();
                                setNameFocus("------");
                            }}                            
                        >
                            Reset
                        </button>
                    </fieldset>                    
                </form>
            </div>
            <div ref={famTreeRef} className='h-[calc(100%-50px)] bg-amber-400 flex overflow-hidden' >
                <div className='basis-full bg-cyan-400 border border-slate-600 relative'>
                {
                    canDraw && 
                    <svg
                        ref={ref}
                        className={`absolute left-0 top-0 max-w-[${famTreeWidth}px] max-h-[${famTreeHeight}px]`} 
                        viewBox={`0 0 ${famTreeWidth} ${famTreeHeight}`}
                    >
                        <g className="plot-area" />
                    </svg> 
                }
                </div>
            </div>
            <div id="tooltip" className="fixed max-w-xs bg-yellow-300 bg-opacity-90 flex flex-col items-center">
                <p id="name" className='text-md font-bold text-center'></p>
                <img id="myPic" className="max-w-xs" src=""></img>
                <p id="title" className='text-sm font-bold text-center'></p>
                <p id="live" className='text-xs text-center'></p>
                <p id="ruled" className='text-xs text-center'></p>
            </div>
            
        </div>
        
    );
}