(function(root){
 'use strict';
 const actions={overtime:{value:10,reputation:12,sanity:-6,information:0,label:'Stay overtime'},coffee:{value:-7,reputation:0,sanity:12,information:0,label:'Get coffee'},files:{value:-2,reputation:0,sanity:-3,information:12,label:'Access restricted files'}};
 function fresh(){return {step:0,day:0,action:null,person:null,assignments:{},reason:null,opened:false,seen:[],revisited:false};}
 function calculate(s){const a=actions[s.action]||{value:0,reputation:0,sanity:0,information:0};return {value:55+a.value,reputation:30+a.reputation,sanity:60+a.sanity,information:10+a.information};}
 function choose(s,key){if(!actions[key])return false;s.revisited=!!s.action&&s.action!==key;s.action=key;return true;}
 function assign(s,word,person){if(!['SMART','CHARMING','GLOOMY'].includes(word)||!['Alex','Kyle','Greg'].includes(person))return false;s.assignments[word]=person;return true;}
 function completed(s){return Object.keys(s.assignments).length===3;}
 const api={actions,fresh,calculate,choose,assign,completed};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ShiftModel=api;
})(typeof window!=='undefined'?window:globalThis);
