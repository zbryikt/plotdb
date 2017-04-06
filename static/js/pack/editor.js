// Ion.RangeSlider | version 2.1.7 | https://github.com/IonDen/ion.rangeSlider
(function(f){"function"===typeof define&&define.amd?define(["jquery"],function(p){return f(p,document,window,navigator)}):"object"===typeof exports?f(require("jquery"),document,window,navigator):f(jQuery,document,window,navigator)})(function(f,p,h,t,q){var u=0,m=function(){var a=t.userAgent,b=/msie\s\d+/i;return 0<a.search(b)&&(a=b.exec(a).toString(),a=a.split(" ")[1],9>a)?(f("html").addClass("lt-ie9"),!0):!1}();Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,d=[].slice;if("function"!=
typeof b)throw new TypeError;var c=d.call(arguments,1),e=function(){if(this instanceof e){var g=function(){};g.prototype=b.prototype;var g=new g,l=b.apply(g,c.concat(d.call(arguments)));return Object(l)===l?l:g}return b.apply(a,c.concat(d.call(arguments)))};return e});Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var d;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),e=c.length>>>0;if(0===e)return-1;d=+b||0;Infinity===Math.abs(d)&&(d=0);if(d>=
e)return-1;for(d=Math.max(0<=d?d:e-Math.abs(d),0);d<e;){if(d in c&&c[d]===a)return d;d++}return-1});var r=function(a,b,d){this.VERSION="2.1.7";this.input=a;this.plugin_count=d;this.old_to=this.old_from=this.update_tm=this.calc_count=this.current_plugin=0;this.raf_id=this.old_min_interval=null;this.is_update=this.is_key=this.no_diapason=this.force_redraw=this.dragging=!1;this.is_start=!0;this.is_click=this.is_resize=this.is_active=this.is_finish=!1;b=b||{};this.$cache={win:f(h),body:f(p.body),input:f(a),
cont:null,rs:null,min:null,max:null,from:null,to:null,single:null,bar:null,line:null,s_single:null,s_from:null,s_to:null,shad_single:null,shad_from:null,shad_to:null,edge:null,grid:null,grid_labels:[]};this.coords={x_gap:0,x_pointer:0,w_rs:0,w_rs_old:0,w_handle:0,p_gap:0,p_gap_left:0,p_gap_right:0,p_step:0,p_pointer:0,p_handle:0,p_single_fake:0,p_single_real:0,p_from_fake:0,p_from_real:0,p_to_fake:0,p_to_real:0,p_bar_x:0,p_bar_w:0,grid_gap:0,big_num:0,big:[],big_w:[],big_p:[],big_x:[]};this.labels=
{w_min:0,w_max:0,w_from:0,w_to:0,w_single:0,p_min:0,p_max:0,p_from_fake:0,p_from_left:0,p_to_fake:0,p_to_left:0,p_single_fake:0,p_single_left:0};var c=this.$cache.input;a=c.prop("value");var e;d={type:"single",min:10,max:100,from:null,to:null,step:1,min_interval:0,max_interval:0,drag_interval:!1,values:[],p_values:[],from_fixed:!1,from_min:null,from_max:null,from_shadow:!1,to_fixed:!1,to_min:null,to_max:null,to_shadow:!1,prettify_enabled:!0,prettify_separator:" ",prettify:null,force_edges:!1,keyboard:!1,
keyboard_step:5,grid:!1,grid_margin:!0,grid_num:4,grid_snap:!1,hide_min_max:!1,hide_from_to:!1,prefix:"",postfix:"",max_postfix:"",decorate_both:!0,values_separator:" \u2014 ",input_values_separator:";",disable:!1,onStart:null,onChange:null,onFinish:null,onUpdate:null};"INPUT"!==c[0].nodeName&&console&&console.warn&&console.warn("Base element should be <input>!",c[0]);c={type:c.data("type"),min:c.data("min"),max:c.data("max"),from:c.data("from"),to:c.data("to"),step:c.data("step"),min_interval:c.data("minInterval"),
max_interval:c.data("maxInterval"),drag_interval:c.data("dragInterval"),values:c.data("values"),from_fixed:c.data("fromFixed"),from_min:c.data("fromMin"),from_max:c.data("fromMax"),from_shadow:c.data("fromShadow"),to_fixed:c.data("toFixed"),to_min:c.data("toMin"),to_max:c.data("toMax"),to_shadow:c.data("toShadow"),prettify_enabled:c.data("prettifyEnabled"),prettify_separator:c.data("prettifySeparator"),force_edges:c.data("forceEdges"),keyboard:c.data("keyboard"),keyboard_step:c.data("keyboardStep"),
grid:c.data("grid"),grid_margin:c.data("gridMargin"),grid_num:c.data("gridNum"),grid_snap:c.data("gridSnap"),hide_min_max:c.data("hideMinMax"),hide_from_to:c.data("hideFromTo"),prefix:c.data("prefix"),postfix:c.data("postfix"),max_postfix:c.data("maxPostfix"),decorate_both:c.data("decorateBoth"),values_separator:c.data("valuesSeparator"),input_values_separator:c.data("inputValuesSeparator"),disable:c.data("disable")};c.values=c.values&&c.values.split(",");for(e in c)c.hasOwnProperty(e)&&(c[e]!==q&&
""!==c[e]||delete c[e]);a!==q&&""!==a&&(a=a.split(c.input_values_separator||b.input_values_separator||";"),a[0]&&a[0]==+a[0]&&(a[0]=+a[0]),a[1]&&a[1]==+a[1]&&(a[1]=+a[1]),b&&b.values&&b.values.length?(d.from=a[0]&&b.values.indexOf(a[0]),d.to=a[1]&&b.values.indexOf(a[1])):(d.from=a[0]&&+a[0],d.to=a[1]&&+a[1]));f.extend(d,b);f.extend(d,c);this.options=d;this.update_check={};this.validate();this.result={input:this.$cache.input,slider:null,min:this.options.min,max:this.options.max,from:this.options.from,
from_percent:0,from_value:null,to:this.options.to,to_percent:0,to_value:null};this.init()};r.prototype={init:function(a){this.no_diapason=!1;this.coords.p_step=this.convertToPercent(this.options.step,!0);this.target="base";this.toggleInput();this.append();this.setMinMax();a?(this.force_redraw=!0,this.calc(!0),this.callOnUpdate()):(this.force_redraw=!0,this.calc(!0),this.callOnStart());this.updateScene()},append:function(){this.$cache.input.before('<span class="irs js-irs-'+this.plugin_count+'"></span>');
this.$cache.input.prop("readonly",!0);this.$cache.cont=this.$cache.input.prev();this.result.slider=this.$cache.cont;this.$cache.cont.html('<span class="irs"><span class="irs-line" tabindex="-1"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span><span class="irs-min">0</span><span class="irs-max">1</span><span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span></span><span class="irs-grid"></span><span class="irs-bar"></span>');
this.$cache.rs=this.$cache.cont.find(".irs");this.$cache.min=this.$cache.cont.find(".irs-min");this.$cache.max=this.$cache.cont.find(".irs-max");this.$cache.from=this.$cache.cont.find(".irs-from");this.$cache.to=this.$cache.cont.find(".irs-to");this.$cache.single=this.$cache.cont.find(".irs-single");this.$cache.bar=this.$cache.cont.find(".irs-bar");this.$cache.line=this.$cache.cont.find(".irs-line");this.$cache.grid=this.$cache.cont.find(".irs-grid");"single"===this.options.type?(this.$cache.cont.append('<span class="irs-bar-edge"></span><span class="irs-shadow shadow-single"></span><span class="irs-slider single"></span>'),
this.$cache.edge=this.$cache.cont.find(".irs-bar-edge"),this.$cache.s_single=this.$cache.cont.find(".single"),this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.shad_single=this.$cache.cont.find(".shadow-single")):(this.$cache.cont.append('<span class="irs-shadow shadow-from"></span><span class="irs-shadow shadow-to"></span><span class="irs-slider from"></span><span class="irs-slider to"></span>'),this.$cache.s_from=this.$cache.cont.find(".from"),
this.$cache.s_to=this.$cache.cont.find(".to"),this.$cache.shad_from=this.$cache.cont.find(".shadow-from"),this.$cache.shad_to=this.$cache.cont.find(".shadow-to"),this.setTopHandler());this.options.hide_from_to&&(this.$cache.from[0].style.display="none",this.$cache.to[0].style.display="none",this.$cache.single[0].style.display="none");this.appendGrid();this.options.disable?(this.appendDisableMask(),this.$cache.input[0].disabled=!0):(this.$cache.cont.removeClass("irs-disabled"),this.$cache.input[0].disabled=
!1,this.bindEvents());this.options.drag_interval&&(this.$cache.bar[0].style.cursor="ew-resize")},setTopHandler:function(){var a=this.options.max,b=this.options.to;this.options.from>this.options.min&&b===a?this.$cache.s_from.addClass("type_last"):b<a&&this.$cache.s_to.addClass("type_last")},changeLevel:function(a){switch(a){case "single":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_single_fake);break;case "from":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake);
this.$cache.s_from.addClass("state_hover");this.$cache.s_from.addClass("type_last");this.$cache.s_to.removeClass("type_last");break;case "to":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_to_fake);this.$cache.s_to.addClass("state_hover");this.$cache.s_to.addClass("type_last");this.$cache.s_from.removeClass("type_last");break;case "both":this.coords.p_gap_left=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake),this.coords.p_gap_right=this.toFixed(this.coords.p_to_fake-
this.coords.p_pointer),this.$cache.s_to.removeClass("type_last"),this.$cache.s_from.removeClass("type_last")}},appendDisableMask:function(){this.$cache.cont.append('<span class="irs-disable-mask"></span>');this.$cache.cont.addClass("irs-disabled")},remove:function(){this.$cache.cont.remove();this.$cache.cont=null;this.$cache.line.off("keydown.irs_"+this.plugin_count);this.$cache.body.off("touchmove.irs_"+this.plugin_count);this.$cache.body.off("mousemove.irs_"+this.plugin_count);this.$cache.win.off("touchend.irs_"+
this.plugin_count);this.$cache.win.off("mouseup.irs_"+this.plugin_count);m&&(this.$cache.body.off("mouseup.irs_"+this.plugin_count),this.$cache.body.off("mouseleave.irs_"+this.plugin_count));this.$cache.grid_labels=[];this.coords.big=[];this.coords.big_w=[];this.coords.big_p=[];this.coords.big_x=[];cancelAnimationFrame(this.raf_id)},bindEvents:function(){if(!this.no_diapason){this.$cache.body.on("touchmove.irs_"+this.plugin_count,this.pointerMove.bind(this));this.$cache.body.on("mousemove.irs_"+this.plugin_count,
this.pointerMove.bind(this));this.$cache.win.on("touchend.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.win.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.line.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.line.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.options.drag_interval&&"double"===this.options.type?(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,
"both")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"both"))):(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")));"single"===this.options.type?(this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),
this.$cache.shad_single.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.edge.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_single.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))):(this.$cache.single.on("touchstart.irs_"+
this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),
this.$cache.shad_from.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("mousedown.irs_"+
this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.shad_from.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")));if(this.options.keyboard)this.$cache.line.on("keydown.irs_"+this.plugin_count,this.key.bind(this,"keyboard"));m&&(this.$cache.body.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this)),this.$cache.body.on("mouseleave.irs_"+this.plugin_count,this.pointerUp.bind(this)))}},
pointerMove:function(a){this.dragging&&(this.coords.x_pointer=(a.pageX||a.originalEvent.touches&&a.originalEvent.touches[0].pageX)-this.coords.x_gap,this.calc())},pointerUp:function(a){this.current_plugin===this.plugin_count&&this.is_active&&(this.is_active=!1,this.$cache.cont.find(".state_hover").removeClass("state_hover"),this.force_redraw=!0,m&&f("*").prop("unselectable",!1),this.updateScene(),this.restoreOriginalMinInterval(),(f.contains(this.$cache.cont[0],a.target)||this.dragging)&&this.callOnFinish(),
this.dragging=!1)},pointerDown:function(a,b){b.preventDefault();var d=b.pageX||b.originalEvent.touches&&b.originalEvent.touches[0].pageX;2!==b.button&&("both"===a&&this.setTempMinInterval(),a||(a=this.target||"from"),this.current_plugin=this.plugin_count,this.target=a,this.dragging=this.is_active=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=d-this.coords.x_gap,this.calcPointerPercent(),this.changeLevel(a),m&&f("*").prop("unselectable",!0),this.$cache.line.trigger("focus"),
this.updateScene())},pointerClick:function(a,b){b.preventDefault();var d=b.pageX||b.originalEvent.touches&&b.originalEvent.touches[0].pageX;2!==b.button&&(this.current_plugin=this.plugin_count,this.target=a,this.is_click=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=+(d-this.coords.x_gap).toFixed(),this.force_redraw=!0,this.calc(),this.$cache.line.trigger("focus"))},key:function(a,b){if(!(this.current_plugin!==this.plugin_count||b.altKey||b.ctrlKey||b.shiftKey||b.metaKey)){switch(b.which){case 83:case 65:case 40:case 37:b.preventDefault();
this.moveByKey(!1);break;case 87:case 68:case 38:case 39:b.preventDefault(),this.moveByKey(!0)}return!0}},moveByKey:function(a){var b=this.coords.p_pointer,b=a?b+this.options.keyboard_step:b-this.options.keyboard_step;this.coords.x_pointer=this.toFixed(this.coords.w_rs/100*b);this.is_key=!0;this.calc()},setMinMax:function(){this.options&&(this.options.hide_min_max?(this.$cache.min[0].style.display="none",this.$cache.max[0].style.display="none"):(this.options.values.length?(this.$cache.min.html(this.decorate(this.options.p_values[this.options.min])),
this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]))):(this.$cache.min.html(this.decorate(this._prettify(this.options.min),this.options.min)),this.$cache.max.html(this.decorate(this._prettify(this.options.max),this.options.max))),this.labels.w_min=this.$cache.min.outerWidth(!1),this.labels.w_max=this.$cache.max.outerWidth(!1)))},setTempMinInterval:function(){var a=this.result.to-this.result.from;null===this.old_min_interval&&(this.old_min_interval=this.options.min_interval);
this.options.min_interval=a},restoreOriginalMinInterval:function(){null!==this.old_min_interval&&(this.options.min_interval=this.old_min_interval,this.old_min_interval=null)},calc:function(a){if(this.options){this.calc_count++;if(10===this.calc_count||a)this.calc_count=0,this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.calcHandlePercent();if(this.coords.w_rs){this.calcPointerPercent();a=this.getHandleX();"both"===this.target&&(this.coords.p_gap=0,a=this.getHandleX());"click"===this.target&&(this.coords.p_gap=
this.coords.p_handle/2,a=this.getHandleX(),this.target=this.options.drag_interval?"both_one":this.chooseHandle(a));switch(this.target){case "base":var b=(this.options.max-this.options.min)/100;a=(this.result.from-this.options.min)/b;b=(this.result.to-this.options.min)/b;this.coords.p_single_real=this.toFixed(a);this.coords.p_from_real=this.toFixed(a);this.coords.p_to_real=this.toFixed(b);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);
this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real);this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);this.target=null;break;case "single":if(this.options.from_fixed)break;
this.coords.p_single_real=this.convertToRealPercent(a);this.coords.p_single_real=this.calcWithStep(this.coords.p_single_real);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real);break;case "from":if(this.options.from_fixed)break;this.coords.p_from_real=this.convertToRealPercent(a);this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real);this.coords.p_from_real>
this.coords.p_to_real&&(this.coords.p_from_real=this.coords.p_to_real);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_real=this.checkMaxInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);break;case "to":if(this.options.to_fixed)break;
this.coords.p_to_real=this.convertToRealPercent(a);this.coords.p_to_real=this.calcWithStep(this.coords.p_to_real);this.coords.p_to_real<this.coords.p_from_real&&(this.coords.p_to_real=this.coords.p_from_real);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_real=this.checkMaxInterval(this.coords.p_to_real,this.coords.p_from_real,"to");
this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);break;case "both":if(this.options.from_fixed||this.options.to_fixed)break;a=this.toFixed(a+.001*this.coords.p_handle);this.coords.p_from_real=this.convertToRealPercent(a)-this.coords.p_gap_left;this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,
this.coords.p_to_real,"from");this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);this.coords.p_to_real=this.convertToRealPercent(a)+this.coords.p_gap_right;this.coords.p_to_real=this.calcWithStep(this.coords.p_to_real);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);
break;case "both_one":if(!this.options.from_fixed&&!this.options.to_fixed){var d=this.convertToRealPercent(a);a=this.result.to_percent-this.result.from_percent;var c=a/2,b=d-c,d=d+c;0>b&&(b=0,d=b+a);100<d&&(d=100,b=d-a);this.coords.p_from_real=this.calcWithStep(b);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);this.coords.p_to_real=this.calcWithStep(d);this.coords.p_to_real=
this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real)}}"single"===this.options.type?(this.coords.p_bar_x=this.coords.p_handle/2,this.coords.p_bar_w=this.coords.p_single_fake,this.result.from_percent=this.coords.p_single_real,this.result.from=this.convertToValue(this.coords.p_single_real),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from])):(this.coords.p_bar_x=
this.toFixed(this.coords.p_from_fake+this.coords.p_handle/2),this.coords.p_bar_w=this.toFixed(this.coords.p_to_fake-this.coords.p_from_fake),this.result.from_percent=this.coords.p_from_real,this.result.from=this.convertToValue(this.coords.p_from_real),this.result.to_percent=this.coords.p_to_real,this.result.to=this.convertToValue(this.coords.p_to_real),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from],this.result.to_value=this.options.values[this.result.to]));
this.calcMinMax();this.calcLabels()}}},calcPointerPercent:function(){this.coords.w_rs?(0>this.coords.x_pointer||isNaN(this.coords.x_pointer)?this.coords.x_pointer=0:this.coords.x_pointer>this.coords.w_rs&&(this.coords.x_pointer=this.coords.w_rs),this.coords.p_pointer=this.toFixed(this.coords.x_pointer/this.coords.w_rs*100)):this.coords.p_pointer=0},convertToRealPercent:function(a){return a/(100-this.coords.p_handle)*100},convertToFakePercent:function(a){return a/100*(100-this.coords.p_handle)},getHandleX:function(){var a=
100-this.coords.p_handle,b=this.toFixed(this.coords.p_pointer-this.coords.p_gap);0>b?b=0:b>a&&(b=a);return b},calcHandlePercent:function(){this.coords.w_handle="single"===this.options.type?this.$cache.s_single.outerWidth(!1):this.$cache.s_from.outerWidth(!1);this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100)},chooseHandle:function(a){return"single"===this.options.type?"single":a>=this.coords.p_from_real+(this.coords.p_to_real-this.coords.p_from_real)/2?this.options.to_fixed?
"from":"to":this.options.from_fixed?"to":"from"},calcMinMax:function(){this.coords.w_rs&&(this.labels.p_min=this.labels.w_min/this.coords.w_rs*100,this.labels.p_max=this.labels.w_max/this.coords.w_rs*100)},calcLabels:function(){this.coords.w_rs&&!this.options.hide_from_to&&("single"===this.options.type?(this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=this.coords.p_single_fake+this.coords.p_handle/
2-this.labels.p_single_fake/2):(this.labels.w_from=this.$cache.from.outerWidth(!1),this.labels.p_from_fake=this.labels.w_from/this.coords.w_rs*100,this.labels.p_from_left=this.coords.p_from_fake+this.coords.p_handle/2-this.labels.p_from_fake/2,this.labels.p_from_left=this.toFixed(this.labels.p_from_left),this.labels.p_from_left=this.checkEdges(this.labels.p_from_left,this.labels.p_from_fake),this.labels.w_to=this.$cache.to.outerWidth(!1),this.labels.p_to_fake=this.labels.w_to/this.coords.w_rs*100,
this.labels.p_to_left=this.coords.p_to_fake+this.coords.p_handle/2-this.labels.p_to_fake/2,this.labels.p_to_left=this.toFixed(this.labels.p_to_left),this.labels.p_to_left=this.checkEdges(this.labels.p_to_left,this.labels.p_to_fake),this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=(this.labels.p_from_left+this.labels.p_to_left+this.labels.p_to_fake)/2-this.labels.p_single_fake/2,this.labels.p_single_left=
this.toFixed(this.labels.p_single_left)),this.labels.p_single_left=this.checkEdges(this.labels.p_single_left,this.labels.p_single_fake))},updateScene:function(){this.raf_id&&(cancelAnimationFrame(this.raf_id),this.raf_id=null);clearTimeout(this.update_tm);this.update_tm=null;this.options&&(this.drawHandles(),this.is_active?this.raf_id=requestAnimationFrame(this.updateScene.bind(this)):this.update_tm=setTimeout(this.updateScene.bind(this),300))},drawHandles:function(){this.coords.w_rs=this.$cache.rs.outerWidth(!1);
if(this.coords.w_rs){this.coords.w_rs!==this.coords.w_rs_old&&(this.target="base",this.is_resize=!0);if(this.coords.w_rs!==this.coords.w_rs_old||this.force_redraw)this.setMinMax(),this.calc(!0),this.drawLabels(),this.options.grid&&(this.calcGridMargin(),this.calcGridLabels()),this.force_redraw=!0,this.coords.w_rs_old=this.coords.w_rs,this.drawShadow();if(this.coords.w_rs&&(this.dragging||this.force_redraw||this.is_key)){if(this.old_from!==this.result.from||this.old_to!==this.result.to||this.force_redraw||
this.is_key){this.drawLabels();this.$cache.bar[0].style.left=this.coords.p_bar_x+"%";this.$cache.bar[0].style.width=this.coords.p_bar_w+"%";if("single"===this.options.type)this.$cache.s_single[0].style.left=this.coords.p_single_fake+"%";else{this.$cache.s_from[0].style.left=this.coords.p_from_fake+"%";this.$cache.s_to[0].style.left=this.coords.p_to_fake+"%";if(this.old_from!==this.result.from||this.force_redraw)this.$cache.from[0].style.left=this.labels.p_from_left+"%";if(this.old_to!==this.result.to||
this.force_redraw)this.$cache.to[0].style.left=this.labels.p_to_left+"%"}this.$cache.single[0].style.left=this.labels.p_single_left+"%";this.writeToInput();this.old_from===this.result.from&&this.old_to===this.result.to||this.is_start||(this.$cache.input.trigger("change"),this.$cache.input.trigger("input"));this.old_from=this.result.from;this.old_to=this.result.to;this.is_resize||this.is_update||this.is_start||this.is_finish||this.callOnChange();if(this.is_key||this.is_click)this.is_click=this.is_key=
!1,this.callOnFinish();this.is_finish=this.is_resize=this.is_update=!1}this.force_redraw=this.is_click=this.is_key=this.is_start=!1}}},drawLabels:function(){if(this.options){var a=this.options.values.length,b=this.options.p_values,d;if(!this.options.hide_from_to)if("single"===this.options.type)a=a?this.decorate(b[this.result.from]):this.decorate(this._prettify(this.result.from),this.result.from),this.$cache.single.html(a),this.calcLabels(),this.$cache.min[0].style.visibility=this.labels.p_single_left<
this.labels.p_min+1?"hidden":"visible",this.$cache.max[0].style.visibility=this.labels.p_single_left+this.labels.p_single_fake>100-this.labels.p_max-1?"hidden":"visible";else{a?(this.options.decorate_both?(a=this.decorate(b[this.result.from]),a+=this.options.values_separator,a+=this.decorate(b[this.result.to])):a=this.decorate(b[this.result.from]+this.options.values_separator+b[this.result.to]),d=this.decorate(b[this.result.from]),b=this.decorate(b[this.result.to])):(this.options.decorate_both?(a=
this.decorate(this._prettify(this.result.from),this.result.from),a+=this.options.values_separator,a+=this.decorate(this._prettify(this.result.to),this.result.to)):a=this.decorate(this._prettify(this.result.from)+this.options.values_separator+this._prettify(this.result.to),this.result.to),d=this.decorate(this._prettify(this.result.from),this.result.from),b=this.decorate(this._prettify(this.result.to),this.result.to));this.$cache.single.html(a);this.$cache.from.html(d);this.$cache.to.html(b);this.calcLabels();
b=Math.min(this.labels.p_single_left,this.labels.p_from_left);a=this.labels.p_single_left+this.labels.p_single_fake;d=this.labels.p_to_left+this.labels.p_to_fake;var c=Math.max(a,d);this.labels.p_from_left+this.labels.p_from_fake>=this.labels.p_to_left?(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.single[0].style.visibility="visible",this.result.from===this.result.to?("from"===this.target?this.$cache.from[0].style.visibility="visible":"to"===
this.target?this.$cache.to[0].style.visibility="visible":this.target||(this.$cache.from[0].style.visibility="visible"),this.$cache.single[0].style.visibility="hidden",c=d):(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.single[0].style.visibility="visible",c=Math.max(a,d))):(this.$cache.from[0].style.visibility="visible",this.$cache.to[0].style.visibility="visible",this.$cache.single[0].style.visibility="hidden");this.$cache.min[0].style.visibility=
b<this.labels.p_min+1?"hidden":"visible";this.$cache.max[0].style.visibility=c>100-this.labels.p_max-1?"hidden":"visible"}}},drawShadow:function(){var a=this.options,b=this.$cache,d="number"===typeof a.from_min&&!isNaN(a.from_min),c="number"===typeof a.from_max&&!isNaN(a.from_max),e="number"===typeof a.to_min&&!isNaN(a.to_min),g="number"===typeof a.to_max&&!isNaN(a.to_max);"single"===a.type?a.from_shadow&&(d||c)?(d=this.convertToPercent(d?a.from_min:a.min),c=this.convertToPercent(c?a.from_max:a.max)-
d,d=this.toFixed(d-this.coords.p_handle/100*d),c=this.toFixed(c-this.coords.p_handle/100*c),d+=this.coords.p_handle/2,b.shad_single[0].style.display="block",b.shad_single[0].style.left=d+"%",b.shad_single[0].style.width=c+"%"):b.shad_single[0].style.display="none":(a.from_shadow&&(d||c)?(d=this.convertToPercent(d?a.from_min:a.min),c=this.convertToPercent(c?a.from_max:a.max)-d,d=this.toFixed(d-this.coords.p_handle/100*d),c=this.toFixed(c-this.coords.p_handle/100*c),d+=this.coords.p_handle/2,b.shad_from[0].style.display=
"block",b.shad_from[0].style.left=d+"%",b.shad_from[0].style.width=c+"%"):b.shad_from[0].style.display="none",a.to_shadow&&(e||g)?(e=this.convertToPercent(e?a.to_min:a.min),a=this.convertToPercent(g?a.to_max:a.max)-e,e=this.toFixed(e-this.coords.p_handle/100*e),a=this.toFixed(a-this.coords.p_handle/100*a),e+=this.coords.p_handle/2,b.shad_to[0].style.display="block",b.shad_to[0].style.left=e+"%",b.shad_to[0].style.width=a+"%"):b.shad_to[0].style.display="none")},writeToInput:function(){"single"===
this.options.type?(this.options.values.length?this.$cache.input.prop("value",this.result.from_value):this.$cache.input.prop("value",this.result.from),this.$cache.input.data("from",this.result.from)):(this.options.values.length?this.$cache.input.prop("value",this.result.from_value+this.options.input_values_separator+this.result.to_value):this.$cache.input.prop("value",this.result.from+this.options.input_values_separator+this.result.to),this.$cache.input.data("from",this.result.from),this.$cache.input.data("to",
this.result.to))},callOnStart:function(){this.writeToInput();if(this.options.onStart&&"function"===typeof this.options.onStart)this.options.onStart(this.result)},callOnChange:function(){this.writeToInput();if(this.options.onChange&&"function"===typeof this.options.onChange)this.options.onChange(this.result)},callOnFinish:function(){this.writeToInput();if(this.options.onFinish&&"function"===typeof this.options.onFinish)this.options.onFinish(this.result)},callOnUpdate:function(){this.writeToInput();
if(this.options.onUpdate&&"function"===typeof this.options.onUpdate)this.options.onUpdate(this.result)},toggleInput:function(){this.$cache.input.toggleClass("irs-hidden-input")},convertToPercent:function(a,b){var d=this.options.max-this.options.min;return d?this.toFixed((b?a:a-this.options.min)/(d/100)):(this.no_diapason=!0,0)},convertToValue:function(a){var b=this.options.min,d=this.options.max,c=b.toString().split(".")[1],e=d.toString().split(".")[1],g,l,f=0,k=0;if(0===a)return this.options.min;
if(100===a)return this.options.max;c&&(f=g=c.length);e&&(f=l=e.length);g&&l&&(f=g>=l?g:l);0>b&&(k=Math.abs(b),b=+(b+k).toFixed(f),d=+(d+k).toFixed(f));a=(d-b)/100*a+b;(b=this.options.step.toString().split(".")[1])?a=+a.toFixed(b.length):(a/=this.options.step,a*=this.options.step,a=+a.toFixed(0));k&&(a-=k);k=b?+a.toFixed(b.length):this.toFixed(a);k<this.options.min?k=this.options.min:k>this.options.max&&(k=this.options.max);return k},calcWithStep:function(a){var b=Math.round(a/this.coords.p_step)*
this.coords.p_step;100<b&&(b=100);100===a&&(b=100);return this.toFixed(b)},checkMinInterval:function(a,b,d){var c=this.options;if(!c.min_interval)return a;a=this.convertToValue(a);b=this.convertToValue(b);"from"===d?b-a<c.min_interval&&(a=b-c.min_interval):a-b<c.min_interval&&(a=b+c.min_interval);return this.convertToPercent(a)},checkMaxInterval:function(a,b,d){var c=this.options;if(!c.max_interval)return a;a=this.convertToValue(a);b=this.convertToValue(b);"from"===d?b-a>c.max_interval&&(a=b-c.max_interval):
a-b>c.max_interval&&(a=b+c.max_interval);return this.convertToPercent(a)},checkDiapason:function(a,b,d){a=this.convertToValue(a);var c=this.options;"number"!==typeof b&&(b=c.min);"number"!==typeof d&&(d=c.max);a<b&&(a=b);a>d&&(a=d);return this.convertToPercent(a)},toFixed:function(a){a=a.toFixed(20);return+a},_prettify:function(a){return this.options.prettify_enabled?this.options.prettify&&"function"===typeof this.options.prettify?this.options.prettify(a):this.prettify(a):a},prettify:function(a){return a.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,
"$1"+this.options.prettify_separator)},checkEdges:function(a,b){if(!this.options.force_edges)return this.toFixed(a);0>a?a=0:a>100-b&&(a=100-b);return this.toFixed(a)},validate:function(){var a=this.options,b=this.result,d=a.values,c=d.length,e,g;"string"===typeof a.min&&(a.min=+a.min);"string"===typeof a.max&&(a.max=+a.max);"string"===typeof a.from&&(a.from=+a.from);"string"===typeof a.to&&(a.to=+a.to);"string"===typeof a.step&&(a.step=+a.step);"string"===typeof a.from_min&&(a.from_min=+a.from_min);
"string"===typeof a.from_max&&(a.from_max=+a.from_max);"string"===typeof a.to_min&&(a.to_min=+a.to_min);"string"===typeof a.to_max&&(a.to_max=+a.to_max);"string"===typeof a.keyboard_step&&(a.keyboard_step=+a.keyboard_step);"string"===typeof a.grid_num&&(a.grid_num=+a.grid_num);a.max<a.min&&(a.max=a.min);if(c)for(a.p_values=[],a.min=0,a.max=c-1,a.step=1,a.grid_num=a.max,a.grid_snap=!0,g=0;g<c;g++)e=+d[g],isNaN(e)?e=d[g]:(d[g]=e,e=this._prettify(e)),a.p_values.push(e);if("number"!==typeof a.from||isNaN(a.from))a.from=
a.min;if("number"!==typeof a.to||isNaN(a.to))a.to=a.max;"single"===a.type?(a.from<a.min&&(a.from=a.min),a.from>a.max&&(a.from=a.max)):(a.from<a.min&&(a.from=a.min),a.from>a.max&&(a.from=a.max),a.to<a.min&&(a.to=a.min),a.to>a.max&&(a.to=a.max),this.update_check.from&&(this.update_check.from!==a.from&&a.from>a.to&&(a.from=a.to),this.update_check.to!==a.to&&a.to<a.from&&(a.to=a.from)),a.from>a.to&&(a.from=a.to),a.to<a.from&&(a.to=a.from));if("number"!==typeof a.step||isNaN(a.step)||!a.step||0>a.step)a.step=
1;if("number"!==typeof a.keyboard_step||isNaN(a.keyboard_step)||!a.keyboard_step||0>a.keyboard_step)a.keyboard_step=5;"number"===typeof a.from_min&&a.from<a.from_min&&(a.from=a.from_min);"number"===typeof a.from_max&&a.from>a.from_max&&(a.from=a.from_max);"number"===typeof a.to_min&&a.to<a.to_min&&(a.to=a.to_min);"number"===typeof a.to_max&&a.from>a.to_max&&(a.to=a.to_max);if(b){b.min!==a.min&&(b.min=a.min);b.max!==a.max&&(b.max=a.max);if(b.from<b.min||b.from>b.max)b.from=a.from;if(b.to<b.min||b.to>
b.max)b.to=a.to}if("number"!==typeof a.min_interval||isNaN(a.min_interval)||!a.min_interval||0>a.min_interval)a.min_interval=0;if("number"!==typeof a.max_interval||isNaN(a.max_interval)||!a.max_interval||0>a.max_interval)a.max_interval=0;a.min_interval&&a.min_interval>a.max-a.min&&(a.min_interval=a.max-a.min);a.max_interval&&a.max_interval>a.max-a.min&&(a.max_interval=a.max-a.min)},decorate:function(a,b){var d="",c=this.options;c.prefix&&(d+=c.prefix);d+=a;c.max_postfix&&(c.values.length&&a===c.p_values[c.max]?
(d+=c.max_postfix,c.postfix&&(d+=" ")):b===c.max&&(d+=c.max_postfix,c.postfix&&(d+=" ")));c.postfix&&(d+=c.postfix);return d},updateFrom:function(){this.result.from=this.options.from;this.result.from_percent=this.convertToPercent(this.result.from);this.options.values&&(this.result.from_value=this.options.values[this.result.from])},updateTo:function(){this.result.to=this.options.to;this.result.to_percent=this.convertToPercent(this.result.to);this.options.values&&(this.result.to_value=this.options.values[this.result.to])},
updateResult:function(){this.result.min=this.options.min;this.result.max=this.options.max;this.updateFrom();this.updateTo()},appendGrid:function(){if(this.options.grid){var a=this.options,b,d;b=a.max-a.min;var c=a.grid_num,e,g,f=4,h,k,m,n="";this.calcGridMargin();a.grid_snap?50<b?(c=50/a.step,e=this.toFixed(a.step/.5)):(c=b/a.step,e=this.toFixed(a.step/(b/100))):e=this.toFixed(100/c);4<c&&(f=3);7<c&&(f=2);14<c&&(f=1);28<c&&(f=0);for(b=0;b<c+1;b++){h=f;g=this.toFixed(e*b);100<g&&(g=100,h-=2,0>h&&(h=
0));this.coords.big[b]=g;k=(g-e*(b-1))/(h+1);for(d=1;d<=h&&0!==g;d++)m=this.toFixed(g-k*d),n+='<span class="irs-grid-pol small" style="left: '+m+'%"></span>';n+='<span class="irs-grid-pol" style="left: '+g+'%"></span>';d=this.convertToValue(g);d=a.values.length?a.p_values[d]:this._prettify(d);n+='<span class="irs-grid-text js-grid-text-'+b+'" style="left: '+g+'%">'+d+"</span>"}this.coords.big_num=Math.ceil(c+1);this.$cache.cont.addClass("irs-with-grid");this.$cache.grid.html(n);this.cacheGridLabels()}},
cacheGridLabels:function(){var a,b,d=this.coords.big_num;for(b=0;b<d;b++)a=this.$cache.grid.find(".js-grid-text-"+b),this.$cache.grid_labels.push(a);this.calcGridLabels()},calcGridLabels:function(){var a,b;b=[];var d=[],c=this.coords.big_num;for(a=0;a<c;a++)this.coords.big_w[a]=this.$cache.grid_labels[a].outerWidth(!1),this.coords.big_p[a]=this.toFixed(this.coords.big_w[a]/this.coords.w_rs*100),this.coords.big_x[a]=this.toFixed(this.coords.big_p[a]/2),b[a]=this.toFixed(this.coords.big[a]-this.coords.big_x[a]),
d[a]=this.toFixed(b[a]+this.coords.big_p[a]);this.options.force_edges&&(b[0]<-this.coords.grid_gap&&(b[0]=-this.coords.grid_gap,d[0]=this.toFixed(b[0]+this.coords.big_p[0]),this.coords.big_x[0]=this.coords.grid_gap),d[c-1]>100+this.coords.grid_gap&&(d[c-1]=100+this.coords.grid_gap,b[c-1]=this.toFixed(d[c-1]-this.coords.big_p[c-1]),this.coords.big_x[c-1]=this.toFixed(this.coords.big_p[c-1]-this.coords.grid_gap)));this.calcGridCollision(2,b,d);this.calcGridCollision(4,b,d);for(a=0;a<c;a++)b=this.$cache.grid_labels[a][0],
this.coords.big_x[a]!==Number.POSITIVE_INFINITY&&(b.style.marginLeft=-this.coords.big_x[a]+"%")},calcGridCollision:function(a,b,d){var c,e,g,f=this.coords.big_num;for(c=0;c<f;c+=a){e=c+a/2;if(e>=f)break;g=this.$cache.grid_labels[e][0];g.style.visibility=d[c]<=b[e]?"visible":"hidden"}},calcGridMargin:function(){this.options.grid_margin&&(this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.coords.w_rs&&(this.coords.w_handle="single"===this.options.type?this.$cache.s_single.outerWidth(!1):this.$cache.s_from.outerWidth(!1),
this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100),this.coords.grid_gap=this.toFixed(this.coords.p_handle/2-.1),this.$cache.grid[0].style.width=this.toFixed(100-this.coords.p_handle)+"%",this.$cache.grid[0].style.left=this.coords.grid_gap+"%"))},update:function(a){this.input&&(this.is_update=!0,this.options.from=this.result.from,this.options.to=this.result.to,this.update_check.from=this.result.from,this.update_check.to=this.result.to,this.options=f.extend(this.options,a),
this.validate(),this.updateResult(a),this.toggleInput(),this.remove(),this.init(!0))},reset:function(){this.input&&(this.updateResult(),this.update())},destroy:function(){this.input&&(this.toggleInput(),this.$cache.input.prop("readonly",!1),f.data(this.input,"ionRangeSlider",null),this.remove(),this.options=this.input=null)}};f.fn.ionRangeSlider=function(a){return this.each(function(){f.data(this,"ionRangeSlider")||f.data(this,"ionRangeSlider",new r(this,a,u++))})};(function(){for(var a=0,b=["ms",
"moz","webkit","o"],d=0;d<b.length&&!h.requestAnimationFrame;++d)h.requestAnimationFrame=h[b[d]+"RequestAnimationFrame"],h.cancelAnimationFrame=h[b[d]+"CancelAnimationFrame"]||h[b[d]+"CancelRequestAnimationFrame"];h.requestAnimationFrame||(h.requestAnimationFrame=function(b,d){var c=(new Date).getTime(),e=Math.max(0,16-(c-a)),f=h.setTimeout(function(){b(c+e)},e);a=c+e;return f});h.cancelAnimationFrame||(h.cancelAnimationFrame=function(a){clearTimeout(a)})})()});
// Generated by LiveScript 1.3.1
plotdb.view = {
  host: plConfig.urlschema + "" + plConfig.domain,
  loader: function(key, cb){
    var req;
    req = new XMLHttpRequest();
    req.onload = function(){
      var ret, e;
      try {
        ret = JSON.parse(this.responseText);
        if (Array.isArray(ret)) {
          return cb(ret.map(function(it){
            return new plotdb.view.chart(it, {});
          }));
        } else {
          return cb(new plotdb.view.chart(ret, {}));
        }
      } catch (e$) {
        e = e$;
        console.error("load chart " + key + " failed when parsing response: ");
        return console.error(e);
      }
    };
    if (typeof key === 'number') {
      req.open('get', this.host + "/d/chart/" + key, true);
    } else if (typeof key === 'string') {
      req.open('get', key, true);
    }
    return req.send();
  },
  chart: function(chart, arg$){
    var ref$, theme, fields, root, data, code, eventbus;
    ref$ = arg$ != null
      ? arg$
      : {}, theme = ref$.theme, fields = ref$.fields, root = ref$.root, data = ref$.data;
    this._ = {
      handler: {},
      _chart: JSON.stringify(chart),
      fields: fields,
      root: root,
      inited: false,
      config: null
    };
    if (chart) {
      code = chart.code.content;
      if (typeof code === 'string') {
        if (code[0] === '{') {
          code = "(function() { return " + code + "; })();";
        } else {
          code = "(function() { " + code + "; return module.exports; })();";
        }
        this._.chart = chart = import$(eval(code), chart);
      } else {
        this._.chart = chart = import$(code, chart);
      }
    }
    this._.config = chart.config;
    plotdb.chart.updateDimension(chart);
    plotdb.chart.updateConfig(chart, chart.config);
    plotdb.chart.updateAssets(chart, chart.assets);
    if (data) {
      this.data(data);
    }
    if (fields) {
      this.sync(fields);
    }
    if (!data && (fields == null || !fields.length)) {
      this.data(chart.sample);
    }
    if (theme != null) {
      this.theme(theme);
    }
    if (fields != null) {
      this.sync(fields);
    }
    if (root) {
      this.attach(root);
    }
    chart.saveLocal = function(chart, key){
      return function(cb){
        var req;
        req = new XMLHttpRequest();
        req.onload = function(){
          if (cb) {
            return cb();
          }
        };
        req.open('put', plConfig.urlschema + "" + plConfig.domain + "/e/chart/" + key + "/local", true);
        req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
        return req.send(JSON.stringify(chart.local));
      };
    }(chart, chart.key);
    eventbus = {
      'in': {},
      out: {}
    };
    chart.fire = function(name, payload){
      var ref$;
      return ((ref$ = eventbus.out)[name] || (ref$[name] = [])).forEach(function(it){
        return it(payload);
      });
    };
    this.fire = function(name, payload){
      var ref$;
      return ((ref$ = eventbus['in'])[name] || (ref$[name] = [])).forEach(function(it){
        return it(payload);
      });
    };
    this.handle = function(name, cb){
      var ref$;
      return ((ref$ = eventbus.out)[name] || (ref$[name] = [])).push(cb);
    };
    chart.handle = function(name, cb){
      var ref$;
      return ((ref$ = eventbus['in'])[name] || (ref$[name] = [])).push(cb);
    };
    return this;
  }
};
import$(plotdb.view.chart.prototype, {
  update: function(){
    var this$ = this;
    return ['resize', 'bind', 'render'].map(function(it){
      if (this$._.chart[it]) {
        return this$._.chart[it]();
      }
    });
  },
  loadlib: function(root){
    var libs;
    return libs = this._.chart.library || [];
  },
  attach: function(root){
    var ref$, chart, theme, head, foot, iroot, iiroot, margin, marginVertical, resize, newClass, e;
    if (typeof root === 'string') {
      root = document.querySelector(root);
    }
    this._.root = root;
    ref$ = {
      chart: (ref$ = this._).chart,
      theme: ref$.theme
    }, chart = ref$.chart, theme = ref$.theme;
    root.setAttribute("class", ((root.getAttribute("class") || "").split(" ").filter(function(it){
      return it !== 'pdb-root';
    }).concat(['pdb-root'])).join(" "));
    if (chart.metashow) {
      ref$ = [0, 0, 0, 0].map(function(){
        return document.createElement("div");
      }), head = ref$[0], foot = ref$[1], iroot = ref$[2], iiroot = ref$[3];
      iroot.appendChild(iiroot);
      ref$ = iroot.style;
      ref$.position = "absolute";
      ref$.left = "0";
      ref$.right = "0";
      ref$ = iiroot.style;
      ref$.width = "100%";
      ref$.height = "100%";
      ref$ = foot.style;
      ref$.position = "absolute";
      ref$.bottom = "0";
      [head, iroot, foot].map(function(it){
        return root.appendChild(it);
      });
      margin = chart.config.margin || 10;
      marginVertical = margin - 10 > 10
        ? margin - 10
        : margin / 2;
      import$(head.style, {
        position: "relative",
        "z-index": 999,
        "text-align": 'center',
        margin: marginVertical + "px 0 0",
        "font-family": chart.config.fontFamily || "initial"
      });
      import$(foot.style, {
        left: margin + "px",
        bottom: marginVertical + "px"
      });
      head.innerHTML = ["<h2 style='margin:0'>" + chart.name + "</h2>", "<p style='margin:0'>" + chart.description + "</p>"].join("");
      if (chart.footer) {
        foot.innerHTML = "<small>" + chart.footer + "</small>";
      }
      import$(iroot.style, {
        top: head.getBoundingClientRect().height + "px",
        bottom: foot.getBoundingClientRect().height + "px"
      });
      root = iiroot;
    }
    root.innerHTML = [chart && chart.style ? "<style type='text/css'>/* <![CDATA[ */" + ((chart.style || (chart.style = {})).content || "") + "/* ]]> */</style>" : void 8, theme && theme.style ? "<style type='text/css'>/* <![CDATA[ */" + ((theme.style || (theme.style = {})).content || "") + "/* ]]> */</style>" : void 8, "<div style='position:relative;width:100%;height:100%;'><div style='height:0;'>&nbsp;</div>", (chart.doc || (chart.doc = {})).content || "", "</div>", theme && (theme.doc || (theme.doc = {})).content ? (theme.doc || (theme.doc = {})).content : void 8].join("");
    chart.root = root.querySelector("div:first-of-type");
    resize = function(){
      var this$ = this;
      if (resize.handle) {
        clearTimeout(resize.handle);
      }
      return resize.handle = setTimeout(function(){
        resize.handle = null;
        if (chart.resize) {
          chart.resize();
        }
        if (chart.render) {
          return chart.render();
        }
      }, 10);
    };
    plotdb.util.trackResizeEvent(root, function(){
      return resize();
    });
    newClass = (root.getAttribute('class') || "").split(' ').filter(function(it){
      return it !== 'loading';
    }).join(" ").trim();
    try {
      if (chart.init) {
        chart.init();
      }
      if (chart.parse) {
        chart.parse();
      }
      if (chart.resize) {
        chart.resize();
      }
      if (chart.bind) {
        chart.bind();
      }
      if (chart.render) {
        chart.render();
      }
    } catch (e$) {
      e = e$;
      newClass += ' error';
      console.error(e);
    }
    root.setAttribute('class', newClass);
    return this.inited = true;
  },
  config: function(n, update, rebind){
    var chart, ref$, o, b, k, v, this$ = this;
    update == null && (update = false);
    chart = this._.chart;
    import$(chart.config, n);
    if (!update) {
      return;
    }
    ref$ = [chart.config, this._.config], o = ref$[0], b = ref$[1];
    rebind = rebind != null
      ? rebind
      : (function(){
        var ref$, results$ = [];
        for (k in ref$ = n) {
          v = ref$[k];
          results$.push([k, v]);
        }
        return results$;
      }()).filter(function(){
        return o[k] !== v && b[k].rebindOnChange;
      });
    if (rebind) {
      chart.parse();
    }
    chart.resize();
    if (rebind) {
      chart.bind();
    }
    return chart.render();
  },
  init: function(root){
    return this._.chart.init();
  },
  parse: function(){
    return this._.chart.parse();
  },
  resize: function(){
    return this._.chart.resize();
  },
  bind: function(){
    return this._.chart.bind();
  },
  render: function(){
    return this._.chart.render();
  },
  destroy: function(){
    if (this._.chart.destroy) {
      return this._.chart.destroy();
    }
  },
  clone: function(){
    var ref$;
    return new plotdb.view.chart(JSON.parse(this._._chart), {
      theme: (ref$ = this._).theme,
      fields: ref$.fields
    });
  },
  on: function(event, cb){
    var ref$;
    return ((ref$ = this._.handler)[event] || (ref$[event] = [])).push(cb);
  },
  theme: function(theme){
    return this._.theme = import$(eval(theme.code.content), theme);
  },
  refresh: function(){
    this._.chart.parse();
    this._.chart.resize();
    this._.chart.bind();
    return this._.chart.render();
  },
  data: function(data, refresh, mapping){
    var key, k;
    if (data == null) {
      return this._.data;
    }
    if (mapping) {
      data = plotdb.chart.dataConvert.byMapping(data, mapping);
    }
    if (!Array.isArray(data) && typeof data === typeof {}) {
      key = (function(){
        var results$ = [];
        for (k in data) {
          results$.push(k);
        }
        return results$;
      }())[0];
      if (!Array.isArray(data[key])) {
        data = plotdb.chart.dataConvert.fromDimension(data);
      }
    }
    this._.data = data;
    this.sync();
    if (this.inited && refresh) {
      return this.refresh();
    }
  },
  sync: function(fields){
    var hash, i$, len$, item, k, ref$, v;
    fields == null && (fields = []);
    if (this._.data) {
      return this._.chart.data = plotdb.chart.dataFromHash(this._.chart.dimension, this._.data);
    }
    hash = {};
    for (i$ = 0, len$ = fields.length; i$ < len$; ++i$) {
      item = fields[i$];
      hash[item.key] = item;
    }
    for (k in ref$ = this._.chart.dimension) {
      v = ref$[k];
      v.fields = (v.fields || []).map(fn$).filter(fn1$);
    }
    plotdb.chart.updateData(this._.chart);
    if (this.inited && this._.chart.parse) {
      return this._.chart.parse();
    }
    function fn$(it){
      return hash[it.key];
    }
    function fn1$(it){
      return it;
    }
  }
});
plotdb.load = function(key, cb){
  return plotdb.view.loader(key, cb);
};
plotdb.render = function(config, cb){
  return plotdb.view.render(config, cb);
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plChartEditor', ['$scope', '$http', '$timeout', 'plConfig', 'chartService', 'paletteService', 'plNotify', 'eventBus', 'permService', 'initWrap', 'license'].concat(function($scope, $http, $timeout, plConfig, chartService, paletteService, plNotify, eventBus, permService, initWrap, license){
  var dispatcher, canvas;
  initWrap = initWrap();
  dispatcher = initWrap({
    handlers: {},
    register: function(name, handler){
      var ref$;
      return ((ref$ = this.handlers)[name] || (ref$[name] = [])).push(handler);
    },
    handle: function(evt){
      return (this.handlers[evt.data.type] || []).map(function(it){
        return it(evt.data);
      });
    },
    init: function(){
      var this$ = this;
      return window.addEventListener('message', function(e){
        return $scope.$apply(function(){
          return this$.handle(e);
        });
      }, false);
    }
  });
  dispatcher.register('click', function(){
    var event;
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
  });
  dispatcher.register('keydown', function(arg$){
    var e;
    e = arg$.event;
    if ((e.metaKey || e.altKey) && (e.keyCode === 13 || e.which === 13)) {
      return $scope.panel['switch']();
    }
  });
  $scope.hint.hide = {};
  $scope.chartModal = {
    name: {}
  };
  $scope.chartModal.assets = initWrap({
    init: function(){},
    measure: function(){
      var ref$;
      return ((ref$ = $scope.chart.obj).assets || (ref$.assets = [])).size = $scope.chart.obj.assets.map(function(it){
        return it.content.length;
      }).reduce(function(a, b){
        return a + b;
      }, 0);
    },
    download: {
      url: null,
      name: null
    },
    remove: function(f){
      var assets, idx;
      assets = $scope.chart.obj.assets || [];
      idx = assets.indexOf(f);
      assets.splice(idx, 1);
      return $scope.chart.reset();
    },
    add: function(f){
      var assets;
      assets = $scope.chart.obj.assets || [];
      return assets.push(f);
    },
    preview: function(file){
      var datauri;
      this.node = document.querySelector('#assets-preview iframe');
      this.download.url = URL.createObjectURL(new Blob([file.content], {
        type: file.type
      }));
      this.download.name = file.name;
      this.preview.toggled = true;
      datauri = ["data:", file.type, ";charset=utf-8;base64,", file.content].join("");
      return this.node.src = datauri;
    },
    read: function(list){
      var this$ = this;
      return new Promise(function(res, rej){
        var deny, i$, to$, i, item, name, that, type, result, idx, content, size, ref$;
        deny = [];
        for (i$ = 0, to$ = list.length; i$ < to$; ++i$) {
          i = i$;
          item = list[i];
          name = (that = /([^/]+\.?[^/.]*)$/.exec(item.file.name)) ? that[1] : 'unnamed';
          type = item.file.type;
          result = item.result;
          idx = result.indexOf(';');
          content = result.substring(idx + 8);
          size = ((ref$ = $scope.chart.obj).assets || (ref$.assets = [])).map(fn$).reduce(fn1$, 0) + content.length;
          if (size > 3000000) {
            deny.push(name);
            continue;
          }
          $scope.chartModal.assets.add({
            name: name,
            type: type,
            content: content
          });
        }
        if (deny.length) {
          return plNotify.alert("Following assets exceed the size limit 3MB, and won't be uploaded: " + deny.join(','));
        }
        function fn$(it){
          return (it.content || "").length;
        }
        function fn1$(a, b){
          return a + b;
        }
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
      })['catch'](function(it){
        return console.log(it);
      });
    },
    node: null
  });
  $scope.panel = initWrap({
    init: function(){
      var width, ref$, this$ = this;
      width = document.body.getBoundingClientRect().width;
      if (width < 881) {
        ref$ = this.size.value;
        ref$.dataset = 'full';
        ref$.editor = 'full';
        this.size.doc = 'sm';
      }
      $scope.$watch('panel.tab', function(n, o){
        if (n === o) {
          return;
        }
        if (n === 'download') {
          $scope.download.clear();
        }
        if (o === 'editor') {}
        return $scope.canvas.resize();
      });
      $scope.$watch('panel.size.value', function(){
        return $scope.canvas.resize();
      }, true);
      return document.body.addEventListener('keydown', function(e){
        return $scope.$apply(function(){
          if ((e.metaKey || e.altKey) && (e.keyCode === 13 || e.which === 13)) {
            return this$['switch']();
          }
        });
      });
    },
    'switch': function(){
      return this.set(this.tab !== 'editor' ? 'editor' : '', true);
    },
    tab: 'data',
    set: function(v, f){
      return this.tab = !f && this.tab === v ? '' : v;
    },
    size: {
      set: function(panel, size){
        return this.value[panel] = this.value[panel] === size ? '' : size;
      },
      value: {},
      doc: ''
    }
  });
  $scope.editor = initWrap({
    init: function(){},
    tab: {
      value: 'code',
      oldValue: 'code',
      choices: ['code', 'style', 'doc'],
      set: function(it){
        this.oldValue = this.value;
        this.value = it;
        if (this.oldValue !== this.value) {
          return $scope.editor.refresh();
        }
      }
    },
    change: function(it){
      if (this.tab.oldValue !== this.tab.value) {
        return;
      }
      if ($scope.chart.obj[this.tab.value].content === it) {
        return;
      }
      $scope.chart.obj[this.tab.value].content = it;
      return $scope.chart.reset();
    },
    refresh: function(){
      var node;
      node = $scope.chart.obj[this.tab.value];
      return this.update(node.content, node.type);
    }
  });
  $scope.canvas = canvas = initWrap({
    init: function(){
      var this$ = this;
      $scope.$watch('editor.size.value', function(){
        return this$.resize();
      });
      dispatcher.register('inited', function(payload){
        return this$.finish('load', payload);
      });
      dispatcher.register('rendered', function(){
        return this$.finish('render');
      });
      return $http({
        url: '/dev/editor/render.html',
        method: 'GET'
      }).success(function(d){
        return this$.url = URL.createObjectURL(new Blob([d], {
          type: 'text/html'
        }));
      });
    },
    load: function(chart){
      var that, this$ = this;
      this.canvas.iframe.src = (that = this.url) ? that : "/dev/editor/render.html";
      this.canvas.iframe.onload = function(){
        return $scope.chart.library.load(chart.library).then(function(library){
          return this$.msg({
            type: 'init',
            chart: JSON.stringify(chart),
            library: library
          });
        });
      };
      return this.block('load');
    },
    render: function(payload){
      var ref$;
      payload == null && (payload = {});
      this.msg((ref$ = {
        type: 'render'
      }, ref$.data = payload.data, ref$.config = payload.config, ref$));
      return this.block('render');
    },
    resize: function(){
      return $timeout(function(){
        var left;
        left = Math.max.apply(null, Array.from(document.querySelectorAll('.editor-func-detail')).map(function(it){
          if (it.getAttribute('class').split(' ').indexOf('full') >= 0) {
            return 0;
          }
          return it.getBoundingClientRect().width;
        })) + 100;
        document.querySelector('#viscanvas').style.left = left + "px";
        document.querySelector('.editor-ctrls').style.left = left + "px";
        return canvas.dimension.set();
      }, 0);
    }
  });
  $scope.chart = initWrap({
    src: null,
    obj: null,
    dimension: {},
    init: function(){
      var this$ = this;
      $scope.$watch('chart.config', function(n, o){
        if (angular.toJson(n.value) === angular.toJson(o.value)) {
          return;
        }
        return this$.config.parse(n.value, o.value);
      }, true);
      return dispatcher.register('data.sample', function(arg$){
        var data;
        data = arg$.data;
        return this$.finish('sample', data);
      });
    },
    sample: function(){
      canvas.msg({
        type: 'data.get(sample)'
      });
      return this.block('sample');
    },
    config: {
      value: null,
      group: {},
      categorize: function(n, o){
        var k, v, ref$, key$, results$ = [];
        this.group = {};
        for (k in n) {
          v = n[k];
          results$.push(((ref$ = this.group)[key$ = v.category || 'Other'] || (ref$[key$] = {}))[k] = v);
        }
        return results$;
      },
      parse: function(n, o){
        var rebind, k, v;
        if (!n) {
          return;
        }
        rebind = !!(function(){
          var ref$, results$ = [];
          for (k in ref$ = n) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).filter(function(arg$){
          var k, v;
          k = arg$[0], v = arg$[1];
          return !o || !o[k] || v.value !== o[k].value;
        }).map(function(it){
          return (it[1] || {}).rebindOnChange;
        }).filter(function(it){
          return it;
        }).length;
        this.update(rebind);
        return this.categorize(n, o);
      },
      update: function(rebind){
        rebind == null && (rebind = false);
        if (rebind) {
          return $scope.chart.reset();
        } else {
          return canvas.msg({
            type: 'config.set',
            config: this.value || {},
            rebind: rebind
          });
        }
      },
      reset: function(){
        var k, ref$, v;
        for (k in ref$ = this.value) {
          v = ref$[k];
          v.value = v['default'] || v.value;
        }
        return $scope.chart.reset();
      }
    },
    data: {
      bindmap: function(dimension){
        var bindmap, k, v, this$ = this;
        bindmap = {};
        (function(){
          var ref$, results$ = [];
          for (k in ref$ = dimension) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).map(function(d){
          return d[1].fields.map(function(it){
            if (it.key) {
              return bindmap[it.key] = d[0];
            }
          });
        });
        return bindmap;
      },
      adopt: function(data, bykey){
        var dimension, fields, bindmap, k, v, dimkeys, res$, this$ = this;
        bykey == null && (bykey = true);
        dimension = $scope.chart.dimension;
        fields = data.fields || data;
        bindmap = null;
        if (!bykey) {
          for (k in dimension) {
            v = dimension[k];
            v.fields = [];
            v.fieldName = [];
          }
          fields.map(function(it){
            if (it.bind && dimension[it.bind]) {
              return dimension[it.bind].fields.push(it);
            }
          });
          this.set(fields);
        } else {
          for (k in dimension) {
            v = dimension[k];
            v.fields = v.fields.map(fn$).filter(fn1$);
            v.fields.map(fn2$);
          }
          bindmap = this.bindmap(dimension);
        }
        for (k in dimension) {
          v = dimension[k];
          v.fieldName = v.fields.map(fn3$);
        }
        res$ = [];
        for (k in dimension) {
          v = dimension[k];
          res$.push({
            name: k,
            displayname: v.name || k,
            desc: v.desc,
            multiple: !!v.multiple
          });
        }
        dimkeys = res$;
        $scope.dataset.bind(dimkeys, null);
        return this.update(fields);
        function fn$(f){
          return fields.filter(function(it){
            return it.key === f.key;
          })[0];
        }
        function fn1$(it){
          return it;
        }
        function fn2$(it){
          return it.bind = k;
        }
        function fn3$(it){
          return it.name;
        }
      },
      clear: function(){
        return eventBus.fire('sheet.data.clear');
      },
      sample: function(){
        var this$ = this;
        return $scope.chart.sample().then(function(it){
          return this$.adopt(it, false);
        });
      },
      set: function(data){
        return eventBus.fire('sheet.data.set', data);
      },
      get: function(){
        return this.data;
      },
      autobind: function(data, dim){
        var search, md, df, i$, to$, i, lresult$, k, v, ret, that, results$ = [];
        search = function(type, target, d){
          var list, i$, to$, i, ret;
          d == null && (d = 0);
          if (!type) {
            return null;
          }
          if (in$(type, target)) {
            return type;
          }
          list = plotdb[type].basetype || [];
          for (i$ = 0, to$ = list.length; i$ < to$; ++i$) {
            i = i$;
            ret = search(list[i].name, target, d + 1);
            if (ret) {
              return ret;
            }
          }
        };
        md = function(type, list){
          var ret, i$, i;
          list == null && (list = []);
          list = list.map(function(it){
            return it.name || it;
          });
          if (!type) {
            return list[0];
          }
          type = type.name || type;
          if (!list.length) {
            return type;
          }
          ret = search(type, list);
          if (ret) {
            return ret;
          }
          for (i$ = 0; i$ < list; ++i$) {
            i = i$;
            ret = search(list[i], [type]);
            if (ret) {
              return ret;
            }
          }
          return null;
        };
        df = {};
        for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
          i = i$;
          lresult$ = [];
          for (k in dim) {
            v = dim[k];
            ret = md(data[i].datatype, v.type.map(fn$));
            if (ret && (v.multiple || !df[k])) {
              df[k] = (that = df[k]) ? that + 1 : 1;
              data[i].bind = k;
              break;
            }
          }
          results$.push(lresult$);
        }
        return results$;
        function fn$(it){
          return it.name;
        }
      },
      update: function(data){
        var dimension, k, v, i$, to$, i, ref$, key$;
        if (data.length && !data.filter(function(it){
          return it.bind;
        }).length) {
          this.autobind(data, $scope.chart.obj.dimension);
          if (data.filter(function(it){
            return it.bind;
          })) {
            this.adopt(data, false);
          }
          return;
        }
        this.data = data;
        dimension = $scope.chart.obj.dimension;
        (function(){
          var ref$, results$ = [];
          for (k in ref$ = dimension) {
            v = ref$[k];
            results$.push(v);
          }
          return results$;
        }()).map(function(it){
          return it.fields = [];
        });
        for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
          i = i$;
          if (!data[i].bind || !dimension[data[i].bind]) {
            continue;
          }
          ((ref$ = dimension[key$ = data[i].bind] || (dimension[key$] = {})).fields || (ref$.fields = [])).push(data[i]);
        }
        for (k in dimension) {
          v = dimension[k];
          v.fieldName = v.fields.map(fn$);
        }
        return canvas.msg({
          type: 'data.update',
          data: dimension
        });
        function fn$(it){
          return it.name;
        }
      }
    },
    reset: function(chart){
      var datasetKey, this$ = this;
      datasetKey = null;
      return Promise.resolve().then(function(){
        if (chart == null && !this$.obj) {
          return;
        }
        if (chart) {
          this$.src = JSON.stringify(chart);
          this$.obj = chart;
        }
        if (chart) {
          $scope.editor.refresh();
        }
        return canvas.load(this$.obj);
      }).then(function(payload){
        var newConfig, curConfig, k, v, ref$, ref1$, ref2$;
        newConfig = JSON.parse(payload.config);
        curConfig = this$.config.value || (chart || {}).config || this$.obj.config || {};
        (function(){
          var ref$, results$ = [];
          for (k in ref$ = newConfig) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).map(function(it){
          if (curConfig[it[0]]) {
            return it[1].value = curConfig[it[0]].value;
          }
        });
        this$.config.value = newConfig;
        this$.config.categorize(this$.config.value);
        this$.dimension = JSON.parse(payload.dimension);
        if (!(function(){
          var results$ = [];
          for (k in this.dimension) {
            results$.push(k);
          }
          return results$;
        }.call(this$)).length && chart) {
          $scope.panel.tab = 'style';
        }
        for (k in ref$ = this$.obj.dimension) {
          v = ref$[k];
          if (this$.dimension[k]) {
            ref2$ = this$.dimension[k];
            ref2$.fields = (ref1$ = this$.obj.dimension[k]).fields;
            ref2$.fieldName = ref1$.fieldName;
          }
        }
        this$.obj.dimension = this$.dimension;
        return $scope.dataset.grid.isClear();
      }).then(function(v){
        var k;
        if (v) {
          datasetKey = (function(){
            var ref$, results$ = [];
            for (k in ref$ = this.dimension) {
              v = ref$[k];
              results$.push({
                k: k,
                v: v
              });
            }
            return results$;
          }.call(this$)).map(function(arg$){
            var k, v;
            k = arg$.k, v = arg$.v;
            return (v.fields[0] || {}).dataset;
          })[0];
          if (datasetKey) {
            return $scope.dataset.parse(datasetKey, this$.data.bindmap(this$.obj.dimension));
          } else {
            return this$.sample();
          }
        } else {
          return $scope.dataset.grid.load();
        }
      }).then(function(data){
        data == null && (data = []);
        $scope.chart.data.adopt(data, !!datasetKey);
        return canvas.render({
          config: plotdb.chart.config.parse(this$.config.value)
        }, this$.obj.dimension);
      })['catch'](function(it){
        return console.error(it);
      });
    },
    library: {
      hash: {},
      load: function(list){
        var tasks, item, this$ = this;
        list == null && (list = []);
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
    }
  });
  $scope.dataset = initWrap({
    init: function(){
      var this$ = this;
      eventBus.listen('sheet.dataset.saved', function(it){
        return this$.finish('save', it);
      });
      eventBus.listen('sheet.dataset.save.failed', function(it){
        return this$.failed('save', it);
      });
      eventBus.listen('sheet.dataset.loaded', function(payload){
        return this$.finish('load', payload);
      });
      eventBus.listen('sheet.dataset.parsed', function(payload){
        return this$.finish('parse', payload);
      });
      return eventBus.listen('sheet.dataset.changed', function(v){
        return $scope.chart.data.update(v);
      });
    },
    load: function(key, bindmap, force){
      var ret;
      force == null && (force = false);
      ret = this.block('load');
      eventBus.fire('sheet.dataset.load', key, bindmap, force);
      return ret;
    },
    parse: function(key, bindmap, force){
      var ret;
      force == null && (force = false);
      ret = this.block('parse');
      eventBus.fire('sheet.dataset.parse', key, bindmap, force);
      return ret;
    },
    bind: function(dimkeys, bind){
      return eventBus.fire('sheet.bind', dimkeys, bind);
    },
    save: function(name){
      eventBus.fire('sheet.dataset.save', name);
      return this.block('save');
    },
    grid: initWrap({
      init: function(){
        var this$ = this;
        eventBus.listen('sheet.grid.isClear', function(v){
          return this$.finish('isClear', v);
        });
        return eventBus.listen('sheet.grid.loaded', function(data){
          return this$.finish('load', data);
        });
      },
      load: function(){
        var ret;
        ret = this.block('load');
        eventBus.fire('sheet.grid.load');
        return ret;
      },
      isClear: function(){
        var ret;
        ret = this.block('isClear');
        eventBus.fire('sheet.grid.isClear.get');
        return ret;
      }
    })
  });
  $scope.download = initWrap({
    loading: false,
    data: null,
    init: function(){
      var this$ = this;
      $scope.$watch('canvas.dimension.custom', function(n, o){
        if (this$.format && JSON.stringify(n) !== JSON.stringify(o)) {
          this$.loading = true;
          this$.data = null;
          this$.ready = false;
          return $timeout(function(){
            return this$.fetch(this$.format);
          }, 1000);
        }
      }, true);
      $scope.$watch('canvas.dimension.value', function(n, o){
        return this$.customSize = n === 'Custom';
      });
      $scope.$watch('download.customSize', function(n, o){
        if (n !== o) {
          return canvas.dimension.set(n ? 'Custom' : 'default');
        }
      });
      return dispatcher.register('snapshot', function(payload){
        var data, format, ext, size, url, bytes, mime, buf, ints, i$, to$, idx;
        data = payload.data, format = payload.format;
        ext = "png";
        if (data) {
          if (/svg/.exec(format)) {
            size = data.length;
            url = URL.createObjectURL(new Blob([data], {
              type: 'image/svg+xml'
            }));
            ext = "svg";
          } else if (/png/.exec(format)) {
            bytes = atob(data.split(',')[1]);
            mime = data.split(',')[0].split(':')[1].split(';')[0];
            buf = new ArrayBuffer(bytes.length);
            ints = new Uint8Array(buf);
            for (i$ = 0, to$ = bytes.length; i$ < to$; ++i$) {
              idx = i$;
              ints[idx] = bytes.charCodeAt(idx);
            }
            size = bytes.length;
            url = URL.createObjectURL(new Blob([buf], {
              type: 'image/png'
            }));
          }
        }
        return import$($scope.download, {
          loading: false,
          ready: data ? true : false,
          url: url,
          size: size,
          filename: $scope.chart.obj.name + "." + ext
        });
      });
    },
    clear: function(){
      return this.loading = false, this.data = null, this.ready = false, this.format = '', this;
    },
    fetch: function(format){
      var data, size, url;
      format == null && (format = 'svg');
      this.format = format;
      this.loading = true;
      this.data = null;
      this.ready = false;
      this.format = format;
      this.loading = true;
      if (format === 'plotdb') {
        data = JSON.stringify($scope.chart);
        size = data.length;
        url = URL.createObjectURL(new Blob([data], {
          type: 'application/json'
        }));
        return import$(this, {
          loading: false,
          ready: true,
          url: url,
          size: size,
          filename: $scope.chart.name + ".json"
        });
      } else {
        return canvas.msg({
          type: 'snapshot',
          format: format
        });
      }
    }
  });
  $scope.paledit = {
    edit: function(v){
      return eventBus.fire('paledit.edit', v);
    }
  };
  $scope.coloredit = {
    idx: 0,
    config: function(v){
      return {
        'class': "no-palette text-input top",
        context: "context-" + (this.idx++),
        exclusive: true,
        palette: [v.value]
      };
    }
  };
  $scope.settingPanel = initWrap({
    tab: 'publish',
    init: function(){
      var this$ = this;
      $scope.permtype = (window.permtype || (window.permtype = []))[1] || 'none';
      $scope.writable = permService.isEnough($scope.permtype, 'write');
      $scope.isAdmin = permService.isEnough($scope.permtype, 'admin');
      $scope.$watch('settingPanel.chart', function(cur, old){
        var k, v, results$ = [];
        if (!$scope.chart.obj) {
          return;
        }
        for (k in cur) {
          v = cur[k];
          if (!v && !old[k]) {
            continue;
          }
          results$.push($scope.chart.obj[k] = v);
        }
        return results$;
      }, true);
      $scope.$watch('chart.obj.inherit', function(it){
        return this$.chart.inherit = it;
      }, true);
      $scope.$watch('chart.obj.basetype', function(it){
        return this$.chart.basetype = it;
      });
      $scope.$watch('chart.obj.visualencoding', function(it){
        return this$.chart.visualencoding = it;
      });
      $scope.$watch('chart.obj.category', function(it){
        return this$.chart.category = it;
      });
      $scope.$watch('chart.obj.tags', function(it){
        return this$.chart.tags = it;
      });
      return $scope.$watch('chart.obj.library', function(it){
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
      library: null,
      inherit: null
    }
  });
  $scope.sharePanel = initWrap({
    embed: {
      width: '100%',
      height: '600px',
      widthRate: 4,
      heightRate: 3
    },
    init: function(){
      var this$ = this;
      $scope.$watch('chart.obj.key', function(){
        if ($scope.chart) {
          return this$.link = chartService.sharelink($scope.chart.obj || {
            key: ''
          });
        }
      });
      return ['#edit-sharelink-btn', '#edit-sharelink', '#edit-embedcode-btn', '#edit-embedcode'].map(function(eventsrc){
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
            return ["<div style=\"width:100%\"><div style=\"position:relative;height:0;overflow:hidden;", "padding-bottom:" + ratio + "%\"><iframe src=\"" + link + "\" frameborder=\"0\" allowfullscreen=\"true\" ", "style=\"position:absolute;top:0;left:0;width:100%;height:100%\"></iframe></div></div>"].join("");
          } else {
            return ["<iframe src=\"" + link + "\" width=\"" + w + "\" height=\"" + h + "\" ", "allowfullscreen=\"true\" frameborder=\"0\"></iframe>"].join("");
          }
        };
        $scope.$watch('sharePanel.embed', function(){
          return this$.embedcode = embedcodeGenerator();
        }, true);
        $scope.$watch('sharePanel.aspectRatio', function(){
          return this$.embedcode = embedcodeGenerator();
        });
        return $scope.$watch('sharePanel.link', function(){
          return this$.embedcode = embedcodeGenerator();
        });
      });
    }
  });
  $scope.local = {
    get: function(){
      var this$ = this;
      return new Promise(function(res, rej){
        return res({});
      });
    }
  };
  $scope.bind = function(dimension, dataset){
    var k, v;
    (function(){
      var ref$, results$ = [];
      for (k in ref$ = dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).map(function(it){
      return it.fieldName = [], it.fields = [], it;
    });
    dataset.fields.map(function(f){
      if (f.bind) {
        return dimension[f.bind].fields.push(f);
      }
    });
    return (function(){
      var ref$, results$ = [];
      for (k in ref$ = dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).map(function(it){
      return it.fieldName = it.fields.map(function(it){
        return it.name;
      });
    });
  };
  $scope._save = function(){
    var chart, parentKey, refresh, data, this$ = this;
    if (this.save.pending) {
      return;
    }
    this.save.pending = true;
    chart = $scope.chart.obj;
    chart.config = $scope.chart.config.value;
    if (!$scope.writable && chart.owner !== $scope.user.data.key) {
      parentKey = chart.key || null;
      chart.key = null;
      chart.owner = null;
      chart.inherit = [];
      if (!chart.permission) {
        chart.permission = {
          'switch': 'publish',
          list: []
        };
      }
      if (parentKey) {
        chart.parent = parentKey;
      }
    }
    refresh = !chart.key ? true : false;
    data = null;
    return $scope.local.get().then(function(local){
      chart.local = local;
      data = chart.data;
      chart.data = null;
      return new chartService.chart(chart).save();
    })['finally'](function(){
      return this$.save.pending = false;
    }).then(function(ret){
      chart.data = data;
      return this$.$apply(function(){
        plNotify.send('success', "saved");
        if (refresh) {
          return window.location.href = chartService.link({
            key: ret
          }, 'v2');
        } else {
          return eventBus.fire('loading.dimmer.off');
        }
      });
    })['catch'](function(err){
      return this$.$apply(function(){
        eventBus.fire('loading.dimmer.off');
        if (err[2] === 402) {
          eventBus.fire('quota.widget.on');
          return plNotify.send('danger', "Failed: Quota exceeded");
        } else {
          plNotify.aux.error.io('save', 'chart', err);
          return console.error("[save " + name + "]", err);
        }
      });
    });
  };
  $scope.save = function(){
    var chart, promise, this$ = this;
    chart = $scope.chart.obj;
    if (!$scope.user.authed()) {
      $scope.auth.toggle(true);
      return Promise.reject();
    }
    if (this.save.pending) {
      return Promise.reject();
    }
    promise = chart.owner !== $scope.user.data.key || !chart.name || !chart.key
      ? $scope.chartModal.name.prompt()
      : Promise.resolve();
    return promise.then(function(name){
      if (name) {
        chart.name = name;
      }
      $scope.$apply(function(){
        return eventBus.fire('loading.dimmer.on');
      });
      return $scope.dataset.save(chart.name);
    }).then(function(dataset){
      $scope.bind(chart.dimension, dataset);
      return canvas.msg({
        type: 'save'
      });
    })['catch'](function(it){
      return console.log(it);
    });
  };
  dispatcher.register('save', function(payload){
    if (payload.payload) {
      $scope.chart.obj.thumbnail = payload.data;
    }
    return $scope._save();
  });
  initWrap.run();
  return $timeout(function(){
    var this$ = this;
    if (window.chart) {
      return $scope.$apply(function(){
        return $scope.chart.reset(window.chart);
      });
    } else {
      return plotdb.load(2251, function(chart){
        var this$ = this;
        return $scope.$apply(function(){
          return $scope.chart.reset(JSON.parse(chart._._chart));
        });
      });
    }
  }, 1000);
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
x$.directive('viscanvas', ['$compile', 'plConfig'].concat(function($compile, plConfig){
  return {
    restrict: 'A',
    scope: {
      model: '=ngModel'
    },
    link: function(s, e, a, c){
      s.model.canvas = {
        iframe: e.find('iframe')[0],
        window: e.find('iframe')[0].contentWindow
      };
      s.model.msg = function(it){
        return s.model.canvas.window.postMessage(it, plConfig.urlschema + "" + plConfig.domain);
      };
      s.model.colorblind = {
        value: 'normal',
        choices: ['normal', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly'],
        set: function(it){
          var ref$;
          if (!in$(it, this.choices)) {
            return;
          }
          this.value = it;
          return ref$ = e[0].style, ref$["-webkit-filter"] = "url(#" + it + ")", ref$.filter = "url(#" + it + ")", ref$;
        }
      };
      s.model.dimension = {
        value: 'default',
        choices: ['default', 'QVGA', 'HVGA', 'FullHD', 'Thumb', 'Custom', '4K'],
        map: {
          'default': [0, 0],
          QVGA: [240, 320],
          HVGA: [320, 480],
          Thumb: [308, 229],
          FullHD: [1920, 1080],
          "4K": [3840, 2160]
        },
        custom: {
          width: 640,
          height: 480
        },
        init: function(){
          var this$ = this;
          return s.$watch('model.dimension.custom', function(){
            return this$.set();
          }, true);
        },
        set: function(it){
          var canvas, ref$, width, height, w, h;
          if (!in$(it, this.choices)) {
            it = this.value;
          }
          this.value = it;
          canvas = e[0].querySelector(".inner");
          ref$ = {
            width: (ref$ = e[0].getBoundingClientRect()).width,
            height: ref$.height
          }, width = ref$.width, height = ref$.height;
          if (this.value === 'default') {
            ref$ = ['100%', '100%'], w = ref$[0], h = ref$[1];
            ref$ = canvas.style;
            ref$.marginTop = 0;
            ref$.marginLeft = 0;
          } else {
            if (this.value === 'Custom') {
              ref$ = [this.custom.width, this.custom.height], w = ref$[0], h = ref$[1];
            } else {
              ref$ = this.map[this.value], w = ref$[0], h = ref$[1];
            }
            canvas.style.marginTop = (height > h ? (height - h) / 2 : 0) + "px";
            canvas.style.marginLeft = (width > w ? (width - w) / 2 : 0) + "px";
            ref$ = [w, h].map(function(it){
              return it + "px";
            }), w = ref$[0], h = ref$[1];
          }
          return ref$ = canvas.style, ref$.width = w, ref$.height = h, ref$;
        }
      };
      return s.model.dimension.init();
    }
  };
}));
x$.directive('codeeditor', ['$compile'].concat(function($compile){
  return {
    restrict: 'A',
    scope: {
      model: '=ngModel'
    },
    link: function(s, e, a, c){
      var editor, ref$;
      editor = {
        cm: null,
        theme: {
          value: 'default',
          choices: ['default', 'neat', 'monokai', 'rubyblue', 'colorforth'],
          set: function(it){
            editor.cm.setOption('theme', this.value = it);
            return document.cookie = "code_editor_theme=" + it;
          }
        },
        update: function(content, type){
          editor.cm.getDoc().setValue(content);
          if (type) {
            editor.cm.setOption('mode', type);
          }
          return editor.cm.focus();
        },
        init: function(){
          var this$ = this;
          this.cm = CodeMirror.fromTextArea(e[0], {
            lineNumbers: true,
            mode: "javascript",
            theme: "default"
          });
          editor.theme.set((/code_editor_theme=([^;].+?)(;|$)/.exec(document.cookie) || ['0', 'default'])[1]);
          return this.cm.on('change', function(){
            return s.model.change(this$.cm.getValue(), this$.cm);
          });
        },
        focus: function(){
          if (this.cm) {
            return this.cm.focus();
          }
        }
      };
      ref$ = s.model;
      ref$.theme = editor.theme;
      ref$.update = editor.update;
      ref$.focus = editor.focus;
      return editor.init();
    }
  };
}));
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plSheetEditor', ['$scope', '$interval', '$timeout', '$http', 'permService', 'dataService', 'eventBus', 'plNotify', 'Paging', 'initWrap'].concat(function($scope, $interval, $timeout, $http, permService, dataService, eventBus, plNotify, Paging, initWrap){
  initWrap = initWrap();
  $scope.sheetModal = {
    duplicate: {}
  };
  $scope.dataset = initWrap({
    init: function(){
      var this$ = this;
      eventBus.listen('sheet.dataset.load', function(key, bindmap, force){
        return this$.load(key, force).then(function(){
          return eventBus.fire('sheet.dataset.loaded', key);
        });
      });
      eventBus.listen('sheet.dataset.parse', function(key, bindmap, force){
        return this$.load(key, force).then(function(){
          return $scope.parser.plotdb.parse(this$.obj, bindmap);
        }).then(function(dataset){
          return eventBus.fire('sheet.dataset.parsed', dataset);
        });
      });
      return eventBus.listen('sheet.dataset.save', function(name){
        return this$.save(name);
      });
    },
    obj: null,
    clear: function(){
      return this.obj = null;
    },
    save: function(name){
      var fresh, this$ = this;
      name == null && (name = 'Untitled');
      name = name + " (Dataset)";
      fresh = this.obj
        ? !this.obj.key
        : !this.obj;
      return Promise.resolve().then(function(){
        if (!$scope.user.authed()) {
          $scope.auth.toggle(true);
          return Promise.reject();
        }
        if (fresh) {
          this$.obj = new dataService.dataset();
          this$.obj.name = name;
        }
        this$.obj.setFields($scope.grid.data.fieldize());
        if (this$.obj.fields.length >= 40) {
          alert('You can have at most 40 columns');
          this$.obj = null;
          return Promise.reject();
        }
        if (!this$.obj.name) {
          return this$.obj.name = name;
        } else {
          return Promise.resolve();
        }
      }).then(function(){
        return this$.obj.save()['catch'](function(){
          eventBus.fire('loading.dimmer.pause');
          return $scope.sheetModal.duplicate.prompt().then(function(){
            fresh = true;
            this$.obj.key = null;
            return this$.obj.save();
          });
        });
      }).then(function(r){
        eventBus.fire('loading.dimmer.continue');
        if (fresh) {
          return new Promise(function(res, rej){
            return $http({
              url: "/d/dataset/" + this$.obj.key + "/simple",
              method: 'GET'
            }).success(function(map){
              map.fields.map(function(d, i){
                var ref$;
                return ref$ = this$.obj.fields[i], ref$.dataset = this$.obj.key, ref$.key = d.key, ref$;
              });
              return res();
            }).error(function(it){
              return console.log("error:", it(rej()));
            });
          });
        } else {
          return Promise.resolve();
        }
      }).then(function(){
        return eventBus.fire('sheet.dataset.saved', this$.obj);
      })['catch'](function(it){
        return eventBus.fire('sheet.dataset.save.failed', it);
      });
    },
    load: function(key, force, location){
      var this$ = this;
      location == null && (location = 'server');
      if (!this.obj || this.obj.key !== key || !force) {
        return dataService.load({
          location: location,
          name: 'dataset'
        }, key).then(function(ret){
          var dataset;
          this$.obj = dataset = new dataService.dataset(ret);
          eventBus.fire('sheet.dataset.loaded', this$.obj);
          return this$.obj;
        });
      } else {
        return Promise.resolve().then(function(){
          eventBus.fire('sheet.dataset.loaded', this.obj);
          return this.obj;
        });
      }
    },
    clone: function(){},
    'delete': function(){}
  });
  $scope.grid = initWrap({
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
    clear: true,
    worker: null,
    data: {
      rows: [],
      headers: [],
      trs: [],
      bind: [],
      dimkeys: [],
      clusterizer: null,
      bindField: function(e){
        var node, i$, i, dim, multi, to$, index, root;
        node = e.target || e.srcElement;
        for (i$ = 0; i$ < 3; ++i$) {
          i = i$;
          if (node.nodeName.toLowerCase() !== 'a') {
            node = node.parentNode;
          } else {
            break;
          }
        }
        if (node.nodeName.toLowerCase() !== 'a') {
          return;
        }
        dim = node.getAttribute('data-dim') || '';
        multi = (node.getAttribute('data-multi') || 'false') === 'true';
        if (dim && !multi) {
          for (i$ = 0, to$ = this.bind.length; i$ < to$; ++i$) {
            i = i$;
            if (this.bind[i] === dim) {
              this.bind[i] = null;
            }
          }
        }
        index = Array.from(node.parentNode.parentNode.parentNode.parentNode.childNodes).indexOf(node.parentNode.parentNode.parentNode);
        this.bind[index] = dim || null;
        root = node.parentNode.parentNode.parentNode.parentNode;
        this.bindFieldSync();
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      },
      bindFieldSync: function(){
        var root, i$, to$, i, span, displayname, results$ = [], this$ = this;
        root = document.querySelector('#dataset-editbox .sheet .sheet-dim > div');
        if (!root || !root.childNodes) {
          return;
        }
        for (i$ = this.headers.length, to$ = root.childNodes.length; i$ < to$; ++i$) {
          i = i$;
          span = root.childNodes[i].querySelector("span");
          span.innerText = "(empty)";
          span.className = 'grayed';
          this.bind[i] = null;
        }
        for (i$ = 0, to$ = this.headers.length; i$ < to$; ++i$) {
          i = i$;
          if (!root.childNodes[i]) {
            continue;
          }
          displayname = (this.dimkeys.filter(fn$)[0] || {
            displayname: this.bind[i]
          }).displayname;
          span = root.childNodes[i].querySelector("span");
          span.innerText = displayname || "(empty)";
          results$.push(span.className = this.bind[i] ? '' : 'grayed');
        }
        return results$;
        function fn$(it){
          return it.name === this$.bind[i];
        }
      },
      fieldize: function(){
        var ret, i$, to$, i, j$, to1$, j, ref$, this$ = this;
        ret = this.headers.map(function(d, i){
          return {
            data: [],
            datatype: this$.types[i],
            name: d,
            bind: this$.bind[i],
            key: this$.keys[i],
            dataset: this$.datasets[i]
          };
        });
        for (i$ = 0, to$ = this.rows.length; i$ < to$; ++i$) {
          i = i$;
          if (!this.rows[i].filter(fn$).length) {
            continue;
          }
          for (j$ = 0, to1$ = this.headers.length; j$ < to1$; ++j$) {
            j = j$;
            ret[j].data.push(((ref$ = this.rows)[i] || (ref$[i] = []))[j]);
          }
        }
        return ret;
        function fn$(it){
          return it;
        }
      }
    },
    render: function(obj){
      var headOnly, ths, trs, this$ = this;
      obj == null && (obj = {});
      headOnly = obj.headOnly, ths = obj.ths, trs = obj.trs;
      return new Promise(function(res, rej){
        var dim, head, scroll, content, rowcount, update;
        dim = document.querySelector('#dataset-editbox .sheet .sheet-dim');
        head = document.querySelector('#dataset-editbox .sheet .sheet-head');
        scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
        content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
        rowcount = +head.getAttribute('data-rowcount') || 10;
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/grid-render-wrap.js');
        }
        update = function(trs, ths, dimnode){
          var that;
          if (dim) {
            dim.innerHTML = dimnode;
          }
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
          this$.data.bindFieldSync();
          return res();
        };
        if (trs && ths) {
          return update(trs, ths);
        }
        this$.worker.onmessage = function(e){
          var ref$, trs, ths, dimnode;
          ref$ = [e.data.trs, e.data.ths, e.data.dim], trs = ref$[0], ths = ref$[1], dimnode = ref$[2];
          return update(trs, ths, dimnode);
        };
        if (headOnly) {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            types: this$.data.types,
            bind: this$.data.bind,
            dimkeys: this$.data.dimkeys,
            rowcount: rowcount
          });
        } else {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            rows: this$.data.rows,
            types: this$.data.types,
            bind: this$.data.bind,
            dimkeys: this$.data.dimkeys,
            rowcount: rowcount
          });
        }
      });
    },
    update: function(r, c, val, headOnly){
      var dirty, i$, i, ref$, j, that, valtype, this$ = this;
      headOnly == null && (headOnly = true);
      dirty = false;
      if (c >= this.data.headers.length && val) {
        for (i$ = this.data.headers.length; i$ <= c; ++i$) {
          i = i$;
          this.data.headers[i] = '';
        }
        headOnly = false;
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
      if (c >= ((ref$ = this.data).types || (ref$.types = [])).length && val) {
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
      for (i$ = this.data.rows.length - 1; i$ >= 0; --i$) {
        i = i$;
        if (this.data.rows[i].filter(fn1$).length) {
          break;
        }
      }
      this.data.rows.splice(i + 1);
      for (i$ = this.data.types.length - 1; i$ >= 0; --i$) {
        i = i$;
        if (this.data.rows.filter(fn2$).length || this.data.headers[i]) {
          break;
        }
      }
      if (i < this.data.types.length - 1) {
        this.data.headers.splice(i + 1, 1);
        this.data.rows.map(function(row){
          return row.splice(i + 1, 1);
        });
        this.data.types.splice(i + 1);
        dirty = true;
      }
      eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      if (dirty) {
        return this.render({
          headOnly: headOnly
        }).then(function(){
          var node, range;
          this$.clear = false;
          if (r < 0) {
            node = document.querySelector('#dataset-editbox .sheet-head > div >' + (" div:nth-of-type(" + (c + 1) + ") > textarea:first-child"));
          } else {
            node = document.querySelector(['#dataset-editbox .sheet-cells >', "div:nth-of-type(" + (r + 1) + ") >", "div:nth-of-type(" + (c + 1) + ") textarea"].join(" "));
          }
          if (node) {
            node.focus();
            if (node.setSelectionRange) {
              return node.setSelectionRange(1, 1);
            } else {
              range = node.createTextRange();
              range.collapse(true);
              range.moveEnd('character', 1);
              range.moveStart('character', 1);
              return range.select();
            }
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
      function fn1$(it){
        return it;
      }
      function fn2$(it){
        return it[i];
      }
    },
    empty: function(render){
      var ref$;
      ref$ = this.data;
      ref$.headers = [];
      ref$.rows = [];
      ref$.types = [];
      ref$.keys = [];
      ref$.datasets = [];
      ref$.bind = [];
      this.clear = true;
      if (render) {
        return this.render();
      }
    },
    init: function(){
      var head, dim, scroll, content, this$ = this;
      eventBus.listen('sheet.grid.isClear.get', function(){
        return eventBus.fire('sheet.grid.isClear', this$.clear);
      });
      eventBus.listen('sheet.grid.load', function(){
        return eventBus.fire('sheet.grid.loaded', this$.data.fieldize());
      });
      eventBus.listen('sheet.bind', function(dimkeys, bindmap){
        var ref$;
        ref$ = this$.data;
        ref$.dimkeys = dimkeys;
        ref$.bindmap = bindmap;
        this$.render();
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
      this.empty();
      head = document.querySelector('#dataset-editbox .sheet .sheet-head');
      dim = document.querySelector('#dataset-editbox .sheet .sheet-dim');
      scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
      content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
      scroll.addEventListener('scroll', function(e){
        head.scrollLeft = scroll.scrollLeft;
        if (dim && dim.childNodes[0]) {
          return dim.childNodes[0].style.left = (-scroll.scrollLeft) + "px";
        }
      });
      content.addEventListener('click', function(e){
        var data, row;
        if (/closebtn/.exec(e.target.className)) {
          data = $scope.grid.data;
          row = +e.target.getAttribute('row');
          return $scope.$apply(function(){
            return $timeout(function(){
              eventBus.fire('loading.dimmer.on');
              data.rows.splice(row, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  eventBus.fire('loading.dimmer.off');
                  return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
                });
              });
            }, 0);
          });
        }
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
              data.bind.splice(col, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  eventBus.fire('loading.dimmer.off');
                  return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
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
        var pPos, key, n, val;
        pPos = e.target.selectionStart;
        key = e.keyCode;
        n = e.target;
        val = n.value.trim() || n.textContent.trim();
        if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
          return n.value = "";
        }
        return setTimeout(function(){
          var val, cPos, col, v, node, that;
          val = n.value.trim() || n.textContent.trim();
          val = (n.value.trim() || n.textContent.trim()).replace(/\n/g, '');
          cPos = e.target.selectionStart;
          col = +n.getAttribute('col');
          if (key === 13) {
            key = 40;
          }
          if (key === 39 && (pPos !== cPos || cPos < val.length)) {
            return;
          }
          if (key === 37 && (pPos !== cPos || cPos > 0)) {
            return;
          }
          if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
            return this$.paste(-1, col, val);
          } else if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (v[1] > 0) {
              node = content.querySelector([".sheet-cells >", "div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") textarea"].join(" "));
            } else {
              node = head.querySelector([".sheet-head > div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") > textarea:first-child"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return $scope.$apply(function(){
              return this$.update(-1, col, val);
            });
          }
        }, 0);
      });
      head.addEventListener('input', function(e){
        var key, n, val, col;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        col = +n.getAttribute('col');
        if (/\t/.exec(val)) {
          return this$.paste(-1, col, val);
        } else if (/\n/.exec(val)) {
          return val = n.value = val.replace(/\n/g, '');
        }
      });
      content.addEventListener('input', function(e){
        var key, n, val, row, col;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        row = +n.getAttribute('row');
        col = +n.getAttribute('col');
        if (/\t/.exec(val)) {
          return this$.paste(row, col, val);
        } else if (/\n/.exec(val)) {
          return val = n.value = val.replace(/\n/g, '');
        }
      });
      return content.addEventListener('keydown', function(e){
        var pPos, key, n, val;
        pPos = e.target.selectionStart;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
          return n.value = "";
        }
        if (n) {
          return setTimeout(function(){
            var val, cPos, row, col, h, v, node, that;
            if (n.getAttribute('col') == null) {
              return;
            }
            val = (n.value || '').replace(/\n/g, '');
            cPos = e.target.selectionStart;
            row = +n.getAttribute('row');
            col = +n.getAttribute('col');
            h = col;
            if (key === 13) {
              key = 40;
            }
            if (key === 39 && (pPos !== cPos || cPos < val.length)) {
              return;
            }
            if (key === 37 && (pPos !== cPos || cPos > 0)) {} else if (key >= 37 && key <= 40) {
              v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
              if (row === 0 && v[1] < 0) {
                node = head.querySelector([".sheet-head > div >", "div:nth-of-type(" + (col + 1) + ") > textarea:first-child"].join(" "));
              } else {
                node = content.querySelector([".sheet-cells >", "div:nth-of-type(" + (row + 1 + v[1]) + ") >", "div:nth-of-type(" + (col + 1 + v[0]) + ") textarea"].join(" "));
              }
              if (that = node) {
                return that.focus();
              }
            } else {
              return $scope.$apply(function(){
                return this$.update(row, h, val);
              });
            }
          }, 0);
        }
      });
    },
    paste: function(row, col, val){
      var head, data, ret, w, h, curRowSize, curColSize, newRowSize, newColSize, i$, i, r, j$, c, ref$, key$, to$, j, this$ = this;
      head = null;
      eventBus.fire('loading.dimmer.on');
      data = $scope.grid.data;
      ret = val.split('\n').map(function(it){
        return it.split('\t');
      });
      if (row === -1) {
        head = ret.splice(0, 1)[0];
        row = 0;
      }
      w = Math.max.apply(null, ret.map(function(it){
        return it.length;
      }));
      h = ret.length;
      curRowSize = data.rows.length;
      curColSize = data.headers.length;
      newRowSize = row + h - 1 < curRowSize
        ? curRowSize
        : row + h - 1;
      newColSize = col + w - 1 < curColSize
        ? curColSize
        : col + w - 1;
      if (newColSize > curColSize) {
        for (i$ = curColSize; i$ < newColSize; ++i$) {
          i = i$;
          data.headers[i] = "";
        }
      }
      if (head) {
        for (i$ = 0; i$ < w; ++i$) {
          i = i$;
          data.headers[i + col] = head[i];
        }
      }
      if (newRowSize > curRowSize) {
        data.rows.push((function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = newColSize; i$ < to$; ++i$) {
            i = i$;
            results$.push("");
          }
          return results$;
        }()));
      }
      for (i$ = 0; i$ < h; ++i$) {
        r = i$;
        for (j$ = 0; j$ < w; ++j$) {
          c = j$;
          ((ref$ = data.rows)[key$ = r + row] || (ref$[key$] = []))[c + col] = ret[r][c];
        }
      }
      for (i$ = col, to$ = col + w; i$ < to$; ++i$) {
        i = i$;
        data.types[i] = plotdb.Types.resolve((fn$()));
      }
      return $scope.grid.render().then(function(){
        this$.clear = false;
        eventBus.fire('loading.dimmer.off');
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = data.rows.length; i$ < to$; ++i$) {
          j = i$;
          results$.push(data.rows[j][i]);
        }
        return results$;
      }
    },
    load: function(data, size){
      var i$, ref$, len$, k, this$ = this;
      size == null && (size = 0);
      for (i$ = 0, len$ = (ref$ = ['headers', 'rows', 'types', 'keys', 'datasets', 'bind']).length; i$ < len$; ++i$) {
        k = ref$[i$];
        if (data[k]) {
          this.data[k] = data[k];
        }
      }
      this.data.size = size;
      if (this.data.bindmap) {
        this.data.bind = this.data.keys.map(function(it){
          return this$.data.bindmap[it] || null;
        });
        this.data.bindmap = null;
      }
      return this.render().then(function(){
        this$.clear = false;
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
    }
  });
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
  $scope.parser.fields = initWrap({
    init: function(){
      eventBus.listen('sheet.data.clear', function(){
        $scope.dataset.clear();
        return $scope.grid.empty(true);
      });
      return eventBus.listen('sheet.data.set', function(data){
        var x$, payload;
        x$ = payload = {};
        x$.headers = data.map(function(it){
          return it.name;
        });
        x$.rows = (data[0] || {
          data: []
        }).data.map(function(d, i){
          return data.map(function(e, j){
            return e.data[i];
          });
        });
        x$.types = data.map(function(it){
          return it.datatype || 'Number';
        });
        x$.keys = data.map(function(){
          return 0;
        });
        x$.datasets = data.map(function(){
          return 0;
        });
        x$.bind = data.map(function(it){
          return it.bind;
        });
        return $scope.grid.load(payload);
      });
    }
  });
  $scope.parser.plotdb = {
    toggled: false,
    worker: null,
    toggle: function(v){
      return this.toggled = v != null
        ? v
        : !this.toggled;
    },
    parse: function(dataset, bindmap){
      var this$ = this;
      bindmap == null && (bindmap = null);
      return new Promise(function(res, rej){
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/parse-dataset.js');
        }
        this$.worker.onmessage = function(arg$){
          var payload;
          payload = arg$.data;
          return $scope.$apply(function(){
            if (bindmap) {
              payload.data.bind = payload.data.keys.map(function(it){
                return bindmap[it];
              });
            }
            $scope.grid.empty(false);
            return $scope.grid.load(payload.data, dataset.size).then(function(){
              return res(dataset);
            });
          });
        };
        return this$.worker.postMessage({
          dataset: dataset
        });
      });
    },
    load: function(dataset){
      var this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return $scope.dataset.load(dataset.key, true, dataset._type.location)['finally'](function(){
        this$.toggle(false);
        return eventBus.fire('loading.dimmer.off');
      }).then(function(it){
        return this$.parse(it);
      });
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
    askencoding: function(it){
      $scope.parser.csv.callback = it;
      return $scope.parser.csv.toggle(true);
    },
    gotencoding: function(){
      return this.callback();
    },
    'import': function(buf, file){
      var node;
      file == null && (file = {});
      if (file.name && !/\.csv$/.exec(file.name)) {
        alert("it's not a CSV file");
        return;
      }
      node = document.getElementById('dataset-import-dropdown') || document.getElementById('dataset-import-dropdown-inline');
      node.className = node.className.replace(/open/, '');
      $scope.parser.csv.buf = buf;
      $scope.parser.csv.toggle(false);
      return $scope.parser.csv.read();
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
          return $scope.$apply(function(){
            var data;
            data = e.data.data;
            $scope.grid.empty(false);
            return $scope.grid.load(data, buf.length).then(function(){
              return $scope.$apply(function(){
                this$.toggle(false);
                this$.buf = null;
                if (verbose) {
                  eventBus.fire('loading.dimmer.off');
                }
                $scope.loading = false;
                $scope.dataset.clear();
                return res();
              });
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
    sheets: {
      toggled: false,
      toggle: function(it){
        var res;
        this.toggled = it != null
          ? it
          : !this.toggled;
        if (!this.toggled && this.promise) {
          res = this.promise.res;
          this.promise = null;
          return res();
        }
      },
      list: [],
      title: null,
      choose: function(it){
        this.title = it;
        $scope.parser.progress($scope.parser.xls.sec);
        eventBus.fire('loading.dimmer.on', 1);
        this.toggle(false);
        return $scope.parser.xls.worker.postMessage({
          type: 'get-sheet',
          buf: $scope.parser.xls.buf,
          sheetName: this.title
        });
      }
    },
    read: function(buf, file){
      var xls, sec, node, this$ = this;
      xls = $scope.parser.xls;
      xls.sheets.title = null;
      xls.buf = buf;
      if (file.name && !/\.xlsx?/.exec(file.name)) {
        alert("it's not a Microsoft Excel file");
        return;
      }
      eventBus.fire('loading.dimmer.on', 1);
      xls.sec = sec = buf.length * 2.5 / 1000;
      $scope.parser.progress(sec);
      if (!xls.worker) {
        xls.worker = new Worker('/js/data/worker/excel.js');
        xls.worker.onmessage = function(e){
          return $scope.$apply(function(){
            var data;
            if (e.data.type === 'sheet-list') {
              xls.sheets.toggle(true);
              xls.sheets.list = e.data.data;
              eventBus.fire('loading.dimmer.off');
            }
            if (e.data.type === 'sheet') {
              $scope.grid.empty(false);
              data = e.data.data;
              return $scope.grid.load(data, buf.length).then(function(){
                eventBus.fire('loading.dimmer.off');
                return $scope.dataset.clear();
              });
            }
          });
        };
      }
      node = document.getElementById('dataset-import-dropdown') || document.getElementById('dataset-import-dropdown-inline');
      node.className = node.className.replace(/open/, '');
      return $timeout(function(){
        return xls.worker.postMessage({
          type: 'get-sheet-list',
          buf: buf
        });
      }, 100);
    }
  };
  $scope.parser.gsheet = initWrap({
    url: null,
    apiKey: 'AIzaSyD3emlU63t6e_0n9Zj9lFCl-Rwod0OMTqY',
    clientId: '1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com',
    scopes: ['profile', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'].join(' '),
    init: function(){
      var this$ = this;
      if (typeof gapi == 'undefined' || gapi === null) {
        return;
      }
      return gapi.load('client:auth2', function(){
        gapi.client.load('drive', 'v3');
        gapi.client.setApiKey(this$.apiKey);
        gapi.auth2.init({
          client_id: this$.clientId,
          scope: this$.scopes
        });
        Paging.loadOnScroll(function(){
          return $scope.parser.gsheet.list();
        }, '#gsheet-list-end', '#gsheet-files');
        return $scope.$watch('parser.gsheet.title', function(n, o){
          if (n !== o) {
            return this$.list(true);
          }
        });
      });
    },
    files: [],
    auth: function(){
      var auth;
      if (typeof gapi == 'undefined' || gapi === null) {
        return;
      }
      auth = gapi.auth2.getAuthInstance();
      if (auth.isSignedIn.get()) {
        return auth;
      } else {
        eventBus.fire('loading.dimmer.on');
        return auth.signIn();
      }
    },
    list: function(flush){
      var this$ = this;
      flush == null && (flush = false);
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
          q: "mimeType='application/vnd.google-apps.spreadsheet'" + (this$.title ? " and name contains '" + this$.title + "'" : '')
        };
        if (this$.pageToken) {
          config.pageToken = this$.pageToken;
        }
        request = gapi.client.drive.files.list(config);
        return request.execute(function(ret){
          if (flush) {
            this$.files = [];
          }
          this$.pageToken = ret.nextPageToken;
          return $scope.$apply(function(){
            this$.files = this$.files.concat((ret.files || (ret.files = [])).map(function(it){
              return {
                file: it
              };
            }));
            return this$.loading = false;
          });
        });
      });
    },
    toggle: function(it){
      this.toggled = it != null
        ? it
        : !this.toggled;
      if (this.toggled && !this.files.length) {
        return this.list();
      }
    },
    sheets: {
      toggled: false,
      toggle: function(it){
        var res;
        this.toggled = it != null
          ? it
          : !this.toggled;
        if (!this.toggled && this.promise) {
          res = this.promise.res;
          this.promise = null;
          return res();
        }
      },
      list: [],
      title: null,
      promise: null,
      load: function(file){
        var this$ = this;
        return gapi.client.sheets.spreadsheets.get({
          spreadsheetId: file.id
        }).then(function(ret){
          this$.list = ret.result.sheets.map(function(it){
            return it.properties.title;
          });
          if (this$.list.length === 1) {
            this$.title = this$.list[0];
            return Promise.resolve();
          }
          eventBus.fire('loading.dimmer.off');
          $scope.parser.gsheet.toggle(false);
          this$.toggle(true);
          return new Promise(function(res, rej){
            return this$.promise = {
              res: res,
              rej: rej
            };
          });
        });
      }
    },
    load: function(file){
      var this$ = this;
      file = file.file;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(function(){
        return $scope.parser.gsheet.sheets.load(file);
      }).then(function(){
        return this$.toggle(false);
      }).then(function(){
        eventBus.fire('loading.dimmer.on', 1);
        $scope.parser.progress(3000);
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: file.id,
          range: this$.sheets.title + "!A:ZZ"
        });
      }).then(function(ret){
        var list, head, data, size;
        list = ret.result.values;
        list = list.filter(function(it){
          return it.filter(function(it){
            return (it || "").trim().length;
          }).length;
        });
        head = list.splice(0, 1)[0];
        $scope.grid.empty(false);
        data = {};
        data.headers = head;
        data.rows = list;
        data.types = plotdb.Types.resolve(data);
        size = (ret.body || "").length;
        return $scope.grid.load(data, size).then(function(){
          this$.toggled = false;
          eventBus.fire('loading.dimmer.off');
          return $scope.dataset.clear();
        });
      }, function(){
        var this$ = this;
        return $scope.$apply(function(){
          plNotify.send('danger', "can't load sheet, try again later?");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    }
  });
  return initWrap.run();
}));// Generated by LiveScript 1.3.1
var x$, slice$ = [].slice;
x$ = angular.module('plotDB');
x$.service('initWrap', ['$rootScope'].concat(function($rootScope){
  var _;
  return _ = function(){
    var init;
    init = function(it){
      (init.list || (init.list = [])).push(it);
      return import$(it, {
        promise: {},
        failed: function(name){
          var payload, rej;
          name == null && (name = 'default');
          payload = slice$.call(arguments, 1);
          if (!this.promise[name]) {
            return;
          }
          rej = this.promise[name].rej;
          this.promise[name] = null;
          return rej.apply(null, payload);
        },
        finish: function(name){
          var payload, res;
          name == null && (name = 'default');
          payload = slice$.call(arguments, 1);
          if (!this.promise[name]) {
            return;
          }
          res = this.promise[name].res;
          this.promise[name] = null;
          return res.apply(null, payload);
        },
        block: function(name){
          var this$ = this;
          name == null && (name = 'default');
          return new Promise(function(res, rej){
            return this$.promise[name] = {
              res: res,
              rej: rej
            };
          });
        }
      });
    };
    return init.run = function(){
      return (this.list || (this.list = [])).map(function(it){
        return it.init();
      });
    }, init;
  };
}));
x$.directive('pldialog', ['$compile'].concat(function($compile){
  return {
    restrict: 'A',
    scope: {
      model: '=ngModel'
    },
    link: function(s, e, a, c){
      var ctrl;
      s.model.ctrl = ctrl = {
        promise: null,
        focus: function(){
          var n;
          n = e.find("input[tabindex='1']");
          if (n.length) {
            return n.focus();
          }
        },
        toggle: function(t, v){
          this.toggled = t
            ? t
            : !this.toggled;
          if (v) {
            this.value = v;
          }
          return this.focus();
        },
        toggled: false,
        value: null,
        reset: function(){
          return this.value = '';
        },
        init: function(){
          this.reset();
          return e.on('keydown', function(event){
            var key, tabindex, n;
            key = event.keyCode || event.which;
            if (key !== 13) {
              return;
            }
            tabindex = +event.target.getAttribute("tabindex") + 1;
            n = e.find("input[tabindex='" + tabindex + "']");
            if (n.length) {
              return n.focus();
            } else {
              return s.$apply(function(){
                return s.model.action('done');
              });
            }
          });
        }
      };
      s.model.action = function(a){
        if (a === 'done') {
          s.model.value = ctrl.value;
        }
        ctrl.toggle(false);
        if (ctrl.promise) {
          if (a === 'done') {
            ctrl.promise.res(ctrl.value);
          } else {
            ctrl.promise.rej(a);
          }
          return ctrl.promise = null;
        }
      };
      s.model.prompt = function(v){
        var this$ = this;
        ctrl.toggle(true, v);
        return new Promise(function(res, rej){
          return ctrl.promise = {
            res: res,
            rej: rej
          };
        });
      };
      return s.model.ctrl.init();
    }
  };
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plPaletteModal', ['$scope', 'eventBus', 'paletteService'].concat(function($scope, eventBus, paletteService){
  $scope.paledit = {
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
    callback: null,
    init: function(){
      var x$, this$ = this;
      this.ldcp = new ldColorPicker(null, {}, $('#palette-editor .editor .ldColorPicker')[0]);
      this.ldcp.on('change-palette', function(){
        return setTimeout(function(){
          return $scope.$apply(function(){
            return this$.update();
          });
        }, 0);
      });
      this.sample = paletteService.sample;
      this.list = [];
      x$ = $('#pal-select');
      x$.select2({
        ajax: {
          url: '/d/palette',
          dataType: 'json',
          delay: 250,
          data: function(params){
            return {
              offset: (params.page || 0) * 20,
              limit: 20
            };
          },
          processResults: function(data, params){
            params.page = params.page || 0;
            if (params.page === 0) {
              this$.list = data = this$.sample.concat(data);
            } else {
              this$.list = this$.list.concat(data);
            }
            return {
              results: data.map(function(it){
                return {
                  id: it.key,
                  text: it.name,
                  data: it.colors
                };
              }),
              pagination: {
                more: data.length >= 20
              }
            };
          }
        },
        allowedMethods: ['updateResults'],
        escapeMarkup: function(it){
          return it;
        },
        minimumInputLength: 0,
        templateSelection: function(it){
          return it.text + "<small class='grayed'> (" + it.id + ")</small>";
        },
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
          $(("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>"));
          return ("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>");
        }
      }, x$.on('select2:closing', function(e){
        var key, ret;
        key = $(e.target).val();
        ret = this$.list.filter(function(it){
          return it.key == key;
        })[0];
        $scope.$apply(function(){
          return this$.item.value = JSON.parse(JSON.stringify(ret));
        });
        return this$.ldcp.setPalette(this$.item.value);
      }));
      $scope.$watch('paledit.paste', function(d){
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
      return x$;
    },
    update: function(){
      var ref$, src, des, pairing, i$, to$, i, d, j$, to1$, j, s, len$, pair, unpair, that;
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
        this.paste = null;
        if (that = $scope.paledit.callback) {
          return that();
        }
      }
    },
    toggled: false,
    toggle: function(){
      this.toggled = !this.toggled;
      if (!this.toggled) {
        return this.update();
      }
    },
    edit: function(item, cb){
      cb == null && (cb = null);
      this.callback = cb;
      this.item = item;
      this.ldcp.setPalette(item.value);
      return this.toggled = true;
    }
  };
  $scope.paledit.init();
  return eventBus.listen('paledit.edit', function(item, cb){
    return $scope.paledit.edit(item, cb);
  });
}));