(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("video.js")) : typeof define === "function" && define.amd ? define(["video.js"], factory) : global.videojsEventTracking = factory(global.videojs);
  }(this, function (videojs) {
    "use strict";
    videojs = "default" in videojs ? videojs.default : videojs;
    var version = "1.0.1";
    var BufferTracking = function BufferTracking(config) {
      var _this = this;
      var timer = null;
      var scrubbing = false;
      var bufferPosition = false;
      var bufferStart = false;
      var bufferEnd = false;
      var bufferCount = 0;
      var readyState = false;
      var reset = function reset() {
        if (timer) {
          clearTimeout(timer);
        }
        scrubbing = false;
        bufferPosition = false;
        bufferStart = false;
        bufferEnd = false;
        bufferCount = 0;
        readyState = false;
      };
      var onPause = function onPause() {
        bufferStart = false;
        if (_this.scrubbing() && !(config.bufferingConfig && config.bufferingConfig.includeScrub)) {
          scrubbing = true;
          timer = setTimeout(function () {
            scrubbing = false;
          }, 200);
        }
      };
      var onPlayerWaiting = function onPlayerWaiting() {
        if (bufferStart === false && scrubbing === false && _this.currentTime() > 0) {
          bufferStart = new Date;
          bufferPosition = +_this.currentTime().toFixed(0);
          readyState = +_this.readyState();
        }
      };
      var onTimeupdate = function onTimeupdate() {
        var curTime = +_this.currentTime().toFixed(0);
        if (bufferStart && curTime !== bufferPosition) {
          bufferEnd = new Date;
          var secondsToLoad = (bufferEnd - bufferStart) / 1e3;
          bufferStart = false;
          bufferPosition = false;
          bufferCount++;
          _this.trigger("tracking:buffered", {currentTime: +curTime, readyState: +readyState, secondsToLoad: +secondsToLoad.toFixed(3), bufferCount: +bufferCount});
        }
      };
      this.on("dispose", reset);
      this.on("loadstart", reset);
      this.on("ended", reset);
      this.on("pause", onPause);
      this.on("waiting", onPlayerWaiting);
      this.on("timeupdate", onTimeupdate);
    };
    var PauseTracking = function PauseTracking(config) {
      var player = this;
      var pauseCount = 0;
      var timer = null;
      var locked = false;
      var reset = function reset(e) {
        if (timer) {
          clearTimeout(timer);
        }
        pauseCount = 0;
        locked = false;
      };
      player.on("dispose", reset);  
      player.on("loadstart", reset);
      player.on("ended", reset);
      player.on("pause", function () {
        if (player.scrubbing() || locked) {
          return;
        }
        timer = setTimeout(function () {
          pauseCount++;
          player.trigger("tracking:pause", {pauseCount: pauseCount});
        }, 300);
      });
    };
    var PercentileTracking = function PercentileTracking(config) {
      var player = this;
      var first = false;
      var second = false;
      var third = false;
      var duration = 0;
      var pauseCount = 0;
      var seekCount = 0;
      var reset = function reset(e) {
        first = false;
        second = false;
        third = false;
        duration = 0;
        pauseCount = 0;
        seekCount = 0;
      };
      var incPause = function incPause() {
        return pauseCount++;
      };
      var incSeek = function incSeek() {
        return seekCount++;
      };
      player.on("dispose", reset);
      player.on("loadstart", reset);
      player.on("tracking:pause", incPause);
      player.on("tracking:seek", incSeek);
      player.on("timeupdate", function () {
        var curTime = +player.currentTime().toFixed(0);
        var data = {seekCount: seekCount, pauseCount: pauseCount, currentTime: curTime, duration: duration};
        switch (curTime) {
          case first:
            first = false;
            player.trigger("tracking:first-quarter", data);
            break;
          case second:
            second = false;
            player.trigger("tracking:second-quarter", data);
            break;
          case third:
            third = false;
            player.trigger("tracking:third-quarter", data);
            break;
        }
      });
      player.on("ended", function () {
        var data = {seekCount: seekCount, pauseCount: pauseCount, currentTime: duration, duration: duration};
        player.trigger("tracking:fourth-quarter", data);
      });
      player.on("durationchange", function () {
        duration = +player.duration().toFixed(0);
        if (duration > 0) {
          var quarter = (duration / 4).toFixed(0);
          first = +quarter;
          second = +quarter * 2;
          third = +quarter * 3;
        }
      });
    };
    var PerformanceTracking = function PerformanceTracking(config) {
      if (typeof config === "undefined" || typeof config.performance !== "function") {
        return;
      }
      var player = this;
      var seekCount = 0;
      var pauseCount = 0;
      var bufferCount = 0;
      var totalDuration = 0;
      var watchedDuration = 0;
      var bufferDuration = 0;
      var initialLoadTime = 0;
      var timestamps = [];
      var reset = function reset() {
        seekCount = 0;
        pauseCount = 0;
        bufferCount = 0;
        totalDuration = 0;
        watchedDuration = 0;
        bufferDuration = 0;
        initialLoadTime = 0;
        timestamps = [];
      };
      var trigger = function trigger() {
        var data = {pauseCount: pauseCount, seekCount: seekCount, bufferCount: bufferCount, totalDuration: totalDuration, watchedDuration: watchedDuration, bufferDuration: bufferDuration, initialLoadTime: initialLoadTime};
        config.performance.call(player, data);
      };
      var triggerAndReset = function triggerAndReset() {
        trigger();
        reset();
      };
      if (typeof window.addEventListener === "function") {
        window.addEventListener("beforeunload", triggerAndReset);
        player.on("dispose", function () {
          window.removeEventListener("beforeunload", triggerAndReset);
        });
      }
      player.on("loadstart", function () {
        if (totalDuration > 0) {
          trigger();
        }
        reset();
      });
      player.on("ended", triggerAndReset);
      player.on("dispose", triggerAndReset);
      player.on("timeupdate", function () {
        var curTime = +player.currentTime().toFixed(0);
        if (timestamps.indexOf(curTime) < 0) {
          timestamps.push(curTime);
        }
        watchedDuration = timestamps.length;
      });
      player.on("loadeddata", function (e, data) {
        totalDuration = +player.duration().toFixed(0);
      });
      player.on("tracking:seek", function (e, data) {
        seekCount = data.seekCount;
      });
      player.on("tracking:pause", function (e, data) {
        pauseCount = data.pauseCount;
      });
      player.on("tracking:buffered", function (e, data) {
        bufferCount = data.bufferCount;
        bufferDuration = +(bufferDuration + data.secondsToLoad).toFixed(3);
      });
      player.on("tracking:firstplay", function (e, data) {
        initialLoadTime = data.secondsToLoad;
      });
    };
    var PlayTracking = function PlayTracking(config) {
      var _this = this;
      var firstplay = false;
      var loadstart = 0;
      var loadend = 0;
      var secondsToLoad = 0;
      var reset = function reset() {
        firstplay = false;
        loadstart = 0;
        loadend = 0;
        secondsToLoad = 0;
      };
      var onLoadStart = function onLoadStart() {
        reset();
        loadstart = new Date;
      };
      var onLoadedData = function onLoadedData() {
        loadend = new Date;
        secondsToLoad = (loadend - loadstart) / 1e3;
      };
      var onPlaying = function onPlaying() {
        if (!firstplay) {
          firstplay = true;
          _this.trigger("tracking:firstplay", {secondsToLoad: +secondsToLoad.toFixed(3)});
        }
      };
      this.on("dispose", reset);
      this.on("loadstart", onLoadStart);
      this.on("loadeddata", onLoadedData);
      this.on("playing", onPlaying);
    };
    var SeekTracking = function SeekTracking(config) {
      var player = this;
      var seekCount = 0;
      var locked = true;
      var reset = function reset() {
        seekCount = 0;
        locked = true;
      };
      player.on("dispose", reset);
      player.on("loadstart", reset);
      player.on("ended", reset);
      player.on("play", function () {
        locked = false;
      });
      player.on("pause", function () {
        if (locked || !player.scrubbing()) {
          return;
        }
        var curTime = +player.currentTime().toFixed(0);
        seekCount++;
        player.trigger("tracking:seek", {seekCount: +seekCount, seekTo: curTime});
      });
    };
    var registerPlugin = videojs.registerPlugin || videojs.plugin;
    var getPlugin = videojs.getPlugin || videojs.plugin;
    var eventTracking = function eventTracking(options) {
      PauseTracking.apply(this, arguments);
      BufferTracking.apply(this, arguments);
      PercentileTracking.apply(this, arguments);
      PlayTracking.apply(this, arguments);
      SeekTracking.apply(this, arguments);
      PerformanceTracking.apply(this, arguments);
    };
    if (typeof getPlugin("eventTracking") === "undefined") {
      registerPlugin("eventTracking", eventTracking);
    }
    eventTracking.VERSION = version;
    return eventTracking;
  }));
  