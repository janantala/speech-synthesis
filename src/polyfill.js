(function(window, document){
  'use strict';

  var splitText = function(text, delimeters, limit){
    var sentences = [];

    // split text by multiple delimeters
    var reduce = function(text, index) {
      if (delimeters[index] && text.trim().length) {

        if (text.indexOf(delimeters[index]) > -1) {

          var s = 1;
          var splitted = text.split(delimeters[index]);
          splitted.forEach(function(words){
            if (words.length) {
              var suffix = '';
              if (s != splitted.length) {
                suffix = delimeters[index];
              }
              words = (words + suffix).trim();
            }

            if (words.length && words.length <= limit) {
              sentences.push(words);
            }
            else {
              reduce(words, index + 1);
            }

            s++;
          });
        }
        else {
          reduce(text, index + 1);
        }
      }
      else if (text.length) {
        var regexp = new RegExp('.{1,' + limit + '}', 'g'); // /.{1,100}/g
        var parts = text.match(regexp);
        while (parts.length > 0) {
          sentences.push(parts.shift().trim());
        }
      }
    };
    
    reduce(text, 0);

    var result = [];
    // merge short sentences
    sentences.forEach(function(sentence){
      if (! result.length) {
        result.push(sentence);
      }
      else if (result[result.length - 1].length + sentence.length + 1 <= limit) {
        result[result.length - 1] += ' ' + sentence;
      }
      else {
        result.push(sentence);
      }
    });

    return result;
  };

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

    var getAudioUrl = function(corsProxyServer, text, lang){
      return [corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', encodeURIComponent(text) , '&tl=', lang].join('');
    };

    this._initAudio = function(){
      var sentences = [];
      that._ended = false;
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

        if (sentences.length) {
          var audioURL = getAudioUrl(that.corsProxyServer, sentences.shift(), that.lang);
          audio.src = audioURL;
          audio.play();
        }
        else {
          updateElapsedTime();
          that._ended = true;
          if (that.onend) {
            that.onend(event);
          }
        }
        
      }, false);

      audio.addEventListener('error', function() {
        updateElapsedTime();
        that._ended = true;
        if (that.onerror) {
          that.onerror(event);
        }
      }, false);

      audio.addEventListener('pause', function() {
        if (!that._ended) {
          updateElapsedTime();
          if (that.onpause) {
            that.onpause(event);
          }
        }
      }, false);

      // Google Translate limit is 100 characters, we need to split longer text
      // we use the multiple delimeters

      var LIMIT = 100;
      if (that.text.length > LIMIT) {

        sentences = splitText(that.text, ['.', '!', '?', ':', ';', ',', ' '], LIMIT);

      }
      else {
        sentences.push(that.text);
      }

      var audioURL = getAudioUrl(that.corsProxyServer, sentences.shift(), that.lang);
      audio.src = audioURL;
      audio.volume = that.volume;
      audio.playbackRate = that.rate;

      return audio;
    };

    return this;
  };

  var SpeechSynthesisPolyfill = function(){

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
        attachAudioEvents(audio, SpeechSynthesisUtterancePolyfill);
        resume();
      }
    };

    var attachAudioEvents = function(audio, SpeechSynthesisUtterancePolyfill) {

      audio.addEventListener('play', function() {
        // console.log('SpeechSynthesis audio play');
      }, false);

      audio.addEventListener('ended', function() {
        // console.log('SpeechSynthesis audio ended');
        if (SpeechSynthesisUtterancePolyfill._ended) {
          playNext(utteranceQueue);
        }
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

  var nativeSpeechSynthesisSupport = function(){
    return window.speechSynthesis && window.SpeechSynthesisUtterance ? true : false;
  };

  var getSpeechSynthesis = function(){
    return nativeSpeechSynthesisSupport() ? window.speechSynthesis : window.speechSynthesisPolyfill;
  };

  var getSpeechSynthesisUtterance = function(){
    return nativeSpeechSynthesisSupport() ? window.SpeechSynthesisUtterance : window.SpeechSynthesisUtterancePolyfill;
  };

  window.SpeechSynthesisUtterancePolyfill = SpeechSynthesisUtterancePolyfill;
  window.speechSynthesisPolyfill = new SpeechSynthesisPolyfill();

  window.nativeSpeechSynthesisSupport = nativeSpeechSynthesisSupport;
  window.getSpeechSynthesis = getSpeechSynthesis;
  window.getSpeechSynthesisUtterance = getSpeechSynthesisUtterance;

})(window, document);

