import React, {FunctionComponent, useEffect} from 'react';
import {
    ColorModeOptions,
    useDemoType, useSynchedActiveFileKey,
    useSynchedColorModeOption, useSynchedDataClumpsDict,
    useSynchedFileExplorerTree,
    useSynchedModalState,
    useSynchedViewOptions,
    ViewOptionValues
} from "../storage/SynchedStateHelper";
import {Languages, SoftwareProject} from "data-clumps";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";
import {SynchedStates} from "../storage/SynchedStates";
import {TestCaseBaseClassGroup} from "data-clumps/ignoreCoverage/TestCaseBaseClass";
import {ExampleData} from "../../api/src/ignoreCoverage/exampleData/ExampleData";
import {Screenshot} from "../../api/src/ignoreCoverage/Screenshot";
import {DataClumpsGraph} from "../../api/src";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    loadSoftwareProject: (project: SoftwareProject) => Promise<void>;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const demoType = useDemoType();
    const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict();
    const [from_file_path, setActiveFileKey] = useSynchedActiveFileKey();

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const [colorModeOption, setColorModeOption] = useSynchedColorModeOption();

    const [dropZoneModalOptions, setDropZoneModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);

    useEffect(() => {
        if(demoType==="main"){
            loadDemoProject();
        }

    }, [])

    function loadDemoProject(){
        const demoDataClumpsDict = ExampleData.getArgoUML();
        setDataClumpsDict(demoDataClumpsDict);
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


    function getTestCaseGroupsMenuItems(testCaseGroups: TestCaseBaseClassGroup[]){
        let testCasesItems: any[] = [];
        for(let testCaseGroup of testCaseGroups){
            let testCasesItemsOfGroup: any[] = [];

            let subGroups = testCaseGroup.subGroups;
            if(!!subGroups){
                let subGroupsItems = getTestCaseGroupsMenuItems(subGroups);
                testCasesItemsOfGroup.push(...subGroupsItems);
            }

            let testCases = testCaseGroup.testCases
            for(let testCase of testCases){
                let testCaseProject = testCase.getSoftwareProject()
                let testCaseName = testCase.getName();
                let testCaseItem = {
                    label: testCaseName,
                    icon:'pi pi-fw',
                    command: async () => {
                        //console.log("load test case", testCaseName)
                        //console.log("testCaseProject")
                        //console.log(testCaseProject)
                        await props.loadSoftwareProject(testCaseProject)
                    }
                }
                testCasesItemsOfGroup.push(testCaseItem);
            }

            let testCaseItem = {
                label: testCaseGroup.name,
                icon:'pi pi-fw',
                items: testCasesItemsOfGroup
            }

            testCasesItems.push(testCaseItem);
        }
        return testCasesItems;
    }

    function renderTestCasesMenuItems(){
        let languages = Languages.getLanguages();
        let items: any[] = [];
        for(let language of languages){
            let identifier = language.getIdentifier();
            //console.log("identifier", identifier)



            let positiveTestCases = language.getPositiveTestCasesGroupsDataClumps();
            let testCasePositiveItem = {
                label: "Positives",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(positiveTestCases)
            }

            let negativeTestCases = language.getNegativeTestCasesCasesDataClumps();
            let testCaseNegativeItem = {
                label: "Negatives",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(negativeTestCases)
            }

            let unknownTestCases = language.getUnknownTestCasesCasesDataClumps();
            let testCaseUnknownItem = {
                label: "Unknowns",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(unknownTestCases)
            }

            let testCasesDataClumps = {
                label: "Data-Clumps",
                icon:'pi pi-fw',
                items: [
                    testCasePositiveItem,
                    testCaseNegativeItem,
                    testCaseUnknownItem
                ]
            }

            let parserTestCasesGroups = language.getTestCasesGroupsParser();
            let testCasesParser = {
                label: "Parser",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(parserTestCasesGroups)
            }

            items.push({
                label: identifier,
                icon:'pi pi-fw',
                items: [
                    testCasesDataClumps,
                    testCasesParser
                ]
            });
        }
        return items;
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
                    label:'Test Cases',
                    icon:'pi pi-fw pi-book',
                    items: renderTestCasesMenuItems()
                },
            ]
        },
        {
            label:'Screenshot',
            icon:'pi pi-fw pi-image',
            command: () => {
                Screenshot.screenshot(
                    <DataClumpsGraph
                        key={JSON.stringify(dataClumpsDict)+from_file_path}
                        from_file_path={from_file_path}
                        dataClumpsDict={dataClumpsDict}
                        dark_mode={false}
                    />
                )
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
