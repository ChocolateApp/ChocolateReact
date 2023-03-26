(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("video.js"), require("global/window")) : typeof define === "function" && define.amd ? define(["video.js", "global/window"], factory) : global.videojsMobileUi = factory(global.videojs, global.window);
  }(this, function (videojs, window) {
    "use strict";
    videojs = videojs && videojs.hasOwnProperty("default") ? videojs.default : videojs;
    window = window && window.hasOwnProperty("default") ? window.default : window;
    var version = "0.5.3";
    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, enumerable: false, writable: true, configurable: true}});
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };
    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };
    var Component = videojs.getComponent("Component");
    var dom = videojs.dom || videojs;
    var TouchOverlay = function (_Component) {
      inherits(TouchOverlay, _Component);
      function TouchOverlay(player, options) {
        classCallCheck(this, TouchOverlay);
        var _this = possibleConstructorReturn(this, _Component.call(this, player, options));
        _this.seekSeconds = options.seekSeconds;
        _this.tapTimeout = options.tapTimeout;
        _this.addChild("playToggle", {});
        player.on(["playing", "userinactive"], function (e) {
          _this.removeClass("show-play-toggle");
        });
        if (_this.player_.options_.inactivityTimeout === 0) {
          _this.player_.options_.inactivityTimeout = 5e3;
        }
        _this.enable();
        return _this;
      }
      TouchOverlay.prototype.createEl = function createEl() {
        var el = dom.createEl("div", {className: "vjs-touch-overlay", tabIndex: -1});
        return el;
      };
      TouchOverlay.prototype.handleTap = function handleTap(event) {
        var _this2 = this;
        if (event.target !== this.el_) {
          return;
        }
        event.preventDefault();
        if (this.firstTapCaptured) {
          this.firstTapCaptured = false;
          if (this.timeout) {
            window.clearTimeout(this.timeout);
          }
          this.handleDoubleTap(event);
        } else {
          this.firstTapCaptured = true;
          this.timeout = window.setTimeout(function () {
            _this2.firstTapCaptured = false;
            _this2.handleSingleTap(event);
          }, this.tapTimeout);
        }
      };
      TouchOverlay.prototype.handleSingleTap = function handleSingleTap(event) {
        this.removeClass("skip");
        this.toggleClass("show-play-toggle");
      };
      TouchOverlay.prototype.handleDoubleTap = function handleDoubleTap(event) {
        var _this3 = this;
        var rect = this.el_.getBoundingClientRect();
        var x = event.changedTouches[0].clientX - rect.left;
        if (x < rect.width * 0.4) {
          this.player_.currentTime(Math.max(0, this.player_.currentTime() - this.seekSeconds));
          this.addClass("reverse");
        } else if (x > rect.width - rect.width * 0.4) {
          this.player_.currentTime(Math.min(this.player_.duration(), this.player_.currentTime() + this.seekSeconds));
          this.removeClass("reverse");
        } else {
          return;
        }
        this.removeClass("show-play-toggle");
        this.removeClass("skip");
        window.requestAnimationFrame(function () {
          _this3.addClass("skip");
        });
      };
      TouchOverlay.prototype.enable = function enable() {
        this.firstTapCaptured = false;
        this.on("touchend", this.handleTap);
      };
      TouchOverlay.prototype.disable = function disable() {
        this.off("touchend", this.handleTap);
      };
      return TouchOverlay;
    }(Component);
    Component.registerComponent("TouchOverlay", TouchOverlay);
    var defaults = {fullscreen: {enterOnRotate: true, exitOnRotate: true, lockOnRotate: true, iOS: false}, touchControls: {seekSeconds: 10, tapTimeout: 300, disableOnEnd: false}};
    var screen = window.screen;
    var angle = function angle() {
      if (typeof window.orientation === "number") {
        return window.orientation;
      }
      if (screen && screen.orientation && screen.orientation.angle) {
        return window.orientation;
      }
      videojs.log("angle unknown");
      return 0;
    };
    var registerPlugin = videojs.registerPlugin || videojs.plugin;
    var onPlayerReady = function onPlayerReady(player, options) {
      player.addClass("vjs-mobile-ui");
      if (options.touchControls.disableOnEnd || typeof player.endscreen === "function") {
        player.addClass("vjs-mobile-ui-disable-end");
      }
      if (options.fullscreen.iOS && videojs.browser.IS_IOS && videojs.browser.IOS_VERSION > 9 && !player.el_.ownerDocument.querySelector(".bc-iframe")) {
        player.tech_.el_.setAttribute("playsinline", "playsinline");
        player.tech_.supportsFullScreen = function () {
          return false;
        };
      }
      var controlBarIdx = void 0;
      var versionParts = videojs.VERSION.split(".");
      var major = parseInt(versionParts[0], 10);
      var minor = parseInt(versionParts[1], 10);
      if (major < 7 || major === 7 && minor < 7) {
        controlBarIdx = Array.prototype.indexOf.call(player.el_.children, player.getChild("ControlBar").el_);
      } else {
        controlBarIdx = player.children_.indexOf(player.getChild("ControlBar"));
      }
      player.addChild("TouchOverlay", options.touchControls, controlBarIdx);
      var locked = false;
      var rotationHandler = function rotationHandler() {
        var currentAngle = angle();
        if ((currentAngle === 90 || currentAngle === 270 || currentAngle === -90) && options.fullscreen.enterOnRotate) {
          if (player.paused() === false) {
            player.requestFullscreen();
            if (options.fullscreen.lockOnRotate && screen.orientation && screen.orientation.lock) {
              screen.orientation.lock("landscape").then(function () {
                locked = true;
              }).catch(function () {
                videojs.log("orientation lock not allowed");
              });
            }
          }
        }
        if ((currentAngle === 0 || currentAngle === 180) && options.fullscreen.exitOnRotate) {
          if (player.isFullscreen()) {
            player.exitFullscreen();
          }
        }
      };
      if (videojs.browser.IS_IOS) {
        window.addEventListener("orientationchange", rotationHandler);
      } else if (screen.orientation) {
        screen.orientation.onchange = rotationHandler;
      }
      player.on("ended", function (_) {
        if (locked === true) {
          screen.orientation.unlock();
          locked = false;
        }
      });
    };
    var mobileUi = function mobileUi() {
      var _this = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (options.forceForTesting || videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
        this.ready(function () {
          onPlayerReady(_this, videojs.mergeOptions(defaults, options));
        });
      }
    };
    registerPlugin("mobileUi", mobileUi);
    mobileUi.VERSION = version;
    return mobileUi;
  }));
  