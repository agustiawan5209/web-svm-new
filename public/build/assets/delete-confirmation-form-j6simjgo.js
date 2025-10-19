import{c as r}from"./proxy-BlWtMGlG.js";import{r as u,m as x,j as e}from"./app-FfUhyKxF.js";import{B as t}from"./button-BoBOppD_.js";import{D as g,a as y,b as j,c as f,f as k,d as D}from"./dialog-CN1z3bbi.js";import{L as v}from"./loader-circle-BWgdIM74.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],E=r("SquarePen",b);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],S=r("Trash2",C),L=({url:n,title:i,id:c})=>{const[l,a]=u.useState(!1),{delete:d,processing:s}=x(),p=()=>{c&&d(n,{preserveState:!0,onSuccess:()=>{o()},onError:m=>{console.error(m)}})},h=()=>a(!0),o=()=>a(!1);return e.jsxs(g,{open:l,onOpenChange:a,children:[e.jsxs(y,{children:[e.jsx(j,{children:e.jsx(f,{children:i})}),e.jsx(k,{children:"Apakah Anda yakin ingin menghapus data ini?"}),e.jsxs(D,{children:[e.jsx(t,{variant:"destructive",onClick:o,disabled:s,children:"Batal"}),e.jsxs(t,{type:"button",variant:"default",onClick:p,disabled:s,children:[s&&e.jsx(v,{className:"h-4 w-4 animate-spin"}),"Hapus"]})]})]}),e.jsxs(t,{type:"button",variant:"default",onClick:h,tooltip:"hapus",className:"border border-chart-2 bg-chart-2",children:[" ",e.jsx(S,{})," "]})]})};export{L as D,E as S};
