import{m as c,k as v,a as x,s as g,t as d,i as u,b as h}from"./web-Kpt9dW4_.js";import{u as C,h as _,i as $,j as f}from"./routing-CpSsQdcE.js";var y=d("<a>");function m(t){t=c({inactiveClass:"inactive",activeClass:"active"},t);const[,a]=v(t,["href","state","class","activeClass","inactiveClass","end"]),r=C(()=>t.href),e=_(r),l=$(),o=x(()=>{const s=r();if(s===void 0)return[!1,!1];const n=f(s.split(/[?#]/,1)[0]).toLowerCase(),i=f(l.pathname).toLowerCase();return[t.end?n===i:i.startsWith(n+"/")||i===n,n===i]});return(()=>{var s=y();return g(s,c(a,{get href(){return e()||t.href},get state(){return JSON.stringify(t.state)},get classList(){return{...t.class&&{[t.class]:!0},[t.inactiveClass]:!o()[0],[t.activeClass]:o()[0],...a.classList}},link:"",get"aria-current"(){return o()[1]?"page":void 0}}),!1,!1),s})()}var b=d('<main class="text-center mx-auto text-gray-700 p-4"><h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Not Found</h1><p class=mt-8>Visit <a href=https://solidjs.com target=_blank class="text-sky-600 hover:underline">solidjs.com</a> to learn how to build Solid apps.</p><p class=my-4> - ');function P(){return(()=>{var t=b(),a=t.firstChild,r=a.nextSibling,e=r.nextSibling,l=e.firstChild;return u(e,h(m,{href:"/",class:"text-sky-600 hover:underline",children:"Home"}),l),u(e,h(m,{href:"/about",class:"text-sky-600 hover:underline",children:"About Page"}),null),t})()}export{P as default};