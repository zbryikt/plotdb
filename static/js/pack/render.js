var sched;sched={timeout:{list:[],func:window.setTimeout,set:function(e,t){return this.func.call(null,e,t)}},interval:{list:[],func:window.setInterval,set:function(e,t){return this.func.call(null,e,t)}},clear:function(){var e,t,n,i,a=[];for(e=0,n=(t=this.timeout.list).length;n>e;++e)i=t[e],clearTimeout(i);for(e=0,n=(t=this.interval.list).length;n>e;++e)i=t[e],clearInterval(i);for(e=0,n=(t=this.animateframe.list).length;n>e;++e)i=t[e],a.push(window.cancelAnimationFrame(i));return a},animateframe:{list:[],func:window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,set:function(e){return this.func.call(window,e)}}},window.setTimeout=function(e,t){var n;return n=sched.timeout.set(e,t),sched.timeout.list.push(n),n},window.setInterval=function(e,t){var n;return n=sched.interval.set(e,t),sched.interval.list.push(n),n},window.requestAnimationFrame=function(e){var t;return t=sched.animateframe.set(e),sched.animateframe.list.push(t),t},delete window.mozRequestAnimationFrame,delete window.webkitRequestAnimationFrame,delete window.msRequestAnimationFrame;/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);
!function(){function n(n){return n&&(n.ownerDocument||n.document||n).documentElement}function t(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function e(n,t){return t>n?-1:n>t?1:n>=t?0:NaN}function r(n){return null===n?NaN:+n}function u(n){return!isNaN(n)}function i(n){return{left:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)<0?r=i+1:u=i}return r},right:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)>0?u=i:r=i+1}return r}}}function a(n){return n.length}function o(n){for(var t=1;n*t%1;)t*=10;return t}function l(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function c(){this._=Object.create(null)}function s(n){return(n+="")===xa||n[0]===ba?ba+n:n}function f(n){return(n+="")[0]===ba?n.slice(1):n}function h(n){return s(n)in this._}function g(n){return(n=s(n))in this._&&delete this._[n]}function p(){var n=[];for(var t in this._)n.push(f(t));return n}function v(){var n=0;for(var t in this._)++n;return n}function d(){for(var n in this._)return!1;return!0}function m(){this._=Object.create(null)}function y(n){return n}function M(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function x(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=_a.length;r>e;++e){var u=_a[e]+t;if(u in n)return u}}function b(){}function _(){}function w(n){function t(){for(var t,r=e,u=-1,i=r.length;++u<i;)(t=r[u].on)&&t.apply(this,arguments);return n}var e=[],r=new c;return t.on=function(t,u){var i,a=r.get(t);return arguments.length<2?a&&a.on:(a&&(a.on=null,e=e.slice(0,i=e.indexOf(a)).concat(e.slice(i+1)),r.remove(t)),u&&e.push(r.set(t,{on:u})),n)},t}function S(){oa.event.preventDefault()}function k(){for(var n,t=oa.event;n=t.sourceEvent;)t=n;return t}function N(n){for(var t=new _,e=0,r=arguments.length;++e<r;)t[arguments[e]]=w(t);return t.of=function(e,r){return function(u){try{var i=u.sourceEvent=oa.event;u.target=n,oa.event=u,t[u.type].apply(e,r)}finally{oa.event=i}}},t}function E(n){return Sa(n,Aa),n}function A(n){return"function"==typeof n?n:function(){return ka(n,this)}}function C(n){return"function"==typeof n?n:function(){return Na(n,this)}}function z(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function u(){this.setAttribute(n,t)}function i(){this.setAttributeNS(n.space,n.local,t)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=oa.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?o:a:n.local?i:u}function L(n){return n.trim().replace(/\s+/g," ")}function q(n){return new RegExp("(?:^|\\s+)"+oa.requote(n)+"(?:\\s+|$)","g")}function T(n){return(n+"").trim().split(/^|\s+/)}function R(n,t){function e(){for(var e=-1;++e<u;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<u;)n[e](this,r)}n=T(n).map(D);var u=n.length;return"function"==typeof t?r:e}function D(n){var t=q(n);return function(e,r){if(u=e.classList)return r?u.add(n):u.remove(n);var u=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(u)||e.setAttribute("class",L(u+" "+n))):e.setAttribute("class",L(u.replace(t," ")))}}function P(n,t,e){function r(){this.style.removeProperty(n)}function u(){this.style.setProperty(n,t,e)}function i(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?i:u}function j(n,t){function e(){delete this[n]}function r(){this[n]=t}function u(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?u:r}function U(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e?t.createElementNS(e,n):t.createElement(n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=oa.ns.qualify(n)).local?e:t}function F(){var n=this.parentNode;n&&n.removeChild(this)}function H(n){return{__data__:n}}function O(n){return function(){return Ea(this,n)}}function I(n){return arguments.length||(n=e),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Y(n,t){for(var e=0,r=n.length;r>e;e++)for(var u,i=n[e],a=0,o=i.length;o>a;a++)(u=i[a])&&t(u,a,e);return n}function Z(n){return Sa(n,za),n}function V(n){var t,e;return function(r,u,i){var a,o=n[i].update,l=o.length;for(i!=e&&(e=i,t=0),u>=t&&(t=u+1);!(a=o[t])&&++t<l;);return a}}function X(n,t,e){function r(){var t=this[a];t&&(this.removeEventListener(n,t,t.$),delete this[a])}function u(){var u=l(t,ca(arguments));r.call(this),this.addEventListener(n,this[a]=u,u.$=e),u._=t}function i(){var t,e=new RegExp("^__on([^.]+)"+oa.requote(n)+"$");for(var r in this)if(t=r.match(e)){var u=this[r];this.removeEventListener(t[1],u,u.$),delete this[r]}}var a="__on"+n,o=n.indexOf("."),l=$;o>0&&(n=n.slice(0,o));var c=La.get(n);return c&&(n=c,l=B),o?t?u:r:t?b:i}function $(n,t){return function(e){var r=oa.event;oa.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{oa.event=r}}}function B(n,t){var e=$(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function W(e){var r=".dragsuppress-"+ ++Ta,u="click"+r,i=oa.select(t(e)).on("touchmove"+r,S).on("dragstart"+r,S).on("selectstart"+r,S);if(null==qa&&(qa="onselectstart"in e?!1:x(e.style,"userSelect")),qa){var a=n(e).style,o=a[qa];a[qa]="none"}return function(n){if(i.on(r,null),qa&&(a[qa]=o),n){var t=function(){i.on(u,null)};i.on(u,function(){S(),t()},!0),setTimeout(t,0)}}}function J(n,e){e.changedTouches&&(e=e.changedTouches[0]);var r=n.ownerSVGElement||n;if(r.createSVGPoint){var u=r.createSVGPoint();if(0>Ra){var i=t(n);if(i.scrollX||i.scrollY){r=oa.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var a=r[0][0].getScreenCTM();Ra=!(a.f||a.e),r.remove()}}return Ra?(u.x=e.pageX,u.y=e.pageY):(u.x=e.clientX,u.y=e.clientY),u=u.matrixTransform(n.getScreenCTM().inverse()),[u.x,u.y]}var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}function G(){return oa.event.changedTouches[0].identifier}function K(n){return n>0?1:0>n?-1:0}function Q(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function nn(n){return n>1?0:-1>n?ja:Math.acos(n)}function tn(n){return n>1?Ha:-1>n?-Ha:Math.asin(n)}function en(n){return((n=Math.exp(n))-1/n)/2}function rn(n){return((n=Math.exp(n))+1/n)/2}function un(n){return((n=Math.exp(2*n))-1)/(n+1)}function an(n){return(n=Math.sin(n/2))*n}function on(){}function ln(n,t,e){return this instanceof ln?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof ln?new ln(n.h,n.s,n.l):_n(""+n,wn,ln):new ln(n,t,e)}function cn(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?i+(a-i)*n/60:180>n?a:240>n?i+(a-i)*(240-n)/60:i}function u(n){return Math.round(255*r(n))}var i,a;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,a=.5>=e?e*(1+t):e+t-e*t,i=2*e-a,new yn(u(n+120),u(n),u(n-120))}function sn(n,t,e){return this instanceof sn?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof sn?new sn(n.h,n.c,n.l):n instanceof hn?pn(n.l,n.a,n.b):pn((n=Sn((n=oa.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new sn(n,t,e)}function fn(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new hn(e,Math.cos(n*=Oa)*t,Math.sin(n)*t)}function hn(n,t,e){return this instanceof hn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof hn?new hn(n.l,n.a,n.b):n instanceof sn?fn(n.h,n.c,n.l):Sn((n=yn(n)).r,n.g,n.b):new hn(n,t,e)}function gn(n,t,e){var r=(n+16)/116,u=r+t/500,i=r-e/200;return u=vn(u)*Ka,r=vn(r)*Qa,i=vn(i)*no,new yn(mn(3.2404542*u-1.5371385*r-.4985314*i),mn(-.969266*u+1.8760108*r+.041556*i),mn(.0556434*u-.2040259*r+1.0572252*i))}function pn(n,t,e){return n>0?new sn(Math.atan2(e,t)*Ia,Math.sqrt(t*t+e*e),n):new sn(NaN,NaN,n)}function vn(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function dn(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function mn(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function yn(n,t,e){return this instanceof yn?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof yn?new yn(n.r,n.g,n.b):_n(""+n,yn,cn):new yn(n,t,e)}function Mn(n){return new yn(n>>16,n>>8&255,255&n)}function xn(n){return Mn(n)+""}function bn(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function _n(n,t,e){var r,u,i,a=0,o=0,l=0;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(u=r[2].split(","),r[1]){case"hsl":return e(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(Nn(u[0]),Nn(u[1]),Nn(u[2]))}return(i=ro.get(n))?t(i.r,i.g,i.b):(null==n||"#"!==n.charAt(0)||isNaN(i=parseInt(n.slice(1),16))||(4===n.length?(a=(3840&i)>>4,a=a>>4|a,o=240&i,o=o>>4|o,l=15&i,l=l<<4|l):7===n.length&&(a=(16711680&i)>>16,o=(65280&i)>>8,l=255&i)),t(a,o,l))}function wn(n,t,e){var r,u,i=Math.min(n/=255,t/=255,e/=255),a=Math.max(n,t,e),o=a-i,l=(a+i)/2;return o?(u=.5>l?o/(a+i):o/(2-a-i),r=n==a?(t-e)/o+(e>t?6:0):t==a?(e-n)/o+2:(n-t)/o+4,r*=60):(r=NaN,u=l>0&&1>l?0:r),new ln(r,u,l)}function Sn(n,t,e){n=kn(n),t=kn(t),e=kn(e);var r=dn((.4124564*n+.3575761*t+.1804375*e)/Ka),u=dn((.2126729*n+.7151522*t+.072175*e)/Qa),i=dn((.0193339*n+.119192*t+.9503041*e)/no);return hn(116*u-16,500*(r-u),200*(u-i))}function kn(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function Nn(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function En(n){return"function"==typeof n?n:function(){return n}}function An(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),Cn(t,e,n,r)}}function Cn(n,t,e,r){function u(){var n,t=l.status;if(!t&&Ln(l)||t>=200&&300>t||304===t){try{n=e.call(i,l)}catch(r){return void a.error.call(i,r)}a.load.call(i,n)}else a.error.call(i,l)}var i={},a=oa.dispatch("beforesend","progress","load","error"),o={},l=new XMLHttpRequest,c=null;return!this.XDomainRequest||"withCredentials"in l||!/^(http(s)?:)?\/\//.test(n)||(l=new XDomainRequest),"onload"in l?l.onload=l.onerror=u:l.onreadystatechange=function(){l.readyState>3&&u()},l.onprogress=function(n){var t=oa.event;oa.event=n;try{a.progress.call(i,l)}finally{oa.event=t}},i.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?o[n]:(null==t?delete o[n]:o[n]=t+"",i)},i.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",i):t},i.responseType=function(n){return arguments.length?(c=n,i):c},i.response=function(n){return e=n,i},["get","post"].forEach(function(n){i[n]=function(){return i.send.apply(i,[n].concat(ca(arguments)))}}),i.send=function(e,r,u){if(2===arguments.length&&"function"==typeof r&&(u=r,r=null),l.open(e,n,!0),null==t||"accept"in o||(o.accept=t+",*/*"),l.setRequestHeader)for(var s in o)l.setRequestHeader(s,o[s]);return null!=t&&l.overrideMimeType&&l.overrideMimeType(t),null!=c&&(l.responseType=c),null!=u&&i.on("error",u).on("load",function(n){u(null,n)}),a.beforesend.call(i,l),l.send(null==r?null:r),i},i.abort=function(){return l.abort(),i},oa.rebind(i,a,"on"),null==r?i:i.get(zn(r))}function zn(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Ln(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function qn(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var u=e+t,i={c:n,t:u,n:null};return io?io.n=i:uo=i,io=i,ao||(oo=clearTimeout(oo),ao=1,lo(Tn)),i}function Tn(){var n=Rn(),t=Dn()-n;t>24?(isFinite(t)&&(clearTimeout(oo),oo=setTimeout(Tn,t)),ao=0):(ao=1,lo(Tn))}function Rn(){for(var n=Date.now(),t=uo;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n;return n}function Dn(){for(var n,t=uo,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:uo=t.n;return io=n,e}function Pn(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function jn(n,t){var e=Math.pow(10,3*Ma(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function Un(n){var t=n.decimal,e=n.thousands,r=n.grouping,u=n.currency,i=r&&e?function(n,t){for(var u=n.length,i=[],a=0,o=r[0],l=0;u>0&&o>0&&(l+o+1>t&&(o=Math.max(1,t-l)),i.push(n.substring(u-=o,u+o)),!((l+=o+1)>t));)o=r[a=(a+1)%r.length];return i.reverse().join(e)}:y;return function(n){var e=so.exec(n),r=e[1]||" ",a=e[2]||">",o=e[3]||"-",l=e[4]||"",c=e[5],s=+e[6],f=e[7],h=e[8],g=e[9],p=1,v="",d="",m=!1,y=!0;switch(h&&(h=+h.substring(1)),(c||"0"===r&&"="===a)&&(c=r="0",a="="),g){case"n":f=!0,g="g";break;case"%":p=100,d="%",g="f";break;case"p":p=100,d="%",g="r";break;case"b":case"o":case"x":case"X":"#"===l&&(v="0"+g.toLowerCase());case"c":y=!1;case"d":m=!0,h=0;break;case"s":p=-1,g="r"}"$"===l&&(v=u[0],d=u[1]),"r"!=g||h||(g="g"),null!=h&&("g"==g?h=Math.max(1,Math.min(21,h)):("e"==g||"f"==g)&&(h=Math.max(0,Math.min(20,h)))),g=fo.get(g)||Fn;var M=c&&f;return function(n){var e=d;if(m&&n%1)return"";var u=0>n||0===n&&0>1/n?(n=-n,"-"):"-"===o?"":o;if(0>p){var l=oa.formatPrefix(n,h);n=l.scale(n),e=l.symbol+d}else n*=p;n=g(n,h);var x,b,_=n.lastIndexOf(".");if(0>_){var w=y?n.lastIndexOf("e"):-1;0>w?(x=n,b=""):(x=n.substring(0,w),b=n.substring(w))}else x=n.substring(0,_),b=t+n.substring(_+1);!c&&f&&(x=i(x,1/0));var S=v.length+x.length+b.length+(M?0:u.length),k=s>S?new Array(S=s-S+1).join(r):"";return M&&(x=i(k+x,k.length?s-b.length:1/0)),u+=v,n=x+b,("<"===a?u+n+k:">"===a?k+u+n:"^"===a?k.substring(0,S>>=1)+u+n+k.substring(S):u+(M?n:k+n))+e}}}function Fn(n){return n+""}function Hn(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function On(n,t,e){function r(t){var e=n(t),r=i(e,1);return r-t>t-e?e:r}function u(e){return t(e=n(new go(e-1)),1),e}function i(n,e){return t(n=new go(+n),e),n}function a(n,r,i){var a=u(n),o=[];if(i>1)for(;r>a;)e(a)%i||o.push(new Date(+a)),t(a,1);else for(;r>a;)o.push(new Date(+a)),t(a,1);return o}function o(n,t,e){try{go=Hn;var r=new Hn;return r._=n,a(r,t,e)}finally{go=Date}}n.floor=n,n.round=r,n.ceil=u,n.offset=i,n.range=a;var l=n.utc=In(n);return l.floor=l,l.round=In(r),l.ceil=In(u),l.offset=In(i),l.range=o,n}function In(n){return function(t,e){try{go=Hn;var r=new Hn;return r._=t,n(r,e)._}finally{go=Date}}}function Yn(n){function t(n){function t(t){for(var e,u,i,a=[],o=-1,l=0;++o<r;)37===n.charCodeAt(o)&&(a.push(n.slice(l,o)),null!=(u=vo[e=n.charAt(++o)])&&(e=n.charAt(++o)),(i=A[e])&&(e=i(t,null==u?"e"===e?" ":"0":u)),a.push(e),l=o+1);return a.push(n.slice(l,o)),a.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},u=e(r,n,t,0);if(u!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var i=null!=r.Z&&go!==Hn,a=new(i?Hn:go);return"j"in r?a.setFullYear(r.y,0,r.j):"W"in r||"U"in r?("w"in r||(r.w="W"in r?1:0),a.setFullYear(r.y,0,1),a.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(a.getDay()+5)%7:r.w+7*r.U-(a.getDay()+6)%7)):a.setFullYear(r.y,r.m,r.d),a.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),i?a._:a},t.toString=function(){return n},t}function e(n,t,e,r){for(var u,i,a,o=0,l=t.length,c=e.length;l>o;){if(r>=c)return-1;if(u=t.charCodeAt(o++),37===u){if(a=t.charAt(o++),i=C[a in vo?t.charAt(o++):a],!i||(r=i(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,e){x.lastIndex=0;var r=x.exec(t.slice(e));return r?(n.w=b.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){N.lastIndex=0;var r=N.exec(t.slice(e));return r?(n.m=E.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=k.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,r){return e(n,A.c.toString(),t,r)}function l(n,t,r){return e(n,A.x.toString(),t,r)}function c(n,t,r){return e(n,A.X.toString(),t,r)}function s(n,t,e){var r=M.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var f=n.dateTime,h=n.date,g=n.time,p=n.periods,v=n.days,d=n.shortDays,m=n.months,y=n.shortMonths;t.utc=function(n){function e(n){try{go=Hn;var t=new go;return t._=n,r(t)}finally{go=Date}}var r=t(n);return e.parse=function(n){try{go=Hn;var t=r.parse(n);return t&&t._}finally{go=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=ct;var M=oa.map(),x=Vn(v),b=Xn(v),_=Vn(d),w=Xn(d),S=Vn(m),k=Xn(m),N=Vn(y),E=Xn(y);p.forEach(function(n,t){M.set(n.toLowerCase(),t)});var A={a:function(n){return d[n.getDay()]},A:function(n){return v[n.getDay()]},b:function(n){return y[n.getMonth()]},B:function(n){return m[n.getMonth()]},c:t(f),d:function(n,t){return Zn(n.getDate(),t,2)},e:function(n,t){return Zn(n.getDate(),t,2)},H:function(n,t){return Zn(n.getHours(),t,2)},I:function(n,t){return Zn(n.getHours()%12||12,t,2)},j:function(n,t){return Zn(1+ho.dayOfYear(n),t,3)},L:function(n,t){return Zn(n.getMilliseconds(),t,3)},m:function(n,t){return Zn(n.getMonth()+1,t,2)},M:function(n,t){return Zn(n.getMinutes(),t,2)},p:function(n){return p[+(n.getHours()>=12)]},S:function(n,t){return Zn(n.getSeconds(),t,2)},U:function(n,t){return Zn(ho.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Zn(ho.mondayOfYear(n),t,2)},x:t(h),X:t(g),y:function(n,t){return Zn(n.getFullYear()%100,t,2)},Y:function(n,t){return Zn(n.getFullYear()%1e4,t,4)},Z:ot,"%":function(){return"%"}},C={a:r,A:u,b:i,B:a,c:o,d:tt,e:tt,H:rt,I:rt,j:et,L:at,m:nt,M:ut,p:s,S:it,U:Bn,w:$n,W:Wn,x:l,X:c,y:Gn,Y:Jn,Z:Kn,"%":lt};return t}function Zn(n,t,e){var r=0>n?"-":"",u=(r?-n:n)+"",i=u.length;return r+(e>i?new Array(e-i+1).join(t)+u:u)}function Vn(n){return new RegExp("^(?:"+n.map(oa.requote).join("|")+")","i")}function Xn(n){for(var t=new c,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function $n(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Bn(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function Wn(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function Jn(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Gn(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.y=Qn(+r[0]),e+r[0].length):-1}function Kn(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function Qn(n){return n+(n>68?1900:2e3)}function nt(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function tt(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function et(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function rt(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ut(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function it(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function at(n,t,e){mo.lastIndex=0;var r=mo.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ot(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=Ma(t)/60|0,u=Ma(t)%60;return e+Zn(r,"0",2)+Zn(u,"0",2)}function lt(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function ct(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function st(){}function ft(n,t,e){var r=e.s=n+t,u=r-n,i=r-u;e.t=n-i+(t-u)}function ht(n,t){n&&_o.hasOwnProperty(n.type)&&_o[n.type](n,t)}function gt(n,t,e){var r,u=-1,i=n.length-e;for(t.lineStart();++u<i;)r=n[u],t.point(r[0],r[1],r[2]);t.lineEnd()}function pt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)gt(n[e],t,1);t.polygonEnd()}function vt(){function n(n,t){n*=Oa,t=t*Oa/2+ja/4;var e=n-r,a=e>=0?1:-1,o=a*e,l=Math.cos(t),c=Math.sin(t),s=i*c,f=u*l+s*Math.cos(o),h=s*a*Math.sin(o);So.add(Math.atan2(h,f)),r=n,u=l,i=c}var t,e,r,u,i;ko.point=function(a,o){ko.point=n,r=(t=a)*Oa,u=Math.cos(o=(e=o)*Oa/2+ja/4),i=Math.sin(o)},ko.lineEnd=function(){n(t,e)}}function dt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function mt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function yt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Mt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function xt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function bt(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function _t(n){return[Math.atan2(n[1],n[0]),tn(n[2])]}function wt(n,t){return Ma(n[0]-t[0])<Da&&Ma(n[1]-t[1])<Da}function St(n,t){n*=Oa;var e=Math.cos(t*=Oa);kt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function kt(n,t,e){++No,Ao+=(n-Ao)/No,Co+=(t-Co)/No,zo+=(e-zo)/No}function Nt(){function n(n,u){n*=Oa;var i=Math.cos(u*=Oa),a=i*Math.cos(n),o=i*Math.sin(n),l=Math.sin(u),c=Math.atan2(Math.sqrt((c=e*l-r*o)*c+(c=r*a-t*l)*c+(c=t*o-e*a)*c),t*a+e*o+r*l);Eo+=c,Lo+=c*(t+(t=a)),qo+=c*(e+(e=o)),To+=c*(r+(r=l)),kt(t,e,r)}var t,e,r;jo.point=function(u,i){u*=Oa;var a=Math.cos(i*=Oa);t=a*Math.cos(u),e=a*Math.sin(u),r=Math.sin(i),jo.point=n,kt(t,e,r)}}function Et(){jo.point=St}function At(){function n(n,t){n*=Oa;var e=Math.cos(t*=Oa),a=e*Math.cos(n),o=e*Math.sin(n),l=Math.sin(t),c=u*l-i*o,s=i*a-r*l,f=r*o-u*a,h=Math.sqrt(c*c+s*s+f*f),g=r*a+u*o+i*l,p=h&&-nn(g)/h,v=Math.atan2(h,g);Ro+=p*c,Do+=p*s,Po+=p*f,Eo+=v,Lo+=v*(r+(r=a)),qo+=v*(u+(u=o)),To+=v*(i+(i=l)),kt(r,u,i)}var t,e,r,u,i;jo.point=function(a,o){t=a,e=o,jo.point=n,a*=Oa;var l=Math.cos(o*=Oa);r=l*Math.cos(a),u=l*Math.sin(a),i=Math.sin(o),kt(r,u,i)},jo.lineEnd=function(){n(t,e),jo.lineEnd=Et,jo.point=St}}function Ct(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function zt(){return!0}function Lt(n,t,e,r,u){var i=[],a=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(wt(e,r)){u.lineStart();for(var o=0;t>o;++o)u.point((e=n[o])[0],e[1]);return void u.lineEnd()}var l=new Tt(e,n,null,!0),c=new Tt(e,null,l,!1);l.o=c,i.push(l),a.push(c),l=new Tt(r,n,null,!1),c=new Tt(r,null,l,!0),l.o=c,i.push(l),a.push(c)}}),a.sort(t),qt(i),qt(a),i.length){for(var o=0,l=e,c=a.length;c>o;++o)a[o].e=l=!l;for(var s,f,h=i[0];;){for(var g=h,p=!0;g.v;)if((g=g.n)===h)return;s=g.z,u.lineStart();do{if(g.v=g.o.v=!0,g.e){if(p)for(var o=0,c=s.length;c>o;++o)u.point((f=s[o])[0],f[1]);else r(g.x,g.n.x,1,u);g=g.n}else{if(p){s=g.p.z;for(var o=s.length-1;o>=0;--o)u.point((f=s[o])[0],f[1])}else r(g.x,g.p.x,-1,u);g=g.p}g=g.o,s=g.z,p=!p}while(!g.v);u.lineEnd()}}}function qt(n){if(t=n.length){for(var t,e,r=0,u=n[0];++r<t;)u.n=e=n[r],e.p=u,u=e;u.n=e=n[0],e.p=u}}function Tt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Rt(n,t,e,r){return function(u,i){function a(t,e){var r=u(t,e);n(t=r[0],e=r[1])&&i.point(t,e)}function o(n,t){var e=u(n,t);d.point(e[0],e[1])}function l(){y.point=o,d.lineStart()}function c(){y.point=a,d.lineEnd()}function s(n,t){v.push([n,t]);var e=u(n,t);x.point(e[0],e[1])}function f(){x.lineStart(),v=[]}function h(){s(v[0][0],v[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(v.pop(),p.push(v),v=null,r)if(1&t){n=e[0];var u,r=n.length-1,a=-1;if(r>0){for(b||(i.polygonStart(),b=!0),i.lineStart();++a<r;)i.point((u=n[a])[0],u[1]);i.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),g.push(e.filter(Dt))}var g,p,v,d=t(i),m=u.invert(r[0],r[1]),y={point:a,lineStart:l,lineEnd:c,polygonStart:function(){y.point=s,y.lineStart=f,y.lineEnd=h,g=[],p=[]},polygonEnd:function(){y.point=a,y.lineStart=l,y.lineEnd=c,g=oa.merge(g);var n=Ot(m,p);g.length?(b||(i.polygonStart(),b=!0),Lt(g,jt,n,e,i)):n&&(b||(i.polygonStart(),b=!0),i.lineStart(),e(null,null,1,i),i.lineEnd()),b&&(i.polygonEnd(),b=!1),g=p=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},M=Pt(),x=t(M),b=!1;return y}}function Dt(n){return n.length>1}function Pt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:b,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function jt(n,t){return((n=n.x)[0]<0?n[1]-Ha-Da:Ha-n[1])-((t=t.x)[0]<0?t[1]-Ha-Da:Ha-t[1])}function Ut(n){var t,e=NaN,r=NaN,u=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(i,a){var o=i>0?ja:-ja,l=Ma(i-e);Ma(l-ja)<Da?(n.point(e,r=(r+a)/2>0?Ha:-Ha),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(o,r),n.point(i,r),t=0):u!==o&&l>=ja&&(Ma(e-u)<Da&&(e-=u*Da),Ma(i-o)<Da&&(i-=o*Da),r=Ft(e,r,i,a),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(o,r),t=0),n.point(e=i,r=a),u=o},lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}}function Ft(n,t,e,r){var u,i,a=Math.sin(n-e);return Ma(a)>Da?Math.atan((Math.sin(t)*(i=Math.cos(r))*Math.sin(e)-Math.sin(r)*(u=Math.cos(t))*Math.sin(n))/(u*i*a)):(t+r)/2}function Ht(n,t,e,r){var u;if(null==n)u=e*Ha,r.point(-ja,u),r.point(0,u),r.point(ja,u),r.point(ja,0),r.point(ja,-u),r.point(0,-u),r.point(-ja,-u),r.point(-ja,0),r.point(-ja,u);else if(Ma(n[0]-t[0])>Da){var i=n[0]<t[0]?ja:-ja;u=e*i/2,r.point(-i,u),r.point(0,u),r.point(i,u)}else r.point(t[0],t[1])}function Ot(n,t){var e=n[0],r=n[1],u=[Math.sin(e),-Math.cos(e),0],i=0,a=0;So.reset();for(var o=0,l=t.length;l>o;++o){var c=t[o],s=c.length;if(s)for(var f=c[0],h=f[0],g=f[1]/2+ja/4,p=Math.sin(g),v=Math.cos(g),d=1;;){d===s&&(d=0),n=c[d];var m=n[0],y=n[1]/2+ja/4,M=Math.sin(y),x=Math.cos(y),b=m-h,_=b>=0?1:-1,w=_*b,S=w>ja,k=p*M;if(So.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),i+=S?b+_*Ua:b,S^h>=e^m>=e){var N=yt(dt(f),dt(n));bt(N);var E=yt(u,N);bt(E);var A=(S^b>=0?-1:1)*tn(E[2]);(r>A||r===A&&(N[0]||N[1]))&&(a+=S^b>=0?1:-1)}if(!d++)break;h=m,p=M,v=x,f=n}}return(-Da>i||Da>i&&0>So)^1&a}function It(n){function t(n,t){return Math.cos(n)*Math.cos(t)>i}function e(n){var e,i,l,c,s;return{lineStart:function(){c=l=!1,s=1},point:function(f,h){var g,p=[f,h],v=t(f,h),d=a?v?0:u(f,h):v?u(f+(0>f?ja:-ja),h):0;if(!e&&(c=l=v)&&n.lineStart(),v!==l&&(g=r(e,p),(wt(e,g)||wt(p,g))&&(p[0]+=Da,p[1]+=Da,v=t(p[0],p[1]))),v!==l)s=0,v?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(o&&e&&a^v){var m;d&i||!(m=r(p,e,!0))||(s=0,a?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!v||e&&wt(e,p)||n.point(p[0],p[1]),e=p,l=v,i=d},lineEnd:function(){l&&n.lineEnd(),e=null},clean:function(){return s|(c&&l)<<1}}}function r(n,t,e){var r=dt(n),u=dt(t),a=[1,0,0],o=yt(r,u),l=mt(o,o),c=o[0],s=l-c*c;if(!s)return!e&&n;var f=i*l/s,h=-i*c/s,g=yt(a,o),p=xt(a,f),v=xt(o,h);Mt(p,v);var d=g,m=mt(p,d),y=mt(d,d),M=m*m-y*(mt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=xt(d,(-m-x)/y);if(Mt(b,p),b=_t(b),!e)return b;var _,w=n[0],S=t[0],k=n[1],N=t[1];w>S&&(_=w,w=S,S=_);var E=S-w,A=Ma(E-ja)<Da,C=A||Da>E;if(!A&&k>N&&(_=k,k=N,N=_),C?A?k+N>0^b[1]<(Ma(b[0]-w)<Da?k:N):k<=b[1]&&b[1]<=N:E>ja^(w<=b[0]&&b[0]<=S)){var z=xt(d,(-m+x)/y);return Mt(z,p),[b,_t(z)]}}}function u(t,e){var r=a?n:ja-n,u=0;return-r>t?u|=1:t>r&&(u|=2),-r>e?u|=4:e>r&&(u|=8),u}var i=Math.cos(n),a=i>0,o=Ma(i)>Da,l=ve(n,6*Oa);return Rt(t,e,l,a?[0,-n]:[-ja,n-ja])}function Yt(n,t,e,r){return function(u){var i,a=u.a,o=u.b,l=a.x,c=a.y,s=o.x,f=o.y,h=0,g=1,p=s-l,v=f-c;if(i=n-l,p||!(i>0)){if(i/=p,0>p){if(h>i)return;g>i&&(g=i)}else if(p>0){if(i>g)return;i>h&&(h=i)}if(i=e-l,p||!(0>i)){if(i/=p,0>p){if(i>g)return;i>h&&(h=i)}else if(p>0){if(h>i)return;g>i&&(g=i)}if(i=t-c,v||!(i>0)){if(i/=v,0>v){if(h>i)return;g>i&&(g=i)}else if(v>0){if(i>g)return;i>h&&(h=i)}if(i=r-c,v||!(0>i)){if(i/=v,0>v){if(i>g)return;i>h&&(h=i)}else if(v>0){if(h>i)return;g>i&&(g=i)}return h>0&&(u.a={x:l+h*p,y:c+h*v}),1>g&&(u.b={x:l+g*p,y:c+g*v}),u}}}}}}function Zt(n,t,e,r){function u(r,u){return Ma(r[0]-n)<Da?u>0?0:3:Ma(r[0]-e)<Da?u>0?2:1:Ma(r[1]-t)<Da?u>0?1:0:u>0?3:2}function i(n,t){return a(n.x,t.x)}function a(n,t){var e=u(n,1),r=u(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(o){function l(n){for(var t=0,e=d.length,r=n[1],u=0;e>u;++u)for(var i,a=1,o=d[u],l=o.length,c=o[0];l>a;++a)i=o[a],c[1]<=r?i[1]>r&&Q(c,i,n)>0&&++t:i[1]<=r&&Q(c,i,n)<0&&--t,c=i;return 0!==t}function c(i,o,l,c){var s=0,f=0;if(null==i||(s=u(i,l))!==(f=u(o,l))||a(i,o)<0^l>0){do c.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+l+4)%4)!==f)}else c.point(o[0],o[1])}function s(u,i){return u>=n&&e>=u&&i>=t&&r>=i}function f(n,t){s(n,t)&&o.point(n,t)}function h(){C.point=p,d&&d.push(m=[]),S=!0,w=!1,b=_=NaN}function g(){v&&(p(y,M),x&&w&&E.rejoin(),v.push(E.buffer())),C.point=f,w&&o.lineEnd()}function p(n,t){n=Math.max(-Fo,Math.min(Fo,n)),t=Math.max(-Fo,Math.min(Fo,t));var e=s(n,t);if(d&&m.push([n,t]),S)y=n,M=t,x=e,S=!1,e&&(o.lineStart(),o.point(n,t));else if(e&&w)o.point(n,t);else{var r={a:{x:b,y:_},b:{x:n,y:t}};A(r)?(w||(o.lineStart(),o.point(r.a.x,r.a.y)),o.point(r.b.x,r.b.y),e||o.lineEnd(),k=!1):e&&(o.lineStart(),o.point(n,t),k=!1)}b=n,_=t,w=e}var v,d,m,y,M,x,b,_,w,S,k,N=o,E=Pt(),A=Yt(n,t,e,r),C={point:f,lineStart:h,lineEnd:g,polygonStart:function(){o=E,v=[],d=[],k=!0},polygonEnd:function(){o=N,v=oa.merge(v);var t=l([n,r]),e=k&&t,u=v.length;(e||u)&&(o.polygonStart(),e&&(o.lineStart(),c(null,null,1,o),o.lineEnd()),u&&Lt(v,i,t,c,o),o.polygonEnd()),v=d=m=null}};return C}}function Vt(n){var t=0,e=ja/3,r=oe(n),u=r(t,e);return u.parallels=function(n){return arguments.length?r(t=n[0]*ja/180,e=n[1]*ja/180):[t/ja*180,e/ja*180]},u}function Xt(n,t){function e(n,t){var e=Math.sqrt(i-2*u*Math.sin(t))/u;return[e*Math.sin(n*=u),a-e*Math.cos(n)]}var r=Math.sin(n),u=(r+Math.sin(t))/2,i=1+r*(2*u-r),a=Math.sqrt(i)/u;return e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/u,tn((i-(n*n+e*e)*u*u)/(2*u))]},e}function $t(){function n(n,t){Oo+=u*n-r*t,r=n,u=t}var t,e,r,u;Xo.point=function(i,a){Xo.point=n,t=r=i,e=u=a},Xo.lineEnd=function(){n(t,e)}}function Bt(n,t){Io>n&&(Io=n),n>Zo&&(Zo=n),Yo>t&&(Yo=t),t>Vo&&(Vo=t)}function Wt(){function n(n,t){a.push("M",n,",",t,i)}function t(n,t){a.push("M",n,",",t),o.point=e}function e(n,t){a.push("L",n,",",t)}function r(){o.point=n}function u(){a.push("Z")}var i=Jt(4.5),a=[],o={point:n,lineStart:function(){o.point=t},lineEnd:r,polygonStart:function(){o.lineEnd=u},polygonEnd:function(){o.lineEnd=r,o.point=n},pointRadius:function(n){return i=Jt(n),o},result:function(){if(a.length){var n=a.join("");return a=[],n}}};return o}function Jt(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function Gt(n,t){Ao+=n,Co+=t,++zo}function Kt(){function n(n,r){var u=n-t,i=r-e,a=Math.sqrt(u*u+i*i);Lo+=a*(t+n)/2,qo+=a*(e+r)/2,To+=a,Gt(t=n,e=r)}var t,e;Bo.point=function(r,u){Bo.point=n,Gt(t=r,e=u)}}function Qt(){Bo.point=Gt}function ne(){function n(n,t){var e=n-r,i=t-u,a=Math.sqrt(e*e+i*i);Lo+=a*(r+n)/2,qo+=a*(u+t)/2,To+=a,a=u*n-r*t,Ro+=a*(r+n),Do+=a*(u+t),Po+=3*a,Gt(r=n,u=t)}var t,e,r,u;Bo.point=function(i,a){Bo.point=n,Gt(t=r=i,e=u=a)},Bo.lineEnd=function(){n(t,e)}}function te(n){function t(t,e){n.moveTo(t+a,e),n.arc(t,e,a,0,Ua)}function e(t,e){n.moveTo(t,e),o.point=r}function r(t,e){n.lineTo(t,e)}function u(){o.point=t}function i(){n.closePath()}var a=4.5,o={point:t,lineStart:function(){o.point=e},lineEnd:u,polygonStart:function(){o.lineEnd=i},polygonEnd:function(){o.lineEnd=u,o.point=t},pointRadius:function(n){return a=n,o},result:b};return o}function ee(n){function t(n){return(o?r:e)(n)}function e(t){return ie(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){M=NaN,S.point=i,t.lineStart()}function i(e,r){var i=dt([e,r]),a=n(e,r);u(M,x,y,b,_,w,M=a[0],x=a[1],y=e,b=i[0],_=i[1],w=i[2],o,t),t.point(M,x)}function a(){S.point=e,t.lineEnd()}function l(){r(),S.point=c,S.lineEnd=s}function c(n,t){
i(f=n,h=t),g=M,p=x,v=b,d=_,m=w,S.point=i}function s(){u(M,x,y,b,_,w,g,p,f,v,d,m,o,t),S.lineEnd=a,a()}var f,h,g,p,v,d,m,y,M,x,b,_,w,S={point:e,lineStart:r,lineEnd:a,polygonStart:function(){t.polygonStart(),S.lineStart=l},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function u(t,e,r,o,l,c,s,f,h,g,p,v,d,m){var y=s-t,M=f-e,x=y*y+M*M;if(x>4*i&&d--){var b=o+g,_=l+p,w=c+v,S=Math.sqrt(b*b+_*_+w*w),k=Math.asin(w/=S),N=Ma(Ma(w)-1)<Da||Ma(r-h)<Da?(r+h)/2:Math.atan2(_,b),E=n(N,k),A=E[0],C=E[1],z=A-t,L=C-e,q=M*z-y*L;(q*q/x>i||Ma((y*z+M*L)/x-.5)>.3||a>o*g+l*p+c*v)&&(u(t,e,r,o,l,c,A,C,N,b/=S,_/=S,w,d,m),m.point(A,C),u(A,C,N,b,_,w,s,f,h,g,p,v,d,m))}}var i=.5,a=Math.cos(30*Oa),o=16;return t.precision=function(n){return arguments.length?(o=(i=n*n)>0&&16,t):Math.sqrt(i)},t}function re(n){var t=ee(function(t,e){return n([t*Ia,e*Ia])});return function(n){return le(t(n))}}function ue(n){this.stream=n}function ie(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function ae(n){return oe(function(){return n})()}function oe(n){function t(n){return n=o(n[0]*Oa,n[1]*Oa),[n[0]*h+l,c-n[1]*h]}function e(n){return n=o.invert((n[0]-l)/h,(c-n[1])/h),n&&[n[0]*Ia,n[1]*Ia]}function r(){o=Ct(a=fe(m,M,x),i);var n=i(v,d);return l=g-n[0]*h,c=p+n[1]*h,u()}function u(){return s&&(s.valid=!1,s=null),t}var i,a,o,l,c,s,f=ee(function(n,t){return n=i(n,t),[n[0]*h+l,c-n[1]*h]}),h=150,g=480,p=250,v=0,d=0,m=0,M=0,x=0,b=Uo,_=y,w=null,S=null;return t.stream=function(n){return s&&(s.valid=!1),s=le(b(a,f(_(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(b=null==n?(w=n,Uo):It((w=+n)*Oa),u()):w},t.clipExtent=function(n){return arguments.length?(S=n,_=n?Zt(n[0][0],n[0][1],n[1][0],n[1][1]):y,u()):S},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(v=n[0]%360*Oa,d=n[1]%360*Oa,r()):[v*Ia,d*Ia]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Oa,M=n[1]%360*Oa,x=n.length>2?n[2]%360*Oa:0,r()):[m*Ia,M*Ia,x*Ia]},oa.rebind(t,f,"precision"),function(){return i=n.apply(this,arguments),t.invert=i.invert&&e,r()}}function le(n){return ie(n,function(t,e){n.point(t*Oa,e*Oa)})}function ce(n,t){return[n,t]}function se(n,t){return[n>ja?n-Ua:-ja>n?n+Ua:n,t]}function fe(n,t,e){return n?t||e?Ct(ge(n),pe(t,e)):ge(n):t||e?pe(t,e):se}function he(n){return function(t,e){return t+=n,[t>ja?t-Ua:-ja>t?t+Ua:t,e]}}function ge(n){var t=he(n);return t.invert=he(-n),t}function pe(n,t){function e(n,t){var e=Math.cos(t),o=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),s=c*r+o*u;return[Math.atan2(l*i-s*a,o*r-c*u),tn(s*i+l*a)]}var r=Math.cos(n),u=Math.sin(n),i=Math.cos(t),a=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),o=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),s=c*i-l*a;return[Math.atan2(l*i+c*a,o*r+s*u),tn(s*r-o*u)]},e}function ve(n,t){var e=Math.cos(n),r=Math.sin(n);return function(u,i,a,o){var l=a*t;null!=u?(u=de(e,u),i=de(e,i),(a>0?i>u:u>i)&&(u+=a*Ua)):(u=n+a*Ua,i=n-.5*l);for(var c,s=u;a>0?s>i:i>s;s-=l)o.point((c=_t([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],c[1])}}function de(n,t){var e=dt(t);e[0]-=n,bt(e);var r=nn(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Da)%(2*Math.PI)}function me(n,t,e){var r=oa.range(n,t-Da,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function ye(n,t,e){var r=oa.range(n,t-Da,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function Me(n){return n.source}function xe(n){return n.target}function be(n,t,e,r){var u=Math.cos(t),i=Math.sin(t),a=Math.cos(r),o=Math.sin(r),l=u*Math.cos(n),c=u*Math.sin(n),s=a*Math.cos(e),f=a*Math.sin(e),h=2*Math.asin(Math.sqrt(an(r-t)+u*a*an(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*l+t*s,u=e*c+t*f,a=e*i+t*o;return[Math.atan2(u,r)*Ia,Math.atan2(a,Math.sqrt(r*r+u*u))*Ia]}:function(){return[n*Ia,t*Ia]};return p.distance=h,p}function _e(){function n(n,u){var i=Math.sin(u*=Oa),a=Math.cos(u),o=Ma((n*=Oa)-t),l=Math.cos(o);Wo+=Math.atan2(Math.sqrt((o=a*Math.sin(o))*o+(o=r*i-e*a*l)*o),e*i+r*a*l),t=n,e=i,r=a}var t,e,r;Jo.point=function(u,i){t=u*Oa,e=Math.sin(i*=Oa),r=Math.cos(i),Jo.point=n},Jo.lineEnd=function(){Jo.point=Jo.lineEnd=b}}function we(n,t){function e(t,e){var r=Math.cos(t),u=Math.cos(e),i=n(r*u);return[i*u*Math.sin(t),i*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),u=t(r),i=Math.sin(u),a=Math.cos(u);return[Math.atan2(n*i,r*a),Math.asin(r&&e*i/r)]},e}function Se(n,t){function e(n,t){a>0?-Ha+Da>t&&(t=-Ha+Da):t>Ha-Da&&(t=Ha-Da);var e=a/Math.pow(u(t),i);return[e*Math.sin(i*n),a-e*Math.cos(i*n)]}var r=Math.cos(n),u=function(n){return Math.tan(ja/4+n/2)},i=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(u(t)/u(n)),a=r*Math.pow(u(n),i)/i;return i?(e.invert=function(n,t){var e=a-t,r=K(i)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(a/r,1/i))-Ha]},e):Ne}function ke(n,t){function e(n,t){var e=i-t;return[e*Math.sin(u*n),i-e*Math.cos(u*n)]}var r=Math.cos(n),u=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),i=r/u+n;return Ma(u)<Da?ce:(e.invert=function(n,t){var e=i-t;return[Math.atan2(n,e)/u,i-K(u)*Math.sqrt(n*n+e*e)]},e)}function Ne(n,t){return[n,Math.log(Math.tan(ja/4+t/2))]}function Ee(n){var t,e=ae(n),r=e.scale,u=e.translate,i=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=u.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var a=i.apply(e,arguments);if(a===e){if(t=null==n){var o=ja*r(),l=u();i([[l[0]-o,l[1]-o],[l[0]+o,l[1]+o]])}}else t&&(a=null);return a},e.clipExtent(null)}function Ae(n,t){return[Math.log(Math.tan(ja/4+t/2)),-n]}function Ce(n){return n[0]}function ze(n){return n[1]}function Le(n){for(var t=n.length,e=[0,1],r=2,u=2;t>u;u++){for(;r>1&&Q(n[e[r-2]],n[e[r-1]],n[u])<=0;)--r;e[r++]=u}return e.slice(0,r)}function qe(n,t){return n[0]-t[0]||n[1]-t[1]}function Te(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function Re(n,t,e,r){var u=n[0],i=e[0],a=t[0]-u,o=r[0]-i,l=n[1],c=e[1],s=t[1]-l,f=r[1]-c,h=(o*(l-c)-f*(u-i))/(f*a-o*s);return[u+h*a,l+h*s]}function De(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Pe(){rr(this),this.edge=this.site=this.circle=null}function je(n){var t=ll.pop()||new Pe;return t.site=n,t}function Ue(n){Be(n),il.remove(n),ll.push(n),rr(n)}function Fe(n){var t=n.circle,e=t.x,r=t.cy,u={x:e,y:r},i=n.P,a=n.N,o=[n];Ue(n);for(var l=i;l.circle&&Ma(e-l.circle.x)<Da&&Ma(r-l.circle.cy)<Da;)i=l.P,o.unshift(l),Ue(l),l=i;o.unshift(l),Be(l);for(var c=a;c.circle&&Ma(e-c.circle.x)<Da&&Ma(r-c.circle.cy)<Da;)a=c.N,o.push(c),Ue(c),c=a;o.push(c),Be(c);var s,f=o.length;for(s=1;f>s;++s)c=o[s],l=o[s-1],nr(c.edge,l.site,c.site,u);l=o[0],c=o[f-1],c.edge=Ke(l.site,c.site,null,u),$e(l),$e(c)}function He(n){for(var t,e,r,u,i=n.x,a=n.y,o=il._;o;)if(r=Oe(o,a)-i,r>Da)o=o.L;else{if(u=i-Ie(o,a),!(u>Da)){r>-Da?(t=o.P,e=o):u>-Da?(t=o,e=o.N):t=e=o;break}if(!o.R){t=o;break}o=o.R}var l=je(n);if(il.insert(t,l),t||e){if(t===e)return Be(t),e=je(t.site),il.insert(l,e),l.edge=e.edge=Ke(t.site,l.site),$e(t),void $e(e);if(!e)return void(l.edge=Ke(t.site,l.site));Be(t),Be(e);var c=t.site,s=c.x,f=c.y,h=n.x-s,g=n.y-f,p=e.site,v=p.x-s,d=p.y-f,m=2*(h*d-g*v),y=h*h+g*g,M=v*v+d*d,x={x:(d*y-g*M)/m+s,y:(h*M-v*y)/m+f};nr(e.edge,c,p,x),l.edge=Ke(c,n,null,x),e.edge=Ke(n,p,null,x),$e(t),$e(e)}}function Oe(n,t){var e=n.site,r=e.x,u=e.y,i=u-t;if(!i)return r;var a=n.P;if(!a)return-(1/0);e=a.site;var o=e.x,l=e.y,c=l-t;if(!c)return o;var s=o-r,f=1/i-1/c,h=s/c;return f?(-h+Math.sqrt(h*h-2*f*(s*s/(-2*c)-l+c/2+u-i/2)))/f+r:(r+o)/2}function Ie(n,t){var e=n.N;if(e)return Oe(e,t);var r=n.site;return r.y===t?r.x:1/0}function Ye(n){this.site=n,this.edges=[]}function Ze(n){for(var t,e,r,u,i,a,o,l,c,s,f=n[0][0],h=n[1][0],g=n[0][1],p=n[1][1],v=ul,d=v.length;d--;)if(i=v[d],i&&i.prepare())for(o=i.edges,l=o.length,a=0;l>a;)s=o[a].end(),r=s.x,u=s.y,c=o[++a%l].start(),t=c.x,e=c.y,(Ma(r-t)>Da||Ma(u-e)>Da)&&(o.splice(a,0,new tr(Qe(i.site,s,Ma(r-f)<Da&&p-u>Da?{x:f,y:Ma(t-f)<Da?e:p}:Ma(u-p)<Da&&h-r>Da?{x:Ma(e-p)<Da?t:h,y:p}:Ma(r-h)<Da&&u-g>Da?{x:h,y:Ma(t-h)<Da?e:g}:Ma(u-g)<Da&&r-f>Da?{x:Ma(e-g)<Da?t:f,y:g}:null),i.site,null)),++l)}function Ve(n,t){return t.angle-n.angle}function Xe(){rr(this),this.x=this.y=this.arc=this.site=this.cy=null}function $e(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,u=n.site,i=e.site;if(r!==i){var a=u.x,o=u.y,l=r.x-a,c=r.y-o,s=i.x-a,f=i.y-o,h=2*(l*f-c*s);if(!(h>=-Pa)){var g=l*l+c*c,p=s*s+f*f,v=(f*g-c*p)/h,d=(l*p-s*g)/h,f=d+o,m=cl.pop()||new Xe;m.arc=n,m.site=u,m.x=v+a,m.y=f+Math.sqrt(v*v+d*d),m.cy=f,n.circle=m;for(var y=null,M=ol._;M;)if(m.y<M.y||m.y===M.y&&m.x<=M.x){if(!M.L){y=M.P;break}M=M.L}else{if(!M.R){y=M;break}M=M.R}ol.insert(y,m),y||(al=m)}}}}function Be(n){var t=n.circle;t&&(t.P||(al=t.N),ol.remove(t),cl.push(t),rr(t),n.circle=null)}function We(n){for(var t,e=rl,r=Yt(n[0][0],n[0][1],n[1][0],n[1][1]),u=e.length;u--;)t=e[u],(!Je(t,n)||!r(t)||Ma(t.a.x-t.b.x)<Da&&Ma(t.a.y-t.b.y)<Da)&&(t.a=t.b=null,e.splice(u,1))}function Je(n,t){var e=n.b;if(e)return!0;var r,u,i=n.a,a=t[0][0],o=t[1][0],l=t[0][1],c=t[1][1],s=n.l,f=n.r,h=s.x,g=s.y,p=f.x,v=f.y,d=(h+p)/2,m=(g+v)/2;if(v===g){if(a>d||d>=o)return;if(h>p){if(i){if(i.y>=c)return}else i={x:d,y:l};e={x:d,y:c}}else{if(i){if(i.y<l)return}else i={x:d,y:c};e={x:d,y:l}}}else if(r=(h-p)/(v-g),u=m-r*d,-1>r||r>1)if(h>p){if(i){if(i.y>=c)return}else i={x:(l-u)/r,y:l};e={x:(c-u)/r,y:c}}else{if(i){if(i.y<l)return}else i={x:(c-u)/r,y:c};e={x:(l-u)/r,y:l}}else if(v>g){if(i){if(i.x>=o)return}else i={x:a,y:r*a+u};e={x:o,y:r*o+u}}else{if(i){if(i.x<a)return}else i={x:o,y:r*o+u};e={x:a,y:r*a+u}}return n.a=i,n.b=e,!0}function Ge(n,t){this.l=n,this.r=t,this.a=this.b=null}function Ke(n,t,e,r){var u=new Ge(n,t);return rl.push(u),e&&nr(u,n,t,e),r&&nr(u,t,n,r),ul[n.i].edges.push(new tr(u,n,t)),ul[t.i].edges.push(new tr(u,t,n)),u}function Qe(n,t,e){var r=new Ge(n,null);return r.a=t,r.b=e,rl.push(r),r}function nr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function tr(n,t,e){var r=n.a,u=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(u.x-r.x,r.y-u.y):Math.atan2(r.x-u.x,u.y-r.y)}function er(){this._=null}function rr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function ur(n,t){var e=t,r=t.R,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function ir(n,t){var e=t,r=t.L,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function ar(n){for(;n.L;)n=n.L;return n}function or(n,t){var e,r,u,i=n.sort(lr).pop();for(rl=[],ul=new Array(n.length),il=new er,ol=new er;;)if(u=al,i&&(!u||i.y<u.y||i.y===u.y&&i.x<u.x))(i.x!==e||i.y!==r)&&(ul[i.i]=new Ye(i),He(i),e=i.x,r=i.y),i=n.pop();else{if(!u)break;Fe(u.arc)}t&&(We(t),Ze(t));var a={cells:ul,edges:rl};return il=ol=rl=ul=null,a}function lr(n,t){return t.y-n.y||t.x-n.x}function cr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function sr(n){return n.x}function fr(n){return n.y}function hr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function gr(n,t,e,r,u,i){if(!n(t,e,r,u,i)){var a=.5*(e+u),o=.5*(r+i),l=t.nodes;l[0]&&gr(n,l[0],e,r,a,o),l[1]&&gr(n,l[1],a,r,u,o),l[2]&&gr(n,l[2],e,o,a,i),l[3]&&gr(n,l[3],a,o,u,i)}}function pr(n,t,e,r,u,i,a){var o,l=1/0;return function c(n,s,f,h,g){if(!(s>i||f>a||r>h||u>g)){if(p=n.point){var p,v=t-n.x,d=e-n.y,m=v*v+d*d;if(l>m){var y=Math.sqrt(l=m);r=t-y,u=e-y,i=t+y,a=e+y,o=p}}for(var M=n.nodes,x=.5*(s+h),b=.5*(f+g),_=t>=x,w=e>=b,S=w<<1|_,k=S+4;k>S;++S)if(n=M[3&S])switch(3&S){case 0:c(n,s,f,x,b);break;case 1:c(n,x,f,h,b);break;case 2:c(n,s,b,x,g);break;case 3:c(n,x,b,h,g)}}}(n,r,u,i,a),o}function vr(n,t){n=oa.rgb(n),t=oa.rgb(t);var e=n.r,r=n.g,u=n.b,i=t.r-e,a=t.g-r,o=t.b-u;return function(n){return"#"+bn(Math.round(e+i*n))+bn(Math.round(r+a*n))+bn(Math.round(u+o*n))}}function dr(n,t){var e,r={},u={};for(e in n)e in t?r[e]=Mr(n[e],t[e]):u[e]=n[e];for(e in t)e in n||(u[e]=t[e]);return function(n){for(e in r)u[e]=r[e](n);return u}}function mr(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function yr(n,t){var e,r,u,i=fl.lastIndex=hl.lastIndex=0,a=-1,o=[],l=[];for(n+="",t+="";(e=fl.exec(n))&&(r=hl.exec(t));)(u=r.index)>i&&(u=t.slice(i,u),o[a]?o[a]+=u:o[++a]=u),(e=e[0])===(r=r[0])?o[a]?o[a]+=r:o[++a]=r:(o[++a]=null,l.push({i:a,x:mr(e,r)})),i=hl.lastIndex;return i<t.length&&(u=t.slice(i),o[a]?o[a]+=u:o[++a]=u),o.length<2?l[0]?(t=l[0].x,function(n){return t(n)+""}):function(){return t}:(t=l.length,function(n){for(var e,r=0;t>r;++r)o[(e=l[r]).i]=e.x(n);return o.join("")})}function Mr(n,t){for(var e,r=oa.interpolators.length;--r>=0&&!(e=oa.interpolators[r](n,t)););return e}function xr(n,t){var e,r=[],u=[],i=n.length,a=t.length,o=Math.min(n.length,t.length);for(e=0;o>e;++e)r.push(Mr(n[e],t[e]));for(;i>e;++e)u[e]=n[e];for(;a>e;++e)u[e]=t[e];return function(n){for(e=0;o>e;++e)u[e]=r[e](n);return u}}function br(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function _r(n){return function(t){return 1-n(1-t)}}function wr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function Sr(n){return n*n}function kr(n){return n*n*n}function Nr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Er(n){return function(t){return Math.pow(t,n)}}function Ar(n){return 1-Math.cos(n*Ha)}function Cr(n){return Math.pow(2,10*(n-1))}function zr(n){return 1-Math.sqrt(1-n*n)}function Lr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Ua*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Ua/t)}}function qr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Tr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Rr(n,t){n=oa.hcl(n),t=oa.hcl(t);var e=n.h,r=n.c,u=n.l,i=t.h-e,a=t.c-r,o=t.l-u;return isNaN(a)&&(a=0,r=isNaN(r)?t.c:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return fn(e+i*n,r+a*n,u+o*n)+""}}function Dr(n,t){n=oa.hsl(n),t=oa.hsl(t);var e=n.h,r=n.s,u=n.l,i=t.h-e,a=t.s-r,o=t.l-u;return isNaN(a)&&(a=0,r=isNaN(r)?t.s:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return cn(e+i*n,r+a*n,u+o*n)+""}}function Pr(n,t){n=oa.lab(n),t=oa.lab(t);var e=n.l,r=n.a,u=n.b,i=t.l-e,a=t.a-r,o=t.b-u;return function(n){return gn(e+i*n,r+a*n,u+o*n)+""}}function jr(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Ur(n){var t=[n.a,n.b],e=[n.c,n.d],r=Hr(t),u=Fr(t,e),i=Hr(Or(e,t,-u))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,u*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Ia,this.translate=[n.e,n.f],this.scale=[r,i],this.skew=i?Math.atan2(u,i)*Ia:0}function Fr(n,t){return n[0]*t[0]+n[1]*t[1]}function Hr(n){var t=Math.sqrt(Fr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Or(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Ir(n){return n.length?n.pop()+",":""}function Yr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var u=e.push("translate(",null,",",null,")");r.push({i:u-4,x:mr(n[0],t[0])},{i:u-2,x:mr(n[1],t[1])})}else(t[0]||t[1])&&e.push("translate("+t+")")}function Zr(n,t,e,r){n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({i:e.push(Ir(e)+"rotate(",null,")")-2,x:mr(n,t)})):t&&e.push(Ir(e)+"rotate("+t+")")}function Vr(n,t,e,r){n!==t?r.push({i:e.push(Ir(e)+"skewX(",null,")")-2,x:mr(n,t)}):t&&e.push(Ir(e)+"skewX("+t+")")}function Xr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var u=e.push(Ir(e)+"scale(",null,",",null,")");r.push({i:u-4,x:mr(n[0],t[0])},{i:u-2,x:mr(n[1],t[1])})}else(1!==t[0]||1!==t[1])&&e.push(Ir(e)+"scale("+t+")")}function $r(n,t){var e=[],r=[];return n=oa.transform(n),t=oa.transform(t),Yr(n.translate,t.translate,e,r),Zr(n.rotate,t.rotate,e,r),Vr(n.skew,t.skew,e,r),Xr(n.scale,t.scale,e,r),n=t=null,function(n){for(var t,u=-1,i=r.length;++u<i;)e[(t=r[u]).i]=t.x(n);return e.join("")}}function Br(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function Wr(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),u=[t];t!==r;)t=t.parent,u.push(t);for(var i=u.length;e!==r;)u.splice(i,0,e),e=e.parent;return u}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),u=e.pop(),i=r.pop(),a=null;u===i;)a=u,u=e.pop(),i=r.pop();return a}function Qr(n){n.fixed|=2}function nu(n){n.fixed&=-7}function tu(n){n.fixed|=4,n.px=n.x,n.py=n.y}function eu(n){n.fixed&=-5}function ru(n,t,e){var r=0,u=0;if(n.charge=0,!n.leaf)for(var i,a=n.nodes,o=a.length,l=-1;++l<o;)i=a[l],null!=i&&(ru(i,t,e),n.charge+=i.charge,r+=i.charge*i.cx,u+=i.charge*i.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var c=t*e[n.point.index];n.charge+=n.pointCharge=c,r+=c*n.point.x,u+=c*n.point.y}n.cx=r/n.charge,n.cy=u/n.charge}function uu(n,t){return oa.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=su,n}function iu(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(u=n.children)&&(r=u.length))for(var r,u;--r>=0;)e.push(u[r])}function au(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(i=n.children)&&(u=i.length))for(var u,i,a=-1;++a<u;)e.push(i[a]);for(;null!=(n=r.pop());)t(n)}function ou(n){return n.children}function lu(n){return n.value}function cu(n,t){return t.value-n.value}function su(n){return oa.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function fu(n){return n.x}function hu(n){return n.y}function gu(n,t,e){n.y0=t,n.y=e}function pu(n){return oa.range(n.length)}function vu(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function du(n){for(var t,e=1,r=0,u=n[0][1],i=n.length;i>e;++e)(t=n[e][1])>u&&(r=e,u=t);return r}function mu(n){return n.reduce(yu,0)}function yu(n,t){return n+t[1]}function Mu(n,t){return xu(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function xu(n,t){for(var e=-1,r=+n[0],u=(n[1]-r)/t,i=[];++e<=t;)i[e]=u*e+r;return i}function bu(n){return[oa.min(n),oa.max(n)]}function _u(n,t){return n.value-t.value}function wu(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Su(n,t){n._pack_next=t,t._pack_prev=n}function ku(n,t){var e=t.x-n.x,r=t.y-n.y,u=n.r+t.r;return.999*u*u>e*e+r*r}function Nu(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(c=e.length)){var e,r,u,i,a,o,l,c,s=1/0,f=-(1/0),h=1/0,g=-(1/0);if(e.forEach(Eu),r=e[0],r.x=-r.r,r.y=0,t(r),c>1&&(u=e[1],u.x=u.r,u.y=0,t(u),c>2))for(i=e[2],zu(r,u,i),t(i),wu(r,i),r._pack_prev=i,wu(i,u),u=r._pack_next,a=3;c>a;a++){zu(r,u,i=e[a]);var p=0,v=1,d=1;for(o=u._pack_next;o!==u;o=o._pack_next,v++)if(ku(o,i)){p=1;break}if(1==p)for(l=r._pack_prev;l!==o._pack_prev&&!ku(l,i);l=l._pack_prev,d++);p?(d>v||v==d&&u.r<r.r?Su(r,u=o):Su(r=l,u),a--):(wu(r,i),u=i,t(i))}var m=(s+f)/2,y=(h+g)/2,M=0;for(a=0;c>a;a++)i=e[a],i.x-=m,i.y-=y,M=Math.max(M,i.r+Math.sqrt(i.x*i.x+i.y*i.y));n.r=M,e.forEach(Au)}}function Eu(n){n._pack_next=n._pack_prev=n}function Au(n){delete n._pack_next,delete n._pack_prev}function Cu(n,t,e,r){var u=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,u)for(var i=-1,a=u.length;++i<a;)Cu(u[i],t,e,r)}function zu(n,t,e){var r=n.r+e.r,u=t.x-n.x,i=t.y-n.y;if(r&&(u||i)){var a=t.r+e.r,o=u*u+i*i;a*=a,r*=r;var l=.5+(r-a)/(2*o),c=Math.sqrt(Math.max(0,2*a*(r+o)-(r-=o)*r-a*a))/(2*o);e.x=n.x+l*u+c*i,e.y=n.y+l*i-c*u}else e.x=n.x+r,e.y=n.y}function Lu(n,t){return n.parent==t.parent?1:2}function qu(n){var t=n.children;return t.length?t[0]:n.t}function Tu(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function Ru(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Du(n){for(var t,e=0,r=0,u=n.children,i=u.length;--i>=0;)t=u[i],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Pu(n,t,e){return n.a.parent===t.parent?n.a:e}function ju(n){return 1+oa.max(n,function(n){return n.y})}function Uu(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Fu(n){var t=n.children;return t&&t.length?Fu(t[0]):n}function Hu(n){var t,e=n.children;return e&&(t=e.length)?Hu(e[t-1]):n}function Ou(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Iu(n,t){var e=n.x+t[3],r=n.y+t[0],u=n.dx-t[1]-t[3],i=n.dy-t[0]-t[2];return 0>u&&(e+=u/2,u=0),0>i&&(r+=i/2,i=0),{x:e,y:r,dx:u,dy:i}}function Yu(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Zu(n){return n.rangeExtent?n.rangeExtent():Yu(n.range())}function Vu(n,t,e,r){var u=e(n[0],n[1]),i=r(t[0],t[1]);return function(n){return i(u(n))}}function Xu(n,t){var e,r=0,u=n.length-1,i=n[r],a=n[u];return i>a&&(e=r,r=u,u=e,e=i,i=a,a=e),n[r]=t.floor(i),n[u]=t.ceil(a),n}function $u(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:wl}function Bu(n,t,e,r){var u=[],i=[],a=0,o=Math.min(n.length,t.length)-1;for(n[o]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<=o;)u.push(e(n[a-1],n[a])),i.push(r(t[a-1],t[a]));return function(t){var e=oa.bisect(n,t,1,o)-1;return i[e](u[e](t))}}function Wu(n,t,e,r){function u(){var u=Math.min(n.length,t.length)>2?Bu:Vu,l=r?Wr:Br;return a=u(n,t,l,e),o=u(t,n,l,Mr),i}function i(n){return a(n)}var a,o;return i.invert=function(n){return o(n)},i.domain=function(t){return arguments.length?(n=t.map(Number),u()):n},i.range=function(n){return arguments.length?(t=n,u()):t},i.rangeRound=function(n){return i.range(n).interpolate(jr)},i.clamp=function(n){return arguments.length?(r=n,u()):r},i.interpolate=function(n){return arguments.length?(e=n,u()):e},i.ticks=function(t){return Qu(n,t)},i.tickFormat=function(t,e){return ni(n,t,e)},i.nice=function(t){return Gu(n,t),u()},i.copy=function(){return Wu(n,t,e,r)},u()}function Ju(n,t){return oa.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Gu(n,t){return Xu(n,$u(Ku(n,t)[2])),Xu(n,$u(Ku(n,t)[2])),n}function Ku(n,t){null==t&&(t=10);var e=Yu(n),r=e[1]-e[0],u=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),i=t/r*u;return.15>=i?u*=10:.35>=i?u*=5:.75>=i&&(u*=2),e[0]=Math.ceil(e[0]/u)*u,e[1]=Math.floor(e[1]/u)*u+.5*u,e[2]=u,e}function Qu(n,t){return oa.range.apply(oa,Ku(n,t))}function ni(n,t,e){var r=Ku(n,t);if(e){var u=so.exec(e);if(u.shift(),"s"===u[8]){var i=oa.formatPrefix(Math.max(Ma(r[0]),Ma(r[1])));return u[7]||(u[7]="."+ti(i.scale(r[2]))),u[8]="f",e=oa.format(u.join("")),function(n){return e(i.scale(n))+i.symbol}}u[7]||(u[7]="."+ei(u[8],r)),e=u.join("")}else e=",."+ti(r[2])+"f";return oa.format(e)}function ti(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function ei(n,t){var e=ti(t[2]);return n in Sl?Math.abs(e-ti(Math.max(Ma(t[0]),Ma(t[1]))))+ +("e"!==n):e-2*("%"===n)}function ri(n,t,e,r){function u(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function i(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function a(t){return n(u(t))}return a.invert=function(t){return i(n.invert(t))},a.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(u)),a):r},a.base=function(e){return arguments.length?(t=+e,n.domain(r.map(u)),a):t},a.nice=function(){var t=Xu(r.map(u),e?Math:Nl);return n.domain(t),r=t.map(i),a},a.ticks=function(){var n=Yu(r),a=[],o=n[0],l=n[1],c=Math.floor(u(o)),s=Math.ceil(u(l)),f=t%1?2:t;if(isFinite(s-c)){if(e){for(;s>c;c++)for(var h=1;f>h;h++)a.push(i(c)*h);a.push(i(c))}else for(a.push(i(c));c++<s;)for(var h=f-1;h>0;h--)a.push(i(c)*h);for(c=0;a[c]<o;c++);for(s=a.length;a[s-1]>l;s--);a=a.slice(c,s)}return a},a.tickFormat=function(n,e){if(!arguments.length)return kl;arguments.length<2?e=kl:"function"!=typeof e&&(e=oa.format(e));var r=Math.max(1,t*n/a.ticks().length);return function(n){var a=n/i(Math.round(u(n)));return t-.5>a*t&&(a*=t),r>=a?e(n):""}},a.copy=function(){return ri(n.copy(),t,e,r)},Ju(a,n)}function ui(n,t,e){function r(t){return n(u(t))}var u=ii(t),i=ii(1/t);return r.invert=function(t){return i(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(u)),r):e},r.ticks=function(n){return Qu(e,n)},r.tickFormat=function(n,t){return ni(e,n,t)},r.nice=function(n){return r.domain(Gu(e,n))},r.exponent=function(a){return arguments.length?(u=ii(t=a),i=ii(1/t),n.domain(e.map(u)),r):t},r.copy=function(){return ui(n.copy(),t,e)},Ju(r,n)}function ii(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function ai(n,t){function e(e){return i[((u.get(e)||("range"===t.t?u.set(e,n.push(e)):NaN))-1)%i.length]}function r(t,e){return oa.range(n.length).map(function(n){return t+e*n})}var u,i,a;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new c;for(var i,a=-1,o=r.length;++a<o;)u.has(i=r[a])||u.set(i,n.push(i));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(i=n,a=0,t={t:"range",a:arguments},e):i},e.rangePoints=function(u,o){arguments.length<2&&(o=0);var l=u[0],c=u[1],s=n.length<2?(l=(l+c)/2,0):(c-l)/(n.length-1+o);return i=r(l+s*o/2,s),a=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(u,o){arguments.length<2&&(o=0);var l=u[0],c=u[1],s=n.length<2?(l=c=Math.round((l+c)/2),0):(c-l)/(n.length-1+o)|0;return i=r(l+Math.round(s*o/2+(c-l-(n.length-1+o)*s)/2),s),a=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(u,o,l){arguments.length<2&&(o=0),arguments.length<3&&(l=o);var c=u[1]<u[0],s=u[c-0],f=u[1-c],h=(f-s)/(n.length-o+2*l);return i=r(s+h*l,h),c&&i.reverse(),a=h*(1-o),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(u,o,l){arguments.length<2&&(o=0),arguments.length<3&&(l=o);var c=u[1]<u[0],s=u[c-0],f=u[1-c],h=Math.floor((f-s)/(n.length-o+2*l));return i=r(s+Math.round((f-s-(n.length-o)*h)/2),h),c&&i.reverse(),a=Math.round(h*(1-o)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return a},e.rangeExtent=function(){return Yu(t.a[0])},e.copy=function(){return ai(n,t)},e.domain(n)}function oi(n,t){function i(){var e=0,r=t.length;for(o=[];++e<r;)o[e-1]=oa.quantile(n,e/r);return a}function a(n){return isNaN(n=+n)?void 0:t[oa.bisect(o,n)]}var o;return a.domain=function(t){return arguments.length?(n=t.map(r).filter(u).sort(e),i()):n},a.range=function(n){return arguments.length?(t=n,i()):t},a.quantiles=function(){return o},a.invertExtent=function(e){return e=t.indexOf(e),0>e?[NaN,NaN]:[e>0?o[e-1]:n[0],e<o.length?o[e]:n[n.length-1]]},a.copy=function(){return oi(n,t)},i()}function li(n,t,e){function r(t){return e[Math.max(0,Math.min(a,Math.floor(i*(t-n))))]}function u(){return i=e.length/(t-n),a=e.length-1,r}var i,a;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],u()):[n,t]},r.range=function(n){return arguments.length?(e=n,u()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?NaN:t/i+n,[t,t+1/i]},r.copy=function(){return li(n,t,e)},u()}function ci(n,t){function e(e){return e>=e?t[oa.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return ci(n,t)},e}function si(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Qu(n,t)},t.tickFormat=function(t,e){return ni(n,t,e)},t.copy=function(){return si(n)},t}function fi(){return 0}function hi(n){return n.innerRadius}function gi(n){return n.outerRadius}function pi(n){return n.startAngle}function vi(n){return n.endAngle}function di(n){return n&&n.padAngle}function mi(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function yi(n,t,e,r,u){var i=n[0]-t[0],a=n[1]-t[1],o=(u?r:-r)/Math.sqrt(i*i+a*a),l=o*a,c=-o*i,s=n[0]+l,f=n[1]+c,h=t[0]+l,g=t[1]+c,p=(s+h)/2,v=(f+g)/2,d=h-s,m=g-f,y=d*d+m*m,M=e-r,x=s*g-h*f,b=(0>m?-1:1)*Math.sqrt(Math.max(0,M*M*y-x*x)),_=(x*m-d*b)/y,w=(-x*d-m*b)/y,S=(x*m+d*b)/y,k=(-x*d+m*b)/y,N=_-p,E=w-v,A=S-p,C=k-v;return N*N+E*E>A*A+C*C&&(_=S,w=k),[[_-l,w-c],[_*e/M,w*e/M]]}function Mi(n){function t(t){function a(){c.push("M",i(n(s),o))}for(var l,c=[],s=[],f=-1,h=t.length,g=En(e),p=En(r);++f<h;)u.call(this,l=t[f],f)?s.push([+g.call(this,l,f),+p.call(this,l,f)]):s.length&&(a(),s=[]);return s.length&&a(),c.length?c.join(""):null}var e=Ce,r=ze,u=zt,i=xi,a=i.key,o=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(u=n,t):u},t.interpolate=function(n){return arguments.length?(a="function"==typeof n?i=n:(i=ql.get(n)||xi).key,t):a},t.tension=function(n){return arguments.length?(o=n,t):o},t}function xi(n){return n.length>1?n.join("L"):n+"Z"}function bi(n){return n.join("L")+"Z"}function _i(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&u.push("H",r[0]),u.join("")}function wi(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("V",(r=n[t])[1],"H",r[0]);return u.join("")}function Si(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r=n[t])[0],"V",r[1]);return u.join("")}function ki(n,t){return n.length<4?xi(n):n[1]+Ai(n.slice(1,-1),Ci(n,t))}function Ni(n,t){return n.length<3?bi(n):n[0]+Ai((n.push(n[0]),n),Ci([n[n.length-2]].concat(n,[n[1]]),t))}function Ei(n,t){return n.length<3?xi(n):n[0]+Ai(n,Ci(n,t))}function Ai(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return xi(n);var e=n.length!=t.length,r="",u=n[0],i=n[1],a=t[0],o=a,l=1;if(e&&(r+="Q"+(i[0]-2*a[0]/3)+","+(i[1]-2*a[1]/3)+","+i[0]+","+i[1],u=n[1],l=2),t.length>1){o=t[1],i=n[l],l++,r+="C"+(u[0]+a[0])+","+(u[1]+a[1])+","+(i[0]-o[0])+","+(i[1]-o[1])+","+i[0]+","+i[1];for(var c=2;c<t.length;c++,l++)i=n[l],o=t[c],r+="S"+(i[0]-o[0])+","+(i[1]-o[1])+","+i[0]+","+i[1]}if(e){var s=n[l];r+="Q"+(i[0]+2*o[0]/3)+","+(i[1]+2*o[1]/3)+","+s[0]+","+s[1]}return r}function Ci(n,t){for(var e,r=[],u=(1-t)/2,i=n[0],a=n[1],o=1,l=n.length;++o<l;)e=i,i=a,a=n[o],r.push([u*(a[0]-e[0]),u*(a[1]-e[1])]);return r}function zi(n){if(n.length<3)return xi(n);var t=1,e=n.length,r=n[0],u=r[0],i=r[1],a=[u,u,u,(r=n[1])[0]],o=[i,i,i,r[1]],l=[u,",",i,"L",Ri(Dl,a),",",Ri(Dl,o)];for(n.push(n[e-1]);++t<=e;)r=n[t],a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),Di(l,a,o);return n.pop(),l.push("L",r),l.join("")}function Li(n){if(n.length<4)return xi(n);for(var t,e=[],r=-1,u=n.length,i=[0],a=[0];++r<3;)t=n[r],i.push(t[0]),a.push(t[1]);for(e.push(Ri(Dl,i)+","+Ri(Dl,a)),--r;++r<u;)t=n[r],i.shift(),i.push(t[0]),a.shift(),a.push(t[1]),Di(e,i,a);return e.join("")}function qi(n){for(var t,e,r=-1,u=n.length,i=u+4,a=[],o=[];++r<4;)e=n[r%u],a.push(e[0]),o.push(e[1]);for(t=[Ri(Dl,a),",",Ri(Dl,o)],--r;++r<i;)e=n[r%u],a.shift(),a.push(e[0]),o.shift(),o.push(e[1]),Di(t,a,o);return t.join("")}function Ti(n,t){var e=n.length-1;if(e)for(var r,u,i=n[0][0],a=n[0][1],o=n[e][0]-i,l=n[e][1]-a,c=-1;++c<=e;)r=n[c],u=c/e,r[0]=t*r[0]+(1-t)*(i+u*o),r[1]=t*r[1]+(1-t)*(a+u*l);return zi(n)}function Ri(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Di(n,t,e){n.push("C",Ri(Tl,t),",",Ri(Tl,e),",",Ri(Rl,t),",",Ri(Rl,e),",",Ri(Dl,t),",",Ri(Dl,e))}function Pi(n,t){return(t[1]-n[1])/(t[0]-n[0])}function ji(n){for(var t=0,e=n.length-1,r=[],u=n[0],i=n[1],a=r[0]=Pi(u,i);++t<e;)r[t]=(a+(a=Pi(u=i,i=n[t+1])))/2;return r[t]=a,r}function Ui(n){for(var t,e,r,u,i=[],a=ji(n),o=-1,l=n.length-1;++o<l;)t=Pi(n[o],n[o+1]),Ma(t)<Da?a[o]=a[o+1]=0:(e=a[o]/t,r=a[o+1]/t,u=e*e+r*r,u>9&&(u=3*t/Math.sqrt(u),a[o]=u*e,a[o+1]=u*r));for(o=-1;++o<=l;)u=(n[Math.min(l,o+1)][0]-n[Math.max(0,o-1)][0])/(6*(1+a[o]*a[o])),i.push([u||0,a[o]*u||0]);return i}function Fi(n){return n.length<3?xi(n):n[0]+Ai(n,Ui(n))}function Hi(n){for(var t,e,r,u=-1,i=n.length;++u<i;)t=n[u],e=t[0],r=t[1]-Ha,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Oi(n){function t(t){function l(){v.push("M",o(n(m),f),s,c(n(d.reverse()),f),"Z")}for(var h,g,p,v=[],d=[],m=[],y=-1,M=t.length,x=En(e),b=En(u),_=e===r?function(){
return g}:En(r),w=u===i?function(){return p}:En(i);++y<M;)a.call(this,h=t[y],y)?(d.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),m.push([+_.call(this,h,y),+w.call(this,h,y)])):d.length&&(l(),d=[],m=[]);return d.length&&l(),v.length?v.join(""):null}var e=Ce,r=Ce,u=0,i=ze,a=zt,o=xi,l=o.key,c=o,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(u=i=n,t):i},t.y0=function(n){return arguments.length?(u=n,t):u},t.y1=function(n){return arguments.length?(i=n,t):i},t.defined=function(n){return arguments.length?(a=n,t):a},t.interpolate=function(n){return arguments.length?(l="function"==typeof n?o=n:(o=ql.get(n)||xi).key,c=o.reverse||o,s=o.closed?"M":"L",t):l},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Ii(n){return n.radius}function Yi(n){return[n.x,n.y]}function Zi(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Ha;return[e*Math.cos(r),e*Math.sin(r)]}}function Vi(){return 64}function Xi(){return"circle"}function $i(n){var t=Math.sqrt(n/ja);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Bi(n){return function(){var t,e,r;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,r.timer.t=NaN,--t.count?delete t[e]:delete this[n],t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}function Wi(n,t,e){return Sa(n,Il),n.namespace=t,n.id=e,n}function Ji(n,t,e,r){var u=n.id,i=n.namespace;return Y(n,"function"==typeof e?function(n,a,o){n[i][u].tween.set(t,r(e.call(n,n.__data__,a,o)))}:(e=r(e),function(n){n[i][u].tween.set(t,e)}))}function Gi(n){return null==n&&(n=""),function(){this.textContent=n}}function Ki(n){return null==n?"__transition__":"__transition_"+n+"__"}function Qi(n,t,e,r,u){function i(n){var t=v.delay;return s.t=t+l,n>=t?a(n-t):void(s.c=a)}function a(e){var u=p.active,i=p[u];i&&(i.timer.c=null,i.timer.t=NaN,--p.count,delete p[u],i.event&&i.event.interrupt.call(n,n.__data__,i.index));for(var a in p)if(r>+a){var c=p[a];c.timer.c=null,c.timer.t=NaN,--p.count,delete p[a]}s.c=o,qn(function(){return s.c&&o(e||1)&&(s.c=null,s.t=NaN),1},0,l),p.active=r,v.event&&v.event.start.call(n,n.__data__,t),g=[],v.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&g.push(r)}),h=v.ease,f=v.duration}function o(u){for(var i=u/f,a=h(i),o=g.length;o>0;)g[--o].call(n,a);return i>=1?(v.event&&v.event.end.call(n,n.__data__,t),--p.count?delete p[r]:delete n[e],1):void 0}var l,s,f,h,g,p=n[e]||(n[e]={active:0,count:0}),v=p[r];v||(l=u.time,s=qn(i,0,l),v=p[r]={tween:new c,time:l,timer:s,delay:u.delay,duration:u.duration,ease:u.ease,index:t},u=null,++p.count)}function na(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function ta(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function ea(n){return n.toISOString()}function ra(n,t,e){function r(t){return n(t)}function u(n,e){var r=n[1]-n[0],u=r/e,i=oa.bisect(Gl,u);return i==Gl.length?[t.year,Ku(n.map(function(n){return n/31536e6}),e)[2]]:i?t[u/Gl[i-1]<Gl[i]/u?i-1:i]:[nc,Ku(n,e)[2]]}return r.invert=function(t){return ua(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(ua)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,ua(+e+1),t).length}var i=r.domain(),a=Yu(i),o=null==n?u(a,10):"number"==typeof n&&u(a,n);return o&&(n=o[0],t=o[1]),r.domain(Xu(i,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=ua(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=ua(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Yu(r.domain()),i=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{range:n},t];return i&&(n=i[0],t=i[1]),n.range(e[0],ua(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return ra(n.copy(),t,e)},Ju(r,n)}function ua(n){return new Date(n)}function ia(n){return JSON.parse(n.responseText)}function aa(n){var t=sa.createRange();return t.selectNode(sa.body),t.createContextualFragment(n.responseText)}var oa={version:"3.5.12"},la=[].slice,ca=function(n){return la.call(n)},sa=this.document;if(sa)try{ca(sa.documentElement.childNodes)[0].nodeType}catch(fa){ca=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),sa)try{sa.createElement("DIV").style.setProperty("opacity",0,"")}catch(ha){var ga=this.Element.prototype,pa=ga.setAttribute,va=ga.setAttributeNS,da=this.CSSStyleDeclaration.prototype,ma=da.setProperty;ga.setAttribute=function(n,t){pa.call(this,n,t+"")},ga.setAttributeNS=function(n,t,e){va.call(this,n,t,e+"")},da.setProperty=function(n,t,e){ma.call(this,n,t+"",e)}}oa.ascending=e,oa.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:NaN},oa.min=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&e>r&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&e>r&&(e=r)}return e},oa.max=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&r>e&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&r>e&&(e=r)}return e},oa.extent=function(n,t){var e,r,u,i=-1,a=n.length;if(1===arguments.length){for(;++i<a;)if(null!=(r=n[i])&&r>=r){e=u=r;break}for(;++i<a;)null!=(r=n[i])&&(e>r&&(e=r),r>u&&(u=r))}else{for(;++i<a;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=u=r;break}for(;++i<a;)null!=(r=t.call(n,n[i],i))&&(e>r&&(e=r),r>u&&(u=r))}return[e,u]},oa.sum=function(n,t){var e,r=0,i=n.length,a=-1;if(1===arguments.length)for(;++a<i;)u(e=+n[a])&&(r+=e);else for(;++a<i;)u(e=+t.call(n,n[a],a))&&(r+=e);return r},oa.mean=function(n,t){var e,i=0,a=n.length,o=-1,l=a;if(1===arguments.length)for(;++o<a;)u(e=r(n[o]))?i+=e:--l;else for(;++o<a;)u(e=r(t.call(n,n[o],o)))?i+=e:--l;return l?i/l:void 0},oa.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),u=+n[r-1],i=e-r;return i?u+i*(n[r]-u):u},oa.median=function(n,t){var i,a=[],o=n.length,l=-1;if(1===arguments.length)for(;++l<o;)u(i=r(n[l]))&&a.push(i);else for(;++l<o;)u(i=r(t.call(n,n[l],l)))&&a.push(i);return a.length?oa.quantile(a.sort(e),.5):void 0},oa.variance=function(n,t){var e,i,a=n.length,o=0,l=0,c=-1,s=0;if(1===arguments.length)for(;++c<a;)u(e=r(n[c]))&&(i=e-o,o+=i/++s,l+=i*(e-o));else for(;++c<a;)u(e=r(t.call(n,n[c],c)))&&(i=e-o,o+=i/++s,l+=i*(e-o));return s>1?l/(s-1):void 0},oa.deviation=function(){var n=oa.variance.apply(this,arguments);return n?Math.sqrt(n):n};var ya=i(e);oa.bisectLeft=ya.left,oa.bisect=oa.bisectRight=ya.right,oa.bisector=function(n){return i(1===n.length?function(t,r){return e(n(t),r)}:n)},oa.shuffle=function(n,t,e){(i=arguments.length)<3&&(e=n.length,2>i&&(t=0));for(var r,u,i=e-t;i;)u=Math.random()*i--|0,r=n[i+t],n[i+t]=n[u+t],n[u+t]=r;return n},oa.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},oa.pairs=function(n){for(var t,e=0,r=n.length-1,u=n[0],i=new Array(0>r?0:r);r>e;)i[e]=[t=u,u=n[++e]];return i},oa.zip=function(){if(!(r=arguments.length))return[];for(var n=-1,t=oa.min(arguments,a),e=new Array(t);++n<t;)for(var r,u=-1,i=e[n]=new Array(r);++u<r;)i[u]=arguments[u][n];return e},oa.transpose=function(n){return oa.zip.apply(oa,n)},oa.keys=function(n){var t=[];for(var e in n)t.push(e);return t},oa.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},oa.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},oa.merge=function(n){for(var t,e,r,u=n.length,i=-1,a=0;++i<u;)a+=n[i].length;for(e=new Array(a);--u>=0;)for(r=n[u],t=r.length;--t>=0;)e[--a]=r[t];return e};var Ma=Math.abs;oa.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,u=[],i=o(Ma(e)),a=-1;if(n*=i,t*=i,e*=i,0>e)for(;(r=n+e*++a)>t;)u.push(r/i);else for(;(r=n+e*++a)<t;)u.push(r/i);return u},oa.map=function(n,t){var e=new c;if(n instanceof c)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,u=-1,i=n.length;if(1===arguments.length)for(;++u<i;)e.set(u,n[u]);else for(;++u<i;)e.set(t.call(n,r=n[u],u),r)}else for(var a in n)e.set(a,n[a]);return e};var xa="__proto__",ba="\x00";l(c,{has:h,get:function(n){return this._[s(n)]},set:function(n,t){return this._[s(n)]=t},remove:g,keys:p,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:f(t),value:this._[t]});return n},size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t),this._[t])}}),oa.nest=function(){function n(t,a,o){if(o>=i.length)return r?r.call(u,a):e?a.sort(e):a;for(var l,s,f,h,g=-1,p=a.length,v=i[o++],d=new c;++g<p;)(h=d.get(l=v(s=a[g])))?h.push(s):d.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,o))}):(s={},f=function(e,r){s[e]=n(t,r,o)}),d.forEach(f),s}function t(n,e){if(e>=i.length)return n;var r=[],u=a[e++];return n.forEach(function(n,u){r.push({key:n,values:t(u,e)})}),u?r.sort(function(n,t){return u(n.key,t.key)}):r}var e,r,u={},i=[],a=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(oa.map,e,0),0)},u.key=function(n){return i.push(n),u},u.sortKeys=function(n){return a[i.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},oa.set=function(n){var t=new m;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},l(m,{has:h,add:function(n){return this._[s(n+="")]=!0,n},remove:g,values:p,size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t))}}),oa.behavior={},oa.rebind=function(n,t){for(var e,r=1,u=arguments.length;++r<u;)n[e=arguments[r]]=M(n,t,t[e]);return n};var _a=["webkit","ms","moz","Moz","o","O"];oa.dispatch=function(){for(var n=new _,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=w(n);return n},_.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},oa.event=null,oa.requote=function(n){return n.replace(wa,"\\$&")};var wa=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,Sa={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},ka=function(n,t){return t.querySelector(n)},Na=function(n,t){return t.querySelectorAll(n)},Ea=function(n,t){var e=n.matches||n[x(n,"matchesSelector")];return(Ea=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(ka=function(n,t){return Sizzle(n,t)[0]||null},Na=Sizzle,Ea=Sizzle.matchesSelector),oa.selection=function(){return oa.select(sa.documentElement)};var Aa=oa.selection.prototype=[];Aa.select=function(n){var t,e,r,u,i=[];n=A(n);for(var a=-1,o=this.length;++a<o;){i.push(t=[]),t.parentNode=(r=this[a]).parentNode;for(var l=-1,c=r.length;++l<c;)(u=r[l])?(t.push(e=n.call(u,u.__data__,l,a)),e&&"__data__"in u&&(e.__data__=u.__data__)):t.push(null)}return E(i)},Aa.selectAll=function(n){var t,e,r=[];n=C(n);for(var u=-1,i=this.length;++u<i;)for(var a=this[u],o=-1,l=a.length;++o<l;)(e=a[o])&&(r.push(t=ca(n.call(e,e.__data__,o,u))),t.parentNode=e);return E(r)};var Ca={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};oa.ns={prefix:Ca,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),Ca.hasOwnProperty(e)?{space:Ca[e],local:n}:n}},Aa.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=oa.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(z(t,n[t]));return this}return this.each(z(n,t))},Aa.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=T(n)).length,u=-1;if(t=e.classList){for(;++u<r;)if(!t.contains(n[u]))return!1}else for(t=e.getAttribute("class");++u<r;)if(!q(n[u]).test(t))return!1;return!0}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},Aa.style=function(n,e,r){var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(e="");for(r in n)this.each(P(r,n[r],e));return this}if(2>u){var i=this.node();return t(i).getComputedStyle(i,null).getPropertyValue(n)}r=""}return this.each(P(n,e,r))},Aa.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(j(t,n[t]));return this}return this.each(j(n,t))},Aa.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Aa.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Aa.append=function(n){return n=U(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Aa.insert=function(n,t){return n=U(n),t=A(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},Aa.remove=function(){return this.each(F)},Aa.data=function(n,t){function e(n,e){var r,u,i,a=n.length,f=e.length,h=Math.min(a,f),g=new Array(f),p=new Array(f),v=new Array(a);if(t){var d,m=new c,y=new Array(a);for(r=-1;++r<a;)(u=n[r])&&(m.has(d=t.call(u,u.__data__,r))?v[r]=u:m.set(d,u),y[r]=d);for(r=-1;++r<f;)(u=m.get(d=t.call(e,i=e[r],r)))?u!==!0&&(g[r]=u,u.__data__=i):p[r]=H(i),m.set(d,!0);for(r=-1;++r<a;)r in y&&m.get(y[r])!==!0&&(v[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],i=e[r],u?(u.__data__=i,g[r]=u):p[r]=H(i);for(;f>r;++r)p[r]=H(e[r]);for(;a>r;++r)v[r]=n[r]}p.update=g,p.parentNode=g.parentNode=v.parentNode=n.parentNode,o.push(p),l.push(g),s.push(v)}var r,u,i=-1,a=this.length;if(!arguments.length){for(n=new Array(a=(r=this[0]).length);++i<a;)(u=r[i])&&(n[i]=u.__data__);return n}var o=Z([]),l=E([]),s=E([]);if("function"==typeof n)for(;++i<a;)e(r=this[i],n.call(r,r.parentNode.__data__,i));else for(;++i<a;)e(r=this[i],n);return l.enter=function(){return o},l.exit=function(){return s},l},Aa.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Aa.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,a=this.length;a>i;i++){u.push(t=[]),t.parentNode=(e=this[i]).parentNode;for(var o=0,l=e.length;l>o;o++)(r=e[o])&&n.call(r,r.__data__,o,i)&&t.push(r)}return E(u)},Aa.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],u=r.length-1,i=r[u];--u>=0;)(e=r[u])&&(i&&i!==e.nextSibling&&i.parentNode.insertBefore(e,i),i=e);return this},Aa.sort=function(n){n=I.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Aa.each=function(n){return Y(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Aa.call=function(n){var t=ca(arguments);return n.apply(t[0]=this,t),this},Aa.empty=function(){return!this.node()},Aa.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,u=e.length;u>r;r++){var i=e[r];if(i)return i}return null},Aa.size=function(){var n=0;return Y(this,function(){++n}),n};var za=[];oa.selection.enter=Z,oa.selection.enter.prototype=za,za.append=Aa.append,za.empty=Aa.empty,za.node=Aa.node,za.call=Aa.call,za.size=Aa.size,za.select=function(n){for(var t,e,r,u,i,a=[],o=-1,l=this.length;++o<l;){r=(u=this[o]).update,a.push(t=[]),t.parentNode=u.parentNode;for(var c=-1,s=u.length;++c<s;)(i=u[c])?(t.push(r[c]=e=n.call(u.parentNode,i.__data__,c,o)),e.__data__=i.__data__):t.push(null)}return E(a)},za.insert=function(n,t){return arguments.length<2&&(t=V(this)),Aa.insert.call(this,n,t)},oa.select=function(t){var e;return"string"==typeof t?(e=[ka(t,sa)],e.parentNode=sa.documentElement):(e=[t],e.parentNode=n(t)),E([e])},oa.selectAll=function(n){var t;return"string"==typeof n?(t=ca(Na(n,sa)),t.parentNode=sa.documentElement):(t=ca(n),t.parentNode=null),E([t])},Aa.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(X(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(X(n,t,e))};var La=oa.map({mouseenter:"mouseover",mouseleave:"mouseout"});sa&&La.forEach(function(n){"on"+n in sa&&La.remove(n)});var qa,Ta=0;oa.mouse=function(n){return J(n,k())};var Ra=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;oa.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=k().changedTouches),t)for(var r,u=0,i=t.length;i>u;++u)if((r=t[u]).identifier===e)return J(n,r)},oa.behavior.drag=function(){function n(){this.on("mousedown.drag",i).on("touchstart.drag",a)}function e(n,t,e,i,a){return function(){function o(){var n,e,r=t(h,v);r&&(n=r[0]-M[0],e=r[1]-M[1],p|=n|e,M=r,g({type:"drag",x:r[0]+c[0],y:r[1]+c[1],dx:n,dy:e}))}function l(){t(h,v)&&(m.on(i+d,null).on(a+d,null),y(p),g({type:"dragend"}))}var c,s=this,f=oa.event.target,h=s.parentNode,g=r.of(s,arguments),p=0,v=n(),d=".drag"+(null==v?"":"-"+v),m=oa.select(e(f)).on(i+d,o).on(a+d,l),y=W(f),M=t(h,v);u?(c=u.apply(s,arguments),c=[c.x-M[0],c.y-M[1]]):c=[0,0],g({type:"dragstart"})}}var r=N(n,"drag","dragstart","dragend"),u=null,i=e(b,oa.mouse,t,"mousemove","mouseup"),a=e(G,oa.touch,y,"touchmove","touchend");return n.origin=function(t){return arguments.length?(u=t,n):u},oa.rebind(n,r,"on")},oa.touches=function(n,t){return arguments.length<2&&(t=k().touches),t?ca(t).map(function(t){var e=J(n,t);return e.identifier=t.identifier,e}):[]};var Da=1e-6,Pa=Da*Da,ja=Math.PI,Ua=2*ja,Fa=Ua-Da,Ha=ja/2,Oa=ja/180,Ia=180/ja,Ya=Math.SQRT2,Za=2,Va=4;oa.interpolateZoom=function(n,t){var e,r,u=n[0],i=n[1],a=n[2],o=t[0],l=t[1],c=t[2],s=o-u,f=l-i,h=s*s+f*f;if(Pa>h)r=Math.log(c/a)/Ya,e=function(n){return[u+n*s,i+n*f,a*Math.exp(Ya*n*r)]};else{var g=Math.sqrt(h),p=(c*c-a*a+Va*h)/(2*a*Za*g),v=(c*c-a*a-Va*h)/(2*c*Za*g),d=Math.log(Math.sqrt(p*p+1)-p),m=Math.log(Math.sqrt(v*v+1)-v);r=(m-d)/Ya,e=function(n){var t=n*r,e=rn(d),o=a/(Za*g)*(e*un(Ya*t+d)-en(d));return[u+o*s,i+o*f,a*e/rn(Ya*t+d)]}}return e.duration=1e3*r,e},oa.behavior.zoom=function(){function n(n){n.on(L,f).on($a+".zoom",g).on("dblclick.zoom",p).on(R,h)}function e(n){return[(n[0]-k.x)/k.k,(n[1]-k.y)/k.k]}function r(n){return[n[0]*k.k+k.x,n[1]*k.k+k.y]}function u(n){k.k=Math.max(A[0],Math.min(A[1],n))}function i(n,t){t=r(t),k.x+=n[0]-t[0],k.y+=n[1]-t[1]}function a(t,e,r,a){t.__chart__={x:k.x,y:k.y,k:k.k},u(Math.pow(2,a)),i(d=e,r),t=oa.select(t),C>0&&(t=t.transition().duration(C)),t.call(n.event)}function o(){b&&b.domain(x.range().map(function(n){return(n-k.x)/k.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-k.y)/k.k}).map(_.invert))}function l(n){z++||n({type:"zoomstart"})}function c(n){o(),n({type:"zoom",scale:k.k,translate:[k.x,k.y]})}function s(n){--z||(n({type:"zoomend"}),d=null)}function f(){function n(){o=1,i(oa.mouse(u),h),c(a)}function r(){f.on(q,null).on(T,null),g(o),s(a)}var u=this,a=D.of(u,arguments),o=0,f=oa.select(t(u)).on(q,n).on(T,r),h=e(oa.mouse(u)),g=W(u);Ol.call(u),l(a)}function h(){function n(){var n=oa.touches(p);return g=k.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=e(n))}),n}function t(){var t=oa.event.target;oa.select(t).on(x,r).on(b,o),_.push(t);for(var e=oa.event.changedTouches,u=0,i=e.length;i>u;++u)d[e[u].identifier]=null;var l=n(),c=Date.now();if(1===l.length){if(500>c-M){var s=l[0];a(p,s,d[s.identifier],Math.floor(Math.log(k.k)/Math.LN2)+1),S()}M=c}else if(l.length>1){var s=l[0],f=l[1],h=s[0]-f[0],g=s[1]-f[1];m=h*h+g*g}}function r(){var n,t,e,r,a=oa.touches(p);Ol.call(p);for(var o=0,l=a.length;l>o;++o,r=null)if(e=a[o],r=d[e.identifier]){if(t)break;n=e,t=r}if(r){var s=(s=e[0]-n[0])*s+(s=e[1]-n[1])*s,f=m&&Math.sqrt(s/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+r[0])/2,(t[1]+r[1])/2],u(f*g)}M=null,i(n,t),c(v)}function o(){if(oa.event.touches.length){for(var t=oa.event.changedTouches,e=0,r=t.length;r>e;++e)delete d[t[e].identifier];for(var u in d)return void n()}oa.selectAll(_).on(y,null),w.on(L,f).on(R,h),N(),s(v)}var g,p=this,v=D.of(p,arguments),d={},m=0,y=".zoom-"+oa.event.changedTouches[0].identifier,x="touchmove"+y,b="touchend"+y,_=[],w=oa.select(p),N=W(p);t(),l(v),w.on(L,null).on(R,t)}function g(){var n=D.of(this,arguments);y?clearTimeout(y):(Ol.call(this),v=e(d=m||oa.mouse(this)),l(n)),y=setTimeout(function(){y=null,s(n)},50),S(),u(Math.pow(2,.002*Xa())*k.k),i(d,v),c(n)}function p(){var n=oa.mouse(this),t=Math.log(k.k)/Math.LN2;a(this,n,e(n),oa.event.shiftKey?Math.ceil(t)-1:Math.floor(t)+1)}var v,d,m,y,M,x,b,_,w,k={x:0,y:0,k:1},E=[960,500],A=Ba,C=250,z=0,L="mousedown.zoom",q="mousemove.zoom",T="mouseup.zoom",R="touchstart.zoom",D=N(n,"zoomstart","zoom","zoomend");return $a||($a="onwheel"in sa?(Xa=function(){return-oa.event.deltaY*(oa.event.deltaMode?120:1)},"wheel"):"onmousewheel"in sa?(Xa=function(){return oa.event.wheelDelta},"mousewheel"):(Xa=function(){return-oa.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=D.of(this,arguments),t=k;Fl?oa.select(this).transition().each("start.zoom",function(){k=this.__chart__||{x:0,y:0,k:1},l(n)}).tween("zoom:zoom",function(){var e=E[0],r=E[1],u=d?d[0]:e/2,i=d?d[1]:r/2,a=oa.interpolateZoom([(u-k.x)/k.k,(i-k.y)/k.k,e/k.k],[(u-t.x)/t.k,(i-t.y)/t.k,e/t.k]);return function(t){var r=a(t),o=e/r[2];this.__chart__=k={x:u-r[0]*o,y:i-r[1]*o,k:o},c(n)}}).each("interrupt.zoom",function(){s(n)}).each("end.zoom",function(){s(n)}):(this.__chart__=k,l(n),c(n),s(n))})},n.translate=function(t){return arguments.length?(k={x:+t[0],y:+t[1],k:k.k},o(),n):[k.x,k.y]},n.scale=function(t){return arguments.length?(k={x:k.x,y:k.y,k:null},u(+t),o(),n):k.k},n.scaleExtent=function(t){return arguments.length?(A=null==t?Ba:[+t[0],+t[1]],n):A},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(E=t&&[+t[0],+t[1]],n):E},n.duration=function(t){return arguments.length?(C=+t,n):C},n.x=function(t){return arguments.length?(b=t,x=t.copy(),k={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),k={x:0,y:0,k:1},n):w},oa.rebind(n,D,"on")};var Xa,$a,Ba=[0,1/0];oa.color=on,on.prototype.toString=function(){return this.rgb()+""},oa.hsl=ln;var Wa=ln.prototype=new on;Wa.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,this.l/n)},Wa.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,n*this.l)},Wa.rgb=function(){return cn(this.h,this.s,this.l)},oa.hcl=sn;var Ja=sn.prototype=new on;Ja.brighter=function(n){return new sn(this.h,this.c,Math.min(100,this.l+Ga*(arguments.length?n:1)))},Ja.darker=function(n){return new sn(this.h,this.c,Math.max(0,this.l-Ga*(arguments.length?n:1)))},Ja.rgb=function(){return fn(this.h,this.c,this.l).rgb()},oa.lab=hn;var Ga=18,Ka=.95047,Qa=1,no=1.08883,to=hn.prototype=new on;to.brighter=function(n){return new hn(Math.min(100,this.l+Ga*(arguments.length?n:1)),this.a,this.b)},to.darker=function(n){return new hn(Math.max(0,this.l-Ga*(arguments.length?n:1)),this.a,this.b)},to.rgb=function(){return gn(this.l,this.a,this.b)},oa.rgb=yn;var eo=yn.prototype=new on;eo.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,u=30;return t||e||r?(t&&u>t&&(t=u),e&&u>e&&(e=u),r&&u>r&&(r=u),new yn(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new yn(u,u,u)},eo.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new yn(n*this.r,n*this.g,n*this.b)},eo.hsl=function(){return wn(this.r,this.g,this.b)},eo.toString=function(){return"#"+bn(this.r)+bn(this.g)+bn(this.b)};var ro=oa.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});ro.forEach(function(n,t){ro.set(n,Mn(t))}),oa.functor=En,oa.xhr=An(y),oa.dsv=function(n,t){function e(n,e,i){arguments.length<3&&(i=e,e=null);var a=Cn(n,t,null==e?r:u(e),i);return a.row=function(n){return arguments.length?a.response(null==(e=n)?r:u(n)):e},a}function r(n){return e.parse(n.responseText)}function u(n){return function(t){return e.parse(t.responseText,n)}}function i(t){return t.map(a).join(n)}function a(n){return o.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var o=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var u=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(u(n),e)}:u})},e.parseRows=function(n,t){function e(){if(s>=c)return a;if(u)return u=!1,i;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(u=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(u=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),o=1;if(10===r)u=!0;else if(13===r)u=!0,10===n.charCodeAt(s)&&(++s,++o);else if(r!==l)continue;return n.slice(t,s-o)}return n.slice(t)}for(var r,u,i={},a={},o=[],c=n.length,s=0,f=0;(r=e())!==a;){for(var h=[];r!==i&&r!==a;)h.push(r),r=e();t&&null==(h=t(h,f++))||o.push(h)}return o},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new m,u=[];return t.forEach(function(n){for(var t in n)r.has(t)||u.push(r.add(t))}),[u.map(a).join(n)].concat(t.map(function(t){return u.map(function(n){return a(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(i).join("\n")},e},oa.csv=oa.dsv(",","text/csv"),oa.tsv=oa.dsv("	","text/tab-separated-values");var uo,io,ao,oo,lo=this[x(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};oa.timer=function(){qn.apply(this,arguments)},oa.timer.flush=function(){Rn(),Dn()},oa.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var co=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(jn);oa.formatPrefix=function(n,t){var e=0;return(n=+n)&&(0>n&&(n*=-1),t&&(n=oa.round(n,Pn(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),co[8+e/3]};var so=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,fo=oa.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=oa.round(n,Pn(n,t))).toFixed(Math.max(0,Math.min(20,Pn(n*(1+1e-15),t))))}}),ho=oa.time={},go=Date;Hn.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){po.setUTCDate.apply(this._,arguments)},setDay:function(){po.setUTCDay.apply(this._,arguments)},setFullYear:function(){po.setUTCFullYear.apply(this._,arguments)},setHours:function(){po.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){po.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){po.setUTCMinutes.apply(this._,arguments)},setMonth:function(){po.setUTCMonth.apply(this._,arguments)},setSeconds:function(){po.setUTCSeconds.apply(this._,arguments)},setTime:function(){po.setTime.apply(this._,arguments)}};var po=Date.prototype;ho.year=On(function(n){return n=ho.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ho.years=ho.year.range,ho.years.utc=ho.year.utc.range,ho.day=On(function(n){var t=new go(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ho.days=ho.day.range,ho.days.utc=ho.day.utc.range,ho.dayOfYear=function(n){var t=ho.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=ho[n]=On(function(n){return(n=ho.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ho.year(n).getDay();return Math.floor((ho.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ho[n+"s"]=e.range,ho[n+"s"].utc=e.utc.range,ho[n+"OfYear"]=function(n){var e=ho.year(n).getDay();return Math.floor((ho.dayOfYear(n)+(e+t)%7)/7)}}),ho.week=ho.sunday,ho.weeks=ho.sunday.range,ho.weeks.utc=ho.sunday.utc.range,ho.weekOfYear=ho.sundayOfYear;var vo={"-":"",_:" ",0:"0"},mo=/^\s*\d+/,yo=/^%/;oa.locale=function(n){return{numberFormat:Un(n),timeFormat:Yn(n)}};var Mo=oa.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});oa.format=Mo.numberFormat,oa.geo={},st.prototype={s:0,t:0,add:function(n){ft(n,this.t,xo),ft(xo.s,this.s,this),this.s?this.t+=xo.t:this.s=xo.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var xo=new st;oa.geo.stream=function(n,t){n&&bo.hasOwnProperty(n.type)?bo[n.type](n,t):ht(n,t)};var bo={Feature:function(n,t){ht(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,u=e.length;++r<u;)ht(e[r].geometry,t)}},_o={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){gt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)gt(e[r],t,0)},Polygon:function(n,t){pt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)pt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,u=e.length;++r<u;)ht(e[r],t)}};oa.geo.area=function(n){return wo=0,oa.geo.stream(n,ko),wo};var wo,So=new st,ko={sphere:function(){wo+=4*ja},point:b,lineStart:b,lineEnd:b,polygonStart:function(){So.reset(),ko.lineStart=vt},polygonEnd:function(){var n=2*So;wo+=0>n?4*ja+n:n,ko.lineStart=ko.lineEnd=ko.point=b}};oa.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=dt([t*Oa,e*Oa]);if(m){var u=yt(m,r),i=[u[1],-u[0],0],a=yt(i,u);bt(a),a=_t(a);var l=t-p,c=l>0?1:-1,v=a[0]*Ia*c,d=Ma(l)>180;if(d^(v>c*p&&c*t>v)){var y=a[1]*Ia;y>g&&(g=y)}else if(v=(v+360)%360-180,d^(v>c*p&&c*t>v)){var y=-a[1]*Ia;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t)}else n(t,e);m=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,m=null}function u(n,e){if(m){var r=n-p;y+=Ma(r)>180?r+(r>0?360:-360):r}else v=n,d=e;ko.point(n,e),t(n,e)}function i(){ko.lineStart()}function a(){u(v,d),ko.lineEnd(),Ma(y)>Da&&(s=-(h=180)),x[0]=s,x[1]=h,m=null}function o(n,t){return(t-=n)<0?t+360:t}function l(n,t){return n[0]-t[0]}function c(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,v,d,m,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=u,b.lineStart=i,b.lineEnd=a,y=0,ko.polygonStart()},polygonEnd:function(){ko.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>So?(s=-(h=180),f=-(g=90)):y>Da?g=90:-Da>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],oa.geo.stream(n,b);var t=M.length;if(t){M.sort(l);for(var e,r=1,u=M[0],i=[u];t>r;++r)e=M[r],c(e[0],u)||c(e[1],u)?(o(u[0],e[1])>o(u[0],u[1])&&(u[1]=e[1]),o(e[0],u[1])>o(u[0],u[1])&&(u[0]=e[0])):i.push(u=e);for(var a,e,p=-(1/0),t=i.length-1,r=0,u=i[t];t>=r;u=e,++r)e=i[r],(a=o(u[1],e[0]))>p&&(p=a,s=e[0],h=u[1])}return M=x=null,s===1/0||f===1/0?[[NaN,NaN],[NaN,NaN]]:[[s,f],[h,g]]}}(),oa.geo.centroid=function(n){No=Eo=Ao=Co=zo=Lo=qo=To=Ro=Do=Po=0,oa.geo.stream(n,jo);var t=Ro,e=Do,r=Po,u=t*t+e*e+r*r;return Pa>u&&(t=Lo,e=qo,r=To,Da>Eo&&(t=Ao,e=Co,r=zo),u=t*t+e*e+r*r,Pa>u)?[NaN,NaN]:[Math.atan2(e,t)*Ia,tn(r/Math.sqrt(u))*Ia]};var No,Eo,Ao,Co,zo,Lo,qo,To,Ro,Do,Po,jo={sphere:b,point:St,lineStart:Nt,lineEnd:Et,polygonStart:function(){jo.lineStart=At},polygonEnd:function(){jo.lineStart=Nt}},Uo=Rt(zt,Ut,Ht,[-ja,-ja/2]),Fo=1e9;oa.geo.clipExtent=function(){var n,t,e,r,u,i,a={stream:function(n){return u&&(u.valid=!1),u=i(n),u.valid=!0,u},extent:function(o){return arguments.length?(i=Zt(n=+o[0][0],t=+o[0][1],e=+o[1][0],r=+o[1][1]),u&&(u.valid=!1,u=null),a):[[n,t],[e,r]]}};return a.extent([[0,0],[960,500]])},(oa.geo.conicEqualArea=function(){return Vt(Xt)}).raw=Xt,oa.geo.albers=function(){return oa.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},oa.geo.albersUsa=function(){function n(n){var i=n[0],a=n[1];return t=null,e(i,a),t||(r(i,a),t)||u(i,a),t}var t,e,r,u,i=oa.geo.albers(),a=oa.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),o=oa.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=i.scale(),e=i.translate(),r=(n[0]-e[0])/t,u=(n[1]-e[1])/t;return(u>=.12&&.234>u&&r>=-.425&&-.214>r?a:u>=.166&&.234>u&&r>=-.214&&-.115>r?o:i).invert(n)},n.stream=function(n){var t=i.stream(n),e=a.stream(n),r=o.stream(n);return{point:function(n,u){t.point(n,u),e.point(n,u),r.point(n,u)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(i.precision(t),a.precision(t),o.precision(t),n):i.precision()},n.scale=function(t){return arguments.length?(i.scale(t),a.scale(.35*t),o.scale(t),n.translate(i.translate())):i.scale()},n.translate=function(t){if(!arguments.length)return i.translate();var c=i.scale(),s=+t[0],f=+t[1];return e=i.translate(t).clipExtent([[s-.455*c,f-.238*c],[s+.455*c,f+.238*c]]).stream(l).point,r=a.translate([s-.307*c,f+.201*c]).clipExtent([[s-.425*c+Da,f+.12*c+Da],[s-.214*c-Da,f+.234*c-Da]]).stream(l).point,u=o.translate([s-.205*c,f+.212*c]).clipExtent([[s-.214*c+Da,f+.166*c+Da],[s-.115*c-Da,f+.234*c-Da]]).stream(l).point,n},n.scale(1070)};var Ho,Oo,Io,Yo,Zo,Vo,Xo={point:b,lineStart:b,lineEnd:b,polygonStart:function(){Oo=0,Xo.lineStart=$t},polygonEnd:function(){Xo.lineStart=Xo.lineEnd=Xo.point=b,Ho+=Ma(Oo/2)}},$o={point:Bt,lineStart:b,lineEnd:b,polygonStart:b,polygonEnd:b},Bo={point:Gt,lineStart:Kt,lineEnd:Qt,polygonStart:function(){Bo.lineStart=ne},polygonEnd:function(){Bo.point=Gt,Bo.lineStart=Kt,Bo.lineEnd=Qt}};oa.geo.path=function(){function n(n){return n&&("function"==typeof o&&i.pointRadius(+o.apply(this,arguments)),a&&a.valid||(a=u(i)),oa.geo.stream(n,a)),i.result()}function t(){return a=null,n}var e,r,u,i,a,o=4.5;return n.area=function(n){return Ho=0,oa.geo.stream(n,u(Xo)),Ho},n.centroid=function(n){return Ao=Co=zo=Lo=qo=To=Ro=Do=Po=0,oa.geo.stream(n,u(Bo)),Po?[Ro/Po,Do/Po]:To?[Lo/To,qo/To]:zo?[Ao/zo,Co/zo]:[NaN,NaN]},n.bounds=function(n){return Zo=Vo=-(Io=Yo=1/0),oa.geo.stream(n,u($o)),[[Io,Yo],[Zo,Vo]]},n.projection=function(n){return arguments.length?(u=(e=n)?n.stream||re(n):y,t()):e},n.context=function(n){return arguments.length?(i=null==(r=n)?new Wt:new te(n),"function"!=typeof o&&i.pointRadius(o),t()):r},n.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(i.pointRadius(+t),+t),n):o},n.projection(oa.geo.albersUsa()).context(null)},oa.geo.transform=function(n){return{stream:function(t){var e=new ue(t);for(var r in n)e[r]=n[r];return e}}},ue.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},oa.geo.projection=ae,oa.geo.projectionMutator=oe,(oa.geo.equirectangular=function(){return ae(ce)}).raw=ce.invert=ce,oa.geo.rotation=function(n){function t(t){return t=n(t[0]*Oa,t[1]*Oa),t[0]*=Ia,t[1]*=Ia,t}return n=fe(n[0]%360*Oa,n[1]*Oa,n.length>2?n[2]*Oa:0),t.invert=function(t){return t=n.invert(t[0]*Oa,t[1]*Oa),t[0]*=Ia,t[1]*=Ia,t},t},se.invert=ce,oa.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=fe(-n[0]*Oa,-n[1]*Oa,0).invert,u=[];return e(null,null,1,{point:function(n,e){u.push(n=t(n,e)),n[0]*=Ia,n[1]*=Ia}}),{type:"Polygon",coordinates:[u]}}var t,e,r=[0,0],u=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=ve((t=+r)*Oa,u*Oa),n):t},n.precision=function(r){return arguments.length?(e=ve(t*Oa,(u=+r)*Oa),n):u},n.angle(90)},oa.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Oa,u=n[1]*Oa,i=t[1]*Oa,a=Math.sin(r),o=Math.cos(r),l=Math.sin(u),c=Math.cos(u),s=Math.sin(i),f=Math.cos(i);return Math.atan2(Math.sqrt((e=f*a)*e+(e=c*s-l*f*o)*e),l*s+c*f*o)},oa.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return oa.range(Math.ceil(i/d)*d,u,d).map(h).concat(oa.range(Math.ceil(c/m)*m,l,m).map(g)).concat(oa.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Ma(n%d)>Da}).map(s)).concat(oa.range(Math.ceil(o/v)*v,a,v).filter(function(n){return Ma(n%m)>Da}).map(f))}var e,r,u,i,a,o,l,c,s,f,h,g,p=10,v=p,d=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(i).concat(g(l).slice(1),h(u).reverse().slice(1),g(c).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(i=+t[0][0],u=+t[1][0],c=+t[0][1],l=+t[1][1],i>u&&(t=i,i=u,u=t),c>l&&(t=c,c=l,l=t),n.precision(y)):[[i,c],[u,l]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],o=+t[0][1],a=+t[1][1],r>e&&(t=r,r=e,e=t),o>a&&(t=o,o=a,a=t),n.precision(y)):[[r,o],[e,a]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],m=+t[1],n):[d,m]},n.minorStep=function(t){return arguments.length?(p=+t[0],v=+t[1],n):[p,v]},n.precision=function(t){return arguments.length?(y=+t,s=me(o,a,90),f=ye(r,e,y),h=me(c,l,90),g=ye(i,u,y),n):y},n.majorExtent([[-180,-90+Da],[180,90-Da]]).minorExtent([[-180,-80-Da],[180,80+Da]])},oa.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||u.apply(this,arguments)]}}var t,e,r=Me,u=xe;return n.distance=function(){return oa.geo.distance(t||r.apply(this,arguments),e||u.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(u=t,e="function"==typeof t?null:t,n):u},n.precision=function(){return arguments.length?n:0},n},oa.geo.interpolate=function(n,t){return be(n[0]*Oa,n[1]*Oa,t[0]*Oa,t[1]*Oa)},oa.geo.length=function(n){return Wo=0,oa.geo.stream(n,Jo),Wo};var Wo,Jo={sphere:b,point:b,lineStart:_e,lineEnd:b,polygonStart:b,polygonEnd:b},Go=we(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(oa.geo.azimuthalEqualArea=function(){return ae(Go)}).raw=Go;var Ko=we(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},y);(oa.geo.azimuthalEquidistant=function(){return ae(Ko)}).raw=Ko,(oa.geo.conicConformal=function(){return Vt(Se)}).raw=Se,(oa.geo.conicEquidistant=function(){return Vt(ke)}).raw=ke;var Qo=we(function(n){return 1/n},Math.atan);(oa.geo.gnomonic=function(){return ae(Qo)}).raw=Qo,Ne.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ha]},(oa.geo.mercator=function(){return Ee(Ne)}).raw=Ne;var nl=we(function(){return 1},Math.asin);(oa.geo.orthographic=function(){return ae(nl)}).raw=nl;var tl=we(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(oa.geo.stereographic=function(){return ae(tl)}).raw=tl,Ae.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Ha]},(oa.geo.transverseMercator=function(){var n=Ee(Ae),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Ae,oa.geom={},oa.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,u=En(e),i=En(r),a=n.length,o=[],l=[];for(t=0;a>t;t++)o.push([+u.call(this,n[t],t),+i.call(this,n[t],t),t]);for(o.sort(qe),t=0;a>t;t++)l.push([o[t][0],-o[t][1]]);var c=Le(o),s=Le(l),f=s[0]===c[0],h=s[s.length-1]===c[c.length-1],g=[];for(t=c.length-1;t>=0;--t)g.push(n[o[c[t]][2]]);for(t=+f;t<s.length-h;++t)g.push(n[o[s[t]][2]]);return g}var e=Ce,r=ze;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},oa.geom.polygon=function(n){return Sa(n,el),n};var el=oa.geom.polygon.prototype=[];el.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],u=0;++t<e;)n=r,r=this[t],u+=n[1]*r[0]-n[0]*r[1];return.5*u},el.centroid=function(n){var t,e,r=-1,u=this.length,i=0,a=0,o=this[u-1];for(arguments.length||(n=-1/(6*this.area()));++r<u;)t=o,o=this[r],e=t[0]*o[1]-o[0]*t[1],i+=(t[0]+o[0])*e,a+=(t[1]+o[1])*e;return[i*n,a*n]},el.clip=function(n){for(var t,e,r,u,i,a,o=De(n),l=-1,c=this.length-De(this),s=this[c-1];++l<c;){for(t=n.slice(),n.length=0,u=this[l],i=t[(r=t.length-o)-1],e=-1;++e<r;)a=t[e],Te(a,s,u)?(Te(i,s,u)||n.push(Re(i,a,s,u)),n.push(a)):Te(i,s,u)&&n.push(Re(i,a,s,u)),i=a;o&&n.push(n[0]),s=u}return n};var rl,ul,il,al,ol,ll=[],cl=[];Ye.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(Ve),t.length},tr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},er.prototype={insert:function(n,t){var e,r,u;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=ar(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(u=r.R,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.R&&(ur(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ir(this,r))):(u=r.L,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.L&&(ir(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ur(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,u=n.U,i=n.L,a=n.R;if(e=i?a?ar(a):i:a,u?u.L===n?u.L=e:u.R=e:this._=e,i&&a?(r=e.C,e.C=n.C,e.L=i,i.U=e,e!==a?(u=e.U,e.U=n.U,n=e.R,u.L=n,e.R=a,a.U=e):(e.U=u,u=e,n=e.R)):(r=n.C,n=e),n&&(n.U=u),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===u.L){if(t=u.R,t.C&&(t.C=!1,u.C=!0,ur(this,u),t=u.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,ir(this,t),t=u.R),t.C=u.C,u.C=t.R.C=!1,ur(this,u),n=this._;break}}else if(t=u.L,t.C&&(t.C=!1,u.C=!0,ir(this,u),t=u.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,ur(this,t),t=u.L),t.C=u.C,u.C=t.L.C=!1,ir(this,u),n=this._;break}t.C=!0,n=u,u=u.U}while(!n.C);n&&(n.C=!1)}}},oa.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=o[0][0],u=o[0][1],i=o[1][0],a=o[1][1];return or(e(n),o).cells.forEach(function(e,o){var l=e.edges,c=e.site,s=t[o]=l.length?l.map(function(n){var t=n.start();return[t.x,t.y]}):c.x>=r&&c.x<=i&&c.y>=u&&c.y<=a?[[r,a],[i,a],[i,u],[r,u]]:[];s.point=n[o]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(i(n,t)/Da)*Da,y:Math.round(a(n,t)/Da)*Da,i:t}})}var r=Ce,u=ze,i=r,a=u,o=sl;return n?t(n):(t.links=function(n){return or(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return or(e(n)).cells.forEach(function(e,r){for(var u,i,a=e.site,o=e.edges.sort(Ve),l=-1,c=o.length,s=o[c-1].edge,f=s.l===a?s.r:s.l;++l<c;)u=s,i=f,s=o[l].edge,f=s.l===a?s.r:s.l,r<i.i&&r<f.i&&cr(a,i,f)<0&&t.push([n[r],n[i.i],n[f.i]])}),t},t.x=function(n){return arguments.length?(i=En(r=n),t):r},t.y=function(n){return arguments.length?(a=En(u=n),t):u},t.clipExtent=function(n){return arguments.length?(o=null==n?sl:n,t):o===sl?null:o},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):o===sl?null:o&&o[1]},t)};var sl=[[-1e6,-1e6],[1e6,1e6]];oa.geom.delaunay=function(n){return oa.geom.voronoi().triangles(n)},oa.geom.quadtree=function(n,t,e,r,u){function i(n){function i(n,t,e,r,u,i,a,o){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var l=n.x,s=n.y;if(null!=l)if(Ma(l-e)+Ma(s-r)<.01)c(n,t,e,r,u,i,a,o);else{var f=n.point;n.x=n.y=n.point=null,c(n,f,l,s,u,i,a,o),c(n,t,e,r,u,i,a,o)}else n.x=e,n.y=r,n.point=t}else c(n,t,e,r,u,i,a,o)}function c(n,t,e,r,u,a,o,l){var c=.5*(u+o),s=.5*(a+l),f=e>=c,h=r>=s,g=h<<1|f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=hr()),f?u=c:o=c,h?a=s:l=s,i(n,t,e,r,u,a,o,l)}var s,f,h,g,p,v,d,m,y,M=En(o),x=En(l);if(null!=t)v=t,d=e,m=r,y=u;else if(m=y=-(v=d=1/0),f=[],h=[],p=n.length,a)for(g=0;p>g;++g)s=n[g],s.x<v&&(v=s.x),s.y<d&&(d=s.y),s.x>m&&(m=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);v>b&&(v=b),d>_&&(d=_),b>m&&(m=b),_>y&&(y=_),f.push(b),h.push(_)}var w=m-v,S=y-d;w>S?y=d+w:m=v+S;var k=hr();if(k.add=function(n){i(k,n,+M(n,++g),+x(n,g),v,d,m,y)},k.visit=function(n){gr(n,k,v,d,m,y)},k.find=function(n){return pr(k,n[0],n[1],v,d,m,y)},g=-1,null==t){for(;++g<p;)i(k,n[g],f[g],h[g],v,d,m,y);--g}else n.forEach(k.add);return f=h=n=s=null,k}var a,o=Ce,l=ze;return(a=arguments.length)?(o=sr,l=fr,3===a&&(u=e,r=t,e=t=0),i(n)):(i.x=function(n){return arguments.length?(o=n,i):o},i.y=function(n){return arguments.length?(l=n,i):l},i.extent=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],u=+n[1][1]),i):null==t?null:[[t,e],[r,u]]},i.size=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=e=0,r=+n[0],u=+n[1]),i):null==t?null:[r-t,u-e]},i)},oa.interpolateRgb=vr,oa.interpolateObject=dr,oa.interpolateNumber=mr,oa.interpolateString=yr;var fl=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,hl=new RegExp(fl.source,"g");oa.interpolate=Mr,oa.interpolators=[function(n,t){var e=typeof t;return("string"===e?ro.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?vr:yr:t instanceof on?vr:Array.isArray(t)?xr:"object"===e&&isNaN(t)?dr:mr)(n,t)}],oa.interpolateArray=xr;var gl=function(){return y},pl=oa.map({linear:gl,poly:Er,quad:function(){return Sr},cubic:function(){return kr},sin:function(){return Ar},exp:function(){return Cr},circle:function(){return zr},elastic:Lr,back:qr,bounce:function(){return Tr}}),vl=oa.map({"in":y,out:_r,"in-out":wr,"out-in":function(n){return wr(_r(n))}});oa.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=pl.get(e)||gl,r=vl.get(r)||y,br(r(e.apply(null,la.call(arguments,1))))},oa.interpolateHcl=Rr,oa.interpolateHsl=Dr,oa.interpolateLab=Pr,oa.interpolateRound=jr,oa.transform=function(n){var t=sa.createElementNS(oa.ns.prefix.svg,"g");return(oa.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Ur(e?e.matrix:dl)})(n)},Ur.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var dl={a:1,b:0,c:0,d:1,e:0,f:0};oa.interpolateTransform=$r,oa.layout={},oa.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},oa.layout.chord=function(){function n(){var n,c,f,h,g,p={},v=[],d=oa.range(i),m=[];for(e=[],r=[],n=0,h=-1;++h<i;){for(c=0,g=-1;++g<i;)c+=u[h][g];v.push(c),m.push(oa.range(i)),n+=c}for(a&&d.sort(function(n,t){return a(v[n],v[t])}),o&&m.forEach(function(n,t){n.sort(function(n,e){return o(u[t][n],u[t][e])})}),n=(Ua-s*i)/n,c=0,h=-1;++h<i;){for(f=c,g=-1;++g<i;){var y=d[h],M=m[y][g],x=u[y][M],b=c,_=c+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:c,value:v[y]},c+=s}for(h=-1;++h<i;)for(g=h-1;++g<i;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}l&&t()}function t(){e.sort(function(n,t){return l((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,u,i,a,o,l,c={},s=0;return c.matrix=function(n){return arguments.length?(i=(u=n)&&u.length,e=r=null,c):u},c.padding=function(n){return arguments.length?(s=n,e=r=null,c):s},c.sortGroups=function(n){return arguments.length?(a=n,e=r=null,c):a},c.sortSubgroups=function(n){return arguments.length?(o=n,e=null,c):o},c.sortChords=function(n){return arguments.length?(l=n,e&&t(),c):l},c.chords=function(){return e||n(),e},c.groups=function(){return r||n(),r},c},oa.layout.force=function(){function n(n){return function(t,e,r,u){if(t.point!==n){var i=t.cx-n.x,a=t.cy-n.y,o=u-e,l=i*i+a*a;if(l>o*o/m){if(v>l){var c=t.charge/l;n.px-=i*c,n.py-=a*c}return!0}if(t.point&&l&&v>l){var c=t.pointCharge/l;n.px-=i*c,n.py-=a*c}}return!t.charge}}function t(n){n.px=oa.event.x,n.py=oa.event.y,l.resume()}var e,r,u,i,a,o,l={},c=oa.dispatch("start","tick","end"),s=[1,1],f=.9,h=ml,g=yl,p=-30,v=Ml,d=.1,m=.64,M=[],x=[];return l.tick=function(){if((u*=.99)<.005)return e=null,c.end({type:"end",alpha:u=0}),!0;var t,r,l,h,g,v,m,y,b,_=M.length,w=x.length;for(r=0;w>r;++r)l=x[r],h=l.source,g=l.target,y=g.x-h.x,b=g.y-h.y,(v=y*y+b*b)&&(v=u*a[r]*((v=Math.sqrt(v))-i[r])/v,y*=v,b*=v,g.x-=y*(m=h.weight+g.weight?h.weight/(h.weight+g.weight):.5),g.y-=b*m,h.x+=y*(m=1-m),h.y+=b*m);if((m=u*d)&&(y=s[0]/2,b=s[1]/2,r=-1,m))for(;++r<_;)l=M[r],l.x+=(y-l.x)*m,l.y+=(b-l.y)*m;if(p)for(ru(t=oa.geom.quadtree(M),u,o),r=-1;++r<_;)(l=M[r]).fixed||t.visit(n(l));for(r=-1;++r<_;)l=M[r],l.fixed?(l.x=l.px,l.y=l.py):(l.x-=(l.px-(l.px=l.x))*f,l.y-=(l.py-(l.py=l.y))*f);c.tick({type:"tick",alpha:u})},l.nodes=function(n){return arguments.length?(M=n,l):M},l.links=function(n){return arguments.length?(x=n,l):x},l.size=function(n){return arguments.length?(s=n,l):s},l.linkDistance=function(n){return arguments.length?(h="function"==typeof n?n:+n,l):h},l.distance=l.linkDistance,l.linkStrength=function(n){return arguments.length?(g="function"==typeof n?n:+n,l):g},l.friction=function(n){return arguments.length?(f=+n,l):f},l.charge=function(n){return arguments.length?(p="function"==typeof n?n:+n,l):p},l.chargeDistance=function(n){return arguments.length?(v=n*n,l):Math.sqrt(v)},l.gravity=function(n){return arguments.length?(d=+n,l):d},l.theta=function(n){return arguments.length?(m=n*n,l):Math.sqrt(m)},l.alpha=function(n){return arguments.length?(n=+n,u?n>0?u=n:(e.c=null,e.t=NaN,e=null,c.end({type:"end",alpha:u=0})):n>0&&(c.start({type:"start",alpha:u=n}),e=qn(l.tick)),l):u},l.start=function(){function n(n,r){if(!e){for(e=new Array(u),l=0;u>l;++l)e[l]=[];for(l=0;c>l;++l){var i=x[l];e[i.source.index].push(i.target),e[i.target.index].push(i.source)}}for(var a,o=e[t],l=-1,s=o.length;++l<s;)if(!isNaN(a=o[l][n]))return a;return Math.random()*r}var t,e,r,u=M.length,c=x.length,f=s[0],v=s[1];for(t=0;u>t;++t)(r=M[t]).index=t,r.weight=0;for(t=0;c>t;++t)r=x[t],"number"==typeof r.source&&(r.source=M[r.source]),"number"==typeof r.target&&(r.target=M[r.target]),++r.source.weight,++r.target.weight;for(t=0;u>t;++t)r=M[t],isNaN(r.x)&&(r.x=n("x",f)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(i=[],"function"==typeof h)for(t=0;c>t;++t)i[t]=+h.call(this,x[t],t);else for(t=0;c>t;++t)i[t]=h;if(a=[],"function"==typeof g)for(t=0;c>t;++t)a[t]=+g.call(this,x[t],t);else for(t=0;c>t;++t)a[t]=g;if(o=[],"function"==typeof p)for(t=0;u>t;++t)o[t]=+p.call(this,M[t],t);else for(t=0;u>t;++t)o[t]=p;return l.resume()},l.resume=function(){return l.alpha(.1)},l.stop=function(){return l.alpha(0)},l.drag=function(){return r||(r=oa.behavior.drag().origin(y).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",nu)),arguments.length?void this.on("mouseover.force",tu).on("mouseout.force",eu).call(r):r},oa.rebind(l,c,"on")};var ml=20,yl=1,Ml=1/0;oa.layout.hierarchy=function(){function n(u){var i,a=[u],o=[];for(u.depth=0;null!=(i=a.pop());)if(o.push(i),(c=e.call(n,i,i.depth))&&(l=c.length)){for(var l,c,s;--l>=0;)a.push(s=c[l]),s.parent=i,s.depth=i.depth+1;r&&(i.value=0),i.children=c}else r&&(i.value=+r.call(n,i,i.depth)||0),delete i.children;return au(u,function(n){var e,u;t&&(e=n.children)&&e.sort(t),r&&(u=n.parent)&&(u.value+=n.value)}),o}var t=cu,e=ou,r=lu;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(iu(t,function(n){n.children&&(n.value=0)}),au(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},oa.layout.partition=function(){function n(t,e,r,u){var i=t.children;if(t.x=e,t.y=t.depth*u,t.dx=r,t.dy=u,i&&(a=i.length)){var a,o,l,c=-1;for(r=t.value?r/t.value:0;++c<a;)n(o=i[c],e,l=o.value*r,u),e+=l}}function t(n){var e=n.children,r=0;if(e&&(u=e.length))for(var u,i=-1;++i<u;)r=Math.max(r,t(e[i]));return 1+r}function e(e,i){var a=r.call(this,e,i);return n(a[0],0,u[0],u[1]/t(a[0])),a}var r=oa.layout.hierarchy(),u=[1,1];return e.size=function(n){return arguments.length?(u=n,e):u},uu(e,r)},oa.layout.pie=function(){function n(a){var o,l=a.length,c=a.map(function(e,r){return+t.call(n,e,r)}),s=+("function"==typeof r?r.apply(this,arguments):r),f=("function"==typeof u?u.apply(this,arguments):u)-s,h=Math.min(Math.abs(f)/l,+("function"==typeof i?i.apply(this,arguments):i)),g=h*(0>f?-1:1),p=oa.sum(c),v=p?(f-l*g)/p:0,d=oa.range(l),m=[];return null!=e&&d.sort(e===xl?function(n,t){return c[t]-c[n]}:function(n,t){return e(a[n],a[t])}),d.forEach(function(n){m[n]={data:a[n],value:o=c[n],startAngle:s,endAngle:s+=o*v+g,padAngle:h}}),m}var t=Number,e=xl,r=0,u=Ua,i=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(u=t,n):u},n.padAngle=function(t){return arguments.length?(i=t,n):i},n};var xl={};oa.layout.stack=function(){function n(o,l){if(!(h=o.length))return o;var c=o.map(function(e,r){return t.call(n,e,r)}),s=c.map(function(t){return t.map(function(t,e){return[i.call(n,t,e),a.call(n,t,e)]})}),f=e.call(n,s,l);c=oa.permute(c,f),s=oa.permute(s,f);var h,g,p,v,d=r.call(n,s,l),m=c[0].length;for(p=0;m>p;++p)for(u.call(n,c[0][p],v=d[p],s[0][p][1]),g=1;h>g;++g)u.call(n,c[g][p],v+=s[g-1][p][1],s[g][p][1]);return o}var t=y,e=pu,r=vu,u=gu,i=fu,a=hu;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:bl.get(t)||pu,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:_l.get(t)||vu,n):r},n.x=function(t){return arguments.length?(i=t,n):i},n.y=function(t){return arguments.length?(a=t,n):a},n.out=function(t){return arguments.length?(u=t,n):u},n};var bl=oa.map({"inside-out":function(n){var t,e,r=n.length,u=n.map(du),i=n.map(mu),a=oa.range(r).sort(function(n,t){return u[n]-u[t]}),o=0,l=0,c=[],s=[];for(t=0;r>t;++t)e=a[t],l>o?(o+=i[e],c.push(e)):(l+=i[e],s.push(e));return s.reverse().concat(c)},reverse:function(n){return oa.range(n.length).reverse()},"default":pu}),_l=oa.map({silhouette:function(n){var t,e,r,u=n.length,i=n[0].length,a=[],o=0,l=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];r>o&&(o=r),a.push(r)}for(e=0;i>e;++e)l[e]=(o-a[e])/2;return l},wiggle:function(n){var t,e,r,u,i,a,o,l,c,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=l=c=0,e=1;h>e;++e){for(t=0,u=0;s>t;++t)u+=n[t][e][1];for(t=0,i=0,o=f[e][0]-f[e-1][0];s>t;++t){for(r=0,a=(n[t][e][1]-n[t][e-1][1])/(2*o);t>r;++r)a+=(n[r][e][1]-n[r][e-1][1])/o;i+=a*n[t][e][1]}g[e]=l-=u?i/u*o:0,c>l&&(c=l)}for(e=0;h>e;++e)g[e]-=c;return g},expand:function(n){var t,e,r,u=n.length,i=n[0].length,a=1/u,o=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];if(r)for(t=0;u>t;t++)n[t][e][1]/=r;else for(t=0;u>t;t++)n[t][e][1]=a}for(e=0;i>e;++e)o[e]=0;return o},zero:vu});oa.layout.histogram=function(){function n(n,i){for(var a,o,l=[],c=n.map(e,this),s=r.call(this,c,i),f=u.call(this,s,c,i),i=-1,h=c.length,g=f.length-1,p=t?1:1/h;++i<g;)a=l[i]=[],a.dx=f[i+1]-(a.x=f[i]),a.y=0;if(g>0)for(i=-1;++i<h;)o=c[i],o>=s[0]&&o<=s[1]&&(a=l[oa.bisect(f,o,1,g)-1],a.y+=p,a.push(n[i]));return l}var t=!0,e=Number,r=bu,u=Mu;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=En(t),n):r},n.bins=function(t){return arguments.length?(u="number"==typeof t?function(n){return xu(n,t)}:En(t),n):u},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},oa.layout.pack=function(){function n(n,i){var a=e.call(this,n,i),o=a[0],l=u[0],c=u[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(o.x=o.y=0,au(o,function(n){n.r=+s(n.value)}),au(o,Nu),r){var f=r*(t?1:Math.max(2*o.r/l,2*o.r/c))/2;au(o,function(n){n.r+=f}),au(o,Nu),au(o,function(n){n.r-=f})}return Cu(o,l/2,c/2,t?1:1/Math.max(2*o.r/l,2*o.r/c)),a}var t,e=oa.layout.hierarchy().sort(_u),r=0,u=[1,1];return n.size=function(t){return arguments.length?(u=t,n):u},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},uu(n,e)},oa.layout.tree=function(){function n(n,u){var s=a.call(this,n,u),f=s[0],h=t(f);if(au(h,e),h.parent.m=-h.z,iu(h,r),c)iu(f,i);else{var g=f,p=f,v=f;iu(f,function(n){n.x<g.x&&(g=n),n.x>p.x&&(p=n),n.depth>v.depth&&(v=n)});var d=o(g,p)/2-g.x,m=l[0]/(p.x+o(p,g)/2+d),y=l[1]/(v.depth||1);iu(f,function(n){n.x=(n.x+d)*m,n.y=n.depth*y})}return s}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var u,i=t.children,a=0,o=i.length;o>a;++a)r.push((i[a]=u={_:i[a],parent:t,children:(u=i[a].children)&&u.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:a}).a=u);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Du(n);var i=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+o(n._,r._),n.m=n.z-i):n.z=i}else r&&(n.z=r.z+o(n._,r._));n.parent.A=u(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function u(n,t,e){if(t){for(var r,u=n,i=n,a=t,l=u.parent.children[0],c=u.m,s=i.m,f=a.m,h=l.m;a=Tu(a),u=qu(u),a&&u;)l=qu(l),i=Tu(i),i.a=n,r=a.z+f-u.z-c+o(a._,u._),r>0&&(Ru(Pu(a,n,e),n,r),c+=r,s+=r),f+=a.m,c+=u.m,h+=l.m,s+=i.m;a&&!Tu(i)&&(i.t=a,i.m+=f-s),u&&!qu(l)&&(l.t=u,l.m+=c-h,e=n)}return e}function i(n){n.x*=l[0],n.y=n.depth*l[1]}var a=oa.layout.hierarchy().sort(null).value(null),o=Lu,l=[1,1],c=null;return n.separation=function(t){return arguments.length?(o=t,n):o},n.size=function(t){return arguments.length?(c=null==(l=t)?i:null,n):c?null:l},n.nodeSize=function(t){return arguments.length?(c=null==(l=t)?null:i,n):c?l:null},uu(n,a)},oa.layout.cluster=function(){function n(n,i){var a,o=t.call(this,n,i),l=o[0],c=0;au(l,function(n){var t=n.children;t&&t.length?(n.x=Uu(t),n.y=ju(t)):(n.x=a?c+=e(n,a):0,n.y=0,a=n)});var s=Fu(l),f=Hu(l),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return au(l,u?function(n){n.x=(n.x-l.x)*r[0],n.y=(l.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(l.y?n.y/l.y:1))*r[1]}),o}var t=oa.layout.hierarchy().sort(null).value(null),e=Lu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},uu(n,t)},oa.layout.treemap=function(){function n(n,t){for(var e,r,u=-1,i=n.length;++u<i;)r=(e=n[u]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var i=e.children;if(i&&i.length){var a,o,l,c=f(e),s=[],h=i.slice(),p=1/0,v="slice"===g?c.dx:"dice"===g?c.dy:"slice-dice"===g?1&e.depth?c.dy:c.dx:Math.min(c.dx,c.dy);for(n(h,c.dx*c.dy/e.value),s.area=0;(l=h.length)>0;)s.push(a=h[l-1]),s.area+=a.area,"squarify"!==g||(o=r(s,v))<=p?(h.pop(),p=o):(s.area-=s.pop().area,u(s,v,c,!1),v=Math.min(c.dx,c.dy),s.length=s.area=0,p=1/0);s.length&&(u(s,v,c,!0),s.length=s.area=0),i.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var i,a=f(t),o=r.slice(),l=[];for(n(o,a.dx*a.dy/t.value),l.area=0;i=o.pop();)l.push(i),l.area+=i.area,null!=i.z&&(u(l,i.z?a.dx:a.dy,a,!o.length),l.length=l.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,u=0,i=1/0,a=-1,o=n.length;++a<o;)(e=n[a].area)&&(i>e&&(i=e),e>u&&(u=e));return r*=r,t*=t,r?Math.max(t*u*p/r,r/(t*i*p)):1/0}function u(n,t,e,r){var u,i=-1,a=n.length,o=e.x,c=e.y,s=t?l(n.area/t):0;
if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++i<a;)u=n[i],u.x=o,u.y=c,u.dy=s,o+=u.dx=Math.min(e.x+e.dx-o,s?l(u.area/s):0);u.z=!0,u.dx+=e.x+e.dx-o,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++i<a;)u=n[i],u.x=o,u.y=c,u.dx=s,c+=u.dy=Math.min(e.y+e.dy-c,s?l(u.area/s):0);u.z=!1,u.dy+=e.y+e.dy-c,e.x+=s,e.dx-=s}}function i(r){var u=a||o(r),i=u[0];return i.x=i.y=0,i.value?(i.dx=c[0],i.dy=c[1]):i.dx=i.dy=0,a&&o.revalue(i),n([i],i.dx*i.dy/i.value),(a?e:t)(i),h&&(a=u),u}var a,o=oa.layout.hierarchy(),l=Math.round,c=[1,1],s=null,f=Ou,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return i.size=function(n){return arguments.length?(c=n,i):c},i.padding=function(n){function t(t){var e=n.call(i,t,t.depth);return null==e?Ou(t):Iu(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Iu(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Ou:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,i},i.round=function(n){return arguments.length?(l=n?Math.round:Number,i):l!=Number},i.sticky=function(n){return arguments.length?(h=n,a=null,i):h},i.ratio=function(n){return arguments.length?(p=n,i):p},i.mode=function(n){return arguments.length?(g=n+"",i):g},uu(i,o)},oa.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,u;do e=2*Math.random()-1,r=2*Math.random()-1,u=e*e+r*r;while(!u||u>1);return n+t*e*Math.sqrt(-2*Math.log(u)/u)}},logNormal:function(){var n=oa.random.normal.apply(oa,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=oa.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},oa.scale={};var wl={floor:y,ceil:y};oa.scale.linear=function(){return Wu([0,1],[0,1],Mr,!1)};var Sl={s:1,g:1,p:1,r:1,e:1};oa.scale.log=function(){return ri(oa.scale.linear().domain([0,1]),10,!0,[1,10])};var kl=oa.format(".0e"),Nl={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};oa.scale.pow=function(){return ui(oa.scale.linear(),1,[0,1])},oa.scale.sqrt=function(){return oa.scale.pow().exponent(.5)},oa.scale.ordinal=function(){return ai([],{t:"range",a:[[]]})},oa.scale.category10=function(){return oa.scale.ordinal().range(El)},oa.scale.category20=function(){return oa.scale.ordinal().range(Al)},oa.scale.category20b=function(){return oa.scale.ordinal().range(Cl)},oa.scale.category20c=function(){return oa.scale.ordinal().range(zl)};var El=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(xn),Al=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(xn),Cl=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(xn),zl=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(xn);oa.scale.quantile=function(){return oi([],[])},oa.scale.quantize=function(){return li(0,1,[0,1])},oa.scale.threshold=function(){return ci([.5],[0,1])},oa.scale.identity=function(){return si([0,1])},oa.svg={},oa.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),c=Math.max(0,+r.apply(this,arguments)),s=a.apply(this,arguments)-Ha,f=o.apply(this,arguments)-Ha,h=Math.abs(f-s),g=s>f?0:1;if(n>c&&(p=c,c=n,n=p),h>=Fa)return t(c,g)+(n?t(n,1-g):"")+"Z";var p,v,d,m,y,M,x,b,_,w,S,k,N=0,E=0,A=[];if((m=(+l.apply(this,arguments)||0)/2)&&(d=i===Ll?Math.sqrt(n*n+c*c):+i.apply(this,arguments),g||(E*=-1),c&&(E=tn(d/c*Math.sin(m))),n&&(N=tn(d/n*Math.sin(m)))),c){y=c*Math.cos(s+E),M=c*Math.sin(s+E),x=c*Math.cos(f-E),b=c*Math.sin(f-E);var C=Math.abs(f-s-2*E)<=ja?0:1;if(E&&mi(y,M,x,b)===g^C){var z=(s+f)/2;y=c*Math.cos(z),M=c*Math.sin(z),x=b=null}}else y=M=0;if(n){_=n*Math.cos(f-N),w=n*Math.sin(f-N),S=n*Math.cos(s+N),k=n*Math.sin(s+N);var L=Math.abs(s-f+2*N)<=ja?0:1;if(N&&mi(_,w,S,k)===1-g^L){var q=(s+f)/2;_=n*Math.cos(q),w=n*Math.sin(q),S=k=null}}else _=w=0;if(h>Da&&(p=Math.min(Math.abs(c-n)/2,+u.apply(this,arguments)))>.001){v=c>n^g?0:1;var T=p,R=p;if(ja>h){var D=null==S?[_,w]:null==x?[y,M]:Re([y,M],[S,k],[x,b],[_,w]),P=y-D[0],j=M-D[1],U=x-D[0],F=b-D[1],H=1/Math.sin(Math.acos((P*U+j*F)/(Math.sqrt(P*P+j*j)*Math.sqrt(U*U+F*F)))/2),O=Math.sqrt(D[0]*D[0]+D[1]*D[1]);R=Math.min(p,(n-O)/(H-1)),T=Math.min(p,(c-O)/(H+1))}if(null!=x){var I=yi(null==S?[_,w]:[S,k],[y,M],c,T,g),Y=yi([x,b],[_,w],c,T,g);p===T?A.push("M",I[0],"A",T,",",T," 0 0,",v," ",I[1],"A",c,",",c," 0 ",1-g^mi(I[1][0],I[1][1],Y[1][0],Y[1][1]),",",g," ",Y[1],"A",T,",",T," 0 0,",v," ",Y[0]):A.push("M",I[0],"A",T,",",T," 0 1,",v," ",Y[0])}else A.push("M",y,",",M);if(null!=S){var Z=yi([y,M],[S,k],n,-R,g),V=yi([_,w],null==x?[y,M]:[x,b],n,-R,g);p===R?A.push("L",V[0],"A",R,",",R," 0 0,",v," ",V[1],"A",n,",",n," 0 ",g^mi(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-g," ",Z[1],"A",R,",",R," 0 0,",v," ",Z[0]):A.push("L",V[0],"A",R,",",R," 0 0,",v," ",Z[0])}else A.push("L",_,",",w)}else A.push("M",y,",",M),null!=x&&A.push("A",c,",",c," 0 ",C,",",g," ",x,",",b),A.push("L",_,",",w),null!=S&&A.push("A",n,",",n," 0 ",L,",",1-g," ",S,",",k);return A.push("Z"),A.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=hi,r=gi,u=fi,i=Ll,a=pi,o=vi,l=di;return n.innerRadius=function(t){return arguments.length?(e=En(t),n):e},n.outerRadius=function(t){return arguments.length?(r=En(t),n):r},n.cornerRadius=function(t){return arguments.length?(u=En(t),n):u},n.padRadius=function(t){return arguments.length?(i=t==Ll?Ll:En(t),n):i},n.startAngle=function(t){return arguments.length?(a=En(t),n):a},n.endAngle=function(t){return arguments.length?(o=En(t),n):o},n.padAngle=function(t){return arguments.length?(l=En(t),n):l},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+a.apply(this,arguments)+ +o.apply(this,arguments))/2-Ha;return[Math.cos(t)*n,Math.sin(t)*n]},n};var Ll="auto";oa.svg.line=function(){return Mi(y)};var ql=oa.map({linear:xi,"linear-closed":bi,step:_i,"step-before":wi,"step-after":Si,basis:zi,"basis-open":Li,"basis-closed":qi,bundle:Ti,cardinal:Ei,"cardinal-open":ki,"cardinal-closed":Ni,monotone:Fi});ql.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var Tl=[0,2/3,1/3,0],Rl=[0,1/3,2/3,0],Dl=[0,1/6,2/3,1/6];oa.svg.line.radial=function(){var n=Mi(Hi);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},wi.reverse=Si,Si.reverse=wi,oa.svg.area=function(){return Oi(y)},oa.svg.area.radial=function(){var n=Oi(Hi);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},oa.svg.chord=function(){function n(n,o){var l=t(this,i,n,o),c=t(this,a,n,o);return"M"+l.p0+r(l.r,l.p1,l.a1-l.a0)+(e(l,c)?u(l.r,l.p1,l.r,l.p0):u(l.r,l.p1,c.r,c.p0)+r(c.r,c.p1,c.a1-c.a0)+u(c.r,c.p1,l.r,l.p0))+"Z"}function t(n,t,e,r){var u=t.call(n,e,r),i=o.call(n,u,r),a=l.call(n,u,r)-Ha,s=c.call(n,u,r)-Ha;return{r:i,a0:a,a1:s,p0:[i*Math.cos(a),i*Math.sin(a)],p1:[i*Math.cos(s),i*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>ja)+",1 "+t}function u(n,t,e,r){return"Q 0,0 "+r}var i=Me,a=xe,o=Ii,l=pi,c=vi;return n.radius=function(t){return arguments.length?(o=En(t),n):o},n.source=function(t){return arguments.length?(i=En(t),n):i},n.target=function(t){return arguments.length?(a=En(t),n):a},n.startAngle=function(t){return arguments.length?(l=En(t),n):l},n.endAngle=function(t){return arguments.length?(c=En(t),n):c},n},oa.svg.diagonal=function(){function n(n,u){var i=t.call(this,n,u),a=e.call(this,n,u),o=(i.y+a.y)/2,l=[i,{x:i.x,y:o},{x:a.x,y:o},a];return l=l.map(r),"M"+l[0]+"C"+l[1]+" "+l[2]+" "+l[3]}var t=Me,e=xe,r=Yi;return n.source=function(e){return arguments.length?(t=En(e),n):t},n.target=function(t){return arguments.length?(e=En(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},oa.svg.diagonal.radial=function(){var n=oa.svg.diagonal(),t=Yi,e=n.projection;return n.projection=function(n){return arguments.length?e(Zi(t=n)):t},n},oa.svg.symbol=function(){function n(n,r){return(Pl.get(t.call(this,n,r))||$i)(e.call(this,n,r))}var t=Xi,e=Vi;return n.type=function(e){return arguments.length?(t=En(e),n):t},n.size=function(t){return arguments.length?(e=En(t),n):e},n};var Pl=oa.map({circle:$i,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Ul)),e=t*Ul;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});oa.svg.symbolTypes=Pl.keys();var jl=Math.sqrt(3),Ul=Math.tan(30*Oa);Aa.transition=function(n){for(var t,e,r=Fl||++Yl,u=Ki(n),i=[],a=Hl||{time:Date.now(),ease:Nr,delay:0,duration:250},o=-1,l=this.length;++o<l;){i.push(t=[]);for(var c=this[o],s=-1,f=c.length;++s<f;)(e=c[s])&&Qi(e,s,u,r,a),t.push(e)}return Wi(i,u,r)},Aa.interrupt=function(n){return this.each(null==n?Ol:Bi(Ki(n)))};var Fl,Hl,Ol=Bi(Ki()),Il=[],Yl=0;Il.call=Aa.call,Il.empty=Aa.empty,Il.node=Aa.node,Il.size=Aa.size,oa.transition=function(n,t){return n&&n.transition?Fl?n.transition(t):n:oa.selection().transition(n)},oa.transition.prototype=Il,Il.select=function(n){var t,e,r,u=this.id,i=this.namespace,a=[];n=A(n);for(var o=-1,l=this.length;++o<l;){a.push(t=[]);for(var c=this[o],s=-1,f=c.length;++s<f;)(r=c[s])&&(e=n.call(r,r.__data__,s,o))?("__data__"in r&&(e.__data__=r.__data__),Qi(e,s,i,u,r[i][u]),t.push(e)):t.push(null)}return Wi(a,i,u)},Il.selectAll=function(n){var t,e,r,u,i,a=this.id,o=this.namespace,l=[];n=C(n);for(var c=-1,s=this.length;++c<s;)for(var f=this[c],h=-1,g=f.length;++h<g;)if(r=f[h]){i=r[o][a],e=n.call(r,r.__data__,h,c),l.push(t=[]);for(var p=-1,v=e.length;++p<v;)(u=e[p])&&Qi(u,p,o,a,i),t.push(u)}return Wi(l,o,a)},Il.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,a=this.length;a>i;i++){u.push(t=[]);for(var e=this[i],o=0,l=e.length;l>o;o++)(r=e[o])&&n.call(r,r.__data__,o,i)&&t.push(r)}return Wi(u,this.namespace,this.id)},Il.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Y(this,null==t?function(t){t[r][e].tween.remove(n)}:function(u){u[r][e].tween.set(n,t)})},Il.attr=function(n,t){function e(){this.removeAttribute(o)}function r(){this.removeAttributeNS(o.space,o.local)}function u(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(o);return e!==n&&(t=a(e,n),function(n){this.setAttribute(o,t(n))})})}function i(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(o.space,o.local);return e!==n&&(t=a(e,n),function(n){this.setAttributeNS(o.space,o.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var a="transform"==n?$r:Mr,o=oa.ns.qualify(n);return Ji(this,"attr."+n,t,o.local?i:u)},Il.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(u));return r&&function(n){this.setAttribute(u,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(u.space,u.local));return r&&function(n){this.setAttributeNS(u.space,u.local,r(n))}}var u=oa.ns.qualify(n);return this.tween("attr."+n,u.local?r:e)},Il.style=function(n,e,r){function u(){this.style.removeProperty(n)}function i(e){return null==e?u:(e+="",function(){var u,i=t(this).getComputedStyle(this,null).getPropertyValue(n);return i!==e&&(u=Mr(i,e),function(t){this.style.setProperty(n,u(t),r)})})}var a=arguments.length;if(3>a){if("string"!=typeof n){2>a&&(e="");for(r in n)this.style(r,n[r],e);return this}r=""}return Ji(this,"style."+n,e,i)},Il.styleTween=function(n,e,r){function u(u,i){var a=e.call(this,u,i,t(this).getComputedStyle(this,null).getPropertyValue(n));return a&&function(t){this.style.setProperty(n,a(t),r)}}return arguments.length<3&&(r=""),this.tween("style."+n,u)},Il.text=function(n){return Ji(this,"text",n,Gi)},Il.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Il.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=oa.ease.apply(oa,arguments)),Y(this,function(r){r[e][t].ease=n}))},Il.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Y(this,"function"==typeof n?function(r,u,i){r[e][t].delay=+n.call(r,r.__data__,u,i)}:(n=+n,function(r){r[e][t].delay=n}))},Il.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Y(this,"function"==typeof n?function(r,u,i){r[e][t].duration=Math.max(1,n.call(r,r.__data__,u,i))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Il.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var u=Hl,i=Fl;try{Fl=e,Y(this,function(t,u,i){Hl=t[r][e],n.call(t,t.__data__,u,i)})}finally{Hl=u,Fl=i}}else Y(this,function(u){var i=u[r][e];(i.event||(i.event=oa.dispatch("start","end","interrupt"))).on(n,t)});return this},Il.transition=function(){for(var n,t,e,r,u=this.id,i=++Yl,a=this.namespace,o=[],l=0,c=this.length;c>l;l++){o.push(n=[]);for(var t=this[l],s=0,f=t.length;f>s;s++)(e=t[s])&&(r=e[a][u],Qi(e,s,a,i,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return Wi(o,a,i)},oa.svg.axis=function(){function n(n){n.each(function(){var n,c=oa.select(this),s=this.__chart__||e,f=this.__chart__=e.copy(),h=null==l?f.ticks?f.ticks.apply(f,o):f.domain():l,g=null==t?f.tickFormat?f.tickFormat.apply(f,o):y:t,p=c.selectAll(".tick").data(h,f),v=p.enter().insert("g",".domain").attr("class","tick").style("opacity",Da),d=oa.transition(p.exit()).style("opacity",Da).remove(),m=oa.transition(p.order()).style("opacity",1),M=Math.max(u,0)+a,x=Zu(f),b=c.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),oa.transition(b));v.append("line"),v.append("text");var w,S,k,N,E=v.select("line"),A=m.select("line"),C=p.select("text").text(g),z=v.select("text"),L=m.select("text"),q="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=na,w="x",k="y",S="x2",N="y2",C.attr("dy",0>q?"0em":".71em").style("text-anchor","middle"),_.attr("d","M"+x[0]+","+q*i+"V0H"+x[1]+"V"+q*i)):(n=ta,w="y",k="x",S="y2",N="x2",C.attr("dy",".32em").style("text-anchor",0>q?"end":"start"),_.attr("d","M"+q*i+","+x[0]+"H0V"+x[1]+"H"+q*i)),E.attr(N,q*u),z.attr(k,q*M),A.attr(S,0).attr(N,q*u),L.attr(w,0).attr(k,q*M),f.rangeBand){var T=f,R=T.rangeBand()/2;s=f=function(n){return T(n)+R}}else s.rangeBand?s=f:d.call(n,f,s);v.call(n,s,f),m.call(n,f,f)})}var t,e=oa.scale.linear(),r=Zl,u=6,i=6,a=3,o=[10],l=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Vl?t+"":Zl,n):r},n.ticks=function(){return arguments.length?(o=ca(arguments),n):o},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(u=+t,i=+arguments[e-1],n):u},n.innerTickSize=function(t){return arguments.length?(u=+t,n):u},n.outerTickSize=function(t){return arguments.length?(i=+t,n):i},n.tickPadding=function(t){return arguments.length?(a=+t,n):a},n.tickSubdivide=function(){return arguments.length&&n},n};var Zl="bottom",Vl={top:1,right:1,bottom:1,left:1};oa.svg.brush=function(){function n(t){t.each(function(){var t=oa.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",i).on("touchstart.brush",i),a=t.selectAll(".background").data([0]);a.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var o=t.selectAll(".resize").data(v,y);o.exit().remove(),o.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Xl[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),o.style("display",n.empty()?"none":null);var l,f=oa.transition(t),h=oa.transition(a);c&&(l=Zu(c),h.attr("x",l[0]).attr("width",l[1]-l[0]),r(f)),s&&(l=Zu(s),h.attr("y",l[0]).attr("height",l[1]-l[0]),u(f)),e(f)})}function e(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+f[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function r(n){n.select(".extent").attr("x",f[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",f[1]-f[0])}function u(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function i(){function i(){32==oa.event.keyCode&&(C||(M=null,L[0]-=f[1],L[1]-=h[1],C=2),S())}function v(){32==oa.event.keyCode&&2==C&&(L[0]+=f[1],L[1]+=h[1],C=0,S())}function d(){var n=oa.mouse(b),t=!1;x&&(n[0]+=x[0],n[1]+=x[1]),C||(oa.event.altKey?(M||(M=[(f[0]+f[1])/2,(h[0]+h[1])/2]),L[0]=f[+(n[0]<M[0])],L[1]=h[+(n[1]<M[1])]):M=null),E&&m(n,c,0)&&(r(k),t=!0),A&&m(n,s,1)&&(u(k),t=!0),t&&(e(k),w({type:"brush",mode:C?"move":"resize"}))}function m(n,t,e){var r,u,i=Zu(t),l=i[0],c=i[1],s=L[e],v=e?h:f,d=v[1]-v[0];return C&&(l-=s,c-=d+s),r=(e?p:g)?Math.max(l,Math.min(c,n[e])):n[e],C?u=(r+=s)+d:(M&&(s=Math.max(l,Math.min(c,2*M[e]-r))),r>s?(u=r,r=s):u=s),v[0]!=r||v[1]!=u?(e?o=null:a=null,v[0]=r,v[1]=u,!0):void 0}function y(){d(),k.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),oa.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),z(),w({type:"brushend"})}var M,x,b=this,_=oa.select(oa.event.target),w=l.of(b,arguments),k=oa.select(b),N=_.datum(),E=!/^(n|s)$/.test(N)&&c,A=!/^(e|w)$/.test(N)&&s,C=_.classed("extent"),z=W(b),L=oa.mouse(b),q=oa.select(t(b)).on("keydown.brush",i).on("keyup.brush",v);if(oa.event.changedTouches?q.on("touchmove.brush",d).on("touchend.brush",y):q.on("mousemove.brush",d).on("mouseup.brush",y),k.interrupt().selectAll("*").interrupt(),C)L[0]=f[0]-L[0],L[1]=h[0]-L[1];else if(N){var T=+/w$/.test(N),R=+/^n/.test(N);x=[f[1-T]-L[0],h[1-R]-L[1]],L[0]=f[T],L[1]=h[R]}else oa.event.altKey&&(M=L.slice());k.style("pointer-events","none").selectAll(".resize").style("display",null),oa.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),d()}var a,o,l=N(n,"brushstart","brush","brushend"),c=null,s=null,f=[0,0],h=[0,0],g=!0,p=!0,v=$l[0];return n.event=function(n){n.each(function(){var n=l.of(this,arguments),t={x:f,y:h,i:a,j:o},e=this.__chart__||t;this.__chart__=t,Fl?oa.select(this).transition().each("start.brush",function(){a=e.i,o=e.j,f=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=xr(f,t.x),r=xr(h,t.y);return a=o=null,function(u){f=t.x=e(u),h=t.y=r(u),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){a=t.i,o=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,v=$l[!c<<1|!s],n):c},n.y=function(t){return arguments.length?(s=t,v=$l[!c<<1|!s],n):s},n.clamp=function(t){return arguments.length?(c&&s?(g=!!t[0],p=!!t[1]):c?g=!!t:s&&(p=!!t),n):c&&s?[g,p]:c?g:s?p:null},n.extent=function(t){var e,r,u,i,l;return arguments.length?(c&&(e=t[0],r=t[1],s&&(e=e[0],r=r[0]),a=[e,r],c.invert&&(e=c(e),r=c(r)),e>r&&(l=e,e=r,r=l),(e!=f[0]||r!=f[1])&&(f=[e,r])),s&&(u=t[0],i=t[1],c&&(u=u[1],i=i[1]),o=[u,i],s.invert&&(u=s(u),i=s(i)),u>i&&(l=u,u=i,i=l),(u!=h[0]||i!=h[1])&&(h=[u,i])),n):(c&&(a?(e=a[0],r=a[1]):(e=f[0],r=f[1],c.invert&&(e=c.invert(e),r=c.invert(r)),e>r&&(l=e,e=r,r=l))),s&&(o?(u=o[0],i=o[1]):(u=h[0],i=h[1],s.invert&&(u=s.invert(u),i=s.invert(i)),u>i&&(l=u,u=i,i=l))),c&&s?[[e,u],[r,i]]:c?[e,r]:s&&[u,i])},n.clear=function(){return n.empty()||(f=[0,0],h=[0,0],a=o=null),n},n.empty=function(){return!!c&&f[0]==f[1]||!!s&&h[0]==h[1]},oa.rebind(n,l,"on")};var Xl={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},$l=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Bl=ho.format=Mo.timeFormat,Wl=Bl.utc,Jl=Wl("%Y-%m-%dT%H:%M:%S.%LZ");Bl.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?ea:Jl,ea.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},ea.toString=Jl.toString,ho.second=On(function(n){return new go(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ho.seconds=ho.second.range,ho.seconds.utc=ho.second.utc.range,ho.minute=On(function(n){return new go(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ho.minutes=ho.minute.range,ho.minutes.utc=ho.minute.utc.range,ho.hour=On(function(n){var t=n.getTimezoneOffset()/60;return new go(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ho.hours=ho.hour.range,ho.hours.utc=ho.hour.utc.range,ho.month=On(function(n){return n=ho.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ho.months=ho.month.range,ho.months.utc=ho.month.utc.range;var Gl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],Kl=[[ho.second,1],[ho.second,5],[ho.second,15],[ho.second,30],[ho.minute,1],[ho.minute,5],[ho.minute,15],[ho.minute,30],[ho.hour,1],[ho.hour,3],[ho.hour,6],[ho.hour,12],[ho.day,1],[ho.day,2],[ho.week,1],[ho.month,1],[ho.month,3],[ho.year,1]],Ql=Bl.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",zt]]),nc={range:function(n,t,e){return oa.range(Math.ceil(n/e)*e,+t,e).map(ua)},floor:y,ceil:y};Kl.year=ho.year,ho.scale=function(){return ra(oa.scale.linear(),Kl,Ql)};var tc=Kl.map(function(n){return[n[0].utc,n[1]]}),ec=Wl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",zt]]);tc.year=ho.year.utc,ho.scale.utc=function(){return ra(oa.scale.linear(),tc,ec)},oa.text=An(function(n){return n.responseText}),oa.json=function(n,t){return Cn(n,"application/json",ia,t)},oa.html=function(n,t){return Cn(n,"text/html",aa,t)},oa.xml=An(function(n){return n.responseXML}),"function"==typeof define&&define.amd?(this.d3=oa,define(oa)):"object"==typeof module&&module.exports?module.exports=oa:this.d3=oa}();/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2015 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.3.4
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.Promise=t()}}(function(){var t,e,n;return function r(t,e,n){function i(s,a){if(!e[s]){if(!t[s]){var c="function"==typeof _dereq_&&_dereq_;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=e[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return i(n?n:e)},u,u.exports,r,t,e,n)}return e[s].exports}for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,n){"use strict";e.exports=function(t){function e(t){var e=new n(t),r=e.promise();return e.setHowMany(1),e.setUnwrap(),e.init(),r}var n=t._SomePromiseArray;t.any=function(t){return e(t)},t.prototype.any=function(){return e(this)}}},{}],2:[function(t,e,n){"use strict";function r(){this._isTickUsed=!1,this._lateQueue=new u(16),this._normalQueue=new u(16),this._haveDrainedQueues=!1,this._trampolineEnabled=!0;var t=this;this.drainQueues=function(){t._drainQueues()},this._schedule=l}function i(t,e,n){this._lateQueue.push(t,e,n),this._queueTick()}function o(t,e,n){this._normalQueue.push(t,e,n),this._queueTick()}function s(t){this._normalQueue._pushOne(t),this._queueTick()}var a;try{throw new Error}catch(c){a=c}var l=t("./schedule"),u=t("./queue"),p=t("./util");r.prototype.enableTrampoline=function(){this._trampolineEnabled=!0},r.prototype.disableTrampolineIfNecessary=function(){p.hasDevTools&&(this._trampolineEnabled=!1)},r.prototype.haveItemsQueued=function(){return this._isTickUsed||this._haveDrainedQueues},r.prototype.fatalError=function(t,e){e?(process.stderr.write("Fatal "+(t instanceof Error?t.stack:t)+"\n"),process.exit(2)):this.throwLater(t)},r.prototype.throwLater=function(t,e){if(1===arguments.length&&(e=t,t=function(){throw e}),"undefined"!=typeof setTimeout)setTimeout(function(){t(e)},0);else try{this._schedule(function(){t(e)})}catch(n){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}},p.hasDevTools?(r.prototype.invokeLater=function(t,e,n){this._trampolineEnabled?i.call(this,t,e,n):this._schedule(function(){setTimeout(function(){t.call(e,n)},100)})},r.prototype.invoke=function(t,e,n){this._trampolineEnabled?o.call(this,t,e,n):this._schedule(function(){t.call(e,n)})},r.prototype.settlePromises=function(t){this._trampolineEnabled?s.call(this,t):this._schedule(function(){t._settlePromises()})}):(r.prototype.invokeLater=i,r.prototype.invoke=o,r.prototype.settlePromises=s),r.prototype.invokeFirst=function(t,e,n){this._normalQueue.unshift(t,e,n),this._queueTick()},r.prototype._drainQueue=function(t){for(;t.length()>0;){var e=t.shift();if("function"==typeof e){var n=t.shift(),r=t.shift();e.call(n,r)}else e._settlePromises()}},r.prototype._drainQueues=function(){this._drainQueue(this._normalQueue),this._reset(),this._haveDrainedQueues=!0,this._drainQueue(this._lateQueue)},r.prototype._queueTick=function(){this._isTickUsed||(this._isTickUsed=!0,this._schedule(this.drainQueues))},r.prototype._reset=function(){this._isTickUsed=!1},e.exports=r,e.exports.firstLineError=a},{"./queue":26,"./schedule":29,"./util":36}],3:[function(t,e,n){"use strict";e.exports=function(t,e,n,r){var i=!1,o=function(t,e){this._reject(e)},s=function(t,e){e.promiseRejectionQueued=!0,e.bindingPromise._then(o,o,null,this,t)},a=function(t,e){0===(50397184&this._bitField)&&this._resolveCallback(e.target)},c=function(t,e){e.promiseRejectionQueued||this._reject(t)};t.prototype.bind=function(o){i||(i=!0,t.prototype._propagateFrom=r.propagateFromFunction(),t.prototype._boundValue=r.boundValueFunction());var l=n(o),u=new t(e);u._propagateFrom(this,1);var p=this._target();if(u._setBoundTo(l),l instanceof t){var h={promiseRejectionQueued:!1,promise:u,target:p,bindingPromise:l};p._then(e,s,void 0,u,h),l._then(a,c,void 0,u,h),u._setOnCancel(l)}else u._resolveCallback(p);return u},t.prototype._setBoundTo=function(t){void 0!==t?(this._bitField=2097152|this._bitField,this._boundTo=t):this._bitField=-2097153&this._bitField},t.prototype._isBound=function(){return 2097152===(2097152&this._bitField)},t.bind=function(e,n){return t.resolve(n).bind(e)}}},{}],4:[function(t,e,n){"use strict";function r(){try{Promise===o&&(Promise=i)}catch(t){}return o}var i;"undefined"!=typeof Promise&&(i=Promise);var o=t("./promise")();o.noConflict=r,e.exports=o},{"./promise":22}],5:[function(t,e,n){"use strict";var r=Object.create;if(r){var i=r(null),o=r(null);i[" size"]=o[" size"]=0}e.exports=function(e){function n(t,n){var r;if(null!=t&&(r=t[n]),"function"!=typeof r){var i="Object "+a.classString(t)+" has no method '"+a.toString(n)+"'";throw new e.TypeError(i)}return r}function r(t){var e=this.pop(),r=n(t,e);return r.apply(t,this)}function i(t){return t[this]}function o(t){var e=+this;return 0>e&&(e=Math.max(0,e+t.length)),t[e]}var s,a=t("./util"),c=a.canEvaluate;a.isIdentifier;e.prototype.call=function(t){var e=[].slice.call(arguments,1);return e.push(t),this._then(r,void 0,void 0,e,void 0)},e.prototype.get=function(t){var e,n="number"==typeof t;if(n)e=o;else if(c){var r=s(t);e=null!==r?r:i}else e=i;return this._then(e,void 0,void 0,t,void 0)}}},{"./util":36}],6:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){var o=t("./util"),s=o.tryCatch,a=o.errorObj,c=e._async;e.prototype["break"]=e.prototype.cancel=function(){if(!i.cancellation())return this._warn("cancellation is disabled");for(var t=this,e=t;t.isCancellable();){if(!t._cancelBy(e)){e._isFollowing()?e._followee().cancel():e._cancelBranched();break}var n=t._cancellationParent;if(null==n||!n.isCancellable()){t._isFollowing()?t._followee().cancel():t._cancelBranched();break}t._isFollowing()&&t._followee().cancel(),e=t,t=n}},e.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--},e.prototype._enoughBranchesHaveCancelled=function(){return void 0===this._branchesRemainingToCancel||this._branchesRemainingToCancel<=0},e.prototype._cancelBy=function(t){return t===this?(this._branchesRemainingToCancel=0,this._invokeOnCancel(),!0):(this._branchHasCancelled(),this._enoughBranchesHaveCancelled()?(this._invokeOnCancel(),!0):!1)},e.prototype._cancelBranched=function(){this._enoughBranchesHaveCancelled()&&this._cancel()},e.prototype._cancel=function(){this.isCancellable()&&(this._setCancelled(),c.invoke(this._cancelPromises,this,void 0))},e.prototype._cancelPromises=function(){this._length()>0&&this._settlePromises()},e.prototype._unsetOnCancel=function(){this._onCancelField=void 0},e.prototype.isCancellable=function(){return this.isPending()&&!this.isCancelled()},e.prototype._doInvokeOnCancel=function(t,e){if(o.isArray(t))for(var n=0;n<t.length;++n)this._doInvokeOnCancel(t[n],e);else if(void 0!==t)if("function"==typeof t){if(!e){var r=s(t).call(this._boundValue());r===a&&(this._attachExtraTrace(r.e),c.throwLater(r.e))}}else t._resultCancelled(this)},e.prototype._invokeOnCancel=function(){var t=this._onCancel();this._unsetOnCancel(),c.invoke(this._doInvokeOnCancel,this,t)},e.prototype._invokeInternalOnCancel=function(){this.isCancellable()&&(this._doInvokeOnCancel(this._onCancel(),!0),this._unsetOnCancel())},e.prototype._resultCancelled=function(){this.cancel()}}},{"./util":36}],7:[function(t,e,n){"use strict";e.exports=function(e){function n(t,n,a){return function(c){var l=a._boundValue();t:for(var u=0;u<t.length;++u){var p=t[u];if(p===Error||null!=p&&p.prototype instanceof Error){if(c instanceof p)return o(n).call(l,c)}else if("function"==typeof p){var h=o(p).call(l,c);if(h===s)return h;if(h)return o(n).call(l,c)}else if(r.isObject(c)){for(var f=i(p),_=0;_<f.length;++_){var d=f[_];if(p[d]!=c[d])continue t}return o(n).call(l,c)}}return e}}var r=t("./util"),i=t("./es5").keys,o=r.tryCatch,s=r.errorObj;return n}},{"./es5":13,"./util":36}],8:[function(t,e,n){"use strict";e.exports=function(t){function e(){this._trace=new e.CapturedTrace(r())}function n(){return i?new e:void 0}function r(){var t=o.length-1;return t>=0?o[t]:void 0}var i=!1,o=[];return t.prototype._promiseCreated=function(){},t.prototype._pushContext=function(){},t.prototype._popContext=function(){return null},t._peekContext=t.prototype._peekContext=function(){},e.prototype._pushContext=function(){void 0!==this._trace&&(this._trace._promiseCreated=null,o.push(this._trace))},e.prototype._popContext=function(){if(void 0!==this._trace){var t=o.pop(),e=t._promiseCreated;return t._promiseCreated=null,e}return null},e.CapturedTrace=null,e.create=n,e.deactivateLongStackTraces=function(){},e.activateLongStackTraces=function(){var n=t.prototype._pushContext,o=t.prototype._popContext,s=t._peekContext,a=t.prototype._peekContext,c=t.prototype._promiseCreated;e.deactivateLongStackTraces=function(){t.prototype._pushContext=n,t.prototype._popContext=o,t._peekContext=s,t.prototype._peekContext=a,t.prototype._promiseCreated=c,i=!1},i=!0,t.prototype._pushContext=e.prototype._pushContext,t.prototype._popContext=e.prototype._popContext,t._peekContext=t.prototype._peekContext=r,t.prototype._promiseCreated=function(){var t=this._peekContext();t&&null==t._promiseCreated&&(t._promiseCreated=this)}},e}},{}],9:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,e){return{promise:e}}function i(){return!1}function o(t,e,n){var r=this;try{t(e,n,function(t){if("function"!=typeof t)throw new TypeError("onCancel must be a function, got: "+H.toString(t));r._attachCancellationCallback(t)})}catch(i){return i}}function s(t){if(!this.isCancellable())return this;var e=this._onCancel();void 0!==e?H.isArray(e)?e.push(t):this._setOnCancel([e,t]):this._setOnCancel(t)}function a(){return this._onCancelField}function c(t){this._onCancelField=t}function l(){this._cancellationParent=void 0,this._onCancelField=void 0}function u(t,e){if(0!==(1&e)){this._cancellationParent=t;var n=t._branchesRemainingToCancel;void 0===n&&(n=0),t._branchesRemainingToCancel=n+1}0!==(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}function p(t,e){0!==(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}function h(){var t=this._boundTo;return void 0!==t&&t instanceof e?t.isFulfilled()?t.value():void 0:t}function f(){this._trace=new O(this._peekContext())}function _(t,e){if(N(t)){var n=this._trace;if(void 0!==n&&e&&(n=n._parent),void 0!==n)n.attachExtraTrace(t);else if(!t.__stackCleaned__){var r=j(t);H.notEnumerableProp(t,"stack",r.message+"\n"+r.stack.join("\n")),H.notEnumerableProp(t,"__stackCleaned__",!0)}}}function d(t,e,n,r,i){if(void 0===t&&null!==e&&z){if(void 0!==i&&i._returnedNonUndefined())return;var o=r._bitField;if(0===(65535&o))return;n&&(n+=" ");var s="a promise was created in a "+n+"handler but was not returned from it";r._warn(s,!0,e)}}function v(t,e){var n=t+" is deprecated and will be removed in a future version.";return e&&(n+=" Use "+e+" instead."),y(n)}function y(t,n,r){if(rt.warnings){var i,o=new L(t);if(n)r._attachExtraTrace(o);else if(rt.longStackTraces&&(i=e._peekContext()))i.attachExtraTrace(o);else{var s=j(o);o.stack=s.message+"\n"+s.stack.join("\n")}Y("warning",o)||k(o,"",!0)}}function g(t,e){for(var n=0;n<e.length-1;++n)e[n].push("From previous event:"),e[n]=e[n].join("\n");return n<e.length&&(e[n]=e[n].join("\n")),t+"\n"+e.join("\n")}function m(t){for(var e=0;e<t.length;++e)(0===t[e].length||e+1<t.length&&t[e][0]===t[e+1][0])&&(t.splice(e,1),e--)}function b(t){for(var e=t[0],n=1;n<t.length;++n){for(var r=t[n],i=e.length-1,o=e[i],s=-1,a=r.length-1;a>=0;--a)if(r[a]===o){s=a;break}for(var a=s;a>=0;--a){var c=r[a];if(e[i]!==c)break;e.pop(),i--}e=r}}function w(t){for(var e=[],n=0;n<t.length;++n){var r=t[n],i="    (No stack trace)"===r||B.test(r),o=i&&tt(r);i&&!o&&(q&&" "!==r.charAt(0)&&(r="    "+r),e.push(r))}return e}function C(t){for(var e=t.stack.replace(/\s+$/g,"").split("\n"),n=0;n<e.length;++n){var r=e[n];if("    (No stack trace)"===r||B.test(r))break}return n>0&&(e=e.slice(n)),e}function j(t){var e=t.stack,n=t.toString();return e="string"==typeof e&&e.length>0?C(t):["    (No stack trace)"],{message:n,stack:w(e)}}function k(t,e,n){if("undefined"!=typeof console){var r;if(H.isObject(t)){var i=t.stack;r=e+M(i,t)}else r=e+String(t);"function"==typeof D?D(r,n):("function"==typeof console.log||"object"==typeof console.log)&&console.log(r)}}function E(t,e,n,r){var i=!1;try{"function"==typeof e&&(i=!0,"rejectionHandled"===t?e(r):e(n,r))}catch(o){I.throwLater(o)}"unhandledRejection"===t?Y(t,n,r)||i||k(n,"Unhandled rejection "):Y(t,r)}function F(t){var e;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else{e=t&&"function"==typeof t.toString?t.toString():H.toString(t);var n=/\[object [a-zA-Z0-9$_]+\]/;if(n.test(e))try{var r=JSON.stringify(t);e=r}catch(i){}0===e.length&&(e="(empty array)")}return"(<"+x(e)+">, no stack trace)"}function x(t){var e=41;return t.length<e?t:t.substr(0,e-3)+"..."}function T(){return"function"==typeof nt}function R(t){var e=t.match(et);return e?{fileName:e[1],line:parseInt(e[2],10)}:void 0}function P(t,e){if(T()){for(var n,r,i=t.stack.split("\n"),o=e.stack.split("\n"),s=-1,a=-1,c=0;c<i.length;++c){var l=R(i[c]);if(l){n=l.fileName,s=l.line;break}}for(var c=0;c<o.length;++c){var l=R(o[c]);if(l){r=l.fileName,a=l.line;break}}0>s||0>a||!n||!r||n!==r||s>=a||(tt=function(t){if(U.test(t))return!0;var e=R(t);return e&&e.fileName===n&&s<=e.line&&e.line<=a?!0:!1})}}function O(t){this._parent=t,this._promisesCreated=0;var e=this._length=1+(void 0===t?0:t._length);nt(this,O),e>32&&this.uncycle()}var S,A,D,V=e._getDomain,I=e._async,L=t("./errors").Warning,H=t("./util"),N=H.canAttachTrace,U=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,B=null,M=null,q=!1,Q=!(0==H.env("BLUEBIRD_DEBUG")||!H.env("BLUEBIRD_DEBUG")&&"development"!==H.env("NODE_ENV")),$=!(0==H.env("BLUEBIRD_WARNINGS")||!Q&&!H.env("BLUEBIRD_WARNINGS")),G=!(0==H.env("BLUEBIRD_LONG_STACK_TRACES")||!Q&&!H.env("BLUEBIRD_LONG_STACK_TRACES")),z=0!=H.env("BLUEBIRD_W_FORGOTTEN_RETURN")&&($||!!H.env("BLUEBIRD_W_FORGOTTEN_RETURN"));e.prototype.suppressUnhandledRejections=function(){var t=this._target();t._bitField=-1048577&t._bitField|524288},e.prototype._ensurePossibleRejectionHandled=function(){0===(524288&this._bitField)&&(this._setRejectionIsUnhandled(),I.invokeLater(this._notifyUnhandledRejection,this,void 0))},e.prototype._notifyUnhandledRejectionIsHandled=function(){E("rejectionHandled",S,void 0,this)},e.prototype._setReturnedNonUndefined=function(){this._bitField=268435456|this._bitField},e.prototype._returnedNonUndefined=function(){return 0!==(268435456&this._bitField)},e.prototype._notifyUnhandledRejection=function(){if(this._isRejectionUnhandled()){var t=this._settledValue();this._setUnhandledRejectionIsNotified(),E("unhandledRejection",A,t,this)}},e.prototype._setUnhandledRejectionIsNotified=function(){this._bitField=262144|this._bitField},e.prototype._unsetUnhandledRejectionIsNotified=function(){this._bitField=-262145&this._bitField},e.prototype._isUnhandledRejectionNotified=function(){return(262144&this._bitField)>0},e.prototype._setRejectionIsUnhandled=function(){this._bitField=1048576|this._bitField},e.prototype._unsetRejectionIsUnhandled=function(){this._bitField=-1048577&this._bitField,this._isUnhandledRejectionNotified()&&(this._unsetUnhandledRejectionIsNotified(),this._notifyUnhandledRejectionIsHandled())},e.prototype._isRejectionUnhandled=function(){return(1048576&this._bitField)>0},e.prototype._warn=function(t,e,n){return y(t,e,n||this)},e.onPossiblyUnhandledRejection=function(t){var e=V();A="function"==typeof t?null===e?t:e.bind(t):void 0},e.onUnhandledRejectionHandled=function(t){var e=V();S="function"==typeof t?null===e?t:e.bind(t):void 0};var X=function(){};e.longStackTraces=function(){if(I.haveItemsQueued()&&!rt.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");if(!rt.longStackTraces&&T()){var t=e.prototype._captureStackTrace,r=e.prototype._attachExtraTrace;rt.longStackTraces=!0,X=function(){if(I.haveItemsQueued()&&!rt.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");e.prototype._captureStackTrace=t,e.prototype._attachExtraTrace=r,n.deactivateLongStackTraces(),I.enableTrampoline(),rt.longStackTraces=!1},e.prototype._captureStackTrace=f,e.prototype._attachExtraTrace=_,n.activateLongStackTraces(),I.disableTrampolineIfNecessary()}},e.hasLongStackTraces=function(){return rt.longStackTraces&&T()};var W=function(){try{var t=document.createEvent("CustomEvent");return t.initCustomEvent("testingtheevent",!1,!0,{}),H.global.dispatchEvent(t),function(t,e){var n=document.createEvent("CustomEvent");return n.initCustomEvent(t.toLowerCase(),!1,!0,e),!H.global.dispatchEvent(n)}}catch(e){}return function(){return!1}}(),K=function(){return H.isNode?function(){return process.emit.apply(process,arguments)}:H.global?function(t){var e="on"+t.toLowerCase(),n=H.global[e];return n?(n.apply(H.global,[].slice.call(arguments,1)),!0):!1}:function(){return!1}}(),J={promiseCreated:r,promiseFulfilled:r,promiseRejected:r,promiseResolved:r,promiseCancelled:r,promiseChained:function(t,e,n){return{promise:e,child:n}},warning:function(t,e){return{warning:e}},unhandledRejection:function(t,e,n){return{reason:e,promise:n}},rejectionHandled:r},Y=function(t){var e=!1;try{e=K.apply(null,arguments)}catch(n){I.throwLater(n),e=!0}var r=!1;try{r=W(t,J[t].apply(null,arguments))}catch(n){I.throwLater(n),r=!0}return r||e};e.config=function(t){if(t=Object(t),"longStackTraces"in t&&(t.longStackTraces?e.longStackTraces():!t.longStackTraces&&e.hasLongStackTraces()&&X()),"warnings"in t){var n=t.warnings;rt.warnings=!!n,z=rt.warnings,H.isObject(n)&&"wForgottenReturn"in n&&(z=!!n.wForgottenReturn)}if("cancellation"in t&&t.cancellation&&!rt.cancellation){if(I.haveItemsQueued())throw new Error("cannot enable cancellation after promises are in use");e.prototype._clearCancellationData=l,e.prototype._propagateFrom=u,e.prototype._onCancel=a,e.prototype._setOnCancel=c,e.prototype._attachCancellationCallback=s,e.prototype._execute=o,Z=u,rt.cancellation=!0}"monitoring"in t&&(t.monitoring&&!rt.monitoring?(rt.monitoring=!0,e.prototype._fireEvent=Y):!t.monitoring&&rt.monitoring&&(rt.monitoring=!1,e.prototype._fireEvent=i))},e.prototype._fireEvent=i,e.prototype._execute=function(t,e,n){try{t(e,n)}catch(r){return r}},e.prototype._onCancel=function(){},e.prototype._setOnCancel=function(t){},e.prototype._attachCancellationCallback=function(t){},e.prototype._captureStackTrace=function(){},e.prototype._attachExtraTrace=function(){},e.prototype._clearCancellationData=function(){},e.prototype._propagateFrom=function(t,e){};var Z=p,tt=function(){return!1},et=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;H.inherits(O,Error),n.CapturedTrace=O,O.prototype.uncycle=function(){var t=this._length;if(!(2>t)){for(var e=[],n={},r=0,i=this;void 0!==i;++r)e.push(i),i=i._parent;t=this._length=r;for(var r=t-1;r>=0;--r){var o=e[r].stack;void 0===n[o]&&(n[o]=r)}for(var r=0;t>r;++r){var s=e[r].stack,a=n[s];if(void 0!==a&&a!==r){a>0&&(e[a-1]._parent=void 0,e[a-1]._length=1),e[r]._parent=void 0,e[r]._length=1;var c=r>0?e[r-1]:this;t-1>a?(c._parent=e[a+1],c._parent.uncycle(),c._length=c._parent._length+1):(c._parent=void 0,c._length=1);for(var l=c._length+1,u=r-2;u>=0;--u)e[u]._length=l,l++;return}}}},O.prototype.attachExtraTrace=function(t){if(!t.__stackCleaned__){this.uncycle();for(var e=j(t),n=e.message,r=[e.stack],i=this;void 0!==i;)r.push(w(i.stack.split("\n"))),i=i._parent;b(r),m(r),H.notEnumerableProp(t,"stack",g(n,r)),H.notEnumerableProp(t,"__stackCleaned__",!0)}};var nt=function(){var t=/^\s*at\s*/,e=function(t,e){return"string"==typeof t?t:void 0!==e.name&&void 0!==e.message?e.toString():F(e)};if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){Error.stackTraceLimit+=6,B=t,M=e;var n=Error.captureStackTrace;return tt=function(t){return U.test(t)},function(t,e){Error.stackTraceLimit+=6,n(t,e),Error.stackTraceLimit-=6}}var r=new Error;if("string"==typeof r.stack&&r.stack.split("\n")[0].indexOf("stackDetection@")>=0)return B=/@/,M=e,q=!0,function(t){t.stack=(new Error).stack};var i;try{throw new Error}catch(o){i="stack"in o}return"stack"in r||!i||"number"!=typeof Error.stackTraceLimit?(M=function(t,e){return"string"==typeof t?t:"object"!=typeof e&&"function"!=typeof e||void 0===e.name||void 0===e.message?F(e):e.toString()},null):(B=t,M=e,function(t){Error.stackTraceLimit+=6;try{throw new Error}catch(e){t.stack=e.stack}Error.stackTraceLimit-=6})}([]);"undefined"!=typeof console&&"undefined"!=typeof console.warn&&(D=function(t){console.warn(t)},H.isNode&&process.stderr.isTTY?D=function(t,e){var n=e?"[33m":"[31m";console.warn(n+t+"[0m\n")}:H.isNode||"string"!=typeof(new Error).stack||(D=function(t,e){console.warn("%c"+t,e?"color: darkorange":"color: red")}));var rt={warnings:$,longStackTraces:!1,cancellation:!1,monitoring:!1};return G&&e.longStackTraces(),{longStackTraces:function(){return rt.longStackTraces},warnings:function(){return rt.warnings},cancellation:function(){return rt.cancellation},monitoring:function(){return rt.monitoring},propagateFromFunction:function(){return Z},boundValueFunction:function(){return h},checkForgottenReturns:d,setBounds:P,warn:y,deprecated:v,CapturedTrace:O,fireDomEvent:W,fireGlobalEvent:K}}},{"./errors":12,"./util":36}],10:[function(t,e,n){"use strict";e.exports=function(t){function e(){return this.value}function n(){throw this.reason}t.prototype["return"]=t.prototype.thenReturn=function(n){return n instanceof t&&n.suppressUnhandledRejections(),this._then(e,void 0,void 0,{value:n},void 0)},t.prototype["throw"]=t.prototype.thenThrow=function(t){return this._then(n,void 0,void 0,{reason:t},void 0)},t.prototype.catchThrow=function(t){if(arguments.length<=1)return this._then(void 0,n,void 0,{reason:t},void 0);var e=arguments[1],r=function(){throw e};return this.caught(t,r)},t.prototype.catchReturn=function(n){if(arguments.length<=1)return n instanceof t&&n.suppressUnhandledRejections(),this._then(void 0,e,void 0,{value:n},void 0);var r=arguments[1];r instanceof t&&r.suppressUnhandledRejections();var i=function(){return r};return this.caught(n,i)}}},{}],11:[function(t,e,n){"use strict";e.exports=function(t,e){function n(){return o(this)}function r(t,n){return i(t,n,e,e)}var i=t.reduce,o=t.all;t.prototype.each=function(t){return this.mapSeries(t)._then(n,void 0,void 0,this,void 0)},t.prototype.mapSeries=function(t){return i(this,t,e,e)},t.each=function(t,e){return r(t,e)._then(n,void 0,void 0,t,void 0)},t.mapSeries=r}},{}],12:[function(t,e,n){"use strict";function r(t,e){function n(r){return this instanceof n?(p(this,"message","string"==typeof r?r:e),p(this,"name",t),void(Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):Error.call(this))):new n(r)}return u(n,Error),n}function i(t){return this instanceof i?(p(this,"name","OperationalError"),p(this,"message",t),this.cause=t,this.isOperational=!0,void(t instanceof Error?(p(this,"message",t.message),p(this,"stack",t.stack)):Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor))):new i(t)}var o,s,a=t("./es5"),c=a.freeze,l=t("./util"),u=l.inherits,p=l.notEnumerableProp,h=r("Warning","warning"),f=r("CancellationError","cancellation error"),_=r("TimeoutError","timeout error"),d=r("AggregateError","aggregate error");try{o=TypeError,s=RangeError}catch(v){o=r("TypeError","type error"),s=r("RangeError","range error")}for(var y="join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "),g=0;g<y.length;++g)"function"==typeof Array.prototype[y[g]]&&(d.prototype[y[g]]=Array.prototype[y[g]]);a.defineProperty(d.prototype,"length",{value:0,configurable:!1,writable:!0,enumerable:!0}),d.prototype.isOperational=!0;var m=0;d.prototype.toString=function(){var t=Array(4*m+1).join(" "),e="\n"+t+"AggregateError of:\n";m++,t=Array(4*m+1).join(" ");for(var n=0;n<this.length;++n){for(var r=this[n]===this?"[Circular AggregateError]":this[n]+"",i=r.split("\n"),o=0;o<i.length;++o)i[o]=t+i[o];r=i.join("\n"),e+=r+"\n"}return m--,e},u(i,Error);var b=Error.__BluebirdErrorTypes__;b||(b=c({CancellationError:f,TimeoutError:_,OperationalError:i,RejectionError:i,AggregateError:d}),a.defineProperty(Error,"__BluebirdErrorTypes__",{value:b,writable:!1,enumerable:!1,configurable:!1})),e.exports={Error:Error,TypeError:o,RangeError:s,CancellationError:b.CancellationError,OperationalError:b.OperationalError,TimeoutError:b.TimeoutError,AggregateError:b.AggregateError,Warning:h}},{"./es5":13,"./util":36}],13:[function(t,e,n){var r=function(){"use strict";return void 0===this}();if(r)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:r,propertyIsWritable:function(t,e){var n=Object.getOwnPropertyDescriptor(t,e);return!(n&&!n.writable&&!n.set)}};else{var i={}.hasOwnProperty,o={}.toString,s={}.constructor.prototype,a=function(t){var e=[];for(var n in t)i.call(t,n)&&e.push(n);return e},c=function(t,e){return{value:t[e]}},l=function(t,e,n){return t[e]=n.value,t},u=function(t){return t},p=function(t){try{return Object(t).constructor.prototype}catch(e){return s}},h=function(t){try{return"[object Array]"===o.call(t)}catch(e){return!1}};e.exports={isArray:h,keys:a,names:a,defineProperty:l,getDescriptor:c,freeze:u,getPrototypeOf:p,isES5:r,propertyIsWritable:function(){return!0}}}},{}],14:[function(t,e,n){"use strict";e.exports=function(t,e){var n=t.map;t.prototype.filter=function(t,r){return n(this,t,r,e)},t.filter=function(t,r,i){return n(t,r,i,e)}}},{}],15:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,e,n){this.promise=t,this.type=e,this.handler=n,this.called=!1,this.cancelPromise=null}function i(t){this.finallyHandler=t}function o(t,e){return null!=t.cancelPromise?(arguments.length>1?t.cancelPromise._reject(e):t.cancelPromise._cancel(),t.cancelPromise=null,!0):!1}function s(){return c.call(this,this.promise._target()._settledValue())}function a(t){return o(this,t)?void 0:(p.e=t,p)}function c(t){var r=this.promise,c=this.handler;if(!this.called){this.called=!0;var l=this.isFinallyHandler()?c.call(r._boundValue()):c.call(r._boundValue(),t);if(void 0!==l){r._setReturnedNonUndefined();var h=n(l,r);if(h instanceof e){if(null!=this.cancelPromise){if(h.isCancelled()){var f=new u("late cancellation observer");return r._attachExtraTrace(f),p.e=f,p}h.isPending()&&h._attachCancellationCallback(new i(this))}return h._then(s,a,void 0,this,void 0)}}}return r.isRejected()?(o(this),p.e=t,p):(o(this),t)}var l=t("./util"),u=e.CancellationError,p=l.errorObj;return r.prototype.isFinallyHandler=function(){return 0===this.type},i.prototype._resultCancelled=function(){o(this.finallyHandler)},e.prototype._passThrough=function(t,e,n,i){return"function"!=typeof t?this.then():this._then(n,i,void 0,new r(this,e,t),void 0)},e.prototype.lastly=e.prototype["finally"]=function(t){return this._passThrough(t,0,c,c)},e.prototype.tap=function(t){return this._passThrough(t,1,c)},r}},{"./util":36}],16:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,n,r){for(var o=0;o<n.length;++o){r._pushContext();var s=f(n[o])(t);if(r._popContext(),s===h){r._pushContext();var a=e.reject(h.e);return r._popContext(),a}var c=i(s,r);if(c instanceof e)return c}return null}function c(t,n,i,o){var s=this._promise=new e(r);s._captureStackTrace(),s._setOnCancel(this),this._stack=o,this._generatorFunction=t,this._receiver=n,this._generator=void 0,this._yieldHandlers="function"==typeof i?[i].concat(_):_,this._yieldedPromise=null}var l=t("./errors"),u=l.TypeError,p=t("./util"),h=p.errorObj,f=p.tryCatch,_=[];p.inherits(c,o),c.prototype._isResolved=function(){return null===this._promise},c.prototype._cleanup=function(){this._promise=this._generator=null},c.prototype._promiseCancelled=function(){if(!this._isResolved()){var t,n="undefined"!=typeof this._generator["return"];if(n)this._promise._pushContext(),t=f(this._generator["return"]).call(this._generator,void 0),this._promise._popContext();else{var r=new e.CancellationError("generator .return() sentinel");e.coroutine.returnSentinel=r,this._promise._attachExtraTrace(r),this._promise._pushContext(),t=f(this._generator["throw"]).call(this._generator,r),this._promise._popContext(),t===h&&t.e===r&&(t=null)}var i=this._promise;this._cleanup(),t===h?i._rejectCallback(t.e,!1):i.cancel()}},c.prototype._promiseFulfilled=function(t){this._yieldedPromise=null,this._promise._pushContext();var e=f(this._generator.next).call(this._generator,t);this._promise._popContext(),this._continue(e)},c.prototype._promiseRejected=function(t){this._yieldedPromise=null,this._promise._attachExtraTrace(t),this._promise._pushContext();var e=f(this._generator["throw"]).call(this._generator,t);this._promise._popContext(),this._continue(e)},c.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof e){var t=this._yieldedPromise;this._yieldedPromise=null,this._promiseCancelled(),t.cancel()}},c.prototype.promise=function(){return this._promise},c.prototype._run=function(){this._generator=this._generatorFunction.call(this._receiver),this._receiver=this._generatorFunction=void 0,this._promiseFulfilled(void 0)},c.prototype._continue=function(t){var n=this._promise;if(t===h)return this._cleanup(),n._rejectCallback(t.e,!1);var r=t.value;if(t.done===!0)return this._cleanup(),n._resolveCallback(r);var o=i(r,this._promise);if(!(o instanceof e)&&(o=a(o,this._yieldHandlers,this._promise),null===o))return void this._promiseRejected(new u("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",r)+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")));o=o._target();var s=o._bitField;0===(50397184&s)?(this._yieldedPromise=o,o._proxy(this,null)):0!==(33554432&s)?this._promiseFulfilled(o._value()):0!==(16777216&s)?this._promiseRejected(o._reason()):this._promiseCancelled()},e.coroutine=function(t,e){if("function"!=typeof t)throw new u("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var n=Object(e).yieldHandler,r=c,i=(new Error).stack;return function(){var e=t.apply(this,arguments),o=new r(void 0,void 0,n,i),s=o.promise();return o._generator=e,o._promiseFulfilled(void 0),s}},e.coroutine.addYieldHandler=function(t){if("function"!=typeof t)throw new u("expecting a function but got "+p.classString(t));_.push(t)},e.spawn=function(t){if(s.deprecated("Promise.spawn()","Promise.coroutine()"),"function"!=typeof t)return n("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var r=new c(t,this),i=r.promise();return r._run(e.spawn),i}}},{"./errors":12,"./util":36}],17:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){var o=t("./util");o.canEvaluate,o.tryCatch,o.errorObj;e.join=function(){var t,e=arguments.length-1;if(e>0&&"function"==typeof arguments[e]){t=arguments[e];var r}var i=[].slice.call(arguments);t&&i.pop();var r=new n(i).promise();return void 0!==t?r.spread(t):r}}},{"./util":36}],18:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,e,n,r){this.constructor$(t),this._promise._captureStackTrace();var i=l();this._callback=null===i?e:i.bind(e),this._preservedValues=r===o?new Array(this.length()):null,this._limit=n,this._inFlight=0,this._queue=n>=1?[]:f,this._init$(void 0,-2)}function c(t,e,n,i){if("function"!=typeof e)return r("expecting a function but got "+u.classString(e));var o="object"==typeof n&&null!==n?n.concurrency:0;return o="number"==typeof o&&isFinite(o)&&o>=1?o:0,new a(t,e,o,i).promise()}var l=e._getDomain,u=t("./util"),p=u.tryCatch,h=u.errorObj,f=[];u.inherits(a,n),a.prototype._init=function(){},a.prototype._promiseFulfilled=function(t,n){
var r=this._values,o=this.length(),a=this._preservedValues,c=this._limit;if(0>n){if(n=-1*n-1,r[n]=t,c>=1&&(this._inFlight--,this._drainQueue(),this._isResolved()))return!0}else{if(c>=1&&this._inFlight>=c)return r[n]=t,this._queue.push(n),!1;null!==a&&(a[n]=t);var l=this._promise,u=this._callback,f=l._boundValue();l._pushContext();var _=p(u).call(f,t,n,o),d=l._popContext();if(s.checkForgottenReturns(_,d,null!==a?"Promise.filter":"Promise.map",l),_===h)return this._reject(_.e),!0;var v=i(_,this._promise);if(v instanceof e){v=v._target();var y=v._bitField;if(0===(50397184&y))return c>=1&&this._inFlight++,r[n]=v,v._proxy(this,-1*(n+1)),!1;if(0===(33554432&y))return 0!==(16777216&y)?(this._reject(v._reason()),!0):(this._cancel(),!0);_=v._value()}r[n]=_}var g=++this._totalResolved;return g>=o?(null!==a?this._filter(r,a):this._resolve(r),!0):!1},a.prototype._drainQueue=function(){for(var t=this._queue,e=this._limit,n=this._values;t.length>0&&this._inFlight<e;){if(this._isResolved())return;var r=t.pop();this._promiseFulfilled(n[r],r)}},a.prototype._filter=function(t,e){for(var n=e.length,r=new Array(n),i=0,o=0;n>o;++o)t[o]&&(r[i++]=e[o]);r.length=i,this._resolve(r)},a.prototype.preservedValues=function(){return this._preservedValues},e.prototype.map=function(t,e){return c(this,t,e,null)},e.map=function(t,e,n,r){return c(t,e,n,r)}}},{"./util":36}],19:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){var s=t("./util"),a=s.tryCatch;e.method=function(t){if("function"!=typeof t)throw new e.TypeError("expecting a function but got "+s.classString(t));return function(){var r=new e(n);r._captureStackTrace(),r._pushContext();var i=a(t).apply(this,arguments),s=r._popContext();return o.checkForgottenReturns(i,s,"Promise.method",r),r._resolveFromSyncValue(i),r}},e.attempt=e["try"]=function(t){if("function"!=typeof t)return i("expecting a function but got "+s.classString(t));var r=new e(n);r._captureStackTrace(),r._pushContext();var c;if(arguments.length>1){o.deprecated("calling Promise.try with more than 1 argument");var l=arguments[1],u=arguments[2];c=s.isArray(l)?a(t).apply(u,l):a(t).call(u,l)}else c=a(t)();var p=r._popContext();return o.checkForgottenReturns(c,p,"Promise.try",r),r._resolveFromSyncValue(c),r},e.prototype._resolveFromSyncValue=function(t){t===s.errorObj?this._rejectCallback(t.e,!1):this._resolveCallback(t,!0)}}},{"./util":36}],20:[function(t,e,n){"use strict";function r(t){return t instanceof Error&&u.getPrototypeOf(t)===Error.prototype}function i(t){var e;if(r(t)){e=new l(t),e.name=t.name,e.message=t.message,e.stack=t.stack;for(var n=u.keys(t),i=0;i<n.length;++i){var o=n[i];p.test(o)||(e[o]=t[o])}return e}return s.markAsOriginatingFromRejection(t),t}function o(t,e){return function(n,r){if(null!==t){if(n){var o=i(a(n));t._attachExtraTrace(o),t._reject(o)}else if(e){var s=[].slice.call(arguments,1);t._fulfill(s)}else t._fulfill(r);t=null}}}var s=t("./util"),a=s.maybeWrapAsError,c=t("./errors"),l=c.OperationalError,u=t("./es5"),p=/^(?:name|message|stack|cause)$/;e.exports=o},{"./errors":12,"./es5":13,"./util":36}],21:[function(t,e,n){"use strict";e.exports=function(e){function n(t,e){var n=this;if(!o.isArray(t))return r.call(n,t,e);var i=a(e).apply(n._boundValue(),[null].concat(t));i===c&&s.throwLater(i.e)}function r(t,e){var n=this,r=n._boundValue(),i=void 0===t?a(e).call(r,null):a(e).call(r,null,t);i===c&&s.throwLater(i.e)}function i(t,e){var n=this;if(!t){var r=new Error(t+"");r.cause=t,t=r}var i=a(e).call(n._boundValue(),t);i===c&&s.throwLater(i.e)}var o=t("./util"),s=e._async,a=o.tryCatch,c=o.errorObj;e.prototype.asCallback=e.prototype.nodeify=function(t,e){if("function"==typeof t){var o=r;void 0!==e&&Object(e).spread&&(o=n),this._then(o,i,void 0,this,t)}return this}}},{"./util":36}],22:[function(t,e,n){"use strict";e.exports=function(){function e(){}function n(t,e){if("function"!=typeof e)throw new y("expecting a function but got "+h.classString(e));if(t.constructor!==r)throw new y("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n")}function r(t){this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,this._promise0=void 0,this._receiver0=void 0,t!==m&&(n(this,t),this._resolveFromExecutor(t)),this._promiseCreated(),this._fireEvent("promiseCreated",this)}function i(t){this.promise._resolveCallback(t)}function o(t){this.promise._rejectCallback(t,!1)}function s(t){var e=new r(m);e._fulfillmentHandler0=t,e._rejectionHandler0=t,e._promise0=t,e._receiver0=t}var a,c=function(){return new y("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")},l=function(){return new r.PromiseInspection(this._target())},u=function(t){return r.reject(new y(t))},p={},h=t("./util");a=h.isNode?function(){var t=process.domain;return void 0===t&&(t=null),t}:function(){return null},h.notEnumerableProp(r,"_getDomain",a);var f=t("./es5"),_=t("./async"),d=new _;f.defineProperty(r,"_async",{value:d});var v=t("./errors"),y=r.TypeError=v.TypeError;r.RangeError=v.RangeError;var g=r.CancellationError=v.CancellationError;r.TimeoutError=v.TimeoutError,r.OperationalError=v.OperationalError,r.RejectionError=v.OperationalError,r.AggregateError=v.AggregateError;var m=function(){},b={},w={},C=t("./thenables")(r,m),j=t("./promise_array")(r,m,C,u,e),k=t("./context")(r),E=k.create,F=t("./debuggability")(r,k),x=(F.CapturedTrace,t("./finally")(r,C)),T=t("./catch_filter")(w),R=t("./nodeback"),P=h.errorObj,O=h.tryCatch;return r.prototype.toString=function(){return"[object Promise]"},r.prototype.caught=r.prototype["catch"]=function(t){var e=arguments.length;if(e>1){var n,r=new Array(e-1),i=0;for(n=0;e-1>n;++n){var o=arguments[n];if(!h.isObject(o))return u("expecting an object but got "+h.classString(o));r[i++]=o}return r.length=i,t=arguments[n],this.then(void 0,T(r,t,this))}return this.then(void 0,t)},r.prototype.reflect=function(){return this._then(l,l,void 0,this,void 0)},r.prototype.then=function(t,e){if(F.warnings()&&arguments.length>0&&"function"!=typeof t&&"function"!=typeof e){var n=".then() only accepts functions but was passed: "+h.classString(t);arguments.length>1&&(n+=", "+h.classString(e)),this._warn(n)}return this._then(t,e,void 0,void 0,void 0)},r.prototype.done=function(t,e){var n=this._then(t,e,void 0,void 0,void 0);n._setIsFinal()},r.prototype.spread=function(t){return"function"!=typeof t?u("expecting a function but got "+h.classString(t)):this.all()._then(t,void 0,void 0,b,void 0)},r.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,fulfillmentValue:void 0,rejectionReason:void 0};return this.isFulfilled()?(t.fulfillmentValue=this.value(),t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this.reason(),t.isRejected=!0),t},r.prototype.all=function(){return arguments.length>0&&this._warn(".all() was passed arguments but it does not take any"),new j(this).promise()},r.prototype.error=function(t){return this.caught(h.originatesFromRejection,t)},r.is=function(t){return t instanceof r},r.fromNode=r.fromCallback=function(t){var e=new r(m);e._captureStackTrace();var n=arguments.length>1?!!Object(arguments[1]).multiArgs:!1,i=O(t)(R(e,n));return i===P&&e._rejectCallback(i.e,!0),e._isFateSealed()||e._setAsyncGuaranteed(),e},r.all=function(t){return new j(t).promise()},r.cast=function(t){var e=C(t);return e instanceof r||(e=new r(m),e._captureStackTrace(),e._setFulfilled(),e._rejectionHandler0=t),e},r.resolve=r.fulfilled=r.cast,r.reject=r.rejected=function(t){var e=new r(m);return e._captureStackTrace(),e._rejectCallback(t,!0),e},r.setScheduler=function(t){if("function"!=typeof t)throw new y("expecting a function but got "+h.classString(t));var e=d._schedule;return d._schedule=t,e},r.prototype._then=function(t,e,n,i,o){var s=void 0!==o,c=s?o:new r(m),l=this._target(),u=l._bitField;s||(c._propagateFrom(this,3),c._captureStackTrace(),void 0===i&&0!==(2097152&this._bitField)&&(i=0!==(50397184&u)?this._boundValue():l===this?void 0:this._boundTo),this._fireEvent("promiseChained",this,c));var p=a();if(0!==(50397184&u)){var h,f,_=l._settlePromiseCtx;0!==(33554432&u)?(f=l._rejectionHandler0,h=t):0!==(16777216&u)?(f=l._fulfillmentHandler0,h=e,l._unsetRejectionIsUnhandled()):(_=l._settlePromiseLateCancellationObserver,f=new g("late cancellation observer"),l._attachExtraTrace(f),h=e),d.invoke(_,l,{handler:null===p?h:"function"==typeof h&&p.bind(h),promise:c,receiver:i,value:f})}else l._addCallbacks(t,e,c,i,p);return c},r.prototype._length=function(){return 65535&this._bitField},r.prototype._isFateSealed=function(){return 0!==(117506048&this._bitField)},r.prototype._isFollowing=function(){return 67108864===(67108864&this._bitField)},r.prototype._setLength=function(t){this._bitField=-65536&this._bitField|65535&t},r.prototype._setFulfilled=function(){this._bitField=33554432|this._bitField,this._fireEvent("promiseFulfilled",this)},r.prototype._setRejected=function(){this._bitField=16777216|this._bitField,this._fireEvent("promiseRejected",this)},r.prototype._setFollowing=function(){this._bitField=67108864|this._bitField,this._fireEvent("promiseResolved",this)},r.prototype._setIsFinal=function(){this._bitField=4194304|this._bitField},r.prototype._isFinal=function(){return(4194304&this._bitField)>0},r.prototype._unsetCancelled=function(){this._bitField=-65537&this._bitField},r.prototype._setCancelled=function(){this._bitField=65536|this._bitField,this._fireEvent("promiseCancelled",this)},r.prototype._setAsyncGuaranteed=function(){this._bitField=134217728|this._bitField},r.prototype._receiverAt=function(t){var e=0===t?this._receiver0:this[4*t-4+3];return e===p?void 0:void 0===e&&this._isBound()?this._boundValue():e},r.prototype._promiseAt=function(t){return this[4*t-4+2]},r.prototype._fulfillmentHandlerAt=function(t){return this[4*t-4+0]},r.prototype._rejectionHandlerAt=function(t){return this[4*t-4+1]},r.prototype._boundValue=function(){},r.prototype._migrateCallback0=function(t){var e=(t._bitField,t._fulfillmentHandler0),n=t._rejectionHandler0,r=t._promise0,i=t._receiverAt(0);void 0===i&&(i=p),this._addCallbacks(e,n,r,i,null)},r.prototype._migrateCallbackAt=function(t,e){var n=t._fulfillmentHandlerAt(e),r=t._rejectionHandlerAt(e),i=t._promiseAt(e),o=t._receiverAt(e);void 0===o&&(o=p),this._addCallbacks(n,r,i,o,null)},r.prototype._addCallbacks=function(t,e,n,r,i){var o=this._length();if(o>=65531&&(o=0,this._setLength(0)),0===o)this._promise0=n,this._receiver0=r,"function"==typeof t&&(this._fulfillmentHandler0=null===i?t:i.bind(t)),"function"==typeof e&&(this._rejectionHandler0=null===i?e:i.bind(e));else{var s=4*o-4;this[s+2]=n,this[s+3]=r,"function"==typeof t&&(this[s+0]=null===i?t:i.bind(t)),"function"==typeof e&&(this[s+1]=null===i?e:i.bind(e))}return this._setLength(o+1),o},r.prototype._proxy=function(t,e){this._addCallbacks(void 0,void 0,e,t,null)},r.prototype._resolveCallback=function(t,e){if(0===(117506048&this._bitField)){if(t===this)return this._rejectCallback(c(),!1);var n=C(t,this);if(!(n instanceof r))return this._fulfill(t);e&&this._propagateFrom(n,2);var i=n._target();if(i===this)return void this._reject(c());var o=i._bitField;if(0===(50397184&o)){var s=this._length();s>0&&i._migrateCallback0(this);for(var a=1;s>a;++a)i._migrateCallbackAt(this,a);this._setFollowing(),this._setLength(0),this._setFollowee(i)}else if(0!==(33554432&o))this._fulfill(i._value());else if(0!==(16777216&o))this._reject(i._reason());else{var l=new g("late cancellation observer");i._attachExtraTrace(l),this._reject(l)}}},r.prototype._rejectCallback=function(t,e,n){var r=h.ensureErrorObject(t),i=r===t;if(!i&&!n&&F.warnings()){var o="a promise was rejected with a non-error: "+h.classString(t);this._warn(o,!0)}this._attachExtraTrace(r,e?i:!1),this._reject(t)},r.prototype._resolveFromExecutor=function(t){var e=this;this._captureStackTrace(),this._pushContext();var n=!0,r=this._execute(t,function(t){e._resolveCallback(t)},function(t){e._rejectCallback(t,n)});n=!1,this._popContext(),void 0!==r&&e._rejectCallback(r,!0)},r.prototype._settlePromiseFromHandler=function(t,e,n,r){var i=r._bitField;if(0===(65536&i)){r._pushContext();var o;e===b?n&&"number"==typeof n.length?o=O(t).apply(this._boundValue(),n):(o=P,o.e=new y("cannot .spread() a non-array: "+h.classString(n))):o=O(t).call(e,n);var s=r._popContext();i=r._bitField,0===(65536&i)&&(o===w?r._reject(n):o===P?r._rejectCallback(o.e,!1):(F.checkForgottenReturns(o,s,"",r,this),r._resolveCallback(o)))}},r.prototype._target=function(){for(var t=this;t._isFollowing();)t=t._followee();return t},r.prototype._followee=function(){return this._rejectionHandler0},r.prototype._setFollowee=function(t){this._rejectionHandler0=t},r.prototype._settlePromise=function(t,n,i,o){var s=t instanceof r,a=this._bitField,c=0!==(134217728&a);0!==(65536&a)?(s&&t._invokeInternalOnCancel(),i instanceof x&&i.isFinallyHandler()?(i.cancelPromise=t,O(n).call(i,o)===P&&t._reject(P.e)):n===l?t._fulfill(l.call(i)):i instanceof e?i._promiseCancelled(t):s||t instanceof j?t._cancel():i.cancel()):"function"==typeof n?s?(c&&t._setAsyncGuaranteed(),this._settlePromiseFromHandler(n,i,o,t)):n.call(i,o,t):i instanceof e?i._isResolved()||(0!==(33554432&a)?i._promiseFulfilled(o,t):i._promiseRejected(o,t)):s&&(c&&t._setAsyncGuaranteed(),0!==(33554432&a)?t._fulfill(o):t._reject(o))},r.prototype._settlePromiseLateCancellationObserver=function(t){var e=t.handler,n=t.promise,i=t.receiver,o=t.value;"function"==typeof e?n instanceof r?this._settlePromiseFromHandler(e,i,o,n):e.call(i,o,n):n instanceof r&&n._reject(o)},r.prototype._settlePromiseCtx=function(t){this._settlePromise(t.promise,t.handler,t.receiver,t.value)},r.prototype._settlePromise0=function(t,e,n){var r=this._promise0,i=this._receiverAt(0);this._promise0=void 0,this._receiver0=void 0,this._settlePromise(r,t,i,e)},r.prototype._clearCallbackDataAtIndex=function(t){var e=4*t-4;this[e+2]=this[e+3]=this[e+0]=this[e+1]=void 0},r.prototype._fulfill=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(t===this){var n=c();return this._attachExtraTrace(n),this._reject(n)}this._setFulfilled(),this._rejectionHandler0=t,(65535&e)>0&&(0!==(134217728&e)?this._settlePromises():d.settlePromises(this))}},r.prototype._reject=function(t){var e=this._bitField;if(!((117506048&e)>>>16))return this._setRejected(),this._fulfillmentHandler0=t,this._isFinal()?d.fatalError(t,h.isNode):void((65535&e)>0?d.settlePromises(this):this._ensurePossibleRejectionHandled())},r.prototype._fulfillPromises=function(t,e){for(var n=1;t>n;n++){var r=this._fulfillmentHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n);this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}},r.prototype._rejectPromises=function(t,e){for(var n=1;t>n;n++){var r=this._rejectionHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n);this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}},r.prototype._settlePromises=function(){var t=this._bitField,e=65535&t;if(e>0){if(0!==(16842752&t)){var n=this._fulfillmentHandler0;this._settlePromise0(this._rejectionHandler0,n,t),this._rejectPromises(e,n)}else{var r=this._rejectionHandler0;this._settlePromise0(this._fulfillmentHandler0,r,t),this._fulfillPromises(e,r)}this._setLength(0)}this._clearCancellationData()},r.prototype._settledValue=function(){var t=this._bitField;return 0!==(33554432&t)?this._rejectionHandler0:0!==(16777216&t)?this._fulfillmentHandler0:void 0},r.defer=r.pending=function(){F.deprecated("Promise.defer","new Promise");var t=new r(m);return{promise:t,resolve:i,reject:o}},h.notEnumerableProp(r,"_makeSelfResolutionError",c),t("./method")(r,m,C,u,F),t("./bind")(r,m,C,F),t("./cancel")(r,j,u,F),t("./direct_resolve")(r),t("./synchronous_inspection")(r),t("./join")(r,j,C,m,F),r.Promise=r,t("./map.js")(r,j,u,C,m,F),t("./using.js")(r,u,C,E,m,F),t("./timers.js")(r,m,F),t("./generators.js")(r,u,m,C,e,F),t("./nodeify.js")(r),t("./call_get.js")(r),t("./props.js")(r,j,C,u),t("./race.js")(r,m,C,u),t("./reduce.js")(r,j,u,C,m,F),t("./settle.js")(r,j,F),t("./some.js")(r,j,u),t("./promisify.js")(r,m),t("./any.js")(r),t("./each.js")(r,m),t("./filter.js")(r,m),h.toFastProperties(r),h.toFastProperties(r.prototype),s({a:1}),s({b:2}),s({c:3}),s(1),s(function(){}),s(void 0),s(!1),s(new r(m)),F.setBounds(_.firstLineError,h.lastLineError),r}},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){function s(t){switch(t){case-2:return[];case-3:return{}}}function a(t){var r=this._promise=new e(n);t instanceof e&&r._propagateFrom(t,3),r._setOnCancel(this),this._values=t,this._length=0,this._totalResolved=0,this._init(void 0,-2)}var c=t("./util");c.isArray;return c.inherits(a,o),a.prototype.length=function(){return this._length},a.prototype.promise=function(){return this._promise},a.prototype._init=function l(t,n){var o=r(this._values,this._promise);if(o instanceof e){o=o._target();var a=o._bitField;if(this._values=o,0===(50397184&a))return this._promise._setAsyncGuaranteed(),o._then(l,this._reject,void 0,this,n);if(0===(33554432&a))return 0!==(16777216&a)?this._reject(o._reason()):this._cancel();o=o._value()}if(o=c.asArray(o),null===o){var u=i("expecting an array or an iterable object but got "+c.classString(o)).reason();return void this._promise._rejectCallback(u,!1)}return 0===o.length?void(-5===n?this._resolveEmptyArray():this._resolve(s(n))):void this._iterate(o)},a.prototype._iterate=function(t){var n=this.getActualLength(t.length);this._length=n,this._values=this.shouldCopyValues()?new Array(n):this._values;for(var i=this._promise,o=!1,s=null,a=0;n>a;++a){var c=r(t[a],i);c instanceof e?(c=c._target(),s=c._bitField):s=null,o?null!==s&&c.suppressUnhandledRejections():null!==s?0===(50397184&s)?(c._proxy(this,a),this._values[a]=c):o=0!==(33554432&s)?this._promiseFulfilled(c._value(),a):0!==(16777216&s)?this._promiseRejected(c._reason(),a):this._promiseCancelled(a):o=this._promiseFulfilled(c,a)}o||i._setAsyncGuaranteed()},a.prototype._isResolved=function(){return null===this._values},a.prototype._resolve=function(t){this._values=null,this._promise._fulfill(t)},a.prototype._cancel=function(){!this._isResolved()&&this._promise.isCancellable()&&(this._values=null,this._promise._cancel())},a.prototype._reject=function(t){this._values=null,this._promise._rejectCallback(t,!1)},a.prototype._promiseFulfilled=function(t,e){this._values[e]=t;var n=++this._totalResolved;return n>=this._length?(this._resolve(this._values),!0):!1},a.prototype._promiseCancelled=function(){return this._cancel(),!0},a.prototype._promiseRejected=function(t){return this._totalResolved++,this._reject(t),!0},a.prototype._resultCancelled=function(){if(!this._isResolved()){var t=this._values;if(this._cancel(),t instanceof e)t.cancel();else for(var n=0;n<t.length;++n)t[n]instanceof e&&t[n].cancel()}},a.prototype.shouldCopyValues=function(){return!0},a.prototype.getActualLength=function(t){return t},a}},{"./util":36}],24:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t){return!C.test(t)}function i(t){try{return t.__isPromisified__===!0}catch(e){return!1}}function o(t,e,n){var r=f.getDataPropertyOrDefault(t,e+n,b);return r?i(r):!1}function s(t,e,n){for(var r=0;r<t.length;r+=2){var i=t[r];if(n.test(i))for(var o=i.replace(n,""),s=0;s<t.length;s+=2)if(t[s]===o)throw new g("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",e))}}function a(t,e,n,r){for(var a=f.inheritedDataKeys(t),c=[],l=0;l<a.length;++l){var u=a[l],p=t[u],h=r===j?!0:j(u,p,t);"function"!=typeof p||i(p)||o(t,u,e)||!r(u,p,t,h)||c.push(u,p)}return s(c,e,n),c}function c(t,r,i,o,s,a){function c(){var i=r;r===h&&(i=this);var o=new e(n);o._captureStackTrace();var s="string"==typeof u&&this!==l?this[u]:t,c=_(o,a);try{s.apply(i,d(arguments,c))}catch(p){o._rejectCallback(v(p),!0,!0)}return o._isFateSealed()||o._setAsyncGuaranteed(),o}var l=function(){return this}(),u=t;return"string"==typeof u&&(t=o),f.notEnumerableProp(c,"__isPromisified__",!0),c}function l(t,e,n,r,i){for(var o=new RegExp(k(e)+"$"),s=a(t,e,o,n),c=0,l=s.length;l>c;c+=2){var u=s[c],p=s[c+1],_=u+e;if(r===E)t[_]=E(u,h,u,p,e,i);else{var d=r(p,function(){return E(u,h,u,p,e,i)});f.notEnumerableProp(d,"__isPromisified__",!0),t[_]=d}}return f.toFastProperties(t),t}function u(t,e,n){return E(t,e,void 0,t,null,n)}var p,h={},f=t("./util"),_=t("./nodeback"),d=f.withAppended,v=f.maybeWrapAsError,y=f.canEvaluate,g=t("./errors").TypeError,m="Async",b={__isPromisified__:!0},w=["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"],C=new RegExp("^(?:"+w.join("|")+")$"),j=function(t){return f.isIdentifier(t)&&"_"!==t.charAt(0)&&"constructor"!==t},k=function(t){return t.replace(/([$])/,"\\$")},E=y?p:c;e.promisify=function(t,e){if("function"!=typeof t)throw new g("expecting a function but got "+f.classString(t));if(i(t))return t;e=Object(e);var n=void 0===e.context?h:e.context,o=!!e.multiArgs,s=u(t,n,o);return f.copyDescriptors(t,s,r),s},e.promisifyAll=function(t,e){if("function"!=typeof t&&"object"!=typeof t)throw new g("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");e=Object(e);var n=!!e.multiArgs,r=e.suffix;"string"!=typeof r&&(r=m);var i=e.filter;"function"!=typeof i&&(i=j);var o=e.promisifier;if("function"!=typeof o&&(o=E),!f.isIdentifier(r))throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");for(var s=f.inheritedDataKeys(t),a=0;a<s.length;++a){var c=t[s[a]];"constructor"!==s[a]&&f.isClass(c)&&(l(c.prototype,r,i,o,n),l(c,r,i,o,n))}return l(t,r,i,o,n)}}},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){function o(t){var e,n=!1;if(void 0!==a&&t instanceof a)e=p(t),n=!0;else{var r=u.keys(t),i=r.length;e=new Array(2*i);for(var o=0;i>o;++o){var s=r[o];e[o]=t[s],e[o+i]=s}}this.constructor$(e),this._isMap=n,this._init$(void 0,-3)}function s(t){var n,s=r(t);return l(s)?(n=s instanceof e?s._then(e.props,void 0,void 0,void 0,void 0):new o(s).promise(),s instanceof e&&n._propagateFrom(s,2),n):i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")}var a,c=t("./util"),l=c.isObject,u=t("./es5");"function"==typeof Map&&(a=Map);var p=function(){function t(t,r){this[e]=t,this[e+n]=r,e++}var e=0,n=0;return function(r){n=r.size,e=0;var i=new Array(2*r.size);return r.forEach(t,i),i}}(),h=function(t){for(var e=new a,n=t.length/2|0,r=0;n>r;++r){var i=t[n+r],o=t[r];e.set(i,o)}return e};c.inherits(o,n),o.prototype._init=function(){},o.prototype._promiseFulfilled=function(t,e){this._values[e]=t;var n=++this._totalResolved;if(n>=this._length){var r;if(this._isMap)r=h(this._values);else{r={};for(var i=this.length(),o=0,s=this.length();s>o;++o)r[this._values[o+i]]=this._values[o]}return this._resolve(r),!0}return!1},o.prototype.shouldCopyValues=function(){return!1},o.prototype.getActualLength=function(t){return t>>1},e.prototype.props=function(){return s(this)},e.props=function(t){return s(t)}}},{"./es5":13,"./util":36}],26:[function(t,e,n){"use strict";function r(t,e,n,r,i){for(var o=0;i>o;++o)n[o+r]=t[o+e],t[o+e]=void 0}function i(t){this._capacity=t,this._length=0,this._front=0}i.prototype._willBeOverCapacity=function(t){return this._capacity<t},i.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1);var n=this._front+e&this._capacity-1;this[n]=t,this._length=e+1},i.prototype._unshiftOne=function(t){var e=this._capacity;this._checkCapacity(this.length()+1);var n=this._front,r=(n-1&e-1^e)-e;this[r]=t,this._front=r,this._length=this.length()+1},i.prototype.unshift=function(t,e,n){this._unshiftOne(n),this._unshiftOne(e),this._unshiftOne(t)},i.prototype.push=function(t,e,n){var r=this.length()+3;if(this._willBeOverCapacity(r))return this._pushOne(t),this._pushOne(e),void this._pushOne(n);var i=this._front+r-3;this._checkCapacity(r);var o=this._capacity-1;this[i+0&o]=t,this[i+1&o]=e,this[i+2&o]=n,this._length=r},i.prototype.shift=function(){var t=this._front,e=this[t];return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e},i.prototype.length=function(){return this._length},i.prototype._checkCapacity=function(t){this._capacity<t&&this._resizeTo(this._capacity<<1)},i.prototype._resizeTo=function(t){var e=this._capacity;this._capacity=t;var n=this._front,i=this._length,o=n+i&e-1;r(this,0,this,e,o)},e.exports=i},{}],27:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){function o(t,o){var c=r(t);if(c instanceof e)return a(c);if(t=s.asArray(t),null===t)return i("expecting an array or an iterable object but got "+s.classString(t));var l=new e(n);void 0!==o&&l._propagateFrom(o,3);for(var u=l._fulfill,p=l._reject,h=0,f=t.length;f>h;++h){var _=t[h];(void 0!==_||h in t)&&e.cast(_)._then(u,p,void 0,l,null)}return l}var s=t("./util"),a=function(t){return t.then(function(e){return o(e,t)})};e.race=function(t){return o(t,void 0)},e.prototype.race=function(){return o(this,void 0)}}},{"./util":36}],28:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t,n,r,i){this.constructor$(t);var s=h();this._fn=null===s?n:s.bind(n),void 0!==r&&(r=e.resolve(r),r._attachCancellationCallback(this)),this._initialValue=r,this._currentCancellable=null,this._eachValues=i===o?[]:void 0,this._promise._captureStackTrace(),this._init$(void 0,-5)}function c(t,e){this.isFulfilled()?e._resolve(t):e._reject(t)}function l(t,e,n,i){if("function"!=typeof e)return r("expecting a function but got "+f.classString(e));var o=new a(t,e,n,i);return o.promise()}function u(t){this.accum=t,this.array._gotAccum(t);var n=i(this.value,this.array._promise);return n instanceof e?(this.array._currentCancellable=n,n._then(p,void 0,void 0,this,void 0)):p.call(this,n)}function p(t){var n=this.array,r=n._promise,i=_(n._fn);r._pushContext();var o;o=void 0!==n._eachValues?i.call(r._boundValue(),t,this.index,this.length):i.call(r._boundValue(),this.accum,t,this.index,this.length),o instanceof e&&(n._currentCancellable=o);var a=r._popContext();return s.checkForgottenReturns(o,a,void 0!==n._eachValues?"Promise.each":"Promise.reduce",r),o}var h=e._getDomain,f=t("./util"),_=f.tryCatch;f.inherits(a,n),a.prototype._gotAccum=function(t){void 0!==this._eachValues&&t!==o&&this._eachValues.push(t)},a.prototype._eachComplete=function(t){return this._eachValues.push(t),this._eachValues},a.prototype._init=function(){},a.prototype._resolveEmptyArray=function(){this._resolve(void 0!==this._eachValues?this._eachValues:this._initialValue)},a.prototype.shouldCopyValues=function(){return!1},a.prototype._resolve=function(t){this._promise._resolveCallback(t),this._values=null},a.prototype._resultCancelled=function(t){return t===this._initialValue?this._cancel():void(this._isResolved()||(this._resultCancelled$(),this._currentCancellable instanceof e&&this._currentCancellable.cancel(),this._initialValue instanceof e&&this._initialValue.cancel()))},a.prototype._iterate=function(t){this._values=t;var n,r,i=t.length;if(void 0!==this._initialValue?(n=this._initialValue,r=0):(n=e.resolve(t[0]),r=1),this._currentCancellable=n,!n.isRejected())for(;i>r;++r){var o={accum:null,value:t[r],index:r,length:i,array:this};n=n._then(u,void 0,void 0,o,void 0)}void 0!==this._eachValues&&(n=n._then(this._eachComplete,void 0,void 0,this,void 0)),n._then(c,c,void 0,n,this)},e.prototype.reduce=function(t,e){return l(this,t,e,null)},e.reduce=function(t,e,n,r){return l(t,e,n,r)}}},{"./util":36}],29:[function(t,e,n){"use strict";var r,i=t("./util"),o=function(){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")};if(i.isNode&&"undefined"==typeof MutationObserver){var s=global.setImmediate,a=process.nextTick;r=i.isRecentNode?function(t){s.call(global,t)}:function(t){a.call(process,t)}}else r="undefined"==typeof MutationObserver||"undefined"!=typeof window&&window.navigator&&window.navigator.standalone?"undefined"!=typeof setImmediate?function(t){setImmediate(t)}:"undefined"!=typeof setTimeout?function(t){setTimeout(t,0)}:o:function(){var t=document.createElement("div"),e={attributes:!0},n=!1,r=document.createElement("div"),i=new MutationObserver(function(){t.classList.toggle("foo"),n=!1});i.observe(r,e);var o=function(){n||(n=!0,r.classList.toggle("foo"))};return function(n){var r=new MutationObserver(function(){r.disconnect(),n()});r.observe(t,e),o()}}();e.exports=r},{"./util":36}],30:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.constructor$(t)}var o=e.PromiseInspection,s=t("./util");s.inherits(i,n),i.prototype._promiseResolved=function(t,e){this._values[t]=e;var n=++this._totalResolved;return n>=this._length?(this._resolve(this._values),!0):!1},i.prototype._promiseFulfilled=function(t,e){var n=new o;return n._bitField=33554432,n._settledValueField=t,this._promiseResolved(e,n)},i.prototype._promiseRejected=function(t,e){var n=new o;return n._bitField=16777216,n._settledValueField=t,this._promiseResolved(e,n)},e.settle=function(t){return r.deprecated(".settle()",".reflect()"),new i(t).promise()},e.prototype.settle=function(){return e.settle(this)}}},{"./util":36}],31:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.constructor$(t),this._howMany=0,this._unwrap=!1,this._initialized=!1}function o(t,e){if((0|e)!==e||0>e)return r("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");var n=new i(t),o=n.promise();return n.setHowMany(e),n.init(),o}var s=t("./util"),a=t("./errors").RangeError,c=t("./errors").AggregateError,l=s.isArray,u={};s.inherits(i,n),i.prototype._init=function(){if(this._initialized){if(0===this._howMany)return void this._resolve([]);this._init$(void 0,-5);var t=l(this._values);!this._isResolved()&&t&&this._howMany>this._canPossiblyFulfill()&&this._reject(this._getRangeError(this.length()))}},i.prototype.init=function(){this._initialized=!0,this._init()},i.prototype.setUnwrap=function(){this._unwrap=!0},i.prototype.howMany=function(){return this._howMany},i.prototype.setHowMany=function(t){this._howMany=t},i.prototype._promiseFulfilled=function(t){return this._addFulfilled(t),this._fulfilled()===this.howMany()?(this._values.length=this.howMany(),1===this.howMany()&&this._unwrap?this._resolve(this._values[0]):this._resolve(this._values),!0):!1},i.prototype._promiseRejected=function(t){return this._addRejected(t),this._checkOutcome()},i.prototype._promiseCancelled=function(){return this._values instanceof e||null==this._values?this._cancel():(this._addRejected(u),this._checkOutcome())},i.prototype._checkOutcome=function(){if(this.howMany()>this._canPossiblyFulfill()){for(var t=new c,e=this.length();e<this._values.length;++e)this._values[e]!==u&&t.push(this._values[e]);return t.length>0?this._reject(t):this._cancel(),!0}return!1},i.prototype._fulfilled=function(){return this._totalResolved},i.prototype._rejected=function(){return this._values.length-this.length()},i.prototype._addRejected=function(t){this._values.push(t)},i.prototype._addFulfilled=function(t){this._values[this._totalResolved++]=t},i.prototype._canPossiblyFulfill=function(){return this.length()-this._rejected()},i.prototype._getRangeError=function(t){var e="Input array must contain at least "+this._howMany+" items but contains only "+t+" items";return new a(e)},i.prototype._resolveEmptyArray=function(){this._reject(this._getRangeError(0))},e.some=function(t,e){return o(t,e)},e.prototype.some=function(t){return o(this,t)},e._SomePromiseArray=i}},{"./errors":12,"./util":36}],32:[function(t,e,n){"use strict";e.exports=function(t){function e(t){void 0!==t?(t=t._target(),
this._bitField=t._bitField,this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,this._settledValueField=void 0)}e.prototype._settledValue=function(){return this._settledValueField};var n=e.prototype.value=function(){if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},r=e.prototype.error=e.prototype.reason=function(){if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},i=e.prototype.isFulfilled=function(){return 0!==(33554432&this._bitField)},o=e.prototype.isRejected=function(){return 0!==(16777216&this._bitField)},s=e.prototype.isPending=function(){return 0===(50397184&this._bitField)},a=e.prototype.isResolved=function(){return 0!==(50331648&this._bitField)};e.prototype.isCancelled=t.prototype._isCancelled=function(){return 65536===(65536&this._bitField)},t.prototype.isCancelled=function(){return this._target()._isCancelled()},t.prototype.isPending=function(){return s.call(this._target())},t.prototype.isRejected=function(){return o.call(this._target())},t.prototype.isFulfilled=function(){return i.call(this._target())},t.prototype.isResolved=function(){return a.call(this._target())},t.prototype.value=function(){return n.call(this._target())},t.prototype.reason=function(){var t=this._target();return t._unsetRejectionIsUnhandled(),r.call(t)},t.prototype._value=function(){return this._settledValue()},t.prototype._reason=function(){return this._unsetRejectionIsUnhandled(),this._settledValue()},t.PromiseInspection=e}},{}],33:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,r){if(u(t)){if(t instanceof e)return t;var i=o(t);if(i===l){r&&r._pushContext();var c=e.reject(i.e);return r&&r._popContext(),c}if("function"==typeof i){if(s(t)){var c=new e(n);return t._then(c._fulfill,c._reject,void 0,c,null),c}return a(t,i,r)}}return t}function i(t){return t.then}function o(t){try{return i(t)}catch(e){return l.e=e,l}}function s(t){return p.call(t,"_promise0")}function a(t,r,i){function o(t){a&&(a._resolveCallback(t),a=null)}function s(t){a&&(a._rejectCallback(t,p,!0),a=null)}var a=new e(n),u=a;i&&i._pushContext(),a._captureStackTrace(),i&&i._popContext();var p=!0,h=c.tryCatch(r).call(t,o,s);return p=!1,a&&h===l&&(a._rejectCallback(h.e,!0,!0),a=null),u}var c=t("./util"),l=c.errorObj,u=c.isObject,p={}.hasOwnProperty;return r}},{"./util":36}],34:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.handle=t}function o(t){return clearTimeout(this.handle),t}function s(t){throw clearTimeout(this.handle),t}var a=t("./util"),c=e.TimeoutError;i.prototype._resultCancelled=function(){clearTimeout(this.handle)};var l=function(t){return u(+this).thenReturn(t)},u=e.delay=function(t,o){var s,a;return void 0!==o?(s=e.resolve(o)._then(l,null,null,t,void 0),r.cancellation()&&o instanceof e&&s._setOnCancel(o)):(s=new e(n),a=setTimeout(function(){s._fulfill()},+t),r.cancellation()&&s._setOnCancel(new i(a))),s._setAsyncGuaranteed(),s};e.prototype.delay=function(t){return u(t,this)};var p=function(t,e,n){var r;r="string"!=typeof e?e instanceof Error?e:new c("operation timed out"):new c(e),a.markAsOriginatingFromRejection(r),t._attachExtraTrace(r),t._reject(r),null!=n&&n.cancel()};e.prototype.timeout=function(t,e){t=+t;var n,a,c=new i(setTimeout(function(){n.isPending()&&p(n,e,a)},t));return r.cancellation()?(a=this.then(),n=a._then(o,s,void 0,c,void 0),n._setOnCancel(c)):n=this._then(o,s,void 0,c,void 0),n}}},{"./util":36}],35:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t){setTimeout(function(){throw t},0)}function c(t){var e=r(t);return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),e}function l(t,n){function i(){if(s>=l)return u._fulfill();var o=c(t[s++]);if(o instanceof e&&o._isDisposable()){try{o=r(o._getDisposer().tryDispose(n),t.promise)}catch(p){return a(p)}if(o instanceof e)return o._then(i,a,null,null,null)}i()}var s=0,l=t.length,u=new e(o);return i(),u}function u(t,e,n){this._data=t,this._promise=e,this._context=n}function p(t,e,n){this.constructor$(t,e,n)}function h(t){return u.isDisposer(t)?(this.resources[this.index]._setDisposable(t),t.promise()):t}function f(t){this.length=t,this.promise=null,this[t-1]=null}var _=t("./util"),d=t("./errors").TypeError,v=t("./util").inherits,y=_.errorObj,g=_.tryCatch;u.prototype.data=function(){return this._data},u.prototype.promise=function(){return this._promise},u.prototype.resource=function(){return this.promise().isFulfilled()?this.promise().value():null},u.prototype.tryDispose=function(t){var e=this.resource(),n=this._context;void 0!==n&&n._pushContext();var r=null!==e?this.doDispose(e,t):null;return void 0!==n&&n._popContext(),this._promise._unsetDisposable(),this._data=null,r},u.isDisposer=function(t){return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},v(p,u),p.prototype.doDispose=function(t,e){var n=this.data();return n.call(t,t,e)},f.prototype._resultCancelled=function(){for(var t=this.length,n=0;t>n;++n){var r=this[n];r instanceof e&&r.cancel()}},e.using=function(){var t=arguments.length;if(2>t)return n("you must pass at least 2 arguments to Promise.using");var i=arguments[t-1];if("function"!=typeof i)return n("expecting a function but got "+_.classString(i));var o,a=!0;2===t&&Array.isArray(arguments[0])?(o=arguments[0],t=o.length,a=!1):(o=arguments,t--);for(var c=new f(t),p=0;t>p;++p){var d=o[p];if(u.isDisposer(d)){var v=d;d=d.promise(),d._setDisposable(v)}else{var m=r(d);m instanceof e&&(d=m._then(h,null,null,{resources:c,index:p},void 0))}c[p]=d}for(var b=new Array(c.length),p=0;p<b.length;++p)b[p]=e.resolve(c[p]).reflect();var w=e.all(b).then(function(t){for(var e=0;e<t.length;++e){var n=t[e];if(n.isRejected())return y.e=n.error(),y;if(!n.isFulfilled())return void w.cancel();t[e]=n.value()}C._pushContext(),i=g(i);var r=a?i.apply(void 0,t):i(t),o=C._popContext();return s.checkForgottenReturns(r,o,"Promise.using",C),r}),C=w.lastly(function(){var t=new e.PromiseInspection(w);return l(c,t)});return c.promise=C,C._setOnCancel(c),C},e.prototype._setDisposable=function(t){this._bitField=131072|this._bitField,this._disposer=t},e.prototype._isDisposable=function(){return(131072&this._bitField)>0},e.prototype._getDisposer=function(){return this._disposer},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,this._disposer=void 0},e.prototype.disposer=function(t){if("function"==typeof t)return new p(t,this,i());throw new d}}},{"./errors":12,"./util":36}],36:[function(t,e,n){"use strict";function r(){try{var t=x;return x=null,t.apply(this,arguments)}catch(e){return F.e=e,F}}function i(t){return x=t,r}function o(t){return null==t||t===!0||t===!1||"string"==typeof t||"number"==typeof t}function s(t){return"function"==typeof t||"object"==typeof t&&null!==t}function a(t){return o(t)?new Error(v(t)):t}function c(t,e){var n,r=t.length,i=new Array(r+1);for(n=0;r>n;++n)i[n]=t[n];return i[n]=e,i}function l(t,e,n){if(!k.isES5)return{}.hasOwnProperty.call(t,e)?t[e]:void 0;var r=Object.getOwnPropertyDescriptor(t,e);return null!=r?null==r.get&&null==r.set?r.value:n:void 0}function u(t,e,n){if(o(t))return t;var r={value:n,configurable:!0,enumerable:!1,writable:!0};return k.defineProperty(t,e,r),t}function p(t){throw t}function h(t){try{if("function"==typeof t){var e=k.names(t.prototype),n=k.isES5&&e.length>1,r=e.length>0&&!(1===e.length&&"constructor"===e[0]),i=O.test(t+"")&&k.names(t).length>0;if(n||r||i)return!0}return!1}catch(o){return!1}}function f(t){function e(){}e.prototype=t;for(var n=8;n--;)new e;return t}function _(t){return S.test(t)}function d(t,e,n){for(var r=new Array(t),i=0;t>i;++i)r[i]=e+i+n;return r}function v(t){try{return t+""}catch(e){return"[no string representation]"}}function y(t){return null!==t&&"object"==typeof t&&"string"==typeof t.message&&"string"==typeof t.name}function g(t){try{u(t,"isOperational",!0)}catch(e){}}function m(t){return null==t?!1:t instanceof Error.__BluebirdErrorTypes__.OperationalError||t.isOperational===!0}function b(t){return y(t)&&k.propertyIsWritable(t,"stack")}function w(t){return{}.toString.call(t)}function C(t,e,n){for(var r=k.names(t),i=0;i<r.length;++i){var o=r[i];if(n(o))try{k.defineProperty(e,o,k.getDescriptor(t,o))}catch(s){}}}function j(t,e){return I?process.env[t]:e}var k=t("./es5"),E="undefined"==typeof navigator,F={e:{}},x,T="undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0!==this?this:null,R=function(t,e){function n(){this.constructor=t,this.constructor$=e;for(var n in e.prototype)r.call(e.prototype,n)&&"$"!==n.charAt(n.length-1)&&(this[n+"$"]=e.prototype[n])}var r={}.hasOwnProperty;return n.prototype=e.prototype,t.prototype=new n,t.prototype},P=function(){var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){for(var n=0;n<t.length;++n)if(t[n]===e)return!0;return!1};if(k.isES5){var n=Object.getOwnPropertyNames;return function(t){for(var r=[],i=Object.create(null);null!=t&&!e(t);){var o;try{o=n(t)}catch(s){return r}for(var a=0;a<o.length;++a){var c=o[a];if(!i[c]){i[c]=!0;var l=Object.getOwnPropertyDescriptor(t,c);null!=l&&null==l.get&&null==l.set&&r.push(c)}}t=k.getPrototypeOf(t)}return r}}var r={}.hasOwnProperty;return function(n){if(e(n))return[];var i=[];t:for(var o in n)if(r.call(n,o))i.push(o);else{for(var s=0;s<t.length;++s)if(r.call(t[s],o))continue t;i.push(o)}return i}}(),O=/this\s*\.\s*\S+\s*=/,S=/^[a-z$_][a-z$_0-9]*$/i,A=function(){return"stack"in new Error?function(t){return b(t)?t:new Error(v(t))}:function(t){if(b(t))return t;try{throw new Error(v(t))}catch(e){return e}}}(),D=function(t){return k.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){var V="function"==typeof Array.from?function(t){return Array.from(t)}:function(t){for(var e,n=[],r=t[Symbol.iterator]();!(e=r.next()).done;)n.push(e.value);return n};D=function(t){return k.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?V(t):null}}var I="undefined"!=typeof process&&"[object process]"===w(process).toLowerCase(),L={isClass:h,isIdentifier:_,inheritedDataKeys:P,getDataPropertyOrDefault:l,thrower:p,isArray:k.isArray,asArray:D,notEnumerableProp:u,isPrimitive:o,isObject:s,isError:y,canEvaluate:E,errorObj:F,tryCatch:i,inherits:R,withAppended:c,maybeWrapAsError:a,toFastProperties:f,filledRange:d,toString:v,canAttachTrace:b,ensureErrorObject:A,originatesFromRejection:m,markAsOriginatingFromRejection:g,classString:w,copyDescriptors:C,hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,isNode:I,env:j,global:T};L.isRecentNode=L.isNode&&function(){var t=process.versions.node.split(".").map(Number);return 0===t[0]&&t[1]>10||t[0]>0}(),L.isNode&&L.toFastProperties(process);try{throw new Error}catch(H){L.lastLineError=H}e.exports=L},{"./es5":13}]},{},[4])(4)}),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise);!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.topojson={})}(this,function(n){"use strict";function t(){}function r(n){if(!n)return t;var r,e,o=n.scale[0],i=n.scale[1],u=n.translate[0],f=n.translate[1];return function(n,t){t||(r=e=0),n[0]=(r+=n[0])*o+u,n[1]=(e+=n[1])*i+f}}function e(n){if(!n)return t;var r,e,o=n.scale[0],i=n.scale[1],u=n.translate[0],f=n.translate[1];return function(n,t){t||(r=e=0);var c=(n[0]-u)/o|0,a=(n[1]-f)/i|0;n[0]=c-r,n[1]=a-e,r=c,e=a}}function o(n,t){for(var r,e=n.length,o=e-t;o<--e;)r=n[o],n[o++]=n[e],n[e]=r}function i(n,t){for(var r=0,e=n.length;e>r;){var o=r+e>>>1;n[o]<t?r=o+1:e=o}return r}function u(n,t){return"GeometryCollection"===t.type?{type:"FeatureCollection",features:t.geometries.map(function(t){return f(n,t)})}:f(n,t)}function f(n,t){var r={type:"Feature",id:t.id,properties:t.properties||{},geometry:c(n,t)};return null==t.id&&delete r.id,r}function c(n,t){function e(n,t){t.length&&t.pop();for(var r,e=l[0>n?~n:n],i=0,u=e.length;u>i;++i)t.push(r=e[i].slice()),s(r,i);0>n&&o(t,u)}function i(n){return n=n.slice(),s(n,0),n}function u(n){for(var t=[],r=0,o=n.length;o>r;++r)e(n[r],t);return t.length<2&&t.push(t[0].slice()),t}function f(n){for(var t=u(n);t.length<4;)t.push(t[0].slice());return t}function c(n){return n.map(f)}function a(n){var t=n.type;return"GeometryCollection"===t?{type:t,geometries:n.geometries.map(a)}:t in h?{type:t,coordinates:h[t](n)}:null}var s=r(n.transform),l=n.arcs,h={Point:function(n){return i(n.coordinates)},MultiPoint:function(n){return n.coordinates.map(i)},LineString:function(n){return u(n.arcs)},MultiLineString:function(n){return n.arcs.map(u)},Polygon:function(n){return c(n.arcs)},MultiPolygon:function(n){return n.arcs.map(c)}};return a(t)}function a(n,t){function r(t){var r,e=n.arcs[0>t?~t:t],o=e[0];return n.transform?(r=[0,0],e.forEach(function(n){r[0]+=n[0],r[1]+=n[1]})):r=e[e.length-1],0>t?[r,o]:[o,r]}function e(n,t){for(var r in n){var e=n[r];delete t[e.start],delete e.start,delete e.end,e.forEach(function(n){o[0>n?~n:n]=1}),f.push(e)}}var o={},i={},u={},f=[],c=-1;return t.forEach(function(r,e){var o,i=n.arcs[0>r?~r:r];i.length<3&&!i[1][0]&&!i[1][1]&&(o=t[++c],t[c]=r,t[e]=o)}),t.forEach(function(n){var t,e,o=r(n),f=o[0],c=o[1];if(t=u[f])if(delete u[t.end],t.push(n),t.end=c,e=i[c]){delete i[e.start];var a=e===t?t:t.concat(e);i[a.start=t.start]=u[a.end=e.end]=a}else i[t.start]=u[t.end]=t;else if(t=i[c])if(delete i[t.start],t.unshift(n),t.start=f,e=u[f]){delete u[e.end];var s=e===t?t:e.concat(t);i[s.start=e.start]=u[s.end=t.end]=s}else i[t.start]=u[t.end]=t;else t=[n],i[t.start=f]=u[t.end=c]=t}),e(u,i),e(i,u),t.forEach(function(n){o[0>n?~n:n]||f.push([n])}),f}function s(n){return c(n,l.apply(this,arguments))}function l(n,t,r){function e(n){var t=0>n?~n:n;(s[t]||(s[t]=[])).push({i:n,g:c})}function o(n){n.forEach(e)}function i(n){n.forEach(o)}function u(n){"GeometryCollection"===n.type?n.geometries.forEach(u):n.type in l&&(c=n,l[n.type](n.arcs))}var f=[];if(arguments.length>1){var c,s=[],l={LineString:o,MultiLineString:i,Polygon:i,MultiPolygon:function(n){n.forEach(i)}};u(t),s.forEach(arguments.length<3?function(n){f.push(n[0].i)}:function(n){r(n[0].g,n[n.length-1].g)&&f.push(n[0].i)})}else for(var h=0,p=n.arcs.length;p>h;++h)f.push(h);return{type:"MultiLineString",arcs:a(n,f)}}function h(n){var t=n[0],r=n[1],e=n[2];return Math.abs((t[0]-e[0])*(r[1]-t[1])-(t[0]-r[0])*(e[1]-t[1]))}function p(n){for(var t,r=-1,e=n.length,o=n[e-1],i=0;++r<e;)t=o,o=n[r],i+=t[0]*o[1]-t[1]*o[0];return i/2}function g(n){return c(n,v.apply(this,arguments))}function v(n,t){function r(n){n.forEach(function(t){t.forEach(function(t){(o[t=0>t?~t:t]||(o[t]=[])).push(n)})}),i.push(n)}function e(t){return p(c(n,{type:"Polygon",arcs:[t]}).coordinates[0])>0}var o={},i=[],u=[];return t.forEach(function(n){"Polygon"===n.type?r(n.arcs):"MultiPolygon"===n.type&&n.arcs.forEach(r)}),i.forEach(function(n){if(!n._){var t=[],r=[n];for(n._=1,u.push(t);n=r.pop();)t.push(n),n.forEach(function(n){n.forEach(function(n){o[0>n?~n:n].forEach(function(n){n._||(n._=1,r.push(n))})})})}}),i.forEach(function(n){delete n._}),{type:"MultiPolygon",arcs:u.map(function(t){var r,i=[];if(t.forEach(function(n){n.forEach(function(n){n.forEach(function(n){o[0>n?~n:n].length<2&&i.push(n)})})}),i=a(n,i),(r=i.length)>1)for(var u,f=e(t[0][0]),c=0;r>c;++c)if(f===e(i[c])){u=i[0],i[0]=i[c],i[c]=u;break}return i})}}function y(n){function t(n,t){n.forEach(function(n){0>n&&(n=~n);var r=o[n];r?r.push(t):o[n]=[t]})}function r(n,r){n.forEach(function(n){t(n,r)})}function e(n,t){"GeometryCollection"===n.type?n.geometries.forEach(function(n){e(n,t)}):n.type in f&&f[n.type](n.arcs,t)}var o={},u=n.map(function(){return[]}),f={LineString:t,MultiLineString:r,Polygon:r,MultiPolygon:function(n,t){n.forEach(function(n){r(n,t)})}};n.forEach(e);for(var c in o)for(var a=o[c],s=a.length,l=0;s>l;++l)for(var h=l+1;s>h;++h){var p,g=a[l],v=a[h];(p=u[g])[c=i(p,v)]!==v&&p.splice(c,0,v),(p=u[v])[c=i(p,g)]!==g&&p.splice(c,0,g)}return u}function d(n,t){return n[1][2]-t[1][2]}function m(){function n(n,t){for(;t>0;){var r=(t+1>>1)-1,o=e[r];if(d(n,o)>=0)break;e[o._=t]=o,e[n._=t=r]=n}}function t(n,t){for(;;){var r=t+1<<1,i=r-1,u=t,f=e[u];if(o>i&&d(e[i],f)<0&&(f=e[u=i]),o>r&&d(e[r],f)<0&&(f=e[u=r]),u===t)break;e[f._=t]=f,e[n._=t=u]=n}}var r={},e=[],o=0;return r.push=function(t){return n(e[t._=o]=t,o++),o},r.pop=function(){if(!(0>=o)){var n,r=e[0];return--o>0&&(n=e[o],t(e[n._=0]=n,0)),r}},r.remove=function(r){var i,u=r._;if(e[u]===r)return u!==--o&&(i=e[o],(d(i,r)<0?n:t)(e[i._=u]=i,u)),u},r}function E(n,t){function o(n){f.remove(n),n[1][2]=t(n),f.push(n)}var i=r(n.transform),u=e(n.transform),f=m();return t||(t=h),n.arcs.forEach(function(n){var r,e,c,a,s=[],l=0;for(e=0,c=n.length;c>e;++e)a=n[e],i(n[e]=[a[0],a[1],1/0],e);for(e=1,c=n.length-1;c>e;++e)r=n.slice(e-1,e+2),r[1][2]=t(r),s.push(r),f.push(r);for(e=0,c=s.length;c>e;++e)r=s[e],r.previous=s[e-1],r.next=s[e+1];for(;r=f.pop();){var h=r.previous,p=r.next;r[1][2]<l?r[1][2]=l:l=r[1][2],h&&(h.next=p,h[2]=r[2],o(h)),p&&(p.previous=h,p[0]=r[0],o(p))}n.forEach(u)}),n}var _="1.6.24";n.version=_,n.mesh=s,n.meshArcs=l,n.merge=g,n.mergeArcs=v,n.feature=u,n.neighbors=y,n.presimplify=E});!function(){function t(t,a){return{type:"Feature",id:t.id,properties:t.properties,geometry:n(t.geometry,a)}}function n(t,a){if(!t)return null;if("GeometryCollection"===t.type)return{type:"GeometryCollection",geometries:object.geometries.map(function(t){return n(t,a)})};if(!ga.hasOwnProperty(t.type))return null;var r=ga[t.type];return d3.geo.stream(t,a(r)),r.result()}function a(){}function r(t){if((n=t.length)<4)return!1;for(var n,a=0,r=t[n-1][1]*t[0][0]-t[n-1][0]*t[0][1];++a<n;)r+=t[a-1][1]*t[a][0]-t[a-1][0]*t[a][1];return 0>=r}function e(t,n){for(var a=n[0],r=n[1],e=!1,o=0,i=t.length,h=i-1;i>o;h=o++){var u=t[o],M=u[0],s=u[1],c=t[h],f=c[0],v=c[1];s>r^v>r&&(f-M)*(r-s)/(v-s)+M>a&&(e=!e)}return e}function o(t){return t?t/Math.sin(t):1}function i(t){return t>0?1:0>t?-1:0}function h(t){return t>1?wa:-1>t?-wa:Math.asin(t)}function u(t){return t>1?0:-1>t?pa:Math.acos(t)}function M(t){return t>0?Math.sqrt(t):0}function s(t){function n(t,n){var a=Math.cos(t),e=Math.cos(n),o=Math.sin(n),i=e*a,h=-((1-i?Math.log(.5*(1+i))/(1-i):-.5)+r/(1+i));return[h*e*Math.sin(t),h*o]}var a=Math.tan(.5*t),r=2*Math.log(Math.cos(.5*t))/(a*a);return n.invert=function(n,a){var e,o=Math.sqrt(n*n+a*a),i=t*-.5,u=50;if(!o)return[0,0];do{var M=.5*i,s=Math.cos(M),c=Math.sin(M),f=Math.tan(M),v=Math.log(1/s);i-=e=(2/f*v-r*f-o)/(-v/(c*c)+1-r/(2*s*s))}while(Math.abs(e)>da&&--u>0);var l=Math.sin(i);return[Math.atan2(n*l,o*Math.cos(i)),h(a*l/o)]},n}function c(){var t=wa,n=Qa(s),a=n(t);return a.radius=function(a){return arguments.length?n(t=a*pa/180):180*(t/pa)},a}function f(t,n){var a=Math.cos(n),r=o(u(a*Math.cos(t/=2)));return[2*a*Math.sin(t)*r,Math.sin(n)*r]}function v(t){function n(t,n){var h=Math.cos(n),u=Math.cos(t/=2);return[(1+h)*Math.sin(t),(e*n>-Math.atan2(u,o)-.001?0:10*-e)+i+Math.sin(n)*r-(1+h)*a*u]}var a=Math.sin(t),r=Math.cos(t),e=t>0?1:-1,o=Math.tan(e*t),i=(1+a-r)/2;return n.invert=function(t,n){var h=0,u=0,M=50;do{var s=Math.cos(h),c=Math.sin(h),f=Math.cos(u),v=Math.sin(u),l=1+f,g=l*c-t,d=i+v*r-l*a*s-n,b=.5*l*s,p=-c*v,w=.5*a*l*c,q=r*f+a*s*v,m=p*w-q*b,y=.5*(d*p-g*q)/m,S=(g*w-d*b)/m;h-=y,u-=S}while((Math.abs(y)>da||Math.abs(S)>da)&&--M>0);return e*u>-Math.atan2(Math.cos(h),o)-.001?[2*h,u]:null},n}function l(){var t=pa/9,n=t>0?1:-1,a=Math.tan(n*t),r=Qa(v),e=r(t),o=e.stream;return e.parallel=function(e){return arguments.length?(a=Math.tan((n=(t=e*pa/180)>0?1:-1)*t),r(t)):180*(t/pa)},e.stream=function(r){var i=e.rotate(),h=o(r),u=(e.rotate([0,0]),o(r));return e.rotate(i),h.sphere=function(){u.polygonStart(),u.lineStart();for(var r=-180*n;180>n*r;r+=90*n)u.point(r,90*n);for(;n*(r-=t)>=-180;)u.point(r,n*-Math.atan2(Math.cos(r*ma/2),a)*ya);u.lineEnd(),u.polygonEnd()},h},e}function g(t){return t=Math.exp(2*t),(t-1)/(t+1)}function d(t){return.5*(Math.exp(t)-Math.exp(-t))}function b(t){return.5*(Math.exp(t)+Math.exp(-t))}function p(t){return Math.log(t+M(t*t+1))}function w(t){return Math.log(t+M(t*t-1))}function q(t,n){var a=Math.tan(n/2),r=M(1-a*a),e=1+r*Math.cos(t/=2),o=Math.sin(t)*r/e,i=a/e,h=o*o,u=i*i;return[4/3*o*(3+h-3*u),4/3*i*(3+3*h-u)]}function m(t,n){var a=Math.abs(n);return pa/4>a?[t,Math.log(Math.tan(pa/4+n/2))]:[t*Math.cos(a)*(2*Math.SQRT2-1/Math.sin(a)),i(n)*(2*Math.SQRT2*(a-pa/4)-Math.log(Math.tan(a/2)))]}function y(t){function n(t,n){var r=Ta(t,n);if(Math.abs(t)>wa){var e=Math.atan2(r[1],r[0]),o=Math.sqrt(r[0]*r[0]+r[1]*r[1]),i=a*Math.round((e-wa)/a)+wa,u=Math.atan2(Math.sin(e-=i),2-Math.cos(e));e=i+h(pa/o*Math.sin(u))-u,r[0]=o*Math.cos(e),r[1]=o*Math.sin(e)}return r}var a=2*pa/t;return n.invert=function(t,n){var r=Math.sqrt(t*t+n*n);if(r>wa){var e=Math.atan2(n,t),o=a*Math.round((e-wa)/a)+wa,i=e>o?-1:1,h=r*Math.cos(o-e),u=1/Math.tan(i*Math.acos((h-pa)/Math.sqrt(pa*(pa-2*h)+r*r)));e=o+2*Math.atan((u+i*Math.sqrt(u*u-3))/3),t=r*Math.cos(e),n=r*Math.sin(e)}return Ta.invert(t,n)},n}function S(){var t=5,n=Qa(y),a=n(t),r=a.stream,e=.01,o=-Math.cos(e*ma),i=Math.sin(e*ma);return a.lobes=function(a){return arguments.length?n(t=+a):t},a.stream=function(n){var u=a.rotate(),M=r(n),s=(a.rotate([0,0]),r(n));return a.rotate(u),M.sphere=function(){s.polygonStart(),s.lineStart();for(var n=0,a=360/t,r=2*pa/t,u=90-180/t,M=wa;t>n;++n,u-=a,M-=r)s.point(Math.atan2(i*Math.cos(M),o)*ya,h(i*Math.sin(M))*ya),-90>u?(s.point(-90,-180-u-e),s.point(-90,-180-u+e)):(s.point(90,u+e),s.point(90,u-e));s.lineEnd(),s.polygonEnd()},M},a}function Q(t){return function(n){var a,r=t*Math.sin(n),e=30;do n-=a=(n+Math.sin(n)-r)/(1+Math.cos(n));while(Math.abs(a)>da&&--e>0);return n/2}}function R(t,n,a){function r(a,r){return[t*a*Math.cos(r=e(r)),n*Math.sin(r)]}var e=Q(a);return r.invert=function(r,e){var o=h(e/n);return[r/(t*Math.cos(o)),h((2*o+Math.sin(2*o))/a)]},r}function T(t,n){var a=2.00276,r=xa(n);return[a*t/(1/Math.cos(n)+1.11072/Math.cos(r)),(n+Math.SQRT2*Math.sin(r))/a]}function x(t){var n=0,a=Qa(t),r=a(n);return r.parallel=function(t){return arguments.length?a(n=t*pa/180):180*(n/pa)},r}function E(t,n){return[t*Math.cos(n),n]}function k(t){function n(n,r){var e=a+t-r,o=e?n*Math.cos(r)/e:e;return[e*Math.sin(o),a-e*Math.cos(o)]}if(!t)return E;var a=1/Math.tan(t);return n.invert=function(n,r){var e=Math.sqrt(n*n+(r=a-r)*r),o=a+t-e;return[e/Math.cos(o)*Math.atan2(n,r),o]},n}function P(t){function n(t,n){var r=wa-n,e=r?t*a*Math.sin(r)/r:r;return[r*Math.sin(e)/a,wa-r*Math.cos(e)]}var a=Math.sin(t);return n.invert=function(t,n){var r=t*a,e=wa-n,o=Math.sqrt(r*r+e*e),i=Math.atan2(r,e);return[(o?o/Math.sin(o):1)*i/a,wa-o]},n}function _(t){function n(n,a){for(var r=Math.sin(a),e=Math.cos(a),o=new Array(3),M=0;3>M;++M){var s=t[M];if(o[M]=B(a-s[1],s[3],s[2],e,r,n-s[0]),!o[M][0])return s.point;o[M][1]=j(o[M][1]-s.v[1])}for(var c=u.slice(),M=0;3>M;++M){var f=2==M?0:M+1,v=F(t[M].v[0],o[M][0],o[f][0]);o[M][1]<0&&(v=-v),M?1==M?(v=i-v,c[0]-=o[M][0]*Math.cos(v),c[1]-=o[M][0]*Math.sin(v)):(v=h-v,c[0]+=o[M][0]*Math.cos(v),c[1]+=o[M][0]*Math.sin(v)):(c[0]+=o[M][0]*Math.cos(v),c[1]-=o[M][0]*Math.sin(v))}return c[0]/=3,c[1]/=3,c}t=t.map(function(t){return[t[0],t[1],Math.sin(t[1]),Math.cos(t[1])]});for(var a,r=t[2],e=0;3>e;++e,r=a)a=t[e],r.v=B(a[1]-r[1],r[3],r[2],a[3],a[2],a[0]-r[0]),r.point=[0,0];var o=F(t[0].v[0],t[2].v[0],t[1].v[0]),i=F(t[0].v[0],t[1].v[0],t[2].v[0]),h=pa-o;t[2].point[1]=0,t[0].point[0]=-(t[1].point[0]=.5*t[0].v[0]);var u=[t[2].point[0]=t[0].point[0]+t[2].v[0]*Math.cos(o),2*(t[0].point[1]=t[1].point[1]=t[2].v[0]*Math.sin(o))];return n}function z(){var t=[[0,0],[0,0],[0,0]],n=Qa(_),a=n(t),r=a.rotate;return delete a.rotate,a.points=function(e){if(!arguments.length)return t;t=e;var o=d3.geo.centroid({type:"MultiPoint",coordinates:t}),i=[-o[0],-o[1]];return r.call(a,i),n(t.map(d3.geo.rotation(i)).map(A))},a.points([[-150,55],[-35,55],[-92.5,10]])}function B(t,n,a,r,e,o){var i,M=Math.cos(o);if(Math.abs(t)>1||Math.abs(o)>1)i=u(a*e+n*r*M);else{var s=Math.sin(.5*t),c=Math.sin(.5*o);i=2*h(Math.sqrt(s*s+n*r*c*c))}return Math.abs(i)>da?[i,Math.atan2(r*Math.sin(o),n*e-a*r*M)]:[0,0]}function F(t,n,a){return u(.5*(t*t+n*n-a*a)/(t*n))}function j(t){return t-2*pa*Math.floor((t+pa)/(2*pa))}function A(t){return[t[0]*ma,t[1]*ma]}function G(t,n){var a=M(1-Math.sin(n));return[2/qa*t*a,qa*(1-a)]}function C(t){function n(t,n){return[t,(t?t/Math.sin(t):1)*(Math.sin(n)*Math.cos(t)-a*Math.cos(n))]}var a=Math.tan(t);return n.invert=a?function(t,n){t&&(n*=Math.sin(t)/t);var r=Math.cos(t);return[t,2*Math.atan2(Math.sqrt(r*r+a*a-n*n)-r,a-n)]}:function(t,n){return[t,h(t?n*Math.tan(t)/t:n)]},n}function D(t,n){var a=Math.sqrt(3);return[a*t*(2*Math.cos(2*n/3)-1)/qa,a*qa*Math.sin(n/3)]}function L(t){function n(t,n){return[t*a,Math.sin(n)/a]}var a=Math.cos(t);return n.invert=function(t,n){return[t/a,h(n*a)]},n}function O(t){function n(t,n){return[t*a,(1+a)*Math.tan(.5*n)]}var a=Math.cos(t);return n.invert=function(t,n){return[t/a,2*Math.atan(n/(1+a))]},n}function H(t,n){var a=Math.sqrt(8/(3*pa));return[a*t*(1-Math.abs(n)/pa),a*n]}function I(t,n){var a=Math.sqrt(4-3*Math.sin(Math.abs(n)));return[2/Math.sqrt(6*pa)*t*a,i(n)*Math.sqrt(2*pa/3)*(2-a)]}function J(t,n){var a=Math.sqrt(pa*(4+pa));return[2/a*t*(1+Math.sqrt(1-4*n*n/(pa*pa))),4/a*n]}function K(t,n){var a=(2+wa)*Math.sin(n);n/=2;for(var r=0,e=1/0;10>r&&Math.abs(e)>da;r++){var o=Math.cos(n);n-=e=(n+Math.sin(n)*(o+2)-a)/(2*o*(1+o))}return[2/Math.sqrt(pa*(4+pa))*t*(1+Math.cos(n)),2*Math.sqrt(pa/(4+pa))*Math.sin(n)]}function N(t,n){return[t*(1+Math.cos(n))/Math.sqrt(2+pa),2*n/Math.sqrt(2+pa)]}function U(t,n){for(var a=(1+wa)*Math.sin(n),r=0,e=1/0;10>r&&Math.abs(e)>da;r++)n-=e=(n+Math.sin(n)-a)/(1+Math.cos(n));return a=Math.sqrt(2+pa),[t*(1+Math.cos(n))/a,2*n/a]}function V(t,n){var a=Math.sin(t/=2),r=Math.cos(t),e=Math.sqrt(Math.cos(n)),o=Math.cos(n/=2),i=Math.sin(n)/(o+Math.SQRT2*r*e),h=Math.sqrt(2/(1+i*i)),u=Math.sqrt((Math.SQRT2*o+(r+a)*e)/(Math.SQRT2*o+(r-a)*e));return[Pa*(h*(u-1/u)-2*Math.log(u)),Pa*(h*i*(u+1/u)-2*Math.atan(i))]}function W(t,n){var a=Math.tan(n/2);return[t*_a*M(1-a*a),(1+_a)*a]}function X(t,n){var a=n/2,r=Math.cos(a);return[2*t/qa*Math.cos(n)*r*r,qa*Math.tan(a)]}function Y(t,n){function a(n,a){var o=za(n,a),i=o[0],h=o[1],u=i*i+h*h;if(u>e){var M=Math.sqrt(u),s=Math.atan2(h,i),c=r*Math.round(s/r),f=s-c,v=t*Math.cos(f),l=(t*Math.sin(f)-f*Math.sin(v))/(wa-v),g=Z(f,l),d=(pa-t)/tn(g,v,pa);i=M;var b,p=50;do i-=b=(t+tn(g,v,i)*d-M)/(g(i)*d);while(Math.abs(b)>da&&--p>0);h=f*Math.sin(i),wa>i&&(h-=l*(i-wa));var w=Math.sin(c),q=Math.cos(c);o[0]=i*q-h*w,o[1]=i*w+h*q}return o}var r=2*pa/n,e=t*t;return a.invert=function(n,a){var o=n*n+a*a;if(o>e){var i=Math.sqrt(o),h=Math.atan2(a,n),u=r*Math.round(h/r),M=h-u,n=i*Math.cos(M);a=i*Math.sin(M);for(var s=n-wa,c=Math.sin(n),f=a/c,v=wa>n?1/0:0,l=10;;){var g=t*Math.sin(f),d=t*Math.cos(f),b=Math.sin(d),p=wa-d,w=(g-f*b)/p,q=Z(f,w);if(Math.abs(v)<ba||!--l)break;f-=v=(f*c-w*s-a)/(c-2*s*(p*(d+f*g*Math.cos(d)-b)-g*(g-f*b))/(p*p))}i=t+tn(q,d,n)*(pa-t)/tn(q,d,pa),h=u+f,n=i*Math.cos(h),a=i*Math.sin(h)}return za.invert(n,a)},a}function Z(t,n){return function(a){var r=t*Math.cos(a);return wa>a&&(r-=n),Math.sqrt(1+r*r)}}function $(){var t=6,n=30*ma,a=Math.cos(n),r=Math.sin(n),e=Qa(Y),o=e(n,t),i=o.stream,h=.01,u=-Math.cos(h*ma),M=Math.sin(h*ma);return o.radius=function(o){return arguments.length?(a=Math.cos(n=o*ma),r=Math.sin(n),e(n,t)):n*ya},o.lobes=function(a){return arguments.length?e(n,t=+a):t},o.stream=function(n){var e=o.rotate(),h=i(n),s=(o.rotate([0,0]),i(n));return o.rotate(e),h.sphere=function(){s.polygonStart(),s.lineStart();for(var n=0,e=2*pa/t,o=0;t>n;++n,o-=e)s.point(Math.atan2(M*Math.cos(o),u)*ya,Math.asin(M*Math.sin(o))*ya),s.point(Math.atan2(r*Math.cos(o-e/2),a)*ya,Math.asin(r*Math.sin(o-e/2))*ya);s.lineEnd(),s.polygonEnd()},h},o}function tn(t,n,a){for(var r=50,e=(a-n)/r,o=t(n)+t(a),i=1,h=n;r>i;++i)o+=2*t(h+=e);return.5*o*e}function nn(t,n,a,r,e,o,i,h){function u(u,M){if(!M)return[t*u/pa,0];var s=M*M,c=t+s*(n+s*(a+s*r)),f=M*(e-1+s*(o-h+s*i)),v=(c*c+f*f)/(2*f),l=u*Math.asin(c/v)/pa;return[v*Math.sin(l),M*(1+s*h)+v*(1-Math.cos(l))]}return arguments.length<8&&(h=0),u.invert=function(u,s){var c,f,v=pa*u/t,l=s,g=50;do{var d=l*l,b=t+d*(n+d*(a+d*r)),p=l*(e-1+d*(o-h+d*i)),w=b*b+p*p,q=2*p,m=w/q,y=m*m,S=Math.asin(b/m)/pa,Q=v*S;if(xB2=b*b,dxBdφ=(2*n+d*(4*a+6*d*r))*l,dyBdφ=e+d*(3*o+5*d*i),dpdφ=2*(b*dxBdφ+p*(dyBdφ-1)),dqdφ=2*(dyBdφ-1),dmdφ=(dpdφ*q-w*dqdφ)/(q*q),cosα=Math.cos(Q),sinα=Math.sin(Q),mcosα=m*cosα,msinα=m*sinα,dαdφ=v/pa*(1/M(1-xB2/y))*(dxBdφ*m-b*dmdφ)/y,fx=msinα-u,fy=l*(1+d*h)+m-mcosα-s,δxδφ=dmdφ*sinα+mcosα*dαdφ,δxδλ=mcosα*S,δyδφ=1+dmdφ-(dmdφ*cosα-msinα*dαdφ),δyδλ=msinα*S,denominator=δxδφ*δyδλ-δyδφ*δxδλ,!denominator)break;v-=c=(fy*δxδφ-fx*δyδφ)/denominator,l-=f=(fx*δyδλ-fy*δxδλ)/denominator}while((Math.abs(c)>da||Math.abs(f)>da)&&--g>0);return[v,l]},u}function an(t,n){var a=t*t,r=n*n;return[t*(1-.162388*r)*(.87-952426e-9*a*a),n*(1+r/12)]}function rn(t){function n(){var t=!1,n=Qa(a),r=n(t);return r.quincuncial=function(a){return arguments.length?n(t=!!a):t},r}function a(n){var a=n?function(n,a){var e=Math.abs(n)<wa,o=t(e?n:n>0?n-pa:n+pa,a),h=(o[0]-o[1])*Math.SQRT1_2,u=(o[0]+o[1])*Math.SQRT1_2;if(e)return[h,u];var M=r*Math.SQRT1_2,s=h>0^u>0?-1:1;return[s*h-i(u)*M,s*u-i(h)*M]}:function(n,a){var e=n>0?-.5:.5,o=t(n+e*pa,a);return o[0]-=e*r,o};return t.invert&&(a.invert=n?function(n,a){var e=(n+a)*Math.SQRT1_2,o=(a-n)*Math.SQRT1_2,i=Math.abs(e)<.5*r&&Math.abs(o)<.5*r;if(!i){var h=r*Math.SQRT1_2,u=e>0^o>0?-1:1,M=-u*(n+(o>0?1:-1)*h),s=-u*(a+(e>0?1:-1)*h);e=(-M-s)*Math.SQRT1_2,o=(M-s)*Math.SQRT1_2}var c=t.invert(e,o);return i||(c[0]+=e>0?pa:-pa),c}:function(n,a){var e=n>0?-.5:.5,o=t.invert(n+e*r,a),i=o[0]-e*pa;return-pa>i?i+=2*pa:i>pa&&(i-=2*pa),o[0]=i,o}),a}var r=t(wa,0)[0]-t(-wa,0)[0];return n.raw=a,n}function en(t,n){var a=i(t),r=i(n),e=Math.cos(n),o=Math.cos(t)*e,u=Math.sin(t)*e,M=Math.sin(r*n);t=Math.abs(Math.atan2(u,M)),n=h(o),Math.abs(t-wa)>da&&(t%=wa);var s=on(t>pa/4?wa-t:t,n);return t>pa/4&&(M=s[0],s[0]=-s[1],s[1]=-M),s[0]*=a,s[1]*=-r,s}function on(t,n){if(n===wa)return[0,0];var a=Math.sin(n),r=a*a,e=r*r,o=1+e,i=1+3*e,u=1-e,s=h(1/Math.sqrt(o)),c=u+r*o*s,f=(1-a)/c,v=Math.sqrt(f),l=f*o,g=Math.sqrt(l),d=v*u;if(0===t)return[0,-(d+r*g)];var b=Math.cos(n),p=1/b,w=2*a*b,q=(-3*r+s*i)*w,m=(-c*b-(1-a)*q)/(c*c),y=.5*m/v,S=u*y-2*r*v*w,Q=r*o*m+f*i*w,R=-p*w,T=-p*Q,x=-2*p*S,E=4*t/pa;if(t>.222*pa||pa/4>n&&t>.175*pa){var k=(d+r*M(l*(1+e)-d*d))/(1+e);if(t>pa/4)return[k,k];var P=k,_=.5*k,z=50;k=.5*(_+P);do{var B=Math.sqrt(l-k*k),F=k*(x+R*B)+T*h(k/g)-E;if(!F)break;0>F?_=k:P=k,k=.5*(_+P)}while(Math.abs(P-_)>da&&--z>0)}else{var j,k=da,z=25;do{var A=k*k,B=M(l-A),G=x+R*B,F=k*G+T*h(k/g)-E,C=G+(T-R*A)/B;k-=j=B?F/C:0}while(Math.abs(j)>da&&--z>0)}return[k,-d-r*M(l-k*k)]}function hn(t,n){for(var a=0,r=1,e=.5,o=50;;){var i=e*e,h=Math.sqrt(e),u=Math.asin(1/Math.sqrt(1+i)),M=1-i+e*(1+i)*u,s=(1-h)/M,c=Math.sqrt(s),f=s*(1+i),v=c*(1-i),l=f-t*t,g=Math.sqrt(l),d=n+v+e*g;if(Math.abs(r-a)<ba||0===--o||0===d)break;d>0?a=e:r=e,e=.5*(a+r)}if(!o)return null;var b=Math.asin(h),p=Math.cos(b),w=1/p,q=2*h*p,m=(-3*e+u*(1+3*i))*q,y=(-M*p-(1-h)*m)/(M*M),S=.5*y/c,Q=(1-i)*S-2*e*c*q,R=-2*w*Q,T=-w*q,x=-w*(e*(1+i)*y+s*(1+3*i)*q);return[pa/4*(t*(R+T*g)+x*Math.asin(t/Math.sqrt(f))),b]}function un(t,n,a){if(!t){var r=Mn(n,1-a);return[[0,r[0]/r[1]],[1/r[1],0],[r[2]/r[1],0]]}var e=Mn(t,a);if(!n)return[[e[0],0],[e[1],0],[e[2],0]];var r=Mn(n,1-a),o=r[1]*r[1]+a*e[0]*e[0]*r[0]*r[0];return[[e[0]*r[2]/o,e[1]*e[2]*r[0]*r[1]/o],[e[1]*r[1]/o,-e[0]*e[2]*r[0]*r[2]/o],[e[2]*r[1]*r[2]/o,-a*e[0]*e[1]*r[0]/o]]}function Mn(t,n){var a,r,e,o,i;if(da>n)return o=Math.sin(t),r=Math.cos(t),a=.25*n*(t-o*r),[o-a*r,r+a*o,1-.5*n*o*o,t-a];if(n>=1-da)return a=.25*(1-n),r=b(t),o=g(t),e=1/r,i=r*d(t),[o+a*(i-t)/(r*r),e-a*o*e*(i-t),e+a*o*e*(i+t),2*Math.atan(Math.exp(t))-wa+a*(i-t)/r];var u=[1,0,0,0,0,0,0,0,0],s=[Math.sqrt(n),0,0,0,0,0,0,0,0],c=0;for(r=Math.sqrt(1-n),i=1;Math.abs(s[c]/u[c])>da&&8>c;)a=u[c++],s[c]=.5*(a-r),u[c]=.5*(a+r),r=M(a*r),i*=2;e=i*u[c]*t;do o=s[c]*Math.sin(r=e)/u[c],e=.5*(h(o)+e);while(--c);return[Math.sin(e),o=Math.cos(e),o/Math.cos(e-r),e]}function sn(t,n,a){var r=Math.abs(t),e=Math.abs(n),o=d(e);if(r){var h=1/Math.sin(r),u=1/(Math.tan(r)*Math.tan(r)),s=-(u+a*o*o*h*h-1+a),c=(a-1)*u,f=.5*(-s+Math.sqrt(s*s-4*c));return[cn(Math.atan(1/Math.sqrt(f)),a)*i(t),cn(Math.atan(M((f/u-1)/a)),1-a)*i(n)]}return[0,cn(Math.atan(o),1-a)*i(n)]}function cn(t,n){if(!n)return t;if(1===n)return Math.log(Math.tan(t/2+pa/4));for(var a=1,r=Math.sqrt(1-n),e=Math.sqrt(n),o=0;Math.abs(e)>da;o++){if(t%pa){var i=Math.atan(r*Math.tan(t)/a);0>i&&(i+=pa),t+=i+~~(t/pa)*pa}else t+=t;e=(a+r)/2,r=Math.sqrt(a*r),e=((a=e)-r)/2}return t/(Math.pow(2,o)*a)}function fn(t,n){var a=(Math.SQRT2-1)/(Math.SQRT2+1),r=Math.sqrt(1-a*a),e=cn(wa,r*r),o=-1,i=Math.log(Math.tan(pa/4+Math.abs(n)/2)),h=Math.exp(o*i)/Math.sqrt(a),u=vn(h*Math.cos(o*t),h*Math.sin(o*t)),M=sn(u[0],u[1],r*r);return[-M[1],(n>=0?1:-1)*(.5*e-M[0])]}function vn(t,n){var a=t*t,r=n+1,e=1-a-n*n;return[.5*((t>=0?wa:-wa)-Math.atan2(e,2*t)),-.25*Math.log(e*e+4*a)+.5*Math.log(r*r+a)]}function ln(t,n){var a=n[0]*n[0]+n[1]*n[1];return[(t[0]*n[0]+t[1]*n[1])/a,(t[1]*n[0]-t[0]*n[1])/a]}function gn(t){function n(t,n){var o=e(t,n);t=o[0],n=o[1];var i=Math.sin(n),h=Math.cos(n),M=Math.cos(t),s=u(a*i+r*h*M),c=Math.sin(s),f=Math.abs(c)>da?s/c:1;return[f*r*Math.sin(t),(Math.abs(t)>wa?f:-f)*(a*h-r*i*M)]}var a=Math.sin(t),r=Math.cos(t),e=dn(t);return e.invert=dn(-t),n.invert=function(t,n){var r=Math.sqrt(t*t+n*n),o=-Math.sin(r),i=Math.cos(r),h=r*i,u=-n*o,s=r*a,c=M(h*h+u*u-s*s),f=Math.atan2(h*s+u*c,u*s-h*c),v=(r>wa?-1:1)*Math.atan2(t*o,r*Math.cos(f)*i+n*Math.sin(f)*o);return e.invert(v,f)},n}function dn(t){var n=Math.sin(t),a=Math.cos(t);return function(t,r){var e=Math.cos(r),o=Math.cos(t)*e,i=Math.sin(t)*e,u=Math.sin(r);return[Math.atan2(i,o*a-u*n),h(u*a+o*n)]}}function bn(){var t=0,n=Qa(gn),a=n(t),r=a.rotate,e=a.stream,o=d3.geo.circle();return a.parallel=function(r){if(!arguments.length)return 180*(t/pa);var e=a.rotate();return n(t=r*pa/180).rotate(e)},a.rotate=function(n){return arguments.length?(r.call(a,[n[0],n[1]-180*(t/pa)]),o.origin([-n[0],-n[1]]),a):(n=r.call(a),n[1]+=180*(t/pa),n)},a.stream=function(t){return t=e(t),t.sphere=function(){t.polygonStart();var n,a=.01,r=o.angle(90-a)().coordinates[0],e=r.length-1,i=-1;for(t.lineStart();++i<e;)t.point((n=r[i])[0],n[1]);for(t.lineEnd(),r=o.angle(90+a)().coordinates[0],e=r.length-1,t.lineStart();--i>=0;)t.point((n=r[i])[0],n[1]);t.lineEnd(),t.polygonEnd()},t},a}function pn(t,n){function a(a,r){var e=Ga(a/n,r);return e[0]*=t,e}return arguments.length<2&&(n=t),1===n?Ga:1/0===n?qn:(a.invert=function(a,r){var e=Ga.invert(a/t,r);return e[0]*=n,e},a)}function wn(){var t=2,n=Qa(pn),a=n(t);return a.coefficient=function(a){return arguments.length?n(t=+a):t},a}function qn(t,n){return[t*Math.cos(n)/Math.cos(n/=2),2*Math.sin(n)]}function mn(t,n){for(var a,r=Math.sin(n)*(0>n?2.43763:2.67595),e=0;20>e&&(n-=a=(n+Math.sin(n)-r)/(1+Math.cos(n)),!(Math.abs(a)<da));e++);return[.85*t*Math.cos(n*=.5),Math.sin(n)*(0>n?1.93052:1.75859)]}function yn(t){function n(n,s){var c,f=Math.abs(s);if(f>r){var v=Math.min(t-1,Math.max(0,Math.floor((n+pa)/M)));n+=pa*(t-1)/t-v*M,c=d3.geo.collignon.raw(n,f),c[0]=c[0]*e/o-e*(t-1)/(2*t)+v*e/t,c[1]=i+4*(c[1]-h)*u/e,0>s&&(c[1]=-c[1])}else c=a(n,s);return c[0]/=2,c}var a=d3.geo.cylindricalEqualArea.raw(0),r=Ca*pa/180,e=2*pa,o=d3.geo.collignon.raw(pa,r)[0]-d3.geo.collignon.raw(-pa,r)[0],i=a(0,r)[1],h=d3.geo.collignon.raw(0,r)[1],u=d3.geo.collignon.raw(0,wa)[1]-h,M=2*pa/t;return n.invert=function(n,r){n*=2;var s=Math.abs(r);if(s>i){var c=Math.min(t-1,Math.max(0,Math.floor((n+pa)/M)));n=(n+pa*(t-1)/t-c*M)*o/e;var f=d3.geo.collignon.raw.invert(n,.25*(s-i)*e/u+h);return f[0]-=pa*(t-1)/t-c*M,0>r&&(f[1]=-f[1]),f}return a.invert(n,r)},n}function Sn(){function t(){var t=180/n;return{type:"Polygon",coordinates:[d3.range(-180,180+t/2,t).map(function(t,n){return[t,1&n?90-1e-6:Ca]}).concat(d3.range(180,-180-t/2,-t).map(function(t,n){return[t,1&n?-90+1e-6:-Ca]}))]}}var n=2,a=Qa(yn),r=a(n),e=r.stream;return r.lobes=function(t){return arguments.length?a(n=+t):n},r.stream=function(n){var a=r.rotate(),o=e(n),i=(r.rotate([0,0]),e(n));return r.rotate(a),o.sphere=function(){d3.geo.stream(t(),i)},o},r}function Qn(t){function n(n,e){var h,u,f=1-Math.sin(e);if(f&&2>f){var v,l=wa-e,g=25;do{var d=Math.sin(l),b=Math.cos(l),p=o+Math.atan2(d,r-b),w=1+c-2*r*b;l-=v=(l-s*o-r*d+w*p-.5*f*a)/(2*r*d*p)}while(Math.abs(v)>ba&&--g>0);h=i*Math.sqrt(w),u=n*p/pa}else h=i*(t+f),u=n*o/pa;return[h*Math.sin(u),M-h*Math.cos(u)]}var a,r=1+t,e=Math.sin(1/r),o=h(e),i=2*Math.sqrt(pa/(a=pa+4*o*r)),M=.5*i*(r+Math.sqrt(t*(2+t))),s=t*t,c=r*r;return n.invert=function(t,n){var e=t*t+(n-=M)*n,f=(1+c-e/(i*i))/(2*r),v=u(f),l=Math.sin(v),g=o+Math.atan2(l,r-f);return[h(t/Math.sqrt(e))*pa/g,h(1-2*(v-s*o-r*l+(1+c-2*r*f)*g)/a)]},n}function Rn(){var t=1,n=Qa(Qn),a=n(t);return a.ratio=function(a){return arguments.length?n(t=+a):t},a}function Tn(t,n){return n>-Da?(t=Ea(t,n),t[1]+=La,t):E(t,n)}function xn(t,n){return Math.abs(n)>Da?(t=Ea(t,n),t[1]-=n>0?La:-La,t):E(t,n)}function En(t,n){return[3*t/(2*pa)*Math.sqrt(pa*pa/3-n*n),n]}function kn(t){function n(n,a){if(Math.abs(Math.abs(a)-wa)<da)return[0,0>a?-2:2];var r=Math.sin(a),e=Math.pow((1+r)/(1-r),t/2),o=.5*(e+1/e)+Math.cos(n*=t);return[2*Math.sin(n)/o,(e-1/e)/o]}return n.invert=function(n,a){var r=Math.abs(a);if(Math.abs(r-2)<da)return n?null:[0,i(a)*wa];if(r>2)return null;n/=2,a/=2;var e=n*n,o=a*a,u=2*a/(1+e+o);return u=Math.pow((1+u)/(1-u),1/t),[Math.atan2(2*n,1-e-o)/t,h((u-1)/(u+1))]},n}function Pn(){var t=.5,n=Qa(kn),a=n(t);return a.spacing=function(a){return arguments.length?n(t=+a):t},a}function _n(t,n){return[t*(1+Math.sqrt(Math.cos(n)))/2,n/(Math.cos(n/2)*Math.cos(t/6))]}function zn(t,n){var a=t*t,r=n*n;return[t*(.975534+r*(-.119161+a*-.0143059+r*-.0547009)),n*(1.00384+a*(.0802894+r*-.02855+199025e-9*a)+r*(.0998909+r*-.0491032))]}function Bn(t,n){return[Math.sin(t)/Math.cos(n),Math.tan(n)*Math.cos(t)]}function Fn(t){function n(n,e){var o=e-t,i=Math.abs(o)<da?n*a:Math.abs(i=pa/4+e/2)<da||Math.abs(Math.abs(i)-wa)<da?0:n*o/Math.log(Math.tan(i)/r);return[i,o]}var a=Math.cos(t),r=Math.tan(pa/4+t/2);return n.invert=function(n,e){var o,i=e+t;return[Math.abs(e)<da?n/a:Math.abs(o=pa/4+i/2)<da||Math.abs(Math.abs(o)-wa)<da?0:n*Math.log(Math.tan(o)/r)/e,i]},n}function jn(t,n){return[t,1.25*Math.log(Math.tan(pa/4+.4*n))]}function An(t){function n(n,r){for(var e,o=Math.cos(r),i=2/(1+o*Math.cos(n)),h=i*o*Math.sin(n),u=i*Math.sin(r),M=a,s=t[M],c=s[0],f=s[1];--M>=0;)s=t[M],c=s[0]+h*(e=c)-u*f,f=s[1]+h*f+u*e;return c=h*(e=c)-u*f,f=h*f+u*e,[c,f]}var a=t.length-1;return n.invert=function(n,r){var e=20,o=n,i=r;do{for(var u,M=a,s=t[M],c=s[0],f=s[1],v=0,l=0;--M>=0;)s=t[M],v=c+o*(u=v)-i*l,l=f+o*l+i*u,c=s[0]+o*(u=c)-i*f,f=s[1]+o*f+i*u;v=c+o*(u=v)-i*l,l=f+o*l+i*u,c=o*(u=c)-i*f-n,f=o*f+i*u-r;var g,d,b=v*v+l*l;o-=g=(c*v+f*l)/b,i-=d=(f*v-c*l)/b}while(Math.abs(g)+Math.abs(d)>da*da&&--e>0);if(e){var p=Math.sqrt(o*o+i*i),w=2*Math.atan(.5*p),q=Math.sin(w);return[Math.atan2(o*q,p*Math.cos(w)),p?h(i*q/p):0]}},n}function Gn(){var t=Oa.miller,n=Qa(An),a=n(t);return a.coefficients=function(a){return arguments.length?n(t="string"==typeof a?Oa[a]:a):t},a}function Cn(t,n){var a=Math.sqrt(6),r=Math.sqrt(7),e=Math.asin(7*Math.sin(n)/(3*a));return[a*t*(2*Math.cos(2*e/3)-1)/r,9*Math.sin(e/3)/r]}function Dn(t,n){for(var a,r=(1+Math.SQRT1_2)*Math.sin(n),e=n,o=0;25>o&&(e-=a=(Math.sin(e/2)+Math.sin(e)-r)/(.5*Math.cos(e/2)+Math.cos(e)),!(Math.abs(a)<da));o++);return[t*(1+2*Math.cos(e)/Math.cos(e/2))/(3*Math.SQRT2),2*Math.sqrt(3)*Math.sin(e/2)/Math.sqrt(2+Math.SQRT2)]}function Ln(t,n){for(var a,r=Math.sqrt(6/(4+pa)),e=(1+pa/4)*Math.sin(n),o=n/2,i=0;25>i&&(o-=a=(o/2+Math.sin(o)-e)/(.5+Math.cos(o)),!(Math.abs(a)<da));i++);return[r*(.5+Math.cos(o))*t/1.5,r*o]}function On(t,n){var a=n*n,r=a*a;return[t*(.8707-.131979*a+r*(-.013791+r*(.003971*a-.001529*r))),n*(1.007226+a*(.015085+r*(-.044475+.028874*a-.005916*r)))]}function Hn(t,n){return[t*(1+Math.cos(n))/2,2*(n-Math.tan(n/2))]}function In(t,n){var a=n*n;return[t,n*(Ha+a*a*(Ia+a*(Ja+Ka*a)))]}function Jn(t,n){if(Math.abs(n)<da)return[t,0];var a=Math.tan(n),r=t*Math.sin(n);return[Math.sin(r)/a,n+(1-Math.cos(r))/a]}function Kn(t){function n(n,r){var e=a?Math.tan(n*a/2)/a:n/2;if(!r)return[2*e,-t];var o=2*Math.atan(e*Math.sin(r)),i=1/Math.tan(r);return[Math.sin(o)*i,r+(1-Math.cos(o))*i-t]}var a=Math.sin(t);return n.invert=function(n,r){if(Math.abs(r+=t)<da)return[a?2*Math.atan(a*n/2)/a:n,0];var e,o=n*n+r*r,i=0,M=10;do{var s=Math.tan(i),c=1/Math.cos(i),f=o-2*r*i+i*i;i-=e=(s*f+2*(i-r))/(2+f*c*c+2*(i-r)*s)}while(Math.abs(e)>da&&--M>0);var v=n*(s=Math.tan(i)),l=Math.tan(Math.abs(r)<Math.abs(i+1/s)?.5*h(v):.5*u(v)+pa/4)/Math.sin(i);return[a?2*Math.atan(a*l)/a:2*l,i]},n}function Nn(t,n){var a,r=Math.min(18,36*Math.abs(n)/pa),e=Math.floor(r),o=r-e,i=(a=Za[e])[0],h=a[1],u=(a=Za[++e])[0],M=a[1],s=(a=Za[Math.min(19,++e)])[0],c=a[1];return[t*(u+o*(s-i)/2+o*o*(s-2*u+i)/2),(n>0?wa:-wa)*(M+o*(c-h)/2+o*o*(c-2*M+h)/2)]}function Un(t){function n(n,a){var r=Math.cos(a),e=(t-1)/(t-r*Math.cos(n));return[e*r*Math.sin(n),e*Math.sin(a)]}return n.invert=function(n,a){var r=n*n+a*a,e=Math.sqrt(r),o=(t-Math.sqrt(1-r*(t+1)/(t-1)))/((t-1)/e+e/(t-1));return[Math.atan2(n*o,e*Math.sqrt(1-o*o)),e?h(a*o/e):0]},n}function Vn(t,n){function a(n,a){var i=r(n,a),h=i[1],u=h*o/(t-1)+e;return[i[0]*e/u,h/u]}var r=Un(t);if(!n)return r;var e=Math.cos(n),o=Math.sin(n);return a.invert=function(n,a){var i=(t-1)/(t-1-a*o);return r.invert(i*n,i*a*e)},a}function Wn(){var t=1.4,n=0,a=Qa(Vn),r=a(t,n);return r.distance=function(r){return arguments.length?a(t=+r,n):t},r.tilt=function(r){return arguments.length?a(t,n=r*pa/180):180*n/pa},r}function Xn(t,n){var a=Math.tan(n/2),r=Math.sin(pa/4*a);return[t*(.74482-.34588*r*r),1.70711*a]}function Yn(t){function n(n,o){var i=u(Math.cos(o)*Math.cos(n-a)),h=u(Math.cos(o)*Math.cos(n-r)),s=0>o?-1:1;return i*=i,h*=h,[(i-h)/(2*t),s*M(4*e*h-(e-i+h)*(e-i+h))/(2*t)]}if(!t)return d3.geo.azimuthalEquidistant.raw;var a=-t/2,r=-a,e=t*t,o=Math.tan(r),i=.5/Math.sin(r);return n.invert=function(t,n){var e,h,M=n*n,s=Math.cos(Math.sqrt(M+(e=t+a)*e)),c=Math.cos(Math.sqrt(M+(e=t+r)*e));return[Math.atan2(h=s-c,e=(s+c)*o),(0>n?-1:1)*u(Math.sqrt(e*e+h*h)*i)]},n}function Zn(){var t=[[0,0],[0,0]],n=Qa(Yn),a=n(0),r=a.rotate;return delete a.rotate,a.points=function(a){if(!arguments.length)return t;t=a;var e=d3.geo.interpolate(a[0],a[1]),o=e(.5),i=d3.geo.rotation([-o[0],-o[1]])(a[0]),u=.5*e.distance,M=-h(Math.sin(i[1]*ma)/Math.sin(u));return i[0]>0&&(M=pa-M),r.call(i,[-o[0],-o[1],-M*ya]),n(2*u)},a}function $n(t){function n(t,n){var r=d3.geo.gnomonic.raw(t,n);return r[0]*=a,r}var a=Math.cos(t);return n.invert=function(t,n){return d3.geo.gnomonic.raw.invert(t/a,n)},n}function ta(){var t=[[0,0],[0,0]],n=Qa($n),a=n(0),r=a.rotate;return delete a.rotate,a.points=function(a){if(!arguments.length)return t;t=a;var e=d3.geo.interpolate(a[0],a[1]),o=e(.5),i=d3.geo.rotation([-o[0],-o[1]])(a[0]),u=.5*e.distance,M=-h(Math.sin(i[1]*ma)/Math.sin(u));return i[0]>0&&(M=pa-M),r.call(i,[-o[0],-o[1],-M*ya]),n(u)},a}function na(t,n){if(Math.abs(n)<da)return[t,0];var a=Math.abs(n/wa),r=h(a);if(Math.abs(t)<da||Math.abs(Math.abs(n)-wa)<da)return[0,i(n)*pa*Math.tan(r/2)];var e=Math.cos(r),o=Math.abs(pa/t-t/pa)/2,u=o*o,M=e/(a+e-1),s=M*(2/a-1),c=s*s,f=c+u,v=M-c,l=u+M;return[i(t)*pa*(o*v+Math.sqrt(u*v*v-f*(M*M-c)))/f,i(n)*pa*(s*l-o*Math.sqrt((u+1)*f-l*l))/f]}function aa(t,n){if(Math.abs(n)<da)return[t,0];var a=Math.abs(n/wa),r=h(a);if(Math.abs(t)<da||Math.abs(Math.abs(n)-wa)<da)return[0,i(n)*pa*Math.tan(r/2)];var e=Math.cos(r),o=Math.abs(pa/t-t/pa)/2,u=o*o,s=e*(Math.sqrt(1+u)-o*e)/(1+u*a*a);return[i(t)*pa*s,i(n)*pa*M(1-s*(2*o+s))]}function ra(t,n){if(Math.abs(n)<da)return[t,0];var a=n/wa,r=h(a);if(Math.abs(t)<da||Math.abs(Math.abs(n)-wa)<da)return[0,pa*Math.tan(r/2)];var e=(pa/t-t/pa)/2,o=a/(1+Math.cos(r));return[pa*(i(t)*M(e*e+1-o*o)-e),pa*o]}function ea(t,n){if(!n)return[t,0];var a=Math.abs(n);if(!t||a===wa)return[0,n];var r=a/wa,e=r*r,o=(8*r-e*(e+2)-5)/(2*e*(r-1)),h=o*o,u=r*o,s=e+h+2*u,c=r+3*o,f=t/wa,v=f+1/f,l=i(Math.abs(t)-wa)*Math.sqrt(v*v-4),g=l*l,d=s*(e+h*g-1)+(1-e)*(e*(c*c+4*h)+12*u*h+4*h*h),b=(l*(s+h-1)+2*M(d))/(4*s+g);return[i(t)*wa*b,i(n)*wa*M(1+l*Math.abs(b)-b*b)]}function oa(t,n){return[t*Math.sqrt(1-3*n*n/(pa*pa)),n]}function ia(t,n){var a=.90631*Math.sin(n),r=Math.sqrt(1-a*a),e=Math.sqrt(2/(1+r*Math.cos(t/=3)));return[2.66723*r*e*Math.sin(t),1.24104*a*e]}function ha(t,n){var a=Math.cos(n),r=Math.cos(t)*a,e=1-r,o=Math.cos(t=Math.atan2(Math.sin(t)*a,-Math.sin(n))),i=Math.sin(t);return a=M(1-r*r),[i*a-o*e,-o*a-i*e]}function ua(t,n){var a=f(t,n);return[(a[0]+t/wa)/2,(a[1]+n)/2]}d3.geo.project=function(t,a){var r=a.stream;if(!r)throw new Error("not yet supported");return(t&&Ma.hasOwnProperty(t.type)?Ma[t.type]:n)(t,r)};var Ma={Feature:t,FeatureCollection:function(n,a){return{type:"FeatureCollection",features:n.features.map(function(n){return t(n,a)})}}},sa=[],ca=[],fa={point:function(t,n){sa.push([t,n])},result:function(){var t=sa.length?sa.length<2?{type:"Point",coordinates:sa[0]}:{type:"MultiPoint",coordinates:sa}:null;return sa=[],t}},va={lineStart:a,point:function(t,n){sa.push([t,n])},lineEnd:function(){sa.length&&(ca.push(sa),sa=[])},result:function(){var t=ca.length?ca.length<2?{type:"LineString",coordinates:ca[0]}:{type:"MultiLineString",coordinates:ca}:null;return ca=[],t}},la={polygonStart:a,lineStart:a,point:function(t,n){sa.push([t,n])},lineEnd:function(){var t=sa.length;if(t){do sa.push(sa[0].slice());while(++t<4);ca.push(sa),sa=[]}},polygonEnd:a,result:function(){if(!ca.length)return null;var t=[],n=[];return ca.forEach(function(a){r(a)?t.push([a]):n.push(a)}),n.forEach(function(n){var a=n[0];t.some(function(t){return e(t[0],a)?(t.push(n),!0):void 0})||t.push([n])}),ca=[],t.length?t.length>1?{type:"MultiPolygon",coordinates:t}:{type:"Polygon",coordinates:t[0]}:null}},ga={Point:fa,MultiPoint:fa,LineString:va,MultiLineString:va,Polygon:la,MultiPolygon:la,Sphere:la},da=1e-6,ba=da*da,pa=Math.PI,wa=pa/2,qa=Math.sqrt(pa),ma=pa/180,ya=180/pa,Sa=d3.geo.projection,Qa=d3.geo.projectionMutator;d3.geo.interrupt=function(t){function n(n,a){for(var r=0>a?-1:1,e=h[+(0>a)],o=0,i=e.length-1;i>o&&n>e[o][2][0];++o);var u=t(n-e[o][1][0],a);return u[0]+=t(e[o][1][0],r*a>r*e[o][0][1]?e[o][0][1]:a)[0],u}function a(){i=h.map(function(n){return n.map(function(n){var a,r=t(n[0][0],n[0][1])[0],e=t(n[2][0],n[2][1])[0],o=t(n[1][0],n[0][1])[1],i=t(n[1][0],n[1][1])[1];return o>i&&(a=o,o=i,i=a),[[r,o],[e,i]]})})}function r(){for(var t=1e-6,n=[],a=0,r=h[0].length;r>a;++a){var o=h[0][a],i=180*o[0][0]/pa,u=180*o[0][1]/pa,M=180*o[1][1]/pa,s=180*o[2][0]/pa,c=180*o[2][1]/pa;n.push(e([[i+t,u+t],[i+t,M-t],[s-t,M-t],[s-t,c+t]],30))}for(var a=h[1].length-1;a>=0;--a){var o=h[1][a],i=180*o[0][0]/pa,u=180*o[0][1]/pa,M=180*o[1][1]/pa,s=180*o[2][0]/pa,c=180*o[2][1]/pa;n.push(e([[s-t,c-t],[s-t,M+t],[i+t,M+t],[i+t,u-t]],30))}return{type:"Polygon",coordinates:[d3.merge(n)]}}function e(t,n){for(var a,r,e,o=-1,i=t.length,h=t[0],u=[];++o<i;){a=t[o],r=(a[0]-h[0])/n,e=(a[1]-h[1])/n;for(var M=0;n>M;++M)u.push([h[0]+M*r,h[1]+M*e]);h=a}return u.push(a),u}function o(t,n){return Math.abs(t[0]-n[0])<da&&Math.abs(t[1]-n[1])<da}var i,h=[[[[-pa,0],[0,wa],[pa,0]]],[[[-pa,0],[0,-wa],[pa,0]]]];t.invert&&(n.invert=function(a,r){for(var e=i[+(0>r)],u=h[+(0>r)],M=0,s=e.length;s>M;++M){var c=e[M];if(c[0][0]<=a&&a<c[1][0]&&c[0][1]<=r&&r<c[1][1]){var f=t.invert(a-t(u[M][1][0],0)[0],r);return f[0]+=u[M][1][0],o(n(f[0],f[1]),[a,r])?f:null}}});var u=d3.geo.projection(n),M=u.stream;return u.stream=function(t){var n=u.rotate(),a=M(t),e=(u.rotate([0,0]),M(t));return u.rotate(n),a.sphere=function(){d3.geo.stream(r(),e)},a},u.lobes=function(t){return arguments.length?(h=t.map(function(t){return t.map(function(t){return[[t[0][0]*pa/180,t[0][1]*pa/180],[t[1][0]*pa/180,t[1][1]*pa/180],[t[2][0]*pa/180,t[2][1]*pa/180]]})}),a(),u):h.map(function(t){return t.map(function(t){return[[180*t[0][0]/pa,180*t[0][1]/pa],[180*t[1][0]/pa,180*t[1][1]/pa],[180*t[2][0]/pa,180*t[2][1]/pa]]})})},u},(d3.geo.airy=c).raw=s,f.invert=function(t,n){if(!(t*t+4*n*n>pa*pa+da)){var a=t,r=n,e=25;do{var o,i=Math.sin(a),h=Math.sin(a/2),M=Math.cos(a/2),s=Math.sin(r),c=Math.cos(r),f=Math.sin(2*r),v=s*s,l=c*c,g=h*h,d=1-l*M*M,b=d?u(c*M)*Math.sqrt(o=1/d):o=0,p=2*b*c*h-t,w=b*s-n,q=o*(l*g+b*c*M*v),m=o*(.5*i*f-2*b*s*h),y=.25*o*(f*h-b*s*l*i),S=o*(v*M+b*g*c),Q=m*y-S*q;if(!Q)break;var R=(w*m-p*S)/Q,T=(p*y-w*q)/Q;a-=R,r-=T}while((Math.abs(R)>da||Math.abs(T)>da)&&--e>0);return[a,r]}},(d3.geo.aitoff=function(){return Sa(f)}).raw=f,(d3.geo.armadillo=l).raw=v,q.invert=function(t,n){if(t*=3/8,n*=3/8,!t&&Math.abs(n)>1)return null;var a=t*t,r=n*n,e=1+a+r,o=Math.sqrt(.5*(e-Math.sqrt(e*e-4*n*n))),u=h(o)/3,M=o?w(Math.abs(n/o))/3:p(Math.abs(t))/3,s=Math.cos(u),c=b(M),f=c*c-s*s;return[2*i(t)*Math.atan2(d(M)*s,.25-f),2*i(n)*Math.atan2(c*Math.sin(u),.25+f)]},(d3.geo.august=function(){return Sa(q)}).raw=q;var Ra=Math.log(1+Math.SQRT2);m.invert=function(t,n){if((r=Math.abs(n))<Ra)return[t,2*Math.atan(Math.exp(n))-wa];
var a,r,e=Math.sqrt(8),o=pa/4,h=25;do{var u=Math.cos(o/2),M=Math.tan(o/2);o-=a=(e*(o-pa/4)-Math.log(M)-r)/(e-.5*u*u/M)}while(Math.abs(a)>ba&&--h>0);return[t/(Math.cos(o)*(e-1/Math.sin(o))),i(n)*o]},(d3.geo.baker=function(){return Sa(m)}).raw=m;var Ta=d3.geo.azimuthalEquidistant.raw;(d3.geo.berghaus=S).raw=y;var xa=Q(pa),Ea=R(Math.SQRT2/wa,Math.SQRT2,pa);(d3.geo.mollweide=function(){return Sa(Ea)}).raw=Ea,T.invert=function(t,n){var a,r,e=2.00276,o=e*n,i=0>n?-pa/4:pa/4,h=25;do r=o-Math.SQRT2*Math.sin(i),i-=a=(Math.sin(2*i)+2*i-pa*Math.sin(r))/(2*Math.cos(2*i)+2+pa*Math.cos(r)*Math.SQRT2*Math.cos(i));while(Math.abs(a)>da&&--h>0);return r=o-Math.SQRT2*Math.sin(i),[t*(1/Math.cos(r)+1.11072/Math.cos(i))/e,r]},(d3.geo.boggs=function(){return Sa(T)}).raw=T,E.invert=function(t,n){return[t/Math.cos(n),n]},(d3.geo.sinusoidal=function(){return Sa(E)}).raw=E,(d3.geo.bonne=function(){return x(k).parallel(45)}).raw=k,(d3.geo.bottomley=function(){var t=pa/6,n=d3.geo.projectionMutator(P),a=n(t);return a.variant=function(a){return arguments.length?n(t=+a):t},a}).raw=P;var ka=R(1,4/pa,pa);(d3.geo.bromley=function(){return Sa(ka)}).raw=ka,(d3.geo.chamberlin=z).raw=_,G.invert=function(t,n){var a=(a=n/qa-1)*a;return[a>0?t*Math.sqrt(pa/a)/2:0,h(1-a)]},(d3.geo.collignon=function(){return Sa(G)}).raw=G,(d3.geo.craig=function(){return x(C)}).raw=C,D.invert=function(t,n){var a=Math.sqrt(3),r=3*h(n/(a*qa));return[qa*t/(a*(2*Math.cos(2*r/3)-1)),r]},(d3.geo.craster=function(){return Sa(D)}).raw=D,(d3.geo.cylindricalEqualArea=function(){return x(L)}).raw=L,(d3.geo.cylindricalStereographic=function(){return x(O)}).raw=O,H.invert=function(t,n){var a=Math.sqrt(8/(3*pa)),r=n/a;return[t/(a*(1-Math.abs(r)/pa)),r]},(d3.geo.eckert1=function(){return Sa(H)}).raw=H,I.invert=function(t,n){var a=2-Math.abs(n)/Math.sqrt(2*pa/3);return[t*Math.sqrt(6*pa)/(2*a),i(n)*h((4-a*a)/3)]},(d3.geo.eckert2=function(){return Sa(I)}).raw=I,J.invert=function(t,n){var a=Math.sqrt(pa*(4+pa))/2;return[t*a/(1+M(1-n*n*(4+pa)/(4*pa))),n*a/2]},(d3.geo.eckert3=function(){return Sa(J)}).raw=J,K.invert=function(t,n){var a=.5*n*Math.sqrt((4+pa)/pa),r=h(a),e=Math.cos(r);return[t/(2/Math.sqrt(pa*(4+pa))*(1+e)),h((r+a*(e+2))/(2+wa))]},(d3.geo.eckert4=function(){return Sa(K)}).raw=K,N.invert=function(t,n){var a=Math.sqrt(2+pa),r=n*a/2;return[a*t/(1+Math.cos(r)),r]},(d3.geo.eckert5=function(){return Sa(N)}).raw=N,U.invert=function(t,n){var a=1+wa,r=Math.sqrt(a/2);return[2*t*r/(1+Math.cos(n*=r)),h((n+Math.sin(n))/a)]},(d3.geo.eckert6=function(){return Sa(U)}).raw=U,V.invert=function(t,n){var a=d3.geo.august.raw.invert(t/1.2,1.065*n);if(!a)return null;var r=a[0],e=a[1],o=20;t/=Pa,n/=Pa;do{var i=r/2,h=e/2,u=Math.sin(i),M=Math.cos(i),s=Math.sin(h),c=Math.cos(h),f=Math.cos(e),v=Math.sqrt(f),l=s/(c+Math.SQRT2*M*v),g=l*l,d=Math.sqrt(2/(1+g)),b=Math.SQRT2*c+(M+u)*v,p=Math.SQRT2*c+(M-u)*v,w=b/p,q=Math.sqrt(w),m=q-1/q,y=q+1/q,S=d*m-2*Math.log(q)-t,Q=d*l*y-2*Math.atan(l)-n,R=s&&Math.SQRT1_2*v*u*g/s,T=(Math.SQRT2*M*c+v)/(2*(c+Math.SQRT2*M*v)*(c+Math.SQRT2*M*v)*v),x=-.5*l*d*d*d,E=x*R,k=x*T,P=(P=2*c+Math.SQRT2*v*(M-u))*P*q,_=(Math.SQRT2*M*c*v+f)/P,z=-(Math.SQRT2*u*s)/(v*P),B=m*E-2*_/q+d*(_+_/w),F=m*k-2*z/q+d*(z+z/w),j=l*y*E-2*R/(1+g)+d*y*R+d*l*(_-_/w),A=l*y*k-2*T/(1+g)+d*y*T+d*l*(z-z/w),G=F*j-A*B;if(!G)break;var C=(Q*F-S*A)/G,D=(S*j-Q*B)/G;r-=C,e=Math.max(-wa,Math.min(wa,e-D))}while((Math.abs(C)>da||Math.abs(D)>da)&&--o>0);return Math.abs(Math.abs(e)-wa)<da?[0,e]:o&&[r,e]};var Pa=3+2*Math.SQRT2;(d3.geo.eisenlohr=function(){return Sa(V)}).raw=V,W.invert=function(t,n){var a=n/(1+_a);return[t?t/(_a*M(1-a*a)):0,2*Math.atan(a)]};var _a=Math.cos(35*ma);(d3.geo.fahey=function(){return Sa(W)}).raw=W,X.invert=function(t,n){var a=Math.atan(n/qa),r=Math.cos(a),e=2*a;return[.5*t*qa/(Math.cos(e)*r*r),e]},(d3.geo.foucaut=function(){return Sa(X)}).raw=X,d3.geo.gilbert=function(t){function n(n){return t([.5*n[0],h(Math.tan(.5*n[1]*ma))*ya])}var a=d3.geo.equirectangular().scale(ya).translate([0,0]);return t.invert&&(n.invert=function(n){return n=t.invert(n),n[0]*=2,n[1]=2*Math.atan(Math.sin(n[1]*ma))*ya,n}),n.stream=function(n){n=t.stream(n);var r=a.stream({point:function(t,a){n.point(.5*t,h(Math.tan(.5*-a*ma))*ya)},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}});return r.sphere=function(){n.sphere()},r.valid=!1,r},n};var za=d3.geo.azimuthalEquidistant.raw;(d3.geo.gingery=$).raw=Y;var Ba=nn(2.8284,-1.6988,.75432,-.18071,1.76003,-.38914,.042555);(d3.geo.ginzburg4=function(){return Sa(Ba)}).raw=Ba;var Fa=nn(2.583819,-.835827,.170354,-.038094,1.543313,-.411435,.082742);(d3.geo.ginzburg5=function(){return Sa(Fa)}).raw=Fa;var ja=nn(5/6*pa,-.62636,-.0344,0,1.3493,-.05524,0,.045);(d3.geo.ginzburg6=function(){return Sa(ja)}).raw=ja,an.invert=function(t,n){var a,r=t,e=n,o=50;do{var i=e*e;e-=a=(e*(1+i/12)-n)/(1+i/4)}while(Math.abs(a)>da&&--o>0);o=50,t/=1-.162388*i;do{var h=(h=r*r)*h;r-=a=(r*(.87-952426e-9*h)-t)/(.87-.00476213*h)}while(Math.abs(a)>da&&--o>0);return[r,e]},(d3.geo.ginzburg8=function(){return Sa(an)}).raw=an;var Aa=nn(2.6516,-.76534,.19123,-.047094,1.36289,-.13965,.031762);(d3.geo.ginzburg9=function(){return Sa(Aa)}).raw=Aa,en.invert=function(t,n){var a=i(t),r=i(n),e=-a*t,o=-r*n,u=1>o/e,M=hn(u?o:e,u?e:o),s=M[0],c=M[1];u&&(s=-wa-s);var f=Math.cos(c),t=Math.cos(s)*f,n=Math.sin(s)*f,v=Math.sin(c);return[a*(Math.atan2(n,-v)+pa),r*h(t)]},d3.geo.gringorten=rn(en),fn.invert=function(t,n){var a=(Math.SQRT2-1)/(Math.SQRT2+1),r=Math.sqrt(1-a*a),e=cn(wa,r*r),o=-1,i=un(.5*e-n,-t,r*r),h=ln(i[0],i[1]),u=Math.atan2(h[1],h[0])/o;return[u,2*Math.atan(Math.exp(.5/o*Math.log(a*h[0]*h[0]+a*h[1]*h[1])))-wa]},d3.geo.guyou=rn(fn),(d3.geo.hammerRetroazimuthal=bn).raw=gn;var Ga=d3.geo.azimuthalEqualArea.raw;qn.invert=function(t,n){var a=2*h(n/2);return[t*Math.cos(a/2)/Math.cos(a),a]},(d3.geo.hammer=wn).raw=pn,mn.invert=function(t,n){var a=Math.abs(a=n*(0>n?.5179951515653813:.5686373742600607))>1-da?a>0?wa:-wa:h(a);return[1.1764705882352942*t/Math.cos(a),Math.abs(a=((a+=a)+Math.sin(a))*(0>n?.4102345310814193:.3736990601468637))>1-da?a>0?wa:-wa:h(a)]},(d3.geo.hatano=function(){return Sa(mn)}).raw=mn;var Ca=41+48/36+37/3600;(d3.geo.healpix=Sn).raw=yn,(d3.geo.hill=Rn).raw=Qn;var Da=.7109889596207567,La=.0528035274542;Tn.invert=function(t,n){return n>-Da?Ea.invert(t,n-La):E.invert(t,n)},(d3.geo.sinuMollweide=function(){return Sa(Tn).rotate([-20,-55])}).raw=Tn,xn.invert=function(t,n){return Math.abs(n)>Da?Ea.invert(t,n+(n>0?La:-La)):E.invert(t,n)},(d3.geo.homolosine=function(){return Sa(xn)}).raw=xn,En.invert=function(t,n){return[2/3*pa*t/Math.sqrt(pa*pa/3-n*n),n]},(d3.geo.kavrayskiy7=function(){return Sa(En)}).raw=En,(d3.geo.lagrange=Pn).raw=kn,_n.invert=function(t,n){var a=Math.abs(t),r=Math.abs(n),e=pa/Math.SQRT2,o=da,i=wa;e>r?i*=r/e:o+=6*u(e/r);for(var h=0;25>h;h++){var s=Math.sin(i),c=M(Math.cos(i)),f=Math.sin(i/2),v=Math.cos(i/2),l=Math.sin(o/6),g=Math.cos(o/6),d=.5*o*(1+c)-a,b=i/(v*g)-r,p=c?-.25*o*s/c:0,w=.5*(1+c),q=(1+.5*i*f/v)/(v*g),m=i/v*(l/6)/(g*g),y=p*m-q*w,S=(d*m-b*w)/y,Q=(b*p-d*q)/y;if(i-=S,o-=Q,Math.abs(S)<da&&Math.abs(Q)<da)break}return[0>t?-o:o,0>n?-i:i]},(d3.geo.larrivee=function(){return Sa(_n)}).raw=_n,zn.invert=function(t,n){var a=i(t)*pa,r=n/2,e=50;do{var o=a*a,h=r*r,u=a*r,M=a*(.975534+h*(-.119161+o*-.0143059+h*-.0547009))-t,s=r*(1.00384+o*(.0802894+h*-.02855+199025e-9*o)+h*(.0998909+h*-.0491032))-n,c=.975534-h*(.119161+.0143059*3*o+.0547009*h),f=-u*(.238322+.2188036*h+.0286118*o),v=u*(.1605788+7961e-7*o+-0.0571*h),l=1.00384+o*(.0802894+199025e-9*o)+h*(3*(.0998909-.02855*o)-.245516*h),g=f*v-l*c,d=(s*f-M*l)/g,b=(M*v-s*c)/g;a-=d,r-=b}while((Math.abs(d)>da||Math.abs(b)>da)&&--e>0);return e&&[a,r]},(d3.geo.laskowski=function(){return Sa(zn)}).raw=zn,Bn.invert=function(t,n){var a=t*t,r=n*n,e=r+1,o=t?Math.SQRT1_2*Math.sqrt((e-Math.sqrt(a*a+2*a*(r-1)+e*e))/a+1):1/Math.sqrt(e);return[h(t*o),i(n)*u(o)]},(d3.geo.littrow=function(){return Sa(Bn)}).raw=Bn,(d3.geo.loximuthal=function(){return x(Fn).parallel(40)}).raw=Fn,jn.invert=function(t,n){return[t,2.5*Math.atan(Math.exp(.8*n))-.625*pa]},(d3.geo.miller=function(){return Sa(jn)}).raw=jn;var Oa={alaska:[[.9972523,0],[.0052513,-.0041175],[.0074606,.0048125],[-.0153783,-.1968253],[.0636871,-.1408027],[.3660976,-.2937382]],gs48:[[.98879,0],[0,0],[-.050909,0],[0,0],[.075528,0]],gs50:[[.984299,0],[.0211642,.0037608],[-.1036018,-.0575102],[-.0329095,-.0320119],[.0499471,.1223335],[.026046,.0899805],[7388e-7,-.1435792],[.0075848,-.1334108],[-.0216473,.0776645],[-.0225161,.0853673]],miller:[[.9245,0],[0,0],[.01943,0]],lee:[[.721316,0],[0,0],[-.00881625,-.00617325]]};(d3.geo.modifiedStereographic=Gn).raw=An,Cn.invert=function(t,n){var a=Math.sqrt(6),r=Math.sqrt(7),e=3*h(n*r/9);return[t*r/(a*(2*Math.cos(2*e/3)-1)),h(3*Math.sin(e)*a/7)]},(d3.geo.mtFlatPolarParabolic=function(){return Sa(Cn)}).raw=Cn,Dn.invert=function(t,n){var a=n*Math.sqrt(2+Math.SQRT2)/(2*Math.sqrt(3)),r=2*h(a);return[3*Math.SQRT2*t/(1+2*Math.cos(r)/Math.cos(r/2)),h((a+Math.sin(r))/(1+Math.SQRT1_2))]},(d3.geo.mtFlatPolarQuartic=function(){return Sa(Dn)}).raw=Dn,Ln.invert=function(t,n){var a=Math.sqrt(6/(4+pa)),r=n/a;return Math.abs(Math.abs(r)-wa)<da&&(r=0>r?-wa:wa),[1.5*t/(a*(.5+Math.cos(r))),h((r/2+Math.sin(r))/(1+pa/4))]},(d3.geo.mtFlatPolarSinusoidal=function(){return Sa(Ln)}).raw=Ln,On.invert=function(t,n){var a,r=n,e=25;do{var o=r*r,i=o*o;r-=a=(r*(1.007226+o*(.015085+i*(-.044475+.028874*o-.005916*i)))-n)/(1.007226+o*(.045255+i*(-0.311325+.259866*o-.005916*11*i)))}while(Math.abs(a)>da&&--e>0);return[t/(.8707+(o=r*r)*(-.131979+o*(-.013791+o*o*o*(.003971-.001529*o)))),r]},(d3.geo.naturalEarth=function(){return Sa(On)}).raw=On,Hn.invert=function(t,n){for(var a=n/2,r=0,e=1/0;10>r&&Math.abs(e)>da;r++){var o=Math.cos(n/2);n-=e=(n-Math.tan(n/2)-a)/(1-.5/(o*o))}return[2*t/(1+Math.cos(n)),n]},(d3.geo.nellHammer=function(){return Sa(Hn)}).raw=Hn;var Ha=1.0148,Ia=.23185,Ja=-.14499,Ka=.02406,Na=Ha,Ua=5*Ia,Va=7*Ja,Wa=9*Ka,Xa=1.790857183;In.invert=function(t,n){n>Xa?n=Xa:-Xa>n&&(n=-Xa);var a,r=n;do{var e=r*r;r-=a=(r*(Ha+e*e*(Ia+e*(Ja+Ka*e)))-n)/(Na+e*e*(Ua+e*(Va+Wa*e)))}while(Math.abs(a)>da);return[t,r]},(d3.geo.patterson=function(){return Sa(In)}).raw=In;var Ya=rn(fn);(d3.geo.peirceQuincuncial=function(){return Ya().quincuncial(!0).rotate([-90,-90,45]).clipAngle(180-1e-6)}).raw=Ya.raw,Jn.invert=function(t,n){if(Math.abs(n)<da)return[t,0];var a,r=t*t+n*n,e=.5*n,o=10;do{var M=Math.tan(e),s=1/Math.cos(e),c=r-2*n*e+e*e;e-=a=(M*c+2*(e-n))/(2+c*s*s+2*(e-n)*M)}while(Math.abs(a)>da&&--o>0);return M=Math.tan(e),[(Math.abs(n)<Math.abs(e+1/M)?h(t*M):i(t)*(u(Math.abs(t*M))+wa))/Math.sin(e),e]},(d3.geo.polyconic=function(){return Sa(Jn)}).raw=Jn,(d3.geo.rectangularPolyconic=function(){return x(Kn)}).raw=Kn;var Za=[[.9986,-.062],[1,0],[.9986,.062],[.9954,.124],[.99,.186],[.9822,.248],[.973,.31],[.96,.372],[.9427,.434],[.9216,.4958],[.8962,.5571],[.8679,.6176],[.835,.6769],[.7986,.7346],[.7597,.7903],[.7186,.8435],[.6732,.8936],[.6213,.9394],[.5722,.9761],[.5322,1]];Za.forEach(function(t){t[1]*=1.0144}),Nn.invert=function(t,n){var a=n/wa,r=90*a,e=Math.min(18,Math.abs(r/5)),o=Math.max(0,Math.floor(e));do{var i=Za[o][1],h=Za[o+1][1],u=Za[Math.min(19,o+2)][1],M=u-i,s=u-2*h+i,c=2*(Math.abs(a)-h)/M,f=s/M,v=c*(1-f*c*(1-2*f*c));if(v>=0||1===o){r=(n>=0?5:-5)*(v+e);var l,g=50;do e=Math.min(18,Math.abs(r)/5),o=Math.floor(e),v=e-o,i=Za[o][1],h=Za[o+1][1],u=Za[Math.min(19,o+2)][1],r-=(l=(n>=0?wa:-wa)*(h+v*(u-i)/2+v*v*(u-2*h+i)/2)-n)*ya;while(Math.abs(l)>ba&&--g>0);break}}while(--o>=0);var d=Za[o][0],b=Za[o+1][0],p=Za[Math.min(19,o+2)][0];return[t/(b+v*(p-d)/2+v*v*(p-2*b+d)/2),r*ma]},(d3.geo.robinson=function(){return Sa(Nn)}).raw=Nn,(d3.geo.satellite=Wn).raw=Vn,Xn.invert=function(t,n){var a=n/1.70711,r=Math.sin(pa/4*a);return[t/(.74482-.34588*r*r),2*Math.atan(a)]},(d3.geo.times=function(){return Sa(Xn)}).raw=Xn,(d3.geo.twoPointEquidistant=Zn).raw=Yn,(d3.geo.twoPointAzimuthal=ta).raw=$n,na.invert=function(t,n){if(Math.abs(n)<da)return[t,0];if(Math.abs(t)<da)return[0,wa*Math.sin(2*Math.atan(n/pa))];var a=(t/=pa)*t,r=(n/=pa)*n,e=a+r,o=e*e,h=-Math.abs(n)*(1+e),M=h-2*r+a,s=-2*h+1+2*r+o,c=r/s+(2*M*M*M/(s*s*s)-9*h*M/(s*s))/27,f=(h-M*M/(3*s))/s,v=2*Math.sqrt(-f/3),l=u(3*c/(f*v))/3;return[pa*(e-1+Math.sqrt(1+2*(a-r)+o))/(2*t),i(n)*pa*(-v*Math.cos(l+pa/3)-M/(3*s))]},(d3.geo.vanDerGrinten=function(){return Sa(na)}).raw=na,aa.invert=function(t,n){if(!t)return[0,wa*Math.sin(2*Math.atan(n/pa))];var a=Math.abs(t/pa),r=(1-a*a-(n/=pa)*n)/(2*a),e=r*r,o=Math.sqrt(e+1);return[i(t)*pa*(o-r),i(n)*wa*Math.sin(2*Math.atan2(Math.sqrt((1-2*r*a)*(r+o)-a),Math.sqrt(o+r+a)))]},(d3.geo.vanDerGrinten2=function(){return Sa(aa)}).raw=aa,ra.invert=function(t,n){if(!n)return[t,0];var a=n/pa,r=(pa*pa*(1-a*a)-t*t)/(2*pa*t);return[t?pa*(i(t)*Math.sqrt(r*r+1)-r):0,wa*Math.sin(2*Math.atan(a))]},(d3.geo.vanDerGrinten3=function(){return Sa(ra)}).raw=ra,ea.invert=function(t,n){if(!t||!n)return[t,n];n/=pa;var a=i(t)*t/wa,r=(a*a-1+4*n*n)/Math.abs(a),e=r*r,o=2*n,h=50;do{var u=o*o,M=(8*o-u*(u+2)-5)/(2*u*(o-1)),s=(3*o-u*o-10)/(2*u*o),c=M*M,f=o*M,v=o+M,l=v*v,g=o+3*M,d=l*(u+c*e-1)+(1-u)*(u*(g*g+4*c)+c*(12*f+4*c)),b=-2*v*(4*f*c+(1-4*u+3*u*u)*(1+s)+c*(-6+14*u-e+(-8+8*u-2*e)*s)+f*(-8+12*u+(-10+10*u-e)*s)),p=Math.sqrt(d),w=r*(l+c-1)+2*p-a*(4*l+e),q=r*(2*M*s+2*v*(1+s))+b/p-8*v*(r*(-1+c+l)+2*p)*(1+s)/(e+4*l);o-=δ=w/q}while(δ>da&&--h>0);return[i(t)*(Math.sqrt(r*r+4)+r)*pa/4,wa*o]},(d3.geo.vanDerGrinten4=function(){return Sa(ea)}).raw=ea;var $a=function(){var t=4*pa+3*Math.sqrt(3),n=2*Math.sqrt(2*pa*Math.sqrt(3)/t);return R(n*Math.sqrt(3)/pa,n,t/6)}();(d3.geo.wagner4=function(){return Sa($a)}).raw=$a,oa.invert=function(t,n){return[t/Math.sqrt(1-3*n*n/(pa*pa)),n]},(d3.geo.wagner6=function(){return Sa(oa)}).raw=oa,ia.invert=function(t,n){var a=t/2.66723,r=n/1.24104,e=Math.sqrt(a*a+r*r),o=2*h(e/2);return[3*Math.atan2(t*Math.tan(o),2.66723*e),e&&h(n*Math.sin(o)/(1.24104*.90631*e))]},(d3.geo.wagner7=function(){return Sa(ia)}).raw=ia,ha.invert=function(t,n){var a=-.5*(t*t+n*n),r=Math.sqrt(-a*(2+a)),e=n*a+t*r,o=t*a-n*r,i=Math.sqrt(o*o+e*e);return[Math.atan2(r*e,i*(1+a)),i?-h(r*o/i):0]},(d3.geo.wiechel=function(){return Sa(ha)}).raw=ha,ua.invert=function(t,n){var a=t,r=n,e=25;do{var o,i=Math.cos(r),h=Math.sin(r),M=Math.sin(2*r),s=h*h,c=i*i,f=Math.sin(a),v=Math.cos(a/2),l=Math.sin(a/2),g=l*l,d=1-c*v*v,b=d?u(i*v)*Math.sqrt(o=1/d):o=0,p=.5*(2*b*i*l+a/wa)-t,w=.5*(b*h+r)-n,q=.5*o*(c*g+b*i*v*s)+.5/wa,m=o*(f*M/4-b*h*l),y=.125*o*(M*l-b*h*c*f),S=.5*o*(s*v+b*g*i)+.5,Q=m*y-S*q,R=(w*m-p*S)/Q,T=(p*y-w*q)/Q;a-=R,r-=T}while((Math.abs(R)>da||Math.abs(T)>da)&&--e>0);return[a,r]},(d3.geo.winkel3=function(){return Sa(ua)}).raw=ua}();var Voronoi,Aux;Voronoi={},Aux={inner:function(t,o){return t.x*o.x+t.y*o.y+t.z*o.z},sub:function(t,o){return{x:t.x-o.x,y:t.y-o.y,z:t.z-o.z}},cross:function(t,o){return{x:t.y*o.z-t.z*o.y,y:t.z*o.x-t.x*o.z,z:t.x*o.y-t.y*o.x}}},Voronoi.Treemap=function(t,o,n,e,i){var r,h,s,a,u,l;for(null==i&&(i=0),this.root=t,this.omega=o,this.width=n,this.height=e,this.lv=i,r=[],h=0,a=(s=t.children).length;a>h;++h)u=s[h],r.push((u.x=Math.random()*n,u.y=Math.random()*e,u.lv=i,u));for(this.sites=r,0===i&&this.normalizeValue(t,Polygon.area(o),this.correctValue(t)),this.boundmap=new Voronoi.Boundmap(this.sites,o,n,e,!0),this.boundmap.compute(),this.treemap=[],h=0,a=(s=t.children).length;a>h;++h)l=h,u=s[h],u.children&&this.treemap.push(new Voronoi.Treemap(u,this.boundmap.polygons[l],n,e,i+1));return this},Voronoi.Treemap.prototype={updateValue:function(){var t,o,n,e;for(this.normalizeValue(this.root,Polygon.area(this.omega),this.correctValue(this.root)),this.boundmap=new Voronoi.Boundmap(this.sites,this.omega,this.width,this.height,!0),t=0,n=(o=this.treemap).length;n>t;++t)e=o[t],e.updateValue();return this.compute()},correctValue:function(t){var o,n,e,i;for(null==t&&(t=this.sites),o=0,e=(n=t.children||[]).length;e>o;++o)i=n[o];return t.value=function(){var o,n,e,r=[];for(o=0,e=(n=t.children||[]).length;e>o;++o)i=n[o],r.push(this.correctValue(i||null));return r}.call(this).reduce(function(t,o){return t+o},0)||t.value||0},normalizeValue:function(t,o,n){var e,i,r,h,s=[];for(t.value=.05*t.value*o/n,e=0,r=(i=t.children||[]).length;r>e;++e)h=i[e],s.push(this.normalizeValue(h,o,n));return s},compute:function(){var t=this;return this.boundmap.compute(),this.treemap.forEach(function(o,n){return o.setOmega(t.boundmap.polygons[n]),o.compute()})},getSites:function(){var t;return[this.boundmap.sites].concat([function(){var o,n=[];for(o=0;4>o;++o)t=o,n.push({boundary:!0});return n}()],this.treemap.map(function(t){return t.getSites()})).reduce(function(t,o){return t.concat(o)},[])},getPolygons:function(){return[this.boundmap.polygons].concat(this.treemap.map(function(t){return t.getPolygons()})).reduce(function(t,o){return t.concat(o)},[])},setOmega:function(t){return this.omega=t,this.boundmap=new Voronoi.Boundmap(this.sites,t,this.width,this.height)}},Voronoi.Boundmap=function(t,o,n,e,i){var r,h;return this.sites=t,this.omega=o,this.width=n,this.height=e,null==i?(r=t.reduce(function(t,o){return t+o.value},0),h=Polygon.area(o),t.forEach(function(t){return t.nvalue=.1*t.value*h/r})):t.forEach(function(t){return t.nvalue=t.value}),t.forEach(function(t){return t.nvalue=t.value}),this.powerbox=new Voronoi.PowerDiagram(t,n,e),this.powerbox.compute(),this.clip(),this},Voronoi.randomSite=function(t,o,n,e){var i;return function(){var r,h,s=[];for(r=0,h=t;h>r;++r)i=r,s.push({x:o*Math.random(),y:n*Math.random(),value:1+Math.random()*e});return s}().map(function(t){return t.weight=t.value,t})},Voronoi.Boundmap.prototype={clip:function(){var t=this;return this.polygons=this.powerbox.convex.polygons.map(function(o){return o?Voronoi.Polygon.intersect(t.omega,o):[]}),this.centroids=this.polygons.map(function(t){return t?Voronoi.Polygon.centroid(t):{x:null,y:null}})},adoptPos:function(){var t,o,n,e,i,r,h,s,a,u,l,c,p,g,m,y=[];for(t={sites:this.sites,centroids:this.centroids,polygons:this.polygons},o=t.sites,n=t.centroids,e=t.polygons,i=0,r=n.length-4;r>i;++i)h=i,o[h]&&e[h]&&!o[h].boundary&&(e[h].length?(t=[n[h].x,n[h].y],o[h].x=t[0],o[h].y=t[1]):(t=[this.width*Math.random(),this.height*Math.random()],o[h].x=t[0],o[h].y=t[1]));for(i=0,r=n.length-4;r>i;++i)if(h=i,o[h]&&e[h].length&&!o[h].boundary){for(t=[Math.sqrt(o[h].weight),-1],s=t[0],a=t[1],u=0,l=e[h].length;l>u;++u)c=u,t=[e[h][c],e[h][(c+1)%e[h].length]],p=t[0],g=t[1],m=10*Math.abs(((g.y-p.y)*o[h].x-(g.x-p.x)*o[h].y+g.x*p.y-g.y*p.x)/Math.sqrt(Math.pow(g.y-p.y,2)+Math.pow(g.x-p.x,2))),(-1===a||a>m)&&(a=m);s=Math.pow(Math.min(s,a),2),y.push(o[h].weight=s)}return y},resetWeight:function(){return this.sites.forEach(function(t){return t.weight=t.pvalue=t.nvalue})},adoptWeight:function(){var t,o,n,e,i,r,h,s,a,u,l,c,p,g,m,y,d,f,v=[];for(t={sites:this.sites,centroids:this.centroids,polygons:this.polygons},o=t.sites,n=t.centroids,e=t.polygons,i=0,o.forEach(function(t){return i+=t.nvalue,t.pvalue!==t.nvalue&&(t.weight=t.nvalue),t.pvalue=t.nvalue}),r=Voronoi.Polygon.area(this.omega),h=0,s=n.length-4;s>h;++h)if(a=h,o[a]&&e[a].length&&!o[a].boundary){for(u=r*o[a].nvalue/i,l=Polygon.area(e[a]),c=Math.sqrt(o[a].weight),p=Math.sqrt(o[a].weight)*u/l,c=.5*(p-c)+c,g=-1,m=0,y=n.length-4;y>m;++m)d=m,a!==d&&this.polygons[d]&&(f=Math.sqrt(Math.pow(n[d].x-o[a].x,2)+Math.pow(n[d].y-o[a].y,2)),isNaN(f)||(-1===g||g>f)&&(g=f));c=Math.pow(Math.min(c,g),2),c<this.powerbox.epsilon&&(c=this.powerbox.epsilon),v.push(o[a].weight=c)}return v},compute:function(){return this.adoptPos(),this.powerbox=new Voronoi.PowerDiagram(this.sites,this.width,this.height),this.powerbox.compute(),this.clip(),this.adoptWeight(),this.powerbox=new Voronoi.PowerDiagram(this.sites,this.width,this.height),this.powerbox.compute(),this.clip()}},Voronoi.PowerDiagram=function(t,o,n){var e=this;return this.sites=t,this.width=o,this.height=n,this.boundary=[{x:-o,y:-n,boundary:!0},{x:-o,y:2*n,boundary:!0},{x:2*o,y:-n,boundary:!0},{x:2*o,y:2*n,boundary:!0}].map(function(t){return t.boundary=!0,t.weight=e.epsilon,t.value=e.epsilon,t}),this.convex=new Voronoi.Convex(JSON.parse(JSON.stringify(t.concat(this.boundary)))),this},Voronoi.PowerDiagram.prototype={epsilon:1e-10,compute:function(){return this.convex.calculate()}};var Polygon;Voronoi.Polygon=Polygon={},Polygon.centroid=function(n){var e,r,t,o,y,u,x,h,l;if(!n||!n.length)return{x:0/0,y:0/0};for(e=n.length,r=[0,0,0],t=r[0],o=r[1],y=r[2],u=0;e>u;++u)x=u,r=[n[x],n[(x+1)%e]],h=r[0],l=r[1],t+=(h.x+l.x)*(h.x*l.y-l.x*h.y),o+=(h.y+l.y)*(h.x*l.y-l.x*h.y),y+=3*(h.x*l.y-l.x*h.y);return{x:t/y,y:o/y}},Polygon.area=function(n){var e,r,t,o;return function(){var y,u,x,h=[];for(y=0,u=n.length;u>y;++y)e=y,r=(e+1)%n.length,x=[n[e],n[r]],t=x[0],o=x[1],h.push(t.x*o.y-t.y*o.x);return h}().reduce(function(n,e){return n+e/2},0)},Polygon.intersect=function(n,e){function r(n,e){return n+e.x}function t(n,e){return n+e.y}var o,y,u,x,h,l,g,c,f,i,a,P,s,d,v,p,M,I,w,V,b,j,k,m,q,z,A,B,C,D,E,F;if(!n||!n.length)return[];for(o=n.reduce(function(n,e){return n+e.x},0)/n.length,y=n.reduce(function(n,e){return n+e.y},0)/n.length,u=0,x=n.length;x>u;++u){for(h=u,l=[n[h],n[(h+1)%n.length]],g=l[0],c=l[1],l=[c.x-g.x,c.y-g.y],f=l[0],i=l[1],a=e.reduce(r,0)/e.length,P=e.reduce(t,0)/e.length,s=g.x*i-g.y*f,v=[],p=0,M=e.length;M>p;++p)I=p,l=[e[I],e[(I+1)%e.length]],w=l[0],V=l[1],l=[V.x-w.x,V.y-w.y],b=l[0],j=l[1],j*f-b*i!==0&&(k=(w.x*i-w.y*f-s)/(j*f-b*i),0>k||k>1||(l=[w.x+b*k,w.y+j*k],m=l[0],q=l[1],l=[a-m,P-q],z=l[0],A=l[1],B=(-f*j+i*b)*(-z*j+A*b)>0,v.push([k,I,m,q,B])));if(d=v,d.length<2){if((-(o-g.x)*i+(y-g.y)*f)*(-(a-g.x)*i+(P-g.y)*f)<0)return[]}else{l=d[0][4]?[d[0],d[1]]:[d[1],d[0]],C=l[0],D=l[1],E=[{x:C[2],y:C[3]},{x:D[2],y:D[3]}],F=D[1];do F=(F+1)%e.length,E.push(e[F]);while(F!==C[1]);e=E}}return e},Polygon.create=function(n,e,r){var t,o,y=[];for(3>r&&(r=3),t=0;r>t;++t)o=t,y.push({x:1*(n/2+n/2*Math.cos(2*Math.PI*o/r)),y:1*(e/2+e/2*Math.sin(2*Math.PI*o/r))});return y};function import$(t,r){var s={}.hasOwnProperty;for(var e in r)s.call(r,e)&&(t[e]=r[e]);return t}Voronoi.face=function(t,r,s){var e,i,n,h,o,x,y,a,u,z,p,l,v,c,f,d,m,g,w,M,V,$;for(null==s&&(s=!1),this.convex=t,this.idx=r,this.active=s,this.removed=!1,this.pts=(e=[t.pts[r[0]],t.pts[r[1]],t.pts[r[2]]],i=e[0],n=e[1],h=e[2],e),o=t.center,e=[h.x-i.x,h.y-i.y,h.z-i.z],x=e[0],y=e[1],a=e[2],e=[n.x-i.x,n.y-i.y,n.z-i.z],u=e[0],z=e[1],p=e[2],this.norm=l={x:y*p-a*z,y:a*u-x*p,z:x*z-y*u},v=Math.pow(l.x,2)+Math.pow(l.y,2)+Math.pow(l.z,2),this.norm=l={x:l.x/v,y:l.y/v,z:l.z/v},c=l.x*(o.x-i.x)+l.y*(o.y-i.y)+l.z*(o.z-i.z),c>0?(e=[-l.x,-l.y,-l.z],l.x=e[0],l.y=e[1],l.z=e[2],this.pts.reverse(),r.reverse()):0===c&&(this.trivial=!0),f=[],d=0;3>d;++d)m=d,g=(m+1)%3,e=r[m]>r[g]?[r[g],r[m]]:[r[m],r[g]],w=e[0],M=e[1],f.push((e=(V=(($=t.edges)[w]||($[w]={}))[M])?V:(($=t.edges)[w]||($[w]={}))[M]=[w,M],e.ref=0,e));return this.edges=f,this.precal=l.x*i.x+l.y*i.y+l.z*i.z,this},import$(Voronoi.face.prototype,{front:function(t){var r;return r=this.norm,r.x*t.x+r.y*t.y+r.z*t.z-this.precal>0},getCenter:function(){var t,r,s;return t=[{x:0,y:0},this.pts.length],r=t[0],s=t[1],this.pts.forEach(function(t){var s;return s=[r.x+t.x,r.y+t.y],r.x=s[0],r.y=s[1],s}),r.x=r.x/s,r.y=r.y/s,r.z=-100,r},dual:function(){var t,r,s,e,i,n,h,o,x,y,a,u,z,p,l,v,c;return this.dual.value&&this.dual.value,t=this.pts[0],r=t.x,s=t.y,e=t.z,t=this.pts[1],i=t.x,n=t.y,h=t.z,t=this.pts[2],o=t.x,x=t.y,y=t.z,a=s*(h-y)+n*(y-e)+x*(e-h),u=e*(i-o)+h*(o-r)+y*(r-i),z=r*(n-x)+i*(x-s)+o*(s-n),p=r*(n*y-x*h)+i*(x*e-s*y)+o*(s*h-n*e),l=.5*-a/z,v=.5*-u/z,c=-p/z,this.dual.value={x:l,y:v,z:c},this.dual.value}});function import$(t,r){var i={}.hasOwnProperty;for(var n in r)i.call(r,n)&&(t[n]=r[n]);return t}function in$(t,r){for(var i=-1,n=r.length>>>0;++i<n;)if(t===r[i])return!0;return!1}Voronoi.Convex=function(t){function r(t){return l.center[t]=[0,1,2,3].reduce(function(r,i){return r+l.pts[o[i]][t]},0)/4}function i(t){return t.map(function(t){return o[t]})}function n(t){return t.trivial}function e(t,r){var i;return i=Aux.sub(l.center,l.pts[t]),["x","y","z"].reduce(function(t,r){return t+Math.pow(i[r],2)},0),[i,r]}function s(t,r){return t[0]-r[0]}var h,o,u,f,a,c,p,l=this;if(this.pts=t,this.polygons=[],this.edges={},this.pts.forEach(function(t){return t.z=Math.pow(t.x,2)+Math.pow(t.y,2)-t.weight}),this.pair={f2p:{},p2f:{}},this.faces.list=[],!(this.pts.length<4)){for(h=[[0,1,2,3],3],o=h[0],this.idx=h[1];this.idx<this.pts.length;){for(this.idx++,this.center={},["x","y","z"].map(r),f=[],a=0,c=(h=[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].map(i)).length;c>a;++a)p=h[a],f.push(new Voronoi.face(this,p));if(u=f,!u.filter(n).length)break;p=o.map(e).sort(s)[0][1],o.splice(o.indexOf(p),1),o.push(this.idx)}return this.faces.add(u),u.forEach(function(t,r){return l.pts.forEach(function(i,n){return t.front(i)?l.setPair(r,n,t,i):void 0})}),this}},import$(Voronoi.Convex.prototype,{getPairByPtr:function(t){return this.pair.p2f[t]||[]},getPairByFace:function(t){return this.pair.f2p[t]||[]},setPair:function(t,r,i,n){var e,s;return((e=(s=this.pair).f2p||(s.f2p={}))[t]||(e[t]=[])).push(n),((e=(s=this.pair).p2f||(s.p2f={}))[r]||(e[r]=[])).push(i)},faces:{contain:function(t){return in$(t,this.list)},add:function(t){return Array.isArray(t)?this.list=this.list.concat(t):this.list.push(t)},remove:function(t){var r=this;return Array.isArray(t)||(t=[t]),t.forEach(function(t){var i;return i=r.list.indexOf(t),i>=0?r.list.splice(i,1):void 0})}},polygonReorder:function(t){var r,i,n,e;return r=t.reduce(function(t,r){return t+r.x},0)/t.length,i=t.reduce(function(t,r){return t+r.y},0)/t.length,n=Math.pow(r,2)+Math.pow(i,2),e=function(t){var e,s,h;return e=Math.sqrt(n*(Math.pow(t.x-r,2)+Math.pow(t.y-i,2))),s=Math.acos((-r*(t.x-r)-i*(t.y-i))/e),h=Math.acos((i*(t.x-r)-r*(t.y-i))/e),h>Math.PI/2&&(s=6.28-s),s},t.sort(function(t,r){return e(t)-e(r)})},grid:function(){function t(t,r){return t+r.x}function r(t,r){return t+r.y}var i,n,e,s,h,o,u,f,a,c,p,l,d,g,x,y,v,m,w=[];for(this.faces.list.forEach(function(t){return t.center=t.getCenter(),t}),this.faces.list=this.faces.list.filter(function(t){return!t.removed&&t.front(t.center)}),i=[],n=0,e=this.pts.length;e>n;++n)s=n,i.push([]);for(this.polygons=i,n=0,o=(h=this.pts).length;o>n;++n)u=h[n],u.visited=!1;for(f=[],n=0,o=(h=this.faces.list).length;o>n;++n){for(a=h[n],c=[],p=0,d=(l=a.idx).length;d>p;++p)if(u=l[p],!in$(u,f)){for(f.push(u),g=[],g.idx=u,x=0,v=(y=this.faces.list).length;v>x;++x)s=x,m=y[x],in$(u,m.idx)&&g.push(m.dual());this.polygonReorder(g),g.cx=g.reduce(t,0)/g.length,g.cy=g.reduce(r,0)/g.length,this.pts[u].boundary&&(g.boundary=!0),c.push(this.polygons[u]=g)}w.push(c)}return w},calculate:function(){for(;this.idx<this.pts.length;)this.iterate();return this.grid()},iterate:function(){var t,r,i,n,e,s,h,o,u,f,a,c,p,l,d,g,x,y,v,m,w,M;if(t=(new Date).getTime(),!(this.idx>=this.pts.length)){for(r=this.getPairByPtr(this.idx),i=[],n=0,e=r.length;e>n;++n)if(s=r[n],!s.removed)for(h=0,u=(o=s.edges).length;u>h;++h)f=o[h],f.ref?f.dup=!0:i.push(f),f.ref++;return a=i.filter(function(t){return t.ref<2}),r.map(function(t){return t.removed=!0}),c=(new Date).getTime(),this.faces.add(p=function(){var t,r,i,n=[];for(t=0,i=(r=a).length;i>t;++t)f=r[t],n.push(new Voronoi.face(this,f.concat([this.idx]),!0));return n}.call(this)),o=[this.pts,this.pair,this.idx,this.faces.list.length,this.pts.length,p.length],l=o[0],d=o[1],g=o[2],x=o[3],y=o[4],v=o[5],m=(new Date).getTime(),p.forEach(function(t,r){var i,n,e,s,h,o,u,f=[];for(r+=x-v,i=[t.norm,t.precal],n=i[0],e=i[1],s=g+1,h=y;h>s;++s)o=s,u=l[o],n.x*u.x+n.y*u.y+n.z*u.z-e>0&&(((i=d.f2p)[r]||(i[r]=[])).push(u),f.push(((i=d.p2f)[o]||(i[o]=[])).push(t)));return f}),this.idx++,w=(new Date).getTime(),this.e1=(null!=(M=this.e1)?M:0)+(c-t),this.e2=(null!=(M=this.e2)?M:0)+(m-c),this.e3=(null!=(M=this.e3)?M:0)+(w-m)}}});/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
 
(function ( global ) {
 
	function RGBColor(color_string)
	{
		this.ok = false;

		// strip any leading #
		if (color_string.charAt(0) == '#') { // remove # if any
			color_string = color_string.substr(1,6);
		}

		color_string = color_string.replace(/ /g,'');
		color_string = color_string.toLowerCase();

		// before getting into regexps, try simple matches
		// and overwrite the input
		var simple_colors = {
			aliceblue: 'f0f8ff',
			antiquewhite: 'faebd7',
			aqua: '00ffff',
			aquamarine: '7fffd4',
			azure: 'f0ffff',
			beige: 'f5f5dc',
			bisque: 'ffe4c4',
			black: '000000',
			blanchedalmond: 'ffebcd',
			blue: '0000ff',
			blueviolet: '8a2be2',
			brown: 'a52a2a',
			burlywood: 'deb887',
			cadetblue: '5f9ea0',
			chartreuse: '7fff00',
			chocolate: 'd2691e',
			coral: 'ff7f50',
			cornflowerblue: '6495ed',
			cornsilk: 'fff8dc',
			crimson: 'dc143c',
			cyan: '00ffff',
			darkblue: '00008b',
			darkcyan: '008b8b',
			darkgoldenrod: 'b8860b',
			darkgray: 'a9a9a9',
			darkgreen: '006400',
			darkkhaki: 'bdb76b',
			darkmagenta: '8b008b',
			darkolivegreen: '556b2f',
			darkorange: 'ff8c00',
			darkorchid: '9932cc',
			darkred: '8b0000',
			darksalmon: 'e9967a',
			darkseagreen: '8fbc8f',
			darkslateblue: '483d8b',
			darkslategray: '2f4f4f',
			darkturquoise: '00ced1',
			darkviolet: '9400d3',
			deeppink: 'ff1493',
			deepskyblue: '00bfff',
			dimgray: '696969',
			dodgerblue: '1e90ff',
			feldspar: 'd19275',
			firebrick: 'b22222',
			floralwhite: 'fffaf0',
			forestgreen: '228b22',
			fuchsia: 'ff00ff',
			gainsboro: 'dcdcdc',
			ghostwhite: 'f8f8ff',
			gold: 'ffd700',
			goldenrod: 'daa520',
			gray: '808080',
			green: '008000',
			greenyellow: 'adff2f',
			honeydew: 'f0fff0',
			hotpink: 'ff69b4',
			indianred : 'cd5c5c',
			indigo : '4b0082',
			ivory: 'fffff0',
			khaki: 'f0e68c',
			lavender: 'e6e6fa',
			lavenderblush: 'fff0f5',
			lawngreen: '7cfc00',
			lemonchiffon: 'fffacd',
			lightblue: 'add8e6',
			lightcoral: 'f08080',
			lightcyan: 'e0ffff',
			lightgoldenrodyellow: 'fafad2',
			lightgrey: 'd3d3d3',
			lightgreen: '90ee90',
			lightpink: 'ffb6c1',
			lightsalmon: 'ffa07a',
			lightseagreen: '20b2aa',
			lightskyblue: '87cefa',
			lightslateblue: '8470ff',
			lightslategray: '778899',
			lightsteelblue: 'b0c4de',
			lightyellow: 'ffffe0',
			lime: '00ff00',
			limegreen: '32cd32',
			linen: 'faf0e6',
			magenta: 'ff00ff',
			maroon: '800000',
			mediumaquamarine: '66cdaa',
			mediumblue: '0000cd',
			mediumorchid: 'ba55d3',
			mediumpurple: '9370d8',
			mediumseagreen: '3cb371',
			mediumslateblue: '7b68ee',
			mediumspringgreen: '00fa9a',
			mediumturquoise: '48d1cc',
			mediumvioletred: 'c71585',
			midnightblue: '191970',
			mintcream: 'f5fffa',
			mistyrose: 'ffe4e1',
			moccasin: 'ffe4b5',
			navajowhite: 'ffdead',
			navy: '000080',
			oldlace: 'fdf5e6',
			olive: '808000',
			olivedrab: '6b8e23',
			orange: 'ffa500',
			orangered: 'ff4500',
			orchid: 'da70d6',
			palegoldenrod: 'eee8aa',
			palegreen: '98fb98',
			paleturquoise: 'afeeee',
			palevioletred: 'd87093',
			papayawhip: 'ffefd5',
			peachpuff: 'ffdab9',
			peru: 'cd853f',
			pink: 'ffc0cb',
			plum: 'dda0dd',
			powderblue: 'b0e0e6',
			purple: '800080',
			red: 'ff0000',
			rosybrown: 'bc8f8f',
			royalblue: '4169e1',
			saddlebrown: '8b4513',
			salmon: 'fa8072',
			sandybrown: 'f4a460',
			seagreen: '2e8b57',
			seashell: 'fff5ee',
			sienna: 'a0522d',
			silver: 'c0c0c0',
			skyblue: '87ceeb',
			slateblue: '6a5acd',
			slategray: '708090',
			snow: 'fffafa',
			springgreen: '00ff7f',
			steelblue: '4682b4',
			tan: 'd2b48c',
			teal: '008080',
			thistle: 'd8bfd8',
			tomato: 'ff6347',
			turquoise: '40e0d0',
			violet: 'ee82ee',
			violetred: 'd02090',
			wheat: 'f5deb3',
			white: 'ffffff',
			whitesmoke: 'f5f5f5',
			yellow: 'ffff00',
			yellowgreen: '9acd32'
		};
		for (var key in simple_colors) {
			if (color_string == key) {
				color_string = simple_colors[key];
			}
		}
		// emd of simple type-in colors

		// array of color definition objects
		var color_defs = [
			{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
				example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
				process: function (bits){
					return [
						parseInt(bits[1]),
						parseInt(bits[2]),
						parseInt(bits[3])
					];
				}
			},
			{
				re: /^(\w{2})(\w{2})(\w{2})$/,
				example: ['#00ff00', '336699'],
				process: function (bits){
					return [
						parseInt(bits[1], 16),
						parseInt(bits[2], 16),
						parseInt(bits[3], 16)
					];
				}
			},
			{
				re: /^(\w{1})(\w{1})(\w{1})$/,
				example: ['#fb0', 'f0f'],
				process: function (bits){
					return [
						parseInt(bits[1] + bits[1], 16),
						parseInt(bits[2] + bits[2], 16),
						parseInt(bits[3] + bits[3], 16)
					];
				}
			}
		];

		// search through the definitions to find a match
		for (var i = 0; i < color_defs.length; i++) {
			var re = color_defs[i].re;
			var processor = color_defs[i].process;
			var bits = re.exec(color_string);
			if (bits) {
				channels = processor(bits);
				this.r = channels[0];
				this.g = channels[1];
				this.b = channels[2];
				this.ok = true;
			}

		}

		// validate/cleanup values
		this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
		this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
		this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

		// some getters
		this.toRGB = function () {
			return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
		}
		this.toHex = function () {
			var r = this.r.toString(16);
			var g = this.g.toString(16);
			var b = this.b.toString(16);
			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;
			return '#' + r + g + b;
		}

		// help
		this.getHelpXML = function () {

			var examples = new Array();
			// add regexps
			for (var i = 0; i < color_defs.length; i++) {
				var example = color_defs[i].example;
				for (var j = 0; j < example.length; j++) {
					examples[examples.length] = example[j];
				}
			}
			// add type-in colors
			for (var sc in simple_colors) {
				examples[examples.length] = sc;
			}

			var xml = document.createElement('ul');
			xml.setAttribute('id', 'rgbcolor-examples');
			for (var i = 0; i < examples.length; i++) {
				try {
					var list_item = document.createElement('li');
					var list_color = new RGBColor(examples[i]);
					var example_div = document.createElement('div');
					example_div.style.cssText =
							'margin: 3px; '
							+ 'border: 1px solid black; '
							+ 'background:' + list_color.toHex() + '; '
							+ 'color:' + list_color.toHex()
					;
					example_div.appendChild(document.createTextNode('test'));
					var list_item_value = document.createTextNode(
						' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
					);
					list_item.appendChild(example_div);
					list_item.appendChild(list_item_value);
					xml.appendChild(list_item);

				} catch(e){}
			}
			return xml;

		}

	}

    // export as AMD...
    if ( typeof define !== 'undefined' && define.amd ) {
        define( function () { return RGBColor; });
    }

    // ...or as browserify
    else if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = RGBColor;
    }

    global.RGBColor = RGBColor;

}( typeof window !== 'undefined' ? window : this ));/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

(function ( global ) {

	var mul_table = [
			512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
			454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
			482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
			437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
			497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
			320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
			446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
			329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
			505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
			399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
			324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
			268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
			451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
			385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
			332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
			289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
			
	   
	var shg_table = [
			 9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
			17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
			19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
			20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
			21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
			22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
			23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
			23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

	function premultiplyAlpha(imageData)
	{
		var pixels = imageData.data;
		var size = imageData.width * imageData.height * 4;
		
		for (var i=0; i<size; i+=4)
		{
			var a = pixels[i+3] / 255;
			pixels[i  ] *= a;
			pixels[i+1] *= a;
			pixels[i+2] *= a;
		}
	}

	function unpremultiplyAlpha(imageData)
	{
		var pixels = imageData.data;
		var size = imageData.width * imageData.height * 4;
		
		for (var i=0; i<size; i+=4)
		{
			var a = pixels[i+3];
			if (a != 0)
			{
				a = 255 / a;
				pixels[i  ] *= a;
				pixels[i+1] *= a;
				pixels[i+2] *= a;
			}
		}
	}

	function stackBlurImage( imageID, canvasID, radius, blurAlphaChannel )
	{
				
		var img = document.getElementById( imageID );
		var w = img.naturalWidth;
		var h = img.naturalHeight;
		   
		var canvas = document.getElementById( canvasID );
		  
		canvas.style.width  = w + "px";
		canvas.style.height = h + "px";
		canvas.width = w;
		canvas.height = h;
		
		var context = canvas.getContext("2d");
		context.clearRect( 0, 0, w, h );
		context.drawImage( img, 0, 0 );

		if ( isNaN(radius) || radius < 1 ) return;
		
		if ( blurAlphaChannel )
			stackBlurCanvasRGBA( canvasID, 0, 0, w, h, radius );
		else 
			stackBlurCanvasRGB( canvasID, 0, 0, w, h, radius );
	}


	function stackBlurCanvasRGBA( id, top_x, top_y, width, height, radius )
	{
		if ( isNaN(radius) || radius < 1 ) return;
		radius |= 0;
		
		var canvas  = document.getElementById( id );
		var context = canvas.getContext("2d");
		var imageData;
		
		try {
		  try {
			imageData = context.getImageData( top_x, top_y, width, height );
		  } catch(e) {
		  
			// NOTE: this part is supposedly only needed if you want to work with local files
			// so it might be okay to remove the whole try/catch block and just use
			// imageData = context.getImageData( top_x, top_y, width, height );
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				imageData = context.getImageData( top_x, top_y, width, height );
			} catch(e) {
				alert("Cannot access local image");
				throw new Error("unable to access local image data: " + e);
				return;
			}
		  }
		} catch(e) {
		  alert("Cannot access image");
		  throw new Error("unable to access image data: " + e);
		}
		
		premultiplyAlpha(imageData);
		
		var pixels = imageData.data;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
		r_out_sum, g_out_sum, b_out_sum, a_out_sum,
		r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
		pr, pg, pb, pa, rbs;
				
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			}
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				pixels[yi+3] = (a_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				a_in_sum += ( stackIn.a = pixels[p+3]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
			   
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				pixels[p+3] = (a_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
			   
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
			   
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		unpremultiplyAlpha(imageData);
		
		context.putImageData( imageData, top_x, top_y );
	}


	function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius )
	{
		if ( isNaN(radius) || radius < 1 ) return;
		radius |= 0;
		
		var canvas  = document.getElementById( id );
		var context = canvas.getContext("2d");
		var imageData;
		
		try {
		  try {
			imageData = context.getImageData( top_x, top_y, width, height );
		  } catch(e) {
		  
			// NOTE: this part is supposedly only needed if you want to work with local files
			// so it might be okay to remove the whole try/catch block and just use
			// imageData = context.getImageData( top_x, top_y, width, height );
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				imageData = context.getImageData( top_x, top_y, width, height );
			} catch(e) {
				alert("Cannot access local image");
				throw new Error("unable to access local image data: " + e);
				return;
			}
		  }
		} catch(e) {
		  alert("Cannot access image");
		  throw new Error("unable to access image data: " + e);
		}
				
		var pixels = imageData.data;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
		r_out_sum, g_out_sum, b_out_sum,
		r_in_sum, g_in_sum, b_in_sum,
		pr, pg, pb, rbs;
				
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		context.putImageData( imageData, top_x, top_y );
		
	}

	function BlurStack()
	{
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	var stackBlur = {
		image: stackBlurImage,
		canvasRGBA: stackBlurCanvasRGBA,
		canvasRGB: stackBlurCanvasRGB
	};

	// export as AMD...
	if ( typeof define !== 'undefined' && define.amd ) {
	    define( function () { return stackBlur; });
	}

	// ...or as browserify
	else if ( typeof module !== 'undefined' && module.exports ) {
	    module.exports = stackBlur;
	}

	global.stackBlur = stackBlur;

}( typeof window !== 'undefined' ? window : this ));/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
 (function ( global, factory ) {

	'use strict';

	// export as AMD...
	if ( typeof define !== 'undefined' && define.amd ) {
		define('canvgModule', [ 'rgbcolor', 'stackblur' ], factory );
	}

	// ...or as browserify
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = factory( require( 'rgbcolor' ), require( 'stackblur' ) );
	}

	global.canvg = factory( global.RGBColor, global.stackBlur );

}( typeof window !== 'undefined' ? window : this, function ( RGBColor, stackBlur ) {
 
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	var canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.querySelectorAll('svg');
			for (var i=0; i<svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}

		if (typeof target == 'string') {
			target = document.getElementById(target);
		}

		// store class on canvas
		if (target.svg != null) target.svg.stop();
		var svg = build(opts || {});
		// on i.e. 8 for flash canvas, we can't assign the property so check for it
		if (!(target.childNodes.length == 1 && target.childNodes[0].nodeName == 'OBJECT')) target.svg = svg;

		var ctx = target.getContext('2d');
		if (typeof(s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0,1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	// see https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
	var matchesSelector;
	if (typeof(Element.prototype.matches) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.matches(selector);
		};
	} else if (typeof(Element.prototype.webkitMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.webkitMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.mozMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.mozMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.msMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.msMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.oMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.oMatchesSelector(selector);
		};
	} else {
		// requires Sizzle: https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
		// or jQuery: http://jquery.com/download/
		// or Zepto: http://zeptojs.com/#
		// without it, this is a ReferenceError

		if (typeof jQuery === 'function' || typeof Zepto === 'function') {
			matchesSelector = function (node, selector) {
				return $(node).is(selector);
			};
		}

		if (typeof matchesSelector === 'undefined') {
			matchesSelector = Sizzle.matchesSelector;
		}
	}

	// slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
	var attributeRegex = /(\[[^\]]+\])/g;
	var idRegex = /(#[^\s\+>~\.\[:]+)/g;
	var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
	var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
	var pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi;
	var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
	var elementRegex = /([^\s\+>~\.\[:]+)/g;
	function getSelectorSpecificity(selector) {
		var typeCount = [0, 0, 0];
		var findMatch = function(regex, type) {
			var matches = selector.match(regex);
			if (matches == null) {
				return;
			}
			typeCount[type] += matches.length;
			selector = selector.replace(regex, ' ');
		};

		selector = selector.replace(/:not\(([^\)]*)\)/g, '     $1 ');
		selector = selector.replace(/{[^]*/gm, ' ');
		findMatch(attributeRegex, 1);
		findMatch(idRegex, 0);
		findMatch(classRegex, 1);
		findMatch(pseudoElementRegex, 2);
		findMatch(pseudoClassWithBracketsRegex, 1);
		findMatch(pseudoClassRegex, 1);
		selector = selector.replace(/[\*\s\+>~]/g, ' ');
		selector = selector.replace(/[#\.]/g, ' ');
		findMatch(elementRegex, 2);
		return typeCount.join('');
	}

	function build(opts) {
		var svg = { opts: opts };

		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;

		svg.log = function(msg) {};
		if (svg.opts['log'] == true && typeof(console) != 'undefined') {
			svg.log = function(msg) { console.log(msg); };
		};

		// globals
		svg.init = function(ctx) {
			var uniqueId = 0;
			svg.UniqueId = function () { uniqueId++; return 'canvg' + uniqueId;	};
			svg.Definitions = {};
			svg.Styles = {};
			svg.StylesSpecificity = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function() { this.viewPorts = []; }
				this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function() { this.viewPorts.pop(); }
				this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function() { return this.Current().width; }
				this.height = function() { return this.Current().height; }
				this.ComputeSize = function(d) {
					if (d != null && typeof(d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
				}
			});
		}
		svg.init();

		// images loaded
		svg.ImagesLoaded = function() {
			for (var i=0; i<svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }

		// compress spaces
		svg.compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }

		// ajax
		svg.ajax = function(url) {
			var AJAX;
			if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
			else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
			if(AJAX){
			   AJAX.open('GET',url,false);
			   AJAX.send(null);
			   return AJAX.responseText;
			}
			return null;
		}

		// parse xml
		svg.parseXml = function(xml) {
			if (typeof(Windows) != 'undefined' && typeof(Windows.Data) != 'undefined' && typeof(Windows.Data.Xml) != 'undefined') {
				var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
				var settings = new Windows.Data.Xml.Dom.XmlLoadSettings();
				settings.prohibitDtd = false;
				xmlDoc.loadXml(xml, settings);
				return xmlDoc;
			}
			else if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else
			{
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml);
				return xmlDoc;
			}
		}

		svg.Property = function(name, value) {
			this.name = name;
			this.value = value;
		}
			svg.Property.prototype.getValue = function() {
				return this.value;
			}

			svg.Property.prototype.hasValue = function() {
				return (this.value != null && this.value !== '');
			}

			// return the numerical value of the property
			svg.Property.prototype.numValue = function() {
				if (!this.hasValue()) return 0;

				var n = parseFloat(this.value);
				if ((this.value + '').match(/%$/)) {
					n = n / 100.0;
				}
				return n;
			}

			svg.Property.prototype.valueOrDefault = function(def) {
				if (this.hasValue()) return this.value;
				return def;
			}

			svg.Property.prototype.numValueOrDefault = function(def) {
				if (this.hasValue()) return this.numValue();
				return def;
			}

			// color extensions
				// augment the current color value with the opacity
				svg.Property.prototype.addOpacity = function(opacityProp) {
					var newValue = this.value;
					if (opacityProp.value != null && opacityProp.value != '' && typeof(this.value)=='string') { // can only add opacity to colors, not patterns
						var color = new RGBColor(this.value);
						if (color.ok) {
							newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacityProp.numValue() + ')';
						}
					}
					return new svg.Property(this.name, newValue);
				}

			// definition extensions
				// get the definition from the definitions table
				svg.Property.prototype.getDefinition = function() {
					var name = this.value.match(/#([^\)'"]+)/);
					if (name) { name = name[1]; }
					if (!name) { name = this.value; }
					return svg.Definitions[name];
				}

				svg.Property.prototype.isUrlDefinition = function() {
					return this.value.indexOf('url(') == 0
				}

				svg.Property.prototype.getFillStyleDefinition = function(e, opacityProp) {
					var def = this.getDefinition();

					// gradient
					if (def != null && def.createGradient) {
						return def.createGradient(svg.ctx, e, opacityProp);
					}

					// pattern
					if (def != null && def.createPattern) {
						if (def.getHrefAttribute().hasValue()) {
							var pt = def.attribute('patternTransform');
							def = def.getHrefAttribute().getDefinition();
							if (pt.hasValue()) { def.attribute('patternTransform', true).value = pt.value; }
						}
						return def.createPattern(svg.ctx, e);
					}

					return null;
				}

			// length extensions
				svg.Property.prototype.getDPI = function(viewPort) {
					return 96.0; // TODO: compute?
				}

				svg.Property.prototype.getEM = function(viewPort) {
					var em = 12;

					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

					return em;
				}

				svg.Property.prototype.getUnits = function() {
					var s = this.value+'';
					return s.replace(/[0-9\.\-]/g,'');
				}

				// get the length as pixels
				svg.Property.prototype.toPixels = function(viewPort, processPercent) {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
					if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
					if (s.match(/px$/)) return this.numValue();
					if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
					if (s.match(/pc$/)) return this.numValue() * 15;
					if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
					if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
					if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
					if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
					var n = this.numValue();
					if (processPercent && n < 1.0) return n * svg.ViewPort.ComputeSize(viewPort);
					return n;
				}

			// time extensions
				// get the time as milliseconds
				svg.Property.prototype.toMilliseconds = function() {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/s$/)) return this.numValue() * 1000;
					if (s.match(/ms$/)) return this.numValue();
					return this.numValue();
				}

			// angle extensions
				// get the angle as radians
				svg.Property.prototype.toRadians = function() {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
					if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
					if (s.match(/rad$/)) return this.numValue();
					return this.numValue() * (Math.PI / 180.0);
				}

			// text extensions
				// get the text baseline
				var textBaselineMapping = {
					'baseline': 'alphabetic',
					'before-edge': 'top',
					'text-before-edge': 'top',
					'middle': 'middle',
					'central': 'middle',
					'after-edge': 'bottom',
					'text-after-edge': 'bottom',
					'ideographic': 'ideographic',
					'alphabetic': 'alphabetic',
					'hanging': 'hanging',
					'mathematical': 'alphabetic'
				};
				svg.Property.prototype.toTextBaseline = function () {
					if (!this.hasValue()) return null;
					return textBaselineMapping[this.value];
				}

		// fonts
		svg.Font = new (function() {
			this.Styles = 'normal|italic|oblique|inherit';
			this.Variants = 'normal|small-caps|inherit';
			this.Weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

			this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return {
					fontFamily: fontFamily || f.fontFamily,
					fontSize: fontSize || f.fontSize,
					fontStyle: fontStyle || f.fontStyle,
					fontWeight: fontWeight || f.fontWeight,
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') }
				}
			}

			var that = this;
			this.Parse = function(s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i=0; i<d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});

		// points and paths
		svg.ToNumberArray = function(s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}
		svg.Point = function(x, y) {
			this.x = x;
			this.y = y;
		}
			svg.Point.prototype.angleTo = function(p) {
				return Math.atan2(p.y - this.y, p.x - this.x);
			}

			svg.Point.prototype.applyTransform = function(v) {
				var xp = this.x * v[0] + this.y * v[2] + v[4];
				var yp = this.x * v[1] + this.y * v[3] + v[5];
				this.x = xp;
				this.y = yp;
			}

		svg.CreatePoint = function(s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function(s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i=0; i<a.length; i+=2) {
				path.push(new svg.Point(a[i], a[i+1]));
			}
			return path;
		}

		// bounding box
		svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;

			this.x = function() { return this.x1; }
			this.y = function() { return this.y1; }
			this.width = function() { return this.x2 - this.x1; }
			this.height = function() { return this.y2 - this.y1; }

			this.addPoint = function(x, y) {
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}

				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}
			this.addX = function(x) { this.addPoint(x, null); }
			this.addY = function(y) { this.addPoint(null, y); }

			this.addBoundingBox = function(bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}

			this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
			}

			this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);

				for (i=0; i<=1; i++) {
					var f = function(t) {
						return Math.pow(1-t, 3) * p0[i]
						+ 3 * Math.pow(1-t, 2) * t * p1[i]
						+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
						+ Math.pow(t, 3) * p3[i];
					}

					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];

					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}

					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}

			this.isPointInBox = function(x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}

			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}

		// transforms
		svg.Transform = function(v) {
			var that = this;
			this.Type = {}

			// translate
			this.Type.translate = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.unapply = function(ctx) {
					ctx.translate(-1.0 * this.p.x || 0.0, -1.0 * this.p.y || 0.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}

			// rotate
			this.Type.rotate = function(s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.unapply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(-1.0 * this.angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function(p) {
					var a = this.angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}
			}

			this.Type.scale = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.unapply = function(ctx) {
					ctx.scale(1.0 / this.p.x || 1.0, 1.0 / this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}
			}

			this.Type.matrix = function(s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function(ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.unapply = function(ctx) {
					var a = this.m[0];
					var b = this.m[2];
					var c = this.m[4];
					var d = this.m[1];
					var e = this.m[3];
					var f = this.m[5];
					var g = 0.0;
					var h = 0.0;
					var i = 1.0;
					var det = 1 / (a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g));
					ctx.transform(
						det*(e*i-f*h),
						det*(f*g-d*i),
						det*(c*h-b*i),
						det*(a*i-c*g),
						det*(b*f-c*e),
						det*(c*d-a*f)
					);
				}
				this.applyToPoint = function(p) {
					p.applyTransform(this.m);
				}
			}

			this.Type.SkewBase = function(s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;

			this.Type.skewX = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;

			this.Type.skewY = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;

			this.transforms = [];

			this.apply = function(ctx) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}

			this.unapply = function(ctx) {
				for (var i=this.transforms.length-1; i>=0; i--) {
					this.transforms[i].unapply(ctx);
				}
			}

			this.applyToPoint = function(p) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}

			var data = svg.trim(svg.compressSpaces(v)).replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g,') ').split(/\s(?=[a-z])/);
			for (var i=0; i<data.length; i++) {
				var type = svg.trim(data[i].split('(')[0]);
				var s = data[i].split('(')[1].replace(')','');
				var transform = new this.Type[type](s);
				transform.type = type;
				this.transforms.push(transform);
			}
		}

		// aspect ratio
		svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }

			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {
				ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
			}
			else {
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0);
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight);
			}

			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin);
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax);

			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
		}

		// elements
		svg.Element = {}

		svg.EmptyProperty = new svg.Property('EMPTY', '');

		svg.Element.ElementBase = function(node) {
			this.attributes = {};
			this.styles = {};
			this.stylesSpecificity = {};
			this.children = [];

			// get or create attribute
			this.attribute = function(name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;

				if (createIfNotExists == true) { a = new svg.Property(name, ''); this.attributes[name] = a; }
				return a || svg.EmptyProperty;
			}

			this.getHrefAttribute = function() {
				for (var a in this.attributes) {
					if (a == 'href' || a.match(/:href$/)) {
						return this.attributes[a];
					}
				}
				return svg.EmptyProperty;
			}

			// get or create style, crawls up node tree
			this.style = function(name, createIfNotExists, skipAncestors) {
				var s = this.styles[name];
				if (s != null) return s;

				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					this.styles[name] = a; // move up to me to cache
					return a;
				}

				if (skipAncestors != true) {
					var p = this.parent;
					if (p != null) {
						var ps = p.style(name);
						if (ps != null && ps.hasValue()) {
							return ps;
						}
					}
				}

				if (createIfNotExists == true) { s = new svg.Property(name, ''); this.styles[name] = s; }
				return s || svg.EmptyProperty;
			}

			// base render
			this.render = function(ctx) {
				// don't render display=none
				if (this.style('display').value == 'none') return;

				// don't render visibility=hidden
				if (this.style('visibility').value == 'hidden') return;

				ctx.save();
				if (this.style('mask').hasValue()) { // mask
					var mask = this.style('mask').getDefinition();
					if (mask != null) mask.apply(ctx, this);
				}
				else if (this.style('filter').hasValue()) { // filter
					var filter = this.style('filter').getDefinition();
					if (filter != null) filter.apply(ctx, this);
				}
				else {
					this.setContext(ctx);
					this.renderChildren(ctx);
					this.clearContext(ctx);
				}
				ctx.restore();
			}

			// base set context
			this.setContext = function(ctx) {
				// OVERRIDE ME!
			}

			// base clear context
			this.clearContext = function(ctx) {
				// OVERRIDE ME!
			}

			// base render children
			this.renderChildren = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}

			this.addChild = function(childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				if (child.type != 'title') { this.children.push(child);	}
			}
			
			this.addStylesFromStyleDefinition = function () {
				// add styles
				for (var selector in svg.Styles) {
					if (selector[0] != '@' && matchesSelector(node, selector)) {
						var styles = svg.Styles[selector];
						var specificity = svg.StylesSpecificity[selector];
						if (styles != null) {
							for (var name in styles) {
								var existingSpecificity = this.stylesSpecificity[name];
								if (typeof(existingSpecificity) == 'undefined') {
									existingSpecificity = '000';
								}
								if (specificity > existingSpecificity) {
									this.styles[name] = styles[name];
									this.stylesSpecificity[name] = specificity;
								}
							}
						}
					}
				}
			};

			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add attributes
				for (var i=0; i<node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value);
				}
				
				this.addStylesFromStyleDefinition();

				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i=0; i<styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}

				// add children
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
					if (this.captureTextNodes && (childNode.nodeType == 3 || childNode.nodeType == 4)) {
						var text = childNode.value || childNode.text || childNode.textContent || '';
						if (svg.compressSpaces(text) != '') {
							this.addChild(new svg.Element.tspan(childNode), false); // TEXT_NODE
						}
					}
				}
			}
		}

		svg.Element.RenderedElementBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.setContext = function(ctx) {
				// fill
				if (this.style('fill').isUrlDefinition()) {
					var fs = this.style('fill').getFillStyleDefinition(this, this.style('fill-opacity'));
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (fillStyle.value == 'currentColor') fillStyle.value = this.style('color').value;
					if (fillStyle.value != 'inherit') ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
				if (this.style('fill-opacity').hasValue()) {
					var fillStyle = new svg.Property('fill', ctx.fillStyle);
					fillStyle = fillStyle.addOpacity(this.style('fill-opacity'));
					ctx.fillStyle = fillStyle.value;
				}

				// stroke
				if (this.style('stroke').isUrlDefinition()) {
					var fs = this.style('stroke').getFillStyleDefinition(this, this.style('stroke-opacity'));
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (strokeStyle.value == 'currentColor') strokeStyle.value = this.style('color').value;
					if (strokeStyle.value != 'inherit') ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-opacity').hasValue()) {
					var strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
					strokeStyle = strokeStyle.addOpacity(this.style('stroke-opacity'));
					ctx.strokeStyle = strokeStyle.value;
				}
				if (this.style('stroke-width').hasValue()) {
					var newLineWidth = this.style('stroke-width').toPixels();
					ctx.lineWidth = newLineWidth == 0 ? 0.001 : newLineWidth; // browsers don't respect 0
			    }
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;
				if (this.style('stroke-dasharray').hasValue() && this.style('stroke-dasharray').value != 'none') {
					var gaps = svg.ToNumberArray(this.style('stroke-dasharray').value);
					if (typeof(ctx.setLineDash) != 'undefined') { ctx.setLineDash(gaps); }
					else if (typeof(ctx.webkitLineDash) != 'undefined') { ctx.webkitLineDash = gaps; }
					else if (typeof(ctx.mozDash) != 'undefined' && !(gaps.length==1 && gaps[0]==0)) { ctx.mozDash = gaps; }

					var offset = this.style('stroke-dashoffset').numValueOrDefault(1);
					if (typeof(ctx.lineDashOffset) != 'undefined') { ctx.lineDashOffset = offset; }
					else if (typeof(ctx.webkitLineDashOffset) != 'undefined') { ctx.webkitLineDashOffset = offset; }
					else if (typeof(ctx.mozDashOffset) != 'undefined') { ctx.mozDashOffset = offset; }
				}

				// font
				if (typeof(ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont(
						this.style('font-style').value,
						this.style('font-variant').value,
						this.style('font-weight').value,
						this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '',
						this.style('font-family').value).toString();
				}

				// transform
				if (this.style('transform', false, true).hasValue()) {
					var transform = new svg.Transform(this.style('transform', false, true).value);
					transform.apply(ctx);
				}

				// clip
				if (this.style('clip-path', false, true).hasValue()) {
					var clip = this.style('clip-path', false, true).getDefinition();
					if (clip != null) clip.apply(ctx);
				}

				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;

		svg.Element.PathElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.path = function(ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}

			this.renderChildren = function(ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') {
					if (this.style('fill-rule').valueOrDefault('inherit') != 'inherit') { ctx.fill(this.style('fill-rule').value); }
					else { ctx.fill(); }
				}
				if (ctx.strokeStyle != '') ctx.stroke();

				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').isUrlDefinition()) {
						var marker = this.style('marker-start').getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').isUrlDefinition()) {
						var marker = this.style('marker-mid').getDefinition();
						for (var i=1;i<markers.length-1;i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').isUrlDefinition()) {
						var marker = this.style('marker-end').getDefinition();
						marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
					}
				}
			}

			this.getBoundingBox = function() {
				return this.path();
			}

			this.getMarkers = function() {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;

		// svg element
		svg.Element.svg = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseClearContext = this.clearContext;
			this.clearContext = function(ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				// initial values and defaults
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;
				if (typeof(ctx.font) != 'undefined' && typeof(window.getComputedStyle) != 'undefined') {
					ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font');
				}

				this.baseSetContext(ctx);

				// create new view port
				if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
				if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
				ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();

				if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
				if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
				if (typeof(this.root) == 'undefined') {
					width = this.attribute('width').toPixels('x');
					height = this.attribute('height').toPixels('y');

					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').toPixels('x');
						y = -this.attribute('refY').toPixels('y');
					}

					if (this.attribute('overflow').valueOrDefault('hidden') != 'visible') {
						ctx.beginPath();
						ctx.moveTo(x, y);
						ctx.lineTo(width, y);
						ctx.lineTo(width, height);
						ctx.lineTo(x, height);
						ctx.closePath();
						ctx.clip();
					}
				}
				svg.ViewPort.SetCurrent(width, height);

				// viewbox
				if (this.attribute('viewBox').hasValue()) {
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];

					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value,
									svg.ViewPort.width(),
									width,
									svg.ViewPort.height(),
									height,
									minX,
									minY,
									this.attribute('refX').value,
									this.attribute('refY').value);

					svg.ViewPort.RemoveCurrent();
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
				}
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
				rx = Math.min(rx, width / 2.0);
				ry = Math.min(ry, height / 2.0);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}

				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;

		// circle element
		svg.Element.circle = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');
				var r = this.attribute('r').toPixels();

				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;

		// ellipse element
		svg.Element.ellipse = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;

		// line element
		svg.Element.line = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.getPoints = function() {
				return [
					new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')),
					new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
			}

			this.path = function(ctx) {
				var points = this.getPoints();

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}

				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}

			this.getMarkers = function() {
				var points = this.getPoints();
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;

		// polyline element
		svg.Element.polyline = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function(ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i=1; i<this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}

			this.getMarkers = function() {
				var markers = [];
				for (var i=0; i<this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
				}
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
				return markers;
			}
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;

		// polygon element
		svg.Element.polygon = function(node) {
			this.base = svg.Element.polyline;
			this.base(node);

			this.basePath = this.path;
			this.path = function(ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm,' '); // get rid of all commas
			// As the end of a match can also be the start of the next match, we need to run this replace twice.
			for(var i=0; i<2; i++)
				d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // suffix commands with spaces
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // prefix commands with spaces
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits on +- signs
			// Again, we need to run this twice to find all occurances
			for(var i=0; i<2; i++)
				d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when they start with a comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function(d) {
				this.tokens = d.split(' ');

				this.reset = function() {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}

				this.isEnd = function() {
					return this.i >= this.tokens.length - 1;
				}

				this.isCommandOrEnd = function() {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}

				this.isRelativeCommand = function() {
					switch(this.command)
					{
						case 'm':
						case 'l':
						case 'h':
						case 'v':
						case 'c':
						case 's':
						case 'q':
						case 't':
						case 'a':
						case 'z':
							return true;
							break;
					}
					return false;
				}

				this.getToken = function() {
					this.i++;
					return this.tokens[this.i];
				}

				this.getScalar = function() {
					return parseFloat(this.getToken());
				}

				this.nextCommand = function() {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}

				this.getPoint = function() {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}

				this.getAsControlPoint = function() {
					var p = this.getPoint();
					this.control = p;
					return p;
				}

				this.getAsCurrentPoint = function() {
					var p = this.getPoint();
					this.current = p;
					return p;
				}

				this.getReflectedControlPoint = function() {
					if (this.previousCommand.toLowerCase() != 'c' &&
					    this.previousCommand.toLowerCase() != 's' &&
						this.previousCommand.toLowerCase() != 'q' &&
						this.previousCommand.toLowerCase() != 't' ){
						return this.current;
					}

					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
					return p;
				}

				this.makeAbsolute = function(p) {
					if (this.isRelativeCommand()) {
						p.x += this.current.x;
						p.y += this.current.y;
					}
					return p;
				}

				this.addMarker = function(p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
						this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}

				this.addMarkerAngle = function(p, a) {
					this.points.push(p);
					this.angles.push(a);
				}

				this.getMarkerPoints = function() { return this.points; }
				this.getMarkerAngles = function() {
					for (var i=0; i<this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j=i+1; j<this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function(ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command) {
					case 'M':
					case 'm':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
					case 'l':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
					case 'h':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
					case 'v':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
					case 'c':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
					case 's':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
					case 'q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
					case 't':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
					case 'a':
						while (!pp.isCommandOrEnd()) {
						    var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(
								Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
								-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
							);
							// adjust radii
							var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
								(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
							);
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point(
								(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
								(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
							);
							// vector magnitude
							var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
							// ratio between two vectors
							var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
							// angle between two vectors
							var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
							// initial angle
							var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
							// angle delta
							var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
							var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
							var ad = a(u, v);
							if (r(u,v) <= -1) ad = Math.PI;
							if (r(u,v) >= 1) ad = 0;

							// for markers
							var dir = 1 - sweepFlag ? 1.0 : -1.0;
							var ah = a1 + dir * (ad / 2.0);
							var halfWay = new svg.Point(
								centp.x + rx * Math.cos(ah),
								centp.y + ry * Math.sin(ah)
							);
							pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
							pp.addMarkerAngle(cp, ah - dir * Math.PI);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1/sx, 1/sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
					case 'z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function() {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();

				var markers = [];
				for (var i=0; i<points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;

		// pattern element
		svg.Element.pattern = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.createPattern = function(ctx, element) {
				var width = this.attribute('width').toPixels('x', true);
				var height = this.attribute('height').toPixels('y', true);

				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['width'] = new svg.Property('width', width + 'px');
				tempSvg.attributes['height'] = new svg.Property('height', height + 'px');
				tempSvg.attributes['transform'] = new svg.Property('transform', this.attribute('patternTransform').value);
				tempSvg.children = this.children;

				var c = document.createElement('canvas');
				c.width = width;
				c.height = height;
				var cctx = c.getContext('2d');
				if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
					cctx.translate(this.attribute('x').toPixels('x', true), this.attribute('y').toPixels('y', true));
				}
				// render 3x3 grid so when we transform there's no white space on edges
				for (var x=-1; x<=1; x++) {
					for (var y=-1; y<=1; y++) {
						cctx.save();
						tempSvg.attributes['x'] = new svg.Property('x', x * c.width);
						tempSvg.attributes['y'] = new svg.Property('y', y * c.height);
						tempSvg.render(cctx);
						cctx.restore();
					}
				}
				var pattern = ctx.createPattern(c, 'repeat');
				return pattern;
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;

		// marker element
		svg.Element.marker = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.baseRender = this.render;
			this.render = function(ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();

				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);

				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;

		// definitions element
		svg.Element.defs = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.render = function(ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;

		// base for gradients
		svg.Element.GradientBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.stops = [];
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'stop') this.stops.push(child);
			}

			this.getGradient = function() {
				// OVERRIDE ME!
			}
			
			this.gradientUnits = function () {
				return this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
			}
			
			this.attributesToInherit = ['gradientUnits'];
			
			this.inheritStopContainer = function (stopsContainer) {
				for (var i=0; i<this.attributesToInherit.length; i++) {
					var attributeToInherit = this.attributesToInherit[i];
					if (!this.attribute(attributeToInherit).hasValue() && stopsContainer.attribute(attributeToInherit).hasValue()) {
						this.attribute(attributeToInherit, true).value = stopsContainer.attribute(attributeToInherit).value;
					}
				}
			}

			this.createGradient = function(ctx, element, parentOpacityProp) {
				var stopsContainer = this;
				if (this.getHrefAttribute().hasValue()) {
					stopsContainer = this.getHrefAttribute().getDefinition();
					this.inheritStopContainer(stopsContainer);
				}

				var addParentOpacity = function (color) {
					if (parentOpacityProp.hasValue()) {
						var p = new svg.Property('color', color);
						return p.addOpacity(parentOpacityProp).value;
					}
					return color;
				};

				var g = this.getGradient(ctx, element);
				if (g == null) return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
				for (var i=0; i<stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color));
				}

				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];

					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [ rect ];

					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [ group ];

					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);
					return tempCtx.createPattern(c, 'no-repeat');
				}

				return g;
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;

		// linear gradient element
		svg.Element.linearGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.attributesToInherit.push('x1');
			this.attributesToInherit.push('y1');
			this.attributesToInherit.push('x2');
			this.attributesToInherit.push('y2');

			this.getGradient = function(ctx, element) {
				var bb = this.gradientUnits() == 'objectBoundingBox' ? element.getBoundingBox() : null;

				if (!this.attribute('x1').hasValue()
				 && !this.attribute('y1').hasValue()
				 && !this.attribute('x2').hasValue()
				 && !this.attribute('y2').hasValue()) {
					this.attribute('x1', true).value = 0;
					this.attribute('y1', true).value = 0;
					this.attribute('x2', true).value = 1;
					this.attribute('y2', true).value = 0;
				 }

				var x1 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x1').numValue()
					: this.attribute('x1').toPixels('x'));
				var y1 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').toPixels('y'));
				var x2 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').toPixels('x'));
				var y2 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').toPixels('y'));

				if (x1 == x2 && y1 == y2) return null;
				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;

		// radial gradient element
		svg.Element.radialGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.attributesToInherit.push('cx');
			this.attributesToInherit.push('cy');
			this.attributesToInherit.push('r');
			this.attributesToInherit.push('fx');
			this.attributesToInherit.push('fy');

			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();

				if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
				if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
				if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

				var cx = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('cx').numValue()
					: this.attribute('cx').toPixels('x'));
				var cy = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('cy').numValue()
					: this.attribute('cy').toPixels('y'));

				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('fx').numValue()
					: this.attribute('fx').toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('fy').numValue()
					: this.attribute('fy').toPixels('y'));
				}

				var r = (this.gradientUnits() == 'objectBoundingBox'
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').toPixels());

				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;

		// gradient stop element
		svg.Element.stop = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.offset = this.attribute('offset').numValue();
			if (this.offset < 0) this.offset = 0;
			if (this.offset > 1) this.offset = 1;

			var stopColor = this.style('stop-color', true);
			if (stopColor.value === '') stopColor.value = '#000';
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.addOpacity(this.style('stop-opacity'));
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;

		// animation base element
		svg.Element.AnimateBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			svg.Animations.push(this);

			this.duration = 0.0;
			this.begin = this.attribute('begin').toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').toMilliseconds();

			this.getProperty = function() {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;

				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);
			};

			this.initialValue = null;
			this.initialUnits = '';
			this.removed = false;

			this.calcValue = function() {
				// OVERRIDE ME!
				return '';
			}

			this.update = function(delta) {
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
					this.initialUnits = this.getProperty().getUnits();
				}

				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite'
					 || this.attribute('repeatDur').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'freeze' && !this.frozen) {
						this.frozen = true;
						this.parent.animationFrozen = true;
						this.parent.animationFrozenValue = this.getProperty().value;
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue;
						return true;
					}
					return false;
				}
				this.duration = this.duration + delta;

				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween

					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}

					this.getProperty().value = newValue;
					updated = true;
				}

				return updated;
			}

			this.from = this.attribute('from');
			this.to = this.attribute('to');
			this.values = this.attribute('values');
			if (this.values.hasValue()) this.values.value = this.values.value.split(';');

			// fraction of duration we've covered
			this.progress = function() {
				var ret = { progress: (this.duration - this.begin) / (this.maxDuration - this.begin) };
				if (this.values.hasValue()) {
					var p = ret.progress * (this.values.value.length - 1);
					var lb = Math.floor(p), ub = Math.ceil(p);
					ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
					ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
					ret.progress = (p - lb) / (ub - lb);
				}
				else {
					ret.from = this.from;
					ret.to = this.to;
				}
				return ret;
			}
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;

		// animate element
		svg.Element.animate = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();

				// tween value linearly
				var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
				return newValue + this.initialUnits;
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;

		// animate color element
		svg.Element.animateColor = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();
				var from = new RGBColor(p.from.value);
				var to = new RGBColor(p.to.value);

				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * p.progress;
					var g = from.g + (to.g - from.g) * p.progress;
					var b = from.b + (to.b - from.b) * p.progress;
					return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;

		// animate transform element
		svg.Element.animateTransform = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();

				// tween value linearly
				var from = svg.ToNumberArray(p.from.value);
				var to = svg.ToNumberArray(p.to.value);
				var newValue = '';
				for (var i=0; i<from.length; i++) {
					newValue += from[i] + (to[i] - from[i]) * p.progress + ' ';
				}
				return newValue;
			};
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;

		// font element
		svg.Element.font = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();

			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof(this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;

		// font-face element
		svg.Element.fontface = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;

		// missing-glyph element
		svg.Element.missingglyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;

		// glyph element
		svg.Element.glyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;

		// text element
		svg.Element.text = function(node) {
			this.captureTextNodes = true;
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);

				var textBaseline = this.style('dominant-baseline').toTextBaseline();
				if (textBaseline == null) textBaseline = this.style('alignment-baseline').toTextBaseline();
				if (textBaseline != null) ctx.textBaseline = textBaseline;
			}

			this.getBoundingBox = function () {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				return new svg.BoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
			}

			this.renderChildren = function(ctx) {
				this.x = this.attribute('x').toPixels('x');
				this.y = this.attribute('y').toPixels('y');
				if (this.attribute('dx').hasValue()) this.x += this.attribute('dx').toPixels('x');
				if (this.attribute('dy').hasValue()) this.y += this.attribute('dy').toPixels('y');
				this.x += this.getAnchorDelta(ctx, this, 0);
				for (var i=0; i<this.children.length; i++) {
					this.renderChild(ctx, this, i);
				}
			}

			this.getAnchorDelta = function (ctx, parent, startI) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				if (textAnchor != 'start') {
					var width = 0;
					for (var i=startI; i<parent.children.length; i++) {
						var child = parent.children[i];
						if (i > startI && child.attribute('x').hasValue()) break; // new group
						width += child.measureTextRecursive(ctx);
					}
					return -1 * (textAnchor == 'end' ? width : width / 2.0);
				}
				return 0;
			}

			this.renderChild = function(ctx, parent, i) {
				var child = parent.children[i];
				if (child.attribute('x').hasValue()) {
					child.x = child.attribute('x').toPixels('x') + parent.getAnchorDelta(ctx, parent, i);
					if (child.attribute('dx').hasValue()) child.x += child.attribute('dx').toPixels('x');
				}
				else {
					if (child.attribute('dx').hasValue()) parent.x += child.attribute('dx').toPixels('x');
					child.x = parent.x;
				}
				parent.x = child.x + child.measureText(ctx);

				if (child.attribute('y').hasValue()) {
					child.y = child.attribute('y').toPixels('y');
					if (child.attribute('dy').hasValue()) child.y += child.attribute('dy').toPixels('y');
				}
				else {
					if (child.attribute('dy').hasValue()) parent.y += child.attribute('dy').toPixels('y');
					child.y = parent.y;
				}
				parent.y = child.y;

				child.render(ctx);

				for (var i=0; i<child.children.length; i++) {
					parent.renderChild(ctx, child, i);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;

		// text base
		svg.Element.TextElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getGlyph = function(font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal';
					if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
					if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
					if (typeof(font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}

			this.renderChildren = function(ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");

					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1/scale, -1/scale);
						ctx.translate(-this.x, -this.y);

						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}

				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
			}

			this.getText = function() {
				// OVERRIDE ME
			}

			this.measureTextRecursive = function(ctx) {
				var width = this.measureText(ctx);
				for (var i=0; i<this.children.length; i++) {
					width += this.children[i].measureTextRecursive(ctx);
				}
				return width;
			}

			this.measureText = function(ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}

				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;

				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;

		// tspan
		svg.Element.tspan = function(node) {
			this.captureTextNodes = true;
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.text = svg.compressSpaces(node.value || node.text || node.textContent || '');
			this.getText = function() {
				// if this node has children, then they own the text
				if (this.children.length > 0) { return ''; }
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;

		// tref
		svg.Element.tref = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.getText = function() {
				var element = this.getHrefAttribute().getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;

		// a element
		svg.Element.a = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.hasText = node.childNodes.length > 0;
			for (var i=0; i<node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}

			// this might contain text
			this.text = this.hasText ? node.childNodes[0].value : '';
			this.getText = function() {
				return this.text;
			}

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function(ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
				}
				else if (this.children.length > 0) {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}

			this.onclick = function() {
				window.open(this.getHrefAttribute().value);
			}

			this.onmousemove = function() {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;

		// image element
		svg.Element.image = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			var href = this.getHrefAttribute().value;
			if (href == '') { return; }
			var isSvg = href.match(/\.svg$/)

			svg.Images.push(this);
			this.loaded = false;
			if (!isSvg) {
				this.img = document.createElement('img');
				if (svg.opts['useCORS'] == true) { this.img.crossOrigin = 'Anonymous'; }
				var self = this;
				this.img.onload = function() { self.loaded = true; }
				this.img.onerror = function() { svg.log('ERROR: image "' + href + '" not found'); self.loaded = true; }
				this.img.src = href;
			}
			else {
				this.img = svg.ajax(href);
				this.loaded = true;
			}

			this.renderChildren = function(ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');

				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				if (width == 0 || height == 0) return;

				ctx.save();
				if (isSvg) {
					ctx.drawSvg(this.img, x, y, width, height);
				}
				else {
					ctx.translate(x, y);
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value,
									width,
									this.img.width,
									height,
									this.img.height,
									0,
									0);
					ctx.drawImage(this.img, 0, 0);
				}
				ctx.restore();
			}

			this.getBoundingBox = function() {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;

		// group element
		svg.Element.g = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getBoundingBox = function() {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.render = function(ctx) {
				// NO RENDER
			};
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;

		// style element
		svg.Element.style = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			// text, or spaces then CDATA
			var css = ''
			for (var i=0; i<node.childNodes.length; i++) {
			  css += node.childNodes[i].data;
			}
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i=0; i<cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j=0; j<cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = svg.Styles[cssClass] || {};
							for (var k=0; k<cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							svg.StylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g,'');
								var srcs = props['src'].value.split(',');
								for (var s=0; s<srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f=0; f<fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;

		// use element
		svg.Element.use = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
			}

			var element = this.getHrefAttribute().getDefinition();

			this.path = function(ctx) {
				if (element != null) element.path(ctx);
			}

			this.getBoundingBox = function() {
				if (element != null) return element.getBoundingBox();
			}

			this.renderChildren = function(ctx) {
				if (element != null) {
					var tempSvg = element;
					if (element.type == 'symbol') {
						// render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
						tempSvg = new svg.Element.svg();
						tempSvg.type = 'svg';
						tempSvg.attributes['viewBox'] = new svg.Property('viewBox', element.attribute('viewBox').value);
						tempSvg.attributes['preserveAspectRatio'] = new svg.Property('preserveAspectRatio', element.attribute('preserveAspectRatio').value);
						tempSvg.attributes['overflow'] = new svg.Property('overflow', element.attribute('overflow').value);
						tempSvg.children = element.children;
					}
					if (tempSvg.type == 'svg') {
						// if symbol or svg, inherit width/height from me
						if (this.attribute('width').hasValue()) tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
						if (this.attribute('height').hasValue()) tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
					}
					var oldParent = tempSvg.parent;
					tempSvg.parent = null;
					tempSvg.render(ctx);
					tempSvg.parent = oldParent;
				}
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;

		// mask element
		svg.Element.mask = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, element) {
				// render as temp svg
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');

				if (width == 0 && height == 0) {
					var bb = new svg.BoundingBox();
					for (var i=0; i<this.children.length; i++) {
						bb.addBoundingBox(this.children[i].getBoundingBox());
					}
					var x = Math.floor(bb.x1);
					var y = Math.floor(bb.y1);
					var width = Math.floor(bb.width());
					var	height = Math.floor(bb.height());
				}

				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';

					var cMask = document.createElement('canvas');
					cMask.width = x + width;
					cMask.height = y + height;
					var maskCtx = cMask.getContext('2d');
					this.renderChildren(maskCtx);

					var c = document.createElement('canvas');
					c.width = x + width;
					c.height = y + height;
					var tempCtx = c.getContext('2d');
					element.render(tempCtx);
					tempCtx.globalCompositeOperation = 'destination-in';
					tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
					tempCtx.fillRect(0, 0, x + width, y + height);

					ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
					ctx.fillRect(0, 0, x + width, y + height);

				// reassign mask
				element.attribute('mask').value = mask;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;

		// clip element
		svg.Element.clipPath = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx) {
				var oldBeginPath = CanvasRenderingContext2D.prototype.beginPath;
				CanvasRenderingContext2D.prototype.beginPath = function () { };

				var oldClosePath = CanvasRenderingContext2D.prototype.closePath;
				CanvasRenderingContext2D.prototype.closePath = function () { };

				oldBeginPath.call(ctx);
				for (var i=0; i<this.children.length; i++) {
					var child = this.children[i];
					if (typeof(child.path) != 'undefined') {
						var transform = null;
						if (child.style('transform', false, true).hasValue()) {
							transform = new svg.Transform(child.style('transform', false, true).value);
							transform.apply(ctx);
						}
						child.path(ctx);
						CanvasRenderingContext2D.prototype.closePath = oldClosePath;
						if (transform) { transform.unapply(ctx); }
					}
				}
				oldClosePath.call(ctx);
				ctx.clip();

				CanvasRenderingContext2D.prototype.beginPath = oldBeginPath;
				CanvasRenderingContext2D.prototype.closePath = oldClosePath;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, element) {
				// render as temp svg
				var bb = element.getBoundingBox();
				var x = Math.floor(bb.x1);
				var y = Math.floor(bb.y1);
				var width = Math.floor(bb.width());
				var	height = Math.floor(bb.height());

				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';

				var px = 0, py = 0;
				for (var i=0; i<this.children.length; i++) {
					var efd = this.children[i].extraFilterDistance || 0;
					px = Math.max(px, efd);
					py = Math.max(py, efd);
				}

				var c = document.createElement('canvas');
				c.width = width + 2*px;
				c.height = height + 2*py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);

				// apply filters
				for (var i=0; i<this.children.length; i++) {
					if (typeof(this.children[i].apply) === 'function') {
						this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
					}
				}

				// render on me
				ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);

				// reassign filter
				element.style('filter', true).value = filter;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;

		svg.Element.feMorphology = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, x, y, width, height) {
				// TODO: implement
			}
		}
		svg.Element.feMorphology.prototype = new svg.Element.ElementBase;

		svg.Element.feComposite = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, x, y, width, height) {
				// TODO: implement
			}
		}
		svg.Element.feComposite.prototype = new svg.Element.ElementBase;

		svg.Element.feColorMatrix = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			var matrix = svg.ToNumberArray(this.attribute('values').value);
			switch (this.attribute('type').valueOrDefault('matrix')) { // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
				case 'saturate':
					var s = matrix[0];
					matrix = [0.213+0.787*s,0.715-0.715*s,0.072-0.072*s,0,0,
							  0.213-0.213*s,0.715+0.285*s,0.072-0.072*s,0,0,
							  0.213-0.213*s,0.715-0.715*s,0.072+0.928*s,0,0,
							  0,0,0,1,0,
							  0,0,0,0,1];
					break;
				case 'hueRotate':
					var a = matrix[0] * Math.PI / 180.0;
					var c = function (m1,m2,m3) { return m1 + Math.cos(a)*m2 + Math.sin(a)*m3; };
					matrix = [c(0.213,0.787,-0.213),c(0.715,-0.715,-0.715),c(0.072,-0.072,0.928),0,0,
							  c(0.213,-0.213,0.143),c(0.715,0.285,0.140),c(0.072,-0.072,-0.283),0,0,
							  c(0.213,-0.213,-0.787),c(0.715,-0.715,0.715),c(0.072,0.928,0.072),0,0,
							  0,0,0,1,0,
							  0,0,0,0,1];
					break;
				case 'luminanceToAlpha':
					matrix = [0,0,0,0,0,
							  0,0,0,0,0,
							  0,0,0,0,0,
							  0.2125,0.7154,0.0721,0,0,
							  0,0,0,0,1];
					break;
			}

			function imGet(img, x, y, width, height, rgba) {
				return img[y*width*4 + x*4 + rgba];
			}

			function imSet(img, x, y, width, height, rgba, val) {
				img[y*width*4 + x*4 + rgba] = val;
			}

			function m(i, v) {
				var mi = matrix[i];
				return mi * (mi < 0 ? v - 255 : v);
			}

			this.apply = function(ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				var srcData = ctx.getImageData(0, 0, width, height);
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
						var r = imGet(srcData.data, x, y, width, height, 0);
						var g = imGet(srcData.data, x, y, width, height, 1);
						var b = imGet(srcData.data, x, y, width, height, 2);
						var a = imGet(srcData.data, x, y, width, height, 3);
						imSet(srcData.data, x, y, width, height, 0, m(0,r)+m(1,g)+m(2,b)+m(3,a)+m(4,1));
						imSet(srcData.data, x, y, width, height, 1, m(5,r)+m(6,g)+m(7,b)+m(8,a)+m(9,1));
						imSet(srcData.data, x, y, width, height, 2, m(10,r)+m(11,g)+m(12,b)+m(13,a)+m(14,1));
						imSet(srcData.data, x, y, width, height, 3, m(15,r)+m(16,g)+m(17,b)+m(18,a)+m(19,1));
					}
				}
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}
		}
		svg.Element.feColorMatrix.prototype = new svg.Element.ElementBase;

		svg.Element.feGaussianBlur = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.blurRadius = Math.floor(this.attribute('stdDeviation').numValue());
			this.extraFilterDistance = this.blurRadius;

			this.apply = function(ctx, x, y, width, height) {
				if (typeof(stackBlur.canvasRGBA) == 'undefined') {
					svg.log('ERROR: StackBlur.js must be included for blur to work');
					return;
				}

				// StackBlur requires canvas be on document
				ctx.canvas.id = svg.UniqueId();
				ctx.canvas.style.display = 'none';
				document.body.appendChild(ctx.canvas);
				stackBlur.canvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
				document.body.removeChild(ctx.canvas);
			}
		}
		svg.Element.feGaussianBlur.prototype = new svg.Element.ElementBase;

		// title element, do nothing
		svg.Element.title = function(node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function(node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;

		svg.Element.MISSING = function(node) {
			svg.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;

		// element factory
		svg.CreateElement = function(node) {
			var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
			className = className.replace(/\-/g,''); // remove dashes
			var e = null;
			if (typeof(svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}

		// load from url
		svg.load = function(ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}

		// load from xml
		svg.loadXml = function(ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}

		svg.loadXmlDoc = function(ctx, dom) {
			svg.init(ctx);

			var mapXY = function(p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}

			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}

			var e = svg.CreateElement(dom.documentElement);
			e.root = true;
			e.addStylesFromStyleDefinition();

			// render loop
			var isFirstRender = true;
			var draw = function() {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);

				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				if (svg.opts['ignoreDimensions'] == true && e.style('width').hasValue() && e.style('height').hasValue()) {
					cWidth = e.style('width').toPixels('x');
					cHeight = e.style('height').toPixels('y');
				}
				svg.ViewPort.SetCurrent(cWidth, cHeight);

				if (svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts['scaleWidth'] != null || svg.opts['scaleHeight'] != null) {
					var xRatio = null, yRatio = null, viewBox = svg.ToNumberArray(e.attribute('viewBox').value);

					if (svg.opts['scaleWidth'] != null) {
						if (e.attribute('width').hasValue()) xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth'];
						else if (!isNaN(viewBox[2])) xRatio = viewBox[2] / svg.opts['scaleWidth'];
					}

					if (svg.opts['scaleHeight'] != null) {
						if (e.attribute('height').hasValue()) yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight'];
						else if (!isNaN(viewBox[3])) yRatio = viewBox[3] / svg.opts['scaleHeight'];
					}

					if (xRatio == null) { xRatio = yRatio; }
					if (yRatio == null) { yRatio = xRatio; }

					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];
					e.style('transform', true, true).value += ' scale('+(1.0/xRatio)+','+(1.0/yRatio)+')';
				}

				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (typeof(svg.opts['renderCallback']) == 'function') svg.opts['renderCallback'](dom);
				}
			}

			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function() {
				var needUpdate = false;

				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}

				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}

				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i=0; i<svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}

				// need update from redraw?
				if (typeof(svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}

				// render if needed
				if (needUpdate) {
					draw();
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}

		svg.stop = function() {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}

		svg.Mouse = new (function() {
			this.events = [];
			this.hasEvents = function() { return this.events.length != 0; }

			this.onclick = function(x, y) {
				this.events.push({ type: 'onclick', x: x, y: y,
					run: function(e) { if (e.onclick) e.onclick(); }
				});
			}

			this.onmousemove = function(x, y) {
				this.events.push({ type: 'onmousemove', x: x, y: y,
					run: function(e) { if (e.onmousemove) e.onmousemove(); }
				});
			}

			this.eventElements = [];

			this.checkPath = function(element, ctx) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.checkBoundingBox = function(element, bb) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.runEvents = function() {
				svg.ctx.canvas.style.cursor = '';

				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}

				// done running, clear
				this.events = [];
				this.eventElements = [];
			}
		});

		return svg;
	};

	if (typeof(CanvasRenderingContext2D) != 'undefined') {
		CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
			canvg(this.canvas, s, {
				ignoreMouse: true,
				ignoreAnimation: true,
				ignoreDimensions: true,
				ignoreClear: true,
				offsetX: dx,
				offsetY: dy,
				scaleWidth: dw,
				scaleHeight: dh
			});
		}
	}

	return canvg;

}));
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));
/*! https://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));
// Generated by LiveScript 1.3.1
var plotdb;
plotdb = {};
import$(plotdb, {
  Order: {
    'default': function(k, v, i){
      return i;
    },
    name: 'Order',
    test: function(){
      [plotdb.Number, plotdb.Date, plotdb.Numstring];
      return true;
    },
    parse: function(it){
      return it;
    },
    sort: function(a, b){
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  Number: {
    'default': 0,
    name: 'Number',
    test: function(it){
      return !isNaN(+it);
    },
    level: 3,
    parse: function(it){
      return parseFloat(it);
    }
  },
  Numstring: {
    'default': "",
    name: 'Numstring',
    test: function(it){
      return /\d+/.exec(it + "");
    },
    parse: function(it){
      return it;
    }
  },
  String: {
    'default': "",
    name: 'String',
    test: function(){
      return true;
    },
    level: 1,
    parse: function(it){
      return it;
    }
  },
  Date: {
    'default': '1970/1/1',
    name: 'Date',
    level: 2,
    match: {
      type1: /^(\d{4})[/-](\d{1,2})[/-]\d{1,2} ((\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?/,
      type2: /^(\d{1,2})[/-](\d{1,2})[/-]\d{4} ((\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?/,
      type3: /^(\d{4})[/-](\d{1,2})$/,
      type4: /^(\d{1,2})[/-](\d{4})$/
    },
    test: function(it){
      var d, matched, k, v;
      d = new Date(it);
      if (!(d instanceof Date) || isNaN(d.getTime())) {
        matched = (function(){
          var ref$, results$ = [];
          for (k in ref$ = this.match) {
            v = ref$[k];
            results$.push(v.exec(it));
          }
          return results$;
        }.call(this)).filter(function(it){
          return it;
        })[0];
        if (!matched) {
          return false;
        }
      }
      return true;
    },
    parse: function(it){
      var d, matched, k, v;
      d = new Date(it);
      if (!(d instanceof Date) || isNaN(d.getTime())) {
        matched = (function(){
          var ref$, results$ = [];
          for (k in ref$ = this.match) {
            v = ref$[k];
            results$.push(v.exec(it));
          }
          return results$;
        }.call(this)).filter(function(it){
          return it;
        })[0];
        if (!matched) {
          return null;
        }
        return null;
      }
      return d;
    }
  },
  Choice: function(v){
    return {
      'default': "",
      name: 'Choice',
      level: 4,
      test: function(it){
        return v && v.length && in$(it, v);
      },
      values: v
    };
  },
  Percent: {
    name: 'Percent',
    level: 3,
    test: function(it){
      return !!/[0-9.]+%/.exec(it);
    }
  },
  Color: {
    name: 'Color',
    level: 4,
    test: function(it){
      return !/(rgba?|hsla?)\([0-9.,]+\)|#[0-9a-f]{3,6}|[a-z0-9]+/.exec(it.trim());
    },
    'default': '#dc4521',
    Gray: '#cccccc',
    Positive: '#3f7ab5',
    Negative: '#d93510',
    Neutral: '#777777',
    subtype: {
      negative: "negative",
      positive: "positive",
      neutral: "neutral"
    }
  },
  Palette: {
    name: 'Palette',
    level: 5,
    re: /^((rgb|hsl)\((\s*[0-9.]+\s*,){2}\s*[0-9.]+\s*\)|(rgb|hsl)a\((\s*[0-9.]+\s*,){3}\s*[0-9.]+\s*\)|\#[0-9a-f]{3}|\#[0-9a-f]{6}|[a-zA-Z][a-zA-Z0-9]*)$/,
    test: function(it){
      var e, this$ = this;
      if (!it) {
        return true;
      }
      if (typeof it === typeof "") {
        if (it.charAt(0) !== '[') {
          it = it.split(',');
        } else {
          try {
            it = JSON.parse(it);
          } catch (e$) {
            e = e$;
            return false;
          }
        }
      } else if (Array.isArray(it)) {
        return !it.filter(function(it){
          return !this$.re.exec(it.trim());
        }).length ? true : false;
      } else if (typeof it === 'object') {
        if (!(it.colors != null)) {
          return true;
        }
        if (it.colors.filter(function(it){
          return !it.hex;
        }).length) {
          return true;
        }
      }
      return false;
    },
    parse: function(it){
      var e;
      if (!it) {
        return it;
      }
      if (Array.isArray(it)) {
        return it;
      }
      if (typeof it === typeof "") {
        try {
          return JSON.parse(it);
        } catch (e$) {
          e = e$;
          return it.split(',').map(function(it){
            return {
              hex: it.trim()
            };
          });
        }
      }
      return it;
    },
    'default': {
      colors: ['#1d3263', '#226c87', '#f8d672', '#e48e11', '#e03215', '#ab2321'].map(function(it){
        return {
          hex: it
        };
      })
    },
    plotdb: {
      colors: ['#ed1d78', '#c59b6d', '#8cc63f', '#28aae2'].map(function(it){
        return {
          hex: it
        };
      })
    },
    qualitative: {
      colors: ['#c05ae0', '#cf2d0c', '#e9ab1e', '#86ffb5', '#64dfff', '#003f7d'].map(function(it){
        return {
          hex: it
        };
      })
    },
    binary: {
      colors: ['#ff8356', '#0076a1'].map(function(it){
        return {
          hex: it
        };
      })
    },
    sequential: {
      colors: ['#950431', '#be043e', '#ec326d', '#fc82a9', '#febed2', '#fee6ee'].map(function(it){
        return {
          hex: it
        };
      })
    },
    diverging: {
      colors: ['#74001a', '#cd2149', '#f23971', '#ff84ab', '#ffc3d7', '#f2f2dd', '#b8d9ed', '#81b1d0', '#3d8bb7', '#0071a8', '#003558'].map(function(it){
        return {
          hex: it
        };
      })
    },
    subtype: {
      qualitative: "qualitative",
      binary: "binary",
      sequential: "sequential",
      diverging: "diverging"
    },
    scale: {
      ordinal: function(pal){
        var c, range, domain;
        c = pal.colors;
        range = c.filter(function(it){
          return it.keyword;
        }).map(function(it){
          return it.hex;
        }).concat(c.filter(function(it){
          return !it.keyword;
        }).map(function(it){
          return it.hex;
        }));
        domain = c.map(function(it){
          return it.keyword;
        }).filter(function(it){
          return it;
        });
        return d3.scale.ordinal().domain(domain).range(range);
      },
      linear: function(pal, domain){
        var c, range;
        c = pal.colors;
        range = c.filter(function(it){
          return it.keyword;
        }).map(function(it){
          return it.hex;
        }).concat(c.filter(function(it){
          return !it.keyword;
        }).map(function(it){
          return it.hex;
        }));
        if (!domain) {
          domain = c.map(function(it){
            return it.keyword;
          }).filter(function(it){
            return it != null;
          });
        }
        return d3.scale.linear().domain(domain).range(range);
      }
    }
  },
  Boolean: {
    'default': true,
    name: 'Boolean',
    level: 2,
    test: function(it){
      return !!/^(true|false|1|0|yes|no)$/.exec(it);
    },
    parse: function(it){
      if (it && typeof it === typeof "") {
        if (/^(yes|true)$/.exec(it.trim())) {
          return true;
        }
        if (/\d+/.exec(it.trim()) && it.trim() !== "0") {
          return true;
        }
        return false;
      }
      if (it) {
        return true;
      }
      return false;
    }
  }
});
plotdb.chart = {
  corelib: {},
  create: function(config){
    return import$(import$({}, this.base), config);
  },
  base: {
    dimension: {
      value: {
        type: [],
        require: false
      }
    },
    config: {
      padding: {
        type: [plotdb.Number],
        'default': 10
      }
    },
    init: function(root, data, config){},
    bind: function(root, data, config){},
    resize: function(root, data, config){},
    render: function(root, data, config){}
  },
  dataFromDimension: function(dimension){
    var data, len, k, v, i$, i, ret, that, type, value;
    data = [];
    len = Math.max.apply(null, (function(){
      var ref$, results$ = [];
      for (k in ref$ = dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).reduce(function(a, b){
      return a.concat(b.fields || []);
    }, []).filter(function(it){
      return it.data;
    }).map(function(it){
      return it.data.length;
    }).concat([0]));
    for (i$ = 0; i$ < len; ++i$) {
      i = i$;
      ret = {};
      for (k in dimension) {
        v = dimension[k];
        if (v.multiple) {
          ret[k] = (v.fields || (v.fields = [])).length ? (v.fields || (v.fields = [])).map(fn$) : null;
          v.fieldName = (v.fields || (v.fields = [])).map(fn1$);
        } else {
          ret[k] = (that = (v.fields || (v.fields = []))[0]) ? (that.data || (that.data = []))[i] : null;
          v.fieldName = (that = (v.fields || (v.fields = []))[0]) ? that.name : null;
        }
        if (ret[k] === null) {
          type = v.type[0] || plotdb.String;
          value = typeof type['default'] === 'function'
            ? type['default'](k, v, i)
            : type['default'];
          ret[k] = v.multiple ? [value] : value;
        }
        if ((v.type || []).filter(fn2$).length) {
          if (Array.isArray(ret[k])) {
            ret[k] = ret[k].map(fn3$);
          } else {
            ret[k] = parseFloat(ret[k]);
          }
        }
      }
      data.push(ret);
    }
    return data;
    function fn$(it){
      return (it.data || (it.data = []))[i];
    }
    function fn1$(it){
      return it.name;
    }
    function fn2$(it){
      return it.name === 'Number';
    }
    function fn3$(it){
      return parseFloat(it);
    }
  },
  dataFromHash: function(dimension, source){
    var k, v;
    if (!dimension || !source) {
      return [];
    }
    if (Array.isArray(source)) {
      return source;
    }
    if (typeof source === 'function') {
      source = source();
    }
    for (k in dimension) {
      v = dimension[k];
      if (source[k]) {
        v.fields = source[k];
      }
    }
    return plotdb.chart.dataFromDimension(dimension);
  },
  getSampleData: function(chart, dimension){
    dimension == null && (dimension = null);
    return plotdb.chart.dataFromHash(dimension || chart.dimension, chart.sample);
  },
  updateData: function(chart){
    return chart.data = plotdb.chart.dataFromDimension(chart.dimension);
  },
  updateAssets: function(chart, assets){
    var ret, i$, len$, file, raw, array, j$, to$, idx;
    assets == null && (assets = []);
    ret = {};
    for (i$ = 0, len$ = assets.length; i$ < len$; ++i$) {
      file = assets[i$];
      raw = atob(file.content);
      array = new Uint8Array(raw.length);
      for (j$ = 0, to$ = raw.length; j$ < to$; ++j$) {
        idx = j$;
        array[idx] = raw.charCodeAt(idx);
      }
      file.blob = new Blob([array], {
        type: file.type
      });
      file.url = URL.createObjectURL(file.blob);
      file.datauri = ["data:", file.type, ";charset=utf-8;base64,", file.content].join("");
      ret[file.name] = file;
    }
    return chart.assets = ret;
  },
  updateConfig: function(chart, config){
    var k, ref$, v, type, results$ = [];
    for (k in ref$ = chart.config) {
      v = ref$[k];
      type = (config[k].type || []).map(fn$);
      if (!(config[k] != null)) {
        config[k] = v['default'];
      } else if (!(config[k].value != null)) {
        config[k] = (v || config[k])['default'];
      } else {
        config[k] = config[k].value;
      }
      if (type.filter(fn1$).length) {
        results$.push(config[k] = parseFloat(config[k]));
      }
    }
    return results$;
    function fn$(it){
      return it.name;
    }
    function fn1$(it){
      return it === 'Number';
    }
  }
};
plotdb.theme = {
  create: function(config){
    return import$(import$({}, this.base), config);
  },
  base: {
    palette: {
      'default': [],
      diverging: [],
      sequential: [],
      binary: [],
      qualitative: [],
      binaryDiverge: [],
      sequentialQualitative: [],
      sequentialSequential: [],
      divergingDiverging: []
    },
    config: {
      padding: {
        type: [plotdb.Number],
        'default': 10
      }
    }
  }
};
plotdb.d3 = {};
plotdb.d3.axis = {
  overlap: function(axisGroup, axis, fontSize){
    var range, selection, minWidth, maxWidth, overlap;
    range = axis.scale().range();
    selection = axisGroup.selectAll(".tick text");
    if (!selection[0].length) {
      return;
    }
    minWidth = (range[1] - range[0]) / selection.length;
    maxWidth = d3.max(selection[0].map(function(d){
      return d.getBBox().width;
    }));
    overlap = maxWidth / minWidth;
    if (fontSize && overlap < 2) {
      selection.attr({
        transform: function(d, i){
          return ["translate(0,", overlap > 1 && i % 2 ? fontSize : 0, ")"].join(" ");
        }
      });
      return axisGroup.selectAll(".tick").style({
        opacity: 1
      });
    } else {
      selection.attr({
        transform: ""
      });
      return axisGroup.selectAll(".tick").style({
        opacity: function(d, i){
          if (i % parseInt(overlap + 1)) {
            return 0;
          } else {
            return 1;
          }
        }
      });
    }
  }
};
plotdb.d3.popup = function(root, sel, cb){
  var popup, x$;
  popup = root.querySelector('.pdb-popup');
  if (!popup) {
    popup = d3.select(root).append('div').attr({
      'class': 'pdb-popup float'
    });
    popup.each(function(d, i){
      var x$;
      x$ = d3.select(this);
      x$.append('div').attr({
        'class': 'title'
      });
      x$.append('div').attr({
        'class': 'value'
      });
      return x$;
    });
  } else {
    popup = d3.select(popup);
  }
  x$ = sel;
  x$.on('mousemove', function(d, i){
    var ref$, x, y, pbox, rbox;
    ref$ = [d3.event.clientX, d3.event.clientY], x = ref$[0], y = ref$[1];
    cb.call(this, d, i, popup);
    popup.style({
      display: 'block'
    });
    pbox = popup[0][0].getBoundingClientRect();
    rbox = root.getBoundingClientRect();
    x = x - pbox.width / 2;
    y = y + 20;
    if (y > rbox.top + rbox.height - pbox.height - 50) {
      y = y - pbox.height - 40;
    }
    if (x < 10) {
      x = 10;
    }
    if (x > rbox.left + rbox.width - pbox.width - 10) {
      x = rbox.left + rbox.width - pbox.width - 10;
    }
    return popup.style({
      top: y + "px",
      left: x + "px"
    });
  });
  x$.on('mouseout', function(){
    if (sel.hidePopup) {
      clearTimeout(sel.hidePopup);
    }
    return sel.hidePopup = setTimeout(function(){
      return popup.style({
        display: 'none'
      });
    }, 1000);
  });
  return x$;
};
plotdb.data = {
  sample: {
    category: ['IT', 'RD', 'GM', 'FIN', 'LEGAL', 'HR', 'SALES', 'BD'],
    name: ['James', 'Joe', 'Amelie', 'Doraemon', 'Cindy', 'David', 'Frank', 'Kim', 'Ken', 'Leland', 'Mike', 'Nick', 'Oliver', 'Randy'],
    fruit: ['Apple', 'Orange', 'Banana', 'Grape', 'Longan', 'Litchi', 'Peach', 'Guava', 'Melon', 'Pineapple', 'Pomelo', 'Durian', 'Berry', 'Pear'],
    generate: function(dimension){
      var ret, res$, i$, to$, i, node, k, v;
      res$ = [];
      for (i$ = 0, to$ = parseInt(Math.random() * 10 + 10); i$ < to$; ++i$) {
        i = i$;
        node = {};
        for (k in dimension) {
          v = dimension[k];
          if (!v.type || !v.type.length) {
            node[k] = this.name[parseInt(Math.random() * this.name.length)];
          } else {
            node[k] = parseInt(Math.random() * 8) + 2;
          }
        }
        res$.push(node);
      }
      ret = res$;
      return ret;
    }
  }
};
plotdb.rand = function(){
  return this[parseInt(Math.random() * this.length)];
};
plotdb.data.sample.name.rand = plotdb.rand;
plotdb.data.sample.category.rand = plotdb.rand;
plotdb.data.sample.fruit.rand = plotdb.rand;
import$(plotdb.data.sample, {
  crimeanWar: {
    "month": {
      "name": "month",
      "data": ["01/04/1854", "01/05/1854", "01/06/1854", "01/07/1854", "01/08/1854", "01/09/1854", "01/10/1854", "01/11/1854", "01/12/1854", "01/01/1855", "01/02/1855", "01/03/1855", "01/04/1855", "01/05/1855", "01/06/1855", "01/07/1855", "01/08/1855", "01/09/1855", "01/10/1855", "01/11/1855", "01/12/1855", "01/01/1856", "01/02/1856", "01/03/1856"]
    },
    "army size": {
      "name": "army size",
      "data": [8571, 23333, 28333, 28722, 30246, 30290, 30643, 29736, 32779, 32393, 30919, 30107, 32252, 35473, 38863, 42647, 44614, 47751, 46852, 37853, 43217, 44212, 43485, 46140]
    },
    "death number by zymotic": {
      "name": "death number by zymotic",
      "data": [1, 12, 11, 359, 828, 788, 503, 844, 1725, 2761, 2120, 1205, 477, 508, 802, 382, 483, 189, 128, 178, 91, 42, 24, 15]
    },
    "death number by wound": {
      "name": "death number by wound",
      "data": [0, 0, 0, 0, 1, 81, 132, 287, 114, 83, 42, 32, 48, 49, 209, 134, 164, 276, 53, 33, 18, 2, 0, 0]
    },
    "death number by other": {
      "name": "death number by other",
      "data": [5, 9, 6, 23, 30, 70, 128, 106, 131, 324, 361, 172, 57, 37, 31, 33, 25, 20, 18, 32, 28, 48, 19, 35]
    },
    "zymotic rate(‰)": {
      "name": "zymotic rate(‰)",
      "data": [1.4, 6.2, 4.7, 150, 328.5, 312.2, 197, 340.6, 631.5, 1022.8, 822.8, 480.3, 177.5, 171.8, 247.6, 107.5, 129.9, 47.5, 32.8, 56.4, 25.3, 11.4, 6.6, 3.9]
    },
    "wound rate(‰)": {
      "name": "wound rate(‰)",
      "data": [0, 0, 0, 0, 0.4, 32.1, 51.7, 115.8, 41.7, 30.7, 16.3, 12.8, 17.9, 16.6, 64.5, 37.7, 44.1, 69.4, 13.6, 10.5, 5, 0.5, 0, 0]
    },
    "other rate(‰)": {
      "name": "other rate(‰)",
      "data": [7, 4.6, 2.5, 9.6, 11.9, 27.7, 50.1, 42.8, 48, 120, 140.1, 68.6, 21.2, 12.5, 9.6, 9.3, 6.7, 5, 4.6, 10.1, 7.8, 13, 5.2, 9.1]
    }
  },
  lifeExpectancy: {
    "1985": {
      "name": "1985",
      "data": ["42.8", "72.2", "67.7", "80", "50", "73.1", "71.9", "70.5", "75.7", "74", "66.2", "67.2", "71.5", "55.8", "73.3", "71.1", "74.6", "71.1", "55", "56", "59.8", "71.5", "67.5", "67.4", "72.9", "71.3", "52", "49.8", "56.3", "58.2", "76.5", "67.2", "49.1", "53.4", "71.8", "66.4", "70.3", "55.4", "52.9", "56.6", "76.3", "57.7", "71.6", "74.3", "76.7", "71.1", "74.7", "60.6", "73.1", "70.5", "70", "61.1", "67.8", "51.9", "50.2", "70.4", "46.3", "64.1", "74.7", "75.7", "60.6", "56.6", "70.2", "74.6", "58.7", "76", "69.1", "62.8", "50.7", "50.5", "65", "53.4", "67.6", "68.9", "77.6", "55.9", "63.4", "63.6", "68.5", "73.7", "74.9", "75.7", "72.6", "77.8", "69.3", "66.4", "63.1", "56.4", "65.9", "69.5", "74.6", "64.7", "54.3", "70.1", "65.3", "60.4", "54.5", "71.9", "71.2", "73.8", "72", "54.5", "50.8", "70.5", "62.7", "46.9", "75.2", "64", "58.9", "67.8", "69.7", "61.8", "66", "60.8", "73.1", "66.1", "47", "56.7", "61.4", "55.2", "76.4", "74.2", "64.9", "45", "55.5", "76.1", "68.4", "61.1", "75.1", "56", "73.1", "67.2", "66", "70.7", "73.1", "75", "69.7", "68.2", "50.3", "69.5", "69.3", "67.5", "62.5", "71.8", "55.8", "72.6", "69.9", "49.5", "73.1", "70.8", "71.8", "60.2", "52.8", "62.8", "76.6", "70.5", "54.9", "68.5", "60", "76.9", "76.9", "68.5", "73", "64.4", "57.9", "70.4", "55.8", "57.5", "68", "68.5", "69.8", "65.2", "62", "52.3", "70", "71.9", "74.7", "74.8", "72.1", "67", "62.3", "72.2", "69.1", "67.4", "57.8", "56.9", "63.5", "51.1"]
    },
    "2000": {
      "name": "2000",
      "data": ["51", "74.2", "73.2", "82.7", "52.6", "73.9", "74.3", "71.4", "79.7", "78.2", "68", "70.3", "73.6", "65.8", "74.3", "68.2", "77.8", "69", "59.2", "63.9", "67.6", "75.2", "51.6", "71.9", "75.5", "71.7", "53.3", "47.5", "60.9", "55", "79.3", "70.1", "46.7", "52.4", "77.2", "71.5", "72.5", "60.2", "52.5", "52.6", "77.7", "52.8", "74.7", "75.9", "79.1", "75", "76.9", "59.6", "73.3", "72.7", "73.2", "68.9", "72.9", "52.4", "49.3", "70.1", "52.5", "64.2", "77.8", "79.1", "58", "60", "72.3", "78.1", "60.2", "78", "70.5", "68.5", "55.6", "51.7", "64.4", "58.6", "68.8", "71.8", "79.9", "61.1", "68.3", "71.2", "69.1", "76.7", "78.8", "79.6", "72.7", "81.1", "73.1", "63.6", "57.4", "59.5", "63.2", "76.3", "77.5", "65.8", "59.5", "70.1", "76.2", "49.8", "55.9", "74.6", "72", "78.2", "73.9", "60.5", "46.3", "73.8", "72.6", "51.1", "79.7", "63.8", "61.8", "71", "75.1", "64.5", "69.3", "61.4", "72", "71.3", "53.6", "61.4", "55", "64.9", "78.1", "78.5", "73.9", "53", "55.8", "78.7", "73.7", "62.6", "76.9", "56.9", "74.1", "74.3", "69", "73.8", "76.7", "77.2", "70.8", "65.4", "50", "72", "69.8", "69.9", "65.3", "76.1", "60", "74.7", "70.9", "52.2", "78.6", "73.3", "75.8", "61.7", "54.3", "57.1", "79.3", "72.4", "64.4", "68.8", "48.7", "79.7", "80", "73.8", "76", "66.3", "54.8", "71.3", "63.6", "59", "69.1", "69.4", "75", "71.5", "63.1", "50", "67.5", "73.8", "77.8", "77.1", "74.6", "67.4", "63", "74.3", "73.5", "72.6", "63.5", "45.7", "50.8", "54.1"]
    },
    "2015": {
      "name": "2015",
      "data": ["57.63", "76", "76.5", "84.1", "61", "75.2", "76.2", "74.4", "81.8", "81", "72.9", "72.3", "79.2", "70.1", "75.8", "70.4", "80.4", "70", "65.5", "70.2", "72.3", "77.9", "66.4", "75.6", "78.7", "74.9", "62.8", "60.4", "68.4", "59.5", "81.7", "74.6", "53.8", "57.7", "79.3", "76.9", "75.8", "64.1", "58.3", "61.9", "80", "60.33", "78", "78.5", "82.6", "78.6", "80.1", "64.63", "74.6", "73.8", "75.2", "71.3", "74.1", "60.63", "62.9", "76.8", "63.6", "66.3", "80.8", "81.9", "60.53", "65.1", "73.3", "81.1", "65.5", "79.8", "71.7", "73.1", "60.8", "53.4", "64.4", "65.3", "72.4", "76.2", "82.8", "66.8", "70.9", "78.5", "72.1", "80.4", "82.4", "82.1", "75.5", "83.5", "78.3", "68.2", "66.63", "62.4", "71.4", "80.7", "80.7", "69", "66.4", "75.7", "78.5", "48.5", "63.9", "76.2", "75.4", "81.1", "77", "64.7", "60.22", "75.1", "79.5", "57.6", "82.1", "65.1", "65.7", "73.9", "74.5", "67", "72.7", "65.3", "75.8", "74.7", "56.4", "67.9", "61", "71.2", "80.6", "80.6", "76.8", "62.2", "61.33", "81.6", "75.7", "66.5", "78.2", "60.6", "73.9", "77.5", "70.2", "77.3", "79.8", "82", "76.8", "73.13", "66.53", "74.5", "72.9", "72.2", "68.8", "78.1", "66.1", "78.1", "73.7", "58.5", "82.1", "76.4", "80.2", "64.1", "58.7", "63.72", "81.7", "76.5", "69.5", "70.5", "51.5", "82", "82.9", "70.26", "79.7", "71", "63.43", "75.1", "72.4", "64.23", "70.5", "71.4", "77.3", "76.5", "67.9", "60.8", "72.1", "76.6", "81.4", "79.1", "77.3", "70.1", "65", "75.8", "75.2", "76.5", "67.6", "58.96", "60.01", "58"]
    },
    "Country": {
      "name": "Country",
      "data": ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Dem. Rep.", "Congo, Rep.", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kuwait", "Kyrgyz Republic", "Lao", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Macedonia, FYR", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia, Fed. Sts.", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "St. Lucia", "St. Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "West Bank and Gaza", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "South Sudan"]
    },
    "Continent": {
      "name": "Continent",
      "data": ["Asia", "Europe", "Africa", "Europe", "Africa", "North America", "South America", "Europe", "Oceania", "Europe", "Europe", "North America", "Asia", "Asia", "North America", "Europe", "Europe", "North America", "Africa", "Asia", "South America", "Europe", "Africa", "South America", "Asia", "Europe", "Africa", "Africa", "Asia", "Africa", "North America", "Africa", "Africa", "Africa", "South America", "Asia", "South America", "Africa", "Africa", "Africa", "North America", "Africa", "Europe", "North America", "Europe", "Europe", "Europe", "Africa", "North America", "North America", "South America", "Africa", "North America", "Africa", "Africa", "Europe", "Africa", "Oceania", "Europe", "Europe", "Africa", "Africa", "Europe", "Europe", "Africa", "Europe", "North America", "North America", "Africa", "Africa", "South America", "North America", "North America", "Europe", "Europe", "Asia", "Asia", "Asia", "Asia", "Europe", "Asia", "Europe", "North America", "Asia", "Asia", "Asia", "Africa", "Oceania", "Asia", "Asia", "Asia", "Asia", "Asia", "Europe", "Asia", "Africa", "Africa", "Africa", "Europe", "Europe", "Europe", "Africa", "Africa", "Asia", "Asia", "Africa", "Europe", "Oceania", "Africa", "Africa", "North America", "Oceania", "Europe", "Asia", "Europe", "Africa", "Africa", "Asia", "Africa", "Asia", "Europe", "Oceania", "North America", "Africa", "Africa", "Europe", "Asia", "Asia", "North America", "Oceania", "South America", "South America", "Asia", "Europe", "Europe", "Asia", "Europe", "Asia", "Africa", "North America", "North America", "Oceania", "Africa", "Asia", "Africa", "Europe", "Africa", "Africa", "Asia", "Europe", "Europe", "Oceania", "Africa", "Africa", "Europe", "Asia", "Africa", "South America", "Africa", "Europe", "Europe", "Asia", "Asia", "Asia", "Africa", "Asia", "Asia", "Africa", "Oceania", "North America", "Africa", "Asia", "Asia", "Africa", "Europe", "Asia", "Europe", "North America", "South America", "Asia", "Oceania", "South America", "Asia", "Asia", "Asia", "Africa", "Africa", "Africa"]
    }
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}// Generated by LiveScript 1.3.1
(function(){
  var config, x$, e;
  config = {
    domain: 'localhost',
    domainIO: 'localhost.io',
    urlschema: "http://",
    name: 'plotdb',
    debug: true,
    facebook: {
      clientID: '1546734828988373'
    },
    google: {
      clientID: '608695485854-bh8mqncpi8ofl1pprl940gti2cdbhgf8.apps.googleusercontent.com'
    }
  };
  if (typeof module != 'undefined' && module !== null) {
    module.exports = config;
  } else if (typeof angular != 'undefined' && angular !== null) {
    try {
      x$ = angular.module('plotDB');
      x$.service('plConfig', [].concat(function(){
        return config;
      }));
    } catch (e$) {
      e = e$;
    }
  }
  if (typeof window != 'undefined' && window !== null) {
    return window.plConfig = config;
  }
})();// Generated by LiveScript 1.3.1
var plotdbDomain, brandNew;
plotdbDomain = window.plConfig.urlschema + "" + window.plConfig.domain;
brandNew = true;
window.addEventListener('click', function(){
  return window.parent.postMessage({
    type: 'click',
    payload: ""
  }, plotdbDomain);
});
window.thread = {
  count: 0,
  inc: function(t){
    if (t) {
      return this.count = (this.count || 0) + 1;
    }
  },
  dec: function(t){
    if (t) {
      return this.count = (this.count || 1) - 1;
    }
  },
  racing: function(){
    return this.count > 1;
  }
};
$(document).ready(function(){
  var dispatcher, properEval, errorHandling, colorblind, parse, snapshot, render, resizeHandler;
  dispatcher = function(evt){
    var ref$;
    if ((ref$ = evt.data.type) === 'snapshot' || ref$ === 'getsvg' || ref$ === 'getpng') {
      return snapshot(evt.data.type);
    } else if (evt.data.type === 'render') {
      return render(evt.data.payload, evt.data.rebind);
    } else if (evt.data.type === 'parse-chart') {
      return parse(evt.data.payload, 'chart');
    } else if (evt.data.type === 'parse-theme') {
      return parse(evt.data.payload, 'theme');
    } else if (evt.data.type === 'reload') {
      if (!brandNew) {
        return window.location.reload();
      } else {
        return window.parent.postMessage({
          type: 'loaded'
        }, plotdbDomain);
      }
    } else if (evt.data.type === 'colorblind-emu') {
      return colorblind(evt.data.payload);
    }
  };
  window.addEventListener('error', function(e){
    var reBloburl, stack, msg;
    reBloburl = /blobhttp:%3A\/\/[^:]+:/;
    stack = e.error.stack;
    if (reBloburl.exec(stack)) {
      stack = stack.split(reBloburl).join("line ");
      msg = e.message + " at line " + (e.lineno - 1) + ".";
      if (e.message.indexOf(stack) < 0) {
        msg += " Callstack: \n" + stack;
      }
    } else {
      msg = e.message + " at line " + (e.lineno - 1) + ".";
    }
    return errorHandling(msg, e.lineno - 1);
  });
  properEval = function(code, updateModule){
    updateModule == null && (updateModule = true);
    return new Promise(function(res, rej){
      var empty, module, codeURL, codeNode;
      empty = "{exports:{init:function(){},update:function(){},resize:function(){},bind:function(){},render:function(){}}}";
      window.errorMessage = "";
      module = updateModule ? 'module' : 'moduleLocal';
      code = "(function() { " + code + "; window." + module + " = (typeof(module)=='undefined'?" + empty + ":module); })()";
      window.codeURL = codeURL = URL.createObjectURL(new Blob([code], {
        type: "text/javascript"
      }));
      codeNode = document.createElement("script");
      codeNode.onload = function(){
        var e;
        URL.revokeObjectURL(codeURL);
        if (window[module]) {
          window[module].identity = parseInt(Math.random() * 1000);
        }
        res(window[module]);
        try {
          return document.body.removeChild(codeNode);
        } catch (e$) {
          return e = e$;
        }
      };
      codeNode.src = codeURL;
      return document.body.appendChild(codeNode);
    });
  };
  errorHandling = function(e, lineno){
    var msg, reBloburl, ret, lines;
    lineno == null && (lineno = 0);
    if (!e) {
      msg = "plot failed with unknown error";
    } else if (typeof e !== typeof {}) {
      msg = e + "";
    } else if (!e.stack) {
      msg = e.toString();
    } else {
      msg = e.stack;
    }
    reBloburl = /blob:http%3A\/\/[^:]+:/;
    if (reBloburl.exec(msg)) {
      msg = msg.split(reBloburl).join("line ");
    }
    if (!lineno) {
      ret = /line (\d+):\d+/.exec(msg);
      lineno = ret ? parseInt(ret[1]) : 0;
    }
    if (msg.length > 1024) {
      msg = msg.substring(0, 1024) + "...";
    }
    lines = msg.split('\n');
    if (lines.length > 4) {
      msg = lines.splice(0, 4).join('\n');
    }
    return window.parent.postMessage({
      type: 'error',
      payload: {
        msg: msg,
        lineno: lineno
      }
    }, plotdbDomain);
  };
  colorblind = function(payload){
    var val;
    val = ['normal', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly'];
    if (!in$(payload, val)) {
      payload = 'normal';
    }
    return d3.select('body').style({
      "-webkit-filter": "url('#" + payload + "')",
      "filter": "url('#" + payload + "')"
    });
  };
  parse = function(payload, type){
    var e;
    try {
      if (type === 'chart') {
        return properEval(payload, false).then(function(module){
          var chart, payload, ref$;
          chart = module.exports;
          payload = JSON.stringify((ref$ = {}, ref$.dimension = chart.dimension, ref$.config = chart.config, ref$));
          return window.parent.postMessage({
            type: 'parse-chart',
            payload: payload
          }, plotdbDomain);
        });
      } else if (type === 'theme') {
        return properEval(payload, false).then(function(module){
          var theme, payload, ref$;
          theme = module.exports;
          payload = JSON.stringify((ref$ = {}, ref$.typedef = theme.typedef, ref$.config = theme.config, ref$));
          return window.parent.postMessage({
            type: 'parse-theme',
            payload: payload
          }, plotdbDomain);
        });
      }
    } catch (e$) {
      e = e$;
      return errorHandling(e);
    }
  };
  snapshot = function(type){
    var svgnode, styles, i$, to$, idx, style, ref$, width, height, svg, img, encoded, e;
    type == null && (type = 'snapshot');
    try {
      d3.selectAll('#container svg').each(function(){
        var ref$, width, height;
        ref$ = this.getBoundingClientRect(), width = ref$.width, height = ref$.height;
        return d3.select(this).attr({
          "xmlns": "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "width": width,
          "height": height
        });
      });
      svgnode = document.querySelector('#container svg');
      styles = svgnode.querySelectorAll("style");
      for (i$ = 0, to$ = styles.length; i$ < to$; ++i$) {
        idx = i$;
        style = styles[idx];
        if (!style.generated) {
          continue;
        }
        svgnode.removeChild(style);
      }
      styles = document.querySelectorAll('html style');
      for (i$ = styles.length - 1; i$ >= 0; --i$) {
        idx = i$;
        style = styles[idx].cloneNode(true);
        style.generated = true;
        svgnode.insertBefore(style, svgnode.childNodes[0]);
      }
      ref$ = svgnode.getBoundingClientRect(), width = ref$.width, height = ref$.height;
      svg = svgnode.outerHTML;
      if (type === 'getsvg') {
        return window.parent.postMessage({
          type: 'getsvg',
          payload: svg
        }, plotdbDomain);
      }
      img = new Image();
      img.onload = function(){
        var newHeight, canvas, ref$;
        newHeight = height > width ? width : height;
        canvas = (ref$ = document.createElement("canvas"), ref$.width = width, ref$.height = newHeight, ref$);
        canvas.getContext('2d').drawImage(img, 0, 0, width, newHeight, 0, 0, width, newHeight);
        return window.parent.postMessage({
          type: type,
          payload: canvas.toDataURL()
        }, plotdbDomain);
      };
      encoded = base64.encode(utf8.encode(svg));
      return img.src = "data:image/svg+xml;charset=utf-8;base64," + encoded;
    } catch (e$) {
      e = e$;
      console.log(e);
      return window.parent.postMessage({
        type: type,
        payload: null
      }, plotdbDomain);
    }
  };
  render = function(payload, rebind){
    var ref$, code, style, doc, data, assets, dimension, config, theme, reboot, ret, node, promise, e;
    rebind == null && (rebind = true);
    ref$ = ['code', 'style', 'doc'].map(function(it){
      return (payload.chart || (payload.chart = {}))[it].content;
    }), code = ref$[0], style = ref$[1], doc = ref$[2];
    ref$ = ['data', 'assets'].map(function(it){
      return payload.chart[it];
    }), data = ref$[0], assets = ref$[1];
    dimension = payload.chart.dimension || {};
    config = payload.chart.config || {};
    theme = payload.theme || {};
    reboot = !window.module || !window.module.inited || window.module.execError;
    if (reboot) {
      sched.clear();
    }
    thread.inc(reboot);
    try {
      if (false && "script tag disallow") {
        ret = /<\s*script[^>]*>.*<\s*\/\s*script\s*>/g.exec(doc.toLowerCase());
        if (ret) {
          throw new Error("script tag is not allowed in document.");
        }
      }
      if (reboot) {
        node = document.getElementById("wrapper");
        if (!node) {
          node = document.createElement("div");
          node.setAttribute("id", "wrapper");
          node.setAttribute("class", "pdb-root");
          document.body.appendChild(node);
        }
        $(node).html(["<style type='text/css'>/* <![CDATA[ */" + style + "/* ]]> */</style>", (theme.style || (theme.style = {})).content ? "<style type='text/css'>/* <![CDATA[ */" + theme.style.content + "/* ]]> */</style>" : void 8, "<div id='container' style='position:relative;width:100%;height:100%;'>", "<div style='height:0'>&nbsp;</div>", doc, (theme.doc || (theme.doc = {})).content ? theme.doc.content : void 8, "</div>"].join(""));
        promise = properEval(code);
      } else {
        promise = Promise.resolve(window.module);
      }
      promise.then(function(module){
        var root, chart, k, ref$, v, i$, ref1$, len$, type, e, assetsmap, file, raw, array, j$, to$, idx, promise, this$ = this;
        if (thread.racing()) {
          return thread.dec(reboot);
        }
        root = document.getElementById('container');
        chart = module.exports;
        if ((!data || !data.length) && chart.sample) {
          data = plotdb.chart.getSampleData(chart, dimension);
        }
        for (k in ref$ = config || {}) {
          v = ref$[k];
          for (i$ = 0, len$ = (ref1$ = v.type || []).length; i$ < len$; ++i$) {
            type = ref1$[i$];
            try {
              type = plotdb[type.name];
              if (type.test && type.parse && type.test(v.value)) {
                v.value = type.parse(v.value);
                break;
              }
            } catch (e$) {
              e = e$;
              console.log("chart config: type parsing exception ( " + k + " / " + type + " )");
              console.log(e.stack + "");
              thread.dec(reboot);
              return errorHandling("Exception parsing chart config '" + k + "'");
            }
          }
        }
        for (k in ref$ = chart.config) {
          v = ref$[k];
          if (!(config[k] != null)) {
            config[k] = v['default'];
          } else if (!(config[k].value != null)) {
            config[k] = (v || config[k])['default'];
          } else {
            config[k] = config[k].value;
          }
        }
        chart.assets = assetsmap = {};
        for (i$ = 0, len$ = (ref$ = assets).length; i$ < len$; ++i$) {
          file = ref$[i$];
          raw = atob(file.content);
          array = new Uint8Array(raw.length);
          for (j$ = 0, to$ = raw.length; j$ < to$; ++j$) {
            idx = j$;
            array[idx] = raw.charCodeAt(idx);
          }
          file.blob = new Blob([array], {
            type: file.type
          });
          file.url = URL.createObjectURL(file.blob);
          file.datauri = ["data:", file.type, ";charset=utf-8;base64,", file.content].join("");
          assetsmap[file.name] = file;
        }
        chart.config = config;
        if (rebind || reboot || !(chart.root && chart.data)) {
          chart.root = root;
          chart.data = data;
          chart.dimension = dimension;
        }
        promise = Promise.resolve();
        if (reboot) {
          promise = promise.then(function(){
            var ret;
            if (thread.racing()) {
              return;
            }
            ret = !module.inited ? (chart.init && chart.init(), chart.parse ? chart.parse() : void 8) : null;
            module.inited = true;
            return ret;
          });
        }
        return promise.then(function(){
          if (thread.racing()) {
            return thread.dec(reboot);
          }
          chart.resize();
          if (rebind || reboot) {
            chart.bind();
          }
          chart.render();
          module.execError = false;
          return window.parent.postMessage({
            type: 'error',
            payload: window.errorMessage || ""
          }, plotdbDomain);
        });
      })['catch'](function(e){
        module.execError = true;
        thread.dec(reboot);
        return errorHandling(e);
      });
    } catch (e$) {
      e = e$;
      thread.dec(reboot);
      errorHandling(e);
    }
    return brandNew = false;
  };
  window.addEventListener('message', dispatcher, false);
  resizeHandler = null;
  window.addEventListener('resize', function(){
    if (resizeHandler) {
      clearTimeout(resizeHandler);
    }
    return resizeHandler = setTimeout(function(){
      var chart;
      resizeHandler = null;
      if (!window.module || !window.module.exports) {
        return;
      }
      chart = window.module.exports;
      chart.resize();
      return chart.render();
    }, 400);
  });
  window.addEventListener('keydown', function(e){
    if ((e.metaKey || e.altKey) && (e.keyCode === 13 || e.which === 13)) {
      return window.parent.postMessage({
        type: 'alt-enter'
      }, plotdbDomain);
    }
  });
  return window.parent.postMessage({
    type: 'loaded'
  }, plotdbDomain);
});
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}// Generated by LiveScript 1.3.1
var plotd3;
plotd3 = {
  html: {},
  rwd: {}
};
plotd3.html.tooltip = function(root, sel, cb){
  var store, ret, popup;
  store = {
    handler: {}
  };
  ret = plotd3.html.popup(root, null, null, store);
  popup = store.popup;
  ret.nodes = function(sel){
    var x$;
    x$ = sel;
    x$.on('mousemove', function(d, i){
      var rbox, box, ref$, left, top, width, height, isLeft, update;
      rbox = d3.select(root)[0][0].getBoundingClientRect();
      box = this.getBoundingClientRect();
      if (store.coord) {
        ref$ = store.coord.call(this, d, i), left = ref$[0], top = ref$[1], width = ref$[2], height = ref$[3];
        box = {
          left: left,
          top: top,
          width: width,
          height: height
        };
      }
      ret.fire('mousemove', d, i, this);
      popup.attr({
        'class': "pdb-popup tooltip " + "left"
      });
      isLeft = box.left > rbox.width / 2 + rbox.left ? true : false;
      popup.attr({
        'class': "pdb-popup tooltip " + (isLeft ? 'left' : 'right')
      });
      update = function(){
        var pbox;
        pbox = popup[0][0].getBoundingClientRect();
        popup.style({
          top: (box.top + box.height / 2 - pbox.height / 2) + "px",
          opacity: 1
        });
        if (isLeft) {
          return popup.style({
            left: (box.left - pbox.width - 10) + "px"
          });
        } else {
          return popup.style({
            left: (box.left + box.width + 10) + "px"
          });
        }
      };
      if (popup.style("display") !== 'block') {
        popup.style({
          display: 'block',
          opacity: 0.01
        });
        return setTimeout(update, 0);
      } else {
        return update();
      }
    });
    x$.on('mouseout', function(d, i){
      ret.fire('mouseout', d, i, this);
      return popup.style({
        display: 'none'
      });
    });
    return ret;
  };
  ret.direction = function(it){
    store.direction = it === 'left' ? 'left' : 'right';
    return popup.attr({
      'class': "pdb-popup tooltip " + store.direction
    });
  };
  ret.show = function(x, y){
    var bbox;
    bbox = popup[0][0].getBoundingClientRect();
    if (store.direction !== 'right') {
      x = x - (bbox.right - bbox.left) - 10;
    } else {
      x = x + 10;
    }
    popup.style({
      display: 'block'
    });
    popup.style({
      top: (y - (bbox.bottom - bbox.top) / 2) + "px",
      left: x + "px"
    });
    return ret.hide();
  };
  ret.type('tooltip');
  return ret;
};
plotd3.html.float = function(root, sel, cb){
  var ret;
  ret = plotd3.html.popup(root, sel, cb);
  ret.type('float');
  return ret;
};
plotd3.html.popup = function(root, sel, cb, store){
  var popup, ret;
  store == null && (store = {
    handler: {}
  });
  popup = store.popup = d3.select(root).append('div');
  popup.each(function(d, i){
    var x$;
    x$ = d3.select(this);
    x$.append('div').attr({
      'class': 'title'
    });
    x$.append('div').attr({
      'class': 'value'
    });
    return x$;
  });
  popup.on('mouseover', function(){
    return d3.select(this).style({
      display: 'none'
    });
  });
  ret = function(){};
  ret.hide = function(d, i){
    if (d != null && i != null) {
      ret.fire('mouseout', d, i, this);
    }
    if (ret.hidePopup) {
      clearTimeout(ret.hidePopup);
    }
    return ret.hidePopup = setTimeout(function(){
      return popup.style({
        display: 'none'
      });
    }, 1000);
  };
  ret.getPopupNode = function(){
    return popup;
  };
  ret.nodes = function(sel){
    var x$;
    x$ = sel;
    x$.on('mouseout', ret.hide);
    x$.on('mousemove', function(d, i){
      var ref$, x, y, width, height, pbox, rbox;
      ref$ = [d3.event.clientX, d3.event.clientY], x = ref$[0], y = ref$[1];
      if (store.coord) {
        ref$ = store.coord.call(this, d, i), x = ref$[0], y = ref$[1], width = ref$[2], height = ref$[3];
      }
      ret.fire('mousemove', d, i, this);
      popup.style({
        display: 'block'
      });
      pbox = popup[0][0].getBoundingClientRect();
      rbox = root.getBoundingClientRect();
      x = x - pbox.width / 2 - rbox.left;
      y = y + 20 - rbox.top;
      if (y > rbox.height - pbox.height - 50) {
        y = y - pbox.height - 40;
      }
      if (x < 10) {
        x = 10;
      }
      if (x > +rbox.width - pbox.width - 10) {
        x = rbox.width - pbox.width - 10;
      }
      return popup.style({
        top: y + "px",
        left: x + "px"
      });
    });
    return ret;
  };
  ret.coord = function(cb){
    if (cb != null) {
      store.coord = cb;
    } else {
      return store.coord;
    }
    return ret;
  };
  ret.call = function(cb){
    return cb.call(popup[0][0]);
  };
  ret.show = function(x, y){
    popup.style({
      display: 'block'
    });
    popup.style({
      top: y + "px",
      left: x + "px"
    });
    return ret.hide();
  };
  ret.fire = function(event, d, i, node){
    var ref$;
    return ((ref$ = store.handler)[event] || (ref$[event] = [])).forEach(function(cb){
      return cb.call(node, d, i, popup);
    });
  };
  ret.fontSize = function(fs){
    if (fs != null) {
      store.fontSize = fs;
      popup.style({
        "font-size": fs + "px"
      });
      return ret;
    } else {
      return store.fontSize;
    }
  };
  ret.on = function(event, cb){
    var ref$;
    ((ref$ = store.handler)[event] || (ref$[event] = [])).push(cb);
    return ret;
  };
  ret.type = function(type){
    var that;
    if (!type) {
      return store.type;
    }
    store.type = type;
    return popup.attr({
      'class': ("pdb-popup " + ((that = store.type) ? that : "")).trim()
    });
  };
  if (sel) {
    ret.nodes(sel);
  }
  if (cb) {
    ret.on('mousemove', cb);
  }
  ret.type('float');
  return ret;
};
plotd3.rwd.legend = function(){
  var store, ret;
  store = {
    padding: [10, 5]
  };
  ret = function(){
    var that, data, x$, offset, max, label, ref$;
    store.group = this;
    if (that = store.tickValues) {
      data = that;
    } else if (!store.scale) {
      data = [0, 1];
    } else if (store.scale.invert) {
      data = store.scale.ticks(store.ticks || 5);
    } else {
      data = store.scale.domain();
    }
    x$ = this.selectAll('g.legend').data(data);
    x$.enter().append('g').attr({
      'class': 'legend'
    }).each(function(d, i){
      var node;
      node = d3.select(this);
      node.append('path').attr({
        'class': 'marker'
      });
      return node.append('text');
    });
    x$.exit().remove();
    this.selectAll('g.legend').each(function(d, i){
      var node, x$, size, m, r, dx;
      if (store.type === 'radius' && !d) {
        return;
      }
      node = d3.select(this);
      x$ = node.select('text');
      x$.text(d);
      if (store.fontSize != null) {
        x$.attr("font-size", store.fontSize);
      }
      size = node.select('text')[0][0].getBBox().height * 0.8;
      if (store.marker) {
        store.marker.call(node.select('path.marker')[0][0], d, i);
      } else {
        m = node.select('path.marker');
        if ((store.type || 'color') === 'color') {
          m.attr({
            d: ("M" + size / 2 + " 0 A" + size / 2 + " " + size / 2 + " 0 0 0 " + size / 2 + " " + size) + ("A" + size / 2 + " " + size / 2 + " 0 0 0 " + size / 2 + " 0"),
            fill: store.scale(d)
          });
        } else if (store.type === 'radius') {
          r = store.scale(d);
          m.attr({
            cx: r,
            cy: r,
            r: r,
            d: ("M" + size / 2 + " " + (size / 2 - r) + " A" + r + " " + r + " 0 0 0 " + size / 2 + " " + (size / 2 + r)) + ("A" + r + " " + r + " 0 0 0 " + size / 2 + " " + (size / 2 - r)),
            fill: '#999'
          });
        }
      }
      dx = 0;
      if (store.type === 'radius') {
        dx = store.scale(data[data.length - 1]);
      }
      return node.select('text').attr({
        "dominant-baseline": "hanging",
        "text-anchor": "start",
        dy: 1,
        dx: size + 3 + dx,
        "font-size": store.fontSize != null ? store.fontSize : void 8
      });
    });
    offset = [0, 0];
    max = [0, 0];
    this.select('text.label').remove();
    if (store.label) {
      label = this.append('text').attr({
        'class': 'label'
      }).text(store.label);
      label.attr({
        "font-size": store.fontSize != null ? store.fontSize * 1.1 : void 8,
        "font-weight": 'bold',
        "dominant-baseline": 'hanging'
      });
      if ((ref$ = store.orient) === 'bottom' || ref$ === 'top') {
        offset[0] += label[0][0].getBBox().width + store.padding[0] || 10;
      } else {
        offset[1] += label[0][0].getBBox().height + store.padding[1] || 5;
      }
    }
    return this.selectAll('g.legend').each(function(d, i){
      var node, ref$, w, h;
      node = d3.select(this).attr({
        transform: "translate(" + offset[0] + " " + offset[1] + ")"
      });
      ref$ = [this.getBBox().width, this.getBBox().height], w = ref$[0], h = ref$[1];
      if ((ref$ = store.orient) === 'bottom' || ref$ === 'top') {
        if (store.size && store.size[0] < offset[0] + w) {
          offset[0] = 0;
          offset[1] += h + (store.padding[1] || 5);
          node = d3.select(this).attr({
            transform: "translate(" + offset[0] + " " + offset[1] + ")"
          });
        }
        return offset[0] += w + (store.padding[0] || 10);
      } else {
        if (max[0] < w) {
          max[0] = w;
        }
        if (store.size && store.size[1] < offset[1] + h) {
          offset[1] = 0;
          offset[0] += max[0] + (store.padding[0] || 10);
          node = d3.select(this).attr({
            transform: "translate(" + offset[0] + " " + offset[1] + ")"
          });
        }
        offset[1] += h + (store.padding[1] || 5);
        return offset[1] += store.type === 'radius' ? 3 : 0;
      }
    });
  };
  ret.offset = function(){
    var box;
    if (!store.group) {
      return [0, 0];
    }
    box = store.group[0][0].getBBox();
    return [box.width, box.height];
  };
  ['label', 'fontSize', 'type', 'marker', 'tickValues', 'ticks', 'orient', 'scale', 'size', 'padding'].map(function(k){
    return ret[k] = function(k){
      return function(it){
        if (!it) {
          return store[k];
        }
        store[k] = it;
        return ret;
      };
    }(k);
  });
  return ret;
};
plotd3.rwd.axis = function(){
  var store, axis, ret, k, v, render;
  store = {};
  axis = d3.svg.axis();
  ret = function(){
    return ret.autotick(this, arguments);
  };
  for (k in axis) {
    v = axis[k];
    if (typeof v === 'function') {
      ret[k] = fn$(k);
    }
  }
  ret.offset = function(){
    return this._offset;
  };
  render = function(group, sizes, offset, orient){
    var mid, node;
    mid = (sizes[0] + sizes[1]) / 2;
    group.select('text.label').remove();
    group.call(axis);
    group.selectAll('text').attr({
      "font-size": store.fontSize != null ? store.fontSize : void 8
    });
    if (orient === 'bottom') {
      setTimeout(function(){
        return group.selectAll('.tick text').attr({
          "dy": "0.71em"
        });
      }, 0);
    }
    if (store.label) {
      node = group.append('text').attr({
        'class': 'label'
      }).text(store.label);
      if (store.fontSize != null) {
        node.attr({
          "font-size": store.fontSize
        });
      }
      if (orient === 'bottom' || orient === 'top') {
        if (store.labelPosition === 'in') {
          return node.attr({
            transform: "translate(" + sizes[1] + " -3)",
            "text-anchor": "end"
          });
        } else {
          return node.attr({
            transform: "translate(" + mid + " " + (offset + 5) + ")",
            "text-anchor": "middle"
          });
        }
      } else {
        if (store.labelPosition === 'in') {
          return node.attr({
            transform: "translate(0 " + sizes[0] + ") rotate(-90)",
            dy: "1em",
            "text-anchor": "end"
          });
        } else {
          return node.attr({
            transform: "translate(" + (-offset - 5) + " " + mid + ") rotate(-90)",
            "text-anchor": "middle"
          });
        }
      }
    }
  };
  ret.autotick = function(group, args){
    var ref$, scale, orient, sizes, size, its, ots, tp, offset, format, ticks, tickHeight, count, step, gbox, pbox;
    args == null && (args = []);
    axis.apply(group, args);
    ref$ = [axis.scale(), axis.orient()], scale = ref$[0], orient = ref$[1];
    if (scale.rangeExtent) {
      sizes = scale.rangeExtent();
    } else {
      sizes = scale.range();
      sizes = [sizes[0], sizes[1]];
      sizes.sort(function(a, b){
        return a - b;
      });
    }
    size = Math.abs(sizes[1] - sizes[0]);
    ref$ = [axis.innerTickSize(), axis.outerTickSize(), axis.tickPadding()], its = ref$[0], ots = ref$[1], tp = ref$[2];
    offset = d3.max([its, ots]) + tp + 1;
    format = axis.tickFormat();
    ticks = scale.ticks
      ? axis.tickValues() || scale.ticks(axis.ticks())
      : scale.domain();
    if (orient === 'left' || orient === 'right') {
      tickHeight = d3.max(group.selectAll('.tick text')[0].map(function(d, i){
        return d.getBBox().height;
      }));
      count = size / (1.4 * tickHeight || 14);
      count = Math.ceil(ticks.length / count);
      ticks = ticks.filter(function(d, i){
        return !(i % count);
      });
      axis.tickValues(ticks);
      render(group, sizes, offset, orient);
      this._offset = d3.max(group.selectAll('.tick text')[0].map(function(d, i){
        return d.getBBox().width;
      }));
      this._offset += offset;
    } else {
      render(group, sizes, offset, orient);
      step = 1.15 * d3.max(group.selectAll('.tick text')[0].map(function(d, i){
        return d.getBBox().width;
      }));
      tickHeight = d3.max(group.selectAll('.tick text')[0].map(function(d, i){
        return d.getBBox().height;
      }));
      count = Math.ceil(ticks.length / (size / step));
      ticks = ticks.filter(function(d, i){
        return !(i % count);
      });
      axis.tickValues(ticks);
      this._offset = tickHeight + offset;
    }
    render(group, sizes, this._offset, orient);
    if (store.label && store.labelPosition !== 'in') {
      this._offset += group.select('text.label')[0][0].getBBox().height + 5;
    }
    if (store.boundaryTickInside) {
      gbox = group[0][0].getBBox();
      pbox = group.select('path')[0][0].getBBox();
      if (orient === 'left' || orient === 'right') {
        group.select('g.tick:first-of-type').attr({
          transform: function(){
            var origin;
            origin = d3.select(this).attr('transform');
            return origin + " translate(0 " + (-(pbox.y - gbox.y)) + ")";
          }
        });
        return group.select('g.tick:last-of-type').attr({
          transform: function(){
            var origin;
            origin = d3.select(this).attr('transform');
            return origin + " translate(0 " + (-((pbox.height - gbox.height) - (gbox.y - pbox.y))) + ")";
          }
        });
      } else if (orient === 'bottom' || orient === 'top') {
        group.select('g.tick:first-of-type text').style({
          "text-anchor": 'start'
        });
        return group.select('g.tick:last-of-type text').style({
          "text-anchor": 'end'
        });
      }
    }
  };
  ['fontSize', 'label', 'labelPosition', 'multiLine', 'boundaryTickInside'].map(function(k){
    return ret[k] = function(k){
      return function(it){
        if (it == null) {
          return store[k];
        }
        store[k] = it;
        return ret;
      };
    }(k);
  });
  return ret;
  function fn$(k){
    return function(){
      var r;
      r = axis[k].apply(axis, arguments);
      return r === axis ? ret : r;
    };
  }
};