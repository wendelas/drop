/*! drop 0.5.4 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["Tether"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("Tether"));
  } else {
    factory(Tether);
  }
}(this, function (Tether) {

var Drop, Evented, MIRROR_ATTACH, addClass, allDrops, clickEvents, createContext, end, extend, hasClass, name, ref, removeClass, removeFromArray, sortAttach, tempEl, touchDevice, transitionEndEvent, transitionEndEvents,
  extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

ref = Tether.Utils, extend = ref.extend, addClass = ref.addClass, removeClass = ref.removeClass, hasClass = ref.hasClass, Evented = ref.Evented;

touchDevice = 'ontouchstart' in document.documentElement;

clickEvents = ['click'];

if (touchDevice) {
  clickEvents.push('touchstart');
}

transitionEndEvents = {
  'WebkitTransition': 'webkitTransitionEnd',
  'MozTransition': 'transitionend',
  'OTransition': 'otransitionend',
  'transition': 'transitionend'
};

transitionEndEvent = '';

for (name in transitionEndEvents) {
  end = transitionEndEvents[name];
  tempEl = document.createElement('p');
  if (tempEl.style[name] !== void 0) {
    transitionEndEvent = end;
  }
}

sortAttach = function(str) {
  var first, ref1, ref2, second;
  ref1 = str.split(' '), first = ref1[0], second = ref1[1];
  if (first === 'left' || first === 'right') {
    ref2 = [second, first], first = ref2[0], second = ref2[1];
  }
  return [first, second].join(' ');
};

MIRROR_ATTACH = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
  middle: 'middle',
  center: 'center'
};

allDrops = {};

removeFromArray = function(arr, item) {
  var index, results;
  results = [];
  while ((index = arr.indexOf(item)) !== -1) {
    results.push(arr.splice(index, 1));
  }
  return results;
};

createContext = function(options) {
  var DropInstance, defaultOptions, drop, name1;
  if (options == null) {
    options = {};
  }
  drop = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(DropInstance, arguments, function(){});
  };
  extend(drop, {
    createContext: createContext,
    drops: [],
    defaults: {}
  });
  defaultOptions = {
    classPrefix: 'drop',
    defaults: {
      position: 'bottom left',
      openOn: 'click',
      constrainToScrollParent: true,
      constrainToWindow: true,
      classes: '',
      remove: false,
      tetherOptions: {}
    }
  };
  extend(drop, defaultOptions, options);
  extend(drop.defaults, defaultOptions.defaults, options.defaults);
  if (allDrops[name1 = drop.classPrefix] == null) {
    allDrops[name1] = [];
  }
  drop.updateBodyClasses = function() {
    var _drop, anyOpen, i, len, ref1;
    anyOpen = false;
    ref1 = allDrops[drop.classPrefix];
    for (i = 0, len = ref1.length; i < len; i++) {
      _drop = ref1[i];
      if (!(_drop.isOpened())) {
        continue;
      }
      anyOpen = true;
      break;
    }
    if (anyOpen) {
      return addClass(document.body, drop.classPrefix + "-open");
    } else {
      return removeClass(document.body, drop.classPrefix + "-open");
    }
  };
  DropInstance = (function(superClass) {
    extend1(DropInstance, superClass);

    function DropInstance(options1) {
      this.options = options1;
      this.options = extend({}, drop.defaults, this.options);
      this.target = this.options.target;
      if (this.target == null) {
        throw new Error('Drop Error: You must provide a target.');
      }
      if (this.options.classes) {
        addClass(this.target, this.options.classes);
      }
      drop.drops.push(this);
      allDrops[drop.classPrefix].push(this);
      this._boundEvents = [];
      this.setupElements();
      this.setupEvents();
      this.setupTether();
    }

    DropInstance.prototype._on = function(element, event, handler) {
      this._boundEvents.push({
        element: element,
        event: event,
        handler: handler
      });
      return element.addEventListener(event, handler);
    };

    DropInstance.prototype.setupElements = function() {
      var generateAndSetContent;
      this.drop = document.createElement('div');
      addClass(this.drop, drop.classPrefix);
      if (this.options.classes) {
        addClass(this.drop, this.options.classes);
      }
      this.content = document.createElement('div');
      addClass(this.content, drop.classPrefix + "-content");
      if (typeof this.options.content === 'function') {
        generateAndSetContent = (function(_this) {
          return function() {
            var contentElementOrHTML;
            contentElementOrHTML = _this.options.content.call(_this, _this);
            if (typeof contentElementOrHTML === 'string') {
              return _this.content.innerHTML = contentElementOrHTML;
            } else if (typeof contentElementOrHTML === 'object') {
              _this.content.innerHTML = "";
              return _this.content.appendChild(contentElementOrHTML);
            } else {
              throw new Error('Drop Error: Content function should return a string or HTMLElement.');
            }
          };
        })(this);
        generateAndSetContent();
        this.on('open', generateAndSetContent.bind(this));
      } else if (typeof this.options.content === 'object') {
        this.content.appendChild(this.options.content);
      } else {
        this.content.innerHTML = this.options.content;
      }
      return this.drop.appendChild(this.content);
    };

    DropInstance.prototype.setupTether = function() {
      var constraints, dropAttach;
      dropAttach = this.options.position.split(' ');
      dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
      dropAttach = dropAttach.join(' ');
      constraints = [];
      if (this.options.constrainToScrollParent) {
        constraints.push({
          to: 'scrollParent',
          pin: 'top, bottom',
          attachment: 'together none'
        });
      } else {
        constraints.push({
          to: 'scrollParent'
        });
      }
      if (this.options.constrainToWindow !== false) {
        constraints.push({
          to: 'window',
          attachment: 'together'
        });
      } else {
        constraints.push({
          to: 'window'
        });
      }
      options = {
        element: this.drop,
        target: this.target,
        attachment: sortAttach(dropAttach),
        targetAttachment: sortAttach(this.options.position),
        classPrefix: drop.classPrefix,
        offset: '0 0',
        targetOffset: '0 0',
        enabled: false,
        constraints: constraints
      };
      if (this.options.tetherOptions !== false) {
        return this.tether = new Tether(extend({}, options, this.options.tetherOptions));
      }
    };

    DropInstance.prototype.setupEvents = function() {
      var clickEvent, closeHandler, events, i, len, onUs, openHandler, out, outTimeout, over;
      if (!this.options.openOn) {
        return;
      }
      if (this.options.openOn === 'always') {
        setTimeout(this.open.bind(this));
        return;
      }
      events = this.options.openOn.split(' ');
      if (indexOf.call(events, 'click') >= 0) {
        openHandler = (function(_this) {
          return function(event) {
            _this.toggle();
            return event.preventDefault();
          };
        })(this);
        closeHandler = (function(_this) {
          return function(event) {
            if (!_this.isOpened()) {
              return;
            }
            if (event.target === _this.drop || _this.drop.contains(event.target)) {
              return;
            }
            if (event.target === _this.target || _this.target.contains(event.target)) {
              return;
            }
            return _this.close();
          };
        })(this);
        for (i = 0, len = clickEvents.length; i < len; i++) {
          clickEvent = clickEvents[i];
          this._on(this.target, clickEvent, openHandler);
          this._on(document, clickEvent, closeHandler);
        }
      }
      if (indexOf.call(events, 'hover') >= 0) {
        onUs = false;
        over = (function(_this) {
          return function() {
            onUs = true;
            return _this.open();
          };
        })(this);
        outTimeout = null;
        out = (function(_this) {
          return function() {
            onUs = false;
            if (outTimeout != null) {
              clearTimeout(outTimeout);
            }
            return outTimeout = setTimeout(function() {
              if (!onUs) {
                _this.close();
              }
              return outTimeout = null;
            }, 50);
          };
        })(this);
        this._on(this.target, 'mouseover', over);
        this._on(this.drop, 'mouseover', over);
        this._on(this.target, 'mouseout', out);
        return this._on(this.drop, 'mouseout', out);
      }
    };

    DropInstance.prototype.isOpened = function() {
      return hasClass(this.drop, drop.classPrefix + "-open");
    };

    DropInstance.prototype.toggle = function() {
      if (this.isOpened()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    DropInstance.prototype.open = function() {
      var ref1, ref2;
      if (this.isOpened()) {
        return;
      }
      if (!this.drop.parentNode) {
        document.body.appendChild(this.drop);
      }
      if ((ref1 = this.tether) != null) {
        ref1.enable();
      }
      addClass(this.drop, drop.classPrefix + "-open");
      addClass(this.drop, drop.classPrefix + "-open-transitionend");
      setTimeout((function(_this) {
        return function() {
          return addClass(_this.drop, drop.classPrefix + "-after-open");
        };
      })(this));
      if ((ref2 = this.tether) != null) {
        ref2.position();
      }
      this.trigger('open');
      return drop.updateBodyClasses();
    };

    DropInstance.prototype.close = function() {
      var handler, ref1;
      if (!this.isOpened()) {
        return;
      }
      removeClass(this.drop, drop.classPrefix + "-open");
      removeClass(this.drop, drop.classPrefix + "-after-open");
      this.drop.addEventListener(transitionEndEvent, handler = (function(_this) {
        return function() {
          if (!hasClass(_this.drop, drop.classPrefix + "-open")) {
            removeClass(_this.drop, drop.classPrefix + "-open-transitionend");
          }
          return _this.drop.removeEventListener(transitionEndEvent, handler);
        };
      })(this));
      this.trigger('close');
      if ((ref1 = this.tether) != null) {
        ref1.disable();
      }
      drop.updateBodyClasses();
      if (this.options.remove) {
        return this.remove();
      }
    };

    DropInstance.prototype.remove = function() {
      var ref1;
      this.close();
      return (ref1 = this.drop.parentNode) != null ? ref1.removeChild(this.drop) : void 0;
    };

    DropInstance.prototype.position = function() {
      var ref1;
      if (this.isOpened()) {
        return (ref1 = this.tether) != null ? ref1.position() : void 0;
      }
    };

    DropInstance.prototype.destroy = function() {
      var element, event, handler, i, len, ref1, ref2, ref3;
      this.remove();
      if ((ref1 = this.tether) != null) {
        ref1.destroy();
      }
      ref2 = this._boundEvents;
      for (i = 0, len = ref2.length; i < len; i++) {
        ref3 = ref2[i], element = ref3.element, event = ref3.event, handler = ref3.handler;
        element.removeEventListener(event, handler);
      }
      this._boundEvents = [];
      this.tether = null;
      this.drop = null;
      this.content = null;
      this.target = null;
      removeFromArray(allDrops[drop.classPrefix], this);
      return removeFromArray(drop.drops, this);
    };

    return DropInstance;

  })(Evented);
  return drop;
};

Drop = createContext();

document.addEventListener('DOMContentLoaded', function() {
  return Drop.updateBodyClasses();
});

return Drop;


}));
