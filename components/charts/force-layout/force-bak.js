import React, {useState, useEffect} from 'react';
import * as d3 from "d3";
import { useD3 } from "../../../utils/hooks/useD3";
import { useWindowDimensions } from "../../../utils/hooks/useWindowDimensions";
import { forceData, windsorData } from '../../../utils/const';
import styles from "../../../styles/components/charts/force/force.module.css";
/*
Backup before restructure enter update exit to version 7
*/

export const ForceLayout = (props) => {
    const {width, height} = useWindowDimensions();

    const graphWidth = 1050, graphHeight = 600;
    
    const [ nameFocus, setNameFocus ] = useState("------");

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

            const nodeColor = d3.scaleOrdinal()	
                .domain(["monarch", "close", "other"])
                .range(["red", "#ff9933", "grey"]);//	

            const simulation = d3
                .forceSimulation(nodesData)
                .force("link", d3.forceLink(linksData).id(d => {/*console.log(d);*/return d.id}))
                .force("charge", d3.forceManyBody().strength(-150))
                .force("x", (d)=>{/*console.log(d3.forceX());*/return d3.forceX()})
                .force("y", d3.forceY());

            
            const focus = svg.select(".plot-area");
            const link = focus.selectAll(".link")
                    .data(linksData, function(d){return d.source.id + d.target.id;})
                .join(
                    enter =>enter.append("path")                
                        .attr("class", "link")
                        .style("stroke-width", 1)
                        .style("stroke", "#002366")
                        .style("fill", "none"),
                    update => update.transition().duration(250)
                        .style("stroke-width", 1)
                        .style("stroke", "#002366")
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
                .enter().append("g")
                .attr("class", "nodes")
                .style("cursor", "pointer")
                .on("mouseenter", nodeMouseover)
                .on("mouseleave", nodeMouseout);
            /*node = svg
                .append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 2)
                .selectAll("circle")
                .data(nodesData)
                .join("circle")
                .attr("r", 3)
                .attr("fill", "red");*/
                            
            const nodeRect = node.append("rect")		
                .attr("width", function(d){return (d.type==="person"?10:(d.type==="house"?0:1.75));})
                .attr("height", function(d){return (d.type==="person"?12.5:(d.type==="house"?0:1.75));})
                .attr("x", function(d){return (d.type==="person"?-5:(d.type==="house"?-3.75:-0.875));})
                .attr("y", function(d){return (d.type==="person"?-6.25:(d.type==="house"?-5:-0.875));})
                .attr("fill", function(d){return (d.type==="person"?((d.died==="alive" || !d.died)?"lime":"#d1e0e0"):(d.type==="house"?"grey":"#002366"));})
                .attr("rx", function(d){return (d.type==="person"?5:(d.type==="house"?1.25:0.875));})
                .attr("ry", function(d){return (d.type==="person"?6.25:(d.type==="house"?1.25:0.875));})
                .style("stroke", function(d){return (d.type==="marriage"?"#002366":(d.status==="monarch"?"#ffd700":(d.status==="close"?"#002366":"#b3c1d6")));})
                .style("stroke-width", function(d){return (d.type==="person"?0.6:0);});	

            const nodeImage = node.append("image")	
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

            let upperPosition = true, upperHousePosition = true;	 //flags for texts placement
            const nodeLabel1 = node.append("text")
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
                });

            let upperPosition1 = true;

            const nodeLabel2 = node.append("text")
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
                });

            simulation.on("tick", () => {
                //update link positions
                /*
                link
                    .attr("x1", d => {return d.source.x_pos})
                    .attr("y1", d => calculateYPos(d.source))
                    .attr("x2", d => d.target.x_pos)
                    .attr("y2", d => calculateYPos(d.target));*/
                positionLinks();
                // update node positions
                node
                    .attr("transform", function(d){
                        return `translate(${d.x_pos}, ${calculateYPos(d)})`;
                    })
                    /*.attr("cx", d => {
                        //from old source code, container width is 1050, so the x_pos is relative to that..
                        return d.x_pos;
                    })
                    .attr("cy", d => {
                        return calculateYPos(d);
                    });*/
            
                // update label positions
                /*
                label
                    .attr("x", d => { return d.x_pos; })
                    .attr("y", d => { return d.y; })*/
            });

            function positionLinks(){
                link
                    .filter(function(d){return d.id === "bride-left"})
                    .attr("d", function(d){
                        return "M " +  d.source.x_pos + " " + calculateYPos(d.source) + " L " + (d.source.x_pos) + " " + (calculateYPos(d.target) ) + " " 
                                + d.target.x_pos + " " + calculateYPos(d.target);
                    });	 
                
                link
                    .filter(function(d){return d.id === "bride-right"})
                    .attr("d", function(d){
                        return "M " +  d.source.x_pos + " " + calculateYPos(d.source) + " L " + (d.source.x_pos) + " " + (calculateYPos(d.target)) + " " 
                            + d.target.x_pos + " " + calculateYPos(d.target);
                    });
                    
                link
                    .filter(function(d){return d.id === "Alice_Child"})
                    .attr("d", function(d){
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + (d.source.x_pos) + " " + (calculateYPos(d.source) + 16.25) + " "
                                    + (d.source.x_pos - 80) + " " + (calculateYPos(d.source) + 16.25) + " " + (d.source.x_pos - 80) + " " + (calculateYPos(d.source) + 67.5) + " "
                                    + (d.target.x_pos - 20) + " " + (calculateYPos(d.source) + 67.5) + " " + (d.target.x_pos - 20) + " " + (calculateYPos(d.source) + 21.75) + " " 
                                    + d.target.x_pos + " " + (calculateYPos(d.source) + 21.75) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                    });
                        
                    link	
                    .filter(function(d){return d.source.name === "Margaret and Gustaf"})
                    .attr("d", function(d){
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.source.x_pos + " " + (calculateYPos(d.source) + 77.5) + " " 
                                + (d.target.x_pos - 10) + " " + (calculateYPos(d.source) + 77.5) + " " + (d.target.x_pos - 10) + " " + (calculateYPos(d.target) - 10) + " "
                                + d.target.x_pos + " " + (calculateYPos(d.target) - 10) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                    });
                        
                    link
                    .filter(function(d){return d.source.id === "Arthur1883" && d.target.id === "Alexandra_Arthur"})
                    .attr("d", function(d){
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " " + " L " + d.source.x_pos + " " + (calculateYPos(d.source) + 30) + " "
                                + (d.target.x_pos + 170) + " " + (calculateYPos(d.source) + 30) + " " + (d.target.x_pos + 170) + " " + (calculateYPos(d.target) + 8) + " "
                                + d.target.x_pos + " " + (calculateYPos(d.target) + 8) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                    });	
                
                link
                    .filter(function(d){return d.id === "houseLink";})
                    .attr("d", function(d){
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.target.x_pos + " " + calculateYPos(d.target);
                    });
                    
                link
                    .filter(function(d){return d.id === "houseLink_Alice";})
                    .attr("d", function(d){
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.source.x_pos + " " + calculateYPos(d.target) + " "
                            + d.target.x_pos + " " + calculateYPos(d.target);
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
                        
                draw_Link("Anne and Mark Phillips", 0.85);
                draw_Link("Peter Phillips and Autumn Kelly", 0.85);
                draw_Link("Zara Phillips and Michael Tindall", 0.85);
                        
                draw_Link("Andrew and Sarah", 0.7);
                draw_Link("Edward and Sophie", 0.7);
            }
                  
            function draw_Link(selector, k){
                link
                    .filter(function(d){return d.source.name === selector;})
                    .attr("d", function(d){
                        var xDistance = d.source.x_pos - d.target.x_pos;
                        var yDistance = calculateYPos(d.target) - calculateYPos(d.source);
                        
                        return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.source.x_pos + " " + (calculateYPos(d.source) + (yDistance * k)) + " "
                                    + d.target.x_pos + " " + (calculateYPos(d.source) + (yDistance * k)) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                    });
            }
                      
            function position_EdwardVII_children(){
                var k = 0.8;
                link
                    .filter(function(d){ return d.source.name === "Edward VII and Alexandra";})
                    .attr("d", function(d){
                    var xDistance = d.source.x_pos - d.target.x_pos;
                    var yDistance = calculateYPos(d.target) - calculateYPos(d.source);
                            
                return "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.source.x_pos + " " + (calculateYPos(d.source) + 7) + " "
                        + 300 + " " + (calculateYPos(d.source) + 7) + " " + 300 + " " + (calculateYPos(d.source) + (yDistance * k)) + " "
                        + d.target.x_pos + " " + (calculateYPos(d.source) + (yDistance * k)) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                        
                        /*
                        "M " + d.source.x_pos + " " + calculateYPos(d.source) + " L " + d.source.x_pos + " " + (calculateYPos(d.source) + (yDistance * k)) + " "
                                + d.target.x_pos + " " + (calculateYPos(d.source) + (yDistance * k)) + " " + d.target.x_pos + " " + calculateYPos(d.target);
                                */
                });
            }

            const calculateYPos = (d) => {
                const k = graphHeight/8; //there are 7 layers/generations
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

            const zoom = d3.zoom()
                .extent([[0, 0], [graphWidth, graphHeight]])
                .scaleExtent([1, 8])                
                .on("zoom", zoomed);

            svg.call(zoom);            

            let zoomBySearch = false;
            /*
                Additional variable to determine if zoom is by user zoom and drag, or by search
            */
            function zoomed({transform}) {
                focus.transition().duration(zoomBySearch?750:0).attr("transform", transform);
                if(zoomBySearch){
                    setTimeout(zoomBySearch = false, 750);
                }
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
                /*zoom
                    .scaleTo(1)
                    .translate([0,0]);*/
                //focus.transition().duration(750).attr("transform", "translate(0, 0)scale(1)");
                //focus.transition().duration(750).call(zoom.transform, d3.zoomIdentity);                
                svg.call(zoom.transform, d3.zoomIdentity);
                svg.call(zoom);
            }
            
            if(nameFocus === "------"){
                resetPos();
            }else{
                centerNZoom();
            }

            function nodeMouseover(e, d, i){
                //console.log(d3.select(this).attr("transform"));
                //console.log(d);

                //console.log('node : ', node._groups);
                //console.log(d.id)
                const theNode = d3.select(this);
                const theNodeIdx = nodeSelection.data().findIndex(function(dNode){return dNode.id === d.id;});
                //console.log('nodeIdx : ', theNodeIdx);
                //console.log(node[theNodeIdx]);
                //console.log('theNode : ', theNode);
                if(nodeHovered===null){
                    nodeHovered = new nodeToHilit(theNode, theNodeIdx);  
                    if(nodeToSearch!=null && nodeToSearch.id === nodeHovered.id)return;
                    hilit(theNode, theNodeIdx);
                }	
            }  

            function nodeMouseout(e, d){
                const theNode = d3.select(this);
                const theNodeIdx = nodeSelection.data().findIndex(function(dNode){return dNode.id === d.id;});

                unhilit(theNode, theNodeIdx);

                if(nodeToSearch!=null && nodeToSearch.id === nodeHovered.id)nodeToSearch=null;
                nodeHovered = null;
                
            }

            /*
            focus.selectAll("g.nodes").nodes().forEach(d=>{
                console.log('node data : ', d.datum);

                //console.log(typeof d)
            });*/   
            
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
                    
                    if(nodeToSearch!=null && nodeToSearch.name!=name){
                        unhilit(node.filter(function(d){return d.name === nodeToSearch.name;}), nodeToSearch.idx);
                        nodeToSearch = null;
                    }//else if(nodeToSearch!=null && nodeToSearch.name===name)alreadyHilit = true;
                    

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
                        /*
                        node.each(function(dNode, idx){
                            if(dNode.type === "house" && dNode.name === nodeName){
                                idxToSearch = idx;	      
                            }
                            else if(dNode.type === "person"){		  
                                if((dNode.name === nodeName)  && (dNode.birth === birthDate))idxToSearch = idx;
                            }
                        });*/
                        //console.log('idxToSearch in centerNZoom : ', idxToSearch);
                        
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
                    
                    //console.log('search node datum : ', theNode.datum());
                    if(!alreadyHilit)hilit(theNode, theNodeIdx);
                    //then zoom to it...
                    //console.log(node.filter(function(d){return d.name === nameToSearch;}).attr("transform"));
                    var zoomedScale = screenMode==="largeScreen"?4:6;
                    var zoomScale = +d3.zoomTransform(svg.node()).k;
                    if(zoomScale < zoomedScale)zoomScale = zoomedScale;	

                    var transformString = theNode.attr("transform");
                    
                    var transformMatrix = transformString.substring(transformString.indexOf("(")+1, transformString.indexOf(")")).split(",");
                    var x_translate = graphWidth/2 - ((+transformMatrix[0]) * zoomScale);
                    var y_translate = graphHeight/2 - ((+transformMatrix[1]) * zoomScale);
                                                    
                    zoomBySearch = true;
                    /*
                    Set zoomBySearch to true to ensure smooth zooming
                    */
                    let t = d3.zoomIdentity.translate(x_translate, y_translate).scale(zoomScale);
                    svg.call(zoom.transform, t);
                    svg.call(zoom);

                    if(screenMode==="midLowScreen"){
                        //must reset tooltip before display..
                        //tooltipSmallScreenMouseout();
                        //tooltipSmallScreen(theNode.datum());
                    }
                    
                    //scroll screen to viewing position, if not already...
                    /*if(window.pageYOffset != 280){
                        console.log("search pressed : " + window.pageYOffset);
                        d3.transition()
                            .duration(1000)
                            .tween("scroll", scrollTween(280))
                    }*/ 
                }//else nameToSearch = "";
            }

            function hilit(theNode, idx){                
                const text1Trans = theNode.select("text.firstLabel").attr("transform");
                const text1Xtrans = text1Trans.substring(text1Trans.indexOf('(') + 1, text1Trans.indexOf(','));
                const text1Ytrans = text1Trans.substring(text1Trans.indexOf(',') + 1, text1Trans.indexOf(')'));

                const text2Trans = theNode.select("text.secondLabel").attr("transform");
                const text2Xtrans = text1Trans.substring(text2Trans.indexOf('(') + 1, text1Trans.indexOf(','));
                const text2Ytrans = text1Trans.substring(text2Trans.indexOf(',') + 1, text1Trans.indexOf(')'));                                

                

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
                        //if(nodeToSearch.transformMatrix1[1] < 0){//name label positioned above picture
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
                        //}else if(nodeToSearch.transformMatrix1[1] > 0){//name label positioned above picture
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
                                //console.log('d on hover : ', e);
                                const xPos = -(this.getBBox().width/2);
                                //console.log('label bounding box hover  : ', this.getBBox());
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (topLabelY + 8) + ")";
                            });	
                            
                            theNode.select("text.secondLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "5px")
                            .attr("transform", function(e, d){
                                const xPos = -(this.getBBox().width/2);
                                //if(theNode.datum().type === "house"){return;}
                                return "translate(" + xPos + "," + (bottomLabelY + 10) + ")";
                            });
                    }//These topmost 2 will have special treatment..
                    else{	  
                        //if(nodeToSearch.transformMatrix1[1] < 0){//name label positioned above picture
                        if(labelPos === "top"){
                            theNode.select("text.firstLabel")
                                .transition().duration(100)
                            .style("font-weight", "bold")
                            .attr("font-size", "6px")
                            .attr("transform", function(e, d){
                                //console.log('d on hover : ', e);
                                //console.log('label bounding box hover  : ', this.getBBox());
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
                                //if(type === "house"){return;}
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
                                //console.log('d on hover : ', d);
                                //console.log('label bounding box hover  : ', this.getBBox());
                                //if(type === "house"){return;}
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
                                //if(type === "house"){return;}
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
                }
                
                //console.log(masks.data())
                //console.log('theNode data : ', theNode.datum());
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
                        //.attr("x", function(d){return (d.type==="person"?-15:-12.5);})
                        //.attr("y", function(d){return (d.type==="person"?-20:-12.5);})
                    .attr("transform", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                            return "translate(-7.5, -10) scale(0.075)";
                        else  
                            return "translate(-7.5, -10) scale(0.0375)";
                        }else return "translate(-7.5, -10) scale(0.25)";
                    });
            }

            function unhilit(theNode, idx){
                const {labelY:{topLabelY, bottomLabelY}} = theNode.datum();
                theNode.selectAll("text.firstLabel")
                        .transition().duration(100)
                    .style("font-weight", "normal")
                    .attr("font-size", "3px")
                    .attr("transform", function(d){
                        return "translate(" + d.labelX.topLabelX + "," + topLabelY + ")";
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
                    //.attr("x", function(d){return (d.type==="person"?-15:-12.5);})
                    //.attr("y", function(d){return (d.type==="person"?-20:-12.5);})
                    .attr("transform", function(d){
                        if(d.type === "person"){
                        if(d.name === "Charles Carnegie" || d.name === "Friedrich Josias")
                            return "translate(-3.75, -5) scale(0.075)";
                        else  
                            return "translate(-3.75, -5) scale(0.0375)";
                        }else return "translate(-3.75, -5) scale(0.25)";
                    });  
            }
        },
        [ width, height, nameFocus ]
    );

    /*
     <datalist id="data" style={{width:"100px", height:"80px", backgroundColor:"red"}}>
                {browsers.map((item, key) =>
                <option key={key} value={item} />
                )}
            </datalist>
            
            */

    
                    
    return (        
        <>
        <form id="searchContainer">
            <select id="nameList"
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
        </form>
        <div className={styles.svgContainer}>
            {
                height > 0 &&
                <svg
                    ref={ref}
                    className={styles.responsive}
                    viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                >
                    <g className="plot-area" />
                </svg> 
            }            
        </div> 
        </>    
    );
}

export const ForceGraph = ({ nodes, links, charge }) => {
    const [animatedNodes, setAnimatedNodes] = useState([]);
    const [animatedLinks, setAnimatedLinks] = useState([]);

    //console.log(nodes);
    //console.log(forceData.nodes);
  
    // re-create animation every time nodes change
    useEffect(() => {
        const simulation = d3.forceSimulation()
            .force("x", d3.forceX(400))
            .force("y", d3.forceY(300))
            .force("charge", d3.forceManyBody().strength(charge))
            .force("collision", d3.forceCollide(5))
            //.force("link", d3.forceLink(links).id(d => {/*console.log(d);*/return d.id}))
            //.force('links', d3.forceLink());
    
        // update state on every frame
        simulation.on("tick", () => {
            setAnimatedNodes([...simulation.nodes()]);
            //setAnimatedLinks([...simulation.links()]);
        });
    
        // copy nodes into simulation
        simulation.nodes([...nodes]);//.links([...links]);
        // slow down with a small alpha
        simulation.alpha(0.1).restart();
    
        // stop simulation on unmount
        return () => simulation.stop();
    }, [nodes, charge]);

    const calculateYPos = (d) => {        
        const k = graphHeight/8; //there are 7 layers/generations
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
  
    return (
        <g>
            {
                animatedNodes.map((node, i) => {
                    return (<circle
                        cx={node.x_pos}
                        cy={calculateYPos(node)}
                        r={5}
                        key={node.id}
                        stroke="black"
                        fill="transparent"
                    />
                );}
            )
            }
        </g>
    );
}