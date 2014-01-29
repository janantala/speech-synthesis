'use strict';

describe('unit specs', function() {

  describe('speechSynthesis', function() {
    it('should be defined', function() {
      expect(speechSynthesis).toBeDefined();
    });

    it('should be object', function() {
      expect(typeof speechSynthesis).toBe('object');
    });

    it('should have attributes', function(){
      console.log(speechSynthesis);
      console.log(speechSynthesis.pending);

      expect(speechSynthesis.pending).toBeDefined();
      expect(speechSynthesis.speaking).toBeDefined();
      expect(speechSynthesis.paused).toBeDefined();

      expect(speechSynthesis.pending).toBe(false);
      expect(speechSynthesis.speaking).toBe(false);
      expect(speechSynthesis.paused).toBe(false);
    });

    it('should have methods', function(){
      expect(speechSynthesis.speak).toBeDefined();
      expect(speechSynthesis.cancel).toBeDefined();
      expect(speechSynthesis.pause).toBeDefined();
      expect(speechSynthesis.resume).toBeDefined();
      expect(speechSynthesis.getVoices).toBeDefined();

      expect(typeof speechSynthesis.speak).toBe('function');
      expect(typeof speechSynthesis.cancel).toBe('function');
      expect(typeof speechSynthesis.pause).toBe('function');
      expect(typeof speechSynthesis.resume).toBe('function');
      expect(typeof speechSynthesis.getVoices).toBe('function');
    });

  });

  describe('SpeechSynthesisUtterance', function() {
    it('should be defined', function() {
      expect(SpeechSynthesisUtterance).toBeDefined();
    });

    it('should be function', function() {
      expect(typeof SpeechSynthesisUtterance).toBe('function');
    });

    it('should have attributes', function() {
      var u = new SpeechSynthesisUtterance('Hello there!');

      expect(u.text).toBeDefined();
      expect(u.lang).toBeDefined();
      expect(u.volume).toBeDefined();
      expect(u.rate).toBeDefined();
      expect(u.pitch).toBeDefined();
      expect(u.voiceURI).toBeDefined();

      expect(u.text).toBe('Hello there!');
      expect(u.lang).toBe('en-US');
      expect(u.volume).toBe(1.0);
      expect(u.rate).toBe(1.0);
      expect(u.pitch).toBe(1.0);
      expect(u.voiceURI).toBe('native');
    });

    it('should have a CORS proxy server', function() {
      var u = new SpeechSynthesisUtterance('Hello there!');
      expect(u.corsProxyServer).toBe('http://www.corsproxy.com/');
    });  
  });
  
});