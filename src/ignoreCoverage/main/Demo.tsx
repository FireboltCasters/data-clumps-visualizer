import React, {FunctionComponent, useEffect, useState} from 'react';
// default style
import {
    useIsDarkModeEnabled,
    useSynchedActiveFileKey,
    useSynchedDataClumpsDict,
    useSynchedModalState,
    useSynchedOpenedFiles,
    useSynchedViewOptions,
    ViewOptionValues,
    ViewPanelValues
} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeCodeActionBarDataClumps} from "../webIDE/WebIdeActionBarDataClumps";
import {WebIdeModalProgress} from "../webIDE/WebIdeModalProgress";
import {WebIdeFileExplorerDropZoneModal} from "../webIDE/WebIdeFileExplorerDropZoneModal";
import {DataClumpsGraph} from "../../api/src";
import {WebIdeFileExplorerDropZone} from "../webIDE/WebIdeFileExplorerDropZone";
import {WebIdeCodeActionBarViews} from "../webIDE/WebIdeActionBarViews";
import {WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {DataClumpsTypeContext} from "data-clumps-type-context";

export interface DemoProps {

}
export const Demo : FunctionComponent<DemoProps> = (props) => {

    const dark_mode = useIsDarkModeEnabled()
    const [from_file_path, setActiveFileKey] = useSynchedActiveFileKey();
    const [modalOptions, setModalOptions] = useSynchedModalState(SynchedStates.modalOptions);
    const [viewOptions, setViewOptions] = useSynchedViewOptions();

    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [loading, setLoading] = useState(false);

    let onAbort = async () => {
        //console.log("Demo: onAbort")
    }

    const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict();

    const [code, setCode] = useState<string>("");


    useEffect(() => {
        document.title = "data-clumps-visualizer api Demo"
    }, [])


    async function generateAstCallback(message, index, total): Promise<void> {
        let content = `${index}/${total}: ${message}`;
        let isEveryHundreds = index % 10 === 0;
        let firstAndSecond = index === 0 || index === 1;
        let lastAndPreLast = index === total - 1 || index === total - 2;
        if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
            modalOptions.content = content;
            modalOptions.visible = true;
            setModalOptions(modalOptions);
            await sleep(0); // Allow the UI to update before the next message is set
        }
    }

    async function sleep(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }


    function renderActionBar(){
        return(
            <div style={{width: "100%"}}>
                <WebIdeCodeActionBarDataClumps key={"1"} loadDataClumpsDict={loadDataClumpsDict} />
            </div>
        )
    }

    async function loadDataClumpsDict(newProject: DataClumpsTypeContext){
        console.log("loadDataClumpsDict")
        setLoading(true);
        modalOptions.visible = true;
        modalOptions.content = "Loading project...";
        setModalOptions(modalOptions);
//        ProjectHolder.project = newProject;
        //console.log("getTreeFromSoftwareProject")
        setOpenedFiles([]);
        setActiveFileKey(null);
        modalOptions.visible = false;
        modalOptions.content = "";
        setModalOptions(modalOptions);
        setLoading(false);
        setDataClumpsDict({})
        setDataClumpsDict(newProject);
    }

    function renderPanel(panel: string){
        let content: any = null;

        let selectedViewOption = viewOptions[panel];


        if(selectedViewOption === ViewOptionValues.explorerFile){
            content = (
                <WebIdeFileExplorer
                    key={JSON.stringify(dataClumpsDict)+from_file_path}
                    dataClumpsDict={dataClumpsDict}
                />
            )
        }


        if(selectedViewOption === ViewOptionValues.dataClumpsGraph){
            content = (
                <DataClumpsGraph
                    key={JSON.stringify(dataClumpsDict)+from_file_path}
                    from_file_path={from_file_path}
                    dataClumpsDict={dataClumpsDict}
                    dark_mode={dark_mode}
                />
            )
        }

        return(
            <>
                <div style={{backgroundColor: 'transparent'}}>
                    <WebIdeCodeActionBarViews panel={panel} />
                </div>
                <div style={{backgroundColor: 'transparent', flex: '1'}}>
                    {content}
                </div>
            </>
        )
    }

    const actionBar = renderActionBar();

    return (
        <div className={"p-splitter"} style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
            <WebIdeFileExplorerDropZone loadDataClumpsDict={loadDataClumpsDict}>
            <WebIdeLayout
                menuBarItems={actionBar}
                panelInitialSizes={[10, 90]}
            >
                <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {renderPanel(ViewPanelValues.leftPanel)}
                </div>
                <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {renderPanel(ViewPanelValues.rightPanel)}
                </div>
            </WebIdeLayout>
            </WebIdeFileExplorerDropZone>
            <WebIdeModalProgress onAbort={onAbort} />
            <WebIdeFileExplorerDropZoneModal loadDataClumpsDict={loadDataClumpsDict} />
        </div>
    );
}
