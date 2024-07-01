import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private target;
    private reactRoot;
    private host;
    private settings;
    private selectionManager;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private parseSettings;
    private clear;
    private onSettingsChange;
    private onSelect;
}
