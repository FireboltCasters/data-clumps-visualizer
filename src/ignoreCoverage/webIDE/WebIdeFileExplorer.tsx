import React, {FunctionComponent, useState} from 'react';

import {FileTree, FileTreeProps, TreeNode, utils} from '@sinm/react-file-tree';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {
    useSynchedActiveFileKey,
    useSynchedDataClumpsDict,
    useSynchedFileExplorerTree,
} from "../storage/SynchedStateHelper"
import {WebIdeFileExplorerNode} from "./WebIdeFileExplorerNode";
import {DataClumpsTypeContext, DataClumpTypeContext} from "data-clumps-type-context";

// @ts-ignore
export interface WebIdeFileExplorerProps {
    dataClumpsDict: DataClumpsTypeContext | null,
}

export const startUri = "/root";

function getFilePathsFromDataClumpsDict(dataClumpsDict: DataClumpsTypeContext){
    let filePathDict = {};

    let data_clumps = dataClumpsDict.data_clumps;
    let data_clumps_keys = Object.keys(data_clumps);
    for(let data_clump_key of data_clumps_keys){
        let data_clump: DataClumpTypeContext = data_clumps[data_clump_key];
        let from_file_path = data_clump.from_file_path
        filePathDict[from_file_path] = from_file_path;
    }

    let filePaths: string[] = Object.keys(filePathDict);

    return filePaths;
}

function getTreeDictFromSoftwareProject(dataClumpsDict: DataClumpsTypeContext): any{

    let treeAsDict = {
        type: "directory",
        expanded: true,
        uri: startUri,
        children: {}
    }

    let filePaths = getFilePathsFromDataClumpsDict(dataClumpsDict);

    for(let path of filePaths){
        let pathParts = path.split("/");
        let currentDictTree = treeAsDict;
        let currentPath = startUri+"/"+"";
        for(let i = 0; i < pathParts.length; i++){
            let pathPart = pathParts[i];
            currentPath += pathPart;
            if(i === pathParts.length - 1){
                // Last part
                let fileNode: TreeNode = {
                    type: "file",
                    uri: currentPath,
                    children: undefined
                }
                currentDictTree.children[currentPath] = fileNode;
            } else {
                let currentDictTreeChild = currentDictTree.children[currentPath];
                if(!currentDictTreeChild){
                    let directoryNode: TreeNode = {
                        type: "directory",
                        uri: currentPath,
                        // @ts-ignore
                        children: {}
                    }
                    currentDictTree.children[currentPath] = directoryNode;
                    currentDictTreeChild = directoryNode;
                }
                currentPath += "/";
                currentDictTree = currentDictTreeChild;
            }
        }
    }
    return treeAsDict;
}

function getTreeFromTreeDict(treeDict){
    let childrenKeys = Object.keys(treeDict.children);
    let children = [];
    let sortedChildKeysByName = childrenKeys.sort((a, b) => {
        if(a < b){
            return -1;
        } else if(a > b){
            return 1;
        } else {
            return 0;
        }
    });
    let sortedChildKeysByType = sortedChildKeysByName.sort((a, b) => {
        let aType = treeDict.children[a].type;
        let bType = treeDict.children[b].type;
        let isADirectory = aType === "directory";
        let isBDirectory = bType === "directory";
        if(isADirectory && !isBDirectory){
            return -1;
        }
        if(!isADirectory && isBDirectory){
            return 1;
        }
        return 0;
    });

    for(let key of sortedChildKeysByType){
        let child = treeDict.children[key];
        // @ts-ignore
        children.push(child);
        if(child.type === "directory"){
            child.children = getTreeFromTreeDict(child);
        }
    }
    return children;
}

export function getTreeFromSoftwareProject(dataClumpsDict: DataClumpsTypeContext | null): TreeNode{
    const tree: TreeNode = {
        type: "directory",
        uri: startUri,
        expanded: true,
        children: []
    }
    if(!dataClumpsDict){
        return tree;
    }

    let treeDict = getTreeDictFromSoftwareProject(dataClumpsDict);
    tree.children = getTreeFromTreeDict(treeDict);

    return tree;
}

export const WebIdeFileExplorer : FunctionComponent<WebIdeFileExplorerProps> = (props: WebIdeFileExplorerProps) => {

    const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict();
    const [from_file_path, setActiveFile] = useSynchedActiveFileKey();
    const [loading, setLoading] = useState(false);

    const initialTree = getTreeFromSoftwareProject(dataClumpsDict);
    const [tree, setTree] = useSynchedFileExplorerTree(initialTree);
    const [selectedFileInExplorer, setSelectedFileInExplorer] = useState<string>(from_file_path);

    const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
        let fileUri = treeNode.uri;
        let fileUriWithoutStart = fileUri.replace(startUri+"/", "");
        //console.log("fileUriWithoutStart: "+fileUriWithoutStart)


        if(treeNode.type=="directory"){
            // @ts-ignore
            let newTree = utils.assignTreeNode(tree, fileUri, { expanded: !treeNode.expanded });
            setTree(newTree);
        }
        if(treeNode.type=="file"){
            //console.log("selectedFileInExplorer: "+selectedFileInExplorer)

            if(from_file_path===fileUriWithoutStart){
                setActiveFile(null);
            } else {
                if(selectedFileInExplorer==fileUriWithoutStart){
                    setActiveFile(fileUriWithoutStart);
                }
            }
        }
        setSelectedFileInExplorer(fileUriWithoutStart);
    };

    function itemRenderer(treeNode: TreeNode) {
        return <WebIdeFileExplorerNode selectedFileInExplorer={selectedFileInExplorer} treeNode={treeNode} startUri={startUri} />
    }

    if(loading){
        return (
            <div style={{width: "100%", display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}>
                <div style={{display: "inline-block", alignItems: "center", justifyContent: "center"}}>
                    <h1>
                        <div style={{alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
                            <div>{"Loading"}</div>
                            <i className={"pi pi-spin pi-spinner"} style={{fontSize: "40px", display: "inline-block"}} />
                        </div>
                    </h1>
                </div>
            </div>
        )
    }

    let content: any = null;
    if(tree){
        content = <FileTree key={tree} tree={tree} itemRenderer={itemRenderer} onItemClick={toggleExpanded} />
    }

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
                {content}
        </div>
    )
}
