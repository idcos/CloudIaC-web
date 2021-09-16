import CodeMirror from 'codemirror';
import './style.css';

CodeMirror.defineMode('errorText', function() {
  return {
    token: function(stream) {
      stream.next();
      return 'error-text';
    }
  };
});
