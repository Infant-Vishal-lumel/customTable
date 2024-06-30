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
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: ReactDOM.Root | null = null;
  private host: IVisualHost;
  private settings: any;

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;
    this.host = options.host;
    this.reactRoot = ReactDOM.createRoot(this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options?.dataViews[0];
      this.settings = this.parseSettings(dataView);

      // Pass the entire dataView object and settings to CustomComponent
      const element = React.createElement(CustomComponent, {
        dataView,
        settings: this.settings,
        onThemeChange: this.onThemeChange.bind(this),
        onValueFormatChange: this.onValueFormatChange.bind(this),
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

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] {
    const settings: VisualObjectInstance = {
      objectName: "settings",
      properties: {
        theme: this.settings?.theme,
        valueFormat: this.settings?.valueFormat,
      },
      selector: null,
    };
    return [settings];
  }

  private onThemeChange(newTheme: string) {
    this.settings.theme = newTheme;

    const instance: VisualObjectInstance = {
      objectName: "settings",
      properties: {
        theme: newTheme,
      },
      selector: null,
    };

    const instancesToPersist: powerbi.VisualObjectInstancesToPersist = {
      merge: [instance],
    };

    this.host.persistProperties(instancesToPersist);
  }

  private onValueFormatChange(newValueFormat: string) {
    this.settings.valueFormat = newValueFormat;

    const instance: VisualObjectInstance = {
      objectName: "settings",
      properties: {
        valueFormat: newValueFormat,
      },
      selector: null,
    };

    const instancesToPersist: powerbi.VisualObjectInstancesToPersist = {
      merge: [instance],
    };

    this.host.persistProperties(instancesToPersist);
  }
}
