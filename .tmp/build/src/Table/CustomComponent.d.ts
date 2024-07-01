import powerbi from "powerbi-visuals-api";
import * as React from "react";
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
interface CustomComponentProps {
    dataView: DataView;
    settings: {
        theme: string;
        valueFormat: string;
    };
    host: IVisualHost;
    onPropertyChange: (propertyName: string, theme: string) => void;
    selectionManager: ISelectionManager;
}
declare const CustomComponent: React.FC<CustomComponentProps>;
export default CustomComponent;
