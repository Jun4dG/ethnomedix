import{r as d,k as m,c as t,a,m as f,q as k,v as w,F as u,l as c,t as r,n as S,o as i,d as B}from"./EK1EP7Wf.js";const _=""+new URL("logo.BdqBrpkG.png",import.meta.url).href,x={class:"container"},y={class:"dropdown-container"},A=["value"],C={key:0,class:"results"},R={__name:"index",setup(D){const p=S(),l=d([{id:1,name:"High Blood Pressure"},{id:2,name:"Heart problems"},{id:3,name:"Cough"},{id:4,name:"Tuberculosis"},{id:5,name:"Fever"},{id:6,name:"Wound"},{id:7,name:"Acid reflux (kabuhi)"},{id:8,name:"Headache"},{id:9,name:"Stomachache"},{id:10,name:"Rheumatoid"},{id:11,name:"Diarrhea"},{id:12,name:"Relapse (bughat)"},{id:13,name:"Irregular Menstruation or Bleeding in Women"},{id:14,name:"Toothache"},{id:15,name:"Mild stroke"},{id:16,name:"Edema"},{id:17,name:"Tonsilitis"},{id:18,name:"Flatulence (panuhot)"},{id:19,name:"Arthritis"},{id:20,name:"Swollen Gums"},{id:21,name:"Urination"},{id:22,name:"Sinusitis"},{id:23,name:"Vertigo"},{id:24,name:"Bruises"},{id:25,name:"Sore throat"},{id:26,name:"Sore eyes"},{id:27,name:"Abdominal Pain"},{id:28,name:"Ulcers"},{id:29,name:"Asthmatic Attack"},{id:30,name:"Anemia"},{id:31,name:"Dysentery"},{id:32,name:"Expel intestinal parasites or worms"}]),s=d(""),v=m(()=>[...l.value].sort((o,e)=>o.name.toLowerCase().localeCompare(e.name.toLowerCase()))),g=m(()=>{const o=l.value.find(e=>e.name===s.value);return o?o.plants:[]}),h=()=>{s.value&&p.push(`/disease/${s.value.toLowerCase()}`)};return(o,e)=>(i(),t("div",x,[e[2]||(e[2]=a("div",{class:"text-img-logo"},[a("img",{src:_,class:"img-logo"})],-1)),e[3]||(e[3]=a("p",{class:"description"}," Recommendation of Ethno-medicinal plants for natural common disease treatment. ",-1)),e[4]||(e[4]=a("h1",{class:"title"},"Search Ailment",-1)),a("div",y,[k(a("select",{"onUpdate:modelValue":e[0]||(e[0]=n=>s.value=n),onChange:h,class:"custom-dropdown"},[e[1]||(e[1]=a("option",{value:"",disabled:""},"Select an ailment...",-1)),(i(!0),t(u,null,c(v.value,n=>(i(),t("option",{key:n.id,value:n.name},r(n.name),9,A))),128))],544),[[w,s.value]])]),s.value?(i(),t("div",C,[a("h2",null,'Recommended Plants for "'+r(s.value)+'"',1),a("ul",null,[(i(!0),t(u,null,c(g.value,n=>(i(),t("li",{key:n.name},[a("strong",null,r(n.name),1),B(" - "+r(n.preparation),1)]))),128))])])):f("",!0)]))}};export{R as default};
