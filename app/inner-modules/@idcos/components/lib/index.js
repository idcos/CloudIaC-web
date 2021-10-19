"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),a=require("@ant-design/icons");require("antd/es/config-provider/style"),require("antd/es/config-provider"),require("antd/es/typography/style");var t=require("antd/es/typography");require("antd/es/locale/zh_CN"),require("antd/es/space/style");var r=require("antd/es/space");require("antd/es/button/style");var n=require("antd/es/button");require("antd/es/select/style");var o=require("antd/es/select");require("antd/es/input/style");var l=require("antd/es/input");require("antd/es/tag/style");var i=require("antd/es/tag");require("antd/es/tooltip/style");var _=require("antd/es/tooltip"),c=require("react-dom");require("antd/es/time-picker/style");var u=require("antd/es/time-picker");require("antd/es/date-picker/style");var s=require("antd/es/date-picker");function d(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var f=d(e),h=d(t),g=d(r),p=d(n),m=d(o),v=d(l),y=d(i),b=d(_),P=d(c),S=d(u),x=d(s),C=function(e,a){return(C=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,a){e.__proto__=a}||function(e,a){for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])})(e,a)};var w=function(){return(w=Object.assign||function(e){for(var a,t=1,r=arguments.length;t<r;t++)for(var n in a=arguments[t])Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n]);return e}).apply(this,arguments)};function E(e,a){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&a.indexOf(r)<0&&(t[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)a.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(t[r[n]]=e[r[n]])}return t}function N(e,a){void 0===a&&(a={});var t=a.insertAt;if(e&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===t&&r.firstChild?r.insertBefore(n,r.firstChild):r.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}var V={page:"PageLayout_page__2dDCq",page__header:"PageLayout_page__header__2L4g1",page__header__breadcrumb:"PageLayout_page__header__breadcrumb__3mk3A",page__header__main:"PageLayout_page__header__main__3qrtS",page__header__main__left:"PageLayout_page__header__main__left__17T8j",page__header__main__left__icon:"PageLayout_page__header__main__left__icon__1vH3J",page__header__main__left__title:"PageLayout_page__header__main__left__title__19wyW",page__header__main__right:"PageLayout_page__header__main__right__6pbkv",page__header__footer__tabs:"PageLayout_page__header__footer__tabs__32wxQ",page__body:"PageLayout_page__body__wXtPP",page__footer:"PageLayout_page__footer__3-NF4"};function k(){return(k=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var t,r=arguments[a];for(t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])}return e}).apply(this,arguments)}N(".PageLayout_page__2dDCq{height:100%;overflow:hidden;width:100%}.PageLayout_page__2dDCq,.PageLayout_page__header__2L4g1{display:flex;flex-direction:column}.PageLayout_page__header__breadcrumb__3mk3A{padding:10px 16px}.PageLayout_page__header__main__3qrtS{align-items:center;display:flex;height:48px;justify-content:space-between;padding:0 16px}.PageLayout_page__header__main__left__17T8j{align-items:center;display:flex;flex-flow:row wrap}.PageLayout_page__header__main__left__icon__1vH3J,.PageLayout_page__header__main__left__title__19wyW{color:rgba(0,0,0,.86);font-size:18px;font-weight:500;margin-right:10px}.PageLayout_page__header__main__right__6pbkv{align-items:center;display:flex}.PageLayout_page__header__footer__tabs__32wxQ .ant-tabs .ant-tabs-nav{margin:0}.PageLayout_page__header__footer__tabs__32wxQ .ant-tabs .ant-tabs-nav .ant-tabs-nav-list{margin-left:16px}.PageLayout_page__body__wXtPP{background-color:#edeff2;flex:1;min-height:0;overflow-y:auto;padding:16px;position:relative}.PageLayout_page__body__wXtPP .ant-form-item-control-input-content{word-break:break-all}.PageLayout_page__footer__3-NF4{align-items:center;border-top:1px solid #ebebeb;display:flex;height:48px}");var O,L=O||(O={});L.Pop="POP",L.Push="PUSH",L.Replace="REPLACE";var T="production"!==process.env.NODE_ENV?function(e){return Object.freeze(e)}:function(e){return e};function R(e){e.preventDefault(),e.returnValue=""}function j(){var e=[];return{get length(){return e.length},push:function(a){return e.push(a),function(){e=e.filter((function(e){return e!==a}))}},call:function(a){e.forEach((function(e){return e&&e(a)}))}}}var q=function(e){function a(){var e=l.location,a=i.state||{};return[a.idx,T({pathname:e.pathname,search:e.search,hash:e.hash,state:a.usr||null,key:a.key||"default"})]}function t(e){if("string"==typeof e)var a=e;else{a=e.pathname;var t=e.search;a=(void 0===a?"/":a)+(void 0===t?"":t)+(void 0===(e=e.hash)?"":e)}return a}function r(e,a){void 0===a&&(a=null);var t=k,r=s;if("string"==typeof e){var n={};if(e){var o=e.indexOf("#");0<=o&&(n.hash=e.substr(o),e=e.substr(0,o)),0<=(o=e.indexOf("?"))&&(n.search=e.substr(o),e=e.substr(0,o)),e&&(n.pathname=e)}e=n}return T(t({},r,e,{state:a,key:Math.random().toString(36).substr(2,8)}))}function n(e){c=e,e=a(),u=e[0],s=e[1],d.call({action:c,location:s})}function o(e){i.go(e)}void 0===e&&(e={});var l=void 0===(e=e.window)?document.defaultView:e,i=l.history,_=null;l.addEventListener("popstate",(function(){if(_)f.call(_),_=null;else{var e=O.Pop,t=a(),r=t[0];if(t=t[1],f.length)if(null!=r){var l=u-r;l&&(_={action:e,location:t,retry:function(){o(-1*l)}},o(l))}else"production"!==process.env.NODE_ENV&&function(e,a){if(!e){"undefined"!=typeof console&&console.warn(a);try{throw Error(a)}catch(e){}}}(!1,"You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");else n(e)}}));var c=O.Pop,u=(e=a())[0],s=e[1],d=j(),f=j();return null==u&&(u=0,i.replaceState(k({},i.state,{idx:u}),"")),{get action(){return c},get location(){return s},createHref:t,push:function e(a,o){var _=O.Push,c=r(a,o);if(!f.length||(f.call({action:_,location:c,retry:function(){e(a,o)}}),0)){var s=[{usr:c.state,key:c.key,idx:u+1},t(c)];c=s[0],s=s[1];try{i.pushState(c,"",s)}catch(e){l.location.assign(s)}n(_)}},replace:function e(a,o){var l=O.Replace,_=r(a,o);f.length&&(f.call({action:l,location:_,retry:function(){e(a,o)}}),1)||(_=[{usr:_.state,key:_.key,idx:u},t(_)],i.replaceState(_[0],"",_[1]),n(l))},go:o,back:function(){o(-1)},forward:function(){o(1)},listen:function(e){return d.push(e)},block:function(e){var a=f.push(e);return 1===f.length&&l.addEventListener("beforeunload",R),function(){a(),f.length||l.removeEventListener("beforeunload",R)}}}}();h.default.Title,h.default.Paragraph;var F,A=function(){},B=function(e){return null==e||""===e||function(e){return Array.prototype.isPrototypeOf(e)}(e)&&0===e.length||function(e){return Object.prototype.isPrototypeOf(e)}(e)&&0===Object.keys(e).length},D=function(e,a,t){for(var r=0;e&&r<a.length;)e=e[a[r++]];return void 0===e?t:e},H=function(e,a){var t={};return Object.keys(e).forEach((function(r){t[r]="string"==typeof a?(e[r]||{})[a]:a(e[r],r)})),t},I={exports:{}};F=I,function(){var e={}.hasOwnProperty;function a(){for(var t=[],r=0;r<arguments.length;r++){var n=arguments[r];if(n){var o=typeof n;if("string"===o||"number"===o)t.push(n);else if(Array.isArray(n)){if(n.length){var l=a.apply(null,n);l&&t.push(l)}}else if("object"===o)if(n.toString===Object.prototype.toString)for(var i in n)e.call(n,i)&&n[i]&&t.push(i);else t.push(n.toString())}}return t.join(" ")}F.exports?(a.default=a,F.exports=a):window.classNames=a}();var z=I.exports,W="#F5F5F5",U="#EBEBEB",M="#D6D6D6",Q={primaryColor:"#0ca1bb",primaryHoverColor:"#08bfdf",primaryPressColor:"#038299",primarySelectColor:"#e3fcff",infoColor:"#1360d9",errorColor:"#e63717",successColor:"#18a761",warningColor:"#fab107",white:"#ffffff",black:"#000000",headingColor:"rgba(0,0,0,0.86)",textColor:"rgba(0,0,0,0.66)",textSecondaryColor:"rgba(0,0,0,0.46)",disabledColor:"rgba(0,0,0,0.26)",disabledBg:W,disabledActiveBg:"#E0E0E0",fontWeightRegular:400,fontWeightMedium:500,fontWeightSemibold:600,fontWeightBold:700,fontSize1:"12px",fontSize2:"14px",fontSize3:"16px",fontSize4:"18px",lineHeight:"1.5715",borderRadius:"2px",defaultBorderColor:U,borderColor1:U,borderColor2:M,borderContainer:"1px solid "+U,borderComponent:"1px solid "+M,dividerColor:U,bgComponentColor:"rgb(255,255,255)",bgColorLight:"#FAFAFA",defaultBgColor:W,pageBgColor:"#EDEFF2",itemHoverColor:W,itemSelectColor:U,space1:"8px",space2:"12px",space3:"16px",space4:"24px",space5:"32px",space6:"40px"},G={card:"PageCard_card__3I1Zz",card__header__main:"PageCard_card__header__main__1liiw",card__header__main__left:"PageCard_card__header__main__left__vy6hO",card__header__main__left__flag:"PageCard_card__header__main__left__flag__2Ii5l",card__header__main__left__title:"PageCard_card__header__main__left__title__1JI3p",card__header__tabs:"PageCard_card__header__tabs__cBtxt",card__body:"PageCard_card__body__1PBnP"};N(".PageCard_card__3I1Zz{background-color:#fff;border-radius:2px;display:flex;flex-direction:column}.PageCard_card__header__main__1liiw{align-items:center;display:flex;justify-content:space-between;margin:16px 16px 0}.PageCard_card__header__main__left__vy6hO{align-items:center;display:flex}.PageCard_card__header__main__left__flag__2Ii5l{background-color:#0ca1bb;display:inline-block;height:18px;margin-right:10px;width:3px}.PageCard_card__header__main__left__title__1JI3p{color:rgba(0,0,0,.86);font-size:16px;font-weight:500;margin-right:10px}.PageCard_card__header__tabs__cBtxt{padding:0 16px;width:100%}.PageCard_card__header__tabs__cBtxt .ant-tabs .ant-tabs-nav{margin:0}.PageCard_card__body__1PBnP{padding:16px}");var J=new Map([["input",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t,n=e.onPageSearch,o=void 0===n?A:n,l=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(v.default,w({allowClear:!0,placeholder:"请输入"+a+"搜索",onChange:function(e){var t=e.target.value;B(t)?r():r({name:a,value:t,showValue:t})},onPressEnter:function(){return o()}},l))}],["select",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t;e.onPageSearch;var n=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(m.default,w({allowClear:!0,placeholder:"请选择"+a+"搜索",onChange:function(e,t){if(B(e))r();else switch(n.mode){case"multiple":r({name:a,value:e,showValue:t.map((function(e){return e.label})).join(" | ")});break;case"tags":r({name:a,value:e,showValue:e.map((function(e,a){return t[a].label||e})).join(" | ")});break;default:r({name:a,value:e,showValue:t.label})}},maxTagCount:"responsive",maxTagTextLength:6,maxTagPlaceholder:function(e){return"+"+e.length}},n))}],["datePicker",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t;e.onPageSearch;var n=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(x.default,w({allowClear:!0,placeholder:"请选择"+a+"搜索",onChange:function(e,t){B(e)?r():r({name:a,value:e,showValue:t})}},n))}],["dateRangePicker",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t;e.onPageSearch;var n=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(x.default.RangePicker,w({allowClear:!0,onChange:function(e,t){B(e)?r():r({name:a,value:e,showValue:t.join(" ~ ")})}},n))}],["timePicker",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t;e.onPageSearch;var n=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(S.default,w({allowClear:!0,placeholder:"请选择"+a+"搜索",onChange:function(e,t){B(e)?r():r({name:a,value:e,showValue:t})}},n))}],["timeRangePicker",function(e){var a=e.name,t=e.onChange,r=void 0===t?A:t;e.onPageSearch;var n=E(e,["name","onChange","onPageSearch"]);return f.default.createElement(S.default.RangePicker,w({allowClear:!0,onChange:function(e,t){B(e)?r():r({name:a,value:e,showValue:t.join(" ~ ")})}},n))}]]),K=function(e){var a=e.code,t=e.name,r=e.fieldType,n=void 0===r?"input":r,o=e.value,l=e.style,i=e.onChange,_=void 0===i?A:i,c=e.onSearch,u=void 0===c?A:c,s=e.fieldProps,d=J.get(n);return f.default.createElement(d,w({name:t,style:l,value:o,onChange:function(e){var t;return _(((t={})[a]=e,t))},onPageSearch:u},s))},X="PageSearch_page_search__1w0Lu",Y="PageSearch_page_search_code_switch__2OqHo",Z="PageSearch_page_search_trigger__ckUaQ",$="PageSearch_search_result__3KDNt",ee="PageSearch_search_result_tag__23fPp",ae="PageSearch_search_result_clearbtn__KrO4N";N(".PageSearch_page_search__1w0Lu{display:flex!important}.PageSearch_page_search_code_switch__2OqHo{text-align:left}.PageSearch_page_search_trigger__ckUaQ{flex:0 0 32px}.PageSearch_search_result__3KDNt{display:flex;flex-wrap:wrap;gap:8px}.PageSearch_search_result_tag__23fPp{word-wrap:break-word;margin:0;max-width:100%;overflow:hidden;white-space:pre-wrap;word-break:break-all}.PageSearch_search_result_clearbtn__KrO4N{display:inline-block;vertical-align:top}");var te=function(e){var a=w({},e);return Object.keys(a).forEach((function(e){B(a[e])&&delete a[e]})),a},re=[{name:"关键词",code:"keyword"}],ne=e.forwardRef((function(t,r){var n=t.conditionList,o=void 0===n?re:n,l=t.width,i=void 0===l?o.length>1?360:240:l,_=t.mode,c=void 0===_?o.length>1?"multiple":"simple":_,u=t.conditionTypeFieldWidthRatio,s=void 0===u?o.length>1?.333:0:u,d=t.onChange,h=void 0===d?A:d,g=t.onSearch,S=void 0===g?A:g,x=t.getSearchResultTagsContainer,C=void 0===x?A:x,N=t.defaultSearchValues,V=void 0===N?{}:N,k=t.initialTriggerSearch,O=void 0!==k&&k,L=t.className,T=t.style,R=E(t,["conditionList","width","mode","conditionTypeFieldWidthRatio","onChange","onSearch","getSearchResultTagsContainer","defaultSearchValues","initialTriggerSearch","className","style"]),j=e.useState(o[0].code),q=j[0],F=j[1],B=e.useState(V),I=B[0],W=B[1];e.useEffect((function(){oe(V,O)}),[]),e.useEffect((function(){o.find((function(e){return e.code===q}))||F(o[0].code)}),[o]),e.useEffect((function(){h(H(I,"value"),I)}),[I]);var U=e.useMemo((function(){return o.find((function(e){return e.code===q}))}),[o,q]),M=function(e){var a=o.find((function(a){return a.code===e}));a&&F(a.code)},G=function(e){W((function(a){var t="multiple"===c?w(w({},a),e):e;return te(t)}))},J=function(e,a){void 0===a&&(a=!0);var t=te(e);W(t),oe(t,a)},ne=function(){return J({})},oe=function(e,a){var t;void 0===a&&(a=!0),"simple"===c&&(e=e[q]?((t={})[q]=e[q],t):{},G(e)),le(e),a&&S(H(e,"value"),e)},le=function(e){var a=C();if(a){var t=Object.keys(e),r=t.length>0?f.default.createElement("div",{className:$},t.map((function(a){return f.default.createElement(b.default,{title:"点击修改筛选条件",key:a,placement:"bottom"},f.default.createElement(y.default,{className:ee,closable:!0,onClose:function(e){return function(e,a){e.preventDefault(),W((function(e){var t=w({},e);return delete t[a],oe(t),t}))}(e,a)}},f.default.createElement("span",{onClick:function(){return M(a)}},D(e,[a,"name"]),"：",D(e,[a,"showValue"]))))})),f.default.createElement("a",{className:ae,onClick:ne},"清空")):f.default.createElement(f.default.Fragment,null);P.default.render(r,a)}};return e.useImperativeHandle(r,(function(){return{setSearchValues:J}})),f.default.createElement(v.default.Group,w({className:z(X,L),style:w(w({},T),{width:i}),compact:!0},R),o.length<=1?null:f.default.createElement(m.default,{value:q,className:Y,style:{flex:"0 0 calc(100% * "+s+")"},onChange:M},o.map((function(e){var a=e.code,t=e.name;return f.default.createElement(m.default.Option,{key:a,value:a},t)}))),f.default.createElement(K,w({style:{flex:1,minWidth:0},onChange:G,onSearch:function(){return oe(I)},value:D(I,[q,"value"])},U)),f.default.createElement(p.default,{className:Z,onClick:function(){return oe(I)},icon:f.default.createElement(a.SearchOutlined,{style:{color:Q.textSecondaryColor}})}))})),oe=function(a){var t=a.defaultSearchValues,r=void 0===t?{}:t,n=a.onChange,o=void 0===n?A:n,l=a.onSearch,i=void 0===l?A:l,_=E(a,["defaultSearchValues","onChange","onSearch"]),c=e.useRef(null),u=e.useRef(),s=e.useState({hasSearchValues:Object.keys(r).length>0,searchValues:r,values:H(r,"value")}),d=s[0],f=s[1],h=e.useState({searchFormValues:r,formValues:H(r,"value")}),g=h[0],p=h[1];return[w({defaultSearchValues:r,onChange:function(){for(var e=[],a=0;a<arguments.length;a++)e[a]=arguments[a];var t=e[0],r=e[1];p({formValues:t,searchFormValues:r}),o.apply(void 0,e)},onSearch:function(){for(var e=[],a=0;a<arguments.length;a++)e[a]=arguments[a];var t=e[0],r=e[1];f({hasSearchValues:Object.keys(r).length>0,values:t,searchValues:r}),i.apply(void 0,e)},ref:u,getSearchResultTagsContainer:function(){return c.current}},_),w(w(w({},g),d),{setSearchValues:function(){for(var e,a=[],t=0;t<arguments.length;t++)a[t]=arguments[t];(e=u.current).setSearchValues.apply(e,a)},searchResultTagsContainerRef:c})]},le={hasSearchValues:Symbol("hasSearchValues"),searchValues:Symbol("searchValues"),values:Symbol("values"),searchFormValues:Symbol("searchFormValues"),formValues:Symbol("formValues"),inputName:Symbol("pageSearchInput"),outputName:Symbol("pageSearchOutput")},ie={toolbar_main:"PageToolbar_toolbar_main__2WGvI",toolbar_main_main_left:"PageToolbar_toolbar_main_main_left__11qvw"};N(".PageToolbar_toolbar_main__2WGvI{align-items:center;display:flex;justify-content:space-between;padding:0 16px}.PageToolbar_toolbar_main_main_left__11qvw{align-items:center;display:flex;flex-flow:row wrap}");exports.DEFAULT_CONDITION_LIST=re,exports.DEFAULT_FIELD_TYPE="input",exports.DEFAULT_RANGE_CHAR=" ~ ",exports.DEFAULT_SPLIT_CHAR=" | ",exports.PageCard=function(e){var a=e.title,t=e.extra,r=e.tabHeader,n=e.children,o=e.extraTitle,l=e.noFlag,i=void 0!==l&&l,_=e.className,c=E(e,["title","extra","tabHeader","children","extraTitle","noFlag","className"]);return f.default.createElement("div",w({className:z(G.card,_)},c),(a||t||r)&&f.default.createElement("div",{className:G.card__header},a&&f.default.createElement("div",{className:G.card__header__main},f.default.createElement("div",{className:G.card__header__main__left},!i&&f.default.createElement("span",{className:G.card__header__main__left__flag}),f.default.createElement("div",{className:G.card__header__main__left__title},a),o&&f.default.createElement("div",{className:G.card__header__main__left__extraTitle},o)),t&&f.default.createElement("div",{className:G.card__header__main__extra},t)),r&&f.default.createElement("div",{className:G.card__header__tabs},r)),f.default.createElement("div",{className:G.card__body},n))},exports.PageLayout=function(e){var t=e.title,r=e.extraTitle,n=e.extraHeader,o=e.onBack,l=e.children,i=e.contentStyle,_=e.footer,c=e.footerStyle,u=e.tabHeader,s=e.contentId,d=e.breadcrumb,h=e.className,g=E(e,["title","extraTitle","extraHeader","onBack","children","contentStyle","footer","footerStyle","tabHeader","contentId","breadcrumb","className"]);return f.default.createElement("div",w({className:z(V.page,h)},g),f.default.createElement("div",{className:V.page__header,style:{borderBottom:u?"":""+Q.borderContainer}},d&&f.default.createElement("div",{className:V.page__header__breadcrumb},d),!(null==t)&&f.default.createElement("div",{className:V.page__header__main},f.default.createElement("div",{className:V.page__header__main__left},o&&f.default.createElement(a.ArrowLeftOutlined,{className:V.page__header__main__left__icon,onClick:function(){"function"==typeof o?o():q.back()}}),f.default.createElement("div",{className:V.page__header__main__left__title},t),r&&f.default.createElement("div",null,r)),n&&f.default.createElement("div",{className:V.page__header__main__right},n)),u&&f.default.createElement("div",{className:V.page__header__footer},f.default.createElement("div",{className:V.page__header__footer__tabs},u))),f.default.createElement("div",{className:V.page__body,style:i,id:s},l),_&&f.default.createElement("div",{className:V.page__footer,style:c},_))},exports.PageSearch=ne,exports.PageToolbar=function(e){var a=e.pageSearch,t=e.mainActions,r=oe(a||{}),n=r[0],o=r[1].searchResultTagsContainerRef;return f.default.createElement("div",{className:ie.toolbar},f.default.createElement(g.default,{direction:"vertical",size:"middle",style:{width:"100%"}},f.default.createElement("div",{className:ie.toolbar_header},"toolbar_header"),f.default.createElement("div",{className:ie.toolbar_main},f.default.createElement("div",{className:ie.toolbar_main_left},f.default.createElement(g.default,{size:"middle"},t,a?f.default.createElement(ne,w({},n)):null)),f.default.createElement("div",{className:ie.toolbar_main_right})),f.default.createElement("div",{className:ie.toolbar_footer,ref:o})))},exports.SYMBOL_CONSTANT=le,exports.filterEmptyPropValue=te,exports.usePageSearch=oe,exports.withPageSearch=function(e){return function(e){function a(a){var t,r=e.call(this,a)||this;r.__withPageSearch_searchResultTagsContainerRef=null,r.__withPageSearch_searchRef=null,r.__withPageSearch_onChange=function(){for(var a,t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var o=t[0],l=t[1],i=(e.prototype[le.inputName]||{}).onChange,_=void 0===i?A:i;r.setState(((a={})[le.formValues]=o,a[le.searchFormValues]=l,a)),_.apply(void 0,t)},r.__withPageSearch_onSearch=function(){for(var a,t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var o=t[0],l=t[1],i=(e.prototype[le.inputName]||{}).onSearch,_=void 0===i?A:i;r.setState(((a={})[le.hasSearchValues]=Object.keys(l).length>0,a[le.values]=o,a[le.searchValues]=l,a)),_.apply(void 0,t)},r.__withPageSearch_setSearchValues=function(){for(var e,a=[],t=0;t<arguments.length;t++)a[t]=arguments[t];r.__withPageSearch_searchRef&&(e=r.__withPageSearch_searchRef).setSearchValues.apply(e,a)};var n=(e.prototype[le.inputName]||{}).defaultSearchValues,o=void 0===n?{}:n;return r.state=w(w({},r.state),((t={})[le.hasSearchValues]=Object.keys(o).length>0,t[le.searchValues]=o,t[le.values]=H(o,"value"),t[le.searchFormValues]=o,t[le.formValues]=H(o,"value"),t)),r}return function(e,a){if("function"!=typeof a&&null!==a)throw new TypeError("Class extends value "+String(a)+" is not a constructor or null");function t(){this.constructor=e}C(e,a),e.prototype=null===a?Object.create(a):(t.prototype=a.prototype,new t)}(a,e),Object.defineProperty(a.prototype,le.outputName,{get:function(){var a=this;return[w(w({},e.prototype[le.inputName]),{onChange:this.__withPageSearch_onChange,onSearch:this.__withPageSearch_onSearch,ref:function(e){return a.__withPageSearch_searchRef=e},getSearchResultTagsContainer:function(){return a.__withPageSearch_searchResultTagsContainerRef}}),{hasSearchValues:this.state[le.hasSearchValues],searchValues:this.state[le.searchValues],values:this.state[le.values],searchFormValues:this.state[le.searchFormValues],formValues:this.state[le.formValues],setSearchValues:this.__withPageSearch_setSearchValues,searchResultTagsContainerRef:function(e){return a.__withPageSearch_searchResultTagsContainerRef=e}}]},enumerable:!1,configurable:!0}),a.prototype.render=function(){return e.prototype.render.call(this)},a}(e)};
//# sourceMappingURL=index.js.map
