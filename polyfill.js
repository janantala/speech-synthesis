(function(window){
  // 'use strict';

  var SpeechSynthesisUtterance = function(text){
    this.text = text || '';
    this.lang = 'en-US';
    this.voiceURI = '';
    this.rate = 1.0;

    return this;
  };

  var SpeechSynthesis = function(){
    var corsProxyServer = 'http://www.corsproxy.com/';
    var audio = new Audio();

    this.pending = false;
    this.speaking = false;
    this.paused = false;

    var speak = function(SpeechSynthesisUtterance){
      if (!SpeechSynthesisUtterance.text) {
        return false;
      }

      var audioURL = [corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', SpeechSynthesisUtterance.text , '&tl=', SpeechSynthesisUtterance.lang].join('');

      audio.addEventListener('play', function() {

      }, false);

      audio.addEventListener('ended', function() {

      }, false);

      audio.addEventListener('error', function() {
      
      }, false);

      audio.autoplay = true;
      audio.src = audioURL;

      console.log(audioURL);
    };

    var cancel = function(){

    };

    var pause = function(){

    };

    var resume = function(){

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

})(window);

