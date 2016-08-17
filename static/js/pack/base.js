!function(e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else{if("function"==typeof define&&define.amd)return define([],e);(this||window).CodeMirror=e()}}(function(){"use strict";function e(r,n){if(!(this instanceof e))return new e(r,n);this.options=n=n?Fo(n):{},Fo(Jl,n,!1),d(n);var i=n.value;"string"==typeof i&&(i=new Ss(i,n.mode,null,n.lineSeparator)),this.doc=i;var o=new e.inputStyles[n.inputStyle](this),l=this.display=new t(r,i,o);l.wrapper.CodeMirror=this,u(this),s(this),n.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap"),n.autofocus&&!Wl&&l.input.focus(),m(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new Oo,keySeq:null,specialChars:null};var a=this;bl&&11>wl&&setTimeout(function(){a.display.input.reset(!0)},20),Ur(this),qo(),wr(this),this.curOp.forceUpdate=!0,qi(this,i),n.autofocus&&!Wl||a.hasFocus()?setTimeout(Ro(mn,this),20):yn(this);for(var c in es)es.hasOwnProperty(c)&&es[c](this,n[c],ts);C(this),n.finishInit&&n.finishInit(this);for(var h=0;h<os.length;++h)os[h](this);Cr(this),xl&&n.lineWrapping&&"optimizelegibility"==getComputedStyle(l.lineDiv).textRendering&&(l.lineDiv.style.textRendering="auto")}function t(e,t,r){var n=this;this.input=r,n.scrollbarFiller=Vo("div",null,"CodeMirror-scrollbar-filler"),n.scrollbarFiller.setAttribute("cm-not-content","true"),n.gutterFiller=Vo("div",null,"CodeMirror-gutter-filler"),n.gutterFiller.setAttribute("cm-not-content","true"),n.lineDiv=Vo("div",null,"CodeMirror-code"),n.selectionDiv=Vo("div",null,null,"position: relative; z-index: 1"),n.cursorDiv=Vo("div",null,"CodeMirror-cursors"),n.measure=Vo("div",null,"CodeMirror-measure"),n.lineMeasure=Vo("div",null,"CodeMirror-measure"),n.lineSpace=Vo("div",[n.measure,n.lineMeasure,n.selectionDiv,n.cursorDiv,n.lineDiv],null,"position: relative; outline: none"),n.mover=Vo("div",[Vo("div",[n.lineSpace],"CodeMirror-lines")],null,"position: relative"),n.sizer=Vo("div",[n.mover],"CodeMirror-sizer"),n.sizerWidth=null,n.heightForcer=Vo("div",null,null,"position: absolute; height: "+Ps+"px; width: 1px;"),n.gutters=Vo("div",null,"CodeMirror-gutters"),n.lineGutter=null,n.scroller=Vo("div",[n.sizer,n.heightForcer,n.gutters],"CodeMirror-scroll"),n.scroller.setAttribute("tabIndex","-1"),n.wrapper=Vo("div",[n.scrollbarFiller,n.gutterFiller,n.scroller],"CodeMirror"),bl&&8>wl&&(n.gutters.style.zIndex=-1,n.scroller.style.paddingRight=0),xl||vl&&Wl||(n.scroller.draggable=!0),e&&(e.appendChild?e.appendChild(n.wrapper):e(n.wrapper)),n.viewFrom=n.viewTo=t.first,n.reportedViewFrom=n.reportedViewTo=t.first,n.view=[],n.renderedView=null,n.externalMeasured=null,n.viewOffset=0,n.lastWrapHeight=n.lastWrapWidth=0,n.updateLineNumbers=null,n.nativeBarWidth=n.barHeight=n.barWidth=0,n.scrollbarsClipped=!1,n.lineNumWidth=n.lineNumInnerWidth=n.lineNumChars=null,n.alignWidgets=!1,n.cachedCharWidth=n.cachedTextHeight=n.cachedPaddingH=null,n.maxLine=null,n.maxLineLength=0,n.maxLineChanged=!1,n.wheelDX=n.wheelDY=n.wheelStartX=n.wheelStartY=null,n.shift=!1,n.selForContextMenu=null,n.activeTouch=null,r.init(n)}function r(t){t.doc.mode=e.getMode(t.options,t.doc.modeOption),n(t)}function n(e){e.doc.iter(function(e){e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null)}),e.doc.frontier=e.doc.first,Rt(e,100),e.state.modeGen++,e.curOp&&Er(e)}function i(e){e.options.lineWrapping?(Zs(e.display.wrapper,"CodeMirror-wrap"),e.display.sizer.style.minWidth="",e.display.sizerWidth=null):(qs(e.display.wrapper,"CodeMirror-wrap"),f(e)),l(e),Er(e),sr(e),setTimeout(function(){y(e)},100)}function o(e){var t=yr(e.display),r=e.options.lineWrapping,n=r&&Math.max(5,e.display.scroller.clientWidth/br(e.display)-3);return function(i){if(Ci(e.doc,i))return 0;var o=0;if(i.widgets)for(var l=0;l<i.widgets.length;l++)i.widgets[l].height&&(o+=i.widgets[l].height);return r?o+(Math.ceil(i.text.length/n)||1)*t:o+t}}function l(e){var t=e.doc,r=o(e);t.iter(function(e){var t=r(e);t!=e.height&&eo(e,t)})}function s(e){e.display.wrapper.className=e.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+e.options.theme.replace(/(^|\s)\s*/g," cm-s-"),sr(e)}function a(e){u(e),Er(e),setTimeout(function(){x(e)},20)}function u(e){var t=e.display.gutters,r=e.options.gutters;Ko(t);for(var n=0;n<r.length;++n){var i=r[n],o=t.appendChild(Vo("div",null,"CodeMirror-gutter "+i));"CodeMirror-linenumbers"==i&&(e.display.lineGutter=o,o.style.width=(e.display.lineNumWidth||1)+"px")}t.style.display=n?"":"none",c(e)}function c(e){var t=e.display.gutters.offsetWidth;e.display.sizer.style.marginLeft=t+"px"}function h(e){if(0==e.height)return 0;for(var t,r=e.text.length,n=e;t=gi(n);){var i=t.find(0,!0);n=i.from.line,r+=i.from.ch-i.to.ch}for(n=e;t=vi(n);){var i=t.find(0,!0);r-=n.text.length-i.from.ch,n=i.to.line,r+=n.text.length-i.to.ch}return r}function f(e){var t=e.display,r=e.doc;t.maxLine=Zi(r,r.first),t.maxLineLength=h(t.maxLine),t.maxLineChanged=!0,r.iter(function(e){var r=h(e);r>t.maxLineLength&&(t.maxLineLength=r,t.maxLine=e)})}function d(e){var t=Po(e.gutters,"CodeMirror-linenumbers");-1==t&&e.lineNumbers?e.gutters=e.gutters.concat(["CodeMirror-linenumbers"]):t>-1&&!e.lineNumbers&&(e.gutters=e.gutters.slice(0),e.gutters.splice(t,1))}function p(e){var t=e.display,r=t.gutters.offsetWidth,n=Math.round(e.doc.height+Kt(e.display));return{clientHeight:t.scroller.clientHeight,viewHeight:t.wrapper.clientHeight,scrollWidth:t.scroller.scrollWidth,clientWidth:t.scroller.clientWidth,viewWidth:t.wrapper.clientWidth,barLeft:e.options.fixedGutter?r:0,docHeight:n,scrollHeight:n+Xt(e)+t.barHeight,nativeBarWidth:t.nativeBarWidth,gutterWidth:r}}function g(e,t,r){this.cm=r;var n=this.vert=Vo("div",[Vo("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),i=this.horiz=Vo("div",[Vo("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");e(n),e(i),Ws(n,"scroll",function(){n.clientHeight&&t(n.scrollTop,"vertical")}),Ws(i,"scroll",function(){i.clientWidth&&t(i.scrollLeft,"horizontal")}),this.checkedZeroWidth=!1,bl&&8>wl&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")}function v(){}function m(t){t.display.scrollbars&&(t.display.scrollbars.clear(),t.display.scrollbars.addClass&&qs(t.display.wrapper,t.display.scrollbars.addClass)),t.display.scrollbars=new e.scrollbarModel[t.options.scrollbarStyle](function(e){t.display.wrapper.insertBefore(e,t.display.scrollbarFiller),Ws(e,"mousedown",function(){t.state.focused&&setTimeout(function(){t.display.input.focus()},0)}),e.setAttribute("cm-not-content","true")},function(e,r){"horizontal"==r?on(t,e):nn(t,e)},t),t.display.scrollbars.addClass&&Zs(t.display.wrapper,t.display.scrollbars.addClass)}function y(e,t){t||(t=p(e));var r=e.display.barWidth,n=e.display.barHeight;b(e,t);for(var i=0;4>i&&r!=e.display.barWidth||n!=e.display.barHeight;i++)r!=e.display.barWidth&&e.options.lineWrapping&&O(e),b(e,p(e)),r=e.display.barWidth,n=e.display.barHeight}function b(e,t){var r=e.display,n=r.scrollbars.update(t);r.sizer.style.paddingRight=(r.barWidth=n.right)+"px",r.sizer.style.paddingBottom=(r.barHeight=n.bottom)+"px",n.right&&n.bottom?(r.scrollbarFiller.style.display="block",r.scrollbarFiller.style.height=n.bottom+"px",r.scrollbarFiller.style.width=n.right+"px"):r.scrollbarFiller.style.display="",n.bottom&&e.options.coverGutterNextToScrollbar&&e.options.fixedGutter?(r.gutterFiller.style.display="block",r.gutterFiller.style.height=n.bottom+"px",r.gutterFiller.style.width=t.gutterWidth+"px"):r.gutterFiller.style.display=""}function w(e,t,r){var n=r&&null!=r.top?Math.max(0,r.top):e.scroller.scrollTop;n=Math.floor(n-Vt(e));var i=r&&null!=r.bottom?r.bottom:n+e.wrapper.clientHeight,o=ro(t,n),l=ro(t,i);if(r&&r.ensure){var s=r.ensure.from.line,a=r.ensure.to.line;o>s?(o=s,l=ro(t,no(Zi(t,s))+e.wrapper.clientHeight)):Math.min(a,t.lastLine())>=l&&(o=ro(t,no(Zi(t,a))-e.wrapper.clientHeight),l=a)}return{from:o,to:Math.max(l,o+1)}}function x(e){var t=e.display,r=t.view;if(t.alignWidgets||t.gutters.firstChild&&e.options.fixedGutter){for(var n=L(t)-t.scroller.scrollLeft+e.doc.scrollLeft,i=t.gutters.offsetWidth,o=n+"px",l=0;l<r.length;l++)if(!r[l].hidden){e.options.fixedGutter&&r[l].gutter&&(r[l].gutter.style.left=o);var s=r[l].alignable;if(s)for(var a=0;a<s.length;a++)s[a].style.left=o}e.options.fixedGutter&&(t.gutters.style.left=n+i+"px")}}function C(e){if(!e.options.lineNumbers)return!1;var t=e.doc,r=S(e.options,t.first+t.size-1),n=e.display;if(r.length!=n.lineNumChars){var i=n.measure.appendChild(Vo("div",[Vo("div",r)],"CodeMirror-linenumber CodeMirror-gutter-elt")),o=i.firstChild.offsetWidth,l=i.offsetWidth-o;return n.lineGutter.style.width="",n.lineNumInnerWidth=Math.max(o,n.lineGutter.offsetWidth-l)+1,n.lineNumWidth=n.lineNumInnerWidth+l,n.lineNumChars=n.lineNumInnerWidth?r.length:-1,n.lineGutter.style.width=n.lineNumWidth+"px",c(e),!0}return!1}function S(e,t){return String(e.lineNumberFormatter(t+e.firstLineNumber))}function L(e){return e.scroller.getBoundingClientRect().left-e.sizer.getBoundingClientRect().left}function T(e,t,r){var n=e.display;this.viewport=t,this.visible=w(n,e.doc,t),this.editorIsHidden=!n.wrapper.offsetWidth,this.wrapperHeight=n.wrapper.clientHeight,this.wrapperWidth=n.wrapper.clientWidth,this.oldDisplayWidth=Yt(e),this.force=r,this.dims=H(e),this.events=[]}function k(e){var t=e.display;!t.scrollbarsClipped&&t.scroller.offsetWidth&&(t.nativeBarWidth=t.scroller.offsetWidth-t.scroller.clientWidth,t.heightForcer.style.height=Xt(e)+"px",t.sizer.style.marginBottom=-t.nativeBarWidth+"px",t.sizer.style.borderRightWidth=Xt(e)+"px",t.scrollbarsClipped=!0)}function M(e,t){var r=e.display,n=e.doc;if(t.editorIsHidden)return zr(e),!1;if(!t.force&&t.visible.from>=r.viewFrom&&t.visible.to<=r.viewTo&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo)&&r.renderedView==r.view&&0==Gr(e))return!1;C(e)&&(zr(e),t.dims=H(e));var i=n.first+n.size,o=Math.max(t.visible.from-e.options.viewportMargin,n.first),l=Math.min(i,t.visible.to+e.options.viewportMargin);r.viewFrom<o&&o-r.viewFrom<20&&(o=Math.max(n.first,r.viewFrom)),r.viewTo>l&&r.viewTo-l<20&&(l=Math.min(i,r.viewTo)),Il&&(o=wi(e.doc,o),l=xi(e.doc,l));var s=o!=r.viewFrom||l!=r.viewTo||r.lastWrapHeight!=t.wrapperHeight||r.lastWrapWidth!=t.wrapperWidth;Br(e,o,l),r.viewOffset=no(Zi(e.doc,r.viewFrom)),e.display.mover.style.top=r.viewOffset+"px";var a=Gr(e);if(!s&&0==a&&!t.force&&r.renderedView==r.view&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo))return!1;var u=Xo();return a>4&&(r.lineDiv.style.display="none"),P(e,r.updateLineNumbers,t.dims),a>4&&(r.lineDiv.style.display=""),r.renderedView=r.view,u&&Xo()!=u&&u.offsetHeight&&u.focus(),Ko(r.cursorDiv),Ko(r.selectionDiv),r.gutters.style.height=r.sizer.style.minHeight=0,s&&(r.lastWrapHeight=t.wrapperHeight,r.lastWrapWidth=t.wrapperWidth,Rt(e,400)),r.updateLineNumbers=null,!0}function N(e,t){for(var r=t.viewport,n=!0;(n&&e.options.lineWrapping&&t.oldDisplayWidth!=Yt(e)||(r&&null!=r.top&&(r={top:Math.min(e.doc.height+Kt(e.display)-_t(e),r.top)}),t.visible=w(e.display,e.doc,r),!(t.visible.from>=e.display.viewFrom&&t.visible.to<=e.display.viewTo)))&&M(e,t);n=!1){O(e);var i=p(e);Pt(e),A(e,i),y(e,i)}t.signal(e,"update",e),(e.display.viewFrom!=e.display.reportedViewFrom||e.display.viewTo!=e.display.reportedViewTo)&&(t.signal(e,"viewportChange",e,e.display.viewFrom,e.display.viewTo),e.display.reportedViewFrom=e.display.viewFrom,e.display.reportedViewTo=e.display.viewTo)}function W(e,t){var r=new T(e,t);if(M(e,r)){O(e),N(e,r);var n=p(e);Pt(e),A(e,n),y(e,n),r.finish()}}function A(e,t){e.display.sizer.style.minHeight=t.docHeight+"px";var r=t.docHeight+e.display.barHeight;e.display.heightForcer.style.top=r+"px",e.display.gutters.style.height=Math.max(r+Xt(e),t.clientHeight)+"px"}function O(e){for(var t=e.display,r=t.lineDiv.offsetTop,n=0;n<t.view.length;n++){var i,o=t.view[n];if(!o.hidden){if(bl&&8>wl){var l=o.node.offsetTop+o.node.offsetHeight;i=l-r,r=l}else{var s=o.node.getBoundingClientRect();i=s.bottom-s.top}var a=o.line.height-i;if(2>i&&(i=yr(t)),(a>.001||-.001>a)&&(eo(o.line,i),D(o.line),o.rest))for(var u=0;u<o.rest.length;u++)D(o.rest[u])}}}function D(e){if(e.widgets)for(var t=0;t<e.widgets.length;++t)e.widgets[t].height=e.widgets[t].node.parentNode.offsetHeight}function H(e){for(var t=e.display,r={},n={},i=t.gutters.clientLeft,o=t.gutters.firstChild,l=0;o;o=o.nextSibling,++l)r[e.options.gutters[l]]=o.offsetLeft+o.clientLeft+i,n[e.options.gutters[l]]=o.clientWidth;return{fixedPos:L(t),gutterTotalWidth:t.gutters.offsetWidth,gutterLeft:r,gutterWidth:n,wrapperWidth:t.wrapper.clientWidth}}function P(e,t,r){function n(t){var r=t.nextSibling;return xl&&Al&&e.display.currentWheelTarget==t?t.style.display="none":t.parentNode.removeChild(t),r}for(var i=e.display,o=e.options.lineNumbers,l=i.lineDiv,s=l.firstChild,a=i.view,u=i.viewFrom,c=0;c<a.length;c++){var h=a[c];if(h.hidden);else if(h.node&&h.node.parentNode==l){for(;s!=h.node;)s=n(s);var f=o&&null!=t&&u>=t&&h.lineNumber;h.changes&&(Po(h.changes,"gutter")>-1&&(f=!1),E(e,h,u,r)),f&&(Ko(h.lineNumber),h.lineNumber.appendChild(document.createTextNode(S(e.options,u)))),s=h.node.nextSibling}else{var d=V(e,h,u,r);l.insertBefore(d,s)}u+=h.size}for(;s;)s=n(s)}function E(e,t,r,n){for(var i=0;i<t.changes.length;i++){var o=t.changes[i];"text"==o?R(e,t):"gutter"==o?G(e,t,r,n):"class"==o?B(t):"widget"==o&&U(e,t,n)}t.changes=null}function I(e){return e.node==e.text&&(e.node=Vo("div",null,null,"position: relative"),e.text.parentNode&&e.text.parentNode.replaceChild(e.node,e.text),e.node.appendChild(e.text),bl&&8>wl&&(e.node.style.zIndex=2)),e.node}function z(e){var t=e.bgClass?e.bgClass+" "+(e.line.bgClass||""):e.line.bgClass;if(t&&(t+=" CodeMirror-linebackground"),e.background)t?e.background.className=t:(e.background.parentNode.removeChild(e.background),e.background=null);else if(t){var r=I(e);e.background=r.insertBefore(Vo("div",null,t),r.firstChild)}}function F(e,t){var r=e.display.externalMeasured;return r&&r.line==t.line?(e.display.externalMeasured=null,t.measure=r.measure,r.built):Fi(e,t)}function R(e,t){var r=t.text.className,n=F(e,t);t.text==t.node&&(t.node=n.pre),t.text.parentNode.replaceChild(n.pre,t.text),t.text=n.pre,n.bgClass!=t.bgClass||n.textClass!=t.textClass?(t.bgClass=n.bgClass,t.textClass=n.textClass,B(t)):r&&(t.text.className=r)}function B(e){z(e),e.line.wrapClass?I(e).className=e.line.wrapClass:e.node!=e.text&&(e.node.className="");var t=e.textClass?e.textClass+" "+(e.line.textClass||""):e.line.textClass;e.text.className=t||""}function G(e,t,r,n){if(t.gutter&&(t.node.removeChild(t.gutter),t.gutter=null),t.gutterBackground&&(t.node.removeChild(t.gutterBackground),t.gutterBackground=null),t.line.gutterClass){var i=I(t);t.gutterBackground=Vo("div",null,"CodeMirror-gutter-background "+t.line.gutterClass,"left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px; width: "+n.gutterTotalWidth+"px"),i.insertBefore(t.gutterBackground,t.text)}var o=t.line.gutterMarkers;if(e.options.lineNumbers||o){var i=I(t),l=t.gutter=Vo("div",null,"CodeMirror-gutter-wrapper","left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px");if(e.display.input.setUneditable(l),i.insertBefore(l,t.text),t.line.gutterClass&&(l.className+=" "+t.line.gutterClass),!e.options.lineNumbers||o&&o["CodeMirror-linenumbers"]||(t.lineNumber=l.appendChild(Vo("div",S(e.options,r),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+n.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+e.display.lineNumInnerWidth+"px"))),o)for(var s=0;s<e.options.gutters.length;++s){var a=e.options.gutters[s],u=o.hasOwnProperty(a)&&o[a];u&&l.appendChild(Vo("div",[u],"CodeMirror-gutter-elt","left: "+n.gutterLeft[a]+"px; width: "+n.gutterWidth[a]+"px"))}}}function U(e,t,r){t.alignable&&(t.alignable=null);for(var n,i=t.node.firstChild;i;i=n){var n=i.nextSibling;"CodeMirror-linewidget"==i.className&&t.node.removeChild(i)}K(e,t,r)}function V(e,t,r,n){var i=F(e,t);return t.text=t.node=i.pre,i.bgClass&&(t.bgClass=i.bgClass),i.textClass&&(t.textClass=i.textClass),B(t),G(e,t,r,n),K(e,t,n),t.node}function K(e,t,r){if(j(e,t.line,t,r,!0),t.rest)for(var n=0;n<t.rest.length;n++)j(e,t.rest[n],t,r,!1)}function j(e,t,r,n,i){if(t.widgets)for(var o=I(r),l=0,s=t.widgets;l<s.length;++l){var a=s[l],u=Vo("div",[a.node],"CodeMirror-linewidget");a.handleMouseEvents||u.setAttribute("cm-ignore-events","true"),X(a,u,r,n),e.display.input.setUneditable(u),i&&a.above?o.insertBefore(u,r.gutter||r.text):o.appendChild(u),To(a,"redraw")}}function X(e,t,r,n){if(e.noHScroll){(r.alignable||(r.alignable=[])).push(t);var i=n.wrapperWidth;t.style.left=n.fixedPos+"px",e.coverGutter||(i-=n.gutterTotalWidth,t.style.paddingLeft=n.gutterTotalWidth+"px"),t.style.width=i+"px"}e.coverGutter&&(t.style.zIndex=5,t.style.position="relative",e.noHScroll||(t.style.marginLeft=-n.gutterTotalWidth+"px"))}function Y(e){return zl(e.line,e.ch)}function _(e,t){return Fl(e,t)<0?t:e}function $(e,t){return Fl(e,t)<0?e:t}function q(e){e.state.focused||(e.display.input.focus(),mn(e))}function Z(e,t,r,n,i){var o=e.doc;e.display.shift=!1,n||(n=o.sel);var l=e.state.pasteIncoming||"paste"==i,s=o.splitLines(t),a=null;if(l&&n.ranges.length>1)if(Rl&&Rl.join("\n")==t){if(n.ranges.length%Rl.length==0){a=[];for(var u=0;u<Rl.length;u++)a.push(o.splitLines(Rl[u]))}}else s.length==n.ranges.length&&(a=Eo(s,function(e){return[e]}));for(var u=n.ranges.length-1;u>=0;u--){var c=n.ranges[u],h=c.from(),f=c.to();c.empty()&&(r&&r>0?h=zl(h.line,h.ch-r):e.state.overwrite&&!l&&(f=zl(f.line,Math.min(Zi(o,f.line).text.length,f.ch+Ho(s).length))));var d=e.curOp.updateInput,p={from:h,to:f,text:a?a[u%a.length]:s,origin:i||(l?"paste":e.state.cutIncoming?"cut":"+input")};kn(e.doc,p),To(e,"inputRead",e,p)}t&&!l&&J(e,t),Fn(e),e.curOp.updateInput=d,e.curOp.typing=!0,e.state.pasteIncoming=e.state.cutIncoming=!1}function Q(e,t){var r=e.clipboardData&&e.clipboardData.getData("text/plain");return r?(e.preventDefault(),t.isReadOnly()||t.options.disableInput||Wr(t,function(){Z(t,r,0,null,"paste")}),!0):void 0}function J(e,t){if(e.options.electricChars&&e.options.smartIndent)for(var r=e.doc.sel,n=r.ranges.length-1;n>=0;n--){var i=r.ranges[n];if(!(i.head.ch>100||n&&r.ranges[n-1].head.line==i.head.line)){var o=e.getModeAt(i.head),l=!1;if(o.electricChars){for(var s=0;s<o.electricChars.length;s++)if(t.indexOf(o.electricChars.charAt(s))>-1){l=Bn(e,i.head.line,"smart");break}}else o.electricInput&&o.electricInput.test(Zi(e.doc,i.head.line).text.slice(0,i.head.ch))&&(l=Bn(e,i.head.line,"smart"));l&&To(e,"electricInput",e,i.head.line)}}}function et(e){for(var t=[],r=[],n=0;n<e.doc.sel.ranges.length;n++){var i=e.doc.sel.ranges[n].head.line,o={anchor:zl(i,0),head:zl(i+1,0)};r.push(o),t.push(e.getRange(o.anchor,o.head))}return{text:t,ranges:r}}function tt(e){e.setAttribute("autocorrect","off"),e.setAttribute("autocapitalize","off"),e.setAttribute("spellcheck","false")}function rt(e){this.cm=e,this.prevInput="",this.pollingFast=!1,this.polling=new Oo,this.inaccurateSelection=!1,this.hasSelection=!1,this.composing=null}function nt(){var e=Vo("textarea",null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),t=Vo("div",[e],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");return xl?e.style.width="1000px":e.setAttribute("wrap","off"),Nl&&(e.style.border="1px solid black"),tt(e),t}function it(e){this.cm=e,this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null,this.polling=new Oo,this.gracePeriod=!1}function ot(e,t){var r=Jt(e,t.line);if(!r||r.hidden)return null;var n=Zi(e.doc,t.line),i=qt(r,n,t.line),o=io(n),l="left";if(o){var s=cl(o,t.ch);l=s%2?"right":"left"}var a=rr(i.map,t.ch,l);return a.offset="right"==a.collapse?a.end:a.start,a}function lt(e,t){return t&&(e.bad=!0),e}function st(e,t,r){var n;if(t==e.display.lineDiv){if(n=e.display.lineDiv.childNodes[r],!n)return lt(e.clipPos(zl(e.display.viewTo-1)),!0);t=null,r=0}else for(n=t;;n=n.parentNode){if(!n||n==e.display.lineDiv)return null;if(n.parentNode&&n.parentNode==e.display.lineDiv)break}for(var i=0;i<e.display.view.length;i++){var o=e.display.view[i];if(o.node==n)return at(o,t,r)}}function at(e,t,r){function n(t,r,n){for(var i=-1;i<(c?c.length:0);i++)for(var o=0>i?u.map:c[i],l=0;l<o.length;l+=3){var s=o[l+2];if(s==t||s==r){var a=to(0>i?e.line:e.rest[i]),h=o[l]+n;return(0>n||s!=t)&&(h=o[l+(n?1:0)]),zl(a,h)}}}var i=e.text.firstChild,o=!1;if(!t||!Ys(i,t))return lt(zl(to(e.line),0),!0);if(t==i&&(o=!0,t=i.childNodes[r],r=0,!t)){var l=e.rest?Ho(e.rest):e.line;return lt(zl(to(l),l.text.length),o)}var s=3==t.nodeType?t:null,a=t;for(s||1!=t.childNodes.length||3!=t.firstChild.nodeType||(s=t.firstChild,r&&(r=s.nodeValue.length));a.parentNode!=i;)a=a.parentNode;var u=e.measure,c=u.maps,h=n(s,a,r);if(h)return lt(h,o);for(var f=a.nextSibling,d=s?s.nodeValue.length-r:0;f;f=f.nextSibling){if(h=n(f,f.firstChild,0))return lt(zl(h.line,h.ch-d),o);d+=f.textContent.length}for(var p=a.previousSibling,d=r;p;p=p.previousSibling){if(h=n(p,p.firstChild,-1))return lt(zl(h.line,h.ch+d),o);d+=f.textContent.length}}function ut(e,t,r,n,i){function o(e){return function(t){return t.id==e}}function l(t){if(1==t.nodeType){var r=t.getAttribute("cm-text");if(null!=r)return""==r&&(r=t.textContent.replace(/\u200b/g,"")),void(s+=r);var c,h=t.getAttribute("cm-marker");if(h){var f=e.findMarks(zl(n,0),zl(i+1,0),o(+h));return void(f.length&&(c=f[0].find())&&(s+=Qi(e.doc,c.from,c.to).join(u)))}if("false"==t.getAttribute("contenteditable"))return;for(var d=0;d<t.childNodes.length;d++)l(t.childNodes[d]);/^(pre|div|p)$/i.test(t.nodeName)&&(a=!0)}else if(3==t.nodeType){var p=t.nodeValue;if(!p)return;a&&(s+=u,a=!1),s+=p}}for(var s="",a=!1,u=e.doc.lineSeparator();l(t),t!=r;)t=t.nextSibling;return s}function ct(e,t){this.ranges=e,this.primIndex=t}function ht(e,t){this.anchor=e,this.head=t}function ft(e,t){var r=e[t];e.sort(function(e,t){return Fl(e.from(),t.from())}),t=Po(e,r);for(var n=1;n<e.length;n++){var i=e[n],o=e[n-1];if(Fl(o.to(),i.from())>=0){var l=$(o.from(),i.from()),s=_(o.to(),i.to()),a=o.empty()?i.from()==i.head:o.from()==o.head;t>=n&&--t,e.splice(--n,2,new ht(a?s:l,a?l:s))}}return new ct(e,t)}function dt(e,t){return new ct([new ht(e,t||e)],0)}function pt(e,t){return Math.max(e.first,Math.min(t,e.first+e.size-1))}function gt(e,t){if(t.line<e.first)return zl(e.first,0);var r=e.first+e.size-1;return t.line>r?zl(r,Zi(e,r).text.length):vt(t,Zi(e,t.line).text.length)}function vt(e,t){var r=e.ch;return null==r||r>t?zl(e.line,t):0>r?zl(e.line,0):e}function mt(e,t){return t>=e.first&&t<e.first+e.size}function yt(e,t){for(var r=[],n=0;n<t.length;n++)r[n]=gt(e,t[n]);return r}function bt(e,t,r,n){if(e.cm&&e.cm.display.shift||e.extend){var i=t.anchor;if(n){var o=Fl(r,i)<0;o!=Fl(n,i)<0?(i=r,r=n):o!=Fl(r,n)<0&&(r=n)}return new ht(i,r)}return new ht(n||r,r)}function wt(e,t,r,n){kt(e,new ct([bt(e,e.sel.primary(),t,r)],0),n)}function xt(e,t,r){for(var n=[],i=0;i<e.sel.ranges.length;i++)n[i]=bt(e,e.sel.ranges[i],t[i],null);var o=ft(n,e.sel.primIndex);kt(e,o,r)}function Ct(e,t,r,n){var i=e.sel.ranges.slice(0);i[t]=r,kt(e,ft(i,e.sel.primIndex),n)}function St(e,t,r,n){kt(e,dt(t,r),n)}function Lt(e,t,r){var n={ranges:t.ranges,update:function(t){this.ranges=[];for(var r=0;r<t.length;r++)this.ranges[r]=new ht(gt(e,t[r].anchor),gt(e,t[r].head))},origin:r&&r.origin};return Ds(e,"beforeSelectionChange",e,n),e.cm&&Ds(e.cm,"beforeSelectionChange",e.cm,n),n.ranges!=t.ranges?ft(n.ranges,n.ranges.length-1):t}function Tt(e,t,r){var n=e.history.done,i=Ho(n);i&&i.ranges?(n[n.length-1]=t,Mt(e,t,r)):kt(e,t,r)}function kt(e,t,r){Mt(e,t,r),ho(e,e.sel,e.cm?e.cm.curOp.id:0/0,r)}function Mt(e,t,r){(Wo(e,"beforeSelectionChange")||e.cm&&Wo(e.cm,"beforeSelectionChange"))&&(t=Lt(e,t,r));var n=r&&r.bias||(Fl(t.primary().head,e.sel.primary().head)<0?-1:1);Nt(e,At(e,t,n,!0)),r&&r.scroll===!1||!e.cm||Fn(e.cm)}function Nt(e,t){t.equals(e.sel)||(e.sel=t,e.cm&&(e.cm.curOp.updateInput=e.cm.curOp.selectionChanged=!0,No(e.cm)),To(e,"cursorActivity",e))}function Wt(e){Nt(e,At(e,e.sel,null,!1),Is)}function At(e,t,r,n){for(var i,o=0;o<t.ranges.length;o++){var l=t.ranges[o],s=t.ranges.length==e.sel.ranges.length&&e.sel.ranges[o],a=Dt(e,l.anchor,s&&s.anchor,r,n),u=Dt(e,l.head,s&&s.head,r,n);(i||a!=l.anchor||u!=l.head)&&(i||(i=t.ranges.slice(0,o)),i[o]=new ht(a,u))}return i?ft(i,t.primIndex):t}function Ot(e,t,r,n,i){var o=Zi(e,t.line);if(o.markedSpans)for(var l=0;l<o.markedSpans.length;++l){var s=o.markedSpans[l],a=s.marker;if((null==s.from||(a.inclusiveLeft?s.from<=t.ch:s.from<t.ch))&&(null==s.to||(a.inclusiveRight?s.to>=t.ch:s.to>t.ch))){if(i&&(Ds(a,"beforeCursorEnter"),a.explicitlyCleared)){if(o.markedSpans){--l;continue}break}if(!a.atomic)continue;if(r){var u,c=a.find(0>n?1:-1);if((0>n?a.inclusiveRight:a.inclusiveLeft)&&(c=Ht(e,c,-n,o)),c&&c.line==t.line&&(u=Fl(c,r))&&(0>n?0>u:u>0))return Ot(e,c,t,n,i)}var h=a.find(0>n?-1:1);return(0>n?a.inclusiveLeft:a.inclusiveRight)&&(h=Ht(e,h,n,o)),h?Ot(e,h,t,n,i):null}}return t}function Dt(e,t,r,n,i){var o=n||1,l=Ot(e,t,r,o,i)||!i&&Ot(e,t,r,o,!0)||Ot(e,t,r,-o,i)||!i&&Ot(e,t,r,-o,!0);return l?l:(e.cantEdit=!0,zl(e.first,0))}function Ht(e,t,r,n){return 0>r&&0==t.ch?t.line>e.first?gt(e,zl(t.line-1)):null:r>0&&t.ch==(n||Zi(e,t.line)).text.length?t.line<e.first+e.size-1?zl(t.line+1,0):null:new zl(t.line,t.ch+r)}function Pt(e){e.display.input.showSelection(e.display.input.prepareSelection())}function Et(e,t){for(var r=e.doc,n={},i=n.cursors=document.createDocumentFragment(),o=n.selection=document.createDocumentFragment(),l=0;l<r.sel.ranges.length;l++)if(t!==!1||l!=r.sel.primIndex){var s=r.sel.ranges[l],a=s.empty();(a||e.options.showCursorWhenSelecting)&&It(e,s.head,i),a||zt(e,s,o)}return n}function It(e,t,r){var n=dr(e,t,"div",null,null,!e.options.singleCursorHeightPerLine),i=r.appendChild(Vo("div"," ","CodeMirror-cursor"));if(i.style.left=n.left+"px",i.style.top=n.top+"px",i.style.height=Math.max(0,n.bottom-n.top)*e.options.cursorHeight+"px",n.other){var o=r.appendChild(Vo("div"," ","CodeMirror-cursor CodeMirror-secondarycursor"));o.style.display="",o.style.left=n.other.left+"px",o.style.top=n.other.top+"px",o.style.height=.85*(n.other.bottom-n.other.top)+"px"}}function zt(e,t,r){function n(e,t,r,n){0>t&&(t=0),t=Math.round(t),n=Math.round(n),s.appendChild(Vo("div",null,"CodeMirror-selected","position: absolute; left: "+e+"px; top: "+t+"px; width: "+(null==r?c-e:r)+"px; height: "+(n-t)+"px"))}function i(t,r,i){function o(r,n){return fr(e,zl(t,r),"div",h,n)}var s,a,h=Zi(l,t),f=h.text.length;return tl(io(h),r||0,null==i?f:i,function(e,t,l){var h,d,p,g=o(e,"left");if(e==t)h=g,d=p=g.left;else{if(h=o(t-1,"right"),"rtl"==l){var v=g;g=h,h=v}d=g.left,p=h.right}null==r&&0==e&&(d=u),h.top-g.top>3&&(n(d,g.top,null,g.bottom),d=u,g.bottom<h.top&&n(d,g.bottom,null,h.top)),null==i&&t==f&&(p=c),(!s||g.top<s.top||g.top==s.top&&g.left<s.left)&&(s=g),(!a||h.bottom>a.bottom||h.bottom==a.bottom&&h.right>a.right)&&(a=h),u+1>d&&(d=u),n(d,h.top,p-d,h.bottom)}),{start:s,end:a}}var o=e.display,l=e.doc,s=document.createDocumentFragment(),a=jt(e.display),u=a.left,c=Math.max(o.sizerWidth,Yt(e)-o.sizer.offsetLeft)-a.right,h=t.from(),f=t.to();if(h.line==f.line)i(h.line,h.ch,f.ch);else{var d=Zi(l,h.line),p=Zi(l,f.line),g=yi(d)==yi(p),v=i(h.line,h.ch,g?d.text.length+1:null).end,m=i(f.line,g?0:null,f.ch).start;g&&(v.top<m.top-2?(n(v.right,v.top,null,v.bottom),n(u,m.top,m.left,m.bottom)):n(v.right,v.top,m.left-v.right,v.bottom)),v.bottom<m.top&&n(u,v.bottom,null,m.top)}r.appendChild(s)}function Ft(e){if(e.state.focused){var t=e.display;clearInterval(t.blinker);var r=!0;t.cursorDiv.style.visibility="",e.options.cursorBlinkRate>0?t.blinker=setInterval(function(){t.cursorDiv.style.visibility=(r=!r)?"":"hidden"},e.options.cursorBlinkRate):e.options.cursorBlinkRate<0&&(t.cursorDiv.style.visibility="hidden")}}function Rt(e,t){e.doc.mode.startState&&e.doc.frontier<e.display.viewTo&&e.state.highlight.set(t,Ro(Bt,e))}function Bt(e){var t=e.doc;if(t.frontier<t.first&&(t.frontier=t.first),!(t.frontier>=e.display.viewTo)){var r=+new Date+e.options.workTime,n=ss(t.mode,Ut(e,t.frontier)),i=[];t.iter(t.frontier,Math.min(t.first+t.size,e.display.viewTo+500),function(o){if(t.frontier>=e.display.viewFrom){var l=o.styles,s=o.text.length>e.options.maxHighlightLength,a=Pi(e,o,s?ss(t.mode,n):n,!0);o.styles=a.styles;var u=o.styleClasses,c=a.classes;c?o.styleClasses=c:u&&(o.styleClasses=null);for(var h=!l||l.length!=o.styles.length||u!=c&&(!u||!c||u.bgClass!=c.bgClass||u.textClass!=c.textClass),f=0;!h&&f<l.length;++f)h=l[f]!=o.styles[f];h&&i.push(t.frontier),o.stateAfter=s?n:ss(t.mode,n)}else o.text.length<=e.options.maxHighlightLength&&Ii(e,o.text,n),o.stateAfter=t.frontier%5==0?ss(t.mode,n):null;return++t.frontier,+new Date>r?(Rt(e,e.options.workDelay),!0):void 0}),i.length&&Wr(e,function(){for(var t=0;t<i.length;t++)Ir(e,i[t],"text")})}}function Gt(e,t,r){for(var n,i,o=e.doc,l=r?-1:t-(e.doc.mode.innerMode?1e3:100),s=t;s>l;--s){if(s<=o.first)return o.first;var a=Zi(o,s-1);if(a.stateAfter&&(!r||s<=o.frontier))return s;var u=Rs(a.text,null,e.options.tabSize);(null==i||n>u)&&(i=s-1,n=u)}return i}function Ut(e,t,r){var n=e.doc,i=e.display;if(!n.mode.startState)return!0;var o=Gt(e,t,r),l=o>n.first&&Zi(n,o-1).stateAfter;return l=l?ss(n.mode,l):as(n.mode),n.iter(o,t,function(r){Ii(e,r.text,l);var s=o==t-1||o%5==0||o>=i.viewFrom&&o<i.viewTo;r.stateAfter=s?ss(n.mode,l):null,++o}),r&&(n.frontier=o),l}function Vt(e){return e.lineSpace.offsetTop}function Kt(e){return e.mover.offsetHeight-e.lineSpace.offsetHeight}function jt(e){if(e.cachedPaddingH)return e.cachedPaddingH;var t=jo(e.measure,Vo("pre","x")),r=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,n={left:parseInt(r.paddingLeft),right:parseInt(r.paddingRight)};return isNaN(n.left)||isNaN(n.right)||(e.cachedPaddingH=n),n}function Xt(e){return Ps-e.display.nativeBarWidth}function Yt(e){return e.display.scroller.clientWidth-Xt(e)-e.display.barWidth}function _t(e){return e.display.scroller.clientHeight-Xt(e)-e.display.barHeight}function $t(e,t,r){var n=e.options.lineWrapping,i=n&&Yt(e);if(!t.measure.heights||n&&t.measure.width!=i){var o=t.measure.heights=[];if(n){t.measure.width=i;for(var l=t.text.firstChild.getClientRects(),s=0;s<l.length-1;s++){var a=l[s],u=l[s+1];Math.abs(a.bottom-u.bottom)>2&&o.push((a.bottom+u.top)/2-r.top)}}o.push(r.bottom-r.top)}}function qt(e,t,r){if(e.line==t)return{map:e.measure.map,cache:e.measure.cache};for(var n=0;n<e.rest.length;n++)if(e.rest[n]==t)return{map:e.measure.maps[n],cache:e.measure.caches[n]};for(var n=0;n<e.rest.length;n++)if(to(e.rest[n])>r)return{map:e.measure.maps[n],cache:e.measure.caches[n],before:!0}}function Zt(e,t){t=yi(t);var r=to(t),n=e.display.externalMeasured=new Hr(e.doc,t,r);n.lineN=r;var i=n.built=Fi(e,n);return n.text=i.pre,jo(e.display.lineMeasure,i.pre),n}function Qt(e,t,r,n){return tr(e,er(e,t),r,n)}function Jt(e,t){if(t>=e.display.viewFrom&&t<e.display.viewTo)return e.display.view[Fr(e,t)];var r=e.display.externalMeasured;return r&&t>=r.lineN&&t<r.lineN+r.size?r:void 0}function er(e,t){var r=to(t),n=Jt(e,r);n&&!n.text?n=null:n&&n.changes&&(E(e,n,r,H(e)),e.curOp.forceUpdate=!0),n||(n=Zt(e,t));var i=qt(n,t,r);return{line:t,view:n,rect:null,map:i.map,cache:i.cache,before:i.before,hasHeights:!1}}function tr(e,t,r,n,i){t.before&&(r=-1);var o,l=r+(n||"");return t.cache.hasOwnProperty(l)?o=t.cache[l]:(t.rect||(t.rect=t.view.text.getBoundingClientRect()),t.hasHeights||($t(e,t.view,t.rect),t.hasHeights=!0),o=nr(e,t,r,n),o.bogus||(t.cache[l]=o)),{left:o.left,right:o.right,top:i?o.rtop:o.top,bottom:i?o.rbottom:o.bottom}}function rr(e,t,r){for(var n,i,o,l,s=0;s<e.length;s+=3){var a=e[s],u=e[s+1];if(a>t?(i=0,o=1,l="left"):u>t?(i=t-a,o=i+1):(s==e.length-3||t==u&&e[s+3]>t)&&(o=u-a,i=o-1,t>=u&&(l="right")),null!=i){if(n=e[s+2],a==u&&r==(n.insertLeft?"left":"right")&&(l=r),"left"==r&&0==i)for(;s&&e[s-2]==e[s-3]&&e[s-1].insertLeft;)n=e[(s-=3)+2],l="left";if("right"==r&&i==u-a)for(;s<e.length-3&&e[s+3]==e[s+4]&&!e[s+5].insertLeft;)n=e[(s+=3)+2],l="right";
break}}return{node:n,start:i,end:o,collapse:l,coverStart:a,coverEnd:u}}function nr(e,t,r,n){var i,o=rr(t.map,r,n),l=o.node,s=o.start,a=o.end,u=o.collapse;if(3==l.nodeType){for(var c=0;4>c;c++){for(;s&&Uo(t.line.text.charAt(o.coverStart+s));)--s;for(;o.coverStart+a<o.coverEnd&&Uo(t.line.text.charAt(o.coverStart+a));)++a;if(bl&&9>wl&&0==s&&a==o.coverEnd-o.coverStart)i=l.parentNode.getBoundingClientRect();else if(bl&&e.options.lineWrapping){var h=Vs(l,s,a).getClientRects();i=h.length?h["right"==n?h.length-1:0]:Vl}else i=Vs(l,s,a).getBoundingClientRect()||Vl;if(i.left||i.right||0==s)break;a=s,s-=1,u="right"}bl&&11>wl&&(i=ir(e.display.measure,i))}else{s>0&&(u=n="right");var h;i=e.options.lineWrapping&&(h=l.getClientRects()).length>1?h["right"==n?h.length-1:0]:l.getBoundingClientRect()}if(bl&&9>wl&&!s&&(!i||!i.left&&!i.right)){var f=l.parentNode.getClientRects()[0];i=f?{left:f.left,right:f.left+br(e.display),top:f.top,bottom:f.bottom}:Vl}for(var d=i.top-t.rect.top,p=i.bottom-t.rect.top,g=(d+p)/2,v=t.view.measure.heights,c=0;c<v.length-1&&!(g<v[c]);c++);var m=c?v[c-1]:0,y=v[c],b={left:("right"==u?i.right:i.left)-t.rect.left,right:("left"==u?i.left:i.right)-t.rect.left,top:m,bottom:y};return i.left||i.right||(b.bogus=!0),e.options.singleCursorHeightPerLine||(b.rtop=d,b.rbottom=p),b}function ir(e,t){if(!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI||!el(e))return t;var r=screen.logicalXDPI/screen.deviceXDPI,n=screen.logicalYDPI/screen.deviceYDPI;return{left:t.left*r,right:t.right*r,top:t.top*n,bottom:t.bottom*n}}function or(e){if(e.measure&&(e.measure.cache={},e.measure.heights=null,e.rest))for(var t=0;t<e.rest.length;t++)e.measure.caches[t]={}}function lr(e){e.display.externalMeasure=null,Ko(e.display.lineMeasure);for(var t=0;t<e.display.view.length;t++)or(e.display.view[t])}function sr(e){lr(e),e.display.cachedCharWidth=e.display.cachedTextHeight=e.display.cachedPaddingH=null,e.options.lineWrapping||(e.display.maxLineChanged=!0),e.display.lineNumChars=null}function ar(){return window.pageXOffset||(document.documentElement||document.body).scrollLeft}function ur(){return window.pageYOffset||(document.documentElement||document.body).scrollTop}function cr(e,t,r,n){if(t.widgets)for(var i=0;i<t.widgets.length;++i)if(t.widgets[i].above){var o=Ti(t.widgets[i]);r.top+=o,r.bottom+=o}if("line"==n)return r;n||(n="local");var l=no(t);if("local"==n?l+=Vt(e.display):l-=e.display.viewOffset,"page"==n||"window"==n){var s=e.display.lineSpace.getBoundingClientRect();l+=s.top+("window"==n?0:ur());var a=s.left+("window"==n?0:ar());r.left+=a,r.right+=a}return r.top+=l,r.bottom+=l,r}function hr(e,t,r){if("div"==r)return t;var n=t.left,i=t.top;if("page"==r)n-=ar(),i-=ur();else if("local"==r||!r){var o=e.display.sizer.getBoundingClientRect();n+=o.left,i+=o.top}var l=e.display.lineSpace.getBoundingClientRect();return{left:n-l.left,top:i-l.top}}function fr(e,t,r,n,i){return n||(n=Zi(e.doc,t.line)),cr(e,n,Qt(e,n,t.ch,i),r)}function dr(e,t,r,n,i,o){function l(t,l){var s=tr(e,i,t,l?"right":"left",o);return l?s.left=s.right:s.right=s.left,cr(e,n,s,r)}function s(e,t){var r=a[t],n=r.level%2;return e==rl(r)&&t&&r.level<a[t-1].level?(r=a[--t],e=nl(r)-(r.level%2?0:1),n=!0):e==nl(r)&&t<a.length-1&&r.level<a[t+1].level&&(r=a[++t],e=rl(r)-r.level%2,n=!1),n&&e==r.to&&e>r.from?l(e-1):l(e,n)}n=n||Zi(e.doc,t.line),i||(i=er(e,n));var a=io(n),u=t.ch;if(!a)return l(u);var c=cl(a,u),h=s(u,c);return null!=oa&&(h.other=s(u,oa)),h}function pr(e,t){var r=0,t=gt(e.doc,t);e.options.lineWrapping||(r=br(e.display)*t.ch);var n=Zi(e.doc,t.line),i=no(n)+Vt(e.display);return{left:r,right:r,top:i,bottom:i+n.height}}function gr(e,t,r,n){var i=zl(e,t);return i.xRel=n,r&&(i.outside=!0),i}function vr(e,t,r){var n=e.doc;if(r+=e.display.viewOffset,0>r)return gr(n.first,0,!0,-1);var i=ro(n,r),o=n.first+n.size-1;if(i>o)return gr(n.first+n.size-1,Zi(n,o).text.length,!0,1);0>t&&(t=0);for(var l=Zi(n,i);;){var s=mr(e,l,i,t,r),a=vi(l),u=a&&a.find(0,!0);if(!a||!(s.ch>u.from.ch||s.ch==u.from.ch&&s.xRel>0))return s;i=to(l=u.to.line)}}function mr(e,t,r,n,i){function o(n){var i=dr(e,zl(r,n),"line",t,u);return s=!0,l>i.bottom?i.left-a:l<i.top?i.left+a:(s=!1,i.left)}var l=i-no(t),s=!1,a=2*e.display.wrapper.clientWidth,u=er(e,t),c=io(t),h=t.text.length,f=il(t),d=ol(t),p=o(f),g=s,v=o(d),m=s;if(n>v)return gr(r,d,m,1);for(;;){if(c?d==f||d==fl(t,f,1):1>=d-f){for(var y=p>n||v-n>=n-p?f:d,b=n-(y==f?p:v);Uo(t.text.charAt(y));)++y;var w=gr(r,y,y==f?g:m,-1>b?-1:b>1?1:0);return w}var x=Math.ceil(h/2),C=f+x;if(c){C=f;for(var S=0;x>S;++S)C=fl(t,C,1)}var L=o(C);L>n?(d=C,v=L,(m=s)&&(v+=1e3),h=x):(f=C,p=L,g=s,h-=x)}}function yr(e){if(null!=e.cachedTextHeight)return e.cachedTextHeight;if(null==Bl){Bl=Vo("pre");for(var t=0;49>t;++t)Bl.appendChild(document.createTextNode("x")),Bl.appendChild(Vo("br"));Bl.appendChild(document.createTextNode("x"))}jo(e.measure,Bl);var r=Bl.offsetHeight/50;return r>3&&(e.cachedTextHeight=r),Ko(e.measure),r||1}function br(e){if(null!=e.cachedCharWidth)return e.cachedCharWidth;var t=Vo("span","xxxxxxxxxx"),r=Vo("pre",[t]);jo(e.measure,r);var n=t.getBoundingClientRect(),i=(n.right-n.left)/10;return i>2&&(e.cachedCharWidth=i),i||10}function wr(e){e.curOp={cm:e,viewChanged:!1,startHeight:e.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++jl},Kl?Kl.ops.push(e.curOp):e.curOp.ownsGroup=Kl={ops:[e.curOp],delayedCallbacks:[]}}function xr(e){var t=e.delayedCallbacks,r=0;do{for(;r<t.length;r++)t[r].call(null);for(var n=0;n<e.ops.length;n++){var i=e.ops[n];if(i.cursorActivityHandlers)for(;i.cursorActivityCalled<i.cursorActivityHandlers.length;)i.cursorActivityHandlers[i.cursorActivityCalled++].call(null,i.cm)}}while(r<t.length)}function Cr(e){var t=e.curOp,r=t.ownsGroup;if(r)try{xr(r)}finally{Kl=null;for(var n=0;n<r.ops.length;n++)r.ops[n].cm.curOp=null;Sr(r)}}function Sr(e){for(var t=e.ops,r=0;r<t.length;r++)Lr(t[r]);for(var r=0;r<t.length;r++)Tr(t[r]);for(var r=0;r<t.length;r++)kr(t[r]);for(var r=0;r<t.length;r++)Mr(t[r]);for(var r=0;r<t.length;r++)Nr(t[r])}function Lr(e){var t=e.cm,r=t.display;k(t),e.updateMaxLine&&f(t),e.mustUpdate=e.viewChanged||e.forceUpdate||null!=e.scrollTop||e.scrollToPos&&(e.scrollToPos.from.line<r.viewFrom||e.scrollToPos.to.line>=r.viewTo)||r.maxLineChanged&&t.options.lineWrapping,e.update=e.mustUpdate&&new T(t,e.mustUpdate&&{top:e.scrollTop,ensure:e.scrollToPos},e.forceUpdate)}function Tr(e){e.updatedDisplay=e.mustUpdate&&M(e.cm,e.update)}function kr(e){var t=e.cm,r=t.display;e.updatedDisplay&&O(t),e.barMeasure=p(t),r.maxLineChanged&&!t.options.lineWrapping&&(e.adjustWidthTo=Qt(t,r.maxLine,r.maxLine.text.length).left+3,t.display.sizerWidth=e.adjustWidthTo,e.barMeasure.scrollWidth=Math.max(r.scroller.clientWidth,r.sizer.offsetLeft+e.adjustWidthTo+Xt(t)+t.display.barWidth),e.maxScrollLeft=Math.max(0,r.sizer.offsetLeft+e.adjustWidthTo-Yt(t))),(e.updatedDisplay||e.selectionChanged)&&(e.preparedSelection=r.input.prepareSelection())}function Mr(e){var t=e.cm;null!=e.adjustWidthTo&&(t.display.sizer.style.minWidth=e.adjustWidthTo+"px",e.maxScrollLeft<t.doc.scrollLeft&&on(t,Math.min(t.display.scroller.scrollLeft,e.maxScrollLeft),!0),t.display.maxLineChanged=!1),e.preparedSelection&&t.display.input.showSelection(e.preparedSelection),e.updatedDisplay&&A(t,e.barMeasure),(e.updatedDisplay||e.startHeight!=t.doc.height)&&y(t,e.barMeasure),e.selectionChanged&&Ft(t),t.state.focused&&e.updateInput&&t.display.input.reset(e.typing),!e.focus||e.focus!=Xo()||document.hasFocus&&!document.hasFocus()||q(e.cm)}function Nr(e){var t=e.cm,r=t.display,n=t.doc;if(e.updatedDisplay&&N(t,e.update),null==r.wheelStartX||null==e.scrollTop&&null==e.scrollLeft&&!e.scrollToPos||(r.wheelStartX=r.wheelStartY=null),null==e.scrollTop||r.scroller.scrollTop==e.scrollTop&&!e.forceScroll||(n.scrollTop=Math.max(0,Math.min(r.scroller.scrollHeight-r.scroller.clientHeight,e.scrollTop)),r.scrollbars.setScrollTop(n.scrollTop),r.scroller.scrollTop=n.scrollTop),null==e.scrollLeft||r.scroller.scrollLeft==e.scrollLeft&&!e.forceScroll||(n.scrollLeft=Math.max(0,Math.min(r.scroller.scrollWidth-Yt(t),e.scrollLeft)),r.scrollbars.setScrollLeft(n.scrollLeft),r.scroller.scrollLeft=n.scrollLeft,x(t)),e.scrollToPos){var i=Pn(t,gt(n,e.scrollToPos.from),gt(n,e.scrollToPos.to),e.scrollToPos.margin);e.scrollToPos.isCursor&&t.state.focused&&Hn(t,i)}var o=e.maybeHiddenMarkers,l=e.maybeUnhiddenMarkers;if(o)for(var s=0;s<o.length;++s)o[s].lines.length||Ds(o[s],"hide");if(l)for(var s=0;s<l.length;++s)l[s].lines.length&&Ds(l[s],"unhide");r.wrapper.offsetHeight&&(n.scrollTop=t.display.scroller.scrollTop),e.changeObjs&&Ds(t,"changes",t,e.changeObjs),e.update&&e.update.finish()}function Wr(e,t){if(e.curOp)return t();wr(e);try{return t()}finally{Cr(e)}}function Ar(e,t){return function(){if(e.curOp)return t.apply(e,arguments);wr(e);try{return t.apply(e,arguments)}finally{Cr(e)}}}function Or(e){return function(){if(this.curOp)return e.apply(this,arguments);wr(this);try{return e.apply(this,arguments)}finally{Cr(this)}}}function Dr(e){return function(){var t=this.cm;if(!t||t.curOp)return e.apply(this,arguments);wr(t);try{return e.apply(this,arguments)}finally{Cr(t)}}}function Hr(e,t,r){this.line=t,this.rest=bi(t),this.size=this.rest?to(Ho(this.rest))-r+1:1,this.node=this.text=null,this.hidden=Ci(e,t)}function Pr(e,t,r){for(var n,i=[],o=t;r>o;o=n){var l=new Hr(e.doc,Zi(e.doc,o),o);n=o+l.size,i.push(l)}return i}function Er(e,t,r,n){null==t&&(t=e.doc.first),null==r&&(r=e.doc.first+e.doc.size),n||(n=0);var i=e.display;if(n&&r<i.viewTo&&(null==i.updateLineNumbers||i.updateLineNumbers>t)&&(i.updateLineNumbers=t),e.curOp.viewChanged=!0,t>=i.viewTo)Il&&wi(e.doc,t)<i.viewTo&&zr(e);else if(r<=i.viewFrom)Il&&xi(e.doc,r+n)>i.viewFrom?zr(e):(i.viewFrom+=n,i.viewTo+=n);else if(t<=i.viewFrom&&r>=i.viewTo)zr(e);else if(t<=i.viewFrom){var o=Rr(e,r,r+n,1);o?(i.view=i.view.slice(o.index),i.viewFrom=o.lineN,i.viewTo+=n):zr(e)}else if(r>=i.viewTo){var o=Rr(e,t,t,-1);o?(i.view=i.view.slice(0,o.index),i.viewTo=o.lineN):zr(e)}else{var l=Rr(e,t,t,-1),s=Rr(e,r,r+n,1);l&&s?(i.view=i.view.slice(0,l.index).concat(Pr(e,l.lineN,s.lineN)).concat(i.view.slice(s.index)),i.viewTo+=n):zr(e)}var a=i.externalMeasured;a&&(r<a.lineN?a.lineN+=n:t<a.lineN+a.size&&(i.externalMeasured=null))}function Ir(e,t,r){e.curOp.viewChanged=!0;var n=e.display,i=e.display.externalMeasured;if(i&&t>=i.lineN&&t<i.lineN+i.size&&(n.externalMeasured=null),!(t<n.viewFrom||t>=n.viewTo)){var o=n.view[Fr(e,t)];if(null!=o.node){var l=o.changes||(o.changes=[]);-1==Po(l,r)&&l.push(r)}}}function zr(e){e.display.viewFrom=e.display.viewTo=e.doc.first,e.display.view=[],e.display.viewOffset=0}function Fr(e,t){if(t>=e.display.viewTo)return null;if(t-=e.display.viewFrom,0>t)return null;for(var r=e.display.view,n=0;n<r.length;n++)if(t-=r[n].size,0>t)return n}function Rr(e,t,r,n){var i,o=Fr(e,t),l=e.display.view;if(!Il||r==e.doc.first+e.doc.size)return{index:o,lineN:r};for(var s=0,a=e.display.viewFrom;o>s;s++)a+=l[s].size;if(a!=t){if(n>0){if(o==l.length-1)return null;i=a+l[o].size-t,o++}else i=a-t;t+=i,r+=i}for(;wi(e.doc,r)!=r;){if(o==(0>n?0:l.length-1))return null;r+=n*l[o-(0>n?1:0)].size,o+=n}return{index:o,lineN:r}}function Br(e,t,r){var n=e.display,i=n.view;0==i.length||t>=n.viewTo||r<=n.viewFrom?(n.view=Pr(e,t,r),n.viewFrom=t):(n.viewFrom>t?n.view=Pr(e,t,n.viewFrom).concat(n.view):n.viewFrom<t&&(n.view=n.view.slice(Fr(e,t))),n.viewFrom=t,n.viewTo<r?n.view=n.view.concat(Pr(e,n.viewTo,r)):n.viewTo>r&&(n.view=n.view.slice(0,Fr(e,r)))),n.viewTo=r}function Gr(e){for(var t=e.display.view,r=0,n=0;n<t.length;n++){var i=t[n];i.hidden||i.node&&!i.changes||++r}return r}function Ur(e){function t(){i.activeTouch&&(o=setTimeout(function(){i.activeTouch=null},1e3),l=i.activeTouch,l.end=+new Date)}function r(e){if(1!=e.touches.length)return!1;var t=e.touches[0];return t.radiusX<=1&&t.radiusY<=1}function n(e,t){if(null==t.left)return!0;var r=t.left-e.left,n=t.top-e.top;return r*r+n*n>400}var i=e.display;Ws(i.scroller,"mousedown",Ar(e,Yr)),bl&&11>wl?Ws(i.scroller,"dblclick",Ar(e,function(t){if(!Mo(e,t)){var r=Xr(e,t);if(r&&!Qr(e,t)&&!jr(e.display,t)){ks(t);var n=e.findWordAt(r);wt(e.doc,n.anchor,n.head)}}})):Ws(i.scroller,"dblclick",function(t){Mo(e,t)||ks(t)}),Pl||Ws(i.scroller,"contextmenu",function(t){bn(e,t)});var o,l={end:0};Ws(i.scroller,"touchstart",function(e){if(!r(e)){clearTimeout(o);var t=+new Date;i.activeTouch={start:t,moved:!1,prev:t-l.end<=300?l:null},1==e.touches.length&&(i.activeTouch.left=e.touches[0].pageX,i.activeTouch.top=e.touches[0].pageY)}}),Ws(i.scroller,"touchmove",function(){i.activeTouch&&(i.activeTouch.moved=!0)}),Ws(i.scroller,"touchend",function(r){var o=i.activeTouch;if(o&&!jr(i,r)&&null!=o.left&&!o.moved&&new Date-o.start<300){var l,s=e.coordsChar(i.activeTouch,"page");l=!o.prev||n(o,o.prev)?new ht(s,s):!o.prev.prev||n(o,o.prev.prev)?e.findWordAt(s):new ht(zl(s.line,0),gt(e.doc,zl(s.line+1,0))),e.setSelection(l.anchor,l.head),e.focus(),ks(r)}t()}),Ws(i.scroller,"touchcancel",t),Ws(i.scroller,"scroll",function(){i.scroller.clientHeight&&(nn(e,i.scroller.scrollTop),on(e,i.scroller.scrollLeft,!0),Ds(e,"scroll",e))}),Ws(i.scroller,"mousewheel",function(t){ln(e,t)}),Ws(i.scroller,"DOMMouseScroll",function(t){ln(e,t)}),Ws(i.wrapper,"scroll",function(){i.wrapper.scrollTop=i.wrapper.scrollLeft=0}),i.dragFunctions={enter:function(t){Mo(e,t)||Ns(t)},over:function(t){Mo(e,t)||(tn(e,t),Ns(t))},start:function(t){en(e,t)},drop:Ar(e,Jr),leave:function(){rn(e)}};var s=i.input.getField();Ws(s,"keyup",function(t){pn.call(e,t)}),Ws(s,"keydown",Ar(e,fn)),Ws(s,"keypress",Ar(e,gn)),Ws(s,"focus",Ro(mn,e)),Ws(s,"blur",Ro(yn,e))}function Vr(t,r,n){var i=n&&n!=e.Init;if(!r!=!i){var o=t.display.dragFunctions,l=r?Ws:Os;l(t.display.scroller,"dragstart",o.start),l(t.display.scroller,"dragenter",o.enter),l(t.display.scroller,"dragover",o.over),l(t.display.scroller,"dragleave",o.leave),l(t.display.scroller,"drop",o.drop)}}function Kr(e){var t=e.display;(t.lastWrapHeight!=t.wrapper.clientHeight||t.lastWrapWidth!=t.wrapper.clientWidth)&&(t.cachedCharWidth=t.cachedTextHeight=t.cachedPaddingH=null,t.scrollbarsClipped=!1,e.setSize())}function jr(e,t){for(var r=Co(t);r!=e.wrapper;r=r.parentNode)if(!r||1==r.nodeType&&"true"==r.getAttribute("cm-ignore-events")||r.parentNode==e.sizer&&r!=e.mover)return!0}function Xr(e,t,r,n){var i=e.display;if(!r&&"true"==Co(t).getAttribute("cm-not-content"))return null;var o,l,s=i.lineSpace.getBoundingClientRect();try{o=t.clientX-s.left,l=t.clientY-s.top}catch(t){return null}var a,u=vr(e,o,l);if(n&&1==u.xRel&&(a=Zi(e.doc,u.line).text).length==u.ch){var c=Rs(a,a.length,e.options.tabSize)-a.length;u=zl(u.line,Math.max(0,Math.round((o-jt(e.display).left)/br(e.display))-c))}return u}function Yr(e){var t=this,r=t.display;if(!(r.activeTouch&&r.input.supportsTouch()||Mo(t,e))){if(r.shift=e.shiftKey,jr(r,e))return void(xl||(r.scroller.draggable=!1,setTimeout(function(){r.scroller.draggable=!0},100)));if(!Qr(t,e)){var n=Xr(t,e);switch(window.focus(),So(e)){case 1:t.state.selectingText?t.state.selectingText(e):n?_r(t,e,n):Co(e)==r.scroller&&ks(e);break;case 2:xl&&(t.state.lastMiddleDown=+new Date),n&&wt(t.doc,n),setTimeout(function(){r.input.focus()},20),ks(e);break;case 3:Pl?bn(t,e):vn(t)}}}}function _r(e,t,r){bl?setTimeout(Ro(q,e),0):e.curOp.focus=Xo();var n,i=+new Date;Ul&&Ul.time>i-400&&0==Fl(Ul.pos,r)?n="triple":Gl&&Gl.time>i-400&&0==Fl(Gl.pos,r)?(n="double",Ul={time:i,pos:r}):(n="single",Gl={time:i,pos:r});var o,l=e.doc.sel,s=Al?t.metaKey:t.ctrlKey;e.options.dragDrop&&Js&&!e.isReadOnly()&&"single"==n&&(o=l.contains(r))>-1&&(Fl((o=l.ranges[o]).from(),r)<0||r.xRel>0)&&(Fl(o.to(),r)>0||r.xRel<0)?$r(e,t,r,s):qr(e,t,r,n,s)}function $r(e,t,r,n){var i=e.display,o=+new Date,l=Ar(e,function(s){xl&&(i.scroller.draggable=!1),e.state.draggingText=!1,Os(document,"mouseup",l),Os(i.scroller,"drop",l),Math.abs(t.clientX-s.clientX)+Math.abs(t.clientY-s.clientY)<10&&(ks(s),!n&&+new Date-200<o&&wt(e.doc,r),xl||bl&&9==wl?setTimeout(function(){document.body.focus(),i.input.focus()},20):i.input.focus())});xl&&(i.scroller.draggable=!0),e.state.draggingText=l,i.scroller.dragDrop&&i.scroller.dragDrop(),Ws(document,"mouseup",l),Ws(i.scroller,"drop",l)}function qr(e,t,r,n,i){function o(t){if(0!=Fl(v,t))if(v=t,"rect"==n){for(var i=[],o=e.options.tabSize,l=Rs(Zi(u,r.line).text,r.ch,o),s=Rs(Zi(u,t.line).text,t.ch,o),a=Math.min(l,s),d=Math.max(l,s),p=Math.min(r.line,t.line),g=Math.min(e.lastLine(),Math.max(r.line,t.line));g>=p;p++){var m=Zi(u,p).text,y=Bs(m,a,o);a==d?i.push(new ht(zl(p,y),zl(p,y))):m.length>y&&i.push(new ht(zl(p,y),zl(p,Bs(m,d,o))))}i.length||i.push(new ht(r,r)),kt(u,ft(f.ranges.slice(0,h).concat(i),h),{origin:"*mouse",scroll:!1}),e.scrollIntoView(t)}else{var b=c,w=b.anchor,x=t;if("single"!=n){if("double"==n)var C=e.findWordAt(t);else var C=new ht(zl(t.line,0),gt(u,zl(t.line+1,0)));Fl(C.anchor,w)>0?(x=C.head,w=$(b.from(),C.anchor)):(x=C.anchor,w=_(b.to(),C.head))}var i=f.ranges.slice(0);i[h]=new ht(gt(u,w),x),kt(u,ft(i,h),zs)}}function l(t){var r=++y,i=Xr(e,t,!0,"rect"==n);if(i)if(0!=Fl(i,v)){e.curOp.focus=Xo(),o(i);var s=w(a,u);(i.line>=s.to||i.line<s.from)&&setTimeout(Ar(e,function(){y==r&&l(t)}),150)}else{var c=t.clientY<m.top?-20:t.clientY>m.bottom?20:0;c&&setTimeout(Ar(e,function(){y==r&&(a.scroller.scrollTop+=c,l(t))}),50)}}function s(t){e.state.selectingText=!1,y=1/0,ks(t),a.input.focus(),Os(document,"mousemove",b),Os(document,"mouseup",x),u.history.lastSelOrigin=null}var a=e.display,u=e.doc;ks(t);var c,h,f=u.sel,d=f.ranges;if(i&&!t.shiftKey?(h=u.sel.contains(r),c=h>-1?d[h]:new ht(r,r)):(c=u.sel.primary(),h=u.sel.primIndex),t.altKey)n="rect",i||(c=new ht(r,r)),r=Xr(e,t,!0,!0),h=-1;else if("double"==n){var p=e.findWordAt(r);c=e.display.shift||u.extend?bt(u,c,p.anchor,p.head):p}else if("triple"==n){var g=new ht(zl(r.line,0),gt(u,zl(r.line+1,0)));c=e.display.shift||u.extend?bt(u,c,g.anchor,g.head):g}else c=bt(u,c,r);i?-1==h?(h=d.length,kt(u,ft(d.concat([c]),h),{scroll:!1,origin:"*mouse"})):d.length>1&&d[h].empty()&&"single"==n&&!t.shiftKey?(kt(u,ft(d.slice(0,h).concat(d.slice(h+1)),0),{scroll:!1,origin:"*mouse"}),f=u.sel):Ct(u,h,c,zs):(h=0,kt(u,new ct([c],0),zs),f=u.sel);var v=r,m=a.wrapper.getBoundingClientRect(),y=0,b=Ar(e,function(e){So(e)?l(e):s(e)}),x=Ar(e,s);e.state.selectingText=x,Ws(document,"mousemove",b),Ws(document,"mouseup",x)}function Zr(e,t,r,n){try{var i=t.clientX,o=t.clientY}catch(t){return!1}if(i>=Math.floor(e.display.gutters.getBoundingClientRect().right))return!1;n&&ks(t);var l=e.display,s=l.lineDiv.getBoundingClientRect();if(o>s.bottom||!Wo(e,r))return xo(t);o-=s.top-l.viewOffset;for(var a=0;a<e.options.gutters.length;++a){var u=l.gutters.childNodes[a];if(u&&u.getBoundingClientRect().right>=i){var c=ro(e.doc,o),h=e.options.gutters[a];return Ds(e,r,e,c,h,t),xo(t)}}}function Qr(e,t){return Zr(e,t,"gutterClick",!0)}function Jr(e){var t=this;if(rn(t),!Mo(t,e)&&!jr(t.display,e)){ks(e),bl&&(Xl=+new Date);var r=Xr(t,e,!0),n=e.dataTransfer.files;if(r&&!t.isReadOnly())if(n&&n.length&&window.FileReader&&window.File)for(var i=n.length,o=Array(i),l=0,s=function(e,n){if(!t.options.allowDropFileTypes||-1!=Po(t.options.allowDropFileTypes,e.type)){var s=new FileReader;s.onload=Ar(t,function(){var e=s.result;if(/[\x00-\x08\x0e-\x1f]{2}/.test(e)&&(e=""),o[n]=e,++l==i){r=gt(t.doc,r);var a={from:r,to:r,text:t.doc.splitLines(o.join(t.doc.lineSeparator())),origin:"paste"};kn(t.doc,a),Tt(t.doc,dt(r,Ql(a)))}}),s.readAsText(e)}},a=0;i>a;++a)s(n[a],a);else{if(t.state.draggingText&&t.doc.sel.contains(r)>-1)return t.state.draggingText(e),void setTimeout(function(){t.display.input.focus()},20);try{var o=e.dataTransfer.getData("Text");if(o){if(t.state.draggingText&&!(Al?e.altKey:e.ctrlKey))var u=t.listSelections();if(Mt(t.doc,dt(r,r)),u)for(var a=0;a<u.length;++a)Dn(t.doc,"",u[a].anchor,u[a].head,"drag");t.replaceSelection(o,"around","paste"),t.display.input.focus()}}catch(e){}}}}function en(e,t){if(bl&&(!e.state.draggingText||+new Date-Xl<100))return void Ns(t);if(!Mo(e,t)&&!jr(e.display,t)&&(t.dataTransfer.setData("Text",e.getSelection()),t.dataTransfer.setDragImage&&!Tl)){var r=Vo("img",null,null,"position: fixed; left: 0; top: 0;");r.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",Ll&&(r.width=r.height=1,e.display.wrapper.appendChild(r),r._top=r.offsetTop),t.dataTransfer.setDragImage(r,0,0),Ll&&r.parentNode.removeChild(r)}}function tn(e,t){var r=Xr(e,t);if(r){var n=document.createDocumentFragment();It(e,r,n),e.display.dragCursor||(e.display.dragCursor=Vo("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),e.display.lineSpace.insertBefore(e.display.dragCursor,e.display.cursorDiv)),jo(e.display.dragCursor,n)}}function rn(e){e.display.dragCursor&&(e.display.lineSpace.removeChild(e.display.dragCursor),e.display.dragCursor=null)}function nn(e,t){Math.abs(e.doc.scrollTop-t)<2||(e.doc.scrollTop=t,vl||W(e,{top:t}),e.display.scroller.scrollTop!=t&&(e.display.scroller.scrollTop=t),e.display.scrollbars.setScrollTop(t),vl&&W(e),Rt(e,100))}function on(e,t,r){(r?t==e.doc.scrollLeft:Math.abs(e.doc.scrollLeft-t)<2)||(t=Math.min(t,e.display.scroller.scrollWidth-e.display.scroller.clientWidth),e.doc.scrollLeft=t,x(e),e.display.scroller.scrollLeft!=t&&(e.display.scroller.scrollLeft=t),e.display.scrollbars.setScrollLeft(t))}function ln(e,t){var r=$l(t),n=r.x,i=r.y,o=e.display,l=o.scroller,s=l.scrollWidth>l.clientWidth,a=l.scrollHeight>l.clientHeight;if(n&&s||i&&a){if(i&&Al&&xl)e:for(var u=t.target,c=o.view;u!=l;u=u.parentNode)for(var h=0;h<c.length;h++)if(c[h].node==u){e.display.currentWheelTarget=u;break e}if(n&&!vl&&!Ll&&null!=_l)return i&&a&&nn(e,Math.max(0,Math.min(l.scrollTop+i*_l,l.scrollHeight-l.clientHeight))),on(e,Math.max(0,Math.min(l.scrollLeft+n*_l,l.scrollWidth-l.clientWidth))),(!i||i&&a)&&ks(t),void(o.wheelStartX=null);if(i&&null!=_l){var f=i*_l,d=e.doc.scrollTop,p=d+o.wrapper.clientHeight;0>f?d=Math.max(0,d+f-50):p=Math.min(e.doc.height,p+f+50),W(e,{top:d,bottom:p})}20>Yl&&(null==o.wheelStartX?(o.wheelStartX=l.scrollLeft,o.wheelStartY=l.scrollTop,o.wheelDX=n,o.wheelDY=i,setTimeout(function(){if(null!=o.wheelStartX){var e=l.scrollLeft-o.wheelStartX,t=l.scrollTop-o.wheelStartY,r=t&&o.wheelDY&&t/o.wheelDY||e&&o.wheelDX&&e/o.wheelDX;o.wheelStartX=o.wheelStartY=null,r&&(_l=(_l*Yl+r)/(Yl+1),++Yl)}},200)):(o.wheelDX+=n,o.wheelDY+=i))}}function sn(e,t,r){if("string"==typeof t&&(t=us[t],!t))return!1;e.display.input.ensurePolled();var n=e.display.shift,i=!1;try{e.isReadOnly()&&(e.state.suppressEdits=!0),r&&(e.display.shift=!1),i=t(e)!=Es}finally{e.display.shift=n,e.state.suppressEdits=!1}return i}function an(e,t,r){for(var n=0;n<e.state.keyMaps.length;n++){var i=hs(t,e.state.keyMaps[n],r,e);if(i)return i}return e.options.extraKeys&&hs(t,e.options.extraKeys,r,e)||hs(t,e.options.keyMap,r,e)}function un(e,t,r,n){var i=e.state.keySeq;if(i){if(fs(t))return"handled";ql.set(50,function(){e.state.keySeq==i&&(e.state.keySeq=null,e.display.input.reset())}),t=i+" "+t}var o=an(e,t,n);return"multi"==o&&(e.state.keySeq=t),"handled"==o&&To(e,"keyHandled",e,t,r),("handled"==o||"multi"==o)&&(ks(r),Ft(e)),i&&!o&&/\'$/.test(t)?(ks(r),!0):!!o}function cn(e,t){var r=ds(t,!0);return r?t.shiftKey&&!e.state.keySeq?un(e,"Shift-"+r,t,function(t){return sn(e,t,!0)})||un(e,r,t,function(t){return("string"==typeof t?/^go[A-Z]/.test(t):t.motion)?sn(e,t):void 0}):un(e,r,t,function(t){return sn(e,t)}):!1}function hn(e,t,r){return un(e,"'"+r+"'",t,function(t){return sn(e,t,!0)})}function fn(e){var t=this;if(t.curOp.focus=Xo(),!Mo(t,e)){bl&&11>wl&&27==e.keyCode&&(e.returnValue=!1);var r=e.keyCode;t.display.shift=16==r||e.shiftKey;var n=cn(t,e);Ll&&(Zl=n?r:null,!n&&88==r&&!ra&&(Al?e.metaKey:e.ctrlKey)&&t.replaceSelection("",null,"cut")),18!=r||/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className)||dn(t)}}function dn(e){function t(e){18!=e.keyCode&&e.altKey||(qs(r,"CodeMirror-crosshair"),Os(document,"keyup",t),Os(document,"mouseover",t))}var r=e.display.lineDiv;Zs(r,"CodeMirror-crosshair"),Ws(document,"keyup",t),Ws(document,"mouseover",t)}function pn(e){16==e.keyCode&&(this.doc.sel.shift=!1),Mo(this,e)}function gn(e){var t=this;if(!(jr(t.display,e)||Mo(t,e)||e.ctrlKey&&!e.altKey||Al&&e.metaKey)){var r=e.keyCode,n=e.charCode;if(Ll&&r==Zl)return Zl=null,void ks(e);if(!Ll||e.which&&!(e.which<10)||!cn(t,e)){var i=String.fromCharCode(null==n?r:n);hn(t,e,i)||t.display.input.onKeyPress(e)}}}function vn(e){e.state.delayingBlurEvent=!0,setTimeout(function(){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1,yn(e))},100)}function mn(e){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1),"nocursor"!=e.options.readOnly&&(e.state.focused||(Ds(e,"focus",e),e.state.focused=!0,Zs(e.display.wrapper,"CodeMirror-focused"),e.curOp||e.display.selForContextMenu==e.doc.sel||(e.display.input.reset(),xl&&setTimeout(function(){e.display.input.reset(!0)},20)),e.display.input.receivedFocus()),Ft(e))}function yn(e){e.state.delayingBlurEvent||(e.state.focused&&(Ds(e,"blur",e),e.state.focused=!1,qs(e.display.wrapper,"CodeMirror-focused")),clearInterval(e.display.blinker),setTimeout(function(){e.state.focused||(e.display.shift=!1)},150))}function bn(e,t){jr(e.display,t)||wn(e,t)||Mo(e,t,"contextmenu")||e.display.input.onContextMenu(t)}function wn(e,t){return Wo(e,"gutterContextMenu")?Zr(e,t,"gutterContextMenu",!1):!1}function xn(e,t){if(Fl(e,t.from)<0)return e;if(Fl(e,t.to)<=0)return Ql(t);var r=e.line+t.text.length-(t.to.line-t.from.line)-1,n=e.ch;return e.line==t.to.line&&(n+=Ql(t).ch-t.to.ch),zl(r,n)}function Cn(e,t){for(var r=[],n=0;n<e.sel.ranges.length;n++){var i=e.sel.ranges[n];r.push(new ht(xn(i.anchor,t),xn(i.head,t)))}return ft(r,e.sel.primIndex)}function Sn(e,t,r){return e.line==t.line?zl(r.line,e.ch-t.ch+r.ch):zl(r.line+(e.line-t.line),e.ch)}function Ln(e,t,r){for(var n=[],i=zl(e.first,0),o=i,l=0;l<t.length;l++){var s=t[l],a=Sn(s.from,i,o),u=Sn(Ql(s),i,o);if(i=s.to,o=u,"around"==r){var c=e.sel.ranges[l],h=Fl(c.head,c.anchor)<0;n[l]=new ht(h?u:a,h?a:u)}else n[l]=new ht(a,a)}return new ct(n,e.sel.primIndex)}function Tn(e,t,r){var n={canceled:!1,from:t.from,to:t.to,text:t.text,origin:t.origin,cancel:function(){this.canceled=!0}};return r&&(n.update=function(t,r,n,i){t&&(this.from=gt(e,t)),r&&(this.to=gt(e,r)),n&&(this.text=n),void 0!==i&&(this.origin=i)}),Ds(e,"beforeChange",e,n),e.cm&&Ds(e.cm,"beforeChange",e.cm,n),n.canceled?null:{from:n.from,to:n.to,text:n.text,origin:n.origin}}function kn(e,t,r){if(e.cm){if(!e.cm.curOp)return Ar(e.cm,kn)(e,t,r);if(e.cm.state.suppressEdits)return}if(!(Wo(e,"beforeChange")||e.cm&&Wo(e.cm,"beforeChange"))||(t=Tn(e,t,!0))){var n=El&&!r&&ai(e,t.from,t.to);if(n)for(var i=n.length-1;i>=0;--i)Mn(e,{from:n[i].from,to:n[i].to,text:i?[""]:t.text});else Mn(e,t)}}function Mn(e,t){if(1!=t.text.length||""!=t.text[0]||0!=Fl(t.from,t.to)){var r=Cn(e,t);uo(e,t,r,e.cm?e.cm.curOp.id:0/0),An(e,t,r,oi(e,t));var n=[];$i(e,function(e,r){r||-1!=Po(n,e.history)||(wo(e.history,t),n.push(e.history)),An(e,t,null,oi(e,t))})}}function Nn(e,t,r){if(!e.cm||!e.cm.state.suppressEdits){for(var n,i=e.history,o=e.sel,l="undo"==t?i.done:i.undone,s="undo"==t?i.undone:i.done,a=0;a<l.length&&(n=l[a],r?!n.ranges||n.equals(e.sel):n.ranges);a++);if(a!=l.length){for(i.lastOrigin=i.lastSelOrigin=null;n=l.pop(),n.ranges;){if(fo(n,s),r&&!n.equals(e.sel))return void kt(e,n,{clearRedo:!1});o=n}var u=[];fo(o,s),s.push({changes:u,generation:i.generation}),i.generation=n.generation||++i.maxGeneration;for(var c=Wo(e,"beforeChange")||e.cm&&Wo(e.cm,"beforeChange"),a=n.changes.length-1;a>=0;--a){var h=n.changes[a];if(h.origin=t,c&&!Tn(e,h,!1))return void(l.length=0);u.push(lo(e,h));var f=a?Cn(e,h):Ho(l);An(e,h,f,si(e,h)),!a&&e.cm&&e.cm.scrollIntoView({from:h.from,to:Ql(h)});var d=[];$i(e,function(e,t){t||-1!=Po(d,e.history)||(wo(e.history,h),d.push(e.history)),An(e,h,null,si(e,h))})}}}}function Wn(e,t){if(0!=t&&(e.first+=t,e.sel=new ct(Eo(e.sel.ranges,function(e){return new ht(zl(e.anchor.line+t,e.anchor.ch),zl(e.head.line+t,e.head.ch))}),e.sel.primIndex),e.cm)){Er(e.cm,e.first,e.first-t,t);for(var r=e.cm.display,n=r.viewFrom;n<r.viewTo;n++)Ir(e.cm,n,"gutter")}}function An(e,t,r,n){if(e.cm&&!e.cm.curOp)return Ar(e.cm,An)(e,t,r,n);if(t.to.line<e.first)return void Wn(e,t.text.length-1-(t.to.line-t.from.line));if(!(t.from.line>e.lastLine())){if(t.from.line<e.first){var i=t.text.length-1-(e.first-t.from.line);Wn(e,i),t={from:zl(e.first,0),to:zl(t.to.line+i,t.to.ch),text:[Ho(t.text)],origin:t.origin}}var o=e.lastLine();t.to.line>o&&(t={from:t.from,to:zl(o,Zi(e,o).text.length),text:[t.text[0]],origin:t.origin}),t.removed=Qi(e,t.from,t.to),r||(r=Cn(e,t)),e.cm?On(e.cm,t,n):Xi(e,t,n),Mt(e,r,Is)}}function On(e,t,r){var n=e.doc,i=e.display,l=t.from,s=t.to,a=!1,u=l.line;e.options.lineWrapping||(u=to(yi(Zi(n,l.line))),n.iter(u,s.line+1,function(e){return e==i.maxLine?(a=!0,!0):void 0})),n.sel.contains(t.from,t.to)>-1&&No(e),Xi(n,t,r,o(e)),e.options.lineWrapping||(n.iter(u,l.line+t.text.length,function(e){var t=h(e);t>i.maxLineLength&&(i.maxLine=e,i.maxLineLength=t,i.maxLineChanged=!0,a=!1)}),a&&(e.curOp.updateMaxLine=!0)),n.frontier=Math.min(n.frontier,l.line),Rt(e,400);var c=t.text.length-(s.line-l.line)-1;t.full?Er(e):l.line!=s.line||1!=t.text.length||ji(e.doc,t)?Er(e,l.line,s.line+1,c):Ir(e,l.line,"text");var f=Wo(e,"changes"),d=Wo(e,"change");if(d||f){var p={from:l,to:s,text:t.text,removed:t.removed,origin:t.origin};d&&To(e,"change",e,p),f&&(e.curOp.changeObjs||(e.curOp.changeObjs=[])).push(p)}e.display.selForContextMenu=null}function Dn(e,t,r,n,i){if(n||(n=r),Fl(n,r)<0){var o=n;n=r,r=o}"string"==typeof t&&(t=e.splitLines(t)),kn(e,{from:r,to:n,text:t,origin:i})}function Hn(e,t){if(!Mo(e,"scrollCursorIntoView")){var r=e.display,n=r.sizer.getBoundingClientRect(),i=null;if(t.top+n.top<0?i=!0:t.bottom+n.top>(window.innerHeight||document.documentElement.clientHeight)&&(i=!1),null!=i&&!Ml){var o=Vo("div","​",null,"position: absolute; top: "+(t.top-r.viewOffset-Vt(e.display))+"px; height: "+(t.bottom-t.top+Xt(e)+r.barHeight)+"px; left: "+t.left+"px; width: 2px;");e.display.lineSpace.appendChild(o),o.scrollIntoView(i),e.display.lineSpace.removeChild(o)}}}function Pn(e,t,r,n){null==n&&(n=0);for(var i=0;5>i;i++){var o=!1,l=dr(e,t),s=r&&r!=t?dr(e,r):l,a=In(e,Math.min(l.left,s.left),Math.min(l.top,s.top)-n,Math.max(l.left,s.left),Math.max(l.bottom,s.bottom)+n),u=e.doc.scrollTop,c=e.doc.scrollLeft;if(null!=a.scrollTop&&(nn(e,a.scrollTop),Math.abs(e.doc.scrollTop-u)>1&&(o=!0)),null!=a.scrollLeft&&(on(e,a.scrollLeft),Math.abs(e.doc.scrollLeft-c)>1&&(o=!0)),!o)break}return l}function En(e,t,r,n,i){var o=In(e,t,r,n,i);null!=o.scrollTop&&nn(e,o.scrollTop),null!=o.scrollLeft&&on(e,o.scrollLeft)}function In(e,t,r,n,i){var o=e.display,l=yr(e.display);0>r&&(r=0);var s=e.curOp&&null!=e.curOp.scrollTop?e.curOp.scrollTop:o.scroller.scrollTop,a=_t(e),u={};i-r>a&&(i=r+a);var c=e.doc.height+Kt(o),h=l>r,f=i>c-l;if(s>r)u.scrollTop=h?0:r;else if(i>s+a){var d=Math.min(r,(f?c:i)-a);d!=s&&(u.scrollTop=d)}var p=e.curOp&&null!=e.curOp.scrollLeft?e.curOp.scrollLeft:o.scroller.scrollLeft,g=Yt(e)-(e.options.fixedGutter?o.gutters.offsetWidth:0),v=n-t>g;return v&&(n=t+g),10>t?u.scrollLeft=0:p>t?u.scrollLeft=Math.max(0,t-(v?0:10)):n>g+p-3&&(u.scrollLeft=n+(v?0:10)-g),u}function zn(e,t,r){(null!=t||null!=r)&&Rn(e),null!=t&&(e.curOp.scrollLeft=(null==e.curOp.scrollLeft?e.doc.scrollLeft:e.curOp.scrollLeft)+t),null!=r&&(e.curOp.scrollTop=(null==e.curOp.scrollTop?e.doc.scrollTop:e.curOp.scrollTop)+r)}function Fn(e){Rn(e);var t=e.getCursor(),r=t,n=t;e.options.lineWrapping||(r=t.ch?zl(t.line,t.ch-1):t,n=zl(t.line,t.ch+1)),e.curOp.scrollToPos={from:r,to:n,margin:e.options.cursorScrollMargin,isCursor:!0}}function Rn(e){var t=e.curOp.scrollToPos;if(t){e.curOp.scrollToPos=null;var r=pr(e,t.from),n=pr(e,t.to),i=In(e,Math.min(r.left,n.left),Math.min(r.top,n.top)-t.margin,Math.max(r.right,n.right),Math.max(r.bottom,n.bottom)+t.margin);
e.scrollTo(i.scrollLeft,i.scrollTop)}}function Bn(e,t,r,n){var i,o=e.doc;null==r&&(r="add"),"smart"==r&&(o.mode.indent?i=Ut(e,t):r="prev");var l=e.options.tabSize,s=Zi(o,t),a=Rs(s.text,null,l);s.stateAfter&&(s.stateAfter=null);var u,c=s.text.match(/^\s*/)[0];if(n||/\S/.test(s.text)){if("smart"==r&&(u=o.mode.indent(i,s.text.slice(c.length),s.text),u==Es||u>150)){if(!n)return;r="prev"}}else u=0,r="not";"prev"==r?u=t>o.first?Rs(Zi(o,t-1).text,null,l):0:"add"==r?u=a+e.options.indentUnit:"subtract"==r?u=a-e.options.indentUnit:"number"==typeof r&&(u=a+r),u=Math.max(0,u);var h="",f=0;if(e.options.indentWithTabs)for(var d=Math.floor(u/l);d;--d)f+=l,h+="	";if(u>f&&(h+=Do(u-f)),h!=c)return Dn(o,h,zl(t,0),zl(t,c.length),"+input"),s.stateAfter=null,!0;for(var d=0;d<o.sel.ranges.length;d++){var p=o.sel.ranges[d];if(p.head.line==t&&p.head.ch<c.length){var f=zl(t,c.length);Ct(o,d,new ht(f,f));break}}}function Gn(e,t,r,n){var i=t,o=t;return"number"==typeof t?o=Zi(e,pt(e,t)):i=to(t),null==i?null:(n(o,i)&&e.cm&&Ir(e.cm,i,r),o)}function Un(e,t){for(var r=e.doc.sel.ranges,n=[],i=0;i<r.length;i++){for(var o=t(r[i]);n.length&&Fl(o.from,Ho(n).to)<=0;){var l=n.pop();if(Fl(l.from,o.from)<0){o.from=l.from;break}}n.push(o)}Wr(e,function(){for(var t=n.length-1;t>=0;t--)Dn(e.doc,"",n[t].from,n[t].to,"+delete");Fn(e)})}function Vn(e,t,r,n,i){function o(){var t=s+r;return t<e.first||t>=e.first+e.size?h=!1:(s=t,c=Zi(e,t))}function l(e){var t=(i?fl:dl)(c,a,r,!0);if(null==t){if(e||!o())return h=!1;a=i?(0>r?ol:il)(c):0>r?c.text.length:0}else a=t;return!0}var s=t.line,a=t.ch,u=r,c=Zi(e,s),h=!0;if("char"==n)l();else if("column"==n)l(!0);else if("word"==n||"group"==n)for(var f=null,d="group"==n,p=e.cm&&e.cm.getHelper(t,"wordChars"),g=!0;!(0>r)||l(!g);g=!1){var v=c.text.charAt(a)||"\n",m=Bo(v,p)?"w":d&&"\n"==v?"n":!d||/\s/.test(v)?null:"p";if(!d||g||m||(m="s"),f&&f!=m){0>r&&(r=1,l());break}if(m&&(f=m),r>0&&!l(!g))break}var y=Dt(e,zl(s,a),t,u,!0);return h||(y.hitSide=!0),y}function Kn(e,t,r,n){var i,o=e.doc,l=t.left;if("page"==n){var s=Math.min(e.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight);i=t.top+r*(s-(0>r?1.5:.5)*yr(e.display))}else"line"==n&&(i=r>0?t.bottom+3:t.top-3);for(;;){var a=vr(e,l,i);if(!a.outside)break;if(0>r?0>=i:i>=o.height){a.hitSide=!0;break}i+=5*r}return a}function jn(t,r,n,i){e.defaults[t]=r,n&&(es[t]=i?function(e,t,r){r!=ts&&n(e,t,r)}:n)}function Xn(e){for(var t,r,n,i,o=e.split(/-(?!$)/),e=o[o.length-1],l=0;l<o.length-1;l++){var s=o[l];if(/^(cmd|meta|m)$/i.test(s))i=!0;else if(/^a(lt)?$/i.test(s))t=!0;else if(/^(c|ctrl|control)$/i.test(s))r=!0;else{if(!/^s(hift)$/i.test(s))throw new Error("Unrecognized modifier name: "+s);n=!0}}return t&&(e="Alt-"+e),r&&(e="Ctrl-"+e),i&&(e="Cmd-"+e),n&&(e="Shift-"+e),e}function Yn(e){return"string"==typeof e?cs[e]:e}function _n(e,t,r,n,i){if(n&&n.shared)return $n(e,t,r,n,i);if(e.cm&&!e.cm.curOp)return Ar(e.cm,_n)(e,t,r,n,i);var o=new vs(e,i),l=Fl(t,r);if(n&&Fo(n,o,!1),l>0||0==l&&o.clearWhenEmpty!==!1)return o;if(o.replacedWith&&(o.collapsed=!0,o.widgetNode=Vo("span",[o.replacedWith],"CodeMirror-widget"),n.handleMouseEvents||o.widgetNode.setAttribute("cm-ignore-events","true"),n.insertLeft&&(o.widgetNode.insertLeft=!0)),o.collapsed){if(mi(e,t.line,t,r,o)||t.line!=r.line&&mi(e,r.line,t,r,o))throw new Error("Inserting collapsed marker partially overlapping an existing one");Il=!0}o.addToHistory&&uo(e,{from:t,to:r,origin:"markText"},e.sel,0/0);var s,a=t.line,u=e.cm;if(e.iter(a,r.line+1,function(e){u&&o.collapsed&&!u.options.lineWrapping&&yi(e)==u.display.maxLine&&(s=!0),o.collapsed&&a!=t.line&&eo(e,0),ri(e,new Jn(o,a==t.line?t.ch:null,a==r.line?r.ch:null)),++a}),o.collapsed&&e.iter(t.line,r.line+1,function(t){Ci(e,t)&&eo(t,0)}),o.clearOnEnter&&Ws(o,"beforeCursorEnter",function(){o.clear()}),o.readOnly&&(El=!0,(e.history.done.length||e.history.undone.length)&&e.clearHistory()),o.collapsed&&(o.id=++gs,o.atomic=!0),u){if(s&&(u.curOp.updateMaxLine=!0),o.collapsed)Er(u,t.line,r.line+1);else if(o.className||o.title||o.startStyle||o.endStyle||o.css)for(var c=t.line;c<=r.line;c++)Ir(u,c,"text");o.atomic&&Wt(u.doc),To(u,"markerAdded",u,o)}return o}function $n(e,t,r,n,i){n=Fo(n),n.shared=!1;var o=[_n(e,t,r,n,i)],l=o[0],s=n.widgetNode;return $i(e,function(e){s&&(n.widgetNode=s.cloneNode(!0)),o.push(_n(e,gt(e,t),gt(e,r),n,i));for(var a=0;a<e.linked.length;++a)if(e.linked[a].isParent)return;l=Ho(o)}),new ms(o,l)}function qn(e){return e.findMarks(zl(e.first,0),e.clipPos(zl(e.lastLine())),function(e){return e.parent})}function Zn(e,t){for(var r=0;r<t.length;r++){var n=t[r],i=n.find(),o=e.clipPos(i.from),l=e.clipPos(i.to);if(Fl(o,l)){var s=_n(e,o,l,n.primary,n.primary.type);n.markers.push(s),s.parent=n}}}function Qn(e){for(var t=0;t<e.length;t++){var r=e[t],n=[r.primary.doc];$i(r.primary.doc,function(e){n.push(e)});for(var i=0;i<r.markers.length;i++){var o=r.markers[i];-1==Po(n,o.doc)&&(o.parent=null,r.markers.splice(i--,1))}}}function Jn(e,t,r){this.marker=e,this.from=t,this.to=r}function ei(e,t){if(e)for(var r=0;r<e.length;++r){var n=e[r];if(n.marker==t)return n}}function ti(e,t){for(var r,n=0;n<e.length;++n)e[n]!=t&&(r||(r=[])).push(e[n]);return r}function ri(e,t){e.markedSpans=e.markedSpans?e.markedSpans.concat([t]):[t],t.marker.attachLine(e)}function ni(e,t,r){if(e)for(var n,i=0;i<e.length;++i){var o=e[i],l=o.marker,s=null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t);if(s||o.from==t&&"bookmark"==l.type&&(!r||!o.marker.insertLeft)){var a=null==o.to||(l.inclusiveRight?o.to>=t:o.to>t);(n||(n=[])).push(new Jn(l,o.from,a?null:o.to))}}return n}function ii(e,t,r){if(e)for(var n,i=0;i<e.length;++i){var o=e[i],l=o.marker,s=null==o.to||(l.inclusiveRight?o.to>=t:o.to>t);if(s||o.from==t&&"bookmark"==l.type&&(!r||o.marker.insertLeft)){var a=null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t);(n||(n=[])).push(new Jn(l,a?null:o.from-t,null==o.to?null:o.to-t))}}return n}function oi(e,t){if(t.full)return null;var r=mt(e,t.from.line)&&Zi(e,t.from.line).markedSpans,n=mt(e,t.to.line)&&Zi(e,t.to.line).markedSpans;if(!r&&!n)return null;var i=t.from.ch,o=t.to.ch,l=0==Fl(t.from,t.to),s=ni(r,i,l),a=ii(n,o,l),u=1==t.text.length,c=Ho(t.text).length+(u?i:0);if(s)for(var h=0;h<s.length;++h){var f=s[h];if(null==f.to){var d=ei(a,f.marker);d?u&&(f.to=null==d.to?null:d.to+c):f.to=i}}if(a)for(var h=0;h<a.length;++h){var f=a[h];if(null!=f.to&&(f.to+=c),null==f.from){var d=ei(s,f.marker);d||(f.from=c,u&&(s||(s=[])).push(f))}else f.from+=c,u&&(s||(s=[])).push(f)}s&&(s=li(s)),a&&a!=s&&(a=li(a));var p=[s];if(!u){var g,v=t.text.length-2;if(v>0&&s)for(var h=0;h<s.length;++h)null==s[h].to&&(g||(g=[])).push(new Jn(s[h].marker,null,null));for(var h=0;v>h;++h)p.push(g);p.push(a)}return p}function li(e){for(var t=0;t<e.length;++t){var r=e[t];null!=r.from&&r.from==r.to&&r.marker.clearWhenEmpty!==!1&&e.splice(t--,1)}return e.length?e:null}function si(e,t){var r=vo(e,t),n=oi(e,t);if(!r)return n;if(!n)return r;for(var i=0;i<r.length;++i){var o=r[i],l=n[i];if(o&&l)e:for(var s=0;s<l.length;++s){for(var a=l[s],u=0;u<o.length;++u)if(o[u].marker==a.marker)continue e;o.push(a)}else l&&(r[i]=l)}return r}function ai(e,t,r){var n=null;if(e.iter(t.line,r.line+1,function(e){if(e.markedSpans)for(var t=0;t<e.markedSpans.length;++t){var r=e.markedSpans[t].marker;!r.readOnly||n&&-1!=Po(n,r)||(n||(n=[])).push(r)}}),!n)return null;for(var i=[{from:t,to:r}],o=0;o<n.length;++o)for(var l=n[o],s=l.find(0),a=0;a<i.length;++a){var u=i[a];if(!(Fl(u.to,s.from)<0||Fl(u.from,s.to)>0)){var c=[a,1],h=Fl(u.from,s.from),f=Fl(u.to,s.to);(0>h||!l.inclusiveLeft&&!h)&&c.push({from:u.from,to:s.from}),(f>0||!l.inclusiveRight&&!f)&&c.push({from:s.to,to:u.to}),i.splice.apply(i,c),a+=c.length-1}}return i}function ui(e){var t=e.markedSpans;if(t){for(var r=0;r<t.length;++r)t[r].marker.detachLine(e);e.markedSpans=null}}function ci(e,t){if(t){for(var r=0;r<t.length;++r)t[r].marker.attachLine(e);e.markedSpans=t}}function hi(e){return e.inclusiveLeft?-1:0}function fi(e){return e.inclusiveRight?1:0}function di(e,t){var r=e.lines.length-t.lines.length;if(0!=r)return r;var n=e.find(),i=t.find(),o=Fl(n.from,i.from)||hi(e)-hi(t);if(o)return-o;var l=Fl(n.to,i.to)||fi(e)-fi(t);return l?l:t.id-e.id}function pi(e,t){var r,n=Il&&e.markedSpans;if(n)for(var i,o=0;o<n.length;++o)i=n[o],i.marker.collapsed&&null==(t?i.from:i.to)&&(!r||di(r,i.marker)<0)&&(r=i.marker);return r}function gi(e){return pi(e,!0)}function vi(e){return pi(e,!1)}function mi(e,t,r,n,i){var o=Zi(e,t),l=Il&&o.markedSpans;if(l)for(var s=0;s<l.length;++s){var a=l[s];if(a.marker.collapsed){var u=a.marker.find(0),c=Fl(u.from,r)||hi(a.marker)-hi(i),h=Fl(u.to,n)||fi(a.marker)-fi(i);if(!(c>=0&&0>=h||0>=c&&h>=0)&&(0>=c&&(Fl(u.to,r)>0||a.marker.inclusiveRight&&i.inclusiveLeft)||c>=0&&(Fl(u.from,n)<0||a.marker.inclusiveLeft&&i.inclusiveRight)))return!0}}}function yi(e){for(var t;t=gi(e);)e=t.find(-1,!0).line;return e}function bi(e){for(var t,r;t=vi(e);)e=t.find(1,!0).line,(r||(r=[])).push(e);return r}function wi(e,t){var r=Zi(e,t),n=yi(r);return r==n?t:to(n)}function xi(e,t){if(t>e.lastLine())return t;var r,n=Zi(e,t);if(!Ci(e,n))return t;for(;r=vi(n);)n=r.find(1,!0).line;return to(n)+1}function Ci(e,t){var r=Il&&t.markedSpans;if(r)for(var n,i=0;i<r.length;++i)if(n=r[i],n.marker.collapsed){if(null==n.from)return!0;if(!n.marker.widgetNode&&0==n.from&&n.marker.inclusiveLeft&&Si(e,t,n))return!0}}function Si(e,t,r){if(null==r.to){var n=r.marker.find(1,!0);return Si(e,n.line,ei(n.line.markedSpans,r.marker))}if(r.marker.inclusiveRight&&r.to==t.text.length)return!0;for(var i,o=0;o<t.markedSpans.length;++o)if(i=t.markedSpans[o],i.marker.collapsed&&!i.marker.widgetNode&&i.from==r.to&&(null==i.to||i.to!=r.from)&&(i.marker.inclusiveLeft||r.marker.inclusiveRight)&&Si(e,t,i))return!0}function Li(e,t,r){no(t)<(e.curOp&&e.curOp.scrollTop||e.doc.scrollTop)&&zn(e,null,r)}function Ti(e){if(null!=e.height)return e.height;var t=e.doc.cm;if(!t)return 0;if(!Ys(document.body,e.node)){var r="position: relative;";e.coverGutter&&(r+="margin-left: -"+t.display.gutters.offsetWidth+"px;"),e.noHScroll&&(r+="width: "+t.display.wrapper.clientWidth+"px;"),jo(t.display.measure,Vo("div",[e.node],null,r))}return e.height=e.node.parentNode.offsetHeight}function ki(e,t,r,n){var i=new ys(e,r,n),o=e.cm;return o&&i.noHScroll&&(o.display.alignWidgets=!0),Gn(e,t,"widget",function(t){var r=t.widgets||(t.widgets=[]);if(null==i.insertAt?r.push(i):r.splice(Math.min(r.length-1,Math.max(0,i.insertAt)),0,i),i.line=t,o&&!Ci(e,t)){var n=no(t)<e.scrollTop;eo(t,t.height+Ti(i)),n&&zn(o,null,i.height),o.curOp.forceUpdate=!0}return!0}),i}function Mi(e,t,r,n){e.text=t,e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null),null!=e.order&&(e.order=null),ui(e),ci(e,r);var i=n?n(e):1;i!=e.height&&eo(e,i)}function Ni(e){e.parent=null,ui(e)}function Wi(e,t){if(e)for(;;){var r=e.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!r)break;e=e.slice(0,r.index)+e.slice(r.index+r[0].length);var n=r[1]?"bgClass":"textClass";null==t[n]?t[n]=r[2]:new RegExp("(?:^|s)"+r[2]+"(?:$|s)").test(t[n])||(t[n]+=" "+r[2])}return e}function Ai(t,r){if(t.blankLine)return t.blankLine(r);if(t.innerMode){var n=e.innerMode(t,r);return n.mode.blankLine?n.mode.blankLine(n.state):void 0}}function Oi(t,r,n,i){for(var o=0;10>o;o++){i&&(i[0]=e.innerMode(t,n).mode);var l=t.token(r,n);if(r.pos>r.start)return l}throw new Error("Mode "+t.name+" failed to advance stream.")}function Di(e,t,r,n){function i(e){return{start:h.start,end:h.pos,string:h.current(),type:o||null,state:e?ss(l.mode,c):c}}var o,l=e.doc,s=l.mode;t=gt(l,t);var a,u=Zi(l,t.line),c=Ut(e,t.line,r),h=new ps(u.text,e.options.tabSize);for(n&&(a=[]);(n||h.pos<t.ch)&&!h.eol();)h.start=h.pos,o=Oi(s,h,c),n&&a.push(i(!0));return n?a:i()}function Hi(e,t,r,n,i,o,l){var s=r.flattenSpans;null==s&&(s=e.options.flattenSpans);var a,u=0,c=null,h=new ps(t,e.options.tabSize),f=e.options.addModeClass&&[null];for(""==t&&Wi(Ai(r,n),o);!h.eol();){if(h.pos>e.options.maxHighlightLength?(s=!1,l&&Ii(e,t,n,h.pos),h.pos=t.length,a=null):a=Wi(Oi(r,h,n,f),o),f){var d=f[0].name;d&&(a="m-"+(a?d+" "+a:d))}if(!s||c!=a){for(;u<h.start;)u=Math.min(h.start,u+5e4),i(u,c);c=a}h.start=h.pos}for(;u<h.pos;){var p=Math.min(h.pos,u+5e4);i(p,c),u=p}}function Pi(e,t,r,n){var i=[e.state.modeGen],o={};Hi(e,t.text,e.doc.mode,r,function(e,t){i.push(e,t)},o,n);for(var l=0;l<e.state.overlays.length;++l){var s=e.state.overlays[l],a=1,u=0;Hi(e,t.text,s.mode,!0,function(e,t){for(var r=a;e>u;){var n=i[a];n>e&&i.splice(a,1,e,i[a+1],n),a+=2,u=Math.min(e,n)}if(t)if(s.opaque)i.splice(r,a-r,e,"cm-overlay "+t),a=r+2;else for(;a>r;r+=2){var o=i[r+1];i[r+1]=(o?o+" ":"")+"cm-overlay "+t}},o)}return{styles:i,classes:o.bgClass||o.textClass?o:null}}function Ei(e,t,r){if(!t.styles||t.styles[0]!=e.state.modeGen){var n=Ut(e,to(t)),i=Pi(e,t,t.text.length>e.options.maxHighlightLength?ss(e.doc.mode,n):n);t.stateAfter=n,t.styles=i.styles,i.classes?t.styleClasses=i.classes:t.styleClasses&&(t.styleClasses=null),r===e.doc.frontier&&e.doc.frontier++}return t.styles}function Ii(e,t,r,n){var i=e.doc.mode,o=new ps(t,e.options.tabSize);for(o.start=o.pos=n||0,""==t&&Ai(i,r);!o.eol();)Oi(i,o,r),o.start=o.pos}function zi(e,t){if(!e||/^\s*$/.test(e))return null;var r=t.addModeClass?xs:ws;return r[e]||(r[e]=e.replace(/\S+/g,"cm-$&"))}function Fi(e,t){var r=Vo("span",null,null,xl?"padding-right: .1px":null),n={pre:Vo("pre",[r],"CodeMirror-line"),content:r,col:0,pos:0,cm:e,splitSpaces:(bl||xl)&&e.getOption("lineWrapping")};t.measure={};for(var i=0;i<=(t.rest?t.rest.length:0);i++){var o,l=i?t.rest[i-1]:t.line;n.pos=0,n.addToken=Bi,Jo(e.display.measure)&&(o=io(l))&&(n.addToken=Ui(n.addToken,o)),n.map=[];var s=t!=e.display.externalMeasured&&to(l);Ki(l,n,Ei(e,l,s)),l.styleClasses&&(l.styleClasses.bgClass&&(n.bgClass=_o(l.styleClasses.bgClass,n.bgClass||"")),l.styleClasses.textClass&&(n.textClass=_o(l.styleClasses.textClass,n.textClass||""))),0==n.map.length&&n.map.push(0,0,n.content.appendChild(Qo(e.display.measure))),0==i?(t.measure.map=n.map,t.measure.cache={}):((t.measure.maps||(t.measure.maps=[])).push(n.map),(t.measure.caches||(t.measure.caches=[])).push({}))}return xl&&/\bcm-tab\b/.test(n.content.lastChild.className)&&(n.content.className="cm-tab-wrap-hack"),Ds(e,"renderLine",e,t.line,n.pre),n.pre.className&&(n.textClass=_o(n.pre.className,n.textClass||"")),n}function Ri(e){var t=Vo("span","•","cm-invalidchar");return t.title="\\u"+e.charCodeAt(0).toString(16),t.setAttribute("aria-label",t.title),t}function Bi(e,t,r,n,i,o,l){if(t){var s=e.splitSpaces?t.replace(/ {3,}/g,Gi):t,a=e.cm.state.specialChars,u=!1;if(a.test(t))for(var c=document.createDocumentFragment(),h=0;;){a.lastIndex=h;var f=a.exec(t),d=f?f.index-h:t.length-h;if(d){var p=document.createTextNode(s.slice(h,h+d));c.appendChild(bl&&9>wl?Vo("span",[p]):p),e.map.push(e.pos,e.pos+d,p),e.col+=d,e.pos+=d}if(!f)break;if(h+=d+1,"	"==f[0]){var g=e.cm.options.tabSize,v=g-e.col%g,p=c.appendChild(Vo("span",Do(v),"cm-tab"));p.setAttribute("role","presentation"),p.setAttribute("cm-text","	"),e.col+=v}else if("\r"==f[0]||"\n"==f[0]){var p=c.appendChild(Vo("span","\r"==f[0]?"␍":"␤","cm-invalidchar"));p.setAttribute("cm-text",f[0]),e.col+=1}else{var p=e.cm.options.specialCharPlaceholder(f[0]);p.setAttribute("cm-text",f[0]),c.appendChild(bl&&9>wl?Vo("span",[p]):p),e.col+=1}e.map.push(e.pos,e.pos+1,p),e.pos++}else{e.col+=t.length;var c=document.createTextNode(s);e.map.push(e.pos,e.pos+t.length,c),bl&&9>wl&&(u=!0),e.pos+=t.length}if(r||n||i||u||l){var m=r||"";n&&(m+=n),i&&(m+=i);var y=Vo("span",[c],m,l);return o&&(y.title=o),e.content.appendChild(y)}e.content.appendChild(c)}}function Gi(e){for(var t=" ",r=0;r<e.length-2;++r)t+=r%2?" ":" ";return t+=" "}function Ui(e,t){return function(r,n,i,o,l,s,a){i=i?i+" cm-force-border":"cm-force-border";for(var u=r.pos,c=u+n.length;;){for(var h=0;h<t.length;h++){var f=t[h];if(f.to>u&&f.from<=u)break}if(f.to>=c)return e(r,n,i,o,l,s,a);e(r,n.slice(0,f.to-u),i,o,null,s,a),o=null,n=n.slice(f.to-u),u=f.to}}}function Vi(e,t,r,n){var i=!n&&r.widgetNode;i&&e.map.push(e.pos,e.pos+t,i),!n&&e.cm.display.input.needsContentAttribute&&(i||(i=e.content.appendChild(document.createElement("span"))),i.setAttribute("cm-marker",r.id)),i&&(e.cm.display.input.setUneditable(i),e.content.appendChild(i)),e.pos+=t}function Ki(e,t,r){var n=e.markedSpans,i=e.text,o=0;if(n)for(var l,s,a,u,c,h,f,d=i.length,p=0,g=1,v="",m=0;;){if(m==p){a=u=c=h=s="",f=null,m=1/0;for(var y,b=[],w=0;w<n.length;++w){var x=n[w],C=x.marker;"bookmark"==C.type&&x.from==p&&C.widgetNode?b.push(C):x.from<=p&&(null==x.to||x.to>p||C.collapsed&&x.to==p&&x.from==p)?(null!=x.to&&x.to!=p&&m>x.to&&(m=x.to,u=""),C.className&&(a+=" "+C.className),C.css&&(s=(s?s+";":"")+C.css),C.startStyle&&x.from==p&&(c+=" "+C.startStyle),C.endStyle&&x.to==m&&(y||(y=[])).push(C.endStyle,x.to),C.title&&!h&&(h=C.title),C.collapsed&&(!f||di(f.marker,C)<0)&&(f=x)):x.from>p&&m>x.from&&(m=x.from)}if(y)for(var w=0;w<y.length;w+=2)y[w+1]==m&&(u+=" "+y[w]);if(f&&(f.from||0)==p){if(Vi(t,(null==f.to?d+1:f.to)-p,f.marker,null==f.from),null==f.to)return;f.to==p&&(f=!1)}if(!f&&b.length)for(var w=0;w<b.length;++w)Vi(t,0,b[w])}if(p>=d)break;for(var S=Math.min(d,m);;){if(v){var L=p+v.length;if(!f){var T=L>S?v.slice(0,S-p):v;t.addToken(t,T,l?l+a:a,c,p+T.length==m?u:"",h,s)}if(L>=S){v=v.slice(S-p),p=S;break}p=L,c=""}v=i.slice(o,o=r[g++]),l=zi(r[g++],t.cm.options)}}else for(var g=1;g<r.length;g+=2)t.addToken(t,i.slice(o,o=r[g]),zi(r[g+1],t.cm.options))}function ji(e,t){return 0==t.from.ch&&0==t.to.ch&&""==Ho(t.text)&&(!e.cm||e.cm.options.wholeLineUpdateBefore)}function Xi(e,t,r,n){function i(e){return r?r[e]:null}function o(e,r,i){Mi(e,r,i,n),To(e,"change",e,t)}function l(e,t){for(var r=e,o=[];t>r;++r)o.push(new bs(u[r],i(r),n));return o}var s=t.from,a=t.to,u=t.text,c=Zi(e,s.line),h=Zi(e,a.line),f=Ho(u),d=i(u.length-1),p=a.line-s.line;if(t.full)e.insert(0,l(0,u.length)),e.remove(u.length,e.size-u.length);else if(ji(e,t)){var g=l(0,u.length-1);o(h,h.text,d),p&&e.remove(s.line,p),g.length&&e.insert(s.line,g)}else if(c==h)if(1==u.length)o(c,c.text.slice(0,s.ch)+f+c.text.slice(a.ch),d);else{var g=l(1,u.length-1);g.push(new bs(f+c.text.slice(a.ch),d,n)),o(c,c.text.slice(0,s.ch)+u[0],i(0)),e.insert(s.line+1,g)}else if(1==u.length)o(c,c.text.slice(0,s.ch)+u[0]+h.text.slice(a.ch),i(0)),e.remove(s.line+1,p);else{o(c,c.text.slice(0,s.ch)+u[0],i(0)),o(h,f+h.text.slice(a.ch),d);var g=l(1,u.length-1);p>1&&e.remove(s.line+1,p-1),e.insert(s.line+1,g)}To(e,"change",e,t)}function Yi(e){this.lines=e,this.parent=null;for(var t=0,r=0;t<e.length;++t)e[t].parent=this,r+=e[t].height;this.height=r}function _i(e){this.children=e;for(var t=0,r=0,n=0;n<e.length;++n){var i=e[n];t+=i.chunkSize(),r+=i.height,i.parent=this}this.size=t,this.height=r,this.parent=null}function $i(e,t,r){function n(e,i,o){if(e.linked)for(var l=0;l<e.linked.length;++l){var s=e.linked[l];if(s.doc!=i){var a=o&&s.sharedHist;(!r||a)&&(t(s.doc,a),n(s.doc,e,a))}}}n(e,null,!0)}function qi(e,t){if(t.cm)throw new Error("This document is already in use.");e.doc=t,t.cm=e,l(e),r(e),e.options.lineWrapping||f(e),e.options.mode=t.modeOption,Er(e)}function Zi(e,t){if(t-=e.first,0>t||t>=e.size)throw new Error("There is no line "+(t+e.first)+" in the document.");for(var r=e;!r.lines;)for(var n=0;;++n){var i=r.children[n],o=i.chunkSize();if(o>t){r=i;break}t-=o}return r.lines[t]}function Qi(e,t,r){var n=[],i=t.line;return e.iter(t.line,r.line+1,function(e){var o=e.text;i==r.line&&(o=o.slice(0,r.ch)),i==t.line&&(o=o.slice(t.ch)),n.push(o),++i}),n}function Ji(e,t,r){var n=[];return e.iter(t,r,function(e){n.push(e.text)}),n}function eo(e,t){var r=t-e.height;if(r)for(var n=e;n;n=n.parent)n.height+=r}function to(e){if(null==e.parent)return null;for(var t=e.parent,r=Po(t.lines,e),n=t.parent;n;t=n,n=n.parent)for(var i=0;n.children[i]!=t;++i)r+=n.children[i].chunkSize();return r+t.first}function ro(e,t){var r=e.first;e:do{for(var n=0;n<e.children.length;++n){var i=e.children[n],o=i.height;if(o>t){e=i;continue e}t-=o,r+=i.chunkSize()}return r}while(!e.lines);for(var n=0;n<e.lines.length;++n){var l=e.lines[n],s=l.height;if(s>t)break;t-=s}return r+n}function no(e){e=yi(e);for(var t=0,r=e.parent,n=0;n<r.lines.length;++n){var i=r.lines[n];if(i==e)break;t+=i.height}for(var o=r.parent;o;r=o,o=r.parent)for(var n=0;n<o.children.length;++n){var l=o.children[n];if(l==r)break;t+=l.height}return t}function io(e){var t=e.order;return null==t&&(t=e.order=la(e.text)),t}function oo(e){this.done=[],this.undone=[],this.undoDepth=1/0,this.lastModTime=this.lastSelTime=0,this.lastOp=this.lastSelOp=null,this.lastOrigin=this.lastSelOrigin=null,this.generation=this.maxGeneration=e||1}function lo(e,t){var r={from:Y(t.from),to:Ql(t),text:Qi(e,t.from,t.to)};return po(e,r,t.from.line,t.to.line+1),$i(e,function(e){po(e,r,t.from.line,t.to.line+1)},!0),r}function so(e){for(;e.length;){var t=Ho(e);if(!t.ranges)break;e.pop()}}function ao(e,t){return t?(so(e.done),Ho(e.done)):e.done.length&&!Ho(e.done).ranges?Ho(e.done):e.done.length>1&&!e.done[e.done.length-2].ranges?(e.done.pop(),Ho(e.done)):void 0}function uo(e,t,r,n){var i=e.history;i.undone.length=0;var o,l=+new Date;if((i.lastOp==n||i.lastOrigin==t.origin&&t.origin&&("+"==t.origin.charAt(0)&&e.cm&&i.lastModTime>l-e.cm.options.historyEventDelay||"*"==t.origin.charAt(0)))&&(o=ao(i,i.lastOp==n))){var s=Ho(o.changes);0==Fl(t.from,t.to)&&0==Fl(t.from,s.to)?s.to=Ql(t):o.changes.push(lo(e,t))}else{var a=Ho(i.done);for(a&&a.ranges||fo(e.sel,i.done),o={changes:[lo(e,t)],generation:i.generation},i.done.push(o);i.done.length>i.undoDepth;)i.done.shift(),i.done[0].ranges||i.done.shift()}i.done.push(r),i.generation=++i.maxGeneration,i.lastModTime=i.lastSelTime=l,i.lastOp=i.lastSelOp=n,i.lastOrigin=i.lastSelOrigin=t.origin,s||Ds(e,"historyAdded")}function co(e,t,r,n){var i=t.charAt(0);return"*"==i||"+"==i&&r.ranges.length==n.ranges.length&&r.somethingSelected()==n.somethingSelected()&&new Date-e.history.lastSelTime<=(e.cm?e.cm.options.historyEventDelay:500)}function ho(e,t,r,n){var i=e.history,o=n&&n.origin;r==i.lastSelOp||o&&i.lastSelOrigin==o&&(i.lastModTime==i.lastSelTime&&i.lastOrigin==o||co(e,o,Ho(i.done),t))?i.done[i.done.length-1]=t:fo(t,i.done),i.lastSelTime=+new Date,i.lastSelOrigin=o,i.lastSelOp=r,n&&n.clearRedo!==!1&&so(i.undone)}function fo(e,t){var r=Ho(t);r&&r.ranges&&r.equals(e)||t.push(e)}function po(e,t,r,n){var i=t["spans_"+e.id],o=0;e.iter(Math.max(e.first,r),Math.min(e.first+e.size,n),function(r){r.markedSpans&&((i||(i=t["spans_"+e.id]={}))[o]=r.markedSpans),++o})}function go(e){if(!e)return null;for(var t,r=0;r<e.length;++r)e[r].marker.explicitlyCleared?t||(t=e.slice(0,r)):t&&t.push(e[r]);return t?t.length?t:null:e}function vo(e,t){var r=t["spans_"+e.id];if(!r)return null;for(var n=0,i=[];n<t.text.length;++n)i.push(go(r[n]));return i}function mo(e,t,r){for(var n=0,i=[];n<e.length;++n){var o=e[n];if(o.ranges)i.push(r?ct.prototype.deepCopy.call(o):o);else{var l=o.changes,s=[];i.push({changes:s});for(var a=0;a<l.length;++a){var u,c=l[a];if(s.push({from:c.from,to:c.to,text:c.text}),t)for(var h in c)(u=h.match(/^spans_(\d+)$/))&&Po(t,Number(u[1]))>-1&&(Ho(s)[h]=c[h],delete c[h])}}}return i}function yo(e,t,r,n){r<e.line?e.line+=n:t<e.line&&(e.line=t,e.ch=0)}function bo(e,t,r,n){for(var i=0;i<e.length;++i){var o=e[i],l=!0;if(o.ranges){o.copied||(o=e[i]=o.deepCopy(),o.copied=!0);for(var s=0;s<o.ranges.length;s++)yo(o.ranges[s].anchor,t,r,n),yo(o.ranges[s].head,t,r,n)}else{for(var s=0;s<o.changes.length;++s){var a=o.changes[s];if(r<a.from.line)a.from=zl(a.from.line+n,a.from.ch),a.to=zl(a.to.line+n,a.to.ch);else if(t<=a.to.line){l=!1;break}}l||(e.splice(0,i+1),i=0)}}}function wo(e,t){var r=t.from.line,n=t.to.line,i=t.text.length-(n-r)-1;bo(e.done,r,n,i),bo(e.undone,r,n,i)}function xo(e){return null!=e.defaultPrevented?e.defaultPrevented:0==e.returnValue}function Co(e){return e.target||e.srcElement}function So(e){var t=e.which;return null==t&&(1&e.button?t=1:2&e.button?t=3:4&e.button&&(t=2)),Al&&e.ctrlKey&&1==t&&(t=3),t}function Lo(e,t,r){var n=e._handlers&&e._handlers[t];return r?n&&n.length>0?n.slice():As:n||As}function To(e,t){function r(e){return function(){e.apply(null,o)}}var n=Lo(e,t,!1);if(n.length){var i,o=Array.prototype.slice.call(arguments,2);Kl?i=Kl.delayedCallbacks:Hs?i=Hs:(i=Hs=[],setTimeout(ko,0));for(var l=0;l<n.length;++l)i.push(r(n[l]))}}function ko(){var e=Hs;Hs=null;for(var t=0;t<e.length;++t)e[t]()}function Mo(e,t,r){return"string"==typeof t&&(t={type:t,preventDefault:function(){this.defaultPrevented=!0}}),Ds(e,r||t.type,e,t),xo(t)||t.codemirrorIgnore}function No(e){var t=e._handlers&&e._handlers.cursorActivity;if(t)for(var r=e.curOp.cursorActivityHandlers||(e.curOp.cursorActivityHandlers=[]),n=0;n<t.length;++n)-1==Po(r,t[n])&&r.push(t[n])}function Wo(e,t){return Lo(e,t).length>0}function Ao(e){e.prototype.on=function(e,t){Ws(this,e,t)},e.prototype.off=function(e,t){Os(this,e,t)}}function Oo(){this.id=null}function Do(e){for(;Gs.length<=e;)Gs.push(Ho(Gs)+" ");return Gs[e]}function Ho(e){return e[e.length-1]}function Po(e,t){for(var r=0;r<e.length;++r)if(e[r]==t)return r;return-1}function Eo(e,t){for(var r=[],n=0;n<e.length;n++)r[n]=t(e[n],n);return r}function Io(){}function zo(e,t){var r;return Object.create?r=Object.create(e):(Io.prototype=e,r=new Io),t&&Fo(t,r),r}function Fo(e,t,r){t||(t={});for(var n in e)!e.hasOwnProperty(n)||r===!1&&t.hasOwnProperty(n)||(t[n]=e[n]);return t}function Ro(e){var t=Array.prototype.slice.call(arguments,1);return function(){return e.apply(null,t)}}function Bo(e,t){return t?t.source.indexOf("\\w")>-1&&js(e)?!0:t.test(e):js(e)}function Go(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!1;return!0}function Uo(e){return e.charCodeAt(0)>=768&&Xs.test(e)}function Vo(e,t,r,n){var i=document.createElement(e);if(r&&(i.className=r),n&&(i.style.cssText=n),"string"==typeof t)i.appendChild(document.createTextNode(t));else if(t)for(var o=0;o<t.length;++o)i.appendChild(t[o]);return i}function Ko(e){for(var t=e.childNodes.length;t>0;--t)e.removeChild(e.firstChild);return e}function jo(e,t){return Ko(e).appendChild(t)}function Xo(){for(var e=document.activeElement;e&&e.root&&e.root.activeElement;)e=e.root.activeElement;return e}function Yo(e){return new RegExp("(^|\\s)"+e+"(?:$|\\s)\\s*")}function _o(e,t){for(var r=e.split(" "),n=0;n<r.length;n++)r[n]&&!Yo(r[n]).test(t)&&(t+=" "+r[n]);return t}function $o(e){if(document.body.getElementsByClassName)for(var t=document.body.getElementsByClassName("CodeMirror"),r=0;r<t.length;r++){var n=t[r].CodeMirror;n&&e(n)}}function qo(){Qs||(Zo(),Qs=!0)}function Zo(){var e;Ws(window,"resize",function(){null==e&&(e=setTimeout(function(){e=null,$o(Kr)},100))}),Ws(window,"blur",function(){$o(yn)})}function Qo(e){if(null==_s){var t=Vo("span","​");jo(e,Vo("span",[t,document.createTextNode("x")])),0!=e.firstChild.offsetHeight&&(_s=t.offsetWidth<=1&&t.offsetHeight>2&&!(bl&&8>wl))}var r=_s?Vo("span","​"):Vo("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px");return r.setAttribute("cm-text",""),r}function Jo(e){if(null!=$s)return $s;var t=jo(e,document.createTextNode("AخA")),r=Vs(t,0,1).getBoundingClientRect();if(!r||r.left==r.right)return!1;var n=Vs(t,1,2).getBoundingClientRect();return $s=n.right-r.right<3}function el(e){if(null!=na)return na;var t=jo(e,Vo("span","x")),r=t.getBoundingClientRect(),n=Vs(t,0,1).getBoundingClientRect();return na=Math.abs(r.left-n.left)>1}function tl(e,t,r,n){if(!e)return n(t,r,"ltr");for(var i=!1,o=0;o<e.length;++o){var l=e[o];(l.from<r&&l.to>t||t==r&&l.to==t)&&(n(Math.max(l.from,t),Math.min(l.to,r),1==l.level?"rtl":"ltr"),i=!0)}i||n(t,r,"ltr")}function rl(e){return e.level%2?e.to:e.from}function nl(e){return e.level%2?e.from:e.to}function il(e){var t=io(e);return t?rl(t[0]):0}function ol(e){var t=io(e);return t?nl(Ho(t)):e.text.length}function ll(e,t){var r=Zi(e.doc,t),n=yi(r);n!=r&&(t=to(n));var i=io(n),o=i?i[0].level%2?ol(n):il(n):0;return zl(t,o)}function sl(e,t){for(var r,n=Zi(e.doc,t);r=vi(n);)n=r.find(1,!0).line,t=null;var i=io(n),o=i?i[0].level%2?il(n):ol(n):n.text.length;return zl(null==t?to(n):t,o)}function al(e,t){var r=ll(e,t.line),n=Zi(e.doc,r.line),i=io(n);if(!i||0==i[0].level){var o=Math.max(0,n.text.search(/\S/)),l=t.line==r.line&&t.ch<=o&&t.ch;return zl(r.line,l?0:o)}return r}function ul(e,t,r){var n=e[0].level;return t==n?!0:r==n?!1:r>t}function cl(e,t){oa=null;for(var r,n=0;n<e.length;++n){var i=e[n];if(i.from<t&&i.to>t)return n;if(i.from==t||i.to==t){if(null!=r)return ul(e,i.level,e[r].level)?(i.from!=i.to&&(oa=r),n):(i.from!=i.to&&(oa=n),r);r=n}}return r}function hl(e,t,r,n){if(!n)return t+r;do t+=r;while(t>0&&Uo(e.text.charAt(t)));return t}function fl(e,t,r,n){var i=io(e);if(!i)return dl(e,t,r,n);for(var o=cl(i,t),l=i[o],s=hl(e,t,l.level%2?-r:r,n);;){if(s>l.from&&s<l.to)return s;if(s==l.from||s==l.to)return cl(i,s)==o?s:(l=i[o+=r],r>0==l.level%2?l.to:l.from);if(l=i[o+=r],!l)return null;s=r>0==l.level%2?hl(e,l.to,-1,n):hl(e,l.from,1,n)}}function dl(e,t,r,n){var i=t+r;if(n)for(;i>0&&Uo(e.text.charAt(i));)i+=r;return 0>i||i>e.text.length?null:i}var pl=navigator.userAgent,gl=navigator.platform,vl=/gecko\/\d/i.test(pl),ml=/MSIE \d/.test(pl),yl=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(pl),bl=ml||yl,wl=bl&&(ml?document.documentMode||6:yl[1]),xl=/WebKit\//.test(pl),Cl=xl&&/Qt\/\d+\.\d+/.test(pl),Sl=/Chrome\//.test(pl),Ll=/Opera\//.test(pl),Tl=/Apple Computer/.test(navigator.vendor),kl=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(pl),Ml=/PhantomJS/.test(pl),Nl=/AppleWebKit/.test(pl)&&/Mobile\/\w+/.test(pl),Wl=Nl||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(pl),Al=Nl||/Mac/.test(gl),Ol=/win/i.test(gl),Dl=Ll&&pl.match(/Version\/(\d*\.\d*)/);Dl&&(Dl=Number(Dl[1])),Dl&&Dl>=15&&(Ll=!1,xl=!0);var Hl=Al&&(Cl||Ll&&(null==Dl||12.11>Dl)),Pl=vl||bl&&wl>=9,El=!1,Il=!1;g.prototype=Fo({update:function(e){var t=e.scrollWidth>e.clientWidth+1,r=e.scrollHeight>e.clientHeight+1,n=e.nativeBarWidth;if(r){this.vert.style.display="block",this.vert.style.bottom=t?n+"px":"0";var i=e.viewHeight-(t?n:0);this.vert.firstChild.style.height=Math.max(0,e.scrollHeight-e.clientHeight+i)+"px"}else this.vert.style.display="",this.vert.firstChild.style.height="0";if(t){this.horiz.style.display="block",this.horiz.style.right=r?n+"px":"0",this.horiz.style.left=e.barLeft+"px";var o=e.viewWidth-e.barLeft-(r?n:0);this.horiz.firstChild.style.width=e.scrollWidth-e.clientWidth+o+"px"}else this.horiz.style.display="",this.horiz.firstChild.style.width="0";return!this.checkedZeroWidth&&e.clientHeight>0&&(0==n&&this.zeroWidthHack(),this.checkedZeroWidth=!0),{right:r?n:0,bottom:t?n:0}},setScrollLeft:function(e){this.horiz.scrollLeft!=e&&(this.horiz.scrollLeft=e),this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz)},setScrollTop:function(e){this.vert.scrollTop!=e&&(this.vert.scrollTop=e),this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert)},zeroWidthHack:function(){var e=Al&&!kl?"12px":"18px";this.horiz.style.height=this.vert.style.width=e,this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none",this.disableHoriz=new Oo,this.disableVert=new Oo},enableZeroWidthBar:function(e,t){function r(){var n=e.getBoundingClientRect(),i=document.elementFromPoint(n.left+1,n.bottom-1);i!=e?e.style.pointerEvents="none":t.set(1e3,r)}e.style.pointerEvents="auto",t.set(1e3,r)},clear:function(){var e=this.horiz.parentNode;e.removeChild(this.horiz),e.removeChild(this.vert)}},g.prototype),v.prototype=Fo({update:function(){return{bottom:0,right:0}},setScrollLeft:function(){},setScrollTop:function(){},clear:function(){}},v.prototype),e.scrollbarModel={"native":g,"null":v},T.prototype.signal=function(e,t){Wo(e,t)&&this.events.push(arguments)},T.prototype.finish=function(){for(var e=0;e<this.events.length;e++)Ds.apply(null,this.events[e])};var zl=e.Pos=function(e,t){return this instanceof zl?(this.line=e,void(this.ch=t)):new zl(e,t)},Fl=e.cmpPos=function(e,t){return e.line-t.line||e.ch-t.ch},Rl=null;rt.prototype=Fo({init:function(e){function t(e){if(n.somethingSelected())Rl=n.getSelections(),r.inaccurateSelection&&(r.prevInput="",r.inaccurateSelection=!1,o.value=Rl.join("\n"),Us(o));
else{if(!n.options.lineWiseCopyCut)return;var t=et(n);Rl=t.text,"cut"==e.type?n.setSelections(t.ranges,null,Is):(r.prevInput="",o.value=t.text.join("\n"),Us(o))}"cut"==e.type&&(n.state.cutIncoming=!0)}var r=this,n=this.cm,i=this.wrapper=nt(),o=this.textarea=i.firstChild;e.wrapper.insertBefore(i,e.wrapper.firstChild),Nl&&(o.style.width="0px"),Ws(o,"input",function(){bl&&wl>=9&&r.hasSelection&&(r.hasSelection=null),r.poll()}),Ws(o,"paste",function(e){Mo(n,e)||Q(e,n)||(n.state.pasteIncoming=!0,r.fastPoll())}),Ws(o,"cut",t),Ws(o,"copy",t),Ws(e.scroller,"paste",function(t){jr(e,t)||Mo(n,t)||(n.state.pasteIncoming=!0,r.focus())}),Ws(e.lineSpace,"selectstart",function(t){jr(e,t)||ks(t)}),Ws(o,"compositionstart",function(){var e=n.getCursor("from");r.composing&&r.composing.range.clear(),r.composing={start:e,range:n.markText(e,n.getCursor("to"),{className:"CodeMirror-composing"})}}),Ws(o,"compositionend",function(){r.composing&&(r.poll(),r.composing.range.clear(),r.composing=null)})},prepareSelection:function(){var e=this.cm,t=e.display,r=e.doc,n=Et(e);if(e.options.moveInputWithCursor){var i=dr(e,r.sel.primary().head,"div"),o=t.wrapper.getBoundingClientRect(),l=t.lineDiv.getBoundingClientRect();n.teTop=Math.max(0,Math.min(t.wrapper.clientHeight-10,i.top+l.top-o.top)),n.teLeft=Math.max(0,Math.min(t.wrapper.clientWidth-10,i.left+l.left-o.left))}return n},showSelection:function(e){var t=this.cm,r=t.display;jo(r.cursorDiv,e.cursors),jo(r.selectionDiv,e.selection),null!=e.teTop&&(this.wrapper.style.top=e.teTop+"px",this.wrapper.style.left=e.teLeft+"px")},reset:function(e){if(!this.contextMenuPending){var t,r,n=this.cm,i=n.doc;if(n.somethingSelected()){this.prevInput="";var o=i.sel.primary();t=ra&&(o.to().line-o.from().line>100||(r=n.getSelection()).length>1e3);var l=t?"-":r||n.getSelection();this.textarea.value=l,n.state.focused&&Us(this.textarea),bl&&wl>=9&&(this.hasSelection=l)}else e||(this.prevInput=this.textarea.value="",bl&&wl>=9&&(this.hasSelection=null));this.inaccurateSelection=t}},getField:function(){return this.textarea},supportsTouch:function(){return!1},focus:function(){if("nocursor"!=this.cm.options.readOnly&&(!Wl||Xo()!=this.textarea))try{this.textarea.focus()}catch(e){}},blur:function(){this.textarea.blur()},resetPosition:function(){this.wrapper.style.top=this.wrapper.style.left=0},receivedFocus:function(){this.slowPoll()},slowPoll:function(){var e=this;e.pollingFast||e.polling.set(this.cm.options.pollInterval,function(){e.poll(),e.cm.state.focused&&e.slowPoll()})},fastPoll:function(){function e(){var n=r.poll();n||t?(r.pollingFast=!1,r.slowPoll()):(t=!0,r.polling.set(60,e))}var t=!1,r=this;r.pollingFast=!0,r.polling.set(20,e)},poll:function(){var e=this.cm,t=this.textarea,r=this.prevInput;if(this.contextMenuPending||!e.state.focused||ta(t)&&!r&&!this.composing||e.isReadOnly()||e.options.disableInput||e.state.keySeq)return!1;var n=t.value;if(n==r&&!e.somethingSelected())return!1;if(bl&&wl>=9&&this.hasSelection===n||Al&&/[\uf700-\uf7ff]/.test(n))return e.display.input.reset(),!1;if(e.doc.sel==e.display.selForContextMenu){var i=n.charCodeAt(0);if(8203!=i||r||(r="​"),8666==i)return this.reset(),this.cm.execCommand("undo")}for(var o=0,l=Math.min(r.length,n.length);l>o&&r.charCodeAt(o)==n.charCodeAt(o);)++o;var s=this;return Wr(e,function(){Z(e,n.slice(o),r.length-o,null,s.composing?"*compose":null),n.length>1e3||n.indexOf("\n")>-1?t.value=s.prevInput="":s.prevInput=n,s.composing&&(s.composing.range.clear(),s.composing.range=e.markText(s.composing.start,e.getCursor("to"),{className:"CodeMirror-composing"}))}),!0},ensurePolled:function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)},onKeyPress:function(){bl&&wl>=9&&(this.hasSelection=null),this.fastPoll()},onContextMenu:function(e){function t(){if(null!=l.selectionStart){var e=i.somethingSelected(),t="​"+(e?l.value:"");l.value="⇚",l.value=t,n.prevInput=e?"":"​",l.selectionStart=1,l.selectionEnd=t.length,o.selForContextMenu=i.doc.sel}}function r(){if(n.contextMenuPending=!1,n.wrapper.style.position="relative",l.style.cssText=c,bl&&9>wl&&o.scrollbars.setScrollTop(o.scroller.scrollTop=a),null!=l.selectionStart){(!bl||bl&&9>wl)&&t();var e=0,r=function(){o.selForContextMenu==i.doc.sel&&0==l.selectionStart&&l.selectionEnd>0&&"​"==n.prevInput?Ar(i,us.selectAll)(i):e++<10?o.detectingSelectAll=setTimeout(r,500):o.input.reset()};o.detectingSelectAll=setTimeout(r,200)}}var n=this,i=n.cm,o=i.display,l=n.textarea,s=Xr(i,e),a=o.scroller.scrollTop;if(s&&!Ll){var u=i.options.resetSelectionOnContextMenu;u&&-1==i.doc.sel.contains(s)&&Ar(i,kt)(i.doc,dt(s),Is);var c=l.style.cssText;if(n.wrapper.style.position="absolute",l.style.cssText="position: fixed; width: 30px; height: 30px; top: "+(e.clientY-5)+"px; left: "+(e.clientX-5)+"px; z-index: 1000; background: "+(bl?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);",xl)var h=window.scrollY;if(o.input.focus(),xl&&window.scrollTo(null,h),o.input.reset(),i.somethingSelected()||(l.value=n.prevInput=" "),n.contextMenuPending=!0,o.selForContextMenu=i.doc.sel,clearTimeout(o.detectingSelectAll),bl&&wl>=9&&t(),Pl){Ns(e);var f=function(){Os(window,"mouseup",f),setTimeout(r,20)};Ws(window,"mouseup",f)}else setTimeout(r,50)}},readOnlyChanged:function(e){e||this.reset()},setUneditable:Io,needsContentAttribute:!1},rt.prototype),it.prototype=Fo({init:function(e){function t(e){if(n.somethingSelected())Rl=n.getSelections(),"cut"==e.type&&n.replaceSelection("",null,"cut");else{if(!n.options.lineWiseCopyCut)return;var t=et(n);Rl=t.text,"cut"==e.type&&n.operation(function(){n.setSelections(t.ranges,0,Is),n.replaceSelection("",null,"cut")})}if(e.clipboardData&&!Nl)e.preventDefault(),e.clipboardData.clearData(),e.clipboardData.setData("text/plain",Rl.join("\n"));else{var r=nt(),i=r.firstChild;n.display.lineSpace.insertBefore(r,n.display.lineSpace.firstChild),i.value=Rl.join("\n");var o=document.activeElement;Us(i),setTimeout(function(){n.display.lineSpace.removeChild(r),o.focus()},50)}}var r=this,n=r.cm,i=r.div=e.lineDiv;tt(i),Ws(i,"paste",function(e){Mo(n,e)||Q(e,n)}),Ws(i,"compositionstart",function(e){var t=e.data;if(r.composing={sel:n.doc.sel,data:t,startData:t},t){var i=n.doc.sel.primary(),o=n.getLine(i.head.line),l=o.indexOf(t,Math.max(0,i.head.ch-t.length));l>-1&&l<=i.head.ch&&(r.composing.sel=dt(zl(i.head.line,l),zl(i.head.line,l+t.length)))}}),Ws(i,"compositionupdate",function(e){r.composing.data=e.data}),Ws(i,"compositionend",function(e){var t=r.composing;t&&(e.data==t.startData||/\u200b/.test(e.data)||(t.data=e.data),setTimeout(function(){t.handled||r.applyComposition(t),r.composing==t&&(r.composing=null)},50))}),Ws(i,"touchstart",function(){r.forceCompositionEnd()}),Ws(i,"input",function(){r.composing||(n.isReadOnly()||!r.pollContent())&&Wr(r.cm,function(){Er(n)})}),Ws(i,"copy",t),Ws(i,"cut",t)},prepareSelection:function(){var e=Et(this.cm,!1);return e.focus=this.cm.state.focused,e},showSelection:function(e){e&&this.cm.display.view.length&&(e.focus&&this.showPrimarySelection(),this.showMultipleSelections(e))},showPrimarySelection:function(){var e=window.getSelection(),t=this.cm.doc.sel.primary(),r=st(this.cm,e.anchorNode,e.anchorOffset),n=st(this.cm,e.focusNode,e.focusOffset);if(!r||r.bad||!n||n.bad||0!=Fl($(r,n),t.from())||0!=Fl(_(r,n),t.to())){var i=ot(this.cm,t.from()),o=ot(this.cm,t.to());if(i||o){var l=this.cm.display.view,s=e.rangeCount&&e.getRangeAt(0);if(i){if(!o){var a=l[l.length-1].measure,u=a.maps?a.maps[a.maps.length-1]:a.map;o={node:u[u.length-1],offset:u[u.length-2]-u[u.length-3]}}}else i={node:l[0].measure.map[2],offset:0};try{var c=Vs(i.node,i.offset,o.offset,o.node)}catch(h){}c&&(!vl&&this.cm.state.focused?(e.collapse(i.node,i.offset),c.collapsed||e.addRange(c)):(e.removeAllRanges(),e.addRange(c)),s&&null==e.anchorNode?e.addRange(s):vl&&this.startGracePeriod()),this.rememberSelection()}}},startGracePeriod:function(){var e=this;clearTimeout(this.gracePeriod),this.gracePeriod=setTimeout(function(){e.gracePeriod=!1,e.selectionChanged()&&e.cm.operation(function(){e.cm.curOp.selectionChanged=!0})},20)},showMultipleSelections:function(e){jo(this.cm.display.cursorDiv,e.cursors),jo(this.cm.display.selectionDiv,e.selection)},rememberSelection:function(){var e=window.getSelection();this.lastAnchorNode=e.anchorNode,this.lastAnchorOffset=e.anchorOffset,this.lastFocusNode=e.focusNode,this.lastFocusOffset=e.focusOffset},selectionInEditor:function(){var e=window.getSelection();if(!e.rangeCount)return!1;var t=e.getRangeAt(0).commonAncestorContainer;return Ys(this.div,t)},focus:function(){"nocursor"!=this.cm.options.readOnly&&this.div.focus()},blur:function(){this.div.blur()},getField:function(){return this.div},supportsTouch:function(){return!0},receivedFocus:function(){function e(){t.cm.state.focused&&(t.pollSelection(),t.polling.set(t.cm.options.pollInterval,e))}var t=this;this.selectionInEditor()?this.pollSelection():Wr(this.cm,function(){t.cm.curOp.selectionChanged=!0}),this.polling.set(this.cm.options.pollInterval,e)},selectionChanged:function(){var e=window.getSelection();return e.anchorNode!=this.lastAnchorNode||e.anchorOffset!=this.lastAnchorOffset||e.focusNode!=this.lastFocusNode||e.focusOffset!=this.lastFocusOffset},pollSelection:function(){if(!this.composing&&!this.gracePeriod&&this.selectionChanged()){var e=window.getSelection(),t=this.cm;this.rememberSelection();var r=st(t,e.anchorNode,e.anchorOffset),n=st(t,e.focusNode,e.focusOffset);r&&n&&Wr(t,function(){kt(t.doc,dt(r,n),Is),(r.bad||n.bad)&&(t.curOp.selectionChanged=!0)})}},pollContent:function(){var e=this.cm,t=e.display,r=e.doc.sel.primary(),n=r.from(),i=r.to();if(n.line<t.viewFrom||i.line>t.viewTo-1)return!1;var o;if(n.line==t.viewFrom||0==(o=Fr(e,n.line)))var l=to(t.view[0].line),s=t.view[0].node;else var l=to(t.view[o].line),s=t.view[o-1].node.nextSibling;var a=Fr(e,i.line);if(a==t.view.length-1)var u=t.viewTo-1,c=t.lineDiv.lastChild;else var u=to(t.view[a+1].line)-1,c=t.view[a+1].node.previousSibling;for(var h=e.doc.splitLines(ut(e,s,c,l,u)),f=Qi(e.doc,zl(l,0),zl(u,Zi(e.doc,u).text.length));h.length>1&&f.length>1;)if(Ho(h)==Ho(f))h.pop(),f.pop(),u--;else{if(h[0]!=f[0])break;h.shift(),f.shift(),l++}for(var d=0,p=0,g=h[0],v=f[0],m=Math.min(g.length,v.length);m>d&&g.charCodeAt(d)==v.charCodeAt(d);)++d;for(var y=Ho(h),b=Ho(f),w=Math.min(y.length-(1==h.length?d:0),b.length-(1==f.length?d:0));w>p&&y.charCodeAt(y.length-p-1)==b.charCodeAt(b.length-p-1);)++p;h[h.length-1]=y.slice(0,y.length-p),h[0]=h[0].slice(d);var x=zl(l,d),C=zl(u,f.length?Ho(f).length-p:0);return h.length>1||h[0]||Fl(x,C)?(Dn(e.doc,h,x,C,"+input"),!0):void 0},ensurePolled:function(){this.forceCompositionEnd()},reset:function(){this.forceCompositionEnd()},forceCompositionEnd:function(){this.composing&&!this.composing.handled&&(this.applyComposition(this.composing),this.composing.handled=!0,this.div.blur(),this.div.focus())},applyComposition:function(e){this.cm.isReadOnly()?Ar(this.cm,Er)(this.cm):e.data&&e.data!=e.startData&&Ar(this.cm,Z)(this.cm,e.data,0,e.sel)},setUneditable:function(e){e.contentEditable="false"},onKeyPress:function(e){e.preventDefault(),this.cm.isReadOnly()||Ar(this.cm,Z)(this.cm,String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),0)},readOnlyChanged:function(e){this.div.contentEditable=String("nocursor"!=e)},onContextMenu:Io,resetPosition:Io,needsContentAttribute:!0},it.prototype),e.inputStyles={textarea:rt,contenteditable:it},ct.prototype={primary:function(){return this.ranges[this.primIndex]},equals:function(e){if(e==this)return!0;if(e.primIndex!=this.primIndex||e.ranges.length!=this.ranges.length)return!1;for(var t=0;t<this.ranges.length;t++){var r=this.ranges[t],n=e.ranges[t];if(0!=Fl(r.anchor,n.anchor)||0!=Fl(r.head,n.head))return!1}return!0},deepCopy:function(){for(var e=[],t=0;t<this.ranges.length;t++)e[t]=new ht(Y(this.ranges[t].anchor),Y(this.ranges[t].head));return new ct(e,this.primIndex)},somethingSelected:function(){for(var e=0;e<this.ranges.length;e++)if(!this.ranges[e].empty())return!0;return!1},contains:function(e,t){t||(t=e);for(var r=0;r<this.ranges.length;r++){var n=this.ranges[r];if(Fl(t,n.from())>=0&&Fl(e,n.to())<=0)return r}return-1}},ht.prototype={from:function(){return $(this.anchor,this.head)},to:function(){return _(this.anchor,this.head)},empty:function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}};var Bl,Gl,Ul,Vl={left:0,right:0,top:0,bottom:0},Kl=null,jl=0,Xl=0,Yl=0,_l=null;bl?_l=-.53:vl?_l=15:Sl?_l=-.7:Tl&&(_l=-1/3);var $l=function(e){var t=e.wheelDeltaX,r=e.wheelDeltaY;return null==t&&e.detail&&e.axis==e.HORIZONTAL_AXIS&&(t=e.detail),null==r&&e.detail&&e.axis==e.VERTICAL_AXIS?r=e.detail:null==r&&(r=e.wheelDelta),{x:t,y:r}};e.wheelEventPixels=function(e){var t=$l(e);return t.x*=_l,t.y*=_l,t};var ql=new Oo,Zl=null,Ql=e.changeEnd=function(e){return e.text?zl(e.from.line+e.text.length-1,Ho(e.text).length+(1==e.text.length?e.from.ch:0)):e.to};e.prototype={constructor:e,focus:function(){window.focus(),this.display.input.focus()},setOption:function(e,t){var r=this.options,n=r[e];(r[e]!=t||"mode"==e)&&(r[e]=t,es.hasOwnProperty(e)&&Ar(this,es[e])(this,t,n))},getOption:function(e){return this.options[e]},getDoc:function(){return this.doc},addKeyMap:function(e,t){this.state.keyMaps[t?"push":"unshift"](Yn(e))},removeKeyMap:function(e){for(var t=this.state.keyMaps,r=0;r<t.length;++r)if(t[r]==e||t[r].name==e)return t.splice(r,1),!0},addOverlay:Or(function(t,r){var n=t.token?t:e.getMode(this.options,t);if(n.startState)throw new Error("Overlays may not be stateful.");this.state.overlays.push({mode:n,modeSpec:t,opaque:r&&r.opaque}),this.state.modeGen++,Er(this)}),removeOverlay:Or(function(e){for(var t=this.state.overlays,r=0;r<t.length;++r){var n=t[r].modeSpec;if(n==e||"string"==typeof e&&n.name==e)return t.splice(r,1),this.state.modeGen++,void Er(this)}}),indentLine:Or(function(e,t,r){"string"!=typeof t&&"number"!=typeof t&&(t=null==t?this.options.smartIndent?"smart":"prev":t?"add":"subtract"),mt(this.doc,e)&&Bn(this,e,t,r)}),indentSelection:Or(function(e){for(var t=this.doc.sel.ranges,r=-1,n=0;n<t.length;n++){var i=t[n];if(i.empty())i.head.line>r&&(Bn(this,i.head.line,e,!0),r=i.head.line,n==this.doc.sel.primIndex&&Fn(this));else{var o=i.from(),l=i.to(),s=Math.max(r,o.line);r=Math.min(this.lastLine(),l.line-(l.ch?0:1))+1;for(var a=s;r>a;++a)Bn(this,a,e);var u=this.doc.sel.ranges;0==o.ch&&t.length==u.length&&u[n].from().ch>0&&Ct(this.doc,n,new ht(o,u[n].to()),Is)}}}),getTokenAt:function(e,t){return Di(this,e,t)},getLineTokens:function(e,t){return Di(this,zl(e),t,!0)},getTokenTypeAt:function(e){e=gt(this.doc,e);var t,r=Ei(this,Zi(this.doc,e.line)),n=0,i=(r.length-1)/2,o=e.ch;if(0==o)t=r[2];else for(;;){var l=n+i>>1;if((l?r[2*l-1]:0)>=o)i=l;else{if(!(r[2*l+1]<o)){t=r[2*l+2];break}n=l+1}}var s=t?t.indexOf("cm-overlay "):-1;return 0>s?t:0==s?null:t.slice(0,s-1)},getModeAt:function(t){var r=this.doc.mode;return r.innerMode?e.innerMode(r,this.getTokenAt(t).state).mode:r},getHelper:function(e,t){return this.getHelpers(e,t)[0]},getHelpers:function(e,t){var r=[];if(!ls.hasOwnProperty(t))return r;var n=ls[t],i=this.getModeAt(e);if("string"==typeof i[t])n[i[t]]&&r.push(n[i[t]]);else if(i[t])for(var o=0;o<i[t].length;o++){var l=n[i[t][o]];l&&r.push(l)}else i.helperType&&n[i.helperType]?r.push(n[i.helperType]):n[i.name]&&r.push(n[i.name]);for(var o=0;o<n._global.length;o++){var s=n._global[o];s.pred(i,this)&&-1==Po(r,s.val)&&r.push(s.val)}return r},getStateAfter:function(e,t){var r=this.doc;return e=pt(r,null==e?r.first+r.size-1:e),Ut(this,e+1,t)},cursorCoords:function(e,t){var r,n=this.doc.sel.primary();return r=null==e?n.head:"object"==typeof e?gt(this.doc,e):e?n.from():n.to(),dr(this,r,t||"page")},charCoords:function(e,t){return fr(this,gt(this.doc,e),t||"page")},coordsChar:function(e,t){return e=hr(this,e,t||"page"),vr(this,e.left,e.top)},lineAtHeight:function(e,t){return e=hr(this,{top:e,left:0},t||"page").top,ro(this.doc,e+this.display.viewOffset)},heightAtLine:function(e,t){var r,n=!1;if("number"==typeof e){var i=this.doc.first+this.doc.size-1;e<this.doc.first?e=this.doc.first:e>i&&(e=i,n=!0),r=Zi(this.doc,e)}else r=e;return cr(this,r,{top:0,left:0},t||"page").top+(n?this.doc.height-no(r):0)},defaultTextHeight:function(){return yr(this.display)},defaultCharWidth:function(){return br(this.display)},setGutterMarker:Or(function(e,t,r){return Gn(this.doc,e,"gutter",function(e){var n=e.gutterMarkers||(e.gutterMarkers={});return n[t]=r,!r&&Go(n)&&(e.gutterMarkers=null),!0})}),clearGutter:Or(function(e){var t=this,r=t.doc,n=r.first;r.iter(function(r){r.gutterMarkers&&r.gutterMarkers[e]&&(r.gutterMarkers[e]=null,Ir(t,n,"gutter"),Go(r.gutterMarkers)&&(r.gutterMarkers=null)),++n})}),lineInfo:function(e){if("number"==typeof e){if(!mt(this.doc,e))return null;var t=e;if(e=Zi(this.doc,e),!e)return null}else{var t=to(e);if(null==t)return null}return{line:t,handle:e,text:e.text,gutterMarkers:e.gutterMarkers,textClass:e.textClass,bgClass:e.bgClass,wrapClass:e.wrapClass,widgets:e.widgets}},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(e,t,r,n,i){var o=this.display;e=dr(this,gt(this.doc,e));var l=e.bottom,s=e.left;if(t.style.position="absolute",t.setAttribute("cm-ignore-events","true"),this.display.input.setUneditable(t),o.sizer.appendChild(t),"over"==n)l=e.top;else if("above"==n||"near"==n){var a=Math.max(o.wrapper.clientHeight,this.doc.height),u=Math.max(o.sizer.clientWidth,o.lineSpace.clientWidth);("above"==n||e.bottom+t.offsetHeight>a)&&e.top>t.offsetHeight?l=e.top-t.offsetHeight:e.bottom+t.offsetHeight<=a&&(l=e.bottom),s+t.offsetWidth>u&&(s=u-t.offsetWidth)}t.style.top=l+"px",t.style.left=t.style.right="","right"==i?(s=o.sizer.clientWidth-t.offsetWidth,t.style.right="0px"):("left"==i?s=0:"middle"==i&&(s=(o.sizer.clientWidth-t.offsetWidth)/2),t.style.left=s+"px"),r&&En(this,s,l,s+t.offsetWidth,l+t.offsetHeight)},triggerOnKeyDown:Or(fn),triggerOnKeyPress:Or(gn),triggerOnKeyUp:pn,execCommand:function(e){return us.hasOwnProperty(e)?us[e].call(null,this):void 0},triggerElectric:Or(function(e){J(this,e)}),findPosH:function(e,t,r,n){var i=1;0>t&&(i=-1,t=-t);for(var o=0,l=gt(this.doc,e);t>o&&(l=Vn(this.doc,l,i,r,n),!l.hitSide);++o);return l},moveH:Or(function(e,t){var r=this;r.extendSelectionsBy(function(n){return r.display.shift||r.doc.extend||n.empty()?Vn(r.doc,n.head,e,t,r.options.rtlMoveVisually):0>e?n.from():n.to()},Fs)}),deleteH:Or(function(e,t){var r=this.doc.sel,n=this.doc;r.somethingSelected()?n.replaceSelection("",null,"+delete"):Un(this,function(r){var i=Vn(n,r.head,e,t,!1);return 0>e?{from:i,to:r.head}:{from:r.head,to:i}})}),findPosV:function(e,t,r,n){var i=1,o=n;0>t&&(i=-1,t=-t);for(var l=0,s=gt(this.doc,e);t>l;++l){var a=dr(this,s,"div");if(null==o?o=a.left:a.left=o,s=Kn(this,a,i,r),s.hitSide)break}return s},moveV:Or(function(e,t){var r=this,n=this.doc,i=[],o=!r.display.shift&&!n.extend&&n.sel.somethingSelected();if(n.extendSelectionsBy(function(l){if(o)return 0>e?l.from():l.to();var s=dr(r,l.head,"div");null!=l.goalColumn&&(s.left=l.goalColumn),i.push(s.left);var a=Kn(r,s,e,t);return"page"==t&&l==n.sel.primary()&&zn(r,null,fr(r,a,"div").top-s.top),a},Fs),i.length)for(var l=0;l<n.sel.ranges.length;l++)n.sel.ranges[l].goalColumn=i[l]}),findWordAt:function(e){var t=this.doc,r=Zi(t,e.line).text,n=e.ch,i=e.ch;if(r){var o=this.getHelper(e,"wordChars");(e.xRel<0||i==r.length)&&n?--n:++i;for(var l=r.charAt(n),s=Bo(l,o)?function(e){return Bo(e,o)}:/\s/.test(l)?function(e){return/\s/.test(e)}:function(e){return!/\s/.test(e)&&!Bo(e)};n>0&&s(r.charAt(n-1));)--n;for(;i<r.length&&s(r.charAt(i));)++i}return new ht(zl(e.line,n),zl(e.line,i))},toggleOverwrite:function(e){(null==e||e!=this.state.overwrite)&&((this.state.overwrite=!this.state.overwrite)?Zs(this.display.cursorDiv,"CodeMirror-overwrite"):qs(this.display.cursorDiv,"CodeMirror-overwrite"),Ds(this,"overwriteToggle",this,this.state.overwrite))},hasFocus:function(){return this.display.input.getField()==Xo()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:Or(function(e,t){(null!=e||null!=t)&&Rn(this),null!=e&&(this.curOp.scrollLeft=e),null!=t&&(this.curOp.scrollTop=t)}),getScrollInfo:function(){var e=this.display.scroller;return{left:e.scrollLeft,top:e.scrollTop,height:e.scrollHeight-Xt(this)-this.display.barHeight,width:e.scrollWidth-Xt(this)-this.display.barWidth,clientHeight:_t(this),clientWidth:Yt(this)}},scrollIntoView:Or(function(e,t){if(null==e?(e={from:this.doc.sel.primary().head,to:null},null==t&&(t=this.options.cursorScrollMargin)):"number"==typeof e?e={from:zl(e,0),to:null}:null==e.from&&(e={from:e,to:null}),e.to||(e.to=e.from),e.margin=t||0,null!=e.from.line)Rn(this),this.curOp.scrollToPos=e;else{var r=In(this,Math.min(e.from.left,e.to.left),Math.min(e.from.top,e.to.top)-e.margin,Math.max(e.from.right,e.to.right),Math.max(e.from.bottom,e.to.bottom)+e.margin);this.scrollTo(r.scrollLeft,r.scrollTop)}}),setSize:Or(function(e,t){function r(e){return"number"==typeof e||/^\d+$/.test(String(e))?e+"px":e}var n=this;null!=e&&(n.display.wrapper.style.width=r(e)),null!=t&&(n.display.wrapper.style.height=r(t)),n.options.lineWrapping&&lr(this);var i=n.display.viewFrom;n.doc.iter(i,n.display.viewTo,function(e){if(e.widgets)for(var t=0;t<e.widgets.length;t++)if(e.widgets[t].noHScroll){Ir(n,i,"widget");break}++i}),n.curOp.forceUpdate=!0,Ds(n,"refresh",this)}),operation:function(e){return Wr(this,e)},refresh:Or(function(){var e=this.display.cachedTextHeight;Er(this),this.curOp.forceUpdate=!0,sr(this),this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop),c(this),(null==e||Math.abs(e-yr(this.display))>.5)&&l(this),Ds(this,"refresh",this)}),swapDoc:Or(function(e){var t=this.doc;return t.cm=null,qi(this,e),sr(this),this.display.input.reset(),this.scrollTo(e.scrollLeft,e.scrollTop),this.curOp.forceScroll=!0,To(this,"swapDoc",this,t),t}),getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}},Ao(e);var Jl=e.defaults={},es=e.optionHandlers={},ts=e.Init={toString:function(){return"CodeMirror.Init"}};jn("value","",function(e,t){e.setValue(t)},!0),jn("mode",null,function(e,t){e.doc.modeOption=t,r(e)},!0),jn("indentUnit",2,r,!0),jn("indentWithTabs",!1),jn("smartIndent",!0),jn("tabSize",4,function(e){n(e),sr(e),Er(e)},!0),jn("lineSeparator",null,function(e,t){if(e.doc.lineSep=t,t){var r=[],n=e.doc.first;e.doc.iter(function(e){for(var i=0;;){var o=e.text.indexOf(t,i);if(-1==o)break;i=o+t.length,r.push(zl(n,o))}n++});for(var i=r.length-1;i>=0;i--)Dn(e.doc,t,r[i],zl(r[i].line,r[i].ch+t.length))}}),jn("specialChars",/[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,function(t,r,n){t.state.specialChars=new RegExp(r.source+(r.test("	")?"":"|	"),"g"),n!=e.Init&&t.refresh()}),jn("specialCharPlaceholder",Ri,function(e){e.refresh()},!0),jn("electricChars",!0),jn("inputStyle",Wl?"contenteditable":"textarea",function(){throw new Error("inputStyle can not (yet) be changed in a running editor")},!0),jn("rtlMoveVisually",!Ol),jn("wholeLineUpdateBefore",!0),jn("theme","default",function(e){s(e),a(e)},!0),jn("keyMap","default",function(t,r,n){var i=Yn(r),o=n!=e.Init&&Yn(n);o&&o.detach&&o.detach(t,i),i.attach&&i.attach(t,o||null)}),jn("extraKeys",null),jn("lineWrapping",!1,i,!0),jn("gutters",[],function(e){d(e.options),a(e)},!0),jn("fixedGutter",!0,function(e,t){e.display.gutters.style.left=t?L(e.display)+"px":"0",e.refresh()},!0),jn("coverGutterNextToScrollbar",!1,function(e){y(e)},!0),jn("scrollbarStyle","native",function(e){m(e),y(e),e.display.scrollbars.setScrollTop(e.doc.scrollTop),e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)},!0),jn("lineNumbers",!1,function(e){d(e.options),a(e)},!0),jn("firstLineNumber",1,a,!0),jn("lineNumberFormatter",function(e){return e},a,!0),jn("showCursorWhenSelecting",!1,Pt,!0),jn("resetSelectionOnContextMenu",!0),jn("lineWiseCopyCut",!0),jn("readOnly",!1,function(e,t){"nocursor"==t?(yn(e),e.display.input.blur(),e.display.disabled=!0):e.display.disabled=!1,e.display.input.readOnlyChanged(t)}),jn("disableInput",!1,function(e,t){t||e.display.input.reset()},!0),jn("dragDrop",!0,Vr),jn("allowDropFileTypes",null),jn("cursorBlinkRate",530),jn("cursorScrollMargin",0),jn("cursorHeight",1,Pt,!0),jn("singleCursorHeightPerLine",!0,Pt,!0),jn("workTime",100),jn("workDelay",100),jn("flattenSpans",!0,n,!0),jn("addModeClass",!1,n,!0),jn("pollInterval",100),jn("undoDepth",200,function(e,t){e.doc.history.undoDepth=t}),jn("historyEventDelay",1250),jn("viewportMargin",10,function(e){e.refresh()},!0),jn("maxHighlightLength",1e4,n,!0),jn("moveInputWithCursor",!0,function(e,t){t||e.display.input.resetPosition()}),jn("tabindex",null,function(e,t){e.display.input.getField().tabIndex=t||""}),jn("autofocus",null);var rs=e.modes={},ns=e.mimeModes={};e.defineMode=function(t,r){e.defaults.mode||"null"==t||(e.defaults.mode=t),arguments.length>2&&(r.dependencies=Array.prototype.slice.call(arguments,2)),rs[t]=r},e.defineMIME=function(e,t){ns[e]=t},e.resolveMode=function(t){if("string"==typeof t&&ns.hasOwnProperty(t))t=ns[t];else if(t&&"string"==typeof t.name&&ns.hasOwnProperty(t.name)){var r=ns[t.name];"string"==typeof r&&(r={name:r}),t=zo(r,t),t.name=r.name}else if("string"==typeof t&&/^[\w\-]+\/[\w\-]+\+xml$/.test(t))return e.resolveMode("application/xml");return"string"==typeof t?{name:t}:t||{name:"null"}},e.getMode=function(t,r){var r=e.resolveMode(r),n=rs[r.name];if(!n)return e.getMode(t,"text/plain");var i=n(t,r);if(is.hasOwnProperty(r.name)){var o=is[r.name];for(var l in o)o.hasOwnProperty(l)&&(i.hasOwnProperty(l)&&(i["_"+l]=i[l]),i[l]=o[l])}if(i.name=r.name,r.helperType&&(i.helperType=r.helperType),r.modeProps)for(var l in r.modeProps)i[l]=r.modeProps[l];return i},e.defineMode("null",function(){return{token:function(e){e.skipToEnd()}}}),e.defineMIME("text/plain","null");var is=e.modeExtensions={};e.extendMode=function(e,t){var r=is.hasOwnProperty(e)?is[e]:is[e]={};Fo(t,r)},e.defineExtension=function(t,r){e.prototype[t]=r},e.defineDocExtension=function(e,t){Ss.prototype[e]=t},e.defineOption=jn;var os=[];e.defineInitHook=function(e){os.push(e)};var ls=e.helpers={};e.registerHelper=function(t,r,n){ls.hasOwnProperty(t)||(ls[t]=e[t]={_global:[]}),ls[t][r]=n},e.registerGlobalHelper=function(t,r,n,i){e.registerHelper(t,r,i),ls[t]._global.push({pred:n,val:i})};var ss=e.copyState=function(e,t){if(t===!0)return t;if(e.copyState)return e.copyState(t);var r={};for(var n in t){var i=t[n];i instanceof Array&&(i=i.concat([])),r[n]=i}return r},as=e.startState=function(e,t,r){return e.startState?e.startState(t,r):!0};e.innerMode=function(e,t){for(;e.innerMode;){var r=e.innerMode(t);if(!r||r.mode==e)break;t=r.state,e=r.mode}return r||{mode:e,state:t}};var us=e.commands={selectAll:function(e){e.setSelection(zl(e.firstLine(),0),zl(e.lastLine()),Is)},singleSelection:function(e){e.setSelection(e.getCursor("anchor"),e.getCursor("head"),Is)},killLine:function(e){Un(e,function(t){if(t.empty()){var r=Zi(e.doc,t.head.line).text.length;return t.head.ch==r&&t.head.line<e.lastLine()?{from:t.head,to:zl(t.head.line+1,0)}:{from:t.head,to:zl(t.head.line,r)}}return{from:t.from(),to:t.to()}})},deleteLine:function(e){Un(e,function(t){return{from:zl(t.from().line,0),to:gt(e.doc,zl(t.to().line+1,0))}})},delLineLeft:function(e){Un(e,function(e){return{from:zl(e.from().line,0),to:e.from()}})},delWrappedLineLeft:function(e){Un(e,function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:0,top:r},"div");return{from:n,to:t.from()}})},delWrappedLineRight:function(e){Un(e,function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div");return{from:t.from(),to:n}})},undo:function(e){e.undo()},redo:function(e){e.redo()},undoSelection:function(e){e.undoSelection()},redoSelection:function(e){e.redoSelection()},goDocStart:function(e){e.extendSelection(zl(e.firstLine(),0))},goDocEnd:function(e){e.extendSelection(zl(e.lastLine()))},goLineStart:function(e){e.extendSelectionsBy(function(t){return ll(e,t.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(e){e.extendSelectionsBy(function(t){return al(e,t.head)},{origin:"+move",bias:1})},goLineEnd:function(e){e.extendSelectionsBy(function(t){return sl(e,t.head.line)},{origin:"+move",bias:-1})},goLineRight:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5;return e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div")},Fs)},goLineLeft:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5;return e.coordsChar({left:0,top:r},"div")},Fs)},goLineLeftSmart:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:0,top:r},"div");return n.ch<e.getLine(n.line).search(/\S/)?al(e,t.head):n},Fs)},goLineUp:function(e){e.moveV(-1,"line")},goLineDown:function(e){e.moveV(1,"line")},goPageUp:function(e){e.moveV(-1,"page")},goPageDown:function(e){e.moveV(1,"page")},goCharLeft:function(e){e.moveH(-1,"char")},goCharRight:function(e){e.moveH(1,"char")},goColumnLeft:function(e){e.moveH(-1,"column")},goColumnRight:function(e){e.moveH(1,"column")},goWordLeft:function(e){e.moveH(-1,"word")},goGroupRight:function(e){e.moveH(1,"group")},goGroupLeft:function(e){e.moveH(-1,"group")},goWordRight:function(e){e.moveH(1,"word")},delCharBefore:function(e){e.deleteH(-1,"char")},delCharAfter:function(e){e.deleteH(1,"char")},delWordBefore:function(e){e.deleteH(-1,"word")},delWordAfter:function(e){e.deleteH(1,"word")},delGroupBefore:function(e){e.deleteH(-1,"group")},delGroupAfter:function(e){e.deleteH(1,"group")},indentAuto:function(e){e.indentSelection("smart")},indentMore:function(e){e.indentSelection("add")},indentLess:function(e){e.indentSelection("subtract")},insertTab:function(e){e.replaceSelection("	")},insertSoftTab:function(e){for(var t=[],r=e.listSelections(),n=e.options.tabSize,i=0;i<r.length;i++){var o=r[i].from(),l=Rs(e.getLine(o.line),o.ch,n);t.push(new Array(n-l%n+1).join(" "))}e.replaceSelections(t)},defaultTab:function(e){e.somethingSelected()?e.indentSelection("add"):e.execCommand("insertTab")},transposeChars:function(e){Wr(e,function(){for(var t=e.listSelections(),r=[],n=0;n<t.length;n++){var i=t[n].head,o=Zi(e.doc,i.line).text;if(o)if(i.ch==o.length&&(i=new zl(i.line,i.ch-1)),i.ch>0)i=new zl(i.line,i.ch+1),e.replaceRange(o.charAt(i.ch-1)+o.charAt(i.ch-2),zl(i.line,i.ch-2),i,"+transpose");else if(i.line>e.doc.first){var l=Zi(e.doc,i.line-1).text;l&&e.replaceRange(o.charAt(0)+e.doc.lineSeparator()+l.charAt(l.length-1),zl(i.line-1,l.length-1),zl(i.line,1),"+transpose")}r.push(new ht(i,i))}e.setSelections(r)})},newlineAndIndent:function(e){Wr(e,function(){for(var t=e.listSelections().length,r=0;t>r;r++){var n=e.listSelections()[r];e.replaceRange(e.doc.lineSeparator(),n.anchor,n.head,"+input"),e.indentLine(n.from().line+1,null,!0)}Fn(e)})},toggleOverwrite:function(e){e.toggleOverwrite()}},cs=e.keyMap={};cs.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},cs.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"},cs.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars"},cs.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic","emacsy"]},cs["default"]=Al?cs.macDefault:cs.pcDefault,e.normalizeKeyMap=function(e){var t={};
for(var r in e)if(e.hasOwnProperty(r)){var n=e[r];if(/^(name|fallthrough|(de|at)tach)$/.test(r))continue;if("..."==n){delete e[r];continue}for(var i=Eo(r.split(" "),Xn),o=0;o<i.length;o++){var l,s;o==i.length-1?(s=i.join(" "),l=n):(s=i.slice(0,o+1).join(" "),l="...");var a=t[s];if(a){if(a!=l)throw new Error("Inconsistent bindings for "+s)}else t[s]=l}delete e[r]}for(var u in t)e[u]=t[u];return e};var hs=e.lookupKey=function(e,t,r,n){t=Yn(t);var i=t.call?t.call(e,n):t[e];if(i===!1)return"nothing";if("..."===i)return"multi";if(null!=i&&r(i))return"handled";if(t.fallthrough){if("[object Array]"!=Object.prototype.toString.call(t.fallthrough))return hs(e,t.fallthrough,r,n);for(var o=0;o<t.fallthrough.length;o++){var l=hs(e,t.fallthrough[o],r,n);if(l)return l}}},fs=e.isModifierKey=function(e){var t="string"==typeof e?e:ia[e.keyCode];return"Ctrl"==t||"Alt"==t||"Shift"==t||"Mod"==t},ds=e.keyName=function(e,t){if(Ll&&34==e.keyCode&&e["char"])return!1;var r=ia[e.keyCode],n=r;return null==n||e.altGraphKey?!1:(e.altKey&&"Alt"!=r&&(n="Alt-"+n),(Hl?e.metaKey:e.ctrlKey)&&"Ctrl"!=r&&(n="Ctrl-"+n),(Hl?e.ctrlKey:e.metaKey)&&"Cmd"!=r&&(n="Cmd-"+n),!t&&e.shiftKey&&"Shift"!=r&&(n="Shift-"+n),n)};e.fromTextArea=function(t,r){function n(){t.value=u.getValue()}if(r=r?Fo(r):{},r.value=t.value,!r.tabindex&&t.tabIndex&&(r.tabindex=t.tabIndex),!r.placeholder&&t.placeholder&&(r.placeholder=t.placeholder),null==r.autofocus){var i=Xo();r.autofocus=i==t||null!=t.getAttribute("autofocus")&&i==document.body}if(t.form&&(Ws(t.form,"submit",n),!r.leaveSubmitMethodAlone)){var o=t.form,l=o.submit;try{var s=o.submit=function(){n(),o.submit=l,o.submit(),o.submit=s}}catch(a){}}r.finishInit=function(e){e.save=n,e.getTextArea=function(){return t},e.toTextArea=function(){e.toTextArea=isNaN,n(),t.parentNode.removeChild(e.getWrapperElement()),t.style.display="",t.form&&(Os(t.form,"submit",n),"function"==typeof t.form.submit&&(t.form.submit=l))}},t.style.display="none";var u=e(function(e){t.parentNode.insertBefore(e,t.nextSibling)},r);return u};var ps=e.StringStream=function(e,t){this.pos=this.start=0,this.string=e,this.tabSize=t||8,this.lastColumnPos=this.lastColumnValue=0,this.lineStart=0};ps.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){return this.pos<this.string.length?this.string.charAt(this.pos++):void 0},eat:function(e){var t=this.string.charAt(this.pos);if("string"==typeof e)var r=t==e;else var r=t&&(e.test?e.test(t):e(t));return r?(++this.pos,t):void 0},eatWhile:function(e){for(var t=this.pos;this.eat(e););return this.pos>t},eatSpace:function(){for(var e=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>e},skipToEnd:function(){this.pos=this.string.length},skipTo:function(e){var t=this.string.indexOf(e,this.pos);return t>-1?(this.pos=t,!0):void 0},backUp:function(e){this.pos-=e},column:function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=Rs(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue-(this.lineStart?Rs(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return Rs(this.string,null,this.tabSize)-(this.lineStart?Rs(this.string,this.lineStart,this.tabSize):0)},match:function(e,t,r){if("string"!=typeof e){var n=this.string.slice(this.pos).match(e);return n&&n.index>0?null:(n&&t!==!1&&(this.pos+=n[0].length),n)}var i=function(e){return r?e.toLowerCase():e},o=this.string.substr(this.pos,e.length);return i(o)==i(e)?(t!==!1&&(this.pos+=e.length),!0):void 0},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(e,t){this.lineStart+=e;try{return t()}finally{this.lineStart-=e}}};var gs=0,vs=e.TextMarker=function(e,t){this.lines=[],this.type=t,this.doc=e,this.id=++gs};Ao(vs),vs.prototype.clear=function(){if(!this.explicitlyCleared){var e=this.doc.cm,t=e&&!e.curOp;if(t&&wr(e),Wo(this,"clear")){var r=this.find();r&&To(this,"clear",r.from,r.to)}for(var n=null,i=null,o=0;o<this.lines.length;++o){var l=this.lines[o],s=ei(l.markedSpans,this);e&&!this.collapsed?Ir(e,to(l),"text"):e&&(null!=s.to&&(i=to(l)),null!=s.from&&(n=to(l))),l.markedSpans=ti(l.markedSpans,s),null==s.from&&this.collapsed&&!Ci(this.doc,l)&&e&&eo(l,yr(e.display))}if(e&&this.collapsed&&!e.options.lineWrapping)for(var o=0;o<this.lines.length;++o){var a=yi(this.lines[o]),u=h(a);u>e.display.maxLineLength&&(e.display.maxLine=a,e.display.maxLineLength=u,e.display.maxLineChanged=!0)}null!=n&&e&&this.collapsed&&Er(e,n,i+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,e&&Wt(e.doc)),e&&To(e,"markerCleared",e,this),t&&Cr(e),this.parent&&this.parent.clear()}},vs.prototype.find=function(e,t){null==e&&"bookmark"==this.type&&(e=1);for(var r,n,i=0;i<this.lines.length;++i){var o=this.lines[i],l=ei(o.markedSpans,this);if(null!=l.from&&(r=zl(t?o:to(o),l.from),-1==e))return r;if(null!=l.to&&(n=zl(t?o:to(o),l.to),1==e))return n}return r&&{from:r,to:n}},vs.prototype.changed=function(){var e=this.find(-1,!0),t=this,r=this.doc.cm;e&&r&&Wr(r,function(){var n=e.line,i=to(e.line),o=Jt(r,i);if(o&&(or(o),r.curOp.selectionChanged=r.curOp.forceUpdate=!0),r.curOp.updateMaxLine=!0,!Ci(t.doc,n)&&null!=t.height){var l=t.height;t.height=null;var s=Ti(t)-l;s&&eo(n,n.height+s)}})},vs.prototype.attachLine=function(e){if(!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp;t.maybeHiddenMarkers&&-1!=Po(t.maybeHiddenMarkers,this)||(t.maybeUnhiddenMarkers||(t.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(e)},vs.prototype.detachLine=function(e){if(this.lines.splice(Po(this.lines,e),1),!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp;(t.maybeHiddenMarkers||(t.maybeHiddenMarkers=[])).push(this)}};var gs=0,ms=e.SharedTextMarker=function(e,t){this.markers=e,this.primary=t;for(var r=0;r<e.length;++r)e[r].parent=this};Ao(ms),ms.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var e=0;e<this.markers.length;++e)this.markers[e].clear();To(this,"clear")}},ms.prototype.find=function(e,t){return this.primary.find(e,t)};var ys=e.LineWidget=function(e,t,r){if(r)for(var n in r)r.hasOwnProperty(n)&&(this[n]=r[n]);this.doc=e,this.node=t};Ao(ys),ys.prototype.clear=function(){var e=this.doc.cm,t=this.line.widgets,r=this.line,n=to(r);if(null!=n&&t){for(var i=0;i<t.length;++i)t[i]==this&&t.splice(i--,1);t.length||(r.widgets=null);var o=Ti(this);eo(r,Math.max(0,r.height-o)),e&&Wr(e,function(){Li(e,r,-o),Ir(e,n,"widget")})}},ys.prototype.changed=function(){var e=this.height,t=this.doc.cm,r=this.line;this.height=null;var n=Ti(this)-e;n&&(eo(r,r.height+n),t&&Wr(t,function(){t.curOp.forceUpdate=!0,Li(t,r,n)}))};var bs=e.Line=function(e,t,r){this.text=e,ci(this,t),this.height=r?r(this):1};Ao(bs),bs.prototype.lineNo=function(){return to(this)};var ws={},xs={};Yi.prototype={chunkSize:function(){return this.lines.length},removeInner:function(e,t){for(var r=e,n=e+t;n>r;++r){var i=this.lines[r];this.height-=i.height,Ni(i),To(i,"delete")}this.lines.splice(e,t)},collapse:function(e){e.push.apply(e,this.lines)},insertInner:function(e,t,r){this.height+=r,this.lines=this.lines.slice(0,e).concat(t).concat(this.lines.slice(e));for(var n=0;n<t.length;++n)t[n].parent=this},iterN:function(e,t,r){for(var n=e+t;n>e;++e)if(r(this.lines[e]))return!0}},_i.prototype={chunkSize:function(){return this.size},removeInner:function(e,t){this.size-=t;for(var r=0;r<this.children.length;++r){var n=this.children[r],i=n.chunkSize();if(i>e){var o=Math.min(t,i-e),l=n.height;if(n.removeInner(e,o),this.height-=l-n.height,i==o&&(this.children.splice(r--,1),n.parent=null),0==(t-=o))break;e=0}else e-=i}if(this.size-t<25&&(this.children.length>1||!(this.children[0]instanceof Yi))){var s=[];this.collapse(s),this.children=[new Yi(s)],this.children[0].parent=this}},collapse:function(e){for(var t=0;t<this.children.length;++t)this.children[t].collapse(e)},insertInner:function(e,t,r){this.size+=t.length,this.height+=r;for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize();if(o>=e){if(i.insertInner(e,t,r),i.lines&&i.lines.length>50){for(;i.lines.length>50;){var l=i.lines.splice(i.lines.length-25,25),s=new Yi(l);i.height-=s.height,this.children.splice(n+1,0,s),s.parent=this}this.maybeSpill()}break}e-=o}},maybeSpill:function(){if(!(this.children.length<=10)){var e=this;do{var t=e.children.splice(e.children.length-5,5),r=new _i(t);if(e.parent){e.size-=r.size,e.height-=r.height;var n=Po(e.parent.children,e);e.parent.children.splice(n+1,0,r)}else{var i=new _i(e.children);i.parent=e,e.children=[i,r],e=i}r.parent=e.parent}while(e.children.length>10);e.parent.maybeSpill()}},iterN:function(e,t,r){for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize();if(o>e){var l=Math.min(t,o-e);if(i.iterN(e,l,r))return!0;if(0==(t-=l))break;e=0}else e-=o}}};var Cs=0,Ss=e.Doc=function(e,t,r,n){if(!(this instanceof Ss))return new Ss(e,t,r,n);null==r&&(r=0),_i.call(this,[new Yi([new bs("",null)])]),this.first=r,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.cleanGeneration=1,this.frontier=r;var i=zl(r,0);this.sel=dt(i),this.history=new oo(null),this.id=++Cs,this.modeOption=t,this.lineSep=n,this.extend=!1,"string"==typeof e&&(e=this.splitLines(e)),Xi(this,{from:i,to:i,text:e}),kt(this,dt(i),Is)};Ss.prototype=zo(_i.prototype,{constructor:Ss,iter:function(e,t,r){r?this.iterN(e-this.first,t-e,r):this.iterN(this.first,this.first+this.size,e)},insert:function(e,t){for(var r=0,n=0;n<t.length;++n)r+=t[n].height;this.insertInner(e-this.first,t,r)},remove:function(e,t){this.removeInner(e-this.first,t)},getValue:function(e){var t=Ji(this,this.first,this.first+this.size);return e===!1?t:t.join(e||this.lineSeparator())},setValue:Dr(function(e){var t=zl(this.first,0),r=this.first+this.size-1;kn(this,{from:t,to:zl(r,Zi(this,r).text.length),text:this.splitLines(e),origin:"setValue",full:!0},!0),kt(this,dt(t))}),replaceRange:function(e,t,r,n){t=gt(this,t),r=r?gt(this,r):t,Dn(this,e,t,r,n)},getRange:function(e,t,r){var n=Qi(this,gt(this,e),gt(this,t));return r===!1?n:n.join(r||this.lineSeparator())},getLine:function(e){var t=this.getLineHandle(e);return t&&t.text},getLineHandle:function(e){return mt(this,e)?Zi(this,e):void 0},getLineNumber:function(e){return to(e)},getLineHandleVisualStart:function(e){return"number"==typeof e&&(e=Zi(this,e)),yi(e)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(e){return gt(this,e)},getCursor:function(e){var t,r=this.sel.primary();return t=null==e||"head"==e?r.head:"anchor"==e?r.anchor:"end"==e||"to"==e||e===!1?r.to():r.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:Dr(function(e,t,r){St(this,gt(this,"number"==typeof e?zl(e,t||0):e),null,r)}),setSelection:Dr(function(e,t,r){St(this,gt(this,e),gt(this,t||e),r)}),extendSelection:Dr(function(e,t,r){wt(this,gt(this,e),t&&gt(this,t),r)}),extendSelections:Dr(function(e,t){xt(this,yt(this,e),t)}),extendSelectionsBy:Dr(function(e,t){var r=Eo(this.sel.ranges,e);xt(this,yt(this,r),t)}),setSelections:Dr(function(e,t,r){if(e.length){for(var n=0,i=[];n<e.length;n++)i[n]=new ht(gt(this,e[n].anchor),gt(this,e[n].head));null==t&&(t=Math.min(e.length-1,this.sel.primIndex)),kt(this,ft(i,t),r)}}),addSelection:Dr(function(e,t,r){var n=this.sel.ranges.slice(0);n.push(new ht(gt(this,e),gt(this,t||e))),kt(this,ft(n,n.length-1),r)}),getSelection:function(e){for(var t,r=this.sel.ranges,n=0;n<r.length;n++){var i=Qi(this,r[n].from(),r[n].to());t=t?t.concat(i):i}return e===!1?t:t.join(e||this.lineSeparator())},getSelections:function(e){for(var t=[],r=this.sel.ranges,n=0;n<r.length;n++){var i=Qi(this,r[n].from(),r[n].to());e!==!1&&(i=i.join(e||this.lineSeparator())),t[n]=i}return t},replaceSelection:function(e,t,r){for(var n=[],i=0;i<this.sel.ranges.length;i++)n[i]=e;this.replaceSelections(n,t,r||"+input")},replaceSelections:Dr(function(e,t,r){for(var n=[],i=this.sel,o=0;o<i.ranges.length;o++){var l=i.ranges[o];n[o]={from:l.from(),to:l.to(),text:this.splitLines(e[o]),origin:r}}for(var s=t&&"end"!=t&&Ln(this,n,t),o=n.length-1;o>=0;o--)kn(this,n[o]);s?Tt(this,s):this.cm&&Fn(this.cm)}),undo:Dr(function(){Nn(this,"undo")}),redo:Dr(function(){Nn(this,"redo")}),undoSelection:Dr(function(){Nn(this,"undo",!0)}),redoSelection:Dr(function(){Nn(this,"redo",!0)}),setExtending:function(e){this.extend=e},getExtending:function(){return this.extend},historySize:function(){for(var e=this.history,t=0,r=0,n=0;n<e.done.length;n++)e.done[n].ranges||++t;for(var n=0;n<e.undone.length;n++)e.undone[n].ranges||++r;return{undo:t,redo:r}},clearHistory:function(){this.history=new oo(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(e){return e&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null),this.history.generation},isClean:function(e){return this.history.generation==(e||this.cleanGeneration)},getHistory:function(){return{done:mo(this.history.done),undone:mo(this.history.undone)}},setHistory:function(e){var t=this.history=new oo(this.history.maxGeneration);t.done=mo(e.done.slice(0),null,!0),t.undone=mo(e.undone.slice(0),null,!0)},addLineClass:Dr(function(e,t,r){return Gn(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass";if(e[n]){if(Yo(r).test(e[n]))return!1;e[n]+=" "+r}else e[n]=r;return!0})}),removeLineClass:Dr(function(e,t,r){return Gn(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass",i=e[n];if(!i)return!1;if(null==r)e[n]=null;else{var o=i.match(Yo(r));if(!o)return!1;var l=o.index+o[0].length;e[n]=i.slice(0,o.index)+(o.index&&l!=i.length?" ":"")+i.slice(l)||null}return!0})}),addLineWidget:Dr(function(e,t,r){return ki(this,e,t,r)}),removeLineWidget:function(e){e.clear()},markText:function(e,t,r){return _n(this,gt(this,e),gt(this,t),r,r&&r.type||"range")},setBookmark:function(e,t){var r={replacedWith:t&&(null==t.nodeType?t.widget:t),insertLeft:t&&t.insertLeft,clearWhenEmpty:!1,shared:t&&t.shared,handleMouseEvents:t&&t.handleMouseEvents};return e=gt(this,e),_n(this,e,e,r,"bookmark")},findMarksAt:function(e){e=gt(this,e);var t=[],r=Zi(this,e.line).markedSpans;if(r)for(var n=0;n<r.length;++n){var i=r[n];(null==i.from||i.from<=e.ch)&&(null==i.to||i.to>=e.ch)&&t.push(i.marker.parent||i.marker)}return t},findMarks:function(e,t,r){e=gt(this,e),t=gt(this,t);var n=[],i=e.line;return this.iter(e.line,t.line+1,function(o){var l=o.markedSpans;if(l)for(var s=0;s<l.length;s++){var a=l[s];i==e.line&&e.ch>a.to||null==a.from&&i!=e.line||i==t.line&&a.from>t.ch||r&&!r(a.marker)||n.push(a.marker.parent||a.marker)}++i}),n},getAllMarks:function(){var e=[];return this.iter(function(t){var r=t.markedSpans;if(r)for(var n=0;n<r.length;++n)null!=r[n].from&&e.push(r[n].marker)}),e},posFromIndex:function(e){var t,r=this.first;return this.iter(function(n){var i=n.text.length+1;return i>e?(t=e,!0):(e-=i,void++r)}),gt(this,zl(r,t))},indexFromPos:function(e){e=gt(this,e);var t=e.ch;return e.line<this.first||e.ch<0?0:(this.iter(this.first,e.line,function(e){t+=e.text.length+1}),t)},copy:function(e){var t=new Ss(Ji(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep);return t.scrollTop=this.scrollTop,t.scrollLeft=this.scrollLeft,t.sel=this.sel,t.extend=!1,e&&(t.history.undoDepth=this.history.undoDepth,t.setHistory(this.getHistory())),t},linkedDoc:function(e){e||(e={});var t=this.first,r=this.first+this.size;null!=e.from&&e.from>t&&(t=e.from),null!=e.to&&e.to<r&&(r=e.to);var n=new Ss(Ji(this,t,r),e.mode||this.modeOption,t,this.lineSep);return e.sharedHist&&(n.history=this.history),(this.linked||(this.linked=[])).push({doc:n,sharedHist:e.sharedHist}),n.linked=[{doc:this,isParent:!0,sharedHist:e.sharedHist}],Zn(n,qn(this)),n},unlinkDoc:function(t){if(t instanceof e&&(t=t.doc),this.linked)for(var r=0;r<this.linked.length;++r){var n=this.linked[r];if(n.doc==t){this.linked.splice(r,1),t.unlinkDoc(this),Qn(qn(this));break}}if(t.history==this.history){var i=[t.id];$i(t,function(e){i.push(e.id)},!0),t.history=new oo(null),t.history.done=mo(this.history.done,i),t.history.undone=mo(this.history.undone,i)}},iterLinkedDocs:function(e){$i(this,e)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(e){return this.lineSep?e.split(this.lineSep):ea(e)},lineSeparator:function(){return this.lineSep||"\n"}}),Ss.prototype.eachLine=Ss.prototype.iter;var Ls="iter insert remove copy getEditor constructor".split(" ");for(var Ts in Ss.prototype)Ss.prototype.hasOwnProperty(Ts)&&Po(Ls,Ts)<0&&(e.prototype[Ts]=function(e){return function(){return e.apply(this.doc,arguments)}}(Ss.prototype[Ts]));Ao(Ss);var ks=e.e_preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},Ms=e.e_stopPropagation=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},Ns=e.e_stop=function(e){ks(e),Ms(e)},Ws=e.on=function(e,t,r){if(e.addEventListener)e.addEventListener(t,r,!1);else if(e.attachEvent)e.attachEvent("on"+t,r);else{var n=e._handlers||(e._handlers={}),i=n[t]||(n[t]=[]);i.push(r)}},As=[],Os=e.off=function(e,t,r){if(e.removeEventListener)e.removeEventListener(t,r,!1);else if(e.detachEvent)e.detachEvent("on"+t,r);else for(var n=Lo(e,t,!1),i=0;i<n.length;++i)if(n[i]==r){n.splice(i,1);break}},Ds=e.signal=function(e,t){var r=Lo(e,t,!0);if(r.length)for(var n=Array.prototype.slice.call(arguments,2),i=0;i<r.length;++i)r[i].apply(null,n)},Hs=null,Ps=30,Es=e.Pass={toString:function(){return"CodeMirror.Pass"}},Is={scroll:!1},zs={origin:"*mouse"},Fs={origin:"+move"};Oo.prototype.set=function(e,t){clearTimeout(this.id),this.id=setTimeout(t,e)};var Rs=e.countColumn=function(e,t,r,n,i){null==t&&(t=e.search(/[^\s\u00a0]/),-1==t&&(t=e.length));for(var o=n||0,l=i||0;;){var s=e.indexOf("	",o);if(0>s||s>=t)return l+(t-o);l+=s-o,l+=r-l%r,o=s+1}},Bs=e.findColumn=function(e,t,r){for(var n=0,i=0;;){var o=e.indexOf("	",n);-1==o&&(o=e.length);var l=o-n;if(o==e.length||i+l>=t)return n+Math.min(l,t-i);if(i+=o-n,i+=r-i%r,n=o+1,i>=t)return n}},Gs=[""],Us=function(e){e.select()};Nl?Us=function(e){e.selectionStart=0,e.selectionEnd=e.value.length}:bl&&(Us=function(e){try{e.select()}catch(t){}});var Vs,Ks=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,js=e.isWordChar=function(e){return/\w/.test(e)||e>""&&(e.toUpperCase()!=e.toLowerCase()||Ks.test(e))},Xs=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;Vs=document.createRange?function(e,t,r,n){var i=document.createRange();return i.setEnd(n||e,r),i.setStart(e,t),i}:function(e,t,r){var n=document.body.createTextRange();try{n.moveToElementText(e.parentNode)}catch(i){return n}return n.collapse(!0),n.moveEnd("character",r),n.moveStart("character",t),n};var Ys=e.contains=function(e,t){if(3==t.nodeType&&(t=t.parentNode),e.contains)return e.contains(t);do if(11==t.nodeType&&(t=t.host),t==e)return!0;while(t=t.parentNode)};bl&&11>wl&&(Xo=function(){try{return document.activeElement}catch(e){return document.body}});var _s,$s,qs=e.rmClass=function(e,t){var r=e.className,n=Yo(t).exec(r);if(n){var i=r.slice(n.index+n[0].length);e.className=r.slice(0,n.index)+(i?n[1]+i:"")}},Zs=e.addClass=function(e,t){var r=e.className;Yo(t).test(r)||(e.className+=(r?" ":"")+t)},Qs=!1,Js=function(){if(bl&&9>wl)return!1;var e=Vo("div");return"draggable"in e||"dragDrop"in e}(),ea=e.splitLines=3!="\n\nb".split(/\n/).length?function(e){for(var t=0,r=[],n=e.length;n>=t;){var i=e.indexOf("\n",t);-1==i&&(i=e.length);var o=e.slice(t,"\r"==e.charAt(i-1)?i-1:i),l=o.indexOf("\r");-1!=l?(r.push(o.slice(0,l)),t+=l+1):(r.push(o),t=i+1)}return r}:function(e){return e.split(/\r\n?|\n/)},ta=window.getSelection?function(e){try{return e.selectionStart!=e.selectionEnd}catch(t){return!1}}:function(e){try{var t=e.ownerDocument.selection.createRange()}catch(r){}return t&&t.parentElement()==e?0!=t.compareEndPoints("StartToEnd",t):!1},ra=function(){var e=Vo("div");return"oncopy"in e?!0:(e.setAttribute("oncopy","return;"),"function"==typeof e.oncopy)}(),na=null,ia=e.keyNames={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"=",109:"-",110:".",111:"/",127:"Delete",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};!function(){for(var e=0;10>e;e++)ia[e+48]=ia[e+96]=String(e);for(var e=65;90>=e;e++)ia[e]=String.fromCharCode(e);for(var e=1;12>=e;e++)ia[e+111]=ia[e+63235]="F"+e}();var oa,la=function(){function e(e){return 247>=e?r.charAt(e):e>=1424&&1524>=e?"R":e>=1536&&1773>=e?n.charAt(e-1536):e>=1774&&2220>=e?"r":e>=8192&&8203>=e?"w":8204==e?"b":"L"}function t(e,t,r){this.level=e,this.from=t,this.to=r}var r="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",n="rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",i=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,o=/[stwN]/,l=/[LRr]/,s=/[Lb1n]/,a=/[1n]/,u="L";return function(r){if(!i.test(r))return!1;for(var n,c=r.length,h=[],f=0;c>f;++f)h.push(n=e(r.charCodeAt(f)));for(var f=0,d=u;c>f;++f){var n=h[f];"m"==n?h[f]=d:d=n}for(var f=0,p=u;c>f;++f){var n=h[f];"1"==n&&"r"==p?h[f]="n":l.test(n)&&(p=n,"r"==n&&(h[f]="R"))}for(var f=1,d=h[0];c-1>f;++f){var n=h[f];"+"==n&&"1"==d&&"1"==h[f+1]?h[f]="1":","!=n||d!=h[f+1]||"1"!=d&&"n"!=d||(h[f]=d),d=n}for(var f=0;c>f;++f){var n=h[f];if(","==n)h[f]="N";else if("%"==n){for(var g=f+1;c>g&&"%"==h[g];++g);for(var v=f&&"!"==h[f-1]||c>g&&"1"==h[g]?"1":"N",m=f;g>m;++m)h[m]=v;f=g-1}}for(var f=0,p=u;c>f;++f){var n=h[f];"L"==p&&"1"==n?h[f]="L":l.test(n)&&(p=n)}for(var f=0;c>f;++f)if(o.test(h[f])){for(var g=f+1;c>g&&o.test(h[g]);++g);for(var y="L"==(f?h[f-1]:u),b="L"==(c>g?h[g]:u),v=y||b?"L":"R",m=f;g>m;++m)h[m]=v;f=g-1}for(var w,x=[],f=0;c>f;)if(s.test(h[f])){var C=f;for(++f;c>f&&s.test(h[f]);++f);x.push(new t(0,C,f))}else{var S=f,L=x.length;for(++f;c>f&&"L"!=h[f];++f);for(var m=S;f>m;)if(a.test(h[m])){m>S&&x.splice(L,0,new t(1,S,m));var T=m;for(++m;f>m&&a.test(h[m]);++m);x.splice(L,0,new t(2,T,m)),S=m}else++m;f>S&&x.splice(L,0,new t(1,S,f))}return 1==x[0].level&&(w=r.match(/^\s+/))&&(x[0].from=w[0].length,x.unshift(new t(0,0,w[0].length))),1==Ho(x).level&&(w=r.match(/\s+$/))&&(Ho(x).to-=w[0].length,x.push(new t(0,c-w[0].length,c))),2==x[0].level&&x.unshift(new t(1,x[0].to,x[0].to)),x[0].level!=Ho(x).level&&x.push(new t(x[0].level,c,c)),x}}();return e.version="5.10.0",e});/* @preserve
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
this._bitField=t._bitField,this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,this._settledValueField=void 0)}e.prototype._settledValue=function(){return this._settledValueField};var n=e.prototype.value=function(){if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},r=e.prototype.error=e.prototype.reason=function(){if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},i=e.prototype.isFulfilled=function(){return 0!==(33554432&this._bitField)},o=e.prototype.isRejected=function(){return 0!==(16777216&this._bitField)},s=e.prototype.isPending=function(){return 0===(50397184&this._bitField)},a=e.prototype.isResolved=function(){return 0!==(50331648&this._bitField)};e.prototype.isCancelled=t.prototype._isCancelled=function(){return 65536===(65536&this._bitField)},t.prototype.isCancelled=function(){return this._target()._isCancelled()},t.prototype.isPending=function(){return s.call(this._target())},t.prototype.isRejected=function(){return o.call(this._target())},t.prototype.isFulfilled=function(){return i.call(this._target())},t.prototype.isResolved=function(){return a.call(this._target())},t.prototype.value=function(){return n.call(this._target())},t.prototype.reason=function(){var t=this._target();return t._unsetRejectionIsUnhandled(),r.call(t)},t.prototype._value=function(){return this._settledValue()},t.prototype._reason=function(){return this._unsetRejectionIsUnhandled(),this._settledValue()},t.PromiseInspection=e}},{}],33:[function(t,e,n){"use strict";e.exports=function(e,n){function r(t,r){if(u(t)){if(t instanceof e)return t;var i=o(t);if(i===l){r&&r._pushContext();var c=e.reject(i.e);return r&&r._popContext(),c}if("function"==typeof i){if(s(t)){var c=new e(n);return t._then(c._fulfill,c._reject,void 0,c,null),c}return a(t,i,r)}}return t}function i(t){return t.then}function o(t){try{return i(t)}catch(e){return l.e=e,l}}function s(t){return p.call(t,"_promise0")}function a(t,r,i){function o(t){a&&(a._resolveCallback(t),a=null)}function s(t){a&&(a._rejectCallback(t,p,!0),a=null)}var a=new e(n),u=a;i&&i._pushContext(),a._captureStackTrace(),i&&i._popContext();var p=!0,h=c.tryCatch(r).call(t,o,s);return p=!1,a&&h===l&&(a._rejectCallback(h.e,!0,!0),a=null),u}var c=t("./util"),l=c.errorObj,u=c.isObject,p={}.hasOwnProperty;return r}},{"./util":36}],34:[function(t,e,n){"use strict";e.exports=function(e,n,r){function i(t){this.handle=t}function o(t){return clearTimeout(this.handle),t}function s(t){throw clearTimeout(this.handle),t}var a=t("./util"),c=e.TimeoutError;i.prototype._resultCancelled=function(){clearTimeout(this.handle)};var l=function(t){return u(+this).thenReturn(t)},u=e.delay=function(t,o){var s,a;return void 0!==o?(s=e.resolve(o)._then(l,null,null,t,void 0),r.cancellation()&&o instanceof e&&s._setOnCancel(o)):(s=new e(n),a=setTimeout(function(){s._fulfill()},+t),r.cancellation()&&s._setOnCancel(new i(a))),s._setAsyncGuaranteed(),s};e.prototype.delay=function(t){return u(t,this)};var p=function(t,e,n){var r;r="string"!=typeof e?e instanceof Error?e:new c("operation timed out"):new c(e),a.markAsOriginatingFromRejection(r),t._attachExtraTrace(r),t._reject(r),null!=n&&n.cancel()};e.prototype.timeout=function(t,e){t=+t;var n,a,c=new i(setTimeout(function(){n.isPending()&&p(n,e,a)},t));return r.cancellation()?(a=this.then(),n=a._then(o,s,void 0,c,void 0),n._setOnCancel(c)):n=this._then(o,s,void 0,c,void 0),n}}},{"./util":36}],35:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){function a(t){setTimeout(function(){throw t},0)}function c(t){var e=r(t);return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),e}function l(t,n){function i(){if(s>=l)return u._fulfill();var o=c(t[s++]);if(o instanceof e&&o._isDisposable()){try{o=r(o._getDisposer().tryDispose(n),t.promise)}catch(p){return a(p)}if(o instanceof e)return o._then(i,a,null,null,null)}i()}var s=0,l=t.length,u=new e(o);return i(),u}function u(t,e,n){this._data=t,this._promise=e,this._context=n}function p(t,e,n){this.constructor$(t,e,n)}function h(t){return u.isDisposer(t)?(this.resources[this.index]._setDisposable(t),t.promise()):t}function f(t){this.length=t,this.promise=null,this[t-1]=null}var _=t("./util"),d=t("./errors").TypeError,v=t("./util").inherits,y=_.errorObj,g=_.tryCatch;u.prototype.data=function(){return this._data},u.prototype.promise=function(){return this._promise},u.prototype.resource=function(){return this.promise().isFulfilled()?this.promise().value():null},u.prototype.tryDispose=function(t){var e=this.resource(),n=this._context;void 0!==n&&n._pushContext();var r=null!==e?this.doDispose(e,t):null;return void 0!==n&&n._popContext(),this._promise._unsetDisposable(),this._data=null,r},u.isDisposer=function(t){return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},v(p,u),p.prototype.doDispose=function(t,e){var n=this.data();return n.call(t,t,e)},f.prototype._resultCancelled=function(){for(var t=this.length,n=0;t>n;++n){var r=this[n];r instanceof e&&r.cancel()}},e.using=function(){var t=arguments.length;if(2>t)return n("you must pass at least 2 arguments to Promise.using");var i=arguments[t-1];if("function"!=typeof i)return n("expecting a function but got "+_.classString(i));var o,a=!0;2===t&&Array.isArray(arguments[0])?(o=arguments[0],t=o.length,a=!1):(o=arguments,t--);for(var c=new f(t),p=0;t>p;++p){var d=o[p];if(u.isDisposer(d)){var v=d;d=d.promise(),d._setDisposable(v)}else{var m=r(d);m instanceof e&&(d=m._then(h,null,null,{resources:c,index:p},void 0))}c[p]=d}for(var b=new Array(c.length),p=0;p<b.length;++p)b[p]=e.resolve(c[p]).reflect();var w=e.all(b).then(function(t){for(var e=0;e<t.length;++e){var n=t[e];if(n.isRejected())return y.e=n.error(),y;if(!n.isFulfilled())return void w.cancel();t[e]=n.value()}C._pushContext(),i=g(i);var r=a?i.apply(void 0,t):i(t),o=C._popContext();return s.checkForgottenReturns(r,o,"Promise.using",C),r}),C=w.lastly(function(){var t=new e.PromiseInspection(w);return l(c,t)});return c.promise=C,C._setOnCancel(c),C},e.prototype._setDisposable=function(t){this._bitField=131072|this._bitField,this._disposer=t},e.prototype._isDisposable=function(){return(131072&this._bitField)>0},e.prototype._getDisposer=function(){return this._disposer},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,this._disposer=void 0},e.prototype.disposer=function(t){if("function"==typeof t)return new p(t,this,i());throw new d}}},{"./errors":12,"./util":36}],36:[function(t,e,n){"use strict";function r(){try{var t=x;return x=null,t.apply(this,arguments)}catch(e){return F.e=e,F}}function i(t){return x=t,r}function o(t){return null==t||t===!0||t===!1||"string"==typeof t||"number"==typeof t}function s(t){return"function"==typeof t||"object"==typeof t&&null!==t}function a(t){return o(t)?new Error(v(t)):t}function c(t,e){var n,r=t.length,i=new Array(r+1);for(n=0;r>n;++n)i[n]=t[n];return i[n]=e,i}function l(t,e,n){if(!k.isES5)return{}.hasOwnProperty.call(t,e)?t[e]:void 0;var r=Object.getOwnPropertyDescriptor(t,e);return null!=r?null==r.get&&null==r.set?r.value:n:void 0}function u(t,e,n){if(o(t))return t;var r={value:n,configurable:!0,enumerable:!1,writable:!0};return k.defineProperty(t,e,r),t}function p(t){throw t}function h(t){try{if("function"==typeof t){var e=k.names(t.prototype),n=k.isES5&&e.length>1,r=e.length>0&&!(1===e.length&&"constructor"===e[0]),i=O.test(t+"")&&k.names(t).length>0;if(n||r||i)return!0}return!1}catch(o){return!1}}function f(t){function e(){}e.prototype=t;for(var n=8;n--;)new e;return t}function _(t){return S.test(t)}function d(t,e,n){for(var r=new Array(t),i=0;t>i;++i)r[i]=e+i+n;return r}function v(t){try{return t+""}catch(e){return"[no string representation]"}}function y(t){return null!==t&&"object"==typeof t&&"string"==typeof t.message&&"string"==typeof t.name}function g(t){try{u(t,"isOperational",!0)}catch(e){}}function m(t){return null==t?!1:t instanceof Error.__BluebirdErrorTypes__.OperationalError||t.isOperational===!0}function b(t){return y(t)&&k.propertyIsWritable(t,"stack")}function w(t){return{}.toString.call(t)}function C(t,e,n){for(var r=k.names(t),i=0;i<r.length;++i){var o=r[i];if(n(o))try{k.defineProperty(e,o,k.getDescriptor(t,o))}catch(s){}}}function j(t,e){return I?process.env[t]:e}var k=t("./es5"),E="undefined"==typeof navigator,F={e:{}},x,T="undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0!==this?this:null,R=function(t,e){function n(){this.constructor=t,this.constructor$=e;for(var n in e.prototype)r.call(e.prototype,n)&&"$"!==n.charAt(n.length-1)&&(this[n+"$"]=e.prototype[n])}var r={}.hasOwnProperty;return n.prototype=e.prototype,t.prototype=new n,t.prototype},P=function(){var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){for(var n=0;n<t.length;++n)if(t[n]===e)return!0;return!1};if(k.isES5){var n=Object.getOwnPropertyNames;return function(t){for(var r=[],i=Object.create(null);null!=t&&!e(t);){var o;try{o=n(t)}catch(s){return r}for(var a=0;a<o.length;++a){var c=o[a];if(!i[c]){i[c]=!0;var l=Object.getOwnPropertyDescriptor(t,c);null!=l&&null==l.get&&null==l.set&&r.push(c)}}t=k.getPrototypeOf(t)}return r}}var r={}.hasOwnProperty;return function(n){if(e(n))return[];var i=[];t:for(var o in n)if(r.call(n,o))i.push(o);else{for(var s=0;s<t.length;++s)if(r.call(t[s],o))continue t;i.push(o)}return i}}(),O=/this\s*\.\s*\S+\s*=/,S=/^[a-z$_][a-z$_0-9]*$/i,A=function(){return"stack"in new Error?function(t){return b(t)?t:new Error(v(t))}:function(t){if(b(t))return t;try{throw new Error(v(t))}catch(e){return e}}}(),D=function(t){return k.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){var V="function"==typeof Array.from?function(t){return Array.from(t)}:function(t){for(var e,n=[],r=t[Symbol.iterator]();!(e=r.next()).done;)n.push(e.value);return n};D=function(t){return k.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?V(t):null}}var I="undefined"!=typeof process&&"[object process]"===w(process).toLowerCase(),L={isClass:h,isIdentifier:_,inheritedDataKeys:P,getDataPropertyOrDefault:l,thrower:p,isArray:k.isArray,asArray:D,notEnumerableProp:u,isPrimitive:o,isObject:s,isError:y,canEvaluate:E,errorObj:F,tryCatch:i,inherits:R,withAppended:c,maybeWrapAsError:a,toFastProperties:f,filledRange:d,toString:v,canAttachTrace:b,ensureErrorObject:A,originatesFromRejection:m,markAsOriginatingFromRejection:g,classString:w,copyDescriptors:C,hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,isNode:I,env:j,global:T};L.isRecentNode=L.isNode&&function(){var t=process.versions.node.split(".").map(Number);return 0===t[0]&&t[1]>10||t[0]>0}(),L.isNode&&L.toFastProperties(process);try{throw new Error}catch(H){L.lastLineError=H}e.exports=L},{"./es5":13}]},{},[4])(4)}),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise);function import$(t,e){var n={}.hasOwnProperty;for(var i in e)n.call(e,i)&&(t[i]=e[i]);return t}function in$(t,e){for(var n=-1,i=e.length>>>0;++n<i;)if(t===e[n])return!0;return!1}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}!function(){var t,e,n,i;return t=function(t){return t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.cancelBubble=!0,t.returnValue=!1,!1},e=import$(function(n,i,l){function r(){return e.mouse.start(I,2)}function o(t){return I.move(t,2,!0)}function s(t,n){return t.addEventListener("mousedown",function(){return e.mouse.start(I,n)}),t.addEventListener("click",function(t){return I.move(t,n,!0)})}var a,c,u,d,h,p,g,v,f,A,x,b,y,L,M,m,w,k,P,Y,G,C,E,D,I=this;for(null==n&&(n=null),null==i&&(i={}),null==l&&(l=null),a=(c=n)?c:l,u=i["class"]||a&&a.getAttribute("data-cpclass")||"",d=i.context||a&&a.getAttribute("data-context")||"default",h=i.oncolorchange||a&&a.getAttribute("data-oncolorchange")||null,p=i.onpalettechange||a&&a.getAttribute("data-onpalettechange")||null,g=i.index||a&&parseInt(a.getAttribute("data-palette-idx"))||0,v=i.palette||a&&a.getAttribute("data-palette")||null,f=i.pinned||a&&"true"===a.getAttribute("data-pinned")||null,A=i.exclusive||a&&"true"===a.getAttribute("data-exclusive")||null,"string"==typeof v?(v=v.trim(),"["===v[0]?this.initpal={colors:function(){var t,e,n,i=[];for(t=0,n=(e=JSON.parse(v)).length;n>t;++t)x=e[t],i.push({hex:x});return i}()}:/\//.exec(v)?this.url=v:this.initpal={colors:function(){var t,e,n,i=[];for(t=0,n=(e=v.split(/[ ,]/)).length;n>t;++t)x=e[t],i.push({hex:x});return i}()}):this.initpal=Array.isArray(v)?{colors:function(){var t,e,n,i=[];for(t=0,n=(e=v).length;n>t;++t)x=e[t],i.push({hex:x});return i}()}:v,isNaN(g)&&(g=0),"string"==typeof h&&(h=new Function(["color"],h)),"string"==typeof p&&(p=new Function(["palette"],p)),l?u+=l.getAttribute("class"):(in$("bubble",u.split(" "))||(u+=" bubble"),document.body.appendChild(l=document.createElement("div")),l._ldcp=this,b=l.style,b.position="absolute",b.display="none",n&&(n._ldcpnode=l,n.getColorPicker=function(){return I},n.addEventListener("click",function(e){var n=this;return setTimeout(function(){return n._ldcpnode._ldcp.toggle()},0),this._ldcpnode._ldcp.exclusive&&"none"===this._ldcpnode.style.display?void 0:t(e)}))),in$("ldColorPickr",u.split(" "))||(u+=" ldColorPicker"),l.setAttribute("class",u+""),this.node=l,this.target=n,this.idx=g,this.context=d,this["class"]=u,this.callback=h,this.palCallback=p,this.pinned=f,this.exclusive=A,this.eventHandler={},y="<span>Paste Link of You Palette:</span><input placeholder='e.g., loading.io/palette/xddlf'/><div class='ldcp-chooser-btnset'><button>Sample</button><button>Load</button><button>Cancel</button></div>",L=["<div class='ldcp-panel'><div class='ldcp-v ldcp-g1'><div class='ldcp-h ldcp-g11 ldcp-2d'><div style='top:20px;left:20px' class='ldcp-ptr-circle'></div><img src='"+e.base64.gradient+"'><div class='ldcp-mask'></div></div><div class='ldcp-h ldcp-g12 ldcp-1d'><div class='ldcp-ptr-bar'></div><img src='"+e.base64.hue+"'><div class='ldcp-mask'></div></div><div class='ldcp-h ldcp-g13 ldcp-1d ldcp-alpha'><div class='ldcp-ptr-bar'></div><img src='"+e.base64.opacity+"'><div class='ldcp-mask'></div></div></div><div class='ldcp-v ldcp-g2'><div class='ldcp-colors ldcp-h ldcp-g21'><div class='ldcp-palette'><small class='ldcp-colorptr'></small></div><small class='ldcp-sep'></small><div class='ldcp-color-none'></div><span class='ldcp-cbtn ldcp-btn-add'>+</span><span class='ldcp-cbtn ldcp-btn-remove'>-</span><span style='font-family:wingdings' class='ldcp-cbtn ldcp-btn-edit'>&#228;</span></div></div>","<div class='ldcp-v ldcp-g3'><div class='ldcp-h ldcp-g31'>","<div class='ldcp-edit-group'><span>R</span><input class='ldcp-input-r' value='255'><span>G</span><input class='ldcp-input-g' value='255'><span>B</span><input class='ldcp-input-b' value='255'></div>","<div class='ldcp-edit-group' style='display:none'><span>H</span><input class='ldcp-input-h' value='255'><span>S</span><input class='ldcp-input-s' value='255'><span>L</span><input class='ldcp-input-l' value='255'></div>","<div class='ldcp-edit-group ldcp-edit-hex' style='display:none'><span>HEX</span><input class='ldcp-input-hex' value='#000000'></div>","<span class='ldcp-alpha'>A</span><input value='255' class='ldcp-alpha ldcp-input-a'>","<span class='ldcp-caret'>RGBA &#x25be;</span></div></div></div><div class='ldcp-chooser'><button/><button/><button/></div>"].join(""),L+="<div class='ldcp-panel ldcp-chooser'>"+y+"</div>",l.innerHTML=L,l.addEventListener("click",function(e){return t(e)}),M=0,m=(b=[".ldcp-2d .ldcp-mask",".ldcp-2d .ldcp-ptr-circle"]).length;m>M;++M)w=b[M],k=l.querySelector(w),k.addEventListener("mousedown",r),k.addEventListener("click",o);for(M=0,m=(b=[".ldcp-1d .ldcp-mask",".ldcp-1d .ldcp-ptr-bar"]).length;m>M;++M)for(w=b[M],P=0,G=(Y=l.querySelectorAll(w)).length;G>P;++P)C=P,E=Y[P],(D=s)(E,C);return l.querySelector(".ldcp-cbtn:nth-of-type(1)").addEventListener("click",function(){return I.addColor()}),l.querySelector(".ldcp-cbtn:nth-of-type(2)").addEventListener("click",function(){return I.removeColor()}),setTimeout(function(){function t(t){return I.setIdx(t.target.idx)}var n,i,r,o,s,a,c,u,d,h,p,g,v,A,x,b;for(n=I.inputCaret=l.querySelector(".ldcp-caret"),n.addEventListener("click",function(){return I.nextEditMode()}),I.editGroup=l.querySelectorAll(".ldcp-edit-group"),I.chooser={panel:l.querySelector(".ldcp-chooser"),input:l.querySelector(".ldcp-chooser input")},i=I.inputhex=l.querySelector(".ldcp-input-hex"),i.addEventListener("change",function(){var t;return t=I.convert.color(I.inputhex.value),I.setHsl(t.hue,t.sat,t.lit),t=I.color.vals[I.idx]}),r=I.inputH=l.querySelector(".ldcp-input-h"),r.addEventListener("change",function(){var t,e;return e=I.color.vals[I.idx],e.hue=parseInt(I.inputH.value),t=e,I.setHsl(t.hue,t.sat,t.lit)}),o=I.inputS=l.querySelector(".ldcp-input-s"),o.addEventListener("change",function(){var t,e;return e=I.color.vals[I.idx],e.sat=parseFloat(I.inputS.value),t=e,I.setHsl(t.hue,t.sat,t.lit)}),s=I.inputL=l.querySelector(".ldcp-input-l"),s.addEventListener("change",function(){var t,e;return e=I.color.vals[I.idx],e.lit=parseFloat(I.inputL.value),t=e,I.setHsl(t.hue,t.sat,t.lit)}),a=I.inputR=l.querySelector(".ldcp-input-r"),a.addEventListener("change",function(){var t,e,n,i,l;return t=I.toRgba(I.color.vals[I.idx]),e=t[0],n=t[1],i=t[2],e=parseInt(I.inputR.value)/255,l=I.convert.rgbHsl({r:e,g:n,b:i}),I.setHsl(l.hue,l.sat,l.lit)}),c=I.inputG=l.querySelector(".ldcp-input-g"),c.addEventListener("change",function(){var t,e,n,i,l;return t=I.toRgba(I.color.vals[I.idx]),e=t[0],n=t[1],i=t[2],n=parseInt(I.inputG.value)/255,l=I.convert.rgbHsl({r:e,g:n,b:i}),I.setHsl(l.hue,l.sat,l.lit)}),u=I.inputB=l.querySelector(".ldcp-input-b"),u.addEventListener("change",function(){var t,e,n,i,l;return t=I.toRgba(I.color.vals[I.idx]),e=t[0],n=t[1],i=t[2],i=parseInt(I.inputB.value)/255,l=I.convert.rgbHsl({r:e,g:n,b:i}),I.setHsl(l.hue,l.sat,l.lit)}),d=I.inputA=l.querySelector(".ldcp-input-a"),d.addEventListener("change",function(){return I.setAlpha(parseFloat(I.inputA.value))}),h=I.colornone=l.querySelector(".ldcp-color-none"),h.addEventListener("click",function(){return I.toggleNone()}),I.palpad=l.querySelector(".ldcp-palette"),I.P2D={ptr:l.querySelector(".ldcp-ptr-circle"),panel:l.querySelector(".ldcp-2d img")},I.P1D={ptr:l.querySelectorAll(".ldcp-ptr-bar"),panel:l.querySelectorAll(".ldcp-1d img")},I.colorptr=l.querySelector(".ldcp-colorptr"),I.updateDimension(),I.width=l.offsetWidth,I.height=l.offsetHeight,I.color={nodes:l.querySelectorAll(".ldcp-palette .ldcp-color"),palette:l.querySelector(".ldcp-colors .ldcp-palette"),lastvals:null,vals:e.palette.getVal(I,I.context)},I.color.nodes=function(){var t,e,n=[];for(t=0,e=this.color.nodes.length;e>t;++t)p=t,n.push(this.color.nodes[p]);return n}.call(I),g=0,v=I.color.nodes.length;v>g;++g)A=g,x=I.color.nodes[A],x.idx=A,x.addEventListener("click",t);return x=I.color.vals[I.idx],I.updatePalette(),I.setIdx(I.idx),I.setHsl(x.hue,x.sat,x.lit),I.callback&&I.on("change",function(t){return I.callback.apply(I.target,[t])}),I.palCallback&&I.on("change-palette",function(t){return I.palCallback.apply(I.target,[t])}),I.url&&(I.chooser.input.value=I.url,setTimeout(function(){return I.loadPalette(I.chooser.input.value)},0)),I.initpal&&(I.setPalette(I.initpal),x=I.color.vals[I.idx]),f&&I.toggle(!0),document.addEventListener("keydown",function(t){var e;return e=t.which||t.keyCode,27===e&&I.target?I.toggle(!1):void 0}),I.handle("inited"),b=null!=x.alpha&&x.alpha<1?I.toRgbaString(x):I.toHexString(x),I.handle("change",b),I.handle("change-palette",I.getPalette())},0),this},{dom:null,setPalette:function(t,n){var i,l,r,o;if(null==n&&(n="default"),t.length&&"string"==typeof t[0]&&t[0].length>3){for(i=e.prototype.convert,e.palette.val[n].splice(0),l=0,r=t.length;r>l;++l)o=t[l],e.palette.val[n].push(i.color(o));return e.palette.update()}return this.defaultPalettePath=t},palette:{members:[],set:function(t,n){var i,l,r,o,s,a;if(this.val[t]){if(Array.isArray(n)){for(l=[],r=0,o=n.length;o>r;++r)s=n[r],l.push(e.prototype.convert.color(s));i=l}else{for(l=[],r=0,o=(a=n.colors).length;o>r;++r)s=a[r],l.push(e.prototype.convert.color(s.hex));i=l}for(this.val[t].splice(0),r=0,o=i.length;o>r;++r)s=i[r],this.val[t].push(s);return this.update()}},get:function(t){var n;return{colors:function(){var i,l,r,o=[];for(i=0,r=(l=this.val[t]||[]).length;r>i;++i)n=l[i],o.push({hex:e.prototype.toHexString(n)});return o}.call(this)}},getVal:function(t,e){return null==e&&(e="default"),t&&"string"!=typeof t&&this.members.push(t),"string"==typeof t&&(e=t),this.val[e]||(this.val[e]=this.random()),this.val[e]},update:function(t,e,n){var i,l,r,o,s=[];for(i=0,r=(l=this.members).length;r>i;++i)o=l[i],s.push(o.updatePalette(t,e,n));return s},random:function(){var t,e,n=[];for(t=0;5>t;++t)e=t,n.push({hue:parseInt(30*Math.random()+90*e-15),sat:.3+.4*Math.random(),lit:.4+.4*Math.random()});return n},val:{"default":function(){var t,e=[];for(t=0;5>t;++t)n=t,e.push({hue:parseInt(30*Math.random()+90*n-15),sat:.3+.4*Math.random(),lit:.4+.4*Math.random()});return e}()}},mouse:{start:function(e,n){var i;return i=[["selectstart",function(e){return t(e)}],["mousemove",function(t){return e.move(t,n)}],["mouseup",function(){return i.map(function(t){return document.removeEventListener(t[0],t[1])}),setTimeout(function(){return e.clickToggler?document.addEventListener("click",e.clickToggler):void 0},0)}]],i.map(function(t){return document.addEventListener(t[0],t[1])}),e.clickToggler?document.removeEventListener("click",e.clickToggler):void 0}},init:function(t,n){var i,l,r,o,s,a=[];if(null==n&&(n=null),t)return t._ldcp=new e(n,{},t);for(i=document.querySelectorAll(".ldColorPicker"),l=0,r=i.length;r>l;++l)t=i[l],t._ldcp||(t._ldcp=new e(null,{},t));for(o=document.querySelectorAll("*[data-toggle='colorpicker']"),l=0,r=o.length;r>l;++l)s=o[l],a.push(new e(s,{}));return a},prototype:{loadPalette:function(t){var e,n,i=this;return e=n=new XMLHttpRequest,e.onload=function(){return i.setPalette(JSON.parse(n.responseText))},e.open("GET",t.replace(/palette/,"d/palette"),!0),e.send(),e},addColor:function(){return this.color.vals.length<12?(this.color.vals.splice(0,0,this.random()),e.palette.update(this.context,0,1)):void 0},removeColor:function(){return this.color.vals.length>1?(this.color.vals.splice(this.idx,1),e.palette.update(this.context,this.idx,-1)):void 0},edit:function(){var t,e;return t=function(){var t,n,i,l=[];for(t=0,i=(n=this.color.vals).length;i>t;++t)e=n[t],l.push(this.toHexString(e).replace(/#/,""));return l}.call(this).join(","),window.open("http://loading.io/color/?colors="+t)},nextEditMode:function(){return this.editGroup[this.editMode||0].style.display="none",this.editMode=((this.editMode||0)+1)%3,this.inputCaret.innerText=["RGBA ▾","HSLA ▾","HEX ▾"][this.editMode],this.editGroup[this.editMode].style.display="inline"},updateDimension:function(){var t,e,n;return t=[this.node.querySelector(".ldcp-2d"),this.node.querySelector(".ldcp-1d")],e=t[0],n=t[1],t=this.P2D,t.w=e.offsetWidth,t.h=e.offsetHeight,t=this.P1D,t.w=n.offsetWidth,t.h=n.offsetHeight,t},clickToggle:function(){var t=this;return this.clickToggler=function(){return document.removeEventListener("click",t.clickToggler),t.toggle()}},toggleConfig:function(){var t;return"98%"===this.chooser.panel.style.height?(t=this.chooser.panel.style,t.height=0,t):(t=this.chooser.panel.style,t.height="98%",t)},eventHandler:{},handle:function(t,e){var n,i,l,r,o=[];if(n=this.eventHandler[t]){for(i=0,l=n.length;l>i;++i)r=n[i],o.push(r(e));return o}},on:function(t,e){var n;return((n=this.eventHandler)[t]||(n[t]=[])).push(e)},toggle:function(t){var n,i,l,r,o,s,a,c,u,d=this;return null==t&&(t=null),this.pinned&&(t=!0),t===!1||null===t&&"block"===this.node.style.display?(document.removeEventListener("click",this.clickToggler),this.node.style.display="none",this.target&&(n=this.color.vals.map(function(t,e){return[e,d.toValue(t),t]}).filter(function(t){return t[1]===d.target.value.toLowerCase()})[0],n?this.idx=n[0]:this.color.vals.splice(0,0,this.convert.color(this.target.value))),i=this.color.vals[this.idx],this.setHsl(i.hue,i.sat,i.lit),this.handle("toggle",!1)):(this.node.style.display="block",this.target&&(l=null!=window.scrollX?[window.scrollX,window.scrollY]:null!=window.pageXOffset?[window.pageXOffset,window.pageYOffset]:[document.body.scrollLeft,document.body.scrollTop],r=l[0],o=l[1],s=this.target.getBoundingClientRect(),a=this["class"].split(" "),c=s.left+r+"px",u=s.top+o+"px",in$("top",a)?u=s.top-this.node.offsetHeight-10+o+"px":in$("left",a)?c=s.left-this.node.offsetWidth-10+r+"px":in$("right",a)?c=s.left+this.target.offsetWidth+10+r+"px":u=s.top+this.target.offsetHeight+10+o+"px",l=this.node.style,l.top=u,l.left=c),document.removeEventListener("click",this.clickToggler),document.addEventListener("click",this.clickToggle()),this.updateDimension(),this.target&&(n=this.color.vals.map(function(t,e){return[e,d.toValue(t)]}).filter(function(t){return t[1]===d.target.value.toLowerCase()})[0],n?this.idx=n[0]:this.color.vals.splice(0,0,this.convert.color(this.target.value))),i=this.color.vals[this.idx],this.setHsl(i.hue,i.sat,i.lit),this.handle("toggle",!0)),e.palette.update()},random:function(){return{hue:360*Math.random(),sat:.5,lit:.5}},getPalette:function(){var t;return{colors:function(){var e,n,i,l=[];for(e=0,i=(n=this.color.vals).length;i>e;++e)t=n[e],l.push({hex:this.toHexString(t)});return l}.call(this)}},setPalette:function(t,n){var i,l,r,o,s,a;for(null==n&&(n=!1),l=[],r=0,s=(o=t.colors).length;s>r;++r)a=o[r],l.push(this.convert.color(a.hex));for(i=l,this.color.lastvals=this.color.vals.splice(0),n&&(this.color.vals=[]),r=0,s=i.length;s>r;++r)a=i[r],this.color.vals.push(a);return e.palette.update()},setColor:function(t,n,i){return"string"==typeof t&&(t=this.convert.color(t),null!=n&&(t.alpha=n),null!=i&&(t.isNone=i)),import$(this.color.vals[this.idx],t),e.palette.update()},updatePalette:function(t,e,n){function i(t){var e;return e=null!=t.target.idx?t.target.idx:t.target.parentNode.idx,b.setIdx(e)}var l,r,o,s,a,c,u,d,h,p,g,v,f,A,x,b=this;if(l=[this.color.nodes.length,this.color.vals.length],r=l[0],o=l[1],o>r)for(s=r;o>s;++s)a=s,c=u=document.createElement("div"),c.setAttribute("class","ldcp-color"),c.addEventListener("click",i),c.idx=a,u.appendChild(document.createElement("div")),this.color.palette.appendChild(u),this.color.nodes.push(u);else if(r>o){for(s=o;r>s;++s)a=s,this.color.palette.removeChild(this.color.nodes[a]);this.color.nodes.splice(o)}for(s=0;o>s;++s)d=s,this.updateColor(d);if(this.idx>=o&&(this.idx=o-1),h=this.idx,null!=t&&t===this.context&&null!=e&&null!=n&&e<=this.idx&&(this.idx+=n,this.idx=(l=(g=this.idx)>0?g:0)<(p=this.color.vals.length-1)?l:p,h!==this.idx&&this.handle("change-idx",this.idx)),v=this.color.vals[this.idx],f=null!=v.alpha&&v.alpha<1?this.toRgbaString(v):this.toHexString(v),A=this.oldValue!==f,this.oldValue=f,this.setIdx(this.idx),this.inputH.value=(l=v.hue)>0?l:0,this.inputS.value=v.sat,this.inputL.value=v.lit,x=this.toRgba(v),this.inputR.value=parseInt(255*x[0]),this.inputG.value=parseInt(255*x[1]),this.inputB.value=parseInt(255*x[2]),this.inputA.value=x[3],this.inputhex.value=this.getHexString(),this.color.lastvals=null,A&&this.handle("change",f),A||n)return this.handle("change-palette",this.getPalette());if(this.color.lastvals){if(v=this.color,v.lastvals.length!==v.vals.length)return this.handle("change-palette",this.getPalette());if(v.lastvals.map(function(t,e){return t!==v.vals[e]}).length)return this.handle("change-palette",this.getPalette())}},updateColor:function(t){var e,n;return e=this.color.vals[t],n=this.color.nodes[t].childNodes[0],n.style.background=this.toHslaString(e),n.style.border=e.isNone?"1px dashed #ccc":"1px dashed transparent"},convert:{color:function(t){var e,n,i,l,r,o,s,a,c,u;return/#?[a-fA-F0-9]{3}|#?[a-fA-F0-9]{6}/.exec(t)?(t=t.replace(/^#/,""),3===t.length&&(t=function(){var n,i=[];for(n=0;2>=n;++n)e=n,i.push(t.charAt(e)+t.charAt(e));return i}().join("")),n=parseInt(t.substring(0,2),16)/255,i=parseInt(t.substring(2,4),16)/255,l=parseInt(t.substring(4,6),16)/255,o=this.rgbHsl({r:n,g:i,b:l}),s=o.hue,a=o.sat,c=o.lit,r=o,r):(u=/rgba\(([0-9.]+),([0-9.]+),([0-9.]+),([0-9.]+)\)/.exec(t))?(o=[u[1],u[2],u[3]].map(function(t){return parseInt(t)/255}),n=o[0],i=o[1],l=o[2],o=this.rgbHsl({r:n,g:i,b:l}),s=o.hue,a=o.sat,c=o.lit,r=o,r.alpha=parseFloat(u[4]),r):{hue:0,sat:0,lit:0,satV:0,val:0}},rgbHsl:function(t){var e,n,i,l,r,o,s,a,c,u,d,h;return e=t.r,n=t.g,i=t.b,l=Math.max(e,n,i),r=Math.min(e,n,i),o=l-r,s=(l+r)/2,0===o?(a=[0,0],c=a[0],u=a[1]):(c=function(){switch(!1){case l!==e:return 60*((n-i)/o%6);case l!==n:return 60*((i-e)/o+2);case l!==i:return 60*((e-n)/o+4)}}(),u=o/(1-Math.abs(2*s-1)),d=l,h=l-r/d),c=(c+360)%360,{hue:c,sat:u,lit:s,satV:h,val:d}}},toRgba:function(t){var e,n,i,l,r,o,s,a;return e=(1-Math.abs(2*t.lit-1))*t.sat,n=e*(1-Math.abs(t.hue/60%2-1)),i=t.lit-e/2,l=function(){switch(parseInt(t.hue/60)){case 0:return[e,n,0];case 1:return[n,e,0];case 2:return[0,e,n];case 3:return[0,n,e];case 4:return[n,0,e];case 5:return[e,0,n];case 6:return[e,n,0]}}(),r=l[0],o=l[1],s=l[2],l=[r+i,o+i,s+i,null!=t.alpha?t.alpha:1],r=l[0],o=l[1],s=l[2],a=l[3],l},hex:function(t){var e,n;return t=(e=(n=Math.round(255*t))>0?n:0)<255?e:255,t=t.toString(16),t.length<2?"0"+t:t},getHslaString:function(){return this.toHslaString(this.color.vals[this.idx])},toHslaString:function(t){return t.isNone?"none":"hsla("+(t.hue||0)+","+(100*t.sat||0)+"%,"+(100*t.lit||0)+"%,"+(null!=t.alpha?t.alpha:1)+")"},getRgbaString:function(){return this.toRgbaString(this.color.vals[this.idx])},toRgbaString:function(t){var e,n,i;if(t.isNone)return"none";for(e=this.toRgba(t),n=0;3>n;++n)i=n,e[i]=parseInt(255*e[i]);return"rgba("+e.join(",")+")"},getHexString:function(t){var e;return null==t&&(t=!0),e=this.toHexString(this.color.vals[this.idx]),t?e:e.replace(/#/g,"")},toHexString:function(t){var e,n,i,l,r;return t.isNone?"none":(e=this.toRgba(t),n=e[0],i=e[1],l=e[2],r=e[3],"#"+this.hex(n)+this.hex(i)+this.hex(l))},getValue:function(){return this.toValue(this.color.vals[this.idx])},toValue:function(t){return null!=t.alpha&&t.alpha<1?this.toRgbaString(t):this.toHexString(t)},isPinned:function(){return this.pinned},setPin:function(t){return this.pinned!==!!t&&(this.pinned=!!t,this.handle("change-pin",this.pinned)),this.pinned?this.toggle(!0):void 0},getIdx:function(){return this.idx},setIdx:function(t){var e,n,i,l=this;return this.idx!==t&&(e=this.color.vals[t],n=this.color.vals[this.idx],e!==n&&this.handle("change",null!=e.alpha&&e.alpha<1?this.toRgbaString(e):this.toHexString(e)),this.handle("change-idx",t)),this.idx=t,this.target&&this.target.setAttribute("data-palette-idx",t),e=this.color.vals[t],this.setHsl(e.hue,e.sat,e.lit),this.setAlpha(e.alpha),i=this.palpad.childNodes[t+1],i.offsetWidth?this.colorptr.style.left=i.offsetLeft+i.offsetWidth/2+"px":setTimeout(function(){return l.colorptr.style.left=i.offsetLeft+i.offsetWidth/2+"px"},0)},getAlpha:function(){return null!=this.color.vals[this.idx].alpha?this.color.vals[this.idx].alpha:1},setAlpha:function(t,n){var i,l,r;return null==n&&(n=!1),i=this.color.vals[this.idx],l=i.alpha,i.alpha=t,r=this.P1D.h*(1-t),l!==t&&(i.isNone&&(i.isNone=!1),e.palette.update()),this.setPos(1,0,r,!0)},toggleNone:function(){var t;return t=this.color.vals[this.idx],t.isNone=!0,e.palette.update()},setHsl:function(t,n,i,l){var r,o,s,a,c,u,d,h;return null==l&&(l=!1),r=this.color.vals[this.idx],o=this.toRgba(r).join(","),r.hue=t,r.sat=n,r.lit=i,this.P2D.panel.style.backgroundColor=this.toHexString({hue:t,sat:1,lit:.5}),this.P1D.panel[1].style.backgroundColor=this.toHexString({hue:t,sat:n,lit:i}),s=this.toRgba(r).join(","),this.target&&(this.target.value=this.getValue(),this.target.setAttribute("data-color",s)),o!==s&&(r.isNone&&(r.isNone=!1),e.palette.update()),l?void 0:(a=(2*i+n*(1-Math.abs(2*i-1)))/2,c=2*(a-i)/a,this.P1D.h&&this.P2D.h||this.updateDimension(),u=this.P2D.w*c,d=this.P2D.h*(1-a)/1,h=this.P1D.h*(t/360)/1,this.setPos(2,u,d,!0),this.setPos(0,u,h,!0),this.updateColor(this.idx))},setPos:function(t,e,n,i){var l,r,o,s,a,c,u,d,h,p,g,v;return null==i&&(i=!1),l=2===t?this.P2D:this.P1D,r=2===t?l.ptr:l.ptr[t],e=(o=e>0?e:0)<(s=l.w)?o:s,n=(o=n>0?n:0)<(s=l.h)?o:s,r.style.top=n+"px",this.inputhex.value=this.getHexString(),2===t&&(r.style.left=e+"px"),i||1!==t||(a=1.04*n-.02*l.h,a=(o=(s=a/l.h)>0?s:0)<1?o:1,this.setAlpha(parseInt(1e3*(1-a))/1e3),this.updateColor(this.idx)),i||1===t?void 0:(o=[1.04*e-.02*l.w,1.04*n-.02*l.h],c=o[0],a=o[1],c=(o=(s=c/l.w)>0?s:0)<1?o:1,a=(o=(s=a/l.h)>0?s:0)<1?o:1,u=this.color.vals[this.idx],d=2===t?1-a:(2*u.lit+u.sat*(1-Math.abs(2*u.lit-1)))/2,h=2===t?c:2*(d-u.lit)/d,p=0===t?360*a:u.hue,g=d*(2-h)/2,v=0!==g&&1!==g?d*h/(1-Math.abs(2*g-1)):u.sat,this.setHsl(p,v,g,!1),this.updateColor(this.idx))},move:function(t,e,n){var i,l,r,o;return null==n&&(n=!1),t.buttons||n?(i=this.node.getBoundingClientRect(),l=[t.clientY-i.top,t.clientX-i.left],r=l[0],o=l[1],this.setPos(e,o-5,r-5),t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.cancelBubble=!0,t.returnValue=!1,!1):void 0},palette:[]}}),e.base64={hue:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAADICAIAAABnF1YOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACeRJREFUeNrEWtmSYjkO1THOhOz+pHmY/4+Yb5mXiSogAWssr5IXEuqlMzqqL3Bla7d0ZPzn3/+ix4MA2v4x0fQrM7mDF8r7N8GtX9qtwA/yRy97RkohTj9zeqs9NCK0j1S/yTT5L/7M9Yfy0AjsQmUJcp0tHrgkS6A+VgV59cNANiykXitfsFNfNvagyDHprS/kymfmcX+2G4IVJVe2GV1PT+zTVchUufTkmA6NbVje0J8BYwIWKo+/iB7ZjININPNphDpwIr5zcpXpHZo4aJyxSOzdKe/czKAsDHT7I7GaXyvE8PhCJeaJYVaKsyLEfyLb7siV+J2/aCNR2FeU2bhpFwy7oASFUGTm5zvPiowiBIIQHyMx/oBtRLbdVyTmrm3jITP33SiJOO4c+gsYox5qMdTQTdZyUWEnQqAWojoDGHnjVumd5AecU4GwHaXXJOj7tI/QwZF9OwakPxwTcfb74v2NAbRUifQTa6nA/nASYqb6Ow2aa+HG9SElR0m9YmdWsbaJoZJeuGiwLpt2ZuI5IUAnRrsukntGYvfZUvR7XlJ2zlGI1ZHSvmSVUZo1/OEr8UBTnm5HB62SRPo+mopVlA8C8D5CuJrqlcNtCFXZRYi5CheKytFSB/qDWaM4uPcnNmcVapZJ+rQJiKqA5dlzy+OLvLGi7+mN/UUCMowH4jp/Nzctz5H4Ibm3BMYUilgckoWXeNxcKe3MMNl2psxLB2MJf+Y755jsGZ71OdyZ4HZMpXiOMpeduzC08anhV3nBX4pOtRfBFiFMK+8V4isLO5FpZnuiZtaKPC0w8vc5QERmJBlgxIOkVDRnga0Tii4wsr2VcYwO4cefrfv0Su5ZFigJKWqbfigc9xHn8dbr9sG9SqkqqRY1zvxcH2aZgUWSc21JbQ/ArLJcN1UlypgtY875lHl8RpEZ44ZzutULtUdHdlst5LAQYKljDhvCfc7yg9q62LxnW6/SFDFUwk7vw2yWnxWWhQcmOw8vDdzqRctOSHbGZJ7BYLxZ15eXJj/RGhpUgFq0+x/PV82LWa572PoQ3rpXdZKVbrT+Z12Q8bBpk/bvwKqhz3YGxm21Mw/a1vSLeB726ZXnpFTfzubZTuPxxv04zFS+15nK1IORaHlOojaivIrKJSNa4Y5UDbcQdQgG6lGxMBVUhTwmkOnZd4Zt9BBP/jwJ4tPxyKBFjz7406BOKWhiZ5ZKWNS1GaVIWDiPepYmIxKfANNY5bWBn44QPkTiI6l+cEczeYE0ViPxnLqsnJptIT5NO/cYr/rnFfLg8873PzqfC7GnTfG5gk0M20bmZ0jUijg10CbYYNEeVZv1Yiy+4GPJ/BHNLe2S8njRE3LzpSJRoQZlZ0S2xUlcq82GdMOqHFVWjL9FtqXvf9RCj+aUZt1GVzVdYfQEIniisFMto2e4DL2EnHEuxMBA2pmxbaHW1W/UdjGVRR9LMlVcoCIAXHo8FuNISH7WBsWCA0v5e99Y4lkTY9s3Dk1Z+j7a+YvtzoN0BAM2VV9IO7MobNte8LC3xjUFo6Hjph3BtNrYZEVTnZDYfoLMtM4IxiBi55OGR1hBEgtfYX0qCNsnnrbhNXyGZKLeNUVtf9r2oygzN0sqQpgZ1lpFZlqfWONxMXbh4iRM7/8lxiSeB4xirKMmEzSgJ4ek8gLszI0GiTTgzQN4LUsvErB/PPiFGcAajfW3ywJF1yf+KjRq7Xn93fOpBbdKK4+OxjI6EiLi+tt3x66eIZhQEFLF8vzt2qohbKRdH2GCAV4vZHv2RWzNAZel8ve0M08mHWYh8/ZCfD0XbKAXDBXi7JoGxjlIZjvKHMrbaIgolukIrQpPcx8XO/erwM1YoEFT0h0qWMdJ22uI+hllYfv7TOHRy/lFxqV11+Qy8SMQ3qxnZBIhxFcE5udwOkaMqRJfL7yYsoFXUWSwx4Mo7DtrezqesRo3cTtsOERT3a643aWiqTndQKbqS5OCOODjI7rnjc5nOhzmRIEahbP9IJLGeL5/0/k3xWX2x6otvhMHtxt9etmZLxcxdYoDcEHRbQlWwVTUr79v9PdRkoGwzWE1stkO2Ohypdtf5H/9ol9nUTivQMeOaNoFr98UCf1//0ff9xhYPwDDAw/RKSOhv3zL6fwInWM8LX4zW3Gz64189LJHtakufZfwY66qcpA4QdZlaiVPr51vXReR0H/GoiI9vYXmRUk/ZJqQ+klYL6Cnkqehj4wkBa04vI7mqZ1d29n9JClPLlN2xguizgYD3ubXzjHAL+0800pIHmAUxtO4e6nwrObkJO9r2xBjPz1fVkOd2K9kxrYWRgabknvqKTsUIloT5WJuBImqSOg/Eqlz6COXnLVzlepoqlPkMYaD+Pan4AvsOrwOXeWqesacZkIcdz4J90CudDKa2KF/aYE6KFN61fg/cGDZ2evsjGV3sIgxTlitKMyV6wZ9IKGOLNIwVeWe0wQ5sX3vOIMaXPYJEuzepdr3ojAnkelaSeMwAp1zaZcH30g799k1NujCRMyoTvIgcmrWuphgr46NaCN/SgkQeibTUAHW2Fk1WlKf7Jyd5JEMCN2AQI8JrbnT9yETpzsKwE7a+fta4BWZwwbA4v0Vl+BSQRNNFZ/eLqVy6v1ScEMfdm6u0GiPjU7pj5Cd+y0OTGkEi2Kb8kFXTbVBnjY+U9j+zNFYR7Y6fsdh8lAGi8wuxchwUwBjKuMGNLdMEbV9pMUmc+lV3cu0Mf7oKtKxS/Y6IzXKkK8KoE6PeJW+t4PcdLeiG8OtytSdz6JNjbCJZPzQ1v7pEUv/LLF//2DXxLGrYpouv9DmMo5yGkErwkXOvEUQLrsNaKwuEp/LNZi3xrkpDUbi67Tzi6lEZM7ETztuXl3PC5lt1nc15sFafpVVw9llvqYjww7MDLxQc34gBYDEjy6yfZFsEDCqY4Pw1usjGXENrR9UKMYSbuV+EKX/4FnsHLrCwmKsz2F11UIUxud+TWuBWqqmiK1gLDJ/mzteP9SgA3FIzaDDC3AWzOQwHJKpYmwEbCcOWlp9+UqI+XeBK3gfC4zxyOKM6Yt7PmpdoW+LDFUI9UsYmdj5RNzY5sknAHX1xXoh35OHhbtSWIPQbE3SKyouZa/A8pF4xvRJzS/WHXQmDr313o8DlnaWgcDNXn7UB9R0xvY4DTK7EfcMt1S62jqxjeWhgrSBdsyVmCtEE9aRtLoJGnf+yKa6pwu+rA74BqNXOJMtOirEj6ztW4dxZ1NPxUxhOxX6ceebud7Bm4tW0F4k6JCnfN0p1zJj6NrrgTx00KUEQ7/UrADVfoqPx3f50q3O/NYdYAa0NA9OtSIvFgWwA3uiybeXA8pRjT75SvgJU5+OXgGT4hErONqncuMnSU9fxeRI+H8BBgAZrNUmAAQp2wAAAABJRU5ErkJggg==",gradient:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAMYZJREFUeNrsXduOLUmtdGY1zCAGBiGNeOFj+E7+iUeeeAGEOGIQd4Zrr8xTznZkR0Y5a/XA29HZ0lZ3r0utWpVOOxwOu0rv/X/M7Nvnz1ZKOX+1fv5v59/j5/mY/+z4219wPubPNzwfv/d4HK9r9P4Wx+fjPnCM+Lvx++j4D/rdfz7a+a/W6j/w+of/jd/l5/gfr8XrLq/Bsc7nH/o4nefjOI7Xx+PRz5/+mn7+3vgx/+mvw3teXl7GsV5fX1tc24c/9u9//3tch2984xuv/vi//vWv5bp985vf1O/TsTb+/6uvvurf/va321//+tce//Ad7Hvf+97jt7/9bf/iiy/ar3/9a/8S/Yc//OE435/85Cf2l7/8pf/oRz96WzN/0pJ/b+s0Fjt9mk62ywJhsf3xhxpA/P7AYspzuPidv/z570GLw4/jHF79uTiPR2IId7/jWP08xqu+zj8bRuP/zkVu/hMGF8+/hiEsRnUu+uu52OP7Dct4Nwp/rp8/X/EYG8RpDP6zhSF1XBO8ln/S//7nP/+5f/bZZw3W4Of05Zdf2ueff/7wz/P/P/vZz+xb3/rWMJCf/vSnvZwP/vk82Hdod7KldXgAXnD85x1Mr+eTHH/zjtWdGgaox3kkxsLGdVkc2eFqPHyMaQDxXCfDGsaE3/0CklGMv8MLPPC3n0/8/YAX8HOO58cm8MfCAzQYBJ0LruMDC+9/u0dwY/An//nPf9rpEcZxsdv//ve/Gxb5XNDxM/713//+9+6ZxoKfr2vnjh+e4Xe/+11zr/GHP/xheIIf//jHj5fzYAU73nc77Xx/3C3Jwgj8uUIhAZ5geV/sJP9ZfDHihMt5Qn48t4bx8/xfw5s8rs6nF5yPv/Z873jCj4vPjvMaP+O1y+fAc8V5lHjP+NwwBnuzx/oIz1niWOP1cY52XsTlb7wWf9vbyvvn1lj0GkZYcH38/P1x+Gq879z146RPoxi/+89z4cfx3QD+8Y9/1AgF/vs4t/PnOM9PPvmk/e1vfxvfyR8/F7mex7BPP/10vP782ze3+TH9OOf/fi58+fnPf17dQNwI/Fq84ITiYnYOAVhYusBG5395LRYvFqzHRQFmWEIL/rHxwMj42PwvjouLX8JQii5IvH8aAhYxPJCfF97XYRQRYsYFDaPpuLgwqvjMGnHez7WeuxvH893vu27YqoeD8/cK/OR/+8mcu/mIHY9r28+Fc+MYix+PNXw2rnksfI1dj83oBjHO2bGAn4cbgnsM3/1uECdWqH/605+GQZ4/yxkmxkefrx/fZ/EAbLViBIV3PO3UuY60qxu9ruuiy4L7Se9wRsn+qwHRayvFzCLPDSMQD8TGM70Frkd4nhZeh5/j91oYh4VhWLh/OxehRjgYm8I/nw0WnsTfFzF8eqD474vtx/Hd7+HAv8MDBhkLXz20+GL6ZnPD9DDixnJ6DjeAfhrAeO4MBeP37373u/aLX/yinFhgXMiXbFduFq/w7qILxTuuJwt4OXh4mk47fhqaLJ6Rd0IIWM6JDTOen+6eDKvQ6ws/RobPxytYcN/F7g1419Jr+VrU+Bs/fUfP97oBnAYxd7S/Bx4Di+6feT5m8V6Lx0bIOv/GIrsHGMYSwM7DB6J2++Mf/1jd7Z+ewHf/MCD3CO72z5BRfvOb39j5/ziNZHyfl7cs54r4Zdd2WrhCi9XlPRdMwM9L/ISL7vjy/H46h/kZ+KJYsPKGMKehhTepwBV+oRQLxM5Wr1Lg/un1Y+UcI3h8rm/WNfEJnvf3B8bAhSwRcmqARN+lbpy+EOXtkOOtxY/rC+vhIb5r9djvz52vHYjuXMxxvu5RfEcHbhnY7FxQNw535zVA3+HHOl2973g3Ig8JLULA4T89BfTP+P73v19hAIXjPS1eSbxApS+aGUsRgNiThe/q0tUD0edrjGeAVwKVd47PkQlgR1mEhk5hYO70WHQjgNgBAuGOKWwYsAMtrmHB49oY3HkYXw8AaHgsrneNzxw25gsb7xuG9XiD9BaGUOJzB5D097g795/n+zx9ZNfvRlBOwxgx3zeMG4Efw9/jv/t3PLOGETp+9atfXTAAUL8l7nycMHY/ZQZdw4a6W379jm/QuE+xnMNCp4VjAxmZB47lrjE+E7igiHEa4wIyHvZGLTwCFr8SyGUQOkMZYSX8fkTqNhaDvAeHGWQjvpjjuQC7NVK7ErHe/yiR2g2Q6R7Ez8sX3zMC/z7ubXyhg1gaHsYP7uHGDca9xpkB2Jdfflm++OKLtyyAFr0CsasLB2JlNC+hoNMF4Th7BwQ7G4sfA+ciAJRB5iMWgLOXiswD38PBMrADhbCxuwXVL2kjLy6OF3H48b7W0wiw6/11Dw45iO3+ecARvprupv18/HmkoRFijtj5vmjHIBDCe8TiDyPxz4j3+k73z394mudx3sOGv9YXPTKAAUYdB/ih3XDcS7jHcMNxI3oJC+Mcuwtgsx2Yi4vEKY0uLv+/7HYsrl8Q/3wsIgGxbTaBRYud+eD3YeGwmP4a8BeRpk33LoCxAFeQRxgXOV6DuN84RQOoI+wwN0ugf999BYaJhffz88Xy7+lGEiHDr4Xvcnw/I9A3wo0/5sfw7+2L6gsfYcK9wfCAzgoGATUMxo3E3b6/9wwB5Tvf+U7/5S9/2V9igY12/byA5NJaRguzl0CcBLDj58VbFHrNJFfIpdfwJgowpzeIGA0EboL2a8TWwudMuX+N9zRK79h4Kn12obg/FgCGxeeCFNC9ANI9X2G/4GFILYzwgVBAbv+IY3YYrGcPJ/jrEfMtYvcjFnG81t35+e9wg6JFdsMBWPZM4HAQ6N7B00Y/rocGryNgY7/gy8vidmUGhaSZBaLYMbbZ6YV3Gh+X3qPgcb6fXOqCC0AIMZkThvOQ3d0VSHKaF64dr6mBcV4DcGFxAShrxPNKhbPhYhE2AdKA9IOEsnhPx2f4yvmixt/DEvzcEcqibtADwA1DcQ/hbtx3eHiAEeedWPKLdC6qf/cjQoQby8ALCBmeTTg3cGYMLXBG+fzzz988gBoA7VYLd4fHMmDIlDCDoknPslchvKELpdTyTO0E/Rt5LQWNmcEuYPQ9e3zb+YxxgLzxj8kbeA98xdjR/h5frAMhBoYS3qJgF8cCT5DJ5FOAOU4vR7z2BfdFBBj1Y7rHCPQ/kL7Hdz8v/xkFpSMo4hZg0M91gEQ3GIST2ADvIUDiPtayJxezJdXC9OLD/SmVGyuZMXsAb4XwSKF0sgiGSA2KU0JK8QobJKd4tMAWXH7n+A5vwGkcAFlYE7CCAS8EiXQEeBwexF1zGMLIEILWfWBHxsa3QPY9NkAJWncY3PnTQd7wJL77/bJ4FhDXbj4fnqQHh3CANAqvMD7HyaIXXESwbAL+mCVrwvjxzi2JsSykDoNJKop0jrvMDnIKlmQEFZQr07vCH5gYAvMOl1oCXDvyejJgC7c9eYUAdROXxE6foSLwCQDfrEdQSleiGjnifdC8OMZrAMNhCLFoFkDRX3MEG3gEfzDQv+f6YB/9eTcYfz5Syx4gcnAG+Puzzz47XhTNiovvstsL0Z1NCkiTSMHLkNa9E3yFd/J068QvTLKJPRHAGB23kJF0cdGNU0kYEnal/M7HNjle5d0Md05ArxKLObwbUr74XD9ojcUzGGFUAEEgje/i7t6f9/e614gFeo0i0Xh9LGYjb2FRJfRjDqNzcAdP5c/7ZwVobGE8/ZNPPnFKGFnMWwhQHCCAbWH0eEfH1VpQuHIFeJ2WceFZ/KQIOiDEzL9RCiaDWXYWgTQjjMEAr6MaCHeO80a8JVAI5hBp1eQm2BAA6njXR8r3wLWBgeL6hmGUeF8L2teC50eWgM81LKq7bN/VfthzsYdxeNiAIQUj6dz+MJBw9W4UbhyPwBhHaAWcPh4Gcv4cX2YaAJg0rf4RGJwuG9IjWrSeFZQIfHV5faFjsyvu5BUKPINSzJRzcziaOxklaSw01/qZ4uXUks4JiH2pzIGqDeT+So8bgTuged6lNa7xUP2EAVssSOH/4d473L8fN8LBI0JHfO3m7t8PPnBFvKcFU1iCQfQ1HWEisIC5OIRTav91FoOU/ROp2BLrianr5Ga7ZAqVtIULx8DxnlJCTRs7xeaHPI9Qs3D4BOoaA7zQAGBhl4X3z/YKHJ4PIqaE++5sIPTe2t7jBcieGi4dYa9D8eQ7GNc02MgK2jf0gCVSuBZG8Iq0D94jUP9g8oLn78EHDGMI8GrhISokYKFptMAmM8c/Q4HrA94UQVGs4DhsCcGyxG+lbYm5S8kjWjhjnp70AIVjP31mZ8aQn484zGKTi9FQ3OXnGrnyFrEWIGOKLsBxwJDA3SP+x3FrPAe8UMMAWhhVwfHqmy6uk/AD7rkHoCuB5B21N9T7YczwIBE2K7yKG4+/zg3xPPZrGJT//ghP0kJTMLILXL9PP/30mCGAcvWy2/1xQZt4BFh9xgX0TGgCYyFQhgUr8prJ/yMlEi80F4RLtVqjp9g9XT9cLEAhGV0jOhcAtQHdA2Qy6ePUP4wUaD/y9pmB+Ou8Bg9VT7B40BX6Orx6Lk9kUY+UrUYq6Okc3H0nGvkBrsCf92NFFtCj2gv9wLi2HgY4HX6hL1rYfQkgVK+whAJx4Y3Jekb4SVWuULhhHIAdaaScYdePYgw8SqeUr0lML4I1TMMAjAkLj4ITx3ksMlxpEEAAkQfcNTGTJcgghBLE6Eoy8IpijwM5VDKDQj7CmCa9HDgBlUqQSIengaSwagjrEJX4e1yMgrSRZGb1BWmKlwtJ2MnizwWAqUsXcNcI8S98AQE2rv41ZCBafWSwBskVGxftdhZbFsYGIu9SRZAR0p+un7BEJXBnUQhqsZgzPKAIg/hO2KMiHsdxx3nG4vprDjCGsZADtKFggxAQRgGDPMLtj+/jHiAyHAstgHMCJShl5P4A6T0MZV7P0aPAqZnw9EjfGu0SS5hDzhQWPODvkTLxUlqWhZwMYWwl9h7M+SNsmCJ3Lkwx60g8fEP8Dkn4EtuRgoWHWQgpyu8nNYtjAiyGoR2A6uDhEebCpcNL9Fgcg57PwRxwBYwgcINFHQAVRgtQCM7Agt0DbihI+4IxHJxNYIDJup5A8B0DJIqgC3LHQkqR6ELbUpq2YAIBg6i6sbcw2qmdRRNsEPAmtMt7UppWRRDUtCwl41SvM0+ABcT7w+VPYQhwA7AGLcT0Ak7qAAPE30Y6gkdUAluQNo1IH6D2HgKPGkbdKHtwDNBQLQTH7548gJ6BGqaMpxPZ5edQXyA6oJ3SM/WO1PtLJguji9tY00/Hw2cUqd8vfzMm4fdB0CGpa2FKNtzm5Csojk9hZ3iAGkgd2YRFGsg6ADR3zDJygLaJDyI3H1ZDCwpgCc9jxM1jNx0Qi0Jf6GGBGjz8dfi7A/xB4RMysFkdDRcPdnKkk/AInuYGoTTCOgpICgI7kSOXqh+7bJKOlTu0D6tj4MiMInYy0bNTmQQpFSN9rrezJAtpH9HQnLd35RkilqKhjnHAghXi75kt4O8AWx1sIJeT47EjrieQfo8QMpC9f79A7j1EHC0ea3D/sftbFJHgvSq0kPEYjg+mD4QQgOrcSOEJJvPp18CN6SWpqGXFnZQmTli/LpkCSsmcYSxhRLwJ3HYTgym0qzWlK0zwEIs4C0Gk5sHFeYj7x/mVaPqYbh0Xnip+jRc9Xo9ePNM0D4DSF5OzDRhQIHN4JPci0AXAO3DKCXV0R9XSMQPSQrc96AxCT4ByfiFyClmNt5sdMwRk3R4S3+2ma8gSt86a/y6LPZW3jPg5w6BQgQzgwUCUlcYixCyiAIIwE66dmzmKVBgbdjgMj8EgQhPKubFwD9pxjY0PFx18BqV3jxCKjN9PFw1Zd4+MAHgD2UCJ8DG1hNADQB3s18aziChIDQ8Sqd8Ajf4ZOC6n2i/0xZYdvlPuCgEDYuiiuE1+Z8EovAETJZ3oY1bcFvoMbdzoqgwi6foC7hj8QU/Hki/i9RtjFWyOYPUa1fKnwAOeAIseu/YBVx+veYQEHAwhgOUBHR8JQAAAj1hsnKtFmngEzpilXfI2hY0DIT3O4yBN4zF6A0mGbFQStUyilWgBO3Hx7NaX37OWs7gojZi+Jf1koQaxkwuZI9qEubBA+IQ1UG6d5WaAQOX6RbdvAeqquFITjDAvOGGESq79AQwAj4sw4R4A4Qnqodj1oIMNVC9jIhgJ8AkEJTAI8AcMgJEpYfGnAaAayC6Z+X7tFt5hA47PDJwUJErq1pMCkALJwvQxgKPo85ewQUZQ+DjsNVgqRmXiWVmkHr1OBnkQSre3NX0AyfvPVyq8ABeA9JnGA7VvyLkA/hT4Lq1k7hH8Pb7Do8DVQmVk3GMY4aPH52LxD8nAjtGRjJo1vICyclQ7z3gCrg8U6ffrSh9jF8M44GbI4BbUnuEKZvh4J/LzLBTFsIrYkThYp+ynUlfOXHAyGu47MKRu7HXICDoMJCp2LP2qMTRi0sYAmUD2cPFR5n0glQQOgPun90JZhMKQkch1xH2imXvMJ6ihW3Al0suFCNJdLbvyovpRSRjRyRehiCh+O1XkHsIDzA5a8SKLlyA93lLTJyzQWTlERZ8F1dPOftB7QPg0Dg+sRgLC55QQRa1Q9xiJSyq5/hrpYAkJNwwCIWCKN4FTwjtMdXGSMnLoKhz3mcjDGsCIX8gK2a131gaKPr+IlLwIbascQEkqhYUUPRoCjF0+PFDi2tU4uCpoFH+7PD7pV9QuSA3E2KOGcocLMRUafgA+7MBA6Y3CRqM4PUMAmlTITU/vy6kerIL0iKCPUXxCUeigmr9x3YGuw5zxFEY5O60mCESuzmoRkVkZlVYbqW0ba/50lgDn8MixcRDyAka79kGTPxQrVBorw/30VYzgwb0FFDpMQkUharej+ALGT4xhfh9i7ubWQvyGO6ZiEJTCRxwPzSGzexhrAG8Wrr4SmzgXGiifDLAHX3AQsdXo3BCeG1U2B0k1ikGoBiLvvGncNKnwXQZGcI8A19d16gd9loYWpo9LIs1ij1PIIOG2m7RnNaaRUT2kHQNDr5QylUQ11BkrxCJ13u2gbQHw4lw6AcSGUTKUAhbqT6i8WyFkQR9hYI8qGKYyuUYpHqqILXgQrrfgdaNo9MKqVk7hbtq+TRs/Njghrf9L82hj1TAdZ9EPUnm3JxM2umr3OJNR3T/vauT1xEk0Yv0OqgVAeVSIdkUrOHYw8vEHAVAuKpXoAYCsHBvlwfKviM9VdnIleTc+Z4aE89wOmhx28CwiMg546geVg0d3sPGYFhV9yO6dNG5CH19EoIT2OwM0rjsJOXQpCpFKh0UrhdW7VFcorBFkIyAlEJTFnVz2gyd7xE5rCBFcwwiCZ2ICuGX6zBq7fhZ1cBwsGhkLFmmifHgiGi7ROHyGoczwwRoOyhRKTEyZOCaZ3XB4RrCEAKqqdQF6zAeYfOGlZi+dRbPIRFz+QugwkicDXBYydtlDUsNLLs+ScJwXlXcrIfrOzB/0dXgNcQwLxUtpX2fABaxBnmHy+6jUIRWkoY5zccjgptdBpsDqaPca6G6mlBmFp0bS80ahtmh3F2GABQQuKt1E5r1o/ZJpHl15BOL3+8bV92TQQiV3xSTSBIBKLrG7I8HFDAcQenA6x+dKLV9MGKE3kUNGp2NVNgKpAxgNh1jAHhYK1UBUDOPcp1oI4A/GFDigR9m5EW5hareFvB+Uc0fpmCaVTtnd8AIBWJTo2c0DuLSExQVuWvJlwEg7VulgTRtZVq1ZiUncn68hQMl5fZdYb6IA6pLHz8oZxttRrDUWiwJEgrpFKZrcfGHDgBGAjKKFnsWix9u/QrTv9JgggsgguITfuMWdMq0Cb4KZjNA2xLEPgMDhAWKCFUu94aKbysA4NpPmTnFCIWTOsbsLq2ck8eJ5P1hYbfJEiKlUuJlfmIgQYANl+hauX8geI7Ep5NfMEBr9X8q7MIrY0Q8mf4hcajQviD8TvATPLOpszPG9D/D7IJKgFIrzeYHUHiGFkH+VzO3dA9Ago75Z6J509DCgKEn3TxMyKVUDYQckGcWyo7VMzNJw3dHMiUPlg5nFXNbldI8WudHnVuIDuN2roLeP83iK/QB2nUMDO1K4+vAM8BYwDA4bDQKW4BqOGEAwewWRcZBnHYvvr0GoiZJzI6m/K4UuIWDp3NGMQPkBZvOSIQ+c3zYRg0x3T+4s0wKwALNzNw/z/1TfNx3YJP34yvqpEhjAb7pVKjiZ1volLUOYYCnYmPQGVy08wKzxs5oI4YAem/2ECE2S5kEoCr1/pY3VE/EOg8B3USgJJnUBTZi9dEQMM4iSx3dhE4u4ViZ0Zmq0yfN70tM3MwkyDOUNlk5fgDgeyUphpbOrB8ZAuKEFxMXnvN9kLAxGyDXCCMgWOsXtRsYEzn95HN1UmBaGcjKcjotB6JjLPwoDB7X6j3R1YgCfLsmt3qLBT8e4bMbILGBS2sW6dAaZ1Piz0jAv+Ow3ZEJIyCG4T24AnS1VBPYWl56UXku8h/sMsfgt4fubqI4qYYxZ5AGYZBk3rjfOL9z9JHhYpEJgsNBngfZuND+x6JAuxmzhAcoLTaBiV39B69ojyLMDZfgDkzgLiOFyL/cg8EAmgEVuzdYsgFwyt3ez/o9z9kbgsXPxincuAVZQAZXQdyWVMcf4ZUp4f28rmmpiYga5owf1AxxnhjHOJIhpRLbTadHhKRtG1Ej6vUSJ+G6V1vgYGICGG6iGX8WbOz6gyLSPQm58mRjGMwW47ZzTGJ7WRTu5S9VvAZ2CC3rC58+dLFO+TLMLbu5kfQDRxkxOGZNCHP/nLTzeizjM3SOml+jfe6VawsztYQwYbxcs5JxPhHATE8yYMVzSWpqAynOa1yzAQwCqc7RbmB7OFEFzx9JMoYULoF1nvPtlXIslhA+zgktnLy82724ATu0XoOohPFCl8utDFThaBWS9nZA+RqG26uILadSorMuDqHosPm+EOYKeKnr+/Q7qMzQp9x48XCPO+UC/IEnWjDqrjykLBwhUgMdgcCcBp4tmpPO/AEddbObYQyXMLKCJ/s+kVM25vkmnjwnYm0IM+vxC2j3mCUyqfMoDcL0daqBKC2dE/nBqWNhboOqJ8yJGj88dxneQ1+jEwXCez2l01+nuepMPxgDGqaBO+2aFz65UrDMFCGwtI91lVy9yM2q24IZQY0aMUzzOEhQsUuFoGUJJRZOFTJKdDxFpUyk4aSaBK5p0C+O1k94FQCT3Xohf4KminXiATkpjFnog1ivP0eReTpgwtnRT8ZSXmQYKEWTaBCoTPLLGEU71MqLIpFdgyf0lDnMn8bL4BAQ1FaxaaKIKHOvyi9TOqyp4gPql1t55UliQMqZtZ6Q+4onhxl6Ic3qAPEorFRiyiGPRGkI8grkM7sqROVD9H7fuaXQtu3iAlQfIZgQzhZsIQlX1o1x9GlLEDZuqeXTR2do5tdPHKQxxSOAJH8aj36ijt9CtWioROiaeYDKE7KIJ/C2GQykjikNg8yp5xM7HUTKMdzfx/1U9ZlRLD079gA2yuc2TB8AwIwJny6RP4vhVHpapdhfxoeoKeUclFT0jNQtfjC7onjMHbkefah9RBy+zgfi9lOI1ppRlNy9cP9O09F2asnnvkWKGA8T/Sukgy7aXRafUGeGiC5W8ED0wsNiwLeFeLh7g9BAvL9xqtYvrlAXoCLmlqSQpz2bHyjwA6w05U1hcNmRW4gVMmkALVROZuEGIWMrNFBaMVTzEsc8cWtB/k7IwDBg7zyjnX8SrwgYaVRkfPIySsqZKY3PVnbeI89AHNtmA043RPZ3m9LIMA+gwpxlvpHy7AD8uyGis3xhF4e4hLJB4BJOiEaePS+MEeYHOGIDSUQZclcq7LO5YStNkAJ3Lt8wVECjleYOzXxCCTjHEQobGXuQQFrfRHcoaGXqj6zB1EugiEuavxq38XuInOJE3D0CKVNv19lFM7kr3ynPLbIBE+KE6AA0HlVTGLJlixs8SMLjcy4eO0QX4LcYDlS4BSeOFx40fCYhxaxjHeqM6gRF/Xyltnaze6r3fsyPGDAgXxPbVJMT2JL2d4/p4LBw35cTNwo5FEMKdQTvGz967Qkxu3qhawEsxSBtGZDbQMigSnoD4hCZKHgZ9TVRErAfk2F2IzjX1AtTytUxH54KVpKuz6VNIobHjaVfOAg8tJvfwAf3DyKsU+/CYkTAD7+/Jnd469wwSH9PkdcMYUw/Ad/yQtq5LSscLuhkcfRkjK7r/LCMo4gV00FQldUyR97A4gwmqZb5e4hGM6/bwBEHXcj2hSXxnUogVu0UpboyITTBGF7q703eYPQnEijbp0jKaUlbYEIQMYnJu3EroBT3wTASpDlAGMJkWd/S2KQk+UC9iihOoUKSGUGnQhJZ5OfXi+UCVdgs0+UtIoJ3feEYB5dtM9vDAyEouvDSpwbIC6B172SF0svECgRsgY2Bgu9ygA5kFg0FiJ02qftNQqA7QYj7DWPslBGyGQ2Vl3xTpZ23kGWhMMoJLDyJLxLkayDiBUkHuFOpSa9C6gMkwaw4Nldx+FfVwl3Iw1w4eMkSiS+u5UXPJIgARcFvIMLgJpDMYpfDU5HZ8nTT/TUb9F/EEsxjUuRyM7lLu56M4UhS86Y5OVEMm1K5J8UeBoQpELAGFRe7S2YhZ5Dk4LAY1WoDO+TfN92+UDvYEL6hxqIqXQ0Kh8GGE8Bulg43CCofVJgu8xH9iCvXGWoj/s04Qv78kx7pmATuuX8fE8yyBnRfI6N+kyKQGsIQJadfqya7OdvuCCzDkkRZTs4MqBRv+bPUOPHmsSbbARsX3PlhSN60g0sQwXtgMeBduVqXN1nAuMALMJE5u4WdSC3gbE4fbjG/mBPEcH0X5lxtLSg5/Vw8AeOla6VPPoaoiUQeplyjifRiQGd1qjnfwsvORP3OaxUogWTxF2IuxUYsXzxbGNub5yMwmLmkd9wsKTmCXb6ziQlGInbJkDm9ZAFXPdAbQZUqY3kZGhInaF6jVQNs1c+w8iO5YmQpmCbfQhRzSO3Y1obKr7nxuM5cFzzDAchyJ6Zzy8S1xOhFeS+hgNpG1E1xr4TH08foX6pg+pGeDqd8OtpAIo2tjiFYAeWAzWMHMOBKVjg4P15ssXoo53G6WTRtjEEQUq2kBiL2UNp/wc4k4xaipwyQ8GFU9q7p7uRvIobw+MalYrEsWQKreZW9JV69xFxAWXo9HO13vet4IBL63hu1Gxe1u7JwUfVTSZXJbWvUEivIvt55VaphduxRjTHl+eS0rinqCB5hl0xqFsVKJsiWN5+A4KimUTSp3nbyLeoxK59Okp7LLxruEA8n9Wb1VpImnkpikLrUAvWdfcgexLUhkokJYwMK3hM2IIS35ShOJSWm4J5lFT+YATFpaqnsmncPG8wWQXUh6v3D+tCurUORctVOKYEkfqZ7fhNLmnoie9AA0qrt02bMtxB+N3H+lHkSMAT5mGvgkC8iaPi83euSdQj5/TgFJ7idoUt5dKnt04mi/0jawrNi01Cho4kdLSsiVOmi5vqDTRjTGX+I9YQVOJbswkjo7gXc1zzRoMie5032QG7n/rmsg93N6kRt7qKGs3cHUIZwBvvSmEToKJhkgrTeTukjDdJgE1xi4g4h3uA5+TrIA9kxdOQBmC1VXIGXbLgLTJWugUbhQMj3UOMkLLUUp9S60S7koxSSQXt+FDpYOID6Wxn3++2UJAXc8wM0Mv2WmQCb83BgDXwweFqWv3XEFlt3vUNrLGhNJyU2yFyyRDJPKQKCmgOwZDhWGyIJwybkkQk4me5YbWydxfZHAca0iBkN06ejV2wABF2zbw3etXyoH31b8KAUwkYYvdxzTej4TPpwVCAvJZVkTzwEl03ITCzYAvbEksYklQ/aq2gGnrpkE1SmaeLcuXoxfszzPKmDN7YkanjxF1pep8v0kVNgMATS10lT6JfkkV/N6Uj28yMU3rj6lkJM6g7aLLeoYdvEJv2+qPZDjNynkzLmCDCIFC1TeRSwmIcDHDKB2CxfJUJgDYPHqIaPdDkX3rAcQRnA+KGygUcpo2yxAtP+KB7rKvsRjLPcR4Bk4cvMnBiPL1FCpOXS9QXRC9dZdUUpvb6NkES1iEwDJANEyBTNpFhqnelK1Y9lYocYVPN7J+yyj+VTYubkriwk/cGx2umoCJwewqIJ3peBnGQETPdojmMwAYu+wDHPiGYMa75nildy9sZEk1PWlKCXj1IrGfeEYinba4la3eB31MmZduYeKOLjMLQtdeVfzbhVPqeyriQRs6ZgSb2lCJpXMAHaj39PbvsgtXXTMrA6Huhstmw2J1s/n3rxlN0jfYUorC7nEM4Gz/5ewlWgHlvVm5E/fsbIYlNNf1vbzLpWF5VDYBPwtqiKhgvVn5gWOhQnkNHDXGazAK5v4IWnhpa6fzAPUtM+00zgZPV8SOrclU7ZNdnJl7RwPrBTP0EUz0KSczCkg/92JClbShkGtCcOnt91ZYj3zKptdryxu56YWvbvbBQPcsX27+wVoH0GS9hW5M3hPZg0UHSW3EY+WbGcLG1h1R7IxJbx/hh3U/beEDOJZxlzYaXItDhZ1SHqYGWe/K7LRSD71EF3lc3a9va++d3YGlawzKOkSmhmCCjd1Z9Jzl8le0rh+N0HswhgqSZXk/xfSij6/Jch+CjY41aU5w0a9BTqYoVDXEMvPlLxpQuSwcufSUQ39ftK70HUI56bpo2x+58bdfikGZdKvhN69pIkC/JZ7BohFmgyKXLSFuog8WiYRiZRdiEhmFBrfPzDJ8atkFsuGFANm78DdQWwkCtQWcJeBOE0PiartstDM/C2UO3vjxEtcwODTGUGbMTAp3btjDjONoTR52MZALCF7spmBKbmjKuabvoSMJ+DwUGQ4c+HUb5MpLOobbvygeyItbl2NRPQWHMsVyFmi/jURnWYtYu/lYK0GMvOnql+Vh2XxmHcdD3fYZBbLAAkeO6sXgps9N1oC7W1gmtmyfoXk/kU8b7DIhS+Ub3Mo0J2vhtAIoTcZaq1CD0uwQFcKmBlCkZB18RIZ+jcygDUNpMXTG0PzAvO99brc2KFvRsCbDGwqmRI4I30SKZgRG5nSvawEksUzGTWzuHdF32owqjKSzCMFdNK1U7mZVLt2aMCGdvLwbXF7ovFTwyhgAjlTEKB/3JaDEwB4MYpE/q23aTO73jF06eNnFXI2PFpTzE3dQBVEOkOgP5Gc7ZTJaXFKAKUSOJpWatWUFbtareubQV3LDR+FZ9BZDRdRqTaFLOPiN1Rw/0gamFWbVAyimIFva6ZlZJkp1JMJoYshSmVMkbyi67ImGuttahSpy3k18TBFOIKecCKMHdhT8uCJLovLMwAsGffSaPcq0l/OjSqs/LomIeB42XHnCug4NmcNIjpgMusJUGZL3b/0JKQlZLveRcwyNi/ZuRy39c4b5eb1i/yM5+5mVb5kZ3ZRT5VkmFaW2unYvpLMAFLZ2HaD0v+cCBIeYNll3AegRA5r/sRzbOcEbDQGF7cOIareXGLXT8Byc6kzLERORsKIq9VCU1FwJ0M1e1Ls6pvj63fuGb2uaZyQZZY17rKcPSkDm13HxdcLBtgNibh5ju8QbnfqoOSLLkCRh0rvhCHJBbx0Mqs6WLqalp1Id0vlvv+0L1Kp5yRtaxno1ZSOPC2HgSLgt2d9FjfcvkmbmCVUMRvVWzEIF1GLMeIFLuE8Y++Sn2WzaHz3sG1nT/LlS0JDK7OoRZKSMIxaZWw8pCqRe2XZhKZcncmmrD1OR7zK8Zp8z5rw/U0NmdvgaPfzBiuJQOS9HBzjxG8VQZu4lIkdGbkvU0Iz6jdD7subk5i6uYBFdlXZCFEs4RKWRkyZvNF3Xc12vblVVnZlIDvRf7KTp0BEdjrfSoarfYyxDtYD8HslLDTRCc6bRpXNjKALspQBUpbcI6DvQAg/lzF2mWo4wwmJmjhb1IzNVCNKx9Zk30l2u2YOaMGqmUciQ6ibMXumTJ7E+SN5zJKKoMkMoOX9wguUSzlYZwMmcbwzGZTw/JlQ5KIZsOQewgkqTuN+4lYXPJHs0IwPKKK00dc12bkXcCdl2kyVVBQIckFKZHB9M06ni+4va8sryWOaItoGD1xl4ZvpYKn6526WkO5oISD0FrL9SafRbOrkmYV0m3uTjqR+161857XoomYpqB5zCTU3Rszfs2ZMXkYYaUaVhBduCL2MhU3WQcPE3gCSCeFLjUCsQRtFlxs733gMnUVQsi+dgELdnT1RJGXZhjafXICmJbMOmfWT3da0yEU3vUrRu+onLL+hZk82h3qbbHeXZCiEZeVhpMWzFpBNCdvE8tQYsurcE8CYqXsuLWFsSFTyvNQJhAHUO4xfgFuS8hYZg1OS1mv9Pofgg0t30+Y6sIdqCVXMnrRm3T+SARwJXrDkdUWyg3cqWNUxG8R/2x+4WeyP/K63k02RdtJaXnbSMsvvSbhz01txyYYDycSyxoKXhHfvG+7+SFjAkoDxou6ewkB6/ZIsw+Q15UIEZWt9s8iW8dB3+oCb12xTy2zGwE1atn3uaxBbuwW/PW8pFvWPGLtK4RKUn2YEyYJ3KeD1ZLH134FaQLkzgDsRSGYEm0X9Ogu/a0UrmmbtFn2zoFmR6U7/eEdlf9iId2KXjdFmhlA2lK5lxqCLf+Nd35hAmm23jflfBxtsANMzHJD+fvN8do63r73b9f/Jwj9bZAGWt17h7vyfPZe4+p5gtew1byAQN41SqvO/8QK2Hxb5tfHBf2ModyXtGw+QGVq2sF8H7H70O6mk7HbxE1efeQfbvCbvDLrZXduLpxlBxvjtKoV3v99dnCeuf6dN+JA3SM7zkvMzB/GkoeYjHjFjXMtdSMgWPwuXO/y+VAOfGcDGMxSplF1SH1AFkpubjp/dpIZKJJXdPELWLt4ttJBb2+LSB4wk63FgEqltaiUmRaNOQlElh3TnzlRus/iXYlC2MS8GsOuxV3Uw7+oNU3hhAmX0fMbUXVrL1SB4UVmYIvTzRWiyqw8kr2EjvDCAyeLx55XNJqmSqqlItGgjjJJMyc6usiEykScbTZXjlFQVzDeMSFQ3aZ9Awv3bDdpniTTuUm4ZcOLePkHrKZLOysRJ1MrcbkZLX6hrFYQw937XOCt1ApPPrXKtlsfYaLLdzp7mZvcvRpPgtMIg8CIK3YWBXZUw2cXbkBEjaU3c1OVehapE1p0rZeN0J29SoQvBlMnWtNDzUcyQfGZ/ggMuWIPl3jcp3aXMbNexMOUmlK+y8GyX38SQVN+/A4NPsgcTy5y7jlQ4/clNKJbumE0LmmWLugtzzBVI2NktXM3A2sYTLTQvbb6age7NNUu9gSh+suyADehdFJppAjcufushWBqWXTABaakLTXbjpXVMFqhnz7MgVdS3XQpZKsNebnopimM2IN7dfP71RlllG+yRVQqzY9RN7NdiWkk2VRWdYQUR9HULQRdxR1YOloVKJ4vyBJGNwZTkC1+8SEjaeyYoyYBWYtiXiuCN1mFcdDX2GMtiT2J237jyLrE/+551UxFMNReJAFTDwnsaqJmAjolLMoJb9U/iPRarp+NpnZvvTpbVzXduUDODLFZeDFymni+Dr7TzaMNZLIBrh2F24SDLQm4YP0sKP+WZSESOoZKwko6KFQCW3lKW6/07bCDeQefgLIYg3UMZm1gSoYTZKh1Xb7JgAs0aMMGUBaI6+CIhmIpyCUk4WHCqlHKL9OoXWZieLP6Fa8jCaxZKE15hyQReNi7xo9z5ljqWnHub42fgRlO9O1ozEZdeNIJPPENazNLsQAHuhpXcFcYWWRnhoJpQt1mct4QYMkva8nevSQz22hzKu5I1gbtsQLWDm9elZU5h7Pqubn3HZ2cXJWEnGWmXDWdenrGfHzT4XRk2m5hqNyFUr5mmeDthTVYoYnayCAa4gsCsp19bxmTwwkLF3oSCbR/BVJCKFE2mjGdgMH088T66k5cdK2lvf2KIu+OldXchZJ4VarLGDvUUGelUNseyDSm0MoFKAe9y951WUND1NsfWXF3TQ50TmDgNS95fknPuG5e5K/FyM2V5kv0UYUcvDSEJ556GhJsM59mCZt4y41TuuIJhBC+qBkYv4N2NoLJJIuw1dCfp/B3lArIFyY6ToegNg1hEC2i755+Ek2yHM9+x9APsPoc7oLJNoyyq5XIuu8MbH/AilhpA5voTUsg2pU67Yf/K5vqnCP4uJt5UtLIYngkv1MUXHU/3RAyzDLlMPrPsvq/29mcE3w43PWMCN/HebjiBy7+XbMz65kJkVOiCkHdVvd1OpLQvjZ1J6pLG+oQ1u8RpZuJ05tUHNRAlQePlZnGW63aHL3aLeIctdtdj8966uYarB1CRx25H3GQEt3UAAWAmFKmJyKLssg81uo0rvbB4MgJnx5Fn+b7dLFbZbYonIUZ3ZtYcUjY7eCcLU76gbl4/z+HlbsZehvyTvPppSMhy2bvqYWJId2Bud2ubcrOrS0LU2AcA15YVvInVO/Km7LzlJpe3J96Dr29mNNlj7x5Ap4VviI8t7fuBC5Z5kiJsoAkit6/r+naLTrzAHWmyPcYGqJU7ADjdWE5EffjzP/D9ypPrsqWHX56pZBPt27Pd0j9qAIoddAZxQiX3/+AalZvU6Zn82jYVvl3ufdn9N7vcbsri6UZ74s3sA+/V41yzgI+UftXda0XwziCyuCpDHp/W6G/wSf8PLnBJCCvbiD4tOU55UnO/K+/eGiufQzZw68k57ErGKwbQAZC7a6i7NZvZm00bFy+4xN0b/X7PjqufKxdoEZFsvFfZ4JS+4fef7bC7FKs8KZCVBMxmncdZLeCZ3DtTB6e44KOEwf//+z/67+UHP/hB++qrr56mXJswkIpHdcdb3uL1dVy4JWFly0s8iad3DKHdMYg3MfgiE9t05Fx28Y0qum++938CEjMv4D//+r8CDADo9xtGYDp6nwAAAABJRU5ErkJggg==",opacity:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAACACAYAAAAYqQmsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB4xJREFUeNrsW99rFTkUzslEW9H6E6F1F1tBfNGHos8L+w/v/7FPPpRCi0qhsCotpQ9axPrjxnwxmWYyOSeZ623dZR243LaTOckk53znO19SstaSUgofG77jZeMPb968Ufv7++ry5ct5O99mNpvR0tKSffLkidJaq8Te6DLJw5TdI1W+qOFn9nmtLvgyrQ2/fPkSp2t0uSlVxhj2/qDD9+/fl9bvbCHdhXu3b99Wly5dEjt89+6dJXcxfcEUmZ2dHWm91OnpKT18+FA9fvxYHDk6ff78OX39+lUxfZKzpUzXdfIUmLZZR0fRFveSsGWktzuP66d46f/jDW2CDhzE/ehMeLtmXoia4/J2zOfPn0WD7n7bVDmXBxrhw4UFbNHx8fFSLaARsCcnJ2xMAowQg9evX1c80AREunXrVnXKkJ7evn2rXApiDS0vL6uNjY25w2KErS4XVrEU3zUA1w05778d+P/KDu0iB9XSIc2DKNw9w0BaDmfW5TufXAvtCN4ZPNQGRyzZ8vbMx48ftQRvgWLoa9euISxs5tkU2yBkPnz4oBH4IfipYEuZ7e1tkgD606dP9ODBA7u5ucnhrX8bB2m0tbWlAsUoxjZsxTWkyhqQsJ7xLWvr+R28C6MZ/C5h46jnMJ3JMyNbvwL/XDoU46YQl1xbsWrqnabgpTWaQRUUIgl5DGJDesDdb6YYoBAFikGpLTo8PPytMI02pfCRZhTKAopghMQbGQEXSoBHco1/b6EYL1++ZCkGBnXlyhX19OnTSU7DLbRNKEaJw/o3d1NKCYBXS26akJ6I8WJqgMGFxSFNjcOpxu28z3CBL8WSzda91nawBOkbpgaIeTBPwLZSDOXhNihmROcINKLYBn9PSLCIRChmupZFQAwiNDjmjXseSSr5ExRDS0zLGbH3798nF9TS2lpUYVBEGBXDt8OADOCmMA29cWCjrwnGNYNN19sFv2d17pNrNb2TgfeAYohT2qIuRU5ToBgjW3lY2IlBXXqu5NmUI40+b4qfdtipC7zmgbaFkKiWqZtXPhlRDHFKWykGaguGYgxs0evXr/9gkJ1C7PjEmyTXEs1H7OGb4s9MTPsGfwpU0H8HimEDtI0yQVQxnj17phgliyY7DTqTsBRT2qJimEK9V+U3cyZkihVwxyBFCah1g9dWp7QrldiltZxI86kEfT8l8Gtv2MrUJGph0zWkApEaGUL6iXsYpdQU4q+KQsa1My3ZAe4uuTzuZWFRdKpIMURou3fvXrVuQDZ3FMOiUwnaoNN0ElCjagqBL0056gu09QIS16HfmdFnc1DkokmJJq6xezMLU8xSnhU9C0jAkxAo7XBKzcAFf/W5i6AYRWhrKWJa5UqpmLER2qaWYBEoJDwtr6GjBUYK1EAxbK3ijSqGQPW9MmnW1takwAd9940PDg4Ut7kZlcTV1VWyQ1lx4FwYjFlfX++EqaCgYtjd3V1UUMU4DCqGdWika0pWs5dKGyVBxWimGEYShqY4RIvzlSjGVNpQYwcsxWhJuFbisC3PcXFoGRHIcuoE2KIgOMTvnrVJ05Ma7ASkyRFrloAE5U7TAmNaCP7S77qY8VvDIu6+lKYbfw8SZm3QFmcxxA4BV3fv3lWbm5uiJILgBzhIFAO2cNpEzIegBejw6tWrtRmgk5MTKxz+UPHwR1eTlluuKYc/piTgHy1oRIrBhYcSoJBqLLyEpbXOVYXOcx0ShzRUeYOWdqJAaxit1GZBPGvoMH/7lIr0ZzFKCNKLtuGshs3WejStUPWzsxijbOHj0MWYqdQM/vv4+FhMrgj4O3fuiIHvB+Mg6a8ajYeK8erVK3GjBCpG60ZJ1wLe2HDGtLGy5HeKgfpC3N4thUUuqOcPzQT1sRYmNs/4MyaAdXKvExSPGZO0barqd5kbc9sCnaqfnepqANGiYsyzE8M+m2b8yZVQ9nfbMPiBisEhiRaMtvLUEaeJneYd99/Z+VKbOlI4okQZxcgh0jsNvXjx4m9p6tDRzZs3/Q4ohzRBp1FHR0cc0vSDNg6yOolXQplwHZL72GxzZBBf6BDbtsnhj1neFmdV3UyYjgmJHiMZ0KYcJ50tL2G4y+Z8tJ96Rmv7EVFd3ERJmfes4U04GVNnZQALDil4a67iWaSSMU/11LLXpCT5Ui9q9E000XmXLnGPONKQ8bk1Goh7EPb83sR3Lx05oPfkGzdumELuG+x84tvReEpUu4FjQNCDy6+srPgknLWjpLbwGyX/FBLuwCAoxt7eHoV9ixE5RiegGCh4arTSMAl1lnWu3ZTZpAwZeDKmENTCdTxL5FDLZQvNFJ+lvWFVgLf0XsfscRR3Zqgh7VCDii/aMhnmcYpiSdDTAoka6EYpiuUdUiOEUSFv5u1TQmXSNTRZRs/3MaiybunguszGiFa2Io3IzBu0VTV570k6Z4GgR8iEiBDTGrmAPq3V7hAUQOUlvRQfoJEtH8OkKHOag4ODTipAQTEePXrklQwpo6AfN3jFbJRQTzHCSa7SOZkeJytKY08xYAvMjZl6bcNGl27Yn5jKttl7F/4PHr86XPhlwmFxMQ6bRu6CPhxRkk5fqm8CDAD+N1YCniOhoQAAAABJRU5ErkJggg=="},"undefined"!=typeof $&&null!==$&&($.fn.ldColorPicker=function(t){return null==t&&(t={}),this[0]?this[0]._ldcpnode?this[0]._ldcpnode._ldcp:new e(this[0],t):void 0
}),"undefined"!=typeof window&&null!==window&&(window.ldColorPicker=e),"undefined"!=typeof angular&&null!==angular?(i=angular.module("ldColorPicker",[]),i.directive("ldcolorpicker",function(){return{require:[],restrict:"A",scope:{ldcp:"=ngLdcp",color:"=ngModel",idx:"=ngIdx",pinned:"=ngPinned",palette:"=ngPalette",config:"&config"},link:function(t,n,i){var l;return l=new e(n[0],t.config()||{},null),i.ngLdcp&&(t.ldcp=l),l.on("change",function(e){return t.$apply(function(){return i.ngModel?t.color=e:void 0})}),l.on("change-palette",function(){return t.$apply(function(){return i.ngPalette?t.palette=l.getPalette():void 0})}),t.$watch("color",function(t){var e,n;try{if(e=l.getValue(),null!=t&&e!==t)return setTimeout(function(){return l.setColor(t)},0)}catch(i){return n=i}}),l.on("change-idx",function(e){return t.$apply(function(){return i.ngIdx?t.idx=e:void 0})}),i.ngIdx&&null==t.idx&&(t.idx=l.getIdx()),t.$watch("idx",function(t){return null!=t?setTimeout(function(){return l.setIdx(t)},0):void 0}),l.on("change-pin",function(e){return t.$apply(function(){return i.ngPinned?t.pinned=e:void 0})}),t.$watch("pinned",function(t){return setTimeout(function(){return l.setPin(t)},0)})}}}),i):void 0}();var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get=function(t,e,n){for(var i=!0;i;){var l=t,r=e,o=n;i=!1,null===l&&(l=Function.prototype);var s=Object.getOwnPropertyDescriptor(l,r);if(void 0!==s){if("value"in s)return s.value;var a=s.get;return void 0===a?void 0:a.call(o)}var c=Object.getPrototypeOf(l);if(null===c)return void 0;t=c,e=r,n=o,i=!0,s=c=void 0}};"undefined"!=typeof React&&React.DOM&&!function(){var t=function(t){function e(t){_classCallCheck(this,e),_get(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t)}return _inherits(e,t),_createClass(e,[{key:"render",value:function(){return React.DOM.div({className:"ldColorPicker"})}},{key:"componentDidMount",value:function(){{var t=ReactDOM.findDOMNode(this);new ldColorPicker(null,this.props||{},t)}}},{key:"componentWillUnmount",value:function(){}}]),e}(React.Component);window.LDColorPicker=t}();// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// TODO actually recognize syntax of TypeScript constructs

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("class"),
        "implements": C,
        "namespace": C,
        "module": kw("module"),
        "enum": kw("module"),

        // scope modifiers
        "public": kw("modifier"),
        "private": kw("modifier"),
        "protected": kw("modifier"),
        "abstract": kw("modifier"),

        // operators
        "as": operator,

        // types
        "string": type, "number": type, "boolean": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/o/i)) {
      stream.eatWhile(/[0-7]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/b/i)) {
      stream.eatWhile(/[01]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (/^(?:operator|sof|keyword c|case|new|[\[{}\(,;:])$/.test(state.lastType) ||
                 (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - 1)))) {
        readRegexp(stream);
        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "class") return cont(pushlex("form"), className, poplex);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (type == "modifier") {
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expression);
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function maybedefault(_, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function typedef(type) {
    if (type == "variable") {cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "modifier") return cont(pattern)
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(pattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype, maybedefault);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "extends") return cont(expression, classNameAfter);
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      if (value == "static") {
        cx.marked = "keyword";
        return cont(classBody);
      }
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
      return cont(functiondef, classBody);
    }
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == ";") return cont(classBody);
    if (type == "}") return cont();
  }
  function classGetterSetter(type) {
    if (type != "variable") return pass();
    cx.marked = "property";
    return cont();
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(expressionNoComma, maybeArrayComprehension);
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension, expect("]"));
    if (type == ",") return cont(commasep(maybeexpressionNoComma, "]"));
    return pass(commasep(expressionNoComma, "]"));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("xml", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var multilineTagIndentFactor = parserConfig.multilineTagIndentFactor || 1;
  var multilineTagIndentPastTag = parserConfig.multilineTagIndentPastTag;
  if (multilineTagIndentPastTag == null) multilineTagIndentPastTag = true;

  var Kludges = parserConfig.htmlMode ? {
    autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                      'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                      'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                      'track': true, 'wbr': true, 'menuitem': true},
    implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                       'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                       'th': true, 'tr': true},
    contextGrabbers: {
      'dd': {'dd': true, 'dt': true},
      'dt': {'dd': true, 'dt': true},
      'li': {'li': true},
      'option': {'option': true, 'optgroup': true},
      'optgroup': {'optgroup': true},
      'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
            'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
            'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
            'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
            'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
      'rp': {'rp': true, 'rt': true},
      'rt': {'rp': true, 'rt': true},
      'tbody': {'tbody': true, 'tfoot': true},
      'td': {'td': true, 'th': true},
      'tfoot': {'tbody': true},
      'th': {'td': true, 'th': true},
      'thead': {'tbody': true, 'tfoot': true},
      'tr': {'tr': true}
    },
    doNotIndent: {"pre": true},
    allowUnquoted: true,
    allowMissing: true,
    caseFold: true
  } : {
    autoSelfClosers: {},
    implicitlyClosed: {},
    contextGrabbers: {},
    doNotIndent: {},
    allowUnquoted: false,
    allowMissing: false,
    caseFold: false
  };
  var alignCDATA = parserConfig.alignCDATA;

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    };
  }
  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (Kludges.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!Kludges.contextGrabbers.hasOwnProperty(parentTagName) ||
          !Kludges.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          Kludges.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if (state.context && state.context.tagName == tagName) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          Kludges.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!Kludges.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && Kludges.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function() {
      return {tokenize: inText,
              state: baseState,
              indented: 0,
              tagName: null, tagStart: null,
              context: null};
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (multilineTagIndentPastTag)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * multilineTagIndentFactor;
      }
      if (alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (Kludges.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = Kludges.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: parserConfig.htmlMode ? "html" : "xml",
    helperType: parserConfig.htmlMode ? "html" : "xml"
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]+/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if ((ch == "u" && stream.match(/rl(-prefix)?\(/)) ||
               (ch == "d" && stream.match("omain(")) ||
               (ch == "r" && stream.match("egexp("))) {
      stream.backUp(1);
      state.tokenize = tokenParenthesized;
      return ret("property", "word");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = "string-2";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = "string-2";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
          cx = cx.prev;
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i]] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backface-visibility",
    "background", "background-attachment", "background-clip", "background-color",
    "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
    "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end",
    "grid-column-start", "grid-row", "grid-row-end", "grid-row-start",
    "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marker-offset", "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
    "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
    "shape-outside", "size", "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "word-break",
    "word-spacing", "word-wrap", "z-index",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "text-anchor", "writing-mode"
  ], propertyKeywords = keySet(propertyKeywords_);

  var nonStandardPropertyKeywords_ = [
    "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
    "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
    "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
    "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
    "searchfield-results-decoration", "zoom"
  ], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

  var fontProperties_ = [
    "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
    "font-stretch", "font-weight", "font-style"
  ], fontProperties = keySet(fontProperties_);

  var counterDescriptors_ = [
    "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
    "speak-as", "suffix", "symbols", "system"
  ], counterDescriptors = keySet(counterDescriptors_);

  var colorKeywords_ = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ], colorKeywords = keySet(colorKeywords_);

  var valueKeywords_ = [
    "above", "absolute", "activeborder", "additive", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "column", "column-reverse", "compact", "condensed", "contain", "content",
    "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "cyclic", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari",
    "disc", "discard", "disclosure-closed", "disclosure-open", "document",
    "dot-dash", "dot-dot-dash",
    "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
    "ethiopic-numeric", "ew-resize", "expanded", "extends", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-flex", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
    "katakana", "katakana-iroha", "keep-all", "khmer",
    "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
    "landscape", "lao", "large", "larger", "left", "level", "lighter",
    "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "malayalam", "match", "matrix", "matrix3d",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
    "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
    "progress", "push-button", "radial-gradient", "radio", "read-only",
    "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeating-linear-gradient",
    "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
    "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
    "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "scale", "scale3d", "scaleX", "scaleY", "scaleZ",
    "scroll", "scrollbar", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "tamil",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "trad-chinese-formal", "trad-chinese-informal",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ], valueKeywords = keySet(valueKeywords_);

  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
    .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
    .concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/))
          return [null, "{"];
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});
/**
 * angular-ui-codemirror - This directive allows you to add CodeMirror to your textarea elements.
 * @version v0.3.0 - 2015-05-03
 * @link http://angular-ui.github.com
 * @license MIT
 */
"use strict";function uiCodemirrorDirective(a,b){function c(a,c,h,i){var j=angular.extend({value:c.text()},b.codemirror||{},a.$eval(h.uiCodemirror),a.$eval(h.uiCodemirrorOpts)),k=d(c,j);e(k,h.uiCodemirror||h.uiCodemirrorOpts,a),f(k,i,a),g(k,h.uiRefresh,a),a.$on("CodeMirror",function(a,b){if(!angular.isFunction(b))throw new Error("the CodeMirror event requires a callback function");b(k)}),angular.isFunction(j.onLoad)&&j.onLoad(k)}function d(a,b){var c;return"TEXTAREA"===a[0].tagName?c=window.CodeMirror.fromTextArea(a[0],b):(a.html(""),c=new window.CodeMirror(function(b){a.append(b)},b)),c}function e(a,b,c){function d(b,c){angular.isObject(b)&&e.forEach(function(d){if(b.hasOwnProperty(d)){if(c&&b[d]===c[d])return;a.setOption(d,b[d])}})}if(b){var e=Object.keys(window.CodeMirror.defaults);c.$watch(b,d,!0)}}function f(a,b,c){b&&(b.$formatters.push(function(a){if(angular.isUndefined(a)||null===a)return"";if(angular.isObject(a)||angular.isArray(a))throw new Error("ui-codemirror cannot use an object or an array as a model");return a}),b.$render=function(){var c=b.$viewValue||"";a.setValue(c)},a.on("change",function(a){var d=a.getValue();d!==b.$viewValue&&c.$evalAsync(function(){b.$setViewValue(d)})}))}function g(b,c,d){c&&d.$watch(c,function(c,d){c!==d&&a(function(){b.refresh()})})}return{restrict:"EA",require:"?ngModel",compile:function(){if(angular.isUndefined(window.CodeMirror))throw new Error("ui-codemirror needs CodeMirror to work... (o rly?)");return c}}}angular.module("ui.codemirror",[]).constant("uiCodemirrorConfig",{}).directive("uiCodemirror",uiCodemirrorDirective),uiCodemirrorDirective.$inject=["$timeout","uiCodemirrorConfig"];!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.Clipboard=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){var d=a("closest"),e=a("component-event"),f=["focus","blur"];c.bind=function(a,b,c,g,h){return-1!==f.indexOf(c)&&(h=!0),e.bind(a,c,function(c){var e=c.target||c.srcElement;c.delegateTarget=d(e,b,!0,a),c.delegateTarget&&g.call(a,c)},h)},c.unbind=function(a,b,c,d){-1!==f.indexOf(b)&&(d=!0),e.unbind(a,b,c,d)}},{closest:2,"component-event":4}],2:[function(a,b,c){var d=a("matches-selector");b.exports=function(a,b,c){for(var e=c?a:a.parentNode;e&&e!==document;){if(d(e,b))return e;e=e.parentNode}}},{"matches-selector":3}],3:[function(a,b,c){function d(a,b){if(f)return f.call(a,b);for(var c=a.parentNode.querySelectorAll(b),d=0;d<c.length;++d)if(c[d]==a)return!0;return!1}var e=Element.prototype,f=e.matchesSelector||e.webkitMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector;b.exports=d},{}],4:[function(a,b,c){var d=window.addEventListener?"addEventListener":"attachEvent",e=window.removeEventListener?"removeEventListener":"detachEvent",f="addEventListener"!==d?"on":"";c.bind=function(a,b,c,e){return a[d](f+b,c,e||!1),c},c.unbind=function(a,b,c,d){return a[e](f+b,c,d||!1),c}},{}],5:[function(a,b,c){function d(){}d.prototype={on:function(a,b,c){var d=this.e||(this.e={});return(d[a]||(d[a]=[])).push({fn:b,ctx:c}),this},once:function(a,b,c){var d=this,e=function(){d.off(a,e),b.apply(c,arguments)};return this.on(a,e,c)},emit:function(a){var b=[].slice.call(arguments,1),c=((this.e||(this.e={}))[a]||[]).slice(),d=0,e=c.length;for(d;e>d;d++)c[d].fn.apply(c[d].ctx,b);return this},off:function(a,b){var c=this.e||(this.e={}),d=c[a],e=[];if(d&&b)for(var f=0,g=d.length;g>f;f++)d[f].fn!==b&&e.push(d[f]);return e.length?c[a]=e:delete c[a],this}},b.exports=d},{}],6:[function(a,b,c){"use strict";function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}c.__esModule=!0;var e=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),f=function(){function a(b){d(this,a),this.resolveOptions(b),this.initSelection()}return a.prototype.resolveOptions=function(){var a=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action=a.action,this.emitter=a.emitter,this.target=a.target,this.text=a.text,this.trigger=a.trigger,this.selectedText=""},a.prototype.initSelection=function(){if(this.text&&this.target)throw new Error('Multiple attributes declared, use either "target" or "text"');if(this.text)this.selectFake();else{if(!this.target)throw new Error('Missing required attributes, use either "target" or "text"');this.selectTarget()}},a.prototype.selectFake=function(){var a=this;this.removeFake(),this.fakeHandler=document.body.addEventListener("click",function(){return a.removeFake()}),this.fakeElem=document.createElement("input"),this.fakeElem.style.position="absolute",this.fakeElem.style.left="-9999px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.selectedText=this.text,document.body.appendChild(this.fakeElem),this.fakeElem.select(),this.copyText()},a.prototype.removeFake=function(){this.fakeHandler&&(document.body.removeEventListener("click"),this.fakeHandler=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)},a.prototype.selectTarget=function(){if("INPUT"===this.target.nodeName||"TEXTAREA"===this.target.nodeName)this.target.select(),this.selectedText=this.target.value;else{var a=document.createRange(),b=window.getSelection();a.selectNodeContents(this.target),b.addRange(a),this.selectedText=b.toString()}this.copyText()},a.prototype.copyText=function(){var a=void 0;try{a=document.execCommand(this.action)}catch(b){a=!1}this.handleResult(a)},a.prototype.handleResult=function(a){a?this.emitter.emit("success",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)}):this.emitter.emit("error",{action:this.action,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})},a.prototype.clearSelection=function(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()},e(a,[{key:"action",set:function(){var a=arguments.length<=0||void 0===arguments[0]?"copy":arguments[0];if(this._action=a,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(a){if(void 0!==a){if(!a||"object"!=typeof a||1!==a.nodeType)throw new Error('Invalid "target" value, use a valid Element');this._target=a}},get:function(){return this._target}}]),a}();c["default"]=f,b.exports=c["default"]},{}],7:[function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}c.__esModule=!0;var g=a("./clipboard-action"),h=d(g),i=a("delegate-events"),j=d(i),k=a("tiny-emitter"),l=d(k),m="data-clipboard-",n=function(a){function b(c,d){e(this,b),a.call(this),this.resolveOptions(d),this.delegateClick(c)}return f(b,a),b.prototype.resolveOptions=function(){var a=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action="function"==typeof a.action?a.action:this.setAction,this.target="function"==typeof a.target?a.target:this.setTarget,this.text="function"==typeof a.text?a.text:this.setText},b.prototype.delegateClick=function(a){var b=this;j["default"].bind(document.body,a,"click",function(a){return b.initialize(a)})},b.prototype.initialize=function(a){this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new h["default"]({action:this.action(a.delegateTarget),target:this.target(a.delegateTarget),text:this.text(a.delegateTarget),trigger:a.delegateTarget,emitter:this})},b.prototype.setAction=function(a){return a.hasAttribute(m+"action")?a.getAttribute(m+"action"):void 0},b.prototype.setTarget=function(a){if(a.hasAttribute(m+"target")){var b=a.getAttribute(m+"target");return document.querySelector(b)}},b.prototype.setText=function(a){return a.hasAttribute(m+"text")?a.getAttribute(m+"text"):void 0},b}(l["default"]);c["default"]=n,b.exports=c["default"]},{"./clipboard-action":6,"delegate-events":1,"tiny-emitter":5}]},{},[7])(7)});/*
 *
 * https://github.com/fatlinesofcode/ngDraggable
 */
angular.module("ngDraggable", [])
    .service('ngDraggable', [function() {


        var scope = this;
        scope.inputEvent = function(event) {
            if (angular.isDefined(event.touches)) {
                return event.touches[0];
            }
            //Checking both is not redundent. If only check if touches isDefined, angularjs isDefnied will return error and stop the remaining scripty if event.originalEvent is not defined.
            else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
                return event.originalEvent.touches[0];
            }
            return event;
        };

    }])
    .directive('ngDrag', ['$rootScope', '$parse', '$document', '$window', 'ngDraggable', function ($rootScope, $parse, $document, $window, ngDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.ngDrag;
                var offset,_centerAnchor=false,_mx,_my,_tx,_ty,_mrx,_mry;
                var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
                var _pressEvents = 'touchstart mousedown';
                var _moveEvents = 'touchmove mousemove';
                var _releaseEvents = 'touchend mouseup';
                var _dragHandle;

                // to identify the element in order to prevent getting superflous events when a single element has both drag and drop directives on it.
                var _myid = scope.$id;
                var _data = null;

                var _dragOffset = null;

                var _dragEnabled = false;

                var _pressTimer = null;

                var onDragStartCallback = $parse(attrs.ngDragStart) || null;
                var onDragStopCallback = $parse(attrs.ngDragStop) || null;
                var onDragSuccessCallback = $parse(attrs.ngDragSuccess) || null;
                var allowTransform = angular.isDefined(attrs.allowTransform) ? scope.$eval(attrs.allowTransform) : true;

                var getDragData = $parse(attrs.ngDragData);

                // deregistration function for mouse move events in $rootScope triggered by jqLite trigger handler
                var _deregisterRootMoveListener = angular.noop;

                var initialize = function () {
                    element.attr('draggable', 'false'); // prevent native drag
                    // check to see if drag handle(s) was specified
                    // if querySelectorAll is available, we use this instead of find
                    // as JQLite find is limited to tagnames
                    if (element[0].querySelectorAll) {
                        var dragHandles = angular.element(element[0].querySelectorAll('[ng-drag-handle]'));
                    } else {
                        var dragHandles = element.find('[ng-drag-handle]');
                    }
                    if (dragHandles.length) {
                        _dragHandle = dragHandles;
                    }
                    toggleListeners(true);
                };

                var toggleListeners = function (enable) {
                    if (!enable)return;
                    // add listeners.

                    scope.$on('$destroy', onDestroy);
                    scope.$watch(attrs.ngDrag, onEnableChange);
                    scope.$watch(attrs.ngCenterAnchor, onCenterAnchor);
                    // wire up touch events
                    if (_dragHandle) {
                        // handle(s) specified, use those to initiate drag
                        _dragHandle.on(_pressEvents, onpress);
                    } else {
                        // no handle(s) specified, use the element as the handle
                        element.on(_pressEvents, onpress);
                    }
                    if(! _hasTouch && element[0].nodeName.toLowerCase() == "img"){
                        element.on('mousedown', function(){ return false;}); // prevent native drag for images
                    }
                };
                var onDestroy = function (enable) {
                    toggleListeners(false);
                };
                var onEnableChange = function (newVal, oldVal) {
                    _dragEnabled = (newVal);
                };
                var onCenterAnchor = function (newVal, oldVal) {
                    if(angular.isDefined(newVal))
                        _centerAnchor = (newVal || 'true');
                };

                var isClickableElement = function (evt) {
                    return (
                        angular.isDefined(angular.element(evt.target).attr("ng-cancel-drag"))
                    );
                };
                /*
                 * When the element is clicked start the drag behaviour
                 * On touch devices as a small delay so as not to prevent native window scrolling
                 */
                var onpress = function(evt) {
                    if(! _dragEnabled)return;

                    if (isClickableElement(evt)) {
                        return;
                    }

                    if (evt.type == "mousedown" && evt.button != 0) {
                        // Do not start dragging on right-click
                        return;
                    }

                    if(_hasTouch){
                        cancelPress();
                        _pressTimer = setTimeout(function(){
                            cancelPress();
                            onlongpress(evt);
                        },100);
                        $document.on(_moveEvents, cancelPress);
                        $document.on(_releaseEvents, cancelPress);
                    }else{
                        onlongpress(evt);
                    }

                };

                var cancelPress = function() {
                    clearTimeout(_pressTimer);
                    $document.off(_moveEvents, cancelPress);
                    $document.off(_releaseEvents, cancelPress);
                };

                var onlongpress = function(evt) {
                    if(! _dragEnabled)return;
                    evt.preventDefault();

                    offset = element[0].getBoundingClientRect();
                    if(allowTransform)
                        _dragOffset = offset;
                    else{
                        _dragOffset = {left:document.body.scrollLeft, top:document.body.scrollTop};
                    }


                    element.centerX = element[0].offsetWidth / 2;
                    element.centerY = element[0].offsetHeight / 2;

                    _mx = ngDraggable.inputEvent(evt).pageX;//ngDraggable.getEventProp(evt, 'pageX');
                    _my = ngDraggable.inputEvent(evt).pageY;//ngDraggable.getEventProp(evt, 'pageY');
                    _mrx = _mx - offset.left;
                    _mry = _my - offset.top;
                    if (_centerAnchor) {
                        _tx = _mx - element.centerX - $window.pageXOffset;
                        _ty = _my - element.centerY - $window.pageYOffset;
                    } else {
                        _tx = _mx - _mrx - $window.pageXOffset;
                        _ty = _my - _mry - $window.pageYOffset;
                    }

                    $document.on(_moveEvents, onmove);
                    $document.on(_releaseEvents, onrelease);
                    // This event is used to receive manually triggered mouse move events
                    // jqLite unfortunately only supports triggerHandler(...)
                    // See http://api.jquery.com/triggerHandler/
                    // _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', onmove);
                    _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', function(event, origEvent) {
                        onmove(origEvent);
                    });
                };

                var onmove = function (evt) {
                    if (!_dragEnabled)return;
                    evt.preventDefault();

                    if (!element.hasClass('dragging')) {
                        _data = getDragData(scope);
                        element.addClass('dragging');
                        $rootScope.$broadcast('draggable:start', {x:_mx, y:_my, tx:_tx, ty:_ty, event:evt, element:element, data:_data});

                        if (onDragStartCallback ){
                            scope.$apply(function () {
                                onDragStartCallback(scope, {$data: _data, $event: evt});
                            });
                        }
                    }

                    _mx = ngDraggable.inputEvent(evt).pageX;//ngDraggable.getEventProp(evt, 'pageX');
                    _my = ngDraggable.inputEvent(evt).pageY;//ngDraggable.getEventProp(evt, 'pageY');

                    if (_centerAnchor) {
                        _tx = _mx - element.centerX - _dragOffset.left;
                        _ty = _my - element.centerY - _dragOffset.top;
                    } else {
                        _tx = _mx - _mrx - _dragOffset.left;
                        _ty = _my - _mry - _dragOffset.top;
                    }

                    moveElement(_tx, _ty);

                    $rootScope.$broadcast('draggable:move', { x: _mx, y: _my, tx: _tx, ty: _ty, event: evt, element: element, data: _data, uid: _myid, dragOffset: _dragOffset });
                };

                var onrelease = function(evt) {
                    if (!_dragEnabled)
                        return;
                    evt.preventDefault();
                    $rootScope.$broadcast('draggable:end', {x:_mx, y:_my, tx:_tx, ty:_ty, event:evt, element:element, data:_data, callback:onDragComplete, uid: _myid});
                    element.removeClass('dragging');
                    element.parent().find('.drag-enter').removeClass('drag-enter');
                    reset();
                    $document.off(_moveEvents, onmove);
                    $document.off(_releaseEvents, onrelease);

                    if (onDragStopCallback ){
                        scope.$apply(function () {
                            onDragStopCallback(scope, {$data: _data, $event: evt});
                        });
                    }

                    _deregisterRootMoveListener();
                };

                var onDragComplete = function(evt) {


                    if (!onDragSuccessCallback )return;

                    scope.$apply(function () {
                        onDragSuccessCallback(scope, {$data: _data, $event: evt});
                    });
                };

                var reset = function() {
                    if(allowTransform)
                        element.css({transform:'', 'z-index':'', '-webkit-transform':'', '-ms-transform':''});
                    else
                        element.css({'position':'',top:'',left:''});
                };

                var moveElement = function (x, y) {
                    if(allowTransform) {
                        element.css({
                            transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                            'z-index': 99999,
                            '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                            '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
                        });
                    }else{
                        element.css({'left':x+'px','top':y+'px', 'position':'fixed'});
                    }
                };
                initialize();
            }
        };
    }])

    .directive('ngDrop', ['$parse', '$timeout', '$window', '$document', 'ngDraggable', function ($parse, $timeout, $window, $document, ngDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.ngDrop;
                scope.isTouching = false;

                var _lastDropTouch=null;

                var _myid = scope.$id;

                var _dropEnabled=false;

                var onDropCallback = $parse(attrs.ngDropSuccess);// || function(){};

                var onDragStartCallback = $parse(attrs.ngDragStart);
                var onDragStopCallback = $parse(attrs.ngDragStop);
                var onDragMoveCallback = $parse(attrs.ngDragMove);

                var initialize = function () {
                    toggleListeners(true);
                };

                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    scope.$watch(attrs.ngDrop, onEnableChange);
                    scope.$on('$destroy', onDestroy);
                    scope.$on('draggable:start', onDragStart);
                    scope.$on('draggable:move', onDragMove);
                    scope.$on('draggable:end', onDragEnd);
                };

                var onDestroy = function (enable) {
                    toggleListeners(false);
                };
                var onEnableChange = function (newVal, oldVal) {
                    _dropEnabled=newVal;
                };
                var onDragStart = function(evt, obj) {
                    if(! _dropEnabled)return;
                    isTouching(obj.x,obj.y,obj.element);

                    if (attrs.ngDragStart) {
                        $timeout(function(){
                            onDragStartCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };
                var onDragMove = function(evt, obj) {
                    if(! _dropEnabled)return;
                    isTouching(obj.x,obj.y,obj.element);

                    if (attrs.ngDragMove) {
                        $timeout(function(){
                            onDragMoveCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };

                var onDragEnd = function (evt, obj) {

                    // don't listen to drop events if this is the element being dragged
                    // only update the styles and return
                    if (!_dropEnabled || _myid === obj.uid) {
                        updateDragStyles(false, obj.element);
                        return;
                    }
                    if (isTouching(obj.x, obj.y, obj.element)) {
                        // call the ngDraggable ngDragSuccess element callback
                        if(obj.callback){
                            obj.callback(obj);
                        }

                        if (attrs.ngDropSuccess) {
                            $timeout(function(){
                                onDropCallback(scope, {$data: obj.data, $event: obj, $target: scope.$eval(scope.value)});
                            });
                        }
                    }

                    if (attrs.ngDragStop) {
                        $timeout(function(){
                            onDragStopCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }

                    updateDragStyles(false, obj.element);
                };

                var isTouching = function(mouseX, mouseY, dragElement) {
                    var touching= hitTest(mouseX, mouseY);
                    scope.isTouching = touching;
                    if(touching){
                        _lastDropTouch = element;
                    }
                    updateDragStyles(touching, dragElement);
                    return touching;
                };

                var updateDragStyles = function(touching, dragElement) {
                    if(touching){
                        element.addClass('drag-enter');
                        dragElement.addClass('drag-over');
                    }else if(_lastDropTouch == element){
                        _lastDropTouch=null;
                        element.removeClass('drag-enter');
                        dragElement.removeClass('drag-over');
                    }
                };

                var hitTest = function(x, y) {
                    var bounds = element[0].getBoundingClientRect();// ngDraggable.getPrivOffset(element);
                    x -= $document[0].body.scrollLeft + $document[0].documentElement.scrollLeft;
                    y -= $document[0].body.scrollTop + $document[0].documentElement.scrollTop;
                    return  x >= bounds.left
                        && x <= bounds.right
                        && y <= bounds.bottom
                        && y >= bounds.top;
                };

                initialize();
            }
        };
    }])
    .directive('ngDragClone', ['$parse', '$timeout', 'ngDraggable', function ($parse, $timeout, ngDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var img, _allowClone=true;
                var _dragOffset = null;
                scope.clonedData = {};
                var initialize = function () {

                    img = element.find('img');
                    element.attr('draggable', 'false');
                    img.attr('draggable', 'false');
                    reset();
                    toggleListeners(true);
                };


                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    scope.$on('draggable:start', onDragStart);
                    scope.$on('draggable:move', onDragMove);
                    scope.$on('draggable:end', onDragEnd);
                    preventContextMenu();

                };
                var preventContextMenu = function() {
                    //  element.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                    img.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                    //  element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                    img.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                };
                var onDragStart = function(evt, obj, elm) {
                    _allowClone=true;
                    if(angular.isDefined(obj.data.allowClone)){
                        _allowClone=obj.data.allowClone;
                    }
                    if(_allowClone) {
                        scope.$apply(function () {
                            scope.clonedData = obj.data;
                        });
                        element.css('width', obj.element[0].offsetWidth);
                        element.css('height', obj.element[0].offsetHeight);

                        moveElement(obj.tx, obj.ty);
                    }

                };
                var onDragMove = function(evt, obj) {
                    if(_allowClone) {

                        _tx = obj.tx + obj.dragOffset.left;
                        _ty = obj.ty + obj.dragOffset.top;

                        moveElement(_tx, _ty);
                    }
                };
                var onDragEnd = function(evt, obj) {
                    //moveElement(obj.tx,obj.ty);
                    if(_allowClone) {
                        reset();
                    }
                };

                var reset = function() {
                    element.css({left:0,top:0, position:'fixed', 'z-index':-1, visibility:'hidden'});
                };
                var moveElement = function(x,y) {
                    element.css({
                        transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+x+', '+y+', 0, 1)', 'z-index': 99999, 'visibility': 'visible',
                        '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+x+', '+y+', 0, 1)',
                        '-ms-transform': 'matrix(1, 0, 0, 1, '+x+', '+y+')'
                        //,margin: '0'  don't monkey with the margin,
                    });
                };

                var absorbEvent_ = function (event) {
                    var e = event;//.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                };

                initialize();
            }
        };
    }])
    .directive('ngPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var initialize = function () {

                    element.attr('draggable', 'false');
                    toggleListeners(true);
                };


                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                };


                var absorbEvent_ = function (event) {
                    var e = event.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                };

                initialize();
            }
        };
    }])
    .directive('ngCancelDrag', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.find('*').attr('ng-cancel-drag', 'ng-cancel-drag');
            }
        };
    }])
    .directive('ngDragScroll', ['$window', '$interval', '$timeout', '$document', '$rootScope', function($window, $interval, $timeout, $document, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var intervalPromise = null;
                var lastMouseEvent = null;

                var config = {
                    verticalScroll: attrs.verticalScroll || true,
                    horizontalScroll: attrs.horizontalScroll || true,
                    activationDistance: attrs.activationDistance || 75,
                    scrollDistance: attrs.scrollDistance || 15
                };


                var reqAnimFrame = (function() {
                    return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();

                var animationIsOn = false;
                var createInterval = function() {
                    animationIsOn = true;

                    function nextFrame(callback) {
                        var args = Array.prototype.slice.call(arguments);
                        if(animationIsOn) {
                            reqAnimFrame(function () {
                                $rootScope.$apply(function () {
                                    callback.apply(null, args);
                                    nextFrame(callback);
                                });
                            })
                        }
                    }

                    nextFrame(function() {
                        if (!lastMouseEvent) return;

                        var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                        var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                        var scrollX = 0;
                        var scrollY = 0;

                        if (config.horizontalScroll) {
                            // If horizontal scrolling is active.
                            if (lastMouseEvent.clientX < config.activationDistance) {
                                // If the mouse is on the left of the viewport within the activation distance.
                                scrollX = -config.scrollDistance;
                            }
                            else if (lastMouseEvent.clientX > viewportWidth - config.activationDistance) {
                                // If the mouse is on the right of the viewport within the activation distance.
                                scrollX = config.scrollDistance;
                            }
                        }

                        if (config.verticalScroll) {
                            // If vertical scrolling is active.
                            if (lastMouseEvent.clientY < config.activationDistance) {
                                // If the mouse is on the top of the viewport within the activation distance.
                                scrollY = -config.scrollDistance;
                            }
                            else if (lastMouseEvent.clientY > viewportHeight - config.activationDistance) {
                                // If the mouse is on the bottom of the viewport within the activation distance.
                                scrollY = config.scrollDistance;
                            }
                        }



                        if (scrollX !== 0 || scrollY !== 0) {
                            // Record the current scroll position.
                            var currentScrollLeft = ($window.pageXOffset || $document[0].documentElement.scrollLeft);
                            var currentScrollTop = ($window.pageYOffset || $document[0].documentElement.scrollTop);

                            // Remove the transformation from the element, scroll the window by the scroll distance
                            // record how far we scrolled, then reapply the element transformation.
                            var elementTransform = element.css('transform');
                            element.css('transform', 'initial');

                            $window.scrollBy(scrollX, scrollY);

                            var horizontalScrollAmount = ($window.pageXOffset || $document[0].documentElement.scrollLeft) - currentScrollLeft;
                            var verticalScrollAmount =  ($window.pageYOffset || $document[0].documentElement.scrollTop) - currentScrollTop;

                            element.css('transform', elementTransform);

                            lastMouseEvent.pageX += horizontalScrollAmount;
                            lastMouseEvent.pageY += verticalScrollAmount;

                            $rootScope.$emit('draggable:_triggerHandlerMove', lastMouseEvent);
                        }

                    });
                };

                var clearInterval = function() {
                    animationIsOn = false;
                };

                scope.$on('draggable:start', function(event, obj) {
                    // Ignore this event if it's not for this element.
                    if (obj.element[0] !== element[0]) return;

                    if (!animationIsOn) createInterval();
                });

                scope.$on('draggable:end', function(event, obj) {
                    // Ignore this event if it's not for this element.
                    if (obj.element[0] !== element[0]) return;

                    if (animationIsOn) clearInterval();
                });

                scope.$on('draggable:move', function(event, obj) {
                    // Ignore this event if it's not for this element.
                    if (obj.element[0] !== element[0]) return;

                    lastMouseEvent = obj.event;
                });
            }
        };
    }]);
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
/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("select2/compat/utils",["jquery"],function(a){function b(b,c,d){var e,f,g=[];e=a.trim(b.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0===this.indexOf("select2-")&&g.push(this)})),e=a.trim(c.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&(f=d(this),null!=f&&g.push(f))})),b.attr("class",g.join(" "))}return{syncCssClasses:b}}),b.define("select2/compat/containerCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("containerCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptContainerCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("containerCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/dropdownCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("dropdownCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptDropdownCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("dropdownCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/initSelection",["jquery"],function(a){function b(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=c.get("initSelection"),this._isInitialized=!1,a.call(this,b,c)}return b.prototype.current=function(b,c){var d=this;return this._isInitialized?void b.call(this,c):void this.initSelection.call(null,this.$element,function(b){d._isInitialized=!0,a.isArray(b)||(b=[b]),c(b)})},b}),b.define("select2/compat/inputData",["jquery"],function(a){function b(a,b,c){this._currentData=[],this._valueSeparator=c.get("valueSeparator")||",","hidden"===b.prop("type")&&c.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),a.call(this,b,c)}return b.prototype.current=function(b,c){function d(b,c){var e=[];return b.selected||-1!==a.inArray(b.id,c)?(b.selected=!0,e.push(b)):b.selected=!1,b.children&&e.push.apply(e,d(b.children,c)),e}for(var e=[],f=0;f<this._currentData.length;f++){var g=this._currentData[f];e.push.apply(e,d(g,this.$element.val().split(this._valueSeparator)))}c(e)},b.prototype.select=function(b,c){if(this.options.get("multiple")){var d=this.$element.val();d+=this._valueSeparator+c.id,this.$element.val(d),this.$element.trigger("change")}else this.current(function(b){a.map(b,function(a){a.selected=!1})}),this.$element.val(c.id),this.$element.trigger("change")},b.prototype.unselect=function(a,b){var c=this;b.selected=!1,this.current(function(a){for(var d=[],e=0;e<a.length;e++){var f=a[e];b.id!=f.id&&d.push(f.id)}c.$element.val(d.join(c._valueSeparator)),c.$element.trigger("change")})},b.prototype.query=function(a,b,c){for(var d=[],e=0;e<this._currentData.length;e++){var f=this._currentData[e],g=this.matches(b,f);null!==g&&d.push(g)}c({results:d})},b.prototype.addOptions=function(b,c){var d=a.map(c,function(b){return a.data(b[0],"data")});this._currentData.push.apply(this._currentData,d)},b}),b.define("select2/compat/matcher",["jquery"],function(a){function b(b){function c(c,d){var e=a.extend(!0,{},d);if(null==c.term||""===a.trim(c.term))return e;if(d.children){for(var f=d.children.length-1;f>=0;f--){var g=d.children[f],h=b(c.term,g.text,g);h||e.children.splice(f,1)}if(e.children.length>0)return e}return b(c.term,d.text,d)?e:null}return c}return b}),b.define("select2/compat/query",[],function(){function a(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),a.call(this,b,c)}return a.prototype.query=function(a,b,c){b.callback=c;var d=this.options.get("query");d.call(null,b)},a}),b.define("select2/dropdown/attachContainer",[],function(){function a(a,b,c){a.call(this,b,c)}return a.prototype.position=function(a,b,c){var d=c.find(".dropdown-wrapper");d.append(b),b.addClass("select2-dropdown--below"),c.addClass("select2-container--below")},a}),b.define("select2/dropdown/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$dropdown.on(d.join(" "),function(a){a.stopPropagation()})},a}),b.define("select2/selection/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$selection.on(d.join(" "),function(a){a.stopPropagation()})},a}),function(c){"function"==typeof b.define&&b.define.amd?b.define("jquery-mousewheel",["jquery"],c):"object"==typeof exports?module.exports=c:c(a)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});// Generated by LiveScript 1.3.1
angular.module('plotDB', ['backend', 'ui.codemirror', 'ngDraggable', 'ldColorPicker']);// Generated by LiveScript 1.3.1
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
      clientID: '1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com'
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
var x$;
x$ = angular.module('plotDB');
x$.service('IOService', ['$rootScope', '$http'].concat(function($rootScope, $http){
  var aux, ret;
  aux = {
    usedkey: {},
    localkey: function(){
      return (Math.random().toString(36) + "").substring(2);
    },
    saveLocally: function(item, res, rej){
      var list, i$, i, key;
      list = JSON.parse(localStorage.getItem("/db/list/" + item._type.name)) || [];
      if (!item.key) {
        for (i$ = 0; i$ <= 10; ++i$) {
          i = i$;
          key = this.localkey();
          if (i === 10 || (!in$(key, list) && !this.usedkey[key])) {
            break;
          }
        }
        if (i === 10) {
          return rej([true, "generate local key failed"]);
        }
        item.key = key;
        this.usedkey[key] = true;
      }
      if (item.key && !in$(item.key, list)) {
        list.push(item.key);
      }
      item[!item.createdtime ? "createdtime" : "modifiedtime"] = new Date().getTime();
      localStorage.setItem("/db/list/" + item._type.name, angular.toJson(list));
      localStorage.setItem("/db/" + item._type.name + "/" + item.key, angular.toJson(item));
      return res(item);
    },
    saveRemotely: function(item, res, rej){
      var config;
      item[!item.createdtime ? "createdtime" : "modifiedtime"] = new Date().getTime();
      config = import$({
        data: item
      }, item.key
        ? {
          url: "/d/" + item._type.name + "/" + item.key,
          method: 'PUT'
        }
        : {
          url: "/d/" + item._type.name,
          method: 'POST'
        });
      return $http(config).success(function(ret){
        return res(ret);
      }).error(function(d, status){
        return rej([true, d, status]);
      });
    },
    loadLocally: function(_type, key, res, rej){
      var ret;
      ret = JSON.parse(localStorage.getItem("/db/" + _type.name + "/" + key));
      if (ret) {
        return res((ret._type = _type, ret));
      } else {
        return rej([true, "no such item"]);
      }
    },
    loadRemotely: function(_type, key, res, rej){
      var config;
      config = {
        url: "/d/" + _type.name + "/" + key,
        method: 'GET'
      };
      return $http(config).success(function(ret){
        return res((ret._type = _type, ret));
      }).error(function(d){
        return rej([true, d.toString()]);
      });
    },
    deleteLocally: function(_type, key, res, rej){
      var list;
      list = JSON.parse(localStorage.getItem("/db/list/" + _type.name)) || [];
      if (!in$(key, list)) {
        return rej([true, "no such item"]);
      }
      list = list.filter(function(it){
        return it !== key;
      });
      localStorage.setItem("/db/list/" + _type.name, angular.toJson(list));
      localStorage.setItem("/db/" + _type.name + "/" + key, null);
      return res();
    },
    deleteRemotely: function(_type, key, res, rej){
      var config;
      config = {
        url: "/d/" + _type.name + "/" + key,
        method: 'DELETE'
      };
      return $http(config).success(function(ret){
        return res(ret);
      }).error(function(d){
        d == null && (d = "");
        return rej([true, d.toString()]);
      });
    },
    verifyType: function(item){
      if (!item || !item._type || typeof item._type !== 'object') {
        return true;
      }
      if (!item._type.name || !item._type.location) {
        return true;
      }
      return false;
    }
  };
  return ret = {
    aux: aux,
    save: function(item){
      var this$ = this;
      return new Promise(function(res, rej){
        if (aux.verifyType(item)) {
          return rej([true, "type incorrect"]);
        }
        if (item._type.location === 'local') {
          return aux.saveLocally(item, res, rej);
        } else if (item._type.location === 'server') {
          return aux.saveRemotely(item, res, rej);
        } else {
          return rej([true, "not support type"]);
        }
      });
    },
    load: function(_type, key){
      var this$ = this;
      return new Promise(function(res, rej){
        if (aux.verifyType({
          _type: _type
        })) {
          return rej([true, "type incorrect"]);
        }
        if (_type.location === 'local') {
          return aux.loadLocally(_type, key, res, rej);
        } else if (_type.location === 'server') {
          return aux.loadRemotely(_type, key, res, rej);
        } else {
          return rej([true, "not support type"]);
        }
      });
    },
    listLocally: function(_type){
      return new Promise(function(res, rej){
        var list, ret, i$, len$, item, obj;
        list = JSON.parse(localStorage.getItem("/db/list/" + _type.name)) || [];
        ret = [];
        for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
          item = list[i$];
          obj = JSON.parse(localStorage.getItem("/db/" + _type.name + "/" + item));
          if (obj && obj.key) {
            ret.push(obj);
          }
        }
        return res(ret);
      });
    },
    listRemotely: function(_type, query){
      query == null && (query = null);
      return new Promise(function(res, rej){
        var k, v;
        query = typeof query === 'object' ? (function(){
          var ref$, results$ = [];
          for (k in ref$ = query) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).filter(function(it){
          return it[1];
        }).map(function(arg$){
          var k, v;
          k = arg$[0], v = arg$[1];
          return k + "=" + (Array.isArray(v) ? v.join(',') : v);
        }).join("&") : query;
        return $http({
          url: "/d/" + _type.name + (query ? '?' + query : ''),
          method: 'GET'
        }).success(function(ret){
          return res(ret);
        }).error(function(d){
          return rej([true, d.toString()]);
        });
      });
    }
    /*
    list: (_type, filter = {}) -> new Promise (res, rej) ~>
      if aux.verify-type({_type}) => return rej [true, "type incorrect"]
      if _type.location == \local => return aux.list-locally _type, res, rej
      else if _type.location == \server => return aux.list-remotely _type, res, rej
      else if _type.location == \any =>
        Promise.all [
          new Promise (res, rej) -> aux.list-locally _type, res, rej
          new Promise (res, rej) -> aux.list-remotely _type, res, rej
        ] .then (ret) -> res ret.0 ++ ret.1
      else return rej [true, "not support type"]
    */,
    'delete': function(_type, key){
      var this$ = this;
      return new Promise(function(res, rej){
        if (!_type || !key) {
          return rej([true, "param not sufficient"]);
        }
        if (_type.location === 'local') {
          return aux.deleteLocally(_type, key, res, rej);
        } else if (_type.location === 'server') {
          return aux.deleteRemotely(_type, key, res, rej);
        } else {
          return rej([true, "not support type"]);
        }
      });
    },
    backup: function(item){
      var this$ = this;
      return new Promise(function(res, rej){
        var path, list, now, remains, i$, len$, p, timestamp, e;
        path = "/db/backup/" + item._type.name + "/" + item.key;
        list = JSON.parse(localStorage.getItem("/db/list/backups") || "[]");
        now = new Date().getTime();
        remains = [];
        for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
          p = list[i$];
          timestamp = JSON.parse(localstorage.getItem(p + "/timestamp") || 0);
          if (now - timestamp > 3600000) {
            localstorage.removeItem(p + "");
            localstorage.removeItem(p + "/timestamp");
          } else {
            remains.push(p);
          }
        }
        if (remains.indexOf(path) < 0) {
          remains.push(path);
        }
        try {
          localStorage.setItem(path + "", angular.toJson(item));
          localStorage.setItem(path + "/timestamp", angular.toJson(new Date().getTime()));
        } catch (e$) {
          e = e$;
          console.log(e);
        }
        return res();
      });
    },
    backups: function(item){
      var this$ = this;
      return new Promise(function(res, rej){
        var path, object, timestamp, e;
        path = "/db/backup/" + item._type.name + "/" + item.key;
        try {
          object = JSON.parse(localStorage.getItem(path + "") || "{}");
          timestamp = JSON.parse(localStorage.getItem(path + "/timestamp") || "0");
          return res(timestamp
            ? [{
              object: object,
              timestamp: timestamp
            }]
            : []);
        } catch (e$) {
          e = e$;
          console.error("failed to parse backups for " + item._type.location + " / " + item._type.name + " / " + item.key + ": \n" + e);
          return res([]);
        }
      });
    },
    cleanBackups: function(item){
      var this$ = this;
      return new Promise(function(res, rej){
        var path;
        path = "/db/backup/" + item._type.name + "/" + item.key;
        localStorage.setItem(path + "/count", "0");
        return res();
      });
    }
  };
}));
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.filter('tags', function(){
  return function(it){
    if (Array.isArray(it)) {
      return it;
    } else {
      return (it || "").split(',');
    }
  };
});
x$.filter('date', function(){
  return function(it){
    return new Date(it);
  };
});
x$.filter('timestamp', function(){
  return function(it){
    return new Date(it).getTime();
  };
});
x$.filter('datelite', function(){
  return function(it){
    var d;
    d = new Date(it);
    return (d.getYear() + 1900) + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
  };
});
x$.filter('length', function(){
  return function(it){
    var k;
    return (function(){
      var results$ = [];
      for (k in it) {
        results$.push(k);
      }
      return results$;
    }()).length;
  };
});
x$.filter('size', function(){
  return function(it){
    if (!it || isNaN(it)) {
      return '0B';
    }
    if (it < 1000) {
      return it + "B";
    } else if (it < 1048576) {
      return parseInt(it / 102.4) / 10 + "KB";
    } else {
      return parseInt(it / 104857.6) / 10 + "MB";
    }
  };
});
x$.directive('ngfile', ['$compile'].concat(function($compile){
  return {
    require: [],
    restrict: 'A',
    scope: {
      model: '=ngData'
    },
    link: function(s, e, a, c){
      var this$ = this;
      return e.on('change', function(){
        return s.$apply(function(){
          return s.model = e[0].files;
        });
      });
    }
  };
}));
x$.directive('ngselect2', ['$compile', 'entityService'].concat(function($compile, entityService){
  return {
    require: [],
    restrict: 'A',
    scope: {
      model: '=ngData',
      istag: '@istag',
      type: '@type',
      detail: '=ngDetail'
    },
    link: function(s, e, a, c){
      var changed, config, this$ = this;
      changed = function(){
        var ref$, cval, nval;
        ref$ = [s.model, $(e).val()], cval = ref$[0], nval = ref$[1];
        if (!Array.isArray(cval)) {
          return cval !== nval;
        }
        ref$ = [cval, nval].map(function(it){
          return (it || []).join(",");
        }), cval = ref$[0], nval = ref$[1];
        return cval !== nval;
      };
      if (s.type) {
        config = entityService.config.select2[s.type];
      } else {
        config = {};
      }
      if (s.istag) {
        config.tags = true;
        config.tokenSeparators = [',', ' '];
      }
      $(e).select2(config);
      $(e).select2(config).on('change', function(){
        if (changed()) {
          return setTimeout(function(){
            return s.$apply(function(){
              s.model = $(e).val();
              if (a.$attr["ngDetail"]) {
                return s.detail = $(e).select2('data');
              }
            });
          }, 0);
        }
      });
      return s.$watch('model', function(vals){
        var html, i$, ref$, len$, val;
        if (config.tags) {
          html = "";
          for (i$ = 0, len$ = (ref$ = vals || []).length; i$ < len$; ++i$) {
            val = ref$[i$];
            html += $("<option></option>").val(val).text(val)[0].outerHTML;
          }
          $(e).html(html);
        }
        if (changed()) {
          return setTimeout(function(){
            return $(e).val(vals).trigger('change');
          }, 0);
        }
      });
    }
  };
}));
x$.directive('readby', ['$compile'].concat(function($compile){
  return {
    scope: {
      readby: '&readby',
      encoding: '@encoding'
    },
    link: function(s, e, a, c){
      var handler;
      handler = s.readby();
      return e.bind('change', function(event){
        var fr;
        fr = new FileReader();
        fr.onload = function(event){
          s.$apply(function(){
            return handler(fr.result);
          });
          return e.val("");
        };
        if (s.encoding) {
          return fr.readAsText(event.target.files[0], s.encoding);
        } else {
          return fr.readAsBinaryString(event.target.files[0]);
        }
      });
    }
  };
}));// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plEditor', ['$scope', '$http', '$timeout', '$interval', '$sce', 'plConfig', 'IOService', 'dataService', 'chartService', 'paletteService', 'themeService', 'plNotify', 'eventBus', 'permService'].concat(function($scope, $http, $timeout, $interval, $sce, plConfig, IOService, dataService, chartService, paletteService, themeService, plNotify, eventBus, permService){
  import$($scope, {
    plConfig: plConfig,
    theme: new themeService.theme({
      permission: {
        'switch': 'publish',
        list: []
      }
    }),
    chart: new chartService.chart({
      permission: {
        'switch': 'publish',
        list: []
      }
    }),
    showsrc: window.innerWidth < 800 ? false : true,
    vis: 'preview',
    lastvis: null,
    plotdbDomain: plConfig.urlschema + "" + plConfig.domain,
    plotdbRenderer: plConfig.urlschema + "" + plConfig.domain + "/render.html",
    error: {
      msg: null,
      lineno: 0
    },
    codemirror: {
      code: {
        lineWrapping: true,
        lineNumbers: true,
        viewportMargin: Infinity,
        mode: 'javascript'
      },
      style: {
        lineWrapping: true,
        lineNumbers: true,
        viewportMargin: Infinity,
        mode: 'css'
      },
      doc: {
        lineWrapping: true,
        lineNumbers: true,
        viewportMargin: Infinity,
        mode: 'xml'
      },
      objs: []
    },
    canvas: {
      node: document.getElementById('chart-renderer'),
      window: document.getElementById('chart-renderer').contentWindow
    },
    type: null,
    service: null
  });
  $http({
    url: $scope.plotdbRenderer,
    method: 'GET'
  }).success(function(html){
    var ret;
    ret = /<meta name="script" content="([^"]+)">/.exec(html);
    if (ret) {
      return $http({
        url: ret[1],
        method: 'GET'
      }).success(function(js){
        var urljs, urlhtml;
        urljs = URL.createObjectURL(new Blob([js], {
          type: 'text/javascript'
        }));
        html = html.replace(/<meta name="script" content="([^"]+)">/, "<script type='text/javascript' src='" + urljs + "'></script>");
        urlhtml = URL.createObjectURL(new Blob([html], {
          type: 'text/html'
        }));
        return $timeout(function(){
          $scope.plotdbRenderer = $sce.trustAsResourceUrl(urlhtml);
          return $('#chart-renderer')[0].setAttribute("src", urlhtml);
        }, 1000);
      });
    }
  });
  import$($scope, {
    target: function(){
      return this[this.type];
    },
    mode: {
      set: function(value){
        return import$($scope, (function(){
          switch (value) {
          case 'chart':
            return {
              value: value,
              type: 'chart',
              service: chartService
            };
          case 'theme':
            return {
              value: value,
              type: 'theme',
              service: themeService
            };
          }
        }()));
      }
    },
    _save: function(nothumb){
      var key, ref$, refresh, k, this$ = this;
      nothumb == null && (nothumb = false);
      if (!$scope.writable && this.target().owner !== this.user.data.key) {
        key = this.target()._type.location === 'server' ? this.target().key : null;
        ref$ = this.target();
        ref$.key = null;
        ref$.owner = null;
        if (!this.target().permission) {
          this.target().permission = {
            'switch': 'publish',
            list: []
          };
        }
        if (key) {
          this.target().parent = key;
        }
      }
      refresh = !this.target().key ? true : false;
      if (this.target().dimension) {
        this.target().dimlen = (function(){
          var results$ = [];
          for (k in this.target().dimension || {}) {
            results$.push(k);
          }
          return results$;
        }.call(this)).length;
      }
      return this.target().save().then(function(ret){
        return this$.$apply(function(){
          var link;
          if (refresh) {
            eventBus.fire('loading.dimmer.on');
          }
          if (nothumb) {
            plNotify.send('warning', this$.type + " saved, but thumbnail failed to update");
          } else {
            plNotify.send('success', this$.type + " saved");
          }
          link = this$.service.link(this$.target());
          if (refresh || (!window.location.search && !/\/(chart|theme)\/[^/]+/.exec(window.location.pathname))) {
            window.location.href = link;
          }
          if (this$.save.handle) {
            $timeout.cancel(this$.save.handle);
          }
          this$.save.handle = null;
          this$.backup.unguard(3000);
          return this$.sharePanel.saveHint = false;
        });
      })['catch'](function(err){
        return this$.$apply(function(){
          plNotify.aux.error.io('save', this$.type, err);
          console.error("[save " + name + "]", err);
          if (this$.save.handle) {
            $timeout.cancel(this$.save.handle);
          }
          return this$.save.handle = null;
        });
      });
    },
    save: function(){
      var this$ = this;
      if (!$scope.user.authed()) {
        return $scope.auth.toggle(true);
      }
      if (this.save.handle) {
        return;
      }
      this.save.handle = $timeout(function(){
        this$.save.handle = null;
        return this$._save(true);
      }, 3000);
      return this.canvas.window.postMessage({
        type: 'snapshot'
      }, this.plotdbDomain);
    },
    clone: function(){
      var key, ref$;
      this.target().name = this.target().name + " - Copy";
      key = this.target()._type.location === 'server' ? this.target().key : null;
      ref$ = this.target();
      ref$.key = null;
      ref$.owner = null;
      ref$.parent = key;
      ref$.permission = {
        'switch': ['public'],
        value: []
      };
      return this.save();
    },
    loadlocal: function(type, item){
      this[type] = new this.service[type](import$(this[type], item));
      this.backup.check();
      $scope.backup.unguard(3000);
      return $scope.countline();
    },
    load: function(type, key){
      var this$ = this;
      return this.service.load(type, key).then(function(ret){
        this$[this$.type] = new this$.service[this$.type](import$(this$[this$.type], ret));
        this$.backup.check();
        $scope.backup.unguard(3000);
        return $scope.countline();
      })['catch'](function(ret){
        console.error(ret);
        plNotify.send('error', "failed to load chart. please try reloading");
        if (ret[1] === 'forbidden') {
          return window.location.href = '/403.html';
        }
      });
    },
    'delete': function(){
      var this$ = this;
      if (!this.target().key) {
        return;
      }
      this['delete'].handle = true;
      return this.target()['delete']().then(function(ret){
        plNotify.send('success', this$.type + " deleted");
        this$[this$.type] = new this$.service[this$.type]();
        $scope.backup.unguard(10000);
        setTimeout(function(){
          return window.location.href = "/" + this$.type + "/me/";
        }, 1000);
        return this$['delete'].handle = false;
      })['catch'](function(err){
        plNotify.send('error', "failed to delete " + this$.type);
        return this$['delete'].handle = false;
      });
    },
    resetConfig: function(){
      var k, ref$, v, results$ = [];
      if (this.chart) {
        for (k in ref$ = this.chart.config) {
          v = ref$[k];
          results$.push(v.value = v['default']);
        }
        return results$;
      }
    },
    dimension: {
      bind: function(event, dimension, field){
        var this$ = this;
        field == null && (field = {});
        if ((dimension.fields || []).filter(function(it){
          return it === field;
        }).length) {
          return;
        }
        return field.update().then(function(){
          if (dimension.multiple) {
            (dimension.fields || (dimension.fields = [])).push(field);
          } else {
            dimension.fields = [field];
          }
          return $scope.render();
        })['catch'](function(err){
          plNotify.send('error', "failed to bind field. try again later.");
          return console.error("chart.ls / dimension field binding failed due to : ", err);
        });
      },
      unbind: function(event, dimension, field){
        var idx;
        field == null && (field = {});
        idx = dimension.fields.indexOf(field);
        if (idx < 0) {
          return;
        }
        dimension.fields.splice(idx, 1);
        return $scope.render();
      },
      typematch: function(dimtypes, fieldtype){
        var fieldtypes, queue, newqueue, i$, len$, type, dimtype;
        dimtypes == null && (dimtypes = []);
        if (!dimtypes || !dimtypes.length || !plotdb[fieldtype]) {
          return true;
        }
        fieldtypes = [];
        queue = [plotdb[fieldtype]];
        for (;;) {
          newqueue = [];
          for (i$ = 0, len$ = queue.length; i$ < len$; ++i$) {
            type = queue[i$];
            fieldtypes.push(type);
            newqueue = newqueue.concat(type.basetype || []);
          }
          queue = newqueue;
          if (!queue.length) {
            break;
          }
        }
        fieldtypes = fieldtypes.map(function(it){
          return it.name || "";
        });
        for (i$ = 0, len$ = dimtypes.length; i$ < len$; ++i$) {
          dimtype = dimtypes[i$];
          if (fieldtypes.indexOf(dimtype.name) >= 0) {
            return dimtype.name;
          }
        }
        return false;
      }
    },
    reset: function(){
      return this.render();
    },
    render: function(rebind){
      var this$ = this;
      rebind == null && (rebind = true);
      if (!this.inited) {
        return;
      }
      if (!this.chart) {
        return;
      }
      this.chart.updateData();
      return $scope.library.load(this.chart.library).then(function(libhash){
        var payload, ref$;
        payload = JSON.parse(angular.toJson({
          theme: this$.theme,
          chart: this$.chart,
          library: libhash
        }));
        ref$ = $scope.render;
        ref$.payload = payload;
        ref$.rebind = rebind;
        if (!rebind) {
          return this$.canvas.window.postMessage({
            type: 'render',
            payload: payload,
            rebind: rebind
          }, this$.plotdbDomain);
        } else {
          return this$.canvas.window.postMessage({
            type: 'reload'
          }, this$.plotdbDomain);
        }
      });
    },
    renderAsync: function(rebind){
      var this$ = this;
      rebind == null && (rebind = true);
      if (this.parse.theme.pending || this.parse.chart.pending) {
        return;
      }
      if (!this.chart) {
        return;
      }
      if (this.renderAsync.handler) {
        $timeout.cancel(this.renderAsync.handler);
      }
      return this.renderAsync.handler = $timeout(function(){
        this$.renderAsync.handler = null;
        return this$.render(rebind);
      }, 500);
    },
    parse: {
      send: function(name){
        if (!$scope[name]) {
          return;
        }
        this[name].pending = true;
        if (!this.chart) {
          return;
        }
        return $scope.library.load(this.chart.library).then(function(libhash){
          return $scope.canvas.window.postMessage({
            type: "parse-" + name,
            payload: {
              code: $scope[name].code.content,
              library: libhash
            }
          }, $scope.plotdbDomain);
        });
      },
      chart: function(){
        return this.send('chart');
      },
      theme: function(){
        return this.send('theme');
      }
    },
    countline: function(){
      var this$ = this;
      return ['code', 'style', 'doc'].map(function(it){
        this$.target()[it].lines = (this$.target()[it].content || "").split('\n').length;
        return this$.target()[it].size = (this$.target()[it].content || "").length;
      });
    },
    download: {
      prepare: function(){
        var this$ = this;
        return ['svg', 'png', 'plotdb'].map(function(n){
          return setTimeout(function(){
            return $scope.$apply(function(){
              return [this$[n].url = '', this$[n]()];
            });
          }, 300);
        });
      },
      svg: function(){
        return $scope.canvas.window.postMessage({
          type: 'getsvg'
        }, $scope.plotdbDomain);
      },
      png: function(){
        return $scope.canvas.window.postMessage({
          type: 'getpng'
        }, $scope.plotdbDomain);
      },
      plotdb: function(){
        var payload;
        payload = angular.toJson($scope.target());
        this.plotdb.url = URL.createObjectURL(new Blob([payload], {
          type: 'application/json'
        }));
        return this.plotdb.size = payload.length;
      }
    },
    rwdtest: {
      val: 'default',
      vals: ['default', 'QVGA', 'HVGA', 'Thumb'],
      map: {
        'default': [0, 0],
        QVGA: [240, 320],
        HVGA: [320, 480],
        Thumb: [308, 229]
      },
      set: function(it){
        var node, parent, ref$, width, height, w, h;
        if (!in$(it, this.vals)) {
          it = this.val;
        }
        this.val = it;
        node = document.getElementById('chart-renderer');
        parent = node.parentNode;
        ref$ = {
          width: (ref$ = parent.getBoundingClientRect()).width,
          height: ref$.height
        }, width = ref$.width, height = ref$.height;
        if (this.val === 'default') {
          ref$ = ['100%', '100%'], w = ref$[0], h = ref$[1];
          ref$ = node.style;
          ref$.marginTop = 0;
          ref$.marginLeft = 0;
        } else {
          ref$ = this.map[this.val], w = ref$[0], h = ref$[1];
          ref$ = node.style;
          ref$.marginTop = (height - h) / 2 + "px";
          ref$.marginLeft = (width - w) / 2 + "px";
          ref$ = [w, h].map(function(it){
            return it + "px";
          }), w = ref$[0], h = ref$[1];
        }
        ref$ = node.style;
        ref$.width = w;
        ref$.height = h;
        return node.style.boxShadow = '0 0 3px rgba(0,0,0,0.2)';
      }
    },
    colorblind: {
      val: 'normal',
      vals: ['normal', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly'],
      set: function(it){
        if (!in$(it, this.vals)) {
          return;
        }
        this.val = it;
        return $scope.canvas.window.postMessage({
          type: 'colorblind-emu',
          payload: it
        }, $scope.plotdbDomain);
      }
    },
    applyTheme: function(){
      var k, ref$, v, preset, ref1$;
      if (this.chart && this.theme && this.chart.config) {
        for (k in ref$ = this.chart.config) {
          v = ref$[k];
          if (v._bytheme) {
            delete this.chart.config[k];
          }
        }
        for (k in ref$ = this.chart.config) {
          v = ref$[k];
          if (!this.chart.config[k].subtype) {
            continue;
          }
          preset = ((ref1$ = this.theme).typedef || (ref1$.typedef = {}))[this.chart.config[k].type[0].name];
          if (!preset) {
            continue;
          }
          if (preset[this.chart.config[k].subtype] != null) {
            this.chart.config[k].value = preset[this.chart.config[k].subtype];
          }
        }
        for (k in ref$ = this.theme.config) {
          v = ref$[k];
          if (!this.chart.config[k]) {
            this.chart.config[k] = import$({
              _bytheme: true
            }, v);
          } else if (v.type && this.chart.config[k].type[0].name !== v.type[0].name) {
            continue;
          } else if (v['default']) {
            this.chart.config[k].value = v['default'];
          } else {
            this.chart.config[k].value = v;
          }
        }
      }
      if (this.theme) {
        return this.paledit.fromTheme(this.theme);
      }
    }
  });
  import$($scope, {
    library: {
      hash: {},
      load: function(list){
        var tasks, item, this$ = this;
        if (!list) {
          list = ($scope.chart || ($scope.chart = {})).library || [];
        }
        tasks = list.map(function(it){
          return [it, it.split('/')];
        }).filter(function(it){
          return !this$.hash[it[0]];
        });
        return Promise.all((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = tasks).length; i$ < len$; ++i$) {
            item = ref$[i$];
            results$.push(fn$(item));
          }
          return results$;
          function fn$(item){
            return new Promise(function(res, rej){
              var url, that;
              url = item[1];
              url = "/lib/" + url[0] + "/" + url[1] + "/index." + ((that = url[2]) ? that + '.' : '') + "js";
              return $http({
                url: url,
                method: 'GET'
              }).success(function(js){
                var bloburl;
                bloburl = URL.createObjectURL(new Blob([js], {
                  type: 'text/javascript'
                }));
                this$.hash[item[0]] = bloburl;
                return res();
              });
            });
          }
        }())).then(function(){
          var ret;
          ret = {};
          list.map(function(it){
            return ret[it] = this$.hash[it];
          });
          return ret;
        });
      }
    },
    tooltip: {
      show: function(e){
        return setTimeout(function(){
          return $(e.target).tooltip('show');
        }, 0);
      }
    },
    backup: {
      enabled: false,
      guard: false,
      unguard: function(delay){
        var this$ = this;
        delay == null && (delay = 1000);
        this.guard = false;
        return $timeout(function(){
          var ref$;
          this$.guard = true;
          return ref$ = $scope.unsaved, delete $scope.unsaved, ref$;
        }, delay);
      },
      init: function(){
        var this$ = this;
        $scope.$watch($scope.type, function(){
          $scope.unsaved = true;
          if (!this$.enabled) {
            return;
          }
          if (this$.handle) {
            $timeout.cancel(this$.handle);
          }
          return this$.handle = $timeout(function(){
            this$.handle = null;
            return $scope.target().backup().then(function(){});
          }, 2000);
        }, true);
        this.unguard(3000);
        return window.onbeforeunload = function(){
          if (!this$.guard || !$scope.unsaved) {
            return null;
          }
          return "You have unsaved changes. Still wanna leave?";
        };
      },
      recover: function(){
        var this$ = this;
        if (!this.last || !this.last.object) {
          return;
        }
        $scope.target().recover(this.last.object);
        this.enabled = false;
        return $scope.target().cleanBackups().then(function(){
          return $scope.$apply(function(){
            return this$.check();
          });
        });
      },
      check: function(){
        var this$ = this;
        return $scope.target().backups().then(function(ret){
          return $scope.$apply(function(){
            this$.list = ret;
            this$.last = ret[0];
            return $timeout(function(){
              return this$.enabled = true;
            }, 4000);
          })['catch'](function(err){
            return console.error('fecth backup failed: #', err);
          });
        });
      }
    },
    charts: {
      list: chartService.sample.map(function(it){
        return new chartService.chart(it);
      }),
      set: function(it){
        var this$ = this;
        if (it && $scope.chart && ($scope.chart.key === it.key || $scope.chart.key === it)) {
          return;
        }
        if (typeof it === 'number') {
          it = {
            _type: {
              location: 'server',
              name: 'chart'
            },
            key: it
          };
        }
        $scope.chart = it;
        if (!it) {
          return;
        }
        if (it._type.location === 'sample') {
          $scope.chart = new chartService.chart(it);
          $scope.chart.theme = $scope.theme;
          $scope.resetConfig();
          $scope.parse.theme();
          return;
        }
        return chartService.load(it._type, it.key).then(function(ret){
          $scope.chart = new chartService.chart(ret);
          $scope.chart.theme = $scope.theme;
          if ($scope.theme) {
            $scope.theme.chart = $scope.chart.key;
          }
          $scope.resetConfig();
          $scope.parse.chart();
          return $scope.parse.theme();
        })['catch'](function(ret){
          console.error(ret);
          return plNotify.send('error', "failed to load chart. please try reloading");
        });
      },
      init: function(){
        var this$ = this;
        return IOService.listRemotely({
          name: 'chart'
        }, {
          owner: $scope.user.data
            ? $scope.user.data.key
            : -1
        }).then(function(ret){
          return $scope.$apply(function(){
            this$.list = (chartService.sample.concat(ret)).map(function(it){
              return new chartService.chart(it, true);
            });
            if ($scope.theme && $scope.theme.chart) {
              return this$.set(this$.list.filter(function(it){
                return it.key === $scope.theme.chart;
              })[0]);
            }
          });
        })['catch'](function(){
          console.error(e);
          return plNotify.send('error', "failed to load chart list. use sample chart instead");
        });
      }
    },
    themes: {
      list: themeService.sample,
      set: function(it){
        return $scope.theme = it;
      },
      init: function(){
        var this$ = this;
        return themeService.list().then(function(ret){
          return $scope.$apply(function(){
            return this$.list = ret;
          });
        });
      }
    },
    editor: {
      'class': "",
      focus: function(){
        var this$ = this;
        return setTimeout(function(){
          return $scope.codemirror.objs.map(function(cm){
            var ret, k, v, d, this$ = this;
            ret = (function(){
              var ref$, results$ = [];
              for (k in ref$ = $scope.codemirror) {
                v = ref$[k];
                results$.push([k, v]);
              }
              return results$;
            }()).filter(function(it){
              return it[1].mode === cm.options.mode;
            })[0];
            d = cm.display;
            d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
            d.scrollbarsClipped = false;
            cm.setSize();
            if (!ret || !$scope.vis.startsWith(ret[0])) {
              return;
            }
            setTimeout(function(){
              return cm.focus();
            }, 10);
            if (ret[1].refreshed) {
              return;
            }
            ret[1].refreshed = true;
            return setTimeout(function(){
              cm.refresh();
              if ($scope.error.lineno) {
                return $("#code-editor-code .CodeMirror-code > div:nth-of-type(" + $scope.error.lineno + ")").addClass('error');
              }
            }, 0);
          });
        }, 0);
      },
      update: function(){
        return this['class'] = [this.fullscreen.toggled ? 'fullscreen' : "", this.vis !== 'preview' ? 'active' : "", this.color.modes[this.color.idx]].join(" ");
      },
      fullscreen: {
        toggle: function(){
          this.toggled = !this.toggled;
          $scope.editor.update();
          $scope.editor.focus();
          return $timeout(function(){
            return $scope.rwdtest.set();
          }, 10);
        },
        toggled: false
      },
      color: {
        modes: ['normal', 'dark'],
        idx: 0,
        toggle: function(){
          this.idx = (this.idx + 1) % this.modes.length;
          return $scope.editor.update();
        }
      }
    },
    settingPanel: {
      tab: 'publish'
      /*permcheck: ->
        $scope.writable = permService.test(
          {user: $scope.user.data}
          $scope.target!{}permission
          $scope.target!owner
          \write
        )
      */,
      init: function(){
        var this$ = this;
        $scope.permtype = (window.permtype || (window.permtype = []))[1] || 'none';
        $scope.writable = permService.isEnough($scope.permtype, 'write');
        $scope.isAdmin = permService.isEnough($scope.permtype, 'admin');
        $scope.$watch('settingPanel.chart', function(cur, old){
          var k, v, results$ = [];
          for (k in cur) {
            v = cur[k];
            if (!v && !old[k]) {
              continue;
            }
            results$.push($scope.chart[k] = v);
          }
          return results$;
        }, true);
        $scope.$watch('chart.basetype', function(it){
          return this$.chart.basetype = it;
        });
        $scope.$watch('chart.visualencoding', function(it){
          return this$.chart.visualencoding = it;
        });
        $scope.$watch('chart.category', function(it){
          return this$.chart.category = it;
        });
        $scope.$watch('chart.tags', function(it){
          return this$.chart.tags = it;
        });
        return $scope.$watch('chart.library', function(it){
          return this$.chart.library = it;
        });
      },
      toggle: function(tab){
        if (tab) {
          this.tab = tab;
        }
        return this.toggled = !this.toggled;
      },
      toggled: false,
      chart: {
        basetype: null,
        visualencoding: null,
        category: null,
        tags: null,
        library: null
      }
    },
    dataPanel: {
      init: function(){
        var this$ = this;
        return eventBus.listen('dataset.saved', function(){
          return $timeout(function(){
            return this$.toggled = false;
          }, 200);
        });
      },
      toggle: function(){
        return this.toggled = !this.toggled;
      },
      toggled: false,
      edit: function(dataset){
        if (dataset._type.location === 'sample') {
          return;
        }
        this.toggled = true;
        return eventBus.fire('dataset.edit', dataset);
      }
    },
    sharePanel: {
      social: {
        facebook: null
      },
      isForkable: function(){
        var perms, ref$, forkable;
        perms = (ref$ = $scope.target().permission).list || (ref$.list = []);
        return forkable = permService.isEnough($scope.permtype, 'fork');
      },
      embed: {
        width: '100%',
        height: '600px',
        widthRate: 4,
        heightRate: 3
      },
      init: function(){
        var this$ = this;
        return ['#edit-sharelink', '#edit-embedcode'].map(function(eventsrc){
          var clipboard, embedcodeGenerator;
          clipboard = new Clipboard(eventsrc);
          clipboard.on('success', function(){
            $(eventsrc).tooltip({
              title: 'copied',
              trigger: 'click'
            }).tooltip('show');
            return setTimeout(function(){
              return $(eventsrc).tooltip('hide');
            }, 1000);
          });
          clipboard.on('error', function(){
            $(eventsrc).tooltip({
              title: 'Press Ctrl+C to Copy',
              trigger: 'click'
            }).tooltip('show');
            return setTimeout(function(){
              return $(eventsrc).tooltip('hide');
            }, 1000);
          });
          embedcodeGenerator = function(){
            var link, ref$, w, h, wr, hr, ratio;
            link = this$.link;
            ref$ = [this$.embed.width, this$.embed.height], w = ref$[0], h = ref$[1];
            ref$ = [this$.embed.widthRate, this$.embed.heightRate], wr = ref$[0], hr = ref$[1];
            ratio = (hr / (wr || hr || 1)) * 100;
            if (/^\d+$/.exec(w)) {
              w = w + 'px';
            }
            if (/^\d+$/.exec(h)) {
              h = h + 'px';
            }
            if ($scope.sharePanel.aspectRatio) {
              return "<div style=\"width:100%\"><div style=\"position:relative;height:0;overflor:hidden;padding-bottom:" + ratio + "%\"><iframe src=\"" + link + "\" frameborder=\"0\" style=\"position:absolute;top:0;left:0;width:100%;height:100%\"></iframe></div></div>";
            } else {
              return "<iframe src=\"" + link + "\" width=\"" + w + "\" height=\"" + h + "\" frameborder=\"0\"></iframe>";
            }
          };
          $scope.$watch('sharePanel.embed', function(){
            return this$.embedcode = embedcodeGenerator();
          }, true);
          $scope.$watch('sharePanel.aspectRatio', function(){
            return this$.embedcode = embedcodeGenerator();
          });
          return $scope.$watch('sharePanel.link', function(){
            var fbobj, k, v, pinobj, emailobj, linkedinobj, twitterobj;
            this$.embedcode = embedcodeGenerator();
            if (!$scope.chart) {
              return;
            }
            this$.thumblink = $scope.service.thumblink($scope.chart, true);
            fbobj = {
              app_id: '1546734828988373',
              display: 'popup',
              caption: $scope.target().name,
              picture: this$.thumblink,
              link: this$.link,
              name: $scope.target().name,
              redirect_uri: 'http://plotdb.com/',
              description: $scope.target().description || ""
            };
            this$.social.facebook = (["https://www.facebook.com/dialog/feed?"].concat((function(){
              var ref$, results$ = [];
              for (k in ref$ = fbobj) {
                v = ref$[k];
                results$.push(k + "=" + encodeURIComponent(v));
              }
              return results$;
            }()))).join('&');
            pinobj = {
              url: this$.link,
              media: this$.thumblink,
              description: $scope.target().description || ""
            };
            this$.social.pinterest = (["https://www.pinterest.com/pin/create/button/?"].concat((function(){
              var ref$, results$ = [];
              for (k in ref$ = pinobj) {
                v = ref$[k];
                results$.push(k + "=" + encodeURIComponent(v));
              }
              return results$;
            }()))).join('&');
            emailobj = {
              subject: "plotdb: " + $scope.target().name,
              body: $scope.target().description + " : " + this$.link
            };
            this$.social.email = (["mailto:?"].concat((function(){
              var ref$, results$ = [];
              for (k in ref$ = emailobj) {
                v = ref$[k];
                results$.push(k + "=" + encodeURIComponent(v));
              }
              return results$;
            }()))).join('&');
            linkedinobj = {
              mini: true,
              url: this$.link,
              title: $scope.target().name + " on PlotDB",
              summary: $scope.target().description,
              source: "plotdb.com"
            };
            this$.social.linkedin = (["http://www.linkedin.com/shareArticle?"].concat((function(){
              var ref$, results$ = [];
              for (k in ref$ = linkedinobj) {
                v = ref$[k];
                results$.push(k + "=" + encodeURIComponent(v));
              }
              return results$;
            }()))).join('&');
            twitterobj = {
              url: this$.link,
              text: $scope.target().name + " - " + ($scope.target().description || ''),
              hashtags: "dataviz,chart,visualization",
              via: "plotdb"
            };
            return this$.social.twitter = (["http://twitter.com/intent/tweet?"].concat((function(){
              var ref$, results$ = [];
              for (k in ref$ = twitterobj) {
                v = ref$[k];
                results$.push(k + "=" + encodeURIComponent(v));
              }
              return results$;
            }()))).join('&');
          });
        });
      },
      saveHint: false,
      embedcode: "",
      link: "",
      toggle: function(){
        if (this.init) {
          this.init();
        }
        this.init = null;
        this.toggled = !this.toggled;
        return this.saveHint = false;
      },
      toggled: false
      /*
      is-public: -> ($scope.target!.permission.switch == \publish)
      set-private: ->
        $scope.target!.{}permission.switch = \draft
        @save-hint = true
      toggle-public: ->
        $scope.target!.{}permission.switch = (
          #if $scope.target!.{}permission.switch.0 == \public => <[private]> else <[public]>
          if $scope.target!.{}permission.switch == \publish => <[draft]> else <[publish]>
        )
        @save-hint = true
      set-public: ->
        $scope.target!.{}permission.switch = \publish #<[public]>
        @save-hint = true
      */
    },
    coloredit: {
      config: function(v, idx){
        return {
          'class': "no-palette text-input",
          context: "context-" + idx,
          exclusive: true,
          palette: [v.value]
        };
      }
    },
    paledit: {
      convert: function(it){
        return it.map(function(it){
          return {
            id: it.key || Math.random() + "",
            text: it.name,
            data: it.colors
          };
        });
      },
      ldcp: null,
      item: null,
      paste: null,
      fromTheme: function(theme){
        var themepal, k, v;
        if (!theme || !theme.config || !theme.config.palette) {
          return this.list = this.list.filter(function(it){
            return it.text !== 'Theme';
          });
        }
        themepal = this.list.filter(function(it){
          return it.text === 'Theme';
        })[0];
        if (!themepal) {
          themepal = {
            text: 'Theme',
            id: '456',
            children: null
          };
          this.list = [themepal].concat(this.list);
        }
        themepal.children = this.convert((function(){
          var ref$, results$ = [];
          for (k in ref$ = theme.config.palette) {
            v = ref$[k];
            results$.push((v.name = k, v));
          }
          return results$;
        }()));
        $('#pal-select option').remove();
        $('#pal-select optgroup').remove();
        return $('#pal-select').select2({
          allowedMethods: ['updateResults'],
          templateResult: function(state){
            var color, c;
            if (!state.data) {
              return state.text;
            }
            color = (function(){
              var i$, ref$, len$, results$ = [];
              for (i$ = 0, len$ = (ref$ = state.data).length; i$ < len$; ++i$) {
                c = ref$[i$];
                results$.push("<div class='color' " + ("style='background:" + c.hex + ";width:" + 100 / state.data.length + "%'") + "></div>");
              }
              return results$;
            }()).join("");
            return $(("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>"));
          },
          data: this.list
        });
      },
      init: function(){
        var x$, iconPalSelectConfig, this$ = this;
        this.ldcp = new ldColorPicker(null, {}, $('#palette-editor .editor .ldColorPicker')[0]);
        this.ldcp.on('change-palette', function(){
          return setTimeout(function(){
            return $scope.$apply(function(){
              return this$.update();
            });
          }, 0);
        });
        this.list = [{
          text: 'Default',
          id: 'default',
          children: this.convert(paletteService.sample)
        }];
        x$ = $('#pal-select');
        x$.select2(iconPalSelectConfig = {
          allowedMethods: ['updateResults'],
          templateResult: function(state){
            var color, c;
            if (!state.data) {
              return state.text;
            }
            color = (function(){
              var i$, ref$, len$, results$ = [];
              for (i$ = 0, len$ = (ref$ = state.data).length; i$ < len$; ++i$) {
                c = ref$[i$];
                results$.push("<div class='color' " + ("style='background:" + c.hex + ";width:" + 100 / state.data.length + "%'") + "></div>");
              }
              return results$;
            }()).join("");
            return $(("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>"));
          },
          data: this.list
        });
        x$.on('select2:closing', function(e){
          var i$, ref$, len$, item, ret;
          for (i$ = 0, len$ = (ref$ = this$.list).length; i$ < len$; ++i$) {
            item = ref$[i$];
            ret = item.children.filter(fn$)[0];
            if (ret) {
              break;
            }
          }
          if (!ret) {
            return;
          }
          $scope.$apply(function(){
            return this$.item.value = JSON.parse(JSON.stringify({
              colors: ret.data
            }));
          });
          return this$.ldcp.setPalette(this$.item.value);
          function fn$(it){
            return it.id === $(e.target).val();
          }
        });
        return $scope.$watch('paledit.paste', function(d){
          var result, e;
          try {
            result = JSON.parse(d);
            if (Array.isArray(result)) {
              return this$.ldcp.setPalette({
                colors: result.map(function(it){
                  return {
                    hex: it
                  };
                })
              });
            }
          } catch (e$) {
            e = e$;
            console.log(e);
            return $scope.paledit.paste = '';
          }
        });
      },
      update: function(){
        var ref$, src, des, pairing, i$, to$, i, d, j$, to1$, j, s, len$, pair, unpair;
        if (this.item) {
          ref$ = [this.item.value, this.ldcp.getPalette(), []], src = ref$[0], des = ref$[1], pairing = ref$[2];
          for (i$ = 0, to$ = des.colors.length; i$ < to$; ++i$) {
            i = i$;
            d = des.colors[i];
            for (j$ = 0, to1$ = src.colors.length; j$ < to1$; ++j$) {
              j = j$;
              s = src.colors[j];
              if (s.hex !== d.hex) {
                continue;
              }
              pairing.push([s, d, Math.abs(i - j)]);
            }
          }
          pairing.sort(function(a, b){
            return a[2] - b[2];
          });
          for (i$ = 0, len$ = pairing.length; i$ < len$; ++i$) {
            pair = pairing[i$];
            if (pair[0].pair || pair[1].pair) {
              continue;
            }
            pair[0].pair = pair[1];
            pair[1].pair = pair[0];
          }
          unpair = [
            src.colors.filter(function(it){
              return !it.pair;
            }), des.colors.filter(function(it){
              return !it.pair;
            })
          ];
          for (i$ = 0, to$ = Math.min(unpair[0].length, unpair[1].length); i$ < to$; ++i$) {
            i = i$;
            unpair[1][i].pair = unpair[0][i];
          }
          src.colors = des.colors.map(function(it){
            var ref$;
            if (it.pair) {
              return ref$ = it.pair, ref$.hex = it.hex, ref$;
            } else {
              return it;
            }
          });
          src.colors.forEach(function(it){
            var ref$;
            return ref$ = it.pair, delete it.pair, ref$;
          });
          return this.paste = null;
        }
      },
      toggled: false,
      toggle: function(){
        this.toggled = !this.toggled;
        if (!this.toggled) {
          return this.update();
        }
      },
      edit: function(item){
        this.item = item;
        this.ldcp.setPalette(item.value);
        return this.toggled = true;
      }
    },
    switchPanel: function(){
      var this$ = this;
      return setTimeout(function(){
        return $scope.$apply(function(){
          var temp;
          temp = this$.vis;
          if (this$.vis === 'preview' && (!this$.lastvis || this$.lastvis === 'preview')) {
            this$.vis = 'code';
          } else if (this$.vis === 'preview') {
            this$.vis = this$.lastvis;
          } else {
            this$.vis = 'preview';
          }
          this$.lastvis = temp;
          if (this$.vis === 'preview') {
            return $scope.codemirror.objs.forEach(function(it){
              return it.getInputField().blur();
            });
          } else {
            return $scope.codemirror.objs.forEach(function(it){
              return it.refresh();
            });
          }
        });
      }, 0);
    },
    hidHandler: function(){
      var this$ = this;
      $scope.codemirrored = function(editor){
        return $scope.codemirror.objs.push(editor);
      };
      return document.body.addEventListener('keydown', function(e){
        if ((e.metaKey || e.altKey) && (e.keyCode === 13 || e.which === 13)) {
          return $scope.$apply(function(){
            return this$.switchPanel();
          });
        }
      });
    },
    checkParam: function(){
      var that, ret, key, ref$, location;
      if (that = window.chart) {
        return this.loadlocal('chart', that);
      }
      if (that = window.theme) {
        return this.loadlocal('theme', that);
      }
      if (!window.location.search) {
        return;
      }
      if (window.location.search === '?demo') {
        $scope.target().doc.content = $scope.service.sample[1].doc.content;
        $scope.target().style.content = $scope.service.sample[1].style.content;
        $scope.target().code.content = $scope.service.sample[1].code.content;
        return;
      }
      ret = /[?&]k=([sl])([^&#|?]+)/.exec(window.location.search);
      if (!ret) {
        return;
      }
      key = ret[2];
      ref$ = [ret[1] === 's' ? 'server' : 'local', ret[2]], location = ref$[0], key = ref$[1];
      return $scope.load({
        name: $scope.type,
        location: location
      }, key);
    },
    assets: {
      measure: function(){
        var ref$;
        return ((ref$ = $scope.target()).assets || (ref$.assets = [])).size = $scope.target().assets.map(function(it){
          return it.content.length;
        }).reduce(function(a, b){
          return a + b;
        }, 0);
      },
      download: {
        url: null,
        name: null
      },
      preview: function(file){
        var datauri, iframe;
        this.download.url = URL.createObjectURL(new Blob([file.content], {
          type: file.type
        }));
        this.download.name = file.name;
        this.preview.toggled = true;
        datauri = ["data:", file.type, ";charset=utf-8;base64,", file.content].join("");
        iframe = document.createElement("iframe");
        $('#assets-preview .iframe')[0].innerHTML = "<iframe></iframe>";
        return $('#assets-preview .iframe iframe')[0].src = datauri;
      },
      read: function(fobj){
        var this$ = this;
        return new Promise(function(res, rej){
          var name, that, type, file, fr;
          name = (that = /([^/]+\.?[^/.]*)$/.exec(fobj.name)) ? that[1] : 'unnamed';
          type = 'unknown';
          file = $scope.target().addFile(name, type, null);
          fr = new FileReader();
          fr.onload = function(){
            var result, idx, type, content, size, ref$;
            result = fr.result;
            idx = result.indexOf(';');
            type = result.substring(5, idx);
            content = result.substring(idx + 8);
            size = ((ref$ = $scope.target()).assets || (ref$.assets = [])).map(function(it){
              return (it.content || "").length;
            }).reduce(function(a, b){
              return a + b;
            }, 0) + content.length;
            if (size > 3000000) {
              $scope.$apply(function(){
                plNotify.alert("Assets size limit (3MB) exceeded. won't upload.");
                $scope.target().removeFile(file);
              });
            }
            file.type = type;
            file.content = content;
            $scope.$applyAsync(function(){
              return file.type = type, file.content = content, file;
            });
            return res(file);
          };
          return fr.readAsDataURL(fobj);
        });
      },
      handle: function(files){
        var file;
        return Promise.all((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = files).length; i$ < len$; ++i$) {
            file = ref$[i$];
            results$.push(this.read(file));
          }
          return results$;
        }.call(this))).then(function(){
          return $scope.renderAsync();
        });
      },
      node: null,
      init: function(){
        var x$, this$ = this;
        x$ = this.node = $('#code-editor-assets input');
        x$.on('change', function(){
          return this$.handle(this$.node[0].files);
        });
        return x$;
      }
    },
    monitor: function(){
      var this$ = this;
      this.assets.init();
      this.$watch('vis', function(vis){
        return $scope.editor.focus();
      });
      this.$watch($scope.type + ".assets", function(){
        return this$.assets.measure();
      }, true);
      this.$watch($scope.type + ".doc.content", function(){
        return this$.countline();
      });
      this.$watch($scope.type + ".style.content", function(){
        return this$.countline();
      });
      this.$watch($scope.type + ".code.content", function(){
        return this$.countline();
      });
      this.$watch($scope.type + ".doc.content", function(){
        return this$.renderAsync();
      });
      this.$watch($scope.type + ".style.content", function(){
        return this$.renderAsync();
      });
      this.$watch($scope.type + ".assets.length", function(){
        return this$.renderAsync();
      });
      this.$watch('theme', function(theme){
        this$.renderAsync();
        if (this$.chart) {
          return this$.chart.theme = theme ? theme.key : null;
        }
      });
      this.$watch('chart', function(chart){
        if (!chart) {
          return;
        }
        return this$.renderAsync();
      });
      this.$watch('chart.theme', function(key){
        if (this$.type === 'chart') {
          return this$.theme = this$.themes.list.filter(function(it){
            return it.key === key;
          })[0];
        }
      });
      this.$watch('theme.chart', function(key){
        if (this$.type === 'theme') {
          return this$.charts.set(key);
        }
      });
      this.$watch("chart.code.content", function(code){
        if (this$.communicate.parseHandler) {
          $timeout.cancel(this$.communicate.parseHandler);
        }
        return this$.communicate.parseHandler = $timeout(function(){
          this$.communicate.parseHandler = null;
          return $scope.parse.chart();
        }, 500);
      });
      this.$watch('theme.code.content', function(code){
        if (!this$.theme) {
          return;
        }
        if (this$.communicate.parseThemeHandler) {
          $timeout.cancel(this$.communicate.parseThemeHandler);
        }
        return this$.communicate.parseThemeHandler = $timeout(function(){
          this$.communicate.parseThemeHandler = null;
          return $scope.parse.theme();
        }, 500);
      });
      this.$watch('chart.config', function(n, o){
        var ret, k, v;
        o == null && (o = {});
        ret = !!(function(){
          var ref$, results$ = [];
          for (k in ref$ = n) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).filter(function(arg$){
          var k, v;
          k = arg$[0], v = arg$[1];
          return !o[k] || v.value !== o[k].value;
        }).map(function(it){
          return (it[1] || {}).rebindOnChange;
        }).filter(function(it){
          return it;
        }).length;
        return this$.renderAsync(ret);
      }, true);
      this.$watch(this.type + ".key", function(){
        return this$.sharePanel.link = chartService.sharelink(this$.target());
      });
      if ($('#data-fields')[0]) {
        $scope.limitscroll;
      }
      return $scope.limitscroll($('#chart-configs')[0]);
    },
    communicate: function(){
      var this$ = this;
      return window.addEventListener('message', function(arg$){
        var data;
        data = arg$.data;
        return $scope.$apply(function(){
          var ref$, config, dimension, k, v, hash, key$, typedef, ref1$, event, bytes, mime, buf, ints, i$, to$, idx;
          if (!data || typeof data !== 'object') {
            return;
          }
          if (data.type === 'error') {
            $('#code-editor-code .CodeMirror-code > .error').removeClass('error');
            $scope.error.msg = (data.payload || (data.payload = {})).msg || "";
            $scope.error.lineno = (data.payload || (data.payload = {})).lineno || 0;
            if ($scope.error.lineno) {
              return $("#code-editor-code .CodeMirror-code > div:nth-of-type(" + $scope.error.lineno + ")").addClass('error');
            }
          } else if (data.type === 'alt-enter') {
            return $scope.switchPanel();
          } else if (data.type === 'snapshot') {
            if (data.payload) {
              this$.target().thumbnail = data.payload;
            }
            return this$._save();
          } else if (data.type === 'parse-chart') {
            $scope.parse.chart.pending = false;
            ref$ = JSON.parse(data.payload), config = ref$.config, dimension = ref$.dimension;
            for (k in ref$ = this$.chart.dimension) {
              v = ref$[k];
              if (dimension[k] != null) {
                dimension[k].fields = v.fields;
              }
            }
            for (k in ref$ = this$.chart.config) {
              v = ref$[k];
              if (config[k] != null) {
                config[k].value = v.value;
              }
            }
            for (k in config) {
              v = config[k];
              if (!(v.value != null)) {
                v.value = v['default'];
              }
            }
            ref$ = this$.chart;
            ref$.config = config;
            ref$.dimension = dimension;
            hash = {};
            for (k in ref$ = this$.chart.config) {
              v = ref$[k];
              (hash[key$ = v.category || 'Other'] || (hash[key$] = {}))[k] = v;
            }
            $scope.configHash = hash;
            this$.inited = true;
            this$.applyTheme();
            return $scope.renderAsync();
          } else if (data.type === 'parse-theme') {
            $scope.parse.theme.pending = false;
            ref$ = JSON.parse(data.payload), config = ref$.config, typedef = ref$.typedef;
            ref$ = this$.theme;
            ref$.config = config;
            ref$.typedef = typedef;
            this$.applyTheme();
            return $scope.renderAsync();
          } else if (data.type === 'loaded') {
            if ($scope.render.payload) {
              if (this$.chart) {
                this$.canvas.window.postMessage((ref1$ = {
                  type: 'render'
                }, ref1$.payload = (ref$ = $scope.render).payload, ref1$.rebind = ref$.rebind, ref1$), this$.plotdbDomain);
              }
              $scope.render.payload = null;
            }
            if ($scope.parse.chart.pending) {
              $scope.library.load(this$.chart.library).then(function(libhash){
                if (this$.chart) {
                  this$.canvas.window.postMessage({
                    type: 'parse-chart',
                    payload: {
                      code: this$.chart.code.content,
                      library: libhash
                    }
                  }, this$.plotdbDomain);
                }
                return $scope.parse.chart.pending = null;
              });
            }
            if ($scope.parse.theme.pending) {
              return $scope.library.load((this$.chart || (this$.chart = {})).library).then(function(libhash){
                if (this$.theme) {
                  this$.canvas.window.postMessage({
                    type: 'parse-theme',
                    payload: {
                      code: this$.theme.code.content,
                      library: libhash
                    }
                  }, this$.plotdbDomain);
                }
                return $scope.parse.theme.pending = null;
              });
            }
          } else if (data.type === 'click') {
            if (document.dispatchEvent) {
              event = document.createEvent('MouseEvents');
              event.initEvent('click', true, true);
              event.synthetic = true;
              return document.dispatchEvent(event);
            } else {
              event = document.createEventObject();
              event.synthetic = true;
              return document.fireEvent("onclick", event);
            }
          } else if (data.type === 'getsvg') {
            if (!data.payload) {
              return $scope.download.svg.url = '#';
            }
            $scope.download.svg.url = URL.createObjectURL(new Blob([data.payload], {
              type: 'image/svg+xml'
            }));
            return $scope.download.svg.size = data.payload.length;
          } else if (data.type === 'getpng') {
            if (!data.payload) {
              return $scope.download.png.url = '#';
            }
            bytes = atob(data.payload.split(',')[1]);
            mime = data.payload.split(',')[0].split(':')[1].split(';')[0];
            if (mime !== 'image/png') {
              return $scope.download.png.url = '#';
            }
            buf = new ArrayBuffer(bytes.length);
            ints = new Uint8Array(buf);
            for (i$ = 0, to$ = bytes.length; i$ < to$; ++i$) {
              idx = i$;
              ints[idx] = bytes.charCodeAt(idx);
            }
            $scope.download.png.url = URL.createObjectURL(new Blob([buf], {
              type: 'image/png'
            }));
            return $scope.download.png.size = bytes.length;
          }
        });
      }, false);
    },
    fieldAgent: {
      init: function(){
        var this$ = this;
        return $('#field-agent').on('mousewheel', function(){
          return this$.setPosition();
        });
      },
      data: null,
      drag: {
        ging: false,
        start: function(){
          return this.ging = true;
        },
        end: function(){
          this.ging = false;
          return setTimeout(function(){
            return $('#field-agent').css({
              top: "-9999px",
              left: "-9999px"
            });
          }, 0);
        }
      },
      setPosition: function(){
        var box, box2, scroll;
        if (!this.node) {
          return;
        }
        box = this.node.getBoundingClientRect();
        box2 = this.node.parentNode.parentNode.parentNode.getBoundingClientRect();
        scroll = {
          left: $('#data-fields').scrollLeft(),
          top: $('#data-fields').scrollTop()
        };
        return $('#field-agent').css({
          top: (box.top - box2.top - scroll.top) + "px",
          left: (box.left - box2.left - scroll.left) + "px",
          width: box.width + "px",
          height: box.height + "px"
        });
      },
      setProxy: function(e, data){
        var ref$, node, this$ = this;
        if (this.drag.ging) {
          return;
        }
        ref$ = [data, e.target], this.data = ref$[0], node = ref$[1];
        for (;;) {
          if ((node.getAttribute("class") || "").indexOf('ds-field') >= 0) {
            break;
          }
          node = node.parentNode;
          if (node.nodeName.toLowerCase() === 'body') {
            return;
          }
        }
        return setTimeout(function(){
          this$.node = node;
          return this$.setPosition();
        }, 0);
      }
    },
    init: function(){
      this.communicate();
      this.hidHandler();
      this.monitor();
      this.checkParam();
      this.paledit.init();
      this.backup.init();
      this.fieldAgent.init();
      this.settingPanel.init();
      this.sharePanel.init();
      this.dataPanel.init();
      if (this.type === 'theme') {
        this.charts.init();
      }
      if (this.type === 'chart') {
        return this.themes.init();
      }
    }
  });
  $scope.mode.set(/^\/chart\//.exec(window.location.pathname) ? 'chart' : 'theme');
  return $scope.init();
}));
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
var x$;
x$ = angular.module('plotDB');
x$.service('sampleData', ['$rootScope'].concat(function($rootScope){
  var ret, k, v;
  ret = [];
  ret.push({
    name: "Crimean War 1854",
    rows: 24,
    owneravatar: 'sample',
    isSample: true,
    _type: {
      location: 'sample'
    },
    fields: (function(){
      var ref$, results$ = [];
      for (k in ref$ = plotdb.data.sample.crimeanWar) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }())
  });
  ret.push({
    name: "Life Expectancy (1985,2000,2015)",
    rows: 188,
    owneravatar: 'sample',
    isSample: true,
    _type: {
      location: 'sample'
    },
    fields: (function(){
      var ref$, results$ = [];
      for (k in ref$ = plotdb.data.sample.lifeExpectancy) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }())
  });
  return ret;
  return [
    {
      key: "/dataset/sample/:crimeawar",
      name: "Deaths in Crimea War, 1854",
      size: 4667,
      rows: 25,
      color: '#ddd',
      _type: {
        location: 'sample',
        name: 'dataset'
      },
      fields: [
        {
          name: "month",
          type: 'Date'
        }, {
          name: "army size",
          type: 'Number'
        }, {
          name: "zymotic deaths",
          type: 'Number'
        }, {
          name: "wound deaths",
          type: 'Number'
        }, {
          name: "other deaths",
          type: 'Number'
        }, {
          name: "zymotic death rate(‰)",
          type: 'Number'
        }, {
          name: "wound death rate(‰)",
          type: 'Number'
        }, {
          name: "other death rate(‰)",
          type: 'Number'
        }
      ].map(function(it){
        return it.dataset = {
          type: {
            location: 'sample',
            name: 'data'
          },
          name: "Deaths in Crimea War, 1854",
          key: "/dataset/sample/:crimeawar"
        }, it;
      }),
      data: [
        {
          "month": "01/04/1854",
          "army size": 8571,
          "death number by zymotic": 1,
          "death number by wound": 0,
          "death number by other": 5,
          "zymotic rate(‰)": 1.4,
          "wound rate(‰)": 0,
          "other rate(‰)": 7
        }, {
          "month": "01/05/1854",
          "army size": 23333,
          "death number by zymotic": 12,
          "death number by wound": 0,
          "death number by other": 9,
          "zymotic rate(‰)": 6.2,
          "wound rate(‰)": 0,
          "other rate(‰)": 4.6
        }, {
          "month": "01/06/1854",
          "army size": 28333,
          "death number by zymotic": 11,
          "death number by wound": 0,
          "death number by other": 6,
          "zymotic rate(‰)": 4.7,
          "wound rate(‰)": 0,
          "other rate(‰)": 2.5
        }, {
          "month": "01/07/1854",
          "army size": 28722,
          "death number by zymotic": 359,
          "death number by wound": 0,
          "death number by other": 23,
          "zymotic rate(‰)": 150,
          "wound rate(‰)": 0,
          "other rate(‰)": 9.6
        }, {
          "month": "01/08/1854",
          "army size": 30246,
          "death number by zymotic": 828,
          "death number by wound": 1,
          "death number by other": 30,
          "zymotic rate(‰)": 328.5,
          "wound rate(‰)": 0.4,
          "other rate(‰)": 11.9
        }, {
          "month": "01/09/1854",
          "army size": 30290,
          "death number by zymotic": 788,
          "death number by wound": 81,
          "death number by other": 70,
          "zymotic rate(‰)": 312.2,
          "wound rate(‰)": 32.1,
          "other rate(‰)": 27.7
        }, {
          "month": "01/10/1854",
          "army size": 30643,
          "death number by zymotic": 503,
          "death number by wound": 132,
          "death number by other": 128,
          "zymotic rate(‰)": 197,
          "wound rate(‰)": 51.7,
          "other rate(‰)": 50.1
        }, {
          "month": "01/11/1854",
          "army size": 29736,
          "death number by zymotic": 844,
          "death number by wound": 287,
          "death number by other": 106,
          "zymotic rate(‰)": 340.6,
          "wound rate(‰)": 115.8,
          "other rate(‰)": 42.8
        }, {
          "month": "01/12/1854",
          "army size": 32779,
          "death number by zymotic": 1725,
          "death number by wound": 114,
          "death number by other": 131,
          "zymotic rate(‰)": 631.5,
          "wound rate(‰)": 41.7,
          "other rate(‰)": 48
        }, {
          "month": "01/01/1855",
          "army size": 32393,
          "death number by zymotic": 2761,
          "death number by wound": 83,
          "death number by other": 324,
          "zymotic rate(‰)": 1022.8,
          "wound rate(‰)": 30.7,
          "other rate(‰)": 120
        }, {
          "month": "01/02/1855",
          "army size": 30919,
          "death number by zymotic": 2120,
          "death number by wound": 42,
          "death number by other": 361,
          "zymotic rate(‰)": 822.8,
          "wound rate(‰)": 16.3,
          "other rate(‰)": 140.1
        }, {
          "month": "01/03/1855",
          "army size": 30107,
          "death number by zymotic": 1205,
          "death number by wound": 32,
          "death number by other": 172,
          "zymotic rate(‰)": 480.3,
          "wound rate(‰)": 12.8,
          "other rate(‰)": 68.6
        }, {
          "month": "01/04/1855",
          "army size": 32252,
          "death number by zymotic": 477,
          "death number by wound": 48,
          "death number by other": 57,
          "zymotic rate(‰)": 177.5,
          "wound rate(‰)": 17.9,
          "other rate(‰)": 21.2
        }, {
          "month": "01/05/1855",
          "army size": 35473,
          "death number by zymotic": 508,
          "death number by wound": 49,
          "death number by other": 37,
          "zymotic rate(‰)": 171.8,
          "wound rate(‰)": 16.6,
          "other rate(‰)": 12.5
        }, {
          "month": "01/06/1855",
          "army size": 38863,
          "death number by zymotic": 802,
          "death number by wound": 209,
          "death number by other": 31,
          "zymotic rate(‰)": 247.6,
          "wound rate(‰)": 64.5,
          "other rate(‰)": 9.6
        }, {
          "month": "01/07/1855",
          "army size": 42647,
          "death number by zymotic": 382,
          "death number by wound": 134,
          "death number by other": 33,
          "zymotic rate(‰)": 107.5,
          "wound rate(‰)": 37.7,
          "other rate(‰)": 9.3
        }, {
          "month": "01/08/1855",
          "army size": 44614,
          "death number by zymotic": 483,
          "death number by wound": 164,
          "death number by other": 25,
          "zymotic rate(‰)": 129.9,
          "wound rate(‰)": 44.1,
          "other rate(‰)": 6.7
        }, {
          "month": "01/09/1855",
          "army size": 47751,
          "death number by zymotic": 189,
          "death number by wound": 276,
          "death number by other": 20,
          "zymotic rate(‰)": 47.5,
          "wound rate(‰)": 69.4,
          "other rate(‰)": 5
        }, {
          "month": "01/10/1855",
          "army size": 46852,
          "death number by zymotic": 128,
          "death number by wound": 53,
          "death number by other": 18,
          "zymotic rate(‰)": 32.8,
          "wound rate(‰)": 13.6,
          "other rate(‰)": 4.6
        }, {
          "month": "01/11/1855",
          "army size": 37853,
          "death number by zymotic": 178,
          "death number by wound": 33,
          "death number by other": 32,
          "zymotic rate(‰)": 56.4,
          "wound rate(‰)": 10.5,
          "other rate(‰)": 10.1
        }, {
          "month": "01/12/1855",
          "army size": 43217,
          "death number by zymotic": 91,
          "death number by wound": 18,
          "death number by other": 28,
          "zymotic rate(‰)": 25.3,
          "wound rate(‰)": 5,
          "other rate(‰)": 7.8
        }, {
          "month": "01/01/1856",
          "army size": 44212,
          "death number by zymotic": 42,
          "death number by wound": 2,
          "death number by other": 48,
          "zymotic rate(‰)": 11.4,
          "wound rate(‰)": 0.5,
          "other rate(‰)": 13
        }, {
          "month": "01/02/1856",
          "army size": 43485,
          "death number by zymotic": 24,
          "death number by wound": 0,
          "death number by other": 19,
          "zymotic rate(‰)": 6.6,
          "wound rate(‰)": 0,
          "other rate(‰)": 5.2
        }, {
          "month": "01/03/1856",
          "army size": 46140,
          "death number by zymotic": 15,
          "death number by wound": 0,
          "death number by other": 35,
          "zymotic rate(‰)": 3.9,
          "wound rate(‰)": 0,
          "other rate(‰)": 9.1
        }
      ]
    }, {
      key: "/dataset/sample/:joblesstaiwan",
      name: "台灣五都失業率與低收入戶",
      size: 1765,
      rows: 71,
      color: '#ddd',
      _type: {
        location: 'sample',
        name: 'dataset'
      },
      fields: [
        {
          name: "縣市名",
          type: 'String'
        }, {
          name: "年度",
          type: 'Date'
        }, {
          name: "失業率",
          type: 'Number'
        }, {
          name: "低收入戶數",
          type: 'Number'
        }
      ].map(function(it){
        return it.dataset = {
          type: {
            location: 'sample',
            name: 'data'
          },
          name: "台灣五都失業率與低收入戶",
          key: "/dataset/sample/:joblesstaiwan"
        }, it;
      }),
      data: [
        {
          "縣市名": "臺北市",
          "年度": 1998,
          "失業率": 2.6,
          "低收入戶數": 17270
        }, {
          "縣市名": "臺北市",
          "年度": 1999,
          "失業率": 2.9,
          "低收入戶數": 19843
        }, {
          "縣市名": "臺北市",
          "年度": 2000,
          "失業率": 2.7,
          "低收入戶數": 22706
        }, {
          "縣市名": "臺北市",
          "年度": 2001,
          "失業率": 3.9,
          "低收入戶數": 24760
        }, {
          "縣市名": "臺北市",
          "年度": 2002,
          "失業率": 4.6,
          "低收入戶數": 27184
        }, {
          "縣市名": "臺北市",
          "年度": 2003,
          "失業率": 4.6,
          "低收入戶數": 33071
        }, {
          "縣市名": "臺北市",
          "年度": 2004,
          "失業率": 4.2,
          "低收入戶數": 40184
        }, {
          "縣市名": "臺北市",
          "年度": 2005,
          "失業率": 3.9,
          "低收入戶數": 32146
        }, {
          "縣市名": "臺北市",
          "年度": 2006,
          "失業率": 3.7,
          "低收入戶數": 33437
        }, {
          "縣市名": "臺北市",
          "年度": 2007,
          "失業率": 3.7,
          "低收入戶數": 34752
        }, {
          "縣市名": "臺北市",
          "年度": 2008,
          "失業率": 4,
          "低收入戶數": 36274
        }, {
          "縣市名": "臺北市",
          "年度": 2009,
          "失業率": 5.8,
          "低收入戶數": 40708
        }, {
          "縣市名": "臺北市",
          "年度": 2010,
          "失業率": 5.2,
          "低收入戶數": 43823
        }, {
          "縣市名": "臺北市",
          "年度": 2011,
          "失業率": 4.4,
          "低收入戶數": 47597
        }, {
          "縣市名": "新北市",
          "年度": 1998,
          "失業率": 2.8,
          "低收入戶數": 12811
        }, {
          "縣市名": "新北市",
          "年度": 1999,
          "失業率": 3,
          "低收入戶數": 14386
        }, {
          "縣市名": "新北市",
          "年度": 2000,
          "失業率": 3,
          "低收入戶數": 17196
        }, {
          "縣市名": "新北市",
          "年度": 2001,
          "失業率": 4.9,
          "低收入戶數": 18351
        }, {
          "縣市名": "新北市",
          "年度": 2002,
          "失業率": 5.5,
          "低收入戶數": 20741
        }, {
          "縣市名": "新北市",
          "年度": 2003,
          "失業率": 5.2,
          "低收入戶數": 20579
        }, {
          "縣市名": "新北市",
          "年度": 2004,
          "失業率": 4.6,
          "低收入戶數": 22396
        }, {
          "縣市名": "新北市",
          "年度": 2005,
          "失業率": 4.1,
          "低收入戶數": 24563
        }, {
          "縣市名": "新北市",
          "年度": 2006,
          "失業率": 3.8,
          "低收入戶數": 26887
        }, {
          "縣市名": "新北市",
          "年度": 2007,
          "失業率": 3.8,
          "低收入戶數": 27399
        }, {
          "縣市名": "新北市",
          "年度": 2008,
          "失業率": 4.1,
          "低收入戶數": 24835
        }, {
          "縣市名": "新北市",
          "年度": 2009,
          "失業率": 5.9,
          "低收入戶數": 32357
        }, {
          "縣市名": "新北市",
          "年度": 2010,
          "失業率": 5.2,
          "低收入戶數": 38172
        }, {
          "縣市名": "新北市",
          "年度": 2011,
          "失業率": 4.4,
          "低收入戶數": 49389
        }, {
          "縣市名": "臺中市",
          "年度": 1998,
          "失業率": 2.6,
          "低收入戶數": 4795
        }, {
          "縣市名": "臺中市",
          "年度": 1999,
          "失業率": 3.1,
          "低收入戶數": 5352
        }, {
          "縣市名": "臺中市",
          "年度": 2000,
          "失業率": 3.4,
          "低收入戶數": 6056
        }, {
          "縣市名": "臺中市",
          "年度": 2001,
          "失業率": 4.9,
          "低收入戶數": 6695
        }, {
          "縣市名": "臺中市",
          "年度": 2002,
          "失業率": 5.4,
          "低收入戶數": 8108
        }, {
          "縣市名": "臺中市",
          "年度": 2003,
          "失業率": 5.3,
          "低收入戶數": 8731
        }, {
          "縣市名": "臺中市",
          "年度": 2004,
          "失業率": 4.6,
          "低收入戶數": 10275
        }, {
          "縣市名": "臺中市",
          "年度": 2005,
          "失業率": 4.2,
          "低收入戶數": 12333
        }, {
          "縣市名": "臺中市",
          "年度": 2006,
          "失業率": 4.1,
          "低收入戶數": 13531
        }, {
          "縣市名": "臺中市",
          "年度": 2007,
          "失業率": 4,
          "低收入戶數": 13894
        }, {
          "縣市名": "臺中市",
          "年度": 2008,
          "失業率": 4.2,
          "低收入戶數": 14666
        }, {
          "縣市名": "臺中市",
          "年度": 2009,
          "失業率": 5.9,
          "低收入戶數": 18790
        }, {
          "縣市名": "臺中市",
          "年度": 2010,
          "失業率": 5.2,
          "低收入戶數": 19414
        }, {
          "縣市名": "臺中市",
          "年度": 2011,
          "失業率": 4.4,
          "低收入戶數": 21217
        }, {
          "縣市名": "臺南市",
          "年度": 1998,
          "失業率": 3.2,
          "低收入戶數": 7193
        }, {
          "縣市名": "臺南市",
          "年度": 1999,
          "失業率": 3.7,
          "低收入戶數": 7229
        }, {
          "縣市名": "臺南市",
          "年度": 2000,
          "失業率": 3.6,
          "低收入戶數": 8007
        }, {
          "縣市名": "臺南市",
          "年度": 2001,
          "失業率": 4.8,
          "低收入戶數": 7889
        }, {
          "縣市名": "臺南市",
          "年度": 2002,
          "失業率": 5,
          "低收入戶數": 8727
        }, {
          "縣市名": "臺南市",
          "年度": 2003,
          "失業率": 4.9,
          "低收入戶數": 9555
        }, {
          "縣市名": "臺南市",
          "年度": 2004,
          "失業率": 4.5,
          "低收入戶數": 9678
        }, {
          "縣市名": "臺南市",
          "年度": 2005,
          "失業率": 4.1,
          "低收入戶數": 10481
        }, {
          "縣市名": "臺南市",
          "年度": 2006,
          "失業率": 3.8,
          "低收入戶數": 11669
        }, {
          "縣市名": "臺南市",
          "年度": 2007,
          "失業率": 3.9,
          "低收入戶數": 12282
        }, {
          "縣市名": "臺南市",
          "年度": 2008,
          "失業率": 4.1,
          "低收入戶數": 13411
        }, {
          "縣市名": "臺南市",
          "年度": 2009,
          "失業率": 5.8,
          "低收入戶數": 16801
        }, {
          "縣市名": "臺南市",
          "年度": 2010,
          "失業率": 5.1,
          "低收入戶數": 19185
        }, {
          "縣市名": "臺南市",
          "年度": 2011,
          "失業率": 4.3,
          "低收入戶數": 23771
        }, {
          "縣市名": "高雄市",
          "年度": 1998,
          "失業率": 3.1,
          "低收入戶數": 17849
        }, {
          "縣市名": "高雄市",
          "年度": 1999,
          "失業率": 3.7,
          "低收入戶數": 20150
        }, {
          "縣市名": "高雄市",
          "年度": 2000,
          "失業率": 3.9,
          "低收入戶數": 22431
        }, {
          "縣市名": "高雄市",
          "年度": 2001,
          "失業率": 5,
          "低收入戶數": 18253
        }, {
          "縣市名": "高雄市",
          "年度": 2002,
          "失業率": 5.5,
          "低收入戶數": 20432
        }, {
          "縣市名": "高雄市",
          "年度": 2003,
          "失業率": 5.3,
          "低收入戶數": 21498
        }, {
          "縣市名": "高雄市",
          "年度": 2004,
          "失業率": 4.6,
          "低收入戶數": 23391
        }, {
          "縣市名": "高雄市",
          "年度": 2005,
          "失業率": 4.2,
          "低收入戶數": 24965
        }, {
          "縣市名": "高雄市",
          "年度": 2006,
          "失業率": 4.1,
          "低收入戶數": 25675
        }, {
          "縣市名": "高雄市",
          "年度": 2007,
          "失業率": 4.1,
          "低收入戶數": 26860
        }, {
          "縣市名": "高雄市",
          "年度": 2008,
          "失業率": 4.3,
          "低收入戶數": 30573
        }, {
          "縣市名": "高雄市",
          "年度": 2009,
          "失業率": 5.9,
          "低收入戶數": 35514
        }, {
          "縣市名": "高雄市",
          "年度": 2010,
          "失業率": 5.2,
          "低收入戶數": 38702
        }, {
          "縣市名": "高雄市",
          "年度": 2011,
          "失業率": 4.4,
          "低收入戶數": 50426
        }
      ]
    }, {
      key: "/dataset/sample/:goldprice2000",
      name: "Gold Price(2000)",
      size: 481,
      rows: 12,
      color: '#ddd',
      _type: {
        location: 'sample',
        name: 'dataset'
      },
      fields: [
        {
          name: "date",
          type: 'Date'
        }, {
          name: "price",
          type: 'Number'
        }
      ].map(function(it){
        return it.dataset = {
          type: {
            location: 'sample',
            name: 'data'
          },
          name: "Gold Price(2000)",
          key: "/dataset/sample/:goldprice2000"
        }, it;
      }),
      data: [
        {
          "date": "2000-01-01",
          "price": "284.590"
        }, {
          "date": "2000-02-01",
          "price": "300.855"
        }, {
          "date": "2000-03-01",
          "price": "286.704"
        }, {
          "date": "2000-04-01",
          "price": "279.961"
        }, {
          "date": "2000-05-01",
          "price": "275.293"
        }, {
          "date": "2000-06-01",
          "price": "285.368"
        }, {
          "date": "2000-07-01",
          "price": "282.152"
        }, {
          "date": "2000-08-01",
          "price": "274.523"
        }, {
          "date": "2000-09-01",
          "price": "273.676"
        }, {
          "date": "2000-10-01",
          "price": "270.405"
        }, {
          "date": "2000-11-01",
          "price": "265.989"
        }, {
          "date": "2000-12-01",
          "price": "271.892"
        }
      ]
    }, {
      key: "/dataset/sample/:population2000",
      name: "World Population(2000)",
      size: 12355,
      rows: 287,
      color: '#ddd',
      _type: {
        location: 'sample',
        name: 'dataset'
      },
      fields: [
        {
          name: "Country",
          type: 'String'
        }, {
          name: "Population",
          type: 'Number'
        }
      ].map(function(it){
        return it.dataset = {
          type: {
            location: 'sample',
            name: 'data'
          },
          name: "World Population(2000)",
          key: "/dataset/sample/:population2000"
        }, it;
      }),
      data: [
        {
          "Country": "Arab World",
          "Population": "277550423"
        }, {
          "Country": "Caribbean small states",
          "Population": "6431380"
        }, {
          "Country": "Central Europe and the Baltics",
          "Population": "108405522"
        }, {
          "Country": "East Asia & Pacific (all income levels)",
          "Population": "2043352556"
        }, {
          "Country": "East Asia & Pacific (developing only)",
          "Population": "1812175348"
        }, {
          "Country": "Euro area",
          "Population": "321107647"
        }, {
          "Country": "Europe & Central Asia (all income levels)",
          "Population": "862087806"
        }, {
          "Country": "Europe & Central Asia (developing only)",
          "Population": "246067877"
        }, {
          "Country": "European Union",
          "Population": "487975692"
        }, {
          "Country": "Fragile and conflict affected situations",
          "Population": "334545176"
        }, {
          "Country": "Heavily indebted poor countries (HIPC)",
          "Population": "472726491"
        }, {
          "Country": "High income",
          "Population": "1282297798"
        }, {
          "Country": "High income: nonOECD",
          "Population": "293059239"
        }, {
          "Country": "High income: OECD",
          "Population": "989238559"
        }, {
          "Country": "Latin America & Caribbean (all income levels)",
          "Population": "525299778"
        }, {
          "Country": "Latin America & Caribbean (developing only)",
          "Population": "438994368"
        }, {
          "Country": "Least developed countries: UN classification",
          "Population": "663076857"
        }, {
          "Country": "Low & middle income",
          "Population": "4819659593"
        }, {
          "Country": "Low income",
          "Population": "425003913"
        }, {
          "Country": "Lower middle income",
          "Population": "2293345046"
        }, {
          "Country": "Middle East & North Africa (all income levels)",
          "Population": "311780217"
        }, {
          "Country": "Middle East & North Africa (developing only)",
          "Population": "276578220"
        }, {
          "Country": "Middle income",
          "Population": "4394655680"
        }, {
          "Country": "North America",
          "Population": "312993944"
        }, {
          "Country": "OECD members",
          "Population": "1156286649"
        }, {
          "Country": "Other small states",
          "Population": "16215836"
        }, {
          "Country": "Pacific island small states",
          "Population": "1952589"
        }, {
          "Country": "Small states",
          "Population": "24599805"
        }, {
          "Country": "South Asia",
          "Population": "1382195669"
        }, {
          "Country": "Sub-Saharan Africa (all income levels)",
          "Population": "664247421"
        }, {
          "Country": "Sub-Saharan Africa (developing only)",
          "Population": "663648111"
        }, {
          "Country": "Upper middle income",
          "Population": "2101310634"
        }, {
          "Country": "World",
          "Population": "6101957391"
        }, {
          "Country": "Afghanistan",
          "Population": "20595360"
        }, {
          "Country": "Albania",
          "Population": "3089027"
        }, {
          "Country": "Algeria",
          "Population": "31719449"
        }, {
          "Country": "American Samoa",
          "Population": "57522"
        }, {
          "Country": "Andorra",
          "Population": "65399"
        }, {
          "Country": "Angola",
          "Population": "13924930"
        }, {
          "Country": "Antigua and Barbuda",
          "Population": "77648"
        }, {
          "Country": "Argentina",
          "Population": "36903067"
        }, {
          "Country": "Armenia",
          "Population": "3076098"
        }, {
          "Country": "Aruba",
          "Population": "90858"
        }, {
          "Country": "Australia",
          "Population": "19153000"
        }, {
          "Country": "Austria",
          "Population": "8011566"
        }, {
          "Country": "Azerbaijan",
          "Population": "8048600"
        }, {
          "Country": "Bahamas, The",
          "Population": "297759"
        }, {
          "Country": "Bahrain",
          "Population": "668239"
        }, {
          "Country": "Bangladesh",
          "Population": "132383265"
        }, {
          "Country": "Barbados",
          "Population": "267190"
        }, {
          "Country": "Belarus",
          "Population": "10005000"
        }, {
          "Country": "Belgium",
          "Population": "10251250"
        }, {
          "Country": "Belize",
          "Population": "238586"
        }, {
          "Country": "Benin",
          "Population": "6949366"
        }, {
          "Country": "Bermuda",
          "Population": "61833"
        }, {
          "Country": "Bhutan",
          "Population": "564350"
        }, {
          "Country": "Bolivia",
          "Population": "8495271"
        }, {
          "Country": "Bosnia and Herzegovina",
          "Population": "3834364"
        }, {
          "Country": "Botswana",
          "Population": "1755375"
        }, {
          "Country": "Brazil",
          "Population": "174504898"
        }, {
          "Country": "Brunei Darussalam",
          "Population": "331801"
        }, {
          "Country": "Bulgaria",
          "Population": "8170172"
        }, {
          "Country": "Burkina Faso",
          "Population": "11607944"
        }, {
          "Country": "Burundi",
          "Population": "6674286"
        }, {
          "Country": "Cabo Verde",
          "Population": "442426"
        }, {
          "Country": "Cambodia",
          "Population": "12222871"
        }, {
          "Country": "Cameroon",
          "Population": "15927713"
        }, {
          "Country": "Canada",
          "Population": "30769700"
        }, {
          "Country": "Cayman Islands",
          "Population": "41685"
        }, {
          "Country": "Central African Republic",
          "Population": "3638316"
        }, {
          "Country": "Chad",
          "Population": "8301151"
        }, {
          "Country": "Channel Islands",
          "Population": "148725"
        }, {
          "Country": "Chile",
          "Population": "15454402"
        }, {
          "Country": "China",
          "Population": "1262645000"
        }, {
          "Country": "Colombia",
          "Population": "39897984"
        }, {
          "Country": "Comoros",
          "Population": "528312"
        }, {
          "Country": "Congo, Dem. Rep.",
          "Population": "46949244"
        }, {
          "Country": "Congo, Rep.",
          "Population": "3126204"
        }, {
          "Country": "Costa Rica",
          "Population": "3929588"
        }, {
          "Country": "Cote d'Ivoire",
          "Population": "16131332"
        }, {
          "Country": "Croatia",
          "Population": "4426000"
        }, {
          "Country": "Cuba",
          "Population": "11138416"
        }, {
          "Country": "Curacao",
          "Population": "133860"
        }, {
          "Country": "Cyprus",
          "Population": "943287"
        }, {
          "Country": "Czech Republic",
          "Population": "10255063"
        }, {
          "Country": "Denmark",
          "Population": "5339616"
        }, {
          "Country": "Djibouti",
          "Population": "722887"
        }, {
          "Country": "Dominica",
          "Population": "69679"
        }, {
          "Country": "Dominican Republic",
          "Population": "8663421"
        }, {
          "Country": "Ecuador",
          "Population": "12533087"
        }, {
          "Country": "Egypt, Arab Rep.",
          "Population": "66136590"
        }, {
          "Country": "El Salvador",
          "Population": "5958794"
        }, {
          "Country": "Equatorial Guinea",
          "Population": "518179"
        }, {
          "Country": "Eritrea",
          "Population": "3939348"
        }, {
          "Country": "Estonia",
          "Population": "1396985"
        }, {
          "Country": "Ethiopia",
          "Population": "66024199"
        }, {
          "Country": "Faeroe Islands",
          "Population": "46491"
        }, {
          "Country": "Fiji",
          "Population": "811647"
        }, {
          "Country": "Finland",
          "Population": "5176209"
        }, {
          "Country": "France",
          "Population": "60911057"
        }, {
          "Country": "French Polynesia",
          "Population": "237267"
        }, {
          "Country": "Gabon",
          "Population": "1225527"
        }, {
          "Country": "Gambia, The",
          "Population": "1228863"
        }, {
          "Country": "Georgia",
          "Population": "4418300"
        }, {
          "Country": "Germany",
          "Population": "82211508"
        }, {
          "Country": "Ghana",
          "Population": "18825034"
        }, {
          "Country": "Greece",
          "Population": "10917482"
        }, {
          "Country": "Greenland",
          "Population": "56200"
        }, {
          "Country": "Grenada",
          "Population": "101620"
        }, {
          "Country": "Guam",
          "Population": "155328"
        }, {
          "Country": "Guatemala",
          "Population": "11204183"
        }, {
          "Country": "Guinea",
          "Population": "8746128"
        }, {
          "Country": "Guinea-Bissau",
          "Population": "1273312"
        }, {
          "Country": "Guyana",
          "Population": "744471"
        }, {
          "Country": "Haiti",
          "Population": "8578234"
        }, {
          "Country": "Honduras",
          "Population": "6235561"
        }, {
          "Country": "Hong Kong SAR, China",
          "Population": "6665000"
        }, {
          "Country": "Hungary",
          "Population": "10210971"
        }, {
          "Country": "Iceland",
          "Population": "281205"
        }, {
          "Country": "India",
          "Population": "1042261758"
        }, {
          "Country": "Indonesia",
          "Population": "208938698"
        }, {
          "Country": "Iran, Islamic Rep.",
          "Population": "65911052"
        }, {
          "Country": "Iraq",
          "Population": "23801156"
        }, {
          "Country": "Ireland",
          "Population": "3805174"
        }, {
          "Country": "Isle of Man",
          "Population": "76806"
        }, {
          "Country": "Israel",
          "Population": "6289000"
        }, {
          "Country": "Italy",
          "Population": "56942108"
        }, {
          "Country": "Jamaica",
          "Population": "2589389"
        }, {
          "Country": "Japan",
          "Population": "126843000"
        }, {
          "Country": "Jordan",
          "Population": "4797000"
        }, {
          "Country": "Kazakhstan",
          "Population": "14883626"
        }, {
          "Country": "Kenya",
          "Population": "31285050"
        }, {
          "Country": "Kiribati",
          "Population": "82788"
        }, {
          "Country": "Korea, Dem. Rep.",
          "Population": "22840225"
        }, {
          "Country": "Korea, Rep.",
          "Population": "47008111"
        }, {
          "Country": "Kosovo",
          "Population": "1700000"
        }, {
          "Country": "Kuwait",
          "Population": "1906231"
        }, {
          "Country": "Kyrgyz Republic",
          "Population": "4898400"
        }, {
          "Country": "Lao PDR",
          "Population": "5388281"
        }, {
          "Country": "Latvia",
          "Population": "2367550"
        }, {
          "Country": "Lebanon",
          "Population": "3235380"
        }, {
          "Country": "Lesotho",
          "Population": "1856225"
        }, {
          "Country": "Liberia",
          "Population": "2891968"
        }, {
          "Country": "Libya",
          "Population": "5176185"
        }, {
          "Country": "Liechtenstein",
          "Population": "33093"
        }, {
          "Country": "Lithuania",
          "Population": "3499536"
        }, {
          "Country": "Luxembourg",
          "Population": "436300"
        }, {
          "Country": "Macao SAR, China",
          "Population": "431907"
        }, {
          "Country": "Macedonia, FYR",
          "Population": "2052129"
        }, {
          "Country": "Madagascar",
          "Population": "15744811"
        }, {
          "Country": "Malawi",
          "Population": "11321496"
        }, {
          "Country": "Malaysia",
          "Population": "23420751"
        }, {
          "Country": "Maldives",
          "Population": "272745"
        }, {
          "Country": "Mali",
          "Population": "10260577"
        }, {
          "Country": "Malta",
          "Population": "381363"
        }, {
          "Country": "Marshall Islands",
          "Population": "52161"
        }, {
          "Country": "Mauritania",
          "Population": "2708095"
        }, {
          "Country": "Mauritius",
          "Population": "1186873"
        }, {
          "Country": "Mexico",
          "Population": "103873607"
        }, {
          "Country": "Micronesia, Fed. Sts.",
          "Population": "107430"
        }, {
          "Country": "Moldova",
          "Population": "3639592"
        }, {
          "Country": "Monaco",
          "Population": "32081"
        }, {
          "Country": "Mongolia",
          "Population": "2397473"
        }, {
          "Country": "Montenegro",
          "Population": "604950"
        }, {
          "Country": "Morocco",
          "Population": "28710123"
        }, {
          "Country": "Mozambique",
          "Population": "18275618"
        }, {
          "Country": "Myanmar",
          "Population": "48453000"
        }, {
          "Country": "Namibia",
          "Population": "1897953"
        }, {
          "Country": "Nepal",
          "Population": "23184177"
        }, {
          "Country": "Netherlands",
          "Population": "15925513"
        }, {
          "Country": "New Caledonia",
          "Population": "213230"
        }, {
          "Country": "New Zealand",
          "Population": "3857700"
        }, {
          "Country": "Nicaragua",
          "Population": "5100920"
        }, {
          "Country": "Niger",
          "Population": "10989815"
        }, {
          "Country": "Nigeria",
          "Population": "122876727"
        }, {
          "Country": "Northern Mariana Islands",
          "Population": "68434"
        }, {
          "Country": "Norway",
          "Population": "4490967"
        }, {
          "Country": "Oman",
          "Population": "2192535"
        }, {
          "Country": "Pakistan",
          "Population": "143832014"
        }, {
          "Country": "Palau",
          "Population": "19174"
        }, {
          "Country": "Panama",
          "Population": "3054812"
        }, {
          "Country": "Papua New Guinea",
          "Population": "5379226"
        }, {
          "Country": "Paraguay",
          "Population": "5350253"
        }, {
          "Country": "Peru",
          "Population": "26000080"
        }, {
          "Country": "Philippines",
          "Population": "77651848"
        }, {
          "Country": "Poland",
          "Population": "38258629"
        }, {
          "Country": "Portugal",
          "Population": "10289898"
        }, {
          "Country": "Puerto Rico",
          "Population": "3810605"
        }, {
          "Country": "Qatar",
          "Population": "593693"
        }, {
          "Country": "Romania",
          "Population": "22442971"
        }, {
          "Country": "Russian Federation",
          "Population": "146596557"
        }, {
          "Country": "Rwanda",
          "Population": "8395577"
        }, {
          "Country": "Samoa",
          "Population": "174614"
        }, {
          "Country": "San Marino",
          "Population": "26969"
        }, {
          "Country": "Sao Tome and Principe",
          "Population": "139428"
        }, {
          "Country": "Saudi Arabia",
          "Population": "20144584"
        }, {
          "Country": "Senegal",
          "Population": "9861679"
        }, {
          "Country": "Serbia",
          "Population": "7516346"
        }, {
          "Country": "Seychelles",
          "Population": "81131"
        }, {
          "Country": "Sierra Leone",
          "Population": "4139757"
        }, {
          "Country": "Singapore",
          "Population": "4027900"
        }, {
          "Country": "Sint Maarten (Dutch part)",
          "Population": "30519"
        }, {
          "Country": "Slovak Republic",
          "Population": "5388720"
        }, {
          "Country": "Slovenia",
          "Population": "1988925"
        }, {
          "Country": "Solomon Islands",
          "Population": "412336"
        }, {
          "Country": "Somalia",
          "Population": "7385416"
        }, {
          "Country": "South Africa",
          "Population": "44000000"
        }, {
          "Country": "South Sudan",
          "Population": "6652984"
        }, {
          "Country": "Spain",
          "Population": "40263216"
        }, {
          "Country": "Sri Lanka",
          "Population": "19102000"
        }, {
          "Country": "St. Kitts and Nevis",
          "Population": "45544"
        }, {
          "Country": "St. Lucia",
          "Population": "156949"
        }, {
          "Country": "St. Martin (French part)",
          "Population": "28384"
        }, {
          "Country": "St. Vincent and the Grenadines",
          "Population": "107897"
        }, {
          "Country": "Sudan",
          "Population": "27729798"
        }, {
          "Country": "Suriname",
          "Population": "466668"
        }, {
          "Country": "Swaziland",
          "Population": "1063715"
        }, {
          "Country": "Sweden",
          "Population": "8872109"
        }, {
          "Country": "Switzerland",
          "Population": "7184250"
        }, {
          "Country": "Syrian Arab Republic",
          "Population": "16371208"
        }, {
          "Country": "Tajikistan",
          "Population": "6186152"
        }, {
          "Country": "Tanzania",
          "Population": "34020512"
        }, {
          "Country": "Thailand",
          "Population": "62343379"
        }, {
          "Country": "Timor-Leste",
          "Population": "853585"
        }, {
          "Country": "Togo",
          "Population": "4864753"
        }, {
          "Country": "Tonga",
          "Population": "97962"
        }, {
          "Country": "Trinidad and Tobago",
          "Population": "1267980"
        }, {
          "Country": "Tunisia",
          "Population": "9552500"
        }, {
          "Country": "Turkey",
          "Population": "63174483"
        }, {
          "Country": "Turkmenistan",
          "Population": "4501419"
        }, {
          "Country": "Turks and Caicos Islands",
          "Population": "18876"
        }, {
          "Country": "Tuvalu",
          "Population": "9419"
        }, {
          "Country": "Uganda",
          "Population": "24275641"
        }, {
          "Country": "Ukraine",
          "Population": "49175848"
        }, {
          "Country": "United Arab Emirates",
          "Population": "3026352"
        }, {
          "Country": "United Kingdom",
          "Population": "58892514"
        }, {
          "Country": "United States",
          "Population": "282162411"
        }, {
          "Country": "Uruguay",
          "Population": "3320841"
        }, {
          "Country": "Uzbekistan",
          "Population": "24650400"
        }, {
          "Country": "Vanuatu",
          "Population": "185058"
        }, {
          "Country": "Venezuela, RB",
          "Population": "24407553"
        }, {
          "Country": "Vietnam",
          "Population": "77630900"
        }, {
          "Country": "Virgin Islands (U.S.)",
          "Population": "108639"
        }, {
          "Country": "West Bank and Gaza",
          "Population": "2922153"
        }, {
          "Country": "Yemen, Rep.",
          "Population": "17522537"
        }, {
          "Country": "Zambia",
          "Population": "10100981"
        }, {
          "Country": "Zimbabwe",
          "Population": "12503652"
        }
      ]
    }
  ];
}));// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('dataService', ['$rootScope', '$http', 'IOService', 'sampleData', 'baseService', 'plNotify', 'eventBus', 'plConfig'].concat(function($rootScope, $http, IOService, sampleData, baseService, plNotify, eventBus, plConfig){
  var name, service, Field, Dataset, dataService;
  name = 'dataset';
  service = {
    link: function(dataset){
      if (dataset._type.location === 'server') {
        return "/dataset/" + dataset.key + "/";
      }
      return "/dataset/?k=c" + dataset.key;
    },
    cache: {},
    cachedLoad: function(_type, key){
      if (_type.location === 'local') {
        return this.load(_type, key);
      }
      if (this.cache[key]) {
        Promise.resolve(this.cache[key]);
      }
      return this.load(_type, key);
    },
    list: function(){
      return IOService.listRemotely({
        name: 'dataset',
        location: 'server'
      }).then(function(r){
        return r.map(function(it){
          return new Dataset(it);
        });
      });
    },
    init: function(){},
    localinfo: {
      rows: 0,
      size: 0,
      update: function(){
        var i$, ref$, len$, item, results$ = [];
        this.rows = 0;
        this.size = 0;
        for (i$ = 0, len$ = (ref$ = service.items).length; i$ < len$; ++i$) {
          item = ref$[i$];
          if (item._type.location === 'local') {
            this.rows += item.rows;
            results$.push(this.size += item.size);
          }
        }
        return results$;
      }
    }
  };
  Field = function(config){
    import$((this.dataset = null, this.location = 'server', this.name = null, this.datatype = null, this.data = [], this), config);
    return this;
  };
  Field.prototype = {
    update: function(){
      var this$ = this;
      if (this.location === 'sample') {
        return Promise.resolve(this);
      }
      return dataService.cachedLoad({
        location: this.location,
        name: 'dataset'
      }, this.dataset).then(function(dataset){
        var matched;
        matched = dataset.fields.filter(function(it){
          return it.name === this$.name;
        })[0];
        if (!matched) {
          return console.error("failed to update field data");
        }
        return import$(this$, matched);
      });
    }
    /*
    #toJson: -> angular.toJson(@{name, type} <<< {dataset: @dataset{type, key}})
    #TODO this might be called individually. should propagate to dataset?
    update: ->
      # failed only if remote dataset fetching failed
      (dataset) <~ @get-dataset!then
      if !dataset => return # standalone field won't need to update
      @data = dataset.[]data.map(~>it[@name])
      @settype!
    set-dataset: (dataset = null) -> # set null to clear dataset
      #if !dataset.type or !dataset.key => return Promise.reject(null)
      #(ret) <~ dataService.load dataset.type, dataset.key .then
      @_.dataset = dataset
      if dataset and dataset._type and dataset.key =>
        @dataset <<< dataset{_type, key} <<< {name: dataset.name}
      else @dataset._type <<< {_type: {}, key: null, name: null}
      Promise.resolve(dataset)
    get-dataset: -> # provide dataset or null for standalone field
      if @_.dataset => return Promise.resolve(that)
      if !@dataset._type or !@dataset.key => return Promise.resolve(null)
      (ret) <~ dataService.load @dataset._type, @dataset.key .then
      @_.dataset = ret
      @dataset <<< ret{_type, key} <<< {name: ret.name}
      @_.dataset
    settype: ->
      types = <[Boolean Percent Number Date String]> ++ [null]
      for type in types =>
        if !type => return @type = \String
        if !@data.map(-> plotdb[type]test it).filter(->!it).length =>
          @type = type
          break
    */
  };
  Dataset = function(config){
    import$(this, {
      name: "",
      description: "",
      type: "static",
      format: "csv",
      owner: null,
      createdtime: new Date(),
      modifiedtime: new Date(),
      permission: {
        'switch': 'publish',
        list: []
      },
      fields: [],
      _type: {
        location: 'server',
        name: 'dataset'
      }
    });
    import$(this, config);
    this.setFields(this.fields);
    return this;
  };
  Dataset.prototype = {
    setFields: function(fields){
      var res$, k, v, i$, ref$, len$, f1, j$, len1$, f2, this$ = this, results$ = [];
      fields == null && (fields = null);
      if (!fields || typeof fields !== 'object') {
        return;
      }
      if (!Array.isArray(fields)) {
        res$ = [];
        for (k in fields) {
          v = fields[k];
          res$.push({
            name: k,
            data: v
          });
        }
        fields = res$;
      }
      fields = fields.map(function(it){
        return new Field((it.dataset = this$.key, it.datasetname = this$.name, it.location = this$._type.location, it));
      });
      for (i$ = 0, len$ = (ref$ = this.fields).length; i$ < len$; ++i$) {
        f1 = ref$[i$];
        for (j$ = 0, len1$ = fields.length; j$ < len1$; ++j$) {
          f2 = fields[j$];
          if (f1.name !== f2.name) {
            continue;
          }
          f2.key = f1.key;
        }
      }
      this.fields = fields;
      this.rows = this.rows || ((ref$ = this.fields[0] || {}).data || (ref$.data = [])).length;
      this.size = 0;
      for (i$ = 0, len$ = (ref$ = this.fields).length; i$ < len$; ++i$) {
        f1 = ref$[i$];
        results$.push(this.size += (f1.data || "").length + ((f1.name || "").length + 1));
      }
      return results$;
    },
    update: function(){}
  };
  service.Field = Field;
  dataService = baseService.derive(name, service, Dataset);
  dataService.sample = sampleData.map(function(it){
    return new Dataset(it);
  });
  return dataService;
}));
x$.controller('dataFiles', ['$scope', 'dataService', 'plNotify', 'eventBus'].concat(function($scope, dataService, plNotify, eventBus){
  $scope.datasets = dataService.datasets;
  return dataService.list().then(function(ret){
    $scope.datasets = ret;
    $scope.edit = function(dataset){
      return eventBus.fire('dataset.edit', dataset);
    };
    $scope.chosen = {
      dataset: null,
      key: null
    };
    $scope.toggle = function(dataset){
      var ref$;
      if (!dataset || this.chosen.key === dataset.key) {
        return ref$ = this.chosen, ref$.dataset = null, ref$.key = null, ref$;
      }
      this.chosen.key = dataset.key;
      return this.chosen.dataset = dataset;
    };
    return $scope['delete'] = function(dataset){
      var this$ = this;
      return dataset['delete']().then(function(){
        return $scope.$apply(function(){
          return $scope.datasets = $scope.datasets.filter(function(it){
            return it.key !== dataset.key;
          });
        });
      });
    };
  });
}));
x$.controller('userDatasetList', ['$scope', '$http', 'dataService'].concat(function($scope, $http, dataService){
  var owner, that;
  owner = (that = /^\/user\/([^/]+)/.exec(window.location.pathname))
    ? that[1]
    : $scope.user.data ? $scope.user.data.key : null;
  $scope.q = {
    owner: owner
  };
  if ($scope.user.data && owner === $scope.user.data.key) {
    $scope.showPub = true;
  }
  return $http({
    url: '/d/dataset/me/count',
    method: 'GET'
  }).success(function(d){
    return $scope.datasetCount = d;
  }).error(function(d){
    return $scope.datasetCount = 0;
  });
}));
x$.controller('datasetList', ['$scope', 'IOService', 'dataService', 'Paging', 'plNotify', 'eventBus'].concat(function($scope, IOService, dataService, Paging, plNotify, eventBus){
  var that, dsfilter, box;
  $scope.paging = Paging;
  $scope.paging.limit = 50;
  $scope.datasets = [];
  $scope.mydatasets = [];
  $scope.samplesets = dataService.sample.map(function(it){
    return it.key = -Math.random(), it;
  });
  $scope.q = {};
  $scope.qLazy = {
    keyword: null
  };
  if ($scope.$parent.q) {
    import$($scope.q, $scope.$parent.q);
  }
  $scope.$watch('qLazy', function(){
    return $scope.loadList(1000, true);
  }, true);
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = import$(import$((ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$), $scope.q), $scope.qLazy);
      return IOService.listRemotely({
        name: 'dataset'
      }, payload);
    }, delay, reset).then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        data = (ret || []).map(function(it){
          return new dataService.dataset(it, true);
        });
        Paging.flexWidth(data);
        $scope.mydatasets = (reset
          ? []
          : $scope.mydatasets).concat(data);
        $scope.datasets = ($scope.useSample
          ? $scope.samplesets
          : []).concat($scope.mydatasets);
        if (!$scope.cur) {
          return $scope.setcur($scope.datasets[0]);
        }
      });
    });
  };
  $scope.chosen = {
    dataset: null,
    key: null
  };
  $scope.toggle = function(dataset){
    var ref$;
    if (!dataset || this.chosen.key === dataset.key) {
      return ref$ = this.chosen, ref$.dataset = null, ref$.key = null, ref$;
    }
    this.chosen.key = dataset.key;
    return this.chosen.dataset = dataset;
  };
  $scope['delete'] = function(dataset){
    var this$ = this;
    return dataset['delete']().then(function(){
      return $scope.$apply(function(){
        $scope.datasets = $scope.datasets.filter(function(it){
          return it.key !== dataset.key;
        });
        return plNotify.send('success', "dataset deleted.");
      });
    })['catch'](function(){
      return plNotify.send('danger', "failed to delete dataset.");
    });
  };
  $scope.inlineCreate = function(it){
    var this$ = this;
    return dataService.load(it._type, it.key).then(function(ret){
      var ds;
      ds = new dataService.dataset(ret);
      return $scope.datasets.splice(0, 0, ds);
    })['catch'](function(ret){
      console.error(ret);
      plNotify.send('error', "failed to load dataset. please try reloading");
      if (ret[1] === 'forbidden') {
        return window.location.href = '/403.html';
      }
    });
  };
  $scope.cur = null;
  $scope.setcur = function(it){
    return $scope.cur = it;
  };
  if (that = document.querySelectorAll(".ds-list")[0]) {
    $scope.limitscroll(that);
  }
  eventBus.listen('dataset.saved', function(dataset){
    var matched;
    dataset == null && (dataset = {});
    matched = $scope.datasets.filter(function(it){
      return it.key === dataset.key;
    })[0];
    if (matched) {
      return import$(matched, dataset);
    }
  });
  if ($('#list-end')) {
    Paging.loadOnScroll(function(){
      return $scope.loadList();
    }, $('#list-end'), $(".ds-list"));
  }
  $scope.loadList();
  dsfilter = document.querySelector('#dataset-filter .items');
  if (dsfilter) {
    box = dsfilter.getBoundingClientRect();
    dsfilter.style.height = (window.innerHeight - box.top - 50) + "px";
    $scope.jumpTo = function(dataset){
      return $scope.scrollto($("#dataset-" + dataset.key));
    };
  }
  $scope.transpose = function(dataset){
    return Promise.all(dataset.fields.map(function(it){
      return it.update();
    })).then(function(){
      return setTimeout(function(){
        var head, fields, i$, to$, i, j$, to1$, j, ref$, index;
        head = dataset.fields[0];
        fields = head.data.map(function(){
          return new dataService.Field({
            location: 'sample'
          });
        });
        for (i$ = 1, to$ = dataset.fields.length; i$ < to$; ++i$) {
          i = i$;
          for (j$ = 0, to1$ = head.data.length; j$ < to1$; ++j$) {
            j = j$;
            ((ref$ = fields[j]).data || (ref$.data = []))[i - 1] = dataset.fields[i].data[j];
            fields[j].name = head.data[j];
          }
        }
        index = new dataService.Field({
          location: 'sample'
        });
        index.data = dataset.fields.map(function(it){
          return it.name;
        });
        index.data.splice(0, 1);
        index.name = '欄位';
        fields = [index].concat(fields);
        return $scope.$apply(function(){
          return dataset.fields = fields;
        });
      }, 0);
    });
  };
  return $scope.columnize = function(dataset, start, end){
    start == null && (start = 1);
    end == null && (end = -1);
    return Promise.all(dataset.fields.map(function(it){
      return it.update();
    })).then(function(){
      return setTimeout(function(){
        var ref$, end, list, i, fields, pair, i$, to$, j$, j, k$, to1$, k;
        start >= 0 || (start = 0);
        start <= (ref$ = dataset.fields.length - 1) || (start = ref$);
        if (end < 0) {
          end = dataset.fields.length - 1;
        }
        end <= (ref$ = dataset.fields.length - 1) || (end = ref$);
        list = (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = dataset.fields.length; i$ < to$; ++i$) {
            i = i$;
            results$.push(i);
          }
          return results$;
        }()).filter(function(it){
          return it < start || it > end;
        });
        fields = list.map(function(it){
          return new dataService.Field({
            location: 'sample',
            name: dataset.fields[it].name
          });
        });
        pair = ['Index', 'Value'].map(function(it){
          return new dataService.Field({
            location: 'sample',
            name: it
          });
        });
        for (i$ = 0, to$ = dataset.fields[0].data.length; i$ < to$; ++i$) {
          i = i$;
          for (j$ = start; j$ <= end; ++j$) {
            j = j$;
            for (k$ = 0, to1$ = fields.length; k$ < to1$; ++k$) {
              k = k$;
              fields[k].data.push(dataset.fields[list[k]].data[i]);
            }
            pair[0].data.push(dataset.fields[j].name);
            pair[1].data.push(dataset.fields[j].data[i]);
          }
        }
        fields = fields.concat(pair);
        return $scope.$apply(function(){
          return dataset.fields = fields;
        });
      }, 0);
    });
  };
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('dataEditCtrl', ['$scope', '$interval', '$timeout', '$http', 'permService', 'dataService', 'eventBus', 'plNotify', 'Paging'].concat(function($scope, $interval, $timeout, $http, permService, dataService, eventBus, plNotify, Paging){
  eventBus.fire('loading.dimmer.on');
  $scope.permtype = (window.permtype || (window.permtype = []))[1] || 'none';
  $scope.isAdmin = permService.isEnough($scope.permtype, 'admin');
  import$($scope, {
    rawdata: "",
    dataset: null,
    worker: new Worker("/js/data/worker.js"),
    loading: false,
    inited: false,
    showGrid: true
  });
  $scope.$watch('inited', function(it){
    return eventBus.fire("loading.dimmer." + (it ? 'off' : 'on'));
  });
  $scope.name = null;
  $scope.clone = function(){
    if (!$scope.dataset || !$scope.dataset.key) {
      return;
    }
    $scope.dataset.key = null;
    $scope.dataset.name = $scope.dataset.name + " - Copy";
    return $scope.save();
  };
  $scope.save = function(locally){
    var promise;
    locally == null && (locally = false);
    if (!$scope.dataset) {
      return;
    }
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    promise = !$scope.dataset.name
      ? $scope.panel.name.prompt()
      : Promise.resolve();
    return promise.then(function(){
      var promise;
      $scope.$apply(function(){
        return eventBus.fire('loading.dimmer.on');
      });
      promise = null;
      if ($scope.grid.toggled) {
        promise = Promise.resolve();
      } else {
        $scope.$apply(function(){
          return promise = $scope.parser.csv.read($scope.rawdata, false);
        });
      }
      return promise.then(function(){
        var data, payload, isCreate;
        data = $scope.grid.data;
        if (data.headers.length >= 40) {
          return $scope.$apply(function(){
            eventBus.fire('loading.dimmer.off');
            return plNotify.send('danger', "maximal 40 columns is allowed. you have " + data.headers.length);
          });
        }
        if (data.headers.length === 0) {
          return $scope.$apply(function(){
            eventBus.fire('loading.dimmer.off');
            return plNotify.send('danger', "no data to save. add some?");
          });
        }
        payload = $scope.grid.data.fieldize();
        $scope.dataset.setFields(payload);
        isCreate = !$scope.dataset.key ? true : false;
        return $scope.dataset.save().then(function(r){
          $scope.$apply(function(){
            return plNotify.send('success', "dataset saved");
          });
          if (isCreate) {
            if ($scope.$parent && $scope.$parent.inlineCreate) {
              $scope.$parent.inlineCreate($scope.dataset);
              $scope.$apply(function(){
                return eventBus.fire('loading.dimmer.off');
              });
            } else {
              setTimeout(function(){
                return window.location.href = dataService.link($scope.dataset);
              }, 1000);
            }
          } else {
            $scope.$apply(function(){
              return eventBus.fire('loading.dimmer.off');
            });
          }
          return eventBus.fire('dataset.saved', $scope.dataset);
        })['catch'](function(e){
          console.log(e.stack);
          return $scope.$apply(function(){
            plNotify.aux.error.io('save', 'data', e);
            return eventBus.fire('loading.dimmer.off');
          });
        });
      });
    });
  };
  $scope.load = function(_type, key){
    var worker, this$ = this;
    eventBus.fire('loading.dimmer.on');
    $scope.rawdata = "";
    worker = new Worker('/js/data/worker/parse-dataset.js');
    worker.onmessage = function(e){
      var data;
      data = e.data;
      $scope.$apply(function(){
        $scope.grid.data.headers = data.data.headers;
        $scope.grid.data.rows = data.data.rows;
        return $scope.grid.data.types = data.data.types;
      });
      return $scope.grid.render().then(function(){
        return $scope.$apply(function(){
          $scope.inited = true;
          $scope.loading = false;
          return eventBus.fire('loading.dimmer.off');
        });
      });
    };
    return dataService.load(_type, key).then(function(ret){
      return $scope.$apply(function(){
        var dataset;
        $scope.dataset = dataset = new dataService.dataset(ret);
        $scope.grid.data.size = JSON.stringify(dataset).length;
        return worker.postMessage({
          dataset: dataset
        });
      });
    })['catch'](function(ret){
      return $scope.$apply(function(){
        console.error(ret);
        plNotify.send('error', "failed to load dataset. please try reloading");
        if (ret[1] === 'forbidden') {
          window.location.href = '/403.html';
        }
        $scope.inited = true;
        $scope.loading = false;
        return eventBus.fire('loading.dimmer.off');
      });
    });
  };
  $scope['delete'] = function(dataset){
    if (!dataset || !dataset.key) {
      return;
    }
    return eventBus.fire('confirmbox.on', {
      title: 'Delete',
      message: 'Are you sure to delete this dataset?',
      options: ['Yes', 'Cancel'],
      callback: function(it){
        if (it === 1) {
          return;
        }
        eventBus.fire('loading.dimmer.on');
        return dataset['delete']().then(function(){
          plNotify.send('success', "dataset deleted");
          return $timeout(function(){
            return window.location.href = "/dataset/";
          }, 1300);
        })['catch'](function(ret){
          console.error(ret);
          return plNotify.send('error', "failed to delete dataset. please try later.");
        });
      }
    });
  };
  $scope.loadDataset = function(dataset){
    var fields;
    $scope.dataset = dataset;
    $scope.name = dataset.name;
    fields = dataset.fields.map(function(it){
      return it.name;
    });
    return $scope.rawdata = ([fields.join(",")].concat(dataset.data.map(function(obj){
      return fields.map(function(it){
        return obj[it];
      }).join(',');
    }))).join('\n');
  };
  import$($scope, {
    communicate: function(){
      return $scope.worker.onmessage = function(arg$){
        var payload;
        payload = arg$.data;
        return $scope.$apply(function(){
          if (typeof payload !== 'object') {
            return;
          }
          switch (payload.type) {
          case "parse.revert":
            $scope.rawdata = payload.data;
            $scope.loading = false;
            return eventBus.fire('loading.dimmer.off');
          }
        });
      };
    },
    reset: function(rawdata, force){
      var ref$, dataset;
      rawdata == null && (rawdata = "");
      force == null && (force = false);
      if (force) {
        if ($scope.$parent && $scope.$parent.inlineCreate) {
          $scope.dataset = new dataService.dataset();
          $scope.rawdata = rawdata || "";
          ref$ = $scope.grid.data;
          ref$.rows = [];
          ref$.headers = [];
          ref$.types = [];
          return $scope.grid.render();
        } else {
          return window.location.href = "/dataset/";
        }
      } else {
        dataset = new dataService.dataset(window.dataset || {});
        dataset.name = "";
        if ($scope.dataset && $scope.dataset.name) {
          dataset.name = $scope.dataset.name;
        }
        return $scope.dataset = dataset, $scope.rawdata = rawdata, $scope;
      }
    },
    init: function(){
      var ret1, ret2, that, ret;
      this.reset("");
      ret1 = /\/dataset\//.exec(window.location.pathname) ? /[?&]k=([sc])([^&?#]+)/.exec(window.location.search || "") : null;
      ret2 = /^\/data(s)et\/([0-9]+)\/?/.exec(window.location.pathname || "");
      if (that = ret1 || ret2) {
        ret = that;
        $scope.dataset.key = ret[2];
        $scope.load({
          location: ret[1] === 's' ? 'server' : 'local',
          name: 'dataset'
        }, ret[2]);
      } else {
        eventBus.fire('loading.dimmer.off');
        $scope.inited = true;
      }
      $('#dataset-edit-text').on('keydown', function(){
        return $scope.$apply(function(){
          return $scope.parse.run();
        });
      });
      $('[data-toggle="tooltip"]').tooltip();
      return this.communicate();
    }
  });
  $scope.parse = {
    rows: 0,
    fields: 0,
    size: 0,
    result: null,
    loading: false,
    handle: null,
    revert: function(dataset){
      $scope.loading = true;
      return $scope.worker.postMessage({
        type: "parse.revert",
        data: dataset
      });
    },
    promise: null,
    run: function(force){
      var this$ = this;
      force == null && (force = false);
      return new Promise(function(res, rej){
        var _;
        $scope.loading = true;
        _ = function(){
          $scope.parser.csv.read($scope.rawdata, false);
          return res();
        };
        if (this$.handle) {
          $timeout.cancel(this$.handle);
          if (this$.promise) {
            this$.promise.rej();
          }
        }
        this$.promise = {
          res: res,
          rej: rej
        };
        if (force) {
          return _();
        } else {
          return this$.handle = $timeout(function(){
            return _();
          }, force ? 0 : 1000);
        }
      });
    }
  };
  $scope.parser = {
    progress: function(sec){
      var progress, this$ = this;
      sec == null && (sec = 2000);
      progress = 0;
      if (this.progressHandler) {
        $interval.cancel(this.progressHandler);
      }
      return this.progressHandler = $interval(function(){
        progress = progress + (100 - progress) / (progress < 80 ? 4 : 8);
        if (progress > 97) {
          $interval.cancel(this$.progressHandler);
          this$.progresHandler = 0;
        }
        return eventBus.fire('loading.dimmer.progress', progress);
      }, sec / 6);
    }
  };
  $scope.parser.csv = {
    encodings: ['UTF-8', 'BIG5', 'GB2312', 'ISO-8859-1'],
    encoding: 'UTF-8',
    worker: null,
    toggle: function(v){
      return this.toggled = v != null
        ? v
        : !this.toggled;
    },
    toggled: false,
    'import': function(buf){
      var node;
      node = document.getElementById('dataset-import-dropdown');
      node.className = node.className.replace(/open/, '');
      $scope.parser.csv.buf = buf;
      return $scope.parser.csv.toggle(true);
    },
    read: function(_buf, verbose){
      var this$ = this;
      verbose == null && (verbose = true);
      return new Promise(function(res, rej){
        var buf, sec;
        buf = _buf;
        if (!(buf != null)) {
          buf = this$.buf;
        }
        if (!buf) {
          buf = "";
        }
        if (verbose) {
          eventBus.fire('loading.dimmer.on', 1);
        }
        sec = buf.length * 1.3 / 1000;
        $scope.parser.progress(sec);
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/csv.js');
        }
        this$.worker.onmessage = function(e){
          var data;
          data = e.data.data;
          $scope.$apply(function(){
            $scope.grid.data.rows = data.rows;
            $scope.grid.data.headers = data.headers;
            $scope.grid.data.types = data.types;
            return $scope.grid.data.size = buf.length;
          });
          return $scope.grid.render({
            trs: data.trs,
            ths: data.ths
          }).then(function(){
            return $scope.$apply(function(){
              this$.toggle(false);
              this$.buf = null;
              if (verbose) {
                eventBus.fire('loading.dimmer.off');
              }
              $scope.loading = false;
              return res();
            });
          });
        };
        return this$.worker.postMessage({
          buf: buf
        });
      });
    }
  };
  $scope.parser.xls = {
    worker: null,
    read: function(buf){
      var sec, node, this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      sec = buf.length * 2.5 / 1000;
      $scope.parser.progress(sec);
      if (!this.worker) {
        this.worker = new Worker('/js/data/worker/excel.js');
        this.worker.onmessage = function(e){
          return $scope.$apply(function(){
            var data;
            data = e.data.data;
            $scope.grid.data.headers = data.headers;
            $scope.grid.data.rows = data.rows;
            $scope.grid.data.types = data.types;
            $scope.grid.data.size = buf.length;
            return $scope.grid.render({
              trs: data.trs,
              ths: data.ths
            }).then(function(){
              return $scope.$apply(function(){
                return eventBus.fire('loading.dimmer.off');
              });
            });
          });
        };
      }
      node = document.getElementById('dataset-import-dropdown');
      node.className = node.className.replace(/open/, '');
      return $timeout(function(){
        return this$.worker.postMessage({
          buf: buf
        });
      }, 100);
    }
  };
  $scope.parser.gsheet = {
    url: null,
    apiKey: 'AIzaSyD3emlU63t6e_0n9Zj9lFCl-Rwod0OMTqY',
    clientId: '1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com',
    scopes: ['profile', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'].join(' '),
    init: function(){
      var this$ = this;
      return gapi.load('client:auth2', function(){
        gapi.client.load('drive', 'v3');
        gapi.client.setApiKey(this$.apiKey);
        gapi.auth2.init({
          client_id: this$.clientId,
          scope: this$.scopes
        });
        if ($('#gsheet-list-end')) {
          return Paging.loadOnScroll(function(){
            return $scope.parser.gsheet.list();
          }, $('#gsheet-list-end'), $('#gsheet-files'));
        }
      });
    },
    files: [],
    auth: function(){
      var auth;
      auth = gapi.auth2.getAuthInstance();
      if (auth.isSignedIn.get()) {
        return auth;
      } else {
        eventBus.fire('loading.dimmer.on');
        return auth.signIn();
      }
    },
    list: function(){
      var this$ = this;
      if (this.loading) {
        return;
      }
      this.loading = true;
      return this.auth().then(function(){
        var config, request;
        eventBus.fire('loading.dimmer.off');
        config = {
          pageSize: 40,
          fields: "nextPageToken, files(id, name)",
          q: "mimeType='application/vnd.google-apps.spreadsheet'"
        };
        if (this$.pageToken) {
          config.pageToken = this$.pageToken;
        }
        request = gapi.client.drive.files.list(config);
        return request.execute(function(ret){
          this$.pageToken = ret.nextPageToken;
          return $scope.$apply(function(){
            this$.files = this$.files.concat(ret.files);
            return this$.loading = false;
          });
        });
      });
    },
    toggle: function(){
      this.toggled = !this.toggled;
      if (this.toggled && !this.files.length) {
        return this.list();
      }
    },
    load: function(file){
      var this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(function(){
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: file.id,
          range: 'A:ZZ'
        });
      }).then(function(ret){
        var list, data;
        list = ret.result.values;
        data = $scope.grid.data;
        $scope.$apply(function(){
          var h;
          data.headers = h = list[0];
          list.splice(0, 1);
          data.rows = list;
          data.types = plotdb.Types.resolve(data);
          return data.size = (ret.body || "").length;
        });
        return $scope.grid.render().then(function(){
          return $scope.$apply(function(){
            this$.toggled = false;
            return eventBus.fire('loading.dimmer.off');
          });
        });
      }, function(){
        var this$ = this;
        return $scope.$apply(function(){
          plNotify.send('danger', "can't load sheet, try again later?");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    }
  };
  $scope.panel = {
    name: {
      promise: null,
      focus: function(){
        if (this.toggled) {
          return document.getElementById('dataset-name-input').focus();
        }
      },
      toggle: function(name){
        this.value = name;
        this.toggled = true;
        return this.focus();
      },
      prompt: function(){
        var this$ = this;
        return new Promise(function(res, rej){
          this$.promise = {
            res: res,
            rej: rej
          };
          this$.toggled = true;
          return this$.focus();
        });
      },
      value: "",
      action: function(idx){
        if (idx === 0) {
          if (!this.value) {
            return;
          }
          ($scope.dataset || ($scope.dataset = {})).name = this.value;
          $('#dataset-name').text(this.value);
        }
        this.toggled = false;
        if (this.promise) {
          if (idx) {
            return this.promise.rej();
          } else if (!idx) {
            return this.promise.res(this.value);
          }
        }
      }
    },
    toggle: function(name){
      if (!($scope.dataset || ($scope.dataset = {})).key) {
        if (!name) {
          return;
        }
      }
      if (name) {
        return (this[name] || (this[name] = {})).toggled = !(this[name] || (this[name] = {})).toggled;
      } else {
        return this.toggled = !this.toggled;
      }
    }
  };
  eventBus.listen('dataset.delete', function(key){
    if ($scope.dataset.key === key) {
      return $scope.dataset = null;
    }
  });
  eventBus.listen('dataset.edit', function(dataset, load){
    load == null && (load = true);
    $scope.inited = false;
    if (load && dataset._type.location === 'server') {
      return $scope.load(dataset._type, dataset.key);
    } else {
      $scope.dataset = new dataService.dataset(dataset);
      $scope.parse.revert($scope.dataset);
      return $scope.inited = true;
    }
  });
  $scope.grid = {
    toggled: true,
    _toggle: function(v){
      this.toggled = v;
      if (!this.toggled) {
        return this.convert();
      }
    },
    toggle: function(v){
      var ret, this$ = this;
      ret = v
        ? v
        : !this.toggled;
      if (!ret && this.data.rows.length > 1000) {
        return eventBus.fire('confirmbox.on', {
          title: "Wait!",
          message: "Raw editing in a large dataset will be very slow. Are you sure?",
          options: ['Yes', 'Cancel'],
          callback: function(it){
            if (it === 0) {
              return this$._toggle(ret);
            }
          }
        });
      } else {
        return this._toggle(ret);
      }
    },
    convert: function(){
      var ref$;
      eventBus.fire('loading.dimmer.on');
      if (!this.convertWorker) {
        this.convertWorker = new Worker('/js/data/worker/data-to-raw-wrap.js');
      }
      this.convertWorker.onmessage = function(e){
        return $scope.$apply(function(){
          $scope.rawdata = e.data.raw.trim();
          return eventBus.fire('loading.dimmer.off');
        });
      };
      return this.convertWorker.postMessage({
        headers: (ref$ = this.data).headers,
        rows: ref$.rows,
        types: ref$.types
      });
    },
    worker: null,
    data: {
      rows: [],
      headers: [],
      trs: [],
      clusterizer: null,
      fieldize: function(){
        var ret, i$, to$, i, j$, to1$, j, ref$, this$ = this;
        ret = this.headers.map(function(d, i){
          return {
            data: [],
            datatype: this$.types[i],
            name: d
          };
        });
        for (i$ = 0, to$ = this.rows.length; i$ < to$; ++i$) {
          i = i$;
          for (j$ = 0, to1$ = this.headers.length; j$ < to1$; ++j$) {
            j = j$;
            ret[j].data.push(((ref$ = this.rows)[i] || (ref$[i] = []))[j]);
          }
        }
        return ret;
      }
    },
    render: function(obj){
      var headOnly, ths, trs, this$ = this;
      obj == null && (obj = {});
      headOnly = obj.headOnly, ths = obj.ths, trs = obj.trs;
      return new Promise(function(res, rej){
        var head, scroll, content, update;
        head = document.querySelector('#dataset-editbox .sheet .sheet-head');
        scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
        content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/grid-render-wrap.js');
        }
        update = function(trs, ths){
          var that;
          head.innerHTML = ths;
          if (headOnly) {
            return res();
          }
          content.innerHTML = "";
          if (that = this$.data.clusterizer) {
            that.destroy(true);
          }
          this$.data.clusterizer = new Clusterize({
            rows: trs,
            scrollElem: scroll,
            contentElem: content
          });
          return res();
        };
        if (trs && ths) {
          return update(trs, ths);
        }
        this$.worker.onmessage = function(e){
          var ref$, trs, ths;
          ref$ = [e.data.trs, e.data.ths], trs = ref$[0], ths = ref$[1];
          return update(trs, ths);
        };
        if (headOnly) {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            types: this$.data.types
          });
        } else {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            rows: this$.data.rows,
            types: this$.data.types
          });
        }
      });
    },
    update: function(r, c, val){
      var dirty, i$, i, ref$, j, that, valtype;
      dirty = false;
      if (c >= this.data.headers.length) {
        for (i$ = this.data.headers.length; i$ <= c; ++i$) {
          i = i$;
          this.data.headers[i] = '';
        }
      }
      if (r >= this.data.rows.length) {
        for (i$ = this.data.rows.length; i$ <= r; ++i$) {
          i = i$;
          this.data.rows[i] = [];
        }
      }
      if (r === -1) {
        if (!this.data.headers[c] && !val) {
          return;
        }
        this.data.headers[c] = val;
      }
      if (r >= 0 && !((ref$ = this.data.rows)[r] || (ref$[r] = []))[c] && !val) {
        return;
      }
      if (c >= ((ref$ = this.data).types || (ref$.types = [])).length) {
        for (i$ = this.data.types.length; i$ <= c; ++i$) {
          i = i$;
          this.data.types[i] = plotdb.Types.resolve((fn$.call(this)));
          this.data.headers[i] = (that = this.data.headers[i]) ? that : '';
        }
        dirty = true;
      }
      if (r >= 0) {
        this.data.rows[r][c] = val;
        valtype = plotdb.Types.resolve(val);
        if (valtype !== this.data.types[c]) {
          this.data.types[c] = plotdb.Types.resolve((function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = this.data.rows.length; i$ < to$; ++i$) {
              i = i$;
              results$.push(this.data.rows[i][c]);
            }
            return results$;
          }.call(this)));
          dirty = true;
        }
      }
      if (dirty) {
        return this.render({
          headOnly: true
        }).then(function(){
          var node, range, sel;
          if (r < 0) {
            node = document.querySelector('#dataset-editbox .sheet-head > div >' + (" div:nth-of-type(" + (c + 1) + ") > div:first-child"));
          } else {
            node = document.querySelector(['#dataset-editbox .sheet-cells >', "div:nth-of-type(" + (r + 1) + ") >", "div:nth-of-type(" + (c + 1) + ")"].join(" "));
          }
          if (node) {
            node.focus();
            range = document.createRange();
            range.setStart(node, 1);
            range.collapse(true);
            sel = window.getSelection();
            sel.removeAllRanges();
            return sel.addRange(range);
          }
        });
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = this.data.rows.length; i$ < to$; ++i$) {
          j = i$;
          results$.push(this.data.rows[j][i]);
        }
        return results$;
      }
    },
    empty: function(){
      this.data.headers = [];
      this.data.rows = [];
      return this.render();
    },
    init: function(){
      var head, scroll, content, this$ = this;
      this.empty();
      head = document.querySelector('#dataset-editbox .sheet .sheet-head');
      scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
      content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
      scroll.addEventListener('scroll', function(e){
        return head.scrollLeft = scroll.scrollLeft;
      });
      head.addEventListener('click', function(e){
        var data, col, node, that;
        if (/closebtn/.exec(e.target.className)) {
          data = $scope.grid.data;
          col = +e.target.getAttribute('col');
          return $scope.$apply(function(){
            eventBus.fire('loading.dimmer.on');
            return $timeout(function(){
              data.headers.splice(col, 1);
              data.rows.map(function(row){
                return row.splice(col, 1);
              });
              data.types.splice(col, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  return eventBus.fire('loading.dimmer.off');
                });
              });
            }, 0);
          });
        } else {
          col = +e.target.getAttribute('col');
          if (!isNaN(col)) {
            node = head.querySelector(".sheet-head > div > div:nth-of-type(" + (col + 1) + ") > div:first-child");
            if (that = node) {
              return that.focus();
            }
          }
        }
      });
      head.addEventListener('keydown', function(e){
        return setTimeout(function(){
          var key, n, val, col, v, node, that;
          key = e.keyCode;
          n = e.target;
          val = n.textContent.trim();
          col = +n.getAttribute('col');
          if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (v[1] > 0) {
              node = content.querySelector([".sheet-cells >", "div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ")"].join(" "));
            } else {
              node = head.querySelector([".sheet-head > div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") > div:first-child"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return this$.update(-1, col, val);
          }
        }, 0);
      });
      return content.addEventListener('keydown', function(e){
        return setTimeout(function(){
          var key, n, val, row, col, h, v, node, that;
          key = e.keyCode;
          n = e.target;
          val = n.textContent;
          row = +n.getAttribute('row');
          col = +n.getAttribute('col');
          h = col;
          if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (row === 0 && v[1] < 0) {
              node = head.querySelector([".sheet-head > div >", "div:nth-of-type(" + (col + 1) + ") > div:first-child"].join(" "));
            } else {
              node = content.querySelector([".sheet-cells >", "div:nth-of-type(" + (row + 1 + v[1]) + ") >", "div:nth-of-type(" + (col + 1 + v[0]) + ")"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return this$.update(row, h, val);
          }
        }, 0);
      });
    }
  };
  $scope.init();
  $scope.grid.init();
  return $scope.parser.gsheet.init();
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var plotdb;
plotdb = {};// Generated by LiveScript 1.3.1
var plotdb;
if (!(typeof plotdb != 'undefined' && plotdb !== null)) {
  plotdb = {};
}
plotdb.String = {
  name: 'String',
  'default': "",
  level: 2,
  basetype: [],
  test: function(){
    return true;
  },
  parse: function(it){
    return it || "";
  }
};
plotdb.Order = {
  name: 'Order',
  'default': function(k, v, i){
    return i;
  },
  level: 4,
  basetype: [plotdb.String],
  test: function(v){
    return !!plotdb.OrderTypes.map(function(type){
      return type.test(v);
    }).filter(function(it){
      return it;
    })[0];
  },
  parse: function(it){
    return it;
  },
  order: {
    Ascending: function(a, b){
      if (b > a) {
        return -1;
      } else if (b < a) {
        return 1;
      } else {
        return 0;
      }
    },
    Descending: function(a, b){
      if (b > a) {
        return 1;
      } else if (b < a) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  sort: function(data, fieldname, isAscending){
    var field, types, i$, to$, i, j$, to1$, j, type, sorter;
    isAscending == null && (isAscending = true);
    field = data.map(function(it){
      return it[fieldname];
    });
    types = plotdb.OrderTypes.map(function(it){
      return it;
    });
    for (i$ = 0, to$ = field.length; i$ < to$; ++i$) {
      i = i$;
      for (j$ = 0, to1$ = types.length; j$ < to1$; ++j$) {
        j = j$;
        if (!types[j].test(field[i])) {
          types[j] = null;
        }
      }
      types = types.filter(fn$);
    }
    type = types[0];
    if (type) {
      for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
        i = i$;
        data[i][fieldname] = type.parse(data[i][fieldname]);
      }
    }
    sorter = ((type || {}).order || this.order)[isAscending ? 'Ascending' : 'Descending'];
    return data.sort(function(a, b){
      return sorter(a[fieldname], b[fieldname]);
    });
    function fn$(it){
      return it;
    }
  }
};
plotdb.Boolean = {
  name: 'Boolean',
  'default': true,
  level: 8,
  basetype: [plotdb.Order],
  test: function(it){
    return !!/^(true|false|yes|no|[yntf01])$/.exec(it);
  },
  parse: function(it){
    if (it && typeof it === 'string') {
      if (/^(yes|true|[yt])$/.exec(it.trim())) {
        return true;
      }
      if (/\d+/.exec(it.trim()) && it.trim() !== "0") {
        return true;
      }
      return false;
    }
    return !!it;
  },
  order: {
    Descending: function(a, b){
      return b - a;
    },
    Ascending: function(a, b){
      return a - b;
    },
    index: function(it){
      if (it) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};
plotdb.Bit = {
  name: 'Bit',
  'default': 0,
  level: 10,
  basetype: [plotdb.Boolean],
  test: function(it){
    return !!/^[01]$/.exec(it);
  },
  parse: function(it){
    return !it || it === "0" ? 0 : 1;
  },
  order: {
    Descending: function(a, b){
      return b - a;
    },
    Ascending: function(a, b){
      return a - b;
    },
    index: function(it){
      return it;
    }
  }
};
plotdb.Numstring = {
  name: 'Numstring',
  'default': "",
  level: 6,
  basetype: [plotdb.Order],
  test: function(it){
    return /\d+/.exec(it + "");
  },
  parse: function(it){
    var numbers, num, i$, to$, j;
    numbers = [];
    num = it.split
      ? it.split(/\.?[^0-9.]+/g)
      : [it];
    for (i$ = 0, to$ = num.length; i$ < to$; ++i$) {
      j = i$;
      if (num[j]) {
        numbers.push(parseFloat(num[j]));
      }
    }
    return {
      raw: it,
      numbers: numbers,
      len: numbers.length,
      toString: function(){
        return this.raw;
      }
    };
  },
  order: {
    Ascending: function(a, b){
      var na, nb, i$, to$, i, v;
      if (!a) {
        return !b
          ? 0
          : -1;
      }
      na = a.numbers;
      nb = b.numbers;
      for (i$ = 0, to$ = a.len; i$ < to$; ++i$) {
        i = i$;
        v = na[i] - nb[i];
        if (v) {
          return v;
        }
      }
      return a.len - b.len;
    },
    Descending: function(a, b){
      return plotdb.Numstring.order.Ascending(b, a);
    },
    index: function(it){
      return it.numbers[0];
    }
  }
};
plotdb.Number = {
  name: 'Number',
  'default': 0,
  level: 8,
  basetype: [plotdb.Numstring],
  test: function(it){
    return !isNaN(+((it || '') + "").replace(/,/g, '').replace(/%$/, ''));
  },
  parse: function(it){
    if (typeof it === 'string') {
      it = parseFloat(it.replace(/,/g, ''));
      if (/%$/.exec(it)) {
        it = (+it.replace(/%$/, '')) / 100;
      }
    }
    return +it;
  },
  order: {
    Ascending: function(a, b){
      return a - b;
    },
    Descending: function(a, b){
      return b - a;
    },
    index: function(it){
      return it;
    }
  }
};
plotdb.Date = {
  name: 'Date',
  'default': '1970/1/1',
  level: 8,
  basetype: [plotdb.Numstring],
  test: function(it){
    return !/^\d*$/.exec(it) && this.parse(it) ? true : false;
  },
  parse: function(it){
    var d, ret;
    d = new Date(it);
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      ret = /^(\d{1,2})[/-](\d{4})$/.exec(it);
      if (!ret) {
        return null;
      }
      d = new Date(ret[2], parseInt(ret[1]) - 1);
    }
    return {
      raw: it,
      toString: function(){
        return this.raw;
      },
      parsed: d
    };
  },
  order: {
    Ascending: function(a, b){
      return a.parsed.getTime() - b.parsed.getTime();
    },
    Descending: function(a, b){
      return b.parsed.getTime() - a.parsed.getTime();
    },
    index: function(it){
      return it.parsed.getTime();
    }
  }
};
plotdb.Weekday = {
  name: 'Weekday',
  'default': 'Mon',
  level: 8,
  basetype: [plotdb.Order],
  values: {
    abbr: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    en: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    zh: ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
  },
  test: function(it){
    var value, k, ref$, v, idx;
    value = typeof it === 'string' ? it.toLowerCase() : it;
    for (k in ref$ = this.values) {
      v = ref$[k];
      idx = v.indexOf(value);
      if (idx >= 0) {
        return true;
      }
    }
    return false;
  },
  parse: function(it){
    return it;
  },
  order: {
    index: function(it){
      var value, k, ref$, v, idx;
      value = it.toLowerCase();
      for (k in ref$ = plotdb.Weekday.values) {
        v = ref$[k];
        idx = v.indexOf(value);
        if (idx >= 0) {
          return idx;
        }
      }
      return -1;
    },
    Ascending: function(a, b){
      a = plotdb.Weekday.order.index(a);
      b = plotdb.Weekday.order.index(b);
      return a - b;
    },
    Descending: function(a, b){
      a = plotdb.Weekday.order.index(a);
      b = plotdb.Weekday.order.index(b);
      return b - a;
    }
  }
};
plotdb.Month = {
  name: 'Month',
  'default': 'Jan',
  level: 8,
  basetype: [plotdb.Order],
  values: {
    abbr: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    en: ['january', 'feburary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  test: function(it){
    var value, k, ref$, v, idx;
    value = typeof it === 'string' ? it.toLowerCase() : it;
    for (k in ref$ = this.values) {
      v = ref$[k];
      idx = v.indexOf(value);
      if (idx >= 0) {
        return true;
      }
    }
    return false;
  },
  parse: function(it){
    return it;
  },
  order: {
    index: function(it){
      var value, k, ref$, v, idx;
      value = it.toLowerCase();
      for (k in ref$ = plotdb.Month.values) {
        v = ref$[k];
        idx = v.indexOf(value);
        if (idx >= 0) {
          return idx;
        }
      }
      return -1;
    },
    Ascending: function(a, b){
      a = plotdb.Month.order.index(a);
      b = plotdb.Month.order.index(b);
      return a - b;
    },
    Descending: function(a, b){
      a = plotdb.Month.order.index(a);
      b = plotdb.Month.order.index(b);
      return b - a;
    }
  }
};
plotdb.Range = {
  name: 'Range',
  'default': [0, 1],
  test: function(it){
    return !!plotdb.Range.parse(it);
  },
  parse: function(it){
    var e;
    if (typeof it === 'string') {
      try {
        it = JSON.parse(it);
      } catch (e$) {
        e = e$;
        return false;
      }
    }
    if (Array.isArray(it) && it.length === 2) {
      it[0] = parseFloat(it[0]);
      it[1] = parseFloat(it[1]);
      if (isNaN(it[0]) || isNaN(it[1])) {
        return null;
      }
      return it;
    }
    return null;
  }
};
plotdb.Choice = function(v){
  return {
    'default': "",
    name: 'Choice',
    level: 20,
    test: function(it){
      return v && v.length && in$(it, v);
    },
    values: v
  };
};
plotdb.Color = {
  name: 'Color',
  level: 10,
  test: function(it){
    return !/(rgba?|hsla?)\([0-9.,]+\)|#[0-9a-f]{3,6}|[a-z0-9]+/.exec(it.trim());
  },
  'default': '#dc4521',
  Gray: '#cccccc',
  Positive: '#3f7ab5',
  Negative: '#d93510',
  Neutral: '#cccccc',
  Empty: '#ffffff',
  subtype: {
    negative: "negative",
    positive: "positive",
    neutral: "neutral"
  }
};
plotdb.Palette = {
  name: 'Palette',
  level: 30,
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
};
plotdb.OrderTypes = [plotdb.Number, plotdb.Date, plotdb.Numstring, plotdb.Month, plotdb.Weekday, plotdb.Boolean, plotdb.Bit];
plotdb.Types = {
  list: ['Number', 'Numstring', 'Weekday', 'Month', 'Date', 'Boolean', 'Bit', 'Order'],
  resolveArray: function(vals){
    var matchedTypes, i$, to$, j, type, matched, j$, to1$, k;
    matchedTypes = [[0, 'String']];
    for (i$ = 0, to$ = this.list.length; i$ < to$; ++i$) {
      j = i$;
      type = plotdb[this.list[j]];
      matched = true;
      for (j$ = 0, to1$ = vals.length; j$ < to1$; ++j$) {
        k = j$;
        if (!type.test(vals[k])) {
          matched = false;
          break;
        }
      }
      if (matched) {
        matchedTypes.push([plotdb[this.list[j]].level, this.list[j]]);
      }
    }
    matchedTypes.sort(function(a, b){
      return b[0] - a[0];
    });
    type = (matchedTypes[0] || [0, 'String'])[1];
    return type;
  },
  resolveValue: function(val){
    var matchedTypes, i$, to$, j, type;
    matchedTypes = [[0, 'String']];
    for (i$ = 0, to$ = this.list.length; i$ < to$; ++i$) {
      j = i$;
      type = plotdb[this.list[j]];
      if (type.test(val)) {
        matchedTypes.push([plotdb[this.list[j]].level, this.list[j]]);
      }
    }
    matchedTypes.sort(function(a, b){
      return b[0] - a[0];
    });
    type = (matchedTypes[0] || [0, 'String'])[1];
    return type;
  },
  resolve: function(obj){
    var headers, rows, fields, types, i$, to$, i, matchedTypes, j$, to1$, j, type, matched, k$, to2$, k;
    if (Array.isArray(obj)) {
      return this.resolveArray(obj);
    }
    if (typeof obj !== 'object') {
      return this.resolveValue(obj);
    }
    headers = obj.headers, rows = obj.rows, fields = obj.fields;
    types = [];
    for (i$ = 0, to$ = headers.length; i$ < to$; ++i$) {
      i = i$;
      matchedTypes = [];
      for (j$ = 0, to1$ = this.list.length; j$ < to1$; ++j$) {
        j = j$;
        type = plotdb[this.list[j]];
        matched = true;
        for (k$ = 0, to2$ = rows.length; k$ < to2$; ++k$) {
          k = k$;
          if (!type.test(rows[k][i])) {
            matched = false;
            break;
          }
        }
        if (matched) {
          matchedTypes.push([plotdb[this.list[j]].level, this.list[j]]);
        }
      }
      matchedTypes.sort(fn$);
      type = (matchedTypes[0] || [0, 'String'])[1];
      types.push(type);
    }
    return types;
    function fn$(a, b){
      return b[0] - a[0];
    }
  }
};
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}// Generated by LiveScript 1.3.1
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
      padding: {}
    },
    init: function(){},
    bind: function(){},
    resize: function(){},
    render: function(){}
  },
  dataFromDimension: function(dimension){
    var data, len, k, v, i$, i, ret, that, type, defval, value, parse, j$, to$, j;
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
          defval = plotdb[type.name]['default'];
          value = typeof defval === 'function'
            ? defval(k, v, i)
            : type['default'];
          ret[k] = v.multiple ? [value] : value;
        }
        if (v.type && v.type[0] && plotdb[v.type[0].name].parse) {
          parse = plotdb[v.type[0].name].parse;
          if (Array.isArray(ret[k])) {
            for (j$ = 0, to$ = ret[k].length; j$ < to$; ++j$) {
              j = j$;
              ret[k][j] = parse(ret[k][j]);
            }
          } else {
            ret[k] = parse(ret[k]);
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
      v.fields = source[k] || [];
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
      type = (chart.config[k].type || []).map(fn$);
      if (!(config[k] != null)) {
        config[k] = v['default'];
      } else if (!(config[k].value != null)) {
        config[k] = (v || config[k])['default'];
      } else {
        config[k] = config[k].value;
      }
      if (type[0] && plotdb[type[0]].parse) {
        results$.push(config[k] = plotdb[type[0]].parse(config[k]));
      }
    }
    return results$;
    function fn$(it){
      return it.name;
    }
  }
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
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
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
plotdb.data = {
  sample: {
    country: ["Afghanistan", "Albania", "Antarctica", "Algeria", "American Samoa", "Andorra", "Angola", "Antigua and Barbuda", "Azerbaijan", "Argentina", "Australia", "Austria", "Bahamas", "Bahrain", "Bangladesh", "Armenia", "Barbados", "Belgium", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "Belize", "British Indian Ocean Territory", "Solomon Islands", "British Virgin Islands", "Brunei", "Bulgaria", "Myanmar", "Burundi", "Belarus", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Sri Lanka", "Chad", "Chile", "China", "Taiwan", "Christmas Island", "Cocos Keeling Islands", "Colombia", "Comoros", "Mayotte", "Congo, Rep.", "Congo, Dem. Rep.", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Benin", "Denmark", "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Equatorial Guinea", "Ethiopia", "Eritrea", "Estonia", "Faroe Islands", "Falkland Islands", "SGSSI", "Fiji", "Finland", "Åland Islands", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Djibouti", "Gabon", "Georgia", "Gambia", "Palestine", "Germany", "Ghana", "Gibraltar", "Kiribati", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guyana", "Haiti", "HIMI", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Cote d'Ivoire", "Jamaica", "Japan", "Kazakhstan", "Jordan", "Kenya", "North Korea", "South Korea", "Kuwait", "Kyrgyz Republic", "Lao", "Lebanon", "Lesotho", "Latvia", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mexico", "Monaco", "Mongolia", "Moldova", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Oman", "Namibia", "Nauru", "Nepal", "Netherlands", "Curaçao", "Aruba", "Sint Maarten", "Bonaire, Sint Eustatius and Saba", "New Caledonia", "Vanuatu", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Norway", "Northern Mariana Islands", "United States Minor Outlying Islands", "Micronesia, Fed. Sts.", "Marshall Islands", "Palau", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Guinea-Bissau", "Timor-Leste", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russia", "Rwanda", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Anguilla", "St. Lucia", "Saint Martin", "Saint Pierre and Miquelon", "St. Vincent and the Grenadines", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic", "Vietnam", "Slovenia", "Somalia", "South Africa", "Zimbabwe", "Spain", "South Sudan", "Sudan", "Western Sahara", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "United Arab Emirates", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "Macedonia, FYR", "Egypt", "United Kingdom", "Guernsey", "Jersey", "Isle of Man", "Tanzania", "United States", "Virgin Islands", "Burkina Faso", "Uruguay", "Uzbekistan", "Venezuela", "Wallis and Futuna", "Samoa", "Yemen", "Zambia"],
    continent: ['Asia', 'Europe', 'America', 'Oceania', 'Australia', 'Africa'],
    category: ['IT', 'RD', 'GM', 'FIN', 'LEGAL', 'HR', 'SALES', 'BD'],
    name: ['James', 'Joe', 'Amelie', 'Yale', 'Doraemon', 'Cindy', 'David', 'Frank', 'Kim', 'Ken', 'Leland', 'Mike', 'Nick', 'Oliver', 'Randy', 'Andy', 'Angelica', 'Zack', 'Alfred', 'Edward', 'Thomas', 'Percy', 'Frankenstein', 'Mary', 'Toby', 'Tim', 'Timonthy', 'Smith', 'Karen', 'Kenny', 'Jim', 'Victor', 'Xavier', 'Jimmy', 'Bob', 'Cynthia', 'Dory', 'Dolce', 'Kirby', 'Gabriel', 'Gabby', 'Watson', 'Wade', 'Wallace', 'Gasper', 'Karmen', 'Ian', 'Larry', 'Rachel', 'Parker', 'Parry', 'Eagle', 'Falcon', 'Hades', 'Helen', 'Sabrinaa', 'Oscar', 'Victoria'],
    fruit: ['Apple', 'Orange', 'Banana', 'Grape', 'Longan', 'Litchi', 'Peach', 'Guava', 'Melon', 'Pineapple', 'Pomelo', 'Durian', 'Berry', 'Pear'],
    weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
(function(){
  var helper, target, k;
  helper = {
    get: function(idx){
      return this[idx % this.length];
    },
    order: function(len){
      var ret, i$, i;
      ret = new Array(len);
      for (i$ = 0; i$ < len; ++i$) {
        i = i$;
        ret[i] = this[i % this.length];
      }
      return ret;
    },
    rand: function(){
      return this[parseInt(Math.random() * this.length)];
    },
    rands: function(len){
      var ret, i$, i;
      ret = new Array(len);
      for (i$ = 0; i$ < len; ++i$) {
        i = i$;
        ret[i] = this[parseInt(Math.random() * this.length)];
      }
      return ret;
    }
  };
  target = ['name', 'country', 'category', 'fruit', 'weekday', 'month', 'continent'];
  return (function(){
    var results$ = [];
    for (k in helper) {
      results$.push(k);
    }
    return results$;
  }()).map(function(h){
    return target.map(function(t){
      return plotdb.data.sample[t][h] = helper[h];
    });
  });
})();
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
  },
  oldFaithful: {
    "eruptions": {
      "name": "eruptions",
      "data": [3.6, 1.8, 3.333, 2.283, 4.533, 2.883, 4.7, 3.6, 1.95, 4.35, 1.833, 3.917, 4.2, 1.75, 4.7, 2.167, 1.75, 4.8, 1.6, 4.25, 1.8, 1.75, 3.45, 3.067, 4.533, 3.6, 1.967, 4.083, 3.85, 4.433, 4.3, 4.467, 3.367, 4.033, 3.833, 2.017, 1.867, 4.833, 1.833, 4.783, 4.35, 1.883, 4.567, 1.75, 4.533, 3.317, 3.833, 2.1, 4.633, 2, 4.8, 4.716, 1.833, 4.833, 1.733, 4.883, 3.717, 1.667, 4.567, 4.317, 2.233, 4.5, 1.75, 4.8, 1.817, 4.4, 4.167, 4.7, 2.067, 4.7, 4.033, 1.967, 4.5, 4, 1.983, 5.067, 2.017, 4.567, 3.883, 3.6, 4.133, 4.333, 4.1, 2.633, 4.067, 4.933, 3.95, 4.517, 2.167, 4, 2.2, 4.333, 1.867, 4.817, 1.833, 4.3, 4.667, 3.75, 1.867, 4.9, 2.483, 4.367, 2.1, 4.5, 4.05, 1.867, 4.7, 1.783, 4.85, 3.683, 4.733, 2.3, 4.9, 4.417, 1.7, 4.633, 2.317, 4.6, 1.817, 4.417, 2.617, 4.067, 4.25, 1.967, 4.6, 3.767, 1.917, 4.5, 2.267, 4.65, 1.867, 4.167, 2.8, 4.333, 1.833, 4.383, 1.883, 4.933, 2.033, 3.733, 4.233, 2.233, 4.533, 4.817, 4.333, 1.983, 4.633, 2.017, 5.1, 1.8, 5.033, 4, 2.4, 4.6, 3.567, 4, 4.5, 4.083, 1.8, 3.967, 2.2, 4.15, 2, 3.833, 3.5, 4.583, 2.367, 5, 1.933, 4.617, 1.917, 2.083, 4.583, 3.333, 4.167, 4.333, 4.5, 2.417, 4, 4.167, 1.883, 4.583, 4.25, 3.767, 2.033, 4.433, 4.083, 1.833, 4.417, 2.183, 4.8, 1.833, 4.8, 4.1, 3.966, 4.233, 3.5, 4.366, 2.25, 4.667, 2.1, 4.35, 4.133, 1.867, 4.6, 1.783, 4.367, 3.85, 1.933, 4.5, 2.383, 4.7, 1.867, 3.833, 3.417, 4.233, 2.4, 4.8, 2, 4.15, 1.867, 4.267, 1.75, 4.483, 4, 4.117, 4.083, 4.267, 3.917, 4.55, 4.083, 2.417, 4.183, 2.217, 4.45, 1.883, 1.85, 4.283, 3.95, 2.333, 4.15, 2.35, 4.933, 2.9, 4.583, 3.833, 2.083, 4.367, 2.133, 4.35, 2.2, 4.45, 3.567, 4.5, 4.15, 3.817, 3.917, 4.45, 2, 4.283, 4.767, 4.533, 1.85, 4.25, 1.983, 2.25, 4.75, 4.117, 2.15, 4.417, 1.817, 4.467]
    },
    "waiting": {
      "name": "waiting",
      "data": [79, 54, 74, 62, 85, 55, 88, 85, 51, 85, 54, 84, 78, 47, 83, 52, 62, 84, 52, 79, 51, 47, 78, 69, 74, 83, 55, 76, 78, 79, 73, 77, 66, 80, 74, 52, 48, 80, 59, 90, 80, 58, 84, 58, 73, 83, 64, 53, 82, 59, 75, 90, 54, 80, 54, 83, 71, 64, 77, 81, 59, 84, 48, 82, 60, 92, 78, 78, 65, 73, 82, 56, 79, 71, 62, 76, 60, 78, 76, 83, 75, 82, 70, 65, 73, 88, 76, 80, 48, 86, 60, 90, 50, 78, 63, 72, 84, 75, 51, 82, 62, 88, 49, 83, 81, 47, 84, 52, 86, 81, 75, 59, 89, 79, 59, 81, 50, 85, 59, 87, 53, 69, 77, 56, 88, 81, 45, 82, 55, 90, 45, 83, 56, 89, 46, 82, 51, 86, 53, 79, 81, 60, 82, 77, 76, 59, 80, 49, 96, 53, 77, 77, 65, 81, 71, 70, 81, 93, 53, 89, 45, 86, 58, 78, 66, 76, 63, 88, 52, 93, 49, 57, 77, 68, 81, 81, 73, 50, 85, 74, 55, 77, 83, 83, 51, 78, 84, 46, 83, 55, 81, 57, 76, 84, 77, 81, 87, 77, 51, 78, 60, 82, 91, 53, 78, 46, 77, 84, 49, 83, 71, 80, 49, 75, 64, 76, 53, 94, 55, 76, 50, 82, 54, 75, 78, 79, 78, 78, 70, 79, 70, 54, 86, 50, 90, 54, 54, 77, 79, 64, 75, 47, 86, 63, 85, 82, 57, 82, 67, 74, 54, 83, 73, 73, 88, 80, 71, 83, 56, 79, 78, 84, 58, 83, 43, 60, 75, 81, 46, 90, 46, 74]
    }
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
plotdb.config = {
  palette: {
    name: "Palette",
    type: [plotdb.Palette],
    subtype: plotdb.Palette.subtype.Qualitative,
    'default': plotdb.Palette['default'],
    category: "Color"
  },
  colorNegative: {
    name: "Negative",
    type: [plotdb.Color],
    desc: "Color for negative values",
    'default': plotdb.Color.Negative,
    subtype: plotdb.Color.subtype.Negative,
    category: "Color"
  },
  colorPositive: {
    name: "Positive",
    type: [plotdb.Color],
    desc: "Color for positive values",
    'default': plotdb.Color.Positive,
    subtype: plotdb.Color.subtype.Positive,
    category: "Color"
  },
  colorNeutral: {
    name: "Neutral",
    type: [plotdb.Color],
    desc: "Color for neutral values",
    'default': plotdb.Color.Neutral,
    subtype: plotdb.Color.subtype.Neutral,
    category: "Color"
  },
  colorEmpty: {
    name: "Empty",
    type: [plotdb.Color],
    desc: "Color for 'no values'",
    'default': plotdb.Color.Empty,
    subtype: plotdb.Color.subtype.Empty,
    category: "Color"
  },
  colorPast: {
    name: "Past",
    type: [plotdb.Color],
    desc: "Color for values in past",
    subtype: plotdb.Color.subtype.Fade,
    category: "Color"
  },
  fill: {
    name: "Default Fill Color",
    type: [plotdb.Color],
    desc: "Default color for filling visual encoding",
    'default': '#e03f0e',
    category: "Color"
  },
  stroke: {
    name: "Default Stroke Color",
    type: [plotdb.Color],
    desc: "Default color for outline of visual encoding",
    'default': '#999',
    category: "Color"
  },
  geoFill: {
    name: "Geoblock Fill Color",
    type: [plotdb.Color],
    desc: "Default color for filling geographic path",
    'default': '#eee',
    category: "Color"
  },
  geoStroke: {
    name: "Geoblock Stroke Color",
    type: [plotdb.Color],
    desc: "Default color for outline of geographic path",
    'default': '#919191',
    category: "Color"
  },
  hoverFill: {
    name: "Hovering Fill Color",
    type: [plotdb.Color],
    desc: "Fill color when hovering a visual encoding",
    'default': '#aaa',
    category: "Color"
  },
  hoverStroke: {
    name: "Hovering Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color when hovering a visual encoding",
    'default': '#fff',
    category: "Color"
  },
  connectFill: {
    name: "Line Fill Color",
    type: [plotdb.Color],
    desc: "Fill color between connection path of data node",
    'default': '#aaa',
    category: "Color"
  },
  connectStroke: {
    name: "Line Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color between connection path of data node",
    'default': '#aaa',
    category: "Color"
  },
  gridStroke: {
    name: "Grid Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color for Grid Lines",
    'default': '#ccc',
    category: "Color"
  },
  padding: {
    name: "Padding",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  bubblePadding: {
    name: "Bubble Padding",
    type: [plotdb.Number],
    'default': 5,
    category: "Layout"
  },
  margin: {
    name: "Margin",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  aspectRatio: {
    name: "Aspect Ratio",
    type: [plotdb.Boolean],
    'default': true,
    category: "Layout"
  },
  barThick: {
    name: "Bar Thickness",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  lineThick: {
    name: "Line Thickness",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  fontSize: {
    name: "Font Size",
    type: [plotdb.Number],
    'default': 13,
    category: "Text"
  },
  labelShadowSize: {
    name: "Label Shadow Size",
    type: [plotdb.Number],
    'default': 2,
    category: "Text"
  },
  xAxisLabel: {
    name: "X Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  yAxisLabel: {
    name: "Y Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  radialAxisLabel: {
    name: "Radial Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  angularAxisLabel: {
    name: "Angular Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  legendLabel: {
    name: "Legend Label",
    type: [plotdb.String],
    category: "Text"
  },
  otherLabel: {
    name: "Label for 'other'",
    type: [plotdb.String],
    'default': "Other",
    category: "Text"
  },
  showLegend: {
    name: "Show Legend",
    type: [plotdb.Boolean],
    'default': true,
    category: "Switch"
  },
  showLabel: {
    name: "Show Data Label",
    type: [plotdb.Boolean],
    'default': false,
    category: "Switch"
  },
  showNode: {
    name: "Show Data Dot",
    type: [plotdb.Boolean],
    'default': true,
    category: "Switch"
  },
  labelPosition: {
    name: "Label Position",
    type: [plotdb.Choice(["in", "out"])],
    'default': "out",
    category: "Switch"
  },
  showPercent: {
    name: "Percentage in Label",
    type: [plotdb.Boolean],
    desc: "Show percentage in data label",
    'default': true,
    category: "Switch"
  },
  xScaleRange: {
    name: "Data Range in X axis",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in x axis",
    'default': [0, 1],
    category: "Value"
  },
  yScaleRange: {
    name: "Data Range in Y axis",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in y axis",
    'default': [0, 1],
    category: "Value"
  },
  rScaleRange: {
    name: "Data Range in Circle Radius",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in circle radius",
    'default': [0, 1],
    category: "Value"
  },
  threshold: {
    name: "Threshold",
    type: [plotdb.Number],
    desc: "Diverging value split threshold",
    defaut: 0,
    category: "Value"
  },
  sort: {
    name: "Sort data",
    type: [plotdb.Choice("Ascending", "Descending", "None")],
    'default': "Descending",
    category: "Value"
  },
  emptyAs0: {
    name: "Empty as 0",
    type: [plotdb.Boolean],
    desc: "Treat undefined data as 0",
    'default': true,
    category: "Value"
  },
  otherLimit: {
    name: "Small Data Threshold",
    type: [plotdb.Number],
    desc: "Data smaller than this value will be clustered into one set of data",
    'default': 0,
    category: "Value"
  },
  axisInnerPadding: {
    name: "Axis Inner Tick length",
    type: [plotdb.Number],
    'default': 2,
    category: "Axis"
  },
  axisOutterPadding: {
    name: "Axis Outer Tick length",
    type: [plotdb.Number],
    'default': 2,
    category: "Axis"
  },
  showXAxis: {
    name: "Show X Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showYAxis: {
    name: "Show Y Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showRadialAxis: {
    name: "Show Radial Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showAngularAxis: {
    name: "Show Angular Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  xAxisTickSizeInner: {
    name: "X Axis Inner Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  xAxisTickSizeOuter: {
    name: "X Axis Outer Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  xAxisTickPadding: {
    name: "X Axis Tick Padding",
    type: [plotdb.Number],
    'default': 3,
    category: "Axis"
  },
  yAxisTickSizeInner: {
    name: "Y Axis Inner Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  yAxisTickSizeOuter: {
    name: "Y Axis Outer Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  yAxisTickPadding: {
    name: "Y Axis Tick Padding",
    type: [plotdb.Number],
    'default': 3,
    category: "Axis"
  },
  lineSmoothing: {
    name: "Line Smoothing",
    'default': "linear",
    type: [plotdb.Choice(['linear', 'step', 'step-before', 'step-after', 'basis', 'bundle', 'cardinal', 'monotone'])],
    category: "Style"
  },
  strokeWidth: {
    name: "Default Stroke Width",
    type: [plotdb.Number],
    desc: "Default width for stroke of visual encoding",
    'default': '2',
    category: "Style"
  }
};// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('sampleChart', ['$rootScope'].concat(function($rootScope){
  var ret;
  return ret = [
    {
      name: "Empty Chart",
      description: "a boilerplate for visualization",
      permission: {},
      key: 1,
      owner: null,
      _type: {
        location: 'sample',
        name: 'cahrt'
      },
      config: {
        padding: {
          name: "Padding",
          type: [plotdb.Number],
          'default': 10,
          rebindOnChange: false
        }
      },
      dimension: {
        value: {
          type: [plotdb.Number],
          require: true,
          desc: ""
        }
      },
      assets: [],
      library: ["d3/3.5.12/min", "plotd3/0.1.0"],
      doc: {
        content: ""
      },
      style: {
        content: ""
      },
      code: {
        content: 'var module = {};\nmodule.exports = plotdb.chart.create({\n  sample: function() {\n    return {\n      value: [{name: "Value", data: [1,2,3,4,5]}]\n    };\n  },\n  dimension: {\n    value: { type: [plotdb.Number], require: true, desc: "" }\n  },\n  config: {\n    /* you can write with a complete spec */\n    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: false },\n    /* .. or leave fields empty to inherit from default values */\n    margin: { },\n    fontSize: { }\n  },\n  init: function() {\n    var that = this;\n    this.svg = d3.select(this.root).append("svg");\n  },\n  parse: function() {\n    var that = this;\n  },\n  bind: function() {\n    var that = this;\n  },\n  resize: function() {\n    var that = this;\n    var box = this.root.getBoundingClientRect();\n    var width = this.width = box.width;\n    var height = this.height = box.height;\n    this.svg.attr({\n      width: width + "px", height: height + "px",\n      viewBox: [0,0,width,height].join(" "),\n      preserveAspectRatio: "xMidYMid"\n    });\n  },\n  render: function() {\n    var that = this;\n  }\n});'
      }
    }, {
      name: "Bubble Chart",
      description: "a simple bubble chart",
      permission: {},
      key: 2,
      owner: null,
      _type: {
        location: 'sample',
        name: 'cahrt'
      },
      config: {
        padding: {
          name: "Padding",
          type: [plotdb.Number],
          'default': 10,
          rebindOnChange: true
        },
        palette: {
          name: "Palette",
          type: [plotdb.Palette],
          'default': plotdb.Palette['default']
        }
      },
      dimension: {
        value: {
          type: [plotdb.Number],
          require: true,
          desc: "size of circle"
        },
        name: {
          type: [],
          require: false,
          desc: "tag of circle"
        }
      },
      assets: [],
      doc: {
        content: "<h3>D3.js Pack Layout Example</h3>"
      },
      style: {
        content: 'svg, body {\n  background: #fff;\n}\nsvg, body, text {\n  font-family: arial;\n  color: #222;\n  fill: #222;\n  font-size: 12px;\n}\ntext {\n  text-anchor: middle;\n  dominant-baseline: central;\n}\ncircle, rect, path {\n  fill: #eee;\n  stroke: #555;\n  stroke-width: 2;\n}\nh3 {\n  text-align: center;\n  font-family: Arial;\n}'
      },
      code: {
        content: 'var module = {};\nmodule.exports = plotdb.chart.create({\n  sample: [\n    {value: 3, name: "Allen"},\n    {value: 1, name: "Bob"},\n    {value: 4, name: "Cindy"},\n    {value: 1, name: "David"},\n    {value: 5, name: "Eva"},\n    {value: 9, name: "Frank"},\n    {value: 2, name: "Gill"},\n    {value: 6, name: "Hilbert"},\n    {value: 7, name: "James"}\n  ],\n  dimension: {\n    value: { type: [plotdb.Number], require: true, desc: "size of circle" },\n    name: { type: [], require: false, desc: "tag of circle" }\n  },\n  config: {\n    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: true },\n    palette: { name: "Palette", type: [plotdb.Palette], default: plotdb.Palette.default }\n  },\n  init: function() {\n    this.svg = d3.select(this.root).append("svg");\n  },\n  bind: function() {\n    this.resize();\n    this.circles = this.svg.selectAll("circle").data(this.nodes);\n    this.circles.enter().append("circle");\n    this.texts = this.svg.selectAll("text").data(this.nodes);\n    this.texts.enter().append("text");\n  },\n  resize: function() {\n    var box = this.root.getBoundingClientRect();\n    var width = box.width;\n    var height = box.height - 100;\n    this.svg.attr({\n      width: width + "px", height: height + "px",\n      viewBox: [0,0,width,height].join(" "),\n      preserveAspectRatio: "xMidYMid"\n    });\n    this.bubble = d3.layout.pack().padding(this.config.padding).size([width,height]);\n    this.nodes = this.bubble.nodes({children: this.data}).filter(function(it) { return it.depth; });\n    this.colors = d3.scale.ordinal().range(\n      this.config.palette.colors.map(function(it) { return it.hex; })\n    );\n  },\n  render: function() {\n    var that = this;\n    this.circles.attr({\n      cx: function(it) { return it.x; },\n      cy: function(it) { return it.y; },\n      r:  function(it) { return it.r; }\n    }).style({\n      stroke: function(it) { return that.colors(it.name); }\n    });\n    this.texts.attr({\n      x: function(it) { return it.x; },\n      y: function(it) { return it.y; }\n    }).text(function(it) { return it.name; });\n  }\n});\n'
      }
    }
  ];
}));// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('chartService', ['$rootScope', '$http', 'plConfig', 'sampleChart', 'IOService', 'baseService', 'dataService'].concat(function($rootScope, $http, plConfig, sampleChart, IOService, baseService, dataService){
  var service, object, chartService;
  service = {
    sample: sampleChart,
    link: function(chart){
      return "/chart/" + chart.key + "/";
    },
    thumblink: function(chart, full){
      full == null && (full = false);
      return (full ? plConfig.urlschema + "" + plConfig.domain : "") + ("/s/chart/" + chart.key + ".png");
    },
    sharelink: function(chart){
      return plConfig.urlschema + "" + plConfig.domainIO + "/v/chart/" + chart.key;
    }
  };
  object = function(src, lazy){
    var k, ref$, v;
    lazy == null && (lazy = false);
    import$(this, {
      name: 'untitled',
      owner: null,
      theme: null,
      parent: null,
      description: null,
      basetype: [],
      visualencoding: [],
      category: [],
      tags: [],
      likes: 0,
      searchable: false,
      doc: {
        name: 'document',
        type: 'html',
        content: service.sample[0].doc.content
      },
      style: {
        name: 'stylesheet',
        type: 'css',
        content: service.sample[0].style.content
      },
      code: {
        name: 'code',
        type: 'javascript',
        content: service.sample[0].code.content
      },
      assets: [],
      config: {},
      dimension: {},
      library: ["d3/3.5.12/min", "plotd3/0.1.0"],
      _type: {
        location: 'server',
        name: 'chart'
      }
    });
    import$(this, src);
    for (k in ref$ = this.dimension || {}) {
      v = ref$[k];
      v.fields = (v.fields || []).map(fn$);
    }
    return this;
    function fn$(it){
      var field;
      field = new dataService.Field(it);
      if (!lazy) {
        field.update();
      }
      return field;
    }
  };
  object.prototype = {
    save: function(){
      var payload, k, ref$, v, this$ = this;
      payload = JSON.parse(angular.toJson(this));
      for (k in ref$ = payload.dimension) {
        v = ref$[k];
        (v.fields || []).forEach(fn$);
      }
      return chartService.save(payload).then(function(ret){
        return this$.key = ret.key;
      });
      function fn$(it){
        var ref$;
        return ref$ = it.data, delete it.data, ref$;
      }
    },
    like: function(v){
      var this$ = this;
      return new Promise(function(res, rej){
        var ref$;
        this$.likes = (ref$ = this$.likes + (v
          ? 1
          : -1)) > 0 ? ref$ : 0;
        return $http({
          url: "/d/chart/" + this$.key + "/like",
          method: 'PUT'
        }).success(function(){
          this$.liked = !!v;
          return res();
        }).error(function(d, status){
          var ref$;
          this$.likes = (ref$ = this$.likes - (v
            ? 1
            : -1)) > 0 ? ref$ : 0;
          return rej();
        });
      });
    },
    addFile: function(name, type, content){
      var file;
      content == null && (content = null);
      file = {
        name: name,
        type: type,
        content: content
      };
      this.assets.push(file);
      return file;
    },
    removeFile: function(file){
      var idx;
      idx = this.assets.indexOf(file);
      if (idx < 0) {
        return;
      }
      return this.assets.splice(idx, 1);
    },
    updateData: function(){
      return plotdb.chart.updateData(this);
    }
  };
  chartService = baseService.derive('chart', service, object);
  return chartService;
}));
x$.controller('userChartList', ['$scope', '$http', 'dataService', 'chartService'].concat(function($scope, $http, dataService, chartService){
  var owner, that;
  owner = (that = /^\/user\/([^/]+)/.exec(window.location.pathname))
    ? that[1]
    : $scope.user.data ? $scope.user.data.key : null;
  $scope.q = {
    owner: owner
  };
  if ($scope.user.data && owner === $scope.user.data.key) {
    return $scope.showPub = true;
  }
}));
x$.controller('chartList', ['$scope', '$http', '$timeout', 'IOService', 'Paging', 'dataService', 'chartService', 'plNotify'].concat(function($scope, $http, $timeout, IOService, Paging, dataService, chartService, plNotify){
  var map, k, ref$, v;
  $scope.loading = true;
  $scope.charts = [];
  $scope.q = {
    type: null,
    enc: null,
    cat: null,
    dim: null,
    order: 'Latest'
  };
  $scope.qLazy = {
    keyword: null
  };
  if ($scope.$parent.q) {
    import$($scope.q, $scope.$parent.q);
  }
  if ($scope.$parent.qLazy) {
    import$($scope.qLazy, $scope.$parent.qLazy);
  }
  $scope.qmap = {
    type: ["Other", "Bar Chart", "Line Chart", "Pie Chart", "Area Chart", "Bubble Chart", "Radial Chart", "Calendar", "Treemap", "Map", "Cartogram", "Heatmap", "Sankey", "Venn Diagram", "Word Cloud", "Timeline", "Mixed", "Pictogram", "Scatter Plot"],
    enc: ["Other", "Position", "Position ( Non-aligned )", "Length", "Direction", "Angle", "Area", "Volume", "Curvature", "Shade", "Saturation"],
    cat: ["Other", "Infographics", "Geographics", "Interactive", "Journalism", "Statistics", "Business"],
    dim: [0, 1, 2, 3, 4, 5, "> 5"]
  };
  $scope.link = function(it){
    return chartService.link(it);
  };
  $scope.paging = Paging;
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = import$(import$((ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$), $scope.q), $scope.qLazy);
      return IOService.listRemotely({
        name: 'chart'
      }, payload);
    }, delay, reset).then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        data = (ret || []).map(function(it){
          return new chartService.chart(it, true);
        });
        Paging.flexWidth(data);
        return $scope.charts = (reset
          ? []
          : $scope.charts).concat(data);
      });
    });
  };
  $scope.$watch('q', function(){
    return $scope.loadList(500, true);
  }, true);
  $scope.$watch('qLazy', function(){
    return $scope.loadList(1000, true);
  }, true);
  $scope.like = function(chart){
    var v;
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    if (!chart) {
      return;
    }
    v = !chart.liked;
    return chart.like(v)['catch'](function(){
      plNotify.send('error', "You failed to love. try again later, don't give up!");
      return mylikes[chart.key] = !v;
    });
  };
  if (window.location.search) {
    map = d3.nest().key(function(it){
      return it[0];
    }).map(window.location.search.replace('?', '').split('&').map(function(it){
      return it.split('=');
    }));
    for (k in ref$ = $scope.q) {
      v = ref$[k];
      if (map[k]) {
        $scope.q[k] = map[k][0][1];
      }
    }
    for (k in ref$ = $scope.qLazy) {
      v = ref$[k];
      if (map[k]) {
        $scope.qLazy[k] = map[k][0][1];
      }
    }
  }
  Paging.loadOnScroll(function(){
    return $scope.loadList();
  }, $('#list-end'));
  $('#chart-explore-bar .btn[data-toggle="tooltip"]').tooltip();
  return $('#chart-explore-pretag .btn[data-toggle="tooltip"]').tooltip();
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('samplePalette', ['$rootScope'].concat(function($rootScope){
  var ret;
  ret = [
    {
      name: "Default",
      key: "F",
      colors: ['#1d3263', '#226c87', '#f8d672', '#e48e11', '#e03215', '#ab2321']
    }, {
      name: "Purple",
      key: "Purple",
      colors: ['#d9a301', '#cd3313', '#ba0c69', '#8b278f', '#403f83']
    }, {
      name: "Code for Africa",
      key: "A",
      colors: ['#f4502a', '#f1c227', '#008a6d', '#00acdb', '#0064a8']
    }, {
      name: "Chart",
      key: "B",
      colors: ['#3a66cb', '#0ebeba', '#fee476', '#feae01', '#e62b0f']
    }, {
      name: "PlotDB",
      key: "C",
      colors: ['#ed1d78', '#c59b6d', '#8cc63f', '#28aae2']
    }, {
      name: "The Reporter",
      key: "D",
      colors: ['#7a322a', '#d52c2a', '#f93634', '#dddb83', '#ede6de', '#fdfffa', '#dbdbdb', '#48462d']
    }, {
      name: "Pinky",
      key: "E",
      colors: ['#F29C98', '#F5B697', '#F5E797', '#A2E4F5', '#009DD3']
    }
  ];
  ret.map(function(it){
    it.colors = it.colors.map(function(d, i){
      return {
        hex: d,
        idx: i
      };
    });
    return it._type = {
      location: 'sample',
      name: 'palette'
    };
  });
  return ret;
}));// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('paletteService', ['$rootScope', 'samplePalette', 'IOService', 'baseService'].concat(function($rootScope, samplePalette, IOService, baseService){
  var name, service, Palette, paletteService;
  name = 'palette';
  service = {
    sample: samplePalette,
    list2pal: function(name, list){
      return {
        name: name,
        colors: list.map(function(it){
          return {
            hex: it
          };
        })
      };
    },
    list: function(){
      return IOService.listRemotely({
        name: 'palette',
        location: 'server'
      }).then(function(r){
        return r.map(function(it){
          return new Dataset(it);
        });
      });
    }
  };
  Palette = function(config){
    import$(this, {
      name: "",
      colors: [],
      owner: null,
      createdtime: new Date(),
      modifiedtime: new Date(),
      permission: {
        'switch': [],
        value: []
      },
      _type: {
        location: 'server',
        name: 'palette'
      }
    });
    import$(this, config);
    return this;
  };
  paletteService = baseService.derive(name, service, Palette);
  return paletteService;
}));
x$.controller('paletteList', ['$scope', 'IOService', 'paletteService', 'Paging', 'plNotify', 'eventBus'].concat(function($scope, IOService, paletteService, Paging, plNotify, eventBus){
  $scope.paging = Paging;
  $scope.samplesets = paletteService.sample.map(function(it){
    return it.key = -Math.random(), it;
  });
  $scope.palettes = [].concat($scope.samplesets);
  $scope.myPalettes = [];
  $scope.setcur = function(it){
    return $scope.cur = it;
  };
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = import$(import$((ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$), $scope.q), $scope.qLazy);
      return IOService.listRemotely({
        name: 'palette'
      }, payload);
    }, delay, reset).then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        data = (ret || []).map(function(it){
          return new paletteService.palette(it);
        });
        $scope.myPalettes = (reset
          ? []
          : $scope.myPalettes).concat(data);
        $scope.palettes = $scope.samplesets.concat($scope.myPalettes);
        if (!$scope.cur) {
          return $scope.setcur($scope.palettes[0]);
        }
      });
    });
  };
  $scope.$watch('palettes', function(){
    var i$, to$, i, pal, results$ = [];
    for (i$ = 0, to$ = $scope.palettes.length; i$ < to$; ++i$) {
      i = i$;
      pal = $scope.palettes[i];
      results$.push(pal.width = 100 / pal.colors.length);
    }
    return results$;
  });
  if ($('#pal-list-end')) {
    Paging.loadOnScroll(function(){
      return $scope.loadList();
    }, $('#pal-list-end'), $('#pal-editor-loader'));
  }
  $scope.loadList();
  eventBus.listen('paledit.update', function(pal){
    var matched;
    matched = $scope.myPalettes.filter(function(it){
      return it.key === pal.key;
    });
    if (matched.length) {
      return import$(matched[0], pal);
    } else {
      return $scope.loadList();
    }
  });
  return eventBus.listen('paledit.delete', function(key){
    $scope.myPalettes = $scope.myPalettes.filter(function(it){
      return it.key !== key;
    });
    return $scope.palettes = $scope.palettes.filter(function(it){
      return it.key !== key;
    });
  });
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var plotdb;
if (!(typeof plotdb != 'undefined' && plotdb !== null)) {
  plotdb = {};
}
(plotdb.theme || (plotdb.theme = {})).sample = [
  {
    key: "/theme/sample/:default",
    name: "Default",
    _type: {
      location: 'sample',
      name: 'theme'
    },
    code: {
      content: 'var module = {};\nmodule.exports = plotdb.theme.create({\n  typedef: {\n    Color: {\n      "default": "#222",\n      "positive": "#391",\n      "negative": "#b41"\n    },\n    Palette: {\n      "default": { colors: [ {hex: "#ae4948"}, {hex: "#256b9e"} ] },\n      "binary": { colors: [ {hex: "#ae4948"}, {hex: "#256b9e"} ] },\n      "diverging": {\n        colors: [\n          {hex: "#b81673"}, {hex: "#eb7696"}, {hex: "#e0e0a0"},\n          {hex: "#83b365"}, {hex: "#368239"}\n        ]\n      },\n      "qualitative": {\n        colors: [\n          {hex: "#b43743"}, {hex: "#e68061"}, {hex: "#f9cb48"},\n          {hex: "#3c6a9c"}, {hex: "#0c2a54"}, {hex: "#405067"},\n          {hex: "#5a5e84"}\n        ]\n      },\n    }\n  }\n});'
    },
    style: {
      content: "circle { fill: #f00; stroke: #000; stroke-width: 1; }"
    }
  }, {
    key: "/theme/sample/:plotdb",
    name: "PlotDB",
    _type: {
      location: 'sample',
      name: 'theme'
    },
    doc: {
      content: '<link href=\'https://fonts.googleapis.com/css?family=Lato:200,300,400,700\' rel=\'stylesheet\' type=\'text/css\'/>'
    },
    style: {
      content: 'body, text {\n  font-family: \'lato\', \'Helvetica Neue\', Helvetica, sans-serif;\n}\n\n.axis .tick line {\n  stroke: #bbb;\n}\n.axis .domain {\n  stroke: #444;\n}\n.axis .tick text {\n  fill: #444;\n  font-weight: 400;\n}\n\nline.connect {\n  stroke-width: 1;\n}\n.axis.horizontal .tick line, .axis.horizontal .tick text {\n  transform: translate(40px,-4px);\n  opacity: 0.8;\n}\n\n.axis.horizontal .tick line {\n  transform: translateY(10px) scaleY(1.5);\n  stroke-linecap: round;\n  stroke-width: 2;\n  stroke-dasharray: 1 1;\n  opacity: 0.4;\n}\n\n.popup {\n  background: #fff;\n  color: #555;\n}\n.popup:after {\n  background: #fff;\n  height: 0;\n  top: 50%;\n  margin-top: -1px;\n  transform: rotate(0);\n  border-bottom: 3px solid #ddd;\n}\n.popup.right:after {\n  left: -11px;\n}\n.popup.left:after {\n  background: #fff;\n  right: -11px\n}\n\n'
    }
  }
];
if (typeof module != 'undefined' && module !== null) {
  module.exports = plotdb.theme.sample;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('sampleTheme', ['$rootScope'].concat(function($rootScope){
  return plotdb.theme.sample;
}));
x$.service('themeService', ['$rootScope', '$http', 'IOService', 'sampleTheme', 'baseService', 'plNotify', 'eventBus'].concat(function($rootScope, $http, IOService, sampleTheme, baseService, plNotify, eventBus){
  var service, object, themeService;
  service = {
    sample: sampleTheme,
    link: function(theme){
      return "/theme/" + theme.key;
    },
    thumblink: function(theme){
      return "/s/theme/" + theme.key + ".png";
    },
    sharelink: function(chart){
      return plConfig.urlschema + "" + plConfig.domain + "/v/theme/" + chart.key;
    },
    list: function(){
      return IOService.listRemotely({
        name: 'theme',
        location: 'server'
      }).then(function(r){
        return r.map(function(it){
          return new object(it);
        });
      });
    }
  };
  object = function(src){
    var ref$;
    import$(this, {
      name: 'untitled',
      description: null,
      tags: null,
      theme: null,
      doc: {
        name: 'document',
        type: 'html',
        content: ((ref$ = service.sample[0]).doc || (ref$.doc = {})).content || ""
      },
      style: {
        name: 'stylesheet',
        type: 'css',
        content: ((ref$ = service.sample[0]).style || (ref$.style = {})).content || ""
      },
      code: {
        name: 'code',
        type: 'javascript',
        content: ((ref$ = service.sample[0]).code || (ref$.code = {})).content || ""
      },
      config: {},
      dimension: {},
      assets: [],
      likes: 0,
      parent: null,
      _type: {
        location: 'server',
        name: 'theme'
      }
    });
    import$(this, src);
    if (!Array.isArray(this.assets)) {
      this.assets = [];
    }
    return this;
  };
  object.prototype = {
    addFile: function(name, type, content){
      var file;
      content == null && (content = null);
      file = {
        name: name,
        type: type,
        content: content
      };
      this.assets.push(file);
      return file;
    },
    removeFile: function(file){
      var idx;
      idx = this.assets.indexOf(file);
      if (idx < 0) {
        return;
      }
      return this.assets.splice(idx, 1);
    }
  };
  themeService = baseService.derive('theme', service, object);
  return themeService;
}));
x$.controller('themeList', ['$scope', '$http', 'IOService', 'Paging', 'dataService', 'themeService'].concat(function($scope, $http, IOService, Paging, dataService, themeService){
  $scope.loading = true;
  $scope.load = function(theme){
    return window.location.href = themeService.link(theme);
  };
  $scope.link = function(it){
    return themeService.link(it);
  };
  $scope.paging = Paging;
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = (ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$);
      return IOService.listRemotely({
        name: 'theme'
      }, payload);
    }, delay, reset).then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        $scope.loading = false;
        data = (ret || []).map(function(it){
          return new themeService.theme(it);
        });
        return $scope.themes = (reset || !$scope.themes
          ? []
          : $scope.themes).concat(data);
      });
    });
  };
  $scope.loadList(0, true);
  return Paging.loadOnScroll(function(){
    return $scope.loadList();
  }, $('#list-end'));
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('userSelection', ['$scope', '$http', 'plNotify', 'teamService'].concat(function($scope, $http, plNotify, teamService){
  var select2BaseConfig;
  select2BaseConfig = {
    escapeMarkup: function(it){
      return it;
    },
    language: {
      inputTooShort: function(it){
        return "<span class='grayed'>type " + (it.minimum - (it.input || '').length) + " more chars to search</span>";
      },
      errorLoading: function(){
        return "<span class='grayed'>something is wrong... try again later.</span>";
      },
      loadingMore: function(){
        return "<img src='/assets/img/loading.gif'>";
      },
      noResults: function(){
        return "<span class='grayed'>no result.</span>";
      },
      searching: function(){
        return "<img src='/assets/img/loading.gif'><span class='grayed'>searching...</span>";
      }
    },
    minimumInputLength: 3,
    templateResult: function(it){
      if (!it || !it.displayname) {
        return "<img src='/assets/img/loading.gif'>";
      }
      return "<div class=\"select2-user\">\n<img src=\"/s/avatar/" + (it.avatar || 0) + ".jpg\">\n<span>" + it.displayname + "</span>\n<small class=\"grayed\">" + (it.type === "team" ? "(team)" : "") + "</small>\n</div>";
    },
    templateSelection: function(it){
      return "<div class=\"select2-user selected\">\n<img src=\"/s/avatar/" + (it.avatar || 0) + ".jpg\">\n<span>" + it.displayname + "</span>\n<small class=\"grayed\">" + (it.type === "team" ? "(team)" : "") + "</small>\n</div>";
    }
  };
  $scope.save = function(){
    var members, team;
    members = $('#search-user').val();
    team = new teamService.team();
    team.name = $scope.name;
    team.description = $scope.description;
    return $http({
      url: '/d/team/',
      method: 'POST',
      data: {
        team: team,
        members: members
      }
    }).success(function(d){
      return plNotify.send('success', "team created.");
    }).error(function(d){
      return plNotify.send('error', "failed creating team. try again later?");
    });
  };
  $('#search-user-team').select2(import$(select2BaseConfig, {
    placeholder: "search by user, team name or email address...",
    ajax: {
      url: "http://localhost/d/user/?team=true",
      dataType: "json",
      delay: 250,
      data: function(params){
        return {
          keyword: params.term,
          offset: (params.page || 0) * 20,
          limit: 20
        };
      },
      processResults: function(data, params){
        params.page = params.page || 0;
        return {
          results: data.map(function(it){
            return it.id = it.type + ":" + it.key, it;
          }),
          pagination: {
            more: data && data.length
          }
        };
      },
      cache: true
    }
  }));
  /*
     escapeMarkup: -> it
     minimumInputLength: 1
     templateResult: ->
       if !it or !it.displayname => return "<img src='/assets/img/loading.gif'>"
       """
       <div class="select2-user">
       <img src="/s/avatar/#{it.avatar or 0}.jpg">
       <span>#{it.displayname}</span>
       <small class="grayed">#{if it.type=="team" => "(team)" else ""}</small>
       </div>
       """
     templateSelection: ->
       """
       <div class="select2-user selected">
       <img src="/s/avatar/#{it.avatar or 0}.jpg">
       <span>#{it.displayname}</span>
       <small class="grayed">#{if it.type=="team" => "(team)" else ""}</small>
       </div>
       """
  */
  return $('#search-user').select2(import$(select2BaseConfig, {
    placeholder: "search by user name or email address...",
    ajax: {
      url: "http://localhost/d/user/",
      dataType: "json",
      delay: 250,
      data: function(params){
        params.num = parseInt(Math.random() * 100);
        return {
          keyword: params.term,
          offset: (params.page || 0) * 20,
          limit: 20
        };
      },
      processResults: function(data, params){
        params.page = params.page || 0;
        return {
          results: data.map(function(it){
            return it.id = it.key, it;
          }),
          pagination: {
            more: data && data.length
          }
        };
      },
      cache: true
    }
  }));
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('teamService', ['$rootScope', '$http', 'plConfig', 'IOService', 'baseService'].concat(function($rootScope, $http, plConfig, IOService, baseService){
  var service, object, teamService;
  service = {};
  object = function(config){
    import$(this, {
      name: 'untitled',
      description: null,
      owner: null,
      createdtime: new Date(),
      modifiedtime: new Date(),
      _type: {
        location: 'server',
        name: 'team'
      },
      permission: {
        'switch': [],
        value: []
      }
    });
    import$(this, config);
    return this;
  };
  teamService = baseService.derive('team', service, object);
  return teamService;
}));
x$.controller('teamEdit', ['$scope', '$http', '$timeout', 'plNotify', 'teamService', 'eventBus'].concat(function($scope, $http, $timeout, plNotify, teamService, eventBus){
  $scope.team = new teamService.team(window.team || {});
  $scope.members = window.members || [];
  $scope.newMembers = [];
  $scope.charts = window.charts || [];
  $scope.newCharts = [];
  $scope.removeChart = function(tid, cid){
    return $http({
      url: "/d/team/" + tid + "/chart/" + cid,
      method: 'DELETE'
    }).success(function(d){
      var idx;
      idx = $scope.charts.map(function(it){
        return it.key;
      }).indexOf(cid);
      if (idx < 0) {
        return;
      }
      $scope.charts.splice(idx, 1);
      return plNotify.send('success', "chart removed");
    }).error(function(d){
      return plNotify.send('error', "failed to remove chart, try again later?");
    });
  };
  $scope.removeMember = function(tid, mid){
    return $http({
      url: "/d/team/" + tid + "/member/" + mid,
      method: 'DELETE'
    }).success(function(d){
      var idx;
      idx = $scope.members.map(function(it){
        return it.key;
      }).indexOf(mid);
      if (idx < 0) {
        return;
      }
      $scope.members.splice(idx, 1);
      return plNotify.send('success', "member removed");
    }).error(function(d){
      return plNotify.send('error', "failed to remove member, try again later?");
    });
  };
  $scope.addCharts = function(tid){
    if (!$scope.newCharts || !$scope.newCharts.length) {
      return;
    }
    return $http({
      url: "/d/team/" + tid + "/chart/",
      method: 'post',
      data: $scope.newCharts.map(function(it){
        return it.key;
      })
    }).success(function(d){
      $scope.charts = $scope.charts.concat($scope.newCharts.filter(function(it){
        return $scope.charts.indexOf(it.key) < 0;
      }));
      return plNotify.send('success', "charts added");
    }).error(function(d){
      return plNotify.send('error', "failed to add charts. try again later?");
    });
  };
  $scope.addMembers = function(tid){
    if (!$scope.newMembers || !$scope.newMembers.length) {
      return;
    }
    return $http({
      url: "/d/team/" + tid + "/member/",
      method: 'POST',
      data: $scope.newMembers.map(function(it){
        return it.key;
      })
    }).success(function(d){
      $scope.members = $scope.members.concat($scope.newMembers.filter(function(it){
        return $scope.members.indexOf(it.key) < 0;
      }));
      return plNotify.send('success', "members added");
    }).error(function(d){
      return plNotify.send('error', "failed to add members. try again later?");
    });
  };
  $scope.avatar = {
    files: [],
    raw: null,
    preview: null,
    init: function(){
      var this$ = this;
      return $scope.$watch('avatar.files', function(){
        return this$.parse().then(function(payload){
          return $scope.$apply(function(){
            this$.raw = payload;
            this$.preview = null;
            if (this$.raw) {
              return this$.preview = URL.createObjectURL(new Blob([this$.raw], {
                type: this$.files[0].type
              }));
            }
          });
        })['catch'](function(e){
          return $scope.$apply(function(){
            this$.preview = null;
            return plNotify.send('danger', e);
          });
        });
      });
    },
    parse: function(){
      var this$ = this;
      return new Promise(function(res, rej){
        var file, x$, fr;
        file = this$.files[0];
        if (!file) {
          res();
        }
        if (!/image\//.exec(file.type)) {
          return rej("Avatar is not an image, use image instead.");
        }
        if (file.size >= 1048576) {
          return rej("Avatar is too large. let's try another (<1MB).");
        }
        x$ = fr = new FileReader();
        x$.onabort = function(){
          return rej("Failed reading avatar. Try other image?");
        };
        x$.onerror = function(){
          return rej("Failed reading avatar. Try other image?");
        };
        x$.onload = function(){
          return res(new Uint8Array(fr.result));
        };
        x$.readAsArrayBuffer(file);
        return x$;
      });
    },
    upload: function(team){
      var this$ = this;
      return new Promise(function(res, rej){
        var fd;
        if (!team || !team.key) {
          return rej("Can't upload avatar if there is no team.");
        }
        if (!this$.raw) {
          return rej("No avatar to upload. Select a file first!");
        }
        fd = new FormData();
        fd.append('image', new Blob([this$.raw], {
          type: "application/octet-stream"
        }));
        return $http({
          url: "/d/team/" + team.key + "/avatar/",
          method: 'POST',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined
          }
        }).success(function(d){
          return res();
        }).error(function(d){
          return rej("Failed uploading avatar. Try other image later?");
        });
      });
    }
  };
  $scope.avatar.init();
  $scope.error = {};
  $scope.dismiss = function(){
    return eventBus.fire('team-panel.create.dismiss');
  };
  $scope.redirect = function(delay){
    delay == null && (delay = 0);
    if ($scope.team && $scope.team.key) {
      return setTimeout(function(){
        return window.location.href = "/team/" + $scope.team.key;
      }, delay);
    }
  };
  return $scope.save = function(){
    var isUpdate;
    isUpdate = !!$scope.team.key;
    $scope.error = {};
    if (!$scope.team.name) {
      $scope.error.name = true;
      return plNotify.send('danger', "Team name is required.");
    }
    eventBus.fire('loading.dimmer.on');
    return $http({
      url: "/d/team/" + (isUpdate ? $scope.team.key : ''),
      method: isUpdate ? 'PUT' : 'POST',
      data: isUpdate
        ? $scope.team
        : {
          team: $scope.team,
          members: $scope.newMembers
        }
    }).success(function(d){
      var promise;
      if (!isUpdate) {
        $scope.team.key = d.key;
      }
      if ($scope.avatar.files[0] && $scope.avatar.raw) {
        promise = $scope.avatar.upload($scope.team);
      } else {
        promise = Promise.resolve();
      }
      return promise.then(function(){
        return $scope.$apply(function(){
          plNotify.send('success', "team " + (isUpdate ? 'updated' : 'created') + ".");
          if (!isUpdate) {
            return $scope.redirect(1000);
          } else {
            $scope.redirect(1000);
            return $timeout(function(){
              eventBus.fire('loading.dimmer.off');
              return eventBus.fire('team-panel.create.dismiss');
            }, 1000);
          }
        });
      })['catch'](function(err){
        return $scope.$apply(function(){
          plNotify.send('warning', "team created, but... ");
          plNotify.send('danger', err);
          return $scope.redirect(2000);
        });
      });
    }).error(function(d){
      eventBus.fire('loading.dimmer.off');
      return plNotify.send('error', "failed creating team. try again later?");
    });
  };
}));
x$.controller('teamList', ['$scope', 'IOService', 'teamService', 'Paging', 'plNotify', 'eventBus'].concat(function($scope, IOService, teamService, Paging, plNotify, eventBus){
  $scope.teams = [];
  $scope.paging = Paging;
  $scope.paging.limit = 50;
  $scope.$watch('qLazy', function(){
    return $scope.loadList(1000, true);
  }, true);
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = import$(import$((ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$), $scope.q), $scope.qLazy);
      payload.detail = true;
      return IOService.listRemotely({
        name: 'team'
      }, payload);
    }, delay, reset, 'teams').then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        data = (ret.teams || []).map(function(it){
          return new teamService.team(it);
        });
        data.map(function(t){
          t.members = ret.members.filter(function(m){
            return m.team === t.key;
          });
          return t.count = +t.count;
        });
        Paging.flexWidth(data);
        return $scope.teams = (reset
          ? []
          : $scope.teams).concat(data);
      });
    });
  };
  if ($('#list-end')) {
    Paging.loadOnScroll(function(){
      return $scope.loadList();
    }, $('#list-end'));
  }
  return $scope.loadList();
}));
x$.controller('teamBase', ['$scope', 'IOService', 'teamService', 'Paging', 'plNotify', 'eventBus'].concat(function($scope, IOService, teamService, Paging, plNotify, eventBus){
  $scope.teamPanel = {
    create: {
      toggle: function(){
        if (!$scope.user.authed()) {
          return $scope.auth.toggle(true);
        }
        return this.toggled = !this.toggled;
      }
    }
  };
  return eventBus.listen('team-panel.create.dismiss', function(){
    return $scope.teamPanel.create.toggled = false;
  });
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('entityService', ['$rootScope', '$http', 'plConfig', 'IOService', 'baseService'].concat(function($rootScope, $http, plConfig, IOService, baseService){
  var service;
  service = {
    config: {
      plselect: {
        chart: {
          placeholder: "search by chart name or id ...",
          ajax: {
            url: '/d/chart/',
            param: function(keyword, limit, offset){
              return {
                simple: true,
                keyword: keyword,
                limit: limit,
                offset: offset
              };
            }
          }
        },
        entityChart: {
          placeholder: "search by user, chart, team name or email address...",
          ajax: {
            url: '/d/entity/?type=7',
            param: function(keyword, limit, offset){
              return {
                keyword: keyword,
                limit: limit,
                offset: offset
              };
            }
          }
        },
        entity: {
          placeholder: "search by user, team name or email address...",
          ajax: {
            url: '/d/entity/',
            param: function(keyword, limit, offset){
              return {
                keyword: keyword,
                limit: limit,
                offset: offset
              };
            }
          }
        },
        team: {
          placeholder: "search by team name or email address...",
          ajax: {
            url: '/d/team/',
            param: function(keyword, limit, offset){
              return {
                keyword: keyword,
                limit: limit,
                offset: offset
              };
            }
          }
        },
        user: {
          placeholder: "search by user name or email address...",
          ajax: {
            url: '/d/user/',
            param: function(keyword, limit, offset){
              return {
                keyword: keyword,
                limit: limit,
                offset: offset
              };
            }
          }
        }
      }
    }
  };
  return service;
}));// Generated by LiveScript 1.3.1
var x$, onSignIn, slice$ = [].slice;
x$ = angular.module('plotDB');
x$.config(['$compileProvider'].concat(function($compileProvider){
  return $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob:|https?:\/\/([a-z0-9]+.)?plotdb\.com\/|https?:\/\/([a-z0-9]+.)?plotdb\.io\/|http:\/\/localhost\/|http:\/\/localhost.io\/|https:\/\/www\.facebook\.com\/|https:\/\/www\.pinterest\.com\/|mailto:\?|http:\/\/www\.linkedin\.com\/|http:\/\/twitter\.com\/)|#|https:\/\/docs.google.com\/spreadsheets\//);
}));
x$.service('eventBus', ['$rootScope'].concat(function($rootScope){
  var ret;
  return ret = import$(this, {
    queues: {},
    handlers: {},
    process: function(name){
      var list, res$, k, ref$, v, this$ = this;
      name == null && (name = null);
      if (!name) {
        res$ = [];
        for (k in ref$ = this.queues) {
          v = ref$[k];
          res$.push([k, v]);
        }
        list = res$;
      } else {
        list = [[name, (ref$ = this.queues)[name] || (ref$[name] = [])]];
      }
      return list.map(function(arg$){
        var k, v, i$, ref$, len$, func, j$, len1$, payload;
        k = arg$[0], v = arg$[1];
        if (!v || !v.length) {
          return;
        }
        for (i$ = 0, len$ = (ref$ = this$.handlers[k] || []).length; i$ < len$; ++i$) {
          func = ref$[i$];
          for (j$ = 0, len1$ = v.length; j$ < len1$; ++j$) {
            payload = v[j$];
            func.apply(null, [payload[0]].concat(payload[1]));
          }
        }
        return ((ref$ = this$.queues)[name] || (ref$[name] = [])).splice(0, ((ref$ = this$.queues)[name] || (ref$[name] = [])).length);
      });
    },
    listen: function(name, cb){
      var ref$;
      ((ref$ = this.handlers)[name] || (ref$[name] = [])).push(cb);
      return this.process(name);
    },
    fire: function(name, payload){
      var params, ref$;
      params = slice$.call(arguments, 2);
      ((ref$ = this.queues)[name] || (ref$[name] = [])).push([payload, params]);
      return this.process(name);
    }
  });
}));
x$.service('plNotify', ['$rootScope', '$timeout'].concat(function($rootScope, $timeout){
  var plNotify;
  plNotify = import$(this, {
    queue: [],
    send: function(type, message){
      var node, this$ = this;
      this.queue.push(node = {
        type: type,
        message: message
      });
      return $timeout(function(){
        return this$.queue.splice(this$.queue.indexOf(node), 1);
      }, 2900);
    },
    alert: function(message){
      this.alert.msg = message;
      return this.alert.toggled = true;
    }
  });
  (this.aux || (this.aux = {})).error = {
    io: function(name, type, e){
      if (!e || e.length < 3) {
        return plNotify.send('error', name + " failed.");
      } else if (e[2] === 400) {
        return plNotify.send('error', name + " failed: malformat " + type + ".");
      } else if (e[2] === 403) {
        return plNotify.send('error', name + " failed: permissions denied.");
      } else if (e[2] === 404) {
        return plNotify.send('error', name + " failed: " + type + " doesn't exist.");
      } else if (e[2] === 413) {
        return plNotify.send('error', name + " failed: " + type + " is too large.");
      } else {
        return plNotify.send('error', name + " failed.");
      }
    }
  };
  return this;
}));
x$.controller('plSite', ['$scope', '$http', '$interval', 'global', 'plNotify', 'dataService', 'chartService', 'eventBus'].concat(function($scope, $http, $interval, global, plNotify, dataService, chartService, eventBus){
  var that, x$;
  $scope.trackEvent = function(cat, act, label, value){
    return ga('send', 'event', cat, act, label, value);
  };
  $scope.notifications = plNotify.queue;
  $scope.alert = plNotify.alert;
  $scope.nexturl = (that = /nexturl=([^&]+)/.exec(window.location.search || ""))
    ? that[1]
    : window.location.href;
  $scope.user = {
    data: global.user,
    authed: function(){
      return this.data && this.data.key;
    }
  };
  $scope.dataService = dataService;
  $scope.limitscroll = function(node){
    var prevent;
    prevent = function(e){
      e.stopPropagation();
      e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    };
    return node.addEventListener('mousewheel', function(e){
      var box, height, scroll, delta, doPrevent, onAgent, ref$;
      box = this.getBoundingClientRect();
      height = box.height;
      scroll = {
        height: this.scrollHeight,
        top: this.scrollTop
      };
      if (scroll.height <= height) {
        return;
      }
      delta = e.deltaY;
      doPrevent = false;
      onAgent = false;
      if (e.target && (e.target.id === 'field-agent' || e.target.parentNode.id === 'field-agent')) {
        ref$ = [true, true], onAgent = ref$[0], doPrevent = ref$[1];
      }
      if (onAgent) {
        $(this).scrollTop(scroll.top + e.deltaY);
      } else if (-e.deltaY > scroll.top) {
        $(this).scrollTop(0);
        doPrevent = true;
      } else if (e.deltaY > 0 && scroll.height - height - scroll.top <= 0) {
        doPrevent = true;
      }
      return doPrevent ? prevent(e) : undefined;
    });
  };
  $scope.confirmbox = {
    config: {
      message: "",
      options: [],
      callback: function(){}
    },
    toggled: false,
    handle: function(id){
      this.toggled = false;
      return this.config.callback(id);
    }
  };
  eventBus.listen('confirmbox.on', function(config){
    $scope.confirmbox.config = config;
    return $scope.confirmbox.toggled = true;
  });
  $scope.loading = {
    dimmer: false
  };
  eventBus.listen('loading.dimmer.on', function(it){
    $scope.loading.dimmer = true;
    return $scope.loading.progress = it != null ? it : 0;
  });
  eventBus.listen('loading.dimmer.off', function(){
    return $scope.loading.dimmer = false;
  });
  eventBus.listen('loading.dimmer.progress', function(it){
    return $scope.loading.progress = it;
  });
  $scope.scrollto = function(sel){
    sel == null && (sel = null);
    return setTimeout(function(){
      var top;
      top = sel ? $(sel).offset().top - 60 : 0;
      $(document.body).animate({
        scrollTop: top
      }, '500', 'swing', function(){});
      return $("html").animate({
        scrollTop: top
      }, '500', 'swing', function(){});
    }, 0);
  };
  $scope.auth = {
    email: '',
    passwd: '',
    show: false,
    stick: false,
    toggle: function(value){
      return this.show = value != null
        ? !!value
        : !this.show;
    },
    failed: '',
    keyHandler: function(e){
      if (e.keyCode === 13) {
        return this.login();
      }
    },
    loading: false,
    error: {},
    logout: function(){
      console.log('logout..');
      return $http({
        url: '/u/logout',
        method: 'GET'
      }).success(function(d){
        console.log('logouted.');
        $scope.user.data = null;
        return window.location.reload();
      }).error(function(d){
        return plNotify.send('danger', 'Failed to Logout. ');
      });
    },
    emailRe: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.[a-z]{2,}|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
    login: function(){
      var this$ = this;
      this.error = {};
      if (!this.emailRe.exec(this.email)) {
        this.error.email = "use email here";
        return;
      }
      if (!this.passwd || this.passwd.length < 4) {
        this.error.passwd = "password too short";
        return;
      }
      this.loading = true;
      $http({
        url: '/u/login',
        method: 'POST',
        data: $.param({
          email: this.email,
          passwd: this.passwd
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).success(function(d){
        $scope.auth.failed = '';
        $scope.auth.succeed = 'success! ' + ($('#authpanel').hasClass('static') ? 'redirecting...' : '');
        $scope.user.data = d;
        if (typeof ga != 'undefined' && ga !== null) {
          ga('set', '&uid', d.key);
        }
        this$.show = false;
        if ($scope.nexturl) {
          window.location.href = $scope.nexturl;
        } else if (window.location.pathname === '/u/login') {
          window.location.href = '/';
        }
        return this$.loading = false;
      }).error(function(d, code){
        if (code === 403) {
          $scope.auth.failed = (d.message || (d.message = [])).length ? d.message[0] : 'email or password incorrect';
        } else {
          $scope.auth.failed = 'system error, please try later';
        }
        return this$.loading = false;
      });
      return this.passwd = "";
    }
  };
  $scope.$watch('auth.show', function(isShow){
    if ($('#authpanel').hasClass('static')) {
      return;
    }
    return setTimeout(function(){
      if (isShow) {
        return $('#authpanel').modal('show');
      } else {
        return $('#authpanel').modal('hide');
      }
    }, 0);
  });
  $('#authpanel').on('shown.bs.modal', function(){
    return $scope.$apply(function(){
      return $scope.auth.show = true;
    });
  });
  $('#authpanel').on('hidden.bs.modal', function(){
    return $scope.$apply(function(){
      return $scope.auth.show = false;
    });
  });
  x$ = window.scrollstickers = $('.scroll-stick');
  x$.map(function(){
    var box;
    box = this.getBoundingClientRect();
    this.maxtop = parseInt(this.getAttribute("data-top"));
    return this.initval = {
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height
    };
  });
  window.addEventListener('scroll', function(it){
    var scrollTop, i$, ref$, len$, node, results$ = [];
    scrollTop = $(window).scrollTop();
    if (scrollTop < 60) {
      $('#nav-top').removeClass('dim');
      $('#subnav-top').removeClass('dim');
    } else {
      $('#nav-top').addClass('dim');
      $('#subnav-top').addClass('dim');
    }
    for (i$ = 0, len$ = (ref$ = window.scrollstickers).length; i$ < len$; ++i$) {
      node = ref$[i$];
      if (node.initval.top - scrollTop <= node.maxtop && !node.sticked) {
        node.sticked = true;
        node.style.top = node.maxtop + "px";
        node.style.width = node.initval.width + "px";
        node.style.left = node.initval.left + "px";
        results$.push($(node).addClass('sticked'));
      } else if (scrollTop + node.maxtop < node.initval.top && node.sticked) {
        node.sticked = false;
        node.style.top = 'initial';
        results$.push($(node).removeClass('sticked'));
      }
    }
    return results$;
  });
  /* temporarily code for mockup */
  /*
  $scope.charts = []
  list = JSON.parse(localStorage.getItem("/list/charttype"))
  for item in list =>
    chart = JSON.parse(localStorage.getItem("/charttype/#item"))
    $scope.charts.push chart
  */
  return $scope.load = function(chart){
    return window.location.href = chartService.link(chart);
  };
}));
onSignIn = function(it){
  return console.log(it);
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$, slice$ = [].slice;
x$ = angular.module('plotDB');
x$.service('Paging', ['$rootScope', '$timeout'].concat(function($rootScope, $timeout){
  var Paging;
  return Paging = {
    session: 0,
    offset: 0,
    limit: 20,
    end: false,
    loading: false,
    handle: null,
    loadOnScroll: function(cb, beacon, container){
      if (container) {
        container = $(container)[0];
      }
      if (beacon) {
        beacon = $(beacon)[0];
      }
      return (container || window).addEventListener('scroll', function(v){
        var scrolltop, that, height, top, ptop, this$ = this;
        scrolltop = container
          ? container.scrollTop
          : (that = document.body.scrollTop)
            ? that
            : document.querySelector('html').scrollTop;
        height = (container || document.body).getBoundingClientRect().height;
        top = beacon.getBoundingClientRect().top;
        ptop = container ? container.getBoundingClientRect().top : 0;
        if (height + 50 > top - ptop) {
          if (!this.loading && !this.end) {
            return $rootScope.$apply(function(){
              return cb();
            });
          }
        }
      });
    },
    load: function(load, lazy, reset, hashkey){
      var this$ = this;
      lazy == null && (lazy = 500);
      reset == null && (reset = false);
      hashkey == null && (hashkey = '');
      return new Promise(function(res, rej){
        if (this$.loading) {
          return res([]);
        }
        if (this$.handle) {
          $timeout.cancel(this$.handle);
        }
        this$.loading = true;
        return this$.handle = $timeout(function(){
          var session;
          if (reset) {
            this$.offset = 0;
            this$.end = false;
            this$.session = Math.random() + "";
          }
          session = this$.session;
          this$.handle = null;
          return load(this$).then(function(ret){
            return $rootScope.$apply(function(){
              if (session !== this$.session) {
                res([]);
              }
              if (!ret || (hashkey ? ret[hashkey] || (ret[hashkey] = []) : ret).length === 0) {
                this$.end = true;
              }
              this$.loading = false;
              this$.offset = this$.offset + ((hashkey ? ret[hashkey] || (ret[hashkey] = []) : ret).length || 0);
              return res(ret);
            });
          });
        }, lazy);
      });
    },
    flexWidth: function(list){
      var hit, i$, to$, i, d, width, results$ = [];
      hit = false;
      for (i$ = 0, to$ = list.length; i$ < to$; ++i$) {
        i = i$;
        d = list[i];
        width = 320;
        if (Math.random() > 0.6 && !hit) {
          width = Math.random() > 0.8 ? 640 : 480;
          hit = true;
        }
        if (i % 3 === 2) {
          if (!hit) {
            width = 640;
          }
          hit = false;
        }
        results$.push(d.width = width);
      }
      return results$;
    }
  };
}));
x$.service('baseService', ['$rootScope', 'IOService', 'eventBus'].concat(function($rootScope, IOService, eventBus){
  var serviceSkeleton, baseObject, baseService;
  serviceSkeleton = {
    type: null,
    items: null,
    sample: [],
    backup: function(item){
      return IOService.backup(item);
    },
    backups: function(item){
      return IOService.backups(item);
    },
    cleanBackups: function(item){
      return IOService.cleanBackups(item);
    },
    save: function(item){
      var this$ = this;
      return IOService.save(item).then(function(ret){
        return new Promise(function(res, rej){
          return $rootScope.$applyAsync(function(){
            var idx;
            item.key = ret.key;
            idx = (this$.items || (this$.items = [])).map(function(it){
              return it.key;
            }).indexOf(ret.key);
            if (idx < 0) {
              (this$.items || (this$.items = [])).push(item);
            } else {
              this$.items.splice(idx, 1, item);
            }
            return res(item);
          });
        });
      });
    },
    load: function(_type, key, refresh){
      var filter, this$ = this;
      refresh == null && (refresh = false);
      filter = function(it){
        return it._type.location === _type.location && it._type.name === _type.name && it.key === key;
      };
      return IOService.load(_type, key).then(function(ret){
        return new Promise(function(res, rej){
          return $rootScope.$applyAsync(function(){
            var item;
            item = (this$.items || []).filter(filter)[0];
            if (item) {
              import$(item, ret);
            } else if (this$.items) {
              this$.items.push(item = ret);
            } else {
              this$.items = [item = ret];
            }
            return res(item);
          });
        });
      });
    },
    'delete': function(item){
      var this$ = this;
      return IOService['delete'](item._type, item.key).then(function(ret){
        return new Promise(function(res, rej){
          return $rootScope.$applyAsync(function(){
            var idx;
            idx = (this$.items || (this$.items = [])).map(function(it){
              return it.key;
            }).indexOf(item.key);
            if (idx >= 0) {
              this$.items.splice(idx, 1);
            }
            return res(ret);
          });
        });
      });
    }
    /*
    list: (_type, filter = {}, force = false) ->
      if !_type => _type = {location: \any, name: @type}
      if @items and !force => return Promise.resolve(@items)
      if !@items => @items = []
      (ret) <~ IOService.list _type .then
      (res, rej) <~ new Promise _
      <~ $rootScope.$apply-async
      @items.splice 0, @items.length
      @items.concat(ret.map(~>new @Object(it))).concat((@sample or []).map(~> new @Object(it)))
      Array.prototype.splice.apply(
        @items
        [0, ret.length + @sample.length] ++ (ret ++ @sample).map(~>new @Object it)
      )
      res @items
    */
  };
  baseObject = function(name, config){
    import$(this, {
      _type: {
        location: 'server',
        name: name
      },
      owner: null,
      key: null,
      permission: {
        'switch': [],
        value: []
      }
    });
    return import$(this, config);
  };
  baseService = {
    wrapper: function(name, callee){
      return function(config){
        var list;
        list = slice$.call(arguments, 1);
        baseObject.apply(this, [name, config].concat(list));
        callee.apply(this, [config].concat(list));
        return this;
      };
    },
    derive: function(name, service, callee){
      service = import$(import$({}, serviceSkeleton), service);
      service.type = name;
      service[name] = service.Object = this.wrapper(name, callee);
      baseObject.prototype = {
        save: function(){
          var this$ = this;
          return service.save(this).then(function(ret){
            return this$.key = ret.key;
          });
        },
        load: function(){
          var this$ = this;
          return service.load(this._type, this.key).then(function(ret){
            return import$(this$, ret);
          });
        },
        'delete': function(){
          return service['delete'](this);
        },
        clone: function(){
          var ref$;
          return ref$ = new service.Object(JSON.parse(JSON.stringify(this))), ref$.key = null, ref$;
        },
        backup: function(){
          return service.backup(this);
        },
        backups: function(){
          return service.backups(this);
        },
        cleanBackups: function(){
          return service.cleanBackups(this);
        },
        recover: function(backup){
          return import$(this, backup);
        }
      };
      import$(import$(service.Object.prototype, baseObject.prototype), callee.prototype);
      callee.prototype = service.Object.prototype;
      return service;
    }
  };
  return baseService;
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plSelectController', ['$scope'].concat(function($scope){
  $scope.portal = {
    data: [],
    options: []
  };
  $scope.init = function(data, type){
    $scope.portal.data = data;
    return $scope.type = type;
  };
  $scope.getIdx = function(item){
    var idx, ret;
    idx = $scope.portal.data.indexOf(item);
    return idx < 0 ? (ret = $scope.portal.data.map(function(d, i){
      return [d.key === item.key, i];
    }).filter(function(it){
      return it[0];
    })[0], ret
      ? ret[1]
      : -1) : idx;
  };
  $scope.remove = function(item, $event){
    var idx;
    idx = $scope.getIdx(item);
    if (idx < 0) {
      return;
    }
    return $scope.portal.data.splice(idx, 1);
  };
  $scope.add = function(item, $event){
    var idx;
    idx = $scope.getIdx(item);
    if (idx < 0) {
      return;
    }
    return $scope.portal.data.push(item);
  };
  return $scope.toggle = function(item, $event){
    var idx;
    idx = $scope.getIdx(item);
    if (idx < 0) {
      return $scope.portal.data.push(item);
    } else {
      return $scope.portal.data.splice(idx, 1);
    }
  };
}));
x$.directive('plselect', ['$compile', '$timeout', 'entityService', '$http'].concat(function($compile, $timeout, entityService, $http){
  return {
    require: [],
    restrict: 'A',
    scope: {
      portal: '=ngPortal',
      type: '@ngType'
    },
    link: function(s, e, a, c){
      var dropdownCloseOnClick, autoHideInput, config, dropdown, input, paging, idmap, sync, fetch, repos, close;
      dropdownCloseOnClick = true;
      autoHideInput = false;
      config = entityService.config.plselect[s.type || 'entity'];
      dropdown = e.find('.select-dropdown');
      input = e.find('input');
      input.attr('placeholder', config.placeholder) || 'search...';
      paging = {
        limit: 20,
        offset: 0
      };
      idmap = {};
      sync = function(){
        var k, ref$, v;
        s.portal.options.map(function(it){
          return idmap[it.key] = it;
        });
        for (k in ref$ = idmap) {
          v = ref$[k];
          v.selected = false;
        }
        return s.portal.data.forEach(function(it){
          if (idmap[it.key] && it.type === idmap[it.key].type) {
            return idmap[it.key].selected = true;
          }
        });
      };
      s.$watch('portal.data', function(){
        return sync();
      }, true);
      s.$watch('portal.options', function(){
        return sync();
      }, true);
      fetch = function(keyword, reset){
        reset == null && (reset = false);
        s.portal.loading = (s.portal.loading || 0) + 1 || 1;
        return $timeout(function(){
          if (reset) {
            paging.offset = 0;
            s.portal.end = false;
          }
          return $http({
            url: config.ajax.url,
            method: 'GET',
            params: config.ajax.param(keyword, paging.limit, paging.offset)
          }).success(function(d){
            if (!d || d.length === 0) {
              s.portal.end = true;
            }
            if (paging.offset === 0) {
              s.portal.options = d;
            } else {
              s.portal.options = (s.portal.options || []).concat(d);
            }
            s.portal.loading--;
            if (s.portal.loading < 0) {
              s.portal.loading = 0;
            }
            return paging.offset += paging.limit;
          });
        }, 1000);
      };
      repos = function(){
        var last, scrolltop, base, x, y, w;
        if (!e[0]) {
          return;
        }
        last = e.find('.select-input div.select-option:last-of-type')[0];
        scrolltop = e.find('.select-input')[0].scrollTop;
        base = e[0].getBoundingClientRect();
        if (last) {
          last = last.getBoundingClientRect();
        } else {
          last = {
            left: base.left,
            width: 0,
            top: base.top + 6,
            height: base.height
          };
        }
        x = last.left + last.width - base.left + 4;
        y = last.top - base.top - 1 + scrolltop;
        w = base.width - x - 10;
        repos.newline = false;
        if (w < last.width) {
          repos.newline = true;
          x = 6;
          y = last.bottom + 3 - base.top + scrolltop;
          w = base.width - 12;
        }
        input.css('left', x + "px");
        input.css('top', y + "px");
        input.css('width', w > 10 ? w + "px" : "100%");
        return input.css('position', 'absolute');
      };
      close = function(delay){
        if (close.closing) {
          $timeout.cancel(close.closing);
        }
        return close.closing = $timeout(function(){
          close.closing = 0;
          dropdown.hide();
          e.removeClass('open');
          if (autoHideInput && repos.newline) {
            return input.hide();
          }
        }, delay);
      };
      close.closing = 0;
      close.cancel = function(){
        if (close.closing) {
          $timeout.cancel(close.closing);
        }
        return close.closing = 0;
      };
      s.$watch('portal.data', function(){
        return $timeout(function(){
          return repos();
        }, 10);
      }, true);
      e.find('.select-input').on('click', function(it){
        repos();
        if (it.target.tagName === 'I' && it.target.className === "fa fa-close") {
          return;
        }
        input.show();
        input.focus();
        if (input.val()) {
          dropdown.show();
          e.addClass('open');
          return repos();
        }
      });
      dropdown.on('click', function(){
        if (dropdownCloseOnClick) {
          return;
        }
        close.cancel();
        input.show();
        input.focus();
        if (input.val()) {
          dropdown.show();
          e.addClass('open');
          return repos();
        }
      });
      input.on('blur', function(){
        return close(100);
      });
      input.on('keydown', function(ev){
        var keycode, lastValue;
        keycode = ev.keyCode;
        if (keycode === 27) {
          return input.blur();
        }
        e.addClass('open');
        dropdown.show();
        s.portal.options = [];
        lastValue = input.val();
        return $timeout(function(){
          paging = {
            limit: 20,
            offset: 0
          };
          s.portal.needchar = 3 - input.val().length;
          if (input.val().length >= 3) {
            fetch(input.val(), true);
          }
          if (ev.keyCode === 8 && !input.val() && !lastValue) {
            return s.$apply(function(){
              s.portal.data.splice(s.portal.data.length - 1, 1);
              return repos();
            });
          }
        }, 0);
      });
      return dropdown.on('scroll', function(ev){
        var base, last, y;
        base = dropdown[0].getBoundingClientRect();
        last = dropdown.find('.select-option');
        if (!last.length) {
          return;
        }
        last = last[last.length - 1].getBoundingClientRect();
        y = last.top + last.height - base.top - base.height;
        if (y < 5 && !s.portal.loading && !s.portal.end) {
          return s.$apply(function(){
            return fetch(input.val());
          });
        }
      });
    }
  };
}));
x$.controller('selecttest', ['$scope'].concat(function($scope){
  $scope.blah = [
    {
      key: 2,
      displayname: "Kirby",
      avatar: "team-29"
    }, {
      key: 3,
      displayname: "PlotDB",
      avatar: "team-32"
    }, {
      key: 4,
      displayname: "twstat",
      avatar: "team-33"
    }, {
      key: 5,
      displayname: "CWB",
      avatar: "team-29"
    }
  ];
  $scope.test = [];
  return $scope.gogo = function(){
    return $scope.blah = [{
      key: 123,
      displayname: '123',
      id: 123
    }];
  };
}));// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('test3', ['$scope'].concat(function($scope){
  return $scope.shown = false;
}));
x$.service('permService', ['$rootScope'].concat(function($rootScope){
  var permHandler;
  permHandler = {
    type: ['none', 'list', 'read', 'comment', 'fork', 'write', 'admin'],
    forkIdx: 4,
    isEnough: function(userLevel, requireLevel){
      return this.type.indexOf(userLevel) >= this.type.indexOf(requireLevel);
    },
    caltype: function(req, perm, owner, type){
      var val;
      val = this.calc(req, perm, owner);
      val = val < this.type.indexOf(type) ? 0 : val;
      return [val, this.type[val]];
    },
    test: function(req, perm, owner, type){
      return this.calc(req, perm, owner) >= this.type.indexOf(type);
    },
    calc: function(req, perm, owner){
      var maxlv, ref$, user, token, teams, max, this$ = this;
      maxlv = function(it){
        return Math.max.apply(null, it.map(function(it){
          return it._idx;
        }));
      };
      ref$ = [req.user || null, (req.query || (req.query = {})).token || null, (req.user || (req.user = {})).teams || null], user = ref$[0], token = ref$[1], teams = ref$[2];
      if (user && +owner && user.key === +owner) {
        return this.type.indexOf('admin');
      }
      if (!perm || !(perm.list || (perm.list = [])).length) {
        return this.forkIdx;
      }
      max = 0;
      perm.list.map(function(it){
        var val;
        it._idx = this$.type.indexOf(it.perm);
        val = it.type === 'global'
          ? it._idx
          : it.type === 'user' && user && user.key === +it.target
            ? it._idx
            : it.type === 'token' && token === it.target
              ? it._idx
              : it.type === 'team' && teams && teams.indexOf(+it.target) >= 0 ? it._idx : 0;
        if (max < val) {
          return max = val;
        }
      });
      return max;
    }
  };
  return permHandler;
}));
x$.controller('permEdit', ['$scope', '$timeout'].concat(function($scope, $timeout){
  $scope.setPerm = function(permobj){
    var ref$;
    if (typeof permobj === 'string') {
      $scope.$watch(permobj, function(p){
        return $scope.perm = p;
      });
    } else {
      $scope.perm = permobj || {
        list: [],
        'switch': 'draft'
      };
    }
    if (!$scope.perm.list) {
      $scope.perm.list = [];
    }
    if (!$scope.perm['switch']) {
      $scope.perm['switch'] = 'draft';
    }
    $scope.check();
    if (((ref$ = $scope.perm).list || (ref$.list = [])).length === 0) {
      $scope.addGlobal();
    }
    return $scope.perm.list.forEach(function(it){
      if (it.type === 'global') {
        return it.displayname = "Everyone", it.username = "and anonymous user", it;
      }
    });
  };
  $scope.spec = {
    permlist: ['list', 'read', 'comment', 'fork', 'write', 'admin'],
    'switch': ['publish', 'protected', 'draft'],
    type: ['user', 'team', 'global'],
    permissionObject: {
      list: {
        perm: "...",
        target: "...",
        type: "..."
      },
      'switch': "..."
    }
  };
  $scope.entities = [];
  $scope.tab = "publish";
  $scope.perm = {
    list: [{
      target: null,
      type: "global",
      perm: "fork",
      displayname: "Everyone",
      username: "and anonymous user"
    }],
    'switch': "draft"
  };
  $scope.original = JSON.stringify($scope.perm);
  $scope.permdefault = [{
    target: null,
    type: "global",
    perm: "fork",
    displayname: "Everyone",
    username: "and anonymous user"
  }];
  $scope.permEdit = {
    list: [],
    perm: "read"
  };
  $scope.addToken = function(){
    var token;
    token = Math.round(1000000000000000 * Math.random()).toString(36);
    return $scope.perm.list.push({
      target: token,
      type: "token",
      perm: $scope.permEdit.perm,
      displayname: token,
      username: "token"
    });
  };
  $scope.addGlobal = function(){
    var ref$;
    if (!$scope.hasGlobal) {
      (ref$ = $scope.perm).list = ref$.list.concat($scope.permdefault);
      return $scope.hasGlobal = true;
    }
  };
  $scope.removeMember = function(it){
    var idx;
    idx = $scope.perm.list.indexOf(it);
    if (idx < 0) {
      return;
    }
    $scope.perm.list.splice(idx, 1);
    if ($scope.perm.list.length === 0) {
      $scope.hasGlobal = false;
      return $scope.addGlobal();
    } else {
      return $scope.check();
    }
  };
  $scope.addMember = function(){
    var i$, ref$, len$, node, ref1$, type, target, matched, ret, obj;
    for (i$ = 0, len$ = (ref$ = $scope.permEdit.list).length; i$ < len$; ++i$) {
      node = ref$[i$];
      ref1$ = [node.type, node.key], type = ref1$[0], target = ref1$[1];
      matched = $scope.perm.list.filter(fn$)[0];
      if (matched) {
        matched.perm = $scope.permEdit.perm;
      } else {
        ret = {
          target: target,
          type: type,
          perm: $scope.permEdit.perm,
          displayname: node.displayname,
          username: node.type,
          avatar: node.avatar
        };
        $scope.perm.list.push(ret);
      }
    }
    $scope.permEdit.list.splice(0);
    obj = {
      list: $scope.purify(),
      'switch': $scope.perm['switch']
    };
    if (JSON.stringify(obj) !== $scope.original) {
      return $scope.needSave = true;
    } else {
      return $scope.needSave = false;
    }
    function fn$(it){
      return it.type === type && it.target === +target;
    }
  };
  $scope.purify = function(){
    return $scope.perm.list.map(function(it){
      var ref$;
      return ref$ = {}, ref$.type = it.type, ref$.target = it.target, ref$.perm = it.perm, ref$;
    });
  };
  $scope.check = function(){
    var ref$;
    return $scope.hasGlobal = !!((ref$ = $scope.perm).list || (ref$.list = [])).filter(function(it){
      return it.type === 'global';
    }).length;
  };
  return $scope.check();
}));