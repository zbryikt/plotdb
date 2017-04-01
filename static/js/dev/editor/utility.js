// Generated by LiveScript 1.3.1
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
        choices: ['default', 'QVGA', 'HVGA', 'Thumb', 'Custom'],
        map: {
          'default': [0, 0],
          QVGA: [240, 320],
          HVGA: [320, 480],
          Thumb: [308, 229]
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
            ref$ = canvas.style;
            ref$.marginTop = (height - h) / 2 + "px";
            ref$.marginLeft = (width - w) / 2 + "px";
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
}