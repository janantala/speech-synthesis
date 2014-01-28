(function(window){
  // 'use strict';

  var SpeechSynthesisUtterance = function(text){
    this.text = text || '';
    this.lang = 'en-US';
    this.voiceURI = '';
    this.volume = 1.0;
    this.rate = 1.0;
    this.pitch = 1.0;

    var corsProxyServer = 'http://www.corsproxy.com/';

    var that = this;
    this._initAudio = function(){
      var audio = new Audio();

      audio.addEventListener('play', function() {
        console.log('play');
      }, false);

      audio.addEventListener('ended', function() {
        console.log('ended');
      }, false);

      audio.addEventListener('error', function() {
      
      }, false);

      var audioURL = [corsProxyServer, 'translate.google.com/translate_tts?ie=UTF-8&q=', that.text , '&tl=', that.lang].join('');

      audio.src = audioURL;
      console.log(audioURL);

      return audio;
    };

    return this;
  };

  var SpeechSynthesis = function(){
    var utterances = [];

    this.pending = true;
    this.speaking = false;
    this.paused = false;

    var that = this;
    var audio = new Audio();

    var speak = function(SpeechSynthesisUtterance){

      that.pending = true;
      utterances.push(SpeechSynthesisUtterance);


      audio = SpeechSynthesisUtterance._initAudio();

      if (!that.paused) {
        that.pending = false;
        that.speaking = true;
        resume();
      }
    };

    var cancel = function(){
      utterances = [];
      console.log(that);
    };

    var pause = function(){
      audio.pause();
      that.paused = true;
      console.log(that);
    };

    var resume = function(){
      audio.play();
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

})(window);


console.log(speechSynthesis);
console.log(SpeechSynthesisUtterance);

// var u = new SpeechSynthesisUtterance('Hello World');
// console.log(u);
// speechSynthesis.speak(u);

var u = new SpeechSynthesisUtterance();
u.text = 'Hello World! This is a very long, very very long.';
u.lang = 'en-US';
u.volume = 0.5; // 0 to 1
u.rate = 1.5; // 0.1 to 10
u.pitch = 2; //0 to 2
u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); };
speechSynthesis.speak(u);


window.setTimeout(function(){
  speechSynthesis.pause();

  window.setTimeout(function(){
    speechSynthesis.resume();

    window.setTimeout(function(){
      speechSynthesis.cancel();
      
    }, 3000);
  }, 3000);
}, 3000);