(this.webpackJsonpreact_app=this.webpackJsonpreact_app||[]).push([[0],[,,,,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var s=a(0),c=a(1),l=a.n(c),n=a(4),i=a.n(n),r=(a(10),a(2));a(11);function j(){return Object(s.jsxs)("nav",{className:"navbar navbar-expand-sm bg-dark navbar-dark bg-color-indigo header-height m-0",children:[Object(s.jsx)("a",{className:"navbar-brand",href:"#",children:"WebArm"}),Object(s.jsxs)("ul",{className:"navbar-nav",children:[Object(s.jsx)("li",{className:"nav-item",children:Object(s.jsx)("a",{className:"nav-link",href:"#",children:"\u041f\u0440\u0435\u0434\u043f\u0440\u0438\u044f\u0442\u0438\u0435"})}),Object(s.jsx)("li",{className:"nav-item",children:Object(s.jsx)("a",{className:"nav-link",href:"#",children:"\u041e\u0431\u044c\u0435\u043a\u0442\u044b"})}),Object(s.jsx)("li",{className:"nav-item",children:Object(s.jsx)("a",{className:"nav-link",href:"#",children:"\u041a\u0430\u0431\u0438\u043d\u0435\u0442"})})]}),Object(s.jsx)("ul",{className:"navbar-nav ml-auto",children:Object(s.jsx)("li",{className:"nav-item ml-auto",children:Object(s.jsx)("a",{className:"nav-link",href:"#",children:"\u0412\u043e\u0439\u0442\u0438"})})})]})}function d(){return Object(s.jsx)("div",{className:"col-2 m-0 p-0",children:Object(s.jsx)("div",{className:"bg-dark bg-color-pale-indigo p-3 h-100",children:Object(s.jsxs)("div",{className:"nav flex-column nav-pills ",id:"v-pills-tab",role:"tablist","aria-orientation":"vertical",children:[Object(s.jsx)("a",{className:"nav-link active",id:"v-pills-home-tab","data-toggle":"pill",href:"#v-pills-home",role:"tab","aria-controls":"v-pills-home","aria-selected":"true",children:"\u041e\u0431\u0437\u043e\u0440"}),Object(s.jsx)("a",{className:"nav-link",id:"v-pills-profile-tab","data-toggle":"pill",href:"#v-pills-profile",role:"tab","aria-controls":"v-pills-profile","aria-selected":"false",children:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438"}),Object(s.jsx)("a",{className:"nav-link",id:"v-pills-messages-tab","data-toggle":"pill",href:"#v-pills-messages",role:"tab","aria-controls":"v-pills-messages","aria-selected":"false",children:"\u0413\u0440\u0430\u0444\u0438\u043a\u0438"}),Object(s.jsx)("a",{className:"nav-link",id:"v-pills-settings-tab","data-toggle":"pill",href:"#v-pills-settings",role:"tab","aria-controls":"v-pills-settings","aria-selected":"false",children:"\u0416\u0443\u0440\u043d\u0430\u043b"})]})})})}a(12);function b(){return Object(s.jsxs)("div",{className:"lds-ellipsis",children:[Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{})]})}var h=function(e){var t=e.tag,a=e.index;return Object(s.jsxs)("tr",{children:[Object(s.jsxs)("td",{children:[" ",a+1," "]}),Object(s.jsxs)("td",{children:[" ",t.code," "]}),Object(s.jsxs)("td",{children:[" ",t.name," "]}),Object(s.jsxs)("td",{children:[" ",t.value," "]})]})};var o=function(e){return Object(s.jsx)("div",{children:Object(s.jsx)("div",{className:"table-responsive",children:Object(s.jsxs)("table",{className:"table table-striped table-sm",children:[Object(s.jsx)("thead",{children:Object(s.jsxs)("tr",{children:[Object(s.jsx)("td",{children:"\u2116"}),Object(s.jsx)("td",{children:"\u041a\u043e\u0434 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430"}),Object(s.jsx)("td",{children:"\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430"}),Object(s.jsx)("td",{children:"\u0422\u0435\u043a\u0443\u0449\u0435\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435"})]})}),Object(s.jsx)("tbody",{children:e.tags.map((function(e,t){return Object(s.jsx)(h,{tag:e,index:t},e.code)}))})]})})})},v="http://bfcloud.space/";var O=function(){var e=l.a.useState([]),t=Object(r.a)(e,2),a=t[0],n=t[1],i=l.a.useState(""),h=Object(r.a)(i,2),O=h[0],x=h[1],m=l.a.useState(!0),u=Object(r.a)(m,2),p=u[0],f=u[1];return Object(c.useEffect)((function(){fetch(v+"api/v1/device").then((function(e){return e.json()})).then((function(e){x(e.name)}))}),[]),Object(c.useEffect)((function(){fetch(v+"api/v1/device/current-values").then((function(e){return e.json()})).then((function(e){setTimeout((function(){n(e),f(!1)}),2e3)}))}),[]),Object(s.jsxs)(l.a.Fragment,{children:[Object(s.jsx)(j,{}),Object(s.jsxs)("div",{className:"row m-0 p-0",children:[Object(s.jsx)(d,{}),Object(s.jsx)("div",{className:"col-10 m-0 p-0",children:Object(s.jsx)("div",{className:"content-height",children:Object(s.jsxs)("div",{className:"p-3",children:[Object(s.jsxs)("p",{children:["\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e: ",Object(s.jsx)("b",{children:O})]}),p?Object(s.jsx)(b,{}):Object(s.jsx)(o,{tags:a})]})})})]})]})},x=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,14)).then((function(t){var a=t.getCLS,s=t.getFID,c=t.getFCP,l=t.getLCP,n=t.getTTFB;a(e),s(e),c(e),l(e),n(e)}))};i.a.render(Object(s.jsx)(l.a.StrictMode,{children:Object(s.jsx)(O,{})}),document.getElementById("root")),x()}],[[13,1,2]]]);
//# sourceMappingURL=main.dc9228c6.chunk.js.map