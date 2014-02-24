(function(window, document){
  'use strict';

  var SpeechSynthesisUtterancePolyfill = function(text){

    /**
     * Identify the polyfill usage
     */

    this.isPolyfill = true;

    /**
     * SpeechSynthesisUtterance Attributes
     */
    
    this.text = text || '';
    this.lang = document.documentElement.lang || 'en-US';
    this.volume = 1.0; // 0 to 1
    this.rate = 1.0; // 0.1 to 10
    // These attributes are not supported:
    this.voiceURI = 'native';
    this.pitch = 1.0; //0 to 2;

    /**
     * SpeechSynthesisUtterance Events
     */
    
    this.onstart = undefined;
    this.onend = undefined;
    this.onerror = undefined;
    this.onpause = undefined;
    this.onresume = undefined;
    // These attributes are not supported:
    this.onmark = undefined;
    this.onboundary = undefined;


    this.corsProxyServer = 'http://www.corsproxy.com/';

    /**
     * Private parts
     */
    
    var that = this;

    var startTime;
    var endTime;
    var event = {
      charIndex: undefined,
      elapsedTime: undefined,
      name: undefined
    };

    var updateElapsedTime = function(){
      endTime = new Date().getTime();
      event.elapsedTime = (endTime - (startTime || endTime)) / 1000;
    };

    this._initAudio = function(){
      var audio = new Audio();

      audio.addEventListener('play', function() {
        updateElapsedTime();

        if (! startTime) {
          startTime = new Date().getTime();
          if (that.onstart) {
            that.onstart(event);
          }
        }
        else {
          if (that.onresume) {
            that.onresume(event);
          }
        }
      }, false);

      audio.addEventListener('ended', function() {
        updateElapsedTime();
        
        if (that.onend) {
          that.onend(event);
        }
      }, false);

      audio.addEventListener('error', function() {
        updateElapsedTime();
        
        if (that.onerror) {
          that.onerror(event);
        }
      }, false);

      audio.addEventListener('pause', function() {
        if (!audio.ended) {
          updateElapsedTime();
          if (that.onpause) {
            that.onpause(event);
          }
        }
      }, false);

      var audioURL = [that.corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', that.text , '&tl=', that.lang].join('');

      audio.src = audioURL;
      audio.volume = that.volume;
      audio.playbackRate = that.rate;

      return audio;
    };

    return this;
  };

  var speechSynthesisPolyfill = function(){

    /**
     * Identify the polyfill usage
     */

    this.isPolyfill = true;

    /**
     * SpeechSynthesis Attributes
     */

    this.pending = false;
    this.speaking = false;
    this.paused = false;

    /**
     * Private parts
     */

    var that = this;
    var audio = new Audio();
    var utteranceQueue = [];

    var playNext = function(utteranceQueue){
      var SpeechSynthesisUtterancePolyfill = utteranceQueue.shift();

      that.speaking = false;
      if (utteranceQueue.length) {
        that.pending = true;
      }
      else {
        that.pending = false;
      }

      if (SpeechSynthesisUtterancePolyfill) {
        audio = SpeechSynthesisUtterancePolyfill._initAudio();
        attachAudioEvents(audio);
        resume();
      }
    };

    var attachAudioEvents = function(audio) {

      audio.addEventListener('play', function() {
        // console.log('SpeechSynthesis audio play');
      }, false);

      audio.addEventListener('ended', function() {
        // console.log('SpeechSynthesis audio ended');
        playNext(utteranceQueue);
      }, false);

      audio.addEventListener('error', function() {
        // console.log('SpeechSynthesis audio error');
        playNext(utteranceQueue);
      }, false);

      audio.addEventListener('pause', function() {
        // console.log('SpeechSynthesis audio pause');
      }, false);
    };

    var speak = function(SpeechSynthesisUtterancePolyfill){

      that.pending = true;
      utteranceQueue.push(SpeechSynthesisUtterancePolyfill);

      if (that.speaking || that.paused) {
        // do nothing else
      }
      else {
        playNext(utteranceQueue);
      }
    };

    var cancel = function(){
      audio.src = '';
      audio = undefined;
      audio = new Audio();

      that.pending = false;
      that.speaking = false;
      that.paused = false;
      utteranceQueue = [];
      playNext(utteranceQueue);
    };

    var pause = function(){
      audio.pause();
      that.speaking = false;
      that.paused = true;
    };

    var resume = function(){
      if (audio.src) {
        audio.play();
        that.speaking = true;
      }
      else {
        playNext(utteranceQueue);
      }

      that.paused = false;
    };

    // Method is not supported
    var getVoices = function(){
      return [];
    };

    return {
      /**
       * Identify the polyfill usage
       */

      'isPolyfill': true,

      /**
       * SpeechSynthesis Methods
       */

      'pending': that.pending,
      'speaking': that.speaking,
      'paused': that.paused,

      'speak': function(SpeechSynthesisUtterancePolyfill){
        speak(SpeechSynthesisUtterancePolyfill);
      },

      'cancel': function(){
        cancel();
      },

      'pause': function(){
        pause();
      },

      'resume': function(){
        resume();
      },

      'getVoices': function(){
        getVoices();
      },

    };
  };

  window.SpeechSynthesisUtterancePolyfill = SpeechSynthesisUtterancePolyfill;
  window.speechSynthesisPolyfill = new speechSynthesisPolyfill();

})(window, document);

