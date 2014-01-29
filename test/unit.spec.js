'use strict';

describe('unit specs', function() {

  it('should be defined', function() {
    expect(window.SpeechSynthesisUtterance).toBeDefined();
    expect(window.speechSynthesis).toBeDefined();
  });
});