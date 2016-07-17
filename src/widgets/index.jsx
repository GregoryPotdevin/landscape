import React from "react"

export * from "./BaseWidgets"
export * from "./LayoutWidgets"
export * from "./DataList"
export * from "./Widget"
export * from "./SearchWidget"
export * from "./Calendar"
export * from "../components/Icon"
export * from "../components/Flag"
export * from "../components/Youtube"

import { Text, Title, Image, Separator, DateWidget, IconWidget } from './BaseWidgets'
import { Flag, YoutubeWidget, FilePreview, PDFViewer, DocumentPageWidget, Progress, Tags } from '../components'
import { SearchWidget } from './SearchWidget'
import { SearchProfileWidget } from './SearchProfileWidget'
import { Calendar } from './Calendar'
import { Section, Columns } from './LayoutWidgets'
import { DataList } from './DataList'
import { TabsWidget } from './TabWidget'

// window.fetchJsonp = fetchJsonp

function WIP(name, icon){
  return {
    component: (props) => <div>Coming soon !</div>,
    icon,
    label: name,
    fields: [
    ],
    defaultValue: {
      $type: name
    }
  }
}

const Fields = {
  boxShadowLevel: {name: "boxShadowLevel", type: "number", min: 0, max: 5, defaultValue: 1},
  padding: {name: "padding", type: "number", min: 0, max: 50, defaultValue: 8},
  borderRadius: {name: "borderRadius", type: "number", min: 0, max: 50, defaultValue: 0},
  width: {name: "width", type: "number", min: 0, max: 300, defaultValue: 500},
  color: {name: "color", type: "color", defaultValue: "rgb(75, 75, 75)"},
  backgroundColor: {name: "backgroundColor", type: "color", defaultValue: "white"},
}

export const widgets = {
  "Page": {
    component: Section,
    icon: "file-o",
    label: "Page",
    hidden: true,
    fields: [
      Fields.backgroundColor,
      {name: "children", type: "componentList"}
    ],
    defaultValue: {
      $type: "Page",
      className: "pb-page",
      children: []
    }
  },
  "Section": {
    component: Section,
    icon: "square-o",
    label: "Section",
    fields: [
      Fields.padding,
      Fields.boxShadowLevel,
      Fields.backgroundColor,
      {name: "children", type: "componentList"}
    ],
    defaultValue: {
      $type: "Section",
      className: "pb-section",
      children: []
    }
  },
  "Column": {
    component: Section,
    icon: "columns",
    label: "Column",
    hidden: true,
    fields: [
      Fields.width,
      {name: "verticalCenter", type: "bool"},
      Fields.padding,
      Fields.boxShadowLevel,
      Fields.backgroundColor,
      {name: "children", type: "componentList"}
    ],
    defaultValue: {
      $type: "Column",
      className: "pb-section pb-column",
      children: []
    }
  },
  "Columns": {
    component: Columns,
    icon: "columns",
    label: "Columns",
    fields: [
      Fields.padding,
      Fields.boxShadowLevel,
      {name: "children", type: "componentList"}
    ],
    defaultValue: {
      $type: "Columns",
      className: "pb-columns",
      children: [
        {
          $type: "Column",
          className: "pb-column",
          children: []
        },{
          $type: "Column",
          className: "pb-column",
          children: []
        }
      ],
    }
  },
  "DataList": {
    component: DataList,
    icon: "list",
    label: "Data List",
    fields: [
      {name: "url", type: "url", required: true},
      {name: "maxCount", type: "number", min: 1, max: 20},
      {name: "gridSize", type: "number", min: 1, max: 6},
      {name: "itemPadding", type: "number", min: 0, max: 50, defaultValue: 4},
      {name: "displayMode", type: "toggle", required: true, options: [
        {value: "grid", icon: "th", label: "Grid"},
        {value: "columns", icon: "pause", label: "Columns"},
      ]},
      Fields.padding,
      // Fields.backgroundColor,
    ],
    defaultValue: {
      $type: "DataList",
      url: "https://api.flickr.com/services/feeds/photos_public.gne?tags=nature&format=json",
      // url: "http://opendata.paris.fr/api/records/1.0/search/?dataset=positions-statutaires-particulieres-detachements-bilan-social",
      maxCount: 4,
      gridSize: 2,
      itemPadding: 4,
      displayMode: 'grid',
      children: [{
        $type: "Section",
        required: true,
        className: "pb-list-item",
        children: []
      }]
    }
  },
  "Tabs": {
    component: TabsWidget,
    icon: "columns",
    label: "Tabs",
    fields: [
      // Fields.padding,
      // Fields.boxShadowLevel,
      // Fields.backgroundColor,
      {name: "tabPosition", type: "select", required: true, options: [
        {value: "top", label: "Top"},
        {value: "left", label: "Left"},
        {value: "right", label: "Right"},
        {value: "bottom", label: "Bottom"},
      ]},
      {name: "children", type: "componentList"}
    ],
    defaultValue: {
      $type: "Tabs",
      className: "pb-section",
      tabPosition: "top",
      children: [
        {
          $type: "Tab",
          title: "Tab 1",
          children: []  
        },
        {
          $type: "Tab",
          title: "Tab 2",
          children: []  
        }
      ]
    }
  },
  "Tab": {
    component: null, // Special component...
    icon: "columns",
    label: "Tab",
    hidden: true,
    fields: [
      {name: "title", type: "string", required: true},
    ],
    defaultValue: {
      $type: "Tab",
      title: "New tab",
      children: []  
    }
  },
  "Table": WIP("Table", "table"),
  "Title": {
    component: Title,
    icon: "header",
    label: "Title",
    fields: [
      {name: "title", type: "string", autoFocus: true, required: true, autoBind: {
        key: "title",
        type: "string"
      }},
      {name: "fontSize", type: "number", min: 8, max: 48, defaultValue: 24},
      {name: "textAlign", type: "toggle", required: true, options: [
        {value: "left", icon: "align-left", label: "Left"},
        {value: "center", icon: "align-center", label: "Center"},
        {value: "right", icon: "align-right", label: "Right"},
      ]},
      Fields.color,
    ],
    defaultValue: {
      $type: "Title",
      title: "Title to replace",
      textAlign: 'left'
    }
  },
  "Text": {
    component: Text,
    icon: "font",
    label: "Text",
    fields: [
      {name: "text", type: "string", autoFocus: true, required: true},
      {name: "fontSize", type: "number", min: 8, max: 32, defaultValue: 14},
      {name: "textAlign", type: "toggle", required: true, options: [
        {value: "left", icon: "align-left", label: "Left"},
        {value: "center", icon: "align-center", label: "Center"},
        {value: "right", icon: "align-right", label: "Right"},
      ]},
      // {name: "singleLine", type: "bool"},
      Fields.color,
    ],
    defaultValue: {
      $type: "Text",
      text: "Text to replace",
      textAlign: "left",
    }
  },
  "Date": {
    component: DateWidget,
    icon: "clock-o",
    label: "Date",
    fields: [
      {name: "date", type: "string", required: true, autoBind: {
        type: "date"
      }},
      {name: "dateFormat", type: "select", required: true, options: [
        {value: "datetime", label: "Full Date"},
        {value: "date",     label: "Date"},
        {value: "relative", label: "Relative Date"},
      ]},
      {name: "fontSize", type: "number", min: 8, max: 32, defaultValue: 14},
      {name: "textAlign", type: "toggle", required: true, options: [
        {value: "left", icon: "align-left", label: "Left"},
        {value: "center", icon: "align-center", label: "Center"},
        {value: "right", icon: "align-right", label: "Right"},
      ]},
      Fields.color,
    ],
    defaultValue: {
      $type: "Date",
      date: "2016-01-01T00:00:00",
      dateFormat: "full",
      textAlign: "left",
    }
  },
  "Quote": WIP("Quote", "quote-left"),
  "Separator": {
    component: Separator,
    icon: "ellipsis-h",
    label: "Separator",
    fields: [
      {name: "type", type: "select", required: true, options: [
        {value: "spacing", label: "Spacing"},
        {value: "single", label: "Single line"},
        {value: "double", label: "Double line"},
      ]},
      {name: "icon", type: "string"},
      Fields.color,
    ],
    defaultValue: {
      $type: "Separator",
      "type": "single",
      "borderColor": "#CCC"
    }
  },
  "Checklist": WIP("Checklist", "list"),
  "Icon": {
    component: IconWidget,
    icon: "arrows",
    label: "Icon",
    fields: [
      {name: "name", type: "icon", required: true},
      {name: "fontSize", type: "number", min: 8, max: 100, defaultValue: 14},
      Fields.color,
      {name: "spin", type: "bool"},
      {name: "border", type: "bool"},
    ],
    defaultValue: {
      $type: "Icon",
      name: "thumbs-o-up",
      color: "rgb(75, 75, 75)",
    }
  },
  "Flag": {
    component: Flag,
    icon: "flag",
    label: "Flag",
    fields: [
      {name: "country", type: "string", autoFocus: true, required: true},
    ],
    defaultValue: {
      $type: "Flag",
      country: "France"
    }
  },
  "Tags": {
    component: Tags,
    icon: "tags",
    label: "Tags",
    fields: [
      {name: "tags", type: "string", required: true, autoBind: {
        key: "tags"
      }},
      {name: "separator", type: "string"},
      {name: "maxCount", type: "number", min: 1, max: 20, defaultValue: 10},
    ],
    defaultValue: {
      $type: "Tags",
      tags: "tag1, tag2",
      separator: ","
    }
  },
  "Progress": {
    component: Progress,
    icon: "circle-o-notch",
    label: "Progress",
    fields: [
      {name: "value", type: "number", required: true, min: 0, max: 100},
      {name: "shape", type: "select", required: true, options: [
        {value: "line", label: "Line"},
        {value: "circle", label: "Circle"},
      ]},
      {name: "showValue", type: "bool"},
      {name: "fontSize", type: "number", min: 8, max: 100, defaultValue: 48},
      Fields.width,
      {name: "strokeWidth", type: "number", required: true, min: 1, max: 20, defaultValue: 2},
      {name: "strokeColor", type: "color", defaultValue: 'rgb(66, 165, 245)'},
      // {name: "min", type: "number", defaultValue: 0},
      // {name: "max", type: "number", defaultValue: 100},
    ],
    defaultValue: {
      $type: "Progress",
      value: 50,
      strokeWidth: 4,
    }
  },
  "Button": WIP("Button", "square-o"),
  "FAQ": WIP("FAQ", "question"),
  "Image": {
    component: Image,
    icon: "image",
    label: "Image",
    fields: [
      {name: "url", type: "url", required: true, autoBind: {
        type: "image"
      }},
      {name: "shape", type: "select", required: true, options: [
        {value: "normal", label: "Normal"},
        {value: "circle", label: "Circle"},
        {value: "square", label: "Square"},
      ]},
      Fields.borderRadius,
    ],
    defaultValue: {
      $type: "Image",
      url: "http://www.appcraft.fr/img/team/gregory.png",
      shape: "normal"
    }
  },
  "Audio": WIP("Audio", "music"),
  "Video": WIP("Video", "play"),
  "Youtube": {
    component: YoutubeWidget,
    icon: "youtube",
    label: "Youtube",
    fields: [
      {name: "video", type: "string", required: true},
    ],
    defaultValue: {
      $type: "Youtube",
      video: "https://www.youtube.com/watch?v=lEr9cPpuAx8"
    }
  },
  "Calendar": {
    component: Calendar,
    icon: "calendar",
    label: "Calendar",
    fields: [
    ],
    defaultValue: {
      $type: "Calendar",
    }
  },
  "RSS": WIP("RSS", "rss"),
  "Document": {
    component: DocumentPageWidget,
    icon: "file-o",
    label: "Document",
    fields: [
      {name: "documentId", type: "string", required: true},
    ],
    defaultValue: {
      $type: "Document",
      documentId: 152,
    }
  },
  "PDF": {
    component: PDFViewer,
    icon: "file-pdf-o",
    label: "PDF",
    fields: [
    ],
    defaultValue: {
      $type: "PDF",
      fileId: 156,
    }
  },
  "FilePreview": {
    component: FilePreview,
    icon: "file-o",
    label: "File Preview",
    fields: [
      {name: "height", type: "number", required: true, min: 100, max: 300},
    ],
    defaultValue: {
      $type: "FilePreview",
      src: "http://localhost:3030/api/file/156/preview",
      pageCount: 410,
      height: 150
    }
  },
  "SearchMovies": {
    component: SearchWidget,
    icon: "search",
    label: "Search Movies",
    fields: [
      {name: "types", type: "bool"},
      {name: "countries", type: "bool"},
      {name: "actors", type: "bool"},
      {name: "writers", type: "bool"},
    ],
    defaultValue: {
      $type: "SearchMovies",
      types: true,
    }
  },
  "SearchProfiles": {
    component: SearchProfileWidget,
    icon: "search",
    label: "Search Profiles",
    fields: [
      {name: "sex", type: "bool"},
      {name: "eyeColor", type: "bool"},
      {name: "hairColor", type: "bool"},
      {name: "heightFilter", type: "bool"},
    ],
    defaultValue: {
      $type: "SearchProfiles",
      sex: true,
    }
  },
}
