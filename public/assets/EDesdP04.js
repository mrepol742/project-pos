/**
 * © 2025 Melvin Jones Repol. All rights reserved.
 * This project is licensed under the MIT License with Commons Clause.
*/
import"./QC5vPiN9.js";const o=o=>{const t=new Date,r=new Date(o),a=Math.floor((t-r)/1e3);if(a<60)return`${a} sec${1!==a?"s":""} ago`;const n=Math.floor(a/60);if(n<60)return`${n} min${1!==n?"s":""} ago`;const s=Math.floor(n/60);if(s<24)return`${s} hr${1!==s?"s":""} ago`;const e=Math.floor(s/24);if(e<30)return`${e} day${1!==e?"s":""} ago`;const $=Math.floor(e/30);if($<12)return`${$} month${1!==$?"s":""} ago`;const f=Math.floor($/12);return`${f} year${1!==f?"s":""} ago`};export{o as t};
