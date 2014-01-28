(function(window, document){
  'use strict';

  var SpeechSynthesisUtterance = function(text){

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
        console.log('play');
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
        console.log('ended');
        updateElapsedTime();
        
        if (that.onend) {
          that.onend(event);
        }
      }, false);

      audio.addEventListener('error', function() {
        console.log('error');
        updateElapsedTime();
        
        if (that.onerror) {
          that.onerror(event);
        }
      }, false);

      audio.addEventListener('pause', function() {
        console.log('pause');
        updateElapsedTime();
        
        if (that.onpause) {
          that.onpause(event);
        }
      }, false);

      var audioURL = [that.corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', that.text , '&tl=', that.lang].join('');

      audio.src = audioURL;
      audio.volume = that.volume;
      audio.playbackRate = that.rate;
      console.log(audioURL);

      return audio;
    };

    return this;
  };

  var SpeechSynthesis = function(){
    var utteranceQueue = [];

    this.pending = false;
    this.speaking = false;
    this.paused = false;

    var that = this;
    var audio = new Audio();

    var playNext = function(utteranceQueue){
      console.log(utteranceQueue);
      var SpeechSynthesisUtterance = utteranceQueue.shift();

      if (utteranceQueue.length) {
        that.pending = true;
      }
      else {
        that.pending = false;
      }

      if (SpeechSynthesisUtterance) {
        audio = SpeechSynthesisUtterance._initAudio();
        attachAudioEvents(audio);
        resume();
      }
    };

    var attachAudioEvents = function(audio) {

      audio.addEventListener('play', function() {
        console.log('SpeechSynthesis audio play');
      }, false);

      audio.addEventListener('ended', function() {
        console.log('SpeechSynthesis audio ended');
        playNext(utteranceQueue);
      }, false);

      audio.addEventListener('error', function() {
        console.log('SpeechSynthesis audio error');
        playNext(utteranceQueue);
      }, false);

      audio.addEventListener('pause', function() {
        console.log('SpeechSynthesis audio pause');
      }, false);
    };

    var speak = function(SpeechSynthesisUtterance){

      that.pending = true;
      utteranceQueue.push(SpeechSynthesisUtterance);

      
      if (that.speaking || that.paused) {
        // do nothing else
      }
      else {
        playNext(utteranceQueue);
      }
    };

    var cancel = function(){
      utteranceQueue = [];
      audio.pause();
      that.pending = false;
      that.speaking = false;
      that.paused = false;
      console.log(that);
    };

    var pause = function(){
      audio.pause();
      that.paused = true;
      console.log(that);
    };

    var resume = function(){
      audio.play();
      that.speaking = true;
      that.paused = false;
      console.log(that);
    };

    var getVoices = function(){
      return [];
    };

    return {
      'speak': function(SpeechSynthesisUtterance){
        speak(SpeechSynthesisUtterance);
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
  window.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || SpeechSynthesisUtterance;
  window.speechSynthesis = window.speechSynthesis || new SpeechSynthesis();

})(window, document);


console.log(speechSynthesis);
console.log(SpeechSynthesisUtterance);

// var u = new SpeechSynthesisUtterance('Hello World');
// console.log(u);
// speechSynthesis.speak(u);

var u = new SpeechSynthesisUtterance();
u.text = 'Hello World! This is a very long, very very long.';
u.lang = 'en-US';
u.volume = 0.1; // 0 to 1
u.rate = 0.5; // 0.1 to 10
u.pitch = 2; //0 to 2
u.onend = function(event) { console.log('Finished in ' + event.elapsedTime + ' seconds.'); };
u.onpause = function(event) { console.log('Paused in ' + event.elapsedTime + ' seconds.'); };
u.onresume = function(event) { console.log('Resumed in ' + event.elapsedTime + ' seconds.'); };
speechSynthesis.speak(u);
speechSynthesis.speak(new SpeechSynthesisUtterance('I am the second one!'));
speechSynthesis.speak(new SpeechSynthesisUtterance('And I am the last one!'));

window.setTimeout(function(){
  speechSynthesis.pause();
  window.setTimeout(function(){
    speechSynthesis.resume();
  }, 3000);
}, 3000);

