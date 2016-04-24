// Generated by LiveScript 1.3.1
var x$, onSignIn;
x$ = angular.module('plotDB');
x$.config(['$compileProvider'].concat(function($compileProvider){
  return $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob:|https?:\/\/plotdb\.com\/|https?:\/\/plotdb\.io\/|http:\/\/localhost\/|https:\/\/www\.facebook\.com\/|https:\/\/www\.pinterest\.com\/|mailto:\?|http:\/\/www\.linkedin\.com\/|http:\/\/twitter\.com\/)|#/);
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
            func(payload);
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
      var ref$;
      ((ref$ = this.queues)[name] || (ref$[name] = [])).push(payload);
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
x$.controller('plSite', ['$scope', '$http', '$interval', 'global', 'plNotify', 'dataService', 'chartService'].concat(function($scope, $http, $interval, global, plNotify, dataService, chartService){
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
    login: function(){
      var this$ = this;
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
    this.maxtop = parseInt(this.getAttribute("data-top"));
    return this.initTop = this.offsetTop;
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
      if (scrollTop + node.maxtop >= node.offsetTop && !node.sticked) {
        node.sticked = true;
        node.style.top = node.maxtop + "px";
        results$.push($(node).addClass('sticked'));
      } else if (scrollTop + node.maxtop < node.initTop && node.sticked) {
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
}