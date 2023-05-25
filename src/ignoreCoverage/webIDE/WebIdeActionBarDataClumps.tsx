import React, {FunctionComponent, useEffect} from 'react';
import {
    ColorModeOptions,
    useDemoType,
    useSynchedColorModeOption,
    useSynchedModalState,
    useSynchedViewOptions,
    ViewOptionValues
} from "../storage/SynchedStateHelper";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";
import {SynchedStates} from "../storage/SynchedStates";
import {ExampleData} from "../../api/src/ignoreCoverage/exampleData/ExampleData";
import {DataClumpsTypeContext} from "data-clumps-type-context";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    loadDataClumpsDict: (project: DataClumpsTypeContext | any) => Promise<void>;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const demoType = useDemoType();

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const [colorModeOption, setColorModeOption] = useSynchedColorModeOption();

    const [dropZoneModalOptions, setDropZoneModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);

    useEffect(() => {
        if(demoType==="main"){
            loadDemoProject();
        }

    }, [])

    async function loadDemoProject(){
        //let demoDataClumpsDict = ExampleData.getArgoUML();
        let demoDataClumpsDict = ExampleData.getTestData();
        props.loadDataClumpsDict(demoDataClumpsDict)
    }

    function getViewOptionItemEditorHighlightFieldAndParameters(){
        let active = viewOptions.editor === ViewOptionValues.decorationFieldAndParameters

        return {
            label:'Highlight suitable Field and Parameters',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions.editor = ViewOptionValues.decorationFieldAndParameters
                setViewOptions({...viewOptions})
            }
        }
    }

    function renderColorModeItem(){
        let items: any[] = [];
        let colorModeOptionKeys = Object.keys(ColorModeOptions);
        for(let colorModeOptionKey of colorModeOptionKeys){
            let label = ""+ColorModeOptions[colorModeOptionKey]
            let active = colorModeOptionKey === colorModeOption;
            items.push({
                label: label,
                disabled: active,
                icon: active ? "pi pi-check": "",
                command: () => {
                    setColorModeOption(label);
                }
            })
        }

        return {
            label: "ColorMode: "+colorModeOption,
            icon: "pi pi-sun",
            items: items
        }
    }

    const items = [
        {
            label:'File',
            icon:'pi pi-fw pi-file',
            items:[
                {
                    label:'Open',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        dropZoneModalOptions.visible = true;
                        setDropZoneModalOptions({...dropZoneModalOptions});
                    }
                },
                {
                    separator:true
                },
                {
                    label:'Test Cases (TODO)',
                    icon:'pi pi-fw pi-book',
                    disabled: true
                },
            ]
        },
        {
            label:'Test',
            icon:'pi pi-fw pi-cog',
            command: () => {
                loadDemoProject()
            }
        },
        {
            label:'Extra',
            icon:'pi pi-fw pi-cog',
            items:[
                {
                    label:'Console (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
                renderColorModeItem(),
            ]
        },
        {
            label:'All right reserved 2023 (C)',
            icon: <div style={{marginRight: "8px"}}>{"§"}</div>,
            items:[
                {
                    label: "Nils Baumgartner",
                    icon: "pi pi-fw pi-user",
                    url: "https://nilsbaumgartner.de"
                },
                {
                    label:'GitHub project',
                    icon:'pi pi-fw pi-github',
                    url: "https://github.com/FireboltCasters/data-clumps-visualizer"
                },
                {
                    label:'Homepage',
                    icon:'pi pi-fw pi-external-link',
                    url: "https://nilsbaumgartner.de"
                },
            ]
        }
    ];

    let remoteLogoUrl = "https://github.com/FireboltCasters/data-clumps-visualizer/raw/master/public/logo.png"
    let localLogoUrl = "./logo.png"
    let logoUrl = remoteLogoUrl;

    let startItem = (
        <div>
            <a href={"https://github.com/FireboltCasters/data-clumps-visualizer"}>
                <img src={logoUrl} style={{height: "40px", marginRight: "8px"}} />
            </a>
        </div>
    )

    return(
        <WebIdeCodeActionBar startComponent={startItem} items={items} />
    )

}
