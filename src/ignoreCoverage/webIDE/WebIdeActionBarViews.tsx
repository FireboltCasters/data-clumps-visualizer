import React, {FunctionComponent} from 'react';
import {useSynchedViewOptions, ViewOptionValues} from "../storage/SynchedStateHelper";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    panel: string
}

export const WebIdeCodeActionBarViews : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const panel = props.panel
    const selectedViewOption = viewOptions[panel];

    const dictLabel = {
        [ViewOptionValues.dataClumpsGraph]: "Data-Clumps Graph",
        [ViewOptionValues.dataClumpsDictionary]: "Data-Clumps Dictionary",
        [ViewOptionValues.fileAst]: "File AST",
        [ViewOptionValues.fileContent]: "File Content",
        [ViewOptionValues.explorerFile]: "FileExplorer",
        [ViewOptionValues.explorerDataClumpsJSON]: "Data-Clumps FileLevel JSON",
        [ViewOptionValues.explorerDataClumpsCSV]: "Data-Clumps FileLevel CSV",
        [ViewOptionValues.classOrInterfaceDictionary]: "Class/Interface Dictionary",
        [ViewOptionValues.methodsDictionary]: "Methods Dictionary",
    }

    function getViewOptionItem(viewOptionValue){
        let active = selectedViewOption === viewOptionValue

        return {
            label: dictLabel[viewOptionValue],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = viewOptionValue
                setViewOptions({...viewOptions})
            }
        }
    }

    const selectedLabel = dictLabel[selectedViewOption]

    const items = [
        {
            label: selectedLabel,
            icon:'pi pi-fw pi-user',
            items: [
                getViewOptionItem(ViewOptionValues.dataClumpsDictionary),
                getViewOptionItem(ViewOptionValues.dataClumpsGraph),
            ]
        }
    ];

    return(
        <WebIdeCodeActionBar startComponent={<div>{"View: "}</div>} items={items} />
    )

}
