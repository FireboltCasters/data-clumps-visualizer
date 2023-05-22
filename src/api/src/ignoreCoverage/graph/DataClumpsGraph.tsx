import React, {FunctionComponent, useState} from 'react';
import Graph from "react-graph-vis";
import {
    DataClumpsParameterFromContext,
    DataClumpsTypeContext,
    DataClumpTypeContext
} from "data-clumps/ignoreCoverage/DataClumpTypes";
import {Button} from "primereact/button";

// @ts-ignore
export interface DataClumpsGraphProps {
    dataClumpsDict: DataClumpsTypeContext | null,
    from_file_path?: string | null | undefined,
    to_file_path?: string | null | undefined,
    dark_mode?: boolean
}

export const DataClumpsGraph : FunctionComponent<DataClumpsGraphProps> = (props: DataClumpsGraphProps) => {

    const [a, setA] = useState();

    const dark_mode = props?.dark_mode;
    let dataClumpsDict = props.dataClumpsDict;

    //const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict(); // we wont use synched variable here, since we want to export our functionality outside
//    const [showLargeGraph, setShowLargeGraph] = useState(false);
    const showLargeGraph = true;
    const setShowLargeGraph = (bool) => {

    };

    function getInitialGraphFromDataClumpsDict(dataClumpsDict){
        //console.log("getInitialGraphFromDataClumpsDict");

        let from_file_path: string | null | undefined = props?.from_file_path;
        let to_file_path: string | null | undefined = props?.to_file_path;

        let files_dict = {};
        let classes_dict = {};
        let fields_dict = {};
        let methods_dict = {};
        let parameters_dict = {};

        if(dataClumpsDict){

            let dataClumps = dataClumpsDict?.data_clumps || {};
            let dataClumpsKeys = Object.keys(dataClumps);
            for(let dataClumpKey of dataClumpsKeys){
                let dataClump = dataClumps[dataClumpKey];

                let file_path = dataClump.file_path;

                let shouldAnalyzeFile = true;

                if(from_file_path){
                    shouldAnalyzeFile = file_path === from_file_path
                }

                if(shouldAnalyzeFile){
                    let data_clump_data_dict = dataClump.data_clump_data;
                    let dataClumpDataKeys = Object.keys(data_clump_data_dict);
                    for(let dataClumpDataKey of dataClumpDataKeys){
                        let dataClumpData = data_clump_data_dict[dataClumpDataKey];
                        initNodesForDataClumpData(dataClump, dataClumpData, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict);
                    }
                }
            }
        }

        let nodes: any[] = [];
        let edges: any[] = [];

        let graph = {
            nodes: nodes,
            edges: edges
        }

        let files_dict_keys = Object.keys(files_dict);
        for(let file_dict_key of files_dict_keys){
            let file_dict_value = files_dict[file_dict_key];
            // @ts-ignore
            graph.nodes.push(file_dict_value);
            let classes_or_interfaces_ids = file_dict_value.classes_or_interfaces_ids;
            let classes_or_interfaces_ids_keys = Object.keys(classes_or_interfaces_ids);
            for(let classes_or_interfaces_ids_key of classes_or_interfaces_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: file_dict_value.id,
                    // @ts-ignore
                    to: classes_or_interfaces_ids_key,
                });
            }
        }

        let classes_dict_keys = Object.keys(classes_dict);
        for(let class_dict_key of classes_dict_keys){
            let class_dict_value = classes_dict[class_dict_key];
            // @ts-ignore
            graph.nodes.push(class_dict_value);
            let field_ids = class_dict_value.field_ids;
            let field_ids_keys = Object.keys(field_ids);
            for(let field_ids_key of field_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: field_ids_key,
                });
            }

            let method_ids = class_dict_value.method_ids;
            let method_ids_keys = Object.keys(method_ids);
            for(let method_ids_key of method_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: method_ids_key,
                });
            }
        }

        let fields_dict_keys = Object.keys(fields_dict);
        for(let field_dict_key of fields_dict_keys){
            let field_dict_value = fields_dict[field_dict_key];
            // @ts-ignore
            graph.nodes.push(field_dict_value);

            let related_to = field_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: field_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        let method_ids = Object.keys(methods_dict);
        for(let method_id of method_ids){
            let method_dict_value = methods_dict[method_id];
            // @ts-ignore
            graph.nodes.push(method_dict_value);
            let parameter_ids = method_dict_value.parameter_ids;
            let parameter_ids_keys = Object.keys(parameter_ids);
            for(let parameter_ids_key of parameter_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: method_dict_value.id,
                    // @ts-ignore
                    to: parameter_ids_key,
                });
            }
        }

        let parameters_dict_keys = Object.keys(parameters_dict);
        for(let parameter_dict_key of parameters_dict_keys){
            let parameter_dict_value = parameters_dict[parameter_dict_key];
            // @ts-ignore
            graph.nodes.push(parameter_dict_value);

            let related_to = parameter_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: parameter_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        return graph;
    }

    function getRawFileNode(file_path, files_dict: any){
        let file_node = files_dict[file_path];
        if(!file_node){
            file_node = {
                id: file_path,
                label: file_path,
                color: "red",
                classes_or_interfaces_ids: {},
            }
            files_dict[file_node.id] = file_node;
        }
        return file_node;
    }

    function getRawClassesOrInterfacesNode(classOrInterface_key: string, classOrInterface_name: string, classes_dict: any){
        //console.log("getRawClassesOrInterfacesNode: classOrInterface");
        //console.log(classOrInterface)
        let class_or_interface_node = classes_dict[classOrInterface_key];
        if(!class_or_interface_node){
            class_or_interface_node = {
                id: classOrInterface_key,
                label: classOrInterface_name,
                color: "lightblue",
                field_ids: {},
                method_ids: {},
            }
            classes_dict[class_or_interface_node.id] = class_or_interface_node;
        }
        return class_or_interface_node;
    }

    function getRawMethodNode(method_key: string, method_name: string, methods_dict: any){
        let method_node = methods_dict[method_key];
        if(!method_node){
            method_node = {
                id: method_key,
                label: method_name,
                color: "green",
                parameter_ids: {},
            }
            methods_dict[method_node.id] = method_node;
        }
        return method_node;
    }

    function getRawParameterNode(parameter_key: string, parameter_name: string, parameters_dict: any){
        let parameter_node = parameters_dict[parameter_key];
        if(!parameter_node){
            parameter_node = {
                id: parameter_key,
                label: parameter_name,
                color: "yellow",
                related_to: {},
            }
            parameters_dict[parameter_node.id] = parameter_node;
        }
        return parameter_node;
    }

    function getRawFieldNode(field_key: string, field_name: string, fields_dict: any){
        let field_node = fields_dict[field_key];
        if(!field_node){
            field_node = {
                id: field_key,
                label: field_name,
                color: "orange",
                related_to: {},
            }
            fields_dict[field_node.id] = field_node;
        }
        return field_node;
    }

    function createRawLinkBetweenParameterOrFieldNodes(field_node: any, related_to_field_node: any){
        field_node.related_to[related_to_field_node.id] = related_to_field_node.id;
        related_to_field_node.related_to[field_node.id] = field_node.id;
    }

    function initNodesForDataClumpData(dataClumpHolder: DataClumpTypeContext, dataClumpData: DataClumpsParameterFromContext, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict){
        let file_path = dataClumpHolder.file_path;
        let file_node = getRawFileNode(file_path, files_dict);

        let data_clump_type = dataClumpHolder.data_clump_type;
        if(data_clump_type==="parameter_data_clump"){
            //console.log("parameter_data_clump")
            //console.log(dataClumpData);

            let parameter_key = dataClumpData.key;
            let parameter_name = dataClumpData.name;

            let method_key = dataClumpHolder.method_key+"";
            let method_name = dataClumpHolder.method_name+"";

            let classOrInterfaceKey = dataClumpHolder.class_or_interface_key;
            let classOrInterfaceName = dataClumpHolder.class_or_interface_name;

            let class_or_interface_node = getRawClassesOrInterfacesNode(classOrInterfaceKey, classOrInterfaceName, classes_dict);
            file_node.classes_or_interfaces_ids[class_or_interface_node.id] = class_or_interface_node.id;

            let method_node = getRawMethodNode(method_key, method_name, methods_dict);
            class_or_interface_node.method_ids[method_node.id] = method_node.id;

            let parameter_node = getRawParameterNode(parameter_key, parameter_name, parameters_dict);
            method_node.parameter_ids[parameter_node.id] = parameter_node.id;


            let related_to_context = dataClumpData.related_to_context;
            let related_to_parameter_context = related_to_context.parameter;
            let related_to_parameter_key = related_to_parameter_context.key;
            let related_to_parameter_name = related_to_parameter_context.name;
            let related_to_parameter_node = getRawParameterNode(related_to_parameter_key, related_to_parameter_name, parameters_dict);

            createRawLinkBetweenParameterOrFieldNodes(parameter_node, related_to_parameter_node);

            let related_to_method_key = related_to_context.method_key+""
            let related_to_method_name = related_to_context.method_name+"";

            let related_to_method_node = getRawMethodNode(related_to_method_key, related_to_method_name, methods_dict);
            related_to_method_node.parameter_ids[related_to_parameter_node.id] = related_to_parameter_node.id;

            let related_to_class_or_interface_key = related_to_context.class_or_interface_key;
            let related_to_class_or_interface_name = related_to_context.class_or_interface_name;

            let related_to_class_or_interface_node = getRawClassesOrInterfacesNode(related_to_class_or_interface_key, related_to_class_or_interface_name, classes_dict);
            related_to_class_or_interface_node.method_ids[related_to_method_node.id] = related_to_method_node.id;

            let related_to_file_path = related_to_context.file_path;
            let related_to_file_node = getRawFileNode(related_to_file_path, files_dict);

            related_to_file_node.classes_or_interfaces_ids[related_to_class_or_interface_node.id] = related_to_class_or_interface_node.id;
        }
        else if(data_clump_type==="field_data_clump"){

            //console.log("field_data_clump")

            let field_key = dataClumpData.key;
            let field_name = dataClumpData.name;

            let classOrInterfaceKey = dataClumpHolder.class_or_interface_key;
            let classOrInterfaceName = dataClumpHolder.class_or_interface_name;

            let class_or_interface_node = getRawClassesOrInterfacesNode(classOrInterfaceKey, classOrInterfaceName, classes_dict);
            file_node.classes_or_interfaces_ids[class_or_interface_node.id] = class_or_interface_node.id;


            let field_node = getRawFieldNode(field_key, field_name, fields_dict);
            class_or_interface_node.field_ids[field_node.id] = field_node.id;

            let related_to_context = dataClumpData.related_to_context;
            let related_to_field_context = related_to_context.parameter;
            let related_to_field_key = related_to_field_context.key;
            let related_to_field_name = related_to_field_context.name;

            let related_to_field_node = getRawFieldNode(related_to_field_key, related_to_field_name, fields_dict);


            createRawLinkBetweenParameterOrFieldNodes(field_node, related_to_field_node);

            let related_to_class_or_interface_key = related_to_context.class_or_interface_key
            let related_to_class_or_interface_name = related_to_context.class_or_interface_name
            let related_to_class_or_interface_node = getRawClassesOrInterfacesNode(related_to_class_or_interface_key, related_to_class_or_interface_name, classes_dict);
            related_to_class_or_interface_node.field_ids[related_to_field_node.id] = related_to_field_node.id;


            let related_to_file_path = related_to_context.file_path
            let related_to_file_node = getRawFileNode(related_to_file_path, files_dict);
            related_to_file_node.classes_or_interfaces_ids[related_to_class_or_interface_node.id] = related_to_class_or_interface_node.id;
        }
    }



//    const [state, setState] = useState({
    let state = {
        counter: 5,
        graph: getInitialGraphFromDataClumpsDict(dataClumpsDict),
/**        graph: {
            nodes: [
                { id: 1, label: "Node 1", color: "#e04141" },
                { id: 2, label: "Node 2", color: "#e09c41" },
                { id: 3, label: "Node 3", color: "#e0df41" },
                { id: 4, label: "Node 4", color: "#7be041" },
                { id: 5, label: "Node 5", color: "#41e0c9" }
            ],
            edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 }
            ]
        }, */
        events: {
            select: ({ nodes, edges }) => {
                console.log("Selected nodes:");
                console.log(nodes);
                console.log("Selected edges:");
                console.log(edges);
            }
        }
    }
//);
    const { graph, events } = state;

    function renderGraph(){

        const edgesColor = dark_mode ? "#ffffff" : "#000000";

        const options = {
            layout: {
                hierarchical: false,
            },
            edges: {
                color: edgesColor
            },
        };


        const events = {
            select: function(event) {
                var { nodes, edges } = event;
            }
        };
        return (
            <Graph key={JSON.stringify(graph)+JSON.stringify(options)} graph={graph} options={options} events={events} style={{ height: "100%", width: "100%" }} />
        );
    }

    let amountNodes = graph?.nodes?.length || 0;
    let amountEdges = graph?.edges?.length || 0;

    function renderSecureGraph(){
        let largeGraph = amountNodes > 1000;
        if(largeGraph && !showLargeGraph){
            return(
                <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
                    <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}} >
                        <div style={{display: "block"}}>
                            <h1>Graph is very large</h1>
                            <div>Nodes: {amountNodes}</div>
                            <div>Edges: {amountEdges}</div>
                            <h2>{"Select a specific file"}</h2>
                        </div>
                        <div style={{paddingTop: "30px", paddingBottom: "30px"}}>{"or"}</div>
                        <Button
                            className="p-button-danger"
                            icon="pi pi-exclamation-triangle"
                            label={"Show large graph"}
                            onClick={() => {
                                setShowLargeGraph(true);
                            }}/>
                    </div>
                </div>
            )
        } else {
            return renderGraph();
        }
    }

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
            <div style={{height: "100%", width: "100%"}} >
                {renderSecureGraph()}
            </div>
        </div>
    )

}
