import powerbi from "powerbi-visuals-api";
import * as React from "react";
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;
interface CustomComponentProps {
    dataView: DataView;
    settings: {
        theme: string;
        valueFormat: string;
    };
    onThemeChange: (theme: string) => void;
    onValueFormatChange: (valueFormat: string) => void;
    onSelect: (selectionId: ISelectionId) => void;
}
declare const CustomComponent: React.FC<CustomComponentProps>;
export default CustomComponent;
