const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/_...404_-DwuNMh2_.js","assets/web-Kpt9dW4_.js","assets/routing-CpSsQdcE.js","assets/index-ud0wz0Cw.js","assets/toast-4QDb3iM0.js","assets/index-tGRyxoeP.css"])))=>i.map(i=>d[i]);
import{c as H,a as k,b as m,g as V,u as K,S as z,o as Z,d as G,e as J,f as F,h as X,s as $,m as A,i as j,t as R,l as Y,j as Q,E as ee,r as te}from"./web-Kpt9dW4_.js";import{_ as x,T as ne}from"./toast-4QDb3iM0.js";import{c as re,a as ae,R as oe,s as I,g as ie,b as se,d as le,m as ce,k as ue,e as de,f as fe,n as he}from"./routing-CpSsQdcE.js";const _="Invariant Violation",{setPrototypeOf:me=function(e,t){return e.__proto__=t,e}}=Object;class L extends Error{framesToPop=1;name=_;constructor(t=_){super(typeof t=="number"?`${_}: ${t} (see https://github.com/apollographql/invariant-packages)`:t),me(this,L.prototype)}}function S(e,t){if(!e)throw new L(t)}const pe=/^[A-Za-z]:\//;function ge(e=""){return e&&e.replace(/\\/g,"/").replace(pe,t=>t.toUpperCase())}const we=/^[/\\]{2}/,be=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,ye=/^[A-Za-z]:$/,Ee=function(e){if(e.length===0)return".";e=ge(e);const t=e.match(we),n=C(e),r=e[e.length-1]==="/";return e=Re(e,!n),e.length===0?n?"/":r?"./":".":(r&&(e+="/"),ye.test(e)&&(e+="/"),t?n?`//${e}`:`//./${e}`:n&&!C(e)?`/${e}`:e)},B=function(...e){if(e.length===0)return".";let t;for(const n of e)n&&n.length>0&&(t===void 0?t=n:t+=`/${n}`);return t===void 0?".":Ee(t.replace(/\/\/+/g,"/"))};function Re(e,t){let n="",r=0,a=-1,o=0,l=null;for(let i=0;i<=e.length;++i){if(i<e.length)l=e[i];else{if(l==="/")break;l="/"}if(l==="/"){if(!(a===i-1||o===1))if(o===2){if(n.length<2||r!==2||n[n.length-1]!=="."||n[n.length-2]!=="."){if(n.length>2){const f=n.lastIndexOf("/");f===-1?(n="",r=0):(n=n.slice(0,f),r=n.length-1-n.lastIndexOf("/")),a=i,o=0;continue}else if(n.length>0){n="",r=0,a=i,o=0;continue}}t&&(n+=n.length>0?"/..":"..",r=2)}else n.length>0?n+=`/${e.slice(a+1,i)}`:n=e.slice(a+1,i),r=i-a-1;a=i,o=0}else l==="."&&o!==-1?++o:o=-1}return n}const C=function(e){return be.test(e)};function ve(e){return`virtual:${e}`}function $e(e){return e.handler?.endsWith(".html")?C(e.handler)?e.handler:B(e.root,e.handler):`$vinxi/handler/${e.name}`}const Ae=new Proxy({},{get(e,t){return S(typeof t=="string","Bundler name should be a string"),{name:t,type:"client",handler:ve($e({name:t})),baseURL:"/backtesting-playground/_build",chunks:new Proxy({},{get(n,r){S(typeof r=="string","Chunk expected");let a=B("/backtesting-playground/_build",r+".mjs");return{import(){return import(a)},output:{path:a}}}}),inputs:new Proxy({},{get(n,r){S(typeof r=="string","Input must be string");let a=window.manifest[r].output;return{async import(){return import(a)},async assets(){return window.manifest[r].assets},output:{path:a}}}})}}});globalThis.MANIFEST=Ae;const ke=e=>t=>{const{base:n}=t,r=H(()=>t.children),a=k(()=>re(r(),t.base||""));let o;const l=ae(e,a,()=>o,{base:n,singleFlight:t.singleFlight,transformUrl:t.transformUrl});return e.create&&e.create(l),m(oe.Provider,{value:l,get children(){return m(_e,{routerState:l,get root(){return t.root},get load(){return t.rootLoad},get children(){return[k(()=>(o=V())&&null),m(Se,{routerState:l,get branches(){return a()}})]}})}})};function _e(e){const t=e.routerState.location,n=e.routerState.params,r=k(()=>e.load&&K(()=>{I(!0),e.load({params:n,location:t,intent:ie()||"initial"}),I(!1)}));return m(z,{get when(){return e.root},keyed:!0,get fallback(){return e.children},children:a=>m(a,{params:n,location:t,get data(){return r()},get children(){return e.children}})})}function Se(e){const t=[];let n;const r=k(Z(e.routerState.matches,(a,o,l)=>{let i=o&&a.length===o.length;const f=[];for(let s=0,p=a.length;s<p;s++){const g=o&&o[s],w=a[s];l&&g&&w.route.key===g.route.key?f[s]=l[s]:(i=!1,t[s]&&t[s](),G(b=>{t[s]=b,f[s]=se(e.routerState,f[s-1]||e.routerState.base,D(()=>r()[s+1]),()=>e.routerState.matches()[s])}))}return t.splice(a.length).forEach(s=>s()),l&&i?l:(n=f[0],f)}));return D(()=>r()&&n)()}const D=e=>()=>m(z,{get when(){return e()},keyed:!0,children:t=>m(le.Provider,{value:t,get children(){return t.outlet()}})});function Ce([e,t],n,r){return[e,r?a=>t(r(a)):t]}function Le(e){if(e==="#")return null;try{return document.querySelector(e)}catch{return null}}function Pe(e){let t=!1;const n=a=>typeof a=="string"?{value:a}:a,r=Ce(J(n(e.get()),{equals:(a,o)=>a.value===o.value&&a.state===o.state}),void 0,a=>(!t&&e.set(a),a));return e.init&&F(e.init((a=e.get())=>{t=!0,r[1](n(a)),t=!1})),ke({signal:r,create:e.create,utils:e.utils})}function Te(e,t,n){return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function Ne(e,t){const n=Le(`#${e}`);n?n.scrollIntoView():t&&window.scrollTo(0,0)}const xe=new Map;function Ie(e=!0,t=!1,n="/_server",r){return a=>{const o=a.base.path(),l=a.navigatorFactory(a.base);let i={};function f(c){return c.namespaceURI==="http://www.w3.org/2000/svg"}function s(c){if(c.defaultPrevented||c.button!==0||c.metaKey||c.altKey||c.ctrlKey||c.shiftKey)return;const u=c.composedPath().find(N=>N instanceof Node&&N.nodeName.toUpperCase()==="A");if(!u||t&&!u.hasAttribute("link"))return;const h=f(u),d=h?u.href.baseVal:u.href;if((h?u.target.baseVal:u.target)||!d&&!u.hasAttribute("state"))return;const E=(u.getAttribute("rel")||"").split(/\s+/);if(u.hasAttribute("download")||E&&E.includes("external"))return;const v=h?new URL(d,document.baseURI):new URL(d);if(!(v.origin!==window.location.origin||o&&v.pathname&&!v.pathname.toLowerCase().startsWith(o.toLowerCase())))return[u,v]}function p(c){const u=s(c);if(!u)return;const[h,d]=u,T=a.parsePath(d.pathname+d.search+d.hash),E=h.getAttribute("state");c.preventDefault(),l(T,{resolve:!1,replace:h.hasAttribute("replace"),scroll:!h.hasAttribute("noscroll"),state:E&&JSON.parse(E)})}function g(c){const u=s(c);if(!u)return;const[h,d]=u;typeof r=="function"&&(d.pathname=r(d.pathname)),i[d.pathname]||a.preloadRoute(d,{preloadData:h.getAttribute("preload")!=="false"})}function w(c){const u=s(c);if(!u)return;const[h,d]=u;typeof r=="function"&&(d.pathname=r(d.pathname)),!i[d.pathname]&&(i[d.pathname]=setTimeout(()=>{a.preloadRoute(d,{preloadData:h.getAttribute("preload")!=="false"}),delete i[d.pathname]},200))}function b(c){const u=s(c);if(!u)return;const[,h]=u;typeof r=="function"&&(h.pathname=r(h.pathname)),i[h.pathname]&&(clearTimeout(i[h.pathname]),delete i[h.pathname])}function P(c){if(c.defaultPrevented)return;let u=c.submitter&&c.submitter.hasAttribute("formaction")?c.submitter.getAttribute("formaction"):c.target.getAttribute("action");if(!u)return;if(!u.startsWith("https://action/")){const d=new URL(u,ce);if(u=a.parsePath(d.pathname+d.search),!u.startsWith(n))return}if(c.target.method.toUpperCase()!=="POST")throw new Error("Only POST forms are supported for Actions");const h=xe.get(u);if(h){c.preventDefault();const d=new FormData(c.target);c.submitter&&c.submitter.name&&d.append(c.submitter.name,c.submitter.value),h.call({r:a,f:c.target},d)}}X(["click","submit"]),document.addEventListener("click",p),e&&(document.addEventListener("mouseover",w),document.addEventListener("mouseout",b),document.addEventListener("focusin",g),document.addEventListener("touchstart",g)),document.addEventListener("submit",P),F(()=>{document.removeEventListener("click",p),e&&(document.removeEventListener("mouseover",w),document.removeEventListener("mouseout",b),document.removeEventListener("focusin",g),document.removeEventListener("touchstart",g)),document.removeEventListener("submit",P)})}}function De(e){const t=()=>{const r=window.location.pathname+window.location.search;return{value:e.transformUrl?e.transformUrl(r)+window.location.hash:r+window.location.hash,state:window.history.state}},n=fe();return Pe({get:t,set({value:r,replace:a,scroll:o,state:l}){a?window.history.replaceState(ue(l),"",r):window.history.pushState(l,"",r),Ne(decodeURIComponent(window.location.hash.slice(1)),o),de()},init:r=>Te(window,"popstate",he(r,a=>{if(a&&a<0)return!n.confirm(a);{const o=t();return!n.confirm(o.value,{state:o.state})}})),create:Ie(e.preload,e.explicitLinks,e.actionBase,e.transformUrl),utils:{go:r=>window.history.go(r),beforeLeave:n}})(e)}function Oe(e){e.forEach(t=>{if(!t.attrs.href)return;let n=document.head.querySelector(`link[href="${t.attrs.href}"]`);n||(n=document.createElement("link"),n.setAttribute("rel","preload"),n.setAttribute("as","style"),n.setAttribute("href",t.attrs.href),document.head.appendChild(n))})}var Me=R("<style>"),Ue=R("<link>"),ze=R("<script> "),Fe=R("<noscript>");const je={style:e=>(()=>{var t=Me();return $(t,A(()=>e.attrs),!1,!0),j(t,()=>e.children),t})(),link:e=>(()=>{var t=Ue();return $(t,A(()=>e.attrs),!1,!1),t})(),script:e=>e.attrs.src?(()=>{var t=ze();return $(t,A(()=>e.attrs,{get id(){return e.key}}),!1,!0),t})():null,noscript:e=>(()=>{var t=Fe();return $(t,A(()=>e.attrs),!1,!0),t})()};function Be(e,t){let{tag:n,attrs:{key:r,...a}={key:void 0},children:o}=e;return je[n]({attrs:{...a,nonce:t},key:r,children:o})}function We(e,t,n,r="default"){return Y(async()=>{{const o=(await e.import())[r],i=(await t.inputs?.[e.src].assets()).filter(s=>s.tag==="style"||s.attrs.rel==="stylesheet");return typeof window<"u"&&Oe(i),{default:s=>[...i.map(p=>Be(p)),m(o,s)]}}})}const y={NORMAL:0,WILDCARD:1,PLACEHOLDER:2};function qe(e={}){const t={options:e,rootNode:W(),staticRoutesMap:{}},n=r=>e.strictTrailingSlash?r:r.replace(/\/$/,"")||"/";if(e.routes)for(const r in e.routes)O(t,n(r),e.routes[r]);return{ctx:t,lookup:r=>He(t,n(r)),insert:(r,a)=>O(t,n(r),a),remove:r=>Ve(t,n(r))}}function He(e,t){const n=e.staticRoutesMap[t];if(n)return n.data;const r=t.split("/"),a={};let o=!1,l=null,i=e.rootNode,f=null;for(let s=0;s<r.length;s++){const p=r[s];i.wildcardChildNode!==null&&(l=i.wildcardChildNode,f=r.slice(s).join("/"));const g=i.children.get(p);if(g===void 0){if(i&&i.placeholderChildren.length>1){const w=r.length-s;i=i.placeholderChildren.find(b=>b.maxDepth===w)||null}else i=i.placeholderChildren[0]||null;if(!i)break;i.paramName&&(a[i.paramName]=p),o=!0}else i=g}return(i===null||i.data===null)&&l!==null&&(i=l,a[i.paramName||"_"]=f,o=!0),i?o?{...i.data,params:o?a:void 0}:i.data:null}function O(e,t,n){let r=!0;const a=t.split("/");let o=e.rootNode,l=0;const i=[o];for(const f of a){let s;if(s=o.children.get(f))o=s;else{const p=Ke(f);s=W({type:p,parent:o}),o.children.set(f,s),p===y.PLACEHOLDER?(s.paramName=f==="*"?`_${l++}`:f.slice(1),o.placeholderChildren.push(s),r=!1):p===y.WILDCARD&&(o.wildcardChildNode=s,s.paramName=f.slice(3)||"_",r=!1),i.push(s),o=s}}for(const[f,s]of i.entries())s.maxDepth=Math.max(i.length-f,s.maxDepth||0);return o.data=n,r===!0&&(e.staticRoutesMap[t]=o),o}function Ve(e,t){let n=!1;const r=t.split("/");let a=e.rootNode;for(const o of r)if(a=a.children.get(o),!a)return n;if(a.data){const o=r.at(-1)||"";a.data=null,Object.keys(a.children).length===0&&a.parent&&(a.parent.children.delete(o),a.parent.wildcardChildNode=null,a.parent.placeholderChildren=[]),n=!0}return n}function W(e={}){return{type:e.type||y.NORMAL,maxDepth:0,parent:e.parent||null,children:new Map,data:e.data||null,paramName:e.paramName||null,wildcardChildNode:null,placeholderChildren:[]}}function Ke(e){return e.startsWith("**")?y.WILDCARD:e[0]===":"||e==="*"?y.PLACEHOLDER:y.NORMAL}const q=[{page:!0,$component:{src:"src/routes/[...404].tsx?pick=default&pick=$css",build:()=>x(()=>import("./_...404_-DwuNMh2_.js"),__vite__mapDeps([0,1,2])),import:()=>import(globalThis.MANIFEST.client.inputs["src/routes/[...404].tsx?pick=default&pick=$css"].output.path)},path:"/*404",filePath:"/home/dkaczmarczyk/Projects/private/finance/backtesting-playground/src/routes/[...404].tsx"},{page:!0,$component:{src:"src/routes/index.tsx?pick=default&pick=$css",build:()=>x(()=>import("./index-ud0wz0Cw.js"),__vite__mapDeps([3,1,4,5])),import:()=>import(globalThis.MANIFEST.client.inputs["src/routes/index.tsx?pick=default&pick=$css"].output.path)},path:"/",filePath:"/home/dkaczmarczyk/Projects/private/finance/backtesting-playground/src/routes/index.tsx"}],Ze=Ge(q.filter(e=>e.page));function Ge(e){function t(n,r,a,o){const l=Object.values(n).find(i=>a.startsWith(i.id+"/"));return l?(t(l.children||(l.children=[]),r,a.slice(l.id.length)),n):(n.push({...r,id:a,path:a.replace(/\/\([^)/]+\)/g,"").replace(/\([^)/]+\)/g,"")}),n)}return e.sort((n,r)=>n.path.length-r.path.length).reduce((n,r)=>t(n,r,r.path,r.path),[])}function Je(e){return e.$GET||e.$POST||e.$PUT||e.$PATCH||e.$DELETE}qe({routes:q.reduce((e,t)=>{if(!Je(t))return e;let n=t.path.replace(/\/\([^)/]+\)/g,"").replace(/\([^)/]+\)/g,"").replace(/\*([^/]*)/g,(r,a)=>`**:${a}`);if(/:[^/]*\?/g.test(n))throw new Error(`Optional parameters are not supported in API routes: ${n}`);if(e[n])throw new Error(`Duplicate API routes for "${n}" found at "${e[n].route.path}" and "${t.path}"`);return e[n]={route:t},e},{})});function Xe(){function e(n){return{...n,...n.$$route?n.$$route.require().route:void 0,info:{...n.$$route?n.$$route.require().route.info:{},filesystem:!0},component:n.$component&&We(n.$component,globalThis.MANIFEST.client,globalThis.MANIFEST.ssr),children:n.children?n.children.map(e):void 0}}return Ze.map(e)}let M;const Ye=()=>M||(M=Xe());function Qe(){return m(De,{get base(){return"/backtesting-playground"},root:e=>m(Q,{get children(){return e.children}}),get children(){return[m(Ye,{}),m(ne,{})]}})}const et=e=>null;var tt=R("<span style=font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;>");const nt=e=>{const t="Error | Uncaught Client Exception";return m(ee,{fallback:n=>(console.error(n),[(()=>{var r=tt();return j(r,t),r})(),m(et,{code:500})]),get children(){return e.children}})};function U(e){return e.children}function rt(){return m(U,{get children(){return m(U,{get children(){return m(nt,{get children(){return m(Qe,{})}})}})}})}function at(e,t){te(e,t)}at(()=>m(rt,{}),document.getElementById("app"));const lt=void 0;export{lt as default};
