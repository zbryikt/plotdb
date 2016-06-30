// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// This is CodeMirror (http://codemirror.net), a code editor
// implemented in JavaScript on top of the browser's DOM.
//
// You can find some technical background for some of the code below
// at http://marijnhaverbeke.nl/blog/#cm-internals .

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    module.exports = mod();
  else if (typeof define == "function" && define.amd) // AMD
    return define([], mod);
  else // Plain browser env
    (this || window).CodeMirror = mod();
})(function() {
  "use strict";

  // BROWSER SNIFFING

  // Kludges for bugs and behavior differences that can't be feature
  // detected are enabled based on userAgent etc sniffing.
  var userAgent = navigator.userAgent;
  var platform = navigator.platform;

  var gecko = /gecko\/\d/i.test(userAgent);
  var ie_upto10 = /MSIE \d/.test(userAgent);
  var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
  var ie = ie_upto10 || ie_11up;
  var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : ie_11up[1]);
  var webkit = /WebKit\//.test(userAgent);
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
  var chrome = /Chrome\//.test(userAgent);
  var presto = /Opera\//.test(userAgent);
  var safari = /Apple Computer/.test(navigator.vendor);
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
  var phantom = /PhantomJS/.test(userAgent);

  var ios = /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
  // This is woefully incomplete. Suggestions for alternative methods welcome.
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
  var mac = ios || /Mac/.test(platform);
  var windows = /win/i.test(platform);

  var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
  if (presto_version) presto_version = Number(presto_version[1]);
  if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
  var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
  var captureRightClick = gecko || (ie && ie_version >= 9);

  // Optimize some code when these features are not used.
  var sawReadOnlySpans = false, sawCollapsedSpans = false;

  // EDITOR CONSTRUCTOR

  // A CodeMirror instance represents an editor. This is the object
  // that user code is usually dealing with.

  function CodeMirror(place, options) {
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

    this.options = options = options ? copyObj(options) : {};
    // Determine effective options based on given values and defaults.
    copyObj(defaults, options, false);
    setGuttersForLineNumbers(options);

    var doc = options.value;
    if (typeof doc == "string") doc = new Doc(doc, options.mode, null, options.lineSeparator);
    this.doc = doc;

    var input = new CodeMirror.inputStyles[options.inputStyle](this);
    var display = this.display = new Display(place, doc, input);
    display.wrapper.CodeMirror = this;
    updateGutters(this);
    themeChanged(this);
    if (options.lineWrapping)
      this.display.wrapper.className += " CodeMirror-wrap";
    if (options.autofocus && !mobile) display.input.focus();
    initScrollbars(this);

    this.state = {
      keyMaps: [],  // stores maps added by addKeyMap
      overlays: [], // highlighting overlays, as added by addOverlay
      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
      overwrite: false,
      delayingBlurEvent: false,
      focused: false,
      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
      pasteIncoming: false, cutIncoming: false, // help recognize paste/cut edits in input.poll
      selectingText: false,
      draggingText: false,
      highlight: new Delayed(), // stores highlight worker timeout
      keySeq: null,  // Unfinished key sequence
      specialChars: null
    };

    var cm = this;

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie && ie_version < 11) setTimeout(function() { cm.display.input.reset(true); }, 20);

    registerEventHandlers(this);
    ensureGlobalHandlers();

    startOperation(this);
    this.curOp.forceUpdate = true;
    attachDoc(this, doc);

    if ((options.autofocus && !mobile) || cm.hasFocus())
      setTimeout(bind(onFocus, this), 20);
    else
      onBlur(this);

    for (var opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt))
      optionHandlers[opt](this, options[opt], Init);
    maybeUpdateLineNumberWidth(this);
    if (options.finishInit) options.finishInit(this);
    for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
    endOperation(this);
    // Suppress optimizelegibility in Webkit, since it breaks text
    // measuring on line wrapping boundaries.
    if (webkit && options.lineWrapping &&
        getComputedStyle(display.lineDiv).textRendering == "optimizelegibility")
      display.lineDiv.style.textRendering = "auto";
  }

  // DISPLAY CONSTRUCTOR

  // The display handles the DOM integration, both for input reading
  // and content drawing. It holds references to DOM nodes and
  // display-related state.

  function Display(place, doc, input) {
    var d = this;
    this.input = input;

    // Covers bottom-right square when both scrollbars are present.
    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
    d.scrollbarFiller.setAttribute("cm-not-content", "true");
    // Covers bottom of gutter when coverGutterNextToScrollbar is on
    // and h scrollbar is present.
    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
    d.gutterFiller.setAttribute("cm-not-content", "true");
    // Will contain the actual code, positioned to cover the viewport.
    d.lineDiv = elt("div", null, "CodeMirror-code");
    // Elements are added to these to represent selection and cursors.
    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
    d.cursorDiv = elt("div", null, "CodeMirror-cursors");
    // A visibility: hidden element used to find the size of things.
    d.measure = elt("div", null, "CodeMirror-measure");
    // When lines outside of the viewport are measured, they are drawn in this.
    d.lineMeasure = elt("div", null, "CodeMirror-measure");
    // Wraps everything that needs to exist inside the vertically-padded coordinate system
    d.lineSpace = elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
                      null, "position: relative; outline: none");
    // Moved around its parent to cover visible view.
    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
    // Set to the height of the document, allowing scrolling.
    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
    d.sizerWidth = null;
    // Behavior of elts with overflow: auto and padding is
    // inconsistent across browsers. This is used to ensure the
    // scrollable area is big enough.
    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
    // Will contain the gutters, if any.
    d.gutters = elt("div", null, "CodeMirror-gutters");
    d.lineGutter = null;
    // Actual scrollable element.
    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
    d.scroller.setAttribute("tabIndex", "-1");
    // The element in which the editor lives.
    d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

    // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
    if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
    if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;

    if (place) {
      if (place.appendChild) place.appendChild(d.wrapper);
      else place(d.wrapper);
    }

    // Current rendered range (may be bigger than the view window).
    d.viewFrom = d.viewTo = doc.first;
    d.reportedViewFrom = d.reportedViewTo = doc.first;
    // Information about the rendered lines.
    d.view = [];
    d.renderedView = null;
    // Holds info about a single rendered line when it was rendered
    // for measurement, while not in view.
    d.externalMeasured = null;
    // Empty space (in pixels) above the view
    d.viewOffset = 0;
    d.lastWrapHeight = d.lastWrapWidth = 0;
    d.updateLineNumbers = null;

    d.nativeBarWidth = d.barHeight = d.barWidth = 0;
    d.scrollbarsClipped = false;

    // Used to only resize the line number gutter when necessary (when
    // the amount of lines crosses a boundary that makes its width change)
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
    // Set to true when a non-horizontal-scrolling line widget is
    // added. As an optimization, line widget aligning is skipped when
    // this is false.
    d.alignWidgets = false;

    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

    // Tracks the maximum line length so that the horizontal scrollbar
    // can be kept static when scrolling.
    d.maxLine = null;
    d.maxLineLength = 0;
    d.maxLineChanged = false;

    // Used for measuring wheel scrolling granularity
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

    // True when shift is held down.
    d.shift = false;

    // Used to track whether anything happened since the context menu
    // was opened.
    d.selForContextMenu = null;

    d.activeTouch = null;

    input.init(d);
  }

  // STATE UPDATES

  // Used to get the editor into a consistent state again when options change.

  function loadMode(cm) {
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
    resetModeState(cm);
  }

  function resetModeState(cm) {
    cm.doc.iter(function(line) {
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
    });
    cm.doc.frontier = cm.doc.first;
    startWorker(cm, 100);
    cm.state.modeGen++;
    if (cm.curOp) regChange(cm);
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      addClass(cm.display.wrapper, "CodeMirror-wrap");
      cm.display.sizer.style.minWidth = "";
      cm.display.sizerWidth = null;
    } else {
      rmClass(cm.display.wrapper, "CodeMirror-wrap");
      findMaxLine(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function(){updateScrollbars(cm);}, 100);
  }

  // Returns a function that estimates the height of a line, to use as
  // first approximation until the line becomes visible (and is thus
  // properly measurable).
  function estimateHeight(cm) {
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
    return function(line) {
      if (lineIsHidden(cm.doc, line)) return 0;

      var widgetsHeight = 0;
      if (line.widgets) for (var i = 0; i < line.widgets.length; i++) {
        if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
      }

      if (wrapping)
        return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
      else
        return widgetsHeight + th;
    };
  }

  function estimateLineHeights(cm) {
    var doc = cm.doc, est = estimateHeight(cm);
    doc.iter(function(line) {
      var estHeight = est(line);
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    });
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
    clearCaches(cm);
  }

  function guttersChanged(cm) {
    updateGutters(cm);
    regChange(cm);
    setTimeout(function(){alignHorizontally(cm);}, 20);
  }

  // Rebuild the gutter elements, ensure the margin to the left of the
  // code matches their width.
  function updateGutters(cm) {
    var gutters = cm.display.gutters, specs = cm.options.gutters;
    removeChildren(gutters);
    for (var i = 0; i < specs.length; ++i) {
      var gutterClass = specs[i];
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
      if (gutterClass == "CodeMirror-linenumbers") {
        cm.display.lineGutter = gElt;
        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
      }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);
  }

  function updateGutterSpace(cm) {
    var width = cm.display.gutters.offsetWidth;
    cm.display.sizer.style.marginLeft = width + "px";
  }

  // Compute the character length of a line, taking into account
  // collapsed ranges (see markText) that might hide parts, and join
  // other lines onto it.
  function lineLength(line) {
    if (line.height == 0) return 0;
    var len = line.text.length, merged, cur = line;
    while (merged = collapsedSpanAtStart(cur)) {
      var found = merged.find(0, true);
      cur = found.from.line;
      len += found.from.ch - found.to.ch;
    }
    cur = line;
    while (merged = collapsedSpanAtEnd(cur)) {
      var found = merged.find(0, true);
      len -= cur.text.length - found.from.ch;
      cur = found.to.line;
      len += cur.text.length - found.to.ch;
    }
    return len;
  }

  // Find the longest line in the document.
  function findMaxLine(cm) {
    var d = cm.display, doc = cm.doc;
    d.maxLine = getLine(doc, doc.first);
    d.maxLineLength = lineLength(d.maxLine);
    d.maxLineChanged = true;
    doc.iter(function(line) {
      var len = lineLength(line);
      if (len > d.maxLineLength) {
        d.maxLineLength = len;
        d.maxLine = line;
      }
    });
  }

  // Make sure the gutters options contains the element
  // "CodeMirror-linenumbers" when the lineNumbers option is true.
  function setGuttersForLineNumbers(options) {
    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
    if (found == -1 && options.lineNumbers) {
      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
    } else if (found > -1 && !options.lineNumbers) {
      options.gutters = options.gutters.slice(0);
      options.gutters.splice(found, 1);
    }
  }

  // SCROLLBARS

  // Prepare DOM reads needed to update the scrollbars. Done in one
  // shot to minimize update/measure roundtrips.
  function measureForScrollbars(cm) {
    var d = cm.display, gutterW = d.gutters.offsetWidth;
    var docH = Math.round(cm.doc.height + paddingVert(cm.display));
    return {
      clientHeight: d.scroller.clientHeight,
      viewHeight: d.wrapper.clientHeight,
      scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
      viewWidth: d.wrapper.clientWidth,
      barLeft: cm.options.fixedGutter ? gutterW : 0,
      docHeight: docH,
      scrollHeight: docH + scrollGap(cm) + d.barHeight,
      nativeBarWidth: d.nativeBarWidth,
      gutterWidth: gutterW
    };
  }

  function NativeScrollbars(place, scroll, cm) {
    this.cm = cm;
    var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
    var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    place(vert); place(horiz);

    on(vert, "scroll", function() {
      if (vert.clientHeight) scroll(vert.scrollTop, "vertical");
    });
    on(horiz, "scroll", function() {
      if (horiz.clientWidth) scroll(horiz.scrollLeft, "horizontal");
    });

    this.checkedZeroWidth = false;
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    if (ie && ie_version < 8) this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
  }

  NativeScrollbars.prototype = copyObj({
    update: function(measure) {
      var needsH = measure.scrollWidth > measure.clientWidth + 1;
      var needsV = measure.scrollHeight > measure.clientHeight + 1;
      var sWidth = measure.nativeBarWidth;

      if (needsV) {
        this.vert.style.display = "block";
        this.vert.style.bottom = needsH ? sWidth + "px" : "0";
        var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
        // A bug in IE8 can cause this value to be negative, so guard it.
        this.vert.firstChild.style.height =
          Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
      } else {
        this.vert.style.display = "";
        this.vert.firstChild.style.height = "0";
      }

      if (needsH) {
        this.horiz.style.display = "block";
        this.horiz.style.right = needsV ? sWidth + "px" : "0";
        this.horiz.style.left = measure.barLeft + "px";
        var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
        this.horiz.firstChild.style.width =
          (measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
      } else {
        this.horiz.style.display = "";
        this.horiz.firstChild.style.width = "0";
      }

      if (!this.checkedZeroWidth && measure.clientHeight > 0) {
        if (sWidth == 0) this.zeroWidthHack();
        this.checkedZeroWidth = true;
      }

      return {right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0};
    },
    setScrollLeft: function(pos) {
      if (this.horiz.scrollLeft != pos) this.horiz.scrollLeft = pos;
      if (this.disableHoriz) this.enableZeroWidthBar(this.horiz, this.disableHoriz);
    },
    setScrollTop: function(pos) {
      if (this.vert.scrollTop != pos) this.vert.scrollTop = pos;
      if (this.disableVert) this.enableZeroWidthBar(this.vert, this.disableVert);
    },
    zeroWidthHack: function() {
      var w = mac && !mac_geMountainLion ? "12px" : "18px";
      this.horiz.style.height = this.vert.style.width = w;
      this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
      this.disableHoriz = new Delayed;
      this.disableVert = new Delayed;
    },
    enableZeroWidthBar: function(bar, delay) {
      bar.style.pointerEvents = "auto";
      function maybeDisable() {
        // To find out whether the scrollbar is still visible, we
        // check whether the element under the pixel in the bottom
        // left corner of the scrollbar box is the scrollbar box
        // itself (when the bar is still visible) or its filler child
        // (when the bar is hidden). If it is still visible, we keep
        // it enabled, if it's hidden, we disable pointer events.
        var box = bar.getBoundingClientRect();
        var elt = document.elementFromPoint(box.left + 1, box.bottom - 1);
        if (elt != bar) bar.style.pointerEvents = "none";
        else delay.set(1000, maybeDisable);
      }
      delay.set(1000, maybeDisable);
    },
    clear: function() {
      var parent = this.horiz.parentNode;
      parent.removeChild(this.horiz);
      parent.removeChild(this.vert);
    }
  }, NativeScrollbars.prototype);

  function NullScrollbars() {}

  NullScrollbars.prototype = copyObj({
    update: function() { return {bottom: 0, right: 0}; },
    setScrollLeft: function() {},
    setScrollTop: function() {},
    clear: function() {}
  }, NullScrollbars.prototype);

  CodeMirror.scrollbarModel = {"native": NativeScrollbars, "null": NullScrollbars};

  function initScrollbars(cm) {
    if (cm.display.scrollbars) {
      cm.display.scrollbars.clear();
      if (cm.display.scrollbars.addClass)
        rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
    }

    cm.display.scrollbars = new CodeMirror.scrollbarModel[cm.options.scrollbarStyle](function(node) {
      cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
      // Prevent clicks in the scrollbars from killing focus
      on(node, "mousedown", function() {
        if (cm.state.focused) setTimeout(function() { cm.display.input.focus(); }, 0);
      });
      node.setAttribute("cm-not-content", "true");
    }, function(pos, axis) {
      if (axis == "horizontal") setScrollLeft(cm, pos);
      else setScrollTop(cm, pos);
    }, cm);
    if (cm.display.scrollbars.addClass)
      addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
  }

  function updateScrollbars(cm, measure) {
    if (!measure) measure = measureForScrollbars(cm);
    var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
    updateScrollbarsInner(cm, measure);
    for (var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
      if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
        updateHeightsInViewport(cm);
      updateScrollbarsInner(cm, measureForScrollbars(cm));
      startWidth = cm.display.barWidth; startHeight = cm.display.barHeight;
    }
  }

  // Re-synchronize the fake scrollbars with the actual size of the
  // content.
  function updateScrollbarsInner(cm, measure) {
    var d = cm.display;
    var sizes = d.scrollbars.update(measure);

    d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
    d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";

    if (sizes.right && sizes.bottom) {
      d.scrollbarFiller.style.display = "block";
      d.scrollbarFiller.style.height = sizes.bottom + "px";
      d.scrollbarFiller.style.width = sizes.right + "px";
    } else d.scrollbarFiller.style.display = "";
    if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = "block";
      d.gutterFiller.style.height = sizes.bottom + "px";
      d.gutterFiller.style.width = measure.gutterWidth + "px";
    } else d.gutterFiller.style.display = "";
  }

  // Compute the lines that are visible in a given viewport (defaults
  // the the current scroll position). viewport may contain top,
  // height, and ensure (see op.scrollToPos) properties.
  function visibleLines(display, doc, viewport) {
    var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
    top = Math.floor(top - paddingTop(display));
    var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;

    var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
    // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
    // forces those lines into the viewport (if possible).
    if (viewport && viewport.ensure) {
      var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
      if (ensureFrom < from) {
        from = ensureFrom;
        to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
      } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
        from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
        to = ensureTo;
      }
    }
    return {from: from, to: Math.max(to, from + 1)};
  }

  // LINE NUMBERS

  // Re-align line numbers and gutter marks to compensate for
  // horizontal scrolling.
  function alignHorizontally(cm) {
    var display = cm.display, view = display.view;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, left = comp + "px";
    for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
      if (cm.options.fixedGutter && view[i].gutter)
        view[i].gutter.style.left = left;
      var align = view[i].alignable;
      if (align) for (var j = 0; j < align.length; j++)
        align[j].style.left = left;
    }
    if (cm.options.fixedGutter)
      display.gutters.style.left = (comp + gutterW) + "px";
  }

  // Used to ensure that the line number gutter is still the right
  // size for the current document size. Returns true when an update
  // is needed.
  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) return false;
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = "";
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = display.lineNumWidth + "px";
      updateGutterSpace(cm);
      return true;
    }
    return false;
  }

  function lineNumberFor(options, i) {
    return String(options.lineNumberFormatter(i + options.firstLineNumber));
  }

  // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
  // but using getBoundingClientRect to get a sub-pixel-accurate
  // result.
  function compensateForHScroll(display) {
    return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
  }

  // DISPLAY DRAWING

  function DisplayUpdate(cm, viewport, force) {
    var display = cm.display;

    this.viewport = viewport;
    // Store some values that we'll need later (but don't want to force a relayout for)
    this.visible = visibleLines(display, cm.doc, viewport);
    this.editorIsHidden = !display.wrapper.offsetWidth;
    this.wrapperHeight = display.wrapper.clientHeight;
    this.wrapperWidth = display.wrapper.clientWidth;
    this.oldDisplayWidth = displayWidth(cm);
    this.force = force;
    this.dims = getDimensions(cm);
    this.events = [];
  }

  DisplayUpdate.prototype.signal = function(emitter, type) {
    if (hasHandler(emitter, type))
      this.events.push(arguments);
  };
  DisplayUpdate.prototype.finish = function() {
    for (var i = 0; i < this.events.length; i++)
      signal.apply(null, this.events[i]);
  };

  function maybeClipScrollbars(cm) {
    var display = cm.display;
    if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
      display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
      display.heightForcer.style.height = scrollGap(cm) + "px";
      display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
      display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
      display.scrollbarsClipped = true;
    }
  }

  // Does the actual updating of the line display. Bails out
  // (returning false) when there is nothing to be done and forced is
  // false.
  function updateDisplayIfNeeded(cm, update) {
    var display = cm.display, doc = cm.doc;

    if (update.editorIsHidden) {
      resetView(cm);
      return false;
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!update.force &&
        update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
        display.renderedView == display.view && countDirtyView(cm) == 0)
      return false;

    if (maybeUpdateLineNumberWidth(cm)) {
      resetView(cm);
      update.dims = getDimensions(cm);
    }

    // Compute a suitable new viewport (from & to)
    var end = doc.first + doc.size;
    var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
    if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
    if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
    if (sawCollapsedSpans) {
      from = visualLineNo(cm.doc, from);
      to = visualLineEndNo(cm.doc, to);
    }

    var different = from != display.viewFrom || to != display.viewTo ||
      display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
    adjustView(cm, from, to);

    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
    // Position the mover div to align with the current scroll position
    cm.display.mover.style.top = display.viewOffset + "px";

    var toUpdate = countDirtyView(cm);
    if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
      return false;

    // For big changes, we hide the enclosing element during the
    // update, since that speeds up the operations on most browsers.
    var focused = activeElt();
    if (toUpdate > 4) display.lineDiv.style.display = "none";
    patchDisplay(cm, display.updateLineNumbers, update.dims);
    if (toUpdate > 4) display.lineDiv.style.display = "";
    display.renderedView = display.view;
    // There might have been a widget with a focused element that got
    // hidden or updated, if so re-focus it.
    if (focused && activeElt() != focused && focused.offsetHeight) focused.focus();

    // Prevent selection and cursors from interfering with the scroll
    // width and height.
    removeChildren(display.cursorDiv);
    removeChildren(display.selectionDiv);
    display.gutters.style.height = display.sizer.style.minHeight = 0;

    if (different) {
      display.lastWrapHeight = update.wrapperHeight;
      display.lastWrapWidth = update.wrapperWidth;
      startWorker(cm, 400);
    }

    display.updateLineNumbers = null;

    return true;
  }

  function postUpdateDisplay(cm, update) {
    var viewport = update.viewport;
    for (var first = true;; first = false) {
      if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
        // Clip forced viewport to actual scrollable area.
        if (viewport && viewport.top != null)
          viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)};
        // Updated line heights might result in the drawn area not
        // actually covering the viewport. Keep looping until it does.
        update.visible = visibleLines(cm.display, cm.doc, viewport);
        if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
          break;
      }
      if (!updateDisplayIfNeeded(cm, update)) break;
      updateHeightsInViewport(cm);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      setDocumentHeight(cm, barMeasure);
      updateScrollbars(cm, barMeasure);
    }

    update.signal(cm, "update", cm);
    if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
      update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
      cm.display.reportedViewFrom = cm.display.viewFrom; cm.display.reportedViewTo = cm.display.viewTo;
    }
  }

  function updateDisplaySimple(cm, viewport) {
    var update = new DisplayUpdate(cm, viewport);
    if (updateDisplayIfNeeded(cm, update)) {
      updateHeightsInViewport(cm);
      postUpdateDisplay(cm, update);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      setDocumentHeight(cm, barMeasure);
      updateScrollbars(cm, barMeasure);
      update.finish();
    }
  }

  function setDocumentHeight(cm, measure) {
    cm.display.sizer.style.minHeight = measure.docHeight + "px";
    var total = measure.docHeight + cm.display.barHeight;
    cm.display.heightForcer.style.top = total + "px";
    cm.display.gutters.style.height = Math.max(total + scrollGap(cm), measure.clientHeight) + "px";
  }

  // Read the actual heights of the rendered lines, and update their
  // stored heights to match.
  function updateHeightsInViewport(cm) {
    var display = cm.display;
    var prevBottom = display.lineDiv.offsetTop;
    for (var i = 0; i < display.view.length; i++) {
      var cur = display.view[i], height;
      if (cur.hidden) continue;
      if (ie && ie_version < 8) {
        var bot = cur.node.offsetTop + cur.node.offsetHeight;
        height = bot - prevBottom;
        prevBottom = bot;
      } else {
        var box = cur.node.getBoundingClientRect();
        height = box.bottom - box.top;
      }
      var diff = cur.line.height - height;
      if (height < 2) height = textHeight(display);
      if (diff > .001 || diff < -.001) {
        updateLineHeight(cur.line, height);
        updateWidgetHeight(cur.line);
        if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
          updateWidgetHeight(cur.rest[j]);
      }
    }
  }

  // Read and store the height of line widgets associated with the
  // given line.
  function updateWidgetHeight(line) {
    if (line.widgets) for (var i = 0; i < line.widgets.length; ++i)
      line.widgets[i].height = line.widgets[i].node.parentNode.offsetHeight;
  }

  // Do a bulk-read of the DOM positions and sizes needed to draw the
  // view, so that we don't interleave reading and writing to the DOM.
  function getDimensions(cm) {
    var d = cm.display, left = {}, width = {};
    var gutterLeft = d.gutters.clientLeft;
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
      left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
      width[cm.options.gutters[i]] = n.clientWidth;
    }
    return {fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth};
  }

  // Sync the actual display DOM structure with display.view, removing
  // nodes for lines that are no longer in view, and creating the ones
  // that are not there yet, and updating the ones that are out of
  // date.
  function patchDisplay(cm, updateNumbersFrom, dims) {
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      // Works around a throw-scroll bug in OS X Webkit
      if (webkit && mac && cm.display.currentWheelTarget == node)
        node.style.display = "none";
      else
        node.parentNode.removeChild(node);
      return next;
    }

    var view = display.view, lineN = display.viewFrom;
    // Loop over the elements in the view, syncing cur (the DOM nodes
    // in display.lineDiv) with the view as we go.
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (lineView.hidden) {
      } else if (!lineView.node || lineView.node.parentNode != container) { // Not drawn yet
        var node = buildLineElement(cm, lineView, lineN, dims);
        container.insertBefore(node, cur);
      } else { // Already drawn
        while (cur != lineView.node) cur = rm(cur);
        var updateNumber = lineNumbers && updateNumbersFrom != null &&
          updateNumbersFrom <= lineN && lineView.lineNumber;
        if (lineView.changes) {
          if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
          updateLineForChanges(cm, lineView, lineN, dims);
        }
        if (updateNumber) {
          removeChildren(lineView.lineNumber);
          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
        }
        cur = lineView.node.nextSibling;
      }
      lineN += lineView.size;
    }
    while (cur) cur = rm(cur);
  }

  // When an aspect of a line changes, a string is added to
  // lineView.changes. This updates the relevant part of the line's
  // DOM structure.
  function updateLineForChanges(cm, lineView, lineN, dims) {
    for (var j = 0; j < lineView.changes.length; j++) {
      var type = lineView.changes[j];
      if (type == "text") updateLineText(cm, lineView);
      else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
      else if (type == "class") updateLineClasses(lineView);
      else if (type == "widget") updateLineWidgets(cm, lineView, dims);
    }
    lineView.changes = null;
  }

  // Lines with gutter elements, widgets or a background class need to
  // be wrapped, and have the extra elements added to the wrapper div
  function ensureLineWrapped(lineView) {
    if (lineView.node == lineView.text) {
      lineView.node = elt("div", null, null, "position: relative");
      if (lineView.text.parentNode)
        lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
      lineView.node.appendChild(lineView.text);
      if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
    }
    return lineView.node;
  }

  function updateLineBackground(lineView) {
    var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
    if (cls) cls += " CodeMirror-linebackground";
    if (lineView.background) {
      if (cls) lineView.background.className = cls;
      else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
    } else if (cls) {
      var wrap = ensureLineWrapped(lineView);
      lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
    }
  }

  // Wrapper around buildLineContent which will reuse the structure
  // in display.externalMeasured when possible.
  function getLineContent(cm, lineView) {
    var ext = cm.display.externalMeasured;
    if (ext && ext.line == lineView.line) {
      cm.display.externalMeasured = null;
      lineView.measure = ext.measure;
      return ext.built;
    }
    return buildLineContent(cm, lineView);
  }

  // Redraw the line's text. Interacts with the background and text
  // classes because the mode may output tokens that influence these
  // classes.
  function updateLineText(cm, lineView) {
    var cls = lineView.text.className;
    var built = getLineContent(cm, lineView);
    if (lineView.text == lineView.node) lineView.node = built.pre;
    lineView.text.parentNode.replaceChild(built.pre, lineView.text);
    lineView.text = built.pre;
    if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
      lineView.bgClass = built.bgClass;
      lineView.textClass = built.textClass;
      updateLineClasses(lineView);
    } else if (cls) {
      lineView.text.className = cls;
    }
  }

  function updateLineClasses(lineView) {
    updateLineBackground(lineView);
    if (lineView.line.wrapClass)
      ensureLineWrapped(lineView).className = lineView.line.wrapClass;
    else if (lineView.node != lineView.text)
      lineView.node.className = "";
    var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
    lineView.text.className = textClass || "";
  }

  function updateLineGutter(cm, lineView, lineN, dims) {
    if (lineView.gutter) {
      lineView.node.removeChild(lineView.gutter);
      lineView.gutter = null;
    }
    if (lineView.gutterBackground) {
      lineView.node.removeChild(lineView.gutterBackground);
      lineView.gutterBackground = null;
    }
    if (lineView.line.gutterClass) {
      var wrap = ensureLineWrapped(lineView);
      lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass,
                                      "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) +
                                      "px; width: " + dims.gutterTotalWidth + "px");
      wrap.insertBefore(lineView.gutterBackground, lineView.text);
    }
    var markers = lineView.line.gutterMarkers;
    if (cm.options.lineNumbers || markers) {
      var wrap = ensureLineWrapped(lineView);
      var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " +
                                             (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
      cm.display.input.setUneditable(gutterWrap);
      wrap.insertBefore(gutterWrap, lineView.text);
      if (lineView.line.gutterClass)
        gutterWrap.className += " " + lineView.line.gutterClass;
      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
        lineView.lineNumber = gutterWrap.appendChild(
          elt("div", lineNumberFor(cm.options, lineN),
              "CodeMirror-linenumber CodeMirror-gutter-elt",
              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
              + cm.display.lineNumInnerWidth + "px"));
      if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
        var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
        if (found)
          gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                     dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
      }
    }
  }

  function updateLineWidgets(cm, lineView, dims) {
    if (lineView.alignable) lineView.alignable = null;
    for (var node = lineView.node.firstChild, next; node; node = next) {
      var next = node.nextSibling;
      if (node.className == "CodeMirror-linewidget")
        lineView.node.removeChild(node);
    }
    insertLineWidgets(cm, lineView, dims);
  }

  // Build a line's DOM representation from scratch
  function buildLineElement(cm, lineView, lineN, dims) {
    var built = getLineContent(cm, lineView);
    lineView.text = lineView.node = built.pre;
    if (built.bgClass) lineView.bgClass = built.bgClass;
    if (built.textClass) lineView.textClass = built.textClass;

    updateLineClasses(lineView);
    updateLineGutter(cm, lineView, lineN, dims);
    insertLineWidgets(cm, lineView, dims);
    return lineView.node;
  }

  // A lineView may contain multiple logical lines (when merged by
  // collapsed spans). The widgets for all of them need to be drawn.
  function insertLineWidgets(cm, lineView, dims) {
    insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
    if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
      insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
  }

  function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
    if (!line.widgets) return;
    var wrap = ensureLineWrapped(lineView);
    for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
      if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
      positionLineWidget(widget, node, lineView, dims);
      cm.display.input.setUneditable(node);
      if (allowAbove && widget.above)
        wrap.insertBefore(node, lineView.gutter || lineView.text);
      else
        wrap.appendChild(node);
      signalLater(widget, "redraw");
    }
  }

  function positionLineWidget(widget, node, lineView, dims) {
    if (widget.noHScroll) {
      (lineView.alignable || (lineView.alignable = [])).push(node);
      var width = dims.wrapperWidth;
      node.style.left = dims.fixedPos + "px";
      if (!widget.coverGutter) {
        width -= dims.gutterTotalWidth;
        node.style.paddingLeft = dims.gutterTotalWidth + "px";
      }
      node.style.width = width + "px";
    }
    if (widget.coverGutter) {
      node.style.zIndex = 5;
      node.style.position = "relative";
      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
    }
  }

  // POSITION OBJECT

  // A Pos instance represents a position within the text.
  var Pos = CodeMirror.Pos = function(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line; this.ch = ch;
  };

  // Compare two positions, return 0 if they are the same, a negative
  // number when a is less, and a positive number otherwise.
  var cmp = CodeMirror.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch; };

  function copyPos(x) {return Pos(x.line, x.ch);}
  function maxPos(a, b) { return cmp(a, b) < 0 ? b : a; }
  function minPos(a, b) { return cmp(a, b) < 0 ? a : b; }

  // INPUT HANDLING

  function ensureFocus(cm) {
    if (!cm.state.focused) { cm.display.input.focus(); onFocus(cm); }
  }

  // This will be set to an array of strings when copying, so that,
  // when pasting, we know what kind of selections the copied text
  // was made out of.
  var lastCopied = null;

  function applyTextInput(cm, inserted, deleted, sel, origin) {
    var doc = cm.doc;
    cm.display.shift = false;
    if (!sel) sel = doc.sel;

    var paste = cm.state.pasteIncoming || origin == "paste";
    var textLines = doc.splitLines(inserted), multiPaste = null;
    // When pasing N lines into N selections, insert one line per selection
    if (paste && sel.ranges.length > 1) {
      if (lastCopied && lastCopied.join("\n") == inserted) {
        if (sel.ranges.length % lastCopied.length == 0) {
          multiPaste = [];
          for (var i = 0; i < lastCopied.length; i++)
            multiPaste.push(doc.splitLines(lastCopied[i]));
        }
      } else if (textLines.length == sel.ranges.length) {
        multiPaste = map(textLines, function(l) { return [l]; });
      }
    }

    // Normal behavior is to insert the new text into every selection
    for (var i = sel.ranges.length - 1; i >= 0; i--) {
      var range = sel.ranges[i];
      var from = range.from(), to = range.to();
      if (range.empty()) {
        if (deleted && deleted > 0) // Handle deletion
          from = Pos(from.line, from.ch - deleted);
        else if (cm.state.overwrite && !paste) // Handle overwrite
          to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
      }
      var updateInput = cm.curOp.updateInput;
      var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
                         origin: origin || (paste ? "paste" : cm.state.cutIncoming ? "cut" : "+input")};
      makeChange(cm.doc, changeEvent);
      signalLater(cm, "inputRead", cm, changeEvent);
    }
    if (inserted && !paste)
      triggerElectric(cm, inserted);

    ensureCursorVisible(cm);
    cm.curOp.updateInput = updateInput;
    cm.curOp.typing = true;
    cm.state.pasteIncoming = cm.state.cutIncoming = false;
  }

  function handlePaste(e, cm) {
    var pasted = e.clipboardData && e.clipboardData.getData("text/plain");
    if (pasted) {
      e.preventDefault();
      if (!cm.isReadOnly() && !cm.options.disableInput)
        runInOp(cm, function() { applyTextInput(cm, pasted, 0, null, "paste"); });
      return true;
    }
  }

  function triggerElectric(cm, inserted) {
    // When an 'electric' character is inserted, immediately trigger a reindent
    if (!cm.options.electricChars || !cm.options.smartIndent) return;
    var sel = cm.doc.sel;

    for (var i = sel.ranges.length - 1; i >= 0; i--) {
      var range = sel.ranges[i];
      if (range.head.ch > 100 || (i && sel.ranges[i - 1].head.line == range.head.line)) continue;
      var mode = cm.getModeAt(range.head);
      var indented = false;
      if (mode.electricChars) {
        for (var j = 0; j < mode.electricChars.length; j++)
          if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
            indented = indentLine(cm, range.head.line, "smart");
            break;
          }
      } else if (mode.electricInput) {
        if (mode.electricInput.test(getLine(cm.doc, range.head.line).text.slice(0, range.head.ch)))
          indented = indentLine(cm, range.head.line, "smart");
      }
      if (indented) signalLater(cm, "electricInput", cm, range.head.line);
    }
  }

  function copyableRanges(cm) {
    var text = [], ranges = [];
    for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
      var line = cm.doc.sel.ranges[i].head.line;
      var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
      ranges.push(lineRange);
      text.push(cm.getRange(lineRange.anchor, lineRange.head));
    }
    return {text: text, ranges: ranges};
  }

  function disableBrowserMagic(field) {
    field.setAttribute("autocorrect", "off");
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("spellcheck", "false");
  }

  // TEXTAREA INPUT STYLE

  function TextareaInput(cm) {
    this.cm = cm;
    // See input.poll and input.reset
    this.prevInput = "";

    // Flag that indicates whether we expect input to appear real soon
    // now (after some event like 'keypress' or 'input') and are
    // polling intensively.
    this.pollingFast = false;
    // Self-resetting timeout for the poller
    this.polling = new Delayed();
    // Tracks when input.reset has punted to just putting a short
    // string into the textarea instead of the full selection.
    this.inaccurateSelection = false;
    // Used to work around IE issue with selection being forgotten when focus moves away from textarea
    this.hasSelection = false;
    this.composing = null;
  };

  function hiddenTextarea() {
    var te = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
    var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    // The textarea is kept positioned near the cursor to prevent the
    // fact that it'll be scrolled into view on input from scrolling
    // our fake cursor out of view. On webkit, when wrap=off, paste is
    // very slow. So make the area wide instead.
    if (webkit) te.style.width = "1000px";
    else te.setAttribute("wrap", "off");
    // If border: 0; -- iOS fails to open keyboard (issue #1287)
    if (ios) te.style.border = "1px solid black";
    disableBrowserMagic(te);
    return div;
  }

  TextareaInput.prototype = copyObj({
    init: function(display) {
      var input = this, cm = this.cm;

      // Wraps and hides input textarea
      var div = this.wrapper = hiddenTextarea();
      // The semihidden textarea that is focused when the editor is
      // focused, and receives input.
      var te = this.textarea = div.firstChild;
      display.wrapper.insertBefore(div, display.wrapper.firstChild);

      // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
      if (ios) te.style.width = "0px";

      on(te, "input", function() {
        if (ie && ie_version >= 9 && input.hasSelection) input.hasSelection = null;
        input.poll();
      });

      on(te, "paste", function(e) {
        if (signalDOMEvent(cm, e) || handlePaste(e, cm)) return

        cm.state.pasteIncoming = true;
        input.fastPoll();
      });

      function prepareCopyCut(e) {
        if (cm.somethingSelected()) {
          lastCopied = cm.getSelections();
          if (input.inaccurateSelection) {
            input.prevInput = "";
            input.inaccurateSelection = false;
            te.value = lastCopied.join("\n");
            selectInput(te);
          }
        } else if (!cm.options.lineWiseCopyCut) {
          return;
        } else {
          var ranges = copyableRanges(cm);
          lastCopied = ranges.text;
          if (e.type == "cut") {
            cm.setSelections(ranges.ranges, null, sel_dontScroll);
          } else {
            input.prevInput = "";
            te.value = ranges.text.join("\n");
            selectInput(te);
          }
        }
        if (e.type == "cut") cm.state.cutIncoming = true;
      }
      on(te, "cut", prepareCopyCut);
      on(te, "copy", prepareCopyCut);

      on(display.scroller, "paste", function(e) {
        if (eventInWidget(display, e) || signalDOMEvent(cm, e)) return;
        cm.state.pasteIncoming = true;
        input.focus();
      });

      // Prevent normal selection in the editor (we handle our own)
      on(display.lineSpace, "selectstart", function(e) {
        if (!eventInWidget(display, e)) e_preventDefault(e);
      });

      on(te, "compositionstart", function() {
        var start = cm.getCursor("from");
        if (input.composing) input.composing.range.clear()
        input.composing = {
          start: start,
          range: cm.markText(start, cm.getCursor("to"), {className: "CodeMirror-composing"})
        };
      });
      on(te, "compositionend", function() {
        if (input.composing) {
          input.poll();
          input.composing.range.clear();
          input.composing = null;
        }
      });
    },

    prepareSelection: function() {
      // Redraw the selection and/or cursor
      var cm = this.cm, display = cm.display, doc = cm.doc;
      var result = prepareSelection(cm);

      // Move the hidden textarea near the cursor to prevent scrolling artifacts
      if (cm.options.moveInputWithCursor) {
        var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
        var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
        result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                            headPos.top + lineOff.top - wrapOff.top));
        result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                             headPos.left + lineOff.left - wrapOff.left));
      }

      return result;
    },

    showSelection: function(drawn) {
      var cm = this.cm, display = cm.display;
      removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
      removeChildrenAndAdd(display.selectionDiv, drawn.selection);
      if (drawn.teTop != null) {
        this.wrapper.style.top = drawn.teTop + "px";
        this.wrapper.style.left = drawn.teLeft + "px";
      }
    },

    // Reset the input to correspond to the selection (or to be empty,
    // when not typing and nothing is selected)
    reset: function(typing) {
      if (this.contextMenuPending) return;
      var minimal, selected, cm = this.cm, doc = cm.doc;
      if (cm.somethingSelected()) {
        this.prevInput = "";
        var range = doc.sel.primary();
        minimal = hasCopyEvent &&
          (range.to().line - range.from().line > 100 || (selected = cm.getSelection()).length > 1000);
        var content = minimal ? "-" : selected || cm.getSelection();
        this.textarea.value = content;
        if (cm.state.focused) selectInput(this.textarea);
        if (ie && ie_version >= 9) this.hasSelection = content;
      } else if (!typing) {
        this.prevInput = this.textarea.value = "";
        if (ie && ie_version >= 9) this.hasSelection = null;
      }
      this.inaccurateSelection = minimal;
    },

    getField: function() { return this.textarea; },

    supportsTouch: function() { return false; },

    focus: function() {
      if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
        try { this.textarea.focus(); }
        catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
      }
    },

    blur: function() { this.textarea.blur(); },

    resetPosition: function() {
      this.wrapper.style.top = this.wrapper.style.left = 0;
    },

    receivedFocus: function() { this.slowPoll(); },

    // Poll for input changes, using the normal rate of polling. This
    // runs as long as the editor is focused.
    slowPoll: function() {
      var input = this;
      if (input.pollingFast) return;
      input.polling.set(this.cm.options.pollInterval, function() {
        input.poll();
        if (input.cm.state.focused) input.slowPoll();
      });
    },

    // When an event has just come in that is likely to add or change
    // something in the input textarea, we poll faster, to ensure that
    // the change appears on the screen quickly.
    fastPoll: function() {
      var missed = false, input = this;
      input.pollingFast = true;
      function p() {
        var changed = input.poll();
        if (!changed && !missed) {missed = true; input.polling.set(60, p);}
        else {input.pollingFast = false; input.slowPoll();}
      }
      input.polling.set(20, p);
    },

    // Read input from the textarea, and update the document to match.
    // When something is selected, it is present in the textarea, and
    // selected (unless it is huge, in which case a placeholder is
    // used). When nothing is selected, the cursor sits after previously
    // seen text (can be empty), which is stored in prevInput (we must
    // not reset the textarea when typing, because that breaks IME).
    poll: function() {
      var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
      // Since this is called a *lot*, try to bail out as cheaply as
      // possible when it is clear that nothing happened. hasSelection
      // will be the case when there is a lot of text in the textarea,
      // in which case reading its value would be expensive.
      if (this.contextMenuPending || !cm.state.focused ||
          (hasSelection(input) && !prevInput && !this.composing) ||
          cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
        return false;

      var text = input.value;
      // If nothing changed, bail.
      if (text == prevInput && !cm.somethingSelected()) return false;
      // Work around nonsensical selection resetting in IE9/10, and
      // inexplicable appearance of private area unicode characters on
      // some key combos in Mac (#2689).
      if (ie && ie_version >= 9 && this.hasSelection === text ||
          mac && /[\uf700-\uf7ff]/.test(text)) {
        cm.display.input.reset();
        return false;
      }

      if (cm.doc.sel == cm.display.selForContextMenu) {
        var first = text.charCodeAt(0);
        if (first == 0x200b && !prevInput) prevInput = "\u200b";
        if (first == 0x21da) { this.reset(); return this.cm.execCommand("undo"); }
      }
      // Find the part of the input that is actually new
      var same = 0, l = Math.min(prevInput.length, text.length);
      while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;

      var self = this;
      runInOp(cm, function() {
        applyTextInput(cm, text.slice(same), prevInput.length - same,
                       null, self.composing ? "*compose" : null);

        // Don't leave long text in the textarea, since it makes further polling slow
        if (text.length > 1000 || text.indexOf("\n") > -1) input.value = self.prevInput = "";
        else self.prevInput = text;

        if (self.composing) {
          self.composing.range.clear();
          self.composing.range = cm.markText(self.composing.start, cm.getCursor("to"),
                                             {className: "CodeMirror-composing"});
        }
      });
      return true;
    },

    ensurePolled: function() {
      if (this.pollingFast && this.poll()) this.pollingFast = false;
    },

    onKeyPress: function() {
      if (ie && ie_version >= 9) this.hasSelection = null;
      this.fastPoll();
    },

    onContextMenu: function(e) {
      var input = this, cm = input.cm, display = cm.display, te = input.textarea;
      var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
      if (!pos || presto) return; // Opera is difficult.

      // Reset the current text selection only if the click is done outside of the selection
      // and 'resetSelectionOnContextMenu' option is true.
      var reset = cm.options.resetSelectionOnContextMenu;
      if (reset && cm.doc.sel.contains(pos) == -1)
        operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);

      var oldCSS = te.style.cssText;
      input.wrapper.style.position = "absolute";
      te.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
        "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " +
        (ie ? "rgba(255, 255, 255, .05)" : "transparent") +
        "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
      if (webkit) var oldScrollY = window.scrollY; // Work around Chrome issue (#2712)
      display.input.focus();
      if (webkit) window.scrollTo(null, oldScrollY);
      display.input.reset();
      // Adds "Select all" to context menu in FF
      if (!cm.somethingSelected()) te.value = input.prevInput = " ";
      input.contextMenuPending = true;
      display.selForContextMenu = cm.doc.sel;
      clearTimeout(display.detectingSelectAll);

      // Select-all will be greyed out if there's nothing to select, so
      // this adds a zero-width space so that we can later check whether
      // it got selected.
      function prepareSelectAllHack() {
        if (te.selectionStart != null) {
          var selected = cm.somethingSelected();
          var extval = "\u200b" + (selected ? te.value : "");
          te.value = "\u21da"; // Used to catch context-menu undo
          te.value = extval;
          input.prevInput = selected ? "" : "\u200b";
          te.selectionStart = 1; te.selectionEnd = extval.length;
          // Re-set this, in case some other handler touched the
          // selection in the meantime.
          display.selForContextMenu = cm.doc.sel;
        }
      }
      function rehide() {
        input.contextMenuPending = false;
        input.wrapper.style.position = "relative";
        te.style.cssText = oldCSS;
        if (ie && ie_version < 9) display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);

        // Try to detect the user choosing select-all
        if (te.selectionStart != null) {
          if (!ie || (ie && ie_version < 9)) prepareSelectAllHack();
          var i = 0, poll = function() {
            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 &&
                te.selectionEnd > 0 && input.prevInput == "\u200b")
              operation(cm, commands.selectAll)(cm);
            else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
            else display.input.reset();
          };
          display.detectingSelectAll = setTimeout(poll, 200);
        }
      }

      if (ie && ie_version >= 9) prepareSelectAllHack();
      if (captureRightClick) {
        e_stop(e);
        var mouseup = function() {
          off(window, "mouseup", mouseup);
          setTimeout(rehide, 20);
        };
        on(window, "mouseup", mouseup);
      } else {
        setTimeout(rehide, 50);
      }
    },

    readOnlyChanged: function(val) {
      if (!val) this.reset();
    },

    setUneditable: nothing,

    needsContentAttribute: false
  }, TextareaInput.prototype);

  // CONTENTEDITABLE INPUT STYLE

  function ContentEditableInput(cm) {
    this.cm = cm;
    this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
    this.polling = new Delayed();
    this.gracePeriod = false;
  }

  ContentEditableInput.prototype = copyObj({
    init: function(display) {
      var input = this, cm = input.cm;
      var div = input.div = display.lineDiv;
      disableBrowserMagic(div);

      on(div, "paste", function(e) {
        if (!signalDOMEvent(cm, e)) handlePaste(e, cm);
      })

      on(div, "compositionstart", function(e) {
        var data = e.data;
        input.composing = {sel: cm.doc.sel, data: data, startData: data};
        if (!data) return;
        var prim = cm.doc.sel.primary();
        var line = cm.getLine(prim.head.line);
        var found = line.indexOf(data, Math.max(0, prim.head.ch - data.length));
        if (found > -1 && found <= prim.head.ch)
          input.composing.sel = simpleSelection(Pos(prim.head.line, found),
                                                Pos(prim.head.line, found + data.length));
      });
      on(div, "compositionupdate", function(e) {
        input.composing.data = e.data;
      });
      on(div, "compositionend", function(e) {
        var ours = input.composing;
        if (!ours) return;
        if (e.data != ours.startData && !/\u200b/.test(e.data))
          ours.data = e.data;
        // Need a small delay to prevent other code (input event,
        // selection polling) from doing damage when fired right after
        // compositionend.
        setTimeout(function() {
          if (!ours.handled)
            input.applyComposition(ours);
          if (input.composing == ours)
            input.composing = null;
        }, 50);
      });

      on(div, "touchstart", function() {
        input.forceCompositionEnd();
      });

      on(div, "input", function() {
        if (input.composing) return;
        if (cm.isReadOnly() || !input.pollContent())
          runInOp(input.cm, function() {regChange(cm);});
      });

      function onCopyCut(e) {
        if (cm.somethingSelected()) {
          lastCopied = cm.getSelections();
          if (e.type == "cut") cm.replaceSelection("", null, "cut");
        } else if (!cm.options.lineWiseCopyCut) {
          return;
        } else {
          var ranges = copyableRanges(cm);
          lastCopied = ranges.text;
          if (e.type == "cut") {
            cm.operation(function() {
              cm.setSelections(ranges.ranges, 0, sel_dontScroll);
              cm.replaceSelection("", null, "cut");
            });
          }
        }
        // iOS exposes the clipboard API, but seems to discard content inserted into it
        if (e.clipboardData && !ios) {
          e.preventDefault();
          e.clipboardData.clearData();
          e.clipboardData.setData("text/plain", lastCopied.join("\n"));
        } else {
          // Old-fashioned briefly-focus-a-textarea hack
          var kludge = hiddenTextarea(), te = kludge.firstChild;
          cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
          te.value = lastCopied.join("\n");
          var hadFocus = document.activeElement;
          selectInput(te);
          setTimeout(function() {
            cm.display.lineSpace.removeChild(kludge);
            hadFocus.focus();
          }, 50);
        }
      }
      on(div, "copy", onCopyCut);
      on(div, "cut", onCopyCut);
    },

    prepareSelection: function() {
      var result = prepareSelection(this.cm, false);
      result.focus = this.cm.state.focused;
      return result;
    },

    showSelection: function(info) {
      if (!info || !this.cm.display.view.length) return;
      if (info.focus) this.showPrimarySelection();
      this.showMultipleSelections(info);
    },

    showPrimarySelection: function() {
      var sel = window.getSelection(), prim = this.cm.doc.sel.primary();
      var curAnchor = domToPos(this.cm, sel.anchorNode, sel.anchorOffset);
      var curFocus = domToPos(this.cm, sel.focusNode, sel.focusOffset);
      if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad &&
          cmp(minPos(curAnchor, curFocus), prim.from()) == 0 &&
          cmp(maxPos(curAnchor, curFocus), prim.to()) == 0)
        return;

      var start = posToDOM(this.cm, prim.from());
      var end = posToDOM(this.cm, prim.to());
      if (!start && !end) return;

      var view = this.cm.display.view;
      var old = sel.rangeCount && sel.getRangeAt(0);
      if (!start) {
        start = {node: view[0].measure.map[2], offset: 0};
      } else if (!end) { // FIXME dangerously hacky
        var measure = view[view.length - 1].measure;
        var map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
        end = {node: map[map.length - 1], offset: map[map.length - 2] - map[map.length - 3]};
      }

      try { var rng = range(start.node, start.offset, end.offset, end.node); }
      catch(e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
      if (rng) {
        if (!gecko && this.cm.state.focused) {
          sel.collapse(start.node, start.offset);
          if (!rng.collapsed) sel.addRange(rng);
        } else {
          sel.removeAllRanges();
          sel.addRange(rng);
        }
        if (old && sel.anchorNode == null) sel.addRange(old);
        else if (gecko) this.startGracePeriod();
      }
      this.rememberSelection();
    },

    startGracePeriod: function() {
      var input = this;
      clearTimeout(this.gracePeriod);
      this.gracePeriod = setTimeout(function() {
        input.gracePeriod = false;
        if (input.selectionChanged())
          input.cm.operation(function() { input.cm.curOp.selectionChanged = true; });
      }, 20);
    },

    showMultipleSelections: function(info) {
      removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
      removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
    },

    rememberSelection: function() {
      var sel = window.getSelection();
      this.lastAnchorNode = sel.anchorNode; this.lastAnchorOffset = sel.anchorOffset;
      this.lastFocusNode = sel.focusNode; this.lastFocusOffset = sel.focusOffset;
    },

    selectionInEditor: function() {
      var sel = window.getSelection();
      if (!sel.rangeCount) return false;
      var node = sel.getRangeAt(0).commonAncestorContainer;
      return contains(this.div, node);
    },

    focus: function() {
      if (this.cm.options.readOnly != "nocursor") this.div.focus();
    },
    blur: function() { this.div.blur(); },
    getField: function() { return this.div; },

    supportsTouch: function() { return true; },

    receivedFocus: function() {
      var input = this;
      if (this.selectionInEditor())
        this.pollSelection();
      else
        runInOp(this.cm, function() { input.cm.curOp.selectionChanged = true; });

      function poll() {
        if (input.cm.state.focused) {
          input.pollSelection();
          input.polling.set(input.cm.options.pollInterval, poll);
        }
      }
      this.polling.set(this.cm.options.pollInterval, poll);
    },

    selectionChanged: function() {
      var sel = window.getSelection();
      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset ||
        sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
    },

    pollSelection: function() {
      if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
        var sel = window.getSelection(), cm = this.cm;
        this.rememberSelection();
        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (anchor && head) runInOp(cm, function() {
          setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
          if (anchor.bad || head.bad) cm.curOp.selectionChanged = true;
        });
      }
    },

    pollContent: function() {
      var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
      var from = sel.from(), to = sel.to();
      if (from.line < display.viewFrom || to.line > display.viewTo - 1) return false;

      var fromIndex;
      if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
        var fromLine = lineNo(display.view[0].line);
        var fromNode = display.view[0].node;
      } else {
        var fromLine = lineNo(display.view[fromIndex].line);
        var fromNode = display.view[fromIndex - 1].node.nextSibling;
      }
      var toIndex = findViewIndex(cm, to.line);
      if (toIndex == display.view.length - 1) {
        var toLine = display.viewTo - 1;
        var toNode = display.lineDiv.lastChild;
      } else {
        var toLine = lineNo(display.view[toIndex + 1].line) - 1;
        var toNode = display.view[toIndex + 1].node.previousSibling;
      }

      var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
      var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
      while (newText.length > 1 && oldText.length > 1) {
        if (lst(newText) == lst(oldText)) { newText.pop(); oldText.pop(); toLine--; }
        else if (newText[0] == oldText[0]) { newText.shift(); oldText.shift(); fromLine++; }
        else break;
      }

      var cutFront = 0, cutEnd = 0;
      var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
      while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
        ++cutFront;
      var newBot = lst(newText), oldBot = lst(oldText);
      var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0),
                               oldBot.length - (oldText.length == 1 ? cutFront : 0));
      while (cutEnd < maxCutEnd &&
             newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
        ++cutEnd;

      newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd);
      newText[0] = newText[0].slice(cutFront);

      var chFrom = Pos(fromLine, cutFront);
      var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
      if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
        replaceRange(cm.doc, newText, chFrom, chTo, "+input");
        return true;
      }
    },

    ensurePolled: function() {
      this.forceCompositionEnd();
    },
    reset: function() {
      this.forceCompositionEnd();
    },
    forceCompositionEnd: function() {
      if (!this.composing || this.composing.handled) return;
      this.applyComposition(this.composing);
      this.composing.handled = true;
      this.div.blur();
      this.div.focus();
    },
    applyComposition: function(composing) {
      if (this.cm.isReadOnly())
        operation(this.cm, regChange)(this.cm)
      else if (composing.data && composing.data != composing.startData)
        operation(this.cm, applyTextInput)(this.cm, composing.data, 0, composing.sel);
    },

    setUneditable: function(node) {
      node.contentEditable = "false"
    },

    onKeyPress: function(e) {
      e.preventDefault();
      if (!this.cm.isReadOnly())
        operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
    },

    readOnlyChanged: function(val) {
      this.div.contentEditable = String(val != "nocursor")
    },

    onContextMenu: nothing,
    resetPosition: nothing,

    needsContentAttribute: true
  }, ContentEditableInput.prototype);

  function posToDOM(cm, pos) {
    var view = findViewForLine(cm, pos.line);
    if (!view || view.hidden) return null;
    var line = getLine(cm.doc, pos.line);
    var info = mapFromLineView(view, line, pos.line);

    var order = getOrder(line), side = "left";
    if (order) {
      var partPos = getBidiPartAt(order, pos.ch);
      side = partPos % 2 ? "right" : "left";
    }
    var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
    result.offset = result.collapse == "right" ? result.end : result.start;
    return result;
  }

  function badPos(pos, bad) { if (bad) pos.bad = true; return pos; }

  function domToPos(cm, node, offset) {
    var lineNode;
    if (node == cm.display.lineDiv) {
      lineNode = cm.display.lineDiv.childNodes[offset];
      if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
      node = null; offset = 0;
    } else {
      for (lineNode = node;; lineNode = lineNode.parentNode) {
        if (!lineNode || lineNode == cm.display.lineDiv) return null;
        if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
      }
    }
    for (var i = 0; i < cm.display.view.length; i++) {
      var lineView = cm.display.view[i];
      if (lineView.node == lineNode)
        return locateNodeInLineView(lineView, node, offset);
    }
  }

  function locateNodeInLineView(lineView, node, offset) {
    var wrapper = lineView.text.firstChild, bad = false;
    if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);
    if (node == wrapper) {
      bad = true;
      node = wrapper.childNodes[offset];
      offset = 0;
      if (!node) {
        var line = lineView.rest ? lst(lineView.rest) : lineView.line;
        return badPos(Pos(lineNo(line), line.text.length), bad);
      }
    }

    var textNode = node.nodeType == 3 ? node : null, topNode = node;
    if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
      textNode = node.firstChild;
      if (offset) offset = textNode.nodeValue.length;
    }
    while (topNode.parentNode != wrapper) topNode = topNode.parentNode;
    var measure = lineView.measure, maps = measure.maps;

    function find(textNode, topNode, offset) {
      for (var i = -1; i < (maps ? maps.length : 0); i++) {
        var map = i < 0 ? measure.map : maps[i];
        for (var j = 0; j < map.length; j += 3) {
          var curNode = map[j + 2];
          if (curNode == textNode || curNode == topNode) {
            var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
            var ch = map[j] + offset;
            if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
            return Pos(line, ch);
          }
        }
      }
    }
    var found = find(textNode, topNode, offset);
    if (found) return badPos(found, bad);

    // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
    for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
      found = find(after, after.firstChild, 0);
      if (found)
        return badPos(Pos(found.line, found.ch - dist), bad);
      else
        dist += after.textContent.length;
    }
    for (var before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
      found = find(before, before.firstChild, -1);
      if (found)
        return badPos(Pos(found.line, found.ch + dist), bad);
      else
        dist += after.textContent.length;
    }
  }

  function domTextBetween(cm, from, to, fromLine, toLine) {
    var text = "", closing = false, lineSep = cm.doc.lineSeparator();
    function recognizeMarker(id) { return function(marker) { return marker.id == id; }; }
    function walk(node) {
      if (node.nodeType == 1) {
        var cmText = node.getAttribute("cm-text");
        if (cmText != null) {
          if (cmText == "") cmText = node.textContent.replace(/\u200b/g, "");
          text += cmText;
          return;
        }
        var markerID = node.getAttribute("cm-marker"), range;
        if (markerID) {
          var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
          if (found.length && (range = found[0].find()))
            text += getBetween(cm.doc, range.from, range.to).join(lineSep);
          return;
        }
        if (node.getAttribute("contenteditable") == "false") return;
        for (var i = 0; i < node.childNodes.length; i++)
          walk(node.childNodes[i]);
        if (/^(pre|div|p)$/i.test(node.nodeName))
          closing = true;
      } else if (node.nodeType == 3) {
        var val = node.nodeValue;
        if (!val) return;
        if (closing) {
          text += lineSep;
          closing = false;
        }
        text += val;
      }
    }
    for (;;) {
      walk(from);
      if (from == to) break;
      from = from.nextSibling;
    }
    return text;
  }

  CodeMirror.inputStyles = {"textarea": TextareaInput, "contenteditable": ContentEditableInput};

  // SELECTION / CURSOR

  // Selection objects are immutable. A new one is created every time
  // the selection changes. A selection is one or more non-overlapping
  // (and non-touching) ranges, sorted, and an integer that indicates
  // which one is the primary selection (the one that's scrolled into
  // view, that getCursor returns, etc).
  function Selection(ranges, primIndex) {
    this.ranges = ranges;
    this.primIndex = primIndex;
  }

  Selection.prototype = {
    primary: function() { return this.ranges[this.primIndex]; },
    equals: function(other) {
      if (other == this) return true;
      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
      for (var i = 0; i < this.ranges.length; i++) {
        var here = this.ranges[i], there = other.ranges[i];
        if (cmp(here.anchor, there.anchor) != 0 || cmp(here.head, there.head) != 0) return false;
      }
      return true;
    },
    deepCopy: function() {
      for (var out = [], i = 0; i < this.ranges.length; i++)
        out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
      return new Selection(out, this.primIndex);
    },
    somethingSelected: function() {
      for (var i = 0; i < this.ranges.length; i++)
        if (!this.ranges[i].empty()) return true;
      return false;
    },
    contains: function(pos, end) {
      if (!end) end = pos;
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this.ranges[i];
        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
          return i;
      }
      return -1;
    }
  };

  function Range(anchor, head) {
    this.anchor = anchor; this.head = head;
  }

  Range.prototype = {
    from: function() { return minPos(this.anchor, this.head); },
    to: function() { return maxPos(this.anchor, this.head); },
    empty: function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    }
  };

  // Take an unsorted, potentially overlapping set of ranges, and
  // build a selection out of it. 'Consumes' ranges array (modifying
  // it).
  function normalizeSelection(ranges, primIndex) {
    var prim = ranges[primIndex];
    ranges.sort(function(a, b) { return cmp(a.from(), b.from()); });
    primIndex = indexOf(ranges, prim);
    for (var i = 1; i < ranges.length; i++) {
      var cur = ranges[i], prev = ranges[i - 1];
      if (cmp(prev.to(), cur.from()) >= 0) {
        var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
        var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
        if (i <= primIndex) --primIndex;
        ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
      }
    }
    return new Selection(ranges, primIndex);
  }

  function simpleSelection(anchor, head) {
    return new Selection([new Range(anchor, head || anchor)], 0);
  }

  // Most of the external API clips given positions to make sure they
  // actually exist within the document.
  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }
  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }
  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
  function clipPosArray(doc, array) {
    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
    return out;
  }

  // SELECTION UPDATES

  // The 'scroll' parameter given to many of these indicated whether
  // the new cursor position should be scrolled into view after
  // modifying the selection.

  // If shift is held or the extend flag is set, extends a range to
  // include a given position (and optionally a second position).
  // Otherwise, simply returns the range between the given positions.
  // Used for cursor motion and such.
  function extendRange(doc, range, head, other) {
    if (doc.cm && doc.cm.display.shift || doc.extend) {
      var anchor = range.anchor;
      if (other) {
        var posBefore = cmp(head, anchor) < 0;
        if (posBefore != (cmp(other, anchor) < 0)) {
          anchor = head;
          head = other;
        } else if (posBefore != (cmp(head, other) < 0)) {
          head = other;
        }
      }
      return new Range(anchor, head);
    } else {
      return new Range(other || head, head);
    }
  }

  // Extend the primary selection range, discard the rest.
  function extendSelection(doc, head, other, options) {
    setSelection(doc, new Selection([extendRange(doc, doc.sel.primary(), head, other)], 0), options);
  }

  // Extend all selections (pos is an array of selections with length
  // equal the number of selections)
  function extendSelections(doc, heads, options) {
    for (var out = [], i = 0; i < doc.sel.ranges.length; i++)
      out[i] = extendRange(doc, doc.sel.ranges[i], heads[i], null);
    var newSel = normalizeSelection(out, doc.sel.primIndex);
    setSelection(doc, newSel, options);
  }

  // Updates a single range in the selection.
  function replaceOneSelection(doc, i, range, options) {
    var ranges = doc.sel.ranges.slice(0);
    ranges[i] = range;
    setSelection(doc, normalizeSelection(ranges, doc.sel.primIndex), options);
  }

  // Reset the selection to a single range.
  function setSimpleSelection(doc, anchor, head, options) {
    setSelection(doc, simpleSelection(anchor, head), options);
  }

  // Give beforeSelectionChange handlers a change to influence a
  // selection update.
  function filterSelectionChange(doc, sel, options) {
    var obj = {
      ranges: sel.ranges,
      update: function(ranges) {
        this.ranges = [];
        for (var i = 0; i < ranges.length; i++)
          this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
                                     clipPos(doc, ranges[i].head));
      },
      origin: options && options.origin
    };
    signal(doc, "beforeSelectionChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
    if (obj.ranges != sel.ranges) return normalizeSelection(obj.ranges, obj.ranges.length - 1);
    else return sel;
  }

  function setSelectionReplaceHistory(doc, sel, options) {
    var done = doc.history.done, last = lst(done);
    if (last && last.ranges) {
      done[done.length - 1] = sel;
      setSelectionNoUndo(doc, sel, options);
    } else {
      setSelection(doc, sel, options);
    }
  }

  // Set a new selection.
  function setSelection(doc, sel, options) {
    setSelectionNoUndo(doc, sel, options);
    addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
  }

  function setSelectionNoUndo(doc, sel, options) {
    if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
      sel = filterSelectionChange(doc, sel, options);

    var bias = options && options.bias ||
      (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
    setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));

    if (!(options && options.scroll === false) && doc.cm)
      ensureCursorVisible(doc.cm);
  }

  function setSelectionInner(doc, sel) {
    if (sel.equals(doc.sel)) return;

    doc.sel = sel;

    if (doc.cm) {
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;
      signalCursorActivity(doc.cm);
    }
    signalLater(doc, "cursorActivity", doc);
  }

  // Verify that the selection does not partially select any atomic
  // marked ranges.
  function reCheckSelection(doc) {
    setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false), sel_dontScroll);
  }

  // Return a selection that does not partially select any atomic
  // ranges.
  function skipAtomicInSelection(doc, sel, bias, mayClear) {
    var out;
    for (var i = 0; i < sel.ranges.length; i++) {
      var range = sel.ranges[i];
      var old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
      var newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
      var newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
      if (out || newAnchor != range.anchor || newHead != range.head) {
        if (!out) out = sel.ranges.slice(0, i);
        out[i] = new Range(newAnchor, newHead);
      }
    }
    return out ? normalizeSelection(out, sel.primIndex) : sel;
  }

  function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
    var line = getLine(doc, pos.line);
    if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
      var sp = line.markedSpans[i], m = sp.marker;
      if ((sp.from == null || (m.inclusiveLeft ? sp.from <= pos.ch : sp.from < pos.ch)) &&
          (sp.to == null || (m.inclusiveRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
        if (mayClear) {
          signal(m, "beforeCursorEnter");
          if (m.explicitlyCleared) {
            if (!line.markedSpans) break;
            else {--i; continue;}
          }
        }
        if (!m.atomic) continue;

        if (oldPos) {
          var near = m.find(dir < 0 ? 1 : -1), diff;
          if (dir < 0 ? m.inclusiveRight : m.inclusiveLeft) near = movePos(doc, near, -dir, line);
          if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0))
            return skipAtomicInner(doc, near, pos, dir, mayClear);
        }

        var far = m.find(dir < 0 ? -1 : 1);
        if (dir < 0 ? m.inclusiveLeft : m.inclusiveRight) far = movePos(doc, far, dir, line);
        return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
      }
    }
    return pos;
  }

  // Ensure a given position is not inside an atomic range.
  function skipAtomic(doc, pos, oldPos, bias, mayClear) {
    var dir = bias || 1;
    var found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) ||
        (!mayClear && skipAtomicInner(doc, pos, oldPos, dir, true)) ||
        skipAtomicInner(doc, pos, oldPos, -dir, mayClear) ||
        (!mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true));
    if (!found) {
      doc.cantEdit = true;
      return Pos(doc.first, 0);
    }
    return found;
  }

  function movePos(doc, pos, dir, line) {
    if (dir < 0 && pos.ch == 0) {
      if (pos.line > doc.first) return clipPos(doc, Pos(pos.line - 1));
      else return null;
    } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
      if (pos.line < doc.first + doc.size - 1) return Pos(pos.line + 1, 0);
      else return null;
    } else {
      return new Pos(pos.line, pos.ch + dir);
    }
  }

  // SELECTION DRAWING

  function updateSelection(cm) {
    cm.display.input.showSelection(cm.display.input.prepareSelection());
  }

  function prepareSelection(cm, primary) {
    var doc = cm.doc, result = {};
    var curFragment = result.cursors = document.createDocumentFragment();
    var selFragment = result.selection = document.createDocumentFragment();

    for (var i = 0; i < doc.sel.ranges.length; i++) {
      if (primary === false && i == doc.sel.primIndex) continue;
      var range = doc.sel.ranges[i];
      var collapsed = range.empty();
      if (collapsed || cm.options.showCursorWhenSelecting)
        drawSelectionCursor(cm, range.head, curFragment);
      if (!collapsed)
        drawSelectionRange(cm, range, selFragment);
    }
    return result;
  }

  // Draws a cursor for the given range
  function drawSelectionCursor(cm, head, output) {
    var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);

    var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
    cursor.style.left = pos.left + "px";
    cursor.style.top = pos.top + "px";
    cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

    if (pos.other) {
      // Secondary cursor, shown when on a 'jump' in bi-directional text
      var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
      otherCursor.style.display = "";
      otherCursor.style.left = pos.other.left + "px";
      otherCursor.style.top = pos.other.top + "px";
      otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
    }
  }

  // Draws the given range as a highlighted selection
  function drawSelectionRange(cm, range, output) {
    var display = cm.display, doc = cm.doc;
    var fragment = document.createDocumentFragment();
    var padding = paddingH(cm.display), leftSide = padding.left;
    var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;

    function add(left, top, width, bottom) {
      if (top < 0) top = 0;
      top = Math.round(top);
      bottom = Math.round(bottom);
      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
                               "px; top: " + top + "px; width: " + (width == null ? rightSide - left : width) +
                               "px; height: " + (bottom - top) + "px"));
    }

    function drawForLine(line, fromArg, toArg) {
      var lineObj = getLine(doc, line);
      var lineLen = lineObj.text.length;
      var start, end;
      function coords(ch, bias) {
        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
      }

      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
        var leftPos = coords(from, "left"), rightPos, left, right;
        if (from == to) {
          rightPos = leftPos;
          left = right = leftPos.left;
        } else {
          rightPos = coords(to - 1, "right");
          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
          left = leftPos.left;
          right = rightPos.right;
        }
        if (fromArg == null && from == 0) left = leftSide;
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
          add(left, leftPos.top, null, leftPos.bottom);
          left = leftSide;
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
        }
        if (toArg == null && to == lineLen) right = rightSide;
        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
          start = leftPos;
        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
          end = rightPos;
        if (left < leftSide + 1) left = leftSide;
        add(left, rightPos.top, right - left, rightPos.bottom);
      });
      return {start: start, end: end};
    }

    var sFrom = range.from(), sTo = range.to();
    if (sFrom.line == sTo.line) {
      drawForLine(sFrom.line, sFrom.ch, sTo.ch);
    } else {
      var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
      var singleVLine = visualLine(fromLine) == visualLine(toLine);
      var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
      var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
      if (singleVLine) {
        if (leftEnd.top < rightStart.top - 2) {
          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
          add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
        } else {
          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
        }
      }
      if (leftEnd.bottom < rightStart.top)
        add(leftSide, leftEnd.bottom, null, rightStart.top);
    }

    output.appendChild(fragment);
  }

  // Cursor-blinking
  function restartBlink(cm) {
    if (!cm.state.focused) return;
    var display = cm.display;
    clearInterval(display.blinker);
    var on = true;
    display.cursorDiv.style.visibility = "";
    if (cm.options.cursorBlinkRate > 0)
      display.blinker = setInterval(function() {
        display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
      }, cm.options.cursorBlinkRate);
    else if (cm.options.cursorBlinkRate < 0)
      display.cursorDiv.style.visibility = "hidden";
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.viewTo)
      cm.state.highlight.set(time, bind(highlightWorker, cm));
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.frontier < doc.first) doc.frontier = doc.first;
    if (doc.frontier >= cm.display.viewTo) return;
    var end = +new Date + cm.options.workTime;
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
    var changedLines = [];

    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
      if (doc.frontier >= cm.display.viewFrom) { // Visible
        var oldStyles = line.styles, tooLong = line.text.length > cm.options.maxHighlightLength;
        var highlighted = highlightLine(cm, line, tooLong ? copyState(doc.mode, state) : state, true);
        line.styles = highlighted.styles;
        var oldCls = line.styleClasses, newCls = highlighted.classes;
        if (newCls) line.styleClasses = newCls;
        else if (oldCls) line.styleClasses = null;
        var ischange = !oldStyles || oldStyles.length != line.styles.length ||
          oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
        if (ischange) changedLines.push(doc.frontier);
        line.stateAfter = tooLong ? state : copyState(doc.mode, state);
      } else {
        if (line.text.length <= cm.options.maxHighlightLength)
          processLine(cm, line.text, state);
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
      }
      ++doc.frontier;
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true;
      }
    });
    if (changedLines.length) runInOp(cm, function() {
      for (var i = 0; i < changedLines.length; i++)
        regLineChange(cm, changedLines[i], "text");
    });
  }

  // Finds the line to start with when starting a parse. Tries to
  // find a line with a stateAfter, so that it can start with a
  // valid state. If that fails, it returns the line with the
  // smallest indentation, which tends to need the least context to
  // parse correctly.
  function findStartLine(cm, n, precise) {
    var minindent, minline, doc = cm.doc;
    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
    for (var search = n; search > lim; --search) {
      if (search <= doc.first) return doc.first;
      var line = getLine(doc, search - 1);
      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
      var indented = countColumn(line.text, null, cm.options.tabSize);
      if (minline == null || minindent > indented) {
        minline = search - 1;
        minindent = indented;
      }
    }
    return minline;
  }

  function getStateBefore(cm, n, precise) {
    var doc = cm.doc, display = cm.display;
    if (!doc.mode.startState) return true;
    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
    if (!state) state = startState(doc.mode);
    else state = copyState(doc.mode, state);
    doc.iter(pos, n, function(line) {
      processLine(cm, line.text, state);
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo;
      line.stateAfter = save ? copyState(doc.mode, state) : null;
      ++pos;
    });
    if (precise) doc.frontier = pos;
    return state;
  }

  // POSITION MEASUREMENT

  function paddingTop(display) {return display.lineSpace.offsetTop;}
  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
  function paddingH(display) {
    if (display.cachedPaddingH) return display.cachedPaddingH;
    var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
    var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
    var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
    if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
    return data;
  }

  function scrollGap(cm) { return scrollerGap - cm.display.nativeBarWidth; }
  function displayWidth(cm) {
    return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
  }
  function displayHeight(cm) {
    return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
  }

  // Ensure the lineView.wrapping.heights array is populated. This is
  // an array of bottom offsets for the lines that make up a drawn
  // line. When lineWrapping is on, there might be more than one
  // height.
  function ensureLineHeights(cm, lineView, rect) {
    var wrapping = cm.options.lineWrapping;
    var curWidth = wrapping && displayWidth(cm);
    if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
      var heights = lineView.measure.heights = [];
      if (wrapping) {
        lineView.measure.width = curWidth;
        var rects = lineView.text.firstChild.getClientRects();
        for (var i = 0; i < rects.length - 1; i++) {
          var cur = rects[i], next = rects[i + 1];
          if (Math.abs(cur.bottom - next.bottom) > 2)
            heights.push((cur.bottom + next.top) / 2 - rect.top);
        }
      }
      heights.push(rect.bottom - rect.top);
    }
  }

  // Find a line map (mapping character offsets to text nodes) and a
  // measurement cache for the given line number. (A line view might
  // contain multiple lines when collapsed ranges are present.)
  function mapFromLineView(lineView, line, lineN) {
    if (lineView.line == line)
      return {map: lineView.measure.map, cache: lineView.measure.cache};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineView.rest[i] == line)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineNo(lineView.rest[i]) > lineN)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: true};
  }

  // Render a line into the hidden node display.externalMeasured. Used
  // when measurement is needed for a line that's not in the viewport.
  function updateExternalMeasurement(cm, line) {
    line = visualLine(line);
    var lineN = lineNo(line);
    var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
    view.lineN = lineN;
    var built = view.built = buildLineContent(cm, view);
    view.text = built.pre;
    removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
    return view;
  }

  // Get a {top, bottom, left, right} box (in line-local coordinates)
  // for a given character.
  function measureChar(cm, line, ch, bias) {
    return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
  }

  // Find a line view that corresponds to the given line number.
  function findViewForLine(cm, lineN) {
    if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
      return cm.display.view[findViewIndex(cm, lineN)];
    var ext = cm.display.externalMeasured;
    if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
      return ext;
  }

  // Measurement can be split in two steps, the set-up work that
  // applies to the whole line, and the measurement of the actual
  // character. Functions like coordsChar, that need to do a lot of
  // measurements in a row, can thus ensure that the set-up work is
  // only done once.
  function prepareMeasureForLine(cm, line) {
    var lineN = lineNo(line);
    var view = findViewForLine(cm, lineN);
    if (view && !view.text) {
      view = null;
    } else if (view && view.changes) {
      updateLineForChanges(cm, view, lineN, getDimensions(cm));
      cm.curOp.forceUpdate = true;
    }
    if (!view)
      view = updateExternalMeasurement(cm, line);

    var info = mapFromLineView(view, line, lineN);
    return {
      line: line, view: view, rect: null,
      map: info.map, cache: info.cache, before: info.before,
      hasHeights: false
    };
  }

  // Given a prepared measurement object, measures the position of an
  // actual character (or fetches it from the cache).
  function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
    if (prepared.before) ch = -1;
    var key = ch + (bias || ""), found;
    if (prepared.cache.hasOwnProperty(key)) {
      found = prepared.cache[key];
    } else {
      if (!prepared.rect)
        prepared.rect = prepared.view.text.getBoundingClientRect();
      if (!prepared.hasHeights) {
        ensureLineHeights(cm, prepared.view, prepared.rect);
        prepared.hasHeights = true;
      }
      found = measureCharInner(cm, prepared, ch, bias);
      if (!found.bogus) prepared.cache[key] = found;
    }
    return {left: found.left, right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom};
  }

  var nullRect = {left: 0, right: 0, top: 0, bottom: 0};

  function nodeAndOffsetInLineMap(map, ch, bias) {
    var node, start, end, collapse;
    // First, search the line map for the text node corresponding to,
    // or closest to, the target character.
    for (var i = 0; i < map.length; i += 3) {
      var mStart = map[i], mEnd = map[i + 1];
      if (ch < mStart) {
        start = 0; end = 1;
        collapse = "left";
      } else if (ch < mEnd) {
        start = ch - mStart;
        end = start + 1;
      } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
        end = mEnd - mStart;
        start = end - 1;
        if (ch >= mEnd) collapse = "right";
      }
      if (start != null) {
        node = map[i + 2];
        if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
          collapse = bias;
        if (bias == "left" && start == 0)
          while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
            node = map[(i -= 3) + 2];
            collapse = "left";
          }
        if (bias == "right" && start == mEnd - mStart)
          while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
            node = map[(i += 3) + 2];
            collapse = "right";
          }
        break;
      }
    }
    return {node: node, start: start, end: end, collapse: collapse, coverStart: mStart, coverEnd: mEnd};
  }

  function measureCharInner(cm, prepared, ch, bias) {
    var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
    var node = place.node, start = place.start, end = place.end, collapse = place.collapse;

    var rect;
    if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
      for (var i = 0; i < 4; i++) { // Retry a maximum of 4 times when nonsense rectangles are returned
        while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) --start;
        while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) ++end;
        if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) {
          rect = node.parentNode.getBoundingClientRect();
        } else if (ie && cm.options.lineWrapping) {
          var rects = range(node, start, end).getClientRects();
          if (rects.length)
            rect = rects[bias == "right" ? rects.length - 1 : 0];
          else
            rect = nullRect;
        } else {
          rect = range(node, start, end).getBoundingClientRect() || nullRect;
        }
        if (rect.left || rect.right || start == 0) break;
        end = start;
        start = start - 1;
        collapse = "right";
      }
      if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
    } else { // If it is a widget, simply get the box for the whole widget.
      if (start > 0) collapse = bias = "right";
      var rects;
      if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
        rect = rects[bias == "right" ? rects.length - 1 : 0];
      else
        rect = node.getBoundingClientRect();
    }
    if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
      var rSpan = node.parentNode.getClientRects()[0];
      if (rSpan)
        rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom};
      else
        rect = nullRect;
    }

    var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
    var mid = (rtop + rbot) / 2;
    var heights = prepared.view.measure.heights;
    for (var i = 0; i < heights.length - 1; i++)
      if (mid < heights[i]) break;
    var top = i ? heights[i - 1] : 0, bot = heights[i];
    var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
                  right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
                  top: top, bottom: bot};
    if (!rect.left && !rect.right) result.bogus = true;
    if (!cm.options.singleCursorHeightPerLine) { result.rtop = rtop; result.rbottom = rbot; }

    return result;
  }

  // Work around problem with bounding client rects on ranges being
  // returned incorrectly when zoomed on IE10 and below.
  function maybeUpdateRectForZooming(measure, rect) {
    if (!window.screen || screen.logicalXDPI == null ||
        screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure))
      return rect;
    var scaleX = screen.logicalXDPI / screen.deviceXDPI;
    var scaleY = screen.logicalYDPI / screen.deviceYDPI;
    return {left: rect.left * scaleX, right: rect.right * scaleX,
            top: rect.top * scaleY, bottom: rect.bottom * scaleY};
  }

  function clearLineMeasurementCacheFor(lineView) {
    if (lineView.measure) {
      lineView.measure.cache = {};
      lineView.measure.heights = null;
      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
        lineView.measure.caches[i] = {};
    }
  }

  function clearLineMeasurementCache(cm) {
    cm.display.externalMeasure = null;
    removeChildren(cm.display.lineMeasure);
    for (var i = 0; i < cm.display.view.length; i++)
      clearLineMeasurementCacheFor(cm.display.view[i]);
  }

  function clearCaches(cm) {
    clearLineMeasurementCache(cm);
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
    cm.display.lineNumChars = null;
  }

  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

  // Converts a {top, bottom, left, right} box from line-local
  // coordinates into another coordinate system. Context may be one of
  // "line", "div" (display.lineDiv), "local"/null (editor), "window",
  // or "page".
  function intoCoordSystem(cm, lineObj, rect, context) {
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
      var size = widgetHeight(lineObj.widgets[i]);
      rect.top += size; rect.bottom += size;
    }
    if (context == "line") return rect;
    if (!context) context = "local";
    var yOff = heightAtLine(lineObj);
    if (context == "local") yOff += paddingTop(cm.display);
    else yOff -= cm.display.viewOffset;
    if (context == "page" || context == "window") {
      var lOff = cm.display.lineSpace.getBoundingClientRect();
      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
      rect.left += xOff; rect.right += xOff;
    }
    rect.top += yOff; rect.bottom += yOff;
    return rect;
  }

  // Coverts a box from "div" coords to another coordinate system.
  // Context may be "window", "page", "div", or "local"/null.
  function fromCoordSystem(cm, coords, context) {
    if (context == "div") return coords;
    var left = coords.left, top = coords.top;
    // First move into "page" coordinate system
    if (context == "page") {
      left -= pageScrollX();
      top -= pageScrollY();
    } else if (context == "local" || !context) {
      var localBox = cm.display.sizer.getBoundingClientRect();
      left += localBox.left;
      top += localBox.top;
    }

    var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
  }

  function charCoords(cm, pos, context, lineObj, bias) {
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
  }

  // Returns a box for a given cursor position, which may have an
  // 'other' property containing the position of the secondary cursor
  // on a bidi boundary.
  function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
    lineObj = lineObj || getLine(cm.doc, pos.line);
    if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
    function get(ch, right) {
      var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
      if (right) m.left = m.right; else m.right = m.left;
      return intoCoordSystem(cm, lineObj, m, context);
    }
    function getBidi(ch, partPos) {
      var part = order[partPos], right = part.level % 2;
      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
        part = order[--partPos];
        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
        right = true;
      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
        part = order[++partPos];
        ch = bidiLeft(part) - part.level % 2;
        right = false;
      }
      if (right && ch == part.to && ch > part.from) return get(ch - 1);
      return get(ch, right);
    }
    var order = getOrder(lineObj), ch = pos.ch;
    if (!order) return get(ch);
    var partPos = getBidiPartAt(order, ch);
    var val = getBidi(ch, partPos);
    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
    return val;
  }

  // Used to cheaply estimate the coordinates for a position. Used for
  // intermediate scroll updates.
  function estimateCoords(cm, pos) {
    var left = 0, pos = clipPos(cm.doc, pos);
    if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
    var lineObj = getLine(cm.doc, pos.line);
    var top = heightAtLine(lineObj) + paddingTop(cm.display);
    return {left: left, right: left, top: top, bottom: top + lineObj.height};
  }

  // Positions returned by coordsChar contain some extra information.
  // xRel is the relative x position of the input coordinates compared
  // to the found position (so xRel > 0 means the coordinates are to
  // the right of the character position, for example). When outside
  // is true, that means the coordinates lie outside the line's
  // vertical range.
  function PosWithInfo(line, ch, outside, xRel) {
    var pos = Pos(line, ch);
    pos.xRel = xRel;
    if (outside) pos.outside = true;
    return pos;
  }

  // Compute the character position closest to the given coordinates.
  // Input must be lineSpace-local ("div" coordinate system).
  function coordsChar(cm, x, y) {
    var doc = cm.doc;
    y += cm.display.viewOffset;
    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
    var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
    if (lineN > last)
      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
    if (x < 0) x = 0;

    var lineObj = getLine(doc, lineN);
    for (;;) {
      var found = coordsCharInner(cm, lineObj, lineN, x, y);
      var merged = collapsedSpanAtEnd(lineObj);
      var mergedPos = merged && merged.find(0, true);
      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
        lineN = lineNo(lineObj = mergedPos.to.line);
      else
        return found;
    }
  }

  function coordsCharInner(cm, lineObj, lineNo, x, y) {
    var innerOff = y - heightAtLine(lineObj);
    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
    var preparedMeasure = prepareMeasureForLine(cm, lineObj);

    function getX(ch) {
      var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, preparedMeasure);
      wrongLine = true;
      if (innerOff > sp.bottom) return sp.left - adjust;
      else if (innerOff < sp.top) return sp.left + adjust;
      else wrongLine = false;
      return sp.left;
    }

    var bidi = getOrder(lineObj), dist = lineObj.text.length;
    var from = lineLeft(lineObj), to = lineRight(lineObj);
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
    // Do a binary search between these bounds.
    for (;;) {
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
        var ch = x < fromX || x - fromX <= toX - x ? from : to;
        var xDiff = x - (ch == from ? fromX : toX);
        while (isExtendingChar(lineObj.text.charAt(ch))) ++ch;
        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
                              xDiff < -1 ? -1 : xDiff > 1 ? 1 : 0);
        return pos;
      }
      var step = Math.ceil(dist / 2), middle = from + step;
      if (bidi) {
        middle = from;
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
      }
      var middleX = getX(middle);
      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
    }
  }

  var measureText;
  // Compute the default text height.
  function textHeight(display) {
    if (display.cachedTextHeight != null) return display.cachedTextHeight;
    if (measureText == null) {
      measureText = elt("pre");
      // Measure a bunch of lines, for browsers that compute
      // fractional heights.
      for (var i = 0; i < 49; ++i) {
        measureText.appendChild(document.createTextNode("x"));
        measureText.appendChild(elt("br"));
      }
      measureText.appendChild(document.createTextNode("x"));
    }
    removeChildrenAndAdd(display.measure, measureText);
    var height = measureText.offsetHeight / 50;
    if (height > 3) display.cachedTextHeight = height;
    removeChildren(display.measure);
    return height || 1;
  }

  // Compute the default character width.
  function charWidth(display) {
    if (display.cachedCharWidth != null) return display.cachedCharWidth;
    var anchor = elt("span", "xxxxxxxxxx");
    var pre = elt("pre", [anchor]);
    removeChildrenAndAdd(display.measure, pre);
    var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
    if (width > 2) display.cachedCharWidth = width;
    return width || 10;
  }

  // OPERATIONS

  // Operations are used to wrap a series of changes to the editor
  // state in such a way that each change won't have to update the
  // cursor and display (which would be awkward, slow, and
  // error-prone). Instead, display updates are batched and then all
  // combined and executed at once.

  var operationGroup = null;

  var nextOpId = 0;
  // Start a new operation.
  function startOperation(cm) {
    cm.curOp = {
      cm: cm,
      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
      startHeight: cm.doc.height, // Used to detect need to update scrollbar
      forceUpdate: false,      // Used to force a redraw
      updateInput: null,       // Whether to reset the input textarea
      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
      changeObjs: null,        // Accumulated changes, for firing change events
      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
      cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
      selectionChanged: false, // Whether the selection needs to be redrawn
      updateMaxLine: false,    // Set when the widest line needs to be determined anew
      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
      scrollToPos: null,       // Used to scroll to a specific position
      focus: false,
      id: ++nextOpId           // Unique ID
    };
    if (operationGroup) {
      operationGroup.ops.push(cm.curOp);
    } else {
      cm.curOp.ownsGroup = operationGroup = {
        ops: [cm.curOp],
        delayedCallbacks: []
      };
    }
  }

  function fireCallbacksForOps(group) {
    // Calls delayed callbacks and cursorActivity handlers until no
    // new ones appear
    var callbacks = group.delayedCallbacks, i = 0;
    do {
      for (; i < callbacks.length; i++)
        callbacks[i].call(null);
      for (var j = 0; j < group.ops.length; j++) {
        var op = group.ops[j];
        if (op.cursorActivityHandlers)
          while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
            op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
      }
    } while (i < callbacks.length);
  }

  // Finish an operation, updating the display and signalling delayed events
  function endOperation(cm) {
    var op = cm.curOp, group = op.ownsGroup;
    if (!group) return;

    try { fireCallbacksForOps(group); }
    finally {
      operationGroup = null;
      for (var i = 0; i < group.ops.length; i++)
        group.ops[i].cm.curOp = null;
      endOperations(group);
    }
  }

  // The DOM updates done when an operation finishes are batched so
  // that the minimum number of relayouts are required.
  function endOperations(group) {
    var ops = group.ops;
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_R1(ops[i]);
    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
      endOperation_W1(ops[i]);
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_R2(ops[i]);
    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
      endOperation_W2(ops[i]);
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_finish(ops[i]);
  }

  function endOperation_R1(op) {
    var cm = op.cm, display = cm.display;
    maybeClipScrollbars(cm);
    if (op.updateMaxLine) findMaxLine(cm);

    op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
      op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
                         op.scrollToPos.to.line >= display.viewTo) ||
      display.maxLineChanged && cm.options.lineWrapping;
    op.update = op.mustUpdate &&
      new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
  }

  function endOperation_W1(op) {
    op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
  }

  function endOperation_R2(op) {
    var cm = op.cm, display = cm.display;
    if (op.updatedDisplay) updateHeightsInViewport(cm);

    op.barMeasure = measureForScrollbars(cm);

    // If the max line changed since it was last measured, measure it,
    // and ensure the document's width matches it.
    // updateDisplay_W2 will use these properties to do the actual resizing
    if (display.maxLineChanged && !cm.options.lineWrapping) {
      op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
      cm.display.sizerWidth = op.adjustWidthTo;
      op.barMeasure.scrollWidth =
        Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
      op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
    }

    if (op.updatedDisplay || op.selectionChanged)
      op.preparedSelection = display.input.prepareSelection();
  }

  function endOperation_W2(op) {
    var cm = op.cm;

    if (op.adjustWidthTo != null) {
      cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
      if (op.maxScrollLeft < cm.doc.scrollLeft)
        setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
      cm.display.maxLineChanged = false;
    }

    if (op.preparedSelection)
      cm.display.input.showSelection(op.preparedSelection);
    if (op.updatedDisplay)
      setDocumentHeight(cm, op.barMeasure);
    if (op.updatedDisplay || op.startHeight != cm.doc.height)
      updateScrollbars(cm, op.barMeasure);

    if (op.selectionChanged) restartBlink(cm);

    if (cm.state.focused && op.updateInput)
      cm.display.input.reset(op.typing);
    if (op.focus && op.focus == activeElt() && (!document.hasFocus || document.hasFocus()))
      ensureFocus(op.cm);
  }

  function endOperation_finish(op) {
    var cm = op.cm, display = cm.display, doc = cm.doc;

    if (op.updatedDisplay) postUpdateDisplay(cm, op.update);

    // Abort mouse wheel delta measurement, when scrolling explicitly
    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
      display.wheelStartX = display.wheelStartY = null;

    // Propagate the scroll position to the actual DOM scroller
    if (op.scrollTop != null && (display.scroller.scrollTop != op.scrollTop || op.forceScroll)) {
      doc.scrollTop = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, op.scrollTop));
      display.scrollbars.setScrollTop(doc.scrollTop);
      display.scroller.scrollTop = doc.scrollTop;
    }
    if (op.scrollLeft != null && (display.scroller.scrollLeft != op.scrollLeft || op.forceScroll)) {
      doc.scrollLeft = Math.max(0, Math.min(display.scroller.scrollWidth - displayWidth(cm), op.scrollLeft));
      display.scrollbars.setScrollLeft(doc.scrollLeft);
      display.scroller.scrollLeft = doc.scrollLeft;
      alignHorizontally(cm);
    }
    // If we need to scroll a specific position into view, do so.
    if (op.scrollToPos) {
      var coords = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
                                     clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
      if (op.scrollToPos.isCursor && cm.state.focused) maybeScrollWindow(cm, coords);
    }

    // Fire events for markers that are hidden/unidden by editing or
    // undoing
    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) for (var i = 0; i < hidden.length; ++i)
      if (!hidden[i].lines.length) signal(hidden[i], "hide");
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

    if (display.wrapper.offsetHeight)
      doc.scrollTop = cm.display.scroller.scrollTop;

    // Fire change events, and delayed event handlers
    if (op.changeObjs)
      signal(cm, "changes", cm, op.changeObjs);
    if (op.update)
      op.update.finish();
  }

  // Run the given function in an operation
  function runInOp(cm, f) {
    if (cm.curOp) return f();
    startOperation(cm);
    try { return f(); }
    finally { endOperation(cm); }
  }
  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm, f) {
    return function() {
      if (cm.curOp) return f.apply(cm, arguments);
      startOperation(cm);
      try { return f.apply(cm, arguments); }
      finally { endOperation(cm); }
    };
  }
  // Used to add methods to editor and doc instances, wrapping them in
  // operations.
  function methodOp(f) {
    return function() {
      if (this.curOp) return f.apply(this, arguments);
      startOperation(this);
      try { return f.apply(this, arguments); }
      finally { endOperation(this); }
    };
  }
  function docMethodOp(f) {
    return function() {
      var cm = this.cm;
      if (!cm || cm.curOp) return f.apply(this, arguments);
      startOperation(cm);
      try { return f.apply(this, arguments); }
      finally { endOperation(cm); }
    };
  }

  // VIEW TRACKING

  // These objects are used to represent the visible (currently drawn)
  // part of the document. A LineView may correspond to multiple
  // logical lines, if those are connected by collapsed ranges.
  function LineView(doc, line, lineN) {
    // The starting line
    this.line = line;
    // Continuing lines, if any
    this.rest = visualLineContinued(line);
    // Number of logical lines in this visual line
    this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
    this.node = this.text = null;
    this.hidden = lineIsHidden(doc, line);
  }

  // Create a range of LineView objects for the given lines.
  function buildViewArray(cm, from, to) {
    var array = [], nextPos;
    for (var pos = from; pos < to; pos = nextPos) {
      var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
      nextPos = pos + view.size;
      array.push(view);
    }
    return array;
  }

  // Updates the display.view data structure for a given change to the
  // document. From and to are in pre-change coordinates. Lendiff is
  // the amount of lines added or subtracted by the change. This is
  // used for changes that span multiple lines, or change the way
  // lines are divided into visual lines. regLineChange (below)
  // registers single-line changes.
  function regChange(cm, from, to, lendiff) {
    if (from == null) from = cm.doc.first;
    if (to == null) to = cm.doc.first + cm.doc.size;
    if (!lendiff) lendiff = 0;

    var display = cm.display;
    if (lendiff && to < display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers > from))
      display.updateLineNumbers = from;

    cm.curOp.viewChanged = true;

    if (from >= display.viewTo) { // Change after
      if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
        resetView(cm);
    } else if (to <= display.viewFrom) { // Change before
      if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
        resetView(cm);
      } else {
        display.viewFrom += lendiff;
        display.viewTo += lendiff;
      }
    } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
      resetView(cm);
    } else if (from <= display.viewFrom) { // Top overlap
      var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cut) {
        display.view = display.view.slice(cut.index);
        display.viewFrom = cut.lineN;
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    } else if (to >= display.viewTo) { // Bottom overlap
      var cut = viewCuttingPoint(cm, from, from, -1);
      if (cut) {
        display.view = display.view.slice(0, cut.index);
        display.viewTo = cut.lineN;
      } else {
        resetView(cm);
      }
    } else { // Gap in the middle
      var cutTop = viewCuttingPoint(cm, from, from, -1);
      var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cutTop && cutBot) {
        display.view = display.view.slice(0, cutTop.index)
          .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
          .concat(display.view.slice(cutBot.index));
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    }

    var ext = display.externalMeasured;
    if (ext) {
      if (to < ext.lineN)
        ext.lineN += lendiff;
      else if (from < ext.lineN + ext.size)
        display.externalMeasured = null;
    }
  }

  // Register a change to a single line. Type must be one of "text",
  // "gutter", "class", "widget"
  function regLineChange(cm, line, type) {
    cm.curOp.viewChanged = true;
    var display = cm.display, ext = cm.display.externalMeasured;
    if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
      display.externalMeasured = null;

    if (line < display.viewFrom || line >= display.viewTo) return;
    var lineView = display.view[findViewIndex(cm, line)];
    if (lineView.node == null) return;
    var arr = lineView.changes || (lineView.changes = []);
    if (indexOf(arr, type) == -1) arr.push(type);
  }

  // Clear the view.
  function resetView(cm) {
    cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
    cm.display.view = [];
    cm.display.viewOffset = 0;
  }

  // Find the view element corresponding to a given line. Return null
  // when the line isn't visible.
  function findViewIndex(cm, n) {
    if (n >= cm.display.viewTo) return null;
    n -= cm.display.viewFrom;
    if (n < 0) return null;
    var view = cm.display.view;
    for (var i = 0; i < view.length; i++) {
      n -= view[i].size;
      if (n < 0) return i;
    }
  }

  function viewCuttingPoint(cm, oldN, newN, dir) {
    var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
    if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
      return {index: index, lineN: newN};
    for (var i = 0, n = cm.display.viewFrom; i < index; i++)
      n += view[i].size;
    if (n != oldN) {
      if (dir > 0) {
        if (index == view.length - 1) return null;
        diff = (n + view[index].size) - oldN;
        index++;
      } else {
        diff = n - oldN;
      }
      oldN += diff; newN += diff;
    }
    while (visualLineNo(cm.doc, newN) != newN) {
      if (index == (dir < 0 ? 0 : view.length - 1)) return null;
      newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
      index += dir;
    }
    return {index: index, lineN: newN};
  }

  // Force the view to cover a given range, adding empty view element
  // or clipping off existing ones as needed.
  function adjustView(cm, from, to) {
    var display = cm.display, view = display.view;
    if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
      display.view = buildViewArray(cm, from, to);
      display.viewFrom = from;
    } else {
      if (display.viewFrom > from)
        display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
      else if (display.viewFrom < from)
        display.view = display.view.slice(findViewIndex(cm, from));
      display.viewFrom = from;
      if (display.viewTo < to)
        display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
      else if (display.viewTo > to)
        display.view = display.view.slice(0, findViewIndex(cm, to));
    }
    display.viewTo = to;
  }

  // Count the number of lines in the view whose DOM representation is
  // out of date (or nonexistent).
  function countDirtyView(cm) {
    var view = cm.display.view, dirty = 0;
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
    }
    return dirty;
  }

  // EVENT HANDLERS

  // Attach the necessary event handlers when initializing the editor
  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, "mousedown", operation(cm, onMouseDown));
    // Older IE's will not fire a second mousedown for a double click
    if (ie && ie_version < 11)
      on(d.scroller, "dblclick", operation(cm, function(e) {
        if (signalDOMEvent(cm, e)) return;
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        var word = cm.findWordAt(pos);
        extendSelection(cm.doc, word.anchor, word.head);
      }));
    else
      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
    // Some browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for these browsers.
    if (!captureRightClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

    // Used to suppress mouse event handling when a touch happens
    var touchFinished, prevTouch = {end: 0};
    function finishTouch() {
      if (d.activeTouch) {
        touchFinished = setTimeout(function() {d.activeTouch = null;}, 1000);
        prevTouch = d.activeTouch;
        prevTouch.end = +new Date;
      }
    };
    function isMouseLikeTouchEvent(e) {
      if (e.touches.length != 1) return false;
      var touch = e.touches[0];
      return touch.radiusX <= 1 && touch.radiusY <= 1;
    }
    function farAway(touch, other) {
      if (other.left == null) return true;
      var dx = other.left - touch.left, dy = other.top - touch.top;
      return dx * dx + dy * dy > 20 * 20;
    }
    on(d.scroller, "touchstart", function(e) {
      if (!isMouseLikeTouchEvent(e)) {
        clearTimeout(touchFinished);
        var now = +new Date;
        d.activeTouch = {start: now, moved: false,
                         prev: now - prevTouch.end <= 300 ? prevTouch : null};
        if (e.touches.length == 1) {
          d.activeTouch.left = e.touches[0].pageX;
          d.activeTouch.top = e.touches[0].pageY;
        }
      }
    });
    on(d.scroller, "touchmove", function() {
      if (d.activeTouch) d.activeTouch.moved = true;
    });
    on(d.scroller, "touchend", function(e) {
      var touch = d.activeTouch;
      if (touch && !eventInWidget(d, e) && touch.left != null &&
          !touch.moved && new Date - touch.start < 300) {
        var pos = cm.coordsChar(d.activeTouch, "page"), range;
        if (!touch.prev || farAway(touch, touch.prev)) // Single tap
          range = new Range(pos, pos);
        else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
          range = cm.findWordAt(pos);
        else // Triple tap
          range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        cm.setSelection(range.anchor, range.head);
        cm.focus();
        e_preventDefault(e);
      }
      finishTouch();
    });
    on(d.scroller, "touchcancel", finishTouch);

    // Sync scrolling between fake scrollbars and real scrollable
    // area, ensure viewport is updated when scrolling.
    on(d.scroller, "scroll", function() {
      if (d.scroller.clientHeight) {
        setScrollTop(cm, d.scroller.scrollTop);
        setScrollLeft(cm, d.scroller.scrollLeft, true);
        signal(cm, "scroll", cm);
      }
    });

    // Listen to wheel events in order to try and update the viewport on time.
    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

    // Prevent wrapper from ever scrolling
    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

    d.dragFunctions = {
      enter: function(e) {if (!signalDOMEvent(cm, e)) e_stop(e);},
      over: function(e) {if (!signalDOMEvent(cm, e)) { onDragOver(cm, e); e_stop(e); }},
      start: function(e){onDragStart(cm, e);},
      drop: operation(cm, onDrop),
      leave: function() {clearDragCursor(cm);}
    };

    var inp = d.input.getField();
    on(inp, "keyup", function(e) { onKeyUp.call(cm, e); });
    on(inp, "keydown", operation(cm, onKeyDown));
    on(inp, "keypress", operation(cm, onKeyPress));
    on(inp, "focus", bind(onFocus, cm));
    on(inp, "blur", bind(onBlur, cm));
  }

  function dragDropChanged(cm, value, old) {
    var wasOn = old && old != CodeMirror.Init;
    if (!value != !wasOn) {
      var funcs = cm.display.dragFunctions;
      var toggle = value ? on : off;
      toggle(cm.display.scroller, "dragstart", funcs.start);
      toggle(cm.display.scroller, "dragenter", funcs.enter);
      toggle(cm.display.scroller, "dragover", funcs.over);
      toggle(cm.display.scroller, "dragleave", funcs.leave);
      toggle(cm.display.scroller, "drop", funcs.drop);
    }
  }

  // Called when the window resizes
  function onResize(cm) {
    var d = cm.display;
    if (d.lastWrapHeight == d.wrapper.clientHeight && d.lastWrapWidth == d.wrapper.clientWidth)
      return;
    // Might be a text scaling operation, clear size caches.
    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
    d.scrollbarsClipped = false;
    cm.setSize();
  }

  // MOUSE EVENTS

  // Return true when the given mouse event happened in a widget
  function eventInWidget(display, e) {
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
      if (!n || (n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true") ||
          (n.parentNode == display.sizer && n != display.mover))
        return true;
    }
  }

  // Given a mouse event, find the corresponding position. If liberal
  // is false, it checks whether a gutter or scrollbar was clicked,
  // and returns null if it was. forRect is used by rectangular
  // selections, and tries to estimate a character position even for
  // coordinates beyond the right of the text.
  function posFromMouse(cm, e, liberal, forRect) {
    var display = cm.display;
    if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") return null;

    var x, y, space = display.lineSpace.getBoundingClientRect();
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
    try { x = e.clientX - space.left; y = e.clientY - space.top; }
    catch (e) { return null; }
    var coords = coordsChar(cm, x, y), line;
    if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
      var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
      coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
    }
    return coords;
  }

  // A mouse down can be a single click, double click, triple click,
  // start of selection drag, start of text drag, new cursor
  // (ctrl-click), rectangle drag (alt-drag), or xwin
  // middle-click-paste. Or it might be a click on something we should
  // not interfere with, such as a scrollbar or widget.
  function onMouseDown(e) {
    var cm = this, display = cm.display;
    if (display.activeTouch && display.input.supportsTouch() || signalDOMEvent(cm, e)) return;
    display.shift = e.shiftKey;

    if (eventInWidget(display, e)) {
      if (!webkit) {
        // Briefly turn off draggability, to allow widgets to do
        // normal dragging things.
        display.scroller.draggable = false;
        setTimeout(function(){display.scroller.draggable = true;}, 100);
      }
      return;
    }
    if (clickInGutter(cm, e)) return;
    var start = posFromMouse(cm, e);
    window.focus();

    switch (e_button(e)) {
    case 1:
      // #3261: make sure, that we're not starting a second selection
      if (cm.state.selectingText)
        cm.state.selectingText(e);
      else if (start)
        leftButtonDown(cm, e, start);
      else if (e_target(e) == display.scroller)
        e_preventDefault(e);
      break;
    case 2:
      if (webkit) cm.state.lastMiddleDown = +new Date;
      if (start) extendSelection(cm.doc, start);
      setTimeout(function() {display.input.focus();}, 20);
      e_preventDefault(e);
      break;
    case 3:
      if (captureRightClick) onContextMenu(cm, e);
      else delayBlurEvent(cm);
      break;
    }
  }

  var lastClick, lastDoubleClick;
  function leftButtonDown(cm, e, start) {
    if (ie) setTimeout(bind(ensureFocus, cm), 0);
    else cm.curOp.focus = activeElt();

    var now = +new Date, type;
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && cmp(lastDoubleClick.pos, start) == 0) {
      type = "triple";
    } else if (lastClick && lastClick.time > now - 400 && cmp(lastClick.pos, start) == 0) {
      type = "double";
      lastDoubleClick = {time: now, pos: start};
    } else {
      type = "single";
      lastClick = {time: now, pos: start};
    }

    var sel = cm.doc.sel, modifier = mac ? e.metaKey : e.ctrlKey, contained;
    if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() &&
        type == "single" && (contained = sel.contains(start)) > -1 &&
        (cmp((contained = sel.ranges[contained]).from(), start) < 0 || start.xRel > 0) &&
        (cmp(contained.to(), start) > 0 || start.xRel < 0))
      leftButtonStartDrag(cm, e, start, modifier);
    else
      leftButtonSelect(cm, e, start, type, modifier);
  }

  // Start a text drag. When it ends, see if any dragging actually
  // happen, and treat as a click if it didn't.
  function leftButtonStartDrag(cm, e, start, modifier) {
    var display = cm.display, startTime = +new Date;
    var dragEnd = operation(cm, function(e2) {
      if (webkit) display.scroller.draggable = false;
      cm.state.draggingText = false;
      off(document, "mouseup", dragEnd);
      off(display.scroller, "drop", dragEnd);
      if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
        e_preventDefault(e2);
        if (!modifier && +new Date - 200 < startTime)
          extendSelection(cm.doc, start);
        // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)
        if (webkit || ie && ie_version == 9)
          setTimeout(function() {document.body.focus(); display.input.focus();}, 20);
        else
          display.input.focus();
      }
    });
    // Let the drag handler handle this.
    if (webkit) display.scroller.draggable = true;
    cm.state.draggingText = dragEnd;
    // IE's approach to draggable
    if (display.scroller.dragDrop) display.scroller.dragDrop();
    on(document, "mouseup", dragEnd);
    on(display.scroller, "drop", dragEnd);
  }

  // Normal selection, as opposed to text dragging.
  function leftButtonSelect(cm, e, start, type, addNew) {
    var display = cm.display, doc = cm.doc;
    e_preventDefault(e);

    var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
    if (addNew && !e.shiftKey) {
      ourIndex = doc.sel.contains(start);
      if (ourIndex > -1)
        ourRange = ranges[ourIndex];
      else
        ourRange = new Range(start, start);
    } else {
      ourRange = doc.sel.primary();
      ourIndex = doc.sel.primIndex;
    }

    if (e.altKey) {
      type = "rect";
      if (!addNew) ourRange = new Range(start, start);
      start = posFromMouse(cm, e, true, true);
      ourIndex = -1;
    } else if (type == "double") {
      var word = cm.findWordAt(start);
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, word.anchor, word.head);
      else
        ourRange = word;
    } else if (type == "triple") {
      var line = new Range(Pos(start.line, 0), clipPos(doc, Pos(start.line + 1, 0)));
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, line.anchor, line.head);
      else
        ourRange = line;
    } else {
      ourRange = extendRange(doc, ourRange, start);
    }

    if (!addNew) {
      ourIndex = 0;
      setSelection(doc, new Selection([ourRange], 0), sel_mouse);
      startSel = doc.sel;
    } else if (ourIndex == -1) {
      ourIndex = ranges.length;
      setSelection(doc, normalizeSelection(ranges.concat([ourRange]), ourIndex),
                   {scroll: false, origin: "*mouse"});
    } else if (ranges.length > 1 && ranges[ourIndex].empty() && type == "single" && !e.shiftKey) {
      setSelection(doc, normalizeSelection(ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0),
                   {scroll: false, origin: "*mouse"});
      startSel = doc.sel;
    } else {
      replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
    }

    var lastPos = start;
    function extendTo(pos) {
      if (cmp(lastPos, pos) == 0) return;
      lastPos = pos;

      if (type == "rect") {
        var ranges = [], tabSize = cm.options.tabSize;
        var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
        var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
        var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
        for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
             line <= end; line++) {
          var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
          if (left == right)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
          else if (text.length > leftPos)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
        }
        if (!ranges.length) ranges.push(new Range(start, start));
        setSelection(doc, normalizeSelection(startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
                     {origin: "*mouse", scroll: false});
        cm.scrollIntoView(pos);
      } else {
        var oldRange = ourRange;
        var anchor = oldRange.anchor, head = pos;
        if (type != "single") {
          if (type == "double")
            var range = cm.findWordAt(pos);
          else
            var range = new Range(Pos(pos.line, 0), clipPos(doc, Pos(pos.line + 1, 0)));
          if (cmp(range.anchor, anchor) > 0) {
            head = range.head;
            anchor = minPos(oldRange.from(), range.anchor);
          } else {
            head = range.anchor;
            anchor = maxPos(oldRange.to(), range.head);
          }
        }
        var ranges = startSel.ranges.slice(0);
        ranges[ourIndex] = new Range(clipPos(doc, anchor), head);
        setSelection(doc, normalizeSelection(ranges, ourIndex), sel_mouse);
      }
    }

    var editorSize = display.wrapper.getBoundingClientRect();
    // Used to ensure timeout re-tries don't fire when another extend
    // happened in the meantime (clearTimeout isn't reliable -- at
    // least on Chrome, the timeouts still happen even when cleared,
    // if the clear happens after their scheduled firing time).
    var counter = 0;

    function extend(e) {
      var curCount = ++counter;
      var cur = posFromMouse(cm, e, true, type == "rect");
      if (!cur) return;
      if (cmp(cur, lastPos) != 0) {
        cm.curOp.focus = activeElt();
        extendTo(cur);
        var visible = visibleLines(display, doc);
        if (cur.line >= visible.to || cur.line < visible.from)
          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
      } else {
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
        if (outside) setTimeout(operation(cm, function() {
          if (counter != curCount) return;
          display.scroller.scrollTop += outside;
          extend(e);
        }), 50);
      }
    }

    function done(e) {
      cm.state.selectingText = false;
      counter = Infinity;
      e_preventDefault(e);
      display.input.focus();
      off(document, "mousemove", move);
      off(document, "mouseup", up);
      doc.history.lastSelOrigin = null;
    }

    var move = operation(cm, function(e) {
      if (!e_button(e)) done(e);
      else extend(e);
    });
    var up = operation(cm, done);
    cm.state.selectingText = up;
    on(document, "mousemove", move);
    on(document, "mouseup", up);
  }

  // Determines whether an event happened in the gutter, and fires the
  // handlers for the corresponding event.
  function gutterEvent(cm, e, type, prevent) {
    try { var mX = e.clientX, mY = e.clientY; }
    catch(e) { return false; }
    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
    if (prevent) e_preventDefault(e);

    var display = cm.display;
    var lineBox = display.lineDiv.getBoundingClientRect();

    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.options.gutters.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && g.getBoundingClientRect().right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.options.gutters[i];
        signal(cm, type, cm, line, gutter, e);
        return e_defaultPrevented(e);
      }
    }
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, "gutterClick", true);
  }

  // Kludge to work around strange IE behavior where it'll sometimes
  // re-fire a series of drag-related events right after the drop (#1551)
  var lastDrop = 0;

  function onDrop(e) {
    var cm = this;
    clearDragCursor(cm);
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
      return;
    e_preventDefault(e);
    if (ie) lastDrop = +new Date;
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
    if (!pos || cm.isReadOnly()) return;
    // Might be a file drop, in which case we simply extract the text
    // and insert it.
    if (files && files.length && window.FileReader && window.File) {
      var n = files.length, text = Array(n), read = 0;
      var loadFile = function(file, i) {
        if (cm.options.allowDropFileTypes &&
            indexOf(cm.options.allowDropFileTypes, file.type) == -1)
          return;

        var reader = new FileReader;
        reader.onload = operation(cm, function() {
          var content = reader.result;
          if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) content = "";
          text[i] = content;
          if (++read == n) {
            pos = clipPos(cm.doc, pos);
            var change = {from: pos, to: pos,
                          text: cm.doc.splitLines(text.join(cm.doc.lineSeparator())),
                          origin: "paste"};
            makeChange(cm.doc, change);
            setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
          }
        });
        reader.readAsText(file);
      };
      for (var i = 0; i < n; ++i) loadFile(files[i], i);
    } else { // Normal drop
      // Don't do a replace if the drop happened inside of the selected text.
      if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
        cm.state.draggingText(e);
        // Ensure the editor is re-focused
        setTimeout(function() {cm.display.input.focus();}, 20);
        return;
      }
      try {
        var text = e.dataTransfer.getData("Text");
        if (text) {
          if (cm.state.draggingText && !(mac ? e.altKey : e.ctrlKey))
            var selected = cm.listSelections();
          setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
          if (selected) for (var i = 0; i < selected.length; ++i)
            replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
          cm.replaceSelection(text, "around", "paste");
          cm.display.input.focus();
        }
      }
      catch(e){}
    }
  }

  function onDragStart(cm, e) {
    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

    e.dataTransfer.setData("Text", cm.getSelection());

    // Use dummy image instead of default browsers image.
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
    if (e.dataTransfer.setDragImage && !safari) {
      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      if (presto) {
        img.width = img.height = 1;
        cm.display.wrapper.appendChild(img);
        // Force a relayout, or Opera won't use our image for some obscure reason
        img._top = img.offsetTop;
      }
      e.dataTransfer.setDragImage(img, 0, 0);
      if (presto) img.parentNode.removeChild(img);
    }
  }

  function onDragOver(cm, e) {
    var pos = posFromMouse(cm, e);
    if (!pos) return;
    var frag = document.createDocumentFragment();
    drawSelectionCursor(cm, pos, frag);
    if (!cm.display.dragCursor) {
      cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
      cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
    }
    removeChildrenAndAdd(cm.display.dragCursor, frag);
  }

  function clearDragCursor(cm) {
    if (cm.display.dragCursor) {
      cm.display.lineSpace.removeChild(cm.display.dragCursor);
      cm.display.dragCursor = null;
    }
  }

  // SCROLL EVENTS

  // Sync the scrollable area and scrollbars, ensure the viewport
  // covers the visible area.
  function setScrollTop(cm, val) {
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
    cm.doc.scrollTop = val;
    if (!gecko) updateDisplaySimple(cm, {top: val});
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    cm.display.scrollbars.setScrollTop(val);
    if (gecko) updateDisplaySimple(cm);
    startWorker(cm, 100);
  }
  // Sync scroller and scrollbar, ensure the gutter elements are
  // aligned.
  function setScrollLeft(cm, val, isScroller) {
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
    cm.display.scrollbars.setScrollLeft(val);
  }

  // Since the delta values reported on mouse wheel events are
  // unstandardized between browsers and even browser versions, and
  // generally horribly unpredictable, this code starts by measuring
  // the scroll effect that the first few mouse wheel events have,
  // and, from that, detects the way it can convert deltas to pixel
  // offsets afterwards.
  //
  // The reason we want to know the amount a wheel event will scroll
  // is that it gives us a chance to update the display before the
  // actual scrolling happens, reducing flickering.

  var wheelSamples = 0, wheelPixelsPerUnit = null;
  // Fill in a browser-detected starting value on browsers where we
  // know one. These don't have to be accurate -- the result of them
  // being wrong would just be a slight flicker on the first wheel
  // scroll (if it is large enough).
  if (ie) wheelPixelsPerUnit = -.53;
  else if (gecko) wheelPixelsPerUnit = 15;
  else if (chrome) wheelPixelsPerUnit = -.7;
  else if (safari) wheelPixelsPerUnit = -1/3;

  var wheelEventDelta = function(e) {
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
    else if (dy == null) dy = e.wheelDelta;
    return {x: dx, y: dy};
  };
  CodeMirror.wheelEventPixels = function(e) {
    var delta = wheelEventDelta(e);
    delta.x *= wheelPixelsPerUnit;
    delta.y *= wheelPixelsPerUnit;
    return delta;
  };

  function onScrollWheel(cm, e) {
    var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;

    var display = cm.display, scroll = display.scroller;
    // Quit if there's nothing to scroll here
    var canScrollX = scroll.scrollWidth > scroll.clientWidth;
    var canScrollY = scroll.scrollHeight > scroll.clientHeight;
    if (!(dx && canScrollX || dy && canScrollY)) return;

    // Webkit browsers on OS X abort momentum scrolls when the target
    // of the scroll event is removed from the scrollable element.
    // This hack (see related code in patchDisplay) makes sure the
    // element is kept around.
    if (dy && mac && webkit) {
      outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
        for (var i = 0; i < view.length; i++) {
          if (view[i].node == cur) {
            cm.display.currentWheelTarget = cur;
            break outer;
          }
        }
      }
    }

    // On some browsers, horizontal scrolling will cause redraws to
    // happen before the gutter has been realigned, causing it to
    // wriggle around in a most unseemly way. When we have an
    // estimated pixels/delta value, we just handle horizontal
    // scrolling entirely here. It'll be slightly off from native, but
    // better than glitching out.
    if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
      if (dy && canScrollY)
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      // Only prevent default scrolling if vertical scrolling is
      // actually possible. Otherwise, it causes vertical scroll
      // jitter on OSX trackpads when deltaX is small and deltaY
      // is large (issue #3579)
      if (!dy || (dy && canScrollY))
        e_preventDefault(e);
      display.wheelStartX = null; // Abort measurement, if in progress
      return;
    }

    // 'Project' the visible viewport to cover the area that is being
    // scrolled into view (if we know enough to estimate it).
    if (dy && wheelPixelsPerUnit != null) {
      var pixels = dy * wheelPixelsPerUnit;
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
      if (pixels < 0) top = Math.max(0, top + pixels - 50);
      else bot = Math.min(cm.doc.height, bot + pixels + 50);
      updateDisplaySimple(cm, {top: top, bottom: bot});
    }

    if (wheelSamples < 20) {
      if (display.wheelStartX == null) {
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
        display.wheelDX = dx; display.wheelDY = dy;
        setTimeout(function() {
          if (display.wheelStartX == null) return;
          var movedX = scroll.scrollLeft - display.wheelStartX;
          var movedY = scroll.scrollTop - display.wheelStartY;
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
            (movedX && display.wheelDX && movedX / display.wheelDX);
          display.wheelStartX = display.wheelStartY = null;
          if (!sample) return;
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
          ++wheelSamples;
        }, 200);
      } else {
        display.wheelDX += dx; display.wheelDY += dy;
      }
    }
  }

  // KEY EVENTS

  // Run a handler that was bound to a key.
  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == "string") {
      bound = commands[bound];
      if (!bound) return false;
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    cm.display.input.ensurePolled();
    var prevShift = cm.display.shift, done = false;
    try {
      if (cm.isReadOnly()) cm.state.suppressEdits = true;
      if (dropShift) cm.display.shift = false;
      done = bound(cm) != Pass;
    } finally {
      cm.display.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done;
  }

  function lookupKeyForEditor(cm, name, handle) {
    for (var i = 0; i < cm.state.keyMaps.length; i++) {
      var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
      if (result) return result;
    }
    return (cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm))
      || lookupKey(name, cm.options.keyMap, handle, cm);
  }

  var stopSeq = new Delayed;
  function dispatchKey(cm, name, e, handle) {
    var seq = cm.state.keySeq;
    if (seq) {
      if (isModifierKey(name)) return "handled";
      stopSeq.set(50, function() {
        if (cm.state.keySeq == seq) {
          cm.state.keySeq = null;
          cm.display.input.reset();
        }
      });
      name = seq + " " + name;
    }
    var result = lookupKeyForEditor(cm, name, handle);

    if (result == "multi")
      cm.state.keySeq = name;
    if (result == "handled")
      signalLater(cm, "keyHandled", cm, name, e);

    if (result == "handled" || result == "multi") {
      e_preventDefault(e);
      restartBlink(cm);
    }

    if (seq && !result && /\'$/.test(name)) {
      e_preventDefault(e);
      return true;
    }
    return !!result;
  }

  // Handle a key from the keydown event.
  function handleKeyBinding(cm, e) {
    var name = keyName(e, true);
    if (!name) return false;

    if (e.shiftKey && !cm.state.keySeq) {
      // First try to resolve full name (including 'Shift-'). Failing
      // that, see if there is a cursor-motion command (starting with
      // 'go') bound to the keyname without 'Shift-'.
      return dispatchKey(cm, "Shift-" + name, e, function(b) {return doHandleBinding(cm, b, true);})
          || dispatchKey(cm, name, e, function(b) {
               if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                 return doHandleBinding(cm, b);
             });
    } else {
      return dispatchKey(cm, name, e, function(b) { return doHandleBinding(cm, b); });
    }
  }

  // Handle a key from the keypress event
  function handleCharBinding(cm, e, ch) {
    return dispatchKey(cm, "'" + ch + "'", e,
                       function(b) { return doHandleBinding(cm, b, true); });
  }

  var lastStoppedKey = null;
  function onKeyDown(e) {
    var cm = this;
    cm.curOp.focus = activeElt();
    if (signalDOMEvent(cm, e)) return;
    // IE does strange things with escape.
    if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
    var code = e.keyCode;
    cm.display.shift = code == 16 || e.shiftKey;
    var handled = handleKeyBinding(cm, e);
    if (presto) {
      lastStoppedKey = handled ? code : null;
      // Opera has no cut event... we try to at least catch the key combo
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
        cm.replaceSelection("", null, "cut");
    }

    // Turn mouse into crosshair when Alt is held on Mac.
    if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
      showCrossHair(cm);
  }

  function showCrossHair(cm) {
    var lineDiv = cm.display.lineDiv;
    addClass(lineDiv, "CodeMirror-crosshair");

    function up(e) {
      if (e.keyCode == 18 || !e.altKey) {
        rmClass(lineDiv, "CodeMirror-crosshair");
        off(document, "keyup", up);
        off(document, "mouseover", up);
      }
    }
    on(document, "keyup", up);
    on(document, "mouseover", up);
  }

  function onKeyUp(e) {
    if (e.keyCode == 16) this.doc.sel.shift = false;
    signalDOMEvent(this, e);
  }

  function onKeyPress(e) {
    var cm = this;
    if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
    var keyCode = e.keyCode, charCode = e.charCode;
    if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
    if ((presto && (!e.which || e.which < 10)) && handleKeyBinding(cm, e)) return;
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
    if (handleCharBinding(cm, e, ch)) return;
    cm.display.input.onKeyPress(e);
  }

  // FOCUS/BLUR EVENTS

  function delayBlurEvent(cm) {
    cm.state.delayingBlurEvent = true;
    setTimeout(function() {
      if (cm.state.delayingBlurEvent) {
        cm.state.delayingBlurEvent = false;
        onBlur(cm);
      }
    }, 100);
  }

  function onFocus(cm) {
    if (cm.state.delayingBlurEvent) cm.state.delayingBlurEvent = false;

    if (cm.options.readOnly == "nocursor") return;
    if (!cm.state.focused) {
      signal(cm, "focus", cm);
      cm.state.focused = true;
      addClass(cm.display.wrapper, "CodeMirror-focused");
      // This test prevents this from firing when a context
      // menu is closed (since the input reset would kill the
      // select-all detection hack)
      if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
        cm.display.input.reset();
        if (webkit) setTimeout(function() { cm.display.input.reset(true); }, 20); // Issue #1730
      }
      cm.display.input.receivedFocus();
    }
    restartBlink(cm);
  }
  function onBlur(cm) {
    if (cm.state.delayingBlurEvent) return;

    if (cm.state.focused) {
      signal(cm, "blur", cm);
      cm.state.focused = false;
      rmClass(cm.display.wrapper, "CodeMirror-focused");
    }
    clearInterval(cm.display.blinker);
    setTimeout(function() {if (!cm.state.focused) cm.display.shift = false;}, 150);
  }

  // CONTEXT MENU HANDLING

  // To make the context menu work, we need to briefly unhide the
  // textarea (making it as unobtrusive as possible) to let the
  // right-click take effect on it.
  function onContextMenu(cm, e) {
    if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) return;
    if (signalDOMEvent(cm, e, "contextmenu")) return;
    cm.display.input.onContextMenu(e);
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, "gutterContextMenu")) return false;
    return gutterEvent(cm, e, "gutterContextMenu", false);
  }

  // UPDATING

  // Compute the position of the end of a change (its 'to' property
  // refers to the pre-change end).
  var changeEnd = CodeMirror.changeEnd = function(change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1,
               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
  };

  // Adjust a position to refer to the post-change position of the
  // same text, or the end of the change if the change covers it.
  function adjustForChange(pos, change) {
    if (cmp(pos, change.from) < 0) return pos;
    if (cmp(pos, change.to) <= 0) return changeEnd(change);

    var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
    if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
    return Pos(line, ch);
  }

  function computeSelAfterChange(doc, change) {
    var out = [];
    for (var i = 0; i < doc.sel.ranges.length; i++) {
      var range = doc.sel.ranges[i];
      out.push(new Range(adjustForChange(range.anchor, change),
                         adjustForChange(range.head, change)));
    }
    return normalizeSelection(out, doc.sel.primIndex);
  }

  function offsetPos(pos, old, nw) {
    if (pos.line == old.line)
      return Pos(nw.line, pos.ch - old.ch + nw.ch);
    else
      return Pos(nw.line + (pos.line - old.line), pos.ch);
  }

  // Used by replaceSelections to allow moving the selection to the
  // start or around the replaced test. Hint may be "start" or "around".
  function computeReplacedSel(doc, changes, hint) {
    var out = [];
    var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      var from = offsetPos(change.from, oldPrev, newPrev);
      var to = offsetPos(changeEnd(change), oldPrev, newPrev);
      oldPrev = change.to;
      newPrev = to;
      if (hint == "around") {
        var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
        out[i] = new Range(inv ? to : from, inv ? from : to);
      } else {
        out[i] = new Range(from, from);
      }
    }
    return new Selection(out, doc.sel.primIndex);
  }

  // Allow "beforeChange" event handlers to influence a change
  function filterChange(doc, change, update) {
    var obj = {
      canceled: false,
      from: change.from,
      to: change.to,
      text: change.text,
      origin: change.origin,
      cancel: function() { this.canceled = true; }
    };
    if (update) obj.update = function(from, to, text, origin) {
      if (from) this.from = clipPos(doc, from);
      if (to) this.to = clipPos(doc, to);
      if (text) this.text = text;
      if (origin !== undefined) this.origin = origin;
    };
    signal(doc, "beforeChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

    if (obj.canceled) return null;
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
  }

  // Apply a change to a document, and add it to the document's
  // history, and propagating it to all linked documents.
  function makeChange(doc, change, ignoreReadOnly) {
    if (doc.cm) {
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
      if (doc.cm.state.suppressEdits) return;
    }

    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
      change = filterChange(doc, change, true);
      if (!change) return;
    }

    // Possibly split or suppress the update based on the presence
    // of read-only spans in its range.
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
    if (split) {
      for (var i = split.length - 1; i >= 0; --i)
        makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text});
    } else {
      makeChangeInner(doc, change);
    }
  }

  function makeChangeInner(doc, change) {
    if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
    var selAfter = computeSelAfterChange(doc, change);
    addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
    var rebased = [];

    linkedDocs(doc, function(doc, sharedHist) {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
    });
  }

  // Revert a change stored in a document's history.
  function makeChangeFromHistory(doc, type, allowSelectionOnly) {
    if (doc.cm && doc.cm.state.suppressEdits) return;

    var hist = doc.history, event, selAfter = doc.sel;
    var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;

    // Verify that there is a useable event (so that ctrl-z won't
    // needlessly clear selection events)
    for (var i = 0; i < source.length; i++) {
      event = source[i];
      if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
        break;
    }
    if (i == source.length) return;
    hist.lastOrigin = hist.lastSelOrigin = null;

    for (;;) {
      event = source.pop();
      if (event.ranges) {
        pushSelectionToHistory(event, dest);
        if (allowSelectionOnly && !event.equals(doc.sel)) {
          setSelection(doc, event, {clearRedo: false});
          return;
        }
        selAfter = event;
      }
      else break;
    }

    // Build up a reverse change object to add to the opposite history
    // stack (redo when undoing, and vice versa).
    var antiChanges = [];
    pushSelectionToHistory(selAfter, dest);
    dest.push({changes: antiChanges, generation: hist.generation});
    hist.generation = event.generation || ++hist.maxGeneration;

    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

    for (var i = event.changes.length - 1; i >= 0; --i) {
      var change = event.changes[i];
      change.origin = type;
      if (filter && !filterChange(doc, change, false)) {
        source.length = 0;
        return;
      }

      antiChanges.push(historyChangeFromChange(doc, change));

      var after = i ? computeSelAfterChange(doc, change) : lst(source);
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
      if (!i && doc.cm) doc.cm.scrollIntoView({from: change.from, to: changeEnd(change)});
      var rebased = [];

      // Propagate to the linked documents
      linkedDocs(doc, function(doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
      });
    }
  }

  // Sub-views need their line numbers shifted when text is added
  // above or below them in the parent document.
  function shiftDoc(doc, distance) {
    if (distance == 0) return;
    doc.first += distance;
    doc.sel = new Selection(map(doc.sel.ranges, function(range) {
      return new Range(Pos(range.anchor.line + distance, range.anchor.ch),
                       Pos(range.head.line + distance, range.head.ch));
    }), doc.sel.primIndex);
    if (doc.cm) {
      regChange(doc.cm, doc.first, doc.first - distance, distance);
      for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
        regLineChange(doc.cm, l, "gutter");
    }
  }

  // More lower-level change function, handling only a single document
  // (not linked ones).
  function makeChangeSingleDoc(doc, change, selAfter, spans) {
    if (doc.cm && !doc.cm.curOp)
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

    if (change.to.line < doc.first) {
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
      return;
    }
    if (change.from.line > doc.lastLine()) return;

    // Clip the change to the size of this doc
    if (change.from.line < doc.first) {
      var shift = change.text.length - 1 - (doc.first - change.from.line);
      shiftDoc(doc, shift);
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                text: [lst(change.text)], origin: change.origin};
    }
    var last = doc.lastLine();
    if (change.to.line > last) {
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                text: [change.text[0]], origin: change.origin};
    }

    change.removed = getBetween(doc, change.from, change.to);

    if (!selAfter) selAfter = computeSelAfterChange(doc, change);
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
    else updateDoc(doc, change, spans);
    setSelectionNoUndo(doc, selAfter, sel_dontScroll);
  }

  // Handle the interaction of a change to a document with the editor
  // that this document is part of.
  function makeChangeSingleDocInEditor(cm, change, spans) {
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

    var recomputeMaxLength = false, checkWidthStart = from.line;
    if (!cm.options.lineWrapping) {
      checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
      doc.iter(checkWidthStart, to.line + 1, function(line) {
        if (line == display.maxLine) {
          recomputeMaxLength = true;
          return true;
        }
      });
    }

    if (doc.sel.contains(change.from, change.to) > -1)
      signalCursorActivity(cm);

    updateDoc(doc, change, spans, estimateHeight(cm));

    if (!cm.options.lineWrapping) {
      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
        var len = lineLength(line);
        if (len > display.maxLineLength) {
          display.maxLine = line;
          display.maxLineLength = len;
          display.maxLineChanged = true;
          recomputeMaxLength = false;
        }
      });
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
    }

    // Adjust frontier, schedule worker
    doc.frontier = Math.min(doc.frontier, from.line);
    startWorker(cm, 400);

    var lendiff = change.text.length - (to.line - from.line) - 1;
    // Remember that these lines changed, for updating the display
    if (change.full)
      regChange(cm);
    else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
      regLineChange(cm, from.line, "text");
    else
      regChange(cm, from.line, to.line + 1, lendiff);

    var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
    if (changeHandler || changesHandler) {
      var obj = {
        from: from, to: to,
        text: change.text,
        removed: change.removed,
        origin: change.origin
      };
      if (changeHandler) signalLater(cm, "change", cm, obj);
      if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
    }
    cm.display.selForContextMenu = null;
  }

  function replaceRange(doc, code, from, to, origin) {
    if (!to) to = from;
    if (cmp(to, from) < 0) { var tmp = to; to = from; from = tmp; }
    if (typeof code == "string") code = doc.splitLines(code);
    makeChange(doc, {from: from, to: to, text: code, origin: origin});
  }

  // SCROLLING THINGS INTO VIEW

  // If an editor sits on the top or bottom of the window, partially
  // scrolled out of view, this ensures that the cursor is visible.
  function maybeScrollWindow(cm, coords) {
    if (signalDOMEvent(cm, "scrollCursorIntoView")) return;

    var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
    if (coords.top + box.top < 0) doScroll = true;
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {
      var scrollNode = elt("div", "\u200b", null, "position: absolute; top: " +
                           (coords.top - display.viewOffset - paddingTop(cm.display)) + "px; height: " +
                           (coords.bottom - coords.top + scrollGap(cm) + display.barHeight) + "px; left: " +
                           coords.left + "px; width: 2px;");
      cm.display.lineSpace.appendChild(scrollNode);
      scrollNode.scrollIntoView(doScroll);
      cm.display.lineSpace.removeChild(scrollNode);
    }
  }

  // Scroll a given position into view (immediately), verifying that
  // it actually became visible (as line heights are accurately
  // measured, the position of something may 'drift' during drawing).
  function scrollPosIntoView(cm, pos, end, margin) {
    if (margin == null) margin = 0;
    for (var limit = 0; limit < 5; limit++) {
      var changed = false, coords = cursorCoords(cm, pos);
      var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
      var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
                                         Math.min(coords.top, endCoords.top) - margin,
                                         Math.max(coords.left, endCoords.left),
                                         Math.max(coords.bottom, endCoords.bottom) + margin);
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
      if (scrollPos.scrollTop != null) {
        setScrollTop(cm, scrollPos.scrollTop);
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
      }
      if (scrollPos.scrollLeft != null) {
        setScrollLeft(cm, scrollPos.scrollLeft);
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
      }
      if (!changed) break;
    }
    return coords;
  }

  // Scroll a given set of coordinates into view (immediately).
  function scrollIntoView(cm, x1, y1, x2, y2) {
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
  }

  // Calculate a new scroll position needed to scroll the given
  // rectangle into view. Returns an object with scrollTop and
  // scrollLeft properties. When these are undefined, the
  // vertical/horizontal position does not need to be adjusted.
  function calculateScrollPos(cm, x1, y1, x2, y2) {
    var display = cm.display, snapMargin = textHeight(cm.display);
    if (y1 < 0) y1 = 0;
    var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
    var screen = displayHeight(cm), result = {};
    if (y2 - y1 > screen) y2 = y1 + screen;
    var docBottom = cm.doc.height + paddingVert(display);
    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
    if (y1 < screentop) {
      result.scrollTop = atTop ? 0 : y1;
    } else if (y2 > screentop + screen) {
      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
      if (newTop != screentop) result.scrollTop = newTop;
    }

    var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
    var screenw = displayWidth(cm) - (cm.options.fixedGutter ? display.gutters.offsetWidth : 0);
    var tooWide = x2 - x1 > screenw;
    if (tooWide) x2 = x1 + screenw;
    if (x1 < 10)
      result.scrollLeft = 0;
    else if (x1 < screenleft)
      result.scrollLeft = Math.max(0, x1 - (tooWide ? 0 : 10));
    else if (x2 > screenw + screenleft - 3)
      result.scrollLeft = x2 + (tooWide ? 0 : 10) - screenw;
    return result;
  }

  // Store a relative adjustment to the scroll position in the current
  // operation (to be applied when the operation finishes).
  function addToScrollPos(cm, left, top) {
    if (left != null || top != null) resolveScrollToPos(cm);
    if (left != null)
      cm.curOp.scrollLeft = (cm.curOp.scrollLeft == null ? cm.doc.scrollLeft : cm.curOp.scrollLeft) + left;
    if (top != null)
      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
  }

  // Make sure that at the end of the operation the current cursor is
  // shown.
  function ensureCursorVisible(cm) {
    resolveScrollToPos(cm);
    var cur = cm.getCursor(), from = cur, to = cur;
    if (!cm.options.lineWrapping) {
      from = cur.ch ? Pos(cur.line, cur.ch - 1) : cur;
      to = Pos(cur.line, cur.ch + 1);
    }
    cm.curOp.scrollToPos = {from: from, to: to, margin: cm.options.cursorScrollMargin, isCursor: true};
  }

  // When an operation has its scrollToPos property set, and another
  // scroll action is applied before the end of the operation, this
  // 'simulates' scrolling that position into view in a cheap way, so
  // that the effect of intermediate scroll commands is not ignored.
  function resolveScrollToPos(cm) {
    var range = cm.curOp.scrollToPos;
    if (range) {
      cm.curOp.scrollToPos = null;
      var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
      var sPos = calculateScrollPos(cm, Math.min(from.left, to.left),
                                    Math.min(from.top, to.top) - range.margin,
                                    Math.max(from.right, to.right),
                                    Math.max(from.bottom, to.bottom) + range.margin);
      cm.scrollTo(sPos.scrollLeft, sPos.scrollTop);
    }
  }

  // API UTILITIES

  // Indent the given line. The how parameter can be "smart",
  // "add"/null, "subtract", or "prev". When aggressive is false
  // (typically set to true for forced single-line indents), empty
  // lines are not indented, and places where the mode returns Pass
  // are left alone.
  function indentLine(cm, n, how, aggressive) {
    var doc = cm.doc, state;
    if (how == null) how = "add";
    if (how == "smart") {
      // Fall back to "prev" when the mode doesn't have an indentation
      // method.
      if (!doc.mode.indent) how = "prev";
      else state = getStateBefore(cm, n);
    }

    var tabSize = cm.options.tabSize;
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
    if (line.stateAfter) line.stateAfter = null;
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
    if (!aggressive && !/\S/.test(line.text)) {
      indentation = 0;
      how = "not";
    } else if (how == "smart") {
      indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
      if (indentation == Pass || indentation > 150) {
        if (!aggressive) return;
        how = "prev";
      }
    }
    if (how == "prev") {
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
      else indentation = 0;
    } else if (how == "add") {
      indentation = curSpace + cm.options.indentUnit;
    } else if (how == "subtract") {
      indentation = curSpace - cm.options.indentUnit;
    } else if (typeof how == "number") {
      indentation = curSpace + how;
    }
    indentation = Math.max(0, indentation);

    var indentString = "", pos = 0;
    if (cm.options.indentWithTabs)
      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
    if (pos < indentation) indentString += spaceStr(indentation - pos);

    if (indentString != curSpaceString) {
      replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
      line.stateAfter = null;
      return true;
    } else {
      // Ensure that, if the cursor was in the whitespace at the start
      // of the line, it is moved to the end of that space.
      for (var i = 0; i < doc.sel.ranges.length; i++) {
        var range = doc.sel.ranges[i];
        if (range.head.line == n && range.head.ch < curSpaceString.length) {
          var pos = Pos(n, curSpaceString.length);
          replaceOneSelection(doc, i, new Range(pos, pos));
          break;
        }
      }
    }
  }

  // Utility for applying a change to a line by handle or number,
  // returning the number and optionally registering the line as
  // changed.
  function changeLine(doc, handle, changeType, op) {
    var no = handle, line = handle;
    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
    else no = lineNo(handle);
    if (no == null) return null;
    if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
    return line;
  }

  // Helper for deleting text near the selection(s), used to implement
  // backspace, delete, and similar functionality.
  function deleteNearSelection(cm, compute) {
    var ranges = cm.doc.sel.ranges, kill = [];
    // Build up a set of ranges to kill first, merging overlapping
    // ranges.
    for (var i = 0; i < ranges.length; i++) {
      var toKill = compute(ranges[i]);
      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
        var replaced = kill.pop();
        if (cmp(replaced.from, toKill.from) < 0) {
          toKill.from = replaced.from;
          break;
        }
      }
      kill.push(toKill);
    }
    // Next, remove those actual ranges.
    runInOp(cm, function() {
      for (var i = kill.length - 1; i >= 0; i--)
        replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
      ensureCursorVisible(cm);
    });
  }

  // Used for horizontal relative motion. Dir is -1 or 1 (left or
  // right), unit can be "char", "column" (like char, but doesn't
  // cross line boundaries), "word" (across next word), or "group" (to
  // the start of next group of word or non-word-non-whitespace
  // chars). The visually param controls whether, in right-to-left
  // text, direction 1 means to move towards the next index in the
  // string, or towards the character to the right of the current
  // position. The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosH(doc, pos, dir, unit, visually) {
    var line = pos.line, ch = pos.ch, origDir = dir;
    var lineObj = getLine(doc, line);
    var possible = true;
    function findNextLine() {
      var l = line + dir;
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
      line = l;
      return lineObj = getLine(doc, l);
    }
    function moveOnce(boundToLine) {
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
      if (next == null) {
        if (!boundToLine && findNextLine()) {
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
          else ch = dir < 0 ? lineObj.text.length : 0;
        } else return (possible = false);
      } else ch = next;
      return true;
    }

    if (unit == "char") moveOnce();
    else if (unit == "column") moveOnce(true);
    else if (unit == "word" || unit == "group") {
      var sawType = null, group = unit == "group";
      var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
      for (var first = true;; first = false) {
        if (dir < 0 && !moveOnce(!first)) break;
        var cur = lineObj.text.charAt(ch) || "\n";
        var type = isWordChar(cur, helper) ? "w"
          : group && cur == "\n" ? "n"
          : !group || /\s/.test(cur) ? null
          : "p";
        if (group && !first && !type) type = "s";
        if (sawType && sawType != type) {
          if (dir < 0) {dir = 1; moveOnce();}
          break;
        }

        if (type) sawType = type;
        if (dir > 0 && !moveOnce(!first)) break;
      }
    }
    var result = skipAtomic(doc, Pos(line, ch), pos, origDir, true);
    if (!possible) result.hitSide = true;
    return result;
  }

  // For relative vertical movement. Dir may be -1 or 1. Unit can be
  // "page" or "line". The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosV(cm, pos, dir, unit) {
    var doc = cm.doc, x = pos.left, y;
    if (unit == "page") {
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
    } else if (unit == "line") {
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
    }
    for (;;) {
      var target = coordsChar(cm, x, y);
      if (!target.outside) break;
      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
      y += dir * 5;
    }
    return target;
  }

  // EDITOR METHODS

  // The publicly visible API. Note that methodOp(f) means
  // 'wrap f in an operation, performed on its `this` parameter'.

  // This is not the complete set of editor methods. Most of the
  // methods defined on the Doc type are also injected into
  // CodeMirror.prototype, for backwards compatibility and
  // convenience.

  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function(){window.focus(); this.display.input.focus();},

    setOption: function(option, value) {
      var options = this.options, old = options[option];
      if (options[option] == value && option != "mode") return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option))
        operation(this, optionHandlers[option])(this, value, old);
    },

    getOption: function(option) {return this.options[option];},
    getDoc: function() {return this.doc;},

    addKeyMap: function(map, bottom) {
      this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
    },
    removeKeyMap: function(map) {
      var maps = this.state.keyMaps;
      for (var i = 0; i < maps.length; ++i)
        if (maps[i] == map || maps[i].name == map) {
          maps.splice(i, 1);
          return true;
        }
    },

    addOverlay: methodOp(function(spec, options) {
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error("Overlays may not be stateful.");
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: methodOp(function(spec) {
      var overlays = this.state.overlays;
      for (var i = 0; i < overlays.length; ++i) {
        var cur = overlays[i].modeSpec;
        if (cur == spec || typeof spec == "string" && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),

    indentLine: methodOp(function(n, dir, aggressive) {
      if (typeof dir != "string" && typeof dir != "number") {
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
        else dir = dir ? "add" : "subtract";
      }
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: methodOp(function(how) {
      var ranges = this.doc.sel.ranges, end = -1;
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (!range.empty()) {
          var from = range.from(), to = range.to();
          var start = Math.max(end, from.line);
          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
          for (var j = start; j < end; ++j)
            indentLine(this, j, how);
          var newRanges = this.doc.sel.ranges;
          if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
            replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
        } else if (range.head.line > end) {
          indentLine(this, range.head.line, how, true);
          end = range.head.line;
          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
        }
      }
    }),

    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function(pos, precise) {
      return takeToken(this, pos, precise);
    },

    getLineTokens: function(line, precise) {
      return takeToken(this, Pos(line), precise, true);
    },

    getTokenTypeAt: function(pos) {
      pos = clipPos(this.doc, pos);
      var styles = getLineStyles(this, getLine(this.doc, pos.line));
      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
      var type;
      if (ch == 0) type = styles[2];
      else for (;;) {
        var mid = (before + after) >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
        else { type = styles[mid * 2 + 2]; break; }
      }
      var cut = type ? type.indexOf("cm-overlay ") : -1;
      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
    },

    getModeAt: function(pos) {
      var mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },

    getHelper: function(pos, type) {
      return this.getHelpers(pos, type)[0];
    },

    getHelpers: function(pos, type) {
      var found = [];
      if (!helpers.hasOwnProperty(type)) return found;
      var help = helpers[type], mode = this.getModeAt(pos);
      if (typeof mode[type] == "string") {
        if (help[mode[type]]) found.push(help[mode[type]]);
      } else if (mode[type]) {
        for (var i = 0; i < mode[type].length; i++) {
          var val = help[mode[type][i]];
          if (val) found.push(val);
        }
      } else if (mode.helperType && help[mode.helperType]) {
        found.push(help[mode.helperType]);
      } else if (help[mode.name]) {
        found.push(help[mode.name]);
      }
      for (var i = 0; i < help._global.length; i++) {
        var cur = help._global[i];
        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1)
          found.push(cur.val);
      }
      return found;
    },

    getStateAfter: function(line, precise) {
      var doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
      return getStateBefore(this, line + 1, precise);
    },

    cursorCoords: function(start, mode) {
      var pos, range = this.doc.sel.primary();
      if (start == null) pos = range.head;
      else if (typeof start == "object") pos = clipPos(this.doc, start);
      else pos = start ? range.from() : range.to();
      return cursorCoords(this, pos, mode || "page");
    },

    charCoords: function(pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || "page");
    },

    coordsChar: function(coords, mode) {
      coords = fromCoordSystem(this, coords, mode || "page");
      return coordsChar(this, coords.left, coords.top);
    },

    lineAtHeight: function(height, mode) {
      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function(line, mode) {
      var end = false, lineObj;
      if (typeof line == "number") {
        var last = this.doc.first + this.doc.size - 1;
        if (line < this.doc.first) line = this.doc.first;
        else if (line > last) { line = last; end = true; }
        lineObj = getLine(this.doc, line);
      } else {
        lineObj = line;
      }
      return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page").top +
        (end ? this.doc.height - heightAtLine(lineObj) : 0);
    },

    defaultTextHeight: function() { return textHeight(this.display); },
    defaultCharWidth: function() { return charWidth(this.display); },

    setGutterMarker: methodOp(function(line, gutterID, value) {
      return changeLine(this.doc, line, "gutter", function(line) {
        var markers = line.gutterMarkers || (line.gutterMarkers = {});
        markers[gutterID] = value;
        if (!value && isEmpty(markers)) line.gutterMarkers = null;
        return true;
      });
    }),

    clearGutter: methodOp(function(gutterID) {
      var cm = this, doc = cm.doc, i = doc.first;
      doc.iter(function(line) {
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
          line.gutterMarkers[gutterID] = null;
          regLineChange(cm, i, "gutter");
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
        }
        ++i;
      });
    }),

    lineInfo: function(line) {
      if (typeof line == "number") {
        if (!isLine(this.doc, line)) return null;
        var n = line;
        line = getLine(this.doc, line);
        if (!line) return null;
      } else {
        var n = lineNo(line);
        if (n == null) return null;
      }
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
              widgets: line.widgets};
    },

    getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo};},

    addWidget: function(pos, node, scroll, vert, horiz) {
      var display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      var top = pos.bottom, left = pos.left;
      node.style.position = "absolute";
      node.setAttribute("cm-ignore-events", "true");
      this.display.input.setUneditable(node);
      display.sizer.appendChild(node);
      if (vert == "over") {
        top = pos.top;
      } else if (vert == "above" || vert == "near") {
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
        // Default to positioning above (if specified and possible); otherwise default to positioning below
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
          top = pos.top - node.offsetHeight;
        else if (pos.bottom + node.offsetHeight <= vspace)
          top = pos.bottom;
        if (left + node.offsetWidth > hspace)
          left = hspace - node.offsetWidth;
      }
      node.style.top = top + "px";
      node.style.left = node.style.right = "";
      if (horiz == "right") {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = "0px";
      } else {
        if (horiz == "left") left = 0;
        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = left + "px";
      }
      if (scroll)
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
    },

    triggerOnKeyDown: methodOp(onKeyDown),
    triggerOnKeyPress: methodOp(onKeyPress),
    triggerOnKeyUp: onKeyUp,

    execCommand: function(cmd) {
      if (commands.hasOwnProperty(cmd))
        return commands[cmd].call(null, this);
    },

    triggerElectric: methodOp(function(text) { triggerElectric(this, text); }),

    findPosH: function(from, amount, unit, visually) {
      var dir = 1;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveH: methodOp(function(dir, unit) {
      var cm = this;
      cm.extendSelectionsBy(function(range) {
        if (cm.display.shift || cm.doc.extend || range.empty())
          return findPosH(cm.doc, range.head, dir, unit, cm.options.rtlMoveVisually);
        else
          return dir < 0 ? range.from() : range.to();
      }, sel_move);
    }),

    deleteH: methodOp(function(dir, unit) {
      var sel = this.doc.sel, doc = this.doc;
      if (sel.somethingSelected())
        doc.replaceSelection("", null, "+delete");
      else
        deleteNearSelection(this, function(range) {
          var other = findPosH(doc, range.head, dir, unit, false);
          return dir < 0 ? {from: other, to: range.head} : {from: range.head, to: other};
        });
    }),

    findPosV: function(from, amount, unit, goalColumn) {
      var dir = 1, x = goalColumn;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        var coords = cursorCoords(this, cur, "div");
        if (x == null) x = coords.left;
        else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveV: methodOp(function(dir, unit) {
      var cm = this, doc = this.doc, goals = [];
      var collapse = !cm.display.shift && !doc.extend && doc.sel.somethingSelected();
      doc.extendSelectionsBy(function(range) {
        if (collapse)
          return dir < 0 ? range.from() : range.to();
        var headPos = cursorCoords(cm, range.head, "div");
        if (range.goalColumn != null) headPos.left = range.goalColumn;
        goals.push(headPos.left);
        var pos = findPosV(cm, headPos, dir, unit);
        if (unit == "page" && range == doc.sel.primary())
          addToScrollPos(cm, null, charCoords(cm, pos, "div").top - headPos.top);
        return pos;
      }, sel_move);
      if (goals.length) for (var i = 0; i < doc.sel.ranges.length; i++)
        doc.sel.ranges[i].goalColumn = goals[i];
    }),

    // Find the word at the given position (as returned by coordsChar).
    findWordAt: function(pos) {
      var doc = this.doc, line = getLine(doc, pos.line).text;
      var start = pos.ch, end = pos.ch;
      if (line) {
        var helper = this.getHelper(pos, "wordChars");
        if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
        var startChar = line.charAt(start);
        var check = isWordChar(startChar, helper)
          ? function(ch) { return isWordChar(ch, helper); }
          : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
          : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
        while (start > 0 && check(line.charAt(start - 1))) --start;
        while (end < line.length && check(line.charAt(end))) ++end;
      }
      return new Range(Pos(pos.line, start), Pos(pos.line, end));
    },

    toggleOverwrite: function(value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite)
        addClass(this.display.cursorDiv, "CodeMirror-overwrite");
      else
        rmClass(this.display.cursorDiv, "CodeMirror-overwrite");

      signal(this, "overwriteToggle", this, this.state.overwrite);
    },
    hasFocus: function() { return this.display.input.getField() == activeElt(); },
    isReadOnly: function() { return !!(this.options.readOnly || this.doc.cantEdit); },

    scrollTo: methodOp(function(x, y) {
      if (x != null || y != null) resolveScrollToPos(this);
      if (x != null) this.curOp.scrollLeft = x;
      if (y != null) this.curOp.scrollTop = y;
    }),
    getScrollInfo: function() {
      var scroller = this.display.scroller;
      return {left: scroller.scrollLeft, top: scroller.scrollTop,
              height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
              width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
              clientHeight: displayHeight(this), clientWidth: displayWidth(this)};
    },

    scrollIntoView: methodOp(function(range, margin) {
      if (range == null) {
        range = {from: this.doc.sel.primary().head, to: null};
        if (margin == null) margin = this.options.cursorScrollMargin;
      } else if (typeof range == "number") {
        range = {from: Pos(range, 0), to: null};
      } else if (range.from == null) {
        range = {from: range, to: null};
      }
      if (!range.to) range.to = range.from;
      range.margin = margin || 0;

      if (range.from.line != null) {
        resolveScrollToPos(this);
        this.curOp.scrollToPos = range;
      } else {
        var sPos = calculateScrollPos(this, Math.min(range.from.left, range.to.left),
                                      Math.min(range.from.top, range.to.top) - range.margin,
                                      Math.max(range.from.right, range.to.right),
                                      Math.max(range.from.bottom, range.to.bottom) + range.margin);
        this.scrollTo(sPos.scrollLeft, sPos.scrollTop);
      }
    }),

    setSize: methodOp(function(width, height) {
      var cm = this;
      function interpret(val) {
        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
      }
      if (width != null) cm.display.wrapper.style.width = interpret(width);
      if (height != null) cm.display.wrapper.style.height = interpret(height);
      if (cm.options.lineWrapping) clearLineMeasurementCache(this);
      var lineNo = cm.display.viewFrom;
      cm.doc.iter(lineNo, cm.display.viewTo, function(line) {
        if (line.widgets) for (var i = 0; i < line.widgets.length; i++)
          if (line.widgets[i].noHScroll) { regLineChange(cm, lineNo, "widget"); break; }
        ++lineNo;
      });
      cm.curOp.forceUpdate = true;
      signal(cm, "refresh", this);
    }),

    operation: function(f){return runInOp(this, f);},

    refresh: methodOp(function() {
      var oldHeight = this.display.cachedTextHeight;
      regChange(this);
      this.curOp.forceUpdate = true;
      clearCaches(this);
      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
      updateGutterSpace(this);
      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
        estimateLineHeights(this);
      signal(this, "refresh", this);
    }),

    swapDoc: methodOp(function(doc) {
      var old = this.doc;
      old.cm = null;
      attachDoc(this, doc);
      clearCaches(this);
      this.display.input.reset();
      this.scrollTo(doc.scrollLeft, doc.scrollTop);
      this.curOp.forceScroll = true;
      signalLater(this, "swapDoc", this, old);
      return old;
    }),

    getInputField: function(){return this.display.input.getField();},
    getWrapperElement: function(){return this.display.wrapper;},
    getScrollerElement: function(){return this.display.scroller;},
    getGutterElement: function(){return this.display.gutters;}
  };
  eventMixin(CodeMirror);

  // OPTION DEFAULTS

  // The default configuration options.
  var defaults = CodeMirror.defaults = {};
  // Functions to run when options are changed.
  var optionHandlers = CodeMirror.optionHandlers = {};

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] =
      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
  }

  // Passed to option handlers when there is no old value.
  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

  // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.
  option("value", "", function(cm, val) {
    cm.setValue(val);
  }, true);
  option("mode", null, function(cm, val) {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);

  option("indentUnit", 2, loadMode, true);
  option("indentWithTabs", false);
  option("smartIndent", true);
  option("tabSize", 4, function(cm) {
    resetModeState(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option("lineSeparator", null, function(cm, val) {
    cm.doc.lineSep = val;
    if (!val) return;
    var newBreaks = [], lineNo = cm.doc.first;
    cm.doc.iter(function(line) {
      for (var pos = 0;;) {
        var found = line.text.indexOf(val, pos);
        if (found == -1) break;
        pos = found + val.length;
        newBreaks.push(Pos(lineNo, found));
      }
      lineNo++;
    });
    for (var i = newBreaks.length - 1; i >= 0; i--)
      replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length))
  });
  option("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(cm, val, old) {
    cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
    if (old != CodeMirror.Init) cm.refresh();
  });
  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
  option("electricChars", true);
  option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
    throw new Error("inputStyle can not (yet) be changed in a running editor"); // FIXME
  }, true);
  option("rtlMoveVisually", !windows);
  option("wholeLineUpdateBefore", true);

  option("theme", "default", function(cm) {
    themeChanged(cm);
    guttersChanged(cm);
  }, true);
  option("keyMap", "default", function(cm, val, old) {
    var next = getKeyMap(val);
    var prev = old != CodeMirror.Init && getKeyMap(old);
    if (prev && prev.detach) prev.detach(cm, next);
    if (next.attach) next.attach(cm, prev || null);
  });
  option("extraKeys", null);

  option("lineWrapping", false, wrappingChanged, true);
  option("gutters", [], function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("fixedGutter", true, function(cm, val) {
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
    cm.refresh();
  }, true);
  option("coverGutterNextToScrollbar", false, function(cm) {updateScrollbars(cm);}, true);
  option("scrollbarStyle", "native", function(cm) {
    initScrollbars(cm);
    updateScrollbars(cm);
    cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
    cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
  }, true);
  option("lineNumbers", false, function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("firstLineNumber", 1, guttersChanged, true);
  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
  option("showCursorWhenSelecting", false, updateSelection, true);

  option("resetSelectionOnContextMenu", true);
  option("lineWiseCopyCut", true);

  option("readOnly", false, function(cm, val) {
    if (val == "nocursor") {
      onBlur(cm);
      cm.display.input.blur();
      cm.display.disabled = true;
    } else {
      cm.display.disabled = false;
    }
    cm.display.input.readOnlyChanged(val)
  });
  option("disableInput", false, function(cm, val) {if (!val) cm.display.input.reset();}, true);
  option("dragDrop", true, dragDropChanged);
  option("allowDropFileTypes", null);

  option("cursorBlinkRate", 530);
  option("cursorScrollMargin", 0);
  option("cursorHeight", 1, updateSelection, true);
  option("singleCursorHeightPerLine", true, updateSelection, true);
  option("workTime", 100);
  option("workDelay", 100);
  option("flattenSpans", true, resetModeState, true);
  option("addModeClass", false, resetModeState, true);
  option("pollInterval", 100);
  option("undoDepth", 200, function(cm, val){cm.doc.history.undoDepth = val;});
  option("historyEventDelay", 1250);
  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
  option("maxHighlightLength", 10000, resetModeState, true);
  option("moveInputWithCursor", true, function(cm, val) {
    if (!val) cm.display.input.resetPosition();
  });

  option("tabindex", null, function(cm, val) {
    cm.display.input.getField().tabIndex = val || "";
  });
  option("autofocus", null);

  // MODE DEFINITION AND QUERYING

  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

  // Extra arguments are stored as the mode's dependencies, which is
  // used by (legacy) mechanisms like loadmode.js to automatically
  // load a mode. (Preferred mechanism is the require/define calls.)
  CodeMirror.defineMode = function(name, mode) {
    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
    if (arguments.length > 2)
      mode.dependencies = Array.prototype.slice.call(arguments, 2);
    modes[name] = mode;
  };

  CodeMirror.defineMIME = function(mime, spec) {
    mimeModes[mime] = spec;
  };

  // Given a MIME type, a {name, ...options} config object, or a name
  // string, return a mode config object.
  CodeMirror.resolveMode = function(spec) {
    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
      spec = mimeModes[spec];
    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      if (typeof found == "string") found = {name: found};
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
      return CodeMirror.resolveMode("application/xml");
    }
    if (typeof spec == "string") return {name: spec};
    else return spec || {name: "null"};
  };

  // Given a mode spec (anything that resolveMode accepts), find and
  // initialize an actual mode object.
  CodeMirror.getMode = function(options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;
    if (spec.helperType) modeObj.helperType = spec.helperType;
    if (spec.modeProps) for (var prop in spec.modeProps)
      modeObj[prop] = spec.modeProps[prop];

    return modeObj;
  };

  // Minimal default mode.
  CodeMirror.defineMode("null", function() {
    return {token: function(stream) {stream.skipToEnd();}};
  });
  CodeMirror.defineMIME("text/plain", "null");

  // This can be used to attach properties to mode objects from
  // outside the actual mode definition.
  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function(mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
    copyObj(properties, exts);
  };

  // EXTENSIONS

  CodeMirror.defineExtension = function(name, func) {
    CodeMirror.prototype[name] = func;
  };
  CodeMirror.defineDocExtension = function(name, func) {
    Doc.prototype[name] = func;
  };
  CodeMirror.defineOption = option;

  var initHooks = [];
  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function(type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {_global: []};
    helpers[type][name] = value;
  };
  CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
    CodeMirror.registerHelper(type, name, value);
    helpers[type]._global.push({pred: predicate, val: value});
  };

  // MODE STATE HANDLING

  // Utility functions for working with state. Exported because nested
  // modes need to do this for their inner modes.

  var copyState = CodeMirror.copyState = function(mode, state) {
    if (state === true) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      if (val instanceof Array) val = val.concat([]);
      nstate[n] = val;
    }
    return nstate;
  };

  var startState = CodeMirror.startState = function(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  };

  // Given a mode and a state (for that mode), find the inner mode and
  // state at the position that the state refers to.
  CodeMirror.innerMode = function(mode, state) {
    while (mode.innerMode) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {mode: mode, state: state};
  };

  // STANDARD COMMANDS

  // Commands are parameter-less actions that can be performed on an
  // editor, mostly used for keybindings.
  var commands = CodeMirror.commands = {
    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);},
    singleSelection: function(cm) {
      cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
    },
    killLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        if (range.empty()) {
          var len = getLine(cm.doc, range.head.line).text.length;
          if (range.head.ch == len && range.head.line < cm.lastLine())
            return {from: range.head, to: Pos(range.head.line + 1, 0)};
          else
            return {from: range.head, to: Pos(range.head.line, len)};
        } else {
          return {from: range.from(), to: range.to()};
        }
      });
    },
    deleteLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0),
                to: clipPos(cm.doc, Pos(range.to().line + 1, 0))};
      });
    },
    delLineLeft: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0), to: range.from()};
      });
    },
    delWrappedLineLeft: function(cm) {
      deleteNearSelection(cm, function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var leftPos = cm.coordsChar({left: 0, top: top}, "div");
        return {from: leftPos, to: range.from()};
      });
    },
    delWrappedLineRight: function(cm) {
      deleteNearSelection(cm, function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
        return {from: range.from(), to: rightPos };
      });
    },
    undo: function(cm) {cm.undo();},
    redo: function(cm) {cm.redo();},
    undoSelection: function(cm) {cm.undoSelection();},
    redoSelection: function(cm) {cm.redoSelection();},
    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
    goLineStart: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineStart(cm, range.head.line); },
                            {origin: "+move", bias: 1});
    },
    goLineStartSmart: function(cm) {
      cm.extendSelectionsBy(function(range) {
        return lineStartSmart(cm, range.head);
      }, {origin: "+move", bias: 1});
    },
    goLineEnd: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineEnd(cm, range.head.line); },
                            {origin: "+move", bias: -1});
    },
    goLineRight: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
      }, sel_move);
    },
    goLineLeft: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: 0, top: top}, "div");
      }, sel_move);
    },
    goLineLeftSmart: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var pos = cm.coordsChar({left: 0, top: top}, "div");
        if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
        return pos;
      }, sel_move);
    },
    goLineUp: function(cm) {cm.moveV(-1, "line");},
    goLineDown: function(cm) {cm.moveV(1, "line");},
    goPageUp: function(cm) {cm.moveV(-1, "page");},
    goPageDown: function(cm) {cm.moveV(1, "page");},
    goCharLeft: function(cm) {cm.moveH(-1, "char");},
    goCharRight: function(cm) {cm.moveH(1, "char");},
    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
    goColumnRight: function(cm) {cm.moveH(1, "column");},
    goWordLeft: function(cm) {cm.moveH(-1, "word");},
    goGroupRight: function(cm) {cm.moveH(1, "group");},
    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
    goWordRight: function(cm) {cm.moveH(1, "word");},
    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
    delCharAfter: function(cm) {cm.deleteH(1, "char");},
    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
    delWordAfter: function(cm) {cm.deleteH(1, "word");},
    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
    indentAuto: function(cm) {cm.indentSelection("smart");},
    indentMore: function(cm) {cm.indentSelection("add");},
    indentLess: function(cm) {cm.indentSelection("subtract");},
    insertTab: function(cm) {cm.replaceSelection("\t");},
    insertSoftTab: function(cm) {
      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
      for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].from();
        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
        spaces.push(new Array(tabSize - col % tabSize + 1).join(" "));
      }
      cm.replaceSelections(spaces);
    },
    defaultTab: function(cm) {
      if (cm.somethingSelected()) cm.indentSelection("add");
      else cm.execCommand("insertTab");
    },
    transposeChars: function(cm) {
      runInOp(cm, function() {
        var ranges = cm.listSelections(), newSel = [];
        for (var i = 0; i < ranges.length; i++) {
          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
          if (line) {
            if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
            if (cur.ch > 0) {
              cur = new Pos(cur.line, cur.ch + 1);
              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
            } else if (cur.line > cm.doc.first) {
              var prev = getLine(cm.doc, cur.line - 1).text;
              if (prev)
                cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() +
                                prev.charAt(prev.length - 1),
                                Pos(cur.line - 1, prev.length - 1), Pos(cur.line, 1), "+transpose");
            }
          }
          newSel.push(new Range(cur, cur));
        }
        cm.setSelections(newSel);
      });
    },
    newlineAndIndent: function(cm) {
      runInOp(cm, function() {
        var len = cm.listSelections().length;
        for (var i = 0; i < len; i++) {
          var range = cm.listSelections()[i];
          cm.replaceRange(cm.doc.lineSeparator(), range.anchor, range.head, "+input");
          cm.indentLine(range.from().line + 1, null, true);
        }
        ensureCursorVisible(cm);
      });
    },
    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
  };


  // STANDARD KEYMAPS

  var keyMap = CodeMirror.keyMap = {};

  keyMap.basic = {
    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
    "Esc": "singleSelection"
  };
  // Note that the save and find-related commands aren't defined by
  // default. User code or addons can define them. Unknown commands
  // are simply ignored.
  keyMap.pcDefault = {
    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
    "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
    "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
    fallthrough: "basic"
  };
  // Very basic readline/emacs-style bindings, which are standard on Mac.
  keyMap.emacsy = {
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
  };
  keyMap.macDefault = {
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
    "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
    "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
    fallthrough: ["basic", "emacsy"]
  };
  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;

  // KEYMAP DISPATCH

  function normalizeKeyName(name) {
    var parts = name.split(/-(?!$)/), name = parts[parts.length - 1];
    var alt, ctrl, shift, cmd;
    for (var i = 0; i < parts.length - 1; i++) {
      var mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;
      else if (/^a(lt)?$/i.test(mod)) alt = true;
      else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
      else if (/^s(hift)$/i.test(mod)) shift = true;
      else throw new Error("Unrecognized modifier name: " + mod);
    }
    if (alt) name = "Alt-" + name;
    if (ctrl) name = "Ctrl-" + name;
    if (cmd) name = "Cmd-" + name;
    if (shift) name = "Shift-" + name;
    return name;
  }

  // This is a kludge to keep keymaps mostly working as raw objects
  // (backwards compatibility) while at the same time support features
  // like normalization and multi-stroke key bindings. It compiles a
  // new normalized keymap, and then updates the old object to reflect
  // this.
  CodeMirror.normalizeKeyMap = function(keymap) {
    var copy = {};
    for (var keyname in keymap) if (keymap.hasOwnProperty(keyname)) {
      var value = keymap[keyname];
      if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;
      if (value == "...") { delete keymap[keyname]; continue; }

      var keys = map(keyname.split(" "), normalizeKeyName);
      for (var i = 0; i < keys.length; i++) {
        var val, name;
        if (i == keys.length - 1) {
          name = keys.join(" ");
          val = value;
        } else {
          name = keys.slice(0, i + 1).join(" ");
          val = "...";
        }
        var prev = copy[name];
        if (!prev) copy[name] = val;
        else if (prev != val) throw new Error("Inconsistent bindings for " + name);
      }
      delete keymap[keyname];
    }
    for (var prop in copy) keymap[prop] = copy[prop];
    return keymap;
  };

  var lookupKey = CodeMirror.lookupKey = function(key, map, handle, context) {
    map = getKeyMap(map);
    var found = map.call ? map.call(key, context) : map[key];
    if (found === false) return "nothing";
    if (found === "...") return "multi";
    if (found != null && handle(found)) return "handled";

    if (map.fallthrough) {
      if (Object.prototype.toString.call(map.fallthrough) != "[object Array]")
        return lookupKey(key, map.fallthrough, handle, context);
      for (var i = 0; i < map.fallthrough.length; i++) {
        var result = lookupKey(key, map.fallthrough[i], handle, context);
        if (result) return result;
      }
    }
  };

  // Modifier key presses don't count as 'real' key presses for the
  // purpose of keymap fallthrough.
  var isModifierKey = CodeMirror.isModifierKey = function(value) {
    var name = typeof value == "string" ? value : keyNames[value.keyCode];
    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
  };

  // Look up the name of a key as indicated by an event object.
  var keyName = CodeMirror.keyName = function(event, noShift) {
    if (presto && event.keyCode == 34 && event["char"]) return false;
    var base = keyNames[event.keyCode], name = base;
    if (name == null || event.altGraphKey) return false;
    if (event.altKey && base != "Alt") name = "Alt-" + name;
    if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") name = "Ctrl-" + name;
    if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Cmd") name = "Cmd-" + name;
    if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
    return name;
  };

  function getKeyMap(val) {
    return typeof val == "string" ? keyMap[val] : val;
  }

  // FROMTEXTAREA

  CodeMirror.fromTextArea = function(textarea, options) {
    options = options ? copyObj(options) : {};
    options.value = textarea.value;
    if (!options.tabindex && textarea.tabIndex)
      options.tabindex = textarea.tabIndex;
    if (!options.placeholder && textarea.placeholder)
      options.placeholder = textarea.placeholder;
    // Set autofocus to true if this textarea is focused, or if it has
    // autofocus and no other element is focused.
    if (options.autofocus == null) {
      var hasFocus = activeElt();
      options.autofocus = hasFocus == textarea ||
        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
    }

    function save() {textarea.value = cm.getValue();}
    if (textarea.form) {
      on(textarea.form, "submit", save);
      // Deplorable hack to make the submit method do the right thing.
      if (!options.leaveSubmitMethodAlone) {
        var form = textarea.form, realSubmit = form.submit;
        try {
          var wrappedSubmit = form.submit = function() {
            save();
            form.submit = realSubmit;
            form.submit();
            form.submit = wrappedSubmit;
          };
        } catch(e) {}
      }
    }

    options.finishInit = function(cm) {
      cm.save = save;
      cm.getTextArea = function() { return textarea; };
      cm.toTextArea = function() {
        cm.toTextArea = isNaN; // Prevent this from being ran twice
        save();
        textarea.parentNode.removeChild(cm.getWrapperElement());
        textarea.style.display = "";
        if (textarea.form) {
          off(textarea.form, "submit", save);
          if (typeof textarea.form.submit == "function")
            textarea.form.submit = realSubmit;
        }
      };
    };

    textarea.style.display = "none";
    var cm = CodeMirror(function(node) {
      textarea.parentNode.insertBefore(node, textarea.nextSibling);
    }, options);
    return cm;
  };

  // STRING STREAM

  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.

  var StringStream = CodeMirror.StringStream = function(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
    this.lineStart = 0;
  };

  StringStream.prototype = {
    eol: function() {return this.pos >= this.string.length;},
    sol: function() {return this.pos == this.lineStart;},
    peek: function() {return this.string.charAt(this.pos) || undefined;},
    next: function() {
      if (this.pos < this.string.length)
        return this.string.charAt(this.pos++);
    },
    eat: function(match) {
      var ch = this.string.charAt(this.pos);
      if (typeof match == "string") var ok = ch == match;
      else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {++this.pos; return ch;}
    },
    eatWhile: function(match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start;
    },
    eatSpace: function() {
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function() {this.pos = this.string.length;},
    skipTo: function(ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {this.pos = found; return true;}
    },
    backUp: function(n) {this.pos -= n;},
    column: function() {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    indentation: function() {
      return countColumn(this.string, null, this.tabSize) -
        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    match: function(pattern, consume, caseInsensitive) {
      if (typeof pattern == "string") {
        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) this.pos += pattern.length;
          return true;
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        if (match && consume !== false) this.pos += match[0].length;
        return match;
      }
    },
    current: function(){return this.string.slice(this.start, this.pos);},
    hideFirstChars: function(n, inner) {
      this.lineStart += n;
      try { return inner(); }
      finally { this.lineStart -= n; }
    }
  };

  // TEXTMARKERS

  // Created with markText and setBookmark methods. A TextMarker is a
  // handle that can be used to clear or find a marked position in the
  // document. Line objects hold arrays (markedSpans) containing
  // {from, to, marker} object pointing to such marker objects, and
  // indicating that such a marker is present on that line. Multiple
  // lines may point to the same marker when it spans across lines.
  // The spans will have null for their from/to properties when the
  // marker continues beyond the start/end of the line. Markers have
  // links back to the lines they currently touch.

  var nextMarkerId = 0;

  var TextMarker = CodeMirror.TextMarker = function(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
    this.id = ++nextMarkerId;
  };
  eventMixin(TextMarker);

  // Clear the marker.
  TextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    var cm = this.doc.cm, withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);
    if (hasHandler(this, "clear")) {
      var found = this.find();
      if (found) signalLater(this, "clear", found.from, found.to);
    }
    var min = null, max = null;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
      else if (cm) {
        if (span.to != null) max = lineNo(line);
        if (span.from != null) min = lineNo(line);
      }
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm)
        updateLineHeight(line, textHeight(cm.display));
    }
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
      var visual = visualLine(this.lines[i]), len = lineLength(visual);
      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }

    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;
    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm.doc);
    }
    if (cm) signalLater(cm, "markerCleared", cm, this);
    if (withOp) endOperation(cm);
    if (this.parent) this.parent.clear();
  };

  // Find the position of the marker in the document. Returns a {from,
  // to} object by default. Side can be passed to get a specific side
  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
  // Pos objects returned contain a line object, rather than a line
  // number (used to prevent looking up the same line twice).
  TextMarker.prototype.find = function(side, lineObj) {
    if (side == null && this.type == "bookmark") side = 1;
    var from, to;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.from != null) {
        from = Pos(lineObj ? line : lineNo(line), span.from);
        if (side == -1) return from;
      }
      if (span.to != null) {
        to = Pos(lineObj ? line : lineNo(line), span.to);
        if (side == 1) return to;
      }
    }
    return from && {from: from, to: to};
  };

  // Signals that the marker's widget changed, and surrounding layout
  // should be recomputed.
  TextMarker.prototype.changed = function() {
    var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
    if (!pos || !cm) return;
    runInOp(cm, function() {
      var line = pos.line, lineN = lineNo(pos.line);
      var view = findViewForLine(cm, lineN);
      if (view) {
        clearLineMeasurementCacheFor(view);
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
      }
      cm.curOp.updateMaxLine = true;
      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
        var oldHeight = widget.height;
        widget.height = null;
        var dHeight = widgetHeight(widget) - oldHeight;
        if (dHeight)
          updateLineHeight(line, line.height + dHeight);
      }
    });
  };

  TextMarker.prototype.attachLine = function(line) {
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(line);
  };
  TextMarker.prototype.detachLine = function(line) {
    this.lines.splice(indexOf(this.lines, line), 1);
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  };

  // Collapsed markers have unique ids, in order to be able to order
  // them, which is needed for uniquely determining an outer marker
  // when they overlap (they may nest, but not partially overlap).
  var nextMarkerId = 0;

  // Create a marker, wire it up to the right lines, and
  function markText(doc, from, to, options, type) {
    // Shared markers (across linked documents) are handled separately
    // (markTextShared will call out to this again, once per
    // document).
    if (options && options.shared) return markTextShared(doc, from, to, options, type);
    // Ensure we are in an operation.
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

    var marker = new TextMarker(doc, type), diff = cmp(from, to);
    if (options) copyObj(options, marker, false);
    // Don't connect empty markers unless clearWhenEmpty is false
    if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
      return marker;
    if (marker.replacedWith) {
      // Showing up as a widget implies collapsed (widget replaces text)
      marker.collapsed = true;
      marker.widgetNode = elt("span", [marker.replacedWith], "CodeMirror-widget");
      if (!options.handleMouseEvents) marker.widgetNode.setAttribute("cm-ignore-events", "true");
      if (options.insertLeft) marker.widgetNode.insertLeft = true;
    }
    if (marker.collapsed) {
      if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
          from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
        throw new Error("Inserting collapsed marker partially overlapping an existing one");
      sawCollapsedSpans = true;
    }

    if (marker.addToHistory)
      addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN);

    var curLine = from.line, cm = doc.cm, updateMaxLine;
    doc.iter(curLine, to.line + 1, function(line) {
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
        updateMaxLine = true;
      if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
      addMarkedSpan(line, new MarkedSpan(marker,
                                         curLine == from.line ? from.ch : null,
                                         curLine == to.line ? to.ch : null));
      ++curLine;
    });
    // lineIsHidden depends on the presence of the spans, so needs a second pass
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
    });

    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

    if (marker.readOnly) {
      sawReadOnlySpans = true;
      if (doc.history.done.length || doc.history.undone.length)
        doc.clearHistory();
    }
    if (marker.collapsed) {
      marker.id = ++nextMarkerId;
      marker.atomic = true;
    }
    if (cm) {
      // Sync editor state
      if (updateMaxLine) cm.curOp.updateMaxLine = true;
      if (marker.collapsed)
        regChange(cm, from.line, to.line + 1);
      else if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.css)
        for (var i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
      if (marker.atomic) reCheckSelection(cm.doc);
      signalLater(cm, "markerAdded", cm, marker);
    }
    return marker;
  }

  // SHARED TEXTMARKERS

  // A shared marker spans multiple linked documents. It is
  // implemented as a meta-marker-object controlling multiple normal
  // markers.
  var SharedTextMarker = CodeMirror.SharedTextMarker = function(markers, primary) {
    this.markers = markers;
    this.primary = primary;
    for (var i = 0; i < markers.length; ++i)
      markers[i].parent = this;
  };
  eventMixin(SharedTextMarker);

  SharedTextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;
    for (var i = 0; i < this.markers.length; ++i)
      this.markers[i].clear();
    signalLater(this, "clear");
  };
  SharedTextMarker.prototype.find = function(side, lineObj) {
    return this.primary.find(side, lineObj);
  };

  function markTextShared(doc, from, to, options, type) {
    options = copyObj(options);
    options.shared = false;
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
    var widget = options.widgetNode;
    linkedDocs(doc, function(doc) {
      if (widget) options.widgetNode = widget.cloneNode(true);
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
      for (var i = 0; i < doc.linked.length; ++i)
        if (doc.linked[i].isParent) return;
      primary = lst(markers);
    });
    return new SharedTextMarker(markers, primary);
  }

  function findSharedMarkers(doc) {
    return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())),
                         function(m) { return m.parent; });
  }

  function copySharedMarkers(doc, markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], pos = marker.find();
      var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
      if (cmp(mFrom, mTo)) {
        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
        marker.markers.push(subMark);
        subMark.parent = marker;
      }
    }
  }

  function detachSharedMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], linked = [marker.primary.doc];;
      linkedDocs(marker.primary.doc, function(d) { linked.push(d); });
      for (var j = 0; j < marker.markers.length; j++) {
        var subMarker = marker.markers[j];
        if (indexOf(linked, subMarker.doc) == -1) {
          subMarker.parent = null;
          marker.markers.splice(j--, 1);
        }
      }
    }
  }

  // TEXTMARKER SPANS

  function MarkedSpan(marker, from, to) {
    this.marker = marker;
    this.from = from; this.to = to;
  }

  // Search an array of spans for a span matching the given marker.
  function getMarkedSpanFor(spans, marker) {
    if (spans) for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.marker == marker) return span;
    }
  }
  // Remove a span from an array, returning undefined if no spans are
  // left (we don't store arrays for lines without spans).
  function removeMarkedSpan(spans, span) {
    for (var r, i = 0; i < spans.length; ++i)
      if (spans[i] != span) (r || (r = [])).push(spans[i]);
    return r;
  }
  // Add a span to a line.
  function addMarkedSpan(line, span) {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    span.marker.attachLine(line);
  }

  // Used for the algorithm that adjusts markers for a change in the
  // document. These functions cut an array of spans at a given
  // character position, returning an array of remaining chunks (or
  // undefined if nothing remains).
  function markedSpansBefore(old, startCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
      if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
      }
    }
    return nw;
  }
  function markedSpansAfter(old, endCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
      if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
                                              span.to == null ? null : span.to - endCh));
      }
    }
    return nw;
  }

  // Given a change object, compute the new set of marker spans that
  // cover the line in which the change took place. Removes spans
  // entirely within the change, reconnects spans belonging to the
  // same marker that appear on both sides of the change, and cuts off
  // spans partially within the change. Returns an array of span
  // arrays with one element for each line in (after) the change.
  function stretchSpansOverChange(doc, change) {
    if (change.full) return null;
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
    if (!oldFirst && !oldLast) return null;

    var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
    // Get the spans that 'stick out' on both sides
    var first = markedSpansBefore(oldFirst, startCh, isInsert);
    var last = markedSpansAfter(oldLast, endCh, isInsert);

    // Next, merge those two ends
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
    if (first) {
      // Fix up .to properties of first
      for (var i = 0; i < first.length; ++i) {
        var span = first[i];
        if (span.to == null) {
          var found = getMarkedSpanFor(last, span.marker);
          if (!found) span.to = startCh;
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
        }
      }
    }
    if (last) {
      // Fix up .from in last (or move them into first in case of sameLine)
      for (var i = 0; i < last.length; ++i) {
        var span = last[i];
        if (span.to != null) span.to += offset;
        if (span.from == null) {
          var found = getMarkedSpanFor(first, span.marker);
          if (!found) {
            span.from = offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        } else {
          span.from += offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      }
    }
    // Make sure we didn't create any zero-length spans
    if (first) first = clearEmptySpans(first);
    if (last && last != first) last = clearEmptySpans(last);

    var newMarkers = [first];
    if (!sameLine) {
      // Fill gap with whole-line-spans
      var gap = change.text.length - 2, gapMarkers;
      if (gap > 0 && first)
        for (var i = 0; i < first.length; ++i)
          if (first[i].to == null)
            (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
      for (var i = 0; i < gap; ++i)
        newMarkers.push(gapMarkers);
      newMarkers.push(last);
    }
    return newMarkers;
  }

  // Remove spans that are empty and don't have a clearWhenEmpty
  // option of false.
  function clearEmptySpans(spans) {
    for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
        spans.splice(i--, 1);
    }
    if (!spans.length) return null;
    return spans;
  }

  // Used for un/re-doing changes from the history. Combines the
  // result of computing the existing spans with the set of spans that
  // existed in the history (so that deleting around a span and then
  // undoing brings back the span).
  function mergeOldSpans(doc, change) {
    var old = getOldSpans(doc, change);
    var stretched = stretchSpansOverChange(doc, change);
    if (!old) return stretched;
    if (!stretched) return old;

    for (var i = 0; i < old.length; ++i) {
      var oldCur = old[i], stretchCur = stretched[i];
      if (oldCur && stretchCur) {
        spans: for (var j = 0; j < stretchCur.length; ++j) {
          var span = stretchCur[j];
          for (var k = 0; k < oldCur.length; ++k)
            if (oldCur[k].marker == span.marker) continue spans;
          oldCur.push(span);
        }
      } else if (stretchCur) {
        old[i] = stretchCur;
      }
    }
    return old;
  }

  // Used to 'clip' out readOnly ranges when making a change.
  function removeReadOnlyRanges(doc, from, to) {
    var markers = null;
    doc.iter(from.line, to.line + 1, function(line) {
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
        var mark = line.markedSpans[i].marker;
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
          (markers || (markers = [])).push(mark);
      }
    });
    if (!markers) return null;
    var parts = [{from: from, to: to}];
    for (var i = 0; i < markers.length; ++i) {
      var mk = markers[i], m = mk.find(0);
      for (var j = 0; j < parts.length; ++j) {
        var p = parts[j];
        if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
        var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
        if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
          newParts.push({from: p.from, to: m.from});
        if (dto > 0 || !mk.inclusiveRight && !dto)
          newParts.push({from: m.to, to: p.to});
        parts.splice.apply(parts, newParts);
        j += newParts.length - 1;
      }
    }
    return parts;
  }

  // Connect or disconnect spans from a line.
  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }
  function attachMarkedSpans(line, spans) {
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.attachLine(line);
    line.markedSpans = spans;
  }

  // Helpers used when computing which overlapping collapsed span
  // counts as the larger one.
  function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0; }
  function extraRight(marker) { return marker.inclusiveRight ? 1 : 0; }

  // Returns a number indicating which of two overlapping collapsed
  // spans is larger (and thus includes the other). Falls back to
  // comparing ids when the spans cover exactly the same range.
  function compareCollapsedMarkers(a, b) {
    var lenDiff = a.lines.length - b.lines.length;
    if (lenDiff != 0) return lenDiff;
    var aPos = a.find(), bPos = b.find();
    var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
    if (fromCmp) return -fromCmp;
    var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
    if (toCmp) return toCmp;
    return b.id - a.id;
  }

  // Find out whether a line ends or starts in a collapsed span. If
  // so, return the marker for that span.
  function collapsedSpanAtSide(line, start) {
    var sps = sawCollapsedSpans && line.markedSpans, found;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
          (!found || compareCollapsedMarkers(found, sp.marker) < 0))
        found = sp.marker;
    }
    return found;
  }
  function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true); }
  function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false); }

  // Test whether there exists a collapsed span that partially
  // overlaps (covers the start or end, but not both) of a new span.
  // Such overlap is not allowed.
  function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
    var line = getLine(doc, lineNo);
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var i = 0; i < sps.length; ++i) {
      var sp = sps[i];
      if (!sp.marker.collapsed) continue;
      var found = sp.marker.find(0);
      var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
      var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
      if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
      if (fromCmp <= 0 && (cmp(found.to, from) > 0 || (sp.marker.inclusiveRight && marker.inclusiveLeft)) ||
          fromCmp >= 0 && (cmp(found.from, to) < 0 || (sp.marker.inclusiveLeft && marker.inclusiveRight)))
        return true;
    }
  }

  // A visual line is a line as drawn on the screen. Folding, for
  // example, can cause multiple logical lines to appear on the same
  // visual line. This finds the start of the visual line that the
  // given line is part of (usually that is the line itself).
  function visualLine(line) {
    var merged;
    while (merged = collapsedSpanAtStart(line))
      line = merged.find(-1, true).line;
    return line;
  }

  // Returns an array of logical lines that continue the visual line
  // started by the argument, or undefined if there are no such lines.
  function visualLineContinued(line) {
    var merged, lines;
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      (lines || (lines = [])).push(line);
    }
    return lines;
  }

  // Get the line number of the start of the visual line that the
  // given line number is part of.
  function visualLineNo(doc, lineN) {
    var line = getLine(doc, lineN), vis = visualLine(line);
    if (line == vis) return lineN;
    return lineNo(vis);
  }
  // Get the line number of the start of the next visual line after
  // the given line.
  function visualLineEndNo(doc, lineN) {
    if (lineN > doc.lastLine()) return lineN;
    var line = getLine(doc, lineN), merged;
    if (!lineIsHidden(doc, line)) return lineN;
    while (merged = collapsedSpanAtEnd(line))
      line = merged.find(1, true).line;
    return lineNo(line) + 1;
  }

  // Compute whether a line is hidden. Lines count as hidden when they
  // are part of a visual line that starts with another line, or when
  // they are entirely covered by collapsed, non-widget span.
  function lineIsHidden(doc, line) {
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if (sp.from == null) return true;
      if (sp.marker.widgetNode) continue;
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
        return true;
    }
  }
  function lineIsHiddenInner(doc, line, span) {
    if (span.to == null) {
      var end = span.marker.find(1, true);
      return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
    }
    if (span.marker.inclusiveRight && span.to == line.text.length)
      return true;
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
      sp = line.markedSpans[i];
      if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
          (sp.to == null || sp.to != span.from) &&
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
          lineIsHiddenInner(doc, line, sp)) return true;
    }
  }

  // LINE WIDGETS

  // Line widgets are block elements displayed above or below a line.

  var LineWidget = CodeMirror.LineWidget = function(doc, node, options) {
    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
      this[opt] = options[opt];
    this.doc = doc;
    this.node = node;
  };
  eventMixin(LineWidget);

  function adjustScrollWhenAboveVisible(cm, line, diff) {
    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
      addToScrollPos(cm, null, diff);
  }

  LineWidget.prototype.clear = function() {
    var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
    if (no == null || !ws) return;
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
    if (!ws.length) line.widgets = null;
    var height = widgetHeight(this);
    updateLineHeight(line, Math.max(0, line.height - height));
    if (cm) runInOp(cm, function() {
      adjustScrollWhenAboveVisible(cm, line, -height);
      regLineChange(cm, no, "widget");
    });
  };
  LineWidget.prototype.changed = function() {
    var oldH = this.height, cm = this.doc.cm, line = this.line;
    this.height = null;
    var diff = widgetHeight(this) - oldH;
    if (!diff) return;
    updateLineHeight(line, line.height + diff);
    if (cm) runInOp(cm, function() {
      cm.curOp.forceUpdate = true;
      adjustScrollWhenAboveVisible(cm, line, diff);
    });
  };

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    var cm = widget.doc.cm;
    if (!cm) return 0;
    if (!contains(document.body, widget.node)) {
      var parentStyle = "position: relative;";
      if (widget.coverGutter)
        parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
      if (widget.noHScroll)
        parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
      removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
    }
    return widget.height = widget.node.parentNode.offsetHeight;
  }

  function addLineWidget(doc, handle, node, options) {
    var widget = new LineWidget(doc, node, options);
    var cm = doc.cm;
    if (cm && widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(doc, handle, "widget", function(line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (cm && !lineIsHidden(doc, line)) {
        var aboveVisible = heightAtLine(line) < doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, null, widget.height);
        cm.curOp.forceUpdate = true;
      }
      return true;
    });
    return widget;
  }

  // LINE DATA STRUCTURE

  // Line objects. These hold state related to a line, including
  // highlighting info (the styles array).
  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  };
  eventMixin(Line);
  Line.prototype.lineNo = function() { return lineNo(this); };

  // Change the content (text, markers) of a line. Automatically
  // invalidates cached information and tries to re-estimate the
  // line's height.
  function updateLine(line, text, markedSpans, estimateHeight) {
    line.text = text;
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
    if (line.order != null) line.order = null;
    detachMarkedSpans(line);
    attachMarkedSpans(line, markedSpans);
    var estHeight = estimateHeight ? estimateHeight(line) : 1;
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  }

  // Detach a line from the document tree and its markers.
  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }

  function extractLineClasses(type, output) {
    if (type) for (;;) {
      var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
      if (!lineClass) break;
      type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
      var prop = lineClass[1] ? "bgClass" : "textClass";
      if (output[prop] == null)
        output[prop] = lineClass[2];
      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
        output[prop] += " " + lineClass[2];
    }
    return type;
  }

  function callBlankLine(mode, state) {
    if (mode.blankLine) return mode.blankLine(state);
    if (!mode.innerMode) return;
    var inner = CodeMirror.innerMode(mode, state);
    if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
  }

  function readToken(mode, stream, state, inner) {
    for (var i = 0; i < 10; i++) {
      if (inner) inner[0] = CodeMirror.innerMode(mode, state).mode;
      var style = mode.token(stream, state);
      if (stream.pos > stream.start) return style;
    }
    throw new Error("Mode " + mode.name + " failed to advance stream.");
  }

  // Utility for getTokenAt and getLineTokens
  function takeToken(cm, pos, precise, asArray) {
    function getObj(copy) {
      return {start: stream.start, end: stream.pos,
              string: stream.current(),
              type: style || null,
              state: copy ? copyState(doc.mode, state) : state};
    }

    var doc = cm.doc, mode = doc.mode, style;
    pos = clipPos(doc, pos);
    var line = getLine(doc, pos.line), state = getStateBefore(cm, pos.line, precise);
    var stream = new StringStream(line.text, cm.options.tabSize), tokens;
    if (asArray) tokens = [];
    while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
      stream.start = stream.pos;
      style = readToken(mode, stream, state);
      if (asArray) tokens.push(getObj(true));
    }
    return asArray ? tokens : getObj();
  }

  // Run the given mode's parser over a line, calling f for each token.
  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    var inner = cm.options.addModeClass && [null];
    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        if (forceToEnd) processLine(cm, text, state, stream.pos);
        stream.pos = text.length;
        style = null;
      } else {
        style = extractLineClasses(readToken(mode, stream, state, inner), lineClasses);
      }
      if (inner) {
        var mName = inner[0].name;
        if (mName) style = "m-" + (style ? mName + " " + style : mName);
      }
      if (!flattenSpans || curStyle != style) {
        while (curStart < stream.start) {
          curStart = Math.min(stream.start, curStart + 50000);
          f(curStart, curStyle);
        }
        curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }

  // Compute a style array (an array starting with a mode generation
  // -- for invalidation -- followed by pairs of end positions and
  // style strings), which is used to highlight the tokens on the
  // line.
  function highlightLine(cm, line, state, forceToEnd) {
    // A styles array always starts with a number identifying the
    // mode/overlays that it is based on (for easy invalidation).
    var st = [cm.state.modeGen], lineClasses = {};
    // Compute the base array of styles
    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
      st.push(end, style);
    }, lineClasses, forceToEnd);

    // Run overlays, adjust style array.
    for (var o = 0; o < cm.state.overlays.length; ++o) {
      var overlay = cm.state.overlays[o], i = 1, at = 0;
      runMode(cm, line.text, overlay.mode, true, function(end, style) {
        var start = i;
        // Ensure there's a token end at the current position, and that i points at it
        while (at < end) {
          var i_end = st[i];
          if (i_end > end)
            st.splice(i, 1, end, st[i+1], i_end);
          i += 2;
          at = Math.min(end, i_end);
        }
        if (!style) return;
        if (overlay.opaque) {
          st.splice(start, i - start, end, "cm-overlay " + style);
          i = start + 2;
        } else {
          for (; start < i; start += 2) {
            var cur = st[start+1];
            st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
          }
        }
      }, lineClasses);
    }

    return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
  }

  function getLineStyles(cm, line, updateFrontier) {
    if (!line.styles || line.styles[0] != cm.state.modeGen) {
      var state = getStateBefore(cm, lineNo(line));
      var result = highlightLine(cm, line, line.text.length > cm.options.maxHighlightLength ? copyState(cm.doc.mode, state) : state);
      line.stateAfter = state;
      line.styles = result.styles;
      if (result.classes) line.styleClasses = result.classes;
      else if (line.styleClasses) line.styleClasses = null;
      if (updateFrontier === cm.doc.frontier) cm.doc.frontier++;
    }
    return line.styles;
  }

  // Lightweight form of highlight -- proceed over this line and
  // update state, but don't save a style array. Used for lines that
  // aren't currently visible.
  function processLine(cm, text, state, startAt) {
    var mode = cm.doc.mode;
    var stream = new StringStream(text, cm.options.tabSize);
    stream.start = stream.pos = startAt || 0;
    if (text == "") callBlankLine(mode, state);
    while (!stream.eol()) {
      readToken(mode, stream, state);
      stream.start = stream.pos;
    }
  }

  // Convert a style as returned by a mode (either null, or a string
  // containing one or more styles) to a CSS style. This is cached,
  // and also looks for line-wide styles.
  var styleToClassCache = {}, styleToClassCacheWithMode = {};
  function interpretTokenStyle(style, options) {
    if (!style || /^\s*$/.test(style)) return null;
    var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
    return cache[style] ||
      (cache[style] = style.replace(/\S+/g, "cm-$&"));
  }

  // Render the DOM representation of the text of a line. Also builds
  // up a 'line map', which points at the DOM nodes that represent
  // specific stretches of text, and is used by the measuring code.
  // The returned object contains the DOM node, this map, and
  // information about line-wide styles that were set by the mode.
  function buildLineContent(cm, lineView) {
    // The padding-right forces the element to have a 'border', which
    // is needed on Webkit to be able to get line-level bounding
    // rectangles for it (in measureChar).
    var content = elt("span", null, null, webkit ? "padding-right: .1px" : null);
    var builder = {pre: elt("pre", [content], "CodeMirror-line"), content: content,
                   col: 0, pos: 0, cm: cm,
                   splitSpaces: (ie || webkit) && cm.getOption("lineWrapping")};
    lineView.measure = {};

    // Iterate over the logical lines that make up this visual line.
    for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
      var line = i ? lineView.rest[i - 1] : lineView.line, order;
      builder.pos = 0;
      builder.addToken = buildToken;
      // Optionally wire in some hacks into the token-rendering
      // algorithm, to deal with browser quirks.
      if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line)))
        builder.addToken = buildTokenBadBidi(builder.addToken, order);
      builder.map = [];
      var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
      insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
      if (line.styleClasses) {
        if (line.styleClasses.bgClass)
          builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
        if (line.styleClasses.textClass)
          builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
      }

      // Ensure at least a single node is present, for measuring.
      if (builder.map.length == 0)
        builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));

      // Store the map and a cache object for the current logical line
      if (i == 0) {
        lineView.measure.map = builder.map;
        lineView.measure.cache = {};
      } else {
        (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
        (lineView.measure.caches || (lineView.measure.caches = [])).push({});
      }
    }

    // See issue #2901
    if (webkit && /\bcm-tab\b/.test(builder.content.lastChild.className))
      builder.content.className = "cm-tab-wrap-hack";

    signal(cm, "renderLine", cm, lineView.line, builder.pre);
    if (builder.pre.className)
      builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");

    return builder;
  }

  function defaultSpecialCharPlaceholder(ch) {
    var token = elt("span", "\u2022", "cm-invalidchar");
    token.title = "\\u" + ch.charCodeAt(0).toString(16);
    token.setAttribute("aria-label", token.title);
    return token;
  }

  // Build up the DOM representation for a single token, and add it to
  // the line map. Takes care to render special characters separately.
  function buildToken(builder, text, style, startStyle, endStyle, title, css) {
    if (!text) return;
    var displayText = builder.splitSpaces ? text.replace(/ {3,}/g, splitSpaces) : text;
    var special = builder.cm.state.specialChars, mustWrap = false;
    if (!special.test(text)) {
      builder.col += text.length;
      var content = document.createTextNode(displayText);
      builder.map.push(builder.pos, builder.pos + text.length, content);
      if (ie && ie_version < 9) mustWrap = true;
      builder.pos += text.length;
    } else {
      var content = document.createDocumentFragment(), pos = 0;
      while (true) {
        special.lastIndex = pos;
        var m = special.exec(text);
        var skipped = m ? m.index - pos : text.length - pos;
        if (skipped) {
          var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.map.push(builder.pos, builder.pos + skipped, txt);
          builder.col += skipped;
          builder.pos += skipped;
        }
        if (!m) break;
        pos += skipped + 1;
        if (m[0] == "\t") {
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
          var txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
          txt.setAttribute("role", "presentation");
          txt.setAttribute("cm-text", "\t");
          builder.col += tabWidth;
        } else if (m[0] == "\r" || m[0] == "\n") {
          var txt = content.appendChild(elt("span", m[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
          txt.setAttribute("cm-text", m[0]);
          builder.col += 1;
        } else {
          var txt = builder.cm.options.specialCharPlaceholder(m[0]);
          txt.setAttribute("cm-text", m[0]);
          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.col += 1;
        }
        builder.map.push(builder.pos, builder.pos + 1, txt);
        builder.pos++;
      }
    }
    if (style || startStyle || endStyle || mustWrap || css) {
      var fullStyle = style || "";
      if (startStyle) fullStyle += startStyle;
      if (endStyle) fullStyle += endStyle;
      var token = elt("span", [content], fullStyle, css);
      if (title) token.title = title;
      return builder.content.appendChild(token);
    }
    builder.content.appendChild(content);
  }

  function splitSpaces(old) {
    var out = " ";
    for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
    out += " ";
    return out;
  }

  // Work around nonsense dimensions being reported for stretches of
  // right-to-left text.
  function buildTokenBadBidi(inner, order) {
    return function(builder, text, style, startStyle, endStyle, title, css) {
      style = style ? style + " cm-force-border" : "cm-force-border";
      var start = builder.pos, end = start + text.length;
      for (;;) {
        // Find the part that overlaps with the start of this text
        for (var i = 0; i < order.length; i++) {
          var part = order[i];
          if (part.to > start && part.from <= start) break;
        }
        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, title, css);
        inner(builder, text.slice(0, part.to - start), style, startStyle, null, title, css);
        startStyle = null;
        text = text.slice(part.to - start);
        start = part.to;
      }
    };
  }

  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
    var widget = !ignoreWidget && marker.widgetNode;
    if (widget) builder.map.push(builder.pos, builder.pos + size, widget);
    if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
      if (!widget)
        widget = builder.content.appendChild(document.createElement("span"));
      widget.setAttribute("cm-marker", marker.id);
    }
    if (widget) {
      builder.cm.display.input.setUneditable(widget);
      builder.content.appendChild(widget);
    }
    builder.pos += size;
  }

  // Outputs a number of spans to make up a line, taking highlighting
  // and marked text into account.
  function insertLineContent(line, builder, styles) {
    var spans = line.markedSpans, allText = line.text, at = 0;
    if (!spans) {
      for (var i = 1; i < styles.length; i+=2)
        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder.cm.options));
      return;
    }

    var len = allText.length, pos = 0, i = 1, text = "", style, css;
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
    for (;;) {
      if (nextChange == pos) { // Update current marker set
        spanStyle = spanEndStyle = spanStartStyle = title = css = "";
        collapsed = null; nextChange = Infinity;
        var foundBookmarks = [], endStyles
        for (var j = 0; j < spans.length; ++j) {
          var sp = spans[j], m = sp.marker;
          if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
            foundBookmarks.push(m);
          } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
            if (sp.to != null && sp.to != pos && nextChange > sp.to) {
              nextChange = sp.to;
              spanEndStyle = "";
            }
            if (m.className) spanStyle += " " + m.className;
            if (m.css) css = (css ? css + ";" : "") + m.css;
            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
            if (m.endStyle && sp.to == nextChange) (endStyles || (endStyles = [])).push(m.endStyle, sp.to)
            if (m.title && !title) title = m.title;
            if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
              collapsed = sp;
          } else if (sp.from > pos && nextChange > sp.from) {
            nextChange = sp.from;
          }
        }
        if (endStyles) for (var j = 0; j < endStyles.length; j += 2)
          if (endStyles[j + 1] == nextChange) spanEndStyle += " " + endStyles[j]

        if (collapsed && (collapsed.from || 0) == pos) {
          buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                             collapsed.marker, collapsed.from == null);
          if (collapsed.to == null) return;
          if (collapsed.to == pos) collapsed = false;
        }
        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
      }
      if (pos >= len) break;

      var upto = Math.min(len, nextChange);
      while (true) {
        if (text) {
          var end = pos + text.length;
          if (!collapsed) {
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title, css);
          }
          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
          pos = end;
          spanStartStyle = "";
        }
        text = allText.slice(at, at = styles[i++]);
        style = interpretTokenStyle(styles[i++], builder.cm.options);
      }
    }
  }

  // DOCUMENT DATA STRUCTURE

  // By default, updates that start and end at the beginning of a line
  // are treated specially, in order to make the association of line
  // widgets and marker elements with the text behave more intuitive.
  function isWholeLineUpdate(doc, change) {
    return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
      (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
  }

  // Perform a change on the document data structure.
  function updateDoc(doc, change, markedSpans, estimateHeight) {
    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
    function update(line, text, spans) {
      updateLine(line, text, spans, estimateHeight);
      signalLater(line, "change", line, change);
    }
    function linesFor(start, end) {
      for (var i = start, result = []; i < end; ++i)
        result.push(new Line(text[i], spansFor(i), estimateHeight));
      return result;
    }

    var from = change.from, to = change.to, text = change.text;
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

    // Adjust the line structure
    if (change.full) {
      doc.insert(0, linesFor(0, text.length));
      doc.remove(text.length, doc.size - text.length);
    } else if (isWholeLineUpdate(doc, change)) {
      // This is a whole-line replace. Treated specially to make
      // sure line objects move the way they are supposed to.
      var added = linesFor(0, text.length - 1);
      update(lastLine, lastLine.text, lastSpans);
      if (nlines) doc.remove(from.line, nlines);
      if (added.length) doc.insert(from.line, added);
    } else if (firstLine == lastLine) {
      if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
      } else {
        var added = linesFor(1, text.length - 1);
        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        doc.insert(from.line + 1, added);
      }
    } else if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
      doc.remove(from.line + 1, nlines);
    } else {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
      var added = linesFor(1, text.length - 1);
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
      doc.insert(from.line + 1, added);
    }

    signalLater(doc, "change", doc, change);
  }

  // The document is represented as a BTree consisting of leaves, with
  // chunk of lines in them, and branches, with up to ten leaves or
  // other branch nodes below them. The top node is always a branch
  // node, and is the document object itself (meaning it has
  // additional methods and properties).
  //
  // All nodes have parent links. The tree is used both to go from
  // line numbers to line objects, and to go from objects to numbers.
  // It also indexes by height, and is used to convert between height
  // and line object, and to find the total height of the document.
  //
  // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, height = 0; i < lines.length; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }

  LeafChunk.prototype = {
    chunkSize: function() { return this.lines.length; },
    // Remove the n lines at offset 'at'.
    removeInner: function(at, n) {
      for (var i = at, e = at + n; i < e; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, "delete");
      }
      this.lines.splice(at, n);
    },
    // Helper used to collapse a small branch into a single leaf.
    collapse: function(lines) {
      lines.push.apply(lines, this.lines);
    },
    // Insert the given array of lines at offset 'at', count them as
    // having the given height.
    insertInner: function(at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0; i < lines.length; ++i) lines[i].parent = this;
    },
    // Used to iterate over a part of the tree.
    iterN: function(at, n, op) {
      for (var e = at + n; at < e; ++at)
        if (op(this.lines[at])) return true;
    }
  };

  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0; i < children.length; ++i) {
      var ch = children[i];
      size += ch.chunkSize(); height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }

  BranchChunk.prototype = {
    chunkSize: function() { return this.size; },
    removeInner: function(at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
          if ((n -= rm) == 0) break;
          at = 0;
        } else at -= sz;
      }
      // If the result is smaller than 25 lines, ensure that it is a
      // single leaf node.
      if (this.size - n < 25 &&
          (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
        var lines = [];
        this.collapse(lines);
        this.children = [new LeafChunk(lines)];
        this.children[0].parent = this;
      }
    },
    collapse: function(lines) {
      for (var i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
    },
    insertInner: function(at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at <= sz) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            while (child.lines.length > 50) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    // When a node has grown, check whether it should be split.
    maybeSpill: function() {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (!me.parent) { // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [copy, sibling];
          me = copy;
        } else {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function(at, n, op) {
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return true;
          if ((n -= used) == 0) break;
          at = 0;
        } else at -= sz;
      }
    }
  };

  var nextDocId = 0;
  var Doc = CodeMirror.Doc = function(text, mode, firstLine, lineSep) {
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine, lineSep);
    if (firstLine == null) firstLine = 0;

    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
    this.first = firstLine;
    this.scrollTop = this.scrollLeft = 0;
    this.cantEdit = false;
    this.cleanGeneration = 1;
    this.frontier = firstLine;
    var start = Pos(firstLine, 0);
    this.sel = simpleSelection(start);
    this.history = new History(null);
    this.id = ++nextDocId;
    this.modeOption = mode;
    this.lineSep = lineSep;
    this.extend = false;

    if (typeof text == "string") text = this.splitLines(text);
    updateDoc(this, {from: start, to: start, text: text});
    setSelection(this, simpleSelection(start), sel_dontScroll);
  };

  Doc.prototype = createObj(BranchChunk.prototype, {
    constructor: Doc,
    // Iterate over the document. Supports two forms -- with only one
    // argument, it calls that for each line in the document. With
    // three, it iterates over the range given by the first two (with
    // the second being non-inclusive).
    iter: function(from, to, op) {
      if (op) this.iterN(from - this.first, to - from, op);
      else this.iterN(this.first, this.first + this.size, from);
    },

    // Non-public interface for adding and removing lines.
    insert: function(at, lines) {
      var height = 0;
      for (var i = 0; i < lines.length; ++i) height += lines[i].height;
      this.insertInner(at - this.first, lines, height);
    },
    remove: function(at, n) { this.removeInner(at - this.first, n); },

    // From here, the methods are part of the public interface. Most
    // are also available from CodeMirror (editor) instances.

    getValue: function(lineSep) {
      var lines = getLines(this, this.first, this.first + this.size);
      if (lineSep === false) return lines;
      return lines.join(lineSep || this.lineSeparator());
    },
    setValue: docMethodOp(function(code) {
      var top = Pos(this.first, 0), last = this.first + this.size - 1;
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                        text: this.splitLines(code), origin: "setValue", full: true}, true);
      setSelection(this, simpleSelection(top));
    }),
    replaceRange: function(code, from, to, origin) {
      from = clipPos(this, from);
      to = to ? clipPos(this, to) : from;
      replaceRange(this, code, from, to, origin);
    },
    getRange: function(from, to, lineSep) {
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
      if (lineSep === false) return lines;
      return lines.join(lineSep || this.lineSeparator());
    },

    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},

    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
    getLineNumber: function(line) {return lineNo(line);},

    getLineHandleVisualStart: function(line) {
      if (typeof line == "number") line = getLine(this, line);
      return visualLine(line);
    },

    lineCount: function() {return this.size;},
    firstLine: function() {return this.first;},
    lastLine: function() {return this.first + this.size - 1;},

    clipPos: function(pos) {return clipPos(this, pos);},

    getCursor: function(start) {
      var range = this.sel.primary(), pos;
      if (start == null || start == "head") pos = range.head;
      else if (start == "anchor") pos = range.anchor;
      else if (start == "end" || start == "to" || start === false) pos = range.to();
      else pos = range.from();
      return pos;
    },
    listSelections: function() { return this.sel.ranges; },
    somethingSelected: function() {return this.sel.somethingSelected();},

    setCursor: docMethodOp(function(line, ch, options) {
      setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
    }),
    setSelection: docMethodOp(function(anchor, head, options) {
      setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
    }),
    extendSelection: docMethodOp(function(head, other, options) {
      extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
    }),
    extendSelections: docMethodOp(function(heads, options) {
      extendSelections(this, clipPosArray(this, heads), options);
    }),
    extendSelectionsBy: docMethodOp(function(f, options) {
      var heads = map(this.sel.ranges, f);
      extendSelections(this, clipPosArray(this, heads), options);
    }),
    setSelections: docMethodOp(function(ranges, primary, options) {
      if (!ranges.length) return;
      for (var i = 0, out = []; i < ranges.length; i++)
        out[i] = new Range(clipPos(this, ranges[i].anchor),
                           clipPos(this, ranges[i].head));
      if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
      setSelection(this, normalizeSelection(out, primary), options);
    }),
    addSelection: docMethodOp(function(anchor, head, options) {
      var ranges = this.sel.ranges.slice(0);
      ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
      setSelection(this, normalizeSelection(ranges, ranges.length - 1), options);
    }),

    getSelection: function(lineSep) {
      var ranges = this.sel.ranges, lines;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        lines = lines ? lines.concat(sel) : sel;
      }
      if (lineSep === false) return lines;
      else return lines.join(lineSep || this.lineSeparator());
    },
    getSelections: function(lineSep) {
      var parts = [], ranges = this.sel.ranges;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        if (lineSep !== false) sel = sel.join(lineSep || this.lineSeparator());
        parts[i] = sel;
      }
      return parts;
    },
    replaceSelection: function(code, collapse, origin) {
      var dup = [];
      for (var i = 0; i < this.sel.ranges.length; i++)
        dup[i] = code;
      this.replaceSelections(dup, collapse, origin || "+input");
    },
    replaceSelections: docMethodOp(function(code, collapse, origin) {
      var changes = [], sel = this.sel;
      for (var i = 0; i < sel.ranges.length; i++) {
        var range = sel.ranges[i];
        changes[i] = {from: range.from(), to: range.to(), text: this.splitLines(code[i]), origin: origin};
      }
      var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
      for (var i = changes.length - 1; i >= 0; i--)
        makeChange(this, changes[i]);
      if (newSel) setSelectionReplaceHistory(this, newSel);
      else if (this.cm) ensureCursorVisible(this.cm);
    }),
    undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
    redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
    undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
    redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),

    setExtending: function(val) {this.extend = val;},
    getExtending: function() {return this.extend;},

    historySize: function() {
      var hist = this.history, done = 0, undone = 0;
      for (var i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;
      for (var i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;
      return {undo: done, redo: undone};
    },
    clearHistory: function() {this.history = new History(this.history.maxGeneration);},

    markClean: function() {
      this.cleanGeneration = this.changeGeneration(true);
    },
    changeGeneration: function(forceSplit) {
      if (forceSplit)
        this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
      return this.history.generation;
    },
    isClean: function (gen) {
      return this.history.generation == (gen || this.cleanGeneration);
    },

    getHistory: function() {
      return {done: copyHistoryArray(this.history.done),
              undone: copyHistoryArray(this.history.undone)};
    },
    setHistory: function(histData) {
      var hist = this.history = new History(this.history.maxGeneration);
      hist.done = copyHistoryArray(histData.done.slice(0), null, true);
      hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
    },

    addLineClass: docMethodOp(function(handle, where, cls) {
      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
        var prop = where == "text" ? "textClass"
                 : where == "background" ? "bgClass"
                 : where == "gutter" ? "gutterClass" : "wrapClass";
        if (!line[prop]) line[prop] = cls;
        else if (classTest(cls).test(line[prop])) return false;
        else line[prop] += " " + cls;
        return true;
      });
    }),
    removeLineClass: docMethodOp(function(handle, where, cls) {
      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
        var prop = where == "text" ? "textClass"
                 : where == "background" ? "bgClass"
                 : where == "gutter" ? "gutterClass" : "wrapClass";
        var cur = line[prop];
        if (!cur) return false;
        else if (cls == null) line[prop] = null;
        else {
          var found = cur.match(classTest(cls));
          if (!found) return false;
          var end = found.index + found[0].length;
          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
        }
        return true;
      });
    }),

    addLineWidget: docMethodOp(function(handle, node, options) {
      return addLineWidget(this, handle, node, options);
    }),
    removeLineWidget: function(widget) { widget.clear(); },

    markText: function(from, to, options) {
      return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
    },
    setBookmark: function(pos, options) {
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                      insertLeft: options && options.insertLeft,
                      clearWhenEmpty: false, shared: options && options.shared,
                      handleMouseEvents: options && options.handleMouseEvents};
      pos = clipPos(this, pos);
      return markText(this, pos, pos, realOpts, "bookmark");
    },
    findMarksAt: function(pos) {
      pos = clipPos(this, pos);
      var markers = [], spans = getLine(this, pos.line).markedSpans;
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if ((span.from == null || span.from <= pos.ch) &&
            (span.to == null || span.to >= pos.ch))
          markers.push(span.marker.parent || span.marker);
      }
      return markers;
    },
    findMarks: function(from, to, filter) {
      from = clipPos(this, from); to = clipPos(this, to);
      var found = [], lineNo = from.line;
      this.iter(from.line, to.line + 1, function(line) {
        var spans = line.markedSpans;
        if (spans) for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (!(lineNo == from.line && from.ch > span.to ||
                span.from == null && lineNo != from.line||
                lineNo == to.line && span.from > to.ch) &&
              (!filter || filter(span.marker)))
            found.push(span.marker.parent || span.marker);
        }
        ++lineNo;
      });
      return found;
    },
    getAllMarks: function() {
      var markers = [];
      this.iter(function(line) {
        var sps = line.markedSpans;
        if (sps) for (var i = 0; i < sps.length; ++i)
          if (sps[i].from != null) markers.push(sps[i].marker);
      });
      return markers;
    },

    posFromIndex: function(off) {
      var ch, lineNo = this.first;
      this.iter(function(line) {
        var sz = line.text.length + 1;
        if (sz > off) { ch = off; return true; }
        off -= sz;
        ++lineNo;
      });
      return clipPos(this, Pos(lineNo, ch));
    },
    indexFromPos: function (coords) {
      coords = clipPos(this, coords);
      var index = coords.ch;
      if (coords.line < this.first || coords.ch < 0) return 0;
      this.iter(this.first, coords.line, function (line) {
        index += line.text.length + 1;
      });
      return index;
    },

    copy: function(copyHistory) {
      var doc = new Doc(getLines(this, this.first, this.first + this.size),
                        this.modeOption, this.first, this.lineSep);
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
      doc.sel = this.sel;
      doc.extend = false;
      if (copyHistory) {
        doc.history.undoDepth = this.history.undoDepth;
        doc.setHistory(this.getHistory());
      }
      return doc;
    },

    linkedDoc: function(options) {
      if (!options) options = {};
      var from = this.first, to = this.first + this.size;
      if (options.from != null && options.from > from) from = options.from;
      if (options.to != null && options.to < to) to = options.to;
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep);
      if (options.sharedHist) copy.history = this.history;
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
      copySharedMarkers(copy, findSharedMarkers(this));
      return copy;
    },
    unlinkDoc: function(other) {
      if (other instanceof CodeMirror) other = other.doc;
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
        var link = this.linked[i];
        if (link.doc != other) continue;
        this.linked.splice(i, 1);
        other.unlinkDoc(this);
        detachSharedMarkers(findSharedMarkers(this));
        break;
      }
      // If the histories were shared, split them again
      if (other.history == this.history) {
        var splitIds = [other.id];
        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
        other.history = new History(null);
        other.history.done = copyHistoryArray(this.history.done, splitIds);
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
      }
    },
    iterLinkedDocs: function(f) {linkedDocs(this, f);},

    getMode: function() {return this.mode;},
    getEditor: function() {return this.cm;},

    splitLines: function(str) {
      if (this.lineSep) return str.split(this.lineSep);
      return splitLinesAuto(str);
    },
    lineSeparator: function() { return this.lineSep || "\n"; }
  });

  // Public alias.
  Doc.prototype.eachLine = Doc.prototype.iter;

  // Set up methods on CodeMirror's prototype to redirect to the editor's document.
  var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function(method) {
      return function() {return method.apply(this.doc, arguments);};
    })(Doc.prototype[prop]);

  eventMixin(Doc);

  // Call f for all linked documents.
  function linkedDocs(doc, f, sharedHistOnly) {
    function propagate(doc, skip, sharedHist) {
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
        var rel = doc.linked[i];
        if (rel.doc == skip) continue;
        var shared = sharedHist && rel.sharedHist;
        if (sharedHistOnly && !shared) continue;
        f(rel.doc, shared);
        propagate(rel.doc, doc, shared);
      }
    }
    propagate(doc, null, true);
  }

  // Attach a document to an editor.
  function attachDoc(cm, doc) {
    if (doc.cm) throw new Error("This document is already in use.");
    cm.doc = doc;
    doc.cm = cm;
    estimateLineHeights(cm);
    loadMode(cm);
    if (!cm.options.lineWrapping) findMaxLine(cm);
    cm.options.mode = doc.modeOption;
    regChange(cm);
  }

  // LINE UTILITIES

  // Find the line object corresponding to the given line number.
  function getLine(doc, n) {
    n -= doc.first;
    if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
    for (var chunk = doc; !chunk.lines;) {
      for (var i = 0;; ++i) {
        var child = chunk.children[i], sz = child.chunkSize();
        if (n < sz) { chunk = child; break; }
        n -= sz;
      }
    }
    return chunk.lines[n];
  }

  // Get the part of a document between two positions, as an array of
  // strings.
  function getBetween(doc, start, end) {
    var out = [], n = start.line;
    doc.iter(start.line, end.line + 1, function(line) {
      var text = line.text;
      if (n == end.line) text = text.slice(0, end.ch);
      if (n == start.line) text = text.slice(start.ch);
      out.push(text);
      ++n;
    });
    return out;
  }
  // Get the lines between from and to, as array of strings.
  function getLines(doc, from, to) {
    var out = [];
    doc.iter(from, to, function(line) { out.push(line.text); });
    return out;
  }

  // Update the height of a line, propagating the height change
  // upwards to parent nodes.
  function updateLineHeight(line, height) {
    var diff = height - line.height;
    if (diff) for (var n = line; n; n = n.parent) n.height += diff;
  }

  // Given a line object, find its line number by walking up through
  // its parent links.
  function lineNo(line) {
    if (line.parent == null) return null;
    var cur = line.parent, no = indexOf(cur.lines, line);
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
      for (var i = 0;; ++i) {
        if (chunk.children[i] == cur) break;
        no += chunk.children[i].chunkSize();
      }
    }
    return no + cur.first;
  }

  // Find the line at the given vertical position, using the height
  // information in the document tree.
  function lineAtHeight(chunk, h) {
    var n = chunk.first;
    outer: do {
      for (var i = 0; i < chunk.children.length; ++i) {
        var child = chunk.children[i], ch = child.height;
        if (h < ch) { chunk = child; continue outer; }
        h -= ch;
        n += child.chunkSize();
      }
      return n;
    } while (!chunk.lines);
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i], lh = line.height;
      if (h < lh) break;
      h -= lh;
    }
    return n + i;
  }


  // Find the height above the given line.
  function heightAtLine(lineObj) {
    lineObj = visualLine(lineObj);

    var h = 0, chunk = lineObj.parent;
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i];
      if (line == lineObj) break;
      else h += line.height;
    }
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
      for (var i = 0; i < p.children.length; ++i) {
        var cur = p.children[i];
        if (cur == chunk) break;
        else h += cur.height;
      }
    }
    return h;
  }

  // Get the bidi ordering for the given line (and cache it). Returns
  // false for lines that are fully left-to-right, and an array of
  // BidiSpan objects otherwise.
  function getOrder(line) {
    var order = line.order;
    if (order == null) order = line.order = bidiOrdering(line.text);
    return order;
  }

  // HISTORY

  function History(startGen) {
    // Arrays of change events and selections. Doing something adds an
    // event to done and clears undo. Undoing moves events from done
    // to undone, redoing moves them in the other direction.
    this.done = []; this.undone = [];
    this.undoDepth = Infinity;
    // Used to track when changes can be merged into a single undo
    // event
    this.lastModTime = this.lastSelTime = 0;
    this.lastOp = this.lastSelOp = null;
    this.lastOrigin = this.lastSelOrigin = null;
    // Used by the isClean() method
    this.generation = this.maxGeneration = startGen || 1;
  }

  // Create a history change event from an updateDoc-style change
  // object.
  function historyChangeFromChange(doc, change) {
    var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
    return histChange;
  }

  // Pop all selection events off the end of a history array. Stop at
  // a change event.
  function clearSelectionEvents(array) {
    while (array.length) {
      var last = lst(array);
      if (last.ranges) array.pop();
      else break;
    }
  }

  // Find the top change event in the history. Pop off selection
  // events that are in the way.
  function lastChangeEvent(hist, force) {
    if (force) {
      clearSelectionEvents(hist.done);
      return lst(hist.done);
    } else if (hist.done.length && !lst(hist.done).ranges) {
      return lst(hist.done);
    } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
      hist.done.pop();
      return lst(hist.done);
    }
  }

  // Register a change in the history. Merges changes that are within
  // a single operation, ore are close together with an origin that
  // allows merging (starting with "+") into a single event.
  function addChangeToHistory(doc, change, selAfter, opId) {
    var hist = doc.history;
    hist.undone.length = 0;
    var time = +new Date, cur;

    if ((hist.lastOp == opId ||
         hist.lastOrigin == change.origin && change.origin &&
         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastModTime > time - doc.cm.options.historyEventDelay) ||
          change.origin.charAt(0) == "*")) &&
        (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
      // Merge this change into the last event
      var last = lst(cur.changes);
      if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
        // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change);
      } else {
        // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
      }
    } else {
      // Can not be merged, start a new event.
      var before = lst(hist.done);
      if (!before || !before.ranges)
        pushSelectionToHistory(doc.sel, hist.done);
      cur = {changes: [historyChangeFromChange(doc, change)],
             generation: hist.generation};
      hist.done.push(cur);
      while (hist.done.length > hist.undoDepth) {
        hist.done.shift();
        if (!hist.done[0].ranges) hist.done.shift();
      }
    }
    hist.done.push(selAfter);
    hist.generation = ++hist.maxGeneration;
    hist.lastModTime = hist.lastSelTime = time;
    hist.lastOp = hist.lastSelOp = opId;
    hist.lastOrigin = hist.lastSelOrigin = change.origin;

    if (!last) signal(doc, "historyAdded");
  }

  function selectionEventCanBeMerged(doc, origin, prev, sel) {
    var ch = origin.charAt(0);
    return ch == "*" ||
      ch == "+" &&
      prev.ranges.length == sel.ranges.length &&
      prev.somethingSelected() == sel.somethingSelected() &&
      new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
  }

  // Called whenever the selection changes, sets the new selection as
  // the pending selection in the history, and pushes the old pending
  // selection into the 'done' array when it was significantly
  // different (in number of selected ranges, emptiness, or time).
  function addSelectionToHistory(doc, sel, opId, options) {
    var hist = doc.history, origin = options && options.origin;

    // A new event is started when the previous origin does not match
    // the current, or the origins don't allow matching. Origins
    // starting with * are always merged, those starting with + are
    // merged when similar and close together in time.
    if (opId == hist.lastSelOp ||
        (origin && hist.lastSelOrigin == origin &&
         (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
          selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
      hist.done[hist.done.length - 1] = sel;
    else
      pushSelectionToHistory(sel, hist.done);

    hist.lastSelTime = +new Date;
    hist.lastSelOrigin = origin;
    hist.lastSelOp = opId;
    if (options && options.clearRedo !== false)
      clearSelectionEvents(hist.undone);
  }

  function pushSelectionToHistory(sel, dest) {
    var top = lst(dest);
    if (!(top && top.ranges && top.equals(sel)))
      dest.push(sel);
  }

  // Used to store marked span information in the history.
  function attachLocalSpans(doc, change, from, to) {
    var existing = change["spans_" + doc.id], n = 0;
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
      if (line.markedSpans)
        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
      ++n;
    });
  }

  // When un/re-doing restores text containing marked spans, those
  // that have been explicitly cleared should not be restored.
  function removeClearedSpans(spans) {
    if (!spans) return null;
    for (var i = 0, out; i < spans.length; ++i) {
      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
      else if (out) out.push(spans[i]);
    }
    return !out ? spans : out.length ? out : null;
  }

  // Retrieve and filter the old marked spans stored in a change event.
  function getOldSpans(doc, change) {
    var found = change["spans_" + doc.id];
    if (!found) return null;
    for (var i = 0, nw = []; i < change.text.length; ++i)
      nw.push(removeClearedSpans(found[i]));
    return nw;
  }

  // Used both to provide a JSON-safe object in .getHistory, and, when
  // detaching a document, to split the history in two
  function copyHistoryArray(events, newGroup, instantiateSel) {
    for (var i = 0, copy = []; i < events.length; ++i) {
      var event = events[i];
      if (event.ranges) {
        copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
        continue;
      }
      var changes = event.changes, newChanges = [];
      copy.push({changes: newChanges});
      for (var j = 0; j < changes.length; ++j) {
        var change = changes[j], m;
        newChanges.push({from: change.from, to: change.to, text: change.text});
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
          if (indexOf(newGroup, Number(m[1])) > -1) {
            lst(newChanges)[prop] = change[prop];
            delete change[prop];
          }
        }
      }
    }
    return copy;
  }

  // Rebasing/resetting history to deal with externally-sourced changes

  function rebaseHistSelSingle(pos, from, to, diff) {
    if (to < pos.line) {
      pos.line += diff;
    } else if (from < pos.line) {
      pos.line = from;
      pos.ch = 0;
    }
  }

  // Tries to rebase an array of history events given a change in the
  // document. If the change touches the same lines as the event, the
  // event, and everything 'behind' it, is discarded. If the change is
  // before the event, the event's positions are updated. Uses a
  // copy-on-write scheme for the positions, to avoid having to
  // reallocate them all on every rebase, but also avoid problems with
  // shared position objects being unsafely updated.
  function rebaseHistArray(array, from, to, diff) {
    for (var i = 0; i < array.length; ++i) {
      var sub = array[i], ok = true;
      if (sub.ranges) {
        if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
        for (var j = 0; j < sub.ranges.length; j++) {
          rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
          rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
        }
        continue;
      }
      for (var j = 0; j < sub.changes.length; ++j) {
        var cur = sub.changes[j];
        if (to < cur.from.line) {
          cur.from = Pos(cur.from.line + diff, cur.from.ch);
          cur.to = Pos(cur.to.line + diff, cur.to.ch);
        } else if (from <= cur.to.line) {
          ok = false;
          break;
        }
      }
      if (!ok) {
        array.splice(0, i + 1);
        i = 0;
      }
    }
  }

  function rebaseHist(hist, change) {
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
    rebaseHistArray(hist.done, from, to, diff);
    rebaseHistArray(hist.undone, from, to, diff);
  }

  // EVENT UTILITIES

  // Due to the fact that we still support jurassic IE versions, some
  // compatibility wrappers are needed.

  var e_preventDefault = CodeMirror.e_preventDefault = function(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  };
  var e_stopPropagation = CodeMirror.e_stopPropagation = function(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  };
  function e_defaultPrevented(e) {
    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
  }
  var e_stop = CodeMirror.e_stop = function(e) {e_preventDefault(e); e_stopPropagation(e);};

  function e_target(e) {return e.target || e.srcElement;}
  function e_button(e) {
    var b = e.which;
    if (b == null) {
      if (e.button & 1) b = 1;
      else if (e.button & 2) b = 3;
      else if (e.button & 4) b = 2;
    }
    if (mac && e.ctrlKey && b == 1) b = 3;
    return b;
  }

  // EVENT HANDLING

  // Lightweight event framework. on/off also work on DOM nodes,
  // registering native DOM handlers.

  var on = CodeMirror.on = function(emitter, type, f) {
    if (emitter.addEventListener)
      emitter.addEventListener(type, f, false);
    else if (emitter.attachEvent)
      emitter.attachEvent("on" + type, f);
    else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  };

  var noHandlers = []
  function getHandlers(emitter, type, copy) {
    var arr = emitter._handlers && emitter._handlers[type]
    if (copy) return arr && arr.length > 0 ? arr.slice() : noHandlers
    else return arr || noHandlers
  }

  var off = CodeMirror.off = function(emitter, type, f) {
    if (emitter.removeEventListener)
      emitter.removeEventListener(type, f, false);
    else if (emitter.detachEvent)
      emitter.detachEvent("on" + type, f);
    else {
      var handlers = getHandlers(emitter, type, false)
      for (var i = 0; i < handlers.length; ++i)
        if (handlers[i] == f) { handlers.splice(i, 1); break; }
    }
  };

  var signal = CodeMirror.signal = function(emitter, type /*, values...*/) {
    var handlers = getHandlers(emitter, type, true)
    if (!handlers.length) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < handlers.length; ++i) handlers[i].apply(null, args);
  };

  var orphanDelayedCallbacks = null;

  // Often, we want to signal events at a point where we are in the
  // middle of some work, but don't want the handler to start calling
  // other methods on the editor, which might be in an inconsistent
  // state or simply not expect any other events to happen.
  // signalLater looks whether there are any handlers, and schedules
  // them to be executed when the last operation ends, or, if no
  // operation is active, when a timeout fires.
  function signalLater(emitter, type /*, values...*/) {
    var arr = getHandlers(emitter, type, false)
    if (!arr.length) return;
    var args = Array.prototype.slice.call(arguments, 2), list;
    if (operationGroup) {
      list = operationGroup.delayedCallbacks;
    } else if (orphanDelayedCallbacks) {
      list = orphanDelayedCallbacks;
    } else {
      list = orphanDelayedCallbacks = [];
      setTimeout(fireOrphanDelayed, 0);
    }
    function bnd(f) {return function(){f.apply(null, args);};};
    for (var i = 0; i < arr.length; ++i)
      list.push(bnd(arr[i]));
  }

  function fireOrphanDelayed() {
    var delayed = orphanDelayedCallbacks;
    orphanDelayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  // The DOM events that CodeMirror handles can be overridden by
  // registering a (non-DOM) handler on the editor for the event name,
  // and preventDefault-ing the event in that handler.
  function signalDOMEvent(cm, e, override) {
    if (typeof e == "string")
      e = {type: e, preventDefault: function() { this.defaultPrevented = true; }};
    signal(cm, override || e.type, cm, e);
    return e_defaultPrevented(e) || e.codemirrorIgnore;
  }

  function signalCursorActivity(cm) {
    var arr = cm._handlers && cm._handlers.cursorActivity;
    if (!arr) return;
    var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
    for (var i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1)
      set.push(arr[i]);
  }

  function hasHandler(emitter, type) {
    return getHandlers(emitter, type).length > 0
  }

  // Add on and off methods to a constructor's prototype, to make
  // registering events on such objects more convenient.
  function eventMixin(ctor) {
    ctor.prototype.on = function(type, f) {on(this, type, f);};
    ctor.prototype.off = function(type, f) {off(this, type, f);};
  }

  // MISC UTILITIES

  // Number of pixels added to scroller and sizer to hide scrollbar
  var scrollerGap = 30;

  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

  // Reused option objects for setSelection & friends
  var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};

  function Delayed() {this.id = null;}
  Delayed.prototype.set = function(ms, f) {
    clearTimeout(this.id);
    this.id = setTimeout(f, ms);
  };

  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  var countColumn = CodeMirror.countColumn = function(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
      end = string.search(/[^\s\u00a0]/);
      if (end == -1) end = string.length;
    }
    for (var i = startIndex || 0, n = startValue || 0;;) {
      var nextTab = string.indexOf("\t", i);
      if (nextTab < 0 || nextTab >= end)
        return n + (end - i);
      n += nextTab - i;
      n += tabSize - (n % tabSize);
      i = nextTab + 1;
    }
  };

  // The inverse of countColumn -- find the offset that corresponds to
  // a particular column.
  var findColumn = CodeMirror.findColumn = function(string, goal, tabSize) {
    for (var pos = 0, col = 0;;) {
      var nextTab = string.indexOf("\t", pos);
      if (nextTab == -1) nextTab = string.length;
      var skipped = nextTab - pos;
      if (nextTab == string.length || col + skipped >= goal)
        return pos + Math.min(skipped, goal - col);
      col += nextTab - pos;
      col += tabSize - (col % tabSize);
      pos = nextTab + 1;
      if (col >= goal) return pos;
    }
  }

  var spaceStrs = [""];
  function spaceStr(n) {
    while (spaceStrs.length <= n)
      spaceStrs.push(lst(spaceStrs) + " ");
    return spaceStrs[n];
  }

  function lst(arr) { return arr[arr.length-1]; }

  var selectInput = function(node) { node.select(); };
  if (ios) // Mobile Safari apparently has a bug where select() is broken.
    selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; };
  else if (ie) // Suppress mysterious IE10 errors
    selectInput = function(node) { try { node.select(); } catch(_e) {} };

  function indexOf(array, elt) {
    for (var i = 0; i < array.length; ++i)
      if (array[i] == elt) return i;
    return -1;
  }
  function map(array, f) {
    var out = [];
    for (var i = 0; i < array.length; i++) out[i] = f(array[i], i);
    return out;
  }

  function nothing() {}

  function createObj(base, props) {
    var inst;
    if (Object.create) {
      inst = Object.create(base);
    } else {
      nothing.prototype = base;
      inst = new nothing();
    }
    if (props) copyObj(props, inst);
    return inst;
  };

  function copyObj(obj, target, overwrite) {
    if (!target) target = {};
    for (var prop in obj)
      if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
        target[prop] = obj[prop];
    return target;
  }

  function bind(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){return f.apply(null, args);};
  }

  var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  var isWordCharBasic = CodeMirror.isWordChar = function(ch) {
    return /\w/.test(ch) || ch > "\x80" &&
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  };
  function isWordChar(ch, helper) {
    if (!helper) return isWordCharBasic(ch);
    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
    return helper.test(ch);
  }

  function isEmpty(obj) {
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
    return true;
  }

  // Extending unicode characters. A series of a non-extending char +
  // any number of extending chars is treated as a single unit as far
  // as editing and measuring is concerned. This is not fully correct,
  // since some scripts/fonts/browsers also treat other configurations
  // of code points as a group.
  var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
  function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }

  // DOM UTILITIES

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == "string") e.appendChild(document.createTextNode(content));
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  var range;
  if (document.createRange) range = function(node, start, end, endNode) {
    var r = document.createRange();
    r.setEnd(endNode || node, end);
    r.setStart(node, start);
    return r;
  };
  else range = function(node, start, end) {
    var r = document.body.createTextRange();
    try { r.moveToElementText(node.parentNode); }
    catch(e) { return r; }
    r.collapse(true);
    r.moveEnd("character", end);
    r.moveStart("character", start);
    return r;
  };

  function removeChildren(e) {
    for (var count = e.childNodes.length; count > 0; --count)
      e.removeChild(e.firstChild);
    return e;
  }

  function removeChildrenAndAdd(parent, e) {
    return removeChildren(parent).appendChild(e);
  }

  var contains = CodeMirror.contains = function(parent, child) {
    if (child.nodeType == 3) // Android browser always returns false when child is a textnode
      child = child.parentNode;
    if (parent.contains)
      return parent.contains(child);
    do {
      if (child.nodeType == 11) child = child.host;
      if (child == parent) return true;
    } while (child = child.parentNode);
  };

  function activeElt() {
    var activeElement = document.activeElement;
    while (activeElement && activeElement.root && activeElement.root.activeElement)
      activeElement = activeElement.root.activeElement;
    return activeElement;
  }
  // Older versions of IE throws unspecified error when touching
  // document.activeElement in some cases (during loading, in iframe)
  if (ie && ie_version < 11) activeElt = function() {
    try { return document.activeElement; }
    catch(e) { return document.body; }
  };

  function classTest(cls) { return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*"); }
  var rmClass = CodeMirror.rmClass = function(node, cls) {
    var current = node.className;
    var match = classTest(cls).exec(current);
    if (match) {
      var after = current.slice(match.index + match[0].length);
      node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
    }
  };
  var addClass = CodeMirror.addClass = function(node, cls) {
    var current = node.className;
    if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
  };
  function joinClasses(a, b) {
    var as = a.split(" ");
    for (var i = 0; i < as.length; i++)
      if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
    return b;
  }

  // WINDOW-WIDE EVENTS

  // These must be handled carefully, because naively registering a
  // handler for each editor will cause the editors to never be
  // garbage collected.

  function forEachCodeMirror(f) {
    if (!document.body.getElementsByClassName) return;
    var byClass = document.body.getElementsByClassName("CodeMirror");
    for (var i = 0; i < byClass.length; i++) {
      var cm = byClass[i].CodeMirror;
      if (cm) f(cm);
    }
  }

  var globalsRegistered = false;
  function ensureGlobalHandlers() {
    if (globalsRegistered) return;
    registerGlobalHandlers();
    globalsRegistered = true;
  }
  function registerGlobalHandlers() {
    // When the window resizes, we need to refresh active editors.
    var resizeTimer;
    on(window, "resize", function() {
      console.log("test");
      if (resizeTimer == null) resizeTimer = setTimeout(function() {
        resizeTimer = null;
        forEachCodeMirror(onResize);
      }, 100);
    });
    // When the window loses focus, we want to show the editor as blurred
    on(window, "blur", function() {
      forEachCodeMirror(onBlur);
    });
  }

  // FEATURE DETECTION

  // Detect drag-and-drop
  var dragAndDrop = function() {
    // There is *some* kind of drag-and-drop support in IE6-8, but I
    // couldn't get it to work yet.
    if (ie && ie_version < 9) return false;
    var div = elt('div');
    return "draggable" in div || "dragDrop" in div;
  }();

  var zwspSupported;
  function zeroWidthElement(measure) {
    if (zwspSupported == null) {
      var test = elt("span", "\u200b");
      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
      if (measure.firstChild.offsetHeight != 0)
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
    }
    var node = zwspSupported ? elt("span", "\u200b") :
      elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
    node.setAttribute("cm-text", "");
    return node;
  }

  // Feature-detect IE's crummy client rect reporting for bidi text
  var badBidiRects;
  function hasBadBidiRects(measure) {
    if (badBidiRects != null) return badBidiRects;
    var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
    var r0 = range(txt, 0, 1).getBoundingClientRect();
    if (!r0 || r0.left == r0.right) return false; // Safari returns null in some cases (#2780)
    var r1 = range(txt, 1, 2).getBoundingClientRect();
    return badBidiRects = (r1.right - r0.right < 3);
  }

  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLinesAuto = CodeMirror.splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
    var pos = 0, result = [], l = string.length;
    while (pos <= l) {
      var nl = string.indexOf("\n", pos);
      if (nl == -1) nl = string.length;
      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
      var rt = line.indexOf("\r");
      if (rt != -1) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function(string){return string.split(/\r\n?|\n/);};

  var hasSelection = window.getSelection ? function(te) {
    try { return te.selectionStart != te.selectionEnd; }
    catch(e) { return false; }
  } : function(te) {
    try {var range = te.ownerDocument.selection.createRange();}
    catch(e) {}
    if (!range || range.parentElement() != te) return false;
    return range.compareEndPoints("StartToEnd", range) != 0;
  };

  var hasCopyEvent = (function() {
    var e = elt("div");
    if ("oncopy" in e) return true;
    e.setAttribute("oncopy", "return;");
    return typeof e.oncopy == "function";
  })();

  var badZoomedRects = null;
  function hasBadZoomedRects(measure) {
    if (badZoomedRects != null) return badZoomedRects;
    var node = removeChildrenAndAdd(measure, elt("span", "x"));
    var normal = node.getBoundingClientRect();
    var fromRange = range(node, 0, 1).getBoundingClientRect();
    return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
  }

  // KEY NAMES

  var keyNames = CodeMirror.keyNames = {
    3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
    19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
    36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
    46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod",
    106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 127: "Delete",
    173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
    221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
    63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"
  };
  (function() {
    // Number keys
    for (var i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i);
    // Alphabetic keys
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
    // Function keys
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
  })();

  // BIDI HELPERS

  function iterateBidiSections(order, from, to, f) {
    if (!order) return f(from, to, "ltr");
    var found = false;
    for (var i = 0; i < order.length; ++i) {
      var part = order[i];
      if (part.from < to && part.to > from || from == to && part.to == from) {
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
        found = true;
      }
    }
    if (!found) f(from, to, "ltr");
  }

  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
  function lineRight(line) {
    var order = getOrder(line);
    if (!order) return line.text.length;
    return bidiRight(lst(order));
  }

  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(line);
    if (visual != line) lineN = lineNo(visual);
    var order = getOrder(visual);
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
    return Pos(lineN, ch);
  }
  function lineEnd(cm, lineN) {
    var merged, line = getLine(cm.doc, lineN);
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      lineN = null;
    }
    var order = getOrder(line);
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
    return Pos(lineN == null ? lineNo(line) : lineN, ch);
  }
  function lineStartSmart(cm, pos) {
    var start = lineStart(cm, pos.line);
    var line = getLine(cm.doc, start.line);
    var order = getOrder(line);
    if (!order || order[0].level == 0) {
      var firstNonWS = Math.max(0, line.text.search(/\S/));
      var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
      return Pos(start.line, inWS ? 0 : firstNonWS);
    }
    return start;
  }

  function compareBidiLevel(order, a, b) {
    var linedir = order[0].level;
    if (a == linedir) return true;
    if (b == linedir) return false;
    return a < b;
  }
  var bidiOther;
  function getBidiPartAt(order, pos) {
    bidiOther = null;
    for (var i = 0, found; i < order.length; ++i) {
      var cur = order[i];
      if (cur.from < pos && cur.to > pos) return i;
      if ((cur.from == pos || cur.to == pos)) {
        if (found == null) {
          found = i;
        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
          if (cur.from != cur.to) bidiOther = found;
          return i;
        } else {
          if (cur.from != cur.to) bidiOther = i;
          return found;
        }
      }
    }
    return found;
  }

  function moveInLine(line, pos, dir, byUnit) {
    if (!byUnit) return pos + dir;
    do pos += dir;
    while (pos > 0 && isExtendingChar(line.text.charAt(pos)));
    return pos;
  }

  // This is needed in order to move 'visually' through bi-directional
  // text -- i.e., pressing left should make the cursor go left, even
  // when in RTL text. The tricky part is the 'jumps', where RTL and
  // LTR text touch each other. This often requires the cursor offset
  // to move more than one unit, in order to visually move one unit.
  function moveVisually(line, start, dir, byUnit) {
    var bidi = getOrder(line);
    if (!bidi) return moveLogically(line, start, dir, byUnit);
    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

    for (;;) {
      if (target > part.from && target < part.to) return target;
      if (target == part.from || target == part.to) {
        if (getBidiPartAt(bidi, target) == pos) return target;
        part = bidi[pos += dir];
        return (dir > 0) == part.level % 2 ? part.to : part.from;
      } else {
        part = bidi[pos += dir];
        if (!part) return null;
        if ((dir > 0) == part.level % 2)
          target = moveInLine(line, part.to, -1, byUnit);
        else
          target = moveInLine(line, part.from, 1, byUnit);
      }
    }
  }

  function moveLogically(line, start, dir, byUnit) {
    var target = start + dir;
    if (byUnit) while (target > 0 && isExtendingChar(line.text.charAt(target))) target += dir;
    return target < 0 || target > line.text.length ? null : target;
  }

  // Bidirectional ordering algorithm
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
  // that this (partially) implements.

  // One-char codes used for character types:
  // L (L):   Left-to-Right
  // R (R):   Right-to-Left
  // r (AL):  Right-to-Left Arabic
  // 1 (EN):  European Number
  // + (ES):  European Number Separator
  // % (ET):  European Number Terminator
  // n (AN):  Arabic Number
  // , (CS):  Common Number Separator
  // m (NSM): Non-Spacing Mark
  // b (BN):  Boundary Neutral
  // s (B):   Paragraph Separator
  // t (S):   Segment Separator
  // w (WS):  Whitespace
  // N (ON):  Other Neutrals

  // Returns null if characters are ordered as they appear
  // (left-to-right), or an array of sections ({from, to, level}
  // objects) in the order in which they occur visually.
  var bidiOrdering = (function() {
    // Character types for codepoints 0 to 0xff
    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
    // Character types for codepoints 0x600 to 0x6ff
    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
    function charType(code) {
      if (code <= 0xf7) return lowTypes.charAt(code);
      else if (0x590 <= code && code <= 0x5f4) return "R";
      else if (0x600 <= code && code <= 0x6ed) return arabicTypes.charAt(code - 0x600);
      else if (0x6ee <= code && code <= 0x8ac) return "r";
      else if (0x2000 <= code && code <= 0x200b) return "w";
      else if (code == 0x200c) return "b";
      else return "L";
    }

    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
    // Browsers seem to always treat the boundaries of block elements as being L.
    var outerType = "L";

    function BidiSpan(level, from, to) {
      this.level = level;
      this.from = from; this.to = to;
    }

    return function(str) {
      if (!bidiRE.test(str)) return false;
      var len = str.length, types = [];
      for (var i = 0, type; i < len; ++i)
        types.push(type = charType(str.charCodeAt(i)));

      // W1. Examine each non-spacing mark (NSM) in the level run, and
      // change the type of the NSM to the type of the previous
      // character. If the NSM is at the start of the level run, it will
      // get the type of sor.
      for (var i = 0, prev = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "m") types[i] = prev;
        else prev = type;
      }

      // W2. Search backwards from each instance of a European number
      // until the first strong type (R, L, AL, or sor) is found. If an
      // AL is found, change the type of the European number to Arabic
      // number.
      // W3. Change all ALs to R.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "1" && cur == "r") types[i] = "n";
        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
      }

      // W4. A single European separator between two European numbers
      // changes to a European number. A single common separator between
      // two numbers of the same type changes to that type.
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
        var type = types[i];
        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
        else if (type == "," && prev == types[i+1] &&
                 (prev == "1" || prev == "n")) types[i] = prev;
        prev = type;
      }

      // W5. A sequence of European terminators adjacent to European
      // numbers changes to all European numbers.
      // W6. Otherwise, separators and terminators change to Other
      // Neutral.
      for (var i = 0; i < len; ++i) {
        var type = types[i];
        if (type == ",") types[i] = "N";
        else if (type == "%") {
          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
          var replace = (i && types[i-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // W7. Search backwards from each instance of a European number
      // until the first strong type (R, L, or sor) is found. If an L is
      // found, then change the type of the European number to L.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (cur == "L" && type == "1") types[i] = "L";
        else if (isStrong.test(type)) cur = type;
      }

      // N1. A sequence of neutrals takes the direction of the
      // surrounding strong text if the text on both sides has the same
      // direction. European and Arabic numbers act as if they were R in
      // terms of their influence on neutrals. Start-of-level-run (sor)
      // and end-of-level-run (eor) are used at level run boundaries.
      // N2. Any remaining neutrals take the embedding direction.
      for (var i = 0; i < len; ++i) {
        if (isNeutral.test(types[i])) {
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
          var before = (i ? types[i-1] : outerType) == "L";
          var after = (end < len ? types[end] : outerType) == "L";
          var replace = before || after ? "L" : "R";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // Here we depart from the documented algorithm, in order to avoid
      // building up an actual levels array. Since there are only three
      // levels (0, 1, 2) in an implementation that doesn't take
      // explicit embedding into account, we can build up the order on
      // the fly, without following the level-based algorithm.
      var order = [], m;
      for (var i = 0; i < len;) {
        if (countsAsLeft.test(types[i])) {
          var start = i;
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
          order.push(new BidiSpan(0, start, i));
        } else {
          var pos = i, at = order.length;
          for (++i; i < len && types[i] != "L"; ++i) {}
          for (var j = pos; j < i;) {
            if (countsAsNum.test(types[j])) {
              if (pos < j) order.splice(at, 0, new BidiSpan(1, pos, j));
              var nstart = j;
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
              order.splice(at, 0, new BidiSpan(2, nstart, j));
              pos = j;
            } else ++j;
          }
          if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
        }
      }
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift(new BidiSpan(0, 0, m[0].length));
      }
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push(new BidiSpan(0, len - m[0].length, len));
      }
      if (order[0].level == 2)
        order.unshift(new BidiSpan(1, order[0].to, order[0].to));
      if (order[0].level != lst(order).level)
        order.push(new BidiSpan(order[0].level, len, len));

      return order;
    };
  })();

  // THE END

  CodeMirror.version = "5.10.0";

  return CodeMirror;
});
/* @preserve
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
/*! Select2 4.0.1 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice;this.listeners=this.listeners||{},a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")});var f=e.filter("[aria-selected=true]");f.length>0?f.first().trigger("mouseenter"):e.first().trigger("mouseenter")})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&d.setClasses()}),b.on("unselect",function(){b.isOpen()&&d.setClasses()}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-d.$results.scrollTop()+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){
var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},l,j),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&""!==a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");if(void 0!==f&&(this.createTag=f),b.call(this,c,d),a.isArray(e))for(var g=0;g<e.length;g++){var h=e[g],i=this._normalizeItem(h),j=this.option(i);this.$element.append(j)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(a,b,c){function d(a){e.trigger("select",{data:a})}var e=this;b.term=b.term||"";var f=this.tokenizer(b,this.options,d);f.term!==b.term&&(this.$search.length&&(this.$search.val(f.term),this.$search.focus()),b.term=f.term),a.call(this,b,c)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=(this.$container.position(),this.$container.offset());f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom};if("static"!==this.$dropdownParent[0].style.position){var m=this.$dropdownParent.offset();l.top-=m.top,l.left-=m.left}c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(){d._handleSelectOnClose()})},a.prototype._handleSelectOnClose=function(){var a=this.getHighlightedResults();if(!(a.length<1)){var b=a.data("data");null!=b.element&&b.element.selected||null==b.element&&b.selected||this.trigger("select",{data:b})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend({},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this._sync=c.bind(this._syncAttributes,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._sync);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._sync)}),this._observer.observe(this.$element[0],{attributes:!0,subtree:!1})):this.$element[0].addEventListener&&this.$element[0].addEventListener("DOMAttrModified",b._sync,!1)},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._sync),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&this.$element[0].removeEventListener("DOMAttrModified",this._sync,!1),this._sync=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("select2/compat/utils",["jquery"],function(a){function b(b,c,d){var e,f,g=[];e=a.trim(b.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0===this.indexOf("select2-")&&g.push(this)})),e=a.trim(c.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&(f=d(this),null!=f&&g.push(f))})),b.attr("class",g.join(" "))}return{syncCssClasses:b}}),b.define("select2/compat/containerCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("containerCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptContainerCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("containerCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/dropdownCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("dropdownCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptDropdownCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("dropdownCss")||{};
return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/initSelection",["jquery"],function(a){function b(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=c.get("initSelection"),this._isInitialized=!1,a.call(this,b,c)}return b.prototype.current=function(b,c){var d=this;return this._isInitialized?void b.call(this,c):void this.initSelection.call(null,this.$element,function(b){d._isInitialized=!0,a.isArray(b)||(b=[b]),c(b)})},b}),b.define("select2/compat/inputData",["jquery"],function(a){function b(a,b,c){this._currentData=[],this._valueSeparator=c.get("valueSeparator")||",","hidden"===b.prop("type")&&c.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),a.call(this,b,c)}return b.prototype.current=function(b,c){function d(b,c){var e=[];return b.selected||-1!==a.inArray(b.id,c)?(b.selected=!0,e.push(b)):b.selected=!1,b.children&&e.push.apply(e,d(b.children,c)),e}for(var e=[],f=0;f<this._currentData.length;f++){var g=this._currentData[f];e.push.apply(e,d(g,this.$element.val().split(this._valueSeparator)))}c(e)},b.prototype.select=function(b,c){if(this.options.get("multiple")){var d=this.$element.val();d+=this._valueSeparator+c.id,this.$element.val(d),this.$element.trigger("change")}else this.current(function(b){a.map(b,function(a){a.selected=!1})}),this.$element.val(c.id),this.$element.trigger("change")},b.prototype.unselect=function(a,b){var c=this;b.selected=!1,this.current(function(a){for(var d=[],e=0;e<a.length;e++){var f=a[e];b.id!=f.id&&d.push(f.id)}c.$element.val(d.join(c._valueSeparator)),c.$element.trigger("change")})},b.prototype.query=function(a,b,c){for(var d=[],e=0;e<this._currentData.length;e++){var f=this._currentData[e],g=this.matches(b,f);null!==g&&d.push(g)}c({results:d})},b.prototype.addOptions=function(b,c){var d=a.map(c,function(b){return a.data(b[0],"data")});this._currentData.push.apply(this._currentData,d)},b}),b.define("select2/compat/matcher",["jquery"],function(a){function b(b){function c(c,d){var e=a.extend(!0,{},d);if(null==c.term||""===a.trim(c.term))return e;if(d.children){for(var f=d.children.length-1;f>=0;f--){var g=d.children[f],h=b(c.term,g.text,g);h||e.children.splice(f,1)}if(e.children.length>0)return e}return b(c.term,d.text,d)?e:null}return c}return b}),b.define("select2/compat/query",[],function(){function a(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),a.call(this,b,c)}return a.prototype.query=function(a,b,c){b.callback=c;var d=this.options.get("query");d.call(null,b)},a}),b.define("select2/dropdown/attachContainer",[],function(){function a(a,b,c){a.call(this,b,c)}return a.prototype.position=function(a,b,c){var d=c.find(".dropdown-wrapper");d.append(b),b.addClass("select2-dropdown--below"),c.addClass("select2-container--below")},a}),b.define("select2/dropdown/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$dropdown.on(d.join(" "),function(a){a.stopPropagation()})},a}),b.define("select2/selection/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$selection.on(d.join(" "),function(a){a.stopPropagation()})},a}),function(c){"function"==typeof b.define&&b.define.amd?b.define("jquery-mousewheel",["jquery"],c):"object"==typeof exports?module.exports=c:c(a)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d;return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2.");var e=Array.prototype.slice.call(arguments,1);d=c[b].apply(c,e)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});angular.module("plotDB",["backend","ui.codemirror","ngDraggable","ldColorPicker"]);// Generated by LiveScript 1.3.1
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
x$.directive('ngselect2', function(){
  return {
    require: [],
    restrict: 'A',
    scope: {
      model: '=ngData',
      istag: '@istag'
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
      config = {};
      if (s.istag) {
        config.tags = true;
        config.tokenSeparators = [',', ' '];
      }
      $(e).select2(config);
      $(e).select2(config).on('change', function(){
        if (changed()) {
          return setTimeout(function(){
            return s.$apply(function(){
              return s.model = $(e).val();
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
});// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plEditor', ['$scope', '$http', '$timeout', '$interval', '$sce', 'plConfig', 'IOService', 'dataService', 'chartService', 'paletteService', 'themeService', 'plNotify', 'eventBus'].concat(function($scope, $http, $timeout, $interval, $sce, plConfig, IOService, dataService, chartService, paletteService, themeService, plNotify, eventBus){
  import$($scope, {
    plConfig: plConfig,
    theme: new themeService.theme(),
    chart: new chartService.chart({
      permission: {
        'switch': ['public'],
        value: []
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
      if (this.target().owner !== this.user.data.key) {
        key = this.target()._type.location === 'server' ? this.target().key : null;
        ref$ = this.target();
        ref$.key = null;
        ref$.owner = null;
        ref$.permission = {
          'switch': ['public'],
          value: []
        };
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
          if (refresh || (!window.location.search && !/\/chart\/[^/]+/.exec(window.location.pathname))) {
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
        return $scope.canvas.window.postMessage({
          type: "parse-" + name,
          payload: $scope[name].code.content
        }, $scope.plotdbDomain);
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
          if (!this.chart.config[k].hint) {
            continue;
          }
          preset = ((ref1$ = this.theme).typedef || (ref1$.typedef = {}))[this.chart.config[k].type[0].name];
          if (!preset) {
            continue;
          }
          if (preset[this.chart.config[k].hint] != null) {
            this.chart.config[k].value = preset[this.chart.config[k].hint];
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
          list = $scope.chart.library || [];
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
          return $scope.editor.focus();
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
      init: function(){
        var this$ = this;
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
      toggle: function(){
        return this.toggled = !this.toggled;
      },
      toggled: false,
      chart: {
        basetype: null,
        visualencoding: null,
        category: null,
        tags: null,
        library: null
      },
      tab: 0
    },
    dataPanel: {
      init: function(){
        var this$ = this;
        return eventBus.listen('dataset.saved', function(){
          return $timeout(function(){
            return this$.toggled = false;
          }, 1000);
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
        perms = (ref$ = $scope.target().permission).value || (ref$.value = []);
        return forkable = !!perms.filter(function(it){
          return it.perm === 'fork' && it['switch'] === 'public';
        }).length;
      },
      init: function(){
        var this$ = this;
        return ['#edit-sharelink', '#edit-embedcode'].map(function(eventsrc){
          var clipboard;
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
          $scope.$watch('sharePanel.link', function(it){
            var fbobj, k, v, pinobj, emailobj, linkedinobj, twitterobj;
            this$.embedcode = "<iframe src=\"" + it + "\" width=\"100%\" height=\"600px\" frameborder=\"0\"></iframe>";
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
          $scope.$watch('sharePanel.forkable', function(it){
            var forkable;
            forkable = this$.isForkable();
            if (forkable !== this$.forkable && this$.forkable != null) {
              $scope.target().permission.value = it
                ? [{
                  'switch': 'public',
                  perm: 'fork'
                }]
                : [];
              $scope.target().searchable = it;
              return this$.saveHint = true;
            }
          });
          return $scope.$watch($scope.type + ".permission.value", function(){
            var forkable;
            forkable = this$.isForkable();
            if (this$.forkable !== forkable && this$.forkable != null) {
              this$.saveHint = true;
            }
            return this$.forkable = forkable;
          }, true);
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
      toggled: false,
      isPublic: function(){
        return in$("public", $scope.target().permission['switch']);
      },
      setPrivate: function(){
        var ref$;
        ((ref$ = $scope.target()).permission || (ref$.permission = {}))['switch'] = ['private'];
        return this.saveHint = true;
      },
      togglePublic: function(){
        var ref$;
        ((ref$ = $scope.target()).permission || (ref$.permission = {}))['switch'] = ((ref$ = $scope.target()).permission || (ref$.permission = {}))['switch'][0] === 'public'
          ? ['private']
          : ['public'];
        return this.saveHint = true;
      },
      setPublic: function(){
        var ref$;
        ((ref$ = $scope.target()).permission || (ref$.permission = {}))['switch'] = ['public'];
        return this.saveHint = true;
      }
    },
    coloredit: {
      config: function(v, idx){
        return {
          'class': "no-palette text-input",
          context: "context" + idx,
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
        return x$;
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
          return src.colors.forEach(function(it){
            var ref$;
            return ref$ = it.pair, delete it.pair, ref$;
          });
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
      preview: function(file){
        var datauri, iframe;
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
          var ref$, config, dimension, k, v, typedef, ref1$, event, bytes, mime, buf, ints, i$, to$, idx;
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
              if (this$.chart) {
                this$.canvas.window.postMessage({
                  type: 'parse-chart',
                  payload: this$.chart.code.content
                }, this$.plotdbDomain);
              }
              $scope.parse.chart.pending = null;
            }
            if ($scope.parse.theme.pending) {
              if (this$.theme) {
                this$.canvas.window.postMessage({
                  type: 'parse-theme',
                  payload: this$.theme.code.content
                }, this$.plotdbDomain);
              }
              return $scope.parse.theme.pending = null;
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
        'switch': [],
        value: []
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
x$.controller('dataEditCtrl', ['$scope', '$timeout', '$http', 'dataService', 'eventBus', 'plNotify'].concat(function($scope, $timeout, $http, dataService, eventBus, plNotify){
  eventBus.fire('loading.dimmer.on');
  import$($scope, {
    rawdata: "",
    dataset: null,
    worker: new Worker("/js/data/worker.js"),
    loading: true,
    inited: false
  });
  $scope.$watch('inited', function(it){
    return eventBus.fire("loading.dimmer." + (it ? 'off' : 'on'));
  });
  $scope.name = null;
  $scope.save = function(locally){
    var columnLength, k;
    locally == null && (locally = false);
    if (!$scope.dataset || !$scope.dataset.name) {
      return;
    }
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    columnLength = (function(){
      var ref$, results$ = [];
      for (k in (ref$ = $scope.parse).result || (ref$.result = {})) {
        results$.push(k);
      }
      return results$;
    }()).length;
    if (columnLength >= 40) {
      return plNotify.send('danger', "maximal 40 columns is allowed. you have " + columnLength);
    }
    return $scope.parse.run(true).then(function(){
      var isCreate;
      $scope.dataset._type.location = locally ? 'local' : 'server';
      $scope.dataset.permission = {
        "value": [],
        "switch": ["public"]
      };
      $scope.dataset.setFields($scope.parse.result);
      isCreate = !$scope.dataset.key ? true : false;
      $scope.loading = true;
      return $scope.dataset.save().then(function(r){
        $scope.loading = false;
        $scope.$apply(function(){
          return plNotify.send('success', "dataset saved");
        });
        if (isCreate) {
          if ($scope.$parent && $scope.$parent.inlineCreate) {
            $scope.$parent.inlineCreate($scope.dataset);
          } else {
            $scope.$apply(function(){
              return eventBus.fire('loading.dimmer.on');
            });
            setTimeout(function(){
              return window.location.href = dataService.link($scope.dataset);
            }, 1000);
          }
        }
        return eventBus.fire('dataset.saved', $scope.dataset);
      })['catch'](function(e){
        console.log(e.stack);
        $scope.loading = false;
        return $scope.$apply(function(){
          return plNotify.aux.error.io('save', 'data', e);
        });
      });
    });
  };
  $scope.load = function(_type, key){
    var this$ = this;
    $scope.rawdata = "";
    return dataService.load(_type, key).then(function(ret){
      $scope.dataset = new dataService.dataset(ret);
      $scope.parse.revert($scope.dataset);
      return $scope.inited = true;
    })['catch'](function(ret){
      console.error(ret);
      plNotify.send('error', "failed to load dataset. please try reloading");
      if (ret[1] === 'forbidden') {
        window.location.href = '/403.html';
      }
      return $scope.inited = true;
    });
  };
  $scope['delete'] = function(dataset){
    return dataset['delete']().then(function(){
      plNotify.send('success', "dataset deleted");
      return $timeout(function(){
        return window.location.href = "/dataset/";
      }, 1300);
    })['catch'](function(ret){
      console.error(ret);
      return plNotify.send('error', "failed to delete dataset. please try later.");
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
        if (typeof payload !== 'object') {
          return;
        }
        switch (payload.type) {
        case "parse.revert":
          $scope.rawdata = payload.data;
          return $scope.loading = false;
        }
      };
    },
    reset: function(rawdata){
      var dataset;
      dataset = new dataService.dataset(window.dataset || {});
      if ($scope.dataset && $scope.dataset.name) {
        dataset.name = $scope.dataset.name;
      }
      return $scope.dataset = dataset, $scope.rawdata = rawdata, $scope;
    },
    init: function(){
      var ret1, ret2, that, ret, offset;
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
        $scope.inited = true;
      }
      $scope.$watch('rawdata', function(){
        return $scope.parse.run();
      });
      offset = $('#dataset-editbox textarea').offset();
      $('#dataset-editbox textarea').css({
        height: (window.innerHeight - offset.top - 140) + "px"
      });
      $('.float-dataedit textarea').css({
        height: (window.innerHeight - offset.top - 240) + "px"
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
    run: function(force){
      var this$ = this;
      force == null && (force = false);
      return new Promise(function(res, rej){
        var _;
        $scope.loading = true;
        _ = function(){
          this$.handle = null;
          this$.result = {};
          this$.size = $scope.rawdata.length;
          return Papa.parse($scope.rawdata || "", {
            worker: true,
            header: true,
            step: function(arg$){
              var rows, i$, len$, row, lresult$, k, v, ref$, results$ = [];
              rows = arg$.data;
              for (i$ = 0, len$ = rows.length; i$ < len$; ++i$) {
                row = rows[i$];
                lresult$ = [];
                for (k in row) {
                  v = row[k];
                  lresult$.push(((ref$ = this$.result)[k] || (ref$[k] = [])).push(v));
                }
                results$.push(lresult$);
              }
              return results$;
            },
            complete: function(){
              var values, k, v;
              values = (function(){
                var ref$, results$ = [];
                for (k in ref$ = this.result) {
                  v = ref$[k];
                  results$.push(v);
                }
                return results$;
              }.call(this$)) || [];
              return $scope.$apply(function(){
                this$.fields = values.length;
                this$.rows = (values[0] || []).length;
                $scope.loading = false;
                if (this$.rows > 0 && !$scope.dataset.name) {
                  $('#dataset-editbox-meta .input-group input').tooltip('show');
                }
                return res(this$.result);
              });
            }
          });
        };
        if (this$.handle) {
          $timeout.cancel(this$.handle);
        }
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
    encoding: 'UTF-8',
    csv: {
      toggle: function(){
        return setTimeout(function(){
          return $('#data-edit-csv-modal').modal('show');
        }, 0);
      },
      read: function(){
        var file, reader;
        file = $('#data-edit-csv-file')[0].files[0];
        reader = new FileReader();
        reader.onload = function(e){
          $scope.$apply(function(){
            return $scope.reset(e.target.result.trim());
          });
          return $('#data-edit-csv-modal').modal('hide');
        };
        reader.onerror = function(e){};
        return reader.readAsText(file, $scope.parser.encoding);
      }
    },
    gsheet: {
      url: null,
      toggle: function(){
        return setTimeout(function(){
          return $('#data-edit-gsheet-modal').modal('show');
        }, 0);
      },
      read: function(){
        var ret, key, url;
        ret = /\/d\/([^\/]+)/.exec($scope.parser.gsheet.url);
        if (!ret) {
          return;
        }
        key = ret[1];
        url = "https://spreadsheets.google.com/feeds/list/" + key + "/1/public/values?alt=json";
        return $http({
          url: url,
          method: 'GET'
        }).success(function(data){
          var fields, res$, k, lines;
          fields = {};
          data.feed.entry.map(function(it){
            var key, that, results$ = [];
            for (key in it) {
              if (that = /^gsx\$(.+)$/.exec(key)) {
                results$.push(fields[that[1]] = 1);
              }
            }
            return results$;
          });
          res$ = [];
          for (k in fields) {
            res$.push(k);
          }
          fields = res$;
          lines = [fields.join(',')].concat(data.feed.entry.map(function(it){
            var key;
            return (function(){
              var i$, ref$, len$, results$ = [];
              for (i$ = 0, len$ = (ref$ = fields).length; i$ < len$; ++i$) {
                key = ref$[i$];
                results$.push((it["gsx$" + key] || {
                  $t: ""
                }).$t);
              }
              return results$;
            }()).join(',');
          }));
          $scope.$apply(function(){
            return $scope.reset(lines.join('\n'));
          });
          return setTimeout(function(){
            return $('#data-edit-gsheet-modal').modal('hide');
          }, 0);
        });
      }
    },
    link: {
      url: null,
      toggle: function(){
        return setTimeout(function(){
          return $('#dataset-edit-link-modal').modal('show');
        }, 0);
      },
      read: function(){
        return $http({
          url: "http://crossorigin.me/" + $scope.parser.link.url,
          method: 'GET'
        }).success(function(d){
          $scope.$apply(function(){
            return $scope.reset(d.trim());
          });
          return $('#dataset-edit-link-modal').modal('hide');
        });
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
  return $scope.init();
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
    return $scope.showPub = true;
  }
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
        $scope.datasets = $scope.samplesets.concat($scope.mydatasets);
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
var plotdb;
plotdb = {};
import$(plotdb, {
  Number: {
    'default': 0,
    name: 'Number',
    test: function(it){
      return !isNaN(+it);
    },
    level: 3,
    parse: function(it){
      if (typeof it === 'string') {
        return it = parseFloat(it.replace(/,/g, ''));
      } else {
        return it;
      }
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
  },
  Numstring: {
    'default': "",
    name: 'Numstring',
    test: function(it){
      return /\d+/.exec(it + "");
    },
    parse: function(it){
      var numbers, num, i$, to$, j;
      numbers = [];
      num = it.split(/\.?[^0-9.]+/g);
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
  Month: {
    'default': 'Jan',
    name: 'Month',
    level: 3,
    values: {
      abbr: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      en: ['january', 'feburary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
      zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    parse: function(it){
      return it;
    },
    test: function(it){
      var value, k, ref$, v, idx;
      value = it.toLowerCase();
      for (k in ref$ = this.values) {
        v = ref$[k];
        idx = v.indexOf(value);
        if (idx >= 0) {
          return true;
        }
      }
      return false;
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
  },
  Date: {
    'default': '1970/1/1',
    name: 'Date',
    level: 2,
    match: {
      type4: /^(\d{1,2})[/-](\d{4})$/
    },
    test: function(it){
      return this.parse(it) ? true : false;
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
    Neutral: '#cccccc',
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
import$(plotdb, {
  Order: {
    'default': function(k, v, i){
      return i;
    },
    name: 'Order',
    test: function(){
      return !!this.subtype.map(function(type){
        return type.test(it);
      }).filter(function(it){
        return it;
      })[0];
    },
    subtype: [plotdb.Number, plotdb.Date, plotdb.Numstring, plotdb.Month],
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
      types = this.subtype.map(function(it){
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
      if (!(config[k] != null)) {
        config[k] = v['default'];
      } else if (!(config[k].value != null)) {
        config[k] = (v || config[k])['default'];
      } else {
        config[k] = config[k].value;
      }
      type = (config[k].type || []).map(fn$);
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
      doc: {
        content: ""
      },
      style: {
        content: ""
      },
      code: {
        content: 'var module = {};\nmodule.exports = plotdb.chart.create({\n  sample: [1,2,3,4,5],\n  dimension: {\n    value: { type: [plotdb.Number], require: true, desc: "" }\n  },\n  config: {\n    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: false },\n    margin: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: false },\n    fontSize: { name: "Padding", type: [plotdb.Number], default: 12, rebindOnChange: false }\n  },\n  init: function() {\n    var that = this;\n    this.svg = d3.select(this.root).append("svg");\n  },\n  bind: function() {\n    var that = this;\n  },\n  resize: function() {\n    var that = this;\n    var box = this.root.getBoundingClientRect();\n    var width = this.width = box.width;\n    var height = this.height = box.height - 10;\n    this.svg.attr({\n      width: width + "px", height: height + "px",\n      viewBox: [0,0,width,height].join(" "),\n      preserveAspectRatio: "xMidYMid"\n    });\n  },\n  render: function() {\n    var that = this;\n  }\n});'
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
    var mylikes, ref$, ref1$, v;
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    if (!chart) {
      return;
    }
    mylikes = (ref$ = (ref1$ = $scope.user.data).likes || (ref1$.likes = {})).chart || (ref$.chart = {});
    v = mylikes[chart.key] = !mylikes[chart.key];
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
  }
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
x$.service('samplePalette', ['$rootScope'].concat(function($rootScope){
  var ret, i$, len$, item;
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
  for (i$ = 0, len$ = ret.length; i$ < len$; ++i$) {
    item = ret[i$];
    item.colors = item.colors.map(fn$);
  }
  return ret;
  function fn$(it){
    return {
      hex: it
    };
  }
}));var x$;x$=angular.module("plotDB"),x$.service("paletteService",["$rootScope","samplePalette","IOService","baseService"].concat(function(e,r,t,n){var a,c,o;return a={sample:r,list2pal:function(e,r){return{name:e,colors:r.map(function(e){return{hex:e}})}}},c=function(){return this},o=n.derive(name,a,c)}));// Generated by LiveScript 1.3.1
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
        Paging.flexWidth(data);
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
var x$, onSignIn, slice$ = [].slice;
x$ = angular.module('plotDB');
x$.config(['$compileProvider'].concat(function($compileProvider){
  return $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob:|https?:\/\/([a-z0-9]+.)?plotdb\.com\/|https?:\/\/([a-z0-9]+.)?plotdb\.io\/|http:\/\/localhost\/|http:\/\/localhost.io\/|https:\/\/www\.facebook\.com\/|https:\/\/www\.pinterest\.com\/|mailto:\?|http:\/\/www\.linkedin\.com\/|http:\/\/twitter\.com\/)|#/);
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
  $scope.loading = {
    dimmer: false
  };
  eventBus.listen('loading.dimmer.on', function(){
    return $scope.loading.dimmer = true;
  });
  eventBus.listen('loading.dimmer.off', function(){
    return $scope.loading.dimmer = false;
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
    load: function(load, lazy, reset){
      var this$ = this;
      lazy == null && (lazy = 500);
      reset == null && (reset = false);
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
              if (!ret || ret.length === 0) {
                this$.end = true;
              }
              this$.loading = false;
              this$.offset = this$.offset + ret.length;
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
}