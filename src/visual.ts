import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import CustomComponent from "./Table/CustomComponent";
import "./../style/visual.less";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: ReactDOM.Root;
  private host: IVisualHost;
  private settings: any;
  private selectionManager: ISelectionManager;

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;
    this.host = options.host;
    this.reactRoot = ReactDOM.createRoot(this.target);
    this.selectionManager = this.host.createSelectionManager();
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options?.dataViews[0];
      this.settings = this.parseSettings(dataView);

      const element = React.createElement(CustomComponent, {
        dataView,
        host: this.host,
        settings: this.settings,
        onPropertyChange: (property, value) => this.onSettingsChange(property, value, this.host),
        selectionManager: this.selectionManager,
      });

      this.reactRoot.render(element);
    } else {
      this.clear();
    }
  }

  private parseSettings(dataView: DataView): any {
    return {
      theme: dataView.metadata.objects?.settings?.theme || "light",
      valueFormat:
        dataView.metadata.objects?.settings?.valueFormat || "default",
    };
  }

  private clear() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }

  private onSettingsChange(propertyName: string, newValue: any, host) {
    console.log(propertyName, newValue)

    const instance: VisualObjectInstance = {
      objectName: "settings",
      properties: {
        [propertyName]: newValue,
      },
      selector: null,
    };

    const instancesToPersist: powerbi.VisualObjectInstancesToPersist = {
      merge: [instance],
    };
    console.log("is setting change", this);
    host.persistProperties(instancesToPersist);
  }
}
