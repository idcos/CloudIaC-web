import CodeMirror from 'codemirror';

CodeMirror.defineMode("ansi", function(config) {
  return {
    token: function(stream, state) {
      stream.next();
      if (/\u001B/.test(stream.string)) {
        return 'ansi';
      }
      return null;
    }
  };
});
