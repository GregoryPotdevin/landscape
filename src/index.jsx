import "searchkit/theming/theme.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app";
import {FormBuilder} from "./form-builder";
import {Landscape} from "./landscape";

if (__AC_MODE === "form-builder"){
  ReactDOM.render((
    <FormBuilder pageId={PageBuilderData.pageId}/>
  ), document.getElementById('root'));
} else if(__AC_MODE === "landscape"){
  ReactDOM.render((
    <Landscape />
  ), document.getElementById('root'));
} else {
  ReactDOM.render((
    <App pageId={PageBuilderData.pageId}/>
  ), document.getElementById('root'));
}
